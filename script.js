'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
const params = new URLSearchParams(window.location.search);
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#product-search');
if (search) {
  const cards = [...document.querySelectorAll('.product-card')];
  const validCategories = filters.map(button => button.dataset.filter);
  let category = validCategories.includes(params.get('category')) ? params.get('category') : 'all';
  const update = () => {
    const term = search.value.trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const visible = (category === 'all' || card.dataset.category === category) && card.dataset.search.includes(term);
      card.hidden = !visible;
      if (visible) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    document.querySelector('#product-count').textContent = `${count} ${count === 1 ? 'example' : 'examples'} shown`;
    document.querySelector('#empty-results').hidden = count !== 0;
  };
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  search.addEventListener('input', update);
  document.querySelector('#reset-search').addEventListener('click', () => { category = 'all'; search.value = ''; update(); search.focus(); });
  update();
}
const form = document.querySelector('#inquiry-form');
if (form) {
  const interest = document.querySelector('#interest');
  if ([...interest.options].some(option => option.value === params.get('interest'))) interest.value = params.get('interest');
  let downloadUrl;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    if (!String(values.get('name')).trim() || String(values.get('message')).trim().length < 10) {
      document.querySelector('#form-status').textContent = 'Please enter your name and a message of at least 10 non-blank characters.';
      return;
    }
    const text = `ELITE TECH OUTLET — INQUIRY DRAFT\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nInterest: ${interest.options[interest.selectedIndex].text}\nBudget: ${values.get('budget') || 'Not specified'}\n\nMessage:\n${values.get('message')}\n\nCreated locally by the demonstration website. No message has been sent.\n`;
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Elite_Tech_Outlet_Inquiry.txt';
    link.textContent = 'Download your inquiry file';
    const status = document.querySelector('#form-status');
    status.replaceChildren('Your inquiry draft is ready. ', link, '. No message was sent.');
  });
}
