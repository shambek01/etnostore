/* ============================================================
   CATALOG.JS — Fetches products from REST API and renders grid
   ============================================================ */
(function () {
    'use strict';

    const API = '/api/products';
    let allProducts = [];
    let filteredProducts = [];

    const CAT_NAMES = {
        necklaces: 'Ожерелья', earrings: 'Серьги', bracelets: 'Браслеты',
        rings: 'Кольца', headpieces: 'Головные украшения', sets: 'Свадебные наборы',
    };

    function starsHTML(n) {
        n = parseFloat(n) || 5;
        return '★'.repeat(Math.floor(n)) + (n % 1 ? '☆' : '') + '☆'.repeat(5 - Math.ceil(n));
    }

    function badgeHTML(b) {
        if (!b) return '';
        const map = { hit: ['badge--new', 'Хит'], new: ['badge--new', 'Новинка'], sale: ['badge--sale', 'Скидка'] };
        const [cls, txt] = map[b] || ['badge--new', b];
        return `<span class="product-card-badge"><span class="badge ${cls}">${txt}</span></span>`;
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
          <div class="product-card-category">${CAT_NAMES[p.category] || p.category}</div>
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

    function renderGrid() {
        const grid = document.getElementById('catalog-grid');
        const count = document.getElementById('shown-count');
        if (!grid) return;
        if (!filteredProducts.length) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--color-text-muted)">
        <div style="font-size:2rem;margin-bottom:1rem">🔍</div>
        <p>По вашему запросу ничего не найдено</p>
        <button onclick="document.getElementById('filters-clear').click()" style="margin-top:1rem;padding:.5rem 1.2rem;background:var(--color-gold);color:#fff;border:none;border-radius:4px;cursor:pointer">Сбросить фильтры</button>
      </div>`;
            if (count) count.textContent = 0;
            return;
        }
        grid.innerHTML = filteredProducts.map(renderCard).join('');
        if (count) count.textContent = filteredProducts.length;
    }

    function applyFiltersAndSort() {
        const selectedCats = [...document.querySelectorAll('[name="cat"]:checked')].map(el => el.value);
        const selectedMetals = [...document.querySelectorAll('[name="metal"]:checked')].map(el => el.value);
        const selectedStones = [...document.querySelectorAll('[name="stone"]:checked')].map(el => el.value);
        const minPrice = parseInt(document.getElementById('price-min')?.value || '0', 10) || 0;
        const maxPrice = parseInt(document.getElementById('price-max')?.value || '999999', 10) || 999999;
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

        renderGrid();
    }

    async function fetchProducts() {
        const grid = document.getElementById('catalog-grid');
        if (grid) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--color-text-muted)">
      <div style="font-size:1.5rem;margin-bottom:.5rem">⏳</div>Загрузка товаров...</div>`;

        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error('Server error');
            const json = await res.json();
            allProducts = json.data || [];
            filteredProducts = [...allProducts];
            applyURLParams();
            applyFiltersAndSort();
        } catch (err) {
            // Fallback to static data if server not running
            console.warn('API not reachable, using static data:', err.message);
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
        ];
        filteredProducts = [...allProducts];
        renderGrid();
        const notice = document.createElement('div');
        notice.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#1A1A1A;color:#fff;padding:.75rem 1.2rem;border-radius:8px;font-size:.8rem;z-index:999;max-width:260px;line-height:1.4';
        notice.innerHTML = '⚠️ <b>Сервер не запущен.</b><br>Запустите: <code>cd server && node index.js</code>';
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 8000);
    }

    function applyURLParams() {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('cat');
        const filter = params.get('filter');
        const q = params.get('q');

        if (cat) {
            const cb = document.querySelector(`[name="cat"][value="${cat}"]`);
            if (cb) cb.checked = true;
        }
        if (filter === 'sale') filteredProducts = allProducts.filter(p => p.badge === 'sale');
        if (filter === 'new') filteredProducts = allProducts.filter(p => p.badge === 'new');
        if (q) {
            const ql = q.toLowerCase();
            filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(ql) || (p.material || '').toLowerCase().includes(ql));
            const searchInput = document.querySelector('.search-hint');
            if (searchInput) searchInput.textContent = `Результаты поиска: "${q}"`;
        }
    }

    function initCatalog() {
        fetchProducts();

        const sortEl = document.getElementById('sort-select');
        if (sortEl) sortEl.addEventListener('change', applyFiltersAndSort);

        const applyBtn = document.getElementById('apply-filters');
        if (applyBtn) applyBtn.addEventListener('click', applyFiltersAndSort);

        const clearBtn = document.getElementById('filters-clear');
        if (clearBtn) clearBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-option input').forEach(el => el.checked = false);
            const pMin = document.getElementById('price-min');
            const pMax = document.getElementById('price-max');
            if (pMin) pMin.value = '';
            if (pMax) pMax.value = '';
            filteredProducts = [...allProducts];
            renderGrid();
        });

        const mobileBtn = document.getElementById('filter-mobile-btn');
        const sidebar = document.getElementById('filters-sidebar');
        const overlay = document.querySelector('.overlay');
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
            });
        }

        document.querySelectorAll('.filter-group-title').forEach(title => {
            title.addEventListener('click', () => title.closest('.filter-group').classList.toggle('collapsed'));
        });

        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCatalog);
    else initCatalog();
})();
