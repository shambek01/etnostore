// database.js — SQLite setup and seed data
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '..', 'store.db');

let db;

function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initSchema();
    }
    return db;
}

function initSchema() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          TEXT    PRIMARY KEY,
      name        TEXT    NOT NULL,
      name_kz     TEXT,
      category    TEXT    NOT NULL,
      price       INTEGER NOT NULL,
      old_price   INTEGER,
      rating      REAL    DEFAULT 5.0,
      reviews     INTEGER DEFAULT 0,
      img         TEXT    DEFAULT '',
      metal       TEXT    DEFAULT 'gold585',
      stone       TEXT    DEFAULT 'turquoise',
      badge       TEXT    DEFAULT '',
      material    TEXT    DEFAULT '',
      description TEXT    DEFAULT '',
      in_stock    INTEGER DEFAULT 1,
      created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id    TEXT PRIMARY KEY,
      name  TEXT NOT NULL,
      name_kz TEXT,
      img   TEXT
    );
  `);

    // Seed products if table is empty
    const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
    if (count.c === 0) {
        seedProducts();
    }
}

function seedProducts() {
    const insert = db.prepare(`
    INSERT INTO products (id, name, name_kz, category, price, old_price, rating, reviews, img, metal, stone, badge, material, description, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

    const products = [
        [uuidv4(), 'Алтын Моншақ', 'Алтын Моншақ', 'necklaces', 85000, null, 5.0, 48, '/images/category_necklaces.png', 'gold585', 'turquoise', 'hit', 'Золото 585 · Бирюза', 'Роскошное казахское ожерелье ручной работы из золота 585 пробы с натуральными камнями бирюзы.'],
        [uuidv4(), 'Гауhар Сырға', 'Гауhар Сырға', 'earrings', 42000, null, 5.0, 32, '/images/category_earrings.png', 'gold585', 'turquoise', '', 'Золото 585 · Бирюза', 'Традиционные казахские серьги-люстры с бирюзой. Изысканная филигранная работа.'],
        [uuidv4(), 'Қола Білезік', 'Қола Білезік', 'bracelets', 56000, 70000, 4.0, 21, '/images/category_bracelets.png', 'gold585', 'turquoise', 'sale', 'Золото 585 · Бирюза', 'Широкий браслет с орнаментальной гравировкой и инкрустацией бирюзой.'],
        [uuidv4(), 'Тас Жүзік', 'Тас Жүзік', 'rings', 38000, null, 5.0, 57, '/images/category_rings.png', 'gold585', 'turquoise', '', 'Золото 585 · Бирюза', 'Кольцо с традиционным орнаментом и крупным камнем бирюзы в центре.'],
        [uuidv4(), 'Шашбау', 'Шашбау', 'headpieces', 125000, null, 5.0, 14, '/images/category_headpiece.png', 'gold750', 'coral', 'new', 'Золото 750 · Бирюза · Коралл', 'Традиционное казахское свадебное головное украшение с ниспадающими цепочками.'],
        [uuidv4(), 'Той Жиынтығы', 'Той Жиынтығы', 'sets', 280000, null, 5.0, 8, '/images/category_sets.png', 'gold585', 'pearl', '', 'Золото 585 · Жемчуг · Бирюза', 'Полный свадебный набор: ожерелье, серьги, браслет и кольцо в едином стиле.'],
        [uuidv4(), 'Жіп Моншақ', 'Жіп Моншақ', 'necklaces', 64000, null, 4.0, 19, '/images/category_necklaces.png', 'gold585', 'coral', '', 'Золото 585 · Коралл', 'Изящное ожерелье с коралловыми подвесками в традиционном казахском стиле.'],
        [uuidv4(), 'Алтын Сырға', 'Алтын Сырға', 'earrings', 35000, null, 5.0, 44, '/images/category_earrings.png', 'silver', 'turquoise', 'hit', 'Серебро · Бирюза', 'Серьги из серебра с бирюзой. Лёгкие и элегантные для повседневного ношения.'],
        [uuidv4(), 'Кең Білезік', 'Кең Білезік', 'bracelets', 78000, null, 5.0, 27, '/images/category_bracelets.png', 'gold750', 'garnet', 'new', 'Золото 750 · Гранат', 'Широкий браслет из золота 750 пробы с гранатами и орнаментальной рельефной гравировкой.'],
        [uuidv4(), 'Жауhар Жүзік', 'Жауhар Жүзік', 'rings', 52000, null, 4.0, 33, '/images/category_rings.png', 'gold585', 'garnet', '', 'Золото 585 · Гранат', 'Классическое кольцо с гранатом в оправе из золота с тонкой гравировкой.'],
        [uuidv4(), 'Сәукеле', 'Сәукеле', 'headpieces', 195000, null, 5.0, 6, '/images/category_headpiece.png', 'gold750', 'turquoise', 'new', 'Золото 750 · Бирюза · Жемчуг', 'Праздничный головной убор невесты с традиционными узорами и жемчужными нитями.'],
        [uuidv4(), 'Брайдал Сет', 'Брайдал Сет', 'sets', 420000, 520000, 5.0, 4, '/images/category_sets.png', 'gold750', 'pearl', 'sale', 'Золото 750 · Жемчуг', 'Роскошный свадебный набор из золота 750 пробы с натуральным жемчугом.'],
    ];

    const insertMany = db.transaction((rows) => {
        for (const row of rows) insert.run(...row);
    });
    insertMany(products);
    console.log(`✅ Seeded ${products.length} products into database`);
}

module.exports = { getDb };
