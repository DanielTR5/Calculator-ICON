// Elementos del DOM
const display = document.getElementById('display');
const historyList = document.getElementById('history-list');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadHistory();
});

// Funciones de inicialización
function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function loadHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];
    savedHistory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Funciones de entrada
function appendValue(value) {
    let currentValue = display.value;
    if (currentValue === 'Error') currentValue = '';
    if (value === '.' && currentValue.slice(-1) === '.') return;
    display.value = currentValue + value;
}

function backspace() {
    const newValue = display.value.slice(0, -1);
    display.value = newValue === '' ? '0' : newValue;
}

function clearDisplay() {
    display.value = '0';
}

// Funciones de cálculo
function calculate() {
    const expression = display.value;
    try {
        const result = eval(expression);
        display.value = result;
        saveToHistory(expression, result);
        showFeedback('success');
    } catch (error) {
        display.value = 'Error';
        showFeedback('error');
    }
}

function calculatePercentage() {
    try {
        const result = eval(display.value) / 100;
        display.value = result;
        saveToHistory(`${display.value} %`, result);
        showFeedback('success');
    } catch (error) {
        display.value = 'Error';
        showFeedback('error');
    }
}

// Función para cambiar entre modo claro y oscuro
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector(".theme-toggle i"); // Selecciona el ícono

    body.classList.toggle("dark-theme"); // Alterna la clase "dark-theme" en el body

    // Cambia el ícono entre luna y sol
    if (body.classList.contains("dark-theme")) {
        themeToggle.classList.remove("fa-moon");
        themeToggle.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.classList.remove("fa-sun");
        themeToggle.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
    }
}

// Verifica la preferencia del usuario al cargar la página
function loadTheme() {
    const body = document.body;
    const themeToggle = document.querySelector(".theme-toggle i"); // Selecciona el ícono
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-theme");
        themeToggle.classList.remove("fa-moon");
        themeToggle.classList.add("fa-sun");
    }
}

// Cargar el tema al iniciar la página
loadTheme();

function clearHistory() {
    historyList.classList.add('fade-out');
    setTimeout(() => {
        historyList.innerHTML = '';
        historyList.classList.remove('fade-out');
        localStorage.removeItem('calcHistory');
    }, 300);
}

// Feedback visual
function showFeedback(type) {
    display.classList.add(type);
    setTimeout(() => display.classList.remove(type), 300);
}

// Soporte para teclado
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    const key = event.key;
    const keyActions = {
        '0': () => appendValue('0'),
        '1': () => appendValue('1'),
        '2': () => appendValue('2'),
        '3': () => appendValue('3'),
        '4': () => appendValue('4'),
        '5': () => appendValue('5'),
        '6': () => appendValue('6'),
        '7': () => appendValue('7'),
        '8': () => appendValue('8'),
        '9': () => appendValue('9'),
        '+': () => appendValue('+'),
        '-': () => appendValue('-'),
        '*': () => appendValue('*'),
        '/': () => appendValue('/'),
        '.': () => appendValue('.'),
        'Enter': calculate,
        '=': calculate,
        'Backspace': backspace,
        'Escape': clearDisplay,
        '%': calculatePercentage
    };

    if (keyActions[key]) keyActions[key]();
});