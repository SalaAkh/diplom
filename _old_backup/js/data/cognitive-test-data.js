/**
 * Cognitive Test Data - VAK Learning Styles
 * Tests for Visual, Auditory, and Kinesthetic learning preferences
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

window.COGNITIVE_QUESTIONS = [
    {
        id: 1,
        text: {
            kk: "Жаңа ақпаратты оқи отырып, сіз:",
            ru: "Читая новую информацию, вы:",
            en: "When reading new information, you:"
        },
        options: [
            {
                id: "1a",
                text: {
                    kk: "Суреттер мен диаграммаларды іздеймін",
                    ru: "Ищу картинки и диаграммы",
                    en: "Look for pictures and diagrams"
                },
                type: "visual"
            },
            {
                id: "1b",
                text: {
                    kk: "Мәтінді дауыстап оқимын",
                    ru: "Читаю текст вслух",
                    en: "Read the text aloud"
                },
                type: "auditory"
            },
            {
                id: "1c",
                text: {
                    kk: "Жазбалар жасаймын немесе заттарды қозғалтамын",
                    ru: "Делаю заметки или перемещаю предметы",
                    en: "Take notes or move objects"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 2,
        text: {
            kk: "Бос уақытта сіз көбінесе:",
            ru: "В свободное время вы чаще:",
            en: "In your free time, you often:"
        },
        options: [
            {
                id: "2a",
                text: {
                    kk: "Фильмдер көремін немесе суреттер қарай ма",
                    ru: "Смотрю фильмы или рассматриваю картинки",
                    en: "Watch movies or look at pictures"
                },
                type: "visual"
            },
            {
                id: "2b",
                text: {
                    kk: "Музыка тыңдаймын немесе подкастар есітемі",
                    ru: "Слушаю музыку или подкасты",
                    en: "Listen to music or podcasts"
                },
                type: "auditory"
            },
            {
                id: "2c",
                text: {
                    kk: "Спортпен айналысамын немесе қолөнермен шұғылданам",
                    ru: "Занимаюсь спортом или рукоделием",
                    en: "Do sports or crafts"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 3,
        text: {
            kk: "Жолды есте сақтау үшін сіз:",
            ru: "Чтобы запомнить дорогу, вы:",
            en: "To remember a route, you:"
        },
        options: [
            {
                id: "3a",
                text: {
                    kk: "Картаны немесе белгілерді елестетемін",
                    ru: "Представляю карту или визуальные ориентиры",
                    en: "Visualize a map or landmarks"
                },
                type: "visual"
            },
            {
                id: "3b",
                text: {
                    kk: "Бағытты өзіме айтып отырамын",
                    ru: "Проговариваю направления себе",
                    en: "Verbalize the directions to myself"
                },
                type: "auditory"
            },
            {
                id: "3c",
                text: {
                    kk: "Денемен жолды сезініп, қайталаймын",
                    ru: "Чувствую и повторяю путь телом",
                    en: "Feel and retrace the route physically"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 4,
        text: {
            kk: "Презентация дайындау кезінде сіз маңызды деп санайсыз:",
            ru: "При подготовке презентации вы считаете важным:",
            en: "When preparing a presentation, you find important:"
        },
        options: [
            {
                id: "4a",
                text: {
                    kk: "Әдемі слайдтар мен инфографикалар",
                    ru: "Красивые слайды и инфографику",
                    en: "Beautiful slides and infographics"
                },
                type: "visual"
            },
            {
                id: "4b",
                text: {
                    kk: "Айқын және мағыналы сөйлеу",
                    ru: "Четкую и содержательную речь",
                    en: "Clear and meaningful speech"
                },
                type: "auditory"
            },
            {
                id: "4c",
                text: {
                    kk: "Интерактивтік және тәжірибелік мысалдар",
                    ru: "Интерактив и практические примеры",
                    en: "Interactive and practical examples"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 5,
        text: {
            kk: "Жаңа құрылғыны пайдалану үшін сіз:",
            ru: "Чтобы использовать новое устройство, вы:",
            en: "To use a new device, you:"
        },
        options: [
            {
                id: "5a",
                text: {
                    kk: "Нұсқаулықтағы суреттерді қарай ма",
                    ru: "Смотрю на картинки в инструкции",
                    en: "Look at pictures in the manual"
                },
                type: "visual"
            },
            {
                id: "5b",
                text: {
                    kk: "Біреуден түсіндіруін сұраймын",
                    ru: "Прошу кого-то объяснить",
                    en: "Ask someone to explain"
                },
                type: "auditory"
            },
            {
                id: "5c",
                text: {
                    kk: "Өзім тексеріп, түймелерді басамын",
                    ru: "Просто пробую и нажимаю кнопки",
                    en: "Just try and press buttons"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 6,
        text: {
            kk: "Сіз мәлімдемені жақсы есте сақтайсыз, егер ол:",
            ru: "Вы лучше запоминаете информацию, если она:",
            en: "You remember information better when it's:"
        },
        options: [
            {
                id: "6a",
                text: {
                    kk: "Түрлі-түсті және графикалық",
                    ru: "Цветная и графическая",
                    en: "Colorful and graphical"
                },
                type: "visual"
            },
            {
                id: "6b",
                text: {
                    kk: "Дауыстап айтылған немесе талқыланған",
                    ru: "Произнесена вслух или обсуждена",
                    en: "Spoken aloud or discussed"
                },
                type: "auditory"
            },
            {
                id: "6c",
                text: {
                    kk: "Тәжірибеде қолданылған",
                    ru: "Применена на практике",
                    en: "Applied in practice"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 7,
        text: {
            kk: "Жиналыста сіз көбінесе:",
            ru: "На собрании вы чаще:",
            en: "At a meeting, you often:"
        },
        options: [
            {
                id: "7a",
                text: {
                    kk: "Схемалар мен слайдтарға қарай ма",
                    ru: "Смотрю на схемы и слайды",
                    en: "Look at diagrams and slides"
                },
                type: "visual"
            },
            {
                id: "7b",
                text: {
                    kk: "Талқылауға қатысамын және сұрақтар қоямын",
                    ru: "Участвую в обсуждении и задаю вопросы",
                    en: "Participate in discussion and ask questions"
                },
                type: "auditory"
            },
            {
                id: "7c",
                text: {
                    kk: "Жазбалар жасаймын немесе заттарды қозғалтамын",
                    ru: "Делаю заметки или использую предметы",
                    en: "Take notes or use objects"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 8,
        text: {
            kk: "Проблеманы шешу кезінде сіз:",
            ru: "При решении проблемы вы:",
            en: "When solving a problem, you:"
        },
        options: [
            {
                id: "8a",
                text: {
                    kk: "Диаграмма немесе сызба жасаймын",
                    ru: "Рисую диаграмму или схему",
                    en: "Draw a diagram or scheme"
                },
                type: "visual"
            },
            {
                id: "8b",
                text: {
                    kk: "Біреумен талқылаймын",
                    ru: "Обсуждаю с кем-то",
                    en: "Discuss with someone"
                },
                type: "auditory"
            },
            {
                id: "8c",
                text: {
                    kk: "Әртүрлі шешімдерді тексеремін",
                    ru: "Пробую разные решения",
                    en: "Try different solutions"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 9,
        text: {
            kk: "Адамды есте сақтау үшін сіз:",
            ru: "Чтобы запомнить человека, вы:",
            en: "To remember a person, you:"
        },
        options: [
            {
                id: "9a",
                text: {
                    kk: "Оның бет-әлпетін елестетемін",
                    ru: "Представляю его лицо",
                    en: "Visualize their face"
                },
                type: "visual"
            },
            {
                id: "9b",
                text: {
                    kk: "Оның атын қайталаймын",
                    ru: "Повторяю его имя",
                    en: "Repeat their name"
                },
                type: "auditory"
            },
            {
                id: "9c",
                text: {
                    kk: "Қол алысқан сәтті еске аламын",
                    ru: "Вспоминаю момент рукопожатия",
                    en: "Remember the handshake moment"
                },
                type: "kinesthetic"
            }
        ]
    },
    {
        id: 10,
        text: {
            kk: "Емтиханға дайындалу кезінде сіз:",
            ru: "При подготовке к экзамену вы:",
            en: "When preparing for an exam, you:"
        },
        options: [
            {
                id: "10a",
                text: {
                    kk: "Кестелер мен графиктер жасаймын",
                    ru: "Делаю таблицы и графики",
                    en: "Make tables and charts"
                },
                type: "visual"
            },
            {
                id: "10b",
                text: {
                    kk: "Материалды дауыстап оқимын",
                    ru: "Читаю материал вслух",
                    en: "Read material aloud"
                },
                type: "auditory"
            },
            {
                id: "10c",
                text: {
                    kk: "Тапсырмаларды шешемін және жаттығулар жасаймын",
                    ru: "Решаю задачи и делаю упражнения",
                    en: "Solve problems and do exercises"
                },
                type: "kinesthetic"
            }
        ]
    }
];

// Cognitive Service - Analyzes VAK test results
window.cognitiveService = {
    analyze(answers) {
        const counts = { visual: 0, auditory: 0, kinesthetic: 0 };

        // Count each type
        answers.forEach(answer => {
            if (answer.choice && answer.choice.type) {
                counts[answer.choice.type]++;
            }
        });

        // Calculate percentages
        const total = answers.length;
        const breakdown = {
            visual: Math.round((counts.visual / total) * 100),
            auditory: Math.round((counts.auditory / total) * 100),
            kinesthetic: Math.round((counts.kinesthetic / total) * 100)
        };

        // Determine dominant style
        let dominant = 'visual';
        let maxCount = counts.visual;
        if (counts.auditory > maxCount) {
            dominant = 'auditory';
            maxCount = counts.auditory;
        }
        if (counts.kinesthetic > maxCount) {
            dominant = 'kinesthetic';
            maxCount = counts.kinesthetic;
        }

        // Get details for the dominant style
        const styleDetails = {
            visual: {
                title: {
                    kk: "Визуалды оқушы",
                    ru: "Визуальный ученик",
                    en: "Visual Learner"
                },
                description: {
                    kk: "Сіз ақпаратты көру арқылы жақсы қабылдайсыз",
                    ru: "Вы лучше воспринимаете информацию через зрение",
                    en: "You perceive information best through vision"
                },
                tips: {
                    kk: "Оқу кезінде: диаграммалар, кестелер, түрлі-түсті жазбалар пайдаланыңыз. Ақпаратты көрнекі түрде ұйымдастырыңыз. Mind map және инфографика тамаша жұмыс істейді.",
                    ru: "При обучении: используйте диаграммы, таблицы, цветные заметки. Организуйте информацию визуально. Mind map и инфографика отлично работают.",
                    en: "When learning: use diagrams, tables, colored notes. Organize information visually. Mind maps and infographics work great."
                }
            },
            auditory: {
                title: {
                    kk: "Аудиалды оқушы",
                    ru: "Аудиальный ученик",
                    en: "Auditory Learner"
                },
                description: {
                    kk: "Сіз ақпаратты есту арқылы жақсы қабылдайсыз",
                    ru: "Вы лучше воспринимаете информацию через слух",
                    en: "You perceive information best through hearing"
                },
                tips: {
                    kk: "Оқу кезінде: материалды дауыстап оқыңыз, аудио дәрістерді тыңдаңыз, басқалармен талқылаңыз. Өзіңізге түсіндіріп, қайталап айтыңыз.",
                    ru: "При обучении: читайте материал вслух, слушайте аудио лекции, обсуждайте с другими. Объясняйте себе и повторяйте вслух.",
                    en: "When learning: read material aloud, listen to audio lectures, discuss with others. Explain to yourself and repeat aloud."
                }
            },
            kinesthetic: {
                title: {
                    kk: "Кинестетикалық оқушы",
                    ru: "Кинестетический ученик",
                    en: "Kinesthetic Learner"
                },
                description: {
                    kk: "Сіз ақпаратты тәжірибе арқылы жақсы қабылдайсыз",
                    ru: "Вы лучше воспринимаете информацию через практику",
                    en: "You perceive information best through practice"
                },
                tips: {
                    kk: "Оқу кезінде: практикалық тапсырмалар орындаңыз, қол жазбалары жасаңыз, моделдер құрыңыз. Қозғалыс пен іс-әрекет арқылы үйреніңіз.",
                    ru: "При обучении: выполняйте практические задания, делайте рукописные заметки, создавайте модели. Учитесь через движение и действие.",
                    en: "When learning: do practical tasks, take handwritten notes, create models. Learn through movement and action."
                }
            }
        };

        return {
            dominant,
            breakdown,
            details: styleDetails[dominant],
            counts
        };
    }
};
