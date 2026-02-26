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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve index.html for page navigation ─────────
app.get('*', (req, res) => {
    // Skip asset requests (css, js, images, etc.)
    const ext = path.extname(req.path);
    if (ext && ext !== '.html') {
        return res.status(404).send('Not found');
    }
    const indexPath = path.resolve(ROOT_DIR, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('❌ Cannot serve index.html:', err.message, '| ROOT_DIR:', ROOT_DIR);
            res.status(404).send('Page not found');
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
