import { translations } from './i18n.js';

const CONFIG = {
  // Set to true to show the availability badge, false to hide it
  isAvailableForWork: false 
};

function init() {
  // --- Internationalization (i18n) Logic ---
  let currentLang = localStorage.getItem('lang');
  if (!currentLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
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

  // --- Availability Badge Toggle ---
  const availabilityBadge = document.getElementById('availability-badge');
  if (availabilityBadge && !CONFIG.isAvailableForWork) {
    availabilityBadge.style.display = 'none';
  }

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });

  // --- Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
