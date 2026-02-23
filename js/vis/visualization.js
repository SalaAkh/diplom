/**
 * Талдау нәтижелерін визуализациялау модулі (Analysis results visualization module)
 * ГРАФИКТЕР мен диаграммаларды жасау үшін Chart.js қолданылады (Uses Chart.js to create charts and diagrams)
 * 
 * Авторы (Author): Ахмедьянов Саламат КПО 9/22-2
 * Мерзімі (Date): 2026
 */

class ResultsVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.charts = {};
        this.visualization3D = typeof Visualization3D !== 'undefined' ? new Visualization3D('3dChartContainer') : null;
        this.use3D = false;

        // Проверяем наличие Chart.js
        if (typeof Chart === 'undefined') {
            console.error('Chart.js жүктелген жоқ! Визуализация қолжетімсіз болады (Chart.js not loaded! Visualization will be unavailable).');
            this.chartAvailable = false;
        } else {
            this.chartAvailable = true;
        }
    }

    /**
     * Проверка доступности Chart.js
     * @returns {boolean} true если Chart.js доступен
     */
    isChartAvailable() {
        return this.chartAvailable && typeof Chart !== 'undefined';
    }

    /**
     * Показ fallback UI при отсутствии Chart.js
     * @param {string} containerId - ID контейнера
     * @param {string} message - Сообщение об ошибке
     */
    showFallbackUI(containerId, message = 'График қолжетімсіз (Chart unavailable)') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="chart-fallback">
                <p class="fallback-message">${message}</p>
                <p class="fallback-hint">Бетті қайта жүктеп көріңіз (Try reloading the page)</p>
            </div>
        `;
    }

    /**
     * Создание радиальной диаграммы профиля
     * @param {Object} scores - Оценки по измерениям (процентные значения от -100 до +100)
     * @param {Object} dimensions - Описания измерений
     */
    /**
     * Создание радиальной диаграммы профиля
     * @param {Object} scores - Оценки по измерениям (процентные значения от -100 до +100)
     * @param {Object} dimensions - Описания измерений
     */
    createRadarChart(scores, dimensions) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                this.showFallbackUI(this.containerId, 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                return;
            }

            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error('Контейнер табылмады (Container not found):', this.containerId);
                return;
            }

            // Очистка предыдущего графика
            const existingChart = document.getElementById('radarChart');
            if (existingChart) {
                existingChart.remove();
            }

            // Очистка контейнера
            container.innerHTML = '<canvas id="radarChart"></canvas>';

            const canvas = document.getElementById('radarChart');
            if (!canvas) {
                console.error('Canvas элементі жасалмады (Canvas element not created)');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas контексті қолжетімсіз (Canvas context not available)');
                this.showFallbackUI(this.containerId, 'Графикті инициализациялау мүмкін болмады (Failed to initialize chart)');
                return;
            }

            // Создание градиента для фона
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(0, 198, 251, 0.5)'); // Cyan
            gradient.addColorStop(1, 'rgba(0, 91, 234, 0.2)');  // Blue

            // Определяем текущий язык
            let currentLang = 'ru';
            if (typeof localStorage !== 'undefined') {
                const savedLang = localStorage.getItem('preferredLanguage');
                if (savedLang && ['kk', 'ru', 'en'].includes(savedLang)) {
                    currentLang = savedLang;
                }
            }

            // Подготовка данных с локализованными метками
            const labels = Object.keys(dimensions).map(key => {
                const nameObj = dimensions[key].name;
                if (typeof nameObj === 'object') {
                    return nameObj[currentLang] || nameObj['ru'] || nameObj['en'] || key;
                }
                return nameObj;
            });

            if (canvas) {
                canvas.setAttribute('role', 'img');
                const dimensionKeys = Object.keys(dimensions);
                const valuesWithLabels = labels.map((label, idx) => {
                    const score = scores[dimensionKeys[idx]] || 0;
                    return `${label}: ${Math.round(score)}%`;
                }).join(', ');

                const ariaLabel = window.t ?
                    `${window.t('yourProfile')} (Radar Chart). ${valuesWithLabels}` :
                    `Сіздің профиліңіз (Радиалды диаграмма). (Your profile (Radar chart)). ${valuesWithLabels}`;
                canvas.setAttribute('aria-label', ariaLabel);
            }

            const dimensionKeys = Object.keys(dimensions);

            // Преобразуем процентные значения [-100, 100] в [0, 100] для визуализации
            // где 50 = нейтральное значение (0%)
            const values = dimensionKeys.map(key => {
                const score = scores[key] || 0; // score уже в процентах [-100, 100]
                // Преобразуем: -100% -> 0, 0% -> 50, +100% -> 100
                return 50 + (score / 2);
            });

            // Определяем текущую тему для адаптации цветов графика
            const isDarkTheme = document.body.classList.contains('dark-theme');
            const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const labelColor = isDarkTheme ? '#e1e8ed' : '#2c3e50';
            const tooltipBg = isDarkTheme ? 'rgba(20, 20, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)';
            const tooltipText = isDarkTheme ? '#ffffff' : '#2c3e50';

            // Уничтожение предыдущего графика, если существует
            if (this.charts.radar) {
                this.charts.radar.destroy();
            }

            this.charts.radar = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: window.t ? window.t('yourProfile') : 'Сіздің профиліңіз (Your profile)',
                        data: values,
                        backgroundColor: gradient,
                        borderColor: '#00c6fb',
                        borderWidth: 3,
                        pointBackgroundColor: '#050510',
                        pointBorderColor: '#00c6fb',
                        pointHoverBackgroundColor: '#00c6fb',
                        pointHoverBorderColor: '#ffffff',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointHoverBorderWidth: 3,
                        tension: 0 // Делаем линии прямыми (грубая форма)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 20
                    },
                    scales: {
                        r: {
                            beginAtZero: false,
                            min: 0,
                            max: 100,
                            ticks: {
                                stepSize: 25,
                                display: false, // Скрываем цифры осей, они загромождают
                                backdropColor: 'transparent'
                            },
                            grid: {
                                color: gridColor,
                                circular: true, // Круглая сетка выглядит лучше
                                lineWidth: 1
                            },
                            angleLines: {
                                color: gridColor,
                                lineWidth: 1
                            },
                            pointLabels: {
                                font: {
                                    size: 14,
                                    family: "'Space Grotesk', sans-serif",
                                    weight: '600'
                                },
                                color: labelColor,
                                padding: 20
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Скрываем легенду, так как у нас один датасет и заголовок выше
                        },
                        tooltip: {
                            backgroundColor: tooltipBg,
                            padding: 15,
                            titleColor: tooltipText,
                            bodyColor: tooltipText,
                            titleFont: {
                                size: 14,
                                family: "'Space Grotesk', sans-serif",
                                weight: '600'
                            },
                            bodyFont: {
                                size: 13,
                                family: "'Inter', sans-serif"
                            },
                            borderColor: 'rgba(0, 198, 251, 0.5)',
                            borderWidth: 1,
                            cornerRadius: 12,
                            displayColors: false,
                            callbacks: {
                                title: function (context) {
                                    return context[0].label;
                                },
                                label: function (context) {
                                    const value = context.parsed.r;
                                    const percentage = Math.round((value - 50) * 2);

                                    let level = '';
                                    if (percentage > 50) level = window.t ? window.t('levelHigh') : 'Жоғары айқындылық (High expression)';
                                    else if (percentage > 20) level = window.t ? window.t('levelMedium') : 'Орташа айқындылық (Medium expression)';
                                    else if (percentage < -50) level = window.t ? window.t('levelLow') : 'Төмен айқындылық (Low expression)';
                                    else if (percentage < -20) level = window.t ? window.t('levelVeryLow') : 'Орташа төмен айқындылық (Moderately low expression)';
                                    else level = window.t ? window.t('levelBalanced') : 'Теңгерілген (Balanced)';

                                    return [
                                        `Мәні (Value): ${percentage > 0 ? '+' : ''}${percentage}%`,
                                        level
                                    ];
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        } catch (error) {
            console.error('Радаралық диаграмманы жасау қатесі (Error creating radar chart):', error);
            this.showFallbackUI(this.containerId, 'График жасау қатесі. Бетті жаңартып көріңіз (Error creating chart. Try reloading the page).');
        }
    }

    /**
     * Создание столбчатой диаграммы
     * @param {Object} scores - Оценки по измерениям
     * @param {Object} dimensions - Описания измерений
     */
    createBarChart(scores, dimensions) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                this.showFallbackUI('barChartContainer', 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                return;
            }

            const container = document.getElementById('barChartContainer');
            if (!container) {
                console.error('barChartContainer контейнері табылмады (Container barChartContainer not found)');
                return;
            }

            // Очистка предыдущего графика
            const existingChart = document.getElementById('barChart');
            if (existingChart) {
                existingChart.remove();
            }

            const canvas = document.createElement('canvas');
            canvas.id = 'barChart';
            container.appendChild(canvas);
            canvas.setAttribute('role', 'img');

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas контексті қолжетімсіз (Canvas context not available)');
                this.showFallbackUI('barChartContainer', 'Графикті инициализациялау мүмкін болмады (Failed to initialize chart)');
                return;
            }

            // Подготовка данных
            const labels = Object.keys(dimensions).map(key => dimensions[key].name);
            const values = Object.keys(dimensions).map(key => {
                const score = scores[key] || 0;
                // scores уже в процентах (-100 до +100) из getPercentageScores()
                // Если значение > 1 или < -1, предполагаем что это уже проценты
                return Math.abs(score) > 1 ? Math.round(score) : Math.round(score * 100);
            });

            // Improved ARIA label
            const barDescription = labels.map((label, idx) => `${label}: ${values[idx]}%`).join(', ');
            canvas.setAttribute('aria-label', `Тест нәтижелерінің бағандық диаграммасы (Bar chart of test results). Деректер (Data): ${barDescription}`);

            // Цвета в зависимости от значения
            const backgroundColors = values.map(value => {
                if (value > 30) return 'rgba(75, 192, 192, 0.6)';
                if (value < -30) return 'rgba(255, 99, 132, 0.6)';
                return 'rgba(201, 203, 207, 0.6)';
            });

            const borderColors = values.map(value => {
                if (value > 30) return 'rgba(75, 192, 192, 1)';
                if (value < -30) return 'rgba(255, 99, 132, 1)';
                return 'rgba(201, 203, 207, 1)';
            });

            // Уничтожение предыдущего графика
            if (this.charts.bar) {
                this.charts.bar.destroy();
            }

            this.charts.bar = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Бағалау (%) (Score (%))',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: -100,
                            max: 100,
                            ticks: {
                                callback: function (value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                color: function (context) {
                                    if (context.tick.value === 0) {
                                        return 'rgba(0, 0, 0, 0.3)';
                                    }
                                    return 'rgba(0, 0, 0, 0.1)';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `Оценка: ${context.parsed.y}%`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Бағандық диаграмманы жасау қатесі (Error creating bar chart):', error);
            this.showFallbackUI('barChartContainer', 'График жасау қатесі (Error creating chart)');
        }
    }

    /**
     * Создание круговой диаграммы для одного измерения
     * @param {string} dimension - Ключ измерения
     * @param {number} score - Оценка
     * @param {string} containerId - ID контейнера
     */
    createPolarAreaChart(dimension, score, containerId) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                this.showFallbackUI(containerId, 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                return;
            }

            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Контейнер табылмады (Container not found):', containerId);
                return;
            }

            const existingChart = document.getElementById(`polarChart_${dimension}`);
            if (existingChart) {
                existingChart.remove();
            }

            const canvas = document.createElement('canvas');
            canvas.id = `polarChart_${dimension}`;
            container.appendChild(canvas);
            canvas.setAttribute('role', 'img');
            canvas.setAttribute('aria-label', `Диаграмма для измерения ${dimension}: ${Math.round(score * 100)}%`);
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('Canvas контексті қолжетімсіз (Canvas context not available)');
                this.showFallbackUI(containerId, 'Графикті инициализациялау мүмкін болмады (Failed to initialize chart)');
                return;
            }

            // Преобразуем оценку в проценты для визуализации
            const percentage = Math.abs(score * 100);
            const normalizedValue = (score + 1) * 50; // От 0 до 100

            // Уничтожение предыдущего графика
            if (this.charts[`polar_${dimension}`]) {
                this.charts[`polar_${dimension}`].destroy();
            }

            this.charts[`polar_${dimension}`] = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Ағымдағы мән (Current value)', 'Қалғаны (Rest)'],
                    datasets: [{
                        data: [normalizedValue, 100 - normalizedValue],
                        backgroundColor: [
                            score > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)',
                            'rgba(201, 203, 207, 0.3)'
                        ],
                        borderColor: [
                            score > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                            'rgba(201, 203, 207, 0.5)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    if (context.dataIndex === 0) {
                                        return `Оценка: ${Math.round(score * 100)}%`;
                                    }
                                    return '';
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Дөңгелек диаграмманы жасау қатесі (Error creating pie/polar chart):', error);
            this.showFallbackUI(containerId, 'График жасау қатесі (Error creating chart)');
        }
    }

    /**
     * Отображение текстового профиля с улучшенным дизайном
     * @param {Object} profile - Профиль пользователя
     */
    displayTextProfile(profile, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Функция для определения цвета по проценту
        const getScoreColor = (percentage) => {
            if (percentage > 50) return '#10b981'; // Зелёный
            if (percentage > 20) return '#3b82f6'; // Синий
            if (percentage > -20) return '#6b7280'; // Серый
            if (percentage > -50) return '#f59e0b'; // Оранжевый
            return '#ef4444'; // Красный
        };

        // Функция для получения иконки измерения
        const getDimensionIcon = (key) => {
            const icons = {
                'strategic': '🎯',
                'explorer': '🔍',
                'individualism': '👤',
                'rationality': '🧠'
            };
            return icons[key] || '📊';
        };

        // Функция для получения описания уровня
        const getLevelBadge = (level) => {
            const badges = {
                'высокая': { text: 'Жоғары (High)', class: 'badge-high' },
                'умеренная': { text: 'Орташа (Medium)', class: 'badge-medium' },
                'сбалансированная': { text: 'Баланс (Balance)', class: 'badge-balanced' },
                'умеренно низкая': { text: 'Төмен (Low)', class: 'badge-low' },
                'низкая': { text: 'Өте төмен (Very low)', class: 'badge-very-low' }
            };
            return badges[level] || { text: level, class: 'badge-default' };
        };

        let html = '<div class="profile-results">';

        // Заголовок с анимацией
        html += `
            <div class="results-header">
                <div class="results-icon">✨</div>
                <h2 class="results-title">Ваш личностный профиль</h2>
                <p class="results-subtitle">Результаты анализа по 4 ключевым измерениям</p>
            </div>
        `;

        // Общее резюме с улучшенным дизайном
        html += `
            <div class="profile-summary-card">
                <div class="summary-header">
                    <span class="summary-icon">📋</span>
                    <h3>Общий профиль</h3>
                </div>
                <p class="summary-text">${profile.summary}</p>
            </div>
        `;

        // Измерения в виде карточек с прогресс-барами
        html += '<div class="dimensions-grid">';
        Object.keys(profile.dimensions).forEach(key => {
            const dim = profile.dimensions[key];
            const scoreColor = getScoreColor(dim.percentage);
            const icon = getDimensionIcon(key);
            const badge = getLevelBadge(dim.level);

            // Рассчитываем позицию для прогресс-бара (от -100 до +100 -> от 0% до 100%)
            const progressPosition = 50 + (dim.percentage / 2);

            html += `
                <div class="dimension-card" style="--score-color: ${scoreColor}">
                    <div class="dimension-header">
                        <span class="dimension-icon">${icon}</span>
                        <h4 class="dimension-name">${dim.name}</h4>
                        <span class="dimension-badge ${badge.class}">${badge.text}</span>
                    </div>
                    
                    <div class="dimension-score-display">
                        <span class="score-number" style="color: ${scoreColor}">${dim.percentage > 0 ? '+' : ''}${dim.percentage}%</span>
                    </div>
                    
                    <div class="dimension-progress-wrapper">
                        <div class="dimension-progress-bar">
                            <div class="progress-center-line"></div>
                            <div class="progress-indicator" style="left: ${progressPosition}%; background-color: ${scoreColor}"></div>
                        </div>
                        <div class="progress-labels">
                            <span class="label-negative">-100%</span>
                            <span class="label-center">0%</span>
                            <span class="label-positive">+100%</span>
                        </div>
                    </div>
                    
                    <p class="dimension-description">${dim.description}</p>
                </div>
            `;
        });
        html += '</div>';

        // Рекомендации (если есть)
        if (profile.recommendations && profile.recommendations.length > 0) {
            const oldFormatRecs = profile.recommendations.filter(rec => rec.text && !rec.activities);
            if (oldFormatRecs.length > 0) {
                html += `
                    <div class="recommendations-card">
                        <div class="recommendations-header">
                            <span class="recommendations-icon">💡</span>
                            <h3>Рекомендации</h3>
                        </div>
                        <div class="recommendations-list">
                `;
                oldFormatRecs.forEach((rec, index) => {
                    html += `
                        <div class="recommendation-item" style="animation-delay: ${index * 0.1}s">
                            <span class="rec-number">${index + 1}</span>
                            <div class="rec-content">
                                <span class="rec-category">${rec.category}</span>
                                <p class="rec-text">${rec.text || rec.description}</p>
                            </div>
                        </div>
                    `;
                });
                html += '</div></div>';
            }
        }

        html += '</div>';
        container.innerHTML = html;

        // Speaking results if reading mode is active
        if (window.accessibilityService && window.accessibilityService.settings.reading) {
            try {
                let summaryToSpeak = "";
                if (window.t) {
                    summaryToSpeak = `${window.t('yourProfile')}. ${profile.summary}. `;
                    Object.keys(profile.dimensions).forEach(key => {
                        const dim = profile.dimensions[key];
                        summaryToSpeak += `${dim.name}: ${dim.percentage}%. `;
                    });
                } else {
                    summaryToSpeak = `Ваш личностный профиль. ${profile.summary}. `;
                    Object.keys(profile.dimensions).forEach(key => {
                        const dim = profile.dimensions[key];
                        summaryToSpeak += `${dim.name}: ${dim.percentage}%. `;
                    });
                }
                window.accessibilityService.speak(summaryToSpeak);
            } catch (e) {
                console.error("Профиль нәтижелерін дыбыстау қатесі (Error speaking profile results):", e);
            }
        }
    }

    /**
     * Создание диаграммы направлений развития
     * @param {Array} categories - Категории с matchScore
     * @param {string} containerId - ID контейнера
     */
    createDevelopmentDirectionsChart(categories, containerId) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                this.showFallbackUI(containerId, 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                return;
            }

            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Контейнер табылмады (Container not found):', containerId);
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.id = 'directionsChart';

            const existingChart = document.getElementById('directionsChart');
            if (existingChart) {
                existingChart.remove();
            }

            container.appendChild(canvas);
            canvas.setAttribute('role', 'img');
            canvas.setAttribute('aria-label', 'Даму бағыттарының диаграммасы (Development directions chart)');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas контексті қолжетімсіз (Canvas context not available)');
                this.showFallbackUI(containerId, 'Графикті инициализациялау мүмкін болмады (Failed to initialize chart)');
                return;
            }

            // Подготовка данных - только категории с matchScore > 0.1
            const filteredCategories = categories.filter(cat => cat.matchScore > 0.1);
            const labels = filteredCategories.map(cat => cat.name);
            const data = filteredCategories.map(cat => Math.round(cat.matchScore * 100));
            const colors = filteredCategories.map(cat => cat.color || '#4a90e2');

            // Уничтожение предыдущего графика
            if (this.charts.directions) {
                this.charts.directions.destroy();
            }

            this.charts.directions = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.map(c => c + '80'), // Добавляем прозрачность
                        borderColor: colors,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.label}: ${context.parsed}% соответствия`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Даму бағыттарының диаграммасын жасау қатесі (Error creating development directions chart):', error);
            this.showFallbackUI(containerId, 'График жасау қатесі (Error creating chart)');
        }
    }

    /**
     * Создание сравнительной диаграммы профиля
     * @param {Object} userScores - Оценки пользователя
     * @param {Object} dimensions - Описания измерений
     * @param {string} containerId - ID контейнера
     */
    createComparisonChart(userScores, dimensions, containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            const canvas = document.createElement('canvas');
            canvas.id = 'comparisonChart';

            const existingChart = document.getElementById('comparisonChart');
            if (existingChart) {
                existingChart.remove();
            }

            container.appendChild(canvas);
            canvas.setAttribute('role', 'img');

            const comparisonDesc = Object.keys(dimensions).map((key, idx) => {
                const score = userScores[key] || 0;
                return `${dimensions[key].name}: ${Math.round(score * 100)}%`;
            }).join(', ');

            canvas.setAttribute('aria-label', window.t ?
                `${window.t('comparison')} (Bar Chart). ${comparisonDesc}` :
                `Сравнение со средним профилем. ${comparisonDesc}`);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas контексті қолжетімсіз (Canvas context not available)');
                return;
            }

            // Подготовка данных
            const labels = Object.keys(dimensions).map(key => dimensions[key].name);
            const userValues = Object.keys(dimensions).map(key => {
                const score = userScores[key] || 0;
                return Math.round(score * 100);
            });

            // Средний профиль (все нули)
            const averageValues = new Array(labels.length).fill(0);

            // Уничтожение предыдущего графика
            if (this.charts.comparison) {
                this.charts.comparison.destroy();
            }

            this.charts.comparison = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Сіздің профиліңіз (Your profile)',
                            data: userValues,
                            backgroundColor: 'rgba(74, 144, 226, 0.6)',
                            borderColor: 'rgba(74, 144, 226, 1)',
                            borderWidth: 2
                        },
                        {
                            label: 'Орташа профиль (Average profile)',
                            data: averageValues,
                            backgroundColor: 'rgba(201, 203, 207, 0.6)',
                            borderColor: 'rgba(201, 203, 207, 1)',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: -100,
                            max: 100,
                            ticks: {
                                callback: function (value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                color: function (context) {
                                    if (context.tick.value === 0) {
                                        return 'rgba(0, 0, 0, 0.3)';
                                    }
                                    return 'rgba(0, 0, 0, 0.1)';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.parsed.y}%`;
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Салыстырмалы диаграмманы жасау қатесі (Error creating comparative chart):', error);
            this.showFallbackUI(containerId, 'График жасау қатесі (Error creating chart)');
        }
    }

    /**
     * Визуализация векторов развития
     * @param {Array} vectors - Векторы развития
     * @param {string} containerId - ID контейнера
     */
    createVectorChart(vectors, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Создаём HTML-визуализацию векторов
        let html = '<div class="vectors-container">';

        if (vectors.length === 0) {
            html += '<p>Сіздің профиліңіз үшін даму векторлары анықталмаған (Development vectors not defined for your profile).</p>';
        } else {
            vectors.forEach((vector, index) => {
                const strengthPercent = Math.round(vector.strength * 100);
                html += `
                    <div class="vector-item">
                        <div class="vector-header">
                            <h4>${vector.name}</h4>
                            <span class="vector-strength">${strengthPercent}%</span>
                        </div>
                        <p class="vector-description">${vector.description}</p>
                        <div class="vector-combination">
                            <small>Комбинация: ${vector.combination}</small>
                        </div>
                        <div class="vector-bar">
                            <div class="vector-bar-fill" style="width: ${strengthPercent}%"></div>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Отображение категоризированных рекомендаций
     * @param {Array} recommendations - Рекомендации по категориям
     * @param {string} containerId - ID контейнера
     */
    displayCategoryRecommendations(recommendations, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="category-recommendations">';

        recommendations.forEach(rec => {
            const matchPercent = Math.round(rec.matchScore * 100);
            html += `
                <div class="category-card">
                    <div class="category-header">
                        <h3>${rec.category}</h3>
                        <span class="match-badge">${matchPercent}% соответствия</span>
                    </div>
                    <p class="category-title">${rec.title}</p>
                    <p class="category-description">${rec.description}</p>
                    
                    <div class="category-activities">
                        <h4>Рекомендуемые направления:</h4>
                        <ul>
                            ${rec.activities.map(act => `<li>${act}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="category-skills">
                        <h4>Ключевые навыки:</h4>
                        <div class="skills-tags">
                            ${rec.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Отображение рекомендаций по навыкам
     * @param {Array} skills - Рекомендации по навыкам
     * @param {string} containerId - ID контейнера
     */
    displaySkillRecommendations(skills, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="skills-recommendations">';

        if (skills.length === 0) {
            html += '<p>Дағдылар бойынша ұсыныстар анықталмаған (Skill recommendations not defined).</p>';
        } else {
            // Группируем по категориям
            const byCategory = {};
            skills.forEach(skill => {
                if (!byCategory[skill.category]) {
                    byCategory[skill.category] = [];
                }
                byCategory[skill.category].push(skill);
            });

            Object.keys(byCategory).forEach(category => {
                html += `<div class="skills-category"><h4>${category}</h4><div class="skills-list">`;
                byCategory[category].forEach(skill => {
                    const priorityPercent = Math.round(skill.priority * 100);
                    html += `
                        <div class="skill-item">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-priority">Приоритет: ${priorityPercent}%</span>
                        </div>
                    `;
                });
                html += '</div></div>';
            });
        }

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Очистка всех графиков
     */
    destroyAll() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key] && typeof this.charts[key].destroy === 'function') {
                this.charts[key].destroy();
            }
        });
        this.charts = {};
    }

    /**
     * Создание графика эволюции измерения во времени
     * @param {Array} sessions - Массив сессий
     * @param {string} dimension - Название измерения
     * @param {string} containerId - ID контейнера
     */
    createEvolutionChart(sessions, dimension, containerId) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                this.showFallbackUI(containerId, 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                return;
            }

            const container = document.getElementById(containerId);
            if (!container || !sessions || sessions.length < 2) {
                if (container) {
                    this.showFallbackUI(containerId, 'Недостаточно данных для графика эволюции');
                }
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.id = `evolutionChart_${dimension}`;
            container.innerHTML = '';
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('Canvas context not available');
                this.showFallbackUI(containerId, 'Не удалось инициализировать график');
                return;
            }
            const labels = sessions.map((s, i) => `Сессия ${i + 1}`);
            const data = sessions.map(s => {
                const score = s.normalizedScores?.[dimension] || 0;
                return Math.round((score + 1) * 50); // [-1, 1] мәнін [0, 100] ауқымына ауыстырамыз (Convert [-1, 1] to [0, 100])
            });

            // Уничтожение предыдущего графика
            if (this.charts[`evolution_${dimension}`]) {
                this.charts[`evolution_${dimension}`].destroy();
            }

            this.charts[`evolution_${dimension}`] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: dimension,
                        data: data,
                        borderColor: this.getColorForDimension(dimension),
                        backgroundColor: this.getColorForDimension(dimension, 0.1),
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: this.getColorForDimension(dimension),
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed.y;
                                    return `${dimension}: ${value}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 0,
                            max: 100,
                            ticks: {
                                callback: (value) => `${value}%`
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    animation: {
                        duration: 1000
                    }
                }
            });
        } catch (error) {
            console.error('Эволюция графигін жасау қатесі (Error creating evolution chart):', error);
            this.showFallbackUI(containerId, 'График жасау қатесі (Error creating chart)');
        }
    }

    /**
     * Создание графика сравнения двух сессий
     * @param {Object} session1 - Первая сессия
     * @param {Object} session2 - Вторая сессия
     * @param {string} containerId - ID контейнера
     */
    createSessionComparisonChart(session1, session2, containerId) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                this.showFallbackUI(containerId, 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                return;
            }

            const container = document.getElementById(containerId);
            if (!container || !session1.normalizedScores || !session2.normalizedScores) {
                if (container) {
                    this.showFallbackUI(containerId, 'Сессияларды салыстыру үшін деректер жеткіліксіз (Insufficient data to compare sessions)');
                }
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.id = 'sessionComparisonChart';
            container.innerHTML = '';
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.error('Canvas context not available');
                this.showFallbackUI(containerId, 'Графикті инициализациялау мүмкін болмады (Failed to initialize chart)');
                return;
            }
            const dimensions = Object.keys(session1.normalizedScores);
            const labels = dimensions.map(d => this.getDimensionLabel(d));

            const data1 = dimensions.map(d => Math.round((session1.normalizedScores[d] + 1) * 50));
            const data2 = dimensions.map(d => Math.round((session2.normalizedScores[d] + 1) * 50));

            // Уничтожение предыдущего графика
            if (this.charts['sessionComparison']) {
                this.charts['sessionComparison'].destroy();
            }

            this.charts['sessionComparison'] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '1-сессия (Session 1)',
                            data: data1,
                            backgroundColor: 'rgba(74, 144, 226, 0.7)',
                            borderColor: '#4a90e2',
                            borderWidth: 2
                        },
                        {
                            label: '2-сессия (Session 2)',
                            data: data2,
                            backgroundColor: 'rgba(123, 104, 238, 0.7)',
                            borderColor: '#7b68ee',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `${context.dataset.label}: ${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 0,
                            max: 100,
                            ticks: {
                                callback: (value) => `${value}%`
                            }
                        }
                    },
                    animation: {
                        duration: 1000
                    }
                }
            });
        } catch (error) {
            console.error('Сессияларды салыстыру графигін жасау қатесі (Error creating session comparison chart):', error);
            this.showFallbackUI(containerId, 'График жасау қатесі (Error creating chart)');
        }
    }

    /**
     * Получение цвета для измерения
     * @param {string} dimension - Название измерения
     * @param {number} alpha - Прозрачность (0-1)
     * @returns {string} Цвет в формате rgba
     */
    getColorForDimension(dimension, alpha = 1) {
        const colors = {
            strategic: `rgba(74, 144, 226, ${alpha})`,
            explorer: `rgba(123, 104, 238, ${alpha})`,
            individualism: `rgba(80, 200, 120, ${alpha})`,
            rationality: `rgba(243, 156, 18, ${alpha})`,
            control: `rgba(231, 76, 60, ${alpha})`,
            meaning: `rgba(155, 89, 182, ${alpha})`
        };
        return colors[dimension] || `rgba(128, 128, 128, ${alpha})`;
    }

    /**
     * Получение метки измерения
     * @param {string} dimension - Название измерения
     * @returns {string} Метка
     */
    getDimensionLabel(dimension) {
        const labels = {
            strategic: 'Стратегиялық (Strategic)',
            explorer: 'Зерттеуші (Explorer)',
            individualism: 'Индивидуализм (Individualism)',
            rationality: 'Рационалдылық (Rationality)',
            control: 'Бақылау (Control)',
            meaning: 'Мағына іздеу (Search for meaning)'
        };
        return labels[dimension] || dimension;
    }

    /**
     * Отображение отчёта об эволюции
     * @param {Object} evolutionData - Данные об эволюции
     * @param {string} containerId - ID контейнера
     */
    displayEvolutionReport(evolutionData, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !evolutionData || !evolutionData.hasEvolution) {
            if (container) {
                container.innerHTML = '<p>Эволюцияны талдау үшін деректер жеткіліксіз. Тесттен қайта өтіңіз (Insufficient data for evolution analysis. Take the test again).</p>';
            }
            return;
        }

        let html = '<div class="evolution-report">';

        // Сводка
        if (evolutionData.evolutionSummary) {
            html += `
                <div class="evolution-summary">
                    <h3>Өзгерістер жиынтығы (Evolution Summary)</h3>
                    <div class="summary-stats">
                        <div class="stat-item">
                            <span class="stat-label">Барлық сессиялар (Total sessions):</span>
                            <span class="stat-value">${evolutionData.totalSessions}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Маңызды өзгерістер (Significant changes):</span>
                            <span class="stat-value">${evolutionData.evolutionSummary.totalChanges}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Жақсартулар (Improvements):</span>
                            <span class="stat-value positive">${evolutionData.evolutionSummary.improvements}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Тұрақтылық (Stability):</span>
                            <span class="stat-value">${Math.round(evolutionData.evolutionSummary.stability * 100)}%</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Инсайты
        if (evolutionData.insights && evolutionData.insights.length > 0) {
            html += '<div class="evolution-insights"><h3>Эволюция инсайттары (Evolution Insights)</h3><ul>';
            evolutionData.insights.forEach(insight => {
                html += `
                    <li class="insight-item insight-${insight.type}">
                        <strong>${insight.title}</strong>
                        <p>${insight.text}</p>
                    </li>
                `;
            });
            html += '</ul></div>';
        }

        // Рекомендации
        if (evolutionData.recommendations && evolutionData.recommendations.length > 0) {
            html += '<div class="evolution-recommendations"><h3>Ұсыныстар (Recommendations)</h3><ul>';
            evolutionData.recommendations.forEach(rec => {
                html += `
                    <li class="recommendation-item">
                        <strong>${rec.dimension}:</strong> ${rec.text}
                    </li>
                `;
            });
            html += '</ul></div>';
        }

        // Графики изменений по измерениям
        if (evolutionData.overallComparison && evolutionData.overallComparison.dimensions) {
            html += '<div class="evolution-charts"><h3>Өлшемдер бойынша өзгерістер (Changes by dimensions)</h3>';
            Object.keys(evolutionData.overallComparison.dimensions).forEach(dim => {
                const change = evolutionData.overallComparison.dimensions[dim];
                if (Math.abs(change.absChange) > 0.1) {
                    html += `
                        <div class="evolution-chart-item">
                            <h4>${this.getDimensionLabel(dim)}</h4>
                            <div class="evolution-chart-container" id="evolutionChart_${dim}"></div>
                        </div>
                    `;
                }
            });
            html += '</div>';
        }

        html += '</div>';
        container.innerHTML = html;

        // Создаём графики для каждого измерения с изменениями
        if (evolutionData.overallComparison && evolutionData.overallComparison.dimensions) {
            const sessions = evolutionData.comparisons ?
                [evolutionData.comparisons[0]?.comparison, evolutionData.overallComparison] :
                [];

            // Если есть история сессий, создаём графики
            setTimeout(() => {
                Object.keys(evolutionData.overallComparison.dimensions).forEach(dim => {
                    const change = evolutionData.overallComparison.dimensions[dim];
                    if (Math.abs(change.absChange) > 0.1) {
                        // Здесь можно добавить создание графиков, если есть данные сессий
                    }
                });
            }, 100);
        }
    }

    /**
     * Визуализация расширенных результатов для углубленного теста
     * @param {Object} advancedProfile - Расширенный профиль из AdvancedPersonalityAnalyzer
     * @param {Object} dimensions - Описания измерений
     * @param {string} containerId - ID контейнера для отображения
     */
    renderAdvancedResults(advancedProfile, dimensions, containerId = 'advanced-results') {
        if (!advancedProfile || !advancedProfile.advanced) {
            console.warn('Кеңейтілген профиль табылмады (Advanced profile not found)');
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`${containerId} контейнері табылмады (Container not found)`);
            return;
        }

        const advanced = advancedProfile.advanced;
        let html = '<div class="advanced-results-container">';

        // Статистика по типам вопросов
        if (advanced.questionTypes) {
            html += `
                <div class="advanced-section question-types-section">
                    <h3>Сұрақ түрлері бойынша статистика (Question Types Statistics)</h3>
                    <div class="question-types-grid">
                        <div class="question-type-stat">
                            <div class="stat-icon">📋</div>
                            <div class="stat-value">${advanced.questionTypes.scenarios || 0}</div>
                            <div class="stat-label">Сценарийлер (Scenarios)</div>
                        </div>
                        <div class="question-type-stat">
                            <div class="stat-icon">📊</div>
                            <div class="stat-value">${advanced.questionTypes.scales || 0}</div>
                            <div class="stat-label">Шкалалар (Scales)</div>
                        </div>
                        <div class="question-type-stat">
                            <div class="stat-icon">✍️</div>
                            <div class="stat-value">${advanced.questionTypes.open || 0}</div>
                            <div class="stat-label">Ашық (Open)</div>
                        </div>
                        <div class="question-type-stat">
                            <div class="stat-icon">🔄</div>
                            <div class="stat-value">${advanced.questionTypes.situational || 0}</div>
                            <div class="stat-label">Ситуациялық (Situational)</div>
                        </div>
                    </div>
                    <div class="total-questions">
                        <strong>Барлығы (Total questions): ${advanced.totalQuestions}</strong>
                    </div>
                </div>
            `;
        }

        // Уровни достоверности
        if (advanced.confidence) {
            html += `
                <div class="advanced-section confidence-section">
                    <h3>Нәтижелердің сенімділік деңгейі (Result Confidence Levels)</h3>
                    <div class="confidence-chart-container">
                        <canvas id="confidenceChart"></canvas>
                    </div>
                </div>
            `;
        }

        // Согласованность результатов
        if (advanced.consistency) {
            html += `
                <div class="advanced-section consistency-section">
                    <h3>Нәтижелердің сәйкестігі (Result Consistency)</h3>
                    <div class="consistency-chart-container">
                        <canvas id="consistencyChart"></canvas>
                    </div>
                </div>
            `;
        }

        // Детализированный анализ
        if (advanced.detailedAnalysis) {
            const analysis = advanced.detailedAnalysis;
            html += `
                <div class="advanced-section detailed-analysis-section">
                    <h3>Егжей-тегжейлі талдау (Detailed Analysis)</h3>
                    ${analysis.strengths && analysis.strengths.length > 0 ? `
                        <div class="analysis-group strengths">
                            <h4>Күшті жақтар (Strengths)</h4>
                            <ul>
                                ${analysis.strengths.map(s => `
                                    <li>
                                        <strong>${s.name}</strong>
                                        <span class="score-badge">${Math.round(s.score * 100)}%</span>
                                        <span class="confidence-badge">Сенімділік (Confidence): ${Math.round(s.confidence * 100)}%</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${analysis.weaknesses && analysis.weaknesses.length > 0 ? `
                        <div class="analysis-group weaknesses">
                            <h4>Даму аймақтары (Areas for Development)</h4>
                            <ul>
                                ${analysis.weaknesses.map(w => `
                                    <li>
                                        <strong>${w.name}</strong>
                                        <span class="score-badge">${Math.round(w.score * 100)}%</span>
                                        <span class="confidence-badge">Сенімділік (Confidence): ${Math.round(w.confidence * 100)}%</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${analysis.balanced && analysis.balanced.length > 0 ? `
                        <div class="analysis-group balanced">
                            <h4>Теңгерілген аймақтар (Balanced Areas)</h4>
                            <ul>
                                ${analysis.balanced.map(b => `
                                    <li>
                                        <strong>${b.name}</strong>
                                        <span class="score-badge">${Math.round(b.score * 100)}%</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${analysis.recommendations && analysis.recommendations.length > 0 ? `
                        <div class="analysis-recommendations">
                            <h4>Ұсыныстар (Recommendations)</h4>
                            <ul>
                                ${analysis.recommendations.map(r => `
                                    <li class="recommendation-item">
                                        <strong>${r.type === 'leverage' ? 'Қолданыңыз (Leverage)' : 'Дамытыңыз (Develop)'}:</strong>
                                        ${r.text}
                                        <div class="recommendation-dimensions">
                                            ${r.dimensions ? r.dimensions.join(', ') : ''}
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;

        // Создаём графики достоверности и согласованности
        setTimeout(() => {
            if (advanced.confidence) {
                this.createConfidenceChart(advanced.confidence, dimensions);
            }
            if (advanced.consistency) {
                this.createConsistencyChart(advanced.consistency, dimensions);
            }
        }, 100);
    }

    /**
     * Создание графика уровней достоверности
     * @param {Object} confidence - Объект с уровнями достоверности по измерениям
     * @param {Object} dimensions - Описания измерений
     */
    createConfidenceChart(confidence, dimensions) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                const container = canvas ? canvas.parentElement : document.getElementById('confidenceChart')?.parentElement;
                if (container) {
                    this.showFallbackUI(container.id || 'confidenceChartContainer', 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                }
                return;
            }

            const canvas = document.getElementById('confidenceChart');
            if (!canvas) {
                console.error('Canvas confidenceChart не найден');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas context not available');
                return;
            }

            const dimensionKeys = Object.keys(dimensions);
            const labels = dimensionKeys.map(key => {
                const dim = dimensions[key];
                return typeof dim.name === 'object' ? (dim.name.ru || dim.name.kk || dim.name.en) : dim.name;
            });
            const values = dimensionKeys.map(key => (confidence[key] || 0) * 100);

            if (this.charts.confidence) {
                this.charts.confidence.destroy();
            }

            this.charts.confidence = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Сенімділік (Confidence) (%)',
                        data: values,
                        backgroundColor: values.map(v => {
                            if (v >= 80) return 'rgba(50, 200, 120, 0.7)';
                            if (v >= 60) return 'rgba(243, 156, 18, 0.7)';
                            return 'rgba(231, 76, 60, 0.7)';
                        }),
                        borderColor: values.map(v => {
                            if (v >= 80) return 'rgba(50, 200, 120, 1)';
                            if (v >= 60) return 'rgba(243, 156, 18, 1)';
                            return 'rgba(231, 76, 60, 1)';
                        }),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function (value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return 'Сенімділік (Confidence): ' + context.parsed.y.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Сенімділік графигін жасау қатесі (Error creating confidence chart):', error);
            const container = document.getElementById('confidenceChart')?.parentElement;
            if (container) {
                this.showFallbackUI(container.id || 'confidenceChartContainer', 'График жасау қатесі (Error creating chart)');
            }
        }
    }

    /**
     * Создание графика согласованности
     * @param {Object} consistency - Объект с уровнями согласованности по измерениям
     * @param {Object} dimensions - Описания измерений
     */
    createConsistencyChart(consistency, dimensions) {
        try {
            // Проверка наличия Chart.js
            if (!this.isChartAvailable()) {
                const container = canvas ? canvas.parentElement : document.getElementById('consistencyChart')?.parentElement;
                if (container) {
                    this.showFallbackUI(container.id || 'consistencyChartContainer', 'Chart.js жүктелген жоқ. График қолжетімсіз (Chart.js not loaded. Chart unavailable).');
                }
                return;
            }

            const canvas = document.getElementById('consistencyChart');
            if (!canvas) {
                console.error('Canvas consistencyChart не найден');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas context not available');
                return;
            }

            const dimensionKeys = Object.keys(dimensions);
            const labels = dimensionKeys.map(key => {
                const dim = dimensions[key];
                return typeof dim.name === 'object' ? (dim.name.ru || dim.name.kk || dim.name.en) : dim.name;
            });
            const values = dimensionKeys.map(key => (consistency[key] || 0) * 100);

            if (this.charts.consistency) {
                this.charts.consistency.destroy();
            }

            this.charts.consistency = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Сәйкестік (Consistency) (%)',
                        data: values,
                        backgroundColor: values.map(v => {
                            if (v >= 0.8) return 'rgba(74, 144, 226, 0.7)';
                            if (v >= 0.6) return 'rgba(123, 104, 238, 0.7)';
                            return 'rgba(155, 89, 182, 0.7)';
                        }),
                        borderColor: values.map(v => {
                            if (v >= 0.8) return 'rgba(74, 144, 226, 1)';
                            if (v >= 0.6) return 'rgba(123, 104, 238, 1)';
                            return 'rgba(155, 89, 182, 1)';
                        }),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function (value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return 'Сәйкестік (Consistency): ' + context.parsed.y.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Сәйкестік графигін жасау қатесі (Error creating consistency chart):', error);
            const container = document.getElementById('consistencyChart')?.parentElement;
            if (container) {
                this.showFallbackUI(container.id || 'consistencyChartContainer', 'График жасау қатесі (Error creating chart)');
            }
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultsVisualizer;
}

// Явное присвоение к window для браузера
if (typeof window !== 'undefined') {
    window.ResultsVisualizer = ResultsVisualizer;
}
