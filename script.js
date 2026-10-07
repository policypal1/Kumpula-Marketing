const header = document.getElementById('navbar');
const menuButton = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

function updateHeader() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.classList.remove('active');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const leadForm = document.getElementById('leadForm');
const formStatus = document.getElementById('formStatus');
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxspFvSuybmxFstfic3UUuv-tEsEEpHz383NtCse7B4TQIKEjksaNx-MHmmNb-3pO2hSg/exec';

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status show ${type}`;
}

if (leadForm) {
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = leadForm.querySelector('button[type="submit"]');
    const formData = new FormData(leadForm);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      name: data.name || '',
      business: data.business || '',
      email: data.email || '',
      phone: data.phone || '',
      currentSiteUrl: data.website || '',
      hasCurrentSite: data.website ? 'Yes' : 'Not provided',
      businessType: '',
      growthGoal: data.service || '',
      websiteScope: data.service || '',
      package: 'Kumpula Marketing Campaign Request',
      goals: data.service || '',
      notes: [
        '[Kumpula Marketing Website Lead]',
        `Service: ${data.service || 'Not provided'}`,
        `Monthly ad budget: ${data.budget || 'Not provided'}`,
        `Website: ${data.website || 'Not provided'}`,
        `Notes: ${data.notes || 'None'}`
      ].join(' | '),
      source: 'original-style-mobile-homepage',
      timestamp: new Date().toISOString()
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    showStatus('Sending your request...', 'success');

    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      leadForm.reset();
      showStatus('Request sent. I’ll review it and reach out directly.', 'success');
      submitButton.textContent = 'Request sent ✓';
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send my request <span>→</span>';
      }, 2800);
    } catch (error) {
      showStatus('Something went wrong. Please text or call (503) 569-4291.', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = 'Try again <span>→</span>';
    }
  });
}
