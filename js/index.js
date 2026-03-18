const tilForm = document.querySelector('#til-form');
const tilList = document.querySelector('#til-list');
const nav = document.querySelector('.top-nav');
const navLinks = document.querySelectorAll('.nav-links a');
const galleryImages = document.querySelectorAll('.gallery-grid img');

const DARK_MODE_KEY = 'til-dark-mode';

addInteractiveStyles();
setupTilForm();
setupDarkModeToggle();
setupGalleryModal();
setupSmoothScroll();
setupActiveNavSection();

function addInteractiveStyles() {
  const style = document.createElement('style');
  style.textContent = `
    body {
      transition: background 0.3s ease, color 0.3s ease;
    }

    body.dark-mode {
      background: #17181c;
      color: #f3f4f6;
    }

    body.dark-mode .hero {
      background: linear-gradient(180deg, #202228 0%, #17181c 100%);
    }

    body.dark-mode .top-nav,
    body.dark-mode .work-card,
    body.dark-mode .til-item,
    body.dark-mode .til-form,
    body.dark-mode .info-table th {
      background: #23262d;
      color: #f3f4f6;
      border-color: #3a3f4b;
    }

    body.dark-mode .content-section,
    body.dark-mode .info-table th,
    body.dark-mode .info-table td,
    body.dark-mode .top-nav {
      border-color: #3a3f4b;
    }

    body.dark-mode .nav-links a,
    body.dark-mode .profile-info h1,
    body.dark-mode .section-desc,
    body.dark-mode .work-info p,
    body.dark-mode .til-item p,
    body.dark-mode .profile-info .tagline,
    body.dark-mode footer,
    body.dark-mode .til-form label,
    body.dark-mode .info-table td {
      color: #d2d6dc;
    }

    body.dark-mode .til-form input,
    body.dark-mode .til-form textarea {
      background: #15171b;
      color: #f3f4f6;
      border-color: #4a5160;
    }

    body.dark-mode .profile-card {
      background: transparent;
    }

    body.dark-mode .profile-image {
      background: #2d313a;
      box-shadow: 0 0 0 4px rgba(115, 129, 156, 0.18);
    }

    .dark-mode-toggle {
      margin-left: 16px;
      padding: 8px 14px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.7);
      color: var(--font-default-color);
      font: inherit;
      font-size: 0.9rem;
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .dark-mode-toggle:hover {
      transform: translateY(-1px);
    }

    body.dark-mode .dark-mode-toggle {
      background: #15171b;
      color: #f3f4f6;
      border-color: #4a5160;
    }

    .nav-links a {
      transition: color 0.2s ease, transform 0.2s ease;
    }

    .nav-links a.active {
      color: var(--primary-color);
      font-weight: 700;
      transform: translateY(-1px);
    }

    .gallery-grid img {
      cursor: zoom-in;
    }

    .image-modal {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(15, 19, 16, 0.82);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
      z-index: 1000;
    }

    .image-modal.open {
      opacity: 1;
      visibility: visible;
    }

    .image-modal img {
      max-width: min(900px, 92vw);
      max-height: 82vh;
      border-radius: 18px;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
    }

    .image-modal button {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      font-size: 1.4rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .top-nav {
        flex-wrap: wrap;
        height: auto;
        padding-top: 12px;
        padding-bottom: 12px;
        gap: 10px;
      }

      .dark-mode-toggle {
        margin-left: 0;
      }
    }
  `;

  document.head.append(style);
}

function setupTilForm() {
  if (!tilForm || !tilList) {
    return;
  }

  tilForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(tilForm);
    const date = formData.get('date');
    const title = formData.get('title');
    const content = formData.get('content');

    const tilItem = document.createElement('article');
    const time = document.createElement('time');
    const heading = document.createElement('h3');
    const description = document.createElement('p');

    tilItem.className = 'til-item';
    time.textContent = String(date);
    heading.textContent = String(title);
    description.textContent = String(content);

    tilItem.append(time, heading, description);
    tilList.prepend(tilItem);
    tilForm.reset();
  });
}

function setupDarkModeToggle() {
  if (!nav) {
    return;
  }

  const toggleButton = document.createElement('button');
  const savedMode = localStorage.getItem(DARK_MODE_KEY);

  toggleButton.type = 'button';
  toggleButton.className = 'dark-mode-toggle';

  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }

  updateDarkModeButtonText(toggleButton);

  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
      DARK_MODE_KEY,
      document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled',
    );
    updateDarkModeButtonText(toggleButton);
  });

  nav.append(toggleButton);
}

function updateDarkModeButtonText(button) {
  button.textContent = document.body.classList.contains('dark-mode')
    ? '라이트 모드'
    : '다크 모드';
}

function setupGalleryModal() {
  if (galleryImages.length === 0) {
    return;
  }

  const modal = document.createElement('div');
  const modalImage = document.createElement('img');
  const closeButton = document.createElement('button');

  modal.className = 'image-modal';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', '이미지 닫기');
  closeButton.textContent = '×';

  modal.append(modalImage, closeButton);
  document.body.append(modal);

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryImages.forEach((image) => {
    image.addEventListener('click', () => {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

function setupSmoothScroll() {
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (!targetId || !targetId.startsWith('#')) {
        return;
      }

      const targetSection = document.querySelector(targetId);

      if (!targetSection) {
        return;
      }

      event.preventDefault();
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}

function setupActiveNavSection() {
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`,
          );
        });
      });
    },
    {
      rootMargin: '-35% 0px -50% 0px',
      threshold: 0.1,
    },
  );

  sections.forEach((section) => observer.observe(section));
}
