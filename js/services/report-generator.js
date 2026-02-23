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
            --primary-color: #00c6fb;
            --secondary-color: #005bea;
            --accent-color: #b122e5;
            --background-color: #050510;
            --surface-color: rgba(20, 20, 35, 0.7);
            --surface-border: rgba(255, 255, 255, 0.1);
            --text-primary: #ffffff;
            --text-secondary: #a0a0b0;
            --border-radius: 16px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-color);
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(0, 198, 251, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(177, 34, 229, 0.1) 0%, transparent 50%);
            color: var(--text-primary);
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
        }

        .export-container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--surface-color);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 50px;
            border-radius: 24px;
            border: 1px solid var(--surface-border);
            box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05);
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
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: #fff;
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
        }

        /* Архетип */
        .archetype-card {
            background: rgba(10, 10, 20, 0.4);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
            margin-bottom: 40px;
            box-shadow: inset 0 0 80px rgba(0, 198, 251, 0.05);
        }

        .archetype-icon {
            font-size: 72px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
            filter: drop-shadow(0 0 15px rgba(0, 198, 251, 0.3));
        }

        .archetype-name {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 3rem;
            margin: 15px 0;
            background: linear-gradient(90deg, #fff, #a0a0b0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--surface-border);
            padding: 20px;
            border-radius: 16px;
            transition: transform 0.3s ease;
        }

        .score-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 500;
        }
        
        .score-header .material-symbols-rounded {
            color: var(--primary-color);
        }

        .score-bar {
            height: 10px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
            border-radius: 5px;
            position: relative;
        }
        
        .score-fill::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
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
            color: #fff;
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
            background: rgba(255, 255, 255, 0.02);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid var(--surface-border);
            border-top: 2px solid var(--primary-color);
            position: relative;
            overflow: hidden;
        }
        
        .direction-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 30px;
            background: linear-gradient(180deg, rgba(0, 198, 251, 0.1), transparent);
            pointer-events: none;
        }

        .direction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .direction-name {
            margin: 0;
            font-size: 1.2rem;
            font-family: 'Space Grotesk', sans-serif;
            color: #fff;
        }
        
        .direction-match {
            background: rgba(0, 198, 251, 0.2);
            color: var(--primary-color);
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .direction-desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

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
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--surface-border);
            border-radius: 16px;
            align-items: flex-start;
        }

        .recommendation-item .material-symbols-rounded {
            color: var(--primary-color);
            background: rgba(0, 198, 251, 0.1);
            padding: 8px;
            border-radius: 50%;
            font-size: 20px;
        }
        
        .recommendation-item span:last-child {
            color: #e0e0e0;
            padding-top: 4px;
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
