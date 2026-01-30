/**
 * Модуль 3D фона "Нейронное созвездие"
 * Создает интерактивный фон с частицами и связями
 */

class NeuralBackground {
    constructor(containerId) {
        this.containerId = containerId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.lines = null;
        this.animationId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;

        // Параметры конфигурации
        this.config = {
            particleCount: 350, // Increased from 150
            connectionDistance: 120,
            particleSize: 2.5,
            particleSpeed: 0.3,
            // Цвета будут установлены в зависимости от темы
            color: 0x4a90e2,
            secondaryColor: 0x7b68ee,
            backgroundColor: 0x050510
        };

        // Определяем текущую тему и устанавливаем цвета
        this.updateThemeColors();

        this.init();
    }

    updateThemeColors() {
        // Проверяем, какая тема активна
        const isDarkTheme = document.body.classList.contains('dark-theme');

        if (isDarkTheme) {
            // Темная тема: яркие цвета (голубой и фиолетовый)
            this.config.color = 0x00c6fb; // Яркий голубой
            this.config.secondaryColor = 0x9d8df1; // Яркий фиолетовый
        } else {
            // Светлая тема: темные цвета для контраста
            this.config.color = 0x2c3e50; // Темно-синий
            this.config.secondaryColor = 0x5a4a8a; // Темно-фиолетовый
        }
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn(`Container ${this.containerId} not found for NeuralBackground`);
            return;
        }

        // Проверка загрузки Three.js с механизмом ожидания
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded yet, waiting...');
            // Пытаемся подождать загрузки Three.js
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof THREE !== 'undefined') {
                    clearInterval(checkInterval);
                    if (window.logger) window.logger.info('Three.js loaded, initializing NeuralBackground');
                    this.setupScene();
                } else if (attempts > 50) {
                    // Ждем максимум 5 секунд (50 * 100ms)
                    clearInterval(checkInterval);
                    console.error('Three.js failed to load after 5 seconds');
                }
            }, 100);
            return;
        }

        this.setupScene();
    }

    setupScene() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Создаем сцену
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(this.config.backgroundColor); // Прозрачный фон лучше для CSS градиентов

        // Камера
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        this.camera.position.z = 400;

        // Рендерер
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Оптимизация для retina
        container.appendChild(this.renderer.domElement);

        // Создаем объекты
        this.createParticles();

        // Слушатели событий
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Слушатель изменения темы
        this.setupThemeListener();

        // Запуск анимации
        this.animate();

        if (window.logger) window.logger.info('NeuralBackground initialized');
    }

    setupThemeListener() {
        // Наблюдаем за изменениями класса на body для отслеживания смены темы
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    // Тема изменилась, обновляем цвета
                    this.updateThemeColors();
                    this.updateParticleColors();
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        this.themeObserver = observer;
    }

    updateParticleColors() {
        if (!this.particles) return;

        const colors = this.particles.geometry.attributes.color.array;
        const color1 = new THREE.Color(this.config.color);
        const color2 = new THREE.Color(this.config.secondaryColor);

        for (let i = 0; i < this.config.particleCount; i++) {
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        this.particles.geometry.attributes.color.needsUpdate = true;
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const velocities = []; // Кастомный атрибут для движения

        const color1 = new THREE.Color(this.config.color);
        const color2 = new THREE.Color(this.config.secondaryColor);

        for (let i = 0; i < this.config.particleCount; i++) {
            // Позиция
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 500;
            positions.push(x, y, z);

            // Скорость
            const vx = (Math.random() - 0.5) * this.config.particleSpeed;
            const vy = (Math.random() - 0.5) * this.config.particleSpeed;
            const vz = (Math.random() - 0.5) * this.config.particleSpeed;
            velocities.push(vx, vy, vz);

            // Цвет (градиент между двумя цветами)
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors.push(mixedColor.r, mixedColor.g, mixedColor.b);

            // Размер
            sizes.push(Math.random() * 2 + 0.5);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        // Сохраняем скорости для анимации
        this.particleVelocities = velocities;

        // Материал для частиц
        const material = new THREE.PointsMaterial({
            size: this.config.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Линии (будут обновляться в каждом кадре, но геометрию создаем один раз)
        // Для оптимизации используем LineSegments вместо Line
        // Максимальное количество линий = N * (N-1) / 2, но мы ограничим разумным числом
        const maxConnections = this.config.particleCount * 10;
        const lineGeometry = new THREE.BufferGeometry();
        // Изначально пустой буфер, размер с запасом
        const linePositions = new Float32Array(maxConnections * 6); // 2 точки * 3 коорд
        const lineColors = new Float32Array(maxConnections * 6);

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

        // Оптимизация: указываем, что будем часто обновлять
        lineGeometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
        lineGeometry.attributes.color.setUsage(THREE.DynamicDrawUsage);

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2, // Начальная прозрачность, будет меняться в шейдере или логике (тут статика)
            blending: THREE.AdditiveBlending,
            linewidth: 1
        });

        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        const positions = this.particles.geometry.attributes.position.array;
        const count = this.config.particleCount;

        // Обновление частиц
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Движение
            positions[i3] += this.particleVelocities[i3];
            positions[i3 + 1] += this.particleVelocities[i3 + 1];
            positions[i3 + 2] += this.particleVelocities[i3 + 2];

            // Границы (отражение)
            if (positions[i3] < -500 || positions[i3] > 500) this.particleVelocities[i3] *= -1;
            if (positions[i3 + 1] < -500 || positions[i3 + 1] > 500) this.particleVelocities[i3 + 1] *= -1;
            if (positions[i3 + 2] < -250 || positions[i3 + 2] > 250) this.particleVelocities[i3 + 2] *= -1;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;

        // Вращение всей системы от мыши (Parallax)
        this.targetX = this.mouseX * 0.0005;
        this.targetY = this.mouseY * 0.0005;

        this.scene.rotation.y += 0.0005 + (this.targetX - this.scene.rotation.y) * 0.05;
        this.scene.rotation.x += (this.targetY - this.scene.rotation.x) * 0.05;

        // Обновление линий
        this.updateLines();

        this.renderer.render(this.scene, this.camera);
    }

    updateLines() {
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;

        // Получаем атрибуты линий
        const linePositions = this.lines.geometry.attributes.position.array;
        const lineColors = this.lines.geometry.attributes.color.array;

        let vertexIndex = 0;
        let colorIndex = 0;
        const connectDistSq = this.config.connectionDistance * this.config.connectionDistance;

        // Проверяем все пары (можно оптимизировать через spatial hashing, но для 150 частиц O(N^2) ок)
        for (let i = 0; i < this.config.particleCount; i++) {
            const ix = positions[i * 3];
            const iy = positions[i * 3 + 1];
            const iz = positions[i * 3 + 2];

            for (let j = i + 1; j < this.config.particleCount; j++) {
                const jx = positions[j * 3];
                const jy = positions[j * 3 + 1];
                const jz = positions[j * 3 + 2];

                const dx = ix - jx;
                const dy = iy - jy;
                const dz = iz - jz;
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < connectDistSq) {
                    // Есть связь
                    if (vertexIndex + 6 >= linePositions.length) break; // Защита от переполнения

                    // Точка 1
                    linePositions[vertexIndex++] = ix;
                    linePositions[vertexIndex++] = iy;
                    linePositions[vertexIndex++] = iz;

                    // Точка 2
                    linePositions[vertexIndex++] = jx;
                    linePositions[vertexIndex++] = jy;
                    linePositions[vertexIndex++] = jz;

                    // Цвет (интерполяция прозрачности от дистанции)
                    const alpha = 1.0 - distSq / connectDistSq;

                    // Цвет точки 1
                    lineColors[colorIndex++] = colors[i * 3];
                    lineColors[colorIndex++] = colors[i * 3 + 1];
                    lineColors[colorIndex++] = colors[i * 3 + 2];
                    // lineColors[colorIndex-1] (alpha не поддерживается в rgb буфере без шейдера, 
                    // но LineBasicMaterial берет global opacity, либо vertexColors)
                    // Для прозрачности по вершинам нужен ShaderMaterial или хак.
                    // Упростим: просто копируем цвет, прозрачность общая 0.2

                    // Цвет точки 2
                    lineColors[colorIndex++] = colors[j * 3];
                    lineColors[colorIndex++] = colors[j * 3 + 1];
                    lineColors[colorIndex++] = colors[j * 3 + 2];
                }
            }
        }

        // Обновляем диапазон отрисовки
        this.lines.geometry.setDrawRange(0, vertexIndex / 3);
        this.lines.geometry.attributes.position.needsUpdate = true;
        this.lines.geometry.attributes.color.needsUpdate = true;
    }

    onMouseMove(event) {
        this.mouseX = event.clientX - window.innerWidth / 2;
        this.mouseY = event.clientY - window.innerHeight / 2;
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}

// Экспорт
window.NeuralBackground = NeuralBackground;
