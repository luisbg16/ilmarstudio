/* ═══════════════════════════════════════════════════════════════════
   ILMAR STUDIO — Admin Panel Logic
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

// ─── Admin i18n ───────────────────────────────────────────────────
const ADMIN_LANG = {
  es: {
    nav: { dashboard:'Panel', bookings:'Reservaciones', gallery:'Galería', services:'Servicios', content:'Contenido', settings:'Ajustes', view_site:'Ver Sitio', logout:'Cerrar Sesión' },
    dash: { revenue:'Ingresos Totales', today:'Citas Hoy', upcoming:'Próximas Confirmadas', pending:'Pendientes', total:'Total Reservas', gallery:'Fotos en Galería', recent:'Reservas Recientes', view_all:'Ver todas →' },
    book: { ref:'Referencia', client:'Cliente', service:'Servicio', datetime:'Fecha & Hora', amount:'Monto', status:'Estado', payment:'Pago', actions:'Acciones', view:'Ver', search:'Buscar por nombre, email, referencia…', all_status:'Todos los estados', pending:'Pendiente', confirmed:'Confirmada', completed:'Completada', cancelled:'Cancelada', no_show:'No se presentó', refresh:'↻ Actualizar', loading:'Cargando…', empty:'No se encontraron reservas.', error:'Error cargando reservas.' },
    gallery_panel: { upload_title:'Subir Nueva Foto', click_hint:'Clic o arrastra fotos aquí', size_hint:'JPG, PNG, WEBP — máx. 10MB', caption_en:'Pie de foto (English)', caption_es:'Pie de foto (Español)', category:'Categoría', upload_btn:'Subir Fotos', refresh:'↻ Actualizar', photos:'Fotos en Galería', no_photos:'Aún no hay fotos. ¡Sube la primera! 📷', delete:'Eliminar' },
    services_panel: { hint:'Administra los servicios que aparecen en el sitio y en el sistema de reservas.', add:'＋ Nuevo Servicio', refresh:'↻ Actualizar', order:'#', name:'Nombre ES / EN', desc:'Descripción', price:'Precio', duration:'Duración', category:'Categoría', status:'Estado', actions:'Acciones', edit:'Editar', empty:'No hay servicios. ¡Agrega el primero!', error:'Error cargando servicios.', active:'Activo', inactive:'Inactivo' },
    content_panel: { contact_title:'📍 Información de Contacto', salon_name:'Nombre del Salón', phone:'Teléfono', email:'Correo Electrónico', instagram:'Instagram', address:'Dirección / Ciudad', tagline:'Tagline del Footer', save_contact:'Guardar Contacto', saved:'✓ Guardado', hours_title:'🕐 Horarios de Atención', day:'Día', open:'Apertura', close:'Cierre', closed:'Cerrado', save_hours:'Guardar Horarios', footer_svc_title:'📋 Servicios en el Footer', footer_svc_note:'Se actualizan automáticamente desde los servicios activos.', footer_svc_info:'Los servicios del footer se toman directamente de la base de datos. Para agregar o quitar servicios del footer, actívalos o desactívalos en la sección de servicios.' },
    settings_panel: { title:'Información del Salón', salon_name:'Nombre del Salón', phone:'Teléfono', email:'Correo', instagram:'Instagram', address:'Dirección', interval:'Intervalo de Reserva (min)', advance:'Anticip. máximo (días)', save:'Guardar Ajustes', saved:'✓ Guardado', security_title:'Seguridad', security_note:'Para cambiar la contraseña de admin, actualiza el valor ADMIN_PASSWORD en tu archivo .env y reinicia el servidor.', security_info:'La contraseña actual está almacenada en tu archivo de configuración de entorno.' },
    modal: { booking_details:'Detalles de Reserva', client:'Nombre del Cliente', email:'Correo', phone:'Teléfono', service:'Servicio', date:'Fecha', time:'Hora', amount:'Monto', status:'Estado', payment:'Pago', notes:'Notas', language:'Idioma', booked_on:'Reservado el', update_status:'Actualizar Estado', confirm:'Confirmar', complete:'Marcar Completada', cancel:'Cancelar', no_show:'No se Presentó', close:'Cerrar' },
    svc_modal: { new:'Nuevo Servicio', edit:'Editar Servicio', name_es:'Nombre en Español', name_en:'Nombre en English', desc_es:'Descripción en Español', desc_en:'Description in English', price:'Precio Desde (USD)', duration:'Duración (minutos)', category:'Categoría', icon:'Ícono (emoji)', active:'Servicio activo (visible en el sitio)', save:'Guardar Servicio', cancel:'Cancelar', delete:'Eliminar Servicio', confirm_delete:'¿Eliminar el servicio? Esta acción no se puede deshacer.' },
    status: { pending:'Pendiente', confirmed:'Confirmada', completed:'Completada', cancelled:'Cancelada', no_show:'No se presentó', paid:'Pagado', unpaid:'Sin pagar', pending_inperson:'Pendiente (pago presencial)' }
  },
  en: {
    nav: { dashboard:'Dashboard', bookings:'Reservations', gallery:'Gallery', services:'Services', content:'Content', settings:'Settings', view_site:'View Site', logout:'Sign Out' },
    dash: { revenue:'Total Revenue', today:"Today's Appointments", upcoming:'Upcoming Confirmed', pending:'Pending Review', total:'Total Bookings', gallery:'Gallery Photos', recent:'Recent Reservations', view_all:'View All →' },
    book: { ref:'Reference', client:'Client', service:'Service', datetime:'Date & Time', amount:'Amount', status:'Status', payment:'Payment', actions:'Actions', view:'View', search:'Search by name, email, reference…', all_status:'All Status', pending:'Pending', confirmed:'Confirmed', completed:'Completed', cancelled:'Cancelled', no_show:'No Show', refresh:'↻ Refresh', loading:'Loading…', empty:'No bookings found.', error:'Error loading bookings.' },
    gallery_panel: { upload_title:'Upload New Photo', click_hint:'Click or drag & drop photos', size_hint:'JPG, PNG, WEBP — max 10MB', caption_en:'Caption (English)', caption_es:'Caption (Español)', category:'Category', upload_btn:'Upload Photos', refresh:'↻ Refresh', photos:'Gallery Photos', no_photos:'No photos yet. Upload your first! 📷', delete:'Delete' },
    services_panel: { hint:'Manage the services shown on the site and in the booking system.', add:'＋ New Service', refresh:'↻ Refresh', order:'#', name:'Name ES / EN', desc:'Description', price:'Price', duration:'Duration', category:'Category', status:'Status', actions:'Actions', edit:'Edit', empty:'No services yet.', error:'Error loading services.', active:'Active', inactive:'Inactive' },
    content_panel: { contact_title:'📍 Contact Information', salon_name:'Salon Name', phone:'Phone', email:'Email', instagram:'Instagram', address:'Address / City', tagline:'Footer Tagline', save_contact:'Save Contact', saved:'✓ Saved', hours_title:'🕐 Business Hours', day:'Day', open:'Open', close:'Close', closed:'Closed', save_hours:'Save Hours', footer_svc_title:'📋 Services in Footer', footer_svc_note:'Updated automatically from active services.', footer_svc_info:'Footer services are pulled from the database. To add or remove services from the footer, activate or deactivate them in the services section.' },
    settings_panel: { title:'Salon Information', salon_name:'Salon Name', phone:'Phone Number', email:'Email', instagram:'Instagram', address:'Address', interval:'Booking Interval (min)', advance:'Advance Booking (days)', save:'Save Settings', saved:'✓ Saved', security_title:'Security', security_note:'To change your admin password, update the ADMIN_PASSWORD value in your .env file and restart the server.', security_info:'Current password is stored in your environment configuration file.' },
    modal: { booking_details:'Booking Details', client:'Client Name', email:'Email', phone:'Phone', service:'Service', date:'Date', time:'Time', amount:'Amount', status:'Status', payment:'Payment', notes:'Notes', language:'Language', booked_on:'Booked On', update_status:'Update Status', confirm:'Confirm', complete:'Mark Completed', cancel:'Cancel', no_show:'No Show', close:'Close' },
    svc_modal: { new:'New Service', edit:'Edit Service', name_es:'Name in Spanish', name_en:'Name in English', desc_es:'Description in Spanish', desc_en:'Description in English', price:'Price From (USD)', duration:'Duration (minutes)', category:'Category', icon:'Icon (emoji)', active:'Service active (visible on site)', save:'Save Service', cancel:'Cancel', delete:'Delete Service', confirm_delete:'Delete this service? This cannot be undone.' },
    status: { pending:'Pending', confirmed:'Confirmed', completed:'Completed', cancelled:'Cancelled', no_show:'No Show', paid:'Paid', unpaid:'Unpaid', pending_inperson:'Pending (pay at salon)' }
  }
};

let adminLang = localStorage.getItem('ilmar_admin_lang') || 'es';

function at(key) {
  const keys = key.split('.');
  let val = ADMIN_LANG[adminLang];
  for (const k of keys) { val = val?.[k]; }
  return val || key;
}

function applyAdminTranslations() {
  document.querySelectorAll('.admin-t[data-k]').forEach(el => {
    const text = at(el.getAttribute('data-k'));
    if (text) el.textContent = text;
  });
  // Update lang button styles
  document.getElementById('admin-lang-es').style.background = adminLang === 'es' ? 'var(--gold)' : 'transparent';
  document.getElementById('admin-lang-es').style.color      = adminLang === 'es' ? '#111' : 'var(--ag)';
  document.getElementById('admin-lang-en').style.background = adminLang === 'en' ? 'var(--gold)' : 'transparent';
  document.getElementById('admin-lang-en').style.color      = adminLang === 'en' ? '#111' : 'var(--ag)';
}

function setAdminLang(lang) {
  adminLang = lang;
  localStorage.setItem('ilmar_admin_lang', lang);
  applyAdminTranslations();
  // Re-render active panels
  const activePanel = document.querySelector('.panel.active');
  if (activePanel) {
    const name = activePanel.id.replace('panel-', '');
    if (name === 'dashboard') loadDashboard();
    if (name === 'bookings')  loadBookings();
    if (name === 'services')  loadAdminServices();
    if (name === 'gallery')   loadAdminGallery();
  }
}

let authToken = sessionStorage.getItem('ilmar_admin_token') || null;
let allBookings = [];
let pendingFiles = [];

// ─── Auth ─────────────────────────────────────────────────────────────────────
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-app').style.display = 'flex';
  const locale = adminLang === 'es' ? 'es-US' : 'en-US';
  document.getElementById('topbar-date').textContent = new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
  applyAdminTranslations();
  loadDashboard();
}

function logout() {
  sessionStorage.removeItem('ilmar_admin_token');
  authToken = null;
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-password').value = '';
}

async function doLogin(e) {
  e.preventDefault();
  const pw = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  const errDiv = document.getElementById('login-error');
  btn.disabled = true;
  document.getElementById('login-text').style.display = 'none';
  document.getElementById('login-spinner').style.display = 'inline-block';
  errDiv.style.display = 'none';
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    authToken = data.token;
    sessionStorage.setItem('ilmar_admin_token', authToken);
    showApp();
  } catch {
    errDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    document.getElementById('login-text').style.display = 'inline';
    document.getElementById('login-spinner').style.display = 'none';
  }
}

function authHeader() {
  return { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' };
}

async function apiFetch(url, options = {}) {
  if (!options.headers) options.headers = {};
  options.headers['Authorization'] = `Bearer ${authToken}`;
  // Asegurar Content-Type cuando se envía JSON
  if (options.body && typeof options.body === 'string' && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, options);
  if (res.status === 401) { logout(); throw new Error('Session expired'); }
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const data = await res.json(); msg = data.error || msg; } catch {}
    throw new Error(msg);
  }
  return res;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
const panelTitlesES = { dashboard:'Panel', bookings:'Reservaciones', services:'Servicios', gallery:'Galería', content:'Contenido del Sitio', settings:'Ajustes' };
const panelTitlesEN = { dashboard:'Dashboard', bookings:'Reservations', services:'Services', gallery:'Gallery', content:'Site Content', settings:'Settings' };
function panelTitle(name) { return (adminLang === 'en' ? panelTitlesEN : panelTitlesES)[name] || name; }

function showPanel(name, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`panel-${name}`).classList.add('active');
  if (btn) btn.classList.add('active');
  else document.querySelector(`[data-panel="${name}"]`)?.classList.add('active');
  document.getElementById('topbar-title').textContent = panelTitle(name);
  // Load data for panel
  if (name === 'dashboard') loadDashboard();
  if (name === 'bookings')  loadBookings();
  if (name === 'services')  loadAdminServices();
  if (name === 'gallery')   loadAdminGallery();
  if (name === 'content')   loadContent();
  if (name === 'settings')  loadSettings();
  // Close sidebar on mobile
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
async function loadDashboard() {
  try {
    const res = await apiFetch('/api/admin/dashboard');
    const stats = await res.json();

    // Ingresos — formato moneda
    document.getElementById('st-revenue').textContent  = `$${(stats.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

    document.getElementById('st-today').textContent    = stats.today;
    document.getElementById('st-upcoming').textContent = stats.upcoming;
    document.getElementById('st-pending').textContent  = stats.pending;
    document.getElementById('st-total').textContent    = stats.total;
    document.getElementById('st-gallery').textContent  = stats.gallery_count;
    document.getElementById('st-completed').textContent = stats.completed || 0;

    // Horas trabajadas — convierte minutos a h:mm
    const mins = stats.total_minutes || 0;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    document.getElementById('st-hours').textContent = m > 0 ? `${h}h ${m}m` : `${h}h`;

    // Badge de pendientes en sidebar
    const badge = document.getElementById('pending-badge');
    if (stats.pending > 0) { badge.textContent = stats.pending; badge.style.display = 'inline-block'; }
    else { badge.style.display = 'none'; }

    loadRecentBookings();
  } catch (err) { console.error(err); }
}

async function loadRecentBookings() {
  const container = document.getElementById('recent-bookings-table');
  try {
    const res = await apiFetch('/api/admin/bookings?status=all');
    const bookings = (await res.json()).slice(0, 10);
    if (!bookings.length) { container.innerHTML = '<div class="empty-state">No bookings yet.</div>'; return; }
    container.innerHTML = renderBookingsTable(bookings);
  } catch (err) { container.innerHTML = '<div class="empty-state">Failed to load bookings.</div>'; }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
async function loadBookings() {
  const tbody = document.getElementById('bookings-tbody');
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--ag);"><div class="spinner" style="margin:0 auto;"></div></td></tr>';
  try {
    const status = document.getElementById('booking-status-filter')?.value || 'all';
    const date = document.getElementById('booking-date-filter')?.value || '';
    const search = document.getElementById('booking-search')?.value || '';
    let url = '/api/admin/bookings?';
    if (status && status !== 'all') url += `status=${status}&`;
    if (date) url += `date=${date}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    const res = await apiFetch(url);
    allBookings = await res.json();
    tbody.innerHTML = allBookings.length
      ? allBookings.map(b => bookingRow(b)).join('')
      : '<tr><td colspan="8" class="empty-state">No bookings found.</td></tr>';
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Error loading bookings.</td></tr>';
  }
}

function filterBookings() {
  clearTimeout(window._searchDebounce);
  window._searchDebounce = setTimeout(loadBookings, 400);
}

function bookingRow(b) {
  const svcName = b.service_name_en || '—';
  const dateStr = b.booking_date ? new Date(b.booking_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  return `
    <tr>
      <td><span class="ref-code">${b.reference}</span></td>
      <td>
        <span class="client-name">${esc(b.client_name)}</span><br/>
        <small style="color:var(--ag); font-size:0.7rem;">${esc(b.client_email)}</small>
      </td>
      <td>${esc(svcName)}</td>
      <td>${dateStr}<br/><small style="color:var(--ag);">${b.booking_time}</small></td>
      <td><span class="amount">$${b.amount_paid || 0}</span></td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td><span class="pay-${b.payment_status}">${b.payment_status}</span></td>
      <td>
        <button class="admin-btn secondary small" onclick="openBookingModal('${b.id}')">View</button>
      </td>
    </tr>
  `;
}

function renderBookingsTable(bookings) {
  if (!bookings.length) return '<div class="empty-state">No recent bookings.</div>';
  return `<div class="table-wrap"><table class="admin-table"><thead><tr>
    <th>Reference</th><th>Client</th><th>Service</th><th>Date</th><th>Status</th><th>Action</th>
  </tr></thead><tbody>${bookings.map(b => `
    <tr>
      <td><span class="ref-code">${b.reference}</span></td>
      <td><span class="client-name">${esc(b.client_name)}</span></td>
      <td>${esc(b.service_name_en || '—')}</td>
      <td>${b.booking_date} ${b.booking_time}</td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td><button class="admin-btn secondary small" onclick="openBookingModal('${b.id}'); showPanel('bookings', null);">View</button></td>
    </tr>
  `).join('')}</tbody></table></div>`;
}

async function openBookingModal(id) {
  const booking = allBookings.find(b => b.id === id) || await fetchBookingById(id);
  if (!booking) return;
  document.getElementById('modal-booking-ref').textContent = `Booking: ${booking.reference}`;
  const dateStr = booking.booking_date ? new Date(booking.booking_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';
  document.getElementById('modal-booking-content').innerHTML = `
    <div class="modal-detail-row"><span>Client Name</span><span>${esc(booking.client_name)}</span></div>
    <div class="modal-detail-row"><span>Email</span><span>${esc(booking.client_email)}</span></div>
    <div class="modal-detail-row"><span>Phone</span><span>${esc(booking.client_phone)}</span></div>
    <div class="modal-detail-row"><span>Service</span><span>${esc(booking.service_name_en || '—')}</span></div>
    <div class="modal-detail-row"><span>Date</span><span>${dateStr}</span></div>
    <div class="modal-detail-row"><span>Time</span><span>${booking.booking_time}</span></div>
    <div class="modal-detail-row"><span>Amount</span><span style="color:var(--gold); font-family:var(--serif); font-size:1.1rem;">$${booking.amount_paid || 0}</span></div>
    <div class="modal-detail-row"><span>Status</span><span><span class="status-badge status-${booking.status}">${booking.status}</span></span></div>
    <div class="modal-detail-row"><span>Payment</span><span><span class="pay-${booking.payment_status}">${booking.payment_status}</span></span></div>
    ${booking.notes ? `<div class="modal-detail-row"><span>Notes</span><span>${esc(booking.notes)}</span></div>` : ''}
    <div class="modal-detail-row"><span>Language</span><span style="text-transform:uppercase;">${booking.language}</span></div>
    <div class="modal-detail-row"><span>Booked On</span><span>${new Date(booking.created_at).toLocaleString()}</span></div>
    <p class="modal-section-title">Update Status</p>
  `;
  renderBookingActions(booking);
  openModal('booking-modal');
}

async function fetchBookingById(id) {
  // Fallback: reload bookings
  await loadBookings();
  return allBookings.find(b => b.id === id);
}

function renderBookingActions(booking) {
  const es = adminLang === 'es';
  const actions = document.getElementById('modal-booking-actions');
  const statuses = [
    { value: 'confirmed', labelEs: '✓ Confirmar',        labelEn: '✓ Confirm',    cls: 'success'   },
    { value: 'cancelled', labelEs: '✕ Cancelar',         labelEn: '✕ Cancel',     cls: 'danger'    },
    { value: 'no_show',   labelEs: '— No se presentó',   labelEn: '— No Show',    cls: 'danger'    },
    { value: 'pending',   labelEs: '↩ Mover a Pendiente','labelEn': '↩ Set Pending', cls: 'secondary' }
  ];
  const otherBtns = statuses
    .filter(s => s.value !== booking.status)
    .map(s => `<button class="admin-btn ${s.cls} small" onclick="updateBookingStatus('${booking.id}', '${s.value}')">${es ? s.labelEs : s.labelEn}</button>`)
    .join('');

  // El botón "Completada" siempre abre el formulario de cierre
  const completeBtn = booking.status !== 'completed'
    ? `<button class="admin-btn primary small" onclick="showCloseForm('${booking.id}', ${booking.amount_paid || 0}, ${booking.duration_minutes || ''})">★ ${es ? 'Marcar Completada' : 'Mark Completed'}</button>`
    : '';

  const closeBtn = `<button class="admin-btn secondary small" onclick="closeModal('booking-modal')">${es ? 'Cerrar' : 'Close'}</button>`;
  actions.innerHTML = completeBtn + otherBtns + closeBtn;
}

function showCloseForm(id, currentAmount, currentDuration) {
  const es = adminLang === 'es';
  const actions = document.getElementById('modal-booking-actions');
  actions.innerHTML = `
    <div id="close-form" style="width:100%; border-top:1px solid var(--border); padding-top:1.25rem; margin-top:0.25rem;">
      <p style="font-size:0.6rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--gray); margin-bottom:1rem; font-weight:500;">
        ${es ? 'Registrar cierre de cita' : 'Record appointment close'}
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem;">
        <div>
          <label style="display:block; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gray); margin-bottom:0.4rem; font-weight:500;">
            ${es ? 'Monto cobrado ($)' : 'Amount charged ($)'}
          </label>
          <input id="close-amount" type="number" min="0" step="0.01"
            value="${currentAmount || ''}"
            placeholder="0.00"
            style="width:100%; background:var(--bg); border:1.5px solid var(--border); color:var(--ink); padding:0.6rem 0.8rem; border-radius:var(--radius-sm); font-family:var(--sans); font-size:0.85rem; outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'"
          />
        </div>
        <div>
          <label style="display:block; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gray); margin-bottom:0.4rem; font-weight:500;">
            ${es ? 'Duración (minutos)' : 'Duration (minutes)'}
          </label>
          <input id="close-duration" type="number" min="1" step="1"
            value="${currentDuration || ''}"
            placeholder="${es ? 'ej. 90' : 'e.g. 90'}"
            style="width:100%; background:var(--bg); border:1.5px solid var(--border); color:var(--ink); padding:0.6rem 0.8rem; border-radius:var(--radius-sm); font-family:var(--sans); font-size:0.85rem; outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'"
          />
        </div>
      </div>
      <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
        <button class="admin-btn primary small" onclick="confirmCloseBooking('${id}')">
          ${es ? '★ Confirmar y cerrar' : '★ Confirm & close'}
        </button>
        <button class="admin-btn secondary small" onclick="cancelCloseForm('${id}')">
          ${es ? 'Cancelar' : 'Cancel'}
        </button>
      </div>
    </div>
  `;
  // Focus automático al campo de monto
  setTimeout(() => document.getElementById('close-amount')?.focus(), 50);
}

async function confirmCloseBooking(id) {
  const amount   = parseFloat(document.getElementById('close-amount')?.value)   || 0;
  const duration = parseInt(document.getElementById('close-duration')?.value, 10) || null;
  try {
    const body = { status: 'completed', amount_paid: amount };
    if (duration) body.duration_minutes = duration;
    await apiFetch(`/api/admin/bookings/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    closeModal('booking-modal');
    await loadBookings();
    loadDashboard();
  } catch (err) { alert('Error: ' + err.message); }
}

async function cancelCloseForm(id) {
  // Reconstruye los botones normales sin cerrar el modal
  await loadBookings();
  const booking = allBookings.find(b => b.id === id);
  if (booking) renderBookingActions(booking);
}

async function updateBookingStatus(id, status) {
  try {
    await apiFetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    closeModal('booking-modal');
    await loadBookings();
    loadDashboard();
  } catch (err) { alert('Error updating booking: ' + err.message); }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
async function loadAdminGallery() {
  const grid = document.getElementById('admin-gallery-grid');
  grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--ag);"><div class="spinner" style="margin:0 auto;"></div></div>';
  try {
    const res = await apiFetch('/api/admin/gallery');
    const items = await res.json();
    document.getElementById('gallery-count').textContent = items.filter(i => i.active).length;
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">No photos yet. Upload your first photo above! 📷</div>';
      return;
    }
    grid.innerHTML = items.map(item => `
      <div class="gallery-thumb ${!item.active ? 'inactive' : ''}" style="${!item.active ? 'opacity:0.4;' : ''}">
        <img src="/uploads/${esc(item.filename)}" alt="${esc(item.caption_en || '')}" onclick="previewImage('/uploads/${esc(item.filename)}')" loading="lazy" />
        <div class="gallery-thumb-overlay">
          <button class="admin-btn danger small" onclick="deleteGalleryItem('${item.id}', '${esc(item.filename)}')">Delete</button>
        </div>
        <div class="gallery-thumb-caption">${esc(item.caption_en || item.caption_es || 'No caption')}</div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">Error loading gallery.</div>';
  }
}

function handleFileUpload(files) {
  pendingFiles = Array.from(files);
  if (!pendingFiles.length) return;
  document.getElementById('upload-preview').style.display = 'block';
  const previewWrap = document.getElementById('upload-file-preview');
  previewWrap.innerHTML = pendingFiles.map((f, i) => {
    const url = URL.createObjectURL(f);
    return `<div style="position:relative; width:80px; height:80px; border:1px solid var(--border); border-radius:3px; overflow:hidden;">
      <img src="${url}" style="width:100%; height:100%; object-fit:cover;" />
      <span style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); font-size:0.55rem; padding:2px 4px; color:var(--ag); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${esc(f.name)}">${esc(f.name)}</span>
    </div>`;
  }).join('');
}

async function submitGalleryUpload() {
  if (!pendingFiles.length) { alert('Please select at least one photo.'); return; }
  const btn = document.getElementById('upload-submit-btn');
  const btnText = document.getElementById('upload-btn-text');
  const spinner = document.getElementById('upload-spinner');
  const resultDiv = document.getElementById('upload-result');
  btn.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'inline-block';
  resultDiv.innerHTML = '';
  let successCount = 0;
  for (const file of pendingFiles) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption_en', document.getElementById('caption-en').value);
    formData.append('caption_es', document.getElementById('caption-es').value);
    formData.append('category', document.getElementById('photo-category').value);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      if (res.ok) successCount++;
    } catch {}
  }
  btn.disabled = false;
  btnText.style.display = 'inline';
  spinner.style.display = 'none';
  resultDiv.innerHTML = `<div class="alert alert-${successCount === pendingFiles.length ? 'success' : 'error'}">${successCount} of ${pendingFiles.length} photos uploaded successfully.</div>`;
  if (successCount > 0) {
    pendingFiles = [];
    document.getElementById('photo-file').value = '';
    document.getElementById('caption-en').value = '';
    document.getElementById('caption-es').value = '';
    document.getElementById('upload-file-preview').innerHTML = '';
    setTimeout(() => {
      document.getElementById('upload-preview').style.display = 'none';
      resultDiv.innerHTML = '';
    }, 3000);
    loadAdminGallery();
  }
}

async function deleteGalleryItem(id, filename) {
  if (!confirm(`Delete this photo? This cannot be undone.`)) return;
  try {
    await apiFetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    loadAdminGallery();
  } catch (err) { alert('Error deleting photo: ' + err.message); }
}

function previewImage(src) {
  document.getElementById('modal-image').src = src;
  openModal('image-modal');
}

// ─── Services Management ──────────────────────────────────────────────────────
let adminServices = [];

const CATEGORY_LABELS = { hair: 'Cabello', nails: 'Uñas', beauty: 'Belleza', general: 'General' };

async function loadAdminServices() {
  const tbody = document.getElementById('services-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--ag);"><div class="spinner" style="margin:0 auto;"></div></td></tr>`;
  try {
    const res = await apiFetch('/api/admin/services');
    adminServices = await res.json();
    if (!adminServices.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No hay servicios. ¡Agrega el primero!</td></tr>`;
      return;
    }
    tbody.innerHTML = adminServices.map(s => `
      <tr style="${!s.active ? 'opacity:0.5;' : ''}">
        <td style="text-align:center; color:var(--ag); font-size:0.75rem;">${s.order}</td>
        <td>
          <span style="font-size:0.88rem; color:var(--cream); display:block;">${esc(s.name_es)}</span>
          <small style="color:var(--ag); font-size:0.72rem;">${esc(s.name_en)}</small>
        </td>
        <td style="max-width:200px;">
          <span style="font-size:0.72rem; color:var(--ag); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${esc(s.description_es || '—')}</span>
        </td>
        <td style="font-family:var(--serif); color:var(--gold);">$${s.price_from}</td>
        <td style="font-size:0.78rem; color:var(--ag);">${s.duration_minutes} min</td>
        <td><span class="badge" style="background:rgba(201,168,85,0.15); color:var(--gold); font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; padding:2px 8px; border-radius:2px;">${CATEGORY_LABELS[s.category] || s.category}</span></td>
        <td>
          <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer; font-size:0.72rem; color:var(--ag);">
            <input type="checkbox" ${s.active ? 'checked' : ''} onchange="toggleServiceActive('${s.id}', this.checked)" style="accent-color:var(--gold);" />
            ${s.active ? 'Activo' : 'Inactivo'}
          </label>
        </td>
        <td>
          <button class="admin-btn secondary small" onclick="openServiceModal('${s.id}')">Editar</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Error cargando servicios: ${esc(err.message)}</td></tr>`;
  }
}

function openServiceModal(id) {
  const form = document.getElementById('service-form');
  const errDiv = document.getElementById('service-form-error');
  form.reset();
  errDiv.style.display = 'none';

  const deleteBtn = document.getElementById('svc-delete-btn');
  const modalTitle = document.getElementById('service-modal-title');

  if (id) {
    // Edit mode
    const svc = adminServices.find(s => s.id === id);
    if (!svc) return;
    modalTitle.textContent = 'Editar Servicio';
    document.getElementById('svc-id').value        = svc.id;
    document.getElementById('svc-name-es').value   = svc.name_es    || '';
    document.getElementById('svc-name-en').value   = svc.name_en    || '';
    document.getElementById('svc-desc-es').value   = svc.description_es || '';
    document.getElementById('svc-desc-en').value   = svc.description_en || '';
    document.getElementById('svc-price').value     = svc.price_from  || '';
    document.getElementById('svc-duration').value  = svc.duration_minutes || '';
    document.getElementById('svc-category').value  = svc.category   || 'general';
    document.getElementById('svc-icon').value      = svc.icon       || '';
    document.getElementById('svc-active').checked  = svc.active;
    deleteBtn.style.display = 'inline-flex';
  } else {
    // Create mode
    modalTitle.textContent = 'Nuevo Servicio';
    document.getElementById('svc-id').value        = '';
    document.getElementById('svc-active').checked  = true;
    document.getElementById('svc-duration').value  = '60';
    deleteBtn.style.display = 'none';
  }
  openModal('service-modal');
}

async function saveService(e) {
  e.preventDefault();
  const id = document.getElementById('svc-id').value;
  const errDiv = document.getElementById('service-form-error');
  const saveBtn = document.getElementById('svc-save-btn');
  const saveText = document.getElementById('svc-save-text');
  const saveSpinner = document.getElementById('svc-save-spinner');

  errDiv.style.display = 'none';
  saveBtn.disabled = true;
  saveText.style.display = 'none';
  saveSpinner.style.display = 'inline-block';

  const payload = {
    name_es:          document.getElementById('svc-name-es').value.trim(),
    name_en:          document.getElementById('svc-name-en').value.trim(),
    description_es:   document.getElementById('svc-desc-es').value.trim(),
    description_en:   document.getElementById('svc-desc-en').value.trim(),
    price_from:       parseFloat(document.getElementById('svc-price').value) || 0,
    duration_minutes: parseInt(document.getElementById('svc-duration').value) || 60,
    category:         document.getElementById('svc-category').value,
    icon:             document.getElementById('svc-icon').value.trim(),
    active:           document.getElementById('svc-active').checked
  };

  try {
    let res;
    if (id) {
      res = await apiFetch(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      res = await apiFetch('/api/admin/services', { method: 'POST', body: JSON.stringify(payload) });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error guardando servicio');
    closeModal('service-modal');
    await loadAdminServices();
  } catch (err) {
    errDiv.textContent = err.message;
    errDiv.style.display = 'block';
  } finally {
    saveBtn.disabled = false;
    saveText.style.display = 'inline';
    saveSpinner.style.display = 'none';
  }
}

async function toggleServiceActive(id, active) {
  try {
    await apiFetch(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify({ active }) });
    await loadAdminServices();
  } catch (err) { alert('Error: ' + err.message); }
}

async function deleteService() {
  const id = document.getElementById('svc-id').value;
  if (!id) return;
  const svc = adminServices.find(s => s.id === id);
  if (!confirm(`¿Eliminar el servicio "${svc?.name_es || id}"? Esta acción no se puede deshacer.`)) return;
  try {
    const res = await apiFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
    closeModal('service-modal');
    await loadAdminServices();
  } catch (err) { alert('Error eliminando servicio: ' + err.message); }
}

// ─── Content Panel ────────────────────────────────────────────────────────────
const DAY_NAMES = { monday:'Lunes', tuesday:'Martes', wednesday:'Miércoles', thursday:'Jueves', friday:'Viernes', saturday:'Sábado', sunday:'Domingo' };
const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

async function loadContent() {
  try {
    const res = await apiFetch('/api/admin/settings');
    const s = await res.json();

    // Fill contact form
    const fields = { 'c-name': 'salon_name', 'c-phone': 'salon_phone', 'c-email': 'salon_email', 'c-instagram': 'salon_instagram', 'c-address': 'salon_address', 'c-tagline': 'footer_tagline' };
    for (const [id, key] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el && s[key]) el.value = s[key];
    }

    // Build hours editor
    let hours = {};
    try { hours = JSON.parse(s.business_hours || '{}'); } catch {}
    renderHoursEditor(hours);

    // Load services for footer preview
    const svcRes = await apiFetch('/api/admin/bookings?status=all'); // reuse auth — load services differently
    loadFooterServicesPreview();
  } catch (err) { console.error(err); }
}

function renderHoursEditor(hours) {
  const container = document.getElementById('hours-rows');
  if (!container) return;
  container.innerHTML = DAY_ORDER.map(day => {
    const h = hours[day] || { open: '09:00', close: '18:00', closed: false };
    return `
      <div style="display:grid; grid-template-columns:120px 1fr 1fr 80px; gap:0.75rem; align-items:center; margin-bottom:0.6rem;" id="hour-row-${day}">
        <span style="font-size:0.78rem; color:var(--cream);">${DAY_NAMES[day]}</span>
        <input type="time" value="${h.open || '09:00'}" id="hr-open-${day}" style="background:var(--bg3); border:1px solid var(--border); color:var(--cream); padding:0.45rem 0.7rem; border-radius:3px; font-family:var(--sans); font-size:0.78rem; ${h.closed?'opacity:0.3;':''}" ${h.closed?'disabled':''} />
        <input type="time" value="${h.close || '18:00'}" id="hr-close-${day}" style="background:var(--bg3); border:1px solid var(--border); color:var(--cream); padding:0.45rem 0.7rem; border-radius:3px; font-family:var(--sans); font-size:0.78rem; ${h.closed?'opacity:0.3;':''}" ${h.closed?'disabled':''} />
        <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.72rem; color:var(--ag); cursor:pointer;">
          <input type="checkbox" id="hr-closed-${day}" ${h.closed?'checked':''} onchange="toggleDayClosed('${day}')" style="accent-color:var(--gold);" />
          Cerrado
        </label>
      </div>
    `;
  }).join('');
}

function toggleDayClosed(day) {
  const closed = document.getElementById(`hr-closed-${day}`).checked;
  const openEl  = document.getElementById(`hr-open-${day}`);
  const closeEl = document.getElementById(`hr-close-${day}`);
  openEl.disabled  = closed; openEl.style.opacity  = closed ? '0.3' : '1';
  closeEl.disabled = closed; closeEl.style.opacity = closed ? '0.3' : '1';
}

async function saveHours() {
  const hours = {};
  for (const day of DAY_ORDER) {
    const closed = document.getElementById(`hr-closed-${day}`)?.checked || false;
    hours[day] = {
      open:  document.getElementById(`hr-open-${day}`)?.value  || '09:00',
      close: document.getElementById(`hr-close-${day}`)?.value || '18:00',
      closed
    };
  }
  try {
    await apiFetch('/api/admin/settings', { method:'PUT', body: JSON.stringify({ business_hours: JSON.stringify(hours) }) });
    const saved = document.getElementById('hours-saved');
    saved.style.display = 'inline'; setTimeout(() => saved.style.display = 'none', 3000);
  } catch (err) { alert('Error: ' + err.message); }
}

async function saveContent(e, type) {
  e.preventDefault();
  const form = type === 'contact' ? document.getElementById('contact-form') : null;
  if (!form) return;
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  try {
    await apiFetch('/api/admin/settings', { method:'PUT', body: JSON.stringify(data) });
    const savedEl = document.getElementById(`${type}-saved`);
    if (savedEl) { savedEl.style.display = 'inline'; setTimeout(() => savedEl.style.display = 'none', 3000); }
  } catch (err) { alert('Error guardando: ' + err.message); }
}

async function loadFooterServicesPreview() {
  const container = document.getElementById('footer-services-preview');
  if (!container) return;
  try {
    const res = await apiFetch('/api/admin/bookings'); // we need services — use services endpoint
    // Fetch services directly
    const sRes = await fetch('/api/services');
    const services = await sRes.json();
    container.innerHTML = services.map(s => `
      <div style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0; border-bottom:1px solid var(--border);">
        <span style="color:var(--gold); font-size:0.7rem;">✓</span>
        <span style="font-size:0.82rem; color:var(--cream);">${esc(s.name_es)}</span>
        <span style="font-size:0.72rem; color:var(--ag); margin-left:auto;">${esc(s.name_en)}</span>
      </div>
    `).join('') || '<div class="empty-state">No hay servicios activos.</div>';
  } catch { container.innerHTML = '<div class="empty-state">Error cargando servicios.</div>'; }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
async function loadSettings() {
  try {
    const res = await apiFetch('/api/admin/settings');
    const s = await res.json();
    document.getElementById('s-name').value = s.salon_name || '';
    document.getElementById('s-phone').value = s.salon_phone || '';
    document.getElementById('s-email').value = s.salon_email || '';
    document.getElementById('s-instagram').value = s.salon_instagram || '';
    document.getElementById('s-address').value = s.salon_address || '';
    document.getElementById('s-interval').value = s.booking_interval || '30';
    document.getElementById('s-advance').value = s.advance_booking_days || '30';
  } catch {}
}

async function saveSettings(e) {
  e.preventDefault();
  const form = document.getElementById('settings-form');
  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  try {
    await apiFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
    const saved = document.getElementById('settings-saved');
    saved.style.display = 'inline';
    setTimeout(() => saved.style.display = 'none', 3000);
  } catch (err) { alert('Error saving settings: ' + err.message); }
}

// ─── Modal Helpers ────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop && backdrop.id !== 'booking-modal') closeModal(backdrop.id);
  });
});

// ─── Drag & Drop Upload ───────────────────────────────────────────────────────
const uploadZone = document.getElementById('upload-zone');
uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  handleFileUpload(e.dataTransfer.files);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    // Validate token by attempting a request
    fetch('/api/admin/dashboard', { headers: { 'Authorization': `Bearer ${authToken}` } })
      .then(r => { if (r.ok) showApp(); else logout(); })
      .catch(() => logout());
  } else {
    document.getElementById('login-screen').style.display = 'flex';
  }
  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  });
});
