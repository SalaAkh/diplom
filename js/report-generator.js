/**
 * Модуль генерации отчетов
 * Создает профессиональные отчеты в различных форматах
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ReportGenerator {
    constructor() {
        this.formats = ['json', 'text', 'html'];
    }

    /**
     * Генерация полного отчета
     * @param {Object} data - Данные для отчета
     * @param {string} format - Формат отчета
     * @returns {string|Blob} Отчет
     */
    generateReport(data, format = 'html') {
        switch (format) {
            case 'json':
                return this.generateJSONReport(data);
            case 'text':
                return this.generateTextReport(data);
            case 'html':
                return this.generateHTMLReport(data);
            case 'pdf':
                return this.generatePDFReport(data);
            default:
                return this.generateHTMLReport(data);
        }
    }

    /**
     * Генерация JSON отчета
     * @param {Object} data - Данные
     * @returns {string} JSON строка
     */
    generateJSONReport(data) {
        const report = {
            title: 'Отчет о прохождении системы самопознания',
            date: new Date().toLocaleString('ru-RU'),
            version: '1.0',
            data: data
        };
        return JSON.stringify(report, null, 2);
    }

    /**
     * Генерация текстового отчета
     * @param {Object} data - Данные
     * @returns {string} Текстовый отчет
     */
    generateTextReport(data) {
        let report = '='.repeat(60) + '\n';
        report += 'ОТЧЕТ О ПРОХОЖДЕНИИ СИСТЕМЫ САМОПОЗНАНИЯ\n';
        report += '='.repeat(60) + '\n\n';
        report += `Дата: ${new Date().toLocaleString('ru-RU')}\n\n`;

        if (data.profile && data.profile.summary) {
            report += 'ОБЩЕЕ РЕЗЮМЕ\n';
            report += '-'.repeat(60) + '\n';
            report += data.profile.summary + '\n\n';
        }

        if (data.scores) {
            report += 'ОЦЕНКИ ПО ИЗМЕРЕНИЯМ\n';
            report += '-'.repeat(60) + '\n';
            Object.keys(data.scores).forEach(dim => {
                const score = data.scores[dim];
                report += `${dim}: ${score}%\n`;
            });
            report += '\n';
        }

        if (data.aiAnalysis && data.aiAnalysis.personalityType) {
            report += 'ТИП ЛИЧНОСТИ\n';
            report += '-'.repeat(60) + '\n';
            report += `${data.aiAnalysis.personalityType.name}\n`;
            report += `${data.aiAnalysis.personalityType.description}\n\n`;
        }

        if (data.profile && data.profile.recommendations) {
            report += 'РЕКОМЕНДАЦИИ\n';
            report += '-'.repeat(60) + '\n';
            data.profile.recommendations.forEach((rec, index) => {
                report += `${index + 1}. ${rec.category || rec.title}\n`;
                if (rec.description) {
                    report += `   ${rec.description}\n`;
                }
            });
        }

        report += '\n' + '='.repeat(60) + '\n';
        report += 'Сгенерировано системой самопознания\n';

        return report;
    }

    /**
     * Генерация HTML отчета
     * @param {Object} data - Данные
     * @returns {string} HTML строка
     */
    generateHTMLReport(data) {
        const date = new Date().toLocaleString('ru-RU');
        
        let html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Отчет о прохождении системы самопознания</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        .section {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { margin: 0 0 0.5rem 0; }
        h2 { color: #4a90e2; margin-top: 0; }
        .score-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem;
            border-bottom: 1px solid #e1e8ed;
        }
        .score-item:last-child { border-bottom: none; }
        .score-bar {
            height: 8px;
            background: #e1e8ed;
            border-radius: 4px;
            margin-top: 0.5rem;
            overflow: hidden;
        }
        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2, #7b68ee);
            transition: width 0.3s;
        }
        .recommendation {
            padding: 1rem;
            margin-bottom: 1rem;
            background: #f8f9fa;
            border-left: 4px solid #4a90e2;
            border-radius: 4px;
        }
        @media print {
            body { background: white; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Отчет о прохождении системы самопознания</h1>
        <p>Дата: ${date}</p>
    </div>
        `;

        if (data.profile && data.profile.summary) {
            html += `
    <div class="section">
        <h2>Общее резюме</h2>
        <p>${data.profile.summary}</p>
    </div>
            `;
        }

        if (data.scores) {
            html += `
    <div class="section">
        <h2>Оценки по измерениям</h2>
            `;
            Object.keys(data.scores).forEach(dim => {
                const score = data.scores[dim];
                const normalizedScore = (score + 100) / 2; // Преобразуем -100..100 в 0..100
                html += `
        <div class="score-item">
            <div>
                <strong>${dim}</strong>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${normalizedScore}%"></div>
                </div>
            </div>
            <div><strong>${score}%</strong></div>
        </div>
                `;
            });
            html += `</div>`;
        }

        if (data.aiAnalysis && data.aiAnalysis.personalityType) {
            html += `
    <div class="section">
        <h2>Тип личности</h2>
        <h3>${data.aiAnalysis.personalityType.name}</h3>
        <p>${data.aiAnalysis.personalityType.description}</p>
    </div>
            `;
        }

        if (data.profile && data.profile.recommendations) {
            html += `
    <div class="section">
        <h2>Рекомендации</h2>
            `;
            data.profile.recommendations.forEach(rec => {
                html += `
        <div class="recommendation">
            <h3>${rec.category || rec.title}</h3>
            <p>${rec.description || ''}</p>
        </div>
                `;
            });
            html += `</div>`;
        }

        html += `
</body>
</html>
        `;

        return html;
    }

    /**
     * Генерация PDF отчета (упрощенная версия через печать)
     * @param {Object} data - Данные
     * @returns {Promise} Промис с Blob
     */
    async generatePDFReport(data) {
        // Создаем HTML отчет
        const html = this.generateHTMLReport(data);
        
        // Создаем временное окно для печати
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Ждем загрузки и предлагаем печать
        printWindow.onload = () => {
            printWindow.print();
        };
        
        return Promise.resolve(new Blob([html], { type: 'text/html' }));
    }

    /**
     * Скачивание отчета
     * @param {Object} data - Данные
     * @param {string} format - Формат
     * @param {string} filename - Имя файла
     */
    downloadReport(data, format = 'html', filename = null) {
        const report = this.generateReport(data, format);
        
        if (!filename) {
            const date = new Date().toISOString().split('T')[0];
            filename = `personality-report-${date}.${format === 'json' ? 'json' : format === 'text' ? 'txt' : 'html'}`;
        }

        let blob;
        let mimeType;

        switch (format) {
            case 'json':
                blob = new Blob([report], { type: 'application/json' });
                mimeType = 'application/json';
                break;
            case 'text':
                blob = new Blob([report], { type: 'text/plain' });
                mimeType = 'text/plain';
                break;
            case 'html':
                blob = new Blob([report], { type: 'text/html' });
                mimeType = 'text/html';
                break;
            default:
                blob = new Blob([report], { type: 'text/html' });
                mimeType = 'text/html';
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
}
