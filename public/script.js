const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

document.getElementById('signup-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('form-note').textContent = 'Thanks for standing with Paul Lopez. This demo form is ready to connect to your campaign email service.';
});
