// js/admin-attributes.js — Admin Panel Attributes Management

window.adminAttributes = (function () {
    let attributes = [];
    const ENDPOINT = '/api/attributes';

    const els = {
        tableBody: document.getElementById('attr-table-body'),
        searchInput: document.getElementById('search-attr'),
        typeFilter: document.getElementById('filter-attr-type'),
        modal: document.getElementById('attr-modal'),
        modalTitle: document.getElementById('attr-modal-title'),
        form: document.getElementById('attr-form'),
        btnSubmit: document.getElementById('a-submit-btn'),
        // Form fields
        id: document.getElementById('a-id'),
        type: document.getElementById('a-type'),
        value: document.getElementById('a-value'),
        nameRu: document.getElementById('a-name-ru'),
        nameKz: document.getElementById('a-name-kz')
    };

    async function load() {
        if (!els.tableBody) return; // Only load UI if we are on the admin page

        try {
            const res = await fetch(ENDPOINT);
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            attributes = data.data;
            renderTable();
            populateProductSelects(); // Call global function exposed in admin.html's script block if available
        } catch (err) {
            showToast('Ошибка загрузки атрибутов: ' + err.message);
        }
    }

    function getFiltered() {
        let q = els.searchInput.value.toLowerCase().trim();
        let t = els.typeFilter.value;

        return attributes.filter(a => {
            if (t && a.type !== t) return false;
            if (q && !(a.value.toLowerCase().includes(q) || a.name_ru.toLowerCase().includes(q) || a.name_kz.toLowerCase().includes(q))) return false;
            return true;
        });
    }

    function renderTable() {
        const list = getFiltered();

        if (list.length === 0) {
            els.tableBody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <div class="emoji">🔍</div>
              Ничего не найдено
            </div>
          </td>
        </tr>
      `;
            return;
        }

        els.tableBody.innerHTML = list.map(a => `
      <tr>
        <td>
          <span class="badge ${a.type === 'badge' ? 'badge-new' : (a.type === 'metal' ? 'badge-hit' : 'badge-none')}">${a.type}</span>
        </td>
        <td><strong>${a.value}</strong></td>
        <td>${a.name_ru}</td>
        <td>${a.name_kz}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-secondary btn-sm" onclick="window.adminAttributes.openModal('${a.id}')">Изменить</button>
            <button class="btn btn-danger btn-sm" onclick="window.adminAttributes.deleteAttr('${a.id}')">Удалить</button>
          </div>
        </td>
      </tr>
    `).join('');
    }

    function filterTable() {
        renderTable();
    }

    function clearFilters() {
        els.searchInput.value = '';
        els.typeFilter.value = '';
        renderTable();
    }

    function openModal(id = null) {
        els.form.reset();
        els.id.value = '';

        if (id) {
            const attr = attributes.find(a => a.id === id);
            if (attr) {
                els.id.value = attr.id;
                els.type.value = attr.type;
                els.value.value = attr.value;
                els.nameRu.value = attr.name_ru;
                els.nameKz.value = attr.name_kz;
                els.modalTitle.textContent = 'Редактировать атрибут';
            }
        } else {
            els.modalTitle.textContent = 'Новый атрибут';
        }

        els.modal.classList.add('open');
    }

    function closeModal() {
        els.modal.classList.remove('open');
    }

    async function save(e) {
        e.preventDefault();
        els.btnSubmit.disabled = true;
        els.btnSubmit.textContent = 'Сохранение...';

        const id = els.id.value;
        const payload = {
            type: els.type.value,
            value: els.value.value,
            name_ru: els.nameRu.value,
            name_kz: els.nameKz.value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${ENDPOINT}/${id}` : ENDPOINT;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            showToast(id ? 'Атрибут обновлён' : 'Атрибут добавлен');
            closeModal();
            await load();

        } catch (err) {
            showToast('Ошибка: ' + err.message);
        } finally {
            els.btnSubmit.disabled = false;
            els.btnSubmit.textContent = 'Сохранить';
        }
    }

    function deleteAttr(id) {
        showConfirm('Удалить атрибут?', 'Это действие нельзя отменить.', async () => {
            try {
                const res = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
                const data = await res.json();

                if (!data.success) throw new Error(data.error);

                showToast('Атрибут удалён');
                await load();

            } catch (err) {
                showToast('Ошибка удаления: ' + err.message);
            }
        });
    }

    // Exposed utility globally for when attributes are needed
    function getAttributes() {
        return attributes;
    }

    // Load immediately
    load();

    return { load, filterTable, clearFilters, openModal, closeModal, save, deleteAttr, getAttributes };
})();
