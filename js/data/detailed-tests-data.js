/**
 * База данных детальных тестов
 * Содержит три углублённых теста: EQ, Стрессоустойчивость, Креативность
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

const DETAILED_TESTS_DATA = {
    tests: {
        // === ТЕСТ НА ЭМОЦИОНАЛЬНЫЙ ИНТЕЛЛЕКТ (EQ) ===
        eq: {
            id: 'eq',
            name: {
                ru: 'Эмоциональный интеллект (EQ)',
                kk: 'Эмоционалдық интеллект (EQ)',
                en: 'Emotional Intelligence (EQ)'
            },
            description: {
                ru: 'Оцените свою способность понимать и управлять эмоциями — своими и окружающих.',
                kk: 'Өзіңіздің және басқалардың эмоцияларын түсіну және басқару қабілетіңізді бағалаңыз.',
                en: 'Assess your ability to understand and manage emotions — both yours and others.'
            },
            icon: 'psychology',
            color: '#ff6b9d',
            duration: 10,
            questionCount: 15,
            dimensions: ['self_awareness', 'self_regulation', 'empathy', 'social_skills'],
            dimensionNames: {
                self_awareness: { ru: 'Самоосознание', kk: 'Өзін-өзі тану', en: 'Self-Awareness' },
                self_regulation: { ru: 'Саморегуляция', kk: 'Өзін-өзі реттеу', en: 'Self-Regulation' },
                empathy: { ru: 'Эмпатия', kk: 'Эмпатия', en: 'Empathy' },
                social_skills: { ru: 'Социальные навыки', kk: 'Әлеуметтік дағдылар', en: 'Social Skills' }
            },
            questions: [
                // Самоосознание (4 вопроса)
                {
                    id: 'eq_1',
                    dimension: 'self_awareness',
                    text: {
                        ru: 'Я легко распознаю свои эмоции в момент их возникновения.',
                        kk: 'Мен өз эмоцияларымды туындаған кезде оңай тани аламын.',
                        en: 'I easily recognize my emotions as they arise.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_2',
                    dimension: 'self_awareness',
                    text: {
                        ru: 'Я понимаю, как мои эмоции влияют на мои решения и поведение.',
                        kk: 'Мен эмоцияларымның шешімдеріме және мінез-құлқыма қалай әсер ететінін түсінемін.',
                        en: 'I understand how my emotions affect my decisions and behavior.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_3',
                    dimension: 'self_awareness',
                    text: {
                        ru: 'Я знаю свои сильные и слабые стороны.',
                        kk: 'Мен өзімнің күшті және әлсіз жақтарымды білемін.',
                        en: 'I know my strengths and weaknesses.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_4',
                    dimension: 'self_awareness',
                    text: {
                        ru: 'Я уверен в себе и своих способностях.',
                        kk: 'Мен өзіме және өз қабілеттеріме сенімдімін.',
                        en: 'I am confident in myself and my abilities.'
                    },
                    type: 'scale'
                },
                // Саморегуляция (4 вопроса)
                {
                    id: 'eq_5',
                    dimension: 'self_regulation',
                    text: {
                        ru: 'Я могу сохранять спокойствие в стрессовых ситуациях.',
                        kk: 'Мен стресстік жағдайларда сабырлылықты сақтай аламын.',
                        en: 'I can stay calm in stressful situations.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_6',
                    dimension: 'self_regulation',
                    text: {
                        ru: 'Я могу контролировать импульсивные порывы и эмоции.',
                        kk: 'Мен импульсті қозғауларды және эмоцияларды бақылай аламын.',
                        en: 'I can control impulsive urges and emotions.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_7',
                    dimension: 'self_regulation',
                    text: {
                        ru: 'Я быстро восстанавливаюсь после неудач.',
                        kk: 'Мен сәтсіздіктерден тез қалпына келемін.',
                        en: 'I quickly recover from setbacks.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_8',
                    dimension: 'self_regulation',
                    text: {
                        ru: 'Я адаптируюсь к изменениям без сильного стресса.',
                        kk: 'Мен күшті стресссіз өзгерістерге бейімделемін.',
                        en: 'I adapt to changes without significant stress.'
                    },
                    type: 'scale'
                },
                // Эмпатия (4 вопроса)
                {
                    id: 'eq_9',
                    dimension: 'empathy',
                    text: {
                        ru: 'Я хорошо понимаю чувства других людей.',
                        kk: 'Мен басқа адамдардың сезімдерін жақсы түсінемін.',
                        en: 'I understand other people\'s feelings well.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_10',
                    dimension: 'empathy',
                    text: {
                        ru: 'Я могу поставить себя на место другого человека.',
                        kk: 'Мен өзімді басқа адамның орнына қоя аламын.',
                        en: 'I can put myself in someone else\'s shoes.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_11',
                    dimension: 'empathy',
                    text: {
                        ru: 'Я замечаю невербальные сигналы собеседника (жесты, мимику).',
                        kk: 'Мен сөйлесушінің вербалды емес сигналдарын (қимылдар, мимика) байқаймын.',
                        en: 'I notice non-verbal cues (gestures, facial expressions) in conversation.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_12',
                    dimension: 'empathy',
                    text: {
                        ru: 'Когда друг расстроен, я чувствую его боль как свою.',
                        kk: 'Дос ренжіген кезде мен оның ауыртпашылығын өзімдікіндей сезінемін.',
                        en: 'When a friend is upset, I feel their pain as my own.'
                    },
                    type: 'scale'
                },
                // Социальные навыки (3 вопроса)
                {
                    id: 'eq_13',
                    dimension: 'social_skills',
                    text: {
                        ru: 'Мне легко находить общий язык с разными людьми.',
                        kk: 'Маған әртүрлі адамдармен ортақ тіл табу оңай.',
                        en: 'I find it easy to connect with different types of people.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_14',
                    dimension: 'social_skills',
                    text: {
                        ru: 'Я умею разрешать конфликты мирным путём.',
                        kk: 'Мен жанжалдарды бейбіт жолмен шешуді білемін.',
                        en: 'I can resolve conflicts peacefully.'
                    },
                    type: 'scale'
                },
                {
                    id: 'eq_15',
                    dimension: 'social_skills',
                    text: {
                        ru: 'Я могу вдохновить и мотивировать других.',
                        kk: 'Мен басқаларды шабыттандырып, ынталандыра аламын.',
                        en: 'I can inspire and motivate others.'
                    },
                    type: 'scale'
                }
            ]
        },

        // === ТЕСТ НА СТРЕССОУСТОЙЧИВОСТЬ ===
        stress: {
            id: 'stress',
            name: {
                ru: 'Стрессоустойчивость',
                kk: 'Стресске төзімділік',
                en: 'Stress Resilience'
            },
            description: {
                ru: 'Узнайте, как вы справляетесь со стрессом и давлением в различных ситуациях.',
                kk: 'Әртүрлі жағдайларда стресс пен қысыммен қалай күресетініңізді біліңіз.',
                en: 'Discover how you cope with stress and pressure in various situations.'
            },
            icon: 'spa',
            color: '#4ade80',
            duration: 8,
            questionCount: 12,
            dimensions: ['coping', 'recovery', 'prevention'],
            dimensionNames: {
                coping: { ru: 'Преодоление', kk: 'Жеңу', en: 'Coping' },
                recovery: { ru: 'Восстановление', kk: 'Қалпына келу', en: 'Recovery' },
                prevention: { ru: 'Профилактика', kk: 'Алдын алу', en: 'Prevention' }
            },
            questions: [
                // Преодоление (4 вопроса)
                {
                    id: 'stress_1',
                    dimension: 'coping',
                    text: {
                        ru: 'Я сохраняю ясность мышления в критических ситуациях.',
                        kk: 'Мен сыни жағдайларда ойлау анықтығын сақтаймын.',
                        en: 'I maintain clarity of thinking in critical situations.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_2',
                    dimension: 'coping',
                    text: {
                        ru: 'Я могу продуктивно работать под давлением дедлайнов.',
                        kk: 'Мен дедлайн қысымында өнімді жұмыс істей аламын.',
                        en: 'I can work productively under deadline pressure.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_3',
                    dimension: 'coping',
                    text: {
                        ru: 'Я нахожу решения проблем, даже когда очень устал.',
                        kk: 'Мен өте шаршаған кезде де мәселелерге шешім табамын.',
                        en: 'I find solutions to problems even when I\'m very tired.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_4',
                    dimension: 'coping',
                    text: {
                        ru: 'Неожиданные проблемы не выбивают меня из колеи надолго.',
                        kk: 'Күтпеген мәселелер мені ұзақ уақытқа дегбірден шығармайды.',
                        en: 'Unexpected problems don\'t throw me off balance for long.'
                    },
                    type: 'scale'
                },
                // Восстановление (4 вопроса)
                {
                    id: 'stress_5',
                    dimension: 'recovery',
                    text: {
                        ru: 'После стрессового дня я могу быстро расслабиться.',
                        kk: 'Стрессті күннен кейін мен тез демалуға бейім.',
                        en: 'After a stressful day, I can relax quickly.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_6',
                    dimension: 'recovery',
                    text: {
                        ru: 'У меня есть эффективные способы снятия напряжения.',
                        kk: 'Менде шиеленісті жоюдың тиімді жолдары бар.',
                        en: 'I have effective ways to release tension.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_7',
                    dimension: 'recovery',
                    text: {
                        ru: 'Я хорошо сплю, даже если день был тяжёлым.',
                        kk: 'Мен күн ауыр болса да жақсы ұйықтаймын.',
                        en: 'I sleep well even if the day was difficult.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_8',
                    dimension: 'recovery',
                    text: {
                        ru: 'Я умею «отключаться» от работы в свободное время.',
                        kk: 'Мен бос уақытта жұмыстан «ажырауды» білемін.',
                        en: 'I can "disconnect" from work during free time.'
                    },
                    type: 'scale'
                },
                // Профилактика (4 вопроса)
                {
                    id: 'stress_9',
                    dimension: 'prevention',
                    text: {
                        ru: 'Я планирую дела заранее, чтобы избежать аврала.',
                        kk: 'Мен авралды болдырмау үшін істерді алдын ала жоспарлаймын.',
                        en: 'I plan ahead to avoid last-minute rushes.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_10',
                    dimension: 'prevention',
                    text: {
                        ru: 'Я забочусь о здоровом образе жизни (сон, питание, спорт).',
                        kk: 'Мен салауатты өмір салтын ұстанамын (ұйқы, тамақтану, спорт).',
                        en: 'I maintain a healthy lifestyle (sleep, nutrition, exercise).'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_11',
                    dimension: 'prevention',
                    text: {
                        ru: 'Я умею говорить «нет», когда нагрузка становится чрезмерной.',
                        kk: 'Жүктеме шамадан тыс болғанда «жоқ» деуді білемін.',
                        en: 'I can say "no" when the workload becomes excessive.'
                    },
                    type: 'scale'
                },
                {
                    id: 'stress_12',
                    dimension: 'prevention',
                    text: {
                        ru: 'Я регулярно выделяю время для отдыха и хобби.',
                        kk: 'Мен демалыс пен хоббиге уақыт бөлемін.',
                        en: 'I regularly set aside time for rest and hobbies.'
                    },
                    type: 'scale'
                }
            ]
        },

        // === ТЕСТ НА КРЕАТИВНОСТЬ ===
        creativity: {
            id: 'creativity',
            name: {
                ru: 'Креативность',
                kk: 'Креативтілік',
                en: 'Creativity'
            },
            description: {
                ru: 'Исследуйте свой творческий потенциал и способность генерировать новые идеи.',
                kk: 'Шығармашылық әлеуетіңізді және жаңа идеялар генерациялау қабілетіңізді зерттеңіз.',
                en: 'Explore your creative potential and ability to generate new ideas.'
            },
            icon: 'lightbulb',
            color: '#fbbf24',
            duration: 7,
            questionCount: 10,
            dimensions: ['ideation', 'originality', 'openness'],
            dimensionNames: {
                ideation: { ru: 'Генерация идей', kk: 'Идея генерациясы', en: 'Ideation' },
                originality: { ru: 'Оригинальность', kk: 'Түпнұсқалық', en: 'Originality' },
                openness: { ru: 'Открытость новому', kk: 'Жаңаға ашықтық', en: 'Openness' }
            },
            questions: [
                // Генерация идей (4 вопроса)
                {
                    id: 'creat_1',
                    dimension: 'ideation',
                    text: {
                        ru: 'Я легко генерирую множество идей для решения задачи.',
                        kk: 'Мен тапсырманы шешу үшін көптеген идеяларды оңай жасаймын.',
                        en: 'I easily generate many ideas to solve a problem.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_2',
                    dimension: 'ideation',
                    text: {
                        ru: 'Мне нравится искать нестандартные подходы.',
                        kk: 'Маған стандартты емес тәсілдерді іздеу ұнайды.',
                        en: 'I enjoy finding unconventional approaches.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_3',
                    dimension: 'ideation',
                    text: {
                        ru: 'Я вижу связи между вещами, которые другие не замечают.',
                        kk: 'Мен басқалар байқамайтын заттар арасындағы байланыстарды көремін.',
                        en: 'I see connections between things that others don\'t notice.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_4',
                    dimension: 'ideation',
                    text: {
                        ru: 'Мозговой штурм — мой любимый способ решения задач.',
                        kk: 'Миға шабуыл — менің тапсырмаларды шешудің сүйікті тәсілім.',
                        en: 'Brainstorming is my favorite way to solve problems.'
                    },
                    type: 'scale'
                },
                // Оригинальность (3 вопроса)
                {
                    id: 'creat_5',
                    dimension: 'originality',
                    text: {
                        ru: 'Мои идеи часто удивляют окружающих.',
                        kk: 'Менің идеяларым көбінесе айналадағыларды таң қалдырады.',
                        en: 'My ideas often surprise people around me.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_6',
                    dimension: 'originality',
                    text: {
                        ru: 'Я предпочитаю создавать что-то новое, а не копировать существующее.',
                        kk: 'Мен бар нәрсені көшіргеннен жаңа нәрсе жасауды қалаймын.',
                        en: 'I prefer creating something new rather than copying existing things.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_7',
                    dimension: 'originality',
                    text: {
                        ru: 'Меня считают «мыслителем вне рамок».',
                        kk: 'Мені «шеңберден тыс ойшыл» деп санайды.',
                        en: 'I am considered an "out-of-the-box" thinker.'
                    },
                    type: 'scale'
                },
                // Открытость новому (3 вопроса)
                {
                    id: 'creat_8',
                    dimension: 'openness',
                    text: {
                        ru: 'Я с интересом изучаю новые области и темы.',
                        kk: 'Мен жаңа салалар мен тақырыптарды қызығушылықпен зерттеймін.',
                        en: 'I am curious about exploring new areas and topics.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_9',
                    dimension: 'openness',
                    text: {
                        ru: 'Я открыт к экспериментам, даже если они могут провалиться.',
                        kk: 'Мен сәтсіз болуы мүмкін болса да, эксперименттерге ашықпын.',
                        en: 'I am open to experiments even if they might fail.'
                    },
                    type: 'scale'
                },
                {
                    id: 'creat_10',
                    dimension: 'openness',
                    text: {
                        ru: 'Неоднозначность и неопределённость меня не пугают.',
                        kk: 'Бір мәнділік пен белгісіздік мені қорқытпайды.',
                        en: 'Ambiguity and uncertainty don\'t scare me.'
                    },
                    type: 'scale'
                }
            ]
        }
    },

    // Шкала ответов
    answerScale: {
        1: { ru: 'Совсем не согласен', kk: 'Мүлде келіспеймін', en: 'Strongly Disagree' },
        2: { ru: 'Не согласен', kk: 'Келіспеймін', en: 'Disagree' },
        3: { ru: 'Скорее не согласен', kk: 'Әлсіз келіспеймін', en: 'Somewhat Disagree' },
        4: { ru: 'Нейтрально', kk: 'Бейтарап', en: 'Neutral' },
        5: { ru: 'Скорее согласен', kk: 'Әлсіз келісемін', en: 'Somewhat Agree' },
        6: { ru: 'Согласен', kk: 'Келісемін', en: 'Agree' },
        7: { ru: 'Полностью согласен', kk: 'Толық келісемін', en: 'Strongly Agree' }
    },

    // Интерпретация результатов
    interpretations: {
        low: {
            range: [0, 40],
            label: { ru: 'Низкий', kk: 'Төмен', en: 'Low' },
            description: {
                ru: 'Есть потенциал для значительного роста в этой области.',
                kk: 'Бұл салада айтарлықтай өсуге әлеует бар.',
                en: 'There is potential for significant growth in this area.'
            }
        },
        medium: {
            range: [41, 70],
            label: { ru: 'Средний', kk: 'Орташа', en: 'Medium' },
            description: {
                ru: 'Хороший уровень, но есть пространство для развития.',
                kk: 'Жақсы деңгей, бірақ дамуға орын бар.',
                en: 'Good level, but there is room for improvement.'
            }
        },
        high: {
            range: [71, 100],
            label: { ru: 'Высокий', kk: 'Жоғары', en: 'High' },
            description: {
                ru: 'Отличные показатели! Это ваша сильная сторона.',
                kk: 'Керемет көрсеткіштер! Бұл сіздің күшті жағыңыз.',
                en: 'Excellent results! This is your strength.'
            }
        }
    }
};

// Экспорт для глобального использования
window.DETAILED_TESTS_DATA = DETAILED_TESTS_DATA;
