// js/admin-orders.js

window.adminOrders = {
    allOrders: [],

    async load() {
        try {
            const res = await fetch('/api/orders');
            const json = await res.json();
            this.allOrders = json.data || [];
            this.render();
        } catch (e) {
            console.error('Error loading orders:', e);
            document.getElementById('orders-table-body').innerHTML =
                `<tr><td colspan="7"><div class="empty-state">❌ Ошибка загрузки заказов</div></td></tr>`;
        }
    },

    render() {
        const tbody = document.getElementById('orders-table-body');
        if (!this.allOrders.length) {
            tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">📦 Нет заказов</div></td></tr>`;
            return;
        }

        tbody.innerHTML = this.allOrders.map(o => {
            const date = new Date(o.created_at + 'Z').toLocaleString('ru-RU', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            }).replace(',', '');

            return `
            <tr>
              <td><div style="font-size:0.85rem; color:#666">${date}</div></td>
              <td><strong style="font-family:monospace">#${o.id.substring(0, 8).toUpperCase()}</strong></td>
              <td>
                <div style="font-weight:500">${o.customer_name}</div>
                <div style="font-size:0.85rem; color:#666">${o.delivery_city}, ${o.delivery_address}</div>
              </td>
              <td>
                <div>${o.customer_phone}</div>
                <div style="font-size:0.85rem; color:#666">${o.customer_email || '—'}</div>
              </td>
              <td style="font-weight:600; color:var(--c-primary)">${o.total_amount.toLocaleString('ru-KZ')} ₸</td>
              <td>
                <select onchange="window.adminOrders.updateStatus('${o.id}', this.value)" style="padding:4px; border-radius:4px; border:1px solid #ccc">
                  <option value="new" ${o.status === 'new' ? 'selected' : ''}>⏳ Новый</option>
                  <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>📦 В обработке</option>
                  <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>✅ Доставлен</option>
                  <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ Отменен</option>
                </select>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="window.adminOrders.viewDetails('${o.id}')">👁️ Состав</button>
              </td>
            </tr>`;
        }).join('');
    },

    async updateStatus(id, newStatus) {
        try {
            const res = await fetch(`/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            showToast('✅ Статус обновлен');
        } catch (e) {
            showToast('❌ Ошибка: ' + e.message);
            this.load(); // reload to reset dropdown
        }
    },

    viewDetails(orderId) {
        const order = this.allOrders.find(o => o.id === orderId);
        if (!order) return;

        let itemsHtml = order.items.map(item => `
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;">
                <span>${item.product_name} <span style="color:#666">x${item.quantity}</span></span>
                <span style="font-weight:500">${(item.price * item.quantity).toLocaleString('ru-KZ')} ₸</span>
            </div>
        `).join('');

        // Reusing the confirm dialog as a generic modal structure
        document.getElementById('confirm-text').innerHTML = `
            <div style="text-align:left; margin-bottom:15px; font-size:0.9rem;">
                <strong>Клиент:</strong> ${order.customer_name}<br>
                <strong>Доставка:</strong> ${order.delivery_city}, ${order.delivery_address}
            </div>
            <div style="text-align:left; max-height:250px; overflow-y:auto; border:1px solid #eee; padding:10px; border-radius:6px; margin-bottom:15px;">
                ${itemsHtml}
            </div>
            <div style="text-align:right; font-size:1.1rem;">
                Итого: <strong>${order.total_amount.toLocaleString('ru-KZ')} ₸</strong>
            </div>
        `;
        document.querySelector('#confirm-dialog h3').textContent = `Заказ #${orderId.substring(0, 8).toUpperCase()}`;

        // Hide delete, rename cancel to OK
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.querySelector('.confirm-box .actions .btn-secondary');

        okBtn.style.display = 'none';
        cancelBtn.textContent = 'Закрыть';
        cancelBtn.onclick = () => {
            closeConfirm();
            // restore defaults
            okBtn.style.display = '';
            cancelBtn.textContent = 'Отмена';
            document.querySelector('#confirm-dialog h3').innerHTML = '⚠️ Подтвердите удаление';
        };

        document.getElementById('confirm-dialog').classList.add('open');
    }
};
