/**
 * Модуль анализа паттернов мышления
 * Анализирует выборы пользователя и вычисляет профиль по различным измерениям
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class PersonalityAnalyzer {
    constructor(scenariosData) {
        this.scenariosData = scenariosData;
        this.dimensions = scenariosData.dimensions;
        this.reset();
    }

    /**
     * Получение переведенного текста из объекта с переводами
     * @param {Object|string} field - Поле с переводами или строка
     * @param {string} lang - Код языка (kk, ru, en), по умолчанию ru
     * @returns {string} Текст на указанном языке
     */
    getTranslatedText(field, lang = 'ru') {
        if (!field || field === null || field === undefined) {
            return '';
        }

        // Если это уже строка, возвращаем как есть
        if (typeof field === 'string') {
            return field;
        }

        // Если это объект с переводами
        if (typeof field === 'object' && !Array.isArray(field)) {
            // Пробуем получить перевод для указанного языка, затем fallback на другие
            return field[lang] || field['ru'] || field['kk'] || field['en'] || String(field) || '';
        }

        return '';
    }

    /**
     * Сброс результатов анализа
     */
    reset() {
        this.choices = [];
        this.scores = {};

        // Список обязательных измерений для корректной работы
        const requiredDimensions = [
            'strategic', 'explorer', 'individualism', 'rationality',
            'adaptation', 'meaning', 'intuition', 'utility', 'control'
        ];

        // Инициализация оценок из данных
        if (this.dimensions) {
            Object.keys(this.dimensions).forEach(dimension => {
                this.scores[dimension] = 0;
            });
        }

        // Доинициализация отсутствующих обязательных измерений
        requiredDimensions.forEach(dim => {
            if (this.scores[dim] === undefined) {
                this.scores[dim] = 0;
                // console.warn(`Dimension ${dim} was auto-initialized via fallback`);
            }
        });
    }

    /**
     * Регистрация выбора пользователя
     * @param {number} scenarioId - ID сценария
     * @param {string} choice - 'A', 'B', 'C' или 'D'
     */
    recordChoice(scenarioId, choice) {
        const scenario = this.scenariosData.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        // Определяем выбранный вариант
        let option;
        if (choice === 'A') option = scenario.optionA;
        else if (choice === 'B') option = scenario.optionB;
        else if (choice === 'C') option = scenario.optionC;
        else if (choice === 'D') option = scenario.optionD;
        else return; // Некорректный выбор

        if (!option) return; // Вариант не существует

        this.choices.push({
            scenarioId,
            choice,
            weights: option.weights
        });

        // Обновление оценок с обработкой новых и старых названий измерений
        Object.keys(option.weights).forEach(dimension => {
            const weight = option.weights[dimension];

            // Валидация веса
            if (typeof weight !== 'number' || isNaN(weight)) {
                console.warn('Өлшем үшін жарамсыз салмақ (Invalid weight for dimension):', dimension, weight);
                return;
            }

            // Преобразуем старые названия в новые, если необходимо
            const normalizedDimension = this.normalizeDimensionName(dimension);
            const baseDimension = normalizedDimension.name;

            // Проверяем, что измерение существует в scores
            if (this.scores[baseDimension] === undefined) {
                console.warn('Өлшем ұпайлардан табылмады (Dimension not found in scores):', baseDimension);
                return;
            }

            // Обрабатываем отрицательные измерения (например, "adaptation" = -control)
            if (normalizedDimension.negated) {
                this.scores[baseDimension] -= weight; // Инвертируем для отрицательного измерения
            } else {
                this.scores[baseDimension] += weight;
            }
        });
    }

    /**
     * Нормализация названия измерения (обработка новых и старых названий)
     * Упрощенная и более надежная версия
     * @param {string} dimension - Название измерения из весов
     * @returns {Object} Объект с нормализованным именем и флагом инверсии
     */
    normalizeDimensionName(dimension) {
        if (!dimension || typeof dimension !== 'string') {
            console.warn('Өлшем атауы жарамсыз (Invalid dimension name):', dimension);
            return { name: dimension || 'unknown', negated: false };
        }

        // Список валидных измерений (8 основных)
        const validDimensions = [
            'strategic', 'explorer', 'individualism', 'rationality',
            'adaptation', 'meaning', 'intuition', 'utility'
        ];

        // Если измерение уже валидное, возвращаем как есть
        if (validDimensions.includes(dimension)) {
            return { name: dimension, negated: false };
        }

        // Маппинг старых и альтернативных названий на новые 8 измерений
        // Структура: 'старое_название': { name: 'новое_название', negated: true/false }
        const dimensionMap = {
            // Прямые маппинги (без инверсии)
            'systematic': { name: 'rationality', negated: false },
            'exploration': { name: 'explorer', negated: false },

            // Инвертированные маппинги (обратная сторона измерений)
            'peopleOriented': { name: 'individualism', negated: true }, // peopleOriented = -individualism
            'tactical': { name: 'strategic', negated: true }, // tactical = -strategic
            'collectivism': { name: 'individualism', negated: true }, // collectivism = -individualism
            'executor': { name: 'explorer', negated: true }, // executor = -explorer

            // Синонимы
            'control': { name: 'rationality', negated: false },
            'riskTolerance': { name: 'adaptation', negated: false }
        };

        // Проверяем маппинг
        const mapping = dimensionMap[dimension];
        if (mapping) {
            // Проверяем, что результат маппинга валидный
            if (validDimensions.includes(mapping.name)) {
                return mapping;
            } else {
                console.warn('Өлшемді сәйкестендіру жарамсыз өлшемге әкеледі (Dimension mapping leads to invalid dimension):', dimension, '->', mapping.name);
            }
        }

        // Если измерение не распознано, логируем предупреждение и возвращаем как есть
        console.warn('Белгісіз өлшем (Unknown dimension):', dimension, '. Сол күйінде қолданылады (Used as is).');
        return { name: dimension, negated: false };
    }

    /**
     * Проверка полноты покрытия измерений
     * @returns {Object} Информация о покрытии каждого измерения
     */
    checkCoverage() {
        const coverage = {};
        const dimensionCounts = {};

        // Инициализация счетчиков
        Object.keys(this.dimensions).forEach(dim => {
            dimensionCounts[dim] = 0;
        });

        // Подсчет количества вопросов, затрагивающих каждое измерение
        this.choices.forEach(choice => {
            if (choice.weights) {
                Object.keys(choice.weights).forEach(dimension => {
                    const normalized = this.normalizeDimensionName(dimension);
                    const baseDimension = normalized.name;
                    if (dimensionCounts[baseDimension] !== undefined) {
                        dimensionCounts[baseDimension]++;
                    }
                });
            }
        });

        // Вычисление покрытия
        Object.keys(this.dimensions).forEach(dim => {
            const count = dimensionCounts[dim] || 0;
            const totalChoices = this.choices.length;
            coverage[dim] = {
                count: count,
                coverage: totalChoices > 0 ? count / totalChoices : 0,
                isCovered: count > 0
            };
        });

        return coverage;
    }

    /**
     * Коррекция на эффект последовательности (order effect)
     * Первые и последние вопросы могут влиять по-разному
     * @param {number} rawScore - Сырая оценка
     * @param {number} position - Позиция вопроса (0-based)
     * @param {number} totalQuestions - Общее количество вопросов
     * @returns {number} Скорректированная оценка
     */
    correctForOrderEffect(rawScore, position, totalQuestions) {
        if (totalQuestions < 3) return rawScore; // Недостаточно данных для коррекции

        // Эффект первичности (первые вопросы имеют больший вес)
        // Эффект новизны (последние вопросы также важны)
        const normalizedPosition = position / totalQuestions;

        // Вес вопроса в зависимости от позиции (U-образная кривая)
        let weight = 1.0;
        if (normalizedPosition < 0.2) {
            // Первые 20% вопросов - эффект первичности
            weight = 1.0 + (0.2 - normalizedPosition) * 0.3;
        } else if (normalizedPosition > 0.8) {
            // Последние 20% вопросов - эффект новизны
            weight = 1.0 + (normalizedPosition - 0.8) * 0.3;
        }

        return rawScore * weight;
    }

    /**
     * Нормализация оценок в диапазон [-1, 1] с улучшениями
     * Учитывает полноту покрытия и эффект последовательности
     * @returns {Object} Нормализованные оценки
     */
    getNormalizedScores() {
        const normalized = {};
        const coverage = this.checkCoverage();
        const totalChoices = this.choices.length;

        if (totalChoices === 0) {
            // Если нет выборов, возвращаем нулевые оценки
            Object.keys(this.dimensions).forEach(dimension => {
                normalized[dimension] = 0;
            });
            return normalized;
        }

        // Вычисляем скорректированные оценки с учетом эффекта последовательности
        const adjustedScores = {};
        Object.keys(this.scores).forEach(dimension => {
            adjustedScores[dimension] = 0;
        });

        // Пересчитываем с учетом позиции вопроса
        this.choices.forEach((choice, index) => {
            if (choice.weights) {
                Object.keys(choice.weights).forEach(dimension => {
                    const normalizedDim = this.normalizeDimensionName(dimension);
                    const baseDimension = normalizedDim.name;
                    const weight = choice.weights[dimension];
                    const effectiveWeight = normalizedDim.negated ? -weight : weight;

                    // Коррекция на эффект последовательности
                    const correctedWeight = this.correctForOrderEffect(
                        effectiveWeight,
                        index,
                        totalChoices
                    );

                    if (adjustedScores[baseDimension] !== undefined) {
                        adjustedScores[baseDimension] += correctedWeight;
                    }
                });
            }
        });

        // Нормализация с учетом покрытия
        Object.keys(this.dimensions).forEach(dimension => {
            const rawScore = adjustedScores[dimension] || 0;
            const dimCoverage = coverage[dimension];

            // Если измерение не покрыто, возвращаем 0
            if (!dimCoverage.isCovered) {
                normalized[dimension] = 0;
                return;
            }

            // Нормализация с учетом количества вопросов, затрагивающих это измерение
            // Используем фактическое количество вопросов для этого измерения, а не общее
            const effectiveCount = Math.max(1, dimCoverage.count);

            // Нормализация: делим на эффективное количество и ограничиваем [-1, 1]
            let normalizedScore = rawScore / effectiveCount;

            // Дополнительная коррекция на полноту покрытия
            // Если измерение покрыто недостаточно, уменьшаем уверенность
            if (dimCoverage.coverage < 0.3) {
                normalizedScore *= dimCoverage.coverage / 0.3; // Масштабируем при низком покрытии
            }

            normalized[dimension] = Math.max(-1, Math.min(1, normalizedScore));
        });

        return normalized;
    }

    /**
     * Получение процентных значений для визуализации
     * @returns {Object} Проценты от -100% до +100%
     */
    getPercentageScores() {
        const normalized = this.getNormalizedScores();
        const percentages = {};

        Object.keys(normalized).forEach(dimension => {
            percentages[dimension] = Math.round(normalized[dimension] * 100);
        });

        return percentages;
    }

    /**
     * Генерация текстового описания профиля
     * @returns {Object} Описание профиля с рекомендациями
     */
    generateProfile() {
        const scores = this.getNormalizedScores();
        const profile = {
            dimensions: {},
            summary: "",
            recommendations: [],
            categories: [],
            developmentVectors: [],
            skillRecommendations: []
        };

        // Determine language for descriptions
        let currentLang = 'ru';
        try {
            if (window.i18n) {
                currentLang = window.i18n.getLanguage();
            } else if (typeof localStorage !== 'undefined') {
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && ['kk', 'ru', 'en'].includes(savedLang)) {
                    currentLang = savedLang;
                }
            }
        } catch (e) {
            // Use 'ru' as default
        }

        const t = (key, params) => (window.t ? window.t(key, params) : key);

        // Analyze each dimension
        Object.keys(this.dimensions).forEach(dimension => {
            const score = scores[dimension];
            const dimensionInfo = this.dimensions[dimension];

            // Get translated names
            const dimensionName = this.getTranslatedText(dimensionInfo.name, currentLang);
            const oppositeName = this.getTranslatedText(dimensionInfo.opposite, currentLang);

            let level, description;
            if (score > 0.5) {
                level = t('analyzerLevelHigh');
                description = t('descStrongSlight', { dimension: dimensionName });
            } else if (score > 0.2) {
                level = t('analyzerLevelModerate');
                description = t('descModerateSlight', { dimension: dimensionName });
            } else if (score < -0.5) {
                level = t('analyzerLevelLow');
                description = t('descPreferOpposite', { opposite: oppositeName });
            } else if (score < -0.2) {
                level = t('analyzerLevelModerateLow');
                description = t('descModerateOpposite', { opposite: oppositeName });
            } else {
                level = t('analyzerLevelBalanced');
                description = t('descBalancedApproach', { dimension: dimensionName, opposite: oppositeName });
            }

            profile.dimensions[dimension] = {
                name: dimensionName,
                score: score,
                percentage: Math.round(score * 100),
                level: level,
                description: description
            };
        });

        // Генерация общего резюме
        profile.summary = this.generateSummary(scores);

        // Вычисление соответствия категориям
        profile.categories = this.calculateCategoryMatch(scores);

        // Генерация векторов развития
        profile.developmentVectors = this.generateDevelopmentVectors(scores);

        // Генерация рекомендаций по навыкам
        profile.skillRecommendations = this.generateSkillRecommendations(scores, profile.categories);

        // Генерация рекомендаций (использует категории)
        profile.recommendations = this.generateRecommendations(scores, profile.categories);

        // Добавляем traits (черты характера) на основе доминирующих измерений
        profile.traits = this.extractTraits(scores, profile.dimensions);

        // Определяем архетип личности
        if (window.archetypeService) {
            profile.archetype = window.archetypeService.determineArchetype(scores);
            // Для обратной совместимости сохраняем имя архетипа в type
            profile.type = profile.archetype.name;
        } else {
            // Fallback: используем название топ-категории
            profile.type = profile.categories.length > 0
                ? profile.categories[0].name
                : (window.t ? window.t('balancedProfile') : "Сбалансированный профиль");
        }

        return profile;
    }

    /**
     * Extract personality traits from scores
     * @param {Object} scores - Normalized scores
     * @param {Object} dimensions - Dimension info from profile
     * @returns {Array} Array of trait strings
     */
    extractTraits(scores, dimensions) {
        const traits = [];

        // For each dimension with strong score, add a trait
        Object.keys(dimensions).forEach(dim => {
            const dimInfo = dimensions[dim];
            const score = dimInfo.score;

            if (score > 0.3) {
                traits.push(dimInfo.name);
            } else if (score < -0.3 && dimInfo.description) {
                // Extract opposite trait from description
                const desc = dimInfo.description;
                if (desc.includes('предпочитаете')) {
                    const match = desc.match(/предпочитаете\s+([^.]+)/);
                    if (match) traits.push(match[1]);
                }
            }
        });

        // If no strong traits, add balanced
        if (traits.length === 0) {
            traits.push(window.t ? window.t('balancedApproach') : "Сбалансированный подход");
        }

        return traits.slice(0, 5); // Max 5 traits
    }

    /**
     * Генерация общего резюме профиля
     */
    generateSummary(scores) {
        const t = (key) => (window.t ? window.t(key) : key);
        const traits = [];
        const strengths = [];

        // Рациональность
        if (scores.rationality > 0.3) {
            traits.push(t('traitRational'));
            strengths.push(t('strengthLogical'));
        }

        // Интуиция
        if (scores.intuition > 0.3) {
            traits.push(t('traitIntuitive'));
            strengths.push(t('strengthIntuitive'));
        }

        // Индивидуализм
        if (scores.individualism > 0.3) {
            traits.push(t('traitIndependent'));
            strengths.push(t('strengthIndependent'));
        } else if (scores.individualism < -0.3) {
            traits.push(t('traitCollectivist'));
            strengths.push(t('strengthTeamwork'));
        }

        // Стратегическое мышление
        if (scores.strategic > 0.3) {
            traits.push(t('traitStrategic'));
            strengths.push(t('strengthPlanning'));
        }

        // Адаптивность
        if (scores.adaptation > 0.3) {
            traits.push(t('traitAdaptive'));
            strengths.push(t('strengthFlexibility'));
        }

        // Смысл
        if (scores.meaning > 0.3) {
            traits.push(t('traitMeaning'));
            strengths.push(t('strengthValues'));
        }

        // Прагматизм (Utility)
        if (scores.utility > 0.3) {
            traits.push(t('traitPragmatic'));
            strengths.push(t('strengthResult'));
        }

        // Исследователь
        if (scores.explorer > 0.3) {
            traits.push(t('traitExplorer'));
            strengths.push(t('strengthCuriosity'));
        }

        let summary = "";
        if (traits.length === 0) {
            summary = t('summaryBalanced');
        } else {
            summary = `${t('summaryIntro')} ${traits.join(", ")}.`;
        }

        if (strengths.length > 0) {
            summary += ` ${t('summaryStrengths')} ${strengths.join(", ")}.`;
        }

        return summary;
    }

    /**
     * Вычисление соответствия профиля категориям направлений развития
     * @param {Object} scores - Нормализованные оценки
     * @returns {Array} Массив категорий с matchScore
     */
    calculateCategoryMatch(scores) {
        const t = (key) => (window.t ? window.t(key) : key);
        const categories = [
            {
                id: "research",
                name: t('research'),
                color: "#4a90e2",
                description: t('descResearch'),
                skills: [t('skillAnalytic'), t('skillMethodology'), t('skillCritical')],
                activities: [t('actResearch'), t('actAnalysis'), t('actScience')],
                calculateMatch: (s) => {
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    const rationalityScore = Math.max(0, (s.rationality + 1) / 2);
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    return (explorerScore * 0.4 + rationalityScore * 0.3 + strategicScore * 0.3);
                }
            },
            {
                id: "creativity",
                name: t('creativity'),
                color: "#7b68ee",
                description: t('descCreativity'),
                skills: [t('skillCreative'), t('skillDesign'), t('skillProto')],
                activities: [t('actVisual'), t('actIdeas'), t('actUI')],
                calculateMatch: (s) => {
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    const intuitionScore = Math.max(0, (s.intuition + 1) / 2);
                    const adaptationScore = Math.max(0, (s.adaptation + 1) / 2);
                    return (explorerScore * 0.4 + intuitionScore * 0.3 + adaptationScore * 0.3);
                }
            },
            {
                id: "management",
                name: t('management'),
                color: "#50c878",
                description: t('descManagement'),
                skills: [t('skillLeadership'), t('skillStrategicPlan'), t('skillNegot')],
                activities: [t('actManage'), t('actStrategy'), t('actOrg')],
                calculateMatch: (s) => {
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    const rationalityScore = Math.max(0, (s.rationality + 1) / 2);
                    const meaningScore = Math.max(0, (s.meaning + 1) / 2);
                    return (strategicScore * 0.4 + rationalityScore * 0.3 + meaningScore * 0.3);
                }
            },
            {
                id: "social",
                name: t('social'),
                color: "#f39c12",
                description: t('descSocial'),
                skills: [t('skillEmpat'), t('skillComm'), t('skillPed')],
                activities: [t('actHelp'), t('actTeach'), t('actPsych')],
                calculateMatch: (s) => {
                    const meaningScore = Math.max(0, (s.meaning + 1) / 2);
                    const intuitionScore = Math.max(0, (s.intuition + 1) / 2);
                    const collectivismScore = Math.max(0, (1 - s.individualism) / 2);
                    return (meaningScore * 0.4 + intuitionScore * 0.3 + collectivismScore * 0.3);
                }
            },
            {
                id: "entrepreneurship",
                name: t('entrepreneurship'),
                color: "#e74c3c",
                description: t('descEntrepreneurship'),
                skills: [t('skillEntrepreneur'), t('skillRisk'), t('skillSales')],
                activities: [t('actNewProj'), t('actOpp'), t('actNet')],
                calculateMatch: (s) => {
                    const utilityScore = Math.max(0, (s.utility + 1) / 2);
                    const adaptationScore = Math.max(0, (s.adaptation + 1) / 2);
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    return (utilityScore * 0.4 + adaptationScore * 0.3 + strategicScore * 0.3);
                }
            },
            {
                id: "analytics",
                name: t('analytics'),
                color: "#9b59b6",
                description: t('descAnalytics'),
                skills: [t('skillStat'), t('skillSysAnal'), t('skillDS')],
                activities: [t('actForecast'), t('actOpt'), t('actBigData')],
                calculateMatch: (s) => {
                    const rationalityScore = Math.max(0, (s.rationality + 1) / 2);
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    return (rationalityScore * 0.4 + strategicScore * 0.35 + explorerScore * 0.25);
                }
            }
        ];

        // Вычисляем matchScore для каждой категории
        const categoryMatches = categories.map(cat => ({
            ...cat,
            matchScore: cat.calculateMatch(scores)
        }));

        // Сортируем по matchScore (убывание)
        categoryMatches.sort((a, b) => b.matchScore - a.matchScore);

        return categoryMatches;
    }

    /**
     * Генерация векторов развития на основе комбинации измерений
     * @param {Object} scores - Нормализованные оценки
     * @returns {Array} Массив векторов развития
     */
    generateDevelopmentVectors(scores) {
        const t = (key) => (window.t ? window.t(key) : key);
        const vectors = [];

        // Исследователь-Стратег: высокий explorer + strategic
        if (scores.explorer > 0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: t('vectorResearcherStrategist'),
                description: t('descResearcherStrategist') || "Вы сочетаете стремление к новым знаниям со стратегическим видением.",
                combination: "explorer + strategic",
                strength: Math.min(scores.explorer, scores.strategic)
            });
        }

        // Творец-Новатор: высокий explorer, низкий rationality (интуитивный)
        if (scores.explorer > 0.3 && scores.rationality < 0.2) {
            vectors.push({
                name: t('vectorCreatorInnovator'),
                description: t('descCreatorInnovator') || "Ваша готовность экспериментировать и создавать новое.",
                combination: "explorer + intuition",
                strength: (scores.explorer - scores.rationality) / 2
            });
        }

        // Лидер-Организатор: высокий collectivism (низкий individualism) + strategic
        if (scores.individualism < -0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: t('vectorLeaderOrganizer'),
                description: t('descLeaderOrganizer') || "Вы умеете работать с людьми и видеть долгосрочную перспективу.",
                combination: "collectivism + strategic",
                strength: Math.min(-scores.individualism, scores.strategic)
            });
        }

        // Аналитик-Рационалист: высокий rationality + explorer
        if (scores.rationality > 0.3 && scores.explorer > 0.2) {
            vectors.push({
                name: t('vectorAnalystRationalist'),
                description: t('descAnalystRationalist') || "Ваш рациональный подход к анализу.",
                combination: "rationality + explorer",
                strength: Math.min(scores.rationality, scores.explorer)
            });
        }

        // Системный Аналитик: высокий rationality + strategic
        if (scores.rationality > 0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: t('vectorSystemAnalyst'),
                description: t('descSystemAnalyst') || "Вы предпочитаете структурированный подход.",
                combination: "rationality + strategic",
                strength: Math.min(scores.rationality, scores.strategic)
            });
        }

        // Самостоятельный Исследователь: высокий explorer + individualism
        if (scores.explorer > 0.3 && scores.individualism > 0.3) {
            vectors.push({
                name: t('vectorIndependentResearcher'),
                description: t('descIndependentResearcher') || "Ваш исследовательский дух в сочетании с независимостью.",
                combination: "explorer + individualism",
                strength: Math.min(scores.explorer, scores.individualism)
            });
        }

        // Предприниматель-Стратег: высокий individualism + strategic
        if (scores.individualism > 0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: t('vectorEntrepreneurStrategist'),
                description: t('descEntrepreneurStrategist'),
                combination: "individualism + strategic",
                strength: Math.min(scores.individualism, scores.strategic)
            });
        }

        // Сортируем по силе
        vectors.sort((a, b) => b.strength - a.strength);

        return vectors.slice(0, 3); // Возвращаем топ-3
    }

    /**
     * Генерация рекомендаций по навыкам на основе профиля
     * @param {Object} scores - Нормализованные оценки
     * @param {Array} categories - Категории направлений развития
     * @returns {Array} Массив рекомендаций по навыкам
     */
    generateSkillRecommendations(scores, categories) {
        const skills = [];
        const topCategories = categories.slice(0, 2); // Топ-2 категории

        // Добавляем навыки из топ-категорий
        topCategories.forEach(cat => {
            if (cat.matchScore > 0.3 && cat.skills) {
                cat.skills.forEach(skill => {
                    if (!skills.find(s => s.name === skill)) {
                        skills.push({
                            name: skill,
                            category: cat.name,
                            priority: cat.matchScore
                        });
                    }
                });
            }
        });

        const t = (key) => (window.t ? window.t(key) : key);
        // Добавляем общие навыки на основе профиля
        if (scores.rationality < -0.2) {
            skills.push({
                name: t('skillStructuredThinking'),
                category: t('generalDevelopment'),
                priority: 0.5
            });
        }

        if (scores.individualism > 0.2) {
            skills.push({
                name: t('skillTeamwork'),
                category: t('generalDevelopment'),
                priority: 0.5
            });
        }

        if (scores.control > 0.2) {
            skills.push({
                name: t('skillUncertaintyManagement'),
                category: t('generalDevelopment'),
                priority: 0.5
            });
        }

        if (scores.strategic < -0.2) {
            skills.push({
                name: t('skillStrategicPlanning'),
                category: t('generalDevelopment'),
                priority: 0.5
            });
        }

        if (scores.explorer < -0.2) {
            skills.push({
                name: t('skillResearchSkills'),
                category: t('generalDevelopment'),
                priority: 0.5
            });
        }

        if (scores.meaning < -0.2) {
            skills.push({
                name: t('skillMeaningSearch'),
                category: t('generalDevelopment'),
                priority: 0.5
            });
        }

        // Сортируем по приоритету
        skills.sort((a, b) => b.priority - a.priority);

        return skills.slice(0, 8); // Возвращаем топ-8 навыков
    }

    /**
     * Генерация рекомендаций на основе профиля и категорий
     * @param {Object} scores - Нормализованные оценки
     * @param {Array} categories - Категории направлений развития
     * @returns {Array} Массив рекомендаций
     */
    generateRecommendations(scores, categories) {
        const recommendations = [];

        const t = (key) => (window.t ? window.t(key) : key);
        // Используем топ-3 категории для генерации рекомендаций
        const topCategories = categories.slice(0, 3).filter(cat => cat.matchScore > 0.2);

        topCategories.forEach(cat => {
            const matchPercent = Math.round(cat.matchScore * 100);
            const matchTextTemplate = t('profileMatchText') || "Ваш профиль соответствует этому направлению на {percent}%.";
            const matchText = matchTextTemplate.replace('{percent}', matchPercent);

            recommendations.push({
                category: cat.name,
                title: cat.description,
                description: `${matchText} ${this.getCategoryDescription(cat.id, scores)}`,
                activities: cat.activities,
                skills: cat.skills,
                matchScore: cat.matchScore
            });
        });

        // Если нет подходящих категорий, добавляем общую рекомендацию
        if (recommendations.length === 0) {
            recommendations.push({
                category: t('generalDevelopment'),
                title: t('balancedProfileTitle'),
                description: t('balancedProfileDesc'),
                activities: [t('activitiesMisc')],
                skills: [t('adaptationName'), t('flexibility')],
                matchScore: 0.5
            });
        }

        return recommendations;
    }

    /**
     * Получение описания категории на основе ID
     * @param {string} categoryId - ID категории
     * @param {Object} scores - Нормализованные оценки
     * @returns {string} Описание категории
     */
    getCategoryDescription(categoryId, scores) {
        const t = (key) => (window.t ? window.t(key) : key);
        const descriptions = {
            research: t('descResearch'),
            creativity: t('descCreativity'),
            management: t('descManagement'),
            social: t('descSocial'),
            entrepreneurship: t('descEntrepreneurship'),
            analytics: t('descAnalytics')
        };
        return descriptions[categoryId] || t('meaningDesc');
    }

    /**
     * Проверка минимального покрытия измерений
     * @param {number} minQuestionsPerDimension - Минимальное количество вопросов на измерение
     * @returns {Object} Результаты проверки
     */
    checkMinimumCoverage(minQuestionsPerDimension = 2) {
        const coverage = this.checkCoverage();
        const issues = [];
        const allCovered = Object.keys(coverage).every(dim => {
            const dimCoverage = coverage[dim];
            if (dimCoverage.count < minQuestionsPerDimension) {
                issues.push({
                    dimension: dim,
                    count: dimCoverage.count,
                    required: minQuestionsPerDimension
                });
                return false;
            }
            return true;
        });

        return {
            allCovered: allCovered,
            coverage: coverage,
            issues: issues,
            minRequired: minQuestionsPerDimension
        };
    }

    /**
     * Получение статистики по выбору
     */
    getStatistics() {
        const coverage = this.checkCoverage();
        const coverageInfo = Object.keys(coverage).map(dim => ({
            dimension: dim,
            count: coverage[dim].count,
            isCovered: coverage[dim].isCovered
        }));

        return {
            totalChoices: this.choices.length,
            totalScenarios: this.scenariosData.scenarios.length,
            completionRate: (this.choices.length / this.scenariosData.scenarios.length) * 100,
            coverage: coverageInfo,
            coverageSummary: {
                coveredDimensions: coverageInfo.filter(c => c.isCovered).length,
                totalDimensions: coverageInfo.length
            }
        };
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalityAnalyzer;
}

// Явное присвоение к window для браузера
if (typeof window !== 'undefined') {
    window.PersonalityAnalyzer = PersonalityAnalyzer;
}
