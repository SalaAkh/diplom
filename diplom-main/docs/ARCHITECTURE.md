# Архитектура системы самопознания

**Автор:** Ахмедьянов Саламат КПО 9/22-2  
**Дата:** 2026

## Обзор архитектуры

Система построена по модульному принципу с разделением ответственности между компонентами.

## Компоненты системы

### 1. Модуль данных (`data/scenarios.json`)

**Ответственность**: Хранение сценариев и метаданных измерений

**Структура**:
- `scenarios[]` - массив сценариев дилемм
- `dimensions{}` - описание измерений анализа

**Формат сценария**:
```javascript
{
  id: number,              // Уникальный идентификатор
  title: string,           // Название дилеммы
  description: string,     // Описание ситуации
  context: string,         // Дополнительный контекст (опционально)
  optionA: {               // Первый вариант
    text: string,
    weights: {             // Веса влияния на измерения
      rationality: number,  // -1.0 до +1.0
      control: number,
      strategic: number,
      explorer: number,
      individualism: number,
      meaning: number
    }
  },
  optionB: { ... },        // Второй вариант
  optionC: { ... },        // Третий вариант
  optionD: { ... }         // Четвёртый вариант (опционально)
}
```

### 2. Модуль анализа (`js/analysis.js`)

**Класс**: `PersonalityAnalyzer`

**Методы**:
- `reset()` - сброс результатов
- `recordChoice(scenarioId, choice)` - запись выбора пользователя
- `getNormalizedScores()` - получение нормализованных оценок [-1, 1]
- `getPercentageScores()` - получение процентных оценок [-100%, +100%]
- `generateProfile()` - генерация текстового профиля
- `calculateCategoryMatch(scores)` - вычисление соответствия категориям
- `generateDevelopmentVectors(scores)` - генерация векторов развития
- `generateSkillRecommendations(scores, categories)` - рекомендации по навыкам
- `getStatistics()` - получение статистики прохождения

**Алгоритм анализа**:
1. При каждом выборе добавляются веса выбранного варианта к текущим оценкам
2. После всех выборов оценки нормализуются делением на количество выборов
3. Вычисляется соответствие профиля 4 категориям направлений развития
4. Генерируются векторы развития на основе комбинаций измерений
5. Генерируются рекомендации по навыкам
6. Генерируется профиль с описаниями и категоризированными рекомендациями

**Категории направлений развития**:
1. Исследование и Наука (высокий explorer + rationality + meaning)
2. Творчество и Инновации (высокий explorer + intuition + adaptation)
3. Управление и Лидерство (высокий collectivism + strategic + control)
4. Социальная сфера и Помощь (высокий collectivism + meaning + tactical)
5. Предпринимательство (высокий individualism + strategic + adaptation)
6. Аналитика и Консалтинг (высокий rationality + strategic + control)

### 3. Модуль визуализации (`js/visualization.js`)

**Класс**: `ResultsVisualizer`

**Методы**:
- `createRadarChart(scores, dimensions)` - радиальная диаграмма
- `createBarChart(scores, dimensions)` - столбчатая диаграмма
- `createComparisonChart(userScores, dimensions, containerId)` - сравнительная диаграмма
- `createDevelopmentDirectionsChart(categories, containerId)` - диаграмма направлений развития
- `createVectorChart(vectors, containerId)` - визуализация векторов развития
- `createPolarAreaChart(dimension, score, containerId)` - круговая диаграмма
- `createEvolutionChart(sessions, dimension, containerId)` - график изменения измерения во времени
- `createComparisonChart(session1, session2, containerId)` - сравнение двух сессий
- `displayEvolutionReport(evolutionData, containerId)` - отображение отчёта об эволюции
- `displayTextProfile(profile, containerId)` - текстовый профиль
- `displayCategoryRecommendations(recommendations, containerId)` - категоризированные рекомендации
- `displaySkillRecommendations(skills, containerId)` - рекомендации по навыкам
- `destroyAll()` - очистка всех графиков

**Зависимости**: Chart.js (через CDN)

### 4. Модуль хранения (`js/storage.js`)

**Класс**: `StorageManager`

**Методы**:
- `saveResults(results)` - сохранение результатов
- `loadResults()` - загрузка результатов
- `saveProgress(choices)` - сохранение прогресса
- `loadProgress()` - загрузка прогресса
- `clearAll()` - очистка всех данных
- `hasResults()` - проверка наличия результатов

**Хранимые данные**:
- `personalityTestResults` - полные результаты анализа
- `testProgress` - текущий прогресс прохождения

### 5. Модуль динамической логики (`js/dynamic-scenarios.js`)

**Класс**: `DynamicScenarioSelector`

**Методы**:
- `selectNextScenario(completedScenarios, userChoices, currentScores)` - выбор следующего сценария
- `calculateTendencies(scores)` - вычисление тенденций по измерениям
- `determineStrategy(tendencies, userChoices, completedCount)` - определение стратегии выбора
- `findChallengingScenario(scenarios, tendencies)` - поиск проверяющего сценария
- `findReinforcingScenario(scenarios, tendencies)` - поиск усиливающего сценария
- `findBalancingScenario(scenarios, tendencies)` - поиск балансирующего сценария
- `calculateConsistency(choices)` - вычисление консистентности выборов
- `calculateBalance(tendencies)` - вычисление баланса профиля

**Логика**:
- Первые 4 сценария показываются в фиксированном порядке
- Последующие сценарии выбираются адаптивно на основе:
  - Выявленных тенденций (если пользователь часто выбирает риск → показываем более сложные стратегические дилеммы)
  - Противоречий (если есть противоречивые выборы → проверяем с другой стороны)
  - Баланса измерений (если одно измерение доминирует → проверяем противоположное)

### 6. Модуль AI-анализа (`js/ai-analysis.js`)

**Классы**: `AIAnalyzer`, `VectorModel`

**VectorModel методы**:
- `createUserVector(scores, choices)` - создание векторного представления пользователя
- `calculateVectorSimilarity(vector1, vector2)` - вычисление схожести векторов
- `findVectorClusters(vectors)` - поиск кластеров похожих профилей
- `projectVectorToSpace(vector, dimensions)` - проекция вектора в пространство измерений

**AIAnalyzer методы**:
- `deepAnalyze(scores, profile, choices)` - глубокий анализ профиля
- `analyzeChoiceSequence(choices)` - анализ последовательности выборов
- `detectContradictions(choices, scores)` - обнаружение противоречий
- `identifyDecisionPatterns(choices)` - выявление паттернов принятия решений
- `calculateFlexibility(choices)` - вычисление гибкости мышления
- `detectEvolution(choices)` - обнаружение эволюции в выборах
- `detectContextDependency(choices)` - обнаружение контекстной зависимости

### 7. Модуль эволюции (`js/evolution-tracker.js`)

**Класс**: `EvolutionTracker`

**Методы**:
- `saveSessionResults(userId, sessionData)` - сохранение результатов сессии
- `compareSessions(session1, session2)` - сравнение двух сессий
- `trackEvolution(userId)` - отслеживание эволюции пользователя
- `generateEvolutionReport(userId)` - генерация отчёта об эволюции
- `detectChanges(dimension, oldScore, newScore)` - обнаружение изменений
- `calculateTrends(sessions)` - вычисление трендов по измерениям

### 8. Главный модуль (`js/app.js`)

**Класс**: `PersonalityTestApp`

**Состояния приложения**:
- `intro` - вводный экран
- `testing` - прохождение теста
- `results` - отображение результатов

**Методы**:
- `init()` - инициализация приложения
- `showIntro()` - отображение вводного экрана
- `startTest()` - начало тестирования
- `showScenario()` - отображение текущего сценария
- `selectOption(choice, scenarioId)` - обработка выбора
- `showResults()` - отображение результатов
- `downloadResults()` - скачивание результатов

## Поток данных

```
1. Загрузка scenarios.json
   ↓
2. Инициализация PersonalityAnalyzer
   ↓
3. Пользователь выбирает вариант
   ↓
4. analyzer.recordChoice() → обновление scores
   ↓
5. Сохранение прогресса в localStorage
   ↓
6. Переход к следующему сценарию
   ↓
7. После всех сценариев: analyzer.generateProfile()
   ↓
8. Визуализация через ResultsVisualizer
   ↓
9. Сохранение результатов в localStorage
```

## Модель анализа

### Измерения и их интерпретация

#### 1. Systematic (Системное мышление)
- **+1.0**: Чисто системный подход, структурированный анализ
- **0.0**: Сбалансированный подход
- **-1.0**: Чисто интуитивный подход, спонтанные решения

#### 2. PeopleOriented (Ориентация на людей)
- **+1.0**: Сильный фокус на команде, отношениях
- **0.0**: Баланс между людьми и процессами
- **-1.0**: Фокус на процессах, структурах, индивидуальной работе

#### 3. RiskTolerance (Склонность к риску)
- **+1.0**: Высокая готовность к риску и неопределённости
- **0.0**: Умеренная готовность
- **-1.0**: Избегание риска, предпочтение стабильности

#### 4. Strategic (Стратегическое мышление)
- **+1.0**: Долгосрочное планирование, стратегический фокус
- **0.0**: Баланс стратегии и тактики
- **-1.0**: Тактический подход, краткосрочные цели

#### 5. Exploration (Потребность в исследовании)
- **+1.0**: Сильное стремление к новым знаниям, исследованию
- **0.0**: Умеренный интерес
- **-1.0**: Практичность, фокус на применении известного

### Алгоритм нормализации

```javascript
normalizedScore = score / numberOfChoices
// Ограничение: [-1, 1]
normalizedScore = max(-1, min(1, normalizedScore))
```

### Генерация описаний

Описания генерируются на основе нормализованных оценок:
- **> 0.5**: "высокая" склонность
- **0.2 - 0.5**: "умеренная" склонность
- **-0.2 - 0.2**: "сбалансированная"
- **-0.5 - -0.2**: "умеренно низкая"
- **< -0.5**: "низкая"

## Расширяемость

### Добавление нового измерения

1. Добавить в `scenarios.json` → `dimensions`
2. Добавить веса в каждый сценарий
3. Обновить `generateSummary()` и `generateRecommendations()` в `analysis.js`

### Добавление нового сценария

1. Добавить объект в `scenarios[]` в `scenarios.json`
2. Указать веса для обоих вариантов по всем измерениям
3. Система автоматически включит его в тест

### Изменение визуализации

Модуль `visualization.js` изолирован, можно:
- Заменить Chart.js на другую библиотеку
- Добавить новые типы графиков
- Изменить стили графиков

## Производительность

- **Загрузка**: ~100-200ms (зависит от размера scenarios.json)
- **Обработка выбора**: < 1ms
- **Генерация профиля**: < 10ms
- **Создание графиков**: ~50-100ms

## Безопасность

- Все данные обрабатываются локально
- Нет отправки данных на сервер
- localStorage используется только для сохранения прогресса
- JSON валидация при загрузке сценариев

## Тестирование

### Ручное тестирование

1. Открыть `index.html` в браузере
2. Пройти все сценарии
3. Проверить отображение результатов
4. Проверить сохранение/загрузку прогресса
5. Проверить скачивание результатов

### Автоматическое тестирование (будущее)

Можно добавить:
- Unit-тесты для `PersonalityAnalyzer`
- Тесты для нормализации оценок
- Тесты для генерации профилей
- E2E тесты для пользовательского потока
