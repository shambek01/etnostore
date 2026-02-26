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
            'nav.home': 'Главная',
            'nav.catalog': 'Каталог',
            'nav.about': 'О бренде',
            'nav.contact': 'Контакты',
            'nav.sale': 'Распродажа',
            'nav.new': 'Новинки',
            'nav.search.placeholder': 'Поиск украшений...',

            // HEADER / PROMO (from index.html)
            'header.promo': '🎁 Бесплатная доставка при заказе от 25 000 ₸',
            'header.promoLink': 'Смотреть коллекцию →',
            'header.bestsellers': 'Хиты продаж',
            'header.new': 'Новинки',
            'header.catalog': 'Каталог',
            'header.about': 'О бренде',
            'header.sale': 'Распродажа',
            'header.contacts': 'Контакты',

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
            'section.about': 'О нас',
            'section.instagram': 'Мы в Instagram',
            'section.newsletter': 'Подписка на новости',

            'bestsellers.title': 'Самые популярные',
            'bestsellers.viewAll': 'Смотреть все товары',

            'promo.tag': '✦ Новая коллекция 2024',
            'promo.title': 'Свадебные украшения ручной работы',
            'promo.desc': 'Создайте незабываемый образ для вашего особого дня. Каждое изделие выполнено казахскими мастерами по традиционным технологиям.',
            'promo.btn': 'Смотреть свадебную коллекцию',

            // CATEGORIES
            'cat.necklaces': 'Ожерелья',
            'cat.earrings': 'Серьги',
            'cat.bracelets': 'Браслеты',
            'cat.rings': 'Кольца',
            'cat.headpieces': 'Головные украшения',
            'cat.sets': 'Свадебные наборы',

            // CATALOG
            'catalog.title': 'Каталог',
            'catalog.category': 'Категория',
            'catalog.price': 'Цена (₸)',
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
            'product.add_cart': 'В корзину',
            'product.buyKaspi': 'Купить на Kaspi.kz',
            'product.buy_kaspi': 'Купить на Kaspi.kz',
            'product.wishlist': 'В избранное',
            'product.details': 'Подробнее',
            'product.inStock': 'В наличии',
            'product.outOfStock': 'Нет в наличии',
            'product.in_stock': 'В наличии',
            'product.material': 'Материал',
            'product.rating': 'Рейтинг',
            'product.feature_quality': 'Гарантия качества',
            'product.feature_delivery': 'Быстрая доставка',
            'product.feature_handmade': 'Ручная работа',

            // BADGES
            'badge.hit': 'Хит',
            'badge.new': 'Новинка',
            'badge.sale': 'Скидка',

            // FOOTER
            'footer.shipping': 'Доставка и оплата',
            'footer.payment': 'Оплата',
            'footer.return': 'Возврат и обмен',
            'footer.contacts': 'Контакты',
            'footer.tagline': 'Қазақ Зергерлігі',
            'footer.desc': 'Ювелирные украшения в казахском этно стиле. Ручная работа, натуральные камни, золото 585 пробы. Доставка по всему Казахстану.',
            'footer.info': 'Информация',
            'footer.care': 'Уход за украшениями',
            'footer.certs': 'Сертификаты',
            'footer.privacy': 'Политика конфиденциальности',
            'footer.terms': 'Публичная оферта',
            'footer.copyright': '© 2024 Altyn Biye. Все права защищены. Казахстан.',

            // NEWSLETTER
            'newsletter.subtitle': 'Каждую неделю',
            'newsletter.title': 'Получайте вдохновение первыми',
            'newsletter.desc': 'Мы не рассылаем спам. Только новинки и специальные предложения.',
            'newsletter.placeholder': 'Ваш email адрес',
            'newsletter.btn': 'Подписаться',

            // ABOUT
            'about.title': 'Наследие в каждом изделии',
            'about.subtitle': 'Сохраняем традиции. Создаём будущее.',
            'about.p1': 'Altyn Biye — казахский бренд ювелирных украшений, основанных на традициях наших предков. Наши мастера создают каждое изделие вручную, используя технологии, передаваемые из поколения в поколение.',
            'about.p2': 'Мы черпаем вдохновение в богатой культуре казахского народа — от орнаментов юрт до узоров национальной одежды. Каждое украшение — это история, которую вы носите с собой.',
            'about.v1.title': 'Ручная работа',
            'about.v1.desc': 'Каждое изделие создаётся вручную',
            'about.v2.title': 'Традиции',
            'about.v2.desc': 'Казахская культура и орнаменты',
            'about.v3.title': 'Качество',
            'about.v3.desc': 'Золото 585 и натуральные камни',
            'about.btn': 'Наша история',

            // INSTAGRAM
            'instagram.subtitle': 'Следите за нами',
            'instagram.title': '@altynbiye_kz',
            'instagram.handle': 'Отмечайте нас в Instagram #AltynBiye',

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
            'nav.home': 'Басты бет',
            'nav.catalog': 'Каталог',
            'nav.about': 'Бренд туралы',
            'nav.contact': 'Байланыс',
            'nav.sale': 'Жеңілдіктер',
            'nav.new': 'Жаңалықтар',
            'nav.search.placeholder': 'Әшекей іздеу...',

            // HEADER / PROMO (from index.html)
            'header.promo': '🎁 25 000 ₸ басталатын тапсырыс кезінде тегін жеткізу',
            'header.promoLink': 'Топтаманы көру →',
            'header.bestsellers': 'Хит сатылымдар',
            'header.new': 'Жаңалықтар',
            'header.catalog': 'Каталог',
            'header.about': 'Бренд туралы',
            'header.sale': 'Жеңілдіктер',
            'header.contacts': 'Байланыстар',

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
            'section.about': 'Біз туралы',
            'section.instagram': 'Біз Instagram-да',
            'section.newsletter': 'Жаңалықтарға жазылу',

            'bestsellers.title': 'Ең танымал',
            'bestsellers.viewAll': 'Барлық тауарларды көру',

            'promo.tag': '✦ Жаңа топтама 2024',
            'promo.title': 'Қолдан жасалған үйлену тойына арналған әшекейлер',
            'promo.desc': 'Ерекше күніңіз үшін ұмытылмас бейне жасаңыз. Әрбір бұйымды қазақ шеберлері дәстүрлі технологиялармен жасайды.',
            'promo.btn': 'Үйлену топтамасын көру',

            // CATEGORIES
            'cat.necklaces': 'Моншақтар',
            'cat.earrings': 'Сырғалар',
            'cat.bracelets': 'Білезіктер',
            'cat.rings': 'Жүзіктер',
            'cat.headpieces': 'Бас әшекейлері',
            'cat.sets': 'Үйлену жиынтықтары',

            // CATALOG
            'catalog.title': 'Каталог',
            'catalog.category': 'Санат',
            'catalog.price': 'Баға (₸)',
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
            'product.add_cart': 'Себетке',
            'product.buyKaspi': 'Kaspi.kz-де сатып алу',
            'product.buy_kaspi': 'Kaspi.kz-де сатып алу',
            'product.wishlist': 'Таңдаулыларға',
            'product.details': 'Толығырақ',
            'product.inStock': 'Қоймада бар',
            'product.outOfStock': 'Жоқ',
            'product.in_stock': 'Қоймада бар',
            'product.material': 'Материал',
            'product.rating': 'Рейтинг',
            'product.feature_quality': 'Сапа кепілдігі',
            'product.feature_delivery': 'Жылдам жеткізу',
            'product.feature_handmade': 'Қол жұмысы',

            // BADGES
            'badge.hit': 'Хит',
            'badge.new': 'Жаңа',
            'badge.sale': 'Жеңілдік',

            // FOOTER
            'footer.shipping': 'Жеткізу және төлеу',
            'footer.payment': 'Төлем',
            'footer.return': 'Қайтару және айырбастау',
            'footer.contacts': 'Байланыстар',
            'footer.tagline': 'Қазақ Зергерлігі',
            'footer.desc': 'Қазақтың этно стиліндегі зергерлік бұйымдары. Қол жұмысы, табиғи тастар, 585 алтын. Қазақстан бойынша жеткізу.',
            'footer.info': 'Ақпарат',
            'footer.care': 'Әшекейлерді күту',
            'footer.certs': 'Сертификаттар',
            'footer.privacy': 'Құпиялылық саясаты',
            'footer.terms': 'Жария оферта',
            'footer.copyright': '© 2024 Altyn Biye. Барлық құқықтар қорғалған. Қазақстан.',

            // NEWSLETTER
            'newsletter.subtitle': 'Апта сайын',
            'newsletter.title': 'Бірінші болып шабыт алыңыз',
            'newsletter.desc': 'Біз спам жібермейміз. Тек жаңалықтар мен арнайы ұсыныстар.',
            'newsletter.placeholder': 'Электрондық поштаңыз',
            'newsletter.btn': 'Жазылу',

            // ABOUT
            'about.title': 'Әр бұйымдағы мұра',
            'about.subtitle': 'Дәстүрді сақтаймыз. Болашақ жасаймыз.',
            'about.p1': 'Altyn Biye — ата-бабамыздың дәстүрлеріне негізделген қазақстандық зергерлік бұйымдар бренді. Біздің шеберлер ұрпақтан-ұрпаққа берілетін технологияларды қолдана отырып, әр бұйымды қолдан жасайды.',
            'about.p2': 'Біз қазақ халқының бай мәдениетінен — киіз үй өрнектерінен бастап ұлттық киімдердің өрнектеріне дейін шабыт аламыз. Әрбір әшекей — сізбен бірге жүретін тарих.',
            'about.v1.title': 'Қол жұмысы',
            'about.v1.desc': 'Әрбір бұйым қолдан жасалады',
            'about.v2.title': 'Дәстүрлер',
            'about.v2.desc': 'Қазақ мәдениеті мен ою-өрнектері',
            'about.v3.title': 'Сапа',
            'about.v3.desc': '585 алтын және табиғи тастар',
            'about.btn': 'Біздің тарихымыз',

            // INSTAGRAM
            'instagram.subtitle': 'Бізді бақылап отырыңыз',
            'instagram.title': '@altynbiye_kz',
            'instagram.handle': 'Бізді Instagram-да белгілеңіз #AltynBiye',

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
