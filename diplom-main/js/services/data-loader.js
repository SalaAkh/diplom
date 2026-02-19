/**
 * DataLoader - Сервис загрузки данных
 * Загружает сценарии из JSON файлов с кэшированием для offline работы
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class DataLoader {
    constructor() {
        this.cache = {
            scenarios: null,
            advancedScenarios: null
        };
        this.cacheKeys = {
            scenarios: 'cached_scenarios_data',
            advancedScenarios: 'cached_advanced_scenarios_data'
        };
        this.cacheVersion = 'v1.0';
    }

    /**
     * Загрузка базовых сценариев
     * @returns {Promise<Object>} Данные сценариев
     */
    async loadScenarios() {
        // Проверяем кэш в памяти
        if (this.cache.scenarios) {
            return this.cache.scenarios;
        }

        try {
            // Пробуем загрузить из сети
            const response = await fetch('data/scenarios.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Валидация данных
            if (!this.validateScenariosData(data)) {
                throw new Error('Invalid scenarios data structure');
            }

            // Сохраняем в кэш
            this.cache.scenarios = data;
            this.saveToLocalStorage(this.cacheKeys.scenarios, data);

            console.log('📊 Сценарийлер жүктелді (Scenarios loaded from network)');
            return data;
        } catch (error) {
            console.warn('⚠️ Сценарийлерді желіден жүктеу мүмкін болмады (Failed to load scenarios from network):', error.message);

            // Пробуем загрузить из localStorage
            const cached = this.loadFromLocalStorage(this.cacheKeys.scenarios);
            if (cached) {
                this.cache.scenarios = cached;
                console.log('📦 Сценарийлер кэштен жүктелді (Scenarios loaded from cache)');
                return cached;
            }

            // Если всё не удалось, возвращаем пустую структуру
            console.error('❌ Сценарийлерді жүктеу мүмкін болмады (Failed to load scenarios)');
            return this.getEmptyStructure();
        }
    }

    /**
     * Загрузка углублённых сценариев
     * @returns {Promise<Object>} Данные углублённых сценариев
     */
    async loadAdvancedScenarios() {
        // Проверяем кэш в памяти
        if (this.cache.advancedScenarios) {
            return this.cache.advancedScenarios;
        }

        try {
            // Пробуем загрузить из сети
            const response = await fetch('data/advanced-scenarios.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Валидация данных
            if (!this.validateAdvancedData(data)) {
                throw new Error('Invalid advanced scenarios data structure');
            }

            // Сохраняем в кэш
            this.cache.advancedScenarios = data;
            this.saveToLocalStorage(this.cacheKeys.advancedScenarios, data);

            console.log('📊 Тереңдетілген сценарийлер жүктелді (Advanced scenarios loaded from network)');
            return data;
        } catch (error) {
            console.warn('⚠️ Тереңдетілген сценарийлерді желіден жүктеу мүмкін болмады (Failed to load advanced scenarios from network):', error.message);

            // Пробуем загрузить из localStorage
            const cached = this.loadFromLocalStorage(this.cacheKeys.advancedScenarios);
            if (cached) {
                this.cache.advancedScenarios = cached;
                console.log('📦 Тереңдетілген сценарийлер кэштен жүктелді (Advanced scenarios loaded from cache)');
                return cached;
            }

            // Если всё не удалось, возвращаем пустую структуру
            console.error('❌ Тереңдетілген сценарийлерді жүктеу мүмкін болмады (Failed to load advanced scenarios)');
            return this.getEmptyAdvancedStructure();
        }
    }

    /**
     * Валидация структуры данных базовых сценариев
     * @param {Object} data - Данные для валидации
     * @returns {boolean}
     */
    validateScenariosData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!Array.isArray(data.scenarios)) return false;
        if (!data.dimensions || typeof data.dimensions !== 'object') return false;

        // Проверяем хотя бы первый сценарий
        if (data.scenarios.length > 0) {
            const first = data.scenarios[0];
            if (!first.id || !first.optionA || !first.optionB) return false;
        }

        return true;
    }

    /**
     * Валидация структуры данных углублённых сценариев
     * @param {Object} data - Данные для валидации
     * @returns {boolean}
     */
    validateAdvancedData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!Array.isArray(data.questions)) return false;

        // Проверяем хотя бы первый вопрос
        if (data.questions.length > 0) {
            const first = data.questions[0];
            if (!first.id || !first.type) return false;
        }

        return true;
    }

    /**
     * Сохранение в localStorage с версией
     * @param {string} key - Ключ
     * @param {Object} data - Данные
     */
    saveToLocalStorage(key, data) {
        try {
            const payload = {
                version: this.cacheVersion,
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(key, JSON.stringify(payload));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error.message);
        }
    }

    /**
     * Загрузка из localStorage с проверкой версии
     * @param {string} key - Ключ
     * @returns {Object|null}
     */
    loadFromLocalStorage(key) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;

            const payload = JSON.parse(stored);

            // Проверяем версию
            if (payload.version !== this.cacheVersion) {
                console.log('Cache version mismatch, clearing cache');
                localStorage.removeItem(key);
                return null;
            }

            // Проверяем возраст кэша (7 дней)
            const maxAge = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - payload.timestamp > maxAge) {
                console.log('Cache expired, clearing cache');
                localStorage.removeItem(key);
                return null;
            }

            return payload.data;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error.message);
            return null;
        }
    }

    /**
     * Очистка кэша
     */
    clearCache() {
        this.cache.scenarios = null;
        this.cache.advancedScenarios = null;
        localStorage.removeItem(this.cacheKeys.scenarios);
        localStorage.removeItem(this.cacheKeys.advancedScenarios);
        console.log('🗑️ Кэш тазаланды (Cache cleared)');
    }

    /**
     * Получение пустой структуры для базовых сценариев
     * @returns {Object}
     */
    getEmptyStructure() {
        return {
            scenarios: [],
            dimensions: {
                rationality: { name: { kk: 'Рационалдылық', ru: 'Рациональность', en: 'Rationality' } },
                control: { name: { kk: 'Бақылау', ru: 'Контроль', en: 'Control' } },
                strategic: { name: { kk: 'Стратегиялық', ru: 'Стратегический', en: 'Strategic' } },
                explorer: { name: { kk: 'Зерттеуші', ru: 'Исследователь', en: 'Explorer' } },
                individualism: { name: { kk: 'Индивидуализм', ru: 'Индивидуализм', en: 'Individualism' } },
                meaning: { name: { kk: 'Мағына', ru: 'Смысл', en: 'Meaning' } }
            }
        };
    }

    /**
     * Получение пустой структуры для углублённых сценариев
     * @returns {Object}
     */
    getEmptyAdvancedStructure() {
        return {
            questions: []
        };
    }

    /**
     * Предзагрузка всех данных
     * @returns {Promise<void>}
     */
    async preloadAll() {
        await Promise.all([
            this.loadScenarios(),
            this.loadAdvancedScenarios()
        ]);
        console.log('✅ Барлық деректер жүктелді (All data preloaded)');
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}

// Создаём глобальный экземпляр
if (typeof window !== 'undefined') {
    window.DataLoader = DataLoader;
    window.dataLoader = new DataLoader();
}
