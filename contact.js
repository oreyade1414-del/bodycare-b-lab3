(() => {
  'use strict';
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const birthdate = document.getElementById('birthdate');
  const today = new Date();
  birthdate.max = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  const requestedSubject = new URLSearchParams(location.search).get('subject');
  const selected = requestedSubject === 'recruit' ? '採用応募' : '独立支援について';
  [...form.elements.subject].forEach(input => { input.checked = input.value === selected; });
  const updateSubject = () => { document.getElementById('emailSubject').value = '【B-LAB】' + form.elements.subject.value; };
  [...form.elements.subject].forEach(input => input.addEventListener('change', updateSubject));
  updateSubject();
  const endpoint = window.BLAB_CONTACT_CONFIG?.endpoint;
  if (endpoint) {
    try {
      const url = new URL(endpoint);
      if (url.protocol === 'https:' && url.hostname === 'formsubmit.co') form.action = url.href;
    } catch {}
  }
  form.addEventListener('submit', event => {
    if (!form.reportValidity()) { event.preventDefault(); return; }
    if (!form.elements.name.value.trim() || !form.elements.message.value.trim()) {
      event.preventDefault();
      status.dataset.state = 'error';
      status.textContent = '名前と本文を入力してください。';
      return;
    }
    if (form.elements._honey.value) { event.preventDefault(); return; }
    updateSubject();
    // The browser posts to FormSubmit, which handles CAPTCHA, activation and results.
    // Never show a success message locally before the service accepts the submission.
  });
})();
