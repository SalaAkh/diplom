/**
 * Модуль динамического выбора сценариев
 * Адаптивно выбирает следующие вопросы на основе предыдущих ответов пользователя
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class DynamicScenarioSelector {
    constructor(scenarios) {
        this.allScenarios = scenarios;
        // Для быстрого теста используем все сценарии как базовые
        this.baseScenarios = scenarios; // Все 10 сценариев показываются последовательно
        this.adaptiveScenarios = []; // Отключаем адаптивную логику для простоты
    }

    /**
     * Проверка покрытия измерений завершенными сценариями
     * @param {Array} completedScenarios - Завершенные сценарии
     * @param {number} minPerDimension - Минимальное количество сценариев на измерение
     * @returns {Object} Информация о покрытии
     */
    checkCoverage(completedScenarios, minPerDimension = 2) {
        const dimensions = ['strategic', 'explorer', 'individualism', 'rationality', 'control', 'meaning'];
        const coverage = {};

        dimensions.forEach(dim => {
            coverage[dim] = {
                count: 0,
                scenarios: []
            };
        });

        completedScenarios.forEach(scenario => {
            ['optionA', 'optionB', 'optionC', 'optionD'].forEach(optKey => {
                const option = scenario[optKey];
                if (!option || !option.weights) return;

                Object.keys(option.weights).forEach(dimension => {
                    const normalized = this.normalizeDimensionNameForCoverage(dimension);
                    if (coverage[normalized.name]) {
                        if (!coverage[normalized.name].scenarios.includes(scenario.id)) {
                            coverage[normalized.name].count++;
                            coverage[normalized.name].scenarios.push(scenario.id);
                        }
                    }
                });
            });
        });

        const uncoveredDimensions = dimensions.filter(dim => coverage[dim].count < minPerDimension);
        const allCovered = uncoveredDimensions.length === 0;

        return {
            coverage: coverage,
            uncoveredDimensions: uncoveredDimensions,
            allCovered: allCovered,
            minRequired: minPerDimension
        };
    }

    /**
     * Нормализация названия измерения для проверки покрытия
     * @param {string} dimension - Название измерения
     * @returns {Object} Нормализованное измерение
     */
    normalizeDimensionNameForCoverage(dimension) {
        const dimensionMap = {
            'adaptation': { name: 'control', negated: true },
            'tactical': { name: 'strategic', negated: true },
            'intuition': { name: 'rationality', negated: true },
            'collectivism': { name: 'individualism', negated: true },
            'executor': { name: 'explorer', negated: true },
            'utility': { name: 'meaning', negated: true }
        };

        if (dimensionMap[dimension]) {
            return dimensionMap[dimension];
        }

        const validDimensions = ['strategic', 'explorer', 'individualism', 'rationality', 'control', 'meaning'];
        if (validDimensions.includes(dimension)) {
            return { name: dimension, negated: false };
        }

        return { name: dimension, negated: false };
    }

    /**
     * Выбор сценария для покрытия непокрытого измерения
     * @param {Array} availableScenarios - Доступные сценарии
     * @param {string} dimension - Измерение для покрытия
     * @returns {Object|null} Сценарий
     */
    selectScenarioForCoverage(availableScenarios, dimension) {
        const candidates = availableScenarios.filter(scenario => {
            return ['optionA', 'optionB', 'optionC', 'optionD'].some(optKey => {
                const option = scenario[optKey];
                if (!option || !option.weights) return false;

                return Object.keys(option.weights).some(dim => {
                    const normalized = this.normalizeDimensionNameForCoverage(dim);
                    return normalized.name === dimension;
                });
            });
        });

        if (candidates.length === 0) return null;

        // Выбираем случайный из кандидатов
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Выбор следующего сценария на основе текущего состояния
     * @param {Array} completedScenarios - Массив ID завершённых сценариев
     * @param {Array} userChoices - История выборов пользователя
     * @param {Object} currentScores - Текущие оценки по измерениям
     * @returns {Object|null} Следующий сценарий или null, если все пройдены
     */
    selectNextScenario(completedScenarios, userChoices, currentScores) {
        const completedIds = completedScenarios.map(s => s.id || s);

        // Первые 4 сценария показываем в фиксированном порядке
        if (completedIds.length < this.baseScenarios.length) {
            const nextBase = this.baseScenarios[completedIds.length];
            if (nextBase && !completedIds.includes(nextBase.id)) {
                return nextBase;
            }
        }

        // После базовых сценариев используем адаптивную логику
        const availableScenarios = this.adaptiveScenarios.filter(s => !completedIds.includes(s.id));

        if (availableScenarios.length === 0) {
            return null; // Все сценарии пройдены
        }

        // ПРИОРИТЕТ 1: Проверяем покрытие измерений
        const coverage = this.checkCoverage(completedScenarios, 2);
        if (!coverage.allCovered && coverage.uncoveredDimensions.length > 0) {
            // Выбираем сценарий для покрытия непокрытого измерения
            const targetDimension = coverage.uncoveredDimensions[0]; // Берем первое непокрытое
            const coverageScenario = this.selectScenarioForCoverage(availableScenarios, targetDimension);
            if (coverageScenario) {
                return coverageScenario;
            }
        }

        // ПРИОРИТЕТ 2: Адаптивная логика (если покрытие обеспечено)
        // Вычисляем тенденции пользователя
        const tendencies = this.calculateTendencies(currentScores);

        // Определяем стратегию выбора
        const strategy = this.determineStrategy(tendencies, userChoices, completedIds.length);

        // Выбираем сценарий по стратегии
        return this.selectByStrategy(availableScenarios, tendencies, strategy, userChoices);
    }

    /**
     * Вычисление тенденций по всем измерениям
     * @param {Object} scores - Текущие оценки
     * @returns {Object} Объект с тенденциями по каждому измерению
     */
    calculateTendencies(scores) {
        const tendencies = {};

        Object.keys(scores).forEach(dimension => {
            const score = scores[dimension] || 0;
            tendencies[dimension] = {
                value: score,
                strength: Math.abs(score),
                direction: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
                isStrong: Math.abs(score) > 0.5,
                isModerate: Math.abs(score) > 0.2 && Math.abs(score) <= 0.5
            };
        });

        return tendencies;
    }

    /**
     * Определение стратегии выбора следующего сценария
     * @param {Object} tendencies - Тенденции пользователя
     * @param {Array} userChoices - История выборов
     * @param {number} completedCount - Количество пройденных сценариев
     * @returns {string} Стратегия: 'reinforce', 'challenge', 'balance', 'explore'
     */
    determineStrategy(tendencies, userChoices, completedCount) {
        // Если прошло мало сценариев, используем исследовательскую стратегию
        if (completedCount < 6) {
            return 'explore';
        }

        // Проверяем наличие сильных тенденций
        const strongTendencies = Object.values(tendencies).filter(t => t.isStrong);

        if (strongTendencies.length >= 3) {
            // Если много сильных тенденций, проверяем их с другой стороны
            return 'challenge';
        }

        // Проверяем консистентность выборов
        const consistency = this.calculateConsistency(userChoices);

        if (consistency > 0.7) {
            // Если выборы очень консистентны, проверяем с другой стороны
            return 'challenge';
        } else if (consistency < 0.4) {
            // Если выборы противоречивы, усиливаем выявленные паттерны
            return 'reinforce';
        }

        // Проверяем баланс измерений
        const balance = this.calculateBalance(tendencies);

        if (balance < 0.3) {
            // Если профиль несбалансирован, проверяем противоположные измерения
            return 'balance';
        }

        // По умолчанию усиливаем тенденции
        return 'reinforce';
    }

    /**
     * Выбор сценария по стратегии
     * @param {Array} availableScenarios - Доступные сценарии
     * @param {Object} tendencies - Тенденции пользователя
     * @param {string} strategy - Стратегия выбора
     * @param {Array} userChoices - История выборов
     * @returns {Object} Выбранный сценарий
     */
    selectByStrategy(availableScenarios, tendencies, strategy, userChoices) {
        switch (strategy) {
            case 'challenge':
                return this.findChallengingScenario(availableScenarios, tendencies);
            case 'reinforce':
                return this.findReinforcingScenario(availableScenarios, tendencies);
            case 'balance':
                return this.findBalancingScenario(availableScenarios, tendencies);
            case 'explore':
            default:
                return this.findExploringScenario(availableScenarios, userChoices);
        }
    }

    /**
     * Поиск сценария, проверяющего выявленную тенденцию
     * @param {Array} scenarios - Доступные сценарии
     * @param {Object} tendencies - Тенденции пользователя
     * @returns {Object} Сценарий
     */
    findChallengingScenario(scenarios, tendencies) {
        // Находим сильные тенденции
        const strongTendencies = Object.entries(tendencies)
            .filter(([_, t]) => t.isStrong)
            .map(([dim, t]) => ({ dimension: dim, ...t }));

        if (strongTendencies.length === 0) {
            return this.findExploringScenario(scenarios, []);
        }

        // Выбираем случайную сильную тенденцию для проверки
        const targetTendency = strongTendencies[Math.floor(Math.random() * strongTendencies.length)];

        // Ищем сценарий, который проверяет противоположную сторону
        const challengingScenarios = scenarios.filter(scenario => {
            return this.scenarioChallengesTendency(scenario, targetTendency);
        });

        if (challengingScenarios.length > 0) {
            // Выбираем случайный из проверяющих сценариев
            return challengingScenarios[Math.floor(Math.random() * challengingScenarios.length)];
        }

        // Если не нашли, возвращаем случайный
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    /**
     * Проверка, проверяет ли сценарий тенденцию
     * @param {Object} scenario - Сценарий
     * @param {Object} tendency - Тенденция
     * @returns {boolean}
     */
    scenarioChallengesTendency(scenario, tendency) {
        // Проверяем все варианты сценария
        const options = [scenario.optionA, scenario.optionB, scenario.optionC, scenario.optionD].filter(Boolean);

        return options.some(option => {
            if (!option.weights) return false;

            // Нормализуем название измерения
            const normalized = this.normalizeDimensionName(tendency.dimension, option.weights);

            // Проверяем, есть ли вариант, который противоречит тенденции
            if (normalized) {
                const weight = option.weights[normalized.key] || 0;
                // Если тенденция положительная, ищем отрицательный вес, и наоборот
                if (tendency.direction === 'positive' && weight < -0.3) return true;
                if (tendency.direction === 'negative' && weight > 0.3) return true;
            }

            return false;
        });
    }

    /**
     * Нормализация названия измерения для поиска в весах
     * @param {string} dimension - Название измерения
     * @param {Object} weights - Веса варианта
     * @returns {Object|null} Информация о нормализованном измерении
     */
    normalizeDimensionName(dimension, weights) {
        // Проверяем прямое совпадение
        if (weights[dimension] !== undefined) {
            return { key: dimension, negated: false };
        }

        // Проверяем альтернативные названия
        const alternatives = {
            'strategic': ['tactical'],
            'explorer': ['executor'],
            'individualism': ['collectivism'],
            'rationality': ['intuition', 'systematic'],
            'control': ['adaptation'],
            'meaning': ['utility']
        };

        if (alternatives[dimension]) {
            for (const alt of alternatives[dimension]) {
                if (weights[alt] !== undefined) {
                    return { key: alt, negated: true };
                }
            }
        }

        return null;
    }

    /**
     * Поиск сценария, усиливающего выявленную тенденцию
     * @param {Array} scenarios - Доступные сценарии
     * @param {Object} tendencies - Тенденции пользователя
     * @returns {Object} Сценарий
     */
    findReinforcingScenario(scenarios, tendencies) {
        // Находим умеренные тенденции для усиления
        const moderateTendencies = Object.entries(tendencies)
            .filter(([_, t]) => t.isModerate)
            .map(([dim, t]) => ({ dimension: dim, ...t }));

        if (moderateTendencies.length === 0) {
            return this.findExploringScenario(scenarios, []);
        }

        // Выбираем случайную умеренную тенденцию
        const targetTendency = moderateTendencies[Math.floor(Math.random() * moderateTendencies.length)];

        // Ищем сценарий, который усиливает эту тенденцию
        const reinforcingScenarios = scenarios.filter(scenario => {
            return this.scenarioReinforcesTendency(scenario, targetTendency);
        });

        if (reinforcingScenarios.length > 0) {
            return reinforcingScenarios[Math.floor(Math.random() * reinforcingScenarios.length)];
        }

        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    /**
     * Проверка, усиливает ли сценарий тенденцию
     * @param {Object} scenario - Сценарий
     * @param {Object} tendency - Тенденция
     * @returns {boolean}
     */
    scenarioReinforcesTendency(scenario, tendency) {
        const options = [scenario.optionA, scenario.optionB, scenario.optionC, scenario.optionD].filter(Boolean);

        return options.some(option => {
            if (!option.weights) return false;

            const normalized = this.normalizeDimensionName(tendency.dimension, option.weights);

            if (normalized) {
                const weight = option.weights[normalized.key] || 0;
                const effectiveWeight = normalized.negated ? -weight : weight;

                // Если тенденция положительная, ищем положительный вес, и наоборот
                if (tendency.direction === 'positive' && effectiveWeight > 0.4) return true;
                if (tendency.direction === 'negative' && effectiveWeight < -0.4) return true;
            }

            return false;
        });
    }

    /**
     * Поиск сценария для балансировки профиля
     * @param {Array} scenarios - Доступные сценарии
     * @param {Object} tendencies - Тенденции пользователя
     * @returns {Object} Сценарий
     */
    findBalancingScenario(scenarios, tendencies) {
        // Находим измерение с наименьшей выраженностью
        const weakTendencies = Object.entries(tendencies)
            .filter(([_, t]) => !t.isStrong && !t.isModerate)
            .map(([dim, t]) => ({ dimension: dim, ...t }));

        if (weakTendencies.length === 0) {
            return this.findExploringScenario(scenarios, []);
        }

        // Выбираем случайное слабое измерение
        const targetTendency = weakTendencies[Math.floor(Math.random() * weakTendencies.length)];

        // Ищем сценарий, который проверяет это измерение
        const balancingScenarios = scenarios.filter(scenario => {
            return this.scenarioTestsDimension(scenario, targetTendency.dimension);
        });

        if (balancingScenarios.length > 0) {
            return balancingScenarios[Math.floor(Math.random() * balancingScenarios.length)];
        }

        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    /**
     * Проверка, тестирует ли сценарий измерение
     * @param {Object} scenario - Сценарий
     * @param {string} dimension - Измерение
     * @returns {boolean}
     */
    scenarioTestsDimension(scenario, dimension) {
        const options = [scenario.optionA, scenario.optionB, scenario.optionC, scenario.optionD].filter(Boolean);

        return options.some(option => {
            if (!option.weights) return false;

            const normalized = this.normalizeDimensionName(dimension, option.weights);
            return normalized !== null && Math.abs(option.weights[normalized.key] || 0) > 0.3;
        });
    }

    /**
     * Поиск сценария для исследования (случайный из непроверенных)
     * @param {Array} scenarios - Доступные сценарии
     * @param {Array} userChoices - История выборов
     * @returns {Object} Сценарий
     */
    findExploringScenario(scenarios, userChoices) {
        // Если есть сценарии, которые ещё не показывались, выбираем их
        // Иначе возвращаем случайный
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    /**
     * Вычисление консистентности выборов
     * @param {Array} choices - История выборов
     * @returns {number} Консистентность от 0 до 1
     */
    calculateConsistency(choices) {
        if (choices.length < 2) return 0.5;

        // Анализируем паттерны выборов
        const choicePatterns = {};
        choices.forEach(choice => {
            const key = `${choice.scenarioId}_${choice.choice}`;
            choicePatterns[key] = (choicePatterns[key] || 0) + 1;
        });

        // Вычисляем, насколько часто повторяются одинаковые паттерны
        const totalChoices = choices.length;
        const uniquePatterns = Object.keys(choicePatterns).length;

        // Чем меньше уникальных паттернов, тем выше консистентность
        return 1 - (uniquePatterns / totalChoices);
    }

    /**
     * Вычисление баланса профиля
     * @param {Object} tendencies - Тенденции
     * @returns {number} Баланс от 0 до 1
     */
    calculateBalance(tendencies) {
        const values = Object.values(tendencies).map(t => Math.abs(t.value));
        if (values.length === 0) return 1;

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        // Низкое стандартное отклонение = высокий баланс
        return Math.max(0, 1 - stdDev);
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicScenarioSelector;
}
