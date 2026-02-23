const fs = require('fs');

let text = fs.readFileSync('docs/diploma/DIPLOMA_FULL.md', 'utf8');

// 1. 2025 -> 2026 in dates
text = text.replace('____» _____________ 2025 г.', '____» _____________ 2026 г.');

// 2. Add abstract
if (!text.includes('# ABSTRACT')) {
    const abstract_text = `
# ABSTRACT

The diploma project is dedicated to the development of a digital self-knowledge system designed to analyze personal preferences and determine the user's development directions.

The aim of the work is to develop a digital system for analyzing personal preferences and determining user development directions through interactive decision scenarios.

During the work, a model for analyzing personal preferences across 6 dimensions was developed: rationality, control, strategic thinking, research potential, individualism, and the search for meaning. The model is based on decision-making theory and implemented through interactive dilemma scenarios.

The system is implemented as a Progressive Web Application (PWA) using HTML5, CSS3, and JavaScript ES6+ technologies. The Chart.js library is used to visualize the results. Data is stored entirely locally in the user's browser via localStorage.

The system features three types of testing: a basic scenario test (10 dilemmas), an extended test (scale, open-ended, and situational questions), and a cognitive test. Results are visualized using radar and bar charts.

Additional functional capabilities include: comparative analysis with professional roles, comparison with famous personalities, profile evolution tracking, HTML report export, and support for 3 languages (Kazakh, Russian, English).

The system successfully passed functional, cross-browser, and adaptive testing.

The volume of the explanatory note is XX pages, figures — XX, tables — XX, references — 25.

---
`;
    const targetStr = "Объём пояснительной записки — ХХ страниц, рисунков — ХХ, таблиц — ХХ, источников литературы — 25.\n";
    const annot_end_idx = text.indexOf(targetStr);

    if (annot_end_idx !== -1) {
        const insert_idx = text.indexOf("---", annot_end_idx);
        text = text.substring(0, insert_idx) + abstract_text + text.substring(insert_idx + 3);
    }
}

// 3. Add 1.2 Header
text = text.replace("Для разработки собственной модели анализа предпочтений необходимо критически рассмотреть",
    "## 1.2 Модели анализа личности: от Big Five до современных подходов\n\nДля разработки собственной модели анализа предпочтений необходимо критически рассмотреть");

// 4. Fix Chapter 2 weird structure
// Extract glossary block
const glossary_start = text.indexOf("## 2.4 Глоссарий психологических архетипов");
const glossary_end = text.indexOf("На основе данного анализа задача была декомпозирована");

if (glossary_start !== -1 && glossary_end !== -1) {
    let glossary_text = text.substring(glossary_start, glossary_end);
    glossary_text = glossary_text.replace("## 2.4 Глоссарий психологических архетипов", "### Глоссарий психологических архетипов");

    text = text.substring(0, glossary_start) + text.substring(glossary_end);

    const cat_end = text.indexOf("Выбирается архетип с максимальным Match(c).");
    if (cat_end !== -1) {
        const afterStr = "Выбирается архетип с максимальным Match(c).";
        text = text.substring(0, cat_end + afterStr.length) + "\n\n" + glossary_text + text.substring(cat_end + afterStr.length);
    }
}

// Fix nested math model heading
text = text.replace("## 2.3 Математическая модель скоринга и нормализации", "### Математическая модель скоринга и нормализации");

// Fix 2.4 Architecture
text = text.replace("## 2.4 Архитектура и программная реализация", "## 2.4 Архитектура приложения");

// Fix 2.5 UI
text = text.replace("### 2.5 Проектирование пользовательского интерфейса и системной аналитики", "## 2.5 Проектирование пользовательского интерфейса");

// Fix Chapter 3
text = text.replace("**3.1 Выбор технологического стека и системное обоснование**", "## 3.1 Выбор технологий и обоснование");

// Fix Chapter 4 duplicates
text = text.replace("### 4.3.1 Результаты тестирования производительности (Lighthouse Audit)", "### 4.3.2 Результаты тестирования производительности (Lighthouse Audit)");
text = text.replace("### 4.3.2 Анализ ресурсоемкости и автономной работы", "### 4.3.3 Анализ ресурсоемкости и автономной работы");
text = text.replace("## 4.4 Валидация и точность анализа", "### 4.3.4 Валидация и точность анализа");

// Fix Chapter 5 duplicate/erroneous
text = text.replace("## 5.2 Перспективы и направления дальнейших исследований", "### Перспективы и направления дальнейших исследований");
text = text.replace("### 5.2.1 Интеграция алгоритмов", "#### Интеграция алгоритмов");
text = text.replace("### 5.2.2 Геймификация", "#### Геймификация");
text = text.replace("### 5.2.3 Корпоративный модуль", "#### Корпоративный модуль");

// Tables increment
text = text.replace("Таблица 3 — Матрица соответствия", "Таблица 4 — Матрица соответствия");
text = text.replace("Таблица 4 — Сравнительный анализ инструментов", "Таблица 5 — Сравнительный анализ инструментов");
text = text.replace("Структура файлов проекта представлена в таблице 4", "Структура файлов проекта представлена в таблице 6");
text = text.replace("Таблица 4 — Структура файлов проекта", "Таблица 6 — Структура файлов проекта");
text = text.replace("представлены в таблице 5", "представлены в таблице 7");
text = text.replace("Таблица 5 — Результаты", "Таблица 7 — Результаты");
text = text.replace("Таблица 6 — Сравнительные метрики", "Таблица 8 — Сравнительные метрики");
text = text.replace("Таблица 7 — Оценка юзабилити", "Таблица 9 — Оценка юзабилити");

fs.writeFileSync('docs/diploma/DIPLOMA_FULL.md', text, 'utf8');

console.log("Formatting fixed!");
