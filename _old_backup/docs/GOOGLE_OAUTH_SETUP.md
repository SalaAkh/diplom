# Настройка Google OAuth

**Автор:** Ахмедьянов Саламат КПО 9/22-2  
**Дата:** 2026

Для работы входа через Google необходимо настроить Google OAuth 2.0.

## Шаги настройки:

1. **Перейдите в Google Cloud Console:**
   - Откройте https://console.cloud.google.com/
   - Создайте новый проект или выберите существующий

2. **Включите Google+ API:**
   - Перейдите в "APIs & Services" > "Library"
   - Найдите "Google+ API" и включите его

3. **Создайте OAuth 2.0 Client ID:**
   - Перейдите в "APIs & Services" > "Credentials"
   - Нажмите "Create Credentials" > "OAuth client ID"
   - Выберите "Web application"
   - Добавьте авторизованные JavaScript источники:
     - `http://localhost` (для локальной разработки)
     - Ваш домен (для продакшена)
   - Добавьте авторизованные URI перенаправления:
     - `http://localhost` (для локальной разработки)
     - Ваш домен (для продакшена)

4. **Получите Client ID:**
   - После создания вы получите Client ID (например: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

5. **Настройте в приложении:**
   
   Откройте `js/auth.js` и найдите метод `initGoogleSignIn()`.
   
   Замените `YOUR_GOOGLE_CLIENT_ID` на ваш реальный Client ID:
   
   ```javascript
   initGoogleSignIn() {
       if (typeof window !== 'undefined' && window.google) {
           window.google.accounts.id.initialize({
               client_id: 'ВАШ_CLIENT_ID.apps.googleusercontent.com',
               callback: this.handleGoogleSignIn.bind(this)
           });
       }
   }
   ```
   
   Или установите через метод:
   
   ```javascript
   // В консоли браузера или в коде инициализации
   app.auth.setGoogleClientId('ВАШ_CLIENT_ID.apps.googleusercontent.com');
   ```

## Альтернативный способ (для тестирования):

Если у вас нет доступа к Google Cloud Console, можно использовать fallback кнопку, которая уже реализована в коде. Она будет показывать сообщение о необходимости настройки.

## Важно:

- Client ID должен быть настроен для правильного домена
- Для локальной разработки используйте `http://localhost`
- Для продакшена добавьте ваш реальный домен в авторизованные источники
- Никогда не публикуйте Client Secret в клиентском коде (он не нужен для этого типа OAuth)
