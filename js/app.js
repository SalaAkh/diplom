/**
 * Қосымшаның негізгі модулі (Main application module)
 * Барлық компоненттердің күйі мен өзара әрекеттесуін басқарады (Manages state and interaction of all components)
 * 
 * Дипломдық жоба: HTML, CSS, JS бағдарламалау тілдерінде интерактивті таңдау сценарийлері негізінде 
 * пайдаланушының жеке басымдықтары мен даму бағыттарын талдау бағдарламалық жүйесін әзірлеу
 * (Diploma project: Development of a software system for analyzing personal preferences 
 * and user development directions based on interactive choice scenarios, in JS)
 * 
 * Авторы (Author): Ахмедьянов Саламат КПО 9/22-2
 * Мерзімі (Date): 2026
 */

// Түзету жалаушасы (Debug flag) (localStorage немесе URL параметрі арқылы орнатуға болады)
const DEBUG = localStorage.getItem('debug') === 'true' ||
    (typeof URLSearchParams !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true');

// Логтауға арналған көмекші функциялар (Helper functions for logging)
const debugLog = DEBUG ? console.log.bind(console) : () => { };
const debugError = DEBUG ? console.error.bind(console) : () => { };
const debugWarn = DEBUG ? console.warn.bind(console) : () => { };

// Маңызды қателер әрқашан логталады (Critical errors are always logged)
const criticalError = console.error.bind(console);
const criticalLog = console.log.bind(console);

// Easter Egg Signature
console.log('%c Әзірлеген Ахмедьянов Саламат КПО 9/22-2 (Developed by Akhmedyanov Salamat) ', 'background: #222; color: #bada55; font-size: 12px; padding: 4px; border-radius: 4px;');

/**
 * Функция debounce для задержки выполнения
 * @param {Function} func - Функция для выполнения
 * @param {number} wait - Время задержки в мс
 * @returns {Function} Обернутая функция
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

class PersonalityTestApp {
    constructor() {
        this.scenarios = [];
        this.completedScenarios = []; // Массив завершённых сценариев для динамической логики
        this.currentScenarioIndex = 0;
        this.analyzer = null;
        this.visualizer = null;
        this.dynamicSelector = null; // Динамический селектор сценариев
        this.storage = new StorageManager();
        this.auth = new AuthManager();
        this.ui = new UIController(this);
        this.testManager = new TestManager(this);
        this.resultsManager = new ResultsManager(this);
        this.feedbackService = null; // Будет инициализирован в init()

        // AI Analysis с опциональной инициализацией
        this.aiAnalyzer = this.initializeOptionalModule('AIAnalyzer', () => new AIAnalyzer());

        this.i18n = typeof i18n !== 'undefined' ? i18n : new LocalizationManager();



        this.social = this.initializeOptionalModule('SocialFeatures', () => {
            const sf = new SocialFeatures();
            sf.initialize();
            return sf;
        });

        this.advancedAnalytics = this.initializeOptionalModule('AdvancedAnalytics', () => new AdvancedAnalytics());

        // Модули контроля качества
        this.testReliability = this.initializeOptionalModule('TestReliability', () => new TestReliability());
        this.statisticalValidation = this.initializeOptionalModule('StatisticalValidation', () => new StatisticalValidation());
        this.qualityControl = this.initializeOptionalModule('QualityControl', () => new QualityControl());
        this.scenarioCalibration = this.initializeOptionalModule('ScenarioCalibration', () => new ScenarioCalibration());
        this.feedbackSystem = this.initializeOptionalModule('FeedbackSystem', () => new FeedbackSystem());

        this.state = 'intro'; // auth, intro, testSelection, testing, results
        this.testMode = null; // 'basic' или 'advanced'
        this.advancedQuestions = []; // Вопросы для углубленного теста
        this.currentQuestionIndex = 0; // Индекс текущего вопроса (для углубленного теста)
        this.currentSituationalStep = {}; // Отслеживание текущего шага для каждого ситуационного вопроса {questionId: stepIndex}
        this.currentScenarioStartTime = null; // Время начала текущего вопроса

        // Инициализация происходит асинхронно после загрузки всех скриптов
        // Не вызываем this.init() здесь, чтобы избежать проблем с порядком загрузки
    }

    /**
     * Инициализация опционального модуля с проверкой доступности
     * @param {string} moduleName - Имя модуля для проверки
     * @param {Function} initializer - Функция инициализации модуля
     * @returns {Object|null} Инициализированный модуль или null
     */
    initializeOptionalModule(moduleName, initializer) {
        try {
            if (typeof window !== 'undefined' && window[moduleName]) {
                return initializer();
            }
            debugLog(`Модуль ${moduleName} недоступен, используется fallback`);
            return null;
        } catch (error) {
            debugWarn(`Ошибка инициализации модуля ${moduleName}:`, error);
            return null;
        }
    }

    /**
     * Проверка наличия критических зависимостей
     * @returns {Object} Результат проверки зависимостей
     */
    checkDependencies() {
        const dependencies = {
            chartjs: typeof Chart !== 'undefined',
            threejs: true, // 3D disabled - always pass
            storage: typeof StorageManager !== 'undefined',
            analyzer: typeof PersonalityAnalyzer !== 'undefined',
            visualizer: typeof ResultsVisualizer !== 'undefined',
            localization: typeof LocalizationManager !== 'undefined',
            auth: typeof AuthManager !== 'undefined'
        };

        const missing = Object.entries(dependencies)
            .filter(([_, available]) => !available)
            .map(([name]) => name);

        return {
            allAvailable: missing.length === 0,
            dependencies: dependencies,
            missing: missing
        };
    }

    /**
     * Валидация структуры данных сценариев
     * @param {Object} data - Данные для валидации
     * @returns {boolean} true если данные валидны
     */
    validateScenariosData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Проверяем наличие массива scenarios
        if (!data.scenarios || !Array.isArray(data.scenarios) || data.scenarios.length === 0) {
            return false;
        }

        // Проверяем наличие dimensions
        if (!data.dimensions || typeof data.dimensions !== 'object') {
            return false;
        }

        // Валидируем каждый сценарий
        for (const scenario of data.scenarios) {
            if (!scenario.id || typeof scenario.id !== 'number') {
                return false;
            }

            // Проверяем наличие title (может быть объектом с переводами или строкой)
            if (!scenario.title || (typeof scenario.title !== 'string' && typeof scenario.title !== 'object')) {
                return false;
            }

            // Проверяем наличие description
            if (!scenario.description || (typeof scenario.description !== 'string' && typeof scenario.description !== 'object')) {
                return false;
            }

            // Проверяем наличие хотя бы одного варианта (optionA, optionB, optionC или optionD)
            const hasOption = scenario.optionA || scenario.optionB || scenario.optionC || scenario.optionD;
            if (!hasOption) {
                return false;
            }

            // Проверяем структуру вариантов
            ['optionA', 'optionB', 'optionC', 'optionD'].forEach(optKey => {
                if (scenario[optKey]) {
                    const option = scenario[optKey];
                    // Должен быть text (строка или объект с переводами)
                    if (!option.text || (typeof option.text !== 'string' && typeof option.text !== 'object')) {
                        return false;
                    }
                    // Должны быть weights (объект)
                    if (!option.weights || typeof option.weights !== 'object') {
                        return false;
                    }
                }
            });
        }

        return true;
    }

    /**
     * Ожидание загрузки SCENARIOS_DATA через Promise
     * @param {number} timeout - Максимальное время ожидания в мс
     * @returns {Promise<Object>} Данные сценариев
     */
    waitForScenariosData(timeout = 2000) {
        return new Promise((resolve, reject) => {
            // Функция для получения встроенных данных
            const getBuiltInData = () => {
                if (typeof SCENARIOS_DATA !== 'undefined' && SCENARIOS_DATA && SCENARIOS_DATA.scenarios) {
                    return SCENARIOS_DATA;
                }
                if (typeof window !== 'undefined' && window.SCENARIOS_DATA && window.SCENARIOS_DATA.scenarios) {
                    return window.SCENARIOS_DATA;
                }
                if (typeof globalThis !== 'undefined' && globalThis.SCENARIOS_DATA && globalThis.SCENARIOS_DATA.scenarios) {
                    return globalThis.SCENARIOS_DATA;
                }
                return null;
            };

            // Проверяем сразу
            const immediateData = getBuiltInData();
            if (immediateData && immediateData.scenarios && immediateData.scenarios.length > 0) {
                debugLog('SCENARIOS_DATA бірден қолжетімді (SCENARIOS_DATA available immediately)');
                return resolve(immediateData);
            }

            // Если данные не загружены, ждём события загрузки или проверяем через интервалы
            const startTime = Date.now();
            const checkInterval = 50; // Проверяем каждые 50ms
            const maxAttempts = Math.ceil(timeout / checkInterval);
            let attempts = 0;

            // Обработчик события загрузки (если есть)
            const onDataLoaded = () => {
                const data = getBuiltInData();
                if (data && data.scenarios && data.scenarios.length > 0) {
                    debugLog('SCENARIOS_DATA оқиға арқылы жүктелді (SCENARIOS_DATA loaded via event)');
                    cleanup();
                    resolve(data);
                }
            };

            // Подписываемся на событие, если оно есть
            if (typeof window !== 'undefined') {
                window.addEventListener('scenarios-data-loaded', onDataLoaded);
            }

            // Функция очистки
            const cleanup = () => {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('scenarios-data-loaded', onDataLoaded);
                }
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };

            // Проверяем через интервалы
            const intervalId = setInterval(() => {
                attempts++;
                const data = getBuiltInData();

                if (data && data.scenarios && data.scenarios.length > 0) {
                    debugLog(`SCENARIOS_DATA загружен через проверку (попытка ${attempts})`);
                    cleanup();
                    resolve(data);
                    return;
                }

                // Проверяем timeout
                if (Date.now() - startTime >= timeout || attempts >= maxAttempts) {
                    cleanup();
                    const error = new Error('Встроенные данные сценариев недоступны. Убедитесь, что scenarios-data.js загружен правильно.');
                    criticalError('МАҢЫЗДЫ ҚАТЕ: Кірістірілген деректер қолжетімсіз (CRITICAL ERROR: Embedded data unavailable)');
                    criticalError('SCENARIOS_DATA:', typeof SCENARIOS_DATA);
                    criticalError('window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'N/A');
                    reject(error);
                }
            }, checkInterval);
        });
    }

    /**
     * Показ ошибки отсутствия зависимостей
     * @param {Array} missing - Массив отсутствующих зависимостей
     */
    /**
     * Показ ошибки отсутствия зависимостей
     * @param {Array} missing - Массив отсутствующих зависимостей
     */
    showDependencyError(missing) {
        if (this.ui) {
            this.ui.showDependencyError(missing);
        }
    }

    /**
     * Выход из системы
     */
    logout() {
        if (this.auth) {
            this.auth.logout();
            // Сбрасываем состояние
            this.state = 'intro';
            this.currentUser = null;

            // Очищаем UI если нужно или перезагружаем
            window.location.reload();
        }
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            // Function to check dependencies
            const checkDeps = () => this.checkDependencies();
            let depsCheck = checkDeps();

            // Special handling for Three.js which loads asynchronously via ES modules
            if (!depsCheck.allAvailable && depsCheck.missing.includes('threejs')) {
                debugLog('Waiting for Three.js to load...');
                try {
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            window.removeEventListener('threejs-loaded', onThreeLoaded);
                            // It's optional for some views, so maybe don't reject hard if we can survive without it?
                            // But for now, let's stick to the current strict logic but give it time
                            resolve();
                        }, 2000); // Wait up to 2 seconds

                        const onThreeLoaded = () => {
                            clearTimeout(timeout);
                            window.removeEventListener('threejs-loaded', onThreeLoaded);
                            debugLog('Three.js loaded event received');
                            resolve();
                        };

                        if (typeof window !== 'undefined') {
                            window.addEventListener('threejs-loaded', onThreeLoaded);
                        } else {
                            resolve();
                        }
                    });
                    // Re-check after waiting
                    depsCheck = checkDeps();
                } catch (e) {
                    debugWarn('Error waiting for Three.js:', e);
                }
            }

            if (!depsCheck.allAvailable) {
                // If specific critical deps are missing
                const critical = depsCheck.missing.filter(d => d !== 'visualizer' && d !== 'threejs'); // visualizer depends on threejs
                if (critical.length > 0) {
                    criticalError('МАҢЫЗДЫ ТӘУЕЛДІЛІКТЕР ЖОҚ (CRITICAL DEPENDENCIES MISSING):', critical);
                    this.showDependencyError(critical);
                    return;
                    debugWarn('Three.js check skipped.');
                    // 3D features removed
                }
            }

            let data = null;

            // Используем Promise-based подход для загрузки данных
            try {
                data = await this.waitForScenariosData(2000);
                debugLog('Сценарийлердің кірістірілген деректері сәтті жүктелді (Embedded scenario data loaded successfully)');
            } catch (error) {
                // Если Promise-based подход не сработал, пробуем последнюю попытку
                const getBuiltInData = () => {
                    if (typeof SCENARIOS_DATA !== 'undefined' && SCENARIOS_DATA && SCENARIOS_DATA.scenarios) {
                        return SCENARIOS_DATA;
                    }
                    if (typeof window !== 'undefined' && window.SCENARIOS_DATA && window.SCENARIOS_DATA.scenarios) {
                        return window.SCENARIOS_DATA;
                    }
                    if (typeof globalThis !== 'undefined' && globalThis.SCENARIOS_DATA && globalThis.SCENARIOS_DATA.scenarios) {
                        return globalThis.SCENARIOS_DATA;
                    }
                    return null;
                };

                const lastAttempt = getBuiltInData();
                if (lastAttempt && lastAttempt.scenarios && lastAttempt.scenarios.length > 0) {
                    data = lastAttempt;
                    debugLog('Соңғы әрекетте кірістірілген деректер табылды (Embedded data found on last attempt)');
                } else {
                    throw error; // Пробрасываем ошибку дальше
                }
            }

            // Если встроенные данные не найдены, это критическая ошибка
            if (!data || !data.scenarios || !Array.isArray(data.scenarios) || data.scenarios.length === 0) {
                criticalError('МАҢЫЗДЫ ҚАТЕ: Кірістірілген деректер қолжетімсіз (CRITICAL ERROR: Embedded data unavailable)');
                criticalError('SCENARIOS_DATA:', typeof SCENARIOS_DATA);
                criticalError('window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'N/A');
                throw new Error('Встроенные данные сценариев недоступны. Убедитесь, что scenarios-data.js загружен правильно.');
            }

            // Валидация структуры данных
            if (!this.validateScenariosData(data)) {
                criticalError('МАҢЫЗДЫ ҚАТЕ: Сценарий деректерінің құрылымы жарамсыз (CRITICAL ERROR: Invalid scenario data structure)');
                throw new Error('Структура данных сценариев невалидна. Проверьте формат данных в scenarios-data.js или scenarios.json.');
            }

            // Опционально: пытаемся загрузить из файла для обновления (но не критично)
            const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
            if (!isFileProtocol) {
                try {
                    const response = await fetch('data/scenarios.json');
                    if (response.ok) {
                        const jsonData = await response.json();
                        // Валидируем данные из файла перед использованием
                        if (this.validateScenariosData(jsonData)) {
                            // Используем данные из файла, если они валидны
                            data = jsonData;
                            debugLog('Деректер scenarios.json файлынан жаңартылды (Data updated from scenarios.json)');
                        } else {
                            debugWarn('scenarios.json деректері жарамсыз, кірістірілген деректер қолданылуда (Data from scenarios.json is invalid, using embedded data)');
                        }
                    }
                } catch (fetchError) {
                    // Не критично - используем встроенные данные
                    debugLog('scenarios.json жүктеу мүмкін болмады, кірістірілген деректер қолданылуда (Failed to load scenarios.json, using embedded data)');
                }
            }

            this.scenarios = data.scenarios;
            this.dimensions = data.dimensions;

            // Инициализация анализатора
            this.analyzer = new PersonalityAnalyzer(data);

            // Инициализация динамического селектора сценариев
            this.dynamicSelector = new DynamicScenarioSelector(data.scenarios);

            // Инициализация визуализатора
            this.visualizer = new ResultsVisualizer('radarChartContainer');



            // Инициализация сервиса обратной связи
            // Инициализация сервиса обратной связи
            if (typeof FeedbackService !== 'undefined') {
                this.feedbackService = new FeedbackService(this.i18n, this.auth, this.analyzer, this.ui);
            } else {
                console.warn('FeedbackService не найден. Функции обратной связи будут недоступны.');
            }

            // Проверка сохранённого прогресса
            this.checkSavedProgress();

            // Инициализация UI элементов (после загрузки DOM)
            // Optimized: Single rAF for faster initialization
            requestAnimationFrame(() => {
                // Set language
                const currentLang = this.i18n.getLanguage();
                document.documentElement.lang = currentLang;

                // Initialize UI
                this.initUI();

                // Initialize background particles
                if (typeof ParticleBackground !== 'undefined') {
                    new ParticleBackground('background-canvas');
                }

                // Register Service Worker for PWA
                this.registerServiceWorker();

                // Route to page
                const path = window.location.pathname;
                const page = path.split('/').pop().toLowerCase();

                if (page === 'profile.html' || page === 'profile') {
                    this.showProfile();
                } else {
                    this.state = 'intro';
                    this.showIntro();
                }

                // Hide loading screen
                this.hideMainLoading();
            });

        } catch (error) {
            criticalError('Инициализация қатесі (Initialization error):', error);
            const errorMessage = error.message || 'Неизвестная ошибка';
            criticalError('Қате мәліметтері (Error details):', errorMessage);

            // Дополнительная диагностика
            debugLog('SCENARIOS_DATA қолжетімділігін тексеру (Checking SCENARIOS_DATA availability):', typeof SCENARIOS_DATA);
            debugLog('window.SCENARIOS_DATA қолжетімділігін тексеру (Checking window.SCENARIOS_DATA availability):', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'window unavailable');

            // Последняя попытка использовать встроенные данные напрямую
            if (typeof SCENARIOS_DATA !== 'undefined' && SCENARIOS_DATA && SCENARIOS_DATA.scenarios) {
                debugLog('SCENARIOS_DATA дерегін тікелей қолдану әрекеті (Trying to use SCENARIOS_DATA directly)...');
                try {
                    this.scenarios = SCENARIOS_DATA.scenarios;
                    this.analyzer = new PersonalityAnalyzer(SCENARIOS_DATA);
                    this.dynamicSelector = new DynamicScenarioSelector(SCENARIOS_DATA.scenarios);
                    this.visualizer = new ResultsVisualizer('radarChartContainer');
                    this.checkSavedProgress();

                    // Optimized: Single rAF for faster initialization (error recovery)
                    requestAnimationFrame(() => {
                        const currentLang = this.i18n.getLanguage();
                        document.documentElement.lang = currentLang;
                        this.initUI();

                        // Initialize background particles (fallback)
                        if (typeof ParticleBackground !== 'undefined') {
                            new ParticleBackground('background-canvas');
                        }

                        const path = window.location.pathname;
                        const page = path.split('/').pop().toLowerCase();

                        if (page === 'profile.html' || page === 'profile') {
                            this.showProfile();
                        } else {
                            this.state = 'intro';
                            this.showIntro();
                        }

                        this.hideMainLoading();
                    });

                } catch (error) {
                    criticalError('Инициализация қатесі (Initialization error):', error);
                    const errorMessage = error.message || 'Неизвестная ошибка';
                    criticalError('Қате мәліметтері (Error details):', errorMessage);
                    this.showError(errorMessage);
                }
            }

            // Restore general error handling if recovery failed
            this.showError('Не удалось загрузить данные сценариев. Пожалуйста, перезагрузите страницу.');
        }
    }

    /**
     * Плавное скрытие загрузочного экрана
     */
    hideMainLoading() {
        const loader = document.getElementById('mainLoading');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 600);
        }
    }

    /**
     * Проверка сохранённого прогресса
     */
    checkSavedProgress() {
        const savedProgress = this.storage.loadProgress();
        if (savedProgress && savedProgress.choices) {
            const choices = Array.isArray(savedProgress.choices) ? savedProgress.choices : [];

            // Если тест уже завершен (количество ответов >= количеству сценариев),
            // то не восстанавливаем его как активный, чтобы избежать дублирования в истории
            if (this.scenarios && choices.length >= this.scenarios.length) {
                this.storage.clearAll(); // Или только удалить прогресс: localStorage.removeItem('testProgress');
                this.currentScenarioIndex = 0;
                return;
            }

            // Восстановление прогресса для базового теста
            // Check if testMode is explicitly 'basic' OR it's missing and the data looks basic (array of choices)
            // AND it doesn't look like advanced (no scales/situational keys)
            const isAdvancedData = !Array.isArray(choices) && (choices.scales || choices.situational || choices.open);

            if ((savedProgress.testMode === 'basic' || !savedProgress.testMode) && !isAdvancedData && savedProgress.testMode !== 'cognitive' && savedProgress.mode !== 'cognitive') {
                this.testMode = 'basic';
                if (this.testManager) this.testManager.testMode = 'basic';

                choices.forEach(choice => {
                    this.analyzer.recordChoice(choice.scenarioId, choice.choice);

                    // Восстанавливаем завершённые сценарии
                    const scenario = this.scenarios.find(s => s.id === choice.scenarioId);
                    if (scenario && !this.completedScenarios.find(s => s.id === choice.scenarioId)) {
                        this.completedScenarios.push(scenario);
                    }
                });
                this.currentScenarioIndex = savedProgress.currentQuestionIndex || choices.length;
            }
            // Восстановление прогресса для расширенного теста
            else if (savedProgress.testMode === 'advanced' || isAdvancedData) {
                this.testMode = 'advanced';
                if (this.testManager) this.testManager.testMode = 'advanced';

                const choicesData = savedProgress.choices;
                const choicesArray = Array.isArray(choicesData) ? choicesData : (choicesData.choices || []);

                if (Array.isArray(choicesArray)) {
                    choicesArray.forEach(choice => {
                        this.analyzer.recordChoice(choice.scenarioId || choice.questionId, choice.choice);
                    });
                }

                // Initialize Advanced Analyzer if needed
                if (!this.analyzer || !(this.analyzer instanceof AdvancedPersonalityAnalyzer)) {
                    if (typeof AdvancedPersonalityAnalyzer !== 'undefined') {
                        // We need data to init analyzer, will be done in continueTest usually, 
                        // but here we just mark the mode
                        console.log('checkSavedProgress ішінде кеңейтілген режим анықталды (Detected advanced mode in checkSavedProgress)');
                    }
                }

                // Восстанавливаем другие типы ответов расширенного теста
                if (typeof choicesData === 'object' && !Array.isArray(choicesData)) {
                    if (choicesData.scales) this.analyzer.scaleAnswers = choicesData.scales;
                    if (choicesData.open) this.analyzer.openAnswers = choicesData.open;
                    if (choicesData.situational) this.analyzer.situationalAnswers = choicesData.situational;
                }

                this.currentScenarioIndex = savedProgress.currentQuestionIndex || 0;
            }
            // Restore cognitive test progress
            else if (savedProgress.testMode === 'cognitive' || savedProgress.mode === 'cognitive') {
                this.testMode = 'cognitive';
                if (this.testManager) this.testManager.testMode = 'cognitive';
                console.log('✅ Cognitive test progress detected');
            }
        }
    }

    /**
     * Инициализация UI элементов (язык, тема)
     */
    initUI() {
        if (this.ui) {
            this.ui.init();
        }
    }

    /**
     * Обновление заголовка (с debounce для предотвращения частых обновлений)
     */
    updateHeader() {
        if (this.ui) {
            this.ui.updateHeader();
        }
    }

    /**
     * Инициализация переключателя языка
     */
    initLanguageSelector() {
        if (this.ui) {
            this.ui.initLanguageSelector();
        }
    }

    /**
     * Переключение меню языка
     */
    toggleLanguageMenu(event) {
        if (this.ui) {
            this.ui.toggleLanguageMenu(event);
        }
    }

    /**
     * Смена языка
     * @param {string} langCode - Код языка
     */
    changeLanguage(langCode) {
        if (this.ui) {
            this.ui.changeLanguage(langCode);
        }
    }

    /**
     * Инициализация переключателя темы
     */
    initThemeToggle() {
        if (this.ui) {
            this.ui.initThemeToggle();
        }
    }

    /**
     * Установка темы
     * @param {string} theme - 'light' или 'dark'
     */
    setTheme(theme) {
        if (this.ui) {
            this.ui.setTheme(theme);
        }
    }

    /**
     * Применение сохранённой темы
     */
    applyTheme() {
        if (this.ui) {
            this.ui.applyTheme();
        }
    }

    /**
     * Отображение экрана аутентификации
     */
    showAuth() {
        if (this.ui) {
            this.ui.showAuth();
        }
    }



    /**
     * Форма входа
     */


    /**
     * Показать форму входа
     * @param {Event} e - Событие клика (опционально)
     */
    showLoginForm(e) {
        if (this.ui) {
            this.ui.showLoginForm(e);
        }
    }

    /**
     * Показать форму регистрации
     * @param {Event} e - Событие клика (опционально)
     */
    showRegisterForm(e) {
        if (this.ui) {
            this.ui.showRegisterForm(e);
        }
    }

    /**
     * Обработка входа
     */
    handleLogin(event) {
        if (this.ui) {
            this.ui.handleLogin(event);
        }
    }

    /**
     * Обработка регистрации
     */
    handleRegister(event) {
        if (this.ui) {
            this.ui.handleRegister(event);
        }
    }

    /**
     * Продолжить как гость
     */
    continueAsGuest() {
        if (this.ui) {
            this.ui.continueAsGuest();
        }
    }

    /**
     * Показать ошибку аутентификации
     */
    showAuthError(message) {
        if (this.ui) {
            this.ui.showAuthError(message);
        }
    }

    /**
     * Отображение вводного экрана
     */
    showIntro() {
        this.state = 'intro';
        if (this.ui) {
            this.ui.showIntro();
        }
    }


    /**
     * Показ экрана выбора типа теста
     */
    showTestTypeSelection() {
        if (this.ui) {
            this.ui.showTestTypeSelection();
        }
    }


    /**
     * Загрузка данных углубленного теста
     */
    async loadAdvancedScenarios() {
        try {
            let data = null;

            // Сначала пробуем использовать встроенные данные (для file:// протокола)
            if (typeof ADVANCED_SCENARIOS_DATA !== 'undefined' && ADVANCED_SCENARIOS_DATA && ADVANCED_SCENARIOS_DATA.questions) {
                debugLog('Кеңейтілген тесттің кірістірілген деректерін қолдану (Using embedded advanced test data): ADVANCED_SCENARIOS_DATA');
                data = ADVANCED_SCENARIOS_DATA;
            } else if (typeof window !== 'undefined' && window.ADVANCED_SCENARIOS_DATA && window.ADVANCED_SCENARIOS_DATA.questions) {
                debugLog('Кеңейтілген тесттің кірістірілген деректерін қолдану (Using embedded advanced test data): window.ADVANCED_SCENARIOS_DATA');
                data = window.ADVANCED_SCENARIOS_DATA;
            } else {
                // Пробуем загрузить через fetch (для HTTP/HTTPS)
                debugLog('Кеңейтілген тест деректерін fetch арқылы жүктеуге тырысуда (Trying to load advanced test data via fetch)...');
                try {
                    const response = await fetch('data/advanced-scenarios.json');
                    if (!response.ok) {
                        throw new Error(`Не удалось загрузить данные углубленного теста: ${response.status} ${response.statusText}`);
                    }
                    data = await response.json();
                } catch (fetchError) {
                    criticalError('Fetch сәтсіз аяқталды (мүмкін file:// хаттамасы) (Fetch failed, possibly file:// protocol):', fetchError.message);
                    throw new Error('Данные углубленного теста не найдены. Убедитесь, что файл advanced-scenarios-data.js загружен.');
                }
            }

            // Валидация данных
            if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
                throw new Error('Невалидная структура данных углубленного теста: отсутствует массив questions');
            }

            if (!data.dimensions || typeof data.dimensions !== 'object') {
                throw new Error('Отсутствуют измерения в данных углубленного теста');
            }

            this.advancedQuestions = data.questions;
            return data;
        } catch (error) {
            criticalError('Кеңейтілген тест деректерін жүктеу қатесі (Error loading advanced test data):', error);
            // Пробрасываем ошибку дальше для обработки в вызывающем коде
            throw error;
        }
    }

    /**
     * Начало базового теста
     */
    /**
     * Начало базового теста
     */
    startBasicTest() {
        if (this.testManager) {
            this.testManager.startBasicTest();
        }
    }

    /**
     * Начало углубленного теста
     */
    /**
     * Начало углубленного теста
     */
    async startAdvancedTest() {
        if (this.testManager) {
            this.testManager.startAdvancedTest();
        }
    }





    /**
     * Начало тестирования
     * @param {string} mode - Тип теста: 'basic', 'advanced', или 'cognitive'
     */
    startTest(mode) {
        if (!this.testManager) {
            console.error('TestManager not initialized');
            return;
        }

        switch (mode) {
            case 'advanced':
                this.testManager.startAdvancedTest();
                break;
            case 'cognitive':
                this.testManager.startCognitiveTest();
                break;
            case 'basic':
            default:
                this.testManager.startBasicTest();
                break;
        }
    }

    /**
     * Отображение текущего вопроса (для углубленного теста)
     */
    showQuestion() {
        if (!this.advancedQuestions || this.advancedQuestions.length === 0) {
            criticalError('Кеңейтілген тест сұрақтары жүктелген жоқ (Advanced test questions not loaded)');
            this.showTestTypeSelection();
            return;
        }

        // Проверяем, все ли вопросы пройдены
        if (this.currentQuestionIndex >= this.advancedQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.advancedQuestions[this.currentQuestionIndex];
        if (!question) {
            this.showResults();
            return;
        }

        const container = document.getElementById('app');
        if (!container) return;

        container.style.opacity = '0';
        this.currentScenarioStartTime = Date.now();

        const t = this.i18n.t.bind(this.i18n);
        const currentLang = this.i18n.getLanguage();

        // Определяем тип вопроса и показываем соответствующий интерфейс
        let questionHTML = '';

        if (question.type === 'scenario') {
            questionHTML = this.ui.renderScenarioQuestion(question, currentLang, t);
        } else if (question.type === 'scale') {
            questionHTML = this.ui.renderScaleQuestion(question, currentLang, t);
        } else if (question.type === 'open') {
            questionHTML = this.ui.renderOpenQuestion(question, currentLang, t);
        } else if (question.type === 'situational') {
            questionHTML = this.ui.renderSituationalQuestion(question, currentLang, t);
        } else {
            criticalError('Сұрақтың белгісіз түрі (Unknown question type):', question.type);
            this.currentQuestionIndex++;
            this.showQuestion();
            return;
        }

        const progress = ((this.currentQuestionIndex + 1) / this.advancedQuestions.length) * 100;

        container.innerHTML = `
            <div class="scenario-screen">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                    <span class="progress-text">${this.currentQuestionIndex + 1} / ${this.advancedQuestions.length}</span>
                </div>
                
                ${questionHTML}
            </div>
        `;

        setTimeout(() => {
            container.style.transition = 'opacity 0.3s';
            container.style.opacity = '1';
        }, 10);
    }


    /**
     * Продолжение теста
     */
    continueTest() {
        if (this.testManager) {
            // Restore saved progress
            const savedProgress = this.storage.loadProgress();
            if (savedProgress && savedProgress.choices) {
                // Check if this is cognitive test
                if (savedProgress.testMode === 'cognitive' || (savedProgress.mode === 'cognitive')) {
                    console.log('🧠 Cognitive test progress found, restoring via TestManager...');
                    if (this.testManager && typeof this.testManager.startCognitiveTest === 'function') {
                        this.testManager.startCognitiveTest();
                        return;
                    }
                }

                // Restore test mode
                let testMode = savedProgress.testMode;

                // Intelligent inference of test mode if missing
                if (!testMode) {
                    // Check signature of advanced test data
                    if (!Array.isArray(savedProgress.choices) && (savedProgress.choices.scales || savedProgress.choices.situational || savedProgress.choices.open)) {
                        testMode = 'advanced';
                        console.log('🔄 Extracted test mode: advanced (inferred)');
                    } else if (savedProgress.choices && savedProgress.choices.length > 0 && (savedProgress.choices[0].weights || savedProgress.choices[0].scenarioId)) {
                        // Basic test usually has simple choices array
                        testMode = 'basic';
                    } else {
                        testMode = 'basic'; // Default fallback
                    }
                }

                this.testManager.testMode = testMode;
                this.testMode = testMode;

                // Load appropriate data
                if (testMode === 'advanced') {
                    // Load advanced test data if not already loaded
                    if (!this.testManager.advancedQuestions || this.testManager.advancedQuestions.length === 0) {
                        this.testManager.loadAdvancedData().then((data) => {
                            // Validate and Init Advanced Analyzer
                            if (data && typeof AdvancedPersonalityAnalyzer !== 'undefined') {
                                this.analyzer = new AdvancedPersonalityAnalyzer(data);
                                console.log('✅ Жалғастыру үшін кеңейтілген анализатор инициализацияланды (✅ Advanced Analyzer initialized for continuation)');
                            }

                            // Restore question index
                            const restoredIndex = savedProgress.currentQuestionIndex || 0;
                            this.testManager.currentQuestionIndex = restoredIndex;
                            console.log('📍 №', restoredIndex + 1, 'сұрақтан жалғастырамыз (📍 Continuing from question No.)');

                            // Debug Info
                            // alert(`DEBUG: Тест ${testMode}, Восстановлен индекс: ${restoredIndex}, Ответы: ${JSON.stringify(savedProgress.choices ? Object.keys(savedProgress.choices) : 'нет')}`);

                            // Restore answers to analyzer
                            if (savedProgress.choices) {
                                // Restore basic choices (array in specialized property or root)
                                const choicesArray = Array.isArray(savedProgress.choices) ? savedProgress.choices : (savedProgress.choices.choices || []);
                                if (Array.isArray(choicesArray)) {
                                    choicesArray.forEach(choice => {
                                        this.analyzer.recordChoice(choice.scenarioId || choice.questionId, choice.choice);
                                    });
                                }

                                // Restore scales
                                if (savedProgress.choices.scales) {
                                    this.analyzer.scaleAnswers = savedProgress.choices.scales || {};
                                }

                                // Restore open answers
                                if (savedProgress.choices.open && this.analyzer.recordOpenAnswer) {
                                    // Manually restore or set property if analyzer supports it
                                    this.analyzer.openAnswers = savedProgress.choices.open || {};
                                }

                                // Restore situational
                                if (savedProgress.choices.situational) {
                                    this.analyzer.situationalAnswers = savedProgress.choices.situational || {};
                                }
                            }

                            // Continue from where left off
                            this.testManager.showNext();
                        }).catch(error => {
                            console.error('Failed to load advanced test data:', error);
                            this.showTestTypeSelection();
                        });
                        return; // Exit here, showNext is called in then()
                    } else {
                        // Data already loaded, just restore index
                        this.testManager.currentQuestionIndex = savedProgress.currentQuestionIndex || 0;

                        // Also restore answers if needed (in case we didn't reload but analyzer is fresh)
                        if (savedProgress.choices) {
                            const choicesArray = Array.isArray(savedProgress.choices) ? savedProgress.choices : (savedProgress.choices.choices || []);
                            if (Array.isArray(choicesArray)) {
                                choicesArray.forEach(choice => {
                                    this.analyzer.recordChoice(choice.scenarioId || choice.questionId, choice.choice);
                                });
                            }
                            if (savedProgress.choices.scales) {
                                this.analyzer.scaleAnswers = savedProgress.choices.scales || {};
                            }
                            if (savedProgress.choices.open) {
                                this.analyzer.openAnswers = savedProgress.choices.open || {};
                            }
                            if (savedProgress.choices.situational) {
                                this.analyzer.situationalAnswers = savedProgress.choices.situational || {};
                            }
                        }
                    }
                } else {
                    // Basic test - load scenarios data first
                    this.testManager.loadData();

                    // Init Basic Analyzer if missing
                    if (!this.analyzer) {
                        this.analyzer = new PersonalityAnalyzer({
                            scenarios: this.scenarios,
                            dimensions: this.dimensions
                        });
                        console.log('✅ Basic Analyzer initialized for continuation');
                    }

                    // Restore choices to analyzer
                    if (Array.isArray(savedProgress.choices)) {
                        this.testManager.testMode = 'basic';
                        this.testManager.completedScenarios = [];

                        savedProgress.choices.forEach(choice => {
                            this.analyzer.recordChoice(choice.scenarioId, choice.choice);

                            // Also restore to testManager.completedScenarios so DynamicSelector skips them!
                            const scenario = this.scenarios.find(s => s.id === choice.scenarioId);
                            if (scenario) {
                                this.testManager.completedScenarios.push(scenario);
                            }
                        });

                        // Update current index to continue from where left off
                        this.testManager.currentScenarioIndex = savedProgress.currentQuestionIndex || savedProgress.choices.length;
                    }
                }


                this.testManager.showNext();
            } else {
                // No progress found, show test selection
                this.showTestTypeSelection();
            }
        }
    }

    /**
     * Начать новый тест (очистить прогресс)
     */
    startNewTest() {
        const t = this.i18n ? this.i18n.t.bind(this.i18n) : ((key) => key);
        const confirmMessage = t('confirmStartNew');

        if (confirm(confirmMessage)) {
            // Clear all progress and results
            if (this.storage) {
                this.storage.clearAll();
            }

            // Reset analyzer
            if (this.analyzer) {
                this.analyzer.reset();
            }

            // Reset test manager state
            if (this.testManager) {
                this.testManager.reset();
            }

            // Show test type selection
            this.showTestTypeSelection();
        }
    }


    /**
     * Обработка выбора в сценарии (для Basic)
     */
    handleScenarioOption(choice, scenarioId) {
        if (this.testManager) {
            this.testManager.recordBasicAnswer(choice, scenarioId);
        }
    }

    /**
     * Обработка ответа на сценарий (для Advanced)
     */
    handleAdvancedAnswer(choice, questionId) {
        if (this.testManager) {
            this.testManager.recordAdvancedAnswer(choice, questionId);
        }
    }


    /**
     * Отображение результатов
     */
    /**
     * Отображение результатов
     */
    /**
     * Отображение результатов
     * @param {Object} [existingResults] - Существующие результаты (для просмотра истории)
     */
    showResults(results = null) {
        this.state = 'results';
        if (this.resultsManager && this.ui) {
            // Если переданы результаты, используем их, иначе генерируем новые
            this.activeResults = results || this.resultsManager.generateResults();
            this.ui.showResults(this.activeResults);
        }
    }

    /**
     * Скачивание результатов
     */
    downloadResults(format = 'html') {
        if (this.testMode === 'cognitive' && this.resultsManager) {
            const results = this.activeResults || (this.storage ? this.storage.loadCognitiveResults() : null);
            return this.resultsManager.downloadCognitiveResults(results);
        }
        if (this.resultsManager) {
            this.resultsManager.downloadResults(format);
        }
    }

    /**
     * Показать профиль пользователя
     */
    showProfile() {
        this.state = 'profile';
        if (this.resultsManager && this.ui) {
            const profileData = this.resultsManager.getProfileData();
            if (!profileData) {
                this.showAuth();
                return;
            }
            this.ui.showProfile(profileData);
        }
    }




    /**
     * Получение аватара пользователя
     * @param {Object} user - Пользователь
     * @returns {string} HTML аватара
     */
    getUserAvatar(user) {
        if (!user) return '?';

        if (user.avatar && user.avatar.type === 'emoji') {
            return `<span style="font-size: 2.5rem;">${user.avatar.value}</span>`;
        } else if (user.avatar && user.avatar.type === 'color') {
            return '';
        }

        // По умолчанию - первая буква имени
        const letter = user.username.charAt(0).toUpperCase();
        return `<span style="font-size: 2rem; color: white;">${letter}</span>`;
    }

    /**
     * Редактирование аватара
     */
    editAvatar() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const t = this.i18n.t.bind(this.i18n);
        const emojis = ['😊', '🎯', '🚀', '💡', '🌟', '⚡', '🎨', '🔬', '📊', '💼', '🎓', '🏆'];
        const colors = ['#4a90e2', '#7b68ee', '#50c878', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c', '#e67e22'];

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${t('chooseAvatar', {})}</h3>
                <div class="avatar-options">
                    <div class="avatar-section">
                        <h4>${t('emojiAvatars', {})}</h4>
                        <div class="emoji-grid">
                            ${emojis.map(emoji => `
                                <button class="avatar-option emoji-option" onclick="app.setAvatar('emoji', '${emoji}')">
                                    ${emoji}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="avatar-section">
                        <h4>${t('colorAvatars', {})}</h4>
                        <div class="color-grid">
                            ${colors.map(color => `
                                <button class="avatar-option color-option" 
                                        style="background: ${color}"
                                        onclick="app.setAvatar('color', '${color}')">
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="app.closeModal()">${t('cancel', {})}</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Закрытие при клике вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * Установка аватара
     */
    setAvatar(type, value) {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        user.avatar = { type, value };
        this.auth.updateUser(user);

        // Закрываем модальное окно
        this.closeModal();

        // Показываем профиль с обновлённым аватаром
        setTimeout(() => {
            this.showProfile();
        }, 100);
    }

    /**
     * Закрытие модального окна
     */
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Редактирование профиля
     */
    editProfile() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const t = this.i18n.t.bind(this.i18n);
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'editProfileModal';
        modal.innerHTML = `
            <div class="modal-content glass" style="max-width: 450px; padding: 2rem;">
                <button class="modal-close material-symbols-rounded" aria-label="Close" onclick="app.closeModal(this)">close</button>
                <div class="modal-header" style="margin-bottom: 1.5rem; padding-bottom: 0; border: none;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span class="material-symbols-rounded" style="color: var(--primary-color); font-size: 2rem;">manage_accounts</span>
                        <h2 class="modal-title gradient-text" style="font-size: 1.5rem; margin: 0;">${t('editProfile', {})}</h2>
                    </div>
                </div>
                <form class="profile-edit-form" onsubmit="app.saveProfile(event)" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <div class="form-group" style="margin: 0;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500;">${t('username')}</label>
                        <input type="text" name="username" class="form-control cosmic-input" value="${user.username}" required style="width: 100%; border-radius: 12px; padding: 0.8rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; transition: all 0.3s ease;">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500;">${t('email')}</label>
                        <input type="email" name="email" class="form-control cosmic-input" value="${user.email || ''}" style="width: 100%; border-radius: 12px; padding: 0.8rem 1rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; transition: all 0.3s ease;">
                    </div>
                    <div class="modal-actions" style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-ghost" onclick="app.closeModal(this)">${t('cancel', {})}</button>
                        <button type="submit" class="btn btn-primary">${t('save', {})}</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Закрытие при клике вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * Сохранение профиля
     */
    saveProfile(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const user = this.auth.getCurrentUser();
        if (!user) return;

        user.username = formData.get('username').trim();
        user.email = formData.get('email').trim();

        this.auth.updateUser(user);

        // Закрываем модальное окно
        this.closeModal();

        // Показываем профиль с обновлёнными данными
        setTimeout(() => {
            this.showProfile();
        }, 100);
    }

    /**
     * Просмотр результатов конкретного теста
     */
    viewTestResults(index) {
        const history = this.auth.getTestHistory();
        if (index >= 0 && index < history.length) {
            const test = history[index];
            // Показываем результаты без повторного сохранения
            this.showResults(test.results);
        }
    }


    /**
     * Rename Cognitive Test
     * @param {HTMLElement} targetElement - Button element for positioning
     */
    renameCognitiveTest(targetElement = null) {
        const currentResults = this.storage.loadCognitiveResults();
        if (!currentResults) return;

        const currentTitle = currentResults.title || currentResults.dominant || this.i18n.t('cognitiveTest');
        const t = this.i18n.t.bind(this.i18n);

        const newTitle = prompt(t('enterTestName') || 'Введите название теста:', currentTitle);

        if (newTitle && newTitle.trim() !== '') {
            if (this.storage.updateCognitiveTestTitle(newTitle.trim())) {
                if (this.toast) this.toast.show(t('testRenamed') || 'Тест переименован', 'success');
                this.showProfile();
            }
        }
    }



    /**
     * Отображение социального сравнения
     * @param {string} containerId - ID контейнера
     * @param {Object} scores - Оценки пользователя
     * @param {Object} profile - Профиль
     * @param {Object} aiAnalysis - AI-анализ
     */
    displaySocialComparison(containerId, scores, profile, aiAnalysis) {
        const container = document.getElementById(containerId);
        if (!container || !this.social) return;

        const comparison = this.social.compareWithOthers(scores, this.analyzer.dimensions);
        const userGroup = this.social.determineUserGroup(scores, aiAnalysis);

        if (!comparison.available) {
            container.innerHTML = `
                <div class="social-unavailable">
                    <p>${comparison.message}</p>
                    <p style="font-size: 0.9em; color: #666; margin-top: 0.5rem;">
                        Пройдите тест еще раз, чтобы увидеть сравнение с другими пользователями
                    </p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="social-comparison">
                <div class="user-group-info">
                    <h3>${this.i18n.t('yourGroup')} ${userGroup.name}</h3>
                    <p>${userGroup.description}</p>
                    <div class="match-score">
                        ${this.i18n.t('match') || 'Соответствие'}: ${Math.round(userGroup.matchScore * 100)}%
                    </div>
                </div>
                
                <div class="comparison-chart">
                    <h3>${this.i18n.t('comparisonTitle')}</h3>
                    <div class="comparison-bars">
        `;

        Object.keys(this.analyzer.dimensions).forEach(dim => {
            const userValue = scores[dim] || 0;
            const avgValue = comparison.averageScores[dim] || 0;
            const percentile = comparison.percentiles[dim] || 50;
            const diff = userValue - avgValue;

            html += `
                <div class="comparison-bar-item">
                    <div class="dimension-name">${this.analyzer.dimensions[dim].name}</div>
                    <div class="bar-container">
                        <div class="bar-average" style="left: ${50 + avgValue / 2}%"></div>
                        <div class="bar-user" style="left: ${50 + userValue / 2}%"></div>
                    </div>
                    <div class="bar-labels">
                        <span class="user-value">${this.i18n.t('you')}: ${userValue}%</span>
                        <span class="avg-value">${this.i18n.t('average')}: ${Math.round(avgValue)}%</span>
                        <span class="percentile">${percentile} ${this.i18n.t('percentile')}</span>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
        `;

        if (comparison.insights && comparison.insights.length > 0) {
            html += `
                <div class="comparison-insights">
                    <h3>${this.i18n.t('comparisonInsights')}</h3>
                    <ul>
            `;
            comparison.insights.forEach(insight => {
                html += `<li class="insight-${insight.type}">${insight.message}</li>`;
            });
            html += `</ul></div>`;
        }

        html += `</div>`;
        container.innerHTML = html;
    }



    /**
     * Обработка выбора опции в сценарии (Базовый тест)
     * @param {string} choice - Выбранная опция (A, B, C, D)
     * @param {number} scenarioId - ID сценария
     */
    handleScenarioOption(choice, scenarioId) {
        if (this.testManager) {
            this.testManager.recordBasicAnswer(choice, scenarioId);
        }
    }

    /**
     * Обработка ответа на углубленный вопрос (Тип: Сценарий)
     * @param {string} choice - Выбранная опция
     * @param {number} questionId - ID вопроса
     */
    handleAdvancedAnswer(choice, questionId) {
        if (this.testManager) {
            this.testManager.recordAdvancedAnswer(choice, questionId);
        }
    }

    /**
     * Обработка ответа на шкалируемый вопрос
     * @param {number} questionId - ID вопроса
     */
    handleScaleAnswer(questionId) {
        const input = document.getElementById(`scale-input-${questionId}`);
        if (input && this.testManager) {
            const value = parseInt(input.value);
            this.testManager.recordScaleAnswer(questionId, value);
        }
    }

    /**
     * Обработка открытого ответа
     * @param {number} questionId - ID вопроса
     */
    handleOpenAnswer(questionId) {
        const textarea = document.getElementById(`open-answer-${questionId}`);
        if (textarea && this.testManager) {
            const text = textarea.value.trim();
            // Basic validation
            if (!text) {
                this.ui.showAlert(this.i18n.t('pleaseEnterAnswer') || 'Пожалуйста, введите ответ');
                return;
            }
            this.testManager.recordOpenAnswer(questionId, text);
        }
    }

    /**
     * Обработка ответа на ситуационный вопрос
     */
    handleSituationalAnswer(questionId, stepId, choice) {
        if (this.testManager) {
            this.testManager.recordSituationalAnswer(questionId, stepId, choice);
        }
    }

    // ... (skipping unchanged code)

    /**
     * Переименование теста
     */
    /**
     * Переименование теста
     */
    renameTest(testId) {
        const history = this.auth.getTestHistory();
        const test = history.find(t => t.id === testId);
        if (!test) return;

        const currentTitle = test.title || `Test`;
        const t = this.i18n.t.bind(this.i18n);

        const newTitle = prompt(t('enterTestName') || 'Введите название теста:', currentTitle);

        if (newTitle && newTitle.trim() !== '') {
            if (this.auth.updateTestTitle(testId, newTitle.trim())) {
                if (this.toast) this.toast.show(t('testRenamed') || 'Тест переименован', 'success');
                this.showProfile();
            }
        }
    }

    /**
     * Удаление теста
     */
    /**
     * Start Cognitive Test
     */
    startCognitiveTest() {
        this.testMode = 'cognitive';
        if (this.testManager) {
            this.testManager.startCognitiveTest();
        }
    }

    /**
     * Handle Cognitive Answer
     */
    handleCognitiveAnswer(choiceId, questionId) {
        if (this.testManager) {
            this.testManager.recordCognitiveAnswer(choiceId, questionId);
        }
    }

    /**
     * Show Cognitive Test Results
     */
    showCognitiveResults(results) {
        if (!results) return;

        // Save to profile/storage if needed
        if (this.storage) {
            this.storage.saveCognitiveResults(results);
        }
        this.activeResults = results;

        const t = this.i18n.t.bind(this.i18n);
        const container = document.getElementById('app');
        if (!container) return;

        const lang = this.i18n.getLanguage();
        const details = results.details || {};
        const title = details.title && details.title[lang] ? details.title[lang] : results.dominant;
        const desc = details.description && details.description[lang] ? details.description[lang] : '';
        const tips = details.tips && details.tips[lang] ? details.tips[lang] : '';

        // Determine dominant style for icon
        const styleIcons = {
            visual: 'visibility',
            auditory: 'hearing',
            kinesthetic: 'sports_martial_arts'
        };
        const dominantIcon = styleIcons[results.dominant] || 'psychology';

        container.innerHTML = `
            <style>
                .cognitive-results {
                    padding: 2rem;
                    max-width: 900px;
                    margin: 0 auto;
                    animation: fadeInUp 0.6s ease;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .results-hero {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding: 3rem 2rem;
                    background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(192, 38, 211, 0.1));
                    border-radius: 24px;
                    border: 1px solid rgba(147, 51, 234, 0.3);
                }
                .results-hero-icon {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 1.5rem;
                    background: linear-gradient(135deg, #9333ea, #c026d3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    box-shadow: 0 10px 40px rgba(147, 51, 234, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .results-hero h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #9333ea, #c026d3);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 1rem;
                }
                .results-hero p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    line-height: 1.6;
                }
                .breakdown-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .breakdown-item {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 2rem 1.5rem;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .breakdown-item:hover {
                    transform: translateY(-5px);
                    border-color: rgba(147, 51, 234, 0.5);
                    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.2);
                }
                .breakdown-item.dominant {
                    border: 2px solid #9333ea;
                    box-shadow: 0 8px 32px rgba(147, 51, 234, 0.3);
                }
                .breakdown-label {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.7;
                    margin-bottom: 0.5rem;
                }
                .breakdown-value {
                    font-size: 3rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #9333ea, #c026d3);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }
                .breakdown-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 1rem;
                }
                .breakdown-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #9333ea, #c026d3);
                    border-radius: 4px;
                    transition: width 1s ease;
                    animation: fillBar 1.5s ease;
                }
                @keyframes fillBar {
                    from { width: 0%; }
                }
                .tips-section {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .tips-section h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.3rem;
                    margin-bottom: 1rem;
                    color: #9333ea;
                }
                .tips-section p {
                    font-size: 1.05rem;
                    line-height: 1.8;
                    opacity: 0.9;
                }
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .action-buttons button {
                    flex: 1;
                    min-width: 200px;
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .btn-primary-gradient {
                    background: linear-gradient(135deg, #9333ea, #c026d3);
                    color: white;
                }
                .btn-primary-gradient:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.4);
                }
                .btn-secondary-outline {
                    background: transparent;
                    border: 2px solid rgba(147, 51, 234, 0.5);
                    color: #9333ea;
                }
                .btn-secondary-outline:hover {
                    background: rgba(147, 51, 234, 0.1);
                    border-color: #9333ea;
                }
            </style>
            <div class="cognitive-results">
                <div class="results-hero">
                    <div class="results-hero-icon">
                        <span class="material-symbols-rounded">${dominantIcon}</span>
                    </div>
                    <h1>${title}</h1>
                    <p>${desc}</p>
                </div>

                <div class="breakdown-grid">
                    <div class="breakdown-item ${results.dominant === 'visual' ? 'dominant' : ''}">
                        <div class="breakdown-label">👁️ Visual</div>
                        <div class="breakdown-value">${results.breakdown.visual}%</div>
                        <div class="breakdown-bar">
                            <div class="breakdown-bar-fill" style="width: ${results.breakdown.visual}%"></div>
                        </div>
                    </div>
                    <div class="breakdown-item ${results.dominant === 'auditory' ? 'dominant' : ''}">
                        <div class="breakdown-label">🎧 Auditory</div>
                        <div class="breakdown-value">${results.breakdown.auditory}%</div>
                        <div class="breakdown-bar">
                            <div class="breakdown-bar-fill" style="width: ${results.breakdown.auditory}%"></div>
                        </div>
                    </div>
                    <div class="breakdown-item ${results.dominant === 'kinesthetic' ? 'dominant' : ''}">
                        <div class="breakdown-label">🤸 Kinesthetic</div>
                        <div class="breakdown-value">${results.breakdown.kinesthetic}%</div>
                        <div class="breakdown-bar">
                            <div class="breakdown-bar-fill" style="width: ${results.breakdown.kinesthetic}%"></div>
                        </div>
                    </div>
                </div>

                <div class="tips-section">
                    <h3>
                        <span class="material-symbols-rounded">tips_and_updates</span>
                        ${t('learningTips')}
                    </h3>
                    <p>${tips}</p>
                </div>

                <div class="action-buttons">
                    <button class="btn-primary-gradient" onclick="app.downloadResults('html')">
                        <span class="material-symbols-rounded">download</span>
                        ${t('downloadResults') || 'Нәтижелерді жүктеу (HTML)'}
                    </button>
                    <button class="btn-secondary-outline" onclick="app.showProfile()">
                        <span class="material-symbols-rounded">person</span>
                        ${t('goToProfile') || 'Профильге өту'}
                    </button>
                    <button class="btn-secondary-outline" onclick="app.showTestTypeSelection()">
                        <span class="material-symbols-rounded">refresh</span>
                        ${t('takeAnotherTest') || 'Басқа тест тапсыру'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Delete Test by ID
     */
    deleteTest(testId, targetElement = null) {
        if (!confirm(this.i18n.t('confirmDelete') || 'Вы уверены, что хотите удалить этот тест?')) return;

        if (testId === 'cognitive') {
            this.storage.removeCognitiveResults();
            if (this.toast) this.toast.show(this.i18n.t('testDeleted') || 'Тест удален', 'success');
            this.showProfile();
        } else if (this.auth.deleteTest(testId)) {
            if (this.toast) this.toast.show(this.i18n.t('testDeleted') || 'Тест удален', 'success');
            this.showProfile();
        }
    }

    /**
     * Delete Selected Tests
     * @param {Array} ids - Array of test IDs or 'cognitive'
     * @param {HTMLElement} targetElement - Button element for positioning
     */
    deleteSelectedTests(ids, targetElement = null) {
        if (!ids || ids.length === 0) return;

        if (!confirm(this.i18n.t('confirmDeleteSelected') || `Вы уверены, что хотите удалить выбранные тесты (${ids.length})?`)) return;

        let deleted = false;

        // Separate cognitive from regular tests
        const regularIds = ids.filter(id => id !== 'cognitive');
        const hasCognitive = ids.includes('cognitive');

        if (hasCognitive) {
            this.storage.removeCognitiveResults();
            deleted = true;
        }

        if (regularIds.length > 0 && this.auth.deleteMultipleTests(regularIds)) {
            deleted = true;
        }

        if (deleted) {
            if (this.toast) this.toast.show(this.i18n.t('testsDeleted') || 'Тесты удалены', 'success');
            this.showProfile();
        }
    }



    /**
     * Выход из аккаунта
     */
    logout() {
        this.auth.logout();
        this.showIntro();
    }

    /**
     * Регистрация Service Worker для PWA
     */
    registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            debugLog('Бұл браузерде Service Worker қолдау көрсетілмейді (Service Worker not supported in this browser)');
            return;
        }

        try {
            window.addEventListener('load', () => {
                const swPath = window.location.pathname.includes('/diplom/') ? './sw.js' : '/sw.js';
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        debugLog('Service Worker тіркелді (Service Worker registered):', registration.scope);

                        // Проверка обновлений
                        registration.addEventListener('updatefound', () => {
                            try {
                                const newWorker = registration.installing;
                                if (newWorker) {
                                    newWorker.addEventListener('statechange', () => {
                                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                            debugLog('Қолданбаның жаңа нұсқасы қолжетімді (New application version available)');
                                        }
                                    });
                                }
                            } catch (updateError) {
                                debugWarn('Service Worker жаңартуларын тексеру қатесі (Error checking Service Worker updates):', updateError);
                            }
                        });
                    })
                    .catch((error) => {
                        debugWarn('Service Worker тіркеу қатесі (Service Worker registration error):', error);
                        // Не критично, приложение может работать без Service Worker
                    });
            });
        } catch (error) {
            debugWarn('Service Worker теңшеу қатесі (Error setting up Service Worker):', error);
        }
    }

    /**
     * Отображение метрик качества теста
     * @param {Object} qualityMetrics - Метрики качества
     * @param {string} containerId - ID контейнера
     */
    displayQualityMetrics(qualityMetrics, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !qualityMetrics) return;

        let html = '<div class="quality-metrics">';

        // Надежность
        if (qualityMetrics.reliability) {
            const reliability = qualityMetrics.reliability;
            html += `
                <div class="metric-section">
                    <h3>${this.i18n.t('reliabilityTitle')}</h3>
                    <div class="metric-item">
                        <span class="metric-label">${this.i18n.t('internalConsistency')}</span>
                        <span class="metric-value ${reliability.quality.overallAlpha >= 0.7 ? 'good' : 'warning'}">
                            ${(reliability.quality.overallAlpha * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">${this.i18n.t('qualityLabel')}</span>
                        <span class="metric-value quality-${reliability.quality.quality}">
                            ${this.getQualityLabel(reliability.quality.quality)}
                        </span>
                    </div>
                    ${reliability.testRetest && reliability.testRetest.valid ? `
                        <div class="metric-item">
                            <span class="metric-label">${this.i18n.t('testRetestReliability')}</span>
                            <span class="metric-value">
                                ${(reliability.testRetest.reliability * 100).toFixed(1)}%
                            </span>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Статистическая валидация
        if (qualityMetrics.statistical) {
            const statistical = qualityMetrics.statistical;
            html += `
                <div class="metric-section">
                    <h3>${this.i18n.t('statisticalTitle')}</h3>
                    <div class="metric-item">
                        <span class="metric-label">${this.i18n.t('validityLabel')}</span>
                        <span class="metric-value validity-${statistical.overallValidity}">
                            ${this.getValidityLabel(statistical.overallValidity)}
                        </span>
                    </div>
                    ${statistical.issues && statistical.issues.length > 0 ? `
                        <div class="metric-warnings">
                            <h4>${this.i18n.t('issuesTitle')}</h4>
                            <ul>
                                ${statistical.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Получение текстовой метки качества
     * @param {string} quality - Качество
     * @returns {string} Метка
     */
    getQualityLabel(quality) {
        const labels = {
            'excellent': 'Отличное',
            'good': 'Хорошее',
            'acceptable': 'Приемлемое',
            'questionable': 'Сомнительное',
            'poor': 'Плохое'
        };
        return labels[quality] || quality;
    }

    /**
     * Получение текстовой метки валидности
     * @param {string} validity - Валидность
     * @returns {string} Метка
     */
    getValidityLabel(validity) {
        const labels = {
            'good': 'Хорошая',
            'questionable': 'Сомнительная',
            'poor': 'Плохая'
        };
        return labels[validity] || validity;
    }

    /**
     * Показ формы обратной связи
     */
    /**
     * Показ формы обратной связи
     */
    showFeedbackForm() {
        if (!this.feedbackService) return;
        this.feedbackService.showForm('feedbackFormContainer');
    }

    submitFeedback() {
        if (!this.feedbackService) return;
        this.feedbackService.submit('feedbackFormContainer');
    }

    /**
     * Пропуск обратной связи
     */
    skipFeedback() {
        if (!this.feedbackService) return;
        this.feedbackService.skip('feedbackFormContainer');
    }

    /**
     * Отображение ошибки
     * @param {string} message - Сообщение об ошибке
     */
    showError(message) {
        const container = document.getElementById('app');
        if (!container) return;

        const errorTitle = this.i18n ? this.i18n.t('error') : 'Ошибка';
        const reloadText = this.i18n ? this.i18n.t('reloadPage') || 'Перезагрузить страницу' : 'Перезагрузить страницу';

        container.innerHTML = `
            <div class="error-message">
                <h2>${errorTitle}</h2>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">${reloadText}</button>
            </div>
        `;
    }
}

// Инициализация приложения при загрузке страницы
let app;

// Инициализация приложения после загрузки DOM и всех критических скриптов
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 50; // Максимум 10 секунд (50 * 200ms)

function initializeApp() {
    initAttempts++;

    // Проверяем, что все необходимые классы и данные загружены
    if (typeof PersonalityTestApp === 'undefined') {
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            debugWarn(`Попытка ${initAttempts}: PersonalityTestApp не определён, ждём...`);
            setTimeout(initializeApp, 200);
        } else {
            criticalError('PersonalityTestApp анықталмады (PersonalityTestApp not defined after)', MAX_INIT_ATTEMPTS, 'attempts');
        }
        return;
    }

    // Проверяем наличие критических зависимостей перед инициализацией
    const requiredModules = ['StorageManager', 'LocalizationManager', 'AuthManager', 'PersonalityAnalyzer', 'ResultsVisualizer'];

    // Функция безопасной проверки доступности модуля
    const isModuleAvailable = (moduleName) => {
        // 1. Проверяем через window (основной способ для браузера)
        if (typeof window !== 'undefined' && typeof window[moduleName] !== 'undefined') {
            return true;
        }

        // 2. Проверяем через globalThis (современный стандарт)
        if (typeof globalThis !== 'undefined' && typeof globalThis[moduleName] !== 'undefined') {
            return true;
        }

        return false;
    };

    // Проверяем доступность каждого модуля с отладочной информацией
    const moduleStatus = {};
    requiredModules.forEach(module => {
        moduleStatus[module] = isModuleAvailable(module);
    });

    // Логируем статус модулей для диагностики (только при первой попытке или при ошибках)
    if (initAttempts === 1 || initAttempts % 10 === 0) {
        debugLog('Модульдердің жүктелу күйі (Module loading status):', moduleStatus);
        const availableModules = Object.entries(moduleStatus)
            .filter(([_, available]) => available)
            .map(([name]) => name);
        const missingModules = Object.entries(moduleStatus)
            .filter(([_, available]) => !available)
            .map(([name]) => name);

        if (availableModules.length > 0) {
            debugLog('Жүктелген модульдер (Modules loaded):', availableModules);
        }
        if (missingModules.length > 0) {
            debugWarn('Модульдер жетіспейді (Missing modules):', missingModules);
        }
    }

    const missingModules = requiredModules.filter(module => !isModuleAvailable(module));

    if (missingModules.length > 0) {
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            console.warn(`${initAttempts}-әрекет (Attempt): Маңызды модульдер жүктелмеген (Critical modules not loaded):`, missingModules);
            // Ждем еще немного и пробуем снова
            setTimeout(() => {
                initializeApp(); // Рекурсивно пытаемся снова
            }, 200);
            return;
        } else {
            // Превышен лимит попыток - выводим критическую ошибку
            console.error('Маңызды модульдер ' + MAX_INIT_ATTEMPTS + ' әрекеттен кейін де жүктелмеді (Critical modules not loaded after attempts):', missingModules);
            // Показываем ошибку пользователю, но не прерываем выполнение полностью
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>Модульдерді жүктеу қатесі (Error loading modules)</h2>
                        <p>Маңызды модульдерді жүктеу мүмкін болмады (Failed to load critical modules): ${missingModules.join(', ')}</p>
                        <p style="font-size: 0.9em; color: #666;">Мәліметтерді браузер консолінен (F12) тексеріңіз (Check browser console for details).</p>
                        <button class="btn btn-primary" onclick="location.reload()">Бетті қайта жүктеу (Reload page)</button>
                    </div>
                `;
            }
            return; // Не продолжаем инициализацию без критических модулей
        }
    }

    // Проверяем доступность встроенных данных (пробуем несколько вариантов)
    let hasData = false;
    let dataSource = '';

    if (typeof SCENARIOS_DATA !== 'undefined' && SCENARIOS_DATA && SCENARIOS_DATA.scenarios) {
        hasData = true;
        dataSource = 'SCENARIOS_DATA';
    } else if (typeof window !== 'undefined' && window.SCENARIOS_DATA && window.SCENARIOS_DATA.scenarios) {
        hasData = true;
        dataSource = 'window.SCENARIOS_DATA';
    } else if (typeof globalThis !== 'undefined' && globalThis.SCENARIOS_DATA && globalThis.SCENARIOS_DATA.scenarios) {
        hasData = true;
        dataSource = 'globalThis.SCENARIOS_DATA';
    }

    if (!hasData) {
        debugWarn(`${initAttempts}-әрекет (Attempt): SCENARIOS_DATA әлі жүктелмеген, күтеміз... (SCENARIOS_DATA not loaded yet, waiting...)`);
        debugLog('SCENARIOS_DATA тексеру (Checking SCENARIOS_DATA):', typeof SCENARIOS_DATA);
        debugLog('window.SCENARIOS_DATA тексеру (Checking window.SCENARIOS_DATA):', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'window unavailable');

        if (initAttempts < MAX_INIT_ATTEMPTS) {
            setTimeout(initializeApp, 200);
        } else {
            criticalError('SCENARIOS_DATA жүктеу әрекеттерінің шекті санынан асты (Max attempts to load SCENARIOS_DATA exceeded)');
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>Деректерді жүктеу қатесі (Error loading data)</h2>
                        <p>Сценарий деректерін жүктеу мүмкін болмады (Failed to load scenario data). Убедитесь, что файл scenarios-data.js загружен.</p>
                        <p style="font-size: 0.9em; color: #666;">Мәліметтерді браузер консолінен (F12) тексеріңіз (Check browser console for details).</p>
                        <button class="btn btn-primary" onclick="location.reload()">Бетті қайта жүктеу (Reload page)</button>
                    </div>
                `;
            }
        }
        return;
    }

    debugLog('Кірістірілген деректер табылды (Embedded data found via):', dataSource);

    // Check if all required classes are loaded
    const requiredClasses = ['UIController', 'TestManager', 'ResultsManager', 'StorageManager', 'AuthManager'];
    const missingClasses = requiredClasses.filter(className => typeof window[className] === 'undefined');

    if (missingClasses.length > 0) {
        debugWarn(`Waiting for classes to load: ${missingClasses.join(', ')}`);
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            setTimeout(initializeApp, 200);
        } else {
            criticalError('Required classes not loaded:', missingClasses);
        }
        return;
    }

    // Все готово, инициализируем
    try {
        app = new PersonalityTestApp();
        window.app = app; // Expose to global scope for onclick handlers
        console.log('✅ window.app initialized:', window.app);
        console.log('✅ app.renameTest exists:', typeof app.renameTest);
        console.log('✅ app.deleteTest exists:', typeof app.deleteTest);
        // Вызываем init() после создания экземпляра
        if (app && typeof app.init === 'function') {
            app.init().catch(error => {
                criticalError('Қолданбаны инициализациялау қатесі (Error initializing application):', error);
            });
        }
    } catch (error) {
        criticalError('Қолданбаны жасау қатесі (Error creating application):', error);
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Инициализация қатесі (Initialization error)</h2>
                    <p>${error.message || 'Неизвестная ошибка'}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Бетті қайта жүктеу (Reload page)</button>
                </div>
            `;
        }
    }
}

// Инициализация после загрузки DOM и всех скриптов
if (document.readyState === 'loading') {
    // DOMContentLoaded fires before scripts, use window load instead
    window.addEventListener('load', initializeApp);
} else {
    // DOM уже загружен, но ждем загрузки всех скриптов
    window.addEventListener('load', initializeApp);
}
