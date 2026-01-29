/**
 * Модуль работы с localStorage
 * Сохранение и загрузка результатов тестирования
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class StorageManager {
    constructor() {
        this.storageKey = 'personalityTestResults';
        this.settingsKey = 'personalityTestSettings';
        this.isStorageAvailable = this.checkStorageAvailability();
    }

    /**
     * Проверка доступности localStorage
     * @returns {boolean} true если localStorage доступен
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            // localStorage недоступен (приватный режим, отключен и т.д.)
            return false;
        }
    }

    /**
     * Очистка старых данных для освобождения места
     * @param {number} keepItems - Количество элементов для сохранения
     */
    clearOldData(keepItems = 5) {
        try {
            // Очищаем старые результаты, оставляя только последние
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                // Если есть история, оставляем только последние элементы
                if (parsed.history && Array.isArray(parsed.history) && parsed.history.length > keepItems) {
                    parsed.history = parsed.history.slice(-keepItems);
                    localStorage.setItem(this.storageKey, JSON.stringify(parsed));
                }
            }

            // Очищаем старый прогресс, если он есть
            const progress = localStorage.getItem('testProgress');
            if (progress) {
                localStorage.removeItem('testProgress');
            }
        } catch (error) {
            console.error('Ошибка очистки старых данных:', error);
        }
    }

    /**
     * Сохранение результатов тестирования
     * @param {Object} results - Результаты анализа
     */
    saveResults(results) {
        if (!this.isStorageAvailable) {
            console.warn('localStorage недоступен, результаты не будут сохранены');
            return false;
        }

        try {
            const data = {
                results: results,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            // Обработка QuotaExceededError
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                console.warn('Превышен лимит localStorage, пытаемся освободить место...');
                try {
                    // Пытаемся очистить старые данные
                    this.clearOldData();
                    // Пробуем снова сохранить
                    localStorage.setItem(this.storageKey, JSON.stringify(data));
                    // Данные сохранены после очистки старых записей
                    return true;
                } catch (retryError) {
                    console.error('Не удалось сохранить даже после очистки:', retryError);
                    this.isStorageAvailable = false;
                    return false;
                }
            } else {
                console.error('Ошибка сохранения результатов:', error);
                this.isStorageAvailable = false;
                return false;
            }
        }
    }

    /**
     * Валидация структуры результатов
     * @param {Object} results - Результаты для валидации
     * @returns {boolean} true если данные валидны
     */
    validateResults(results) {
        if (!results || typeof results !== 'object') {
            return false;
        }

        // Проверяем наличие основных полей
        if (results.profile && typeof results.profile !== 'object') {
            return false;
        }

        if (results.scores && typeof results.scores !== 'object') {
            return false;
        }

        if (results.normalizedScores && typeof results.normalizedScores !== 'object') {
            return false;
        }

        // Проверяем структуру normalizedScores (должны быть числа)
        if (results.normalizedScores) {
            const validDimensions = ['strategic', 'explorer', 'individualism', 'rationality', 'control', 'meaning'];
            for (const dim of validDimensions) {
                if (results.normalizedScores[dim] !== undefined) {
                    const value = results.normalizedScores[dim];
                    if (typeof value !== 'number' || isNaN(value) || value < -1 || value > 1) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Загрузка сохранённых результатов
     * @returns {Object|null} Результаты или null
     */
    loadResults() {
        if (!this.isStorageAvailable) {
            return null;
        }

        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return null;

            const parsed = JSON.parse(data);

            // Валидация структуры данных
            if (!parsed || typeof parsed !== 'object') {
                console.warn('Невалидная структура данных в localStorage');
                this.clearAll(); // Очищаем поврежденные данные
                return null;
            }

            // Проверяем версию данных (для будущих миграций)
            if (parsed.version && parsed.version !== '1.0') {
                console.warn('Несовместимая версия данных:', parsed.version);
                // В будущем здесь можно добавить миграцию данных
            }

            // Валидация результатов
            if (parsed.results && !this.validateResults(parsed.results)) {
                console.warn('Результаты не прошли валидацию, очищаем поврежденные данные');
                this.clearAll();
                return null;
            }

            return parsed.results;
        } catch (error) {
            console.error('Ошибка загрузки результатов:', error);
            // Если данные повреждены, очищаем их
            try {
                this.clearAll();
            } catch (clearError) {
                console.error('Ошибка очистки поврежденных данных:', clearError);
            }
            return null;
        }
    }

    /**
     * Сохранение прогресса прохождения теста
     * @param {Array} choices - Массив выборов
     */
    saveProgress(choices) {
        if (!this.isStorageAvailable) {
            return false;
        }

        try {
            const data = {
                choices: choices,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('testProgress', JSON.stringify(data));
            return true;
        } catch (error) {
            // Обработка QuotaExceededError
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                console.warn('Превышен лимит localStorage при сохранении прогресса');
                try {
                    // Пытаемся очистить старые данные
                    this.clearOldData();
                    // Пробуем снова сохранить
                    localStorage.setItem('testProgress', JSON.stringify(data));
                    return true;
                } catch (retryError) {
                    console.error('Не удалось сохранить прогресс даже после очистки:', retryError);
                    this.isStorageAvailable = false;
                    return false;
                }
            } else {
                console.error('Ошибка сохранения прогресса:', error);
                this.isStorageAvailable = false;
                return false;
            }
        }
    }

    /**
     * Валидация структуры прогресса
     * @param {Array} choices - Массив выборов для валидации
     * @returns {boolean} true если данные валидны
     */
    validateProgress(choices) {
        if (!Array.isArray(choices)) {
            return false;
        }

        // Проверяем структуру каждого выбора
        for (const choice of choices) {
            if (!choice || typeof choice !== 'object') {
                return false;
            }

            // Проверяем наличие обязательных полей
            if (typeof choice.scenarioId !== 'number' || choice.scenarioId <= 0) {
                return false;
            }

            if (!choice.choice || !['A', 'B', 'C', 'D'].includes(choice.choice)) {
                return false;
            }

            // Проверяем weights, если они есть
            if (choice.weights && typeof choice.weights !== 'object') {
                return false;
            }
        }

        return true;
    }

    /**
     * Загрузка прогресса
     * @returns {Array|null} Массив выборов или null
     */
    loadProgress() {
        try {
            const data = localStorage.getItem('testProgress');
            if (!data) return null;

            const parsed = JSON.parse(data);

            // Валидация структуры
            if (!parsed || typeof parsed !== 'object') {
                console.warn('Невалидная структура прогресса в localStorage');
                localStorage.removeItem('testProgress');
                return null;
            }

            // Валидация массива выборов
            if (parsed.choices && !this.validateProgress(parsed.choices)) {
                console.warn('Прогресс не прошел валидацию, очищаем поврежденные данные');
                localStorage.removeItem('testProgress');
                return null;
            }

            return parsed.choices;
        } catch (error) {
            console.error('Ошибка загрузки прогресса:', error);
            // Очищаем поврежденные данные
            try {
                localStorage.removeItem('testProgress');
            } catch (clearError) {
                console.error('Ошибка очистки поврежденного прогресса:', clearError);
            }
            return null;
        }
    }

    /**
     * Очистка сохранённых данных
     */
    clearAll() {
        if (!this.isStorageAvailable) {
            return true; // Считаем успешным, если storage недоступен
        }

        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem('testProgress');
            return true;
        } catch (error) {
            console.error('Ошибка очистки данных:', error);
            return false;
        }
    }

    /**
     * Проверка наличия сохранённых результатов
     * @returns {boolean}
     */
    hasResults() {
        if (!this.isStorageAvailable) {
            return false;
        }
        return localStorage.getItem(this.storageKey) !== null;
    }

    /**
     * Получение истории всех прохождений
     * @returns {Array} Массив всех сохранённых результатов
     */
    getHistory() {
        try {
            // В будущем можно расширить для хранения истории
            const current = this.loadResults();
            return current ? [current] : [];
        } catch (error) {
            console.error('Ошибка получения истории:', error);
            return [];
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}

// Явное присвоение к window для браузера
if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}
