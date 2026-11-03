'use strict';

const themeButton = document.getElementById('theme-toggle');
const menuButton = document.getElementById('menu-toggle');
const navigation = document.getElementById('nav-links');

function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('homepage-theme', theme); } catch {}
  syncThemeButton();
});

function closeMenu() {
  navigation.dataset.open = 'false';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.dataset.open = String(open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 721px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.getElementById('year').textContent = new Date().getFullYear();

// Reveal each content block once, as it scrolls into view.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;

function prepareScrollReveals() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = null;
    document.querySelectorAll('.scroll-reveal').forEach(node => node.classList.add('is-visible'));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });
  }

  const targets = '.portrait, .hero-copy, .section > h2, .section .empty-state, .research-area, .entry, .timeline > li, .skill-item';
  document.querySelectorAll(targets).forEach(node => {
    if (node.classList.contains('scroll-reveal')) return;
    node.classList.add('scroll-reveal');
    if (node.matches('.hero-copy, .empty-state')) node.style.setProperty('--reveal-delay', '100ms');
    revealObserver.observe(node);
  });
}

reducedMotion.addEventListener('change', prepareScrollReveals);
prepareScrollReveals();

// Content is always inserted as text. Only supported URL protocols become links.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = String(text);
  return node;
}
function safeURL(value, image = false) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, document.baseURI);
    const protocols = image ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:'];
    return protocols.includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function link(label, value, className) {
  const href = safeURL(value);
  if (!href) return element('span', className, label);
  const node = element('a', className, label);
  node.href = href;
  if (new URL(href).origin !== location.origin && !href.startsWith('mailto:')) {
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
  }
  return node;
}
function contentList(value) {
  return Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : [];
}
function renderLinks(items, className = 'entry-links') {
  const row = element('div', className);
  for (const item of contentList(items)) {
    if (!item.label || !safeURL(item.url)) continue;
    const anchor = link(item.label, item.url, className === 'profile-links' ? 'pill' : '');
    if (item.newTab) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    row.append(anchor);
  }
  return row;
}
function renderProfile(profile) {
  if (profile.name) {
    document.querySelectorAll('[data-name]').forEach(node => { node.textContent = profile.name; });
    document.title = profile.name;
    document.querySelector('meta[name="description"]').content = profile.description || `${profile.name}'s personal homepage.`;
  }
  for (const [id, value] of [['name-chinese', profile.nameChinese], ['tagline', profile.tagline]]) {
    const node = document.getElementById(id);
    node.textContent = value || '';
    node.hidden = !value;
  }
  if (Array.isArray(profile.bio) && profile.bio.some(paragraph => typeof paragraph === 'string' && paragraph.trim())) {
    const paragraphs = profile.bio.filter(paragraph => typeof paragraph === 'string' && paragraph.trim());
    document.getElementById('biography').replaceChildren(...paragraphs.map(text => element('p', '', text)));
  }
  const photoURL = safeURL(profile.photo, true);
  const existingPhoto = document.querySelector('#portrait img');
  if (photoURL && (!existingPhoto || existingPhoto.src !== photoURL)) {
    const photo = element('img');
    photo.alt = profile.photoAlt || profile.name || 'Profile photo';
    photo.width = 420;
    photo.height = 504;
    photo.addEventListener('load', () => {
      document.getElementById('portrait').replaceChildren(photo);
    }, { once: true });
    photo.src = photoURL;
  }
  document.getElementById('profile-links').replaceChildren(...renderLinks(profile.links, 'profile-links').childNodes);
  document.getElementById('footer-links').replaceChildren(...renderLinks(profile.links).childNodes);
}
function renderResearch(items) {
  if (!items.length) return;
  const cards = items.map(item => {
    const card = element('article', 'research-area');
    const title = element('h3');
    title.append(link(item.title || '', item.url));
    card.append(title);
    if (item.description) card.append(element('p', '', item.description));
    if (item.links) card.append(renderLinks(item.links));
    return card;
  });
  document.getElementById('research-content').replaceChildren(...cards);
}
function timeline(items) {
  const list = element('ul', 'timeline');
  for (const item of items) {
    const row = element('li');
    const date = element('span', 'entry-date', item.date || '');
    const body = element('div');
    const text = element('p');
    text.append(link(item.text || item.title || '', item.url));
    body.append(text);
    row.append(date, body);
    list.append(row);
  }
  return list;
}
function renderNews(items) {
  if (!items.length) return;
  const container = document.getElementById('news-content');
  container.replaceChildren(timeline(items.slice(0, 4)));
  if (items.length > 4) {
    const details = element('details', 'earlier-news');
    details.append(element('summary', '', `Earlier updates (${items.length - 4})`), timeline(items.slice(4)));
    container.append(details);
  }
}
function renderEntries(id, items) {
  if (!items.length) return;
  const entries = items.map(item => {
    const entry = element('article', 'entry');
    if (item.id) entry.id = item.id;
    const heading = element('div', 'entry-heading');
    const title = element('h3');
    title.append(link(item.title || '', item.url));
    heading.append(title);
    if (item.period) heading.append(element('span', 'entry-period', item.period));
    entry.append(heading);
    if (item.role) entry.append(element('p', 'entry-role', item.role));
    if (item.authors) {
      const authors = element('p', 'authors');
      const name = document.querySelector('[data-name]').textContent;
      String(item.authors).split(name).forEach((part, index) => {
        if (index) authors.append(element('strong', '', name));
        authors.append(document.createTextNode(part));
      });
      entry.append(authors);
    }
    if (item.venue) entry.append(element('p', 'venue', item.venue));
    if (item.highlight) entry.append(element('p', 'entry-highlight', item.highlight));
    if (item.description) entry.append(element('p', 'description', item.description));
    if (Array.isArray(item.bullets)) {
      const list = element('ul', 'entry-bullets');
      item.bullets.filter(text => typeof text === 'string' && text.trim()).forEach(text => list.append(element('li', '', text)));
      entry.append(list);
    }
    if (item.links) entry.append(renderLinks(item.links));
    return entry;
  });
  document.getElementById(id).replaceChildren(...entries);
}

function renderSkills(items) {
  const entries = items.map(item => {
    const entry = element('div', 'skill-item');
    entry.append(element('h3', '', item.title || ''));
    const values = Array.isArray(item.items) ? item.items.filter(value => typeof value === 'string') : [];
    entry.append(element('p', '', values.join(' · ')));
    return entry;
  });
  document.getElementById('skills-content').replaceChildren(...entries);
}

fetch('content.json')
  .then(response => {
    if (!response.ok) throw new Error(`Content request failed (${response.status})`);
    return response.json();
  })
  .then(data => {
    renderProfile(data.profile || {});
    renderResearch(contentList(data.research));
    renderNews(contentList(data.news));
    renderEntries('publications-content', contentList(data.publications));
    renderEntries('projects-content', contentList(data.projects));
    renderEntries('experience-content', contentList(data.experience));
    renderEntries('education-content', contentList(data.education));
    renderEntries('service-content', contentList(data.service));
    renderSkills(contentList(data.skills));
    prepareScrollReveals();
  })
  .catch(error => {
    console.error('Unable to load homepage content:', error);
    document.getElementById('content-error').hidden = false;
  });

if ('IntersectionObserver' in window) {
  const anchors = [...navigation.querySelectorAll('a')];
  const visible = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target.id, entry));
    const current = [...visible.values()].filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    anchors.forEach(anchor => {
      if (current && anchor.hash === `#${current.target.id}`) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });
  }, { rootMargin: '-80px 0px -35% 0px', threshold: 0 });
  document.querySelectorAll('main section').forEach(section => observer.observe(section));
}
