const button = document.querySelectorAll(".btn");
const display = document.querySelector("#display");

let lastAnswer = 0;

button.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const buttonValue = btn.value;
        if (buttonValue === "ac") {
            display.value = "";
            lastAnswer = 0;
        } else if (buttonValue === "del") {
            display.value = display.value.slice(0, -1);
        } else if (buttonValue === "equals") {
            if (display.value) {
                const result = calculate(display.value);
                display.value = result;
                lastAnswer = result;
                if (display.value === "Error") {
                    lastAnswer = 0;
                }
            }
        } else if (buttonValue === "ans") {
            const lastChar = display.value.slice(-1);
            const operators = ['+', '-', '*', '/', '%'];
            if (display.value === "" || operators.includes(lastChar)) {
                 display.value += lastAnswer;
            }
        } else if (buttonValue === '.') {
            const numbers = display.value.split(/[\+\-\*\/%]/);
            const currentNumber = numbers[numbers.length - 1];
            if (!currentNumber.includes('.')) {
                display.value += buttonValue;
            }
        } else {
            if (display.value === "0" || display.value === "Error") {
                display.value = buttonValue;
            } else {
                display.value += buttonValue;
            }
        }
    });
});

function calculate(expression) {
    const tokens = expression.match(/((\d+\.?\d*)|(\.\d+)|[\+\-\*\/%])/g);
    if (!tokens) { return "Error"; }
    const processedTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '-') {
            if (i === 0 || ['+', '-', '*', '/', '%'].includes(tokens[i - 1])) {
                processedTokens.push(tokens[i] + tokens[i + 1]);
                i++;
            } else {
                processedTokens.push(tokens[i]);
            }
        } else {
            processedTokens.push(tokens[i]);
        }
    }
    const firstToken = processedTokens[0];
    if (firstToken === '*' || firstToken === '/' || firstToken === '%' || firstToken === '+') {
        return "Error"; 
    }
    let i = 0;
    while (i < processedTokens.length) {
        if (processedTokens[i] === '*') {
            processedTokens.splice(i - 1, 3, (parseFloat(processedTokens[i - 1]) * parseFloat(processedTokens[i + 1])).toString());
            i = 0;
        } else if (processedTokens[i] === '/') {
            processedTokens.splice(i - 1, 3, (parseFloat(processedTokens[i - 1]) / parseFloat(processedTokens[i + 1])).toString());
            i = 0;
        } else if (processedTokens[i] === '%') {
            processedTokens.splice(i - 1, 3, (parseFloat(processedTokens[i - 1]) % parseFloat(processedTokens[i + 1])).toString());
            i = 0;
        } else { i++; }
    }
    let result = parseFloat(processedTokens[0]);
    for (let j = 1; j < processedTokens.length; j += 2) {
        const operator = processedTokens[j];
        const nextNumber = parseFloat(processedTokens[j + 1]);
        if (operator === '+') { result += nextNumber; }
        if (operator === '-') { result -= nextNumber; }
    }
    return isNaN(result) ? "Error" : result;
}

window.addEventListener('keydown', (e) => {
    const key = e.key;
    let button;
    if (key === 'Enter') {
        button = document.querySelector('button[value="equals"]');
    } else if (key === 'Backspace') {
        button = document.querySelector('button[value="del"]');
    } else if (key === 'Escape') {
        button = document.querySelector('button[value="ac"]');
    } else {
        button = document.querySelector(`button[value="${key}"]`);
    }
    if (button) {
        button.click();
    }
});