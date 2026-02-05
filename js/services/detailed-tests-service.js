/**
 * Сервис для работы с детальными тестами
 * Управляет прохождением, расчётом и сохранением результатов
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class DetailedTestsService {
    constructor() {
        this.testsData = window.DETAILED_TESTS_DATA?.tests || {};
        this.answerScale = window.DETAILED_TESTS_DATA?.answerScale || {};
        this.interpretations = window.DETAILED_TESTS_DATA?.interpretations || {};
        this.storageKey = 'detailedTestsResults';
    }

    /**
     * Получить текущий язык
     */
    getLang() {
        if (window.localizationService?.getCurrentLanguage) {
            return window.localizationService.getCurrentLanguage();
        }
        return localStorage.getItem('language') || 'ru';
    }

    /**
     * Получить локализованный текст
     */
    getLocalizedText(field) {
        if (typeof field === 'string') return field;
        if (!field) return '';
        const lang = this.getLang();
        return field[lang] || field['ru'] || field['en'] || Object.values(field)[0] || '';
    }

    /**
     * Получить список всех доступных тестов
     * @returns {Array} Массив метаданных тестов
     */
    getAvailableTests() {
        return Object.values(this.testsData).map(test => ({
            id: test.id,
            name: this.getLocalizedText(test.name),
            description: this.getLocalizedText(test.description),
            icon: test.icon,
            color: test.color,
            duration: test.duration,
            questionCount: test.questionCount,
            hasResults: this.hasTestResults(test.id)
        }));
    }

    /**
     * Получить данные теста по ID
     * @param {string} testId - ID теста
     * @returns {Object|null} Данные теста
     */
    getTestById(testId) {
        const test = this.testsData[testId];
        if (!test) return null;

        return {
            id: test.id,
            name: this.getLocalizedText(test.name),
            description: this.getLocalizedText(test.description),
            icon: test.icon,
            color: test.color,
            duration: test.duration,
            questionCount: test.questionCount,
            dimensions: test.dimensions,
            dimensionNames: Object.fromEntries(
                Object.entries(test.dimensionNames).map(([key, val]) => [key, this.getLocalizedText(val)])
            ),
            questions: test.questions.map((q, index) => ({
                id: q.id,
                index: index + 1,
                dimension: q.dimension,
                text: this.getLocalizedText(q.text),
                type: q.type
            }))
        };
    }

    /**
     * Получить шкалу ответов
     * @returns {Array} Массив вариантов ответа
     */
    getAnswerScale() {
        return Object.entries(this.answerScale).map(([value, labels]) => ({
            value: parseInt(value),
            label: this.getLocalizedText(labels)
        }));
    }

    /**
     * Рассчитать результаты теста
     * @param {string} testId - ID теста
     * @param {Object} answers - Ответы пользователя { questionId: value }
     * @returns {Object} Результаты теста
     */
    calculateResults(testId, answers) {
        const test = this.testsData[testId];
        if (!test) return null;

        const maxScore = 7; // Максимальное значение по шкале
        const dimensionScores = {};
        const dimensionCounts = {};

        // Инициализация
        for (const dim of test.dimensions) {
            dimensionScores[dim] = 0;
            dimensionCounts[dim] = 0;
        }

        // Подсчёт по измерениям
        for (const question of test.questions) {
            const answer = answers[question.id];
            if (answer !== undefined) {
                dimensionScores[question.dimension] += answer;
                dimensionCounts[question.dimension]++;
            }
        }

        // Нормализация в проценты
        const dimensionResults = {};
        let totalScore = 0;
        let totalCount = 0;

        for (const dim of test.dimensions) {
            if (dimensionCounts[dim] > 0) {
                const rawScore = dimensionScores[dim] / dimensionCounts[dim];
                const percentScore = Math.round((rawScore / maxScore) * 100);
                dimensionResults[dim] = {
                    name: this.getLocalizedText(test.dimensionNames[dim]),
                    score: percentScore,
                    interpretation: this.getInterpretation(percentScore)
                };
                totalScore += percentScore;
                totalCount++;
            }
        }

        const overallScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;

        return {
            testId: testId,
            testName: this.getLocalizedText(test.name),
            date: new Date().toISOString(),
            overallScore: overallScore,
            overallInterpretation: this.getInterpretation(overallScore),
            dimensions: dimensionResults,
            answeredQuestions: Object.keys(answers).length,
            totalQuestions: test.questions.length
        };
    }

    /**
     * Получить интерпретацию для значения
     * @param {number} score - Балл 0-100
     * @returns {Object} Интерпретация
     */
    getInterpretation(score) {
        for (const [level, data] of Object.entries(this.interpretations)) {
            if (score >= data.range[0] && score <= data.range[1]) {
                return {
                    level: level,
                    label: this.getLocalizedText(data.label),
                    description: this.getLocalizedText(data.description)
                };
            }
        }
        return { level: 'unknown', label: '—', description: '' };
    }

    /**
     * Сохранить результаты теста
     * @param {Object} results - Результаты теста
     */
    saveTestResults(results) {
        try {
            const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}');

            // Инициализация массива для теста если нужно
            if (!stored[results.testId]) {
                stored[results.testId] = [];
            }

            // Добавляем результат
            stored[results.testId].unshift({
                ...results,
                savedAt: new Date().toISOString()
            });

            // Ограничиваем историю (максимум 10 результатов на тест)
            stored[results.testId] = stored[results.testId].slice(0, 10);

            localStorage.setItem(this.storageKey, JSON.stringify(stored));
            return true;
        } catch (e) {
            console.error('[DetailedTestsService] Error saving results:', e);
            return false;
        }
    }

    /**
     * Проверить наличие результатов теста
     * @param {string} testId - ID теста
     * @returns {boolean}
     */
    hasTestResults(testId) {
        try {
            const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            return stored[testId] && stored[testId].length > 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * Получить последние результаты теста
     * @param {string} testId - ID теста
     * @returns {Object|null} Последние результаты
     */
    getLatestResults(testId) {
        try {
            const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            return stored[testId]?.[0] || null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Получить историю результатов теста
     * @param {string} testId - ID теста
     * @returns {Array} История результатов
     */
    getTestHistory(testId) {
        try {
            const stored = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            return stored[testId] || [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Получить все результаты пользователя
     * @returns {Object} Все результаты по тестам
     */
    getAllResults() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        } catch (e) {
            return {};
        }
    }

    /**
     * Получить сводку по всем пройденным тестам
     * @returns {Array} Сводка результатов
     */
    getResultsSummary() {
        const allResults = this.getAllResults();
        const summary = [];

        for (const testId of Object.keys(this.testsData)) {
            const test = this.testsData[testId];
            const latest = allResults[testId]?.[0];

            summary.push({
                testId: testId,
                testName: this.getLocalizedText(test.name),
                icon: test.icon,
                color: test.color,
                completed: !!latest,
                lastScore: latest?.overallScore || null,
                lastDate: latest?.date || null,
                timesCompleted: allResults[testId]?.length || 0
            });
        }

        return summary;
    }

    /**
     * Генерация рекомендаций на основе результатов
     * @param {string} testId - ID теста
     * @returns {Array} Массив рекомендаций
     */
    getRecommendations(testId) {
        const latest = this.getLatestResults(testId);
        if (!latest) return [];

        const recommendations = [];
        const lang = this.getLang();

        const tips = {
            eq: {
                self_awareness: {
                    low: { ru: 'Ведите дневник эмоций — записывайте чувства 3 раза в день.', kk: 'Эмоция күнделігін жүргізіңіз — күніне 3 рет сезімдеріңізді жазып жүріңіз.', en: 'Keep an emotions journal — write down your feelings 3 times a day.' },
                    medium: { ru: 'Практикуйте осознанное дыхание для развития самонаблюдения.', kk: 'Өзін-өзі бақылауды дамыту үшін саналы тыныс алуды үйреніңіз.', en: 'Practice mindful breathing to develop self-observation.' },
                    high: { ru: 'Поделитесь опытом самосознания с окружающими!', kk: 'Өзін-өзі тану тәжірибеңізбен айналаңыздағылармен бөлісіңіз!', en: 'Share your self-awareness experience with others!' }
                },
                empathy: {
                    low: { ru: 'Попробуйте активное слушание — повторяйте чувства собеседника.', kk: 'Белсенді тыңдауды қолданып көріңіз — әңгімелесушінің сезімдерін қайталаңыз.', en: 'Try active listening — reflect back the speaker\'s feelings.' },
                    medium: { ru: 'Читайте художественную литературу для развития эмпатии.', kk: 'Эмпатияны дамыту үшін көркем әдебиет оқыңыз.', en: 'Read fiction to develop empathy.' },
                    high: { ru: 'Ваша эмпатия — ваш дар! Используйте его для помощи другим.', kk: 'Сіздің эмпатияңыз — сіздің сыйлығыңыз! Оны басқаларға көмектесу үшін пайдаланыңыз.', en: 'Your empathy is your gift! Use it to help others.' }
                }
            },
            stress: {
                coping: {
                    low: { ru: 'Освойте технику «5-4-3-2-1» для снятия острого стресса.', kk: 'Жедел стрессті жеңу үшін «5-4-3-2-1» техникасын меңгеріңіз.', en: 'Learn the "5-4-3-2-1" technique for acute stress relief.' },
                    medium: { ru: 'Практикуйте регулярные короткие перерывы в работе.', kk: 'Жұмыста үнемі қысқа үзілістер жасаңыз.', en: 'Practice regular short breaks at work.' },
                    high: { ru: 'Отлично! Поддерживайте ваши стратегии преодоления.', kk: 'Керемет! Жеңу стратегияларыңызды жалғастырыңыз.', en: 'Excellent! Maintain your coping strategies.' }
                },
                recovery: {
                    low: { ru: 'Создайте вечерний ритуал расслабления (чай, книга, ванна).', kk: 'Кешкі демалу рәсімін жасаңыз (шай, кітап, ванна).', en: 'Create an evening relaxation ritual (tea, book, bath).' },
                    medium: { ru: 'Попробуйте прогрессивную мышечную релаксацию.', kk: 'Прогрессивті бұлшықет релаксациясын қолданып көріңіз.', en: 'Try progressive muscle relaxation.' },
                    high: { ru: 'Вы отлично восстанавливаетесь! Продолжайте в том же духе.', kk: 'Сіз керемет қалпына келесіз! Осылай жалғастырыңыз.', en: 'You recover well! Keep it up.' }
                }
            },
            creativity: {
                ideation: {
                    low: { ru: 'Попробуйте технику «случайное слово» для генерации идей.', kk: 'Идея генерациялау үшін «кездейсоқ сөз» техникасын қолданып көріңіз.', en: 'Try the "random word" technique for idea generation.' },
                    medium: { ru: 'Регулярно записывайте идеи — держите блокнот под рукой.', kk: 'Идеяларды үнемі жазып жүріңіз — блокнотты қасыңызда ұстаңыз.', en: 'Regularly write down ideas — keep a notebook handy.' },
                    high: { ru: 'Ваш поток идей впечатляет! Начните делиться ими с миром.', kk: 'Сіздің идея ағыны таңғажайып! Оны әлеммен бөлісуді бастаңыз.', en: 'Your flow of ideas is impressive! Start sharing them with the world.' }
                },
                openness: {
                    low: { ru: 'Раз в неделю пробуйте что-то совершенно новое.', kk: 'Аптасына бір рет мүлдем жаңа нәрсе қолданып көріңіз.', en: 'Once a week, try something completely new.' },
                    medium: { ru: 'Расширяйте кругозор: смотрите документальные фильмы о разных культурах.', kk: 'Көкжиегіңізді кеңейтіңіз: әртүрлі мәдениеттер туралы деректі фильмдер көріңіз.', en: 'Expand your horizons: watch documentaries about different cultures.' },
                    high: { ru: 'Ваша открытость новому — ваша сила!', kk: 'Жаңаға ашықтығыңыз — сіздің күшіңіз!', en: 'Your openness to the new is your strength!' }
                }
            }
        };

        // Генерируем рекомендации на основе слабых измерений
        if (tips[testId]) {
            for (const [dimension, result] of Object.entries(latest.dimensions)) {
                if (tips[testId][dimension]) {
                    const level = result.interpretation.level;
                    const tip = tips[testId][dimension][level];
                    if (tip) {
                        recommendations.push({
                            dimension: result.name,
                            level: level,
                            tip: this.getLocalizedText(tip)
                        });
                    }
                }
            }
        }

        return recommendations;
    }
}

// Глобальный экземпляр
window.detailedTestsService = new DetailedTestsService();
