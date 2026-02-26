/* ============================================================
   MAIN.JS — UI interactions for Altyn Biye Jewelry Store
   ============================================================ */

(function () {
  'use strict';

  /* ---- Cart State ---- */
  let cart = JSON.parse(localStorage.getItem('altynbiye_cart') || '[]');

  function saveCart() {
    localStorage.setItem('altynbiye_cart', JSON.stringify(cart));
  }

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    renderCart();
    updateCartCount();
    showToast(`«${product.name}» добавлен в корзину`);
    bumpCartIcon();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    updateCartCount();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { saveCart(); renderCart(); updateCartCount(); }
  }

  function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  }

  function renderCart() {
    const body = document.querySelector('.cart-sidebar-body');
    const footer = document.querySelector('.cart-sidebar-footer');
    if (!body) return;

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <p>Ваша корзина пуста</p>
          <a href="catalog.html" class="btn btn--outline btn--sm">Перейти в каталог</a>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    body.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='images/category_sets.png'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.material || 'Золото 585'}</div>
          <div class="cart-item-price">${formatPrice(item.price * item.qty)} ₸</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="altynUI.changeQty('${item.id}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="altynUI.changeQty('${item.id}', 1)">+</button>
          </div>
          <div class-item-remove" onclick="altynUI.removeFromCart('${item.id}')">✕ Удалить</div>
        </div>
      </div>`).join('');

    // Subtotal
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const amountEl = document.querySelector('.cart-subtotal-amount');
    if (amountEl) amountEl.textContent = formatPrice(total) + ' ₸';
  }

  function formatPrice(n) {
    return n.toLocaleString('ru-KZ');
  }

  function bumpCartIcon() {
    document.querySelectorAll('.cart-count').forEach(el => {
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 300);
    });
  }

  /* ---- Cart Sidebar ---- */
  function openCart() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    closeMobileMenu();
  }

  /* ---- Mobile Menu ---- */
  function openMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const burger = document.querySelector('.burger-btn');
    if (menu) menu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    if (burger) burger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const burger = document.querySelector('.burger-btn');
    if (menu) menu.classList.remove('open');
    if (burger) burger.classList.remove('active');
    const cartOpen = document.querySelector('.cart-sidebar.open');
    if (!cartOpen) {
      document.body.style.overflow = '';
      const overlay = document.querySelector('.overlay');
      if (overlay) overlay.classList.remove('active');
    }
  }

  /* ---- Search ---- */
  function toggleSearch() {
    const sd = document.querySelector('.search-dropdown');
    if (!sd) return;
    const isOpen = sd.classList.contains('open');
    if (isOpen) {
      sd.classList.remove('open');
    } else {
      sd.classList.add('open');
      const inp = sd.querySelector('input');
      if (inp) setTimeout(() => inp.focus(), 100);
    }
  }

  /* ---- Header Scroll ---- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll to Top ---- */
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Animate on Scroll ---- */
  function initAOS() {
    const els = document.querySelectorAll('.aos');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
  }

  /* ---- Toast ---- */
  let toastTimer = null;
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ---- Wishlist ---- */
  let wishlist = JSON.parse(localStorage.getItem('altynbiye_wishlist') || '[]');
  function toggleWishlist(id, name) {
    const idx = wishlist.indexOf(id);
    if (idx === -1) {
      wishlist.push(id);
      showToast(`«${name}» добавлен в избранное`);
    } else {
      wishlist.splice(idx, 1);
      showToast(`«${name}» удалён из избранного`);
    }
    localStorage.setItem('altynbiye_wishlist', JSON.stringify(wishlist));
    updateWishlistBtns();
  }

  function updateWishlistBtns() {
    document.querySelectorAll('.product-action-btn[data-action="wishlist"]').forEach(btn => {
      const id = btn.dataset.id;
      btn.classList.toggle('wishlisted', wishlist.includes(id));
    });
  }

  /* ---- Carousel Arrows ---- */
  function initCarousels() {
    document.querySelectorAll('.products-carousel-wrapper').forEach(wrapper => {
      const carousel = wrapper.querySelector('.products-carousel');
      const prev = wrapper.querySelector('.carousel-arrow--prev');
      const next = wrapper.querySelector('.carousel-arrow--next');
      if (!carousel) return;
      const scrollBy = 280;
      if (prev) prev.addEventListener('click', () => carousel.scrollBy({ left: -scrollBy, behavior: 'smooth' }));
      if (next) next.addEventListener('click', () => carousel.scrollBy({ left: scrollBy, behavior: 'smooth' }));
    });
  }

  /* ---- Hero scroll indicator ---- */
  function initHeroScroll() {
    const el = document.querySelector('.hero-scroll');
    if (!el) return;
    el.addEventListener('click', () => {
      const next = document.querySelector('.hero').nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---- Newsletter ---- */
  function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inp = form.querySelector('input');
      if (!inp || !inp.value) return;
      showToast('Вы успешно подписались на рассылку!');
      inp.value = '';
    });
  }

  /* ---- Init all ---- */
  function init() {
    initHeaderScroll();
    initScrollTop();
    initAOS();
    initCarousels();
    initHeroScroll();
    initNewsletter();
    updateCartCount();
    renderCart();
    updateWishlistBtns();

    // Burger
    const burger = document.querySelector('.burger-btn');
    if (burger) burger.addEventListener('click', openMobileMenu);

    // Mobile close
    const mobileClose = document.querySelector('.mobile-menu-close');
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    // Cart open
    document.querySelectorAll('.cart-open-btn').forEach(btn => {
      btn.addEventListener('click', openCart);
    });

    // Cart close
    const cartClose = document.querySelector('.cart-sidebar-close');
    if (cartClose) cartClose.addEventListener('click', closeCart);

    // Overlay click
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    // Search toggle
    document.querySelectorAll('.search-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleSearch);
    });

    // Close search on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const sd = document.querySelector('.search-dropdown.open');
        if (sd) sd.classList.remove('open');
      }
    });

    // Add to cart – delegated
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="add-to-cart"]');
      if (btn) {
        const product = {
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: parseInt(btn.dataset.price, 10),
          img: btn.dataset.img,
          material: btn.dataset.material || 'Золото 585',
        };
        addToCart(product);
        openCart();
      }

      // Wishlist
      const wBtn = e.target.closest('[data-action="wishlist"]');
      if (wBtn) {
        toggleWishlist(wBtn.dataset.id, wBtn.dataset.name);
      }
    });
  }

  // Public API for inline onclick
  window.altynUI = { addToCart, removeFromCart, changeQty, openCart, closeCart };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
