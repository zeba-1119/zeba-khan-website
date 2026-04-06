/* =============================================
   ZEBA KHAN — PERSONAL BRAND SITE
   main.js — Shared JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     NAV — Scroll shadow
  ------------------------------------------ */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  /* ------------------------------------------
     NAV — Mobile menu toggle
  ------------------------------------------ */
  const toggle     = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on any link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------
     NAV — Active link highlighting
  ------------------------------------------ */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const [linkFile, linkHash] = href.split('#');
    const linkFilename = linkFile.split('/').pop();

    if (linkFilename === currentFile) {
      // If link has a hash, only mark active if hash also matches
      if (!linkHash || (currentHash && '#' + linkHash === currentHash)) {
        link.classList.add('active');
      } else if (!linkHash) {
        link.classList.add('active');
      }
    }
  });

  /* ------------------------------------------
     Contact form — Formspree AJAX
  ------------------------------------------ */
  const form = document.querySelector('.js-contact-form');
  if (form) {
    const statusMsg = document.querySelector('.js-form-status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          submitBtn.textContent = 'Message Sent';
          if (statusMsg) {
            statusMsg.textContent = 'Thank you — I\'ll be in touch within 48 hours.';
            statusMsg.style.color = '#1B3557';
          }
        } else {
          throw new Error('Server error');
        }
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit →';
        if (statusMsg) {
          statusMsg.textContent = 'Something went wrong. Please try again or email me directly.';
          statusMsg.style.color = '#8B3A52';
        }
      }
    });
  }

  /* ------------------------------------------
     Smooth anchor scrolling with nav offset
  ------------------------------------------ */
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const id = href.slice(hashIndex + 1);
      const target = document.getElementById(id);
      if (!target) return;

      // Only intercept if on same page
      const linkFile = href.slice(0, hashIndex);
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      if (linkFile && linkFile !== currentFile) return;

      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
