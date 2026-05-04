/* ═══════════════════════════════════════════════════════════════════
   ILMAR STUDIO — Bilingual i18n System (EN / ES)
   ═══════════════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  en: {
    nav: {
      services: 'Services', gallery: 'Gallery', about: 'About',
      contact: 'Contact', book: 'Book Now'
    },
    hero: {
      phrase1: 'Beauty that enhances',
      phrase2: 'your essence',
      cta_book: 'Book an appointment',
      cta_services: 'View services',
    },
    services: {
      subtitle: 'What We Offer',
      title: 'Our Services',
      intro: 'Crafted with precision, delivered with passion. Every service is a bespoke experience.',
      from: 'From',
      book_this: 'Book This Service →'
    },
    gallery: {
      title: 'Our Work',
      intro: 'Every look tells a story. Discover our latest transformations.',
      empty: 'Gallery photos coming soon ✨'
    },
    about: {
      subtitle: 'Our Story',
      title: 'Beauty should enhance\nyour natural light.',
      photo_label: 'Iliana at ILMAR Studio',
      p1: 'ILMAR STUDIO was born from a genuine passion for beauty — not as a business, but as a calling. Founded by Iliana during the pandemic, guided by her mother\'s encouragement and fueled by a lifelong love for the art of transformation, this studio is built on one conviction: beauty treatments should always enhance your natural light, never overshadow it.',
      p2: 'Iliana continuously trains with top professionals to bring you the highest-quality techniques and products. But what truly sets her apart is her approach: she doesn\'t just do your hair or nails — she listens, she cares, and she stays with you through the entire process to make sure you leave not just looking great, but feeling confident and genuinely yourself.',
      quote: '"My mission is not just to make you look beautiful — it\'s to help you see how beautiful you already are."',
      stat1: 'Happy Clients', stat2: 'Services', stat3: 'Rating'
    },
    booking: {
      subtitle: 'Reserve Your Spot',
      title: 'Book an Appointment',
      intro: 'Your time is sacred. Check availability, pick your services, and arrive ready to shine.',
      promise1: 'Instant confirmation',
      promise2: 'Easy, no complications',
      promise3: 'Easy to cancel or reschedule',
      avail_title: 'Check Availability',
      avail_subtitle: 'Browse open slots — no commitment required',
      avail_pick_date: 'Select a date',
      avail_slots_label: 'Available times',
      avail_select_date: 'Select a date to see available times.',
      avail_no_slots: 'No available times for this date. Please choose another day.',
      avail_selected: 'Selected:',
      avail_book_btn: 'Book this appointment',
      avail_select_time: 'Select a time above to book',
      step1: 'Services', step2: 'Your Info', step3: 'Confirm',
      select_services: 'Choose Your Services',
      select_services_hint: 'You can select one or more services.',
      running_total: 'Estimated total',
      err_service: 'Please select at least one service to continue.',
      name: 'Full Name', phone: 'Phone Number', email: 'Email Address',
      notes: 'Notes (optional)',
      notes_placeholder: 'Any special requests or details...',
      err_name: 'Please enter your full name.',
      err_phone: 'Please enter your phone number.',
      err_email: 'Please enter a valid email address.',
      from_label: 'From',
      summary_title: 'Appointment Summary',
      summary_service: 'Services', summary_date: 'Date',
      summary_time: 'Time', summary_client: 'Name', summary_total: 'Total',
      pay_method_title: 'How would you like to pay?',
      pay_online_name: 'Pay online',
      pay_online_desc: 'Secure card payment via Stripe. Your appointment is confirmed immediately.',
      pay_online_badge: 'Recommended',
      pay_inperson_name: 'Pay at the salon',
      pay_inperson_desc: 'Cash or bank transfer on the day of your appointment.',
      pay_inperson_badge: 'On arrival',
      pay_btn_online: 'Pay & Confirm Booking',
      pay_btn_inperson: 'Reserve (pay at salon)',
      payment_note: 'You will be redirected to our secure Stripe checkout. Your appointment will be confirmed after payment.',
      payment_note_inperson: 'Your reservation will be pending until confirmed by the salon. Please show up on time.',
      processing: 'Processing…',
      confirm_btn: 'Confirm Booking',
      next: 'Continue', back: '← Back',
      change_datetime: 'Change'
    },
    footer: {
      tagline: '"Beauty, consciousness, care and wellbeing — every visit, every detail, crafted for you."',
      services_title: 'Services', hours_title: 'Hours', contact_title: 'Contact',
      mon_fri: 'Mon – Fri', sat: 'Saturday', sun: 'Sunday',
      closed: 'Closed',
      flexible_note: 'Flexible hours — book in advance',
      copy: '© 2025 ILMAR STUDIO. All rights reserved.',
      admin: 'Admin'
    },
    success: {
      title: 'Appointment Confirmed!',
      subtitle: 'Thank you for booking with ILMAR STUDIO. We look forward to seeing you.',
      ref_label: 'Booking Reference',
      email_note: 'A confirmation will be sent to your email. Please save your reference number.',
      back_home: 'Return to Homepage',
      pending_note: 'Your reservation is pending. We will contact you to confirm your appointment.'
    }
  },
  es: {
    nav: {
      services: 'Servicios', gallery: 'Galería', about: 'Nosotros',
      contact: 'Contacto', book: 'Reservar'
    },
    hero: {
      phrase1: 'Belleza que realza',
      phrase2: 'tu esencia',
      cta_book: 'Reservar cita',
      cta_services: 'Ver servicios',
    },
    services: {
      subtitle: 'Lo Que Ofrecemos',
      title: 'Nuestros Servicios',
      intro: 'Elaborados con precisión, entregados con pasión. Cada servicio es una experiencia exclusiva.',
      from: 'Desde',
      book_this: 'Reservar Este Servicio →'
    },
    gallery: {
      title: 'Nuestro Trabajo',
      intro: 'Cada look cuenta una historia. Descubre nuestras últimas transformaciones.',
      empty: 'Fotos próximamente ✨'
    },
    about: {
      subtitle: 'Nuestra Historia',
      title: 'La belleza debe realzar\ntu luz natural.',
      photo_label: 'Iliana en ILMAR Studio',
      p1: 'ILMAR STUDIO nació de una pasión genuina por la belleza — no como negocio, sino como vocación. Fundado por Iliana durante la pandemia, con el apoyo de su mamá y alimentado por un amor de toda la vida por el arte de la transformación, este estudio está construido sobre una convicción: todo tratamiento de belleza debe realzar tu brillo natural, jamás opacarlo.',
      p2: 'Iliana se prepara constantemente con los mejores profesionales para ofrecerte técnicas y productos de alta calidad. Pero lo que verdaderamente la distingue es su enfoque: no solo te hace el cabello o las uñas — te escucha, te cuida, y permanece contigo durante todo el proceso para asegurarse de que salgas no solo viéndote increíble, sino sintiéndote segura y genuinamente tú misma.',
      quote: '"Mi misión no es solo hacerte ver bella — es ayudarte a ver lo bella que ya eres."',
      stat1: 'Clientas Felices', stat2: 'Servicios', stat3: 'Calificación'
    },
    booking: {
      subtitle: 'Reserva tu Lugar',
      title: 'Agenda una Cita',
      intro: 'Tu tiempo es sagrado. Consulta disponibilidad, elige tus servicios y llega lista para brillar.',
      promise1: 'Confirmación inmediata',
      promise2: 'Sin complicaciones',
      promise3: 'Cancela o reagenda fácilmente',
      avail_title: 'Consulta Disponibilidad',
      avail_subtitle: 'Revisa los horarios disponibles sin ningún compromiso',
      avail_pick_date: 'Selecciona una fecha',
      avail_slots_label: 'Horarios disponibles',
      avail_select_date: 'Selecciona una fecha para ver los horarios disponibles.',
      avail_no_slots: 'No hay horarios disponibles para este día. Por favor elige otra fecha.',
      avail_selected: 'Seleccionado:',
      avail_book_btn: 'Reservar este horario',
      avail_select_time: 'Selecciona un horario para reservar',
      step1: 'Servicios', step2: 'Tus Datos', step3: 'Confirmar',
      select_services: 'Elige tus Servicios',
      select_services_hint: 'Puedes seleccionar uno o más servicios.',
      running_total: 'Total estimado',
      err_service: 'Por favor selecciona al menos un servicio para continuar.',
      name: 'Nombre Completo', phone: 'Teléfono', email: 'Correo Electrónico',
      notes: 'Notas (opcional)',
      notes_placeholder: 'Solicitudes especiales o detalles...',
      err_name: 'Por favor ingresa tu nombre completo.',
      err_phone: 'Por favor ingresa tu número de teléfono.',
      err_email: 'Por favor ingresa un correo electrónico válido.',
      from_label: 'Desde',
      summary_title: 'Resumen de la Cita',
      summary_service: 'Servicios', summary_date: 'Fecha',
      summary_time: 'Hora', summary_client: 'Nombre', summary_total: 'Total',
      pay_method_title: '¿Cómo deseas pagar?',
      pay_online_name: 'Pagar en línea',
      pay_online_desc: 'Pago seguro con tarjeta vía Stripe. Tu cita se confirma de inmediato.',
      pay_online_badge: 'Recomendado',
      pay_inperson_name: 'Pagar en el salón',
      pay_inperson_desc: 'Efectivo o transferencia bancaria el día de tu cita.',
      pay_inperson_badge: 'Al llegar',
      pay_btn_online: 'Pagar y Confirmar Cita',
      pay_btn_inperson: 'Reservar (pago en salón)',
      payment_note: 'Serás redirigida a nuestro pago seguro con Stripe. Tu cita se confirmará al completar el pago.',
      payment_note_inperson: 'Tu reserva quedará pendiente hasta ser confirmada por el salón. Por favor llega puntual.',
      processing: 'Procesando…',
      confirm_btn: 'Confirmar Reserva',
      next: 'Continuar', back: '← Atrás',
      change_datetime: 'Cambiar'
    },
    footer: {
      tagline: '"Belleza, conciencia, cuidado y bienestar — cada visita, cada detalle, pensado para ti."',
      services_title: 'Servicios', hours_title: 'Horarios', contact_title: 'Contacto',
      mon_fri: 'Lun – Vie', sat: 'Sábado', sun: 'Domingo',
      closed: 'Cerrado',
      flexible_note: 'Horarios flexibles — reserva con anticipación',
      copy: '© 2025 ILMAR STUDIO. Todos los derechos reservados.',
      admin: 'Admin'
    },
    success: {
      title: '¡Cita Confirmada!',
      subtitle: 'Gracias por reservar con ILMAR STUDIO. ¡Con gusto te esperamos!',
      ref_label: 'Referencia de Reserva',
      email_note: 'Recibirás una confirmación en tu correo. Por favor guarda tu número de referencia.',
      back_home: 'Volver al Inicio',
      pending_note: 'Tu reserva está pendiente. Nos pondremos en contacto para confirmar tu cita.'
    }
  }
};

// ─── i18n Engine ──────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('ilmar_lang') || 'es';

function t(key) {
  const keys = key.split('.');
  let val = TRANSLATIONS[currentLang];
  for (const k of keys) { val = val?.[k]; }
  return val || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text && text !== key) el.textContent = text;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text && text !== key) el.placeholder = text;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  document.documentElement.lang = currentLang;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('ilmar_lang', lang);
  applyTranslations();
  if (window.renderServices) window.renderServices();
  if (window.renderGallery)  window.renderGallery();
  if (window.renderBookingServices) window.renderBookingServices();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  applyTranslations();
});
