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
      description_kz TEXT DEFAULT '',
      in_stock    INTEGER DEFAULT 1,
      created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id    TEXT PRIMARY KEY,
      name  TEXT NOT NULL,
      name_kz TEXT,
      img   TEXT
    );

    CREATE TABLE IF NOT EXISTS attributes (
      id      TEXT PRIMARY KEY,
      type    TEXT NOT NULL,  -- 'metal', 'stone', 'badge'
      value   TEXT NOT NULL,  -- e.g., 'gold585', 'turquoise', 'hit'
      name_ru TEXT NOT NULL,
      name_kz TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id         TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      img_url    TEXT NOT NULL,
      is_main    INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // Seed products if table is empty
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (count.c === 0) {
    seedProducts();
  }
  // Seed categories if table is empty
  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (catCount.c === 0) {
    seedCategories();
  }
  // Seed attributes if table is empty
  const attrCount = db.prepare('SELECT COUNT(*) as c FROM attributes').get();
  if (attrCount.c === 0) {
    seedAttributes();
  }
}

function seedProducts() {
  const insert = db.prepare(`
    INSERT INTO products (id, name, name_kz, category, price, old_price, rating, reviews, img, metal, stone, badge, material, description, description_kz, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const products = [
    [uuidv4(), 'Алтын Моншақ', 'Алтын Моншақ', 'necklaces', 85000, null, 5.0, 48, '/images/category_necklaces.png', 'gold585', 'turquoise', 'hit', 'Золото 585 · Бирюза', 'Роскошное казахское ожерелье ручной работы из золота 585 пробы с натуральными камнями бирюзы.', '585 сынамалы алтын мен табиғи көгілдір ақық тастарынан қолдан жасалған сәнді қазақ алқасы.'],
    [uuidv4(), 'Гауhар Сырға', 'Гауhар Сырға', 'earrings', 42000, null, 5.0, 32, '/images/category_earrings.png', 'gold585', 'turquoise', '', 'Золото 585 · Бирюза', 'Традиционные казахские серьги-люстры с бирюзой. Изысканная филигранная работа.', 'Көгілдір ақық тасы бар дәстүрлі қазақ сырғалары. Нәзік зергерлік жұмыс.'],
    [uuidv4(), 'Қола Білезік', 'Қола Білезік', 'bracelets', 56000, 70000, 4.0, 21, '/images/category_bracelets.png', 'gold585', 'turquoise', 'sale', 'Золото 585 · Бирюза', 'Широкий браслет с орнаментальной гравировкой и инкрустацией бирюзой.', 'Ою-өрнекпен безендірілген және көгілдір ақық тасымен көмкерілген жалпақ білезік.'],
    [uuidv4(), 'Тас Жүзік', 'Тас Жүзік', 'rings', 38000, null, 5.0, 57, '/images/category_rings.png', 'gold585', 'turquoise', '', 'Золото 585 · Бирюза', 'Кольцо с традиционным орнаментом и крупным камнем бирюзы в центре.', 'Дәстүрлі ою-өрнегі бар және ортасында үлкен көгілдір ақық тасы бар жүзік.'],
    [uuidv4(), 'Шашбау', 'Шашбау', 'headpieces', 125000, null, 5.0, 14, '/images/category_headpiece.png', 'gold750', 'coral', 'new', 'Золото 750 · Бирюза · Коралл', 'Традиционное казахское свадебное головное украшение с ниспадающими цепочками.', 'Төмен түсетін шынжырлары бар дәстүрлі қазақтың үйлену тойына арналған бас киімі.'],
    [uuidv4(), 'Той Жиынтығы', 'Той Жиынтығы', 'sets', 280000, null, 5.0, 8, '/images/category_sets.png', 'gold585', 'pearl', '', 'Золото 585 · Жемчуг · Бирюза', 'Полный свадебный набор: ожерелье, серьги, браслет и кольцо в едином стиле.', 'Толық үйлену жиынтығы: бір стильдегі алқа, сырға, білезік және жүзік.'],
    [uuidv4(), 'Жіп Моншақ', 'Жіп Моншақ', 'necklaces', 64000, null, 4.0, 19, '/images/category_necklaces.png', 'gold585', 'coral', '', 'Золото 585 · Коралл', 'Изящное ожерелье с коралловыми подвесками в традиционном казахском стиле.', 'Дәстүрлі қазақ стиліндегі маржан салпыншақтары бар әдемі алқа.'],
    [uuidv4(), 'Алтын Сырға', 'Алтын Сырға', 'earrings', 35000, null, 5.0, 44, '/images/category_earrings.png', 'silver', 'turquoise', 'hit', 'Серебро · Бирюза', 'Серьги из серебра с бирюзой. Лёгкие и элегантные для повседневного ношения.', 'Көгілдір ақық тасымен күмістен жасалған сырғалар. Күнделікті киюге арналған жеңіл әрі талғампаз.'],
    [uuidv4(), 'Кең Білезік', 'Кең Білезік', 'bracelets', 78000, null, 5.0, 27, '/images/category_bracelets.png', 'gold750', 'garnet', 'new', 'Золото 750 · Гранат', 'Широкий браслет из золота 750 пробы с гранатами и орнаментальной рельефной гравировкой.', '750 сынамалы алтыннан анар және рельефті ою-өрнекпен безендірілген кең білезік.'],
    [uuidv4(), 'Жауhар Жүзік', 'Жауhар Жүзік', 'rings', 52000, null, 4.0, 33, '/images/category_rings.png', 'gold585', 'garnet', '', 'Золото 585 · Гранат', 'Классическое кольцо с гранатом в оправе из золота с тонкой гравировкой.', 'Жіңішке ою-өрнегі бар алтын жақтаудағы анар тасы бар классикалық жүзік.'],
    [uuidv4(), 'Сәукеле', 'Сәукеле', 'headpieces', 195000, null, 5.0, 6, '/images/category_headpiece.png', 'gold750', 'turquoise', 'new', 'Золото 750 · Бирюза · Жемчуг', 'Праздничный головной убор невесты с традиционными узорами и жемчужными нитями.', 'Дәстүрлі ою-өрнектері мен інжу жіптері бар қалыңдықтың мерекелік бас киімі.'],
    [uuidv4(), 'Брайдал Сет', 'Брайдал Сет', 'sets', 420000, 520000, 5.0, 4, '/images/category_sets.png', 'gold750', 'pearl', 'sale', 'Золото 750 · Жемчуг', 'Роскошный свадебный набор из золота 750 пробы с натуральным жемчугом.', 'Табиғи інжу-маржандары бар 750 сынамалы алтыннан жасалған керемет үйлену жиынтығы.'],
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });
  insertMany(products);
  console.log(`✅ Seeded ${products.length} products into database`);
}

function seedCategories() {
  const insert = db.prepare('INSERT INTO categories (id, name, name_kz, img) VALUES (?, ?, ?, ?)');
  const cats = [
    ['necklaces', 'Ожерелья', 'Моншақтар', '/images/category_necklaces.png'],
    ['earrings', 'Серьги', 'Сырғалар', '/images/category_earrings.png'],
    ['bracelets', 'Браслеты', 'Білезіктер', '/images/category_bracelets.png'],
    ['rings', 'Кольца', 'Жүзіктер', '/images/category_rings.png'],
    ['headpieces', 'Головные украшения', 'Бас әшекейлері', '/images/category_headpiece.png'],
    ['sets', 'Свадебные наборы', 'Үйлену жиынтықтары', '/images/category_sets.png'],
  ];
  const insertMany = db.transaction((rows) => { for (const row of rows) insert.run(...row); });
  insertMany(cats);
  console.log(`✅ Seeded ${cats.length} categories into database`);
}

function seedAttributes() {
  const insert = db.prepare('INSERT INTO attributes (id, type, value, name_ru, name_kz) VALUES (?, ?, ?, ?, ?)');
  const attrs = [
    [uuidv4(), 'metal', 'gold585', 'Золото 585', 'Алтын 585'],
    [uuidv4(), 'metal', 'gold750', 'Золото 750', 'Алтын 750'],
    [uuidv4(), 'metal', 'silver', 'Серебро', 'Күміс'],
    [uuidv4(), 'stone', 'turquoise', 'Бирюза', 'Көгілдір ақық'],
    [uuidv4(), 'stone', 'coral', 'Коралл', 'Маржан'],
    [uuidv4(), 'stone', 'pearl', 'Жемчуг', 'Інжу'],
    [uuidv4(), 'stone', 'garnet', 'Гранат', 'Анар'],
    [uuidv4(), 'badge', 'hit', 'Хит', 'Хит'],
    [uuidv4(), 'badge', 'new', 'Новинка', 'Жаңа'],
    [uuidv4(), 'badge', 'sale', 'Скидка', 'Жеңілдік'],
  ];
  const insertMany = db.transaction((rows) => { for (const row of rows) insert.run(...row); });
  insertMany(attrs);
  console.log(`✅ Seeded ${attrs.length} attributes into database`);
}

module.exports = { getDb };
