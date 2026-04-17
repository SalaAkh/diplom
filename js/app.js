/**
 * ÒšÐ¾ÑÑ‹Ð¼ÑˆÐ°Ð½Ñ‹Ò£ Ð½ÐµÐ³Ñ–Ð·Ð³Ñ– Ð¼Ð¾Ð´ÑƒÐ»Ñ– (Main application module)
 * Ð‘Ð°Ñ€Ð»Ñ‹Ò› ÐºÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½Ñ‚Ñ‚ÐµÑ€Ð´Ñ–Ò£ ÐºÒ¯Ð¹Ñ– Ð¼ÐµÐ½ Ó©Ð·Ð°Ñ€Ð° Ó™Ñ€ÐµÐºÐµÑ‚Ñ‚ÐµÑÑƒÑ–Ð½ Ð±Ð°ÑÒ›Ð°Ñ€Ð°Ð´Ñ‹ (Manages state and interaction of all components)
 * 
 * Ð”Ð¸Ð¿Ð»Ð¾Ð¼Ð´Ñ‹Ò› Ð¶Ð¾Ð±Ð°: HTML, CSS, JS Ð±Ð°Ò“Ð´Ð°Ñ€Ð»Ð°Ð¼Ð°Ð»Ð°Ñƒ Ñ‚Ñ–Ð»Ð´ÐµÑ€Ñ–Ð½Ð´Ðµ Ð¸Ð½Ñ‚ÐµÑ€Ð°ÐºÑ‚Ð¸Ð²Ñ‚Ñ– Ñ‚Ð°Ò£Ð´Ð°Ñƒ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¹Ð»ÐµÑ€Ñ– Ð½ÐµÐ³Ñ–Ð·Ñ–Ð½Ð´Ðµ 
 * Ð¿Ð°Ð¹Ð´Ð°Ð»Ð°Ð½ÑƒÑˆÑ‹Ð½Ñ‹Ò£ Ð¶ÐµÐºÐµ Ð±Ð°ÑÑ‹Ð¼Ð´Ñ‹Ò›Ñ‚Ð°Ñ€Ñ‹ Ð¼ÐµÐ½ Ð´Ð°Ð¼Ñƒ Ð±Ð°Ò“Ñ‹Ñ‚Ñ‚Ð°Ñ€Ñ‹Ð½ Ñ‚Ð°Ð»Ð´Ð°Ñƒ Ð±Ð°Ò“Ð´Ð°Ñ€Ð»Ð°Ð¼Ð°Ð»Ñ‹Ò› Ð¶Ò¯Ð¹ÐµÑÑ–Ð½ Ó™Ð·Ñ–Ñ€Ð»ÐµÑƒ
 * (Diploma project: Development of a software system for analyzing personal preferences 
 * and user development directions based on interactive choice scenarios, in JS)
 * 
 * ÐÐ²Ñ‚Ð¾Ñ€Ñ‹ (Author): ÐÑ…Ð¼ÐµÐ´ÑŒÑÐ½Ð¾Ð² Ð¡Ð°Ð»Ð°Ð¼Ð°Ñ‚ ÐšÐŸÐž 9/22-2
 * ÐœÐµÑ€Ð·Ñ–Ð¼Ñ– (Date): 2026
 */

// Ð¢Ò¯Ð·ÐµÑ‚Ñƒ Ð¶Ð°Ð»Ð°ÑƒÑˆÐ°ÑÑ‹ (Debug flag) (localStorage Ð½ÐµÐ¼ÐµÑÐµ URL Ð¿Ð°Ñ€Ð°Ð¼ÐµÑ‚Ñ€Ñ– Ð°Ñ€Ò›Ñ‹Ð»Ñ‹ Ð¾Ñ€Ð½Ð°Ñ‚ÑƒÒ“Ð° Ð±Ð¾Ð»Ð°Ð´Ñ‹)
const DEBUG = localStorage.getItem('debug') === 'true' ||
    (typeof URLSearchParams !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true');

// Ð›Ð¾Ð³Ñ‚Ð°ÑƒÒ“Ð° Ð°Ñ€Ð½Ð°Ð»Ò“Ð°Ð½ ÐºÓ©Ð¼ÐµÐºÑˆÑ– Ñ„ÑƒÐ½ÐºÑ†Ð¸ÑÐ»Ð°Ñ€ (Helper functions for logging)
const debugLog = DEBUG ? console.log.bind(console) : () => { };
const debugError = DEBUG ? console.error.bind(console) : () => { };
const debugWarn = DEBUG ? console.warn.bind(console) : () => { };

// ÐœÐ°Ò£Ñ‹Ð·Ð´Ñ‹ Ò›Ð°Ñ‚ÐµÐ»ÐµÑ€ Ó™Ñ€Ò›Ð°ÑˆÐ°Ð½ Ð»Ð¾Ð³Ñ‚Ð°Ð»Ð°Ð´Ñ‹ (Critical errors are always logged)
const criticalError = console.error.bind(console);
const criticalLog = console.log.bind(console);

// Easter Egg Signature
console.log('%c Әзірлеген Ахмедьянов Саламат КПО 9/22-2 ', 'background: #222; color: #bada55; font-size: 12px; padding: 4px; border-radius: 4px;');

/**
 * Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ debounce Ð´Ð»Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ¸ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ
 * @param {Function} func - Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð´Ð»Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ
 * @param {number} wait - Ð’Ñ€ÐµÐ¼Ñ Ð·Ð°Ð´ÐµÑ€Ð¶ÐºÐ¸ Ð² Ð¼Ñ
 * @returns {Function} ÐžÐ±ÐµÑ€Ð½ÑƒÑ‚Ð°Ñ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ñ
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
        this.completedScenarios = []; // ÐœÐ°ÑÑÐ¸Ð² Ð·Ð°Ð²ÐµÑ€ÑˆÑ‘Ð½Ð½Ñ‹Ñ… ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ² Ð´Ð»Ñ Ð´Ð¸Ð½Ð°Ð¼Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ Ð»Ð¾Ð³Ð¸ÐºÐ¸
        this.currentScenarioIndex = 0;
        this.analyzer = null;
        this.visualizer = null;
        this.dynamicSelector = null; // Ð”Ð¸Ð½Ð°Ð¼Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÑÐµÐ»ÐµÐºÑ‚Ð¾Ñ€ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ²
        this.storage = new StorageManager();
        this.auth = new AuthManager();
        this.ui = new UIController(this);
        this.testManager = new TestManager(this);
        this.resultsManager = new ResultsManager(this);
        this.feedbackService = null; // Ð‘ÑƒÐ´ÐµÑ‚ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½ Ð² init()

        // AI Analysis Ñ Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÐµÐ¹
        this.aiAnalyzer = this.initializeOptionalModule('AIAnalyzer', () => new AIAnalyzer());

        this.i18n = typeof i18n !== 'undefined' ? i18n : new LocalizationManager();



        this.social = this.initializeOptionalModule('SocialFeatures', () => {
            const sf = new SocialFeatures();
            sf.initialize();
            return sf;
        });

        this.advancedAnalytics = this.initializeOptionalModule('AdvancedAnalytics', () => new AdvancedAnalytics());

        // ÐœÐ¾Ð´ÑƒÐ»Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ñ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°
        this.testReliability = this.initializeOptionalModule('TestReliability', () => new TestReliability());
        this.statisticalValidation = this.initializeOptionalModule('StatisticalValidation', () => new StatisticalValidation());
        this.qualityControl = this.initializeOptionalModule('QualityControl', () => new QualityControl());
        this.scenarioCalibration = this.initializeOptionalModule('ScenarioCalibration', () => new ScenarioCalibration());
        this.feedbackSystem = this.initializeOptionalModule('FeedbackSystem', () => new FeedbackSystem());

        this.state = 'intro'; // auth, intro, testSelection, testing, results
        this.testMode = null; // 'basic' Ð¸Ð»Ð¸ 'advanced'
        this.advancedQuestions = []; // Ð’Ð¾Ð¿Ñ€Ð¾ÑÑ‹ Ð´Ð»Ñ ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
        this.currentQuestionIndex = 0; // Ð˜Ð½Ð´ÐµÐºÑ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ° (Ð´Ð»Ñ ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°)
        this.currentSituationalStep = {}; // ÐžÑ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ ÑˆÐ°Ð³Ð° Ð´Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ ÑÐ¸Ñ‚ÑƒÐ°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ° {questionId: stepIndex}
        this.currentScenarioStartTime = null; // Ð’Ñ€ÐµÐ¼Ñ Ð½Ð°Ñ‡Ð°Ð»Ð° Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ°

        // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ñ€Ð¾Ð¸ÑÑ…Ð¾Ð´Ð¸Ñ‚ Ð°ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð½Ð¾ Ð¿Ð¾ÑÐ»Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ Ð²ÑÐµÑ… ÑÐºÑ€Ð¸Ð¿Ñ‚Ð¾Ð²
        // ÐÐµ Ð²Ñ‹Ð·Ñ‹Ð²Ð°ÐµÐ¼ this.init() Ð·Ð´ÐµÑÑŒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¸Ð·Ð±ÐµÐ¶Ð°Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼ Ñ Ð¿Ð¾Ñ€ÑÐ´ÐºÐ¾Ð¼ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸
    }

    /**
     * Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¼Ð¾Ð´ÑƒÐ»Ñ Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¾Ð¹ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸
     * @param {string} moduleName - Ð˜Ð¼Ñ Ð¼Ð¾Ð´ÑƒÐ»Ñ Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¸
     * @param {Function} initializer - Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ
     * @returns {Object|null} Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð¼Ð¾Ð´ÑƒÐ»ÑŒ Ð¸Ð»Ð¸ null
     */
    initializeOptionalModule(moduleName, initializer) {
        try {
            if (typeof window !== 'undefined' && window[moduleName]) {
                return initializer();
            }
            debugLog(`ÐœÐ¾Ð´ÑƒÐ»ÑŒ ${moduleName} Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ fallback`);
            return null;
        } catch (error) {
            debugWarn(`ÐžÑˆÐ¸Ð±ÐºÐ° Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ ${moduleName}:`, error);
            return null;
        }
    }

    /**
     * ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ñ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹
     * @returns {Object} Ð ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¸ Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹
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
     * Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ… ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ²
     * @param {Object} data - Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð´Ð»Ñ Ð²Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ð¸
     * @returns {boolean} true ÐµÑÐ»Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð²Ð°Ð»Ð¸Ð´Ð½Ñ‹
     */
    validateScenariosData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ Ð¼Ð°ÑÑÐ¸Ð²Ð° scenarios
        if (!data.scenarios || !Array.isArray(data.scenarios) || data.scenarios.length === 0) {
            return false;
        }

        // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ dimensions
        if (!data.dimensions || typeof data.dimensions !== 'object') {
            return false;
        }

        // Ð’Ð°Ð»Ð¸Ð´Ð¸Ñ€ÑƒÐµÐ¼ ÐºÐ°Ð¶Ð´Ñ‹Ð¹ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¹
        for (const scenario of data.scenarios) {
            if (!scenario.id || typeof scenario.id !== 'number') {
                return false;
            }

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ title (Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð¾Ð±ÑŠÐµÐºÑ‚Ð¾Ð¼ Ñ Ð¿ÐµÑ€ÐµÐ²Ð¾Ð´Ð°Ð¼Ð¸ Ð¸Ð»Ð¸ ÑÑ‚Ñ€Ð¾ÐºÐ¾Ð¹)
            if (!scenario.title || (typeof scenario.title !== 'string' && typeof scenario.title !== 'object')) {
                return false;
            }

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ description
            if (!scenario.description || (typeof scenario.description !== 'string' && typeof scenario.description !== 'object')) {
                return false;
            }

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ Ñ…Ð¾Ñ‚Ñ Ð±Ñ‹ Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ð° (optionA, optionB, optionC Ð¸Ð»Ð¸ optionD)
            const hasOption = scenario.optionA || scenario.optionB || scenario.optionC || scenario.optionD;
            if (!hasOption) {
                return false;
            }

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ð¾Ð²
            ['optionA', 'optionB', 'optionC', 'optionD'].forEach(optKey => {
                if (scenario[optKey]) {
                    const option = scenario[optKey];
                    // Ð”Ð¾Ð»Ð¶ÐµÐ½ Ð±Ñ‹Ñ‚ÑŒ text (ÑÑ‚Ñ€Ð¾ÐºÐ° Ð¸Ð»Ð¸ Ð¾Ð±ÑŠÐµÐºÑ‚ Ñ Ð¿ÐµÑ€ÐµÐ²Ð¾Ð´Ð°Ð¼Ð¸)
                    if (!option.text || (typeof option.text !== 'string' && typeof option.text !== 'object')) {
                        return false;
                    }
                    // Ð”Ð¾Ð»Ð¶Ð½Ñ‹ Ð±Ñ‹Ñ‚ÑŒ weights (Ð¾Ð±ÑŠÐµÐºÑ‚)
                    if (!option.weights || typeof option.weights !== 'object') {
                        return false;
                    }
                }
            });
        }

        return true;
    }

    /**
     * ÐžÐ¶Ð¸Ð´Ð°Ð½Ð¸Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ SCENARIOS_DATA Ñ‡ÐµÑ€ÐµÐ· Promise
     * @param {number} timeout - ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð²Ñ€ÐµÐ¼Ñ Ð¾Ð¶Ð¸Ð´Ð°Ð½Ð¸Ñ Ð² Ð¼Ñ
     * @returns {Promise<Object>} Ð”Ð°Ð½Ð½Ñ‹Ðµ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ²
     */
    waitForScenariosData(timeout = 2000) {
        return new Promise((resolve, reject) => {
            // Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð´Ð»Ñ Ð¿Ð¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ…
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

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ ÑÑ€Ð°Ð·Ñƒ
            const immediateData = getBuiltInData();
            if (immediateData && immediateData.scenarios && immediateData.scenarios.length > 0) {
                debugLog('SCENARIOS_DATA Ð±Ñ–Ñ€Ð´ÐµÐ½ Ò›Ð¾Ð»Ð¶ÐµÑ‚Ñ–Ð¼Ð´Ñ– (SCENARIOS_DATA available immediately)');
                return resolve(immediateData);
            }

            // Ð•ÑÐ»Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð½Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½Ñ‹, Ð¶Ð´Ñ‘Ð¼ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ñ‡ÐµÑ€ÐµÐ· Ð¸Ð½Ñ‚ÐµÑ€Ð²Ð°Ð»Ñ‹
            const startTime = Date.now();
            const checkInterval = 50; // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ ÐºÐ°Ð¶Ð´Ñ‹Ðµ 50ms
            const maxAttempts = Math.ceil(timeout / checkInterval);
            let attempts = 0;

            // ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚Ñ‡Ð¸Ðº ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ (ÐµÑÐ»Ð¸ ÐµÑÑ‚ÑŒ)
            const onDataLoaded = () => {
                const data = getBuiltInData();
                if (data && data.scenarios && data.scenarios.length > 0) {
                    debugLog('SCENARIOS_DATA Ð¾Ò›Ð¸Ò“Ð° Ð°Ñ€Ò›Ñ‹Ð»Ñ‹ Ð¶Ò¯ÐºÑ‚ÐµÐ»Ð´Ñ– (SCENARIOS_DATA loaded via event)');
                    cleanup();
                    resolve(data);
                }
            };

            // ÐŸÐ¾Ð´Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÐ¼ÑÑ Ð½Ð° ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ðµ, ÐµÑÐ»Ð¸ Ð¾Ð½Ð¾ ÐµÑÑ‚ÑŒ
            if (typeof window !== 'undefined') {
                window.addEventListener('scenarios-data-loaded', onDataLoaded);
            }

            // Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ¸
            const cleanup = () => {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('scenarios-data-loaded', onDataLoaded);
                }
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ñ‡ÐµÑ€ÐµÐ· Ð¸Ð½Ñ‚ÐµÑ€Ð²Ð°Ð»Ñ‹
            const intervalId = setInterval(() => {
                attempts++;
                const data = getBuiltInData();

                if (data && data.scenarios && data.scenarios.length > 0) {
                    debugLog(`SCENARIOS_DATA Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½ Ñ‡ÐµÑ€ÐµÐ· Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÑƒ (Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐ° ${attempts})`);
                    cleanup();
                    resolve(data);
                    return;
                }

                // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ timeout
                if (Date.now() - startTime >= timeout || attempts >= maxAttempts) {
                    cleanup();
                    const error = new Error('Ð’ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ² Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹. Ð£Ð±ÐµÐ´Ð¸Ñ‚ÐµÑÑŒ, Ñ‡Ñ‚Ð¾ scenarios-data.js Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½ Ð¿Ñ€Ð°Ð²Ð¸Ð»ÑŒÐ½Ð¾.');
                    criticalError('ÐœÐÒ¢Ð«Ð—Ð”Ð« ÒšÐÐ¢Ð•: ÐšÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€ Ò›Ð¾Ð»Ð¶ÐµÑ‚Ñ–Ð¼ÑÑ–Ð· (CRITICAL ERROR: Embedded data unavailable)');
                    criticalError('SCENARIOS_DATA:', typeof SCENARIOS_DATA);
                    criticalError('window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'N/A');
                    reject(error);
                }
            }, checkInterval);
        });
    }

    /**
     * ÐŸÐ¾ÐºÐ°Ð· Ð¾ÑˆÐ¸Ð±ÐºÐ¸ Ð¾Ñ‚ÑÑƒÑ‚ÑÑ‚Ð²Ð¸Ñ Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹
     * @param {Array} missing - ÐœÐ°ÑÑÐ¸Ð² Ð¾Ñ‚ÑÑƒÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ñ… Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹
     */
    /**
     * ÐŸÐ¾ÐºÐ°Ð· Ð¾ÑˆÐ¸Ð±ÐºÐ¸ Ð¾Ñ‚ÑÑƒÑ‚ÑÑ‚Ð²Ð¸Ñ Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹
     * @param {Array} missing - ÐœÐ°ÑÑÐ¸Ð² Ð¾Ñ‚ÑÑƒÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ñ… Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹
     */
    showDependencyError(missing) {
        if (this.ui) {
            this.ui.showDependencyError(missing);
        }
    }

    /**
     * Ð’Ñ‹Ñ…Ð¾Ð´ Ð¸Ð· ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹
     */
    logout() {
        if (this.auth) {
            this.auth.logout();
            // Ð¡Ð±Ñ€Ð°ÑÑ‹Ð²Ð°ÐµÐ¼ ÑÐ¾ÑÑ‚Ð¾ÑÐ½Ð¸Ðµ
            this.state = 'intro';
            this.currentUser = null;

            // ÐžÑ‡Ð¸Ñ‰Ð°ÐµÐ¼ UI ÐµÑÐ»Ð¸ Ð½ÑƒÐ¶Ð½Ð¾ Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ¶Ð°ÐµÐ¼
            window.location.reload();
        }
    }

    /**
     * Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ
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
                    criticalError('ÐœÐÒ¢Ð«Ð—Ð”Ð« Ð¢Ó˜Ð£Ð•Ð›Ð”Ð†Ð›Ð†ÐšÐ¢Ð•Ð  Ð–ÐžÒš (CRITICAL DEPENDENCIES MISSING):', critical);
                    this.showDependencyError(critical);
                    return;
                    debugWarn('Three.js check skipped.');
                    // 3D features removed
                }
            }

            let data = null;

            // Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Promise-based Ð¿Ð¾Ð´Ñ…Ð¾Ð´ Ð´Ð»Ñ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ Ð´Ð°Ð½Ð½Ñ‹Ñ…
            try {
                data = await this.waitForScenariosData(2000);
                debugLog('Ð¡Ñ†ÐµÐ½Ð°Ñ€Ð¸Ð¹Ð»ÐµÑ€Ð´Ñ–Ò£ ÐºÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ– ÑÓ™Ñ‚Ñ‚Ñ– Ð¶Ò¯ÐºÑ‚ÐµÐ»Ð´Ñ– (Embedded scenario data loaded successfully)');
            } catch (error) {
                // Ð•ÑÐ»Ð¸ Promise-based Ð¿Ð¾Ð´Ñ…Ð¾Ð´ Ð½Ðµ ÑÑ€Ð°Ð±Ð¾Ñ‚Ð°Ð», Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½ÑŽÑŽ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÑƒ
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
                    debugLog('Ð¡Ð¾Ò£Ò“Ñ‹ Ó™Ñ€ÐµÐºÐµÑ‚Ñ‚Ðµ ÐºÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€ Ñ‚Ð°Ð±Ñ‹Ð»Ð´Ñ‹ (Embedded data found on last attempt)');
                } else {
                    throw error; // ÐŸÑ€Ð¾Ð±Ñ€Ð°ÑÑ‹Ð²Ð°ÐµÐ¼ Ð¾ÑˆÐ¸Ð±ÐºÑƒ Ð´Ð°Ð»ÑŒÑˆÐµ
                }
            }

            // Ð•ÑÐ»Ð¸ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ñ‹, ÑÑ‚Ð¾ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¾ÑˆÐ¸Ð±ÐºÐ°
            if (!data || !data.scenarios || !Array.isArray(data.scenarios) || data.scenarios.length === 0) {
                criticalError('ÐœÐÒ¢Ð«Ð—Ð”Ð« ÒšÐÐ¢Ð•: ÐšÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€ Ò›Ð¾Ð»Ð¶ÐµÑ‚Ñ–Ð¼ÑÑ–Ð· (CRITICAL ERROR: Embedded data unavailable)');
                criticalError('SCENARIOS_DATA:', typeof SCENARIOS_DATA);
                criticalError('window.SCENARIOS_DATA:', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'N/A');
                throw new Error(this.i18n.t('scenarioDataMissing') || 'Scenario data is unavailable. Make sure scenarios-data.js is loaded correctly.');
            }

            // Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…
            if (!this.validateScenariosData(data)) {
                criticalError('ÐœÐÒ¢Ð«Ð—Ð”Ð« ÒšÐÐ¢Ð•: Ð¡Ñ†ÐµÐ½Ð°Ñ€Ð¸Ð¹ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ–Ð½Ñ–Ò£ Ò›Ò±Ñ€Ñ‹Ð»Ñ‹Ð¼Ñ‹ Ð¶Ð°Ñ€Ð°Ð¼ÑÑ‹Ð· (CRITICAL ERROR: Invalid scenario data structure)');
                throw new Error(this.i18n.t('scenarioDataInvalid') || 'Scenario data structure is invalid. Check scenarios-data.js or scenarios.json.');
            }

            // ÐžÐ¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾: Ð¿Ñ‹Ñ‚Ð°ÐµÐ¼ÑÑ Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ð¸Ð· Ñ„Ð°Ð¹Ð»Ð° Ð´Ð»Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ (Ð½Ð¾ Ð½Ðµ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¾)
            const isFileProtocol = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
            if (!isFileProtocol) {
                try {
                    const response = await fetch('data/scenarios.json');
                    if (response.ok) {
                        const jsonData = await response.json();
                        // Ð’Ð°Ð»Ð¸Ð´Ð¸Ñ€ÑƒÐµÐ¼ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¸Ð· Ñ„Ð°Ð¹Ð»Ð° Ð¿ÐµÑ€ÐµÐ´ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ð½Ð¸ÐµÐ¼
                        if (this.validateScenariosData(jsonData)) {
                            // Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð¸Ð· Ñ„Ð°Ð¹Ð»Ð°, ÐµÑÐ»Ð¸ Ð¾Ð½Ð¸ Ð²Ð°Ð»Ð¸Ð´Ð½Ñ‹
                            data = jsonData;
                            debugLog('Ð”ÐµÑ€ÐµÐºÑ‚ÐµÑ€ scenarios.json Ñ„Ð°Ð¹Ð»Ñ‹Ð½Ð°Ð½ Ð¶Ð°Ò£Ð°Ñ€Ñ‚Ñ‹Ð»Ð´Ñ‹ (Data updated from scenarios.json)');
                        } else {
                            debugWarn('scenarios.json Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ– Ð¶Ð°Ñ€Ð°Ð¼ÑÑ‹Ð·, ÐºÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€ Ò›Ð¾Ð»Ð´Ð°Ð½Ñ‹Ð»ÑƒÐ´Ð° (Data from scenarios.json is invalid, using embedded data)');
                        }
                    }
                } catch (fetchError) {
                    // ÐÐµ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¾ - Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ
                    debugLog('scenarios.json Ð¶Ò¯ÐºÑ‚ÐµÑƒ Ð¼Ò¯Ð¼ÐºÑ–Ð½ Ð±Ð¾Ð»Ð¼Ð°Ð´Ñ‹, ÐºÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€ Ò›Ð¾Ð»Ð´Ð°Ð½Ñ‹Ð»ÑƒÐ´Ð° (Failed to load scenarios.json, using embedded data)');
                }
            }

            this.scenarios = data.scenarios;
            this.dimensions = data.dimensions;

            // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ð°
            this.analyzer = new PersonalityAnalyzer(data);

            // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð´Ð¸Ð½Ð°Ð¼Ð¸Ñ‡ÐµÑÐºÐ¾Ð³Ð¾ ÑÐµÐ»ÐµÐºÑ‚Ð¾Ñ€Ð° ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ²
            this.dynamicSelector = new DynamicScenarioSelector(data.scenarios);

            // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð²Ð¸Ð·ÑƒÐ°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ð°
            this.visualizer = new ResultsVisualizer('radarChartContainer');



            // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ ÑÐµÑ€Ð²Ð¸ÑÐ° Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸
            // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ ÑÐµÑ€Ð²Ð¸ÑÐ° Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸
            if (typeof FeedbackService !== 'undefined') {
                this.feedbackService = new FeedbackService(this.i18n, this.auth, this.analyzer, this.ui);
            } else {
                console.warn('FeedbackService Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½. Ð¤ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸ Ð±ÑƒÐ´ÑƒÑ‚ Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹.');
            }

            // ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ¾Ñ…Ñ€Ð°Ð½Ñ‘Ð½Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ°
            this.checkSavedProgress();

            // Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ UI ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð¾Ð² (Ð¿Ð¾ÑÐ»Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ DOM)
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
            criticalError('Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ò›Ð°Ñ‚ÐµÑÑ– (Initialization error):', error);
            const errorMessage = error.message || this.i18n.t('unknownError') || 'Unknown error';
            criticalError('ÒšÐ°Ñ‚Ðµ Ð¼Ó™Ð»Ñ–Ð¼ÐµÑ‚Ñ‚ÐµÑ€Ñ– (Error details):', errorMessage);

            // Ð”Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð°Ñ Ð´Ð¸Ð°Ð³Ð½Ð¾ÑÑ‚Ð¸ÐºÐ°
            debugLog('SCENARIOS_DATA Ò›Ð¾Ð»Ð¶ÐµÑ‚Ñ–Ð¼Ð´Ñ–Ð»Ñ–Ð³Ñ–Ð½ Ñ‚ÐµÐºÑÐµÑ€Ñƒ (Checking SCENARIOS_DATA availability):', typeof SCENARIOS_DATA);
            debugLog('window.SCENARIOS_DATA Ò›Ð¾Ð»Ð¶ÐµÑ‚Ñ–Ð¼Ð´Ñ–Ð»Ñ–Ð³Ñ–Ð½ Ñ‚ÐµÐºÑÐµÑ€Ñƒ (Checking window.SCENARIOS_DATA availability):', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'window unavailable');

            // ÐŸÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐ° Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð½Ð°Ð¿Ñ€ÑÐ¼ÑƒÑŽ
            if (typeof SCENARIOS_DATA !== 'undefined' && SCENARIOS_DATA && SCENARIOS_DATA.scenarios) {
                debugLog('SCENARIOS_DATA Ð´ÐµÑ€ÐµÐ³Ñ–Ð½ Ñ‚Ñ–ÐºÐµÐ»ÐµÐ¹ Ò›Ð¾Ð»Ð´Ð°Ð½Ñƒ Ó™Ñ€ÐµÐºÐµÑ‚Ñ– (Trying to use SCENARIOS_DATA directly)...');
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
                    criticalError('Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ò›Ð°Ñ‚ÐµÑÑ– (Initialization error):', error);
                    const errorMessage = error.message || this.i18n.t('unknownError') || 'Unknown error';
                    criticalError('ÒšÐ°Ñ‚Ðµ Ð¼Ó™Ð»Ñ–Ð¼ÐµÑ‚Ñ‚ÐµÑ€Ñ– (Error details):', errorMessage);
                    this.showError(errorMessage);
                }
            }

            // Restore general error handling if recovery failed
            this.showError(this.i18n.t('appDataErrorDescription') || 'Failed to load scenario data. Make sure scenarios-data.js is loaded.');
        }
    }

    /**
     * ÐŸÐ»Ð°Ð²Ð½Ð¾Ðµ ÑÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¾Ñ‡Ð½Ð¾Ð³Ð¾ ÑÐºÑ€Ð°Ð½Ð°
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
     * ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° ÑÐ¾Ñ…Ñ€Ð°Ð½Ñ‘Ð½Ð½Ð¾Ð³Ð¾ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ°
     */
    checkSavedProgress() {
        const savedProgress = this.storage.loadProgress();
        if (savedProgress && savedProgress.choices) {
            const choices = Array.isArray(savedProgress.choices) ? savedProgress.choices : [];

            // Ð•ÑÐ»Ð¸ Ñ‚ÐµÑÑ‚ ÑƒÐ¶Ðµ Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½ (ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¾Ñ‚Ð²ÐµÑ‚Ð¾Ð² >= ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ñƒ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸ÐµÐ²),
            // Ñ‚Ð¾ Ð½Ðµ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ ÐµÐ³Ð¾ ÐºÐ°Ðº Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ð¹, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¸Ð·Ð±ÐµÐ¶Ð°Ñ‚ÑŒ Ð´ÑƒÐ±Ð»Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð² Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸
            if (this.scenarios && choices.length >= this.scenarios.length) {
                this.storage.clearAll(); // Ð˜Ð»Ð¸ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑ: localStorage.removeItem('testProgress');
                this.currentScenarioIndex = 0;
                return;
            }

            // Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ° Ð´Ð»Ñ Ð±Ð°Ð·Ð¾Ð²Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
            // Check if testMode is explicitly 'basic' OR it's missing and the data looks basic (array of choices)
            // AND it doesn't look like advanced (no scales/situational keys)
            const isAdvancedData = !Array.isArray(choices) && (choices.scales || choices.situational || choices.open);

            if ((savedProgress.testMode === 'basic' || !savedProgress.testMode) && !isAdvancedData && savedProgress.testMode !== 'cognitive' && savedProgress.mode !== 'cognitive') {
                this.testMode = 'basic';
                if (this.testManager) this.testManager.testMode = 'basic';

                choices.forEach(choice => {
                    this.analyzer.recordChoice(choice.scenarioId, choice.choice);

                    // Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ Ð·Ð°Ð²ÐµÑ€ÑˆÑ‘Ð½Ð½Ñ‹Ðµ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¸
                    const scenario = this.scenarios.find(s => s.id === choice.scenarioId);
                    if (scenario && !this.completedScenarios.find(s => s.id === choice.scenarioId)) {
                        this.completedScenarios.push(scenario);
                    }
                });
                this.currentScenarioIndex = savedProgress.currentQuestionIndex || choices.length;
            }
            // Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ° Ð´Ð»Ñ Ñ€Ð°ÑÑˆÐ¸Ñ€ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
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
                        console.log('checkSavedProgress Ñ–ÑˆÑ–Ð½Ð´Ðµ ÐºÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ñ€ÐµÐ¶Ð¸Ð¼ Ð°Ð½Ñ‹Ò›Ñ‚Ð°Ð»Ð´Ñ‹ (Detected advanced mode in checkSavedProgress)');
                    }
                }

                // Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ Ð´Ñ€ÑƒÐ³Ð¸Ðµ Ñ‚Ð¸Ð¿Ñ‹ Ð¾Ñ‚Ð²ÐµÑ‚Ð¾Ð² Ñ€Ð°ÑÑˆÐ¸Ñ€ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
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
                console.log('âœ… Cognitive test progress detected');
            }
        }
    }

    /**
     * Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ UI ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð¾Ð² (ÑÐ·Ñ‹Ðº, Ñ‚ÐµÐ¼Ð°)
     */
    initUI() {
        if (this.ui) {
            this.ui.init();
        }
    }

    /**
     * ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° (Ñ debounce Ð´Ð»Ñ Ð¿Ñ€ÐµÐ´Ð¾Ñ‚Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ñ Ñ‡Ð°ÑÑ‚Ñ‹Ñ… Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ð¹)
     */
    updateHeader() {
        if (this.ui) {
            this.ui.updateHeader();
        }
    }

    /**
     * Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÐµÐ»Ñ ÑÐ·Ñ‹ÐºÐ°
     */
    initLanguageSelector() {
        if (this.ui) {
            this.ui.initLanguageSelector();
        }
    }

    /**
     * ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ðµ Ð¼ÐµÐ½ÑŽ ÑÐ·Ñ‹ÐºÐ°
     */
    toggleLanguageMenu(event) {
        if (this.ui) {
            this.ui.toggleLanguageMenu(event);
        }
    }

    /**
     * Ð¡Ð¼ÐµÐ½Ð° ÑÐ·Ñ‹ÐºÐ°
     * @param {string} langCode - ÐšÐ¾Ð´ ÑÐ·Ñ‹ÐºÐ°
     */
    changeLanguage(langCode) {
        if (this.ui) {
            this.ui.changeLanguage(langCode);
        }
    }

    /**
     * Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÐµÐ»Ñ Ñ‚ÐµÐ¼Ñ‹
     */
    initThemeToggle() {
        if (this.ui) {
            this.ui.initThemeToggle();
        }
    }

    /**
     * Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Ñ‚ÐµÐ¼Ñ‹
     * @param {string} theme - 'light' Ð¸Ð»Ð¸ 'dark'
     */
    setTheme(theme) {
        if (this.ui) {
            this.ui.setTheme(theme);
        }
    }

    /**
     * ÐŸÑ€Ð¸Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÐ¾Ñ…Ñ€Ð°Ð½Ñ‘Ð½Ð½Ð¾Ð¹ Ñ‚ÐµÐ¼Ñ‹
     */
    applyTheme() {
        if (this.ui) {
            this.ui.applyTheme();
        }
    }

    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ ÑÐºÑ€Ð°Ð½Ð° Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸
     */
    showAuth() {
        if (this.ui) {
            this.ui.showAuth();
        }
    }



    /**
     * Ð¤Ð¾Ñ€Ð¼Ð° Ð²Ñ…Ð¾Ð´Ð°
     */


    /**
     * ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ñ„Ð¾Ñ€Ð¼Ñƒ Ð²Ñ…Ð¾Ð´Ð°
     * @param {Event} e - Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ ÐºÐ»Ð¸ÐºÐ° (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
     */
    showLoginForm(e) {
        if (this.ui) {
            this.ui.showLoginForm(e);
        }
    }

    /**
     * ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ñ„Ð¾Ñ€Ð¼Ñƒ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸
     * @param {Event} e - Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ ÐºÐ»Ð¸ÐºÐ° (Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾)
     */
    showRegisterForm(e) {
        if (this.ui) {
            this.ui.showRegisterForm(e);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð²Ñ…Ð¾Ð´Ð°
     */
    handleLogin(event) {
        if (this.ui) {
            this.ui.handleLogin(event);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸
     */
    handleRegister(event) {
        if (this.ui) {
            this.ui.handleRegister(event);
        }
    }

    /**
     * ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÑŒ ÐºÐ°Ðº Ð³Ð¾ÑÑ‚ÑŒ
     */
    continueAsGuest() {
        if (this.ui) {
            this.ui.continueAsGuest();
        }
    }

    /**
     * ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð¾ÑˆÐ¸Ð±ÐºÑƒ Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸
     */
    showAuthError(message) {
        if (this.ui) {
            this.ui.showAuthError(message);
        }
    }

    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ð²Ð²Ð¾Ð´Ð½Ð¾Ð³Ð¾ ÑÐºÑ€Ð°Ð½Ð°
     */
    showIntro() {
        this.state = 'intro';
        if (this.ui) {
            this.ui.showIntro();
        }
    }


    /**
     * ÐŸÐ¾ÐºÐ°Ð· ÑÐºÑ€Ð°Ð½Ð° Ð²Ñ‹Ð±Ð¾Ñ€Ð° Ñ‚Ð¸Ð¿Ð° Ñ‚ÐµÑÑ‚Ð°
     */
    showTestTypeSelection() {
        if (this.ui) {
            this.ui.showTestTypeSelection();
        }
    }


    /**
     * Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ° Ð´Ð°Ð½Ð½Ñ‹Ñ… ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
     */
    async loadAdvancedScenarios() {
        try {
            let data = null;

            // Ð¡Ð½Ð°Ñ‡Ð°Ð»Ð° Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ (Ð´Ð»Ñ file:// Ð¿Ñ€Ð¾Ñ‚Ð¾ÐºÐ¾Ð»Ð°)
            if (typeof ADVANCED_SCENARIOS_DATA !== 'undefined' && ADVANCED_SCENARIOS_DATA && ADVANCED_SCENARIOS_DATA.questions) {
                debugLog('ÐšÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ñ‚ÐµÑÑ‚Ñ‚Ñ–Ò£ ÐºÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ–Ð½ Ò›Ð¾Ð»Ð´Ð°Ð½Ñƒ (Using embedded advanced test data): ADVANCED_SCENARIOS_DATA');
                data = ADVANCED_SCENARIOS_DATA;
            } else if (typeof window !== 'undefined' && window.ADVANCED_SCENARIOS_DATA && window.ADVANCED_SCENARIOS_DATA.questions) {
                debugLog('ÐšÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ñ‚ÐµÑÑ‚Ñ‚Ñ–Ò£ ÐºÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ–Ð½ Ò›Ð¾Ð»Ð´Ð°Ð½Ñƒ (Using embedded advanced test data): window.ADVANCED_SCENARIOS_DATA');
                data = window.ADVANCED_SCENARIOS_DATA;
            } else {
                // ÐŸÑ€Ð¾Ð±ÑƒÐµÐ¼ Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ñ‡ÐµÑ€ÐµÐ· fetch (Ð´Ð»Ñ HTTP/HTTPS)
                debugLog('ÐšÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ñ‚ÐµÑÑ‚ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ–Ð½ fetch Ð°Ñ€Ò›Ñ‹Ð»Ñ‹ Ð¶Ò¯ÐºÑ‚ÐµÑƒÐ³Ðµ Ñ‚Ñ‹Ñ€Ñ‹ÑÑƒÐ´Ð° (Trying to load advanced test data via fetch)...');
                try {
                    const response = await fetch('data/advanced-scenarios.json');
                    if (!response.ok) {
                        throw new Error(`${this.i18n.t('failedToLoadAdvancedTestData') || 'Failed to load advanced test data'}: ${response.status} ${response.statusText}`);
                    }
                    data = await response.json();
                } catch (fetchError) {
                    criticalError('Fetch ÑÓ™Ñ‚ÑÑ–Ð· Ð°ÑÒ›Ñ‚Ð°Ð»Ð´Ñ‹ (Ð¼Ò¯Ð¼ÐºÑ–Ð½ file:// Ñ…Ð°Ñ‚Ñ‚Ð°Ð¼Ð°ÑÑ‹) (Fetch failed, possibly file:// protocol):', fetchError.message);
                    throw new Error(this.i18n.t('advancedTestDataMissing') || 'Advanced test data was not found. Make sure advanced-scenarios-data.js is loaded.');
                }
            }

            // Ð’Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ Ð´Ð°Ð½Ð½Ñ‹Ñ…
            if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
                throw new Error(this.i18n.t('advancedTestInvalidQuestions') || 'Invalid advanced test data structure: questions array is missing.');
            }

            if (!data.dimensions || typeof data.dimensions !== 'object') {
                throw new Error(this.i18n.t('advancedTestMissingDimensions') || 'Advanced test data is missing dimension definitions.');
            }

            this.advancedQuestions = data.questions;
            return data;
        } catch (error) {
            criticalError('ÐšÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ñ‚ÐµÑÑ‚ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€Ñ–Ð½ Ð¶Ò¯ÐºÑ‚ÐµÑƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error loading advanced test data):', error);
            // ÐŸÑ€Ð¾Ð±Ñ€Ð°ÑÑ‹Ð²Ð°ÐµÐ¼ Ð¾ÑˆÐ¸Ð±ÐºÑƒ Ð´Ð°Ð»ÑŒÑˆÐµ Ð´Ð»Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸ Ð² Ð²Ñ‹Ð·Ñ‹Ð²Ð°ÑŽÑ‰ÐµÐ¼ ÐºÐ¾Ð´Ðµ
            throw error;
        }
    }

    /**
     * ÐÐ°Ñ‡Ð°Ð»Ð¾ Ð±Ð°Ð·Ð¾Ð²Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
     */
    /**
     * ÐÐ°Ñ‡Ð°Ð»Ð¾ Ð±Ð°Ð·Ð¾Ð²Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
     */
    startBasicTest() {
        if (this.testManager) {
            this.testManager.startBasicTest();
        }
    }

    /**
     * ÐÐ°Ñ‡Ð°Ð»Ð¾ ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
     */
    /**
     * ÐÐ°Ñ‡Ð°Ð»Ð¾ ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
     */
    async startAdvancedTest() {
        if (this.testManager) {
            this.testManager.startAdvancedTest();
        }
    }





    /**
     * ÐÐ°Ñ‡Ð°Ð»Ð¾ Ñ‚ÐµÑÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ
     * @param {string} mode - Ð¢Ð¸Ð¿ Ñ‚ÐµÑÑ‚Ð°: 'basic', 'advanced', Ð¸Ð»Ð¸ 'cognitive'
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
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑƒÑ‰ÐµÐ³Ð¾ Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ° (Ð´Ð»Ñ ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°)
     */
    showQuestion() {
        if (!this.advancedQuestions || this.advancedQuestions.length === 0) {
            criticalError('ÐšÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ñ‚ÐµÑÑ‚ ÑÒ±Ñ€Ð°Ò›Ñ‚Ð°Ñ€Ñ‹ Ð¶Ò¯ÐºÑ‚ÐµÐ»Ð³ÐµÐ½ Ð¶Ð¾Ò› (Advanced test questions not loaded)');
            this.showTestTypeSelection();
            return;
        }

        // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼, Ð²ÑÐµ Ð»Ð¸ Ð²Ð¾Ð¿Ñ€Ð¾ÑÑ‹ Ð¿Ñ€Ð¾Ð¹Ð´ÐµÐ½Ñ‹
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

        // ÐžÐ¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÐ¼ Ñ‚Ð¸Ð¿ Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ° Ð¸ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ð¹ Ð¸Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹Ñ
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
            criticalError('Ð¡Ò±Ñ€Ð°Ò›Ñ‚Ñ‹Ò£ Ð±ÐµÐ»Ð³Ñ–ÑÑ–Ð· Ñ‚Ò¯Ñ€Ñ– (Unknown question type):', question.type);
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
     * ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¸Ðµ Ñ‚ÐµÑÑ‚Ð°
     */
    continueTest() {
        if (this.testManager) {
            // Restore saved progress
            const savedProgress = this.storage.loadProgress();
            if (savedProgress && savedProgress.choices) {
                // Check if this is cognitive test
                if (savedProgress.testMode === 'cognitive' || (savedProgress.mode === 'cognitive')) {
                    console.log('ðŸ§  Cognitive test progress found, restoring via TestManager...');
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
                        console.log('ðŸ”„ Extracted test mode: advanced (inferred)');
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
                                console.log('âœ… Ð–Ð°Ð»Ò“Ð°ÑÑ‚Ñ‹Ñ€Ñƒ Ò¯ÑˆÑ–Ð½ ÐºÐµÒ£ÐµÐ¹Ñ‚Ñ–Ð»Ð³ÐµÐ½ Ð°Ð½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÑÐ»Ð°Ð½Ð´Ñ‹ (âœ… Advanced Analyzer initialized for continuation)');
                            }

                            // Restore question index
                            const restoredIndex = savedProgress.currentQuestionIndex || 0;
                            this.testManager.currentQuestionIndex = restoredIndex;
                            console.log('ðŸ“ â„–', restoredIndex + 1, 'ÑÒ±Ñ€Ð°Ò›Ñ‚Ð°Ð½ Ð¶Ð°Ð»Ò“Ð°ÑÑ‚Ñ‹Ñ€Ð°Ð¼Ñ‹Ð· (ðŸ“ Continuing from question No.)');

                            // Debug Info
                            // alert(`DEBUG: Ð¢ÐµÑÑ‚ ${testMode}, Ð’Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½ Ð¸Ð½Ð´ÐµÐºÑ: ${restoredIndex}, ÐžÑ‚Ð²ÐµÑ‚Ñ‹: ${JSON.stringify(savedProgress.choices ? Object.keys(savedProgress.choices) : 'Ð½ÐµÑ‚')}`);

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
                        console.log('âœ… Basic Analyzer initialized for continuation');
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
     * ÐÐ°Ñ‡Ð°Ñ‚ÑŒ Ð½Ð¾Ð²Ñ‹Ð¹ Ñ‚ÐµÑÑ‚ (Ð¾Ñ‡Ð¸ÑÑ‚Ð¸Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑ)
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
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð²Ñ‹Ð±Ð¾Ñ€Ð° Ð² ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¸ (Ð´Ð»Ñ Basic)
     */
    handleScenarioOption(choice, scenarioId) {
        if (this.testManager) {
            this.testManager.recordBasicAnswer(choice, scenarioId);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾Ñ‚Ð²ÐµÑ‚Ð° Ð½Ð° ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¹ (Ð´Ð»Ñ Advanced)
     */
    handleAdvancedAnswer(choice, questionId) {
        if (this.testManager) {
            this.testManager.recordAdvancedAnswer(choice, questionId);
        }
    }


    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²
     */
    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²
     */
    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²
     * @param {Object} [existingResults] - Ð¡ÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÑŽÑ‰Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ (Ð´Ð»Ñ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸)
     */
    showResults(results = null) {
        this.state = 'results';
        if (this.resultsManager && this.ui) {
            // Ð•ÑÐ»Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð°Ð½Ñ‹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð¸Ñ…, Ð¸Ð½Ð°Ñ‡Ðµ Ð³ÐµÐ½ÐµÑ€Ð¸Ñ€ÑƒÐµÐ¼ Ð½Ð¾Ð²Ñ‹Ðµ
            this.activeResults = results || this.resultsManager.generateResults();
            this.ui.showResults(this.activeResults);
        }
    }

    /**
     * Ð¡ÐºÐ°Ñ‡Ð¸Ð²Ð°Ð½Ð¸Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð²
     */
    downloadResults(format = 'html') {
        let isCognitive = this.testMode === 'cognitive';
        if (this.activeResults) {
            if (this.activeResults.scores || this.activeResults.profile) {
                isCognitive = false;
            } else if (this.activeResults.breakdown || this.activeResults.dominant) {
                isCognitive = true;
            }
        }
        
        if (isCognitive && this.resultsManager) {
            const results = this.activeResults || (this.storage ? this.storage.loadCognitiveResults() : null);
            return this.resultsManager.downloadCognitiveResults(results);
        }
        if (this.resultsManager) {
            this.resultsManager.downloadResults(format);
        }
    }

    /**
     * ÐŸÐ¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÑŒ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
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
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð°Ð²Ð°Ñ‚Ð°Ñ€Ð° Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {Object} user - ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ
     * @returns {string} HTML Ð°Ð²Ð°Ñ‚Ð°Ñ€Ð°
     */
    getUserAvatar(user) {
        if (!user) return '?';

        if (user.avatar && user.avatar.type === 'emoji') {
            return `<span style="font-size: 2.5rem;">${user.avatar.value}</span>`;
        } else if (user.avatar && user.avatar.type === 'color') {
            return '';
        }

        // ÐŸÐ¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ - Ð¿ÐµÑ€Ð²Ð°Ñ Ð±ÑƒÐºÐ²Ð° Ð¸Ð¼ÐµÐ½Ð¸
        const letter = user.username.charAt(0).toUpperCase();
        return `<span style="font-size: 2rem; color: white;">${letter}</span>`;
    }

    /**
     * Ð ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð°Ð²Ð°Ñ‚Ð°Ñ€Ð°
     */
    editAvatar() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const t = this.i18n.t.bind(this.i18n);
        const emojis = ['ðŸ˜Š', 'ðŸŽ¯', 'ðŸš€', 'ðŸ’¡', 'ðŸŒŸ', 'âš¡', 'ðŸŽ¨', 'ðŸ”¬', 'ðŸ“Š', 'ðŸ’¼', 'ðŸŽ“', 'ðŸ†'];
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

        // Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¿Ñ€Ð¸ ÐºÐ»Ð¸ÐºÐµ Ð²Ð½Ðµ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° Ð°Ð²Ð°Ñ‚Ð°Ñ€Ð°
     */
    setAvatar(type, value) {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        user.avatar = { type, value };
        this.auth.updateUser(user);

        // Ð—Ð°ÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¾ÐºÐ½Ð¾
        this.closeModal();

        // ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÑŒ Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»Ñ‘Ð½Ð½Ñ‹Ð¼ Ð°Ð²Ð°Ñ‚Ð°Ñ€Ð¾Ð¼
        setTimeout(() => {
            this.showProfile();
        }, 100);
    }

    /**
     * Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
     */
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Ð ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»Ñ
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

        // Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¿Ñ€Ð¸ ÐºÐ»Ð¸ÐºÐµ Ð²Ð½Ðµ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * Ð¡Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»Ñ
     */
    saveProfile(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const user = this.auth.getCurrentUser();
        if (!user) return;

        user.username = formData.get('username').trim();
        user.email = formData.get('email').trim();

        this.auth.updateUser(user);

        // Ð—Ð°ÐºÑ€Ñ‹Ð²Ð°ÐµÐ¼ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¾ÐºÐ½Ð¾
        this.closeModal();

        // ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ð¿Ñ€Ð¾Ñ„Ð¸Ð»ÑŒ Ñ Ð¾Ð±Ð½Ð¾Ð²Ð»Ñ‘Ð½Ð½Ñ‹Ð¼Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ð¼Ð¸
        setTimeout(() => {
            this.showProfile();
        }, 100);
    }

    /**
     * ÐŸÑ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½Ð¾Ð³Ð¾ Ñ‚ÐµÑÑ‚Ð°
     */
    viewTestResults(index) {
        const history = this.auth.getTestHistory();
        if (index >= 0 && index < history.length) {
            const test = history[index];
            // ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ñ‹ Ð±ÐµÐ· Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð½Ð¾Ð³Ð¾ ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ñ
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

        const newTitle = prompt(t('enterTestName') || 'Enter test name:', currentTitle);

        if (newTitle && newTitle.trim() !== '') {
            if (this.storage.updateCognitiveTestTitle(newTitle.trim())) {
                if (this.toast) this.toast.show(t('testRenamed') || 'Test renamed', 'success');
                this.showProfile();
            }
        }
    }



    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ ÑÑ€Ð°Ð²Ð½ÐµÐ½Ð¸Ñ
     * @param {string} containerId - ID ÐºÐ¾Ð½Ñ‚ÐµÐ¹Ð½ÐµÑ€Ð°
     * @param {Object} scores - ÐžÑ†ÐµÐ½ÐºÐ¸ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ
     * @param {Object} profile - ÐŸÑ€Ð¾Ñ„Ð¸Ð»ÑŒ
     * @param {Object} aiAnalysis - AI-Ð°Ð½Ð°Ð»Ð¸Ð·
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
                        ${this.i18n.t('socialComparisonHint') || 'Take the test again to compare yourself with other users.'}
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
                        ${this.i18n.t('match') || 'Match'}: ${Math.round(userGroup.matchScore * 100)}%
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
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð²Ñ‹Ð±Ð¾Ñ€Ð° Ð¾Ð¿Ñ†Ð¸Ð¸ Ð² ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ð¸ (Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ð¹ Ñ‚ÐµÑÑ‚)
     * @param {string} choice - Ð’Ñ‹Ð±Ñ€Ð°Ð½Ð½Ð°Ñ Ð¾Ð¿Ñ†Ð¸Ñ (A, B, C, D)
     * @param {number} scenarioId - ID ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ñ
     */
    handleScenarioOption(choice, scenarioId) {
        if (this.testManager) {
            this.testManager.recordBasicAnswer(choice, scenarioId);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾Ñ‚Ð²ÐµÑ‚Ð° Ð½Ð° ÑƒÐ³Ð»ÑƒÐ±Ð»ÐµÐ½Ð½Ñ‹Ð¹ Ð²Ð¾Ð¿Ñ€Ð¾Ñ (Ð¢Ð¸Ð¿: Ð¡Ñ†ÐµÐ½Ð°Ñ€Ð¸Ð¹)
     * @param {string} choice - Ð’Ñ‹Ð±Ñ€Ð°Ð½Ð½Ð°Ñ Ð¾Ð¿Ñ†Ð¸Ñ
     * @param {number} questionId - ID Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ°
     */
    handleAdvancedAnswer(choice, questionId) {
        if (this.testManager) {
            this.testManager.recordAdvancedAnswer(choice, questionId);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾Ñ‚Ð²ÐµÑ‚Ð° Ð½Ð° ÑˆÐºÐ°Ð»Ð¸Ñ€ÑƒÐµÐ¼Ñ‹Ð¹ Ð²Ð¾Ð¿Ñ€Ð¾Ñ
     * @param {number} questionId - ID Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ°
     */
    handleScaleAnswer(questionId) {
        const input = document.getElementById(`scale-input-${questionId}`);
        if (input && this.testManager) {
            const value = parseInt(input.value);
            this.testManager.recordScaleAnswer(questionId, value);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¾Ð³Ð¾ Ð¾Ñ‚Ð²ÐµÑ‚Ð°
     * @param {number} questionId - ID Ð²Ð¾Ð¿Ñ€Ð¾ÑÐ°
     */
    handleOpenAnswer(questionId) {
        const textarea = document.getElementById(`open-answer-${questionId}`);
        if (textarea && this.testManager) {
            const text = textarea.value.trim();
            // Basic validation
            if (!text) {
                this.ui.showAlert(this.i18n.t('pleaseEnterAnswer') || 'Please enter an answer');
                return;
            }
            this.testManager.recordOpenAnswer(questionId, text);
        }
    }

    /**
     * ÐžÐ±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¾Ñ‚Ð²ÐµÑ‚Ð° Ð½Ð° ÑÐ¸Ñ‚ÑƒÐ°Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¹ Ð²Ð¾Ð¿Ñ€Ð¾Ñ
     */
    handleSituationalAnswer(questionId, stepId, choice) {
        if (this.testManager) {
            this.testManager.recordSituationalAnswer(questionId, stepId, choice);
        }
    }

    // ... (skipping unchanged code)

    /**
     * ÐŸÐµÑ€ÐµÐ¸Ð¼ÐµÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ‚ÐµÑÑ‚Ð°
     */
    /**
     * ÐŸÐµÑ€ÐµÐ¸Ð¼ÐµÐ½Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ‚ÐµÑÑ‚Ð°
     */
    renameTest(testId) {
        const history = this.auth.getTestHistory();
        const test = history.find(t => t.id === testId);
        if (!test) return;

        const currentTitle = test.title || `Test`;
        const t = this.i18n.t.bind(this.i18n);

        const newTitle = prompt(t('enterTestName') || 'Enter test name:', currentTitle);

        if (newTitle && newTitle.trim() !== '') {
            if (this.auth.updateTestTitle(testId, newTitle.trim())) {
                if (this.toast) this.toast.show(t('testRenamed') || 'Test renamed', 'success');
                this.showProfile();
            }
        }
    }

    /**
     * Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ñ‚ÐµÑÑ‚Ð°
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
                        <div class="breakdown-label">
                            <span class="material-symbols-rounded">visibility</span>
                            ${t('cognitiveVisual') || 'Visual'}
                        </div>
                        <div class="breakdown-value">${results.breakdown.visual}%</div>
                        <div class="breakdown-bar">
                            <div class="breakdown-bar-fill" style="width: ${results.breakdown.visual}%"></div>
                        </div>
                    </div>
                    <div class="breakdown-item ${results.dominant === 'auditory' ? 'dominant' : ''}">
                        <div class="breakdown-label">
                            <span class="material-symbols-rounded">hearing</span>
                            ${t('cognitiveAuditory') || 'Auditory'}
                        </div>
                        <div class="breakdown-value">${results.breakdown.auditory}%</div>
                        <div class="breakdown-bar">
                            <div class="breakdown-bar-fill" style="width: ${results.breakdown.auditory}%"></div>
                        </div>
                    </div>
                    <div class="breakdown-item ${results.dominant === 'kinesthetic' ? 'dominant' : ''}">
                        <div class="breakdown-label">
                            <span class="material-symbols-rounded">directions_run</span>
                            ${t('cognitiveKinesthetic') || 'Kinesthetic'}
                        </div>
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
                        ${t('downloadResults') || 'Download results'}
                    </button>
                    <button class="btn-secondary-outline" onclick="app.showProfile()">
                        <span class="material-symbols-rounded">person</span>
                        ${t('goToProfile') || 'Go to profile'}
                    </button>
                    <button class="btn-secondary-outline" onclick="app.showTestTypeSelection()">
                        <span class="material-symbols-rounded">refresh</span>
                        ${t('takeAnotherTest') || 'Take another test'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Delete Test by ID
     */
    deleteTest(testId, targetElement = null) {
        if (!confirm(this.i18n.t('confirmDelete') || 'Are you sure you want to delete this test?')) return;

        if (testId === 'cognitive') {
            this.storage.removeCognitiveResults();
            if (this.toast) this.toast.show(this.i18n.t('testDeleted') || 'Test deleted', 'success');
            this.showProfile();
        } else if (this.auth.deleteTest(testId)) {
            if (this.toast) this.toast.show(this.i18n.t('testDeleted') || 'Test deleted', 'success');
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

        if (!confirm(this.i18n.t('confirmDeleteSelected', { count: ids.length }) || `Are you sure you want to delete the selected tests (${ids.length})?`)) return;

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
            if (this.toast) this.toast.show(this.i18n.t('testsDeleted', { count: ids.length }) || `Tests deleted: ${ids.length}`, 'success');
            this.showProfile();
        }
    }



    /**
     * Ð’Ñ‹Ñ…Ð¾Ð´ Ð¸Ð· Ð°ÐºÐºÐ°ÑƒÐ½Ñ‚Ð°
     */
    logout() {
        this.auth.logout();
        this.showIntro();
    }

    /**
     * Ð ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ñ Service Worker Ð´Ð»Ñ PWA
     */
    registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            debugLog('Ð‘Ò±Ð» Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð´Ðµ Service Worker Ò›Ð¾Ð»Ð´Ð°Ñƒ ÐºÓ©Ñ€ÑÐµÑ‚Ñ–Ð»Ð¼ÐµÐ¹Ð´Ñ– (Service Worker not supported in this browser)');
            return;
        }

        try {
            window.addEventListener('load', () => {
                const swPath = window.location.pathname.includes('/diplom/') ? './sw.js' : '/sw.js';
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        debugLog('Service Worker Ñ‚Ñ–Ñ€ÐºÐµÐ»Ð´Ñ– (Service Worker registered):', registration.scope);

                        // ÐŸÑ€Ð¾Ð²ÐµÑ€ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ð¹
                        registration.addEventListener('updatefound', () => {
                            try {
                                const newWorker = registration.installing;
                                if (newWorker) {
                                    newWorker.addEventListener('statechange', () => {
                                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                            debugLog('ÒšÐ¾Ð»Ð´Ð°Ð½Ð±Ð°Ð½Ñ‹Ò£ Ð¶Ð°Ò£Ð° Ð½Ò±ÑÒ›Ð°ÑÑ‹ Ò›Ð¾Ð»Ð¶ÐµÑ‚Ñ–Ð¼Ð´Ñ– (New application version available)');
                                        }
                                    });
                                }
                            } catch (updateError) {
                                debugWarn('Service Worker Ð¶Ð°Ò£Ð°Ñ€Ñ‚ÑƒÐ»Ð°Ñ€Ñ‹Ð½ Ñ‚ÐµÐºÑÐµÑ€Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error checking Service Worker updates):', updateError);
                            }
                        });
                    })
                    .catch((error) => {
                        debugWarn('Service Worker Ñ‚Ñ–Ñ€ÐºÐµÑƒ Ò›Ð°Ñ‚ÐµÑÑ– (Service Worker registration error):', error);
                        // ÐÐµ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡Ð½Ð¾, Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ð¾Ð¶ÐµÑ‚ Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ñ‚ÑŒ Ð±ÐµÐ· Service Worker
                    });
            });
        } catch (error) {
            debugWarn('Service Worker Ñ‚ÐµÒ£ÑˆÐµÑƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error setting up Service Worker):', error);
        }
    }

    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ð¼ÐµÑ‚Ñ€Ð¸Ðº ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð° Ñ‚ÐµÑÑ‚Ð°
     * @param {Object} qualityMetrics - ÐœÐµÑ‚Ñ€Ð¸ÐºÐ¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°
     * @param {string} containerId - ID ÐºÐ¾Ð½Ñ‚ÐµÐ¹Ð½ÐµÑ€Ð°
     */
    displayQualityMetrics(qualityMetrics, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !qualityMetrics) return;

        let html = '<div class="quality-metrics">';

        // ÐÐ°Ð´ÐµÐ¶Ð½Ð¾ÑÑ‚ÑŒ
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

        // Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð²Ð°Ð»Ð¸Ð´Ð°Ñ†Ð¸Ñ
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
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑÑ‚Ð¾Ð²Ð¾Ð¹ Ð¼ÐµÑ‚ÐºÐ¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°
     * @param {string} quality - ÐšÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾
     * @returns {string} ÐœÐµÑ‚ÐºÐ°
     */
    getQualityLabel(quality) {
        const labels = {
            excellent: this.i18n.t('qualityExcellent') || 'Excellent',
            good: this.i18n.t('qualityGood') || 'Good',
            acceptable: this.i18n.t('qualityAcceptable') || 'Acceptable',
            questionable: this.i18n.t('qualityQuestionable') || 'Questionable',
            poor: this.i18n.t('qualityPoor') || 'Poor'
        };
        return labels[quality] || quality;
    }

    /**
     * ÐŸÐ¾Ð»ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ñ‚ÐµÐºÑÑ‚Ð¾Ð²Ð¾Ð¹ Ð¼ÐµÑ‚ÐºÐ¸ Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ÑÑ‚Ð¸
     * @param {string} validity - Ð’Ð°Ð»Ð¸Ð´Ð½Ð¾ÑÑ‚ÑŒ
     * @returns {string} ÐœÐµÑ‚ÐºÐ°
     */
    getValidityLabel(validity) {
        const labels = {
            good: this.i18n.t('validityGood') || 'Good',
            questionable: this.i18n.t('validityQuestionable') || 'Questionable',
            poor: this.i18n.t('validityPoor') || 'Poor'
        };
        return labels[validity] || validity;
    }

    /**
     * ÐŸÐ¾ÐºÐ°Ð· Ñ„Ð¾Ñ€Ð¼Ñ‹ Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸
     */
    /**
     * ÐŸÐ¾ÐºÐ°Ð· Ñ„Ð¾Ñ€Ð¼Ñ‹ Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸
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
     * ÐŸÑ€Ð¾Ð¿ÑƒÑÐº Ð¾Ð±Ñ€Ð°Ñ‚Ð½Ð¾Ð¹ ÑÐ²ÑÐ·Ð¸
     */
    skipFeedback() {
        if (!this.feedbackService) return;
        this.feedbackService.skip('feedbackFormContainer');
    }

    /**
     * ÐžÑ‚Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ðµ Ð¾ÑˆÐ¸Ð±ÐºÐ¸
     * @param {string} message - Ð¡Ð¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¾Ð± Ð¾ÑˆÐ¸Ð±ÐºÐµ
     */
    showError(message) {
        const container = document.getElementById('app');
        if (!container) return;

        const errorTitle = this.i18n ? this.i18n.t('error') : 'Error';
        const reloadText = this.i18n ? this.i18n.t('reloadPage') || 'Reload page' : 'Reload page';

        container.innerHTML = `
            <div class="error-message">
                <h2>${errorTitle}</h2>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">${reloadText}</button>
            </div>
        `;
    }
}

// Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ñ€Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐµ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
let app;

// Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ Ð¿Ð¾ÑÐ»Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ DOM Ð¸ Ð²ÑÐµÑ… ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… ÑÐºÑ€Ð¸Ð¿Ñ‚Ð¾Ð²
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 50; // ÐœÐ°ÐºÑÐ¸Ð¼ÑƒÐ¼ 10 ÑÐµÐºÑƒÐ½Ð´ (50 * 200ms)

function initializeApp() {
    initAttempts++;

    const translate = (key, fallback, params = {}) => {
        if (typeof window !== 'undefined' && window.i18n && typeof window.i18n.t === 'function') {
            const translated = window.i18n.t(key, params);
            if (translated && translated !== key) {
                return translated;
            }
        }

        return Object.keys(params).reduce((text, param) => {
            return text.replace(`{${param}}`, params[param]);
        }, fallback);
    };

    // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼, Ñ‡Ñ‚Ð¾ Ð²ÑÐµ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ðµ ÐºÐ»Ð°ÑÑÑ‹ Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½Ñ‹
    if (typeof PersonalityTestApp === 'undefined') {
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            debugWarn(`ÐŸÐ¾Ð¿Ñ‹Ñ‚ÐºÐ° ${initAttempts}: PersonalityTestApp Ð½Ðµ Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»Ñ‘Ð½, Ð¶Ð´Ñ‘Ð¼...`);
            setTimeout(initializeApp, 200);
        } else {
            criticalError('PersonalityTestApp Ð°Ð½Ñ‹Ò›Ñ‚Ð°Ð»Ð¼Ð°Ð´Ñ‹ (PersonalityTestApp not defined after)', MAX_INIT_ATTEMPTS, 'attempts');
        }
        return;
    }

    // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ðµ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑ‚ÐµÐ¹ Ð¿ÐµÑ€ÐµÐ´ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÐµÐ¹
    const requiredModules = ['StorageManager', 'LocalizationManager', 'AuthManager', 'PersonalityAnalyzer', 'ResultsVisualizer'];

    // Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾Ð¹ Ð¿Ñ€Ð¾Ð²ÐµÑ€ÐºÐ¸ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚Ð¸ Ð¼Ð¾Ð´ÑƒÐ»Ñ
    const isModuleAvailable = (moduleName) => {
        // 1. ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ñ‡ÐµÑ€ÐµÐ· window (Ð¾ÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ ÑÐ¿Ð¾ÑÐ¾Ð± Ð´Ð»Ñ Ð±Ñ€Ð°ÑƒÐ·ÐµÑ€Ð°)
        if (typeof window !== 'undefined' && typeof window[moduleName] !== 'undefined') {
            return true;
        }

        // 2. ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ñ‡ÐµÑ€ÐµÐ· globalThis (ÑÐ¾Ð²Ñ€ÐµÐ¼ÐµÐ½Ð½Ñ‹Ð¹ ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚)
        if (typeof globalThis !== 'undefined' && typeof globalThis[moduleName] !== 'undefined') {
            return true;
        }

        return false;
    };

    // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ Ð¼Ð¾Ð´ÑƒÐ»Ñ Ñ Ð¾Ñ‚Ð»Ð°Ð´Ð¾Ñ‡Ð½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÐµÐ¹
    const moduleStatus = {};
    requiredModules.forEach(module => {
        moduleStatus[module] = isModuleAvailable(module);
    });

    // Ð›Ð¾Ð³Ð¸Ñ€ÑƒÐµÐ¼ ÑÑ‚Ð°Ñ‚ÑƒÑ Ð¼Ð¾Ð´ÑƒÐ»ÐµÐ¹ Ð´Ð»Ñ Ð´Ð¸Ð°Ð³Ð½Ð¾ÑÑ‚Ð¸ÐºÐ¸ (Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¿Ñ€Ð¸ Ð¿ÐµÑ€Ð²Ð¾Ð¹ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÐµ Ð¸Ð»Ð¸ Ð¿Ñ€Ð¸ Ð¾ÑˆÐ¸Ð±ÐºÐ°Ñ…)
    if (initAttempts === 1 || initAttempts % 10 === 0) {
        debugLog('ÐœÐ¾Ð´ÑƒÐ»ÑŒÐ´ÐµÑ€Ð´Ñ–Ò£ Ð¶Ò¯ÐºÑ‚ÐµÐ»Ñƒ ÐºÒ¯Ð¹Ñ– (Module loading status):', moduleStatus);
        const availableModules = Object.entries(moduleStatus)
            .filter(([_, available]) => available)
            .map(([name]) => name);
        const missingModules = Object.entries(moduleStatus)
            .filter(([_, available]) => !available)
            .map(([name]) => name);

        if (availableModules.length > 0) {
            debugLog('Ð–Ò¯ÐºÑ‚ÐµÐ»Ð³ÐµÐ½ Ð¼Ð¾Ð´ÑƒÐ»ÑŒÐ´ÐµÑ€ (Modules loaded):', availableModules);
        }
        if (missingModules.length > 0) {
            debugWarn('ÐœÐ¾Ð´ÑƒÐ»ÑŒÐ´ÐµÑ€ Ð¶ÐµÑ‚Ñ–ÑÐ¿ÐµÐ¹Ð´Ñ– (Missing modules):', missingModules);
        }
    }

    const missingModules = requiredModules.filter(module => !isModuleAvailable(module));

    if (missingModules.length > 0) {
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            console.warn(`${initAttempts}-Ó™Ñ€ÐµÐºÐµÑ‚ (Attempt): ÐœÐ°Ò£Ñ‹Ð·Ð´Ñ‹ Ð¼Ð¾Ð´ÑƒÐ»ÑŒÐ´ÐµÑ€ Ð¶Ò¯ÐºÑ‚ÐµÐ»Ð¼ÐµÐ³ÐµÐ½ (Critical modules not loaded):`, missingModules);
            // Ð–Ð´ÐµÐ¼ ÐµÑ‰Ðµ Ð½ÐµÐ¼Ð½Ð¾Ð³Ð¾ Ð¸ Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ ÑÐ½Ð¾Ð²Ð°
            setTimeout(() => {
                initializeApp(); // Ð ÐµÐºÑƒÑ€ÑÐ¸Ð²Ð½Ð¾ Ð¿Ñ‹Ñ‚Ð°ÐµÐ¼ÑÑ ÑÐ½Ð¾Ð²Ð°
            }, 200);
            return;
        } else {
            // ÐŸÑ€ÐµÐ²Ñ‹ÑˆÐµÐ½ Ð»Ð¸Ð¼Ð¸Ñ‚ Ð¿Ð¾Ð¿Ñ‹Ñ‚Ð¾Ðº - Ð²Ñ‹Ð²Ð¾Ð´Ð¸Ð¼ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÑƒÑŽ Ð¾ÑˆÐ¸Ð±ÐºÑƒ
            console.error('ÐœÐ°Ò£Ñ‹Ð·Ð´Ñ‹ Ð¼Ð¾Ð´ÑƒÐ»ÑŒÐ´ÐµÑ€ ' + MAX_INIT_ATTEMPTS + ' Ó™Ñ€ÐµÐºÐµÑ‚Ñ‚ÐµÐ½ ÐºÐµÐ¹Ñ–Ð½ Ð´Ðµ Ð¶Ò¯ÐºÑ‚ÐµÐ»Ð¼ÐµÐ´Ñ– (Critical modules not loaded after attempts):', missingModules);
            // ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ð¾ÑˆÐ¸Ð±ÐºÑƒ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŽ, Ð½Ð¾ Ð½Ðµ Ð¿Ñ€ÐµÑ€Ñ‹Ð²Ð°ÐµÐ¼ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð»Ð½Ð¾ÑÑ‚ÑŒÑŽ
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>${translate('appModulesErrorTitle', 'Error loading modules')}</h2>
                        <p>${translate('appModulesErrorDescription', 'Failed to load critical modules: {components}', { components: missingModules.join(', ') })}</p>
                        <p style="font-size: 0.9em; color: #666;">${translate('checkConsoleDetails', 'Check browser console for details.')}</p>
                        <button class="btn btn-primary" onclick="location.reload()">${translate('reloadPage', 'Reload page')}</button>
                    </div>
                `;
            }
            return; // ÐÐµ Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶Ð°ÐµÐ¼ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÑŽ Ð±ÐµÐ· ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ñ… Ð¼Ð¾Ð´ÑƒÐ»ÐµÐ¹
        }
    }

    // ÐŸÑ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ñ… Ð´Ð°Ð½Ð½Ñ‹Ñ… (Ð¿Ñ€Ð¾Ð±ÑƒÐµÐ¼ Ð½ÐµÑÐºÐ¾Ð»ÑŒÐºÐ¾ Ð²Ð°Ñ€Ð¸Ð°Ð½Ñ‚Ð¾Ð²)
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
        debugWarn(`${initAttempts}-Ó™Ñ€ÐµÐºÐµÑ‚ (Attempt): SCENARIOS_DATA Ó™Ð»Ñ– Ð¶Ò¯ÐºÑ‚ÐµÐ»Ð¼ÐµÐ³ÐµÐ½, ÐºÒ¯Ñ‚ÐµÐ¼Ñ–Ð·... (SCENARIOS_DATA not loaded yet, waiting...)`);
        debugLog('SCENARIOS_DATA Ñ‚ÐµÐºÑÐµÑ€Ñƒ (Checking SCENARIOS_DATA):', typeof SCENARIOS_DATA);
        debugLog('window.SCENARIOS_DATA Ñ‚ÐµÐºÑÐµÑ€Ñƒ (Checking window.SCENARIOS_DATA):', typeof window !== 'undefined' ? typeof window.SCENARIOS_DATA : 'window unavailable');

        if (initAttempts < MAX_INIT_ATTEMPTS) {
            setTimeout(initializeApp, 200);
        } else {
            criticalError('SCENARIOS_DATA Ð¶Ò¯ÐºÑ‚ÐµÑƒ Ó™Ñ€ÐµÐºÐµÑ‚Ñ‚ÐµÑ€Ñ–Ð½Ñ–Ò£ ÑˆÐµÐºÑ‚Ñ– ÑÐ°Ð½Ñ‹Ð½Ð°Ð½ Ð°ÑÑ‚Ñ‹ (Max attempts to load SCENARIOS_DATA exceeded)');
            const container = document.getElementById('app');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2>${translate('appDataErrorTitle', 'Error loading data')}</h2>
                        <p>${translate('appDataErrorDescription', 'Failed to load scenario data. Make sure scenarios-data.js is loaded.')}</p>
                        <p style="font-size: 0.9em; color: #666;">${translate('checkConsoleDetails', 'Check browser console for details.')}</p>
                        <button class="btn btn-primary" onclick="location.reload()">${translate('reloadPage', 'Reload page')}</button>
                    </div>
                `;
            }
        }
        return;
    }

    debugLog('ÐšÑ–Ñ€Ñ–ÑÑ‚Ñ–Ñ€Ñ–Ð»Ð³ÐµÐ½ Ð´ÐµÑ€ÐµÐºÑ‚ÐµÑ€ Ñ‚Ð°Ð±Ñ‹Ð»Ð´Ñ‹ (Embedded data found via):', dataSource);

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

    // Ð’ÑÐµ Ð³Ð¾Ñ‚Ð¾Ð²Ð¾, Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÐ¼
    try {
        app = new PersonalityTestApp();
        window.app = app; // Expose to global scope for onclick handlers
        console.log('âœ… window.app initialized:', window.app);
        console.log('âœ… app.renameTest exists:', typeof app.renameTest);
        console.log('âœ… app.deleteTest exists:', typeof app.deleteTest);
        // Ð’Ñ‹Ð·Ñ‹Ð²Ð°ÐµÐ¼ init() Ð¿Ð¾ÑÐ»Ðµ ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ñ ÑÐºÐ·ÐµÐ¼Ð¿Ð»ÑÑ€Ð°
        if (app && typeof app.init === 'function') {
            app.init().catch(error => {
                criticalError('ÒšÐ¾Ð»Ð´Ð°Ð½Ð±Ð°Ð½Ñ‹ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÑÐ»Ð°Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error initializing application):', error);
            });
        }
    } catch (error) {
        criticalError('ÒšÐ¾Ð»Ð´Ð°Ð½Ð±Ð°Ð½Ñ‹ Ð¶Ð°ÑÐ°Ñƒ Ò›Ð°Ñ‚ÐµÑÑ– (Error creating application):', error);
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>${translate('initializationError', 'Initialization error')}</h2>
                    <p>${error.message || translate('unknownError', 'Unknown error')}</p>
                    <button class="btn btn-primary" onclick="location.reload()">${translate('reloadPage', 'Reload page')}</button>
                </div>
            `;
        }
    }
}

// Ð˜Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¿Ð¾ÑÐ»Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ DOM Ð¸ Ð²ÑÐµÑ… ÑÐºÑ€Ð¸Ð¿Ñ‚Ð¾Ð²
if (document.readyState === 'loading') {
    // DOMContentLoaded fires before scripts, use window load instead
    window.addEventListener('load', initializeApp);
} else {
    // DOM ÑƒÐ¶Ðµ Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½, Ð½Ð¾ Ð¶Ð´ÐµÐ¼ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ Ð²ÑÐµÑ… ÑÐºÑ€Ð¸Ð¿Ñ‚Ð¾Ð²
    window.addEventListener('load', initializeApp);
}

