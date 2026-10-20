/* gallery.js — Lightbox module for My Travel Journal */

const Lightbox = (() => {
  let photos = [];
  let current = 0;
  let overlay = null;
  let touchStartX = 0;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Photo lightbox');
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close lightbox">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
      '<div class="lightbox-content">' +
        '<img class="lightbox-img" src="" alt="">' +
        '<p class="lightbox-caption"></p>' +
      '</div>' +
      '<button class="lightbox-next" aria-label="Next photo">&#8250;</button>';

    document.body.appendChild(overlay);

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', () => go(current - 1));
    overlay.querySelector('.lightbox-next').addEventListener('click', () => go(current + 1));

    overlay.addEventListener('click', e => {
      if (e.target === overlay) close();
    });
    overlay.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) go(current + (dx > 0 ? 1 : -1));
    });

    document.addEventListener('keydown', onKey);
  }

  function go(index) {
    if (!photos.length) return;
    current = ((index % photos.length) + photos.length) % photos.length;
    const p = photos[current];
    const img = overlay.querySelector('.lightbox-img');
    img.src = p.src;
    img.alt = p.caption || '';
    overlay.querySelector('.lightbox-caption').textContent = p.caption || '';
    const showNav = photos.length > 1;
    overlay.querySelector('.lightbox-prev').style.display = showNav ? '' : 'none';
    overlay.querySelector('.lightbox-next').style.display = showNav ? '' : 'none';
  }

  function open(index) {
    if (!overlay) build();
    go(index);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.lightbox-close').focus();
  }

  function close() {
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function onKey(e) {
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
  }

  function init(photoList, container) {
    photos = photoList;
    container.querySelectorAll('[data-lightbox-index]').forEach(el => {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'View photo');
      el.addEventListener('click', () => open(+el.dataset.lightboxIndex));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+el.dataset.lightboxIndex); }
      });
    });
  }

  return { init, open, close };
})();
