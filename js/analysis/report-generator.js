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
                return this.generateHTMLReport(data, 'html');
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
     * @param {string} format - Формат (html, doc, pdf)
     * @returns {string} HTML строка
     */
    generateHTMLReport(data, format = 'html') {
        const t = (key) => (window.t ? window.t(key) : key);
        const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
        const date = new Date().toLocaleString(lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US');

        // PDF Specific: Consistent width for A4
        const pdfWidth = '800px';

        // Check if we are potentially on index.html (or root) to apply specific fix for global style interference
        const isIndexPage = typeof window !== 'undefined' && (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '/diplom/');

        // Create explicit wrapper style for index page alignment
        // We use margin: 0 auto for centering, but add large padding-left to compensate for aggressive cut-off
        const printWrapperStyle = (format === 'pdf' && isIndexPage)
            ? 'style="margin: 0 auto !important; width: 800px !important; display: block !important; padding-left: 100px !important;"'
            : '';

        const bodyStyle = format === 'pdf' ?
            `width: ${pdfWidth}; margin: 0 auto; padding: 20px; background: #ffffff; box-sizing: border-box;` :
            (format === 'doc' ? 'width: 100%; margin: 0; padding: 0; background: #ffffff;' : 'max-width: 800px; margin: 40px auto; padding: 40px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 16px;');

        let html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${t('reportTitle')}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        * { box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            ${bodyStyle}
            text-align: center; /* Центрирование всего текста */
        }
        
        /* Table Styles for DOC compatibility */
        table { border-collapse: collapse; width: 100%; margin: 0 auto; }
        td, th { padding: 10px; vertical-align: top; text-align: center; }

        .header {
            background: linear-gradient(135deg, #050510 0%, #1a1a3a 100%);
            color: white;
            padding: 25px 20px;
            border-radius: 20px;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .section {
            background: #fff;
            padding: 40px;
            margin-bottom: 25px;
            margin-left: auto; 
            margin-right: auto; 
            border-radius: 16px;
            width: 96%;
            max-width: 800px; 
            page-break-inside: avoid;
            text-align: center; 
        }
        .section p {
            text-align: justify;
            text-indent: 1.5em;
            margin-top: 10px;
        }

        /* Beautiful Summary Section */
        .summary-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
            border: 1px solid #bae6fd;
            border-top: 4px solid #0ea5e9;
            padding: 40px;
            margin-bottom: 30px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.08);
            page-break-inside: avoid;
            text-align: center;
        }
        .summary-section h2 {
            color: #0369a1;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 24px;
            border-bottom: 2px solid #e0f2fe;
            padding-bottom: 8px;
            display: inline-block;
        }
        .summary-section p {
            color: #334155;
            font-size: 15px;
            line-height: 1.8;
            text-align: justify;
            text-indent: 1.5em;
            margin: 0;
        }

        .stat-card-doc {
            background: #f8fafc;
            padding: 15px;
            text-align: center;
            border-radius: 12px;
            page-break-inside: avoid;
            margin: 0 auto;
        }

        /* Original CSS for HTML/PDF */
        .stats-container { 
            display: flex; 
            gap: 15px; 
            margin-bottom: 20px; 
            page-break-inside: avoid; 
            justify-content: center; 
        }
        .stat-card { flex: 1; background: #f8fafc; padding: 15px; border-radius: 12px; text-align: center; max-width: 250px; margin: 0 auto; }
        
        .score-row { 
            margin-bottom: 15px; 
            padding: 10px; 
            background: #fcfdfe; 
            border-radius: 12px; 
            text-align: center;
        }
        .score-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            text-align: center;
            padding: 0 10px;
        }
        .score-bar { height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; width: 100%; margin: 0 auto; }
        .score-fill { height: 100%; border-radius: 6px; }

        /* AI Card */
        .ai-card {
            background: linear-gradient(to right, #f0f7ff, #ffffff);
            border: 1px solid #bae6fd;
            padding: 30px;
            border-radius: 20px;
            position: relative;
            page-break-inside: avoid;
            break-inside: avoid;
            text-align: center;
            margin: 0 auto;
        }
        .ai-badge {
            background: #0ea5e9;
            color: white;
            padding: 4px 12px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 800;
            display: inline-block; 
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .recommendation {
            padding: 30px;
            margin-bottom: 20px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-left: 6px solid #00c6fb; 
            border-radius: 12px;
            page-break-inside: avoid;
            break-inside: avoid;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }
        .recommendation h3 { color: #0369a1; margin: 0 0 5px 0; font-size: 16px; font-weight: 800; text-align: center; }
        .recommendation p { color: #475569; margin: 0; font-size: 14px; text-align: justify; text-indent: 1.5em; margin-top: 10px; }
    </style>
</head>
<body>
    <div id="print-wrapper" ${printWrapperStyle}>
    <div class="header">
        <h1>${t('reportTitle')}</h1>
        ${data.profile && data.profile.name ? `<p style="font-size: 18px; margin-bottom: 5px;">${data.profile.name}</p>` : ''}
        <p>${t('reportDate')}: ${date}</p>
    </div>

    <!-- Statistics Section -->
    ${data.statistics ? (format === 'doc' ? `
    <!-- DOC: Table Layout -->
    <table width="100%" cellpadding="0" cellspacing="15" style="margin-bottom: 30px;">
        <tr>
            <td width="33%">
                <div class="stat-card-doc">
                    <span style="font-size: 26px; font-weight: 800; color: #005bea; display: block;">${data.statistics.level || 1}</span>
                    <span style="font-size: 13px; color: #64748b; text-transform: uppercase;">${t('levelLabel')}</span>
                </div>
            </td>
            <td width="33%">
                <div class="stat-card-doc">
                    <span style="font-size: 26px; font-weight: 800; color: #005bea; display: block;">${data.statistics.xp || 0}</span>
                    <span style="font-size: 13px; color: #64748b; text-transform: uppercase;">XP</span>
                </div>
            </td>
            <td width="33%">
                <div class="stat-card-doc">
                    <span style="font-size: 26px; font-weight: 800; color: #005bea; display: block;">${data.statistics.streak || 0}</span>
                    <span style="font-size: 13px; color: #64748b; text-transform: uppercase;">${t('streakLabel')}</span>
                </div>
            </td>
        </tr>
    </table>
    ` : `
    <!-- HTML/PDF: Flex Layout -->
    <div class="stats-container">
        <div class="stat-card">
            <span style="font-size: 26px; font-weight: 800; color: #005bea; display: block;">${data.statistics.level || 1}</span>
            <span style="font-size: 13px; color: #64748b; text-transform: uppercase;">${t('levelLabel')}</span>
        </div>
        <div class="stat-card">
            <span style="font-size: 26px; font-weight: 800; color: #005bea; display: block;">${data.statistics.xp || 0}</span>
            <span style="font-size: 13px; color: #64748b; text-transform: uppercase;">XP</span>
        </div>
        <div class="stat-card">
            <span style="font-size: 26px; font-weight: 800; color: #005bea; display: block;">${data.statistics.streak || 0}</span>
            <span style="font-size: 13px; color: #64748b; text-transform: uppercase;">${t('streakLabel')}</span>
        </div>
    </div>
    `) : ''}

    <div class="summary-section">
        <h2>${t('summaryLabel')}</h2>
        <p>${data.profile ? data.profile.summary : ''}</p>
    </div>

    ${data.scores ? `
    <div class="section">
        <h2>${t('dimensionScores')}</h2>
        ${Object.keys(data.scores).map(dim => {
            const score = data.scores[dim];
            const normalizedScore = (score + 100) / 2;
            const dimName = t(`${dim}Name`) || dim;
            const color = score > 30 ? '#2ecc71' : (score < -30 ? '#e74c3c' : '#3498db');

            return format === 'doc' ? `
            <!-- DOC: Table Row for Scores -->
            <table width="100%" style="margin-bottom: 20px; background: #fcfdfe; border: 1px solid #f1f5f9; border-radius: 12px;">
                <tr>
                    <td width="40%" style="vertical-align: middle; padding: 15px;">
                        <span style="font-weight: 800; font-size: 18px; color: #1e293b;">${dimName}</span>
                    </td>
                    <td width="60%" style="vertical-align: middle; padding: 15px;">
                        <div style="height: 12px; background: #f1f5f9; border-radius: 6px; width: 100%;">
                            <div style="width: ${normalizedScore}%; height: 100%; background-color: ${color}; border-radius: 6px;"></div> 
                        </div>
                        <div style="text-align: right; font-weight: 700; font-size: 14px; margin-top: 5px;">${score > 0 ? '+' : ''}${score}%</div>
                    </td>
                </tr>
            </table>
            ` : `
            <!-- HTML/PDF: Div Layout -->
            <div class="score-row">
                <div class="score-info">
                    <span style="font-weight: 800; font-size: 18px; color: #1e293b;">${dimName}</span>
                    <span style="font-weight: 700; font-size: 16px; color: ${color}">${score > 0 ? '+' : ''}${score}%</span>
                </div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${normalizedScore}%; background-color: ${color};"></div>
                </div>
            </div>
            `;
        }).join('')}
    </div>
    ` : ''}

    ${data.aiAnalysis && data.aiAnalysis.personalityType ? `
    <div class="section">
        <div class="ai-card">
            <span class="ai-badge">AI ANALYTICS</span>
            <h2 style="border:none; margin-bottom:10px;">${t('personalityType')}</h2>
            <h3 style="color:#005bea; font-size:22px; margin-top:0;">${data.aiAnalysis.personalityType.name}</h3>
            <p style="color:#4a5568; margin-top:10px; line-height:1.7;">${data.aiAnalysis.personalityType.description}</p>
        </div>
    </div>
    ` : ''}

    ${data.profile && data.profile.recommendations ? `
    <div class="section">
        <h2>${t('recommendationsLabel')}</h2>
        ${data.profile.recommendations.map(rec => `
        <div class="recommendation">
            <h3>${rec.category || rec.title}</h3>
            <p>${rec.description || ''}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="footer" style="padding-bottom: 20px; margin-top: 30px; clear: both;">
        <p style="margin-bottom: 15px; font-weight: 700; color: #1e293b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
            ${t('generatedBy') || 'Generated by Self-Knowledge System'} &bull; Neural Constellation Engine
        </p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 2px solid #e2e8f0; display: block; max-width: 550px; margin: 0 auto; text-align: center;">
            <p style="font-weight: 800; color: #0f172a; font-size: 16px; margin: 0 0 5px 0;">
                ${lang === 'kk' ? 'Авторы: Ахмедьянов Саламат КПО 9/22-2' :
                lang === 'ru' ? 'Автор: Ахмедьянов Саламат КПО 9/22-2' :
                    'Author: Akhmedyanov Salamat KPO 9/22-2'}
            </p>
            <p style="margin: 0; font-size: 12px; color: #475569; font-weight: 600;">
                &copy; 2026 Diploma Project. All rights reserved.
            </p>
        </div>
    </div>
    </div>
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
        const htmlContent = this.generateHTMLReport(data, 'doc');
        return `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset="utf-8">
    <title>Report</title>
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
        if (typeof html2pdf === 'undefined') {
            console.error('html2pdf library is missing');
            alert('html2pdf кітапханасы жүктелген жоқ. Интернет байланысын тексеріңіз (html2pdf library not loaded. Please check your internet connection).');
            return Promise.reject('html2pdf not found');
        }

        const fullHtml = this.generateHTMLReport(data, 'pdf');

        const opt = {
            margin: [10, 10, 24.5, 10], // Margins (Top, Right, Bottom, Left)
            filename: this.currentFilename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 4, // Higher quality
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: false,
                windowWidth: 1300, // A4 width at 96 DPI
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        try {
            await html2pdf().from(fullHtml).set(opt).save();
            return Promise.resolve();
        } catch (error) {
            console.error('Ошибка при генерации PDF (ReportGenerator):', error);
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
        if (!filename) {
            const date = new Date().toISOString().split('T')[0];
            const lang = window.i18n ? window.i18n.getLanguage() : 'ru';
            filename = `personality-report-${date}_${lang}.${format === 'json' ? 'json' : format === 'text' ? 'txt' : 'html'}`;
        }

        if (format === 'pdf' && !filename.endsWith('.pdf')) filename += '.pdf';
        if (format === 'html' && !filename.endsWith('.html')) filename += '.html';
        if (format === 'doc' && !filename.endsWith('.doc')) filename += '.doc';

        this.currentFilename = filename;

        if (format === 'pdf') {
            this.generatePDFReport(data).catch(err => {
                console.error('PDF Generation failed', err);
                alert('PDF жасау мүмкін болмады. Қайталап көріңіз (Failed to create PDF. Please try again).');
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
}

if (typeof window !== 'undefined') {
    window.ReportGenerator = ReportGenerator;
    console.log('Есеп генераторы инициализацияланды (ReportGenerator initialized)');
}
