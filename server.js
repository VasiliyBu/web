const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const cookieParser = require('cookie-parser');

// Middleware для обработки JSON и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Указываем Express на обслуживание статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'ejs');
// Отображение HTML формы для регистрации
app.get('/', (req, res) => {
    const currentTheme = req.cookies.theme ?? "light";

    res.render('index', { theme: currentTheme });
});

// Регулярное выражение для проверки валидности email
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Обработка POST запроса с данными регистрации
app.post('/register', (req, res) => {
    const { email, login, password, gender, subscribe } = req.body;

    if (!emailPattern.test(email)) {
        return res.status(400).send("E-Mail адрес указан неверно!");
    }

    const loginPattern = /^[A-Za-z0-9]{5,}$/;
    if (!loginPattern.test(login)) {
        return res.status(400).send("Минимальная длина логина 5 символов, логин может состоять только из цифр и латинских букв");
    }

    const userData = {
        email,
        login,
        password,
        gender,
        subscribe: subscribe === 'on'
    };

    /**
     * Сохранение данных в файле
     */
    fs.appendFile('users.txt', JSON.stringify(userData) + '\n', (err) => {
        if (err) throw err;
        console.log('Данные успешно записаны в файл');
    });

    res.send('Регистрация прошла успешно!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
