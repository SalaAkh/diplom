/**
 * Нәтижелерді 3D визуализациялау модулі (3D results visualization module)
 * Интерактивті 3D графиктерді жасау үшін Three.js қолданылады (Uses Three.js to create interactive 3D charts)
 * 
 * Авторы (Author): Ахмедьянов Саламат КПО 9/22-2
 * Мерзімі (Date): 2026
 */

class Visualization3D {
    constructor(containerId) {
        this.containerId = containerId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        this.currentVisualization = null;
        this.descriptionElement = null;
    }

    /**
     * Инициализация 3D сцены
     */
    initScene() {
        // Проверяем доступность Three.js
        if (typeof THREE === 'undefined') {
            console.warn('Three.js әлі жүктелген жоқ, 3D визуализация қолжетімсіз (Three.js not loaded yet, 3D visualization unavailable)');
            return false;
        }

        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Контейнер табылмады (Container not found):', this.containerId);
            return false;
        }

        // Создание сцены
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);

        // Создание камеры
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 5);

        // Создание рендерера
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // Орбитальные контролы для вращения
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
            this.controls.enablePan = false;
        }

        // Обработка изменения размера окна
        window.addEventListener('resize', () => this.onWindowResize());

        return true;
    }

    /**
     * Создание 3D радиальной диаграммы профиля
     * @param {Object} scores - Оценки по измерениям
     * @param {Object} dimensions - Описания измерений
     */
    create3DRadarChart(scores, dimensions) {
        if (!this.initScene()) return;

        this.clearScene();

        // Add accessible description
        this.addAccessibleDescription(scores, dimensions, false);

        const dimensionKeys = Object.keys(dimensions);
        const numDimensions = dimensionKeys.length;
        const radius = 2;

        // Создание группы для всех элементов
        const chartGroup = new THREE.Group();

        // Создание осей (линий)
        const axisGeometry = new THREE.BufferGeometry();
        const axisMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, linewidth: 1 });

        dimensionKeys.forEach((key, index) => {
            const angle = (index / numDimensions) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const points = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(x, y, 0)
            ];
            axisGeometry.setFromPoints(points);

            const line = new THREE.Line(axisGeometry, axisMaterial);
            chartGroup.add(line);

            // Добавление подписей
            const loader = new THREE.FontLoader();
            // Используем простой текст без загрузки шрифта
            this.addTextLabel(key, x * 1.2, y * 1.2, 0, chartGroup);
        });

        // Создание поверхности профиля
        const profileShape = new THREE.Shape();
        const profilePoints = [];

        dimensionKeys.forEach((key, index) => {
            const angle = (index / numDimensions) * Math.PI * 2 - Math.PI / 2;
            const score = scores[key] || 0;
            // [-100..100] ауқымын [0..radius] ауқымына ауыстырамыз (Convert -100..100 to 0..radius)
            const normalizedScore = (score + 100) / 200;
            const distance = normalizedScore * radius;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            if (index === 0) {
                profileShape.moveTo(x, y);
            } else {
                profileShape.lineTo(x, y);
            }
            profilePoints.push(new THREE.Vector3(x, y, 0));
        });
        profileShape.lineTo(profilePoints[0].x, profilePoints[0].y);

        // Создание геометрии поверхности
        const profileGeometry = new THREE.ShapeGeometry(profileShape);
        const profileMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const profileMesh = new THREE.Mesh(profileGeometry, profileMaterial);
        chartGroup.add(profileMesh);

        // Создание контура профиля
        const edgeGeometry = new THREE.BufferGeometry().setFromPoints(profilePoints);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x4a90e2, linewidth: 3 });
        const edgeLine = new THREE.LineLoop(edgeGeometry, edgeMaterial);
        chartGroup.add(edgeLine);

        // Создание точек на осях
        dimensionKeys.forEach((key, index) => {
            const angle = (index / numDimensions) * Math.PI * 2 - Math.PI / 2;
            const score = scores[key] || 0;
            const normalizedScore = (score + 100) / 200;
            const distance = normalizedScore * radius;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const pointGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x4a90e2 });
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.set(x, y, 0);
            chartGroup.add(point);
        });

        // Добавление сетки концентрических кругов
        for (let i = 1; i <= 4; i++) {
            const circleGeometry = new THREE.RingGeometry(radius * i / 4 - 0.02, radius * i / 4 + 0.02, 32);
            const circleMaterial = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide
            });
            const circle = new THREE.Mesh(circleGeometry, circleMaterial);
            circle.rotation.x = Math.PI / 2;
            chartGroup.add(circle);
        }

        this.scene.add(chartGroup);
        this.currentVisualization = chartGroup;

        // Запуск анимации
        this.animate();

        return chartGroup;
    }

    /**
     * Создание 3D временной анимации изменений профиля
     * @param {Array} history - История изменений профиля
     * @param {Object} dimensions - Описания измерений
     */
    create3DTimeEvolution(history, dimensions) {
        if (!this.initScene()) return;

        this.clearScene();

        if (history.length < 2) {
            console.warn('Уақытша анимация үшін деректер жеткіліксіз (Insufficient data for time animation)');
            return;
        }

        // Add accessible description
        this.addAccessibleDescription(history, dimensions, true);

        const dimensionKeys = Object.keys(dimensions);
        const numDimensions = dimensionKeys.length;
        const radius = 2;
        const timeStep = 0.5; // Расстояние между временными точками

        const evolutionGroup = new THREE.Group();

        // Создание профилей для каждого момента времени
        history.forEach((session, timeIndex) => {
            const z = timeIndex * timeStep - (history.length - 1) * timeStep / 2;
            const scores = session.normalizedScores || session.scores || {};

            const profilePoints = [];
            dimensionKeys.forEach((key, index) => {
                const angle = (index / numDimensions) * Math.PI * 2 - Math.PI / 2;
                const score = scores[key] || 0;
                const normalizedScore = (score + 1) / 2; // [-1..1] мәнін [0..1] ауқымына ауыстырамыз (Convert -1..1 to 0..1)
                const distance = normalizedScore * radius;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                profilePoints.push(new THREE.Vector3(x, y, z));
            });

            // Создание контура профиля
            const edgeGeometry = new THREE.BufferGeometry().setFromPoints([
                ...profilePoints,
                profilePoints[0] // Замыкаем контур
            ]);
            const opacity = 0.3 + (timeIndex / history.length) * 0.7;
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color().lerpColors(
                    new THREE.Color(0xff6b6b),
                    new THREE.Color(0x4a90e2),
                    timeIndex / (history.length - 1)
                ),
                linewidth: 2,
                transparent: true,
                opacity: opacity
            });
            const edgeLine = new THREE.LineLoop(edgeGeometry, edgeMaterial);
            evolutionGroup.add(edgeLine);
        });

        // Создание соединительных линий между временными точками
        dimensionKeys.forEach((key, dimIndex) => {
            const angle = (dimIndex / numDimensions) * Math.PI * 2 - Math.PI / 2;
            const connectionPoints = [];

            history.forEach((session, timeIndex) => {
                const z = timeIndex * timeStep - (history.length - 1) * timeStep / 2;
                const scores = session.normalizedScores || session.scores || {};
                const score = scores[key] || 0;
                const normalizedScore = (score + 1) / 2;
                const distance = normalizedScore * radius;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                connectionPoints.push(new THREE.Vector3(x, y, z));
            });

            const connectionGeometry = new THREE.BufferGeometry().setFromPoints(connectionPoints);
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: 0x95a5a6,
                linewidth: 1,
                transparent: true,
                opacity: 0.5
            });
            const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
            evolutionGroup.add(connectionLine);
        });

        this.scene.add(evolutionGroup);
        this.currentVisualization = evolutionGroup;

        // Настройка камеры для лучшего обзора
        this.camera.position.set(3, 3, 5);
        this.camera.lookAt(0, 0, 0);

        // Запуск анимации
        this.animate();

        return evolutionGroup;
    }

    /**
     * Добавление доступного описания для скринридеров
     * @param {Object|Array} data - Данные для описания
     * @param {Object} dimensions - Описания измерений
     * @param {boolean} isEvolution - Флаг типа визуализации
     */
    addAccessibleDescription(data, dimensions, isEvolution = false) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Удаляем старое описание если есть
        if (this.descriptionElement) {
            this.descriptionElement.remove();
        }

        // Создаем скрытый элемент
        this.descriptionElement = document.createElement('div');
        this.descriptionElement.className = 'sr-only'; // Используем класс из accessibility.css
        this.descriptionElement.setAttribute('aria-live', 'polite');

        const currentLang = document.documentElement.lang || 'ru';
        const t = (key) => window.t ? window.t(key) : key;

        let text = '';
        if (isEvolution) {
            text = currentLang === 'ru'
                ? '3D визуализация эволюции профиля. Показывает изменение ваших показателей во времени.'
                : (currentLang === 'kk'
                    ? 'Профиль эволюциясының 3D визуализациясы. Уақыт өте келе көрсеткіштеріңіздің өзгеруін көрсетеді.'
                    : '3D visualization of profile evolution. Shows how your scores changed over time.');
        } else {
            const scores = data;
            const dimensionKeys = Object.keys(dimensions);

            const intro = currentLang === 'ru'
                ? '3D Радарная диаграмма профиля личности. Значения: '
                : (currentLang === 'kk'
                    ? 'Жеке тұлға профилінің 3D радаралық диаграммасы. Мәндер: '
                    : '3D Radar Chart of personality profile. Values: ');

            const parts = dimensionKeys.map(key => {
                const nameObj = dimensions[key].name;
                const name = (typeof nameObj === 'object')
                    ? (nameObj[currentLang] || nameObj['ru'] || key)
                    : nameObj;

                // Форматируем значение
                let score = scores[key] || 0;
                // Если значения normalized (-1..1), переводим в проценты (-100..100)
                if (Math.abs(score) <= 1) score = Math.round(score * 100);

                return `${name}: ${score}%`;
            });

            text = intro + parts.join(', ') + '.';
        }

        this.descriptionElement.textContent = text;
        container.appendChild(this.descriptionElement);

        // Добавляем ARIA атрибуты к canvas
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.setAttribute('role', 'img');
            this.renderer.domElement.setAttribute('aria-label', text);
        }
    }

    /**
     * Добавление текстовой метки (упрощенная версия)
     */
    addTextLabel(text, x, y, z, parent) {
        // Используем простой HTML overlay вместо 3D текста
        // Для полноценного 3D текста нужна загрузка шрифта
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.fillStyle = '#2c3e50';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(x, y, z);
        sprite.scale.set(0.5, 0.125, 1);
        parent.add(sprite);
    }

    /**
     * Очистка сцены
     */
    clearScene() {
        if (this.scene) {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }
        if (this.currentVisualization) {
            this.currentVisualization = null;
        }
        if (this.descriptionElement) {
            this.descriptionElement.remove();
            this.descriptionElement = null;
        }
    }

    /**
     * Анимационный цикл
     */
    animate() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        const animateLoop = () => {
            this.animationId = requestAnimationFrame(animateLoop);

            if (this.controls) {
                this.controls.update();
            }

            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        };

        animateLoop();
    }

    /**
     * Обработка изменения размера окна
     */
    onWindowResize() {
        const container = document.getElementById(this.containerId);
        if (!container || !this.camera || !this.renderer) return;

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Уничтожение визуализации
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.clearScene();

        if (this.renderer) {
            const container = document.getElementById(this.containerId);
            if (container && this.renderer.domElement) {
                container.removeChild(this.renderer.domElement);
            }
            this.renderer.dispose();
            this.renderer = null;
        }

        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }

        this.scene = null;
        this.camera = null;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Visualization3D;
}
