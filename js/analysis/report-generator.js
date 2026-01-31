/**
 * Модуль генерации отчетов
 * Создает профессиональные отчеты в различных форматах (HTML, PDF, JSON, TXT, DOC)
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ReportGenerator {
    constructor() {
        this.formats = ['json', 'text', 'html', 'pdf', 'doc'];
        this.currentFilename = 'report';
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
                return this.generatePDFReport(data); // Returns Promise
            case 'doc':
                return this.generateDocReport(data);
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
        const t = (key) => (window.t ? window.t(key) : key);
        const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
        const report = {
            title: t('reportTitle'),
            date: new Date().toLocaleString(lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US'),
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
        const t = (key) => (window.t ? window.t(key) : key);
        const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
        let report = '='.repeat(60) + '\n';
        report += t('reportTitle').toUpperCase() + '\n';
        report += '='.repeat(60) + '\n\n';
        report += `${t('reportDate')}: ${new Date().toLocaleString(lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US')}\n\n`;

        if (data.profile && data.profile.summary) {
            report += t('summaryLabel').toUpperCase() + '\n';
            report += '-'.repeat(60) + '\n';
            report += data.profile.summary + '\n\n';
        }

        if (data.scores) {
            report += t('dimensionScores').toUpperCase() + '\n';
            report += '-'.repeat(60) + '\n';
            Object.keys(data.scores).forEach(dim => {
                const score = data.scores[dim];
                const dimName = t(`${dim}Name`) || dim;
                report += `${dimName}: ${score}%\n`;
            });
            report += '\n';
        }

        if (data.aiAnalysis && data.aiAnalysis.personalityType) {
            report += t('personalityType').toUpperCase() + '\n';
            report += '-'.repeat(60) + '\n';
            report += `${data.aiAnalysis.personalityType.name}\n`;
            report += `${data.aiAnalysis.personalityType.description}\n\n`;
        }

        if (data.profile && data.profile.recommendations) {
            report += t('recommendationsLabel').toUpperCase() + '\n';
            report += '-'.repeat(60) + '\n';
            data.profile.recommendations.forEach((rec, index) => {
                report += `${index + 1}. ${rec.category || rec.title}\n`;
                if (rec.description) {
                    report += `   ${rec.description}\n`;
                }
            });
        }

        report += '\n' + '='.repeat(60) + '\n';
        report += t('generatedBy') + '\n';

        return report;
    }

    /**
     * Генерация HTML отчета
     * @param {Object} data - Данные
     * @returns {string} HTML строка
     */
    generateHTMLReport(data) {
        const t = (key) => (window.t ? window.t(key) : key);
        const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
        const date = new Date().toLocaleString(lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US');

        let html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t('reportTitle')}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background: #fff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
        }
        .section {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid #e1e8ed;
            border-radius: 8px;
        }
        h1 { margin: 0 0 0.5rem 0; }
        h2 { color: #4a90e2; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.5rem; }
        .score-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .score-bar {
            height: 8px;
            background: #e1e8ed;
            border-radius: 4px;
            margin-top: 0.5rem;
            overflow: hidden;
            width: 100%;
        }
        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2, #7b68ee);
        }
        .recommendation {
            padding: 1rem;
            margin-bottom: 1rem;
            background: #f8f9fa;
            border-left: 4px solid #4a90e2;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${t('reportTitle')}</h1>
        <p>${t('reportDate')}: ${date}</p>
    </div>
        `;

        if (data.profile && data.profile.summary) {
            html += `
    <div class="section">
        <h2>${t('summaryLabel')}</h2>
        <p>${data.profile.summary}</p>
    </div>
            `;
        }

        if (data.scores) {
            html += `
    <div class="section">
        <h2>${t('dimensionScores')}</h2>
            `;
            Object.keys(data.scores).forEach(dim => {
                const score = data.scores[dim];
                const normalizedScore = (score + 100) / 2;
                const dimName = t(`${dim}Name`) || dim;
                html += `
        <div class="score-item">
            <div style="flex: 1; margin-right: 20px;">
                <strong>${dimName}</strong>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${normalizedScore}%"></div>
                </div>
            </div>
            <div style="font-weight: bold; color: #4a90e2;">${score}%</div>
        </div>
                `;
            });
            html += `</div>`;
        }

        if (data.aiAnalysis && data.aiAnalysis.personalityType) {
            html += `
    <div class="section">
        <h2>${t('personalityType')}</h2>
        <h3>${data.aiAnalysis.personalityType.name}</h3>
        <p>${data.aiAnalysis.personalityType.description}</p>
    </div>
            `;
        }

        if (data.profile && data.profile.recommendations) {
            html += `
    <div class="section">
        <h2>${t('recommendationsLabel')}</h2>
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
    <div style="text-align: center; color: #95a5a6; font-size: 0.9rem; margin-top: 2rem;">
        ${t('generatedBy')}
    </div>
        `;

        html += `
</body>
</html>
        `;

        return html;
    }

    /**
     * Генерация DOC отчета (HTML с MIME-типом Word)
     * @param {Object} data 
     * @returns {string} HTML контент
     */
    generateDocReport(data) {
        // Word понимает простой HTML. Добавляем специфичные мета-теги для Word.
        const htmlContent = this.generateHTMLReport(data);

        // Оборачиваем в структуру, понятную Word
        return `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <title>Отчет</title>
                <!--[if gte mso 9]>
                <xml>
                <w:WordDocument>
                <w:View>Print</w:View>
                <w:Zoom>90</w:Zoom>
                <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    body { font-family: 'Times New Roman', serif; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;
    }

    /**
     * Генерация PDF отчета
     * Использует html2pdf.js для сохранения файла
     * @param {Object} data - Данные
     * @returns {Promise} Промис
     */
    async generatePDFReport(data) {
        // Проверяем наличие библиотеки
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf library is missing');
            alert('Библиотека html2pdf не загружена. Пожалуйста, проверьте подключение к интернету.');
            return Promise.reject('html2pdf not found');
        }

        // 1. Получаем полные данные отчета
        const fullHtml = this.generateHTMLReport(data);

        // 2. Создаем контейнер для рендеринга
        const container = document.createElement('div');
        container.className = 'pdf-export-container';

        // 3. Парсим HTML строку, чтобы извлечь стили и контент
        // Это критически важно, так как вставка полной строки <html>...</html> в div
        // создает невалидный DOM, который html2canvas может игнорировать (пустой лист).
        const parser = new DOMParser();
        const doc = parser.parseFromString(fullHtml, 'text/html');

        // Извлекаем стили (важно клонировать)
        const styles = doc.querySelectorAll('style');
        styles.forEach(style => {
            container.appendChild(style.cloneNode(true));
        });

        // Извлекаем содержимое body
        const bodyContent = doc.body.innerHTML;
        const contentWrapper = document.createElement('div');
        contentWrapper.innerHTML = bodyContent;
        // Добавляем класс body, если есть (для специфичных селекторов)
        if (doc.body.className) contentWrapper.className = doc.body.className;

        container.appendChild(contentWrapper);

        // 4. Стилизация контейнера
        // Используем fixed позиционирование, но видимое для браузера (на экране)
        // Некоторые браузеры не рендерят элементы за пределами видимости (left: -9999px)
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
        container.style.width = '800px'; // A4 ширина
        container.style.height = 'auto';
        container.style.maxHeight = '100vh'; // Ограничиваем высоту вьюпорта
        container.style.overflow = 'hidden'; // Скрываем скроллбары
        container.style.background = '#ffffff';
        container.style.color = '#000000 !important'; // Форсируем черный текст
        container.style.zIndex = '-9999'; // Скрываем под основным контентом
        container.style.opacity = '0.01'; // Делаем почти прозрачным, но не 0 (0 иногда не рендерится)
        container.style.pointerEvents = 'none'; // Чтобы не мешал кликам

        // Важно: html2canvas требует, чтобы элемент был в DOM
        document.body.appendChild(container);

        // 5. Даем браузеру время на отрисовку и применение стилей
        await new Promise(resolve => setTimeout(resolve, 500));

        // 6. Настройки экспорта
        const opt = {
            margin: [10, 10, 10, 10],
            filename: this.currentFilename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true,
                scrollY: 0,
                scrollX: 0,
                windowWidth: 800
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Форсируем белый фон для контента внутри
        if (contentWrapper) {
            contentWrapper.style.backgroundColor = '#ffffff';
            contentWrapper.style.color = '#000000';
        }

        try {
            // 7. Генерируем PDF
            const worker = html2pdf().from(container).set(opt);
            await worker.save();

            // 8. Очистка
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
            return Promise.resolve();
        } catch (error) {
            console.error('Ошибка при генерации PDF (ReportGenerator):', error);
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
            throw error;
        }
    }

    /**
     * Скачивание отчета
     * @param {Object} data - Данные
     * @param {string} format - Формат
     * @param {string} filename - Имя файла
     */
    downloadReport(data, format = 'html', filename = null) {
        // Если имя файла отсутствует, генерируем стандартное
        if (!filename) {
            const date = new Date().toISOString().split('T')[0];
            const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
            filename = `personality-report-${date}_${lang}.${format === 'json' ? 'json' : format === 'text' ? 'txt' : 'html'}`;
        }

        // Убеждаемся, что расширение соответствует формату
        if (format === 'pdf' && !filename.endsWith('.pdf')) filename += '.pdf';
        if (format === 'html' && !filename.endsWith('.html')) filename += '.html';
        if (format === 'doc' && !filename.endsWith('.doc')) filename += '.doc';

        this.currentFilename = filename;

        if (format === 'pdf') {
            this.generatePDFReport(data).catch(err => {
                console.error('PDF Generation failed', err);
                alert('Не удалось создать PDF. Попробуйте еще раз.');
            });
            return;
        }

        const report = this.generateReport(data, format);

        let blob;

        switch (format) {
            case 'json':
                blob = new Blob([report], { type: 'application/json' });
                break;
            case 'text':
                blob = new Blob([report], { type: 'text/plain' });
                break;
            case 'html':
                blob = new Blob([report], { type: 'text/html' });
                break;
            case 'doc':
                // Используем MIME-тип Word для открытия HTML как документа
                blob = new Blob(['\ufeff', report], { type: 'application/msword' });
                break;
            default:
                blob = new Blob([report], { type: 'text/html' });
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

// Обеспечиваем глобальную доступность
if (typeof window !== 'undefined') {
    window.ReportGenerator = ReportGenerator;
    console.log('ReportGenerator initialized'); // Log for debugging
}
