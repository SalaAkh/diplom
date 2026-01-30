/**
 * Встроенные данные углубленного теста
 * Используется для работы без сервера (file:// protocol)
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 * 
 * Все вопросы поддерживают три языка: казахский (kk), русский (ru), английский (en)
 */

// Объявляем переменную в глобальной области видимости
var ADVANCED_SCENARIOS_DATA = {
  "questions": [
    {
      "id": 1,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "work",
        "contextType": "complex_crisis",
        "primaryDimensions": ["rationality", "control", "strategic", "meaning"],
        "estimatedTime": 120
      },
      "title": {
        "kk": "Күрделі жоба дағдарысы: этика мен тиімділік",
        "ru": "Сложный кризис проекта: этика и эффективность",
        "en": "Complex Project Crisis: Ethics and Efficiency"
      },
      "description": {
        "kk": "Сіздің негізгі жобаңыз күтпеген техникалық проблемаларға тап болды. Мерзімдер қысымда, клиент ашулы, команда стресс астында. Бұл ретте сіз бірнеше қиын шешім қабылдауыңыз керек.",
        "ru": "Ваш ключевой проект столкнулся с неожиданными техническими проблемами. Сроки критичны, клиент недоволен, команда в стрессе. При этом вам предстоит принять несколько сложных решений, которые повлияют не только на проект, но и на ваши ценности.",
        "en": "Your key project has encountered unexpected technical problems. Deadlines are critical, the client is dissatisfied, the team is under stress. At the same time, you need to make several difficult decisions that will affect not only the project but also your values."
      },
      "context": {
        "kk": "Жобаның маңыздылығы жоғары, бірақ қысқа мерзімде нәтиже алу үшін сізге құндылықтарыңызбен компромисс жасауға тура келуі мүмкін. Бұл шешім сіздің кәсіби беделіңізге, команданың сеніміне және жобаның ұзақ мерзімді табысына әсер етеді.",
        "ru": "Проект критически важен, но для получения результата в короткие сроки вам, возможно, придётся пойти на компромисс со своими ценностями. Это решение повлияет на вашу профессиональную репутацию, доверие команды и долгосрочный успех проекта.",
        "en": "The project is critically important, but to get results in a short time, you may have to compromise your values. This decision will affect your professional reputation, team trust, and the long-term success of the project."
      },
      "optionA": {
        "text": {
          "kk": "Жобаны тоқтатып, барлық проблемаларды терең талдау, этикалық стандарттарды сақтай отырып, шынайы уақыт кестесі мен ресурстарды қайта бағалау",
          "ru": "Остановить проект, провести глубокий анализ всех проблем, сохраняя этические стандарты, переоценить реалистичные сроки и ресурсы",
          "en": "Stop the project, conduct a deep analysis of all problems, maintaining ethical standards, reassess realistic timelines and resources"
        },
        "weights": {
          "rationality": 0.95,
          "control": 0.9,
          "strategic": 0.85,
          "meaning": 0.8,
          "explorer": 0.4,
          "individualism": 0.3
        }
      },
      "optionB": {
        "text": {
          "kk": "Жағдайға тез бейімделу, инновациялық шешімдерді іздеу, командамен бірлесіп креативті тәсілдерді қолдану, бірақ этикалық шекараларды сақтау",
          "ru": "Быстро адаптироваться к ситуации, искать инновационные решения, применять креативные подходы совместно с командой, но сохранять этические границы",
          "en": "Quickly adapt to the situation, seek innovative solutions, apply creative approaches together with the team, but maintain ethical boundaries"
        },
        "weights": {
          "adaptation": 0.95,
          "intuition": 0.85,
          "explorer": 0.8,
          "collectivism": 0.7,
          "meaning": 0.6,
          "tactical": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Команда мен клиентпен ашық диалог бастау, барлық қатысушылардың қажеттіліктерін ескере отырып, ұжымдық шешім табу, мүмкін мерзімдерді кеңейту",
          "ru": "Начать открытый диалог с командой и клиентом, найти коллективное решение, учитывая потребности всех участников, возможно, расширить сроки",
          "en": "Start an open dialogue with the team and client, find a collective solution, considering the needs of all participants, possibly extend deadlines"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.85,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.5,
          "explorer": 0.3
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық нәтижелерге назар аудару, қысқа мерзімде мақсатқа жету үшін барлық ресурстарды пайдалану, тиімділікті максимизациялау",
          "ru": "Сфокусироваться на практических результатах, использовать все ресурсы для достижения цели в кратчайшие сроки, максимизировать эффективность",
          "en": "Focus on practical results, use all resources to achieve the goal in the shortest time, maximize efficiency"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "tactical": 0.8,
          "control": 0.7,
          "rationality": 0.6,
          "individualism": 0.4
        }
      }
    },
    {
      "id": 2,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "work",
        "contextType": "planning_preference",
        "primaryDimensions": ["control", "strategic", "rationality"],
        "estimatedTime": 30
      },
      "title": {
        "kk": "Жоспарлау стилі",
        "ru": "Стиль планирования",
        "en": "Planning Style"
      },
      "description": {
        "kk": "Келесі мәлімдемені оқып, сіздің келісіміңізді бағалаңыз:",
        "ru": "Прочитайте следующее утверждение и оцените степень вашего согласия:",
        "en": "Read the following statement and rate your level of agreement:"
      },
      "prompt": {
        "kk": "Мен маңызды жобаларды бастамас бұрын егжей-тегжейлі жоспар құруды және барлық мүмкін нұсқаларды талдауды қалаймын.",
        "ru": "Я предпочитаю создавать детальный план и анализировать все возможные варианты перед началом важных проектов.",
        "en": "I prefer to create a detailed plan and analyze all possible options before starting important projects."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "control": -0.9, "strategic": -0.9, "rationality": -0.8, "adaptation": 0.8, "intuition": 0.7 },
        "2": { "control": -0.7, "strategic": -0.7, "rationality": -0.6, "adaptation": 0.6, "intuition": 0.5 },
        "3": { "control": -0.5, "strategic": -0.5, "rationality": -0.4, "adaptation": 0.4, "intuition": 0.3 },
        "4": { "control": -0.3, "strategic": -0.3, "rationality": -0.2, "adaptation": 0.2, "intuition": 0.1 },
        "5": { "control": 0.0, "strategic": 0.0, "rationality": 0.0, "adaptation": 0.0, "intuition": 0.0 },
        "6": { "control": 0.3, "strategic": 0.3, "rationality": 0.2, "adaptation": -0.2, "intuition": -0.1 },
        "7": { "control": 0.5, "strategic": 0.5, "rationality": 0.4, "adaptation": -0.4, "intuition": -0.3 },
        "8": { "control": 0.7, "strategic": 0.7, "rationality": 0.6, "adaptation": -0.6, "intuition": -0.5 },
        "9": { "control": 0.9, "strategic": 0.9, "rationality": 0.8, "adaptation": -0.8, "intuition": -0.7 },
        "10": { "control": 1.0, "strategic": 1.0, "rationality": 0.9, "adaptation": -0.9, "intuition": -0.8 }
      }
    },
    {
      "id": 3,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "work",
        "contextType": "work_philosophy",
        "primaryDimensions": ["meaning", "individualism", "strategic"],
        "estimatedTime": 180
      },
      "title": {
        "kk": "Жұмыс философиясы",
        "ru": "Философия работы",
        "en": "Work Philosophy"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз. Сіздің жауабыңыз сіздің жұмысқа деген көзқарасыңызды көрсетеді.",
        "ru": "Дайте развёрнутый ответ на следующий вопрос. Ваш ответ покажет ваше отношение к работе.",
        "en": "Give a detailed answer to the following question. Your answer will show your attitude towards work."
      },
      "prompt": {
        "kk": "Жұмыстың сіз үшін не маңызды екенін сипаттаңыз. Сіз жұмыста не іздейсіз: мақсат, мағына, табыс, даму, басқаларға көмектесу? Неліктен?",
        "ru": "Опишите, что для вас важно в работе. Что вы ищете в работе: цель, смысл, успех, развитие, помощь другим? Почему?",
        "en": "Describe what is important to you in work. What do you seek in work: purpose, meaning, success, development, helping others? Why?"
      },
      "maxLength": 500,
      "keywords": {
        "meaning": ["мағына", "мақсат", "құндылық", "смысл", "цель", "ценность", "purpose", "meaning", "value"],
        "individualism": ["өзім", "мен", "жеке", "самостоятельно", "личный", "myself", "personal", "independent"],
        "collectivism": ["команда", "ұжым", "бірге", "команда", "коллектив", "вместе", "team", "together", "collective"],
        "strategic": ["болашақ", "перспектива", "стратегия", "будущее", "стратегия", "future", "strategy"],
        "utility": ["пайда", "тиімділік", "нәтиже", "польза", "эффективность", "результат", "benefit", "efficiency", "result"]
      }
    },
    {
      "id": 4,
      "type": "situational",
      "metadata": {
        "difficulty": "high",
        "category": "work",
        "contextType": "multi_step_decision",
        "primaryDimensions": ["rationality", "control", "adaptation", "collectivism"],
        "estimatedTime": 150
      },
      "title": {
        "kk": "Көп қадамды жоба басқару",
        "ru": "Многошаговое управление проектом",
        "en": "Multi-step Project Management"
      },
      "description": {
        "kk": "Сіз маңызды жобаны басқарып жатырсыз. Жоба бірнеше кезеңнен тұрады, әр кезеңде сізге шешім қабылдау керек.",
        "ru": "Вы управляете важным проектом. Проект состоит из нескольких этапов, на каждом этапе вам нужно принять решение.",
        "en": "You are managing an important project. The project consists of several stages, at each stage you need to make a decision."
      },
      "steps": [
        {
          "stepId": 1,
          "title": {
            "kk": "Бірінші кезең: Жобаның басталуы",
            "ru": "Первый этап: Начало проекта",
            "en": "Stage 1: Project Start"
          },
          "description": {
            "kk": "Жоба басталғанда, сізге команда құру керек. Сіз қалай әрекет етесіз?",
            "ru": "При начале проекта вам нужно сформировать команду. Как вы поступите?",
            "en": "When starting the project, you need to form a team. How will you proceed?"
          },
          "options": {
            "A": {
              "text": {
                "kk": "Тексерілген мамандарды таңдау, олардың тәжірибесі мен сапасын терең талдау",
                "ru": "Выбрать проверенных специалистов, глубоко проанализировать их опыт и квалификацию",
                "en": "Choose proven specialists, deeply analyze their experience and qualifications"
              },
              "weights": {
                "rationality": 0.8,
                "control": 0.7,
                "individualism": 0.3
              }
            },
            "B": {
              "text": {
                "kk": "Жаңа таланттарды іздеу, командаға түрлі көзқарастар мен идеялар енгізу",
                "ru": "Искать новые таланты, привнести в команду разнообразные взгляды и идеи",
                "en": "Look for new talents, bring diverse views and ideas to the team"
              },
              "weights": {
                "explorer": 0.8,
                "adaptation": 0.6,
                "collectivism": 0.4
              }
            },
            "C": {
              "text": {
                "kk": "Командамен бірлесіп таңдау, барлықтың пікірін ескеру",
                "ru": "Выбирать совместно с командой, учитывать мнение всех",
                "en": "Choose together with the team, consider everyone's opinion"
              },
              "weights": {
                "collectivism": 0.9,
                "meaning": 0.5,
                "adaptation": 0.3
              }
            }
          }
        },
        {
          "stepId": 2,
          "title": {
            "kk": "Екінші кезең: Проблема туындады",
            "ru": "Второй этап: Возникла проблема",
            "en": "Stage 2: Problem Arises"
          },
          "description": {
            "kk": "Жобаның ортасында күтпеген техникалық проблема туындады. Сіз қалай әрекет етесіз?",
            "ru": "В середине проекта возникла неожиданная техническая проблема. Как вы поступите?",
            "en": "In the middle of the project, an unexpected technical problem arose. How will you proceed?"
          },
          "options": {
            "A": {
              "text": {
                "kk": "Проблеманы терең талдау, барлық нұсқаларды зерттеу, жүйелі шешім табу",
                "ru": "Глубоко проанализировать проблему, изучить все варианты, найти системное решение",
                "en": "Deeply analyze the problem, study all options, find a systematic solution"
              },
              "weights": {
                "rationality": 0.9,
                "control": 0.8,
                "strategic": 0.6
              }
            },
            "B": {
              "text": {
                "kk": "Жылдам эксперименттер жасау, әртүрлі тәсілдерді сынау, нәтижелерге бейімделу",
                "ru": "Быстро экспериментировать, пробовать разные подходы, адаптироваться к результатам",
                "en": "Quickly experiment, try different approaches, adapt to results"
              },
              "weights": {
                "adaptation": 0.9,
                "intuition": 0.7,
                "explorer": 0.6
              }
            },
            "C": {
              "text": {
                "kk": "Командамен миға шабуыл жасау, ұжымдық шешім табу",
                "ru": "Провести мозговой штурм с командой, найти коллективное решение",
                "en": "Brainstorm with the team, find a collective solution"
              },
              "weights": {
                "collectivism": 0.9,
                "meaning": 0.6,
                "adaptation": 0.5
              }
            }
          }
        }
      ],
      "finalWeights": {
        "rationality": 0.3,
        "control": 0.3,
        "adaptation": 0.2,
        "collectivism": 0.2
      }
    },
    {
      "id": 5,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "relationships",
        "contextType": "conflict_resolution",
        "primaryDimensions": ["collectivism", "rationality", "meaning", "adaptation"],
        "estimatedTime": 100
      },
      "title": {
        "kk": "Командадағы терең жанжал",
        "ru": "Глубокий конфликт в команде",
        "en": "Deep Team Conflict"
      },
      "description": {
        "kk": "Сіздің командаңызда екі негізгі қатысушы арасында күрделі жанжал туындады. Бұл жанжал тек жобаға ғана емес, команданың бүкіл атмосферасына да әсер етеді. Жанжалдың себептері терең: бұл тек мәселе туралы емес, құндылықтар мен көзқарастардың қайшылығы.",
        "ru": "В вашей команде возник сложный конфликт между двумя ключевыми участниками. Этот конфликт влияет не только на проект, но и на всю атмосферу команды. Причины конфликта глубоки: это не просто разногласие по вопросу, а столкновение ценностей и взглядов.",
        "en": "A complex conflict has arisen in your team between two key participants. This conflict affects not only the project but also the entire team atmosphere. The causes of the conflict are deep: it's not just a disagreement on an issue, but a clash of values and views."
      },
      "context": {
        "kk": "Сіздің шешіміңізге тек ағымдағы жоба ғана емес, команданың болашағы, сіздің көшбасшылық стиліңіз және команда мүшелерінің сенімі де байланысты.",
        "ru": "От вашего решения зависит не только текущий проект, но и будущее команды, ваш стиль лидерства и доверие членов команды.",
        "en": "Your decision will affect not only the current project but also the future of the team, your leadership style, and the trust of team members."
      },
      "optionA": {
        "text": {
          "kk": "Жанжалдың барлық себептерін терең талдау, әрбір қатысушымен жеке сұхбаттасу, фактілерді жинау, жүйелі шешім әзірлеу",
          "ru": "Глубоко проанализировать все причины конфликта, провести индивидуальные беседы с каждым участником, собрать факты, разработать системное решение",
          "en": "Deeply analyze all causes of the conflict, conduct individual conversations with each participant, gather facts, develop a systematic solution"
        },
        "weights": {
          "rationality": 0.95,
          "control": 0.85,
          "strategic": 0.75,
          "meaning": 0.6,
          "individualism": 0.4
        }
      },
      "optionB": {
        "text": {
          "kk": "Жылдам араласу, интуицияға сүйеніп шешім қабылдау, процесті жағдайға бейімдеу, динамиканы өзгерту",
          "ru": "Быстро вмешаться, принять решение на основе интуиции, адаптировать процесс под ситуацию, изменить динамику",
          "en": "Intervene quickly, make a decision based on intuition, adapt the process to the situation, change the dynamics"
        },
        "weights": {
          "adaptation": 0.95,
          "intuition": 0.9,
          "tactical": 0.8,
          "individualism": 0.5,
          "utility": 0.4
        }
      },
      "optionC": {
        "text": {
          "kk": "Бүкіл команданың ашық диалогын ұйымдастыру, барлық қатысушылардың дауысын есту, ұжымдық түсіністі табу, құндылықтарды біріктіру",
          "ru": "Организовать открытый диалог всей команды, услышать голос всех участников, найти коллективное понимание, объединить ценности",
          "en": "Organize an open dialogue of the whole team, hear the voice of all participants, find collective understanding, unite values"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.9,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Команда құрылымын қайта қарау, рөлдерді өзгерту, жұмыста тереңірек мағына табу, жанжалды даму мүмкіндігіне айналдыру",
          "ru": "Переосмыслить структуру команды, изменить роли, найти более глубокий смысл в работе, превратить конфликт в возможность развития",
          "en": "Rethink the team structure, change roles, find deeper meaning in work, turn conflict into an opportunity for development"
        },
        "weights": {
          "meaning": 0.95,
          "strategic": 0.85,
          "explorer": 0.75,
          "rationality": 0.6,
          "control": 0.5
        }
      }
    },
    {
      "id": 6,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "relationships",
        "contextType": "team_preference",
        "primaryDimensions": ["individualism", "collectivism"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Командалық жұмыс",
        "ru": "Командная работа",
        "en": "Teamwork"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен командада жұмыс істеуді жеке жұмыстан артық көремін, өйткені бірлесіп жұмыс істеу кезінде жақсы нәтижелерге қол жеткізуге болады.",
        "ru": "Я предпочитаю работать в команде, а не индивидуально, потому что совместная работа позволяет достигать лучших результатов.",
        "en": "I prefer to work in a team rather than individually, because teamwork allows achieving better results."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "collectivism": -0.9, "individualism": 0.9 },
        "2": { "collectivism": -0.7, "individualism": 0.7 },
        "3": { "collectivism": -0.5, "individualism": 0.5 },
        "4": { "collectivism": -0.3, "individualism": 0.3 },
        "5": { "collectivism": 0.0, "individualism": 0.0 },
        "6": { "collectivism": 0.3, "individualism": -0.3 },
        "7": { "collectivism": 0.5, "individualism": -0.5 },
        "8": { "collectivism": 0.7, "individualism": -0.7 },
        "9": { "collectivism": 0.9, "individualism": -0.9 },
        "10": { "collectivism": 1.0, "individualism": -1.0 }
      }
    },
    {
      "id": 7,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "relationships",
        "contextType": "communication_style",
        "primaryDimensions": ["collectivism", "meaning", "adaptation"],
        "estimatedTime": 150
      },
      "title": {
        "kk": "Қарым-қатынас стилі",
        "ru": "Стиль общения",
        "en": "Communication Style"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіз қарым-қатынастарда не іздейсіз? Сіз қалай қарым-қатынас құрастырасыз? Қандай қарым-қатынас сіз үшін маңызды?",
        "ru": "Что вы ищете в отношениях? Как вы выстраиваете отношения? Какие отношения важны для вас?",
        "en": "What do you seek in relationships? How do you build relationships? What relationships are important to you?"
      },
      "maxLength": 400,
      "keywords": {
        "collectivism": ["команда", "ұжым", "бірге", "достық", "команда", "коллектив", "вместе", "дружба", "team", "together", "friendship"],
        "meaning": ["мағына", "терең", "құндылық", "смысл", "глубокий", "ценность", "meaning", "deep", "value"],
        "adaptation": ["икемді", "бейімделу", "өзгеру", "гибкий", "адаптация", "изменение", "flexible", "adaptation", "change"]
      }
    },
    {
      "id": 8,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "decision_making",
        "contextType": "ethical_dilemma",
        "primaryDimensions": ["meaning", "rationality", "collectivism", "strategic"],
        "estimatedTime": 120
      },
      "title": {
        "kk": "Этикалық дилемма: пайда мен құндылықтар",
        "ru": "Этическая дилемма: выгода и ценности",
        "en": "Ethical Dilemma: Benefit and Values"
      },
      "description": {
        "kk": "Сізге маңызды бизнес-мүмкіндік ұсынылды, бұл сіздің компанияңызға үлкен пайда әкелуі мүмкін. Алайда, бұл мүмкіндік сіздің құндылықтарыңызбен қайшы келеді: ол экологиялық проблемаларға әкелуі мүмкін немесе белгілі бір топтарға теріс әсер етуі мүмкін.",
        "ru": "Вам предложили важную бизнес-возможность, которая может принести большую прибыль вашей компании. Однако эта возможность противоречит вашим ценностям: она может привести к экологическим проблемам или негативно повлиять на определённые группы людей.",
        "en": "You have been offered an important business opportunity that could bring significant profit to your company. However, this opportunity conflicts with your values: it could lead to environmental problems or negatively affect certain groups of people."
      },
      "context": {
        "kk": "Бұл шешім сіздің кәсіби карьераңызға, компанияның болашағына және сіздің құндылықтарыңызға әсер етеді. Сіз қалай әрекет етесіз?",
        "ru": "Это решение повлияет на вашу профессиональную карьеру, будущее компании и ваши ценности. Как вы поступите?",
        "en": "This decision will affect your professional career, the company's future, and your values. How will you proceed?"
      },
      "optionA": {
        "text": {
          "kk": "Барлық нұсқаларды логика мен этика тұрғысынан терең талдау, барлық фактілерді зерттеу, ең дұрыс шешімді табу",
          "ru": "Глубоко проанализировать все варианты с точки зрения логики и этики, изучить все факты, найти наиболее правильное решение",
          "en": "Deeply analyze all options from the point of view of logic and ethics, study all facts, find the most correct solution"
        },
        "weights": {
          "rationality": 0.95,
          "meaning": 0.9,
          "strategic": 0.8,
          "control": 0.7,
          "explorer": 0.5
        }
      },
      "optionB": {
        "text": {
          "kk": "Интуиция мен сезімге сену, құндылықтарыңызға сүйеніп, осы сәтте дұрыс көрінетін нәрсені таңдау",
          "ru": "Довериться интуиции и чувствам, опираясь на свои ценности, выбрать то, что кажется правильным в данный момент",
          "en": "Trust intuition and feelings, relying on your values, choose what seems right at the moment"
        },
        "weights": {
          "intuition": 0.95,
          "meaning": 0.9,
          "adaptation": 0.7,
          "tactical": 0.6,
          "individualism": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Басқалармен кеңесу, команданың, клиенттердің және қоғамның пікірін ескеру, көпшілікке сай келетін шешім табу",
          "ru": "Посоветоваться с другими, учесть мнение команды, клиентов и общества, найти решение, которое устроит большинство",
          "en": "Consult with others, consider the opinions of the team, clients, and society, find a solution that suits the majority"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.85,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық пайдаға назар аудару, минималды шығынмен максималды нәтиже алу, құндылықтарды екінші орынға қою",
          "ru": "Сфокусироваться на практической выгоде, получить максимальный результат с минимальными затратами, поставить ценности на второй план",
          "en": "Focus on practical benefits, get maximum results with minimal costs, put values in second place"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "tactical": 0.8,
          "rationality": 0.7,
          "control": 0.6
        }
      }
    },
    {
      "id": 9,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "decision_making",
        "contextType": "risk_tolerance",
        "primaryDimensions": ["control", "adaptation", "explorer"],
        "estimatedTime": 30
      },
      "title": {
        "kk": "Тәуекелге төзімділік",
        "ru": "Толерантность к риску",
        "en": "Risk Tolerance"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен белгісіз нәтижесі бар жаңа мүмкіндіктерді қабылдауға дайынмын, тіпті егер бұл тәуекелді болса да.",
        "ru": "Я готов принимать новые возможности с неопределённым результатом, даже если это рискованно.",
        "en": "I am ready to accept new opportunities with uncertain outcomes, even if it is risky."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "control": 0.9, "adaptation": -0.9, "explorer": -0.8 },
        "2": { "control": 0.7, "adaptation": -0.7, "explorer": -0.6 },
        "3": { "control": 0.5, "adaptation": -0.5, "explorer": -0.4 },
        "4": { "control": 0.3, "adaptation": -0.3, "explorer": -0.2 },
        "5": { "control": 0.0, "adaptation": 0.0, "explorer": 0.0 },
        "6": { "control": -0.3, "adaptation": 0.3, "explorer": 0.2 },
        "7": { "control": -0.5, "adaptation": 0.5, "explorer": 0.4 },
        "8": { "control": -0.7, "adaptation": 0.7, "explorer": 0.6 },
        "9": { "control": -0.9, "adaptation": 0.9, "explorer": 0.8 },
        "10": { "control": -1.0, "adaptation": 1.0, "explorer": 0.9 }
      }
    },
    {
      "id": 10,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "values",
        "contextType": "personal_values",
        "primaryDimensions": ["meaning", "strategic", "individualism"],
        "estimatedTime": 180
      },
      "title": {
        "kk": "Жеке құндылықтар",
        "ru": "Личные ценности",
        "en": "Personal Values"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіздің өмірдегі ең маңызды құндылықтарыңыз қандай? Неліктен олар сіз үшін маңызды? Олар сіздің таңдауларыңызға қалай әсер етеді?",
        "ru": "Какие ваши самые важные ценности в жизни? Почему они важны для вас? Как они влияют на ваши выборы?",
        "en": "What are your most important values in life? Why are they important to you? How do they influence your choices?"
      },
      "maxLength": 600,
      "keywords": {
        "meaning": ["мағына", "құндылық", "мақсат", "смысл", "ценность", "цель", "meaning", "value", "purpose"],
        "strategic": ["болашақ", "перспектива", "жоспар", "будущее", "перспектива", "план", "future", "perspective", "plan"],
        "individualism": ["өзім", "жеке", "тәуелсіз", "самостоятельно", "личный", "независимый", "myself", "personal", "independent"]
      }
    },
    {
      "id": 11,
      "type": "situational",
      "metadata": {
        "difficulty": "high",
        "category": "values",
        "contextType": "value_conflict",
        "primaryDimensions": ["meaning", "rationality", "collectivism", "adaptation"],
        "estimatedTime": 140
      },
      "title": {
        "kk": "Құндылықтар қайшылығы",
        "ru": "Конфликт ценностей",
        "en": "Value Conflict"
      },
      "description": {
        "kk": "Сіз құндылықтарыңызбен қайшы келетін жағдайға тап болдыңыз. Бұл жағдай бірнеше кезеңнен тұрады.",
        "ru": "Вы столкнулись с ситуацией, которая противоречит вашим ценностям. Эта ситуация состоит из нескольких этапов.",
        "en": "You have encountered a situation that conflicts with your values. This situation consists of several stages."
      },
      "steps": [
        {
          "stepId": 1,
          "title": {
            "kk": "Бірінші кезең: Проблеманы анықтау",
            "ru": "Первый этап: Определение проблемы",
            "en": "Stage 1: Problem Identification"
          },
          "description": {
            "kk": "Сіз құндылықтарыңызбен қайшы келетін нәрсені байқадыңыз. Сіз қалай әрекет етесіз?",
            "ru": "Вы заметили что-то, что противоречит вашим ценностям. Как вы поступите?",
            "en": "You noticed something that conflicts with your values. How will you proceed?"
          },
          "options": {
            "A": {
              "text": {
                "kk": "Проблеманы терең талдау, барлық фактілерді зерттеу, логикалық тұрғыдан бағалау",
                "ru": "Глубоко проанализировать проблему, изучить все факты, оценить с логической точки зрения",
                "en": "Deeply analyze the problem, study all facts, evaluate from a logical point of view"
              },
              "weights": {
                "rationality": 0.9,
                "control": 0.7,
                "meaning": 0.6
              }
            },
            "B": {
              "text": {
                "kk": "Сезімдер мен интуицияға сүйену, құндылықтарыңызға сәйкес дәл қазір әрекет ету",
                "ru": "Опираться на чувства и интуицию, действовать немедленно в соответствии с вашими ценностями",
                "en": "Rely on feelings and intuition, act immediately in accordance with your values"
              },
              "weights": {
                "intuition": 0.9,
                "meaning": 0.8,
                "adaptation": 0.6
              }
            },
            "C": {
              "text": {
                "kk": "Басқалармен кеңесу, басқалардың көзқарасын ескеру, ұжымдық түсіністі табу",
                "ru": "Посоветоваться с другими, учесть мнение других, найти коллективное понимание",
                "en": "Consult with others, consider others' opinions, find collective understanding"
              },
              "weights": {
                "collectivism": 0.9,
                "meaning": 0.7,
                "adaptation": 0.5
              }
            }
          }
        },
        {
          "stepId": 2,
          "title": {
            "kk": "Екінші кезең: Шешім қабылдау",
            "ru": "Второй этап: Принятие решения",
            "en": "Stage 2: Decision Making"
          },
          "description": {
            "kk": "Проблеманы анықтағаннан кейін, сізге шешім қабылдау керек. Сіз қалай әрекет етесіз?",
            "ru": "После определения проблемы вам нужно принять решение. Как вы поступите?",
            "en": "After identifying the problem, you need to make a decision. How will you proceed?"
          },
          "options": {
            "A": {
              "text": {
                "kk": "Жүйелі жоспар құру, барлық нұсқаларды талдау, ең дұрыс шешімді табу",
                "ru": "Создать системный план, проанализировать все варианты, найти наиболее правильное решение",
                "en": "Create a systematic plan, analyze all options, find the most correct solution"
              },
              "weights": {
                "rationality": 0.9,
                "strategic": 0.8,
                "control": 0.7
              }
            },
            "B": {
              "text": {
                "kk": "Икемді әрекет ету, жағдайға бейімделу, құндылықтарыңызды сақтай отырып шешім қабылдау",
                "ru": "Действовать гибко, адаптироваться к ситуации, принимать решение, сохраняя свои ценности",
                "en": "Act flexibly, adapt to the situation, make a decision while maintaining your values"
              },
              "weights": {
                "adaptation": 0.9,
                "meaning": 0.8,
                "intuition": 0.6
              }
            },
            "C": {
              "text": {
                "kk": "Басқалармен бірлесіп шешім табу, құндылықтарды біріктіру, ұжымдық мақсат қою",
                "ru": "Найти решение совместно с другими, объединить ценности, поставить коллективную цель",
                "en": "Find a solution together with others, unite values, set a collective goal"
              },
              "weights": {
                "collectivism": 0.9,
                "meaning": 0.85,
                "adaptation": 0.6
              }
            }
          }
        }
      ],
      "finalWeights": {
        "meaning": 0.4,
        "rationality": 0.2,
        "collectivism": 0.2,
        "adaptation": 0.2
      }
    },
    {
      "id": 12,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "creativity",
        "contextType": "innovation_challenge",
        "primaryDimensions": ["explorer", "adaptation", "intuition", "individualism"],
        "estimatedTime": 110
      },
      "title": {
        "kk": "Инновациялық сынақ: жаңа идея",
        "ru": "Инновационный вызов: новая идея",
        "en": "Innovation Challenge: New Idea"
      },
      "description": {
        "kk": "Сізде индустрияны түбірінен өзгерте алатын революциялық идея пайда болды. Бұл идея тек технологиялық инновация ғана емес, сонымен қатар қоғамдық өзгерістерді де қамтиды. Алайда, ол маңызды ресурстар мен тәуекелдерді талап етеді, және табыс кепілдендірілмеген.",
        "ru": "У вас появилась революционная идея, которая может кардинально изменить индустрию. Эта идея включает не только технологические инновации, но и социальные изменения. Однако она требует значительных ресурсов и рисков, и успех не гарантирован.",
        "en": "You have a revolutionary idea that could fundamentally change the industry. This idea includes not only technological innovations but also social changes. However, it requires significant resources and risks, and success is not guaranteed."
      },
      "context": {
        "kk": "Бұл идея сіздің бүкіл кәсіби жолыңызды өзгертуі мүмкін. Сіз қалай әрекет етесіз?",
        "ru": "Эта идея может изменить весь ваш профессиональный путь. Как вы поступите?",
        "en": "This idea could change your entire professional path. How will you proceed?"
      },
      "optionA": {
        "text": {
          "kk": "Терең зерттеу жүргізу, нарықты талдау, технологиялық мүмкіндіктерді зерттеу, егжей-тегжейлі бизнес-жоспар құру",
          "ru": "Провести глубокое исследование, проанализировать рынок, изучить технологические возможности, создать детальный бизнес-план",
          "en": "Conduct in-depth research, analyze the market, study technological possibilities, create a detailed business plan"
        },
        "weights": {
          "explorer": 0.95,
          "rationality": 0.9,
          "strategic": 0.85,
          "control": 0.75,
          "meaning": 0.6
        }
      },
      "optionB": {
        "text": {
          "kk": "Тез эксперимент жасай бастау, идеяны нақты жағдайларда сынау, барысында бейімделу, интуицияға сену",
          "ru": "Быстро начать экспериментировать, тестировать идею в реальных условиях, адаптироваться по ходу, доверять интуиции",
          "en": "Start experimenting quickly, test the idea in real conditions, adapt along the way, trust intuition"
        },
        "weights": {
          "adaptation": 0.95,
          "intuition": 0.9,
          "explorer": 0.85,
          "tactical": 0.7,
          "individualism": 0.6
        }
      },
      "optionC": {
        "text": {
          "kk": "Пікірлестер табу, команда құру, тәуекелдер мен табыстарды бөлісе отырып идеяны бірге дамыту",
          "ru": "Найти единомышленников, создать команду, развивать идею вместе, разделяя риски и успехи",
          "en": "Find like-minded people, create a team, develop the idea together, sharing risks and successes"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.8,
          "adaptation": 0.7,
          "explorer": 0.6,
          "tactical": 0.5
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық пайдаға назар аудару, жылдам монетизация жолын табу, тәуекелдерді азайту, тексерілген әдістерді қолдану",
          "ru": "Сфокусироваться на практической выгоде, найти быстрый способ монетизации, минимизировать риски, использовать проверенные методы",
          "en": "Focus on practical benefits, find a quick way to monetize, minimize risks, use proven methods"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "tactical": 0.8,
          "control": 0.7,
          "rationality": 0.6
        }
      }
    },
    {
      "id": 13,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "creativity",
        "contextType": "exploration_preference",
        "primaryDimensions": ["explorer", "executor"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Зерттеу қабілеті",
        "ru": "Способность к исследованию",
        "en": "Exploration Ability"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен жаңа салаларды зерттеуді және белгісіз нәрселерді үйренуді қалаймын, тіпті егер бұл практикалық пайдасы болмаса да.",
        "ru": "Я люблю исследовать новые области и изучать неизвестное, даже если это не имеет практической пользы.",
        "en": "I love to explore new areas and learn the unknown, even if it has no practical benefit."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "explorer": -0.9, "executor": 0.9 },
        "2": { "explorer": -0.7, "executor": 0.7 },
        "3": { "explorer": -0.5, "executor": 0.5 },
        "4": { "explorer": -0.3, "executor": 0.3 },
        "5": { "explorer": 0.0, "executor": 0.0 },
        "6": { "explorer": 0.3, "executor": -0.3 },
        "7": { "explorer": 0.5, "executor": -0.5 },
        "8": { "explorer": 0.7, "executor": -0.7 },
        "9": { "explorer": 0.9, "executor": -0.9 },
        "10": { "explorer": 1.0, "executor": -1.0 }
      }
    },
    {
      "id": 14,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "creativity",
        "contextType": "creative_process",
        "primaryDimensions": ["explorer", "adaptation", "intuition", "meaning"],
        "estimatedTime": 160
      },
      "title": {
        "kk": "Шығармашылық процесі",
        "ru": "Творческий процесс",
        "en": "Creative Process"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіз қалай жаңа идеялар табасыз? Сіздің шығармашылық процесіңіз қандай? Не сізді шабыттандырады?",
        "ru": "Как вы находите новые идеи? Каков ваш творческий процесс? Что вас вдохновляет?",
        "en": "How do you find new ideas? What is your creative process? What inspires you?"
      },
      "maxLength": 450,
      "keywords": {
        "explorer": ["зерттеу", "жаңа", "үйрену", "исследование", "новое", "изучение", "exploration", "new", "learning"],
        "adaptation": ["бейімделу", "өзгеру", "икемді", "адаптация", "изменение", "гибкий", "adaptation", "change", "flexible"],
        "intuition": ["интуиция", "сезім", "импульс", "интуиция", "чувство", "импульс", "intuition", "feeling", "impulse"],
        "meaning": ["мағына", "шабыт", "құндылық", "смысл", "вдохновение", "ценность", "meaning", "inspiration", "value"]
      }
    },
    {
      "id": 15,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "work",
        "contextType": "leadership_challenge",
        "primaryDimensions": ["collectivism", "strategic", "meaning", "control"],
        "estimatedTime": 110
      },
      "title": {
        "kk": "Көшбасшылық сынағы: мотивация мен бағыт",
        "ru": "Лидерский вызов: мотивация и направление",
        "en": "Leadership Challenge: Motivation and Direction"
      },
      "description": {
        "kk": "Сіздің командаңыз маңызды жобада жұмыс істеп жатыр, бірақ мотивациясын жоғалтып жатыр. Жоба күрделі, мерзімдер қысымда, команда мүшелері шаршаған. Сізге команданы шабыттандыру және мақсатқа бағыттау керек.",
        "ru": "Ваша команда работает над важным проектом, но теряет мотивацию. Проект сложный, сроки поджимают, члены команды устали. Вам нужно вдохновить команду и направить её к цели.",
        "en": "Your team is working on an important project but is losing motivation. The project is complex, deadlines are tight, team members are tired. You need to inspire the team and guide them to the goal."
      },
      "context": {
        "kk": "Сіздің тәсіліңіз команданың болашағына, жобаның табысына және сіздің көшбасшылық стиліңізге әсер етеді.",
        "ru": "Ваш подход повлияет на будущее команды, успех проекта и ваш стиль лидерства.",
        "en": "Your approach will affect the team's future, project success, and your leadership style."
      },
      "optionA": {
        "text": {
          "kk": "Жобаны талдау, команданың қажеттіліктерін зерттеу, жүйелі мотивациялық стратегия әзірлеу, процесті бақылау",
          "ru": "Проанализировать проект, изучить потребности команды, разработать системную мотивационную стратегию, контролировать процесс",
          "en": "Analyze the project, study team needs, develop a systematic motivational strategy, control the process"
        },
        "weights": {
          "rationality": 0.9,
          "control": 0.85,
          "strategic": 0.8,
          "meaning": 0.6,
          "individualism": 0.3
        }
      },
      "optionB": {
        "text": {
          "kk": "Жағдайға икемді бейімделу, командамен бірлесіп шешімдер табу, интуицияға сүйену, динамиканы өзгерту",
          "ru": "Гибко адаптироваться к ситуации, находить решения совместно с командой, опираться на интуицию, изменить динамику",
          "en": "Flexibly adapt to the situation, find solutions together with the team, rely on intuition, change dynamics"
        },
        "weights": {
          "adaptation": 0.9,
          "intuition": 0.8,
          "collectivism": 0.7,
          "tactical": 0.6,
          "meaning": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Команданы ортақ мақсаттың айналасына біріктіру, жобаның мағынасын түсіндіру, ұжымдық көзқарас қалыптастыру, команданы шабыттандыру",
          "ru": "Объединить команду вокруг общей цели, объяснить смысл проекта, создать коллективное видение, вдохновить команду",
          "en": "Unite the team around a common goal, explain the meaning of the project, create a collective vision, inspire the team"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.9,
          "strategic": 0.8,
          "adaptation": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық нәтижелерге назар аудару, тиімділікті арттыру, команданы пайда арқылы мотивациялау, процестерді оңтайландыру",
          "ru": "Сфокусироваться на практических результатах, повысить эффективность, мотивировать команду через выгоду, оптимизировать процессы",
          "en": "Focus on practical results, increase efficiency, motivate the team through benefits, optimize processes"
        },
        "weights": {
          "utility": 0.9,
          "executor": 0.85,
          "tactical": 0.8,
          "control": 0.7,
          "rationality": 0.6
        }
      }
    },
    {
      "id": 16,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "work",
        "contextType": "detail_orientation",
        "primaryDimensions": ["control", "rationality", "executor"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Детальдарға назар",
        "ru": "Внимание к деталям",
        "en": "Attention to Details"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен жұмысты орындау кезінде барлық детальдарға мұқият назар аударуды қалаймын, тіпті егер бұл уақыт алатын болса да.",
        "ru": "Я предпочитаю тщательно обращать внимание на все детали при выполнении работы, даже если это займёт время.",
        "en": "I prefer to carefully pay attention to all details when performing work, even if it takes time."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "control": -0.9, "rationality": -0.8, "executor": -0.9, "adaptation": 0.8 },
        "2": { "control": -0.7, "rationality": -0.6, "executor": -0.7, "adaptation": 0.6 },
        "3": { "control": -0.5, "rationality": -0.4, "executor": -0.5, "adaptation": 0.4 },
        "4": { "control": -0.3, "rationality": -0.2, "executor": -0.3, "adaptation": 0.2 },
        "5": { "control": 0.0, "rationality": 0.0, "executor": 0.0, "adaptation": 0.0 },
        "6": { "control": 0.3, "rationality": 0.2, "executor": 0.3, "adaptation": -0.2 },
        "7": { "control": 0.5, "rationality": 0.4, "executor": 0.5, "adaptation": -0.4 },
        "8": { "control": 0.7, "rationality": 0.6, "executor": 0.7, "adaptation": -0.6 },
        "9": { "control": 0.9, "rationality": 0.8, "executor": 0.9, "adaptation": -0.8 },
        "10": { "control": 1.0, "rationality": 0.9, "executor": 1.0, "adaptation": -0.9 }
      }
    },
    {
      "id": 17,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "work",
        "contextType": "career_goals",
        "primaryDimensions": ["strategic", "meaning", "individualism"],
        "estimatedTime": 170
      },
      "title": {
        "kk": "Мансаптық мақсаттар",
        "ru": "Карьерные цели",
        "en": "Career Goals"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіздің мансаптық мақсаттарыңыз қандай? Сіз 5-10 жыл ішінде қайда болғанды қалайсыз? Неліктен бұл мақсаттар сіз үшін маңызды?",
        "ru": "Каковы ваши карьерные цели? Где вы хотели бы быть через 5-10 лет? Почему эти цели важны для вас?",
        "en": "What are your career goals? Where would you like to be in 5-10 years? Why are these goals important to you?"
      },
      "maxLength": 500,
      "keywords": {
        "strategic": ["болашақ", "жоспар", "мақсат", "перспектива", "будущее", "план", "цель", "future", "plan", "goal"],
        "meaning": ["мағына", "құндылық", "мақсат", "смысл", "ценность", "цель", "meaning", "value", "purpose"],
        "individualism": ["өзім", "жеке", "тәуелсіз", "самостоятельно", "личный", "независимый", "myself", "personal", "independent"]
      }
    },
    {
      "id": 18,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "relationships",
        "contextType": "difficult_conversation",
        "primaryDimensions": ["collectivism", "rationality", "meaning", "adaptation"],
        "estimatedTime": 105
      },
      "title": {
        "kk": "Қиын әңгіме: кері баға беру",
        "ru": "Сложный разговор: обратная связь",
        "en": "Difficult Conversation: Feedback"
      },
      "description": {
        "kk": "Сізге команда мүшесіне кері баға беру керек. Олардың жұмысы сәтсіз болды, бірақ олар бұл туралы білмейді және өз жұмысына қанағаттанады. Сіздің тапсырмаңыз - оларға шынайы, бірақ құрылған кері баға беру.",
        "ru": "Вам нужно дать обратную связь члену команды. Их работа была неудачной, но они этого не знают и довольны своей работой. Ваша задача - дать им честную, но конструктивную обратную связь.",
        "en": "You need to give feedback to a team member. Their work was unsuccessful, but they don't know it and are satisfied with their work. Your task is to give them honest but constructive feedback."
      },
      "context": {
        "kk": "Бұл әңгіме команда мүшесінің сеніміне, сізбен қарым-қатынасына және олардың кәсіби дамуына әсер етеді.",
        "ru": "Этот разговор повлияет на доверие члена команды, ваши отношения и их профессиональное развитие.",
        "en": "This conversation will affect the team member's trust, your relationship, and their professional development."
      },
      "optionA": {
        "text": {
          "kk": "Фактілерді жинау, жұмысты терең талдау, жүйелі кері баға беру жоспарын әзірлеу, логикалық тұрғыдан түсіндіру",
          "ru": "Собрать факты, глубоко проанализировать работу, разработать системный план обратной связи, объяснить с логической точки зрения",
          "en": "Gather facts, deeply analyze the work, develop a systematic feedback plan, explain from a logical point of view"
        },
        "weights": {
          "rationality": 0.9,
          "control": 0.8,
          "strategic": 0.7,
          "individualism": 0.4,
          "meaning": 0.3
        }
      },
      "optionB": {
        "text": {
          "kk": "Икемді тәсіл қолдану, жағдайға бейімделу, интуицияға сүйену, құрылған әңгімені қолдану",
          "ru": "Применить гибкий подход, адаптироваться к ситуации, опираться на интуицию, использовать конструктивный разговор",
          "en": "Apply a flexible approach, adapt to the situation, rely on intuition, use constructive conversation"
        },
        "weights": {
          "adaptation": 0.9,
          "intuition": 0.8,
          "tactical": 0.7,
          "collectivism": 0.6,
          "meaning": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Ашық диалог бастау, команда мүшесінің көзқарасын есту, бірлесіп шешімдер табу, құрылған қарым-қатынас орнату",
          "ru": "Начать открытый диалог, услышать точку зрения члена команды, найти решения совместно, установить конструктивные отношения",
          "en": "Start an open dialogue, hear the team member's point of view, find solutions together, establish constructive relationships"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.85,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық нәтижелерге назар аудару, тиімділікті арттыру, нақты мәселелерді шешу, процестерді оңтайландыру",
          "ru": "Сфокусироваться на практических результатах, повысить эффективность, решить конкретные проблемы, оптимизировать процессы",
          "en": "Focus on practical results, increase efficiency, solve specific problems, optimize processes"
        },
        "weights": {
          "utility": 0.9,
          "executor": 0.85,
          "tactical": 0.8,
          "control": 0.7,
          "rationality": 0.6
        }
      }
    },
    {
      "id": 19,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "relationships",
        "contextType": "empathy",
        "primaryDimensions": ["collectivism", "meaning"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Эмпатия",
        "ru": "Эмпатия",
        "en": "Empathy"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен басқа адамдардың сезімдерін және тәжірибелерін терең түсінуге тырысамын және оларға көмектесуге дайынмын.",
        "ru": "Я стараюсь глубоко понимать чувства и опыт других людей и готов помочь им.",
        "en": "I try to deeply understand the feelings and experiences of other people and am ready to help them."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "collectivism": -0.9, "meaning": -0.9, "individualism": 0.8 },
        "2": { "collectivism": -0.7, "meaning": -0.7, "individualism": 0.6 },
        "3": { "collectivism": -0.5, "meaning": -0.5, "individualism": 0.4 },
        "4": { "collectivism": -0.3, "meaning": -0.3, "individualism": 0.2 },
        "5": { "collectivism": 0.0, "meaning": 0.0, "individualism": 0.0 },
        "6": { "collectivism": 0.3, "meaning": 0.3, "individualism": -0.2 },
        "7": { "collectivism": 0.5, "meaning": 0.5, "individualism": -0.4 },
        "8": { "collectivism": 0.7, "meaning": 0.7, "individualism": -0.6 },
        "9": { "collectivism": 0.9, "meaning": 0.9, "individualism": -0.8 },
        "10": { "collectivism": 1.0, "meaning": 1.0, "individualism": -1.0 }
      }
    },
    {
      "id": 20,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "decision_making",
        "contextType": "uncertainty",
        "primaryDimensions": ["adaptation", "intuition", "strategic", "control"],
        "estimatedTime": 115
      },
      "title": {
        "kk": "Белгісіздік: маңызды таңдау",
        "ru": "Неопределённость: важный выбор",
        "en": "Uncertainty: Important Choice"
      },
      "description": {
        "kk": "Сіз маңызды таңдау алдында тұрсыз, бірақ нәтижелерді болжау мүмкін емес. Бірнеше нұсқа бар, әрқайсысының өз артықшылықтары мен кемшіліктері бар, бірақ ешқайсысы кепілдендірілмеген.",
        "ru": "Вы стоите перед важным выбором, но последствия непредсказуемы. Есть несколько вариантов, каждый имеет свои преимущества и недостатки, но ни один не гарантирован.",
        "en": "You are facing an important choice, but the consequences are unpredictable. There are several options, each with its advantages and disadvantages, but none are guaranteed."
      },
      "context": {
        "kk": "Бұл шешім сіздің өміріңізді немесе карьераңызды өзгертуі мүмкін, бірақ нәтиже кепілдендірілмеген.",
        "ru": "Это решение может изменить вашу жизнь или карьеру, но результат не гарантирован.",
        "en": "This decision could change your life or career, but the result is not guaranteed."
      },
      "optionA": {
        "text": {
          "kk": "Барлық нұсқаларды мұқият талдау, максимум ақпарат жинау, әр қадамды жоспарлау, тәуекелдерді бағалау",
          "ru": "Тщательно проанализировать все варианты, собрать максимум информации, спланировать каждый шаг, оценить риски",
          "en": "Carefully analyze all options, collect maximum information, plan each step, assess risks"
        },
        "weights": {
          "rationality": 0.95,
          "control": 0.9,
          "strategic": 0.85,
          "meaning": 0.6,
          "explorer": 0.4
        }
      },
      "optionB": {
        "text": {
          "kk": "Интуицияға сену, бейімделуге дайын болу, стихиялы әрекет ету, жағдайға икемді бейімделу",
          "ru": "Довериться интуиции, быть готовым адаптироваться, действовать спонтанно, гибко адаптироваться к ситуации",
          "en": "Trust intuition, be ready to adapt, act spontaneously, flexibly adapt to the situation"
        },
        "weights": {
          "intuition": 0.95,
          "adaptation": 0.9,
          "tactical": 0.8,
          "explorer": 0.6,
          "individualism": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Жақындарымен кеңесу, басқалардың пікірін ескеру, ұжымда қолдау табу, бірлесіп шешім қабылдау",
          "ru": "Посоветоваться с близкими, учесть мнение других, найти поддержку в коллективе, принять решение совместно",
          "en": "Consult with loved ones, consider the opinions of others, find support in the team, make a decision together"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.8,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Болжамды нәтижесі бар ең қауіпсіз және практикалық нұсқаны таңдау, тәуекелдерді азайту",
          "ru": "Выбрать наиболее безопасный и практичный вариант с предсказуемым результатом, минимизировать риски",
          "en": "Choose the safest and most practical option with a predictable result, minimize risks"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "control": 0.85,
          "tactical": 0.7,
          "rationality": 0.6
        }
      }
    },
    {
      "id": 21,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "decision_making",
        "contextType": "intuition_vs_logic",
        "primaryDimensions": ["rationality", "intuition"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Интуиция мен логика",
        "ru": "Интуиция и логика",
        "en": "Intuition and Logic"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен маңызды шешімдерді қабылдау кезінде көбінесе интуицияға мен сезімдерге сенемін, логикалық талдаудан гөрі.",
        "ru": "При принятии важных решений я чаще доверяю интуиции и чувствам, чем логическому анализу.",
        "en": "When making important decisions, I often trust intuition and feelings more than logical analysis."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "intuition": -0.9, "rationality": 0.9 },
        "2": { "intuition": -0.7, "rationality": 0.7 },
        "3": { "intuition": -0.5, "rationality": 0.5 },
        "4": { "intuition": -0.3, "rationality": 0.3 },
        "5": { "intuition": 0.0, "rationality": 0.0 },
        "6": { "intuition": 0.3, "rationality": -0.3 },
        "7": { "intuition": 0.5, "rationality": -0.5 },
        "8": { "intuition": 0.7, "rationality": -0.7 },
        "9": { "intuition": 0.9, "rationality": -0.9 },
        "10": { "intuition": 1.0, "rationality": -1.0 }
      }
    },
    {
      "id": 22,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "decision_making",
        "contextType": "decision_process",
        "primaryDimensions": ["rationality", "intuition", "strategic"],
        "estimatedTime": 160
      },
      "title": {
        "kk": "Шешім қабылдау процесі",
        "ru": "Процесс принятия решений",
        "en": "Decision Making Process"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіз қалай шешім қабылдайсыз? Сіз қандай процесті қолданасыз? Сіз логикаға не интуицияға көбірек сенеміз? Неліктен?",
        "ru": "Как вы принимаете решения? Какой процесс вы используете? Вы больше доверяете логике или интуиции? Почему?",
        "en": "How do you make decisions? What process do you use? Do you trust logic or intuition more? Why?"
      },
      "maxLength": 450,
      "keywords": {
        "rationality": ["логика", "талдау", "фактілер", "логика", "анализ", "факты", "logic", "analysis", "facts"],
        "intuition": ["интуиция", "сезім", "импульс", "интуиция", "чувство", "импульс", "intuition", "feeling", "impulse"],
        "strategic": ["жоспар", "стратегия", "болашақ", "план", "стратегия", "будущее", "plan", "strategy", "future"]
      }
    },
    {
      "id": 23,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "values",
        "contextType": "value_compromise",
        "primaryDimensions": ["meaning", "rationality", "collectivism", "utility"],
        "estimatedTime": 120
      },
      "title": {
        "kk": "Құндылықтармен компромисс",
        "ru": "Компромисс с ценностями",
        "en": "Compromise with Values"
      },
      "description": {
        "kk": "Сізге маңызды мүмкіндік ұсынылды, бұл сіздің карьераңызға үлкен пайда әкелуі мүмкін. Алайда, бұл мүмкіндік сіздің құндылықтарыңызбен толық сәйкес келмейді: ол сіздің этикалық принциптеріңізбен қайшы келуі мүмкін.",
        "ru": "Вам предложили важную возможность, которая может принести большую пользу вашей карьере. Однако эта возможность не полностью соответствует вашим ценностям: она может противоречить вашим этическим принципам.",
        "en": "You have been offered an important opportunity that could bring great benefit to your career. However, this opportunity does not fully align with your values: it may contradict your ethical principles."
      },
      "context": {
        "kk": "Сіз құндылықтарыңызбен компромисс жасауға дайынсыз ба, әлде оларды сақтауға басымдық бересіз бе?",
        "ru": "Готовы ли вы пойти на компромисс со своими ценностями или предпочтёте сохранить их?",
        "en": "Are you ready to compromise your values or would you prefer to keep them?"
      },
      "optionA": {
        "text": {
          "kk": "Құндылықтарды терең талдау, барлық нұсқаларды логика мен этика тұрғысынан зерттеу, ең дұрыс шешімді табу",
          "ru": "Глубоко проанализировать ценности, изучить все варианты с точки зрения логики и этики, найти наиболее правильное решение",
          "en": "Deeply analyze values, study all options from the point of view of logic and ethics, find the most correct solution"
        },
        "weights": {
          "rationality": 0.95,
          "meaning": 0.9,
          "strategic": 0.8,
          "control": 0.7,
          "explorer": 0.5
        }
      },
      "optionB": {
        "text": {
          "kk": "Интуиция мен сезімге сену, құндылықтарыңызға сүйеніп, осы сәтте дұрыс көрінетін нәрсені таңдау",
          "ru": "Довериться интуиции и чувствам, опираясь на свои ценности, выбрать то, что кажется правильным в данный момент",
          "en": "Trust intuition and feelings, relying on your values, choose what seems right at the moment"
        },
        "weights": {
          "intuition": 0.95,
          "meaning": 0.9,
          "adaptation": 0.7,
          "tactical": 0.6,
          "individualism": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Басқалармен кеңесу, команданың және қоғамның пікірін ескеру, көпшілікке сай келетін шешім табу",
          "ru": "Посоветоваться с другими, учесть мнение команды и общества, найти решение, которое устроит большинство",
          "en": "Consult with others, consider the opinions of the team and society, find a solution that suits the majority"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.85,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық пайдаға назар аудару, минималды шығынмен максималды нәтиже алу, құндылықтарды екінші орынға қою",
          "ru": "Сфокусироваться на практической выгоде, получить максимальный результат с минимальными затратами, поставить ценности на второй план",
          "en": "Focus on practical benefits, get maximum results with minimal costs, put values in second place"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "tactical": 0.8,
          "rationality": 0.7,
          "control": 0.6
        }
      }
    },
    {
      "id": 24,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "values",
        "contextType": "meaning_seeking",
        "primaryDimensions": ["meaning", "utility"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Мағына іздеу",
        "ru": "Поиск смысла",
        "en": "Search for Meaning"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен іс-әрекеттердің терең мағынасын және құндылығын іздеймін, тіпті егер бұл практикалық пайдасы болмаса да.",
        "ru": "Я ищу глубокий смысл и ценность действий, даже если это не имеет практической пользы.",
        "en": "I seek the deep meaning and value of actions, even if it has no practical benefit."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "meaning": -0.9, "utility": 0.9 },
        "2": { "meaning": -0.7, "utility": 0.7 },
        "3": { "meaning": -0.5, "utility": 0.5 },
        "4": { "meaning": -0.3, "utility": 0.3 },
        "5": { "meaning": 0.0, "utility": 0.0 },
        "6": { "meaning": 0.3, "utility": -0.3 },
        "7": { "meaning": 0.5, "utility": -0.5 },
        "8": { "meaning": 0.7, "utility": -0.7 },
        "9": { "meaning": 0.9, "utility": -0.9 },
        "10": { "meaning": 1.0, "utility": -1.0 }
      }
    },
    {
      "id": 25,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "creativity",
        "contextType": "creative_block",
        "primaryDimensions": ["explorer", "adaptation", "intuition", "collectivism"],
        "estimatedTime": 100
      },
      "title": {
        "kk": "Шығармашылық бөгет: идея жоқ",
        "ru": "Творческий блок: нет идей",
        "en": "Creative Block: No Ideas"
      },
      "description": {
        "kk": "Сіз маңызды шығармашылық жобада жұмыс істеп жатырсыз, бірақ идеялар таусылып қалды. Сіз бірнеше күн бойы бірдей нәрсені қайталап жатырсыз, жаңа тәсілдер таба алмайсыз. Жобаның мерзімі жақындап жатыр.",
        "ru": "Вы работаете над важным творческим проектом, но идеи иссякли. Вы несколько дней повторяете одно и то же, не можете найти новые подходы. Срок проекта приближается.",
        "en": "You are working on an important creative project, but ideas have run out. You have been repeating the same thing for several days, cannot find new approaches. The project deadline is approaching."
      },
      "context": {
        "kk": "Сіздің тәсіліңіз жобаның табысына және сіздің шығармашылық дамуыңызға әсер етеді.",
        "ru": "Ваш подход повлияет на успех проекта и ваше творческое развитие.",
        "en": "Your approach will affect the project's success and your creative development."
      },
      "optionA": {
        "text": {
          "kk": "Қолданыстағы тәсілдерді терең зерттеу, үздік тәжірибелерді талдау, жүйелі шешім жасау, логикалық тұрғыдан талдау",
          "ru": "Глубоко изучить существующие подходы, проанализировать лучшие практики, создать системное решение, проанализировать с логической точки зрения",
          "en": "Deeply study existing approaches, analyze best practices, create a systematic solution, analyze from a logical point of view"
        },
        "weights": {
          "explorer": 0.9,
          "rationality": 0.85,
          "strategic": 0.8,
          "control": 0.7,
          "meaning": 0.5
        }
      },
      "optionB": {
        "text": {
          "kk": "Эксперимент жасау, әртүрлі идеяларды сынап көру, нәтижелерге бейімделу, интуицияға сену, стихиялы тәсілдерді қолдану",
          "ru": "Экспериментировать, пробовать разные идеи, адаптироваться к результатам, доверять интуиции, использовать спонтанные подходы",
          "en": "Experiment, try different ideas, adapt to results, trust intuition, use spontaneous approaches"
        },
        "weights": {
          "adaptation": 0.95,
          "intuition": 0.9,
          "explorer": 0.85,
          "tactical": 0.7,
          "individualism": 0.6
        }
      },
      "optionC": {
        "text": {
          "kk": "Командада жұмыс істеу, бірге идеялар генерациялау, ұжымдық шығармашылық жасау, басқалардың көзқарасын ескеру",
          "ru": "Работать в команде, генерировать идеи вместе, создавать коллективное творчество, учитывать мнение других",
          "en": "Work in a team, generate ideas together, create collective creativity, consider others' opinions"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.8,
          "adaptation": 0.7,
          "explorer": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Тексерілген әдістерді қолдану, табысты мысалдарды ұстану, тәуекелдерді азайту, практикалық нәтижелерге назар аудару",
          "ru": "Использовать проверенные методы, следовать успешным примерам, минимизировать риски, сфокусироваться на практических результатах",
          "en": "Use proven methods, follow successful examples, minimize risks, focus on practical results"
        },
        "weights": {
          "utility": 0.9,
          "executor": 0.85,
          "control": 0.8,
          "rationality": 0.7,
          "tactical": 0.6
        }
      }
    },
    {
      "id": 26,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "creativity",
        "contextType": "innovation_preference",
        "primaryDimensions": ["explorer", "adaptation"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Инновацияға деген қажеттілік",
        "ru": "Потребность в инновациях",
        "en": "Need for Innovation"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен жаңа нәрселерді жасауды және инновациялық тәсілдерді қолдануды қалаймын, тіпті егер бұл тәуекелді болса да.",
        "ru": "Я люблю создавать новые вещи и использовать инновационные подходы, даже если это рискованно.",
        "en": "I love to create new things and use innovative approaches, even if it is risky."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "explorer": -0.9, "adaptation": -0.9, "control": 0.8 },
        "2": { "explorer": -0.7, "adaptation": -0.7, "control": 0.6 },
        "3": { "explorer": -0.5, "adaptation": -0.5, "control": 0.4 },
        "4": { "explorer": -0.3, "adaptation": -0.3, "control": 0.2 },
        "5": { "explorer": 0.0, "adaptation": 0.0, "control": 0.0 },
        "6": { "explorer": 0.3, "adaptation": 0.3, "control": -0.2 },
        "7": { "explorer": 0.5, "adaptation": 0.5, "control": -0.4 },
        "8": { "explorer": 0.7, "adaptation": 0.7, "control": -0.6 },
        "9": { "explorer": 0.9, "adaptation": 0.9, "control": -0.8 },
        "10": { "explorer": 1.0, "adaptation": 1.0, "control": -0.9 }
      }
    },
    {
      "id": 27,
      "type": "situational",
      "metadata": {
        "difficulty": "high",
        "category": "work",
        "contextType": "project_lifecycle",
        "primaryDimensions": ["strategic", "control", "adaptation", "collectivism"],
        "estimatedTime": 160
      },
      "title": {
        "kk": "Жобаның толық циклі",
        "ru": "Полный цикл проекта",
        "en": "Full Project Cycle"
      },
      "description": {
        "kk": "Сіз маңызды жобаны басқарып жатырсыз. Жоба бірнеше кезеңнен тұрады, әр кезеңде сізге маңызды шешімдер қабылдау керек.",
        "ru": "Вы управляете важным проектом. Проект состоит из нескольких этапов, на каждом этапе вам нужно принять важные решения.",
        "en": "You are managing an important project. The project consists of several stages, at each stage you need to make important decisions."
      },
      "steps": [
        {
          "stepId": 1,
          "title": {
            "kk": "Жобаны бастау",
            "ru": "Начало проекта",
            "en": "Project Start"
          },
          "description": {
            "kk": "Жоба басталғанда, сіз қалай әрекет етесіз?",
            "ru": "При начале проекта, как вы поступите?",
            "en": "When starting the project, how will you proceed?"
          },
          "options": {
            "A": {
              "text": {
                "kk": "Егжей-тегжейлі жоспар құру, барлық ресурстарды талдау, процестерді анықтау",
                "ru": "Создать детальный план, проанализировать все ресурсы, определить процессы",
                "en": "Create a detailed plan, analyze all resources, define processes"
              },
              "weights": {
                "rationality": 0.9,
                "control": 0.8,
                "strategic": 0.7
              }
            },
            "B": {
              "text": {
                "kk": "Жылдам бастау, барысында бейімделу, икемді тәсіл қолдану",
                "ru": "Быстро начать, адаптироваться по ходу, применять гибкий подход",
                "en": "Start quickly, adapt along the way, apply a flexible approach"
              },
              "weights": {
                "adaptation": 0.9,
                "tactical": 0.7,
                "intuition": 0.6
              }
            },
            "C": {
              "text": {
                "kk": "Командамен бірлесіп жоспарлау, барлықтың пікірін ескеру",
                "ru": "Планировать совместно с командой, учитывать мнение всех",
                "en": "Plan together with the team, consider everyone's opinion"
              },
              "weights": {
                "collectivism": 0.9,
                "meaning": 0.6,
                "adaptation": 0.5
              }
            }
          }
        },
        {
          "stepId": 2,
          "title": {
            "kk": "Ортасындағы проблемалар",
            "ru": "Проблемы в середине",
            "en": "Mid-Project Problems"
          },
          "description": {
            "kk": "Жобаның ортасында күтпеген проблемалар туындады. Сіз қалай әрекет етесіз?",
            "ru": "В середине проекта возникли неожиданные проблемы. Как вы поступите?",
            "en": "In the middle of the project, unexpected problems arose. How will you proceed?"
          },
          "options": {
            "A": {
              "text": {
                "kk": "Проблемаларды терең талдау, жоспарды қайта қарау, жүйелі шешім табу",
                "ru": "Глубоко проанализировать проблемы, пересмотреть план, найти системное решение",
                "en": "Deeply analyze problems, revise the plan, find a systematic solution"
              },
              "weights": {
                "rationality": 0.9,
                "control": 0.8,
                "strategic": 0.7
              }
            },
            "B": {
              "text": {
                "kk": "Жылдам бейімделу, инновациялық шешімдер іздеу, процесті өзгерту",
                "ru": "Быстро адаптироваться, искать инновационные решения, изменить процесс",
                "en": "Quickly adapt, seek innovative solutions, change the process"
              },
              "weights": {
                "adaptation": 0.9,
                "intuition": 0.8,
                "explorer": 0.6
              }
            },
            "C": {
              "text": {
                "kk": "Командамен бірлесіп шешім табу, ұжымдық тәсіл қолдану",
                "ru": "Найти решение совместно с командой, применить коллективный подход",
                "en": "Find a solution together with the team, apply a collective approach"
              },
              "weights": {
                "collectivism": 0.9,
                "meaning": 0.7,
                "adaptation": 0.6
              }
            }
          }
        }
      ],
      "finalWeights": {
        "strategic": 0.3,
        "control": 0.3,
        "adaptation": 0.2,
        "collectivism": 0.2
      }
    },
    {
      "id": 28,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "relationships",
        "contextType": "mentorship",
        "primaryDimensions": ["collectivism", "meaning", "strategic", "explorer"],
        "estimatedTime": 110
      },
      "title": {
        "kk": "Менторлық: басқаға көмектесу",
        "ru": "Менторство: помощь другим",
        "en": "Mentorship: Helping Others"
      },
      "description": {
        "kk": "Сізге жас маманға менторлық жасау сұралды. Олар сіздің салаңызда жаңа, бірақ құмар және дайын үйренуге. Сіздің уақытыңыз шектеулі, бірақ оларға көмектесу сіз үшін маңызды.",
        "ru": "Вас попросили стать ментором для молодого специалиста. Они новичок в вашей области, но увлечён и готов учиться. Ваше время ограничено, но помощь им важна для вас.",
        "en": "You have been asked to mentor a young professional. They are new to your field but passionate and ready to learn. Your time is limited, but helping them is important to you."
      },
      "context": {
        "kk": "Сіздің тәсіліңіз олардың кәсіби дамуына және сіздің құндылықтарыңызға әсер етеді.",
        "ru": "Ваш подход повлияет на их профессиональное развитие и ваши ценности.",
        "en": "Your approach will affect their professional development and your values."
      },
      "optionA": {
        "text": {
          "kk": "Егжей-тегжейлі оқу жоспарын әзірлеу, жүйелі тәсіл қолдану, процесті бақылау",
          "ru": "Разработать детальный план обучения, применить системный подход, контролировать процесс",
          "en": "Develop a detailed learning plan, apply a systematic approach, control the process"
        },
        "weights": {
          "rationality": 0.9,
          "control": 0.85,
          "strategic": 0.8,
          "meaning": 0.6,
          "explorer": 0.4
        }
      },
      "optionB": {
        "text": {
          "kk": "Икемді тәсіл қолдану, жағдайға бейімделу, практикалық тәжірибе беру",
          "ru": "Применить гибкий подход, адаптироваться к ситуации, дать практический опыт",
          "en": "Apply a flexible approach, adapt to the situation, provide practical experience"
        },
        "weights": {
          "adaptation": 0.9,
          "tactical": 0.8,
          "intuition": 0.7,
          "collectivism": 0.6,
          "meaning": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Ашық қарым-қатынас орнату, бірлесіп үйрену, ұжымдық тәжірибе алмасу",
          "ru": "Установить открытые отношения, учиться вместе, обмениваться коллективным опытом",
          "en": "Establish open relationships, learn together, exchange collective experience"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.9,
          "adaptation": 0.7,
          "explorer": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық нәтижелерге назар аудару, тиімділікті арттыру, нақты дағдыларға бағыттау",
          "ru": "Сфокусироваться на практических результатах, повысить эффективность, направить на конкретные навыки",
          "en": "Focus on practical results, increase efficiency, direct to specific skills"
        },
        "weights": {
          "utility": 0.9,
          "executor": 0.85,
          "tactical": 0.8,
          "control": 0.7,
          "rationality": 0.6
        }
      }
    },
    {
      "id": 29,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "relationships",
        "contextType": "social_preference",
        "primaryDimensions": ["individualism", "collectivism"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Әлеуметтік басымдық",
        "ru": "Социальное предпочтение",
        "en": "Social Preference"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен жеке жұмысты командалық жұмыстан артық көремін, өйткені мен өз жұмысымды бақылауға және тәуелсіз шешімдер қабылдауға қалаймын.",
        "ru": "Я предпочитаю индивидуальную работу командной, потому что хочу контролировать свою работу и принимать независимые решения.",
        "en": "I prefer individual work to teamwork because I want to control my work and make independent decisions."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "individualism": -0.9, "collectivism": 0.9 },
        "2": { "individualism": -0.7, "collectivism": 0.7 },
        "3": { "individualism": -0.5, "collectivism": 0.5 },
        "4": { "individualism": -0.3, "collectivism": 0.3 },
        "5": { "individualism": 0.0, "collectivism": 0.0 },
        "6": { "individualism": 0.3, "collectivism": -0.3 },
        "7": { "individualism": 0.5, "collectivism": -0.5 },
        "8": { "individualism": 0.7, "collectivism": -0.7 },
        "9": { "individualism": 0.9, "collectivism": -0.9 },
        "10": { "individualism": 1.0, "collectivism": -1.0 }
      }
    },
    {
      "id": 30,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "relationships",
        "contextType": "conflict_handling",
        "primaryDimensions": ["collectivism", "rationality", "adaptation"],
        "estimatedTime": 150
      },
      "title": {
        "kk": "Жанжалдарды шешу",
        "ru": "Разрешение конфликтов",
        "en": "Conflict Resolution"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіз қалай жанжалдарды шешесіз? Сіз қандай тәсілдерді қолданасыз? Сіздің негізгі принциптеріңіз қандай?",
        "ru": "Как вы разрешаете конфликты? Какие подходы вы используете? Каковы ваши основные принципы?",
        "en": "How do you resolve conflicts? What approaches do you use? What are your main principles?"
      },
      "maxLength": 400,
      "keywords": {
        "collectivism": ["команда", "ұжым", "бірлесіп", "команда", "коллектив", "совместно", "team", "together", "collective"],
        "rationality": ["логика", "талдау", "фактілер", "логика", "анализ", "факты", "logic", "analysis", "facts"],
        "adaptation": ["бейімделу", "икемді", "компромисс", "адаптация", "гибкий", "компромисс", "adaptation", "flexible", "compromise"]
      }
    },
    {
      "id": 31,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "decision_making",
        "contextType": "resource_allocation",
        "primaryDimensions": ["rationality", "control", "strategic", "utility"],
        "estimatedTime": 115
      },
      "title": {
        "kk": "Ресурстарды бөлу: шектеулі мүмкіндіктер",
        "ru": "Распределение ресурсов: ограниченные возможности",
        "en": "Resource Allocation: Limited Opportunities"
      },
      "description": {
        "kk": "Сіздің ресурстарыңыз шектеулі, бірақ маңызды міндеттер көп. Сізге бірнеше маңызды жобалар арасында ресурстарды бөлу керек. Әр жобаның өз маңыздылығы, тәуекелі және ықтимал нәтижелері бар.",
        "ru": "У вас ограниченные ресурсы, но много важных задач. Вам нужно распределить ресурсы между несколькими важными проектами. Каждый проект имеет свою важность, риски и потенциальные результаты.",
        "en": "You have limited resources but many important tasks. You need to allocate resources between several important projects. Each project has its importance, risks, and potential results."
      },
      "context": {
        "kk": "Сіздің шешіміңізге жұмыстың тиімділігі мен мақсаттарға жету байланысты.",
        "ru": "От вашего решения зависит эффективность работы и достижение целей.",
        "en": "The efficiency of work and achievement of goals depends on your decision."
      },
      "optionA": {
        "text": {
          "kk": "Егжей-тегжейлі бөлу жоспарын құру, барлық тапсырмаларды талдау, процестерді оңтайландыру, логикалық тұрғыдан бағалау",
          "ru": "Создать детальный план распределения, проанализировать все задачи, оптимизировать процессы, оценить с логической точки зрения",
          "en": "Create a detailed distribution plan, analyze all tasks, optimize processes, evaluate from a logical point of view"
        },
        "weights": {
          "rationality": 0.95,
          "control": 0.9,
          "strategic": 0.85,
          "meaning": 0.5,
          "individualism": 0.3
        }
      },
      "optionB": {
        "text": {
          "kk": "Жағдайға қарай ресурстарды икемді бөлу, өзгерістерге бейімделу, интуитивті әрекет ету",
          "ru": "Гибко распределять ресурсы по ситуации, адаптироваться к изменениям, действовать интуитивно",
          "en": "Flexibly distribute resources according to the situation, adapt to changes, act intuitively"
        },
        "weights": {
          "adaptation": 0.95,
          "intuition": 0.9,
          "tactical": 0.8,
          "utility": 0.6,
          "individualism": 0.4
        }
      },
      "optionC": {
        "text": {
          "kk": "Командамен талқылау, ұжымдық шешім табу, тапсырмаларды бірлесіп бөлу, барлықтың пікірін ескеру",
          "ru": "Обсудить с командой, найти коллективное решение, распределить задачи совместно, учесть мнение всех",
          "en": "Discuss with the team, find a collective solution, distribute tasks together, consider everyone's opinion"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.8,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Максималды практикалық қайтарымы бар тапсырмаларға назар аудару, шығындарды азайту, тиімділікті максимизациялау",
          "ru": "Сфокусироваться на задачах с максимальной практической отдачей, минимизировать затраты, максимизировать эффективность",
          "en": "Focus on tasks with maximum practical return, minimize costs, maximize efficiency"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "tactical": 0.85,
          "control": 0.75,
          "rationality": 0.7
        }
      }
    },
    {
      "id": 32,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "decision_making",
        "contextType": "strategic_thinking",
        "primaryDimensions": ["strategic", "tactical"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Стратегиялық ойлау",
        "ru": "Стратегическое мышление",
        "en": "Strategic Thinking"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен ұзақ мерзімді мақсаттар мен стратегиялық перспективаларға назар аударуды қалаймын, қысқа мерзімді нәтижелерден гөрі.",
        "ru": "Я предпочитаю фокусироваться на долгосрочных целях и стратегических перспективах, а не на краткосрочных результатах.",
        "en": "I prefer to focus on long-term goals and strategic perspectives rather than short-term results."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "strategic": -0.9, "tactical": 0.9 },
        "2": { "strategic": -0.7, "tactical": 0.7 },
        "3": { "strategic": -0.5, "tactical": 0.5 },
        "4": { "strategic": -0.3, "tactical": 0.3 },
        "5": { "strategic": 0.0, "tactical": 0.0 },
        "6": { "strategic": 0.3, "tactical": -0.3 },
        "7": { "strategic": 0.5, "tactical": -0.5 },
        "8": { "strategic": 0.7, "tactical": -0.7 },
        "9": { "strategic": 0.9, "tactical": -0.9 },
        "10": { "strategic": 1.0, "tactical": -1.0 }
      }
    },
    {
      "id": 33,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "values",
        "contextType": "ethical_leadership",
        "primaryDimensions": ["meaning", "collectivism", "strategic", "rationality"],
        "estimatedTime": 125
      },
      "title": {
        "kk": "Этикалық көшбасшылық",
        "ru": "Этическое лидерство",
        "en": "Ethical Leadership"
      },
      "description": {
        "kk": "Сіз көшбасшы ретінде маңызды этикалық дилеммаға тап болдыңыз. Сіздің шешіміңіз тек сізге ғана емес, командаға, клиенттерге және қоғамға да әсер етеді. Бірнеше нұсқа бар, әрқайсысының өз этикалық салдары бар.",
        "ru": "Вы как лидер столкнулись с важной этической дилеммой. Ваше решение повлияет не только на вас, но и на команду, клиентов и общество. Есть несколько вариантов, каждый со своими этическими последствиями.",
        "en": "As a leader, you have encountered an important ethical dilemma. Your decision will affect not only you but also the team, clients, and society. There are several options, each with its ethical consequences."
      },
      "context": {
        "kk": "Сіздің таңдауыңыз сіздің құндылықтарыңызды, көшбасшылық стиліңізді және ұйымның беделін анықтайды.",
        "ru": "Ваш выбор определит ваши ценности, стиль лидерства и репутацию организации.",
        "en": "Your choice will define your values, leadership style, and the organization's reputation."
      },
      "optionA": {
        "text": {
          "kk": "Этикалық принциптерді терең талдау, барлық нұсқаларды логика мен этика тұрғысынан зерттеу, ең дұрыс шешімді табу",
          "ru": "Глубоко проанализировать этические принципы, изучить все варианты с точки зрения логики и этики, найти наиболее правильное решение",
          "en": "Deeply analyze ethical principles, study all options from the point of view of logic and ethics, find the most correct solution"
        },
        "weights": {
          "rationality": 0.95,
          "meaning": 0.9,
          "strategic": 0.85,
          "control": 0.7,
          "explorer": 0.5
        }
      },
      "optionB": {
        "text": {
          "kk": "Интуиция мен сезімге сену, құндылықтарыңызға сүйеніп, осы сәтте дұрыс көрінетін нәрсені таңдау",
          "ru": "Довериться интуиции и чувствам, опираясь на свои ценности, выбрать то, что кажется правильным в данный момент",
          "en": "Trust intuition and feelings, relying on your values, choose what seems right at the moment"
        },
        "weights": {
          "intuition": 0.95,
          "meaning": 0.9,
          "adaptation": 0.7,
          "tactical": 0.6,
          "individualism": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Басқалармен кеңесу, команданың, клиенттердің және қоғамның пікірін ескеру, көпшілікке сай келетін шешім табу",
          "ru": "Посоветоваться с другими, учесть мнение команды, клиентов и общества, найти решение, которое устроит большинство",
          "en": "Consult with others, consider the opinions of the team, clients, and society, find a solution that suits the majority"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.9,
          "adaptation": 0.7,
          "tactical": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Практикалық пайдаға назар аудару, минималды шығынмен максималды нәтиже алу, этикалық мәселелерді екінші орынға қою",
          "ru": "Сфокусироваться на практической выгоде, получить максимальный результат с минимальными затратами, поставить этические вопросы на второй план",
          "en": "Focus on practical benefits, get maximum results with minimal costs, put ethical issues in second place"
        },
        "weights": {
          "utility": 0.95,
          "executor": 0.9,
          "tactical": 0.85,
          "rationality": 0.7,
          "control": 0.6
        }
      }
    },
    {
      "id": 34,
      "type": "open",
      "metadata": {
        "difficulty": "high",
        "category": "values",
        "contextType": "life_philosophy",
        "primaryDimensions": ["meaning", "strategic", "individualism"],
        "estimatedTime": 180
      },
      "title": {
        "kk": "Өмір философиясы",
        "ru": "Философия жизни",
        "en": "Life Philosophy"
      },
      "description": {
        "kk": "Төмендегі сұраққа толық жауап беріңіз:",
        "ru": "Дайте развёрнутый ответ на следующий вопрос:",
        "en": "Give a detailed answer to the following question:"
      },
      "prompt": {
        "kk": "Сіздің өмір философияңыз қандай? Сіз өмірде не іздейсіз? Сіздің негізгі принциптеріңіз қандай? Неліктен олар сіз үшін маңызды?",
        "ru": "Какова ваша философия жизни? Что вы ищете в жизни? Каковы ваши основные принципы? Почему они важны для вас?",
        "en": "What is your philosophy of life? What do you seek in life? What are your main principles? Why are they important to you?"
      },
      "maxLength": 600,
      "keywords": {
        "meaning": ["мағына", "құндылық", "мақсат", "принцип", "смысл", "ценность", "цель", "принцип", "meaning", "value", "purpose", "principle"],
        "strategic": ["болашақ", "жоспар", "перспектива", "будущее", "план", "перспектива", "future", "plan", "perspective"],
        "individualism": ["өзім", "жеке", "тәуелсіз", "самостоятельно", "личный", "независимый", "myself", "personal", "independent"]
      }
    },
    {
      "id": 35,
      "type": "scenario",
      "metadata": {
        "difficulty": "high",
        "category": "creativity",
        "contextType": "artistic_expression",
        "primaryDimensions": ["explorer", "intuition", "adaptation", "meaning"],
        "estimatedTime": 105
      },
      "title": {
        "kk": "Шығармашылық өрнек: өзіңізді көрсету",
        "ru": "Творческое выражение: проявление себя",
        "en": "Creative Expression: Expressing Yourself"
      },
      "description": {
        "kk": "Сізге шығармашылық жобада өзіңізді көрсету мүмкіндігі берілді. Бұл жоба сіздің шығармашылық қабілеттеріңізді, құндылықтарыңызды және көзқарасыңызды көрсетуге мүмкіндік береді. Алайда, бұл тәуекелді: сіздің жұмысыңыз сынға ұшырауы мүмкін.",
        "ru": "Вам предоставили возможность проявить себя в творческом проекте. Этот проект позволяет показать ваши творческие способности, ценности и взгляды. Однако это рискованно: ваша работа может подвергнуться критике.",
        "en": "You have been given the opportunity to express yourself in a creative project. This project allows you to show your creative abilities, values, and views. However, it is risky: your work may be criticized."
      },
      "context": {
        "kk": "Сіздің тәсіліңіз сіздің шығармашылық дамуыңызға және сіздің өзіңізді көрсетуіңізге әсер етеді.",
        "ru": "Ваш подход повлияет на ваше творческое развитие и ваше самовыражение.",
        "en": "Your approach will affect your creative development and your self-expression."
      },
      "optionA": {
        "text": {
          "kk": "Қолданыстағы тәсілдерді терең зерттеу, үздік тәжірибелерді талдау, жүйелі шешім жасау, логикалық тұрғыдан талдау",
          "ru": "Глубоко изучить существующие подходы, проанализировать лучшие практики, создать системное решение, проанализировать с логической точки зрения",
          "en": "Deeply study existing approaches, analyze best practices, create a systematic solution, analyze from a logical point of view"
        },
        "weights": {
          "explorer": 0.9,
          "rationality": 0.85,
          "strategic": 0.8,
          "control": 0.7,
          "meaning": 0.6
        }
      },
      "optionB": {
        "text": {
          "kk": "Эксперимент жасау, әртүрлі идеяларды сынап көру, нәтижелерге бейімделу, интуицияға сену, стихиялы тәсілдерді қолдану",
          "ru": "Экспериментировать, пробовать разные идеи, адаптироваться к результатам, доверять интуиции, использовать спонтанные подходы",
          "en": "Experiment, try different ideas, adapt to results, trust intuition, use spontaneous approaches"
        },
        "weights": {
          "adaptation": 0.95,
          "intuition": 0.9,
          "explorer": 0.85,
          "tactical": 0.7,
          "meaning": 0.6,
          "individualism": 0.5
        }
      },
      "optionC": {
        "text": {
          "kk": "Командада жұмыс істеу, бірге идеялар генерациялау, ұжымдық шығармашылық жасау, басқалардың көзқарасын ескеру",
          "ru": "Работать в команде, генерировать идеи вместе, создавать коллективное творчество, учитывать мнение других",
          "en": "Work in a team, generate ideas together, create collective creativity, consider others' opinions"
        },
        "weights": {
          "collectivism": 0.95,
          "meaning": 0.85,
          "adaptation": 0.7,
          "explorer": 0.6,
          "intuition": 0.4
        }
      },
      "optionD": {
        "text": {
          "kk": "Тексерілген әдістерді қолдану, табысты мысалдарды ұстану, тәуекелдерді азайту, практикалық нәтижелерге назар аудару",
          "ru": "Использовать проверенные методы, следовать успешным примерам, минимизировать риски, сфокусироваться на практических результатах",
          "en": "Use proven methods, follow successful examples, minimize risks, focus on practical results"
        },
        "weights": {
          "utility": 0.9,
          "executor": 0.85,
          "control": 0.8,
          "rationality": 0.7,
          "tactical": 0.6
        }
      }
    },
    {
      "id": 36,
      "type": "scale",
      "metadata": {
        "difficulty": "medium",
        "category": "creativity",
        "contextType": "experimentation",
        "primaryDimensions": ["explorer", "adaptation"],
        "estimatedTime": 25
      },
      "title": {
        "kk": "Эксперименттеу",
        "ru": "Экспериментирование",
        "en": "Experimentation"
      },
      "description": {
        "kk": "Келесі мәлімдемені бағалаңыз:",
        "ru": "Оцените следующее утверждение:",
        "en": "Rate the following statement:"
      },
      "prompt": {
        "kk": "Мен жаңа нәрселерді сынап көруді және эксперимент жасауды қалаймын, тіпті егер нәтиже белгісіз болса да.",
        "ru": "Я люблю пробовать новые вещи и экспериментировать, даже если результат неизвестен.",
        "en": "I love to try new things and experiment, even if the result is unknown."
      },
      "scale": {
        "min": 1,
        "max": 10,
        "labels": {
          "min": {
            "kk": "Мүлдем келіспеймін",
            "ru": "Полностью не согласен",
            "en": "Completely disagree"
          },
          "max": {
            "kk": "Толығымен келісемін",
            "ru": "Полностью согласен",
            "en": "Completely agree"
          }
        }
      },
      "weights": {
        "1": { "explorer": -0.9, "adaptation": -0.9, "control": 0.8 },
        "2": { "explorer": -0.7, "adaptation": -0.7, "control": 0.6 },
        "3": { "explorer": -0.5, "adaptation": -0.5, "control": 0.4 },
        "4": { "explorer": -0.3, "adaptation": -0.3, "control": 0.2 },
        "5": { "explorer": 0.0, "adaptation": 0.0, "control": 0.0 },
        "6": { "explorer": 0.3, "adaptation": 0.3, "control": -0.2 },
        "7": { "explorer": 0.5, "adaptation": 0.5, "control": -0.4 },
        "8": { "explorer": 0.7, "adaptation": 0.7, "control": -0.6 },
        "9": { "explorer": 0.9, "adaptation": 0.9, "control": -0.8 },
        "10": { "explorer": 1.0, "adaptation": 1.0, "control": -0.9 }
      }
    }
  ],
  "dimensions": {
    "strategic": {
      "name": {
        "kk": "Стратегиялық ойлау",
        "ru": "Стратегическое мышление",
        "en": "Strategic Thinking"
      },
      "description": {
        "kk": "Ұзақ мерзімді мақсаттар мен перспективаларға назар аудару",
        "ru": "Фокус на долгосрочных целях и перспективах",
        "en": "Focus on long-term goals and prospects"
      },
      "opposite": {
        "kk": "Тактикалық ойлау",
        "ru": "Тактическое мышление",
        "en": "Tactical Thinking"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Тактикалық",
        "ru": "Тактическое",
        "en": "Tactical"
      },
      "positiveLabel": {
        "kk": "Стратегиялық",
        "ru": "Стратегическое",
        "en": "Strategic"
      }
    },
    "explorer": {
      "name": {
        "kk": "Зерттеуші",
        "ru": "Исследователь",
        "en": "Explorer"
      },
      "description": {
        "kk": "Жаңа білімге және терең түсінуге ұмтылу",
        "ru": "Стремление к новым знаниям и глубокому пониманию",
        "en": "Striving for new knowledge and deep understanding"
      },
      "opposite": {
        "kk": "Орындаушы",
        "ru": "Исполнитель",
        "en": "Executor"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Орындаушы",
        "ru": "Исполнитель",
        "en": "Executor"
      },
      "positiveLabel": {
        "kk": "Зерттеуші",
        "ru": "Исследователь",
        "en": "Explorer"
      }
    },
    "individualism": {
      "name": {
        "kk": "Индивидуализм",
        "ru": "Индивидуализм",
        "en": "Individualism"
      },
      "description": {
        "kk": "Өздігінен жұмыс істеуге және жеке жауапкершілікке басымдық беру",
        "ru": "Предпочтение самостоятельной работы и личной ответственности",
        "en": "Preference for independent work and personal responsibility"
      },
      "opposite": {
        "kk": "Ұжымшылдық",
        "ru": "Коллективизм",
        "en": "Collectivism"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Ұжымшылдық",
        "ru": "Коллективизм",
        "en": "Collectivism"
      },
      "positiveLabel": {
        "kk": "Индивидуализм",
        "ru": "Индивидуализм",
        "en": "Individualism"
      }
    },
    "rationality": {
      "name": {
        "kk": "Рационалдылық",
        "ru": "Рациональность",
        "en": "Rationality"
      },
      "description": {
        "kk": "Мәселелерді шешуге логикалық, құрылымдық тәсіл",
        "ru": "Логический, структурированный подход к решению задач",
        "en": "Logical, structured approach to problem solving"
      },
      "opposite": {
        "kk": "Интуиция",
        "ru": "Интуиция",
        "en": "Intuition"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Интуиция",
        "ru": "Интуиция",
        "en": "Intuition"
      },
      "positiveLabel": {
        "kk": "Рационалдылық",
        "ru": "Рациональность",
        "en": "Rationality"
      }
    },
    "control": {
      "name": {
        "kk": "Бақылау",
        "ru": "Контроль",
        "en": "Control"
      },
      "description": {
        "kk": "Процестерді бақылауға және нәтижелердің болжамдылығына ұмтылу",
        "ru": "Стремление контролировать процессы и предсказуемость результатов",
        "en": "Striving to control processes and predictability of results"
      },
      "opposite": {
        "kk": "Бейімделу",
        "ru": "Адаптация",
        "en": "Adaptation"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Бейімделу",
        "ru": "Адаптация",
        "en": "Adaptation"
      },
      "positiveLabel": {
        "kk": "Бақылау",
        "ru": "Контроль",
        "en": "Control"
      }
    },
    "meaning": {
      "name": {
        "kk": "Мағына іздеу",
        "ru": "Поиск смысла",
        "en": "Search for Meaning"
      },
      "description": {
        "kk": "Іс-әрекеттердің тереңдігіне, құндылығына және маңыздылығына назар аудару",
        "ru": "Фокус на глубине, ценности и значимости действий",
        "en": "Focus on depth, value and significance of actions"
      },
      "opposite": {
        "kk": "Практикалық пайда",
        "ru": "Практическая выгода",
        "en": "Practical Benefit"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Практикалық пайда",
        "ru": "Практическая выгода",
        "en": "Practical Benefit"
      },
      "positiveLabel": {
        "kk": "Мағына іздеу",
        "ru": "Поиск смысла",
        "en": "Search for Meaning"
      }
    },
    "adaptation": {
      "name": {
        "kk": "Бейімделу",
        "ru": "Адаптация",
        "en": "Adaptation"
      },
      "description": {
        "kk": "Өзгермелі жағдайларға тез бейімделу қабілеті",
        "ru": "Способность быстро подстраиваться под изменяющиеся условия",
        "en": "Ability to quickly adjust to changing conditions"
      },
      "opposite": {
        "kk": "Бақылау",
        "ru": "Контроль",
        "en": "Control"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Бақылау",
        "ru": "Контроль",
        "en": "Control"
      },
      "positiveLabel": {
        "kk": "Бейімделу",
        "ru": "Адаптация",
        "en": "Adaptation"
      }
    },
    "intuition": {
      "name": {
        "kk": "Интуиция",
        "ru": "Интуиция",
        "en": "Intuition"
      },
      "description": {
        "kk": "Ішкі сезімдер мен түйсікке сүйеніп шешім қабылдау",
        "ru": "Принятие решений, опираясь на внутренние ощущения и чутьё",
        "en": "Decision making based on inner feelings and instinct"
      },
      "opposite": {
        "kk": "Рационалдылық",
        "ru": "Рациональность",
        "en": "Rationality"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Рационалдылық",
        "ru": "Рациональность",
        "en": "Rationality"
      },
      "positiveLabel": {
        "kk": "Интуиция",
        "ru": "Интуиция",
        "en": "Intuition"
      }
    },
    "utility": {
      "name": {
        "kk": "Пайдалылық",
        "ru": "Практичность",
        "en": "Utility"
      },
      "description": {
        "kk": "Нақты нәтижелер мен тиімділікке бағдарлану",
        "ru": "Ориентация на конкретные результаты и эффективность",
        "en": "Focus on concrete results and efficiency"
      },
      "opposite": {
        "kk": "Мағына",
        "ru": "Смысл",
        "en": "Meaning"
      },
      "range": [-1.0, 1.0],
      "negativeLabel": {
        "kk": "Мағына",
        "ru": "Смысл",
        "en": "Meaning"
      },
      "positiveLabel": {
        "kk": "Пайдалылық",
        "ru": "Практичность",
        "en": "Utility"
      }
    }
  }
}
  ;

// Уведомляем о загрузке данных
if (typeof window !== 'undefined') {
  window.dispatchEvent(new CustomEvent('advanced-scenarios-data-loaded'));
}

