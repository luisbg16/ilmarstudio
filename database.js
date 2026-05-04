/* ═══════════════════════════════════════════════════════════════════
   ILMAR STUDIO — Database Layer (MongoDB Atlas)
   ═══════════════════════════════════════════════════════════════════ */

const { MongoClient, ObjectId } = require('mongodb');

let _client = null;
let _db     = null;

// ─── ID helper ───────────────────────────────────────────────────────
// Converts a string to ObjectId if it looks like one (24 hex chars),
// otherwise keeps it as a plain string (for slug-based IDs like 'nails-acrylic')
function toId(id) {
  if (!id) return null;
  if (/^[0-9a-fA-F]{24}$/.test(String(id))) {
    try { return new ObjectId(id); } catch { /* fall through */ }
  }
  return id;
}

// ─── Connect ─────────────────────────────────────────────────────────
async function connect() {
  if (_db) return _db;

  _client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });

  await _client.connect();
  _db = _client.db(process.env.MONGODB_DB || 'ilmarstudio');

  await createIndexes(_db);
  await seedIfEmpty(_db);

  console.log('  ✅  MongoDB conectado —', _db.databaseName);
  return _db;
}

// ─── Collection accessor ─────────────────────────────────────────────
function col(name) {
  if (!_db) throw new Error('Base de datos no conectada. Llama connect() primero.');
  return _db.collection(name);
}

// ─── Indexes ─────────────────────────────────────────────────────────
async function createIndexes(db) {
  await db.collection('bookings').createIndex({ booking_date: 1, booking_time: 1 });
  await db.collection('bookings').createIndex({ reference: 1 }, { unique: true });
  await db.collection('bookings').createIndex({ status: 1 });
  await db.collection('gallery').createIndex({ sort_order: 1 });
  await db.collection('gallery').createIndex({ active: 1 });
  await db.collection('settings').createIndex({ key: 1 }, { unique: true });
  await db.collection('services').createIndex({ order: 1 });
  await db.collection('blocked_times').createIndex({ block_date: 1 });
}

// ─── Seed Data ───────────────────────────────────────────────────────
const INITIAL_SERVICES = [
  {
    _id: 'nails-acrylic',
    slug: 'nails-acrylic',
    name_en: 'Acrylic & Polygel Nails',
    name_es: 'Uñas Acrílicas y Poligel',
    description_en: 'Acrylic and polygel nail sets for a flawless, long-lasting finish. Custom shapes and designs tailored to your style.',
    description_es: 'Juego de uñas acrílicas y poligel para un acabado impecable y duradero. Formas y diseños personalizados según tu estilo.',
    price_from: 45, duration_minutes: 90, category: 'nails', icon: '💅', active: true, order: 1
  },
  {
    _id: 'nails-semipermanent',
    slug: 'nails-semipermanent',
    name_en: 'Semi-permanent & Pedicure',
    name_es: 'Semipermanente y Pedicura',
    description_en: 'Long-lasting gel polish and full pedicure service. Beautiful, chip-free color that holds up to your lifestyle.',
    description_es: 'Esmaltado semipermanente duradero y pedicura completa. Color hermoso y resistente que se adapta a tu ritmo de vida.',
    price_from: 30, duration_minutes: 75, category: 'nails', icon: '✨', active: true, order: 2
  },
  {
    _id: 'hair-color',
    slug: 'hair-color',
    name_en: 'Hair Color & Treatments',
    name_es: 'Tintes y Tratamientos',
    description_en: 'Full hair coloring, keratin smoothing, straightening, and curl services using premium products.',
    description_es: 'Coloración completa, alisado con keratina, planchado y rizos con productos premium.',
    price_from: 60, duration_minutes: 120, category: 'hair', icon: '🌙', active: true, order: 3
  },
  {
    _id: 'brows-lashes',
    slug: 'brows-lashes',
    name_en: 'Brows & Lashes',
    name_es: 'Cejas y Pestañas',
    description_en: 'Brow lamination, henna, eyebrow design, and lash services.',
    description_es: 'Laminado de cejas, henna, diseño de cejas y servicios de pestañas.',
    price_from: 35, duration_minutes: 60, category: 'beauty', icon: '⭐', active: true, order: 4
  },
  {
    _id: 'makeup-events',
    slug: 'makeup-events',
    name_en: 'Makeup & Event Styling',
    name_es: 'Maquillaje y Peinados',
    description_en: 'Professional makeup and updo styling for events and special occasions.',
    description_es: 'Maquillaje profesional y peinados para eventos y ocasiones especiales.',
    price_from: 55, duration_minutes: 90, category: 'beauty', icon: '💄', active: true, order: 5
  },
  {
    _id: 'micropigmentation',
    slug: 'micropigmentation',
    name_en: 'Micropigmentation & Waxing',
    name_es: 'Micropigmentación y Depilación',
    description_en: 'Eyebrow micropigmentation, lip color hydration, and waxing services.',
    description_es: 'Micropigmentación de cejas, hidratación con color en labios y depilación con cera.',
    price_from: 80, duration_minutes: 120, category: 'beauty', icon: '🌸', active: true, order: 6
  }
];

const INITIAL_GALLERY = [
  { filename: 'galeria/galeria_1.jpg', caption_en: 'Always learning, always growing',  caption_es: 'Formación continua, siempre mejorando', category: 'nails', sort_order: 1, active: true },
  { filename: 'galeria/galeria_2.jpg', caption_en: 'Floral nail art',   caption_es: 'Arte floral en uñas',            category: 'nails', sort_order: 2, active: true },
  { filename: 'galeria/galeria_3.jpg', caption_en: 'Fun nail art',      caption_es: 'Nail art divertido',             category: 'nails', sort_order: 3, active: true },
  { filename: 'galeria/galeria_4.jpg', caption_en: 'Tropical nail art', caption_es: 'Arte tropical en uñas',          category: 'nails', sort_order: 4, active: true },
  { filename: 'galeria/galeria_5.jpg', caption_en: 'Yellow nail art',   caption_es: 'Uñas amarillas con detalle',     category: 'nails', sort_order: 5, active: true },
  { filename: 'galeria/galeria_6.jpg', caption_en: 'Crystal nail art',  caption_es: 'Uñas con cristales',             category: 'nails', sort_order: 6, active: true },
  { filename: 'galeria/galeria_7.jpg', caption_en: 'Pearl nail art',    caption_es: 'Uñas nacaradas',                 category: 'nails', sort_order: 7, active: true },
];

const DEFAULT_SETTINGS = {
  salon_name:           'ILMAR STUDIO',
  salon_phone:          '+1 (703) 000-0000',
  salon_email:          'hello@ilmarstudio.com',
  salon_address:        '5510 Ascot Ct, Alexandria, VA 22311',
  salon_instagram:      '@ilmarstudio',
  salon_whatsapp:       '+1 (703) 000-0000',
  booking_interval:     '30',
  advance_booking_days: '7',
  footer_tagline:       '"Belleza, conciencia, cuidado y bienestar — cada visita, cada detalle, pensado para ti."',
  business_hours: JSON.stringify({
    monday:    { open: '07:00', close: '21:00', closed: false },
    tuesday:   { open: '07:00', close: '21:00', closed: false },
    wednesday: { open: '07:00', close: '21:00', closed: false },
    thursday:  { open: '07:00', close: '21:00', closed: false },
    friday:    { open: '07:00', close: '21:00', closed: false },
    saturday:  { open: '07:00', close: '21:00', closed: false },
    sunday:    { open: '07:00', close: '21:00', closed: false }
  })
};

async function seedIfEmpty(db) {
  // Services — upsert by slug _id
  for (const svc of INITIAL_SERVICES) {
    await db.collection('services').updateOne(
      { _id: svc._id },
      { $setOnInsert: svc },
      { upsert: true }
    );
  }

  // Gallery — seed once if empty
  const galleryCount = await db.collection('gallery').countDocuments({});
  if (galleryCount === 0) {
    const now = new Date().toISOString();
    await db.collection('gallery').insertMany(
      INITIAL_GALLERY.map(g => ({ ...g, created_at: now }))
    );
  }

  // Settings — upsert each key (never overwrites existing values)
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.collection('settings').updateOne(
      { key },
      { $setOnInsert: { key, value } },
      { upsert: true }
    );
  }
}

module.exports = { connect, col, toId, ObjectId };
