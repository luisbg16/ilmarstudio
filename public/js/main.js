/* ═══════════════════════════════════════════════════════════════════
   ILMAR STUDIO — Frontend Logic
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

// ─── Service SVG Icons ────────────────────────────────────────────
const SERVICE_ICONS = {
  'nails-acrylic': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 38c0 2.21 3.582 4 8 4s8-1.79 8-4V18c0-1.105-1.343-2-3-2h-10c-1.657 0-3 .895-3 2v20z"/>
    <path d="M20 14c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v2H20v-2z"/>
    <path d="M16 24h16M16 29h16"/>
  </svg>`,
  'nails-semipermanent': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="24" cy="30" rx="9" ry="11"/>
    <path d="M15 26c1-8 18-8 18 0"/>
    <path d="M19 18v-6M24 17v-7M29 18v-6"/>
  </svg>`,
  'hair-color': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 7c-5.523 0-10 4.477-10 10 0 3.8 2.1 7.1 5.2 8.8L18 42h12l-1.2-16.2C31.9 24.1 34 20.8 34 17c0-5.523-4.477-10-10-10z"/>
    <path d="M19 24h10"/>
    <path d="M20 17a4 4 0 0 1 8 0"/>
  </svg>`,
  'brows-lashes': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 24c4-8 28-8 32 0"/>
    <ellipse cx="24" cy="28" rx="12" ry="7"/>
    <circle cx="24" cy="28" r="4"/>
    <path d="M14 16l-2-4M19 13l-1-4M24 12v-4M29 13l1-4M34 16l2-4"/>
  </svg>`,
  'makeup-events': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="16" y="7" width="16" height="9" rx="2"/>
    <path d="M16 16l-4 24a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2l-4-24"/>
    <path d="M19 27h10M20 32h8"/>
  </svg>`,
  'micropigmentation': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M36 8l4 4-22 22-6 2 2-6L36 8z"/>
    <path d="M30 14l4 4"/>
    <path d="M10 40l6-2-4-4-2 6z"/>
    <path d="M40 8c0 0-1 1-4-2"/>
  </svg>`,
};

function getServiceIcon(slug) {
  return SERVICE_ICONS[slug] || `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="14"/>
    <path d="M24 17v7l4 4"/>
  </svg>`;
}

// (Placeholders eliminados — se usan solo fotos reales de la DB)

// ─── App State ────────────────────────────────────────────────────
const state = {
  services:         [],
  gallery:          [],
  selectedServices: [],   // Array for multi-select
  selectedDate:     null,
  selectedTime:     null,
  currentStep:      1
};

// ─── Navbar Scroll ────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── Mobile Menu ──────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
hamburger?.addEventListener('click', () => {
  const isOpen = mobileNav.style.display === 'flex';
  mobileNav.style.display = isOpen ? 'none' : 'flex';
  hamburger.querySelectorAll('span').forEach((s, i) => {
    s.style.transform = isOpen ? '' : ['rotate(45deg) translate(4px, 4px)', '', 'rotate(-45deg) translate(4px, -4px)'][i] || '';
    s.style.opacity   = (!isOpen && i === 1) ? '0' : '';
  });
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.style.display = 'none';
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── Smooth Scroll ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ─── Load Footer ──────────────────────────────────────────────────
async function loadFooterContent() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const s = await res.json();
    const addr  = document.getElementById('footer-address');
    const phone = document.getElementById('footer-phone');
    const email = document.getElementById('footer-email');
    const ig    = document.getElementById('footer-instagram');
    const igLnk = document.getElementById('footer-ig-link');
    const copy  = document.getElementById('footer-copy');
    if (addr  && s.salon_address)   addr.textContent  = s.salon_address;
    if (phone && s.salon_phone)     { phone.textContent = s.salon_phone; phone.href = `tel:${s.salon_phone.replace(/\D/g,'')}`; }
    if (email && s.salon_email)     { email.textContent = s.salon_email; email.href = `mailto:${s.salon_email}`; }
    if (ig    && s.salon_instagram) ig.textContent    = s.salon_instagram;
    if (igLnk && s.salon_instagram) igLnk.href        = `https://instagram.com/${s.salon_instagram.replace('@','')}`;
    if (copy  && s.salon_name)      copy.textContent  = `© ${new Date().getFullYear()} ${s.salon_name}. ${currentLang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}`;
    const taglineEl = document.getElementById('footer-tagline');
    if (taglineEl && s.footer_tagline) taglineEl.textContent = s.footer_tagline;
    if (s.business_hours) { try { renderFooterHours(JSON.parse(s.business_hours)); } catch {} }
  } catch {}
}

function renderFooterHours(hours) {
  const container = document.getElementById('footer-hours');
  if (!container || !hours) return;
  const dayLabels = {
    es: { monday:'Lun', tuesday:'Mar', wednesday:'Mié', thursday:'Jue', friday:'Vie', saturday:'Sáb', sunday:'Dom' },
    en: { monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu', friday:'Fri', saturday:'Sat', sunday:'Sun' }
  };
  const labels   = dayLabels[currentLang] || dayLabels.es;
  const dayOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const rows = []; let group = null;
  for (const day of dayOrder) {
    const h = hours[day];
    if (!h) continue;
    if (h.closed) {
      if (group) { rows.push(group); group = null; }
      rows.push({ days: [labels[day]], open: null, close: null, closed: true });
    } else {
      if (group && group.open === h.open && group.close === h.close) { group.days.push(labels[day]); }
      else { if (group) rows.push(group); group = { days: [labels[day]], open: h.open, close: h.close, closed: false }; }
    }
  }
  if (group) rows.push(group);
  container.innerHTML = rows.slice(0, 5).map(r => `
    <div class="footer-hours-row" ${r.closed ? 'style="color:var(--gold);"' : ''}>
      <span class="day">${r.days.join(' – ')}</span>
      <span>${r.closed ? t('footer.closed') : `${r.open} – ${r.close}`}</span>
    </div>
  `).join('');
}

// ─── Services ─────────────────────────────────────────────────────
async function loadServices() {
  try {
    const res = await fetch('/api/services');
    state.services = await res.json();
    renderServices();
    renderBookingServices();
  } catch (err) { console.error('Failed to load services:', err); }
}

window.renderServices = function() {
  const grid = document.getElementById('services-grid');
  if (!grid || !state.services.length) return;
  grid.innerHTML = state.services.map(s => {
    const name = currentLang === 'es' ? s.name_es : s.name_en;
    const desc = currentLang === 'es' ? s.description_es : s.description_en;
    const icon = getServiceIcon(s.slug);
    return `
      <div class="service-card" onclick="scrollToBooking()">
        <div class="service-icon-wrap">${icon}</div>
        <div class="service-body">
          <div class="service-name">${name}</div>
          <p class="service-desc">${desc}</p>
          <span class="service-cta">${t('services.book_this')}</span>
        </div>
      </div>
    `;
  }).join('');
};

function scrollToBooking() {
  const el = document.getElementById('booking');
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
}

window.renderBookingServices = function() {
  const list = document.getElementById('booking-services-list');
  if (!list || !state.services.length) return;
  list.innerHTML = state.services.map(s => {
    const name = currentLang === 'es' ? s.name_es : s.name_en;
    const isSelected = state.selectedServices.some(sel => sel.id === s.id);
    const icon = getServiceIcon(s.slug);
    const checkBorder = isSelected ? 'var(--gold)' : 'var(--border)';
    const checkBg = isSelected ? 'var(--gold)' : 'transparent';
    return `
      <div class="booking-service-card ${isSelected ? 'selected' : ''}" id="bk-svc-${s.id}" onclick="toggleService('${s.id}')">
        <div class="bk-svc-icon">${icon}</div>
        <div class="bk-svc-info">
          <div class="bk-svc-name">${name}</div>
          <div class="bk-svc-dur">${s.duration_minutes} min</div>
        </div>
        <div class="svc-check" id="chk-${s.id}" style="width:22px;height:22px;border:1.5px solid ${checkBorder};border-radius:50%;flex-shrink:0;transition:all 0.2s;background:${checkBg};display:flex;align-items:center;justify-content:center;">
          ${isSelected ? '<span style="color:#111;font-size:11px;">✓</span>' : ''}
        </div>
      </div>
    `;
  }).join('');
};

window.toggleService = function(id) {
  const svc = state.services.find(s => s.id === id || s._id === id);
  if (!svc) return;
  const idx = state.selectedServices.findIndex(s => s.id === id);
  if (idx >= 0) {
    state.selectedServices.splice(idx, 1);
  } else {
    state.selectedServices.push(svc);
  }
  renderBookingServices();
  document.getElementById('err-service').style.display = 'none';
};

// ─── Gallery ──────────────────────────────────────────────────────
async function loadGallery() {
  try {
    const res = await fetch('/api/gallery');
    state.gallery = await res.json();
    renderGallery();
  } catch { renderGalleryPlaceholders(); }
}

window.renderGallery = function() {
  const grid  = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  if (!grid) return;
  if (!state.gallery.length) { renderGalleryPlaceholders(); return; }
  empty.style.display = 'none';
  grid.innerHTML = state.gallery.map((item, idx) => {
    const cap = currentLang === 'es' ? (item.caption_es || '') : (item.caption_en || '');
    return `
      <div class="gallery-item" data-idx="${idx}" onclick="openLightbox(${idx})" role="button" tabindex="0" aria-label="Ver imagen: ${cap}">
        <img src="/uploads/${item.filename}" alt="${cap}" loading="lazy" />
        <div class="gallery-overlay"><span class="gallery-caption">${cap}</span></div>
      </div>
    `;
  }).join('');
};

// ─── Lightbox ────────────────────────────────────────────────────────
let lbIndex = 0;

function openLightbox(idx) {
  lbIndex = idx;
  updateLightbox();
  const lb = document.getElementById('gallery-lightbox');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const items = state.gallery;
  if (!items.length) return;
  const item = items[lbIndex];
  const cap = currentLang === 'es' ? (item.caption_es || '') : (item.caption_en || '');
  const img = document.getElementById('lb-img');
  img.src = `/uploads/${item.filename}`;
  img.alt = cap;
  document.getElementById('lb-caption').textContent = cap;
  document.getElementById('lb-prev').style.opacity = lbIndex === 0 ? '0.3' : '1';
  document.getElementById('lb-next').style.opacity = lbIndex === items.length - 1 ? '0.3' : '1';
}

function closeLightbox() {
  document.getElementById('gallery-lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lb-prev')?.addEventListener('click', () => {
    if (lbIndex > 0) { lbIndex--; updateLightbox(); }
  });
  document.getElementById('lb-next')?.addEventListener('click', () => {
    if (lbIndex < state.gallery.length - 1) { lbIndex++; updateLightbox(); }
  });
  document.getElementById('gallery-lightbox')?.addEventListener('click', e => {
    if (e.target === e.currentTarget || e.target.id === 'lb-img-wrap') closeLightbox();
  });
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('gallery-lightbox');
    if (!lb?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lbIndex > 0) { lbIndex--; updateLightbox(); }
    if (e.key === 'ArrowRight' && lbIndex < state.gallery.length - 1) { lbIndex++; updateLightbox(); }
  });
});

function renderGalleryPlaceholders() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  document.getElementById('gallery-empty').style.display = 'none';
  grid.innerHTML = GALLERY_PLACEHOLDERS.map(item => {
    const cap = currentLang === 'es' ? item.caption_es : item.caption_en;
    return `
      <div class="gallery-item">
        <img src="${item.src}" alt="${cap}" loading="lazy" />
        <div class="gallery-overlay"><span class="gallery-caption">${cap}</span></div>
      </div>
    `;
  }).join('');
}

// ─── Availability Widget ──────────────────────────────────────────
let availPicker = null;

function initAvailabilityPicker() {
  availPicker = flatpickr('#avail-date-input', {
    minDate: 'today',
    maxDate: new Date().fp_incr(60),
    disable: [date => date.getDay() === 0],   // Sundays disabled by default
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'D, d M Y',
    locale: currentLang === 'es' ? {
      weekdays: { shorthand:['Do','Lu','Ma','Mi','Ju','Vi','Sá'], longhand:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'] },
      months:   { shorthand:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], longhand:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'] }
    } : {},
    onChange: (selectedDates, dateStr) => {
      state.selectedDate = dateStr;
      state.selectedTime = null;
      loadAvailabilitySlots(dateStr);
      updateAvailCTA();
    }
  });
}

async function loadAvailabilitySlots(date) {
  const grid = document.getElementById('avail-slots-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="spinner" style="margin:1rem auto;"></div>';
  try {
    const res  = await fetch(`/api/available-slots?date=${date}`);
    const data = await res.json();
    if (!data.slots?.length) {
      grid.innerHTML = `<p class="avail-no-slots">${t('booking.avail_no_slots')}</p>`;
      return;
    }
    grid.innerHTML = data.slots.map(slot => `
      <button class="avail-slot-btn ${state.selectedTime === slot ? 'selected' : ''}"
        onclick="selectAvailSlot('${slot}')">${slot}</button>
    `).join('');
  } catch {
    grid.innerHTML = `<p class="avail-no-slots">Error cargando horarios.</p>`;
  }
}

window.selectAvailSlot = function(time) {
  state.selectedTime = time;
  // Update visual selection
  document.querySelectorAll('.avail-slot-btn').forEach(b => {
    b.classList.toggle('selected', b.textContent.trim() === time);
  });
  updateAvailCTA();
};

function updateAvailCTA() {
  const ctaInfo = document.getElementById('avail-cta-info');
  const bookBtn = document.getElementById('avail-book-btn');
  if (!ctaInfo || !bookBtn) return;
  if (state.selectedDate && state.selectedTime) {
    ctaInfo.innerHTML = `<span style="color:var(--gray-light);">${t('booking.avail_selected')}</span>
      <strong style="color:var(--gold); font-family:var(--serif); font-size:1rem; font-weight:400;"> ${formatDate(state.selectedDate)} · ${state.selectedTime}</strong>`;
    bookBtn.style.display = 'inline-flex';
  } else {
    ctaInfo.innerHTML = `<span data-i18n="booking.avail_select_time">${t('booking.avail_select_time')}</span>`;
    bookBtn.style.display = 'none';
  }
}

window.openBookingForm = function() {
  if (!state.selectedDate || !state.selectedTime) return;
  // Fill banner
  document.getElementById('banner-date').textContent = formatDate(state.selectedDate);
  document.getElementById('banner-time').textContent = state.selectedTime;
  // Show form, hide availability widget's CTA (keep widget visible for reference)
  document.getElementById('booking-form-area').style.display = 'block';
  // Scroll to form
  setTimeout(() => {
    const el = document.getElementById('booking-form-area');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  }, 100);
  // Reset to step 1 of form
  goStep(1);
};

window.resetToAvailability = function() {
  document.getElementById('booking-form-area').style.display = 'none';
  state.selectedTime = null;
  state.selectedServices = [];
  updateAvailCTA();
  // Clear slot selection visuals
  document.querySelectorAll('.avail-slot-btn').forEach(b => b.classList.remove('selected'));
  window.scrollTo({ top: document.getElementById('avail-widget').getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
};

// ─── Booking Form Steps (3 steps) ─────────────────────────────────
window.goStep = function(step) {
  if (step > state.currentStep && !validateStep(state.currentStep)) return;
  document.querySelectorAll('.booking-panel').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === step);
  });
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < step) s.classList.add('done');
    if (i + 1 === step) s.classList.add('active');
  });
  state.currentStep = step;
  if (step === 3) populateSummary();
};

function validateStep(step) {
  if (step === 1) {
    if (!state.selectedServices.length) {
      document.getElementById('err-service').style.display = 'block';
      return false;
    }
  }
  if (step === 2) {
    let valid = true;
    const name  = document.getElementById('client-name')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    const email = document.getElementById('client-email')?.value.trim();
    if (!name)  { document.getElementById('err-name').style.display  = 'block'; valid = false; }
    else document.getElementById('err-name').style.display  = 'none';
    if (!phone) { document.getElementById('err-phone').style.display = 'block'; valid = false; }
    else document.getElementById('err-phone').style.display = 'none';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('err-email').style.display = 'block'; valid = false;
    } else document.getElementById('err-email').style.display = 'none';
    return valid;
  }
  return true;
}

function populateSummary() {
  const svcNames = state.selectedServices
    .map(s => currentLang === 'es' ? s.name_es : s.name_en)
    .join(', ');
  document.getElementById('sum-service').textContent = svcNames || '—';
  document.getElementById('sum-date').textContent    = formatDate(state.selectedDate) || '—';
  document.getElementById('sum-time').textContent    = state.selectedTime || '—';
  document.getElementById('sum-name').textContent    = document.getElementById('client-name')?.value || '—';
}

// ─── Submit Booking ───────────────────────────────────────────────
window.submitBooking = async function() {
  const payBtn     = document.getElementById('pay-btn');
  const payText    = document.getElementById('pay-btn-text');
  const paySpinner = document.getElementById('pay-spinner');
  const errDiv     = document.getElementById('booking-error');
  payBtn.disabled          = true;
  payText.style.display    = 'none';
  paySpinner.style.display = 'inline-block';
  errDiv.style.display     = 'none';

  const payload = {
    service_ids:  state.selectedServices.map(s => s.id),
    booking_date: state.selectedDate,
    booking_time: state.selectedTime,
    name:         document.getElementById('client-name')?.value.trim(),
    email:        document.getElementById('client-email')?.value.trim(),
    phone:        document.getElementById('client-phone')?.value.trim(),
    notes:        document.getElementById('client-notes')?.value.trim(),
    language:     currentLang
  };

  try {
    const res  = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la reserva');
    showSuccessPage(data.reference, true);
  } catch (err) {
    errDiv.textContent       = err.message;
    errDiv.style.display     = 'block';
    payBtn.disabled          = false;
    payText.style.display    = 'inline';
    paySpinner.style.display = 'none';
  }
};

function showSuccessPage(ref, isPending) {
  ['hero','services','gallery','about','booking','footer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const sp = document.getElementById('success-page');
  sp.classList.add('visible');
  document.getElementById('success-ref').textContent = ref;
  const pendingNote = document.getElementById('success-pending-note');
  if (pendingNote) pendingNote.style.display = isPending ? 'block' : 'none';
  applyTranslations();
}

// ─── Success Page Check ───────────────────────────────────────────
function checkSuccessPage() {
  const params = new URLSearchParams(window.location.search);
  const ref    = params.get('ref');
  if (ref && window.location.pathname === '/booking-success') {
    showSuccessPage(ref, false);
    return;
  }
  if (params.get('booking') === 'cancelled') {
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }, 400);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(currentLang === 'es' ? 'es-US' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkSuccessPage();
  loadServices();
  loadGallery();
  loadFooterContent();
  initAvailabilityPicker();

  // Expose globals
  window.goStep              = goStep;
  window.selectAvailSlot     = selectAvailSlot;
  window.openBookingForm     = openBookingForm;
  window.resetToAvailability = resetToAvailability;
  window.toggleService       = toggleService;
  window.submitBooking       = submitBooking;
  window.scrollToBooking     = scrollToBooking;
});
