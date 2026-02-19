/**
 * Advanced Test Question Organizer
 * Улучшенная структура углубленного теста с группировкой
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 */

// Определяем секции теста для лучшей организации
const ADVANCED_TEST_SECTIONS = {
    work: {
        id: 'work',
        title: {
            kk: '💼 Жұмыс және карьера',
            ru: '💼 Работа и карьера',
            en: '💼 Work and Career'
        },
        description: {
            kk: 'Сіздің кәсіби қызметіңіз бен басқару стиліңіз',
            ru: 'Ваша профессиональная деятельность и стиль управления',
            en: 'Your professional activity and management style'
        },
        questionRange: [1, 12] // Вопросы 1-12
    },
    relationships: {
        id: 'relationships',
        title: {
            kk: '👥 Қарым-қатынас',
            ru: '👥 Отношения',
            en: '👥 Relationships'
        },
        description: {
            kk: 'Адамдармен қарым-қатынас және әлеуметтік өзара әрекеттесу',
            ru: 'Взаимодействие с людьми и социальные связи',
            en: 'Interaction with people and social connections'
        },
        questionRange: [13, 24] // Вопросы 13-24
    },
    development: {
        id: 'development',
        title: {
            kk: '🌱 Даму және білім',
            ru: '🌱 Развитие и обучение',
            en: '🌱 Development and Learning'
        },
        description: {
            kk: 'Жеке дамуға және жаңа білімге деген көзқарасыңыз',
            ru: 'Ваше отношение к личному развитию и новым знаниям',
            en: 'Your attitude towards personal development and new knowledge'
        },
        questionRange: [25, 36] // Вопросы 25-36
    },
    values: {
        id: 'values',
        title: {
            kk: '💎 Құндылықтар',
            ru: '💎 Ценности',
            en: '💎 Values'
        },
        description: {
            kk: 'Сіздің жеке құндылықтарыңыз бен принциптеріңіз',
            ru: 'Ваши личные ценности и принципы',
            en: 'Your personal values and principles'
        },
        questionRange: [37, 50] // Вопросы 37-50
    }
};

// Функция определения текущей секции
function getCurrentSection(questionIndex) {
    for (const [key, section] of Object.entries(ADVANCED_TEST_SECTIONS)) {
        if (questionIndex >= section.questionRange[0] && questionIndex <= section.questionRange[1]) {
            return section;
        }
    }
    return null;
}

// Функция расчета прогресса в секции
function getSectionProgress(questionIndex) {
    const section = getCurrentSection(questionIndex);
    if (!section) return { progress: 0, total: 0 };

    const [start, end] = section.questionRange;
    const current = questionIndex - start + 1;
    const total = end - start + 1;

    return {
        current,
        total,
        progress: Math.round((current / total) * 100),
        section
    };
}

// Функция для получения всех секций с прогрессом
function getAllSectionsProgress(currentQuestionIndex) {
    return Object.entries(ADVANCED_TEST_SECTIONS).map(([key, section]) => {
        const [start, end] = section.questionRange;
        const isActive = currentQuestionIndex >= start && currentQuestionIndex <= end;
        const isCompleted = currentQuestionIndex > end;
        const questionsInSection = end - start + 1;

        let completedInSection = 0;
        if (isCompleted) {
            completedInSection = questionsInSection;
        } else if (isActive) {
            completedInSection = currentQuestionIndex - start + 1;
        }

        return {
            ...section,
            isActive,
            isCompleted,
            isPending: currentQuestionIndex < start,
            progress: Math.round((completedInSection / questionsInSection) * 100),
            completedQuestions: completedInSection,
            totalQuestions: questionsInSection
        };
    });
}

// Экспорт для глобального доступа
if (typeof window !== 'undefined') {
    window.ADVANCED_TEST_SECTIONS = ADVANCED_TEST_SECTIONS;
    window.getCurrentSection = getCurrentSection;
    window.getSectionProgress = getSectionProgress;
    window.getAllSectionsProgress = getAllSectionsProgress;
}
