/* ============================================================
   CATALOG.JS — Fetch from API, filter, sort, paginate, render
   ============================================================ */
(function () {
    'use strict';

    const API = '/api/products';
    const PAGE_SIZE = 9;

    let allProducts = [];
    let filteredProducts = [];
    let currentPage = 1;

    const CAT_NAMES = {
        necklaces: { ru: 'Ожерелья', kz: 'Моншақтар' },
        earrings: { ru: 'Серьги', kz: 'Сырғалар' },
        bracelets: { ru: 'Браслеты', kz: 'Білезіктер' },
        rings: { ru: 'Кольца', kz: 'Жүзіктер' },
        headpieces: { ru: 'Головные украшения', kz: 'Бас әшекейлері' },
        sets: { ru: 'Свадебные наборы', kz: 'Үйлену жиынтықтары' },
    };

    function catLabel(cat) {
        const lang = window._lang || 'ru';
        return (CAT_NAMES[cat] || {})[lang] || cat;
    }

    function starsHTML(n) {
        n = parseFloat(n) || 5;
        return '★'.repeat(Math.floor(n)) + (n % 1 ? '☆' : '') + '☆'.repeat(5 - Math.ceil(n));
    }

    function badgeHTML(b) {
        if (!b) return '';
        const lang = window._lang || 'ru';
        const map = {
            hit: ['badge--new', { ru: 'Хит', kz: 'Хит' }],
            new: ['badge--new', { ru: 'Новинка', kz: 'Жаңа' }],
            sale: ['badge--sale', { ru: 'Скидка', kz: 'Жеңілдік' }],
        };
        const [cls, labels] = map[b] || ['badge--new', { ru: b, kz: b }];
        return `<span class="product-card-badge"><span class="badge ${cls}">${labels[lang] || labels.ru}</span></span>`;
    }

    function renderCard(p) {
        const img = p.img || '/images/category_necklaces.png';
        return `
      <div class="product-card" data-id="${p.id}" data-category="${p.category}">
        <div class="product-card-img-wrap">
          <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.src='/images/category_sets.png'">
          <div class="product-card-actions">
            <button class="product-action-btn" data-action="wishlist" data-id="${p.id}" data-name="${p.name}" aria-label="В избранное">
              <svg class="heart" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button class="product-action-btn" data-action="add-to-cart"
              data-id="${p.id}" data-name="${p.name}" data-price="${p.price}"
              data-img="${img}" data-material="${p.material || ''}" aria-label="В корзину">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </button>
            <a href="product.html?id=${p.id}" class="product-action-btn" aria-label="Подробнее">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
          </div>
          ${badgeHTML(p.badge)}
        </div>
        <div class="product-card-body">
          <div class="product-card-category">${catLabel(p.category)}</div>
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-stars">
            <span class="stars">${starsHTML(p.rating)}</span>
            <span class="star-count">(${p.reviews || 0})</span>
          </div>
          <div class="product-card-price-row">
            <span class="product-card-price">${parseInt(p.price).toLocaleString('ru-KZ')} ₸</span>
            ${p.old_price ? `<span class="product-card-price-old">${parseInt(p.old_price).toLocaleString('ru-KZ')} ₸</span>` : ''}
          </div>
        </div>
      </div>`;
    }

    /* ── PAGINATION ────────────────────────────────────────── */
    function totalPages() {
        return Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    }

    function pageSlice() {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredProducts.slice(start, start + PAGE_SIZE);
    }

    function renderPagination() {
        const el = document.getElementById('pagination');
        if (!el) return;
        const total = totalPages();
        if (total <= 1) { el.innerHTML = ''; return; }

        const lang = window._lang || 'ru';
        const prev = lang === 'kz' ? '‹ Алдыңғы' : '‹ Назад';
        const next = lang === 'kz' ? 'Келесі ›' : 'Вперёд ›';

        let html = `<button class="page-btn page-nav" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">${prev}</button>`;

        // Determine which page numbers to show
        const pages = [];
        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('…');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(total - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < total - 2) pages.push('…');
            pages.push(total);
        }

        for (const p of pages) {
            if (p === '…') {
                html += `<span class="page-ellipsis">…</span>`;
            } else {
                html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
            }
        }

        html += `<button class="page-btn page-nav" ${currentPage === total ? 'disabled' : ''} data-page="${currentPage + 1}">${next}</button>`;
        el.innerHTML = html;

        el.querySelectorAll('.page-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const newPage = parseInt(btn.dataset.page);
                if (!btn.disabled && newPage >= 1 && newPage <= total) {
                    currentPage = newPage;
                    renderGrid();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    function updateCounter() {
        const shownEl = document.getElementById('shown-count');
        const totalEl = document.getElementById('total-count');
        const rangeEl = document.getElementById('shown-range');
        const start = (currentPage - 1) * PAGE_SIZE + 1;
        const end = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);
        if (shownEl) shownEl.textContent = filteredProducts.length ? `${start}–${end}` : '0';
        if (totalEl) totalEl.textContent = filteredProducts.length;
        if (rangeEl) rangeEl.textContent = filteredProducts.length
            ? `${start}–${end} из ${filteredProducts.length}`
            : '0';
    }

    /* ── RENDER GRID ───────────────────────────────────────── */
    function renderGrid() {
        const grid = document.getElementById('catalog-grid');
        if (!grid) return;
        const slice = pageSlice();

        if (!slice.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--color-text-muted)">
        <div style="font-size:2rem;margin-bottom:1rem">🔍</div>
        <p data-i18n="catalog.empty">По вашему запросу ничего не найдено</p>
        <button onclick="document.getElementById('filters-clear').click()" style="margin-top:1rem;padding:.5rem 1.2rem;background:var(--color-gold);color:#fff;border:none;border-radius:4px;cursor:pointer" data-i18n="catalog.resetFilters">Сбросить фильтры</button>
      </div>`;
        } else {
            grid.innerHTML = slice.map(renderCard).join('');
        }

        updateCounter();
        renderPagination();
        if (window.applyLang) window.applyLang();
    }

    /* ── FILTER & SORT ─────────────────────────────────────── */
    function applyFiltersAndSort() {
        const selectedCats = [...document.querySelectorAll('[name="cat"]:checked')].map(el => el.value);
        const selectedMetals = [...document.querySelectorAll('[name="metal"]:checked')].map(el => el.value);
        const selectedStones = [...document.querySelectorAll('[name="stone"]:checked')].map(el => el.value);
        const minPrice = parseInt(document.getElementById('price-min')?.value || '0') || 0;
        const maxPrice = parseInt(document.getElementById('price-max')?.value || '999999') || 999999;
        const sort = document.getElementById('sort-select')?.value || 'popular';

        filteredProducts = allProducts.filter(p => {
            if (selectedCats.length && !selectedCats.includes(p.category)) return false;
            if (selectedMetals.length && !selectedMetals.includes(p.metal)) return false;
            if (selectedStones.length && !selectedStones.includes(p.stone)) return false;
            if (p.price < minPrice || p.price > maxPrice) return false;
            return true;
        });

        const sortFns = {
            'price-asc': (a, b) => a.price - b.price,
            'price-desc': (a, b) => b.price - a.price,
            'rating': (a, b) => b.rating - a.rating || b.reviews - a.reviews,
            'new': (a, b) => new Date(b.created_at) - new Date(a.created_at),
            'popular': (a, b) => b.reviews - a.reviews,
        };
        if (sortFns[sort]) filteredProducts.sort(sortFns[sort]);

        currentPage = 1;
        renderGrid();
    }

    /* ── FETCH ─────────────────────────────────────────────── */
    async function fetchProducts() {
        const grid = document.getElementById('catalog-grid');
        if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--color-text-muted)"><div style="font-size:1.5rem;margin-bottom:.5rem">⏳</div>Загрузка...</div>`;
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error('Server error');
            const json = await res.json();
            allProducts = json.data || [];
            filteredProducts = [...allProducts];
            applyURLParams();
            renderGrid();
        } catch (err) {
            console.warn('API not reachable, static fallback:', err.message);
            fallbackStatic();
        }
    }

    function fallbackStatic() {
        allProducts = [
            { id: 'c1', name: 'Алтын Моншақ', category: 'necklaces', price: 85000, rating: 5, reviews: 48, img: '/images/category_necklaces.png', metal: 'gold585', stone: 'turquoise', badge: 'hit', material: 'Золото 585 · Бирюза' },
            { id: 'c2', name: 'Гауhар Сырға', category: 'earrings', price: 42000, rating: 5, reviews: 32, img: '/images/category_earrings.png', metal: 'gold585', stone: 'turquoise', badge: '', material: 'Золото 585 · Бирюза' },
            { id: 'c3', name: 'Қола Білезік', category: 'bracelets', price: 56000, old_price: 70000, rating: 4, reviews: 21, img: '/images/category_bracelets.png', metal: 'gold585', stone: 'turquoise', badge: 'sale', material: 'Золото 585' },
            { id: 'c4', name: 'Тас Жүзік', category: 'rings', price: 38000, rating: 5, reviews: 57, img: '/images/category_rings.png', metal: 'gold585', stone: 'turquoise', badge: '', material: 'Золото 585 · Бирюза' },
            { id: 'c5', name: 'Шашбау', category: 'headpieces', price: 125000, rating: 5, reviews: 14, img: '/images/category_headpiece.png', metal: 'gold750', stone: 'coral', badge: 'new', material: 'Золото 750 · Коралл' },
            { id: 'c6', name: 'Той Жиынтығы', category: 'sets', price: 280000, rating: 5, reviews: 8, img: '/images/category_sets.png', metal: 'gold585', stone: 'pearl', badge: '', material: 'Золото 585 · Жемчуг' },
            { id: 'c7', name: 'Жіп Моншақ', category: 'necklaces', price: 64000, rating: 4, reviews: 19, img: '/images/category_necklaces.png', metal: 'gold585', stone: 'coral', badge: '', material: 'Золото 585 · Коралл' },
            { id: 'c8', name: 'Алтын Сырға', category: 'earrings', price: 35000, rating: 5, reviews: 44, img: '/images/category_earrings.png', metal: 'silver', stone: 'turquoise', badge: 'hit', material: 'Серебро · Бирюза' },
            { id: 'c9', name: 'Кең Білезік', category: 'bracelets', price: 78000, rating: 5, reviews: 27, img: '/images/category_bracelets.png', metal: 'gold750', stone: 'garnet', badge: 'new', material: 'Золото 750 · Гранат' },
            { id: 'c10', name: 'Жауhар Жүзік', category: 'rings', price: 52000, rating: 4, reviews: 33, img: '/images/category_rings.png', metal: 'gold585', stone: 'garnet', badge: '', material: 'Золото 585 · Гранат' },
            { id: 'c11', name: 'Сәукеле', category: 'headpieces', price: 195000, rating: 5, reviews: 6, img: '/images/category_headpiece.png', metal: 'gold750', stone: 'turquoise', badge: 'new', material: 'Золото 750 · Жемчуг' },
            { id: 'c12', name: 'Брайдал Сет', category: 'sets', price: 420000, old_price: 520000, rating: 5, reviews: 4, img: '/images/category_sets.png', metal: 'gold750', stone: 'pearl', badge: 'sale', material: 'Золото 750 · Жемчуг' },
        ];
        filteredProducts = [...allProducts];
        renderGrid();
    }

    function applyURLParams() {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('cat');
        const filter = params.get('filter');
        const q = params.get('q');
        if (cat) {
            const cb = document.querySelector(`[name="cat"][value="${cat}"]`);
            if (cb) cb.checked = true;
            filteredProducts = allProducts.filter(p => p.category === cat);
        }
        if (filter === 'sale') filteredProducts = allProducts.filter(p => p.badge === 'sale');
        if (filter === 'new') filteredProducts = allProducts.filter(p => p.badge === 'new');
        if (q) {
            const ql = q.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(ql) || (p.material || '').toLowerCase().includes(ql));
        }
    }

    /* ── INIT ──────────────────────────────────────────────── */
    function initCatalog() {
        fetchProducts();

        document.getElementById('sort-select')?.addEventListener('change', applyFiltersAndSort);
        document.getElementById('apply-filters')?.addEventListener('click', applyFiltersAndSort);

        document.getElementById('filters-clear')?.addEventListener('click', () => {
            document.querySelectorAll('.filter-option input').forEach(el => el.checked = false);
            document.getElementById('price-min') && (document.getElementById('price-min').value = '');
            document.getElementById('price-max') && (document.getElementById('price-max').value = '');
            filteredProducts = [...allProducts];
            currentPage = 1;
            renderGrid();
        });

        const mobileBtn = document.getElementById('filter-mobile-btn');
        const sidebar = document.getElementById('filters-sidebar');
        const overlay = document.querySelector('.overlay');
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay?.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
            });
        }
        document.querySelectorAll('.filter-group-title').forEach(t => {
            t.addEventListener('click', () => t.closest('.filter-group').classList.toggle('collapsed'));
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCatalog);
    else initCatalog();
})();
