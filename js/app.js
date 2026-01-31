/**
 * Главный модуль приложения
 * Управляет состоянием и взаимодействием всех компонентов
 * 
 * Дипломный проект: Разработка программной системы анализа личностных предпочтений 
 * и направлений развития пользователя на основе интерактивных сценариев выбора, 
 * на языках программирования HTML, CSS, JS
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

// Флаг отладки (можно установить через localStorage или URL параметр)
const DEBUG = localStorage.getItem('debug') === 'true' ||
    (typeof URLSearchParams !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true');

// Вспомогательные функции для логирования
const debugLog = DEBUG ? console.log.bind(console) : () => { };
const debugError = DEBUG ? console.error.bind(console) : () => { };
const debugWarn = DEBUG ? console.warn.bind(console) : () => { };

// Критичные ошибки всегда логируются
const criticalError = console.error.bind(console);
const criticalLog = console.log.bind(console);

// Easter Egg Signature
console.log('%c Developed by Ахмедьянов Саламат КПО 9/22-2 ', 'background: #222; color: #bada55; font-size: 12px; padding: 4px; border-radius: 4px;');

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

        // Проверка и инициализация опциональных модулей с fallback
        this.gamification = this.initializeOptionalModule('GamificationSystem', () => {
            const gm = new GamificationSystem();
            gm.initialize();
            return gm;
        });

        this.social = this.initializeOptionalModule('SocialFeatures', () => {
            const sf = new SocialFeatures();
            sf.initialize();
            return sf;
        });

        this.advancedAnalytics = this.initializeOptionalModule('AdvancedAnalytics', () => new AdvancedAnalytics());
        this.reportGenerator = this.initializeOptionalModule('ReportGenerator', () => new ReportGenerator());
        this.aiCoach = this.initializeOptionalModule('AICoach', () => new AICoach());

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
            threejs: typeof THREE !== 'undefined' || (typeof window !== 'undefined' && window.THREE),
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
                debugLog('SCENARIOS_DATA доступен сразу');
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
                    debugLog('SCENARIOS_DATA загружен через событие');
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
                    criticalError('КРИТИЧЕСКАЯ ОШИБКА: Встроенные данные недоступны');
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
                    criticalError('КРИТИЧЕСКИЕ ЗАВИСИМОСТИ ОТСУТСТВУЮТ:', critical);
                    this.showDependencyError(critical);
                    return;
                } else if (depsCheck.missing.includes('threejs')) {
                    debugWarn('Three.js not loaded. 3D features will be disabled.');
                    // We can proceed, just without 3D
                }
            }

            let data = null;

            // Используем Promise-based подход для загрузки данных
            try {
                data = await this.waitForScenariosData(2000);
                debugLog('Встроенные данные сценариев успешно загружены');
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
                    debugLog('Встроенные данные найдены в последней попытке');
                } else {
                    throw error; // Пробрасываем ошибку дальше
                }
            }

            // Если встроенные данные не найдены, это критическая ошибка
            if (!data || !data.scenarios || !Array.isArray(data.scenarios) || data.scenarios.length === 0) {
                criticalError('КРИТИЧЕСКАЯ ОШИБКА: Встроенные данные недоступны');
                criticalError('SCENARIOS_DATA:', typeof SCENARIOS_DATA);
                criticalError('window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'N/A');
                throw new Error('Встроенные данные сценариев недоступны. Убедитесь, что scenarios-data.js загружен правильно.');
            }

            // Валидация структуры данных
            if (!this.validateScenariosData(data)) {
                criticalError('КРИТИЧЕСКАЯ ОШИБКА: Невалидная структура данных сценариев');
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
                            debugLog('Данные обновлены из scenarios.json');
                        } else {
                            debugWarn('Данные из scenarios.json невалидны, используются встроенные данные');
                        }
                    }
                } catch (fetchError) {
                    // Не критично - используем встроенные данные
                    debugLog('Не удалось загрузить scenarios.json, используются встроенные данные');
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
            setTimeout(() => {
                // Убеждаемся, что язык применён правильно ПЕРЕД инициализацией UI
                const currentLang = this.i18n.getLanguage();
                document.documentElement.lang = currentLang;

                // Инициализируем UI (включая селектор языка)
                this.initUI();

                // Инициализация 3D фона - ждем загрузки Three.js ES модуля
                console.log('[App] Attempting to initialize background. NeuralBackground available:', typeof NeuralBackground !== 'undefined', 'THREE available:', typeof THREE !== 'undefined');
                const initBackground3D = () => {
                    if (typeof NeuralBackground !== 'undefined' && typeof THREE !== 'undefined') {
                        console.log('[App] Initializing NeuralBackground...');
                        this.background3D = new NeuralBackground('background-canvas');
                    } else if (typeof NeuralBackground !== 'undefined') {
                        // THREE еще не загружен, ждем
                        console.log('[App] NeuralBackground available, waiting for THREE...');
                        const initBg = () => {
                            console.log('[App] THREE loaded, initializing NeuralBackground...');
                            this.background3D = new NeuralBackground('background-canvas');
                            window.removeEventListener('threejs-loaded', initBg);
                        };
                        window.addEventListener('threejs-loaded', initBg);
                    } else {
                        // NeuralBackground еще не загружен (defer script), пробуем позже
                        console.log('[App] NeuralBackground not available yet, retrying in 100ms...');
                        setTimeout(initBackground3D, 100);
                    }
                };
                initBackground3D();

                // Регистрация Service Worker для PWA
                this.registerServiceWorker();

                // Проверка текущей страницы
                const path = window.location.pathname;
                const page = path.split('/').pop().toLowerCase();

                // Только на главной странице показываем интро
                if (!page || page === 'index.html' || page === '') {
                    this.showIntro();
                } else if (page === 'profile.html' || page === 'profile') {
                    this.showProfile();
                }
                // Для about.html ничего не делаем, контент статический

            }, 100);

        } catch (error) {
            criticalError('Ошибка инициализации:', error);
            const errorMessage = error.message || 'Неизвестная ошибка';
            criticalError('Детали ошибки:', errorMessage);

            // Дополнительная диагностика
            debugLog('Проверка доступности SCENARIOS_DATA:', typeof SCENARIOS_DATA);
            debugLog('Проверка доступности window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'window недоступен');

            // Последняя попытка использовать встроенные данные напрямую
            if (typeof SCENARIOS_DATA !== 'undefined' && SCENARIOS_DATA && SCENARIOS_DATA.scenarios) {
                debugLog('Попытка использовать SCENARIOS_DATA напрямую...');
                try {
                    this.scenarios = SCENARIOS_DATA.scenarios;
                    this.analyzer = new PersonalityAnalyzer(SCENARIOS_DATA);
                    this.dynamicSelector = new DynamicScenarioSelector(SCENARIOS_DATA.scenarios);
                    this.visualizer = new ResultsVisualizer('radarChartContainer');
                    this.checkSavedProgress();

                    setTimeout(() => {
                        const currentLang = this.i18n.getLanguage();
                        document.documentElement.lang = currentLang;
                        this.initUI();

                        // Инициализация 3D фона - ждем загрузки Three.js
                        const initBackground3D = () => {
                            if (typeof NeuralBackground !== 'undefined' && typeof THREE !== 'undefined') {
                                this.background3D = new NeuralBackground('background-canvas');
                            } else if (typeof NeuralBackground !== 'undefined') {
                                const initBg = () => {
                                    this.background3D = new NeuralBackground('background-canvas');
                                    window.removeEventListener('threejs-loaded', initBg);
                                };
                                window.addEventListener('threejs-loaded', initBg);
                            } else {
                                setTimeout(initBackground3D, 100);
                            }
                        };
                        initBackground3D();

                        this.state = 'intro';
                        this.showIntro();
                    }, 100);

                    debugLog('Приложение инициализировано с использованием встроенных данных');
                    return; // Успешно инициализировано
                } catch (recoveryError) {
                    console.error('Ошибка при восстановлении:', recoveryError);
                }
            }

            // Показываем более информативное сообщение об ошибке
            let userMessage = 'Не удалось загрузить данные сценариев. ';
            if (errorMessage.includes('встроенные данные недоступны')) {
                userMessage += 'Проблема с загрузкой резервных данных. ';
                userMessage += 'Попробуйте перезагрузить страницу или используйте локальный сервер.';
            } else if (errorMessage.includes('пусты или имеют неверный формат')) {
                userMessage += 'Данные имеют неверный формат. ';
                userMessage += 'Проверьте файл scenarios.json или используйте встроенные данные.';
            } else {
                userMessage += 'Убедитесь, что файл scenarios.json существует или используйте локальный сервер для запуска приложения.';
            }

            this.showError(userMessage);
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

            if ((savedProgress.testMode === 'basic' || !savedProgress.testMode) && !isAdvancedData) {
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
                        console.log('Detected advanced mode in checkSavedProgress');
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
                debugLog('Используем встроенные данные углубленного теста (ADVANCED_SCENARIOS_DATA)');
                data = ADVANCED_SCENARIOS_DATA;
            } else if (typeof window !== 'undefined' && window.ADVANCED_SCENARIOS_DATA && window.ADVANCED_SCENARIOS_DATA.questions) {
                debugLog('Используем встроенные данные углубленного теста (window.ADVANCED_SCENARIOS_DATA)');
                data = window.ADVANCED_SCENARIOS_DATA;
            } else {
                // Пробуем загрузить через fetch (для HTTP/HTTPS)
                debugLog('Пробуем загрузить данные углубленного теста через fetch...');
                try {
                    const response = await fetch('data/advanced-scenarios.json');
                    if (!response.ok) {
                        throw new Error(`Не удалось загрузить данные углубленного теста: ${response.status} ${response.statusText}`);
                    }
                    data = await response.json();
                } catch (fetchError) {
                    criticalError('Fetch не удался (возможно file:// протокол):', fetchError.message);
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
            criticalError('Ошибка загрузки данных углубленного теста:', error);
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
     */
    startTest() {
        this.state = 'testing';
        if (this.testMode === 'advanced') {
            this.showQuestion();
        } else {
            this.showScenario();
        }
    }

    /**
     * Отображение текущего вопроса (для углубленного теста)
     */
    showQuestion() {
        if (!this.advancedQuestions || this.advancedQuestions.length === 0) {
            criticalError('Вопросы углубленного теста не загружены');
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
            criticalError('Неизвестный тип вопроса:', question.type);
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
                                console.log('✅ Advanced Analyzer initialized for continuation');
                            }

                            // Restore question index
                            const restoredIndex = savedProgress.currentQuestionIndex || 0;
                            this.testManager.currentQuestionIndex = restoredIndex;
                            console.log('📍 Продолжаем с вопроса №', restoredIndex + 1);

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
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${t('editProfile', {})}</h3>
                <form class="profile-edit-form" onsubmit="app.saveProfile(event)">
                    <div class="form-group">
                        <label>${t('username')}</label>
                        <input type="text" name="username" value="${user.username}" required>
                    </div>
                    <div class="form-group">
                        <label>${t('email')}</label>
                        <input type="email" name="email" value="${user.email || ''}">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${t('save', {})}</button>
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">${t('cancel', {})}</button>
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
     * Отображение прогресса геймификации
     * @param {string} containerId - ID контейнера
     * @param {Object} result - Результат прохождения теста
     */
    displayGamificationProgress(containerId, result) {
        const container = document.getElementById(containerId);
        if (!container || !this.gamification) return;

        const progress = this.gamification.getUserProgress();
        const newAchievements = result ? result.achievements : [];

        let html = `
            <div class="gamification-progress">
                <div class="level-info">
                    <div class="level-badge">
                        <span class="level-number">${progress.level}</span>
                        <span class="level-label">${this.i18n.t('levelLabel')}</span>
                    </div>
                    <div class="xp-info">
                        <div class="xp-bar">
                            <div class="xp-fill" style="width: ${progress.progressPercent}%"></div>
                        </div>
                        <div class="xp-text">
                            <span>${progress.experience} XP</span>
                            <span>${this.i18n.t('xpToNext')} ${progress.xpToNext} XP</span>
                        </div>
                    </div>
                </div>
                
                <div class="streak-info">
                    <span class="streak-icon">🔥</span>
                    <span class="streak-text">${this.i18n.t('streakLabel')} ${progress.streak}</span>
                </div>
                
                <div class="achievements-summary">
                    <h3>${this.i18n.t('achievementsTitle')} ${progress.achievements} / ${progress.totalAchievements}</h3>
                    <div class="achievements-grid">
        `;

        // Показываем последние 6 достижений
        const unlockedAchievements = this.gamification.achievements
            .filter(a => a.unlocked)
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .slice(0, 6);

        unlockedAchievements.forEach(achievement => {
            html += `
                <div class="achievement-badge ${achievement.rarity || 'common'}" title="${achievement.description}">
                    <span class="achievement-icon">${achievement.icon || '🏆'}</span>
                    <span class="achievement-name">${achievement.name}</span>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
        `;

        // Показываем новые достижения
        if (newAchievements && newAchievements.length > 0) {
            html += `
                <div class="new-achievements">
                    <h3>${this.i18n.t('newAchievements')}</h3>
            `;
            newAchievements.forEach(achievement => {
                html += `
                    <div class="achievement-unlocked ${achievement.rarity || 'common'}">
                        <span class="achievement-icon-large">${achievement.icon || '🏆'}</span>
                        <div>
                            <h4>${achievement.name}</h4>
                            <p>${achievement.description}</p>
                            <span class="xp-reward">+${achievement.xpReward || 0} XP</span>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;
        container.innerHTML = html;

        // Анимация появления новых достижений
        if (newAchievements && newAchievements.length > 0) {
            setTimeout(() => {
                const newAchievementElements = container.querySelectorAll('.achievement-unlocked');
                newAchievementElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate-in');
                    }, index * 200);
                });
            }, 100);
        }
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

    // ... (skipping unchanged code)

    /**
     * Переименование теста
     */
    renameTest(index) {
        const history = this.auth.getTestHistory();
        if (!history[index]) return;

        const currentTitle = history[index].title || `Test #${history.length - index}`;
        const t = this.i18n.t.bind(this.i18n);

        this.ui.showPrompt(
            t('enterTestName') || 'Введите название теста:',
            currentTitle,
            (newTitle) => {
                if (newTitle && newTitle.trim() !== '') {
                    if (this.auth.updateTestTitle(index, newTitle.trim())) {
                        this.showProfile(); // Обновляем UI
                    }
                }
            }
        );
    }

    /**
     * Удаление теста
     */
    deleteTest(index) {
        const t = this.i18n.t.bind(this.i18n);
        this.ui.showConfirm(
            t('confirmDelete') || 'Вы уверены, что хотите удалить этот тест?',
            () => {
                if (this.auth.deleteTest(index)) {
                    this.showProfile(); // Обновляем UI
                }
            }
        );
    }

    // ... (rest of deleteTest implementation)

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
            debugLog('Service Worker не поддерживается в этом браузере');
            return;
        }

        try {
            window.addEventListener('load', () => {
                const swPath = window.location.pathname.includes('/diplom/') ? './sw.js' : '/sw.js';
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        debugLog('Service Worker зарегистрирован:', registration.scope);

                        // Проверка обновлений
                        registration.addEventListener('updatefound', () => {
                            try {
                                const newWorker = registration.installing;
                                if (newWorker) {
                                    newWorker.addEventListener('statechange', () => {
                                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                            debugLog('Доступна новая версия приложения');
                                        }
                                    });
                                }
                            } catch (updateError) {
                                debugWarn('Ошибка при проверке обновлений Service Worker:', updateError);
                            }
                        });
                    })
                    .catch((error) => {
                        debugWarn('Ошибка регистрации Service Worker:', error);
                        // Не критично, приложение может работать без Service Worker
                    });
            });
        } catch (error) {
            debugWarn('Ошибка при настройке Service Worker:', error);
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
            criticalError('PersonalityTestApp не определён после', MAX_INIT_ATTEMPTS, 'попыток');
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
        debugLog('Статус загрузки модулей:', moduleStatus);
        const availableModules = Object.entries(moduleStatus)
            .filter(([_, available]) => available)
            .map(([name]) => name);
        const missingModules = Object.entries(moduleStatus)
            .filter(([_, available]) => !available)
            .map(([name]) => name);

        if (availableModules.length > 0) {
            debugLog('Загружены модули:', availableModules);
        }
        if (missingModules.length > 0) {
            debugWarn('Отсутствуют модули:', missingModules);
        }
    }

    const missingModules = requiredModules.filter(module => !isModuleAvailable(module));

    if (missingModules.length > 0) {
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            console.warn(`Попытка ${initAttempts}: Критические модули не загружены:`, missingModules);
            // Ждем еще немного и пробуем снова
            setTimeout(() => {
                initializeApp(); // Рекурсивно пытаемся снова
            }, 200);
            return;
        } else {
            // Превышен лимит попыток - выводим критическую ошибку
            console.error('Критические модули не загружены после', MAX_INIT_ATTEMPTS, 'попыток:', missingModules);
            console.error('Проверьте порядок загрузки скриптов в index.html');
            // Показываем ошибку пользователю, но не прерываем выполнение полностью
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>Ошибка загрузки модулей</h2>
                        <p>Не удалось загрузить критические модули: ${missingModules.join(', ')}</p>
                        <p style="font-size: 0.9em; color: #666;">Проверьте консоль браузера (F12) для деталей.</p>
                        <button class="btn btn-primary" onclick="location.reload()">Перезагрузить страницу</button>
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
        debugWarn(`Попытка ${initAttempts}: SCENARIOS_DATA ещё не загружен, ждём...`);
        debugLog('Проверка SCENARIOS_DATA:', typeof SCENARIOS_DATA);
        debugLog('Проверка window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'window недоступен');

        if (initAttempts < MAX_INIT_ATTEMPTS) {
            setTimeout(initializeApp, 200);
        } else {
            criticalError('Превышено максимальное количество попыток загрузки SCENARIOS_DATA');
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>Ошибка загрузки данных</h2>
                        <p>Не удалось загрузить данные сценариев. Убедитесь, что файл scenarios-data.js загружен.</p>
                        <p style="font-size: 0.9em; color: #666;">Проверьте консоль браузера (F12) для деталей.</p>
                        <button class="btn btn-primary" onclick="location.reload()">Перезагрузить страницу</button>
                    </div>
                `;
            }
        }
        return;
    }

    debugLog('Встроенные данные найдены через:', dataSource);

    // Все готово, инициализируем
    try {
        app = new PersonalityTestApp();
        // Вызываем init() после создания экземпляра
        if (app && typeof app.init === 'function') {
            app.init().catch(error => {
                criticalError('Ошибка инициализации приложения:', error);
            });
        }
    } catch (error) {
        criticalError('Ошибка создания приложения:', error);
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Ошибка инициализации</h2>
                    <p>${error.message || 'Неизвестная ошибка'}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Перезагрузить страницу</button>
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
