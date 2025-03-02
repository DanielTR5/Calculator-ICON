// === Utilidades ===
const getElement = (id) => document.getElementById(id) || null;

// Formatear números eliminando ceros innecesarios al final
const formatNumber = (number) => {
    let str = number.toString();
    return str.includes('.') ? str.replace(/\.0+$/, '').replace(/(\..*[^0])0+$/, '$1') : str;
};

// === Módulo de Calculadora ===
const calculator = {
    append(value) {
        const display = getElement('calc-display');
        if (!display) return;
        if (display.value === 'Error' || display.value === '') display.value = '';

        if (value === '.' || value === ',') {
            let parts = display.value.split(/[-+*/]/); 
            let lastPart = parts[parts.length - 1]; 
            if (lastPart.includes('.')) return;
            display.value += '.';
        } else {
            display.value += value;
        }
    },
    
    backspace() {
        const display = getElement('calc-display');
        if (display) display.value = display.value.slice(0, -1) || '';
    },
    
    clear() {
        const display = getElement('calc-display');
        if (display) display.value = '';
    },
    
    calculate() {
        const display = getElement('calc-display');
        const historyList = getElement('calc-history');
        if (!display || !historyList) return;

        try {
            let expression = display.value.trim().replace(/,/g, '.');
            if (!expression || /[*/+\-]$/.test(expression)) return;

            const validExpression = /^[\d.+\-*/()%\s]+$/.test(expression);
            if (!validExpression) throw new Error('Expresión no válida.');

            let result = eval(expression);
            if (!isFinite(result)) throw new Error('Resultado no válido');

            display.value = formatNumber(result);

            const item = document.createElement('li');
            item.textContent = `${expression} = ${formatNumber(result)}`;
            historyList.prepend(item);

            let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
            history.unshift(item.textContent);
            if (history.length > 10) history.pop();
            localStorage.setItem('calcHistory', JSON.stringify(history));
        } catch (e) {
            display.value = 'Error';
        }
    },
    
    percentage() {
        const display = getElement('calc-display');
        if (!display || !display.value) return;
        try {
            let expression = display.value.replace(/,/g, '.');
            let result = eval(expression) / 100;
            display.value = formatNumber(result);
        } catch {
            display.value = 'Error';
        }
    },
    
    clearHistory() {
        const historyList = getElement('calc-history');
        if (historyList) historyList.innerHTML = '';
        localStorage.removeItem('calcHistory');
    },
    
    loadHistory() {
        const historyList = getElement('calc-history');
        if (!historyList) return;
        const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
    },
};

// === Módulo de Temperatura ===
const temperature = {
    convert() {
        const input = getElement('temp-input');
        const unit = getElement('temp-unit');
        const result = getElement('temp-result');
        if (!input || !unit || !result) return;
        const value = parseFloat(input.value.replace(/,/g, '.'));
        if (isNaN(value)) {
            result.textContent = 'Ingresa un número válido.';
            return;
        }
        let converted;
        if (unit.value === 'celsius') {
            converted = (value * 9/5) + 32;
            result.textContent = `${value}°C = ${formatNumber(converted)}°F`;
        } else {
            converted = (value - 32) * 5/9;
            result.textContent = `${value}°F = ${formatNumber(converted)}°C`;
        }
    },
    reset() {
        const input = getElement('temp-input');
        const result = getElement('temp-result');
        if (input) input.value = '';
        if (result) result.textContent = 'Resultado aparecerá aquí';
    }
};

// === Módulo de Contraseñas ===
const password = {
    generate() {
        const lengthInput = getElement('pass-length');
        const result = getElement('pass-result');
        if (!lengthInput || !result) return;
        const length = parseInt(lengthInput.value);
        if (isNaN(length) || length < 6 || length > 20) {
            result.textContent = 'Longitud entre 6 y 20.';
            return;
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        result.textContent = pass;
    },
    reset() {
        const lengthInput = getElement('pass-length');
        const result = getElement('pass-result');
        if (lengthInput) lengthInput.value = '12';
        if (result) result.textContent = 'Tu contraseña aparecerá aquí';
    }
};

// === Módulo de Longitud ===
const length = {
    convert() {
        const input = getElement('length-input');
        const fromUnit = getElement('length-from');
        const toUnit = getElement('length-to');
        const result = getElement('length-result');
        if (!input || !fromUnit || !toUnit || !result) return;
        const value = parseFloat(input.value.replace(/,/g, '.'));
        if (isNaN(value)) {
            result.textContent = 'Ingresa un número válido.';
            return;
        }
        const conversions = {
            m: 1,
            cm: 0.01,
            mm: 0.001,
            km: 1000,
            ft: 0.3048,
            in: 0.0254,
            yd: 0.9144
        };
        const meters = value * conversions[fromUnit.value];
        const converted = meters / conversions[toUnit.value];
        result.textContent = `${value} ${fromUnit.value} = ${formatNumber(converted)} ${toUnit.value}`;
    },
    reset() {
        const input = getElement('length-input');
        const result = getElement('length-result');
        if (input) input.value = '';
        if (result) result.textContent = 'Resultado aparecerá aquí';
    }
};

// === Módulo de Peso ===
const weight = {
    convert() {
        const input = getElement('weight-input');
        const fromUnit = getElement('weight-from');
        const toUnit = getElement('weight-to');
        const result = getElement('weight-result');
        if (!input || !fromUnit || !toUnit || !result) return;
        const value = parseFloat(input.value.replace(/,/g, '.'));
        if (isNaN(value)) {
            result.textContent = 'Ingresa un número válido.';
            return;
        }
        const conversions = {
            kg: 1,
            g: 0.001,
            mg: 0.000001,
            t: 1000,
            lb: 0.453592,
            oz: 0.0283495
        };
        const kilograms = value * conversions[fromUnit.value];
        const converted = kilograms / conversions[toUnit.value];
        result.textContent = `${value} ${fromUnit.value} = ${formatNumber(converted)} ${toUnit.value}`;
    },
    reset() {
        const input = getElement('weight-input');
        const result = getElement('weight-result');
        if (input) input.value = '';
        if (result) result.textContent = 'Resultado aparecerá aquí';
    }
};

// === Módulo de Contador de Texto ===
const textCounter = {
    count() {
        const input = getElement('text-input');
        const result = getElement('text-result');
        if (!input || !result) return;
        const text = input.value.trim();
        const chars = text.length;
        const words = text.split(/\s+/).filter(w => w).length;
        result.textContent = `Caracteres: ${chars} | Palabras: ${words}`;
    },
    reset() {
        const input = getElement('text-input');
        const result = getElement('text-result');
        if (input) input.value = '';
        if (result) result.textContent = 'Caracteres: 0 | Palabras: 0';
    }
};

// === Inicialización y Eventos ===
document.addEventListener('DOMContentLoaded', () => {
    let activeTool = null;
    const wheel = getElement('tool-wheel');
    if (!wheel) {
        console.error('No se encontró la rueda de herramientas');
        return;
    }

    const tools = {
        calculator,
        temperature,
        password,
        length,
        weight,
        textCounter
    };

    // Evento para toggle del anuncio
    const adSection = document.querySelector('.ad-section');
    const adToggle = document.querySelector('.ad-toggle');
    if (adSection && adToggle) {
        adToggle.addEventListener('click', () => {
            adSection.classList.toggle('hidden');
            adToggle.innerHTML = adSection.classList.contains('hidden') 
                ? '<i class="fas fa-eye"></i>' 
                : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Evento para abrir las herramientas
    document.querySelectorAll('.wheel-item').forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.getAttribute('data-tool');
            const wrapper = getElement('tool-content-wrapper');
            const center = getElement('wheel-center');
            if (!wrapper || !center) {
                console.error('Elementos wrapper o center no encontrados');
                return;
            }

            const allContents = wrapper.querySelectorAll('.tool-content');
            const allItems = document.querySelectorAll('.wheel-item');

            if (activeTool === tool) {
                allContents.forEach(content => content.style.display = 'none');
                allItems.forEach(i => i.classList.remove('active'));
                wheel.classList.remove('shifted');
                activeTool = null;
                center.innerHTML = '<p>Selecciona una herramienta</p>';
            } else {
                allContents.forEach(content => content.style.display = 'none');
                allItems.forEach(i => i.classList.remove('active'));
                const content = getElement(`${tool}-content`);
                if (content) {
                    content.style.display = 'block';
                    item.classList.add('active');
                    wheel.classList.add('shifted');
                    activeTool = tool;
                    center.innerHTML = `<p>Herramienta activa: ${tool}</p>`;
                    tools[tool].reset();
                    if (tool === 'calculator') calculator.loadHistory();
                } else {
                    console.error(`Contenido para ${tool} no encontrado`);
                }
            }
        });
    });

    // Eventos para los botones de las herramientas
    document.getElementById('tool-content-wrapper').addEventListener('click', e => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const value = button.getAttribute('data-value');

        if (action === 'clear') calculator.clear();
        else if (action === 'backspace') calculator.backspace();
        else if (action === 'calculate') calculator.calculate();
        else if (action === 'percentage') calculator.percentage();
        else if (action === 'clearHistory') calculator.clearHistory();
        else if (action === 'convertTemp') temperature.convert();
        else if (action === 'generatePass') password.generate();
        else if (action === 'convertLength') length.convert();
        else if (action === 'convertWeight') weight.convert();
        else if (action === 'countText') textCounter.count();
        else if (value) calculator.append(value);
    });
});

// === Soporte para Teclado ===
document.addEventListener('keydown', e => {
    const keyActions = {
        '0': () => calculator.append('0'),
        '1': () => calculator.append('1'),
        '2': () => calculator.append('2'),
        '3': () => calculator.append('3'),
        '4': () => calculator.append('4'),
        '5': () => calculator.append('5'),
        '6': () => calculator.append('6'),
        '7': () => calculator.append('7'),
        '8': () => calculator.append('8'),
        '9': () => calculator.append('9'),
        '+': () => calculator.append('+'),
        '-': () => calculator.append('-'),
        '*': () => calculator.append('*'),
        '/': () => calculator.append('/'),
        '.': () => calculator.append('.'),
        ',': () => calculator.append(','),
        'Enter': () => calculator.calculate(),
        'Backspace': () => calculator.backspace(),
        'Escape': () => calculator.clear(),
        '%': () => calculator.percentage()
    };
    if (keyActions[e.key]) keyActions[e.key]();
});