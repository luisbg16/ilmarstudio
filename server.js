require('dotenv').config();
const express = require('express');
const path    = require('path');
const multer  = require('multer');
const jwt     = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { connect, col, toId } = require('./database');

// ─── Validación de variables de entorno ──────────────────────────────────────
const REQUIRED_ENV = ['JWT_SECRET', 'ADMIN_PASSWORD', 'MONGODB_URI'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n❌  FALTAN VARIABLES DE ENTORNO: ${missing.join(', ')}`);
  console.error('   Crea un archivo .env copiando .env.example y completa los valores.\n');
  process.exit(1);
}

const app          = express();
const PORT         = process.env.PORT || 3000;
const JWT_SECRET   = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BASE_URL     = process.env.BASE_URL || `http://localhost:${PORT}`;

// Stripe — solo si está configurado
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' }
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  standardHeaders: true, legacyHeaders: false
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

// ─── File Upload ──────────────────────────────────────────────────────────────
const GALERIA_DIR = path.join(__dirname, 'public/uploads/galeria');
if (!require('fs').existsSync(GALERIA_DIR)) require('fs').mkdirSync(GALERIA_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, GALERIA_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `galeria_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Solo imágenes permitidas'))
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return 'IL-' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateTimeSlots(openTime, closeTime, intervalMin) {
  const slots = [];
  const [oh, om] = openTime.split(':').map(Number);
  const [ch, cm] = closeTime.split(':').map(Number);
  let current = oh * 60 + om;
  const end    = ch * 60 + cm;
  while (current < end) {
    slots.push(`${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`);
    current += intervalMin;
  }
  return slots;
}

function today() { return new Date().toISOString().split('T')[0]; }

// ─── Normalize IDs in API responses ──────────────────────────────────────────
function withId(doc) {
  if (!doc) return doc;
  return { ...doc, id: String(doc._id) };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/services
app.get('/api/services', async (req, res) => {
  try {
    const services = await col('services').find({ active: true }).sort({ order: 1 }).toArray();
    res.json(services.map(withId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const items = await col('gallery').find({ active: true }).sort({ sort_order: 1, created_at: -1 }).toArray();
    res.json(items.map(withId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/available-slots?date=YYYY-MM-DD
app.get('/api/available-slots', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Missing date parameter' });

  const dateObj = new Date(date + 'T00:00:00');
  const days    = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const dayName = days[dateObj.getDay()];

  const DEFAULT_HOURS = {
    monday:    { open: '07:00', close: '21:00', closed: false },
    tuesday:   { open: '07:00', close: '21:00', closed: false },
    wednesday: { open: '07:00', close: '21:00', closed: false },
    thursday:  { open: '07:00', close: '21:00', closed: false },
    friday:    { open: '07:00', close: '21:00', closed: false },
    saturday:  { open: '07:00', close: '21:00', closed: false },
    sunday:    { open: '07:00', close: '21:00', closed: false }
  };

  try {
    const hoursSetting    = await col('settings').findOne({ key: 'business_hours' });
    const intervalSetting = await col('settings').findOne({ key: 'booking_interval' });

    let hours;
    try { hours = JSON.parse(hoursSetting?.value || 'null') || DEFAULT_HOURS; }
    catch { hours = DEFAULT_HOURS; }

    const dayHours = hours[dayName] || DEFAULT_HOURS[dayName];
    if (!dayHours || dayHours.closed) return res.json({ slots: [], message: 'Closed' });

    const interval = parseInt(intervalSetting?.value || '30');
    const allSlots = generateTimeSlots(dayHours.open, dayHours.close, interval);

    const booked  = await col('bookings').find({ booking_date: date, status: { $nin: ['cancelled', 'no_show'] } }).toArray();
    const blocked = await col('blocked_times').find({ block_date: date }).toArray();

    const bookedTimes  = booked.map(b => b.booking_time);
    const isAllDay     = blocked.some(b => b.all_day);
    if (isAllDay) return res.json({ slots: [], message: 'Unavailable' });
    const blockedTimes = blocked.map(b => b.block_time).filter(Boolean);

    const available = allSlots.filter(s => !bookedTimes.includes(s) && !blockedTimes.includes(s));
    res.json({ slots: available });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/bookings — reserva directa (sin pago)
app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, service_ids, booking_date, booking_time, notes, language } = req.body;
  const rawIds = service_ids || [];
  if (!name || !email || !phone || !rawIds.length || !booking_date || !booking_time)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  const lang = language || 'es';
  try {
    const services  = await Promise.all(rawIds.map(id => col('services').findOne({ _id: toId(id), active: true })));
    const validSvcs = services.filter(Boolean);
    if (!validSvcs.length) return res.status(404).json({ error: 'Servicio no encontrado' });

    const conflict = await col('bookings').findOne({
      booking_date, booking_time,
      status: { $nin: ['cancelled', 'no_show'] }
    });
    if (conflict) return res.status(409).json({ error: 'El horario ya no está disponible' });

    const reference      = generateReference();
    const serviceNamesEn = validSvcs.map(s => s.name_en).join(', ');
    const serviceNamesEs = validSvcs.map(s => s.name_es).join(', ');

    await col('bookings').insertOne({
      reference,
      client_name:      name,
      client_email:     email,
      client_phone:     phone,
      service_id:       rawIds[0],
      service_ids:      rawIds,
      service_name_en:  serviceNamesEn,
      service_name_es:  serviceNamesEs,
      booking_date,
      booking_time,
      notes:            notes || '',
      status:           'pending',
      payment_status:   'not_required',
      stripe_session_id:     null,
      stripe_payment_intent: null,
      amount_paid:      0,
      language:         lang,
      created_at:       new Date().toISOString()
    });
    res.json({ reference });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: err.message || 'Error al crear reserva' });
  }
});

// POST /api/checkout — reserva con pago Stripe (opcional)
app.post('/api/checkout', async (req, res) => {
  const { name, email, phone, service_ids, booking_date, booking_time, notes, language, pay_method } = req.body;
  const rawIds   = service_ids || (req.body.service_id ? [req.body.service_id] : []);
  if (!name || !email || !phone || !rawIds.length || !booking_date || !booking_time)
    return res.status(400).json({ error: 'Faltan campos requeridos' });

  const lang      = language || 'es';
  const payMethod = pay_method === 'in_person' ? 'in_person' : 'online';

  try {
    const services  = await Promise.all(rawIds.map(id => col('services').findOne({ _id: toId(id), active: true })));
    const validSvcs = services.filter(Boolean);
    if (!validSvcs.length) return res.status(404).json({ error: 'Servicio no encontrado' });

    const conflict = await col('bookings').findOne({
      booking_date, booking_time,
      status: { $nin: ['cancelled', 'no_show'] }
    });
    if (conflict) return res.status(409).json({ error: 'El horario ya no está disponible' });

    const reference      = generateReference();
    const totalAmount    = validSvcs.reduce((acc, s) => acc + (parseFloat(s.price_from) || 0), 0);
    const serviceNamesEn = validSvcs.map(s => s.name_en).join(', ');
    const serviceNamesEs = validSvcs.map(s => s.name_es).join(', ');

    if (payMethod === 'in_person') {
      await col('bookings').insertOne({
        reference, client_name: name, client_email: email, client_phone: phone,
        service_id: rawIds[0], service_ids: rawIds,
        service_name_en: serviceNamesEn, service_name_es: serviceNamesEs,
        booking_date, booking_time, notes: notes || '',
        status: 'pending', payment_status: 'pending_inperson',
        stripe_session_id: null, stripe_payment_intent: null,
        amount_paid: totalAmount, language: lang,
        created_at: new Date().toISOString()
      });
      return res.json({ reference, pay_method: 'in_person' });
    }

    if (!stripe) return res.status(503).json({ error: 'Pagos online no configurados' });

    const displayName = lang === 'es' ? serviceNamesEs : serviceNamesEn;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `ILMAR STUDIO — ${displayName}`,
            description: `${booking_date} · ${booking_time} | Ref: ${reference}`,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      success_url: `${BASE_URL}/booking-success?ref=${reference}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE_URL}/?booking=cancelled`,
      metadata:    { reference, booking_date, booking_time, notes: notes || '', language: lang },
    });

    await col('bookings').insertOne({
      reference, client_name: name, client_email: email, client_phone: phone,
      service_id: rawIds[0], service_ids: rawIds,
      service_name_en: serviceNamesEn, service_name_es: serviceNamesEs,
      booking_date, booking_time, notes: notes || '',
      status: 'pending', payment_status: 'unpaid',
      stripe_session_id: session.id, stripe_payment_intent: null,
      amount_paid: totalAmount, language: lang,
      created_at: new Date().toISOString()
    });

    res.json({ url: session.url, reference });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message || 'Error al iniciar pago' });
  }
});

// GET /api/booking/:reference
app.get('/api/booking/:reference', async (req, res) => {
  try {
    const booking = await col('bookings').findOne({ reference: req.params.reference });
    if (!booking) return res.status(404).json({ error: 'Reserva no encontrada' });
    const service = await col('services').findOne({ _id: toId(booking.service_id) });
    res.json(withId({ ...booking, name_en: service?.name_en, name_es: service?.name_es }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/stripe/webhook
app.post('/api/stripe/webhook', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe no configurado' });
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      await col('bookings').updateOne(
        { stripe_session_id: session.id },
        { $set: { status: 'confirmed', payment_status: 'paid', stripe_payment_intent: session.payment_intent } }
      );
    }
  }
  res.json({ received: true });
});

// GET /api/settings — público (footer, contacto)
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await col('settings').find({}).toArray();
    res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/admin/login  (rate limited: 10 intentos / 15 min por IP)
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, expiresIn: '12h' });
});

// GET /api/admin/dashboard
app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const allBookings = await col('bookings').find({}).toArray();
    const allGallery  = await col('gallery').find({ active: true }).toArray();
    const todayStr    = today();
    const completed   = allBookings.filter(b => b.status === 'completed');

    res.json({
      total:         allBookings.length,
      pending:       allBookings.filter(b => b.status === 'pending').length,
      confirmed:     allBookings.filter(b => b.status === 'confirmed').length,
      cancelled:     allBookings.filter(b => b.status === 'cancelled').length,
      completed:     completed.length,
      revenue:       completed.reduce((s, b) => s + (b.amount_paid || 0), 0),
      total_minutes: completed.reduce((s, b) => s + (b.duration_minutes || 0), 0),
      today:         allBookings.filter(b => b.booking_date === todayStr && ['confirmed','pending'].includes(b.status)).length,
      upcoming:      allBookings.filter(b => b.booking_date >= todayStr && b.status === 'confirmed').length,
      gallery_count: allGallery.length
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/bookings
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (date) query.booking_date = date;

    let bookings = await col('bookings').find(query).sort({ booking_date: -1, booking_time: -1 }).toArray();

    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter(b =>
        b.client_name?.toLowerCase().includes(s) ||
        b.client_email?.toLowerCase().includes(s) ||
        b.reference?.toLowerCase().includes(s)
      );
    }

    const allSvcs = await col('services').find({}).toArray();
    const svcMap  = Object.fromEntries(allSvcs.map(s => [String(s._id), s]));
    const enriched = bookings.map(b => ({
      ...withId(b),
      service_name_en: b.service_name_en || svcMap[String(b.service_id)]?.name_en || '—',
      service_name_es: b.service_name_es || svcMap[String(b.service_id)]?.name_es || '—',
      price_from:      svcMap[String(b.service_id)]?.price_from || b.amount_paid || 0
    }));

    res.json(enriched);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/bookings/:id
app.put('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  const { status, notes, amount_paid, duration_minutes } = req.body;
  const allowed = ['pending','confirmed','cancelled','completed','no_show'];
  if (status && !allowed.includes(status)) return res.status(400).json({ error: 'Estado inválido' });
  try {
    const update = {};
    if (status             !== undefined) update.status            = status;
    if (notes              !== undefined) update.notes             = notes;
    if (amount_paid        !== undefined) update.amount_paid       = parseFloat(amount_paid) || 0;
    if (duration_minutes   !== undefined) update.duration_minutes  = parseInt(duration_minutes, 10) || null;
    if (status === 'completed')           update.completed_at      = new Date().toISOString();
    if (!Object.keys(update).length) return res.status(400).json({ error: 'Nada que actualizar' });

    await col('bookings').updateOne({ _id: toId(req.params.id) }, { $set: update });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/gallery
app.get('/api/admin/gallery', requireAdmin, async (req, res) => {
  try {
    const items = await col('gallery').find({}).sort({ sort_order: 1, created_at: -1 }).toArray();
    res.json(items.map(withId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/gallery
app.post('/api/admin/gallery', requireAdmin, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });
  try {
    const { caption_en, caption_es, category } = req.body;
    const count = await col('gallery').countDocuments({});
    const storedFilename = `galeria/${req.file.filename}`;
    const result = await col('gallery').insertOne({
      filename:   storedFilename,
      caption_en: caption_en || '',
      caption_es: caption_es || '',
      category:   category || 'general',
      sort_order: count + 1,
      active:     true,
      created_at: new Date().toISOString()
    });
    res.json({ id: String(result.insertedId), filename: storedFilename });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/gallery/:id
app.put('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
  try {
    const { caption_en, caption_es, category, sort_order, active } = req.body;
    const update = {};
    if (caption_en !== undefined) update.caption_en = caption_en;
    if (caption_es !== undefined) update.caption_es = caption_es;
    if (category   !== undefined) update.category   = category;
    if (sort_order !== undefined) update.sort_order = Number(sort_order);
    if (active     !== undefined) update.active     = active;
    await col('gallery').updateOne({ _id: toId(req.params.id) }, { $set: update });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/gallery/:id
app.delete('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
  try {
    await col('gallery').updateOne({ _id: toId(req.params.id) }, { $set: { active: false } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/settings
app.get('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const rows = await col('settings').find({}).toArray();
    res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/settings
app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await col('settings').updateOne(
        { key },
        { $set: { value: String(value) } },
        { upsert: true }
      );
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/block-time
app.post('/api/admin/block-time', requireAdmin, async (req, res) => {
  try {
    const { date, time, reason, all_day } = req.body;
    await col('blocked_times').insertOne({
      block_date: date,
      block_time: time || null,
      reason:     reason || '',
      all_day:    !!all_day,
      created_at: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/services
app.get('/api/admin/services', requireAdmin, async (req, res) => {
  try {
    const services = await col('services').find({}).sort({ order: 1 }).toArray();
    res.json(services.map(withId));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/services
app.post('/api/admin/services', requireAdmin, async (req, res) => {
  try {
    const { name_en, name_es, description_en, description_es, price_from, duration_minutes, category, icon } = req.body;
    if (!name_en || !name_es) return res.status(400).json({ error: 'Nombre requerido en ambos idiomas' });

    const allSvcs  = await col('services').find({}).sort({ order: -1 }).toArray();
    const maxOrder = allSvcs[0]?.order || 0;
    const slug     = name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const docData  = {
      slug,
      name_en:          name_en.trim(),
      name_es:          name_es.trim(),
      description_en:   (description_en || '').trim(),
      description_es:   (description_es || '').trim(),
      price_from:       parseFloat(price_from) || 0,
      duration_minutes: parseInt(duration_minutes) || 60,
      category:         category || 'general',
      icon:             icon || '✦',
      active:           true,
      order:            maxOrder + 1,
      created_at:       new Date().toISOString()
    };
    const result = await col('services').insertOne(docData);
    res.json({ ...docData, _id: result.insertedId, id: String(result.insertedId) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/services/:id
app.put('/api/admin/services/:id', requireAdmin, async (req, res) => {
  try {
    const { name_en, name_es, description_en, description_es, price_from, duration_minutes, category, icon, active, order } = req.body;
    const update = {};
    if (name_en          !== undefined) update.name_en          = name_en.trim();
    if (name_es          !== undefined) update.name_es          = name_es.trim();
    if (description_en   !== undefined) update.description_en   = description_en.trim();
    if (description_es   !== undefined) update.description_es   = description_es.trim();
    if (price_from       !== undefined) update.price_from       = parseFloat(price_from);
    if (duration_minutes !== undefined) update.duration_minutes = parseInt(duration_minutes);
    if (category         !== undefined) update.category         = category;
    if (icon             !== undefined) update.icon             = icon;
    if (active           !== undefined) update.active           = Boolean(active);
    if (order            !== undefined) update.order            = parseInt(order);
    if (!Object.keys(update).length) return res.status(400).json({ error: 'Nada que actualizar' });

    await col('services').updateOne({ _id: toId(req.params.id) }, { $set: update });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/services/:id
app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
  try {
    await col('services').deleteOne({ _id: toId(req.params.id) });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Page Routes ──────────────────────────────────────────────────────────────
app.get('/',                (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin',           (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));
app.get('/booking-success', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// ─── Start — esperar conexión a MongoDB antes de abrir el puerto ──────────────
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
  ╔═════════════════════════════════════╗
  ║    ILMAR STUDIO — Server Ready     ║
  ║    http://localhost:${PORT}            ║
  ╚═════════════════════════════════════╝
      `);
    });
  })
  .catch(err => {
    console.error('\n❌  Error al conectar con MongoDB:', err.message);
    console.error('   Verifica que MONGODB_URI en tu .env es correcto.\n');
    process.exit(1);
  });
