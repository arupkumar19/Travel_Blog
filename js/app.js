/* app.js — My Travel Journal */

let _tripsCache = null;

async function fetchTrips() {
  if (_tripsCache) return _tripsCache;
  const res = await fetch('data/trips.json');
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  _tripsCache = data.sort((a, b) => b.year - a.year || b.monthNumber - a.monthNumber);
  return _tripsCache;
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key) || '';
}

function goToTrip(id) {
  window.location.href = 'trip.html?id=' + encodeURIComponent(id);
}

function tripCardHTML(trip) {
  return (
    '<article class="trip-card" tabindex="0" role="button"' +
    ' data-trip-id="' + trip.id + '"' +
    ' aria-label="' + trip.title + ', ' + trip.destination + '">' +
      '<div class="trip-card__img-wrap">' +
        '<img class="trip-card__img" src="' + trip.coverImage + '"' +
        ' alt="' + trip.destination + '" loading="lazy"' +
        ' onerror="this.style.display=\'none\'">' +
      '</div>' +
      '<div class="trip-card__body">' +
        '<span class="trip-tag">' + trip.month + ' ' + trip.year + '</span>' +
        '<h3 class="trip-card__title">' + trip.title + '</h3>' +
        '<p class="trip-card__dest">' + trip.destination + '</p>' +
        '<p class="trip-card__desc">' + trip.description + '</p>' +
      '</div>' +
    '</article>'
  );
}

function attachCardListeners(container) {
  container.querySelectorAll('.trip-card').forEach(card => {
    card.addEventListener('click', () => goToTrip(card.dataset.tripId));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToTrip(card.dataset.tripId); }
    });
  });
}

function showError(containerId, msg) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<p class="error-state">' + msg + '</p>';
}

/* ── Mobile nav ─────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === current || (!current && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Home page ──────────────────────────────────────────── */
async function initHomePage() {
  try {
    const trips = await fetchTrips();

    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.style.backgroundImage = "url('images.jpeg')";
    }

    const featuredEl = document.getElementById('featured-trips');
    if (featuredEl) {
      if (!trips.length) {
        featuredEl.innerHTML = '<p class="empty-state">No trips yet. Add your first trip to data/trips.json.</p>';
      } else {
        featuredEl.innerHTML = trips.slice(0, 3).map(tripCardHTML).join('');
        attachCardListeners(featuredEl);
      }
    }

    const years = [...new Set(trips.map(t => t.year))].sort((a, b) => b - a);
    const yearsEl = document.getElementById('year-buttons');
    if (yearsEl) {
      yearsEl.innerHTML = years.map(y =>
        '<button class="year-btn" onclick="window.location.href=\'trips.html?year=' + y + '\'">' + y + '</button>'
      ).join('');
    }

    const destForm = document.getElementById('dest-form');
    const destInput = document.getElementById('dest-search');
    if (destForm && destInput) {
      destForm.addEventListener('submit', e => {
        e.preventDefault();
        const q = destInput.value.trim();
        if (q) window.location.href = 'trips.html?dest=' + encodeURIComponent(q);
      });
    }
  } catch (err) {
    console.error('Home page error:', err);
    showError('featured-trips',
      'Could not load trips. Serve the site over HTTP: <code>python3 -m http.server 8080</code>');
  }
}

/* ── Trips listing page ─────────────────────────────────── */
async function initTripsPage() {
  const container   = document.getElementById('trips-container');
  const countEl     = document.getElementById('results-count');
  const monthSelect = document.getElementById('filter-month');
  const destInput   = document.getElementById('filter-dest');
  const activeTag   = document.getElementById('active-year-tag');

  try {
    const trips = await fetchTrips();

    const initYear = getParam('year');
    const initDest = getParam('dest');

    if (monthSelect) {
      const months = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
      const used = new Set(trips.map(t => t.month));
      monthSelect.innerHTML = '<option value="">All Months</option>' +
        months.filter(m => used.has(m)).map(m => '<option value="' + m + '">' + m + '</option>').join('');
    }

    if (initDest && destInput) destInput.value = initDest;

    if (initYear && activeTag) {
      activeTag.innerHTML =
        'Year: ' + initYear + ' &nbsp;<a href="trips.html" aria-label="Clear year filter">&times;</a>';
      activeTag.style.display = 'inline-flex';
    }

    function render() {
      const month = monthSelect ? monthSelect.value : '';
      const dest  = (destInput ? destInput.value : '').toLowerCase().trim();
      const year  = getParam('year');

      const filtered = trips.filter(t => {
        if (month && t.month !== month) return false;
        if (dest && !t.destination.toLowerCase().includes(dest) && !t.title.toLowerCase().includes(dest)) return false;
        if (year && String(t.year) !== year) return false;
        return true;
      });

      if (container) {
        if (!filtered.length) {
          container.innerHTML = '<p class="empty-state">No trips match your filters.</p>';
        } else {
          container.innerHTML = filtered.map(tripCardHTML).join('');
          attachCardListeners(container);
        }
      }
      if (countEl) {
        countEl.textContent = filtered.length + ' trip' + (filtered.length !== 1 ? 's' : '') + ' found';
      }
    }

    monthSelect && monthSelect.addEventListener('change', render);
    destInput   && destInput.addEventListener('input', render);
    render();
  } catch (err) {
    console.error('Trips page error:', err);
    showError('trips-container',
      'Could not load trips. Serve the site over HTTP: python3 -m http.server 8080');
  }
}

/* ── Trip detail page ───────────────────────────────────── */
async function initTripDetailPage() {
  const id = getParam('id');
  if (!id) { window.location.href = 'trips.html'; return; }

  try {
    const trips = await fetchTrips();
    const idx = trips.findIndex(t => t.id === id);
    if (idx === -1) { window.location.href = 'trips.html'; return; }

    const trip = trips[idx];
    const prevTrip = trips[idx - 1] || null; // newer (earlier in sorted list)
    const nextTrip = trips[idx + 1] || null; // older

    document.title = trip.title + ' — My Travel Journal';

    const heroEl = document.getElementById('trip-hero');
    if (heroEl) {
      heroEl.style.backgroundImage = "url('" + trip.coverImage + "')";
    }

    const heroMeta = document.getElementById('trip-hero-meta');
    if (heroMeta) heroMeta.textContent = trip.destination + '  ·  ' + trip.month + ' ' + trip.year;

    const heroTitle = document.getElementById('trip-hero-title');
    if (heroTitle) heroTitle.textContent = trip.title;

    const storyEl = document.getElementById('trip-story');
    if (storyEl) storyEl.textContent = trip.story;

    const placesEl = document.getElementById('trip-places');
    if (placesEl) {
      if (trip.placesVisited && trip.placesVisited.length) {
        placesEl.innerHTML = trip.placesVisited.map(p => '<li>' + p + '</li>').join('');
      } else {
        placesEl.closest('.trip-section') && (placesEl.closest('.trip-section').style.display = 'none');
      }
    }

    const galleryEl = document.getElementById('trip-gallery');
    if (galleryEl && trip.photosDir) {
      let photos = [];
      try {
        const pr = await fetch(trip.photosDir + '/photos.json');
        if (pr.ok) {
          const files = await pr.json();
          photos = files.map(f =>
            typeof f === 'string'
              ? { src: trip.photosDir + '/' + f, caption: '' }
              : { src: trip.photosDir + '/' + f.file, caption: f.caption || '' }
          );
        }
      } catch (_) {}
      if (photos.length) {
        galleryEl.innerHTML = photos.map((p, i) =>
          '<div class="gallery-item" data-lightbox-index="' + i + '">' +
            '<img class="gallery-item__img" src="' + p.src + '" alt="' + (p.caption || '') + '" loading="lazy"' +
            ' onerror="this.closest(\'.gallery-item\').style.display=\'none\'">' +
            '<div class="gallery-item__overlay">' +
              '<span class="gallery-item__caption">' + (p.caption || '') + '</span>' +
            '</div>' +
          '</div>'
        ).join('');
        Lightbox.init(photos, galleryEl);
      }
    }

    const videosSection = document.getElementById('videos-section');
    const videosEl = document.getElementById('trip-videos');
    if (videosEl) {
      if (trip.videos && trip.videos.length) {
        videosEl.innerHTML = trip.videos.map(v => {
          const isLocal = /\.(mp4|webm|ogg)$/i.test(v.url);
          const player = isLocal
            ? '<video class="trip-video-native" controls preload="metadata">' +
                '<source src="' + v.url + '" type="video/mp4">' +
              '</video>'
            : '<div class="trip-video-wrap">' +
                '<iframe src="' + v.url + '" title="' + v.title + '"' +
                ' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
                ' allowfullscreen loading="lazy"></iframe>' +
              '</div>';
          return '<div class="trip-video-block"><p class="trip-video-title">' + v.title + '</p>' + player + '</div>';
        }).join('');
      } else if (videosSection) {
        videosSection.style.display = 'none';
      }
    }

    const prevBtn = document.getElementById('trip-prev');
    const nextBtn = document.getElementById('trip-next');
    if (prevBtn) {
      if (prevTrip) { prevBtn.textContent = '← ' + prevTrip.title; prevBtn.href = 'trip.html?id=' + prevTrip.id; }
      else prevBtn.style.visibility = 'hidden';
    }
    if (nextBtn) {
      if (nextTrip) { nextBtn.textContent = nextTrip.title + ' →'; nextBtn.href = 'trip.html?id=' + nextTrip.id; }
      else nextBtn.style.visibility = 'hidden';
    }

  } catch (err) {
    console.error('Trip detail error:', err);
    const body = document.getElementById('trip-body');
    if (body) body.innerHTML = '<div class="container"><p class="error-state">Could not load trip data.</p></div>';
  }
}

/* ── Gallery page ───────────────────────────────────────── */
async function initGalleryPage() {
  const container = document.getElementById('gallery-container');
  const countEl   = document.getElementById('gallery-count');
  try {
    const trips = await fetchTrips();
    const allPhotos = [];

    for (const trip of trips) {
      if (!trip.photosDir) continue;
      try {
        const res = await fetch(trip.photosDir + '/photos.json');
        if (!res.ok) continue;
        const files = await res.json();
        for (const f of files) {
          const src     = trip.photosDir + '/' + (typeof f === 'string' ? f : f.file);
          const caption = typeof f === 'string' ? '' : (f.caption || '');
          allPhotos.push({ src, caption, tripTitle: trip.title, tripId: trip.id });
        }
      } catch (_) {}
    }

    if (countEl) countEl.textContent = allPhotos.length + ' photos';

    if (container) {
      if (!allPhotos.length) {
        container.innerHTML = '<p class="empty-state">No photos yet. Add trips with photos to data/trips.json.</p>';
      } else {
        container.innerHTML = allPhotos.map((p, i) =>
          '<div class="gallery-item" data-lightbox-index="' + i + '">' +
            '<img class="gallery-item__img" src="' + p.src + '" alt="' + (p.caption || p.tripTitle) + '" loading="lazy"' +
            ' onerror="this.style.display=\'none\'">' +
            '<div class="gallery-item__overlay">' +
              '<span class="gallery-item__caption">' + (p.caption || '') + '</span>' +
              '<a class="gallery-item__trip-link" href="trip.html?id=' + p.tripId + '">' + p.tripTitle + '</a>' +
            '</div>' +
          '</div>'
        ).join('');
        Lightbox.init(allPhotos, container);
      }
    }
  } catch (err) {
    console.error('Gallery page error:', err);
    showError('gallery-container',
      'Could not load gallery. Serve the site over HTTP: python3 -m http.server 8080');
  }
}
