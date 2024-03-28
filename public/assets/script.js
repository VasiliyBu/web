/**
 * Функция для получения значения куки
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}

/**
 * Метод валидации данных
 */
function validateForm() {
    const emailInput = document.getElementById('email');
    const loginInput = document.getElementById('login');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const loginPattern = /^[A-Za-z0-9]{5,}$/;
    let valid = true;

    if (!emailPattern.test(emailInput.value)) {
        document.getElementById('emailError').innerText = "E-Mail указан неверно!";
        valid = false;
    } else {
        document.getElementById('emailError').innerText = "";
    }

    if (!loginPattern.test(loginInput.value)) {
        document.getElementById('loginError').innerText = "Минимальная длина логина 5 символов, логин может состоять только из цифр и латинских букв";
        valid = false;
    } else {
        document.getElementById('loginError').innerText = "";
    }

    return valid;
}

/**
 * Отправляем данные на сервер
 */
function sendData() {
    const email = document.getElementById('email').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const gender = document.getElementById('gender').value;
    const subscribe = document.getElementById('subscribe').checked;

    const data = {
        email: email,
        login: login,
        password: password,
        gender: gender,
        subscribe: subscribe
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Возникла ошибка');
            }
            return response.text();
        })
        .then(() => {
            /**
             * Если регистрация прошла успешно, прячем форму, отображаем успешное сообщение
             */
            document.getElementById('registrationForm').style.display = 'none';
            document.getElementById('successAlert').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Проблема с регистрацией, попробуйте позже!');
        });
}

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    /**
     * Проверяем форму, если все хорошо, отравляем данные на сервер
     */
    if (validateForm()) {
        sendData();
    }
});

const btn_change = document.getElementById("change_theme");
btn_change.addEventListener("click", function (e){
    e.preventDefault();
    const current_theme = getCookie("theme");
    const next_theme = current_theme === "dark" ? "light" : "dark";
    document.cookie = `theme=${next_theme}; path=/`;

    const html_el = document.querySelector("html");
    html_el.classList.remove("light", "dark");
    html_el.classList.add(next_theme)
})