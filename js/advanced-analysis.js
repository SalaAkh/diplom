/**
 * Расширенный модуль анализа личности
 * Поддерживает комплексный анализ различных типов вопросов: сценарии, шкалы, открытые вопросы, ситуационные задачи
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class AdvancedPersonalityAnalyzer extends PersonalityAnalyzer {
    constructor(questionsData) {
        // Используем questions вместо scenarios для углубленного теста
        const adaptedData = {
            scenarios: questionsData.questions || [],
            dimensions: questionsData.dimensions || {}
        };
        super(adaptedData);
        this.questionsData = questionsData;
        this.scaleAnswers = []; // Ответы на шкалы
        this.openAnswers = []; // Ответы на открытые вопросы
        this.situationalAnswers = []; // Ответы на ситуационные задачи
        this.advancedScores = {}; // Расширенные оценки
        this.crossValidation = {}; // Кросс-валидация результатов
        this.confidenceScores = {}; // Уровни достоверности
    }

    /**
     * Сброс результатов анализа
     */
    reset() {
        super.reset();
        this.scaleAnswers = [];
        this.openAnswers = [];
        this.situationalAnswers = [];
        this.advancedScores = {};
        this.crossValidation = {};
        this.confidenceScores = {};
    }

    /**
     * Регистрация ответа на шкалу
     * @param {number} questionId - ID вопроса
     * @param {number} value - Значение от min до max
     */
    recordScaleAnswer(questionId, value) {
        const question = this.questionsData.questions.find(q => q.id === questionId);
        if (!question || question.type !== 'scale') return;

        const scale = question.scale;
        const normalizedValue = Math.max(scale.min, Math.min(scale.max, value));
        
        // Получаем веса для этого значения
        const weights = question.weights[normalizedValue.toString()];
        if (!weights) return;

        this.scaleAnswers.push({
            questionId,
            value: normalizedValue,
            weights: weights
        });

        // Обновляем оценки
        Object.keys(weights).forEach(dimension => {
            const weight = weights[dimension];
            const normalizedDim = this.normalizeDimensionName(dimension);
            const baseDimension = normalizedDim.name;
            
            if (normalizedDim.negated) {
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] -= weight;
                }
            } else {
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] += weight;
                }
            }
        });
    }

    /**
     * Регистрация ответа на открытый вопрос
     * @param {number} questionId - ID вопроса
     * @param {string} text - Текст ответа
     */
    recordOpenAnswer(questionId, text) {
        const question = this.questionsData.questions.find(q => q.id === questionId);
        if (!question || question.type !== 'open') return;

        this.openAnswers.push({
            questionId,
            text: text.trim()
        });

        // Анализ текста для извлечения паттернов
        const analysis = this.analyzeOpenAnswer(question, text);
        
        // Обновляем оценки на основе анализа
        Object.keys(analysis.weights).forEach(dimension => {
            const weight = analysis.weights[dimension];
            const normalizedDim = this.normalizeDimensionName(dimension);
            const baseDimension = normalizedDim.name;
            
            if (normalizedDim.negated) {
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] -= weight;
                }
            } else {
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] += weight;
                }
            }
        });
    }

    /**
     * Анализ открытого ответа (простой NLP)
     * @param {Object} question - Вопрос
     * @param {string} text - Текст ответа
     * @returns {Object} Анализ с весами
     */
    analyzeOpenAnswer(question, text) {
        const analysis = {
            weights: {},
            keywords: {},
            sentiment: 0 // -1 до 1
        };

        if (!text || text.length === 0) return analysis;

        const lowerText = text.toLowerCase();
        const keywords = question.keywords || {};

        // Поиск ключевых слов для каждого измерения
        Object.keys(keywords).forEach(dimension => {
            const dimensionKeywords = keywords[dimension];
            let matchCount = 0;
            
            dimensionKeywords.forEach(keyword => {
                const lowerKeyword = keyword.toLowerCase();
                // Простой поиск подстроки
                const regex = new RegExp(lowerKeyword, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    matchCount += matches.length;
                }
            });

            if (matchCount > 0) {
                // Нормализуем количество совпадений в вес (0.1 - 0.8)
                const weight = Math.min(0.8, 0.1 + (matchCount * 0.1));
                analysis.weights[dimension] = weight;
                analysis.keywords[dimension] = matchCount;
            }
        });

        // Простой анализ тональности (положительные/отрицательные слова)
        const positiveWords = ['хорошо', 'отлично', 'нравится', 'люблю', 'интересно', 'важно', 'хороший', 'отличный', 'интересный', 'важный', 'жақсы', 'керемет', 'ұнайды', 'жақсы', 'қызықты', 'маңызды', 'good', 'excellent', 'like', 'love', 'interesting', 'important'];
        const negativeWords = ['плохо', 'не нравится', 'не люблю', 'скучно', 'не важно', 'плохой', 'скучный', 'жаман', 'ұнатпаймын', 'қызықсыз', 'bad', 'dislike', 'hate', 'boring', 'unimportant'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            if (regex.test(lowerText)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            if (regex.test(lowerText)) negativeCount++;
        });

        if (positiveCount + negativeCount > 0) {
            analysis.sentiment = (positiveCount - negativeCount) / (positiveCount + negativeCount);
        }

        return analysis;
    }

    /**
     * Регистрация ответа на ситуационную задачу
     * @param {number} questionId - ID вопроса
     * @param {number} stepId - ID шага
     * @param {string} choice - Выбор ('A', 'B', 'C')
     */
    recordSituationalAnswer(questionId, stepId, choice) {
        const question = this.questionsData.questions.find(q => q.id === questionId);
        if (!question || question.type !== 'situational') return;

        const step = question.steps.find(s => s.stepId === stepId);
        if (!step) return;

        const option = step.options[choice];
        if (!option) return;

        // Проверяем, есть ли уже ответы для этого вопроса
        let situationalAnswer = this.situationalAnswers.find(sa => sa.questionId === questionId);
        if (!situationalAnswer) {
            situationalAnswer = {
                questionId,
                steps: []
            };
            this.situationalAnswers.push(situationalAnswer);
        }

        situationalAnswer.steps.push({
            stepId,
            choice,
            weights: option.weights
        });

        // Обновляем оценки
        Object.keys(option.weights).forEach(dimension => {
            const weight = option.weights[dimension];
            const normalizedDim = this.normalizeDimensionName(dimension);
            const baseDimension = normalizedDim.name;
            
            if (normalizedDim.negated) {
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] -= weight;
                }
            } else {
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] += weight;
                }
            }
        });

        // Если все шаги пройдены, применяем финальные веса
        if (situationalAnswer.steps.length === question.steps.length && question.finalWeights) {
            Object.keys(question.finalWeights).forEach(dimension => {
                const weight = question.finalWeights[dimension];
                const normalizedDim = this.normalizeDimensionName(dimension);
                const baseDimension = normalizedDim.name;
                
                if (this.scores[baseDimension] !== undefined) {
                    this.scores[baseDimension] += weight * 0.3; // Финальные веса имеют меньший вес
                }
            });
        }
    }

    /**
     * Регистрация выбора для сценария (переопределение базового метода)
     * @param {number} questionId - ID вопроса
     * @param {string} choice - 'A', 'B', 'C' или 'D'
     */
    recordChoice(questionId, choice) {
        const question = this.questionsData.questions.find(q => q.id === questionId);
        if (!question) return;

        // Если это сценарий, используем базовый метод
        if (question.type === 'scenario') {
            // Адаптируем структуру для базового класса
            const adaptedQuestion = {
                id: questionId,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                optionD: question.optionD
            };
            
            // Временно заменяем scenariosData для вызова базового метода
            const originalScenarios = this.scenariosData.scenarios;
            this.scenariosData.scenarios = [adaptedQuestion];
            super.recordChoice(questionId, choice);
            this.scenariosData.scenarios = originalScenarios;
        }
    }

    /**
     * Кросс-валидация результатов между разными типами вопросов
     * @returns {Object} Результаты валидации
     */
    crossValidateResults() {
        const validation = {
            consistency: {},
            conflicts: [],
            confidence: {}
        };

        // Группируем ответы по измерениям
        const dimensionScores = {};
        Object.keys(this.dimensions).forEach(dim => {
            dimensionScores[dim] = {
                scenarios: [],
                scales: [],
                open: [],
                situational: []
            };
        });

        // Собираем оценки из разных типов вопросов
        this.choices.forEach(choice => {
            if (choice.weights) {
                Object.keys(choice.weights).forEach(dim => {
                    const normalized = this.normalizeDimensionName(dim);
                    const baseDim = normalized.name;
                    if (dimensionScores[baseDim]) {
                        dimensionScores[baseDim].scenarios.push(choice.weights[dim]);
                    }
                });
            }
        });

        this.scaleAnswers.forEach(answer => {
            if (answer.weights) {
                Object.keys(answer.weights).forEach(dim => {
                    const normalized = this.normalizeDimensionName(dim);
                    const baseDim = normalized.name;
                    if (dimensionScores[baseDim]) {
                        dimensionScores[baseDim].scales.push(answer.weights[dim]);
                    }
                });
            }
        });

        // Вычисляем согласованность для каждого измерения
        Object.keys(dimensionScores).forEach(dim => {
            const scores = dimensionScores[dim];
            const allScores = [
                ...scores.scenarios,
                ...scores.scales,
                ...scores.open,
                ...scores.situational
            ];

            if (allScores.length > 1) {
                // Вычисляем стандартное отклонение как меру согласованности
                const mean = allScores.reduce((a, b) => a + b, 0) / allScores.length;
                const variance = allScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / allScores.length;
                const stdDev = Math.sqrt(variance);
                
                // Нормализуем в диапазон 0-1 (меньше отклонение = больше согласованность)
                const consistency = Math.max(0, 1 - (stdDev / 2));
                validation.consistency[dim] = consistency;
                
                // Уровень достоверности (чем больше согласованность и больше ответов, тем выше достоверность)
                const confidence = Math.min(1, consistency * (1 + Math.log10(allScores.length) / 2));
                validation.confidence[dim] = confidence;
            } else {
                validation.consistency[dim] = 0.5; // Средняя согласованность при недостатке данных
                validation.confidence[dim] = 0.3; // Низкая достоверность
            }
        });

        this.crossValidation = validation;
        return validation;
    }

    /**
     * Получение нормализованных оценок с учетом всех типов вопросов
     * @returns {Object} Нормализованные оценки
     */
    getNormalizedScores() {
        // Сначала получаем базовые нормализованные оценки
        const baseScores = super.getNormalizedScores();
        
        // Выполняем кросс-валидацию
        const validation = this.crossValidateResults();
        
        // Применяем коррекцию на основе достоверности
        const correctedScores = {};
        Object.keys(baseScores).forEach(dim => {
            const baseScore = baseScores[dim];
            const confidence = validation.confidence[dim] || 0.5;
            
            // Если достоверность низкая, уменьшаем уверенность в результате
            // (оценка остается, но мы знаем, что она менее надежна)
            correctedScores[dim] = baseScore;
            this.confidenceScores[dim] = confidence;
        });

        return correctedScores;
    }

    /**
     * Генерация расширенного профиля
     * @returns {Object} Расширенный профиль
     */
    generateAdvancedProfile() {
        const baseProfile = this.generateProfile();
        const normalizedScores = this.getNormalizedScores();
        const validation = this.crossValidateResults();

        // Добавляем расширенную информацию
        const advancedProfile = {
            ...baseProfile,
            advanced: {
                totalQuestions: this.getTotalQuestionsCount(),
                questionTypes: {
                    scenarios: this.choices.length,
                    scales: this.scaleAnswers.length,
                    open: this.openAnswers.length,
                    situational: this.situationalAnswers.length
                },
                consistency: validation.consistency,
                confidence: validation.confidence,
                crossValidation: validation,
                detailedAnalysis: this.generateDetailedAnalysis(normalizedScores)
            }
        };

        return advancedProfile;
    }

    /**
     * Получение общего количества вопросов
     * @returns {number}
     */
    getTotalQuestionsCount() {
        return this.choices.length + 
               this.scaleAnswers.length + 
               this.openAnswers.length + 
               this.situationalAnswers.length;
    }

    /**
     * Генерация детального анализа
     * @param {Object} scores - Нормализованные оценки
     * @returns {Object} Детальный анализ
     */
    generateDetailedAnalysis(scores) {
        const analysis = {
            strengths: [],
            weaknesses: [],
            balanced: [],
            recommendations: []
        };

        Object.keys(scores).forEach(dim => {
            const score = scores[dim];
            const confidence = this.confidenceScores[dim] || 0.5;
            const dimInfo = this.dimensions[dim];
            
            // Учитываем достоверность при определении сильных/слабых сторон
            const effectiveScore = score * confidence;
            
            if (effectiveScore > 0.5) {
                analysis.strengths.push({
                    dimension: dim,
                    score: score,
                    confidence: confidence,
                    name: this.getTranslatedText(dimInfo.name)
                });
            } else if (effectiveScore < -0.5) {
                analysis.weaknesses.push({
                    dimension: dim,
                    score: score,
                    confidence: confidence,
                    name: this.getTranslatedText(dimInfo.name)
                });
            } else {
                analysis.balanced.push({
                    dimension: dim,
                    score: score,
                    confidence: confidence,
                    name: this.getTranslatedText(dimInfo.name)
                });
            }
        });

        // Генерация рекомендаций на основе анализа
        if (analysis.strengths.length > 0) {
            analysis.recommendations.push({
                type: 'leverage',
                text: 'Используйте свои сильные стороны для достижения целей',
                dimensions: analysis.strengths.map(s => s.name)
            });
        }

        if (analysis.weaknesses.length > 0) {
            analysis.recommendations.push({
                type: 'develop',
                text: 'Развивайте области, которые требуют улучшения',
                dimensions: analysis.weaknesses.map(w => w.name)
            });
        }

        return analysis;
    }

    /**
     * Получение статистики по всем типам вопросов
     * @returns {Object} Статистика
     */
    getAdvancedStatistics() {
        const baseStats = this.getStatistics();
        
        return {
            ...baseStats,
            questionTypes: {
                scenarios: this.choices.length,
                scales: this.scaleAnswers.length,
                open: this.openAnswers.length,
                situational: this.situationalAnswers.length
            },
            averageConfidence: this.getAverageConfidence(),
            consistency: this.crossValidation.consistency || {}
        };
    }

    /**
     * Получение среднего уровня достоверности
     * @returns {number}
     */
    getAverageConfidence() {
        const confidences = Object.values(this.confidenceScores);
        if (confidences.length === 0) return 0.5;
        
        return confidences.reduce((a, b) => a + b, 0) / confidences.length;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPersonalityAnalyzer;
}
