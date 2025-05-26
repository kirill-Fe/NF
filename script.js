// Основной объект приложения
const ForumApp = {
    // Инициализация приложения
    init() {
        this.currentUser = null;
        this.currentTopic = null;
        this.cachedData = {
            users: [],
            topics: [],
            comments: [],
            likes: [],
            bookmarks: []
        };
        
        // Загрузка данных из localStorage
        this.loadData();
        
        // Инициализация UI
        this.initUI();
        
        // Инициализация событий
        this.initEvents();
        
        // Обновление онлайн статуса
        this.updateOnlineStatus();
        setInterval(() => this.updateOnlineStatus(), 30000);
    },
    
    // Загрузка данных
    loadData() {
        // Пользователи
        if (localStorage.getItem('forumUsers')) {
            this.cachedData.users = JSON.parse(localStorage.getItem('forumUsers'));
        } else {
            // Тестовые пользователи
            this.cachedData.users = [
                { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', avatar: 'A', isOnline: false },
                { id: 2, username: 'user1', email: 'user1@example.com', password: 'user1123', avatar: 'U', isOnline: false },
                { id: 3, username: 'user2', email: 'user2@example.com', password: 'user2123', avatar: 'U', isOnline: false }
            ];
            this.saveData('users');
        }
        
        // Темы
        if (localStorage.getItem('forumTopics')) {
            this.cachedData.topics = JSON.parse(localStorage.getItem('forumTopics'));
        } else {
            // Тестовые темы
            this.cachedData.topics = [
                {
                    id: 1,
                    title: 'Как научиться программировать?',
                    content: 'Какие ресурсы вы рекомендуете для начинающих программистов? Какие языки лучше изучать первыми? Поделитесь своим опытом обучения.',
                    category: 'Программирование',
                    tags: ['программирование', 'обучение', 'советы'],
                    authorId: 2,
                    createdAt: new Date('2023-05-01T10:00:00').getTime(),
                    updatedAt: new Date('2023-05-01T10:00:00').getTime()
                },
                {
                    id: 2,
                    title: 'Лучшие практики JavaScript',
                    content: 'Давайте обсудим лучшие практики написания кода на JavaScript. Какие паттерны вы используете? Как организуете структуру проекта?',
                    category: 'Программирование',
                    tags: ['javascript', 'best-practices', 'код'],
                    authorId: 3,
                    createdAt: new Date('2023-05-15T14:30:00').getTime(),
                    updatedAt: new Date('2023-05-15T14:30:00').getTime()
                },
                {
                    id: 3,
                    title: 'Тренды в дизайне на 2023 год',
                    content: 'Какие тренды в веб-дизайне вы наблюдаете в этом году? Какие стили и подходы становятся популярными?',
                    category: 'Дизайн',
                    tags: ['дизайн', 'тренды', '2023'],
                    authorId: 2,
                    createdAt: new Date('2023-06-01T09:15:00').getTime(),
                    updatedAt: new Date('2023-06-01T09:15:00').getTime()
                }
            ];
            this.saveData('topics');
        }
        
        // Комментарии
        if (localStorage.getItem('forumComments')) {
            this.cachedData.comments = JSON.parse(localStorage.getItem('forumComments'));
        } else {
            // Тестовые комментарии
            this.cachedData.comments = [
                {
                    id: 1,
                    topicId: 1,
                    authorId: 3,
                    content: 'Я начинал с Python, он довольно простой для новичков. Потом перешел на JavaScript.',
                    createdAt: new Date('2023-05-01T11:30:00').getTime()
                },
                {
                    id: 2,
                    topicId: 1,
                    authorId: 1,
                    content: 'Рекомендую начать с основ алгоритмов и структур данных, независимо от языка.',
                    createdAt: new Date('2023-05-01T12:45:00').getTime()
                },
                {
                    id: 3,
                    topicId: 2,
                    authorId: 2,
                    content: 'Использую модульный подход и стараюсь следовать принципам SOLID.',
                    createdAt: new Date('2023-05-15T15:20:00').getTime()
                }
            ];
            this.saveData('comments');
        }
        
        // Лайки
        if (localStorage.getItem('forumLikes')) {
            this.cachedData.likes = JSON.parse(localStorage.getItem('forumLikes'));
        } else {
            this.cachedData.likes = [
                { userId: 2, topicId: 1 },
                { userId: 3, topicId: 1 },
                { userId: 1, topicId: 2 }
            ];
            this.saveData('likes');
        }
        
        // Закладки
        if (localStorage.getItem('forumBookmarks')) {
            this.cachedData.bookmarks = JSON.parse(localStorage.getItem('forumBookmarks'));
        } else {
            this.cachedData.bookmarks = [
                { userId: 1, topicId: 3 },
                { userId: 2, topicId: 1 }
            ];
            this.saveData('bookmarks');
        }
    },
    
    // Сохранение данных
    saveData(key) {
        localStorage.setItem(`forum${key.charAt(0).toUpperCase() + key.slice(1)}`, JSON.stringify(this.cachedData[key]));
    },
    
    // Инициализация UI
    initUI() {
        // Отображение тем
        this.displayTopics();
        
        // Отображение пользователей онлайн
        this.displayOnlineUsers();
        
        // Проверка авторизации
        if (localStorage.getItem('forumCurrentUser')) {
            this.currentUser = JSON.parse(localStorage.getItem('forumCurrentUser'));
            this.updateUserUI();
        }
    },
    
    // Инициализация событий
    initEvents() {
        // Модальные окна
        document.getElementById('btnLogin').addEventListener('click', () => this.openModal('authModal'));
        document.getElementById('btnRegister').addEventListener('click', () => {
            this.openModal('authModal');
            this.switchTab('register');
        });
        document.getElementById('btnNewTopic').addEventListener('click', () => this.openModal('newTopicModal'));
        
        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        // Клик по фону
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
        
        // Переключение табов авторизации
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Форма входа
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginUser();
        });
        
        // Форма регистрации
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerUser();
        });
        
        // Форма новой темы
        document.getElementById('newTopicForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewTopic();
        });
        
        // Форма нового комментария
        document.getElementById('newCommentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewComment();
        });
        
        // Лайк темы
        document.getElementById('btnLike').addEventListener('click', () => this.toggleLike());
        
        // Добавление в закладки
        document.getElementById('btnBookmark').addEventListener('click', () => this.toggleBookmark());
        
        // Фильтрация по категориям
        document.querySelectorAll('#categoryList li').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('#categoryList li').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.displayTopics(item.textContent === 'Все темы' ? null : item.textContent);
            });
        });
    },
    
    // Открытие модального окна
    openModal(modalId) {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        document.getElementById(modalId).classList.add('active');
    },
    
    // Закрытие всех модальных окон
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    },
    
    // Переключение табов
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    },
    
    // Отображение тем
    displayTopics(category = null) {
        const topicsContainer = document.getElementById('topicsContainer');
        topicsContainer.innerHTML = '';
        
        let topicsToDisplay = this.cachedData.topics;
        
        if (category) {
            topicsToDisplay = topicsToDisplay.filter(topic => topic.category === category);
        }
        
        if (topicsToDisplay.length === 0) {
            topicsContainer.innerHTML = '<div class="no-topics">Нет тем для отображения. Будьте первым, кто создаст тему!</div>';
            return;
        }
        
        // Сортировка по дате (новые сначала)
        topicsToDisplay.sort((a, b) => b.createdAt - a.createdAt);
        
        topicsToDisplay.forEach(topic => {
            const author = this.cachedData.users.find(u => u.id === topic.authorId);
            const likesCount = this.cachedData.likes.filter(l => l.topicId === topic.id).length;
            const commentsCount = this.cachedData.comments.filter(c => c.topicId === topic.id).length;
            
            const topicElement = document.createElement('div');
            topicElement.className = 'topic-card';
            topicElement.innerHTML = `
                <div class="topic-header">
                    <h3 class="topic-title">${topic.title}</h3>
                    <span class="topic-category">${topic.category}</span>
                </div>
                <div class="topic-content">${topic.content}</div>
                <div class="topic-tags">
                    ${topic.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="topic-footer">
                    <div class="topic-author">
                        <div class="avatar">${author.avatar}</div>
                        <span>${author.username}</span>
                    </div>
                    <div class="topic-stats">
                        <div class="topic-stat">
                            <i class="far fa-thumbs-up"></i> ${likesCount}
                        </div>
                        <div class="topic-stat">
                            <i class="far fa-comment"></i> ${commentsCount}
                        </div>
                        <div class="topic-stat">
                            <i class="far fa-clock"></i> ${this.formatDate(topic.createdAt)}
                        </div>
                    </div>
                </div>
            `;
            
            topicElement.querySelector('.topic-title').addEventListener('click', () => this.openTopic(topic.id));
            topicsContainer.appendChild(topicElement);
        });
    },
    
    // Открытие темы
    openTopic(topicId) {
        const topic = this.cachedData.topics.find(t => t.id === topicId);
        if (!topic) return;
        
        this.currentTopic = topic;
        
        const author = this.cachedData.users.find(u => u.id === topic.authorId);
        const likesCount = this.cachedData.likes.filter(l => l.topicId === topic.id).length;
        const comments = this.cachedData.comments.filter(c => c.topicId === topic.id);
        
        // Заполнение модального окна темы
        document.getElementById('modalTopicTitle').textContent = topic.title;
        document.getElementById('modalTopicAuthor').textContent = `Автор: ${author.username}`;
        document.getElementById('modalTopicDate').textContent = `Опубликовано: ${this.formatDate(topic.createdAt, true)}`;
        document.getElementById('modalTopicCategory').textContent = `Категория: ${topic.category}`;
        document.getElementById('modalTopicContent').textContent = topic.content;
        document.getElementById('likeCount').textContent = likesCount;
        document.getElementById('commentsCount').textContent = comments.length;
        
        // Теги
        const tagsContainer = document.getElementById('modalTopicTags');
        tagsContainer.innerHTML = '';
        topic.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // Комментарии
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев. Будьте первым!</div>';
        } else {
            // Сортировка комментариев (старые сначала)
            comments.sort((a, b) => a.createdAt - b.createdAt);
            
            comments.forEach(comment => {
                const commentAuthor = this.cachedData.users.find(u => u.id === comment.authorId);
                
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-avatar">${commentAuthor.avatar}</div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${commentAuthor.username}</span>
                            <span class="comment-date">${this.formatDate(comment.createdAt, true)}</span>
                        </div>
                        <div class="comment-text">${comment.content}</div>
                    </div>
                `;
                commentsList.appendChild(commentElement);
            });
        }
        
        // Обновление состояния кнопок
        this.updateTopicActions();
        
        // Открытие модального окна
        this.openModal('topicModal');
    },
    
    // Обновление состояния кнопок (лайк, закладка)
    updateTopicActions() {
        if (!this.currentUser || !this.currentTopic) return;
        
        const likeBtn = document.getElementById('btnLike');
        const bookmarkBtn = document.getElementById('btnBookmark');
        
        // Проверка лайка
        const isLiked = this.cachedData.likes.some(
            l => l.userId === this.currentUser.id && l.topicId === this.currentTopic.id
        );
        
        likeBtn.classList.toggle('active', isLiked);
        likeBtn.querySelector('i').className = isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
        
        // Проверка закладки
        const isBookmarked = this.cachedData.bookmarks.some(
            b => b.userId === this.currentUser.id && b.topicId === this.currentTopic.id
        );
        
        bookmarkBtn.classList.toggle('active', isBookmarked);
        bookmarkBtn.querySelector('i').className = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
    },
    
    // Добавление новой темы
    addNewTopic() {
        if (!this.currentUser) {
            alert('Для создания темы необходимо авторизоваться');
            return;
        }
        
        const title = document.getElementById('topicTitle').value.trim();
        const content = document.getElementById('topicContent').value.trim();
        const category = document.getElementById('topicCategory').value;
        const tags = document.getElementById('topicTags').value.split(',').map(t => t.trim()).filter(t => t);
        
        if (!title || !content || !category) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Создание новой темы
        const newTopic = {
            id: this.generateId(),
            title,
            content,
            category,
            tags,
            authorId: this.currentUser.id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        this.cachedData.topics.push(newTopic);
        this.saveData('topics');
        
        // Очистка формы
        document.getElementById('newTopicForm').reset();
        
        // Закрытие модального окна
        this.closeAllModals();
        
        // Обновление списка тем
        this.displayTopics();
        
        // Открытие новой темы
        this.openTopic(newTopic.id);
    },
    
    // Добавление нового комментария
    addNewComment() {
        if (!this.currentUser) {
            alert('Для добавления комментария необходимо авторизоваться');
            return;
        }
        
        if (!this.currentTopic) return;
        
        const content = document.getElementById('commentContent').value.trim();
        
        if (!content) {
            alert('Пожалуйста, введите текст комментария');
            return;
        }
        
        // Создание нового комментария
        const newComment = {
            id: this.generateId(),
            topicId: this.currentTopic.id,
            authorId: this.currentUser.id,
            content,
            createdAt: Date.now()
        };
        
        this.cachedData.comments.push(newComment);
        this.saveData('comments');
        
        // Очистка формы
        document.getElementById('commentContent').value = '';
        
        // Обновление модального окна темы
        this.openTopic(this.currentTopic.id);
    },
    
    // Переключение лайка
    toggleLike() {
        if (!this.currentUser) {
            alert('Для оценки темы необходимо авторизоваться');
            return;
        }
        
        if (!this.currentTopic) return;
        
        const likeIndex = this.cachedData.likes.findIndex(
            l => l.userId === this.currentUser.id && l.topicId === this.currentTopic.id
        );
        
        if (likeIndex === -1) {
            // Добавление лайка
            this.cachedData.likes.push({
                userId: this.currentUser.id,
                topicId: this.currentTopic.id
            });
        } else {
            // Удаление лайка
            this.cachedData.likes.splice(likeIndex, 1);
        }
        
        this.saveData('likes');
        this.updateTopicActions();
        
        // Обновление счетчика лайков
        const likesCount = this.cachedData.likes.filter(l => l.topicId === this.currentTopic.id).length;
        document.getElementById('likeCount').textContent = likesCount;
    },
    
    // Переключение закладки
    toggleBookmark() {
        if (!this.currentUser) {
            alert('Для добавления в закладки необходимо авторизоваться');
            return;
        }
        
        if (!this.currentTopic) return;
        
        const bookmarkIndex = this.cachedData.bookmarks.findIndex(
            b => b.userId === this.currentUser.id && b.topicId === this.currentTopic.id
        );
        
        if (bookmarkIndex === -1) {
            // Добавление в закладки
            this.cachedData.bookmarks.push({
                userId: this.currentUser.id,
                topicId: this.currentTopic.id
            });
        } else {
            // Удаление из закладок
            this.cachedData.bookmarks.splice(bookmarkIndex, 1);
        }
        
        this.saveData('bookmarks');
        this.updateTopicActions();
    },
    
    // Авторизация пользователя
    loginUser() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const user = this.cachedData.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            alert('Неверный email или пароль');
            return;
        }
        
        this.currentUser = user;
        localStorage.setItem('forumCurrentUser', JSON.stringify(user));
        
        // Обновление статуса онлайн
        user.isOnline = true;
        this.saveData('users');
        this.updateOnlineStatus();
        
        // Обновление UI
        this.updateUserUI();
        
        // Закрытие модального окна
        this.closeAllModals();
        
        // Очистка формы
        document.getElementById('loginForm').reset();
    },
    
    // Регистрация пользователя
    registerUser() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Валидация
        if (!username || !email || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (this.cachedData.users.some(u => u.email === email)) {
            alert('Пользователь с таким email уже зарегистрирован');
            return;
        }
        
        if (this.cachedData.users.some(u => u.username === username)) {
            alert('Пользователь с таким именем уже зарегистрирован');
            return;
        }
        
        // Создание нового пользователя
        const newUser = {
            id: this.generateId(),
            username,
            email,
            password,
            avatar: username.charAt(0).toUpperCase(),
            isOnline: true
        };
        
        this.cachedData.users.push(newUser);
        this.saveData('users');
        
        this.currentUser = newUser;
        localStorage.setItem('forumCurrentUser', JSON.stringify(newUser));
        
        // Обновление UI
        this.updateUserUI();
        
        // Закрытие модального окна
        this.closeAllModals();
        
        // Очистка формы
        document.getElementById('registerForm').reset();
    },
    
    // Выход пользователя
    logoutUser() {
        if (this.currentUser) {
            this.currentUser.isOnline = false;
            this.saveData('users');
            this.updateOnlineStatus();
        }
        
        this.currentUser = null;
        localStorage.removeItem('forumCurrentUser');
        this.updateUserUI();
    },
    
    // Обновление UI пользователя
    updateUserUI() {
        const userActions = document.getElementById('userActions');
        
        if (this.currentUser) {
            userActions.innerHTML = `
                <div class="user-profile">
                    <div class="avatar">${this.currentUser.avatar}</div>
                    <span>${this.currentUser.username}</span>
                </div>
                <button class="btn-logout" id="btnLogout">Выйти</button>
            `;
            
            document.getElementById('btnLogout').addEventListener('click', () => this.logoutUser());
            
            // Активация кнопки новой темы
            document.getElementById('btnNewTopic').disabled = false;
        } else {
            userActions.innerHTML = `
                <button class="btn-login" id="btnLogin">Войти</button>
                <button class="btn-register" id="btnRegister">Регистрация</button>
            `;
            
            document.getElementById('btnLogin').addEventListener('click', () => this.openModal('authModal'));
            document.getElementById('btnRegister').addEventListener('click', () => {
                this.openModal('authModal');
                this.switchTab('register');
            });
            
            // Деактивация кнопки новой темы
            document.getElementById('btnNewTopic').disabled = true;
        }
    },
    
    // Отображение пользователей онлайн
    displayOnlineUsers() {
        const onlineUsers = this.cachedData.users.filter(u => u.isOnline);
        const onlineUsersList = document.getElementById('onlineUsersList');
        const onlineCount = document.getElementById('onlineCount');
        
        onlineCount.textContent = onlineUsers.length;
        onlineUsersList.innerHTML = '';
        
        if (onlineUsers.length === 0) {
            onlineUsersList.innerHTML = '<li>Нет пользователей онлайн</li>';
            return;
        }
        
        onlineUsers.forEach(user => {
            const userElement = document.createElement('li');
            userElement.textContent = user.username;
            onlineUsersList.appendChild(userElement);
        });
    },
    
    // Обновление статуса онлайн
    updateOnlineStatus() {
        if (!this.currentUser) return;
        
        // Обновление статуса текущего пользователя
        const user = this.cachedData.users.find(u => u.id === this.currentUser.id);
        if (user) {
            user.isOnline = true;
            this.saveData('users');
        }
        
        // Обновление списка онлайн
        this.displayOnlineUsers();
    },
    
    // Генерация ID
    generateId() {
        return Math.max(0, ...this.cachedData.topics.map(t => t.id), ...this.cachedData.comments.map(c => c.id), ...this.cachedData.users.map(u => u.id)) + 1;
    },
    
    // Форматирование даты
    formatDate(timestamp, full = false) {
        const date = new Date(timestamp);
        
        if (full) {
            return date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        const now = new Date();
        const diff = now - date;
        
        // Менее минуты назад
        if (diff < 60000) {
            return 'только что';
        }
        
        // Менее часа назад
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} ${this.pluralize(minutes, 'минуту', 'минуты', 'минут')} назад`;
        }
        
        // Менее суток назад
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} ${this.pluralize(hours, 'час', 'часа', 'часов')} назад`;
        }
        
        // Менее недели назад
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days} ${this.pluralize(days, 'день', 'дня', 'дней')} назад`;
        }
        
        // Более недели назад - полная дата
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },
    
    // Склонение слов
    pluralize(number, one, few, many) {
        const n = Math.abs(number) % 100;
        const n1 = n % 10;
        
        if (n > 10 && n < 20) return many;
        if (n1 > 1 && n1 < 5) return few;
        if (n1 === 1) return one;
        return many;
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => ForumApp.init());
