(() => {
  const hero = document.querySelector('.hero');
  const video = document.getElementById('heroVideo');
  const button = document.getElementById('heroVideoToggle');
  if (!hero || !video || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let visible = true;
  let failed = false;
  const allowed = () => !reduced.matches && !navigator.connection?.saveData && !failed;
  function sync() {
    if (!allowed()) {
      video.pause();
      hero.classList.remove('hero-video-ready');
      button.hidden = true;
      return;
    }
    if (!visible || document.hidden || userPaused) { video.pause(); return; }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    video.play().catch(() => {
      button.hidden = false;
      button.textContent = '背景動画を再生';
      button.setAttribute('aria-label', '背景動画を再生');
    });
  }
  video.addEventListener('playing', () => {
    hero.classList.add('hero-video-ready');
    button.hidden = false;
    button.textContent = '背景動画を停止';
    button.setAttribute('aria-label', '背景動画を停止');
  });
  video.addEventListener('error', () => { failed = true; sync(); });
  button.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) {
      video.pause();
      button.textContent = '背景動画を再生';
      button.setAttribute('aria-label', '背景動画を再生');
    } else sync();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
})();
