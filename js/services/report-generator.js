/**
 * ReportGenerator - Служба генерации отчетов
 * Формирует HTML файл с результатами теста для скачивания
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */
class ReportGenerator {
    constructor(app) {
        this.app = app;
    }

    /**
     * Генерация HTML отчета
     * @param {Object} results - Результаты теста
     * @returns {string} - HTML код страницы
     */
    generateHTML(results) {
        // Создаем экземпляр ResultsView для генерации контента
        // Используем глобальный ResultsView
        const ResultsView = window.ResultsView;
        if (!ResultsView) {
            console.error('ResultsView not found');
            return '<div style="color:red">Error: ResultsView not found</div>';
        }

        // Временный экземпляр для рендера
        const view = new ResultsView({
            app: this.app,
            results: results,
            i18n: this.app.i18n
        });

        // Получаем основной контент
        let content = view.getHTML();

        // Попытка получить уже отрендеренный график из текущего DOM (live app)
        const liveCanvas = document.querySelector('#radarChartContainer canvas');
        if (liveCanvas) {
            try {
                const imgData = liveCanvas.toDataURL('image/png');
                content = content.replace(
                    /<div[^>]*id="radarChartContainer"[^>]*>[\s\S]*?<\/div>/i,
                    `<div class="chart-container" id="radarChartContainer" style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #10111e 0%, #050510 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: 20px 0;">
                        <img src="${imgData}" alt="Visual Profile" style="max-width: 100%; width: 450px; height: auto; display: inline-block;">
                     </div>`
                );
            } catch (e) {
                console.warn('Canvas export to image failed:', e);
            }
        }

        const date = new Date().toLocaleDateString();
        const appName = this.app.i18n.t('appName');

        let usernameDisplay = '';
        const user = this.app.auth.getCurrentUser();
        if (user) {
            usernameDisplay = `<p>${this.app.i18n.t('loggedInAs')} <strong>${user.username}</strong></p>`;
        }

        // Формируем полный HTML документ
        return `<!DOCTYPE html>
<html lang="${this.app.language || 'kk'}" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName} - ${this.app.i18n.t('resultsTitle')} ${date}</title>
    
    <!-- Стили -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    
    <style>
        /* ── DARK THEME (default) ── */
        :root, [data-theme="dark"] {
            --primary-color: #00c6fb;
            --secondary-color: #005bea;
            --accent-color: #b122e5;
            --background-color: #050510;
            --surface-color: rgba(20, 20, 35, 0.7);
            --surface-border: rgba(255, 255, 255, 0.1);
            --text-primary: #ffffff;
            --text-secondary: #a0a0b0;
            --border-radius: 16px;
            --btn-theme-bg: rgba(255,255,255,0.1);
            --btn-theme-border: rgba(255,255,255,0.2);
            --btn-theme-color: #e0e0e0;
        }

        /* ── LIGHT THEME ── */
        [data-theme="light"] {
            --primary-color: #2563eb;
            --secondary-color: #7c3aed;
            --accent-color: #0891b2;
            --background-color: #f0f4ff;
            --surface-color: rgba(255, 255, 255, 0.92);
            --surface-border: rgba(37, 99, 235, 0.12);
            --text-primary: #0f1f3d;
            --text-secondary: #4b5563;
            --border-radius: 16px;
            --btn-theme-bg: rgba(37,99,235,0.08);
            --btn-theme-border: rgba(37,99,235,0.2);
            --btn-theme-color: #2563eb;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(0, 198, 251, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
            color: var(--text-primary);
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* ── Theme Toggle Button ── */
        .theme-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 50px;
            background: var(--btn-theme-bg);
            border: 1px solid var(--btn-theme-border);
            color: var(--btn-theme-color);
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .theme-toggle-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .theme-icon { font-size: 18px; }

        .export-container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--surface-color);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 50px;
            border-radius: 24px;
            border: 1px solid var(--surface-border);
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
            transition: background 0.3s ease, border-color 0.3s ease;
        }

        .export-header {
            text-align: center;
            border-bottom: 1px solid var(--surface-border);
            padding-bottom: 30px;
            margin-bottom: 40px;
            position: relative;
        }
        
        .export-header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        }

        .export-logo {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
            display: inline-block;
            letter-spacing: 1px;
        }

        .export-header p { color: var(--text-secondary); margin-top: 8px; }

        /* Адаптация стилей ResultsView */
        .results-container { padding: 0; }
        .results-section { margin-bottom: 30px; page-break-inside: avoid; }

        .section-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .section-title::before {
            content: '';
            display: block;
            width: 8px;
            height: 24px;
            background: linear-gradient(180deg, var(--primary-color), var(--secondary-color));
            border-radius: 4px;
            flex-shrink: 0;
        }

        /* Архетип */
        .archetype-card {
            background: var(--surface-color);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            border: 1px solid var(--surface-border);
            margin-bottom: 40px;
        }

        .archetype-icon {
            font-size: 72px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }

        .archetype-name {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 3rem;
            margin: 15px 0;
            color: var(--text-primary);
            letter-spacing: -1px;
        }
        
        .archetype-description {
            color: var(--text-secondary);
            font-size: 1.1rem;
            max-width: 80%;
            margin: 0 auto;
        }

        /* Шкалы */
        .scores-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
        }

        .score-card {
            background: var(--surface-color);
            border: 1px solid var(--surface-border);
            padding: 20px;
            border-radius: 16px;
        }

        .score-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .score-header .material-symbols-rounded { color: var(--primary-color); }

        .score-bar {
            height: 10px;
            background: var(--surface-border);
            border-radius: 5px;
            overflow: hidden;
        }

        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
            border-radius: 5px;
        }
        
        .score-fill.high { background: linear-gradient(90deg, #00b09b, #96c93d); }
        .score-fill.medium-high { background: linear-gradient(90deg, #4facfe, #00f2fe); }
        .score-fill.medium-low { background: linear-gradient(90deg, #f6d365, #fda085); }
        .score-fill.low { background: linear-gradient(90deg, #ff0844, #ffb199); }

        .score-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            margin-top: 8px;
            color: var(--text-secondary);
        }
        
        .score-value {
            color: var(--primary-color);
            font-weight: 600;
            font-family: 'Space Grotesk', sans-serif;
        }

        /* Направления */
        .directions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
        }

        .direction-card {
            background: var(--surface-color);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid var(--surface-border);
            border-top: 2px solid var(--primary-color);
        }

        .direction-name {
            margin: 0 0 8px;
            font-size: 1.2rem;
            font-family: 'Space Grotesk', sans-serif;
            color: var(--text-primary);
        }
        
        .direction-match {
            background: rgba(37, 99, 235, 0.15);
            color: var(--primary-color);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .direction-desc { color: var(--text-secondary); font-size: 0.95rem; }

        /* Рекомендации */
        .recommendations-list {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .recommendation-item {
            display: flex;
            gap: 20px;
            padding: 20px;
            background: var(--surface-color);
            border: 1px solid var(--surface-border);
            border-radius: 16px;
            align-items: flex-start;
        }

        .recommendation-item .material-symbols-rounded {
            color: var(--primary-color);
            background: rgba(37, 99, 235, 0.1);
            padding: 8px;
            border-radius: 50%;
            font-size: 20px;
        }
        
        .recommendation-item span:last-child {
            color: var(--text-secondary);
            padding-top: 4px;
        }

        footer { color: var(--text-secondary); }

        /* Скрыть кнопки действий в отчете */
        .results-actions, #downloadResultsBtn, #retakeTestBtn, #homeBtn { display: none !important; }
        
        /* Скрыть графики Chart.js */
        #radarChartContainer canvas { display: none; }

        @media (max-width: 600px) {
            .export-container { padding: 24px; }
            .scores-grid { grid-template-columns: 1fr; }
            .theme-toggle-btn { top: 12px; right: 12px; padding: 8px 14px; }
        }
    </style>
</head>
<body>
    <!-- Theme Toggle -->
    <button class="theme-toggle-btn" onclick="toggleTheme()" id="themeBtn" title="Switch theme">
        <span class="material-symbols-rounded theme-icon" id="themeIcon">dark_mode</span>
        <span id="themeLabel">Light mode</span>
    </button>

    <div class="export-container">
        <header class="export-header">
            <span class="export-logo">${appName}</span>
            <p>${this.app.i18n.t('resultsTitle')} / ${date}</p>
            ${usernameDisplay}
        </header>

        ${content}

        <footer style="text-align: center; margin-top: 50px; font-size: 0.9rem;">
            <p>${this.app.i18n.t('reportGeneratedBy')}</p>
            <p>&copy; 2026 ${appName}</p>
        </footer>
    </div>

    <script>
        // Theme toggle for exported report
        const html = document.documentElement;
        const btn = document.getElementById('themeBtn');
        const icon = document.getElementById('themeIcon');
        const label = document.getElementById('themeLabel');

        function toggleTheme() {
            const isDark = html.getAttribute('data-theme') === 'dark';
            html.setAttribute('data-theme', isDark ? 'light' : 'dark');
            icon.textContent = isDark ? 'dark_mode' : 'light_mode';
            label.textContent = isDark ? 'Dark mode' : 'Light mode';
            localStorage.setItem('report-theme', isDark ? 'light' : 'dark');
        }

        // Restore saved preference
        const saved = localStorage.getItem('report-theme');
        if (saved && saved !== 'dark') {
            toggleTheme();
        }
    <\/script>
</body>
</html>`;
    }
    

    /**
     * Скачивание файла
     * @param {string} filename - Имя файла
     * @param {string} content - Содержимое файла
     */
    download(filename, content) {
        const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    }
}

// Экспорт в глобальную область
if (typeof window !== 'undefined') {
    window.ReportGenerator = ReportGenerator;
}

