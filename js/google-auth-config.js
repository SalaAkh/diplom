/**
 * Google OAuth Configuration
 * 
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 * 1. Перейдите на https://console.cloud.google.com/
 * 2. Создайте проект или выберите существующий
 * 3. APIs & Services → Credentials → Create Credentials → OAuth client ID
 * 4. Application type: Web application
 * 5. Authorized JavaScript origins: http://localhost:8000
 * 6. Скопируйте Client ID и замените PLACEHOLDER ниже
 */

// ЗАМЕНИТЕ ЭТО НА ВАШ РЕАЛЬНЫЙ CLIENT ID
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Автоматическая установка Client ID в AuthManager
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        if (typeof AuthManager !== 'undefined') {
            // Проверяем, не установлен ли уже Client ID в localStorage
            const storedClientId = localStorage.getItem('googleClientId');
            if (!storedClientId || storedClientId === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
                localStorage.setItem('googleClientId', GOOGLE_CLIENT_ID);
            }
        }
    });
}
