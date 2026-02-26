// routes/categories.js — CRUD for categories
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
    filename: (req, file, cb) => cb(null, `cat_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all
router.get('/', (req, res) => {
    try {
        const cats = getDb().prepare('SELECT * FROM categories ORDER BY rowid').all();
        res.json({ success: true, data: cats });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// POST create
router.post('/', upload.single('img'), (req, res) => {
    try {
        const { name, name_kz } = req.body;
        if (!name) return res.status(400).json({ success: false, error: 'name обязателен' });
        const id = req.body.id || name.toLowerCase().replace(/\s+/g, '_');
        const img = req.file ? `/uploads/${req.file.filename}` : (req.body.img_url || '');
        getDb().prepare('INSERT INTO categories (id,name,name_kz,img) VALUES (?,?,?,?)').run(id, name, name_kz || name, img);
        res.status(201).json({ success: true, data: getDb().prepare('SELECT * FROM categories WHERE id=?').get(id) });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PUT update
router.put('/:id', upload.single('img'), (req, res) => {
    try {
        const db = getDb();
        const old = db.prepare('SELECT * FROM categories WHERE id=?').get(req.params.id);
        if (!old) return res.status(404).json({ success: false, error: 'Категория не найдена' });
        const img = req.file ? `/uploads/${req.file.filename}` : (req.body.img_url || old.img);
        db.prepare('UPDATE categories SET name=?,name_kz=?,img=? WHERE id=?')
            .run(req.body.name || old.name, req.body.name_kz || old.name_kz, img, req.params.id);
        res.json({ success: true, data: db.prepare('SELECT * FROM categories WHERE id=?').get(req.params.id) });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        if (!db.prepare('SELECT id FROM categories WHERE id=?').get(req.params.id))
            return res.status(404).json({ success: false, error: 'Не найдена' });
        db.prepare('DELETE FROM categories WHERE id=?').run(req.params.id);
        res.json({ success: true, message: 'Удалено' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
