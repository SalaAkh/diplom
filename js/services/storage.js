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
            console.error('Ескі деректерді тазалау қатесі (Error clearing old data):', error);
        }
    }

    /**
     * Сохранение результатов тестирования
     * @param {Object} results - Результаты анализа
     */
    saveResults(results) {
        if (!this.isStorageAvailable) {
            console.warn('localStorage қолжетімсіз, нәтижелер сақталмайды (localStorage unavailable, results will not be saved)');
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
                console.warn('localStorage лимитінен асты, орын босатуға тырысудамыз... (localStorage limit exceeded, trying to free up space...)');
                try {
                    // Пытаемся очистить старые данные
                    this.clearOldData();
                    // Пробуем снова сохранить
                    localStorage.setItem(this.storageKey, JSON.stringify(data));
                    // Данные сохранены после очистки старых записей
                    return true;
                } catch (retryError) {
                    console.error('Тазалаудан кейін де сақтау мүмкін болмады (Failed to save even after clearing):', retryError);
                    this.isStorageAvailable = false;
                    return false;
                }
            } else {
                console.error('Нәтижелерді сақтау қатесі (Error saving results):', error);
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
                console.warn('localStorage-тағы деректер құрылымы жарамсыз (Invalid data structure in localStorage)');
                this.clearAll(); // Очищаем поврежденные данные
                return null;
            }

            // Проверяем версию данных (для будущих миграций)
            if (parsed.version && parsed.version !== '1.0') {
                console.warn('Деректердің нұсқасы үйлесімсіз (Incompatible data version):', parsed.version);
                // В будущем здесь можно добавить миграцию данных
            }

            // Валидация результатов
            if (parsed.results && !this.validateResults(parsed.results)) {
                console.warn('Нәтижелер валидациядан өтпеді, зақымдалған деректер тазалануда (Results failed validation, clearing corrupted data)');
                this.clearAll();
                return null;
            }

            return parsed.results;
        } catch (error) {
            console.error('Нәтижелерді жүктеу қатесі (Error loading results):', error);
            // Если данные повреждены, очищаем их
            try {
                this.clearAll();
            } catch (clearError) {
                console.error('Зақымдалған деректерді тазалау қатесі (Error clearing corrupted data):', clearError);
            }
            return null;
        }
    }

    /**
     * Save Cognitive Test Results
     * @param {Object} results
     */
    saveCognitiveResults(results) {
        if (!this.isStorageAvailable) return false;
        try {
            const data = {
                results: results,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('cognitiveTestResults', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving cognitive results:', error);
            return false;
        }
    }

    /**
     * Update Cognitive Test Title
     * @param {string} title - New title
    */
    updateCognitiveTestTitle(title) {
        if (!this.isStorageAvailable) return false;
        try {
            const dataStr = localStorage.getItem('cognitiveTestResults');
            if (dataStr) {
                const data = JSON.parse(dataStr);
                if (data.results) {
                    data.results.title = title;
                    localStorage.setItem('cognitiveTestResults', JSON.stringify(data));
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error updating cognitive title:', error);
            return false;
        }
    }

    /**
     * Load Cognitive Test Results
     * @returns {Object|null}
     */
    loadCognitiveResults() {
        if (!this.isStorageAvailable) return null;
        try {
            const data = localStorage.getItem('cognitiveTestResults');
            return data ? JSON.parse(data).results : null;
        } catch (error) {
            console.error('Error loading cognitive results:', error);
            return null;
        }
    }

    /**
     * Remove Cognitive Test Results
     * @returns {boolean}
     */
    removeCognitiveResults() {
        if (!this.isStorageAvailable) return false;
        try {
            localStorage.removeItem('cognitiveTestResults');
            return true;
        } catch (error) {
            console.error('Error removing cognitive results:', error);
            return false;
        }
    }

    /**
     * Сохранение прогресса прохождения теста
     * @param {Array|Object} choices - Массив выборов или объект с данными прогресса
     * @param {string} testMode - Режим теста ('basic' или 'advanced')
     * @param {number} currentQuestionIndex - Текущий индекс вопроса
     */
    saveProgress(choices, testMode = null, currentQuestionIndex = 0) {
        if (!this.isStorageAvailable) {
            console.warn('⚠️ localStorage қолжетімсіз, прогресс сақталған жоқ (⚠️ localStorage unavailable, progress not saved)');
            return false;
        }

        try {
            const data = {
                choices: choices,
                testMode: testMode,
                currentQuestionIndex: currentQuestionIndex,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('testProgress', JSON.stringify(data));
            console.log('✅ Прогресс сақталды (✅ Progress saved):', {
                testMode: testMode,
                questionIndex: currentQuestionIndex,
                choicesCount: Array.isArray(choices) ? choices.length : Object.keys(choices).length
            });
            return true;
        } catch (error) {
            // Обработка QuotaExceededError
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                console.warn('Прогресті сақтау кезінде localStorage лимитінен асты (localStorage limit exceeded while saving progress)');
                try {
                    // Пытаемся очистить старые данные
                    this.clearOldData();
                    // Пробуем снова сохранить
                    localStorage.setItem('testProgress', JSON.stringify(data));
                    console.log('✅ Прогрес тазалаудан кейін сақталды (✅ Progress saved after clearing)');
                    return true;
                } catch (retryError) {
                    console.error('Тазалаудан кейін де прогресті сақтау мүмкін болмады (Failed to save progress even after clearing):', retryError);
                    this.isStorageAvailable = false;
                    return false;
                }
            } else {
                console.error('❌ Прогресті сақтау қатесі (❌ Error saving progress):', error);
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
     * @returns {Object|null} Объект с данными прогресса или null
     */
    loadProgress() {
        try {
            const data = localStorage.getItem('testProgress');
            if (!data) {
                // console.log('ℹ️ Сақталған прогрес табылмады (ℹ️ Saved progress not found)');
                return null;
            }

            const parsed = JSON.parse(data);

            // Валидация структуры
            if (!parsed || typeof parsed !== 'object') {
                console.warn('localStorage-тағы прогресс құрылымы жарамсыз (Invalid progress structure in localStorage)');
                localStorage.removeItem('testProgress');
                return null;
            }

            // Валидация массива выборов (если это старый формат - только массив)
            if (Array.isArray(parsed.choices) && !this.validateProgress(parsed.choices)) {
                console.warn('Прогресс валидациядан өтпеді, зақымдалған деректер тазалануда (Progress failed validation, clearing corrupted data)');
                localStorage.removeItem('testProgress');
                return null;
            }

            console.log('✅ Прогресс жүктелді (✅ Progress loaded):', {
                testMode: parsed.testMode,
                questionIndex: parsed.currentQuestionIndex,
                timestamp: parsed.timestamp
            });

            // Возвращаем полный объект прогресса
            return parsed;
        } catch (error) {
            console.error('Прогресті жүктеу қатесі (Error loading progress):', error);
            // Очищаем поврежденные данные
            try {
                localStorage.removeItem('testProgress');
            } catch (clearError) {
                console.error('Зақымдалған прогресті тазалау қатесі (Error clearing corrupted progress):', clearError);
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
            console.error('Деректерді тазалау қатесі (Error clearing data):', error);
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
            console.error('Тарихты алу қатесі (Error getting history):', error);
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
