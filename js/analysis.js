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

        // Инициализация оценок по всем измерениям
        Object.keys(this.dimensions).forEach(dimension => {
            this.scores[dimension] = 0;
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
                console.warn('Некорректный вес для измерения:', dimension, weight);
                return;
            }

            // Преобразуем старые названия в новые, если необходимо
            const normalizedDimension = this.normalizeDimensionName(dimension);
            const baseDimension = normalizedDimension.name;

            // Проверяем, что измерение существует в scores
            if (this.scores[baseDimension] === undefined) {
                console.warn('Измерение не найдено в scores:', baseDimension);
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
            console.warn('Некорректное название измерения:', dimension);
            return { name: dimension || 'unknown', negated: false };
        }

        // Список валидных измерений (4 основных)
        const validDimensions = ['strategic', 'explorer', 'individualism', 'rationality'];

        // Если измерение уже валидное, возвращаем как есть
        if (validDimensions.includes(dimension)) {
            return { name: dimension, negated: false };
        }

        // Маппинг старых и альтернативных названий на новые 4 измерений
        // Структура: 'старое_название': { name: 'новое_название', negated: true/false }
        const dimensionMap = {
            // Прямые маппинги (без инверсии)
            'systematic': { name: 'rationality', negated: false },
            'exploration': { name: 'explorer', negated: false },

            // Инвертированные маппинги (обратная сторона измерений)
            'peopleOriented': { name: 'individualism', negated: true }, // peopleOriented = -individualism
            'tactical': { name: 'strategic', negated: true }, // tactical = -strategic
            'intuition': { name: 'rationality', negated: true }, // intuition = -rationality
            'collectivism': { name: 'individualism', negated: true }, // collectivism = -individualism
            'executor': { name: 'explorer', negated: true }, // executor = -explorer

            // Игнорируемые измерения (маппим на ближайшие)
            'control': { name: 'rationality', negated: false }, // control -> rationality
            'adaptation': { name: 'rationality', negated: true }, // adaptation -> -rationality
            'riskTolerance': { name: 'rationality', negated: true }, // riskTolerance -> -rationality
            'meaning': { name: 'explorer', negated: false }, // meaning -> explorer
            'utility': { name: 'explorer', negated: true } // utility -> -explorer
        };

        // Проверяем маппинг
        const mapping = dimensionMap[dimension];
        if (mapping) {
            // Проверяем, что результат маппинга валидный
            if (validDimensions.includes(mapping.name)) {
                return mapping;
            } else {
                console.warn('Маппинг измерения ведет к невалидному измерению:', dimension, '->', mapping.name);
            }
        }

        // Если измерение не распознано, логируем предупреждение и возвращаем как есть
        console.warn('Неизвестное измерение:', dimension, '. Используется как есть.');
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

        // Определяем язык для описаний (пробуем получить из localStorage или используем русский по умолчанию)
        let currentLang = 'ru';
        try {
            if (typeof localStorage !== 'undefined') {
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && ['kk', 'ru', 'en'].includes(savedLang)) {
                    currentLang = savedLang;
                } else {
                    // Пробуем определить по браузеру
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang.startsWith('kk') || browserLang.startsWith('kz')) {
                        currentLang = 'kk';
                    } else if (browserLang.startsWith('en')) {
                        currentLang = 'en';
                    }
                }
            }
        } catch (e) {
            // Используем русский по умолчанию
        }

        // Анализ каждого измерения
        Object.keys(this.dimensions).forEach(dimension => {
            const score = scores[dimension];
            const dimensionInfo = this.dimensions[dimension];

            // Получаем переведенные названия
            const dimensionName = this.getTranslatedText(dimensionInfo.name, currentLang);
            const oppositeName = this.getTranslatedText(dimensionInfo.opposite, currentLang);

            let level, description;
            if (score > 0.5) {
                level = "высокая";
                description = `Вы демонстрируете сильную склонность к ${dimensionName.toLowerCase()}.`;
            } else if (score > 0.2) {
                level = "умеренная";
                description = `У вас есть склонность к ${dimensionName.toLowerCase()}.`;
            } else if (score < -0.5) {
                level = "низкая";
                description = `Вы предпочитаете ${oppositeName.toLowerCase()}.`;
            } else if (score < -0.2) {
                level = "умеренно низкая";
                description = `Вы склонны к ${oppositeName.toLowerCase()}.`;
            } else {
                level = "сбалансированная";
                description = `У вас сбалансированный подход между ${dimensionName.toLowerCase()} и ${oppositeName.toLowerCase()}.`;
            }

            profile.dimensions[dimension] = {
                name: dimensionName, // Используем переведенный текст
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

        // Добавляем тип профиля (название топ-категории)
        profile.type = profile.categories.length > 0
            ? profile.categories[0].name
            : "Сбалансированный профиль";

        // Добавляем traits (черты характера) на основе доминирующих измерений
        profile.traits = this.extractTraits(scores, profile.dimensions);

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
            traits.push("Сбалансированный подход");
        }

        return traits.slice(0, 5); // Max 5 traits
    }

    /**
     * Генерация общего резюме профиля
     */
    generateSummary(scores) {
        const traits = [];
        const strengths = [];
        const areasForDevelopment = [];

        // Рациональность ↔ Интуиция
        if (scores.rationality > 0.3) {
            traits.push("рациональный, логический подход к решению задач");
            strengths.push("аналитическое мышление");
        } else if (scores.rationality < -0.3) {
            traits.push("интуитивный стиль принятия решений");
            strengths.push("быстрое принятие решений");
            areasForDevelopment.push("структурированный анализ");
        }

        // Индивидуализм ↔ Коллективизм
        if (scores.individualism > 0.3) {
            traits.push("предпочтение самостоятельной работы");
            strengths.push("самостоятельность и независимость");
        } else if (scores.individualism < -0.3) {
            traits.push("ориентация на командную работу");
            strengths.push("коммуникативные навыки");
            areasForDevelopment.push("самостоятельная работа");
        }

        // Стратегическое ↔ Тактическое мышление
        if (scores.strategic > 0.3) {
            traits.push("стратегическое мышление");
            strengths.push("долгосрочное планирование");
        } else if (scores.strategic < -0.3) {
            traits.push("тактический подход");
            strengths.push("оперативность");
            areasForDevelopment.push("стратегическое видение");
        }

        // Исследователь ↔ Исполнитель
        if (scores.explorer > 0.3) {
            traits.push("стремление к исследованию и новым знаниям");
            strengths.push("любознательность");
        } else if (scores.explorer < -0.3) {
            traits.push("фокус на практическом исполнении");
            strengths.push("практичность и эффективность");
            areasForDevelopment.push("исследовательские навыки");
        }

        let summary = "";
        if (traits.length === 0) {
            summary = "Ваш профиль демонстрирует сбалансированный подход к различным аспектам принятия решений.";
        } else {
            summary = `Ваш профиль характеризуется: ${traits.join(", ")}.`;
        }

        if (strengths.length > 0) {
            summary += ` Ваши сильные стороны: ${strengths.join(", ")}.`;
        }

        if (areasForDevelopment.length > 0) {
            summary += ` Области для развития: ${areasForDevelopment.join(", ")}.`;
        }

        return summary;
    }

    /**
     * Вычисление соответствия профиля категориям направлений развития
     * @param {Object} scores - Нормализованные оценки
     * @returns {Array} Массив категорий с matchScore
     */
    calculateCategoryMatch(scores) {
        const categories = [
            {
                id: "research",
                name: "Исследование и Наука",
                color: "#4a90e2",
                description: "Научная деятельность, аналитика, R&D",
                calculateMatch: (s) => {
                    // Высокий explorer, rationality, strategic
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    const rationalityScore = Math.max(0, (s.rationality + 1) / 2);
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    return (explorerScore * 0.5 + rationalityScore * 0.3 + strategicScore * 0.2);
                },
                activities: [
                    "Научные исследования",
                    "R&D и разработка",
                    "Аналитика данных",
                    "Консалтинг",
                    "Преподавание и образование"
                ],
                skills: [
                    "Методология исследований",
                    "Анализ данных",
                    "Критическое мышление",
                    "Научное письмо",
                    "Статистический анализ"
                ]
            },
            {
                id: "creativity",
                name: "Творчество и Инновации",
                color: "#7b68ee",
                description: "Дизайн, искусство, стартапы, креативные индустрии",
                calculateMatch: (s) => {
                    // Высокий explorer, низкий rationality (интуитивный)
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    const intuitionBonus = Math.max(0, (1 - s.rationality) / 2); // intuition = -rationality
                    const individualismScore = Math.max(0, (s.individualism + 1) / 2);
                    return (explorerScore * 0.5 + intuitionBonus * 0.3 + individualismScore * 0.2);
                },
                activities: [
                    "Дизайн и визуальное искусство",
                    "Стартапы и инновации",
                    "Креативные индустрии",
                    "Предпринимательство",
                    "Медиа и контент"
                ],
                skills: [
                    "Креативное мышление",
                    "Дизайн-мышление",
                    "Инновации",
                    "Визуальная коммуникация",
                    "Прототипирование"
                ]
            },
            {
                id: "management",
                name: "Управление и Лидерство",
                color: "#50c878",
                description: "Менеджмент, HR, стратегическое планирование",
                calculateMatch: (s) => {
                    // Высокий collectivism (низкий individualism), strategic, rationality
                    const collectivismScore = Math.max(0, (1 - s.individualism) / 2); // collectivism = -individualism
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    const rationalityScore = Math.max(0, (s.rationality + 1) / 2);
                    return (collectivismScore * 0.4 + strategicScore * 0.35 + rationalityScore * 0.25);
                },
                activities: [
                    "Менеджмент и руководство",
                    "HR и управление персоналом",
                    "Стратегическое планирование",
                    "Бизнес-консалтинг",
                    "Политика и общественная деятельность"
                ],
                skills: [
                    "Лидерство",
                    "Управление командой",
                    "Стратегическое мышление",
                    "Переговоры",
                    "Управление проектами"
                ]
            },
            {
                id: "social",
                name: "Социальная сфера и Помощь",
                color: "#f39c12",
                description: "Образование, социальная работа, медицина, психология",
                calculateMatch: (s) => {
                    // Высокий collectivism (низкий individualism), explorer, tactical (низкий strategic)
                    const collectivismScore = Math.max(0, (1 - s.individualism) / 2); // collectivism = -individualism
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    const tacticalScore = Math.max(0, (1 - s.strategic) / 2); // tactical = -strategic
                    return (collectivismScore * 0.4 + explorerScore * 0.35 + tacticalScore * 0.25);
                },
                activities: [
                    "Образование и преподавание",
                    "Социальная работа",
                    "Медицина и здравоохранение",
                    "Психология и консультирование",
                    "Волонтёрство и благотворительность"
                ],
                skills: [
                    "Эмпатия",
                    "Коммуникация",
                    "Педагогика",
                    "Консультирование",
                    "Социальная работа"
                ]
            },
            {
                id: "entrepreneurship",
                name: "Предпринимательство",
                color: "#e74c3c",
                description: "Стартапы, бизнес, инновационные проекты",
                calculateMatch: (s) => {
                    // Высокий individualism, strategic, низкий rationality (гибкость)
                    const individualismScore = Math.max(0, (s.individualism + 1) / 2);
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    const flexibilityScore = Math.max(0, (1 - s.rationality) / 2);
                    return (individualismScore * 0.35 + strategicScore * 0.35 + flexibilityScore * 0.3);
                },
                activities: [
                    "Создание стартапов",
                    "Бизнес-развитие",
                    "Инновационные проекты",
                    "Инвестиции",
                    "Консалтинг для бизнеса"
                ],
                skills: [
                    "Предпринимательское мышление",
                    "Управление рисками",
                    "Стратегическое планирование",
                    "Нетворкинг",
                    "Финансовая грамотность"
                ]
            },
            {
                id: "analytics",
                name: "Аналитика и Консалтинг",
                color: "#9b59b6",
                description: "Анализ данных, консалтинг, стратегическое планирование",
                calculateMatch: (s) => {
                    // Высокий rationality, strategic, explorer
                    const rationalityScore = Math.max(0, (s.rationality + 1) / 2);
                    const strategicScore = Math.max(0, (s.strategic + 1) / 2);
                    const explorerScore = Math.max(0, (s.explorer + 1) / 2);
                    return (rationalityScore * 0.4 + strategicScore * 0.35 + explorerScore * 0.25);
                },
                activities: [
                    "Аналитика данных",
                    "Бизнес-консалтинг",
                    "Стратегическое планирование",
                    "Финансовый анализ",
                    "Операционные исследования"
                ],
                skills: [
                    "Аналитическое мышление",
                    "Работа с данными",
                    "Моделирование",
                    "Стратегический анализ",
                    "Презентация результатов"
                ]
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
        const vectors = [];

        // Исследователь-Стратег: высокий explorer + strategic
        if (scores.explorer > 0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: "Исследователь-Стратег",
                description: "Вы сочетаете стремление к новым знаниям со стратегическим видением. Идеально для долгосрочных исследовательских проектов и научного лидерства.",
                combination: "explorer + strategic",
                strength: Math.min(scores.explorer, scores.strategic)
            });
        }

        // Творец-Новатор: высокий explorer, низкий rationality (интуитивный)
        if (scores.explorer > 0.3 && scores.rationality < 0.2) {
            vectors.push({
                name: "Творец-Новатор",
                description: "Ваша готовность экспериментировать и создавать новое делает вас идеальным для инновационных проектов и творческих индустрий.",
                combination: "explorer + intuition",
                strength: (scores.explorer - scores.rationality) / 2
            });
        }

        // Лидер-Организатор: высокий collectivism (низкий individualism) + strategic
        if (scores.individualism < -0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: "Лидер-Организатор",
                description: "Вы умеете работать с людьми и видеть долгосрочную перспективу. Отлично подходит для руководящих позиций и управления командами.",
                combination: "collectivism + strategic",
                strength: Math.min(-scores.individualism, scores.strategic)
            });
        }

        // Аналитик-Рационалист: высокий rationality + explorer
        if (scores.rationality > 0.3 && scores.explorer > 0.2) {
            vectors.push({
                name: "Аналитик-Рационалист",
                description: "Ваш рациональный подход к анализу в сочетании с любознательностью идеален для научной работы и глубокого исследования проблем.",
                combination: "rationality + explorer",
                strength: Math.min(scores.rationality, scores.explorer)
            });
        }

        // Системный Аналитик: высокий rationality + strategic
        if (scores.rationality > 0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: "Системный Аналитик",
                description: "Вы предпочитаете структурированный подход и долгосрочное планирование. Отлично для ролей, требующих надёжности и стратегического видения.",
                combination: "rationality + strategic",
                strength: Math.min(scores.rationality, scores.strategic)
            });
        }

        // Самостоятельный Исследователь: высокий explorer + individualism
        if (scores.explorer > 0.3 && scores.individualism > 0.3) {
            vectors.push({
                name: "Самостоятельный Исследователь",
                description: "Ваш исследовательский дух в сочетании с независимостью идеален для академической работы и глубоких исследований.",
                combination: "explorer + individualism",
                strength: Math.min(scores.explorer, scores.individualism)
            });
        }

        // Предприниматель-Стратег: высокий individualism + strategic
        if (scores.individualism > 0.3 && scores.strategic > 0.3) {
            vectors.push({
                name: "Предприниматель-Стратег",
                description: "Ваша независимость и стратегическое мышление делают вас идеальным для предпринимательства и инновационных бизнес-проектов.",
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
            if (cat.matchScore > 0.3) {
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

        // Добавляем общие навыки на основе профиля
        if (scores.rationality < -0.2) {
            skills.push({
                name: "Структурированное мышление",
                category: "Общее развитие",
                priority: 0.5
            });
        }

        if (scores.individualism > 0.2) {
            skills.push({
                name: "Командная работа",
                category: "Общее развитие",
                priority: 0.5
            });
        }

        if (scores.control > 0.2) {
            skills.push({
                name: "Управление неопределённостью",
                category: "Общее развитие",
                priority: 0.5
            });
        }

        if (scores.strategic < -0.2) {
            skills.push({
                name: "Стратегическое планирование",
                category: "Общее развитие",
                priority: 0.5
            });
        }

        if (scores.explorer < -0.2) {
            skills.push({
                name: "Исследовательские навыки",
                category: "Общее развитие",
                priority: 0.5
            });
        }

        if (scores.meaning < -0.2) {
            skills.push({
                name: "Поиск глубинного смысла",
                category: "Общее развитие",
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

        // Используем топ-3 категории для генерации рекомендаций
        const topCategories = categories.slice(0, 3).filter(cat => cat.matchScore > 0.2);

        topCategories.forEach(cat => {
            const matchPercent = Math.round(cat.matchScore * 100);
            recommendations.push({
                category: cat.name,
                title: cat.description,
                description: `Ваш профиль соответствует этому направлению на ${matchPercent}%. ${this.getCategoryDescription(cat.id, scores)}`,
                activities: cat.activities,
                skills: cat.skills,
                matchScore: cat.matchScore
            });
        });

        // Если нет подходящих категорий, добавляем общую рекомендацию
        if (recommendations.length === 0) {
            recommendations.push({
                category: "Общее развитие",
                title: "Сбалансированный профиль",
                description: "Ваш профиль демонстрирует сбалансированный подход. Исследуйте разные направления для определения наиболее подходящего пути.",
                activities: ["Разнообразные проекты", "Междисциплинарная работа"],
                skills: ["Адаптивность", "Гибкость"],
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
        const descriptions = {
            research: "Ваша склонность к рациональному анализу и исследованию делает вас идеальным кандидатом для научной работы, аналитики и R&D. Вы умеете глубоко погружаться в проблемы и находить системные решения.",
            creativity: "Ваша готовность к экспериментам и созданию нового открывает возможности в творческих индустриях, дизайне и инновационных проектах. Вы не боитесь идти непроторенными путями и адаптироваться к изменениям.",
            management: "Ваше умение работать с людьми и видеть стратегическую перспективу ценится в управлении и лидерстве. Вы способны мотивировать команды и достигать долгосрочных целей.",
            social: "Ваша ориентация на людей и поиск смысла делают вас отличным кандидатом для работы в социальной сфере, образовании и здравоохранении. Вы умеете помогать другим и находить ценность в служении.",
            entrepreneurship: "Ваша независимость, стратегическое мышление и готовность к адаптации идеальны для предпринимательства. Вы способны создавать новые возможности и управлять рисками.",
            analytics: "Ваш рациональный подход, стратегическое мышление и стремление к контролю делают вас отличным аналитиком и консультантом. Вы умеете структурировать сложные проблемы и находить оптимальные решения."
        };
        return descriptions[categoryId] || "Это направление может быть интересным для вашего развития.";
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
