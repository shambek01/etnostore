// js/admin-categories.js — Admin Panel Categories Management

window.adminCategories = (function () {
    const CAT_API = '/api/categories';
    let allCategories = [];
    let pendingDeleteId = null;

    async function load() {
        const tbody = document.getElementById('cat-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="emoji">⏳</div>Загрузка...</div></td></tr>';

        try {
            const json = await fetch(CAT_API).then(r => r.json());
            allCategories = json.data || [];
            if (tbody) {
                tbody.innerHTML = allCategories.length ? allCategories.map(c => `
        <tr>
          <td><img class="product-thumb" src="${c.img || '/images/category_sets.png'}" onerror="this.src='/images/category_sets.png'"></td>
          <td><code style="background:#F4F6FA;padding:.2rem .5rem;border-radius:4px;font-size:.78rem">${c.id}</code></td>
          <td><strong>${c.name}</strong></td>
          <td>${c.name_kz}</td>
          <td><div class="action-btns">
            <button class="btn btn-secondary btn-sm" onclick="window.adminCategories.openModal('${c.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="window.adminCategories.confirmDelete('${c.id}','${(c.name || '').replace(/'/g, "\\'")}')" ${allCategories.length <= 1 ? 'disabled title="Нельзя удалить последнюю категорию"' : ''}>🗑️</button>
          </div></td>
        </tr>`).join('') :
                    '<tr><td colspan="5"><div class="empty-state"><div class="emoji">📂</div>Нет категорий</div></td></tr>';
            }
        } catch (e) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">Ошибка загрузки</div></td></tr>';
        }
    }

    function openModal(id = null) {
        document.getElementById('cat-edit-id').value = id || '';
        document.getElementById('cat-form').reset();

        const catIdInput = document.getElementById('cat-id');

        if (id) {
            const c = allCategories.find(x => x.id === id);
            if (!c) return;
            document.getElementById('cat-modal-title').textContent = 'Редактировать категорию';
            catIdInput.value = c.id;
            catIdInput.disabled = true;
            document.getElementById('cat-name').value = c.name || '';
            document.getElementById('cat-name-kz').value = c.name_kz || '';
            document.getElementById('cat-img').value = c.img || '';
        } else {
            document.getElementById('cat-modal-title').textContent = 'Добавить категорию';
            catIdInput.disabled = false;
        }

        document.getElementById('cat-modal').classList.add('open');
    }

    function closeModal() {
        document.getElementById('cat-modal').classList.remove('open');
    }

    async function save() {
        const id = document.getElementById('cat-edit-id').value;
        const catIdInput = document.getElementById('cat-id');
        const catId = catIdInput ? catIdInput.value.trim() : id;
        const name = document.getElementById('cat-name').value.trim();
        const nameKz = document.getElementById('cat-name-kz').value.trim();

        if (!catId || !name || !nameKz) { showToast('❌ Заполните все обязательные поля'); return; }

        const fd = new FormData();
        if (!id) fd.append('id', catId);
        fd.append('name', name);
        fd.append('name_kz', nameKz);
        fd.append('img_url', document.getElementById('cat-img').value);

        try {
            const url = id ? `${CAT_API}/${id}` : CAT_API;
            const res = await fetch(url, { method: id ? 'PUT' : 'POST', body: fd });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            closeModal();
            await load();
            showToast(id ? '✅ Категория обновлена' : '✅ Категория добавлена');
        } catch (e) { showToast('❌ ' + e.message); }
    }

    function confirmDelete(id, name) {
        pendingDeleteId = id;
        document.getElementById('confirm-text').textContent = `Удалить категорию "${name}"?`;
        document.getElementById('confirm-dialog').classList.add('open');
        document.getElementById('confirm-ok').onclick = executeDelete;
    }

    async function executeDelete() {
        try {
            const res = await fetch(`${CAT_API}/${pendingDeleteId}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            closeConfirm();
            await load();
            showToast('✅ Категория удалена');
        } catch (e) {
            showToast('❌ ' + e.message);
            closeConfirm();
        }
    }

    function getCategories() {
        return allCategories;
    }

    return { load, openModal, closeModal, save, confirmDelete, executeDelete, getCategories };
})();
