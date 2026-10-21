// src/scripts/templateGrid.js
import templates, { MESSENGER_URL, computeDiscountPercent } from '../data/templates.js';

const MSGR = MESSENGER_URL;

/* ── DOM refs ── */
const modal      = document.getElementById('product-modal');
const backdrop    = document.getElementById('modal-backdrop');
const panel       = document.getElementById('modal-panel');
const closeBtn    = document.getElementById('modal-close');
const mainImg     = document.getElementById('modal-main-image');
const thumbsWrap  = document.getElementById('modal-thumbs');
const prevBtn     = document.getElementById('gallery-prev');
const nextBtn     = document.getElementById('gallery-next');
const noResults   = document.getElementById('no-results');

/* ── Filter + search ── */
const filterBtns    = document.querySelectorAll('.filter-btn');
const templateCards = document.querySelectorAll('.template-card');
const searchInput   = document.getElementById('template-search');
let activeFilter    = 'All';

function applyFilters() {
  const q   = (searchInput?.value ?? '').toLowerCase().trim();
  let count = 0;
  templateCards.forEach((card) => {
    const cat  = card.getAttribute('data-category') ?? '';
    const txt  = card.getAttribute('data-search')   ?? '';
    const show = (activeFilter === 'All' || cat === activeFilter) && (!q || txt.includes(q));
    card.style.display = show ? '' : 'none';
    if (show) count++;
  });
  if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';
}

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeFilter = btn.getAttribute('data-filter') ?? 'All';
    filterBtns.forEach((b) => {
      b.style.background  = 'transparent';
      b.style.color       = 'var(--text-secondary)';
      b.style.borderColor = 'var(--border-mid)';
      b.setAttribute('aria-pressed', 'false');
    });
    btn.style.background  = 'var(--teal-primary)';
    btn.style.color       = '#fff';
    btn.style.borderColor = 'var(--teal-primary)';
    btn.setAttribute('aria-pressed', 'true');
    applyFilters();
  });
});

searchInput?.addEventListener('input', applyFilters);

/* ── Gallery state ── */
let galleryImages = [];
let galleryIndex  = 0;

function renderGallery(images) {
  galleryImages = images;
  galleryIndex  = 0;
  showSlide(0, false);
  buildThumbs(images);
}

function showSlide(idx, animate = true) {
  galleryIndex = (idx + galleryImages.length) % galleryImages.length;

  if (!mainImg) return;

  if (animate) {
    mainImg.style.opacity   = '0';
    mainImg.style.transform = 'scale(0.98)';
    setTimeout(() => {
      mainImg.src             = galleryImages[galleryIndex];
      mainImg.style.opacity   = '1';
      mainImg.style.transform = 'scale(1)';
    }, 110);
  } else {
    mainImg.src             = galleryImages[galleryIndex];
    mainImg.style.opacity   = '1';
    mainImg.style.transform = 'scale(1)';
  }

  document.querySelectorAll('.gallery-thumb').forEach((th, i) => {
    const active = i === galleryIndex;
    th.style.opacity   = active ? '1' : '0.5';
    th.style.transform = active ? 'scale(1.1)' : 'scale(1)';
    th.style.outline   = active ? '2px solid var(--teal-primary)' : '2px solid transparent';
    th.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function buildThumbs(images) {
  if (!thumbsWrap) return;
  thumbsWrap.innerHTML = '';
  images.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.className = 'gallery-thumb w-10 h-10 rounded-lg overflow-hidden transition-all duration-200';
    btn.style.cssText = `
      opacity: ${i === 0 ? '1' : '0.5'};
      outline: 2px solid ${i === 0 ? 'var(--teal-primary)' : 'transparent'};
      outline-offset: 2px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.20);
    `;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-label', `View image ${i + 1}`);

    const img     = document.createElement('img');
    img.src       = src;
    img.alt       = '';
    img.className = 'w-full h-full object-cover';
    btn.appendChild(img);

    btn.addEventListener('click', () => showSlide(i));
    thumbsWrap.appendChild(btn);
  });
}

prevBtn?.addEventListener('click', () => showSlide(galleryIndex - 1));
nextBtn?.addEventListener('click', () => showSlide(galleryIndex + 1));

document.addEventListener('keydown', (e) => {
  if (!modal || modal.style.display === 'none') return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); showSlide(galleryIndex - 1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(galleryIndex + 1); }
  if (e.key === 'Escape')     closeModal();
});

let touchStartX = 0;
document.getElementById('modal-gallery')?.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('modal-gallery')?.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 48) showSlide(galleryIndex + (dx < 0 ? 1 : -1));
});

/* ── Populate modal ── */
function populateModal(t) {
  renderGallery(t.images);
  if (mainImg) mainImg.alt = t.title;

  const catEl = document.getElementById('modal-category');
  const tagEl = document.getElementById('modal-tag');
  if (catEl) catEl.textContent = t.category;
  if (tagEl) {
    if (t.tag) {
      tagEl.textContent      = t.tag;
      tagEl.style.background  = t.tagBg   || 'rgba(238,155,0,0.12)';
      tagEl.style.color       = t.tagColor || '#9A6800';
      tagEl.style.borderColor = t.tagColor || '#9A6800';
      tagEl.classList.remove('hidden');
    } else {
      tagEl.classList.add('hidden');
    }
  }

  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = t.title;

  const descEl = document.getElementById('modal-desc');
  if (descEl) descEl.textContent = t.longDescription;

  const incEl = document.getElementById('modal-includes');
  if (incEl) {
    incEl.innerHTML = t.includes.map(item => `
      <li class="flex items-start gap-2.5">
        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" style="color:var(--teal-mid);" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <span class="text-sm" style="color:var(--text-secondary);">${item}</span>
      </li>
    `).join('');
  }

  const fmtEl = document.getElementById('modal-formats');
  if (fmtEl) {
    fmtEl.innerHTML = t.formats
      .map(f => `<span class="badge badge-teal">${f}</span>`)
      .join('');
  }

  const regularPriceEl = document.getElementById('modal-regular-price');
  if (regularPriceEl) regularPriceEl.textContent = t.regularPrice;

  const discountBadgeEl = document.getElementById('modal-discount-badge');
  if (discountBadgeEl) {
    const percentOff = computeDiscountPercent(t.regularPrice, t.price);
    if (percentOff > 0) {
      discountBadgeEl.textContent = `-${percentOff}%`;
      discountBadgeEl.style.display = '';
    } else {
      discountBadgeEl.style.display = 'none';
    }
  }

  const priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = t.price;

  const buyBtn = document.getElementById('modal-buy-btn');
  if (buyBtn) {
    buyBtn.href = `/submit-payment?template=${encodeURIComponent(t.title)}&price=${encodeURIComponent(t.price)}`;
    buyBtn.setAttribute('aria-label', `Buy ${t.title} for ${t.price}`);
  }

  const msgrBtn = document.getElementById('modal-messenger-btn');
  if (msgrBtn) {
    msgrBtn.href = MSGR;
    msgrBtn.setAttribute('aria-label', `Ask about ${t.title} on Messenger`);
  }

}

/* ── Open / close modal ── */
let previouslyFocused = null;

function openModal(id) {
  const t = templates.find(x => x.id === id);
  if (!t || !modal) return;

  sessionStorage.setItem('selectedTemplateId', String(id));
  previouslyFocused = document.activeElement;
  populateModal(t);

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    if (panel) {
      panel.style.transition = 'transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease';
      panel.style.transform  = 'translateY(100%)';
      panel.style.opacity    = '0';
      requestAnimationFrame(() => {
        panel.style.transform = 'translateY(0)';
        panel.style.opacity   = '1';
      });
    }
    if (backdrop) {
      backdrop.style.transition = 'opacity 0.28s ease';
      backdrop.style.opacity    = '0';
      requestAnimationFrame(() => { backdrop.style.opacity = '1'; });
    }
  });

  setTimeout(() => closeBtn?.focus(), 60);
}

function closeModal() {
  if (!modal || !panel) return;

  sessionStorage.removeItem('selectedTemplateId');
  panel.style.transform = 'translateY(40px)';
  panel.style.opacity   = '0';
  if (backdrop) backdrop.style.opacity = '0';

  setTimeout(() => {
    modal.style.display          = 'none';
    panel.style.transform        = '';
    panel.style.opacity          = '';
    document.body.style.overflow = '';
    previouslyFocused?.focus();
  }, 280);
}

function restoreSelectedTemplateModal() {
  const selectedTemplateId = Number(sessionStorage.getItem('selectedTemplateId'));
  if (!Number.isFinite(selectedTemplateId)) return;
  openModal(selectedTemplateId);
}

templateCards.forEach((card) => {
  const id = parseInt(card.getAttribute('data-id') ?? '0', 10);
  card.addEventListener('click', (e) => {
    if (e.target.closest('.open-modal-btn')) return;
    openModal(id);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); }
  });
});

document.querySelectorAll('.open-modal-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.getAttribute('data-id') ?? '0', 10);
    openModal(id);
  });
});

restoreSelectedTemplateModal();

closeBtn?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', closeModal);

modal?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !modal || modal.style.display === 'none') return;
  const focusable = Array.from(
    modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.closest('[aria-hidden="true"]'));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first)      { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
