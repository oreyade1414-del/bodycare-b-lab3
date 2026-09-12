(() => {
  'use strict';
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submit = document.getElementById('submitButton');
  const birthdate = document.getElementById('birthdate');
  const today = new Date();
  birthdate.max = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  const subject = new URLSearchParams(location.search).get('subject');
  const selected = subject === 'recruit' ? '採用応募' : '独立支援について';
  [...form.elements.subject].forEach(input => { input.checked = input.value === selected; });
  const endpoint = window.BLAB_CONTACT_CONFIG?.endpoint || '';
  let ready = false;
  try { ready = new URL(endpoint).protocol === 'https:'; } catch {}
  if (ready) { submit.disabled = false; status.textContent = ''; }
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!ready || submitting) return;
    if (!form.reportValidity()) return;
    if (!form.elements.name.value.trim() || !form.elements.message.value.trim()) {
      status.dataset.state = 'error';
      status.textContent = '名前と本文を入力してください。';
      return;
    }
    if (form.elements._gotcha.value) return;
    submitting = true;
    submit.disabled = true;
    submit.textContent = '送信中…';
    status.dataset.state = '';
    status.textContent = '';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('Submission rejected');
      status.dataset.state = 'success';
      status.textContent = 'お問い合わせを受け付けました。ご入力のメールアドレスへご連絡いたします。';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = '送信の完了を確認できませんでした。入力内容は残っています。時間をおいて再度お試しください。';
    } finally {
      clearTimeout(timeout);
      submitting = false;
      submit.disabled = false;
      submit.textContent = '送信 →';
    }
  });
})();
