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
