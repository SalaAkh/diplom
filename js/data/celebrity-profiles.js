/**
 * База данных профилей известных личностей
 * Содержит приблизительные профили знаменитостей для сравнения
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 * 
 * Примечание: Профили основаны на публичной информации и являются приблизительными оценками.
 */

const CELEBRITY_PROFILES = {
    categories: {
        business: { ru: 'Бизнесмены', kk: 'Бизнесмендер', en: 'Business Leaders' },
        science: { ru: 'Учёные', kk: 'Ғалымдар', en: 'Scientists' },
        actors: { ru: 'Актёры', kk: 'Актёрлер', en: 'Actors' },
        athletes: { ru: 'Спортсмены', kk: 'Спортшылар', en: 'Athletes' },
        leaders: { ru: 'Политики и Лидеры', kk: 'Саясаткерлер мен Көшбасшылар', en: 'Politicians & Leaders' }
    },

    profiles: [
        // === БИЗНЕСМЕНЫ ===
        {
            id: 'elon_musk',
            name: { ru: 'Илон Маск', kk: 'Илон Маск', en: 'Elon Musk' },
            category: 'business',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg/220px-Elon_Musk_Royal_Society_%28crop1%29.jpg',
            scores: {
                rationality: 0.85,
                strategic: 0.95,
                explorer: 0.90,
                individualism: 0.80,
                adaptation: 0.70,
                intuition: 0.60
            },
            bio: {
                ru: 'Основатель SpaceX и Tesla, визионер будущего человечества.',
                kk: 'SpaceX және Tesla негізін қалаушы, адамзат болашағының көреген.',
                en: 'Founder of SpaceX and Tesla, visionary of humanity\'s future.'
            },
            achievements: {
                ru: ['SpaceX', 'Tesla', 'Neuralink', 'The Boring Company'],
                kk: ['SpaceX', 'Tesla', 'Neuralink', 'The Boring Company'],
                en: ['SpaceX', 'Tesla', 'Neuralink', 'The Boring Company']
            }
        },
        {
            id: 'steve_jobs',
            name: { ru: 'Стив Джобс', kk: 'Стив Джобс', en: 'Steve Jobs' },
            category: 'business',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/220px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg',
            scores: {
                rationality: 0.70,
                strategic: 0.90,
                explorer: 0.85,
                individualism: 0.95,
                adaptation: 0.50,
                intuition: 0.90
            },
            bio: {
                ru: 'Сооснователь Apple, революционер в дизайне и технологиях.',
                kk: 'Apple серіктес негізін қалаушы, дизайн мен технологиядағы революционер.',
                en: 'Co-founder of Apple, revolutionary in design and technology.'
            },
            achievements: {
                ru: ['Apple', 'iPhone', 'Pixar', 'MacOS'],
                kk: ['Apple', 'iPhone', 'Pixar', 'MacOS'],
                en: ['Apple', 'iPhone', 'Pixar', 'MacOS']
            }
        },
        {
            id: 'bill_gates',
            name: { ru: 'Билл Гейтс', kk: 'Билл Гейтс', en: 'Bill Gates' },
            category: 'business',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/220px-Bill_Gates_2018.jpg',
            scores: {
                rationality: 0.95,
                strategic: 0.90,
                explorer: 0.75,
                individualism: 0.60,
                adaptation: 0.80,
                intuition: 0.40
            },
            bio: {
                ru: 'Сооснователь Microsoft, филантроп и борец с глобальными проблемами.',
                kk: 'Microsoft серіктес негізін қалаушы, филантроп және жаһандық мәселелермен күресуші.',
                en: 'Co-founder of Microsoft, philanthropist fighting global issues.'
            },
            achievements: {
                ru: ['Microsoft', 'Windows', 'Gates Foundation'],
                kk: ['Microsoft', 'Windows', 'Gates Foundation'],
                en: ['Microsoft', 'Windows', 'Gates Foundation']
            }
        },
        {
            id: 'jeff_bezos',
            name: { ru: 'Джефф Безос', kk: 'Джефф Безос', en: 'Jeff Bezos' },
            category: 'business',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg/220px-Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg',
            scores: {
                rationality: 0.90,
                strategic: 0.95,
                explorer: 0.70,
                individualism: 0.75,
                adaptation: 0.85,
                intuition: 0.50
            },
            bio: {
                ru: 'Основатель Amazon, пионер электронной коммерции.',
                kk: 'Amazon негізін қалаушы, электрондық коммерция пионері.',
                en: 'Founder of Amazon, pioneer of e-commerce.'
            },
            achievements: {
                ru: ['Amazon', 'AWS', 'Blue Origin', 'Washington Post'],
                kk: ['Amazon', 'AWS', 'Blue Origin', 'Washington Post'],
                en: ['Amazon', 'AWS', 'Blue Origin', 'Washington Post']
            }
        },
        {
            id: 'warren_buffett',
            name: { ru: 'Уоррен Баффетт', kk: 'Уоррен Баффетт', en: 'Warren Buffett' },
            category: 'business',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/220px-Warren_Buffett_KU_Visit.jpg',
            scores: {
                rationality: 0.95,
                strategic: 0.90,
                explorer: 0.40,
                individualism: 0.50,
                adaptation: 0.60,
                intuition: 0.70
            },
            bio: {
                ru: 'Легендарный инвестор, CEO Berkshire Hathaway.',
                kk: 'Аңызға айналған инвестор, Berkshire Hathaway CEO.',
                en: 'Legendary investor, CEO of Berkshire Hathaway.'
            },
            achievements: {
                ru: ['Berkshire Hathaway', 'Оракул из Омахи'],
                kk: ['Berkshire Hathaway', 'Омаха Оракулы'],
                en: ['Berkshire Hathaway', 'Oracle of Omaha']
            }
        },

        // === УЧЁНЫЕ ===
        {
            id: 'albert_einstein',
            name: { ru: 'Альберт Эйнштейн', kk: 'Альберт Эйнштейн', en: 'Albert Einstein' },
            category: 'science',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/220px-Albert_Einstein_Head.jpg',
            scores: {
                rationality: 0.90,
                strategic: 0.60,
                explorer: 0.95,
                individualism: 0.85,
                adaptation: 0.40,
                intuition: 0.90
            },
            bio: {
                ru: 'Физик-теоретик, создатель теории относительности.',
                kk: 'Теоретик физик, салыстырмалылық теориясының жасаушысы.',
                en: 'Theoretical physicist, creator of the theory of relativity.'
            },
            achievements: {
                ru: ['Теория относительности', 'Нобелевская премия', 'E=mc²'],
                kk: ['Салыстырмалылық теориясы', 'Нобель сыйлығы', 'E=mc²'],
                en: ['Theory of Relativity', 'Nobel Prize', 'E=mc²']
            }
        },
        {
            id: 'marie_curie',
            name: { ru: 'Мария Кюри', kk: 'Мария Кюри', en: 'Marie Curie' },
            category: 'science',
            scores: {
                rationality: 0.95,
                strategic: 0.70,
                explorer: 0.95,
                individualism: 0.70,
                adaptation: 0.80,
                intuition: 0.50
            },
            bio: {
                ru: 'Первая женщина — лауреат Нобелевской премии, открыла радий.',
                kk: 'Нобель сыйлығын алған алғашқы әйел, радийді ашты.',
                en: 'First woman to win a Nobel Prize, discovered radium.'
            },
            achievements: {
                ru: ['2 Нобелевские премии', 'Открытие радия', 'Пионер радиологии'],
                kk: ['2 Нобель сыйлығы', 'Радийді ашу', 'Радиология пионері'],
                en: ['2 Nobel Prizes', 'Discovery of Radium', 'Pioneer of Radiology']
            }
        },
        {
            id: 'stephen_hawking',
            name: { ru: 'Стивен Хокинг', kk: 'Стивен Хокинг', en: 'Stephen Hawking' },
            category: 'science',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/220px-Stephen_Hawking.StarChild.jpg',
            scores: {
                rationality: 0.95,
                strategic: 0.80,
                explorer: 0.95,
                individualism: 0.75,
                adaptation: 0.90,
                intuition: 0.70
            },
            bio: {
                ru: 'Космолог и популяризатор науки, автор "Краткой истории времени".',
                kk: 'Космолог және ғылымды танымалдандырушы, "Уақыттың қысқаша тарихы" авторы.',
                en: 'Cosmologist and science communicator, author of "A Brief History of Time".'
            },
            achievements: {
                ru: ['Излучение Хокинга', 'Краткая история времени', 'Теория чёрных дыр'],
                kk: ['Хокинг сәулесі', 'Уақыттың қысқаша тарихы', 'Қара құрдымдар теориясы'],
                en: ['Hawking Radiation', 'A Brief History of Time', 'Black Hole Theory']
            }
        },
        {
            id: 'nikola_tesla',
            name: { ru: 'Никола Тесла', kk: 'Никола Тесла', en: 'Nikola Tesla' },
            category: 'science',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/220px-N.Tesla.JPG',
            scores: {
                rationality: 0.85,
                strategic: 0.50,
                explorer: 0.95,
                individualism: 0.95,
                adaptation: 0.30,
                intuition: 0.90
            },
            bio: {
                ru: 'Изобретатель переменного тока и визионер электрификации.',
                kk: 'Айнымалы токтың өнертапқышы және электрлендіру көрегені.',
                en: 'Inventor of alternating current and visionary of electrification.'
            },
            achievements: {
                ru: ['Переменный ток', 'Трансформатор Тесла', '300+ патентов'],
                kk: ['Айнымалы ток', 'Тесла трансформаторы', '300+ патент'],
                en: ['Alternating Current', 'Tesla Coil', '300+ Patents']
            }
        },

        // === АКТЁРЫ ===
        {
            id: 'leonardo_dicaprio',
            name: { ru: 'Леонардо Ди Каприо', kk: 'Леонардо Ди Каприо', en: 'Leonardo DiCaprio' },
            category: 'actors',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_Dicaprio_Cannes_2019.jpg/220px-Leonardo_Dicaprio_Cannes_2019.jpg',
            scores: {
                rationality: 0.60,
                strategic: 0.70,
                explorer: 0.75,
                individualism: 0.65,
                adaptation: 0.85,
                intuition: 0.80
            },
            bio: {
                ru: 'Оскароносный актёр и экоактивист.',
                kk: 'Оскар иегері актёр және эко-белсенді.',
                en: 'Oscar-winning actor and environmental activist.'
            },
            achievements: {
                ru: ['Оскар', 'Титаник', 'Выживший', 'Волк с Уолл-стрит'],
                kk: ['Оскар', 'Титаник', 'Тірі қалған', 'Уолл-стрит қасқыры'],
                en: ['Oscar', 'Titanic', 'The Revenant', 'Wolf of Wall Street']
            }
        },
        {
            id: 'meryl_streep',
            name: { ru: 'Мэрил Стрип', kk: 'Мэрил Стрип', en: 'Meryl Streep' },
            category: 'actors',
            scores: {
                rationality: 0.70,
                strategic: 0.65,
                explorer: 0.60,
                individualism: 0.55,
                adaptation: 0.95,
                intuition: 0.85
            },
            bio: {
                ru: 'Легенда кино, рекордсменка по номинациям на Оскар.',
                kk: 'Кино аңызы, Оскар номинациясы бойынша рекордшы.',
                en: 'Film legend, record holder for Oscar nominations.'
            },
            achievements: {
                ru: ['3 Оскара', '21 номинация', 'Золотые Глобусы'],
                kk: ['3 Оскар', '21 номинация', 'Алтын Глобустар'],
                en: ['3 Oscars', '21 nominations', 'Golden Globes']
            }
        },
        {
            id: 'keanu_reeves',
            name: { ru: 'Киану Ривз', kk: 'Киану Ривз', en: 'Keanu Reeves' },
            category: 'actors',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Reeves_San_Diego_Comic_Con_2013_3.jpg/220px-Reeves_San_Diego_Comic_Con_2013_3.jpg',
            scores: {
                rationality: 0.50,
                strategic: 0.40,
                explorer: 0.60,
                individualism: 0.45,
                adaptation: 0.85,
                intuition: 0.75
            },
            bio: {
                ru: 'Актёр-икона, известный добротой и скромностью.',
                kk: 'Мейірімділігі мен қарапайымдылығымен танымал актёр-икона.',
                en: 'Iconic actor known for kindness and humility.'
            },
            achievements: {
                ru: ['Матрица', 'Джон Уик', 'Скорость'],
                kk: ['Матрица', 'Джон Уик', 'Жылдамдық'],
                en: ['The Matrix', 'John Wick', 'Speed']
            }
        },
        {
            id: 'morgan_freeman',
            name: { ru: 'Морган Фриман', kk: 'Морган Фриман', en: 'Morgan Freeman' },
            category: 'actors',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg/220px-Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg',
            scores: {
                rationality: 0.75,
                strategic: 0.60,
                explorer: 0.50,
                individualism: 0.40,
                adaptation: 0.80,
                intuition: 0.70
            },
            bio: {
                ru: 'Голос кино, олицетворение мудрости и спокойствия.',
                kk: 'Кино дауысы, даналық пен тыныштықтың бейнесі.',
                en: 'The voice of cinema, embodiment of wisdom and calm.'
            },
            achievements: {
                ru: ['Оскар', 'Побег из Шоушенка', 'Брюс Всемогущий'],
                kk: ['Оскар', 'Шоушенктен қашу', 'Құдіретті Брюс'],
                en: ['Oscar', 'Shawshank Redemption', 'Bruce Almighty']
            }
        },

        // === СПОРТСМЕНЫ ===
        {
            id: 'michael_jordan',
            name: { ru: 'Майкл Джордан', kk: 'Майкл Джордан', en: 'Michael Jordan' },
            category: 'athletes',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg',
            scores: {
                rationality: 0.70,
                strategic: 0.85,
                explorer: 0.60,
                individualism: 0.90,
                adaptation: 0.75,
                intuition: 0.70
            },
            bio: {
                ru: 'Величайший баскетболист всех времён.',
                kk: 'Барлық уақыттың ең ұлы баскетболшысы.',
                en: 'The greatest basketball player of all time.'
            },
            achievements: {
                ru: ['6 чемпионств NBA', '5 MVP', 'Зал славы'],
                kk: ['6 NBA чемпионаты', '5 MVP', 'Даңқ залы'],
                en: ['6 NBA Championships', '5 MVPs', 'Hall of Fame']
            }
        },
        {
            id: 'serena_williams',
            name: { ru: 'Серена Уильямс', kk: 'Серена Уильямс', en: 'Serena Williams' },
            category: 'athletes',
            scores: {
                rationality: 0.65,
                strategic: 0.80,
                explorer: 0.55,
                individualism: 0.85,
                adaptation: 0.80,
                intuition: 0.65
            },
            bio: {
                ru: 'Легенда женского тенниса, 23 титула Большого Шлема.',
                kk: 'Әйелдер теннисінің аңызы, 23 Үлкен Шлем титулы.',
                en: 'Legend of women\'s tennis, 23 Grand Slam titles.'
            },
            achievements: {
                ru: ['23 Больших Шлема', '4 Олимпийских золота', '№1 в мире'],
                kk: ['23 Үлкен Шлем', '4 Олимпиада алтыны', 'Әлемде №1'],
                en: ['23 Grand Slams', '4 Olympic Golds', 'World #1']
            }
        },
        {
            id: 'lionel_messi',
            name: { ru: 'Лионель Месси', kk: 'Лионель Месси', en: 'Lionel Messi' },
            category: 'athletes',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/220px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
            scores: {
                rationality: 0.60,
                strategic: 0.75,
                explorer: 0.65,
                individualism: 0.50,
                adaptation: 0.90,
                intuition: 0.95
            },
            bio: {
                ru: 'Величайший футболист современности, гений дриблинга.',
                kk: 'Қазіргі заманның ең ұлы футболшысы, дриблинг данышпаны.',
                en: 'The greatest footballer of modern times, dribbling genius.'
            },
            achievements: {
                ru: ['8 Золотых мячей', 'Чемпион мира 2022', '4 Лиги Чемпионов'],
                kk: ['8 Алтын доп', '2022 әлем чемпионы', '4 Чемпиондар Лигасы'],
                en: ['8 Ballon d\'Ors', 'World Cup 2022', '4 Champions Leagues']
            }
        },
        {
            id: 'usain_bolt',
            name: { ru: 'Усэйн Болт', kk: 'Усэйн Болт', en: 'Usain Bolt' },
            category: 'athletes',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Usain_Bolt_portrait.jpg/220px-Usain_Bolt_portrait.jpg',
            scores: {
                rationality: 0.55,
                strategic: 0.60,
                explorer: 0.50,
                individualism: 0.75,
                adaptation: 0.70,
                intuition: 0.80
            },
            bio: {
                ru: 'Самый быстрый человек в истории, легенда лёгкой атлетики.',
                kk: 'Тарихтағы ең жылдам адам, жеңіл атлетика аңызы.',
                en: 'The fastest man in history, legend of athletics.'
            },
            achievements: {
                ru: ['8 Олимпийских золота', 'Мировой рекорд 100м', 'Мировой рекорд 200м'],
                kk: ['8 Олимпиада алтыны', '100м әлем рекорды', '200м әлем рекорды'],
                en: ['8 Olympic Golds', '100m World Record', '200m World Record']
            }
        },

        // === ПОЛИТИКИ И ЛИДЕРЫ ===
        {
            id: 'nelson_mandela',
            name: { ru: 'Нельсон Мандела', kk: 'Нельсон Мандела', en: 'Nelson Mandela' },
            category: 'leaders',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/220px-Nelson_Mandela_1994.jpg',
            scores: {
                rationality: 0.70,
                strategic: 0.85,
                explorer: 0.60,
                individualism: 0.50,
                adaptation: 0.95,
                intuition: 0.70
            },
            bio: {
                ru: 'Борец с апартеидом, символ примирения и свободы.',
                kk: 'Апартеидпен күрескер, бітімгершілік пен бостандық символы.',
                en: 'Anti-apartheid fighter, symbol of reconciliation and freedom.'
            },
            achievements: {
                ru: ['Президент ЮАР', 'Нобелевская премия мира', '27 лет в заключении'],
                kk: ['ОАР Президенті', 'Бейбітшілік Нобель сыйлығы', '27 жыл түрмеде'],
                en: ['President of South Africa', 'Nobel Peace Prize', '27 years imprisoned']
            }
        },
        {
            id: 'mahatma_gandhi',
            name: { ru: 'Махатма Ганди', kk: 'Махатма Ганди', en: 'Mahatma Gandhi' },
            category: 'leaders',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/220px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
            scores: {
                rationality: 0.65,
                strategic: 0.80,
                explorer: 0.55,
                individualism: 0.40,
                adaptation: 0.90,
                intuition: 0.85
            },
            bio: {
                ru: 'Отец индийской нации, лидер ненасильственного сопротивления.',
                kk: 'Үнді ұлтының әкесі, зорлықсыз қарсылық көшбасшысы.',
                en: 'Father of the Indian nation, leader of non-violent resistance.'
            },
            achievements: {
                ru: ['Независимость Индии', 'Сатьяграха', 'Символ мира'],
                kk: ['Үндістан тәуелсіздігі', 'Сатьяграха', 'Бейбітшілік символы'],
                en: ['Indian Independence', 'Satyagraha', 'Symbol of Peace']
            }
        },
        {
            id: 'oprah_winfrey',
            name: { ru: 'Опра Уинфри', kk: 'Опра Уинфри', en: 'Oprah Winfrey' },
            category: 'leaders',
            scores: {
                rationality: 0.70,
                strategic: 0.80,
                explorer: 0.65,
                individualism: 0.60,
                adaptation: 0.90,
                intuition: 0.85
            },
            bio: {
                ru: 'Медиамагнат, филантроп, голос поколений.',
                kk: 'Медиамагнат, филантроп, ұрпақтар дауысы.',
                en: 'Media mogul, philanthropist, voice of generations.'
            },
            achievements: {
                ru: ['Шоу Опры', 'Медиаимперия', 'Филантропия'],
                kk: ['Опра шоуы', 'Медиа империясы', 'Филантропия'],
                en: ['The Oprah Show', 'Media Empire', 'Philanthropy']
            }
        },
        {
            id: 'winston_churchill',
            name: { ru: 'Уинстон Черчилль', kk: 'Уинстон Черчилль', en: 'Winston Churchill' },
            category: 'leaders',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/220px-Sir_Winston_Churchill_-_19086236948.jpg',
            scores: {
                rationality: 0.75,
                strategic: 0.95,
                explorer: 0.50,
                individualism: 0.80,
                adaptation: 0.65,
                intuition: 0.60
            },
            bio: {
                ru: 'Премьер-министр Великобритании, лидер времён Второй мировой.',
                kk: 'Ұлыбритания премьер-министрі, Екінші дүниежүзілік соғыс көшбасшысы.',
                en: 'Prime Minister of the UK, leader during World War II.'
            },
            achievements: {
                ru: ['Победа во Второй мировой', 'Нобелевская премия по литературе', 'Великий оратор'],
                kk: ['Екінші дүниежүзілік соғыстағы жеңіс', 'Әдебиет бойынша Нобель сыйлығы', 'Ұлы шешен'],
                en: ['WWII Victory', 'Nobel Prize in Literature', 'Great Orator']
            }
        }
    ]
};

// Экспорт для глобального использования
window.CELEBRITY_PROFILES = CELEBRITY_PROFILES;
