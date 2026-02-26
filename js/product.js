document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-container').innerHTML = '<h2>Товар не найден</h2>';
        document.getElementById('product-container').style.opacity = '1';
        return;
    }

    fetchProductDetails(productId);
});

async function fetchProductDetails(id) {
    try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        renderProductPage(json.data);
    } catch (error) {
        console.error('Error fetching product:', error);
        document.getElementById('product-container').innerHTML = `<h2>Ошибка загрузки товара: ${error.message}</h2>`;
        document.getElementById('product-container').style.opacity = '1';
    }
}

function renderProductPage(product) {
    // Breadcrumbs
    document.getElementById('bc-category').textContent = product.category;
    document.getElementById('bc-category').href = `catalog.html?cat=${product.category}`;

    const lang = window._lang || 'ru';
    const name = lang === 'kz' && product.name_kz ? product.name_kz : product.name;
    const desc = lang === 'kz' && product.description_kz ? product.description_kz : product.description;

    document.getElementById('bc-product').textContent = name;
    document.title = `Altyn Biye — ${name}`;

    // Gallery
    const mainImg = document.getElementById('product-main-img');
    const thumbsContainer = document.getElementById('gallery-thumbs');

    const allImages = [product.img || '/images/category_sets.png'];
    if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
            allImages.push(img.img_url);
        });
    }

    mainImg.src = allImages[0];

    if (allImages.length > 1) {
        thumbsContainer.innerHTML = allImages.map((src, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${src}', this)">
        <img src="${src}" alt="Фото товара ${idx + 1}">
      </div>
    `).join('');
    }

    // Info
    document.getElementById('product-title').textContent = name;
    document.getElementById('product-rating').textContent = (product.rating || 5).toFixed(1);
    document.getElementById('product-reviews').textContent = `(${product.reviews || 0} отзывов)`;

    const priceEl = document.getElementById('product-price');
    priceEl.textContent = `${product.price.toLocaleString('ru-KZ')} ₸`;

    const oldPriceEl = document.getElementById('product-old-price');
    if (product.old_price) {
        oldPriceEl.textContent = `${product.old_price.toLocaleString('ru-KZ')} ₸`;
    }

    // Stock
    const stockEl = document.getElementById('product-stock');
    if (product.in_stock) {
        stockEl.classList.add('stock-on');
        stockEl.classList.remove('stock-off');
        document.getElementById('stock-text').textContent = lang === 'kz' ? 'Қоймада бар' : 'В наличии';
    } else {
        stockEl.classList.add('stock-off');
        stockEl.classList.remove('stock-on');
        document.getElementById('stock-text').textContent = lang === 'kz' ? 'Қоймада жоқ' : 'Нет в наличии';
    }

    // Desc
    document.getElementById('product-desc').innerHTML = desc ? `<p>${desc}</p>` : '';

    // Specs
    const specsList = document.getElementById('quick-specs');
    let specsHTML = '';

    // Try to use parsed definitions from i18n or from attributes if loaded, 
    // but for simplicity we fall back to hardcoded ru/kz
    const lblMaterial = lang === 'kz' ? 'Материал' : 'Материал';
    const lblArt = lang === 'kz' ? 'Артикул' : 'Артикул';

    specsHTML += `<li><span class="spec-name">${lblArt}</span> <span class="spec-value">#${product.id.split('-')[0].toUpperCase()}</span></li>`;
    if (product.material) {
        specsHTML += `<li><span class="spec-name">${lblMaterial}</span> <span class="spec-value">${product.material}</span></li>`;
    }

    specsList.innerHTML = specsHTML;

    // Buy Add event listener for cart
    document.getElementById('btn-add-cart').onclick = () => {
        // Requires main.js function addToCart (which is global if declared with window.addToCart)
        // For now try to use event dispatch or global cart functions
        window.cart = window.cart || [];
        window.cart.push(product);
        localStorage.setItem('ab_cart', JSON.stringify(window.cart));
        if (window.updateCartCount) window.updateCartCount();
        if (window.renderCart) window.renderCart();
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    };

    // Show container
    document.getElementById('product-container').style.opacity = '1';
}

function changeMainImage(src, thumbEl) {
    const mainImg = document.getElementById('product-main-img');
    mainImg.style.opacity = '0.5';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 150);

    document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
}
