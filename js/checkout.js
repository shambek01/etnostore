// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

function initCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemsContainer = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const form = document.getElementById('checkout-form');

    // Check if cart is empty
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align:center; padding: 2rem 0; color: var(--c-text-light);">
                <p data-i18n="checkout.empty">Ваша корзина пуста</p>
                <a href="catalog.html" class="btn btn--secondary" style="margin-top:1rem" data-i18n="checkout.back">Вернуться к покупкам</a>
            </div>
        `;
        document.getElementById('submit-order-btn').disabled = true;
        // Trigger translations if applicable
        if (window.updateTranslations) window.updateTranslations();
        return;
    }

    let total = 0;

    // Render items
    itemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="checkout-item">
                <img src="${item.img || '/images/category_sets.png'}" alt="${item.name}" class="ci-img">
                <div class="ci-info">
                    <div class="ci-name">${item.name}</div>
                    <div class="ci-meta">
                        <span>${item.quantity} шт.</span>
                        <span>${itemTotal.toLocaleString('ru-KZ')} ₸</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Update totals
    const formattedTotal = total.toLocaleString('ru-KZ') + ' ₸';
    subtotalEl.textContent = formattedTotal;
    totalEl.textContent = formattedTotal;

    // Handle form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submit-order-btn');
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> Обработка...';

        const orderData = {
            customer_name: document.getElementById('c-name').value,
            customer_phone: document.getElementById('c-phone').value,
            customer_email: document.getElementById('c-email').value,
            delivery_city: document.getElementById('c-city').value,
            delivery_address: document.getElementById('c-address').value,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.error || 'Server error');
            }

            // Success -> Clear cart and show success dialog
            localStorage.removeItem('cart');

            // Dispatch event to clear sidebar cart if active
            window.dispatchEvent(new Event('cartUpdated'));

            // Show success UI
            form.closest('.checkout-layout').style.display = 'none';
            document.querySelector('.checkout-title').style.display = 'none';
            document.querySelector('.back-link').style.display = 'none';

            const successDiv = document.getElementById('checkout-success');
            document.getElementById('success-order-id').textContent = '№ ' + json.orderId.substring(0, 8).toUpperCase();
            successDiv.style.display = 'block';

            window.scrollTo(0, 0);

        } catch (err) {
            console.error('Order checkout error:', err);
            alert('Ошибка при оформлении заказа: ' + err.message);
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}
