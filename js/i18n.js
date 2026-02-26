/* ============================================================
   i18n.js — Multilingual support: Russian (ru) / Kazakh (kz)
   ============================================================
   Usage:
     Add data-i18n="key" to any element.
     For placeholders: data-i18n-placeholder="key"
     Language is stored in localStorage under 'lang'.
   ============================================================ */
(function () {
    'use strict';

    const TRANSLATIONS = {
        ru: {
            // HEADER / NAV
            'nav.catalog': 'Каталог',
            'nav.about': 'О бренде',
            'nav.contact': 'Контакты',
            'nav.sale': 'Распродажа',
            'nav.new': 'Новинки',
            'nav.search.placeholder': 'Поиск украшений...',

            // ANNOUNCEMENT
            'announce.text': '✨ Бесплатная доставка по Казахстану от 50 000 ₸',

            // HERO
            'hero.subtitle': 'Казахские этничекcие украшения',
            'hero.title1': 'Украшения из',
            'hero.title2': 'сердца степей',
            'hero.desc': 'Ручная работа · Традиционные мотивы · Натуральные камни',
            'hero.btn1': 'Смотреть коллекцию',
            'hero.btn2': 'О нас',

            // SECTIONS
            'section.categories': 'Категории',
            'section.bestsellers': 'Хиты продаж',
            'section.about': 'О бренде',
            'section.instagram': 'Мы в Instagram',
            'section.newsletter': 'Подписка на новости',

            // CATEGORIES
            'cat.necklaces': 'Ожерелья',
            'cat.earrings': 'Серьги',
            'cat.bracelets': 'Браслеты',
            'cat.rings': 'Кольца',
            'cat.headpieces': 'Головные украшения',
            'cat.sets': 'Свадебные наборы',

            // CATALOG
            'catalog.title': 'Каталог',
            'catalog.filters': 'Фильтры',
            'catalog.sort.popular': 'По популярности',
            'catalog.sort.new': 'Новинки',
            'catalog.sort.price-asc': 'Цена ↑',
            'catalog.sort.price-desc': 'Цена ↓',
            'catalog.sort.rating': 'По рейтингу',
            'catalog.empty': 'По вашему запросу ничего не найдено',
            'catalog.resetFilters': 'Сбросить фильтры',
            'catalog.apply': 'Применить',
            'catalog.reset': 'Сбросить',
            'catalog.shown': 'Показано',
            'catalog.of': 'из',
            'catalog.prev': '‹ Назад',
            'catalog.next': 'Вперёд ›',

            // CART
            'cart.title': 'Корзина',
            'cart.empty': 'Корзина пуста',
            'cart.subtotal': 'Итого:',
            'cart.checkout': 'Оформить заказ',
            'cart.continue': 'Продолжить покупки',
            'cart.added': 'Добавлено в корзину',

            // PRODUCT
            'product.addToCart': 'В корзину',
            'product.buyKaspi': 'Купить на Kaspi.kz',
            'product.wishlist': 'В избранное',
            'product.details': 'Подробнее',
            'product.inStock': 'В наличии',
            'product.outOfStock': 'Нет в наличии',
            'product.material': 'Материал',
            'product.rating': 'Рейтинг',

            // BADGES
            'badge.hit': 'Хит',
            'badge.new': 'Новинка',
            'badge.sale': 'Скидка',

            // FOOTER
            'footer.shipping': 'Доставка',
            'footer.payment': 'Оплата',
            'footer.return': 'Возврат',
            'footer.contacts': 'Контакты',

            // NEWSLETTER
            'newsletter.title': 'Получайте вдохновение первыми',
            'newsletter.desc': 'Подпишитесь и узнавайте о новых коллекциях и специальных предложениях',
            'newsletter.placeholder': 'Ваш email',
            'newsletter.btn': 'Подписаться',

            // ABOUT
            'about.title': 'О бренде Altyn Biye',
            'about.subtitle': 'Сохраняем традиции. Создаём будущее.',

            // CONTACT
            'contact.title': 'Свяжитесь с нами',
            'contact.name': 'Ваше имя',
            'contact.phone': 'Телефон',
            'contact.email': 'Email',
            'contact.message': 'Сообщение',
            'contact.send': 'Отправить',
            'contact.whatsapp': 'Написать в WhatsApp',
        },

        kz: {
            // HEADER / NAV
            'nav.catalog': 'Каталог',
            'nav.about': 'Бренд туралы',
            'nav.contact': 'Байланыс',
            'nav.sale': 'Жеңілдіктер',
            'nav.new': 'Жаңалықтар',
            'nav.search.placeholder': 'Әшекей іздеу...',

            // ANNOUNCEMENT
            'announce.text': '✨ Қазақстан бойынша 50 000 ₸-ден тегін жеткізу',

            // HERO
            'hero.subtitle': 'Қазақ этникалық әшекейлері',
            'hero.title1': 'Дала жүрегінен',
            'hero.title2': 'шыққан әшекейлер',
            'hero.desc': 'Қолдан жасалған · Дәстүрлі ою-өрнектер · Табиғи тастар',
            'hero.btn1': 'Коллекцияні көру',
            'hero.btn2': 'Біз туралы',

            // SECTIONS
            'section.categories': 'Санаттар',
            'section.bestsellers': 'Хит сатылымдар',
            'section.about': 'Бренд туралы',
            'section.instagram': 'Біз Instagram-да',
            'section.newsletter': 'Жаңалықтарға жазылу',

            // CATEGORIES
            'cat.necklaces': 'Моншақтар',
            'cat.earrings': 'Сырғалар',
            'cat.bracelets': 'Білезіктер',
            'cat.rings': 'Жүзіктер',
            'cat.headpieces': 'Бас әшекейлері',
            'cat.sets': 'Үйлену жиынтықтары',

            // CATALOG
            'catalog.title': 'Каталог',
            'catalog.filters': 'Сүзгілер',
            'catalog.sort.popular': 'Танымалдылық бойынша',
            'catalog.sort.new': 'Жаңалықтар',
            'catalog.sort.price-asc': 'Баға ↑',
            'catalog.sort.price-desc': 'Баға ↓',
            'catalog.sort.rating': 'Рейтинг бойынша',
            'catalog.empty': 'Сұранысыңыз бойынша ештеңе табылмады',
            'catalog.resetFilters': 'Сүзгілерді тазалау',
            'catalog.apply': 'Қолдану',
            'catalog.reset': 'Тазалау',
            'catalog.shown': 'Көрсетілді',
            'catalog.of': 'барлығы',
            'catalog.prev': '‹ Алдыңғы',
            'catalog.next': 'Келесі ›',

            // CART
            'cart.title': 'Себет',
            'cart.empty': 'Себет бос',
            'cart.subtotal': 'Жиыны:',
            'cart.checkout': 'Тапсырыс беру',
            'cart.continue': 'Сатып алуды жалғастыру',
            'cart.added': 'Себетке қосылды',

            // PRODUCT
            'product.addToCart': 'Себетке',
            'product.buyKaspi': 'Kaspi.kz-де сатып алу',
            'product.wishlist': 'Таңдаулыларға',
            'product.details': 'Толығырақ',
            'product.inStock': 'Қоймада бар',
            'product.outOfStock': 'Жоқ',
            'product.material': 'Материал',
            'product.rating': 'Рейтинг',

            // BADGES
            'badge.hit': 'Хит',
            'badge.new': 'Жаңа',
            'badge.sale': 'Жеңілдік',

            // FOOTER
            'footer.shipping': 'Жеткізу',
            'footer.payment': 'Төлем',
            'footer.return': 'Қайтару',
            'footer.contacts': 'Байланыстар',

            // NEWSLETTER
            'newsletter.title': 'Бірінші болып шабыт алыңыз',
            'newsletter.desc': 'Жазылыңыз және жаңа коллекциялар мен ерекше ұсыныстар туралы біліңіз',
            'newsletter.placeholder': 'Электрондық поштаңыз',
            'newsletter.btn': 'Жазылу',

            // ABOUT
            'about.title': 'Altyn Biye бренді туралы',
            'about.subtitle': 'Дәстүрді сақтаймыз. Болашақ жасаймыз.',

            // CONTACT
            'contact.title': 'Бізбен байланысыңыз',
            'contact.name': 'Атыңыз',
            'contact.phone': 'Телефон',
            'contact.email': 'Email',
            'contact.message': 'Хабарлама',
            'contact.send': 'Жіберу',
            'contact.whatsapp': 'WhatsApp-та жазу',
        },
    };

    // ── Core functions ─────────────────────────────────────────
    function getLang() {
        return localStorage.getItem('lang') || 'ru';
    }

    function setLang(lang) {
        if (!TRANSLATIONS[lang]) return;
        localStorage.setItem('lang', lang);
        window._lang = lang;
        applyLang();
        updateSwitcher();
    }

    function t(key) {
        const lang = getLang();
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.ru?.[key] || key;
    }

    function applyLang() {
        const lang = getLang();
        document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';

        // text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const val = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.ru?.[key];
            if (val !== undefined) el.textContent = val;
        });

        // placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const val = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.ru?.[key];
            if (val !== undefined) el.placeholder = val;
        });

        // HTML content
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            const val = TRANSLATIONS[lang]?.[key] || TRANSLATIONS.ru?.[key];
            if (val !== undefined) el.innerHTML = val;
        });
    }

    function updateSwitcher() {
        const lang = getLang();
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    // ── Language switcher ──────────────────────────────────────
    function injectSwitcher() {
        // Find any existing placeholder with class .lang-switcher or inject into header
        let container = document.querySelector('.lang-switcher');
        if (!container) {
            // Try to inject near search/cart icons in header
            const headerIcons = document.querySelector('.header-icons') || document.querySelector('.header-actions');
            if (!headerIcons) return;
            container = document.createElement('div');
            container.className = 'lang-switcher';
            headerIcons.prepend(container);
        }
        container.innerHTML = `
      <button class="lang-btn${getLang() === 'ru' ? ' active' : ''}" data-lang="ru" onclick="window.i18n.setLang('ru')">RU</button>
      <span class="lang-sep">|</span>
      <button class="lang-btn${getLang() === 'kz' ? ' active' : ''}" data-lang="kz" onclick="window.i18n.setLang('kz')">KZ</button>
    `;
    }

    // ── Expose globally ────────────────────────────────────────
    window.i18n = { t, setLang, getLang, applyLang };
    window._lang = getLang();
    window.applyLang = applyLang; // used by catalog.js

    // ── Auto-init ──────────────────────────────────────────────
    function init() {
        injectSwitcher();
        applyLang();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
