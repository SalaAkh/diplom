/**
 * Утилита для показа toast уведомлений
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        // Создаем контейнер для toast уведомлений
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Уведомления');
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
    }

    /**
     * Показать toast уведомление
     * @param {string} message - Текст сообщения
     * @param {string} type - Тип: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Длительность показа в мс (0 = бесконечно)
     */
    show(message, type = 'info', duration = 4000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Автоматическое закрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');

        // Иконка в зависимости от типа
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        toast.innerHTML = `
            <span class="material-symbols-rounded toast-icon">${icons[type] || icons.info}</span>
            <div class="toast-message">${this.escapeHtml(message)}</div>
            <button class="toast-close" aria-label="Закрыть уведомление">
                <span class="material-symbols-rounded">close</span>
            </button>
        `;

        // Обработчик закрытия
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        return toast;
    }

    hide(toast) {
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    // Вспомогательные методы для разных типов
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    // Защита от XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Очистить все уведомления
    clearAll() {
        this.toasts.forEach(toast => this.hide(toast));
    }
}

// Глобальный экземпляр
if (typeof window !== 'undefined') {
    window.toastManager = new ToastManager();

    // Удобные глобальные функции
    window.showToast = (message, type, duration) => window.toastManager.show(message, type, duration);
    window.showSuccess = (message, duration) => window.toastManager.success(message, duration);
    window.showError = (message, duration) => window.toastManager.error(message, duration);
    window.showWarning = (message, duration) => window.toastManager.warning(message, duration);
    window.showInfo = (message, duration) => window.toastManager.info(message, duration);
}
