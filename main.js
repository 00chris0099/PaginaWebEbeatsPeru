/* ══════════════════════════════════════════════════
   E BEATS PERÚ — JAVASCRIPT
   Navbar scroll, animation observer, mobile menu
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── MOBILE HAMBURGER ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    });
  });

  /* ─── AOS SCROLL ANIMATIONS ─── */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        // Once animated, stop observing for performance
        aosObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  aosElements.forEach(el => aosObserver.observe(el));

  /* ─── SMOOTH SCROLL FOR ANCHORS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── BRIDGE STEPS HOVER INTERACTION ─── */
  const bridgeSteps = document.querySelectorAll('.bridge-step');
  bridgeSteps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      // Visually highlight hovered step
      bridgeSteps.forEach(s => s.style.opacity = '0.65');
      step.style.opacity = '1';
    });
    step.addEventListener('mouseleave', () => {
      bridgeSteps.forEach(s => s.style.opacity = '1');
    });
  });

  /* ─── DIAGNOSTIC CARD COUNTER ANIMATION ─── */
  const dscStats = document.querySelectorAll('.dsc-stat strong');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (document.querySelector('.diagnostic-system-card')) {
    statsObserver.observe(document.querySelector('.diagnostic-system-card'));
  }

  function animateStats() {
    dscStats.forEach(stat => {
      const text = stat.textContent.trim();
      const numMatch = text.match(/\d+/);
      if (numMatch) {
        const target = parseInt(numMatch[0]);
        const prefix = text.replace(/\d+/, '').replace(/[0-9]/g, '');
        let start = 0;
        const duration = 1200;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          stat.textContent = Math.round(eased * target) + (prefix || '');
          if (progress < 1) requestAnimationFrame(step);
          else stat.textContent = text; // restore original
        };
        requestAnimationFrame(step);
      }
    });
  }

  /* ─── PROBLEM CARDS STAGGER ─── */
  const problemCards = document.querySelectorAll('.problem-card');
  const problemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        problemObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  problemCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity .5s ease, transform .5s ease';
    problemObserver.observe(card);
  });

  /* ─── ACTIVE NAV LINK ON SCROLL ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksList.forEach(link => {
          link.style.color = '';
          link.style.fontWeight = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--red)';
            link.style.fontWeight = '700';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── CTA BUTTON RIPPLE ─── */
  document.querySelectorAll('.btn-primary, .btn-primary-light').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: rippleFade .6s linear;
        background: rgba(255,255,255,.3);
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
        left: ${e.clientX - this.getBoundingClientRect().left}px;
        top:  ${e.clientY - this.getBoundingClientRect().top}px;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* Add ripple keyframe dynamically */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleFade {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ─── DIAGNOSTIC MODAL ─── */
  const modal = document.getElementById('diagModal');
  const modalClose = document.getElementById('diagModalClose');
  const progressBar = document.getElementById('diagProgressBar');
  const submitBtn = document.getElementById('diagSubmitBtn');
  const successWA = document.getElementById('diagSuccessWA');
  const closeSuccess = document.getElementById('diagCloseSuccess');
  const biztypeSelect = document.getElementById('diag-biztype');
  const biztypeOtro = document.getElementById('diagBiztypeOtro');
  const countrySelect = document.getElementById('diag-country');
  const phonePrefix = document.getElementById('diagPhonePrefix');
  const phoneGroup = document.getElementById('diagPhoneGroup');
  const phoneInput = document.getElementById('diag-phone');

  // ─ Phone rules per country ─
  const PHONE_RULES = {
    PE: { regex: /^9\d{8}$/, placeholder: '999 000 000', hint: '9 dígitos, empieza con 9' },
    MX: { regex: /^\d{10}$/, placeholder: '55 1234 5678', hint: '10 dígitos' },
    AR: { regex: /^\d{10}$/, placeholder: '11 1234 5678', hint: '10 dígitos' },
    CO: { regex: /^3\d{9}$/, placeholder: '310 123 4567', hint: '10 dígitos, empieza con 3' },
    CL: { regex: /^9\d{8}$/, placeholder: '9 1234 5678', hint: '9 dígitos, empieza con 9' },
    ES: { regex: /^[67]\d{8}$/, placeholder: '612 345 678', hint: '9 dígitos, empieza con 6 o 7' },
    US: { regex: /^\d{10}$/, placeholder: '212 555 1234', hint: '10 dígitos' },
    VE: { regex: /^0?4\d{9}$/, placeholder: '0412 123 4567', hint: '11 dígitos, empieza con 04' },
    EC: { regex: /^0?9\d{8}$/, placeholder: '09 1234 5678', hint: '9-10 dígitos, empieza con 09' },
    BO: { regex: /^[67]\d{7}$/, placeholder: '71234567', hint: '8 dígitos, empieza con 6 o 7' },
    PY: { regex: /^09\d{8}$/, placeholder: '0981 234 567', hint: '10 dígitos, empieza con 09' },
    UY: { regex: /^09\d{7}$/, placeholder: '094 123 456', hint: '9 dígitos, empieza con 09' },
    PA: { regex: /^\d{8}$/, placeholder: '6123 4567', hint: '8 dígitos' },
    CR: { regex: /^[67]\d{7}$/, placeholder: '6123 4567', hint: '8 dígitos, empieza con 6 o 7' },
    GT: { regex: /^\d{8}$/, placeholder: '1234 5678', hint: '8 dígitos' },
    SV: { regex: /^7\d{7}$/, placeholder: '7123 4567', hint: '8 dígitos, empieza con 7' },
    HN: { regex: /^\d{8}$/, placeholder: '9123 4567', hint: '8 dígitos' },
    NI: { regex: /^\d{8}$/, placeholder: '8123 4567', hint: '8 dígitos' },
    BR: { regex: /^\d{11}$/, placeholder: '11 91234 5678', hint: '11 dígitos' },
    DO: { regex: /^\d{10}$/, placeholder: '809 123 4567', hint: '10 dígitos' },
    OTHER: { regex: /^\d{6,15}$/, placeholder: '1234567890', hint: 'Solo números' }
  };

  let currentStep = 1;
  const TOTAL_STEPS = 3;

  // ─ Open / Close helpers ─
  function openModal() {
    modal.classList.add('diag-modal--open');
    document.body.style.overflow = 'hidden';
    // Reset to step 1
    goToStep(1);
    // Clear inputs
    modal.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(el => el.value = '');
    modal.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => el.checked = false);
    modal.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
    hideAllErrors();
    biztypeOtro.style.display = 'none';
    // Reset phone prefix to Peru default
    if (phonePrefix) phonePrefix.textContent = '+51';
    // Hide success, show step 1
    document.getElementById('diagSuccess').classList.add('diag-step--hidden');
    document.getElementById('diagStep1').classList.remove('diag-step--hidden');
  }

  function closeModal() {
    modal.classList.remove('diag-modal--open');
    document.body.style.overflow = '';
  }

  // ─ Step navigation ─
  function goToStep(step) {
    // Hide all steps
    [1, 2, 3].forEach(n => {
      const el = document.getElementById(`diagStep${n}`);
      if (el) el.classList.add('diag-step--hidden');
    });
    // Show target
    const target = document.getElementById(`diagStep${step}`);
    if (target) target.classList.remove('diag-step--hidden');
    currentStep = step;
    progressBar.style.width = `${(step / TOTAL_STEPS) * 100}%`;
    // Scroll modal scroll area to top
    document.querySelector('.diag-modal-scroll').scrollTop = 0;
  }

  // ─ Validation helpers ─
  function showError(inputId, errId) {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (inp) inp.classList.add('diag-input--error');
    if (err) err.classList.add('diag-error--visible');
  }

  function clearError(inputId, errId) {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (inp) inp.classList.remove('diag-input--error');
    if (err) err.classList.remove('diag-error--visible');
  }

  function hideAllErrors() {
    modal.querySelectorAll('.diag-field-error').forEach(e => e.classList.remove('diag-error--visible'));
    modal.querySelectorAll('.diag-input--error').forEach(e => e.classList.remove('diag-input--error'));
  }

  function validateStep1() {
    let valid = true;
    const country = document.getElementById('diag-country');
    const name = document.getElementById('diag-name');
    const email = document.getElementById('diag-email');
    const phone = document.getElementById('diag-phone');

    if (!country.value) { showError('diag-country', 'err-country'); valid = false; }
    else clearError('diag-country', 'err-country');

    if (!name.value.trim()) { showError('diag-name', 'err-name'); valid = false; }
    else clearError('diag-name', 'err-name');

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRx.test(email.value)) { showError('diag-email', 'err-email'); valid = false; }
    else clearError('diag-email', 'err-email');

    // Phone: only digits, validated per country
    const rawPhone = phone.value.replace(/\s/g, '');
    const countryKey = country.value || 'OTHER';
    const rule = PHONE_RULES[countryKey] || PHONE_RULES['OTHER'];
    const errPhone = document.getElementById('err-phone');

    if (!rawPhone) {
      if (phoneGroup) phoneGroup.classList.add('diag-input--error');
      if (errPhone) { errPhone.textContent = 'Ingresa tu número de contacto'; errPhone.classList.add('diag-error--visible'); }
      valid = false;
    } else if (!rule.regex.test(rawPhone)) {
      if (phoneGroup) phoneGroup.classList.add('diag-input--error');
      if (errPhone) { errPhone.textContent = `Número inválido (${rule.hint})`; errPhone.classList.add('diag-error--visible'); }
      valid = false;
    } else {
      if (phoneGroup) phoneGroup.classList.remove('diag-input--error');
      if (errPhone) errPhone.classList.remove('diag-error--visible');
    }

    return valid;
  }

  function validateStep2() {
    let valid = true;
    const biztype = document.getElementById('diag-biztype');
    const team = document.querySelector('input[name="equipo"]:checked');
    const problema = document.querySelectorAll('input[name="problema"]:checked');
    const herramientas = document.querySelectorAll('input[name="herramientas"]:checked');

    if (!biztype.value) {
      biztype.classList.add('diag-input--error');
      document.getElementById('err-biztype').classList.add('diag-error--visible');
      valid = false;
    } else {
      biztype.classList.remove('diag-input--error');
      document.getElementById('err-biztype').classList.remove('diag-error--visible');
    }

    if (!team) {
      document.getElementById('err-team').classList.add('diag-error--visible');
      valid = false;
    } else {
      document.getElementById('err-team').classList.remove('diag-error--visible');
    }

    if (problema.length === 0) {
      document.getElementById('err-problema').classList.add('diag-error--visible');
      valid = false;
    } else {
      document.getElementById('err-problema').classList.remove('diag-error--visible');
    }

    if (herramientas.length === 0) {
      document.getElementById('err-herramientas').classList.add('diag-error--visible');
      valid = false;
    } else {
      document.getElementById('err-herramientas').classList.remove('diag-error--visible');
    }

    return valid;
  }

  function validateStep3() {
    let valid = true;
    const goal = document.getElementById('diag-goal');
    const stage = document.querySelector('input[name="etapa"]:checked');

    if (!goal.value.trim()) {
      goal.classList.add('diag-input--error');
      document.getElementById('err-goal').classList.add('diag-error--visible');
      valid = false;
    } else {
      goal.classList.remove('diag-input--error');
      document.getElementById('err-goal').classList.remove('diag-error--visible');
    }

    if (!stage) {
      document.getElementById('err-stage').classList.add('diag-error--visible');
      valid = false;
    } else {
      document.getElementById('err-stage').classList.remove('diag-error--visible');
    }

    return valid;
  }

  // ─ Event: Open modal via CTA buttons ─
  function interceptCTAs() {
    const ctaSelectors = [
      '#hero-cta', '#nav-cta', '#diag-cta',
      '#final-cta-btn', '.nav-cta'
    ];
    ctaSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (btn.getAttribute('href') === '#contacto' || btn.getAttribute('href') === 'mailto:contacto@ebeatspe.com') {
            e.preventDefault();
            openModal();
          }
        });
      });
    });

    // Also intercept all "solicitar diagnóstico" anchors pointing to #contacto
    document.querySelectorAll('a[href="#contacto"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });
  }
  interceptCTAs();

  // ─ Event: Close ─
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('diag-modal--open')) closeModal();
  });

  // ─ Event: Next buttons ─
  modal.querySelectorAll('.diag-next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next);
      if (currentStep === 1 && !validateStep1()) return;
      if (currentStep === 2 && !validateStep2()) return;
      goToStep(nextStep);
    });
  });

  // ─ Event: Prev buttons ─
  modal.querySelectorAll('.diag-prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev);
      goToStep(prevStep);
    });
  });

  // ─ Event: Biztype "Otros" reveal ─
  if (biztypeSelect) {
    biztypeSelect.addEventListener('change', () => {
      if (biztypeSelect.value === 'otros') {
        biztypeOtro.style.display = 'block';
        // Auto-scroll the modal to reveal the field and focus it
        requestAnimationFrame(() => {
          const otroInput = document.getElementById('diag-biztype-other');
          if (otroInput) {
            setTimeout(() => {
              otroInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              otroInput.focus();
            }, 50);
          }
        });
      } else {
        biztypeOtro.style.display = 'none';
        const otroInput = document.getElementById('diag-biztype-other');
        if (otroInput) otroInput.value = '';
      }
    });
  }

  // ─ Event: Country → phone prefix + placeholder ─
  if (countrySelect && phonePrefix) {
    countrySelect.addEventListener('change', () => {
      const selected = countrySelect.options[countrySelect.selectedIndex];
      const dial = selected?.getAttribute('data-dial') || '+';
      phonePrefix.textContent = dial;
      // Update placeholder for the country
      const rule = PHONE_RULES[countrySelect.value] || PHONE_RULES['OTHER'];
      if (phoneInput) phoneInput.placeholder = rule.placeholder;
      // Clear errors
      clearError('diag-country', 'err-country');
      if (phoneGroup) phoneGroup.classList.remove('diag-input--error');
      const errPhone = document.getElementById('err-phone');
      if (errPhone) errPhone.classList.remove('diag-error--visible');
    });
  }

  // ─ Block non-numeric input in phone field ─
  if (phoneInput) {
    phoneInput.addEventListener('keypress', (e) => {
      if (!/[\d\s]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
    phoneInput.addEventListener('input', () => {
      // Remove any non-digit characters (handles paste)
      const cleaned = phoneInput.value.replace(/[^\d]/g, '');
      phoneInput.value = cleaned;
      // Live validate
      if (cleaned) {
        const countryKey = countrySelect?.value || 'OTHER';
        const rule = PHONE_RULES[countryKey] || PHONE_RULES['OTHER'];
        if (rule.regex.test(cleaned)) {
          if (phoneGroup) phoneGroup.classList.remove('diag-input--error');
          const errPhone = document.getElementById('err-phone');
          if (errPhone) errPhone.classList.remove('diag-error--visible');
        }
      }
    });
  }

  // ─ Live field validation ─
  ['diag-name', 'diag-email', 'diag-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const errMap = { 'diag-name': 'err-name', 'diag-email': 'err-email', 'diag-phone': 'err-phone' };
        if (el.value.trim()) clearError(id, errMap[id]);
      });
    }
  });

  // ─ Event: Submit ─
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      // Validate step 3 before submitting
      if (!validateStep3()) return;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="animation:spin .8s linear infinite">
          <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" opacity=".3"/>
          <path d="M12 2a10 10 0 0110 10" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Enviando...
      `;

      // Add spin keyframe if needed
      if (!document.getElementById('diagSpinStyle')) {
        const ss = document.createElement('style');
        ss.id = 'diagSpinStyle';
        ss.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(ss);
      }

      // Simulate async send (replace with real fetch/FormSubmit if needed)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Enviar solicitud <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        // Hide step 3, show success
        document.getElementById('diagStep3').classList.add('diag-step--hidden');
        const success = document.getElementById('diagSuccess');
        success.classList.remove('diag-step--hidden');
        progressBar.style.width = '100%';
        document.querySelector('.diag-modal-scroll').scrollTop = 0;
      }, 1400);
    });
  }

  // ─ Event: Close from success screen ─
  if (closeSuccess) closeSuccess.addEventListener('click', closeModal);

  /* ─── WHATSAPP FLOATING BUTTON: hide when CTA WA is visible ─── */
  const waFloat = document.getElementById('waFloat');
  const finalWaBtn = document.getElementById('final-cta-wa');

  if (waFloat && finalWaBtn) {
    const waObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          waFloat.classList.add('wa-float--hidden');
        } else {
          waFloat.classList.remove('wa-float--hidden');
        }
      });
    }, { threshold: 0.3 });

    waObserver.observe(finalWaBtn);
  }

  /* ─── HERO TYPEWRITER ─── */
  const typewriterEl = document.getElementById('hero-typewriter');
  if (typewriterEl) {
    const phrases = [
      'más rápido',
      'con menos esfuerzo',
      'con inteligencia artificial',
      'sin contratar más personal'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPING_SPEED = 55;   // ms por carácter al escribir
    const DELETING_SPEED = 28;   // ms por carácter al borrar
    const PAUSE_AFTER = 2200; // ms de pausa al terminar de escribir
    const PAUSE_BEFORE = 350;  // ms de pausa antes de empezar a borrar

    function tick() {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        // Escribiendo
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);

        if (charIndex === current.length) {
          // Terminó de escribir → esperar y luego borrar
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPING_SPEED);
      } else {
        // Borrando
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);

        if (charIndex === 0) {
          // Terminó de borrar → siguiente frase
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, PAUSE_BEFORE);
          return;
        }
        setTimeout(tick, DELETING_SPEED);
      }
    }

    // Arrancar casi de inmediato
    setTimeout(tick, 400);
  }

});
