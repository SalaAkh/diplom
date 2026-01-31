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
     * @returns {string} HTML строка
     */
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

        let html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t('reportTitle')}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        * { box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            ${format === 'pdf' || format === 'doc' ? 'width: 100%; margin: 0; padding: 0;' : 'max-width: 800px; margin: 0 auto; padding: 20px;'}
            background: #ffffff;
        }
        
        .header {
            background: linear-gradient(135deg, #050510 0%, #1a1a3a 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 20px;
            margin-bottom: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header h1 { 
            margin: 0 0 15px 0; 
            font-size: 28px; 
            text-transform: uppercase; 
            letter-spacing: 2px;
            color: #00c6fb;
            font-weight: 800;
        }
        
        .header p { margin: 8px 0; opacity: 0.9; font-size: 16px; }
        
        .section {
            background: #fff;
            padding: 30px;
            margin-bottom: 40px;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            page-break-inside: avoid;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            position: relative;
            overflow: hidden;
        }
        
        .section h2 { 
            color: #1e293b; 
            margin-top: 0; 
            border-bottom: 4px solid #00c6fb; 
            padding-bottom: 12px; 
            font-size: 24px;
            display: inline-block;
            margin-bottom: 25px;
            font-weight: 800;
        }

        .clear { clear: both; }

        @media print {
            .section { page-break-inside: avoid; margin-bottom: 30px; }
            .header { page-break-after: avoid; }
        }
        
        /* Stats Grid */
        ${format === 'doc' ? `
        .stats-container {
            display: table;
            width: 100%;
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 15px 0;
            margin-bottom: 30px;
        }
        .stat-card {
            display: table-cell;
            width: 33%;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }
        ` : `
        .stats-container {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .stat-card {
            flex: 1;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        `}
        
        .stat-value { font-size: 26px; font-weight: 800; color: #005bea; display: block; margin-bottom: 5px; }
        .stat-label { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        
        /* Scores Styles */
        ${format === 'doc' ? `
        .score-row {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 25px;
            padding: 15px;
            background: #fcfdfe;
            border-radius: 12px;
            border: 1px solid #f1f5f9;
        }
        .score-info {
            display: table-cell;
            width: 40%;
            vertical-align: middle;
            padding-right: 15px;
        }
        .score-bar {
            display: table-cell;
            width: 60%;
            vertical-align: middle;
        }
        ` : `
        .score-row {
            margin-bottom: 25px;
            padding: 15px;
            background: #fcfdfe;
            border-radius: 12px;
            border: 1px solid #f1f5f9;
        }
        .score-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .score-bar {
            height: 12px;
            background: #f1f5f9;
            border-radius: 6px;
            overflow: hidden;
            width: 100%;
        }
        `}
        
        .score-label {
            font-weight: 800;
            font-size: 18px;
            color: #1e293b;
        }
        .score-value {
            font-weight: 700;
            font-size: 16px;
        }
        
        ${format === 'doc' ? `
        .score-fill-container {
             height: 12px;
            background: #f1f5f9;
            border-radius: 6px;
            overflow: hidden;
            width: 100%;
        }
        ` : ''}
        
        .score-fill { height: 12px; border-radius: 6px; display: block; }

        /* AI Analysis Card */
        .ai-card {
            background: linear-gradient(to right, #f0f7ff, #ffffff);
            border: 1px solid #bae6fd;
            padding: 30px;
            border-radius: 20px;
            position: relative;
        }
        .ai-badge {
            background: #0ea5e9;
            color: white;
            padding: 6px 16px;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 800;
            float: right;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .recommendation {
            padding: 20px;
            margin-bottom: 20px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-left: 6px solid #00c6fb;
            border-radius: 12px;
        }
        .recommendation h3 { color: #0369a1; margin: 0 0 10px 0; font-size: 18px; font-weight: 800; }
        .recommendation p { color: #475569; margin: 0; }
        
        .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 60px;
            padding: 40px 0;
            border-top: 2px solid #f1f5f9;
        }
        .chart-img {
            display: block;
            max-width: 550px;
            width: 100%;
            margin: 30px auto;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 16px;
            background: white;
        }
        .clear { clear: both; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div id="print-wrapper" style="${format === 'pdf' || format === 'doc' ? '' : 'padding: 20px;'}">
    <div class="header">
        <h1>${t('reportTitle')}</h1>
        <p>${t('userLabel') || (lang === 'kk' ? 'Пайдаланушы' : lang === 'ru' ? 'Пользователь' : 'User')}: <strong>${data.userLogin || (lang === 'kk' ? 'Қонақ' : lang === 'ru' ? 'Гость' : 'Guest')}</strong></p>
        <p>${t('reportDate')}: ${date}</p>
    </div>

    <!-- Statistics Section -->
    ${data.statistics ? `
    <div class="stats-container">
        <div class="stat-card">
            <span class="stat-value">${data.statistics.level || 1}</span>
            <span class="stat-label">${t('levelLabel') || 'Level'}</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${data.statistics.xp || 0}</span>
            <span class="stat-label">XP</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${data.statistics.streak || 0}</span>
            <span class="stat-label">${t('streakLabel') || 'Streak'}</span>
        </div>
        <div class="clear"></div>
    </div>
    ` : ''}

    <div class="section">
        <h2>${t('summaryLabel')}</h2>
        <p style="font-size: 16px; color: #4a5568;">${data.profile ? data.profile.summary : ''}</p>
    </div>
`;

        if (data.scores) {
            html += `
    <div class="section">
        <h2>${t('dimensionScores')}</h2>
`;

            if (data.chartImage) {
                html += `
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="${data.chartImage}" class="chart-img" alt="Radar Chart">
            <p style="font-size: 12px; color: #999;">${t('radarChartDescription') || 'Personality Profile Visualization'}</p>
        </div>
`;
            }

            Object.keys(data.scores).forEach(dim => {
                const score = data.scores[dim];
                const normalizedScore = (score + 100) / 2;
                const dimName = t(`${dim}Name`) || dim;

                let level = '';
                if (score > 50) level = t('levelHigh');
                else if (score > 20) level = t('levelMedium');
                else if (score < -50) level = t('levelLow') || (lang === 'ru' ? 'Низкая выраженность' : 'Low');
                else if (score < -20) level = t('levelVeryLow') || (lang === 'ru' ? 'Умеренно низкая' : 'Very Low');
                else level = t('levelBalanced');

                let color = '#3498db';
                if (score > 30) color = '#2ecc71';
                else if (score < -30) color = '#e74c3c';

                html += `
        <div class="score-row">
            <div class="score-info">
                <span class="score-label">${dimName}</span>
                <span class="score-value" style="color: ${color}">${level} (${score > 0 ? '+' : ''}${score}%)</span>
            </div>
            <div class="score-bar">
                ${format === 'doc' ? `<div class="score-fill-container"><div class="score-fill" style="width: ${normalizedScore}%; background-color: ${color};"></div></div>` :
                        `<div class="score-fill" style="width: ${normalizedScore}%; background-color: ${color};"></div>`
                    }
            </div>
        </div>
`;
            });
            html += `</div>`;
        }

        if (data.aiAnalysis && data.aiAnalysis.personalityType) {
            html += `
    <div class="section">
        <div class="ai-card">
            <span class="ai-badge">AI ANALYTICS</span>
            <h2 style="border:none; margin-bottom:10px;">${t('personalityType')}</h2>
            <h3 style="color:#005bea; font-size:22px; margin-top:0;">${data.aiAnalysis.personalityType.name}</h3>
            <p style="color:#4a5568; margin-top:10px; line-height:1.7;">${data.aiAnalysis.personalityType.description}</p>
        </div>
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
    <div class="footer" style="padding-bottom: 50px; margin-top: 60px; clear: both;">
        <p style="margin-bottom: 20px; font-weight: 700; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            ${t('generatedBy') || 'Generated by Self-Knowledge System'} &bull; Neural Constellation Engine
        </p>
        <div style="background: #f8fafc; padding: 30px; border-radius: 16px; border: 2px solid #e2e8f0; display: block; max-width: 550px; margin: 0 auto; text-align: center;">
            <p style="font-weight: 800; color: #0f172a; font-size: 18px; margin: 0 0 10px 0;">
                ${lang === 'kk' ? 'Авторы: Ахмедьянов Саламат КПО 9/22-2' :
                lang === 'ru' ? 'Автор: Ахмедьянов Саламат КПО 9/22-2' :
                    'Author: Akhmedyanov Salamat KPO 9/22-2'}
            </p>
            <p style="margin: 0; font-size: 14px; color: #475569; font-weight: 600;">
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
            alert('Библиотека html2pdf не загружена. Пожалуйста, проверьте подключение к интернету.');
            return Promise.reject('html2pdf not found');
        }

        const fullHtml = this.generateHTMLReport(data, 'pdf');

        const opt = {
            margin: [10, 10, 10, 10], // Reduced margin to 10mm to prevent cutoff
            filename: this.currentFilename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: false,
                windowWidth: 800,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
    console.log('ReportGenerator initialized');
}
