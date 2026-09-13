(() => {
  const hero = document.querySelector('.hero');
  const video = document.getElementById('heroVideo');
  if (!hero || !video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let failed = false;
  const allowed = () => !reduced.matches && !navigator.connection?.saveData && !failed;
  function sync() {
    if (!allowed()) {
      video.pause();
      hero.classList.remove('hero-video-ready');
      return;
    }
    if (!visible || document.hidden) { video.pause(); return; }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    video.play().catch(() => {
      hero.classList.remove('hero-video-ready');
    });
  }
  video.addEventListener('playing', () => {
    hero.classList.add('hero-video-ready');
  });
  video.addEventListener('error', () => { failed = true; sync(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
})();
