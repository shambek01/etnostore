// server/index.js — Express App Entry Point
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Absolute path to project root (onlinestore/)
const ROOT_DIR = path.resolve(__dirname, '..');
console.log('📁 ROOT_DIR:', ROOT_DIR);

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(ROOT_DIR, 'uploads')));

// Serve static site files (HTML/CSS/JS/images)
app.use(express.static(ROOT_DIR));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve requested .html or fallback to index.html
app.get('*', (req, res) => {
    const ext = path.extname(req.path);

    // Non-HTML asset not found by static middleware → 404
    if (ext && ext !== '.html') {
        return res.status(404).send('Asset not found');
    }

    // Try to serve the exact HTML file requested (e.g. /about → about.html, /admin.html → admin.html)
    const name = req.path.replace(/^\//, '').replace(/\.html$/, '') || 'index';
    const filePath = path.resolve(ROOT_DIR, `${name}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            // Fallback to index.html for unknown routes
            res.sendFile(path.resolve(ROOT_DIR, 'index.html'), (err2) => {
                if (err2) res.status(404).send('Page not found');
            });
        }
    });
});

// ── Error handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({ success: false, error: err.message });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   🌟 Altyn Biye Server Running       ║
║   http://localhost:${PORT}              ║
║   Admin: http://localhost:${PORT}/admin ║
╚══════════════════════════════════════╝
  `);
});
