import { translations } from './i18n.js';

function init() {
  // --- Internationalization (i18n) Logic ---
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = (urlParams.get('lang') || '').toLowerCase();

  let currentLang = localStorage.getItem('lang');
  if (urlLang === 'es' || urlLang === 'en') {
    currentLang = urlLang;
    localStorage.setItem('lang', currentLang);
  } else if (!currentLang) {
    const browserLang = navigator.language || '';
    currentLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function updateMobileMenuAriaLabel() {
    if (!mobileMenuBtn) return;
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    const ariaKey = isExpanded ? 'aria.closeMenu' : 'aria.openMenu';
    if (translations[ariaKey] && translations[ariaKey][currentLang]) {
      mobileMenuBtn.setAttribute('aria-label', translations[ariaKey][currentLang]);
    }
  }

  function updateTexts() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key] && translations[key][currentLang]) {
        el.innerHTML = translations[key][currentLang];
      }
    });

    const hrefElements = document.querySelectorAll('[data-i18n-href]');
    hrefElements.forEach(el => {
      const key = el.getAttribute('data-i18n-href');
      if (translations[key] && translations[key][currentLang]) {
        el.setAttribute('href', translations[key][currentLang]);
      }
    });

    // Update aria-label (and title when present) for accessibility elements
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (translations[key] && translations[key][currentLang]) {
        el.setAttribute('aria-label', translations[key][currentLang]);
        if (el.hasAttribute('title')) {
          el.setAttribute('title', translations[key][currentLang]);
        }
      }
    });

    updateMobileMenuAriaLabel();

    // Update document title and meta description
    if (translations['meta.title'] && translations['meta.title'][currentLang]) {
      document.title = translations['meta.title'][currentLang];
    }
    if (translations['meta.description'] && translations['meta.description'][currentLang]) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', translations['meta.description'][currentLang]);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', translations['meta.description'][currentLang]);
      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', translations['meta.description'][currentLang]);
    }

    // Update toggle button text
    const desktopLangText = document.getElementById('current-lang-desktop');
    const mobileLangText = document.getElementById('current-lang-mobile');
    const langText = currentLang === 'es' ? 'EN' : 'ES'; // show the language to switch TO
    if (desktopLangText) desktopLangText.textContent = langText;
    if (mobileLangText) mobileLangText.textContent = langText;

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
  }

  function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', currentLang);
    updateTexts();
  }

  const langToggleDesktop = document.getElementById('lang-toggle-desktop');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');

  if (langToggleDesktop) langToggleDesktop.addEventListener('click', toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

  // Apply translations on load
  updateTexts();

  // --- Theme Toggle Logic ---
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  const lightIconDesktop = document.getElementById('theme-toggle-light-icon-desktop');
  const darkIconDesktop = document.getElementById('theme-toggle-dark-icon-desktop');

  const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
  const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');

  function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      if (lightIconDesktop) lightIconDesktop.classList.remove('hidden');
      if (darkIconDesktop) darkIconDesktop.classList.add('hidden');
      if (lightIconMobile) lightIconMobile.classList.remove('hidden');
      if (darkIconMobile) darkIconMobile.classList.add('hidden');
    } else {
      if (lightIconDesktop) lightIconDesktop.classList.add('hidden');
      if (darkIconDesktop) darkIconDesktop.classList.remove('hidden');
      if (lightIconMobile) lightIconMobile.classList.add('hidden');
      if (darkIconMobile) darkIconMobile.classList.remove('hidden');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
  }

  if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', toggleTheme);
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }

  // Initialize icons state
  updateThemeIcons();

  // --- Mobile Menu Toggle ---
  function setMobileMenuOpen(open) {
    if (!mobileMenuBtn || !mobileMenu) return;
    mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      mobileMenu.classList.remove('hidden');
      if (menuIcon) menuIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
      if (menuIcon) menuIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
    updateMobileMenuAriaLabel();
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      setMobileMenuOpen(!isExpanded);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMobileMenuOpen(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        setMobileMenuOpen(false);
        mobileMenuBtn.focus();
      }
    });
  }

  // --- Consolidated Scroll Progress Bar & Back to Top Listener ---
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (progressBar) progressBar.style.width = scrolled + '%';

    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // --- Intersection Observer for Fade-In Scroll Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- Interactive Specialty Lenses (#skills) ---
  const lensButtons = document.querySelectorAll('.skill-lens-btn');
  const skillCards = document.querySelectorAll('#skills .skill-group');
  const skillsGrid = document.getElementById('skills-grid');
  const skillsStatus = document.getElementById('skills-filter-status');

  const LENS_ALIASES = {
    'all': 'all',
    'ai-ml': 'ai-ml',
    'ai': 'ai-ml',
    'ai-engineer': 'ai-ml',
    'ml': 'ai-ml',
    'ml-engineer': 'ai-ml',
    'data-scientist': 'ai-ml',
    'data-cloud': 'data-cloud',
    'data': 'data-cloud',
    'cloud': 'data-cloud',
    'software': 'software',
    'backend': 'software',
    'leadership': 'leadership',
    'tech-lead': 'leadership',
    'staff': 'leadership'
  };

  const GRID_CONFIG = {
    all: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'max-w-7xl'],
    3: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'max-w-5xl'],
    2: ['grid-cols-1', 'sm:grid-cols-2', 'max-w-3xl'],
    1: ['grid-cols-1', 'max-w-xl']
  };

  const ALL_GRID_CLASSES = [
    'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4',
    'max-w-xl', 'max-w-3xl', 'max-w-5xl', 'max-w-7xl'
  ];

  function applySkillLens(rawLens) {
    const activeLens = LENS_ALIASES[(rawLens || 'all').toLowerCase()] || 'all';

    lensButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-lens') === activeLens;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (isSelected) {
        btn.className = 'skill-lens-btn cursor-pointer px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 bg-brand-purple text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';
      } else {
        btn.className = 'skill-lens-btn cursor-pointer px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-purple dark:hover:border-brand-violet-light hover:text-brand-purple dark:hover:text-brand-violet-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';
      }
    });

    let visibleCount = 0;
    skillCards.forEach(card => {
      const domains = (card.getAttribute('data-domains') || '').split(/\s+/);
      const isMatch = activeLens === 'all' || domains.includes(activeLens);

      // Clean up legacy classes
      card.classList.remove('opacity-35', 'scale-[0.98]');

      if (isMatch) {
        visibleCount++;
        card.classList.remove('hidden');
        card.setAttribute('aria-hidden', 'false');
        card.classList.add('active'); // ensure reveal opacity is active

        // Re-trigger entrance transition
        card.classList.remove('skill-card-enter');
        void card.offsetWidth;
        card.classList.add('skill-card-enter');

        if (activeLens !== 'all') {
          card.classList.add('ring-2', 'ring-brand-purple/50', 'dark:ring-brand-violet-light/40');
        } else {
          card.classList.remove('ring-2', 'ring-brand-purple/50', 'dark:ring-brand-violet-light/40');
        }
      } else {
        card.classList.add('hidden');
        card.setAttribute('aria-hidden', 'true');
        card.classList.remove('ring-2', 'ring-brand-purple/50', 'dark:ring-brand-violet-light/40', 'skill-card-enter');
      }
    });

    // Adapt grid width and columns dynamically to center fewer cards
    if (skillsGrid) {
      skillsGrid.classList.remove(...ALL_GRID_CLASSES);
      const classesToAdd = activeLens === 'all'
        ? GRID_CONFIG.all
        : (GRID_CONFIG[visibleCount] || GRID_CONFIG.all);
      skillsGrid.classList.add(...classesToAdd);
    }

    // Accessible screen reader announcement
    if (skillsStatus) {
      if (activeLens === 'all') {
        skillsStatus.textContent = currentLang === 'es'
          ? 'Mostrando todas las habilidades y herramientas'
          : 'Showing all skills and tools';
      } else {
        skillsStatus.textContent = currentLang === 'es'
          ? `Filtro aplicado. Mostrando ${visibleCount} categorías de habilidades`
          : `Filter applied. Showing ${visibleCount} skill categories`;
      }
    }
  }

  lensButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLens = btn.getAttribute('data-lens') || 'all';
      const isAlreadyActive = btn.getAttribute('aria-pressed') === 'true';
      if (isAlreadyActive && targetLens !== 'all') {
        applySkillLens('all');
      } else {
        applySkillLens(targetLens);
      }
    });
  });

  const initialFocus = urlParams.get('focus') || urlParams.get('track') || urlParams.get('role');
  if (initialFocus && LENS_ALIASES[initialFocus.toLowerCase()]) {
    applySkillLens(initialFocus);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
