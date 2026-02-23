import re

with open("docs/diploma/DIPLOMA_FULL.md", "r", encoding="utf-8") as f:
    text = f.read()

# 1. 2025 -> 2026 in dates
text = text.replace("____» _____________ 2025 г.", "____» _____________ 2026 г.")

# 2. Add abstract
if "# ABSTRACT" not in text:
    abstract_text = """
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
"""
    # Insert after АННОТАЦИЯ block
    annot_end_idx = text.find("Объём пояснительной записки — ХХ страниц, рисунков — ХХ, таблиц — ХХ, источников литературы — 25.\n")
    if annot_end_idx != -1:
        insert_idx = text.find("---", annot_end_idx)
        text = text[:insert_idx] + abstract_text + text[insert_idx+3:]

# 3. Add 1.2 Header
text = text.replace("Для разработки собственной модели анализа предпочтений необходимо критически рассмотреть",
                    "## 1.2 Модели анализа личности: от Big Five до современных подходов\n\nДля разработки собственной модели анализа предпочтений необходимо критически рассмотреть")

# 4. Fix Chapter 2 weird structure
# Extract glossary block
glossary_start = text.find("## 2.4 Глоссарий психологических архетипов")
glossary_end = text.find("На основе данного анализа задача была декомпозирована")

if glossary_start != -1 and glossary_end != -1:
    glossary_text = text[glossary_start:glossary_end]
    glossary_text = glossary_text.replace("## 2.4 Глоссарий психологических архетипов", "### Глоссарий психологических архетипов")
    # Remove from original place
    text = text[:glossary_start] + text[glossary_end:]
    
    # Insert after 2.2.3
    cat_end = text.find("Выбирается архетип с максимальным Match(c).")
    if cat_end != -1:
        text = text[:cat_end+len("Выбирается архетип с максимальным Match(c).")] + "\n\n" + glossary_text + text[cat_end+len("Выбирается архетип с максимальным Match(c)."):]

# Fix nested math model heading
text = text.replace("## 2.3 Математическая модель скоринга и нормализации", "### Математическая модель скоринга и нормализации")

# Fix 2.4 Architecture
text = text.replace("## 2.4 Архитектура и программная реализация", "## 2.4 Архитектура приложения")

# Fix 2.5 UI
text = text.replace("### 2.5 Проектирование пользовательского интерфейса и системной аналитики", "## 2.5 Проектирование пользовательского интерфейса")

# Fix Chapter 3
text = text.replace("**3.1 Выбор технологического стека и системное обоснование**", "## 3.1 Выбор технологий и обоснование")

# Fix Chapter 4 duplicates
text = text.replace("### 4.3.1 Результаты тестирования производительности (Lighthouse Audit)", "### 4.3.2 Результаты тестирования производительности (Lighthouse Audit)")
text = text.replace("### 4.3.2 Анализ ресурсоемкости и автономной работы", "### 4.3.3 Анализ ресурсоемкости и автономной работы")
text = text.replace("## 4.4 Валидация и точность анализа", "### 4.3.4 Валидация и точность анализа")

# Fix Chapter 5 duplicate/erroneous
text = text.replace("## 5.2 Перспективы и направления дальнейших исследований", "### Перспективы и направления дальнейших исследований")
text = text.replace("### 5.2.1 Интеграция алгоритмов", "#### Интеграция алгоритмов")
text = text.replace("### 5.2.2 Геймификация", "#### Геймификация")
text = text.replace("### 5.2.3 Корпоративный модуль", "#### Корпоративный модуль")

# 10. Tables increment
text = text.replace("Таблица 3 — Матрица соответствия", "Таблица 4 — Матрица соответствия")
text = text.replace("Таблица 4 — Сравнительный анализ инструментов", "Таблица 5 — Сравнительный анализ инструментов")
# Need to replace the reference in text first
text = text.replace("Структура файлов проекта представлена в таблице 4", "Структура файлов проекта представлена в таблице 6")
text = text.replace("Таблица 4 — Структура файлов проекта", "Таблица 6 — Структура файлов проекта")
text = text.replace("представлены в таблице 5", "представлены в таблице 7")
text = text.replace("Таблица 5 — Результаты", "Таблица 7 — Результаты")
text = text.replace("Таблица 6 — Сравнительные метрики", "Таблица 8 — Сравнительные метрики")
text = text.replace("Таблица 7 — Оценка юзабилити", "Таблица 9 — Оценка юзабилити")

# Write down
with open("docs/diploma/DIPLOMA_FULL.md", "w", encoding="utf-8") as f:
    f.write(text)

print("Formatting fixed!")
