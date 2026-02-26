const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

// ── GET /api/attributes ────────────────────────────────────
router.get('/', (req, res) => {
    try {
        const db = getDb();
        let sql = 'SELECT * FROM attributes';
        const params = [];

        if (req.query.type) {
            sql += ' WHERE type = ?';
            params.push(req.query.type);
        }

        const attributes = db.prepare(sql).all(...params);
        res.json({ success: true, data: attributes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── GET /api/attributes/:id ────────────────────────────────
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const attribute = db.prepare('SELECT * FROM attributes WHERE id = ?').get(req.params.id);
        if (!attribute) return res.status(404).json({ success: false, error: 'Атрибут не найден' });
        res.json({ success: true, data: attribute });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── POST /api/attributes ───────────────────────────────────
router.post('/', (req, res) => {
    try {
        const db = getDb();
        const { type, value, name_ru, name_kz } = req.body;

        if (!type || !value || !name_ru || !name_kz) {
            return res.status(400).json({ success: false, error: 'Все поля (type, value, name_ru, name_kz) обязательны' });
        }

        const id = uuidv4();

        db.prepare(`
            INSERT INTO attributes (id, type, value, name_ru, name_kz)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, type, value, name_ru, name_kz);

        const created = db.prepare('SELECT * FROM attributes WHERE id = ?').get(id);
        res.status(201).json({ success: true, data: created });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── PUT /api/attributes/:id ────────────────────────────────
router.put('/:id', (req, res) => {
    try {
        const db = getDb();
        const existing = db.prepare('SELECT * FROM attributes WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ success: false, error: 'Атрибут не найден' });

        const { type, value, name_ru, name_kz } = req.body;

        db.prepare(`
            UPDATE attributes SET
                type = ?, value = ?, name_ru = ?, name_kz = ?
            WHERE id = ?
        `).run(
            type || existing.type,
            value || existing.value,
            name_ru || existing.name_ru,
            name_kz || existing.name_kz,
            req.params.id
        );

        const updated = db.prepare('SELECT * FROM attributes WHERE id = ?').get(req.params.id);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── DELETE /api/attributes/:id ─────────────────────────────
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const existing = db.prepare('SELECT * FROM attributes WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ success: false, error: 'Атрибут не найден' });

        db.prepare('DELETE FROM attributes WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Атрибут удалён' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
