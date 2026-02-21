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
        const content = view.getHTML();
        const date = new Date().toLocaleDateString();
        const appName = this.app.i18n.t('appName');

        let usernameDisplay = '';
        const user = this.app.auth.getCurrentUser();
        if (user) {
            usernameDisplay = `<p>${this.app.i18n.t('loggedInAs')} <strong>${user.username}</strong></p>`;
        }

        // Формируем полный HTML документ
        return `<!DOCTYPE html>
<html lang="${this.app.language || 'kk'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName} - ${this.app.i18n.t('resultsTitle')} ${date}</title>
    
    <!-- Стили -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    
    <style>
        :root {
            --primary-color: #4a90e2;
            --secondary-color: #50e3c2;
            --background-color: #f5f7fa;
            --surface-color: #ffffff;
            --text-primary: #2c3e50;
            --text-secondary: #7f8c8d;
            --border-radius: 12px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            color: var(--text-primary);
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
        }

        .export-container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--surface-color);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .export-header {
            text-align: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .export-logo {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 10px;
            display: block;
        }

        /* Адаптация стилей ResultsView для печати/экспорта */
        .results-container {
            padding: 0;
        }

        .results-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .section-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
            border-left: 4px solid var(--primary-color);
            padding-left: 15px;
        }

        /* Архетип */
        .archetype-card {
            background: linear-gradient(135deg, #f6f8fb 0%, #eef2f7 100%);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            border: 1px solid rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }

        .archetype-icon {
            font-size: 64px;
            color: var(--primary-color);
            margin-bottom: 15px;
        }

        .archetype-name {
            font-size: 2.5rem;
            margin: 10px 0;
            background: linear-gradient(90deg, #4a90e2, #50e3c2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Шкалы */
        .scores-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .score-card {
            background: #fff;
            border: 1px solid #eee;
            padding: 15px;
            border-radius: 10px;
        }

        .score-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .score-bar {
            height: 8px;
            background: #eee;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }

        .score-fill {
            height: 100%;
            background: var(--primary-color);
            border-radius: 4px;
        }
        
        .score-fill.high { background: #4caf50; }
        .score-fill.medium-high { background: #8bc34a; }
        .score-fill.medium-low { background: #ffc107; }
        .score-fill.low { background: #ff9800; }

        .score-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            margin-top: 5px;
            color: var(--text-secondary);
        }

        /* Направления */
        .directions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .direction-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border-left: 3px solid var(--secondary-color);
        }

        .direction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .direction-name {
            margin: 0;
            font-size: 1.1rem;
        }

        /* Рекомендации */
        .recommendations-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }

        .recommendation-item {
            display: flex;
            gap: 15px;
            padding: 15px;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 10px;
            align-items: center;
        }

        .recommendation-item .material-symbols-rounded {
            color: var(--secondary-color);
        }

        /* Скрыть кнопки действий в отчете */
        .results-actions, #downloadResultsBtn, #retakeTestBtn, #homeBtn {
            display: none !important;
        }
        
        /* Скрыть графики Chart.js так как они не рендерятся в статике без JS */
        #radarChartContainer canvas {
            display: none;
        }
    </style>
</head>
<body>
    <div class="export-container">
        <header class="export-header">
            <span class="export-logo">${appName}</span>
            <p>${this.app.i18n.t('resultsTitle')} / ${date}</p>
            ${usernameDisplay}
        </header>

        ${content}

        <footer style="text-align: center; margin-top: 50px; color: #888; font-size: 0.9rem;">
            <p>${this.app.i18n.t('reportGeneratedBy')}</p>
            <p>&copy; 2026 ${appName}</p>
        </footer>
    </div>
</body>
</html>`;
    }

    /**
     * Скачивание файла
     * @param {string} filename - Имя файла
     * @param {string} content - Содержимое
     */
    download(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// Экспорт в глобальную область
if (typeof window !== 'undefined') {
    window.ReportGenerator = ReportGenerator;
}
