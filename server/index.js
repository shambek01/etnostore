// server/index.js — Express App Entry Point
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve static site files (HTML/CSS/JS/images)
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve index.html for SPA-style nav ──────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
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
