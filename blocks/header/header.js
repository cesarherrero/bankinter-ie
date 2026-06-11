import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
const FALLBACK_NAV_ITEMS = [
  { label: 'About us', href: '/personal/about-us' },
  { label: 'Save and Invest', href: '/personal/save-and-invest' },
  { label: 'Our Lending Products', href: '/personal/lend' },
  { label: 'Support', href: '/personal/support' },
];
const FALLBACK_TOOL_ITEMS = [
  { label: 'Fixed term deposit accounts', href: '/personal/save-and-invest/fixed-term-deposit-account', tone: 'secondary' },
  { label: 'Customer log in', href: '/personal/log-in', tone: 'primary' },
];

function titleizeSegment(segment) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function isBankinterNav(fragment) {
  if (!fragment) return false;
  const text = fragment.textContent.replace(/\s+/g, ' ').trim();
  return text.includes('Bankinter') && !text.includes('Examples') && !text.includes('Getting Started');
}

function createSearchIcon() {
  const wrap = document.createElement('span');
  wrap.className = 'nav-bankinter-search-icon';
  wrap.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16L21 21"></path></svg>';
  return wrap;
}

function createBreadcrumb() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;

  const nav = document.createElement('nav');
  nav.className = 'nav-bankinter-breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const homeLink = document.createElement('a');
  homeLink.href = '/personal/home';
  homeLink.textContent = 'Home';
  nav.append(homeLink);

  const current = document.createElement('span');
  current.textContent = titleizeSegment(parts[parts.length - 1]);
  nav.append(current);
  return nav;
}

function createHeaderFallback() {
  const container = document.createElement('div');
  container.className = 'nav-bankinter-fallback';

  const utility = document.createElement('div');
  utility.className = 'nav-bankinter-utility';

  const utilityInner = document.createElement('div');
  utilityInner.className = 'nav-bankinter-utility-inner';

  const segment = document.createElement('span');
  segment.className = 'nav-bankinter-segment';
  segment.textContent = 'Personal';

  const actions = document.createElement('div');
  actions.className = 'nav-bankinter-actions';

  const search = document.createElement('a');
  search.className = 'nav-bankinter-search';
  search.href = '/personal/search';
  search.setAttribute('aria-label', 'Search');
  search.append(createSearchIcon());
  actions.append(search);

  FALLBACK_TOOL_ITEMS.forEach(({ label, href, tone }) => {
    const link = document.createElement('a');
    link.className = `nav-bankinter-action nav-bankinter-action-${tone}`;
    link.href = href;
    link.textContent = label;
    actions.append(link);
  });

  utilityInner.append(segment, actions);
  utility.append(utilityInner);

  const main = document.createElement('div');
  main.className = 'nav-bankinter-main';

  const mainInner = document.createElement('div');
  mainInner.className = 'nav-bankinter-main-inner';

  const brand = document.createElement('a');
  brand.className = 'nav-bankinter-brand';
  brand.href = '/personal/home';
  brand.textContent = 'bankinter.';

  const sections = document.createElement('nav');
  sections.className = 'nav-bankinter-sections';
  sections.setAttribute('aria-label', 'Primary navigation');

  FALLBACK_NAV_ITEMS.forEach(({ label, href }) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (window.location.pathname === href) link.setAttribute('aria-current', 'page');
    sections.append(link);
  });

  mainInner.append(brand, sections);
  main.append(mainInner);

  const breadcrumb = createBreadcrumb();
  container.append(utility, main);
  if (breadcrumb) container.append(breadcrumb);
  return container;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!isBankinterNav(fragment)) {
    block.replaceChildren(createHeaderFallback());
    return;
  }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
