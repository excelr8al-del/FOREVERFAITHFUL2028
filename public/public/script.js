const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
menu.addEventListener('click', () => { const expanded = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(expanded)); nav.classList.toggle('open', expanded); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
const dialog = document.querySelector('#privacy-dialog');
document.querySelector('#privacy-open').addEventListener('click', () => dialog.showModal());
document.querySelector('#privacy-close').addEventListener('click', () => dialog.close());
const form = document.querySelector('#join-form');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const button = form.querySelector('[type=submit]');
  const status = document.querySelector('#form-status');
  button.disabled = true; status.textContent = 'Submitting…';
  const data = new FormData(form);
  try {
    const response = await fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), consent: data.get('consent') === 'on', website: data.get('website') }), signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Signup is temporarily unavailable. Please try again later.');
    status.textContent = 'Thank you for standing with us. You’re on the campaign update list.'; form.reset();
  } catch (error) { status.textContent = error.name === 'TimeoutError' ? 'The request timed out. Please try again later.' : (error.message.startsWith('Unexpected') || error.message === 'Failed to fetch') ? 'Signup is temporarily unavailable. Please try again later.' : error.message; }
  finally { button.disabled = false; }
});
