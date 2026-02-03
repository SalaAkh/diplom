/**
 * BaseView - Базовый класс для всех View компонентов
 * Обеспечивает общую функциональность для UI компонентов
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class BaseView {
    constructor(options = {}) {
        this.container = options.container || null;
        this.app = options.app || null;
        this.i18n = options.i18n || (typeof window !== 'undefined' ? window.i18n : null);
        this.eventBus = options.eventBus || (typeof window !== 'undefined' ? window.eventBus : null);
        this.isRendered = false;
    }

    /**
     * Получение перевода
     * @param {string} key - Ключ перевода
     * @param {Object} params - Параметры
     * @returns {string}
     */
    t(key, params = {}) {
        if (this.i18n && typeof this.i18n.t === 'function') {
            return this.i18n.t(key, params);
        }
        return key;
    }

    /**
     * Экранирование HTML для предотвращения XSS
     * @param {string} text - Текст для экранирования
     * @returns {string}
     */
    escapeHTML(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Создание DOM элемента
     * @param {string} tag - Тег элемента
     * @param {Object} attrs - Атрибуты
     * @param {string|HTMLElement|Array} children - Дочерние элементы
     * @returns {HTMLElement}
     */
    createElement(tag, attrs = {}, children = null) {
        const element = document.createElement(tag);

        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else if (key === 'dataset' && typeof value === 'object') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (children) {
            if (typeof children === 'string') {
                element.innerHTML = children;
            } else if (children instanceof HTMLElement) {
                element.appendChild(children);
            } else if (Array.isArray(children)) {
                children.forEach(child => {
                    if (child instanceof HTMLElement) {
                        element.appendChild(child);
                    } else if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    }
                });
            }
        }

        return element;
    }

    /**
     * Рендеринг View в контейнер
     * @param {HTMLElement} container - Контейнер для рендера
     */
    render(container = null) {
        if (container) {
            this.container = container;
        }

        if (!this.container) {
            console.error('[BaseView] Контейнер табылмады (Container not found)');
            return;
        }

        const content = this.getHTML();
        this.container.innerHTML = content;
        this.isRendered = true;

        // Вызываем хук после рендера
        this.afterRender();
    }

    /**
     * Получение HTML содержимого (переопределяется в дочерних классах)
     * @returns {string}
     */
    getHTML() {
        return '';
    }

    /**
     * Хук после рендера (переопределяется в дочерних классах)
     */
    afterRender() {
        // Переопределяется в дочерних классах
    }

    /**
     * Привязка событий (переопределяется в дочерних классах)
     */
    bindEvents() {
        // Переопределяется в дочерних классах
    }

    /**
     * Уничтожение View и очистка событий
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isRendered = false;
    }

    /**
     * Показать View
     */
    show() {
        if (this.container) {
            this.container.style.display = '';
            this.container.classList.remove('hidden');
        }
    }

    /**
     * Скрыть View
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            this.container.classList.add('hidden');
        }
    }

    /**
     * Добавление класса анимации
     * @param {string} animationClass - Класс анимации
     */
    animate(animationClass) {
        if (this.container) {
            this.container.classList.add(animationClass);
            this.container.addEventListener('animationend', () => {
                this.container.classList.remove(animationClass);
            }, { once: true });
        }
    }

    /**
     * Генерация события
     * @param {string} event - Имя события
     * @param {*} data - Данные
     */
    emit(event, data) {
        if (this.eventBus) {
            this.eventBus.emit(event, data);
        }
    }

    /**
     * Подписка на событие
     * @param {string} event - Имя события
     * @param {Function} callback - Обработчик
     */
    on(event, callback) {
        if (this.eventBus) {
            return this.eventBus.on(event, callback);
        }
    }
}

// Экспорт
if (typeof window !== 'undefined') {
    window.BaseView = BaseView;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseView;
}
