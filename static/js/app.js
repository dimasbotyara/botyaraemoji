/**
 * botyaraemoji — Emoji Picker App
 * Main JavaScript module
 */

(function () {
    'use strict';

    /* ================================================
       CONFIGURATION
       ================================================ */

    // Theme accent mappings — unique accents per theme
    const THEME_ACCENTS = {
        mocha:     ['green','teal','blue','mauve','pink','peach','yellow','red'],
        macchiato: ['lavender','blue','teal','green','pink','mauve','peach','red'],
        frappe:    ['peach','green','blue','mauve','pink','teal','yellow','red'],
        latte:     ['pink','mauve','blue','green','teal','peach','red','yellow'],
        'nord-dark':  ['frost','blue','cyan','green','purple','red','orange','yellow'],
        'nord-light': ['blue','frost','cyan','green','purple','red','orange','yellow'],
        dracula:   ['purple','pink','green','cyan','orange','red','yellow','blue'],
        rosepine:  ['gold','rose','iris','foam','pine','love','subtle','text'],
    };

    // Default accent per theme (first in array)
    const DEFAULT_ACCENTS = {};
    for (const [theme, accents] of Object.entries(THEME_ACCENTS)) {
        DEFAULT_ACCENTS[theme] = accents[0];
    }

    // Accent display colors for the palette buttons
    const ACCENT_COLORS = {
        // Mocha
        green:    '#a6e3a1', teal:     '#94e2d5', blue:     '#89b4fa',
        mauve:    '#cba6f7', pink:     '#f5c2e7', peach:    '#fab387',
        yellow:   '#f9e2af', red:      '#f38ba8',
        // Macchiato additions
        lavender: '#b7bdf8',
        // Nord
        frost:    '#88c0d0', cyan:     '#8fbcbb', purple:   '#b48ead',
        orange:   '#d08770',
        // Rosé Pine
        gold:     '#f6c177', rose:     '#ebbcba', iris:     '#c4a7e7',
        foam:     '#9ccfd8', pine:     '#31748f', love:     '#eb6f92',
        subtle:   '#908caa', text:     '#e0def4',
    };

    // Theme-specific accent colors (overrides for accuracy)
    const THEME_ACCENT_COLORS = {
        mocha:     { green:'#a6e3a1', teal:'#94e2d5', blue:'#89b4fa', mauve:'#cba6f7', pink:'#f5c2e7', peach:'#fab387', yellow:'#f9e2af', red:'#f38ba8' },
        macchiato: { lavender:'#b7bdf8', blue:'#8aadf4', teal:'#8bd5ca', green:'#a6da95', pink:'#f5bde6', mauve:'#c6a0f6', peach:'#f5a97f', red:'#ed8796' },
        frappe:    { peach:'#ef9f76', green:'#a6d189', blue:'#8caaee', mauve:'#ca9ee6', pink:'#f4b8e4', teal:'#81c8be', yellow:'#e5c890', red:'#e78284' },
        latte:     { pink:'#ea76cb', mauve:'#8839ef', blue:'#1e66f5', green:'#40a02b', teal:'#179299', peach:'#fe640b', red:'#d20f39', yellow:'#df8e1d' },
        'nord-dark':  { frost:'#88c0d0', blue:'#5e81ac', cyan:'#8fbcbb', green:'#a3be8c', purple:'#b48ead', red:'#bf616a', orange:'#d08770', yellow:'#ebcb8b' },
        'nord-light': { blue:'#5e81ac', frost:'#88c0d0', cyan:'#8fbcbb', green:'#a3be8c', purple:'#b48ead', red:'#bf616a', orange:'#d08770', yellow:'#ebcb8b' },
        dracula:   { purple:'#bd93f9', pink:'#ff79c6', green:'#50fa7b', cyan:'#8be9fd', orange:'#ffb86c', red:'#ff5555', yellow:'#f1fa8c', blue:'#6272a4' },
        rosepine:  { gold:'#f6c177', rose:'#ebbcba', iris:'#c4a7e7', foam:'#9ccfd8', pine:'#31748f', love:'#eb6f92', subtle:'#908caa', text:'#e0def4' },
    };

    // Translations
    const I18N = {
        en: {
            search_placeholder: 'Search emojis...',
            recent: 'Recent',
            no_recent: 'No recent emojis yet. Click an emoji to copy it!',
            copied: 'Copied!',
            settings: 'Settings',
            language: 'Language',
            theme: 'Theme',
            accent_color: 'Accent Color',
            no_results: 'No emojis found',
            no_results_hint: 'Try a different search',
        },
        ru: {
            search_placeholder: 'Поиск эмодзи...',
            recent: 'Недавние',
            no_recent: 'Пока нет недавних эмодзи. Нажмите на эмодзи, чтобы скопировать!',
            copied: 'Скопировано!',
            settings: 'Настройки',
            language: 'Язык',
            theme: 'Тема',
            accent_color: 'Цвет акцента',
            no_results: 'Эмодзи не найдены',
            no_results_hint: 'Попробуйте другой запрос',
        }
    };

    // Simple emoji name mapping for search
    const EMOJI_SEARCH_NAMES = {
        '😀':'grinning face улыбка радость','😃':'smiley face счастье','😄':'smile улыбка',
        '😁':'grin ухмылка','😆':'laughing смех','😅':'sweat smile пот нервный смех',
        '🤣':'rofl ржу','😂':'joy слёзы радости','🙂':'slightly smiling легкая улыбка',
        '🙃':'upside down перевернутый','😉':'wink подмигивание','😊':'blush румянец',
        '😇':'innocent ангел','🥰':'love hearts любовь','😍':'heart eyes влюблённый',
        '🤩':'star struck звёздные глаза','😘':'kissing heart поцелуй','😗':'kiss поцелуй',
        '😚':'kissing closed eyes поцелуй','😙':'kissing smiling eyes поцелуй',
        '😋':'yummy вкусно','😛':'tongue язык','😜':'wink tongue подмигивание язык',
        '🤪':'zany crazy сумасшедший','😝':'squinting tongue язык','🤑':'money деньги',
        '🤗':'hugging обнимашки','🤔':'thinking думаю','🤐':'zipper mouth замок рот',
        '😐':'neutral нейтральный','😑':'expressionless безразличный',
        '😶':'no mouth без рта молчание','😏':'smirk ухмылка','😒':'unamused недовольный',
        '🙄':'eye roll закатить глаза','😬':'grimacing гримаса','🤥':'lying врун',
        '😌':'relieved облегчение','😔':'pensive задумчивый','😪':'sleepy сонный',
        '🤤':'drooling слюни','😴':'sleeping спит','😷':'mask маска',
        '🤒':'thermometer температура болезнь','🤕':'bandage бинт травма',
        '🤢':'nauseated тошнота','🤮':'vomiting рвота','🤧':'sneezing чих',
        '🥵':'hot жарко','🥶':'cold холодно','🥴':'woozy пьяный',
        '😵':'dizzy головокружение','🤯':'exploding head взрыв мозга',
        '🤠':'cowboy ковбой','🥳':'party вечеринка','🥸':'disguised маскировка',
        '😎':'sunglasses крутой','🤓':'nerd ботаник','🧐':'monocle монокль',
        '😕':'confused озадаченный','😟':'worried обеспокоенный','🙁':'frowning хмурый',
        '😮':'open mouth рот открыт','😯':'hushed удивлённый','😲':'astonished поражён',
        '😳':'flushed покрасневший','🥺':'pleading просящий','🥹':'holding back tears слёзы',
        '😨':'fearful страх','😰':'anxious тревога','😥':'sad грусть',
        '😢':'cry плач','😭':'sobbing рыдание','😱':'scream крик',
        '😤':'steam from nose злость','😡':'angry злой','😠':'mad сердитый',
        '🤬':'cursing ругань','😈':'devil devil дьявол','👿':'imp бес',
        '💀':'skull череп','☠️':'skull crossbones пират','💩':'poop какашка',
        '🤡':'clown клоун','👻':'ghost привидение','👽':'alien инопланетянин',
        '👾':'alien monster пришелец','🤖':'robot робот',
        '❤️':'red heart красное сердце','🧡':'orange heart оранжевое сердце',
        '💛':'yellow heart жёлтое сердце','💚':'green heart зелёное сердце',
        '💙':'blue heart голубое сердце','💜':'purple heart фиолетовое сердце',
        '🖤':'black heart чёрное сердце','🤍':'white heart белое сердце',
        '🤎':'brown heart коричневое сердце','💔':'broken heart разбитое сердце',
        '👍':'thumbs up палец вверх класс','👎':'thumbs down палец вниз',
        '👋':'wave привет махать','✋':'hand рука стоп','🖐️':'hand spread пальцы',
        '🤝':'handshake рукопожатие','🙏':'pray молитва пожалуйста',
        '👏':'clap хлопать','💪':'muscle мышца сила','👀':'eyes глаза',
        '🔥':'fire огонь','💧':'water вода','⭐':'star звезда',
        '🌈':'rainbow радуга','☀️':'sun солнце','🌙':'moon луна',
        '❄️':'snowflake снежинка','🌊':'wave волна','🍎':'apple яблоко',
        '🍕':'pizza пицца','🍔':'burger бургер','🎉':'party popper конфетти',
        '🎊':'confetti ball праздник','🎈':'balloon шарик','🎁':'gift подарок',
        '🏆':'trophy трофей','⚽':'soccer football футбол','🏀':'basketball баскетбол',
        '✈️':'airplane самолёт','🚗':'car машина','🏠':'house дом',
        '💻':'computer компьютер','📱':'phone телефон','🔑':'key ключ',
        '🔒':'lock замок','✅':'check mark галочка','❌':'cross mark крест',
        '⚡':'lightning молния','💡':'light bulb лампочка','🔔':'bell колокол',
        '🎵':'music note музыка','🎶':'musical notes ноты','📷':'camera камера',
        '🐶':'dog собака','🐱':'cat кошка','🐻':'bear медведь',
        '🦊':'fox лиса','🐸':'frog лягушка','🦋':'butterfly бабочка',
        '🌸':'cherry blossom сакура','🌹':'rose роза','🌻':'sunflower подсолнух',
        '🏁':'checkered flag финиш','🚩':'red flag флаг',
        '🇷🇺':'russia россия','🇺🇸':'usa сша америка','🇬🇧':'uk великобритания',
        '🇩🇪':'germany германия','🇫🇷':'france франция','🇯🇵':'japan япония',
        '🇨🇳':'china китай','🇰🇷':'korea корея','🇧🇷':'brazil бразилия',
        '🇺🇦':'ukraine украина','🇮🇹':'italy италия','🇪🇸':'spain испания',
    };

    /* ================================================
       STATE
       ================================================ */
    let state = {
        lang: 'en',
        theme: 'mocha',
        accent: 'green',
        recent: [],
        emojiData: [],
    };

    const MAX_RECENT = 32;
    let toastTimeout = null;
    let saveTimeout = null;

    /* ================================================
       DOM ELEMENTS
       ================================================ */
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const els = {
        html: $('html'),
        searchInput: $('#searchInput'),
        searchClear: $('#searchClear'),
        categoryTabs: $('#categoryTabs'),
        mainContent: $('#mainContent'),
        toast: $('#toast'),
        toastEmoji: $('#toastEmoji'),
        settingsToggle: $('#settingsToggle'),
        settingsOverlay: $('#settingsOverlay'),
        settingsPanel: $('#settingsPanel'),
        settingsClose: $('#settingsClose'),
        langOptions: $('#langOptions'),
        themeGrid: $('#themeGrid'),
        accentGrid: $('#accentGrid'),
        recentGrid: $('#grid-recent'),
    };

    /* ================================================
       INITIALIZATION
       ================================================ */
    async function init() {
        detectLanguage();
        await loadSettings();
        await loadEmojis();
        applyTheme();
        applyLanguage();
        buildCategoryTabs();
        buildEmojiSections();
        renderRecent();
        bindEvents();
    }

    function detectLanguage() {
        const nav = navigator.language || navigator.userLanguage || 'en';
        state.lang = nav.startsWith('ru') ? 'ru' : 'en';
    }

    /* ================================================
       API CALLS
       ================================================ */
    async function loadSettings() {
        try {
            const resp = await fetch('/api/settings');
            const data = await resp.json();
            if (data && Object.keys(data).length > 0) {
                if (data.lang) state.lang = data.lang;
                if (data.theme) state.theme = data.theme;
                if (data.accent) state.accent = data.accent;
                if (data.recent) state.recent = data.recent;
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }

    function saveSettings() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lang: state.lang,
                    theme: state.theme,
                    accent: state.accent,
                    recent: state.recent,
                })
            }).catch(e => console.warn('Could not save settings:', e));
        }, 300);
    }

    async function loadEmojis() {
        try {
            const resp = await fetch('/api/emojis');
            state.emojiData = await resp.json();
        } catch (e) {
            console.error('Could not load emojis:', e);
            state.emojiData = [];
        }
    }

    /* ================================================
       THEME & LANGUAGE
       ================================================ */
    function applyTheme() {
        els.html.setAttribute('data-theme', state.theme);

        // Validate accent is available for this theme
        const available = THEME_ACCENTS[state.theme] || [];
        if (!available.includes(state.accent)) {
            state.accent = DEFAULT_ACCENTS[state.theme] || available[0] || 'green';
        }
        els.html.setAttribute('data-accent', state.accent);

        updateThemeButtons();
        updateAccentPalette();
    }

    function applyLanguage() {
        document.documentElement.lang = state.lang;
        const t = I18N[state.lang] || I18N.en;

        $$('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });
        $$('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });

        // Update section titles with category names
        state.emojiData.forEach(cat => {
            const titleEl = $(`#section-${cat.id} .section-title`);
            if (titleEl) {
                titleEl.textContent = state.lang === 'ru' ? cat.name_ru : cat.name_en;
            }
        });

        updateLangButtons();
    }

    /* ================================================
       BUILD UI
       ================================================ */
    function buildCategoryTabs() {
        // Keep the "recent" tab, add category tabs
        const existing = els.categoryTabs.querySelectorAll('[data-category]:not([data-category="recent"])');
        existing.forEach(el => el.remove());

        state.emojiData.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.setAttribute('data-category', cat.id);
            btn.title = state.lang === 'ru' ? cat.name_ru : cat.name_en;
            btn.textContent = cat.icon;
            els.categoryTabs.appendChild(btn);
        });
    }

    function buildEmojiSections() {
        // Remove any old non-recent sections
        els.mainContent.querySelectorAll('.emoji-section:not(#section-recent)').forEach(el => el.remove());

        state.emojiData.forEach(cat => {
            const section = document.createElement('section');
            section.className = 'emoji-section';
            section.id = `section-${cat.id}`;

            const title = document.createElement('h2');
            title.className = 'section-title';
            title.textContent = state.lang === 'ru' ? cat.name_ru : cat.name_en;

            const grid = document.createElement('div');
            grid.className = 'emoji-grid';
            grid.id = `grid-${cat.id}`;

            cat.emojis.forEach(emoji => {
                grid.appendChild(createEmojiButton(emoji));
            });

            section.appendChild(title);
            section.appendChild(grid);
            els.mainContent.appendChild(section);
        });
    }

    function createEmojiButton(emoji) {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.setAttribute('data-emoji', emoji);
        btn.setAttribute('aria-label', emoji);
        return btn;
    }

    /* ================================================
       RECENT EMOJIS
       ================================================ */
    function renderRecent() {
        const t = I18N[state.lang] || I18N.en;
        els.recentGrid.innerHTML = '';
        if (state.recent.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.setAttribute('data-i18n', 'no_recent');
            emptyDiv.textContent = t.no_recent;
            els.recentGrid.appendChild(emptyDiv);
        } else {
            state.recent.forEach(emoji => {
                els.recentGrid.appendChild(createEmojiButton(emoji));
            });
        }
    }

    function addToRecent(emoji) {
        state.recent = state.recent.filter(e => e !== emoji);
        state.recent.unshift(emoji);
        if (state.recent.length > MAX_RECENT) {
            state.recent = state.recent.slice(0, MAX_RECENT);
        }
        renderRecent();
        saveSettings();
    }

    /* ================================================
       COPY & TOAST
       ================================================ */
    async function copyEmoji(emoji, btnElement) {
        try {
            await navigator.clipboard.writeText(emoji);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = emoji;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }

        addToRecent(emoji);
        showToast(emoji);

        if (btnElement) {
            btnElement.classList.add('copied');
            setTimeout(() => btnElement.classList.remove('copied'), 400);
        }
    }

    function showToast(emoji) {
        els.toastEmoji.textContent = emoji;
        els.toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            els.toast.classList.remove('show');
        }, 1500);
    }

    /* ================================================
       SEARCH
       ================================================ */
    function handleSearch(query) {
        const q = query.trim().toLowerCase();

        if (!q) {
            clearSearch();
            return;
        }

        els.searchClear.classList.remove('hidden');

        // Show all sections but filter emojis
        let totalFound = 0;

        // Hide recent during search
        const recentSection = $('#section-recent');
        recentSection.style.display = 'none';

        state.emojiData.forEach(cat => {
            const section = $(`#section-${cat.id}`);
            const grid = $(`#grid-${cat.id}`);
            grid.innerHTML = '';

            let found = 0;
            cat.emojis.forEach(emoji => {
                const searchStr = (EMOJI_SEARCH_NAMES[emoji] || '').toLowerCase();
                if (emoji.includes(q) || searchStr.includes(q)) {
                    grid.appendChild(createEmojiButton(emoji));
                    found++;
                }
            });

            if (found === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
            totalFound += found;
        });

        // Show no results message
        if (totalFound === 0) {
            showNoResults();
        } else {
            hideNoResults();
        }

        // Deactivate category tabs during search
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
    }

    function clearSearch() {
        els.searchInput.value = '';
        els.searchClear.classList.add('hidden');
        hideNoResults();

        // Restore all sections
        const recentSection = $('#section-recent');
        recentSection.style.display = '';

        state.emojiData.forEach(cat => {
            const section = $(`#section-${cat.id}`);
            const grid = $(`#grid-${cat.id}`);
            section.style.display = '';
            grid.innerHTML = '';
            cat.emojis.forEach(emoji => {
                grid.appendChild(createEmojiButton(emoji));
            });
        });

        // Reactivate the first tab
        activateTab('recent');
    }

    function showNoResults() {
        hideNoResults();
        const t = I18N[state.lang] || I18N.en;
        const div = document.createElement('div');
        div.className = 'no-results';
        div.id = 'noResults';
        div.innerHTML = `
            <span class="no-results-emoji">🔍</span>
            <span class="no-results-text">${t.no_results}<br><small>${t.no_results_hint}</small></span>
        `;
        els.mainContent.appendChild(div);
    }

    function hideNoResults() {
        const el = $('#noResults');
        if (el) el.remove();
    }

    /* ================================================
       CATEGORY NAVIGATION
       ================================================ */
    function activateTab(categoryId) {
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        const btn = $(`.tab-btn[data-category="${categoryId}"]`);
        if (btn) btn.classList.add('active');

        const section = $(`#section-${categoryId}`);
        if (section) {
            const headerHeight = 170;
            const y = section.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    // Update active tab on scroll
    function updateActiveTabOnScroll() {
        if (els.searchInput.value.trim()) return;

        const headerHeight = 180;
        let activeId = 'recent';

        const allSections = ['recent', ...state.emojiData.map(c => c.id)];
        for (const id of allSections) {
            const section = $(`#section-${id}`);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= headerHeight + 10) {
                    activeId = id;
                }
            }
        }

        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        const btn = $(`.tab-btn[data-category="${activeId}"]`);
        if (btn) btn.classList.add('active');

        // Scroll tab into view
        if (btn) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    /* ================================================
       SETTINGS PANEL
       ================================================ */
    function openSettings() {
        els.settingsOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            els.settingsOverlay.classList.add('visible');
        });
        updateThemeButtons();
        updateAccentPalette();
        updateLangButtons();
    }

    function closeSettings() {
        els.settingsOverlay.classList.remove('visible');
        setTimeout(() => {
            els.settingsOverlay.classList.add('hidden');
        }, 350);
    }

    function updateLangButtons() {
        $$('#langOptions .option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === state.lang);
        });
    }

    function updateThemeButtons() {
        $$('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === state.theme);
        });
    }

    function updateAccentPalette() {
        els.accentGrid.innerHTML = '';
        const accents = THEME_ACCENTS[state.theme] || [];
        const colors = THEME_ACCENT_COLORS[state.theme] || {};

        accents.forEach(accentName => {
            const btn = document.createElement('button');
            btn.className = 'accent-btn';
            btn.setAttribute('data-accent', accentName);
            btn.style.background = colors[accentName] || ACCENT_COLORS[accentName] || '#888';
            btn.title = accentName;
            btn.classList.toggle('active', accentName === state.accent);
            els.accentGrid.appendChild(btn);
        });
    }

    /* ================================================
       EVENT BINDING
       ================================================ */
    function bindEvents() {
        // Search
        els.searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
        els.searchClear.addEventListener('click', () => {
            clearSearch();
            els.searchInput.focus();
        });

        // Emoji click (delegated)
        els.mainContent.addEventListener('click', (e) => {
            const btn = e.target.closest('.emoji-btn');
            if (btn) {
                const emoji = btn.getAttribute('data-emoji');
                if (emoji) copyEmoji(emoji, btn);
            }
        });

        // Recent grid also needs delegation (it's inside mainContent, so already covered)

        // Category tabs
        els.categoryTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn');
            if (btn) {
                const cat = btn.getAttribute('data-category');
                if (cat) {
                    if (els.searchInput.value.trim()) clearSearch();
                    activateTab(cat);
                }
            }
        });

        // Scroll tracking
        let scrollRAF = null;
        window.addEventListener('scroll', () => {
            if (scrollRAF) cancelAnimationFrame(scrollRAF);
            scrollRAF = requestAnimationFrame(updateActiveTabOnScroll);
        }, { passive: true });

        // Settings
        els.settingsToggle.addEventListener('click', openSettings);
        els.settingsClose.addEventListener('click', closeSettings);
        els.settingsOverlay.addEventListener('click', (e) => {
            if (e.target === els.settingsOverlay) closeSettings();
        });

        // Language
        els.langOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('.option-btn');
            if (btn) {
                state.lang = btn.getAttribute('data-lang');
                applyLanguage();
                // Rebuild tabs tooltips
                state.emojiData.forEach(cat => {
                    const tabBtn = $(`.tab-btn[data-category="${cat.id}"]`);
                    if (tabBtn) tabBtn.title = state.lang === 'ru' ? cat.name_ru : cat.name_en;
                });
                renderRecent();
                updateLangButtons();
                saveSettings();
            }
        });

        // Theme
        els.themeGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.theme-btn');
            if (btn) {
                state.theme = btn.getAttribute('data-theme');
                applyTheme();
                saveSettings();
            }
        });

        // Accent
        els.accentGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.accent-btn');
            if (btn) {
                state.accent = btn.getAttribute('data-accent');
                els.html.setAttribute('data-accent', state.accent);
                updateAccentPalette();
                saveSettings();
            }
        });

        // Keyboard: Escape closes settings
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!els.settingsOverlay.classList.contains('hidden')) {
                    closeSettings();
                }
            }
            // Ctrl/Cmd+K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                els.searchInput.focus();
            }
        });
    }

    /* ================================================
       START
       ================================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
