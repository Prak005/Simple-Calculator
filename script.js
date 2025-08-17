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
            if (display.value === "0" || display.value === "Error") {
                display.value = lastAnswer;
            } else {
                display.value += lastAnswer;
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
    const tokens = expression.match(/-?\d+\.?\d*|[\+\-\*\/%]/g);

    if (!tokens) {
        return "Error";
    }

    for (let i = 0; i < tokens.length - 1; i++) {
        const operators = ['+', '-', '*', '/', '%'];
        if (operators.includes(tokens[i]) && tokens[i + 1] === '-') {
            tokens.splice(i + 1, 2, `-${tokens[i+2]}`);
        }
    }

    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '*') {
            const result = parseFloat(tokens[i - 1]) * parseFloat(tokens[i + 1]);
            tokens.splice(i - 1, 3, result.toString());
            i = 0;
        } else if (tokens[i] === '/') {
            const result = parseFloat(tokens[i - 1]) / parseFloat(tokens[i + 1]);
            tokens.splice(i - 1, 3, result.toString());
            i = 0;
        } else if (tokens[i] === '%') {
            const result = parseFloat(tokens[i - 1]) % parseFloat(tokens[i + 1]);
            tokens.splice(i - 1, 3, result.toString());
            i = 0;
        } else {
            i++;
        }
    }

    let result = parseFloat(tokens[0]);
    for (let j = 1; j < tokens.length; j += 2) {
        const operator = tokens[j];
        const nextNumber = parseFloat(tokens[j + 1]);

        if (operator === '+') {
            result += nextNumber;
        } else if (operator === '-') {
            result -= nextNumber;
        }
    }

    return isNaN(result) ? "Error" : result;
}