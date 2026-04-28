// Scroll reveal animation
const revealTargets = [
  '.ov-card', '.pillar', '.why-card', '.zone',
  '.arena-card', '.timeline__item', '.effect-card', '.bm',
  '.section__head', '.hub'
];

document.querySelectorAll(revealTargets.join(',')).forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav background opacity on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 20px -10px rgba(0,0,0,0.1)';
  } else {
    nav.style.boxShadow = 'none';
  }
}, { passive: true });

// Animate hero stats counter
const animateCount = (el, end, suffix = '') => {
  const duration = 1800;
  const startTime = performance.now();
  const numEnd = parseInt(end.replace(/,/g, ''));

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(numEnd * eased);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = end + suffix;
  };
  requestAnimationFrame(tick);
};

window.addEventListener('load', () => {
  document.querySelectorAll('.stat__num').forEach(el => {
    const text = el.innerHTML;
    const match = text.match(/^([\d,]+)(<span>.*<\/span>)?/);
    if (match) {
      const number = match[1];
      const suffix = match[2] || '';
      el.innerHTML = '0' + suffix;
      const numSpan = el.firstChild;
      animateCount({
        set textContent(v) {
          el.innerHTML = v.replace(/(\d+(,\d+)*)/, '$1') + suffix;
        }
      }, number);
    }
  });
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navBackdrop = document.getElementById('navBackdrop');

const closeMenu = () => {
  navToggle.classList.remove('is-open');
  navMenu.classList.remove('is-open');
  navBackdrop.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};
const openMenu = () => {
  navToggle.classList.add('is-open');
  navMenu.classList.add('is-open');
  navBackdrop.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
};

if (navToggle) {
  navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });
  navBackdrop.addEventListener('click', closeMenu);
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
}

// Back-to-top
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Contact form (Formspree AJAX submit)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        formStatus.classList.add('is-success');
        formStatus.textContent = '의견이 접수되었습니다. 감사합니다!';
        contactForm.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0]?.message || '전송에 실패했습니다.');
      }
    } catch (err) {
      formStatus.classList.add('is-error');
      formStatus.textContent = err.message || '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
