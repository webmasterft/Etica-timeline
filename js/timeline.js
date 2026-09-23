/**
 * timeline.js - Interactive Timeline controller & view logic
 */

// 1. Core Timeline Dataset (WebP Assets in Spanish)
const timelineData = {
  1: {
    period: "1651 / 1964",
    title: "Egoísmo psicológico y ético",
    authors: "Thomas Hobbes (fundamento contractual) y Ayn Rand (egoísmo racional)",
    works: "Leviatán (1651); La virtud del egoísmo (1964)",
    img: "./img_hobbes_rand_es.webp?v=3",
    contribution: "Postula la primacía del interés individual. Para Hobbes, el estado de naturaleza es una guerra de todos contra todos, haciendo del contrato social y del Estado ('Leviatán') un árbitro coercitivo indispensable para garantizar la supervivencia y el orden. Ayn Rand reformula el egoísmo como una virtud moral racional basada en el florecimiento del individuo y el derecho a la propiedad sin coacción ilegítima."
  },
  2: {
    period: "1981 – 1983",
    title: "Ética del discurso (ética comunicativa)",
    authors: "Jürgen Habermas y Karl-Otto Apel",
    works: "Teoría de la acción comunicativa (1981); La transformación de la filosofía (1973/1983)",
    img: "./img_habermas_apel_es.webp?v=3",
    contribution: "Fundamenta lo justo en el diálogo racional y sin exclusiones. La legitimidad de la ley no emana de la fuerza ni de la tradición, sino de un procedimiento deliberativo abierto y sin coacciones donde todos los afectados potenciales tienen voz y voto simétrico. La validez de las normas morales y jurídicas se somete al consenso comunicativo intersubjetivo."
  },
  3: {
    period: "1982 – 1984",
    title: "Ética del cuidado",
    authors: "Carol Gilligan y Nel Noddings",
    works: "In a Different Voice (1982); Caring (1984)",
    img: "./img_gilligan_noddings_es.webp?v=3",
    contribution: "Antepone los vínculos afectivos, la responsabilidad recíproca y la atención prioritaria a la vulnerabilidad por encima de las normas abstractas e impersonales de la justicia tradicional. Exige un marco legal con rostro humano, orientado a la compasión, la reparación comunitaria y la protección de las redes de cuidado social."
  },
  4: {
    period: "1986 – 1997+",
    title: "Ética cívica y cultura de la legalidad",
    authors: "Adela Cortina",
    works: "Ética mínima (1986); Ciudadanos del mundo (1997)",
    img: "./img_adela_cortina_es.webp?v=3",
    contribution: "Propone una ética de mínimos compartidos (justicia, libertad, igualdad activa, solidaridad y diálogo) que posibilita la convivencia armónica en sociedades pluralistas. La legalidad deja de concebirse como una imposición externa o temor a la sanción penal, y se asume como una convicción cívica voluntaria y corresponsable del ciudadano."
  }
};

// 2. Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initScrollTracker();
  initIntersectionObserver();
  initFilterControls();
});

// 3. Theme Manager (Default: cyber)
function initThemeManager() {
  const themeButtons = document.querySelectorAll('[data-set-theme]');
  const savedTheme = localStorage.getItem('preferred-theme') || 'cyber';

  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      applyTheme(theme);
      localStorage.setItem('preferred-theme', theme);
    });
  });
}

function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  const themeButtons = document.querySelectorAll('[data-set-theme]');
  themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-set-theme') === themeName);
  });
}

// 4. Smooth scroll navigation
function smoothScrollToTimeline(e) {
  if (e) e.preventDefault();
  const target = document.getElementById('timeline-start');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// 5. Scroll progress tracker
function initScrollTracker() {
  const progressBar = document.getElementById('progress-tracker');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

// 6. Scroll reveal animations via IntersectionObserver
function initIntersectionObserver() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  items.forEach(item => observer.observe(item));
}

// 7. Filter buttons
function initFilterControls() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-period').includes(filter)) {
          item.style.display = 'flex';
          setTimeout(() => item.classList.add('visible'), 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('visible');
        }
      });
    });
  });
}

// 8. Modal Controller
function openModal(id) {
  const data = timelineData[id];
  if (!data) return;

  document.getElementById('modal-img').src = data.img;
  document.getElementById('modal-period').textContent = data.period;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-authors').textContent = data.authors;
  document.getElementById('modal-works').textContent = data.works;
  document.getElementById('modal-contribution').textContent = data.contribution;

  document.getElementById('detail-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function closeModalOnBg(e) {
  if (e.target.id === 'detail-modal') {
    closeModal();
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
