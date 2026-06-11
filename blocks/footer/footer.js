import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_LINKS = [
  { label: 'Home', href: '/personal/home' },
  { label: 'Accessibility', href: '/personal/support/accessibility' },
  { label: 'Cookies', href: '#' },
  { label: 'Privacy notice', href: '/privacy-notice' },
  { label: 'Legal and regulatory', href: '/legal-and-regulatory' },
  { label: 'Site map', href: '/personal/site-map' },
  { label: 'FAQs', href: '/personal/faqs' },
  { label: 'Blog', href: '/personal/blogs' },
];

const FOOTER_COPY = [
  'Bankinter S.A., trading as Bankinter, is authorised by the Banco de Espana in Spain and is regulated by the Central Bank of Ireland for consumer protection rules.',
  'Registered in Spain: Madrid Mercantile Register (Registro Mercantil de Madrid), Volume 1857, Folio 220, Page 9643, Registered office: P. de la Castellana 29, 28046, Madrid, Spain. Registered Irish branch: Dublin Road, Carrick on Shannon, County Leitrim, no: 910258.',
  'Before proceeding, please read our terms of use, which apply to your use of this website.',
];

function isBankinterFooter(fragment) {
  if (!fragment) return false;
  const text = fragment.textContent.replace(/\s+/g, ' ').trim();
  return text.includes('Bankinter') && !text.includes('Adobe. All rights reserved.');
}

function createFooterFallback() {
  const footer = document.createElement('div');
  footer.className = 'footer-fallback';

  const brand = document.createElement('a');
  brand.className = 'footer-fallback-brand';
  brand.href = '/personal/home';
  brand.textContent = 'bankinter.';

  const nav = document.createElement('nav');
  nav.className = 'footer-fallback-nav';
  nav.setAttribute('aria-label', 'Footer links');

  const list = document.createElement('ul');
  list.className = 'footer-fallback-links';
  FOOTER_LINKS.forEach(({ label, href }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    item.append(link);
    list.append(item);
  });
  nav.append(list);

  const legal = document.createElement('div');
  legal.className = 'footer-fallback-legal';

  FOOTER_COPY.forEach((paragraphText, index) => {
    const paragraph = document.createElement('p');
    if (index === 2) {
      paragraph.append('Before proceeding, please read our ');
      const link = document.createElement('a');
      link.href = '/personal/legal-and-regulatory';
      link.textContent = 'terms of use';
      paragraph.append(link, ', which apply to your use of this website.');
    } else {
      paragraph.textContent = paragraphText;
    }
    legal.append(paragraph);
  });

  const copyright = document.createElement('p');
  copyright.className = 'footer-fallback-copy';
  copyright.textContent = '© BANKINTER S.A. ALL RIGHTS RESERVED';
  legal.append(copyright);

  footer.append(brand, nav, legal);
  return footer;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  if (isBankinterFooter(fragment)) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  } else {
    footer.append(createFooterFallback());
  }

  block.append(footer);
}
