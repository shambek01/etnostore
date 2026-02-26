// routes/products.js — Full CRUD for products
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

// Multer — image upload to /uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `product_${Date.now()}${ext}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Только изображения'));
    },
});

// ── GET /api/products ──────────────────────────────────────
// Query: ?cat=rings&metal=gold585&stone=turquoise&q=text&sort=price-asc&badge=hit&limit=N&in_stock=1
router.get('/', (req, res) => {
    try {
        const db = getDb();
        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (req.query.cat) {
            sql += ' AND category = ?';
            params.push(req.query.cat);
        }
        if (req.query.metal) {
            sql += ' AND metal = ?';
            params.push(req.query.metal);
        }
        if (req.query.stone) {
            sql += ' AND stone = ?';
            params.push(req.query.stone);
        }
        if (req.query.badge) {
            sql += ' AND badge = ?';
            params.push(req.query.badge);
        }
        if (req.query.in_stock !== undefined) {
            sql += ' AND in_stock = ?';
            params.push(req.query.in_stock === '1' ? 1 : 0);
        }
        if (req.query.q) {
            sql += ' AND (name LIKE ? OR name_kz LIKE ? OR material LIKE ?)';
            const like = `%${req.query.q}%`;
            params.push(like, like, like);
        }
        if (req.query.min_price) {
            sql += ' AND price >= ?';
            params.push(parseInt(req.query.min_price));
        }
        if (req.query.max_price) {
            sql += ' AND price <= ?';
            params.push(parseInt(req.query.max_price));
        }

        // Sorting
        const sortMap = {
            'popular': 'reviews DESC',
            'new': 'created_at DESC',
            'price-asc': 'price ASC',
            'price-desc': 'price DESC',
            'rating': 'rating DESC, reviews DESC',
        };
        sql += ' ORDER BY ' + (sortMap[req.query.sort] || 'created_at DESC');

        if (req.query.limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(req.query.limit));
        }

        const products = db.prepare(sql).all(...params);
        res.json({ success: true, data: products, total: products.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── GET /api/products/stats ────────────────────────────────
router.get('/stats', (req, res) => {
    try {
        const db = getDb();
        const total = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
        const inStock = db.prepare('SELECT COUNT(*) as c FROM products WHERE in_stock=1').get().c;
        const byCategory = db.prepare(`
      SELECT category, COUNT(*) as count FROM products GROUP BY category
    `).all();
        res.json({ success: true, data: { total, inStock, byCategory } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── GET /api/products/:id ──────────────────────────────────
router.get('/:id', (req, res) => {
    try {
        const db = getDb();
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: 'Товар не найден' });

        const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(req.params.id);
        product.images = images;

        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── POST /api/products ─────────────────────────────────────
router.post('/', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), (req, res) => {
    try {
        const db = getDb();
        const {
            name, name_kz, category, price, old_price,
            rating, reviews, metal, stone, badge, material, description, description_kz, in_stock,
        } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ success: false, error: 'Поля name, category, price обязательны' });
        }

        const id = uuidv4();
        const img = (req.files && req.files['img'] && req.files['img'][0]) ? `/uploads/${req.files['img'][0].filename}` : (req.body.img_url || '');

        db.prepare(`
      INSERT INTO products (id, name, name_kz, category, price, old_price, rating, reviews, img, metal, stone, badge, material, description, description_kz, in_stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            id, name, name_kz || name, category,
            parseInt(price), old_price ? parseInt(old_price) : null,
            parseFloat(rating || '5'), parseInt(reviews || '0'),
            img, metal || 'gold585', stone || 'turquoise',
            badge || '', material || '', description || '', description_kz || '',
            in_stock === '0' ? 0 : 1,
        );

        // Handle gallery images
        if (req.files && req.files['gallery']) {
            const insertImage = db.prepare('INSERT INTO product_images (id, product_id, img_url) VALUES (?, ?, ?)');
            const insertMany = db.transaction((files) => {
                for (const file of files) {
                    insertImage.run(uuidv4(), id, `/uploads/${file.filename}`);
                }
            });
            insertMany(req.files['gallery']);
        }

        const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(id);
        created.images = images;

        res.status(201).json({ success: true, data: created });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── PUT /api/products/:id ──────────────────────────────────
router.put('/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), (req, res) => {
    try {
        const db = getDb();
        const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ success: false, error: 'Товар не найден' });

        const {
            name, name_kz, category, price, old_price,
            rating, reviews, metal, stone, badge, material, description, description_kz, in_stock, img_url,
        } = req.body;

        const img = (req.files && req.files['img'] && req.files['img'][0]) ? `/uploads/${req.files['img'][0].filename}` : (img_url || existing.img);

        db.prepare(`
      UPDATE products SET
        name=?, name_kz=?, category=?, price=?, old_price=?,
        rating=?, reviews=?, img=?, metal=?, stone=?,
        badge=?, material=?, description=?, description_kz=?, in_stock=?
      WHERE id=?
    `).run(
            name || existing.name,
            name_kz || existing.name_kz,
            category || existing.category,
            price ? parseInt(price) : existing.price,
            old_price !== undefined ? (old_price ? parseInt(old_price) : null) : existing.old_price,
            rating ? parseFloat(rating) : existing.rating,
            reviews !== undefined ? parseInt(reviews) : existing.reviews,
            img,
            metal || existing.metal,
            stone || existing.stone,
            badge !== undefined ? badge : existing.badge,
            material !== undefined ? material : existing.material,
            description !== undefined ? description : existing.description,
            description_kz !== undefined ? description_kz : existing.description_kz,
            in_stock !== undefined ? (in_stock === '0' ? 0 : 1) : existing.in_stock,
            req.params.id,
        );

        // Handle gallery images
        if (req.files && req.files['gallery']) {
            const insertImage = db.prepare('INSERT INTO product_images (id, product_id, img_url) VALUES (?, ?, ?)');
            const insertMany = db.transaction((files) => {
                for (const file of files) {
                    insertImage.run(uuidv4(), req.params.id, `/uploads/${file.filename}`);
                }
            });
            insertMany(req.files['gallery']);
        }

        const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(req.params.id);
        updated.images = images;

        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── DELETE /api/products/:id ───────────────────────────────
router.delete('/:id', (req, res) => {
    try {
        const db = getDb();
        const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ success: false, error: 'Товар не найден' });
        db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Товар удалён' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ── DELETE /api/products/:id/images/:imageId ───────────────
router.delete('/:id/images/:imageId', (req, res) => {
    try {
        const db = getDb();
        const imgParams = { id: req.params.imageId, product_id: req.params.id };
        const existing = db.prepare('SELECT * FROM product_images WHERE id = @id AND product_id = @product_id').get(imgParams);
        if (!existing) return res.status(404).json({ success: false, error: 'Изображение не найдено' });

        db.prepare('DELETE FROM product_images WHERE id = @id').run(imgParams);
        res.json({ success: true, message: 'Изображение удалено' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
