//MODE SWITCHER

const transition = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
            document.documentElement.classList.remove('transition')
        }, 1000) //setTimeout calls a function after a number of milliseconds
}

let checkbox = document.querySelector('input[name=theme]');

checkbox.addEventListener('change', function() {
    if (this.checked) {
        transition()
        document.documentElement.setAttribute('data-theme', 'light')
    } else {
        transition()
        document.documentElement.setAttribute('data-theme', 'dark')
    }
})

//KEYBOARD COMMANDS BUTTON 
let commandBtn = document.querySelector('.btn-commands');
let content = document.querySelector('.note-content');

commandBtn.addEventListener('click', () => {
    if (content.style.display === 'none') {
        content.style.display = 'block'
    } else {
        content.style.display = 'none';
    }
});

//CALCULATOR
const calculator = {
    outputDisplay: '0',
    displayValue: '0', //represents the input number or the result of an operation
    firstOperand: null, //store the first operand of the math expressions
    operator: null, // store the operator for an expression
    waitingForSecondOperand: false, //check if both the first operand and the operator have been set. if true, the next numbers entered will create the second operand
};

function outputDigit(digit) {
    const outputDisplay = calculator.outputDisplay;
    const waitingForSecondOperand = calculator.waitingForSecondOperand;
    if (waitingForSecondOperand === true) {
        calculator.outputDisplay = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.outputDisplay = outputDisplay === '0' ? digit : outputDisplay + digit;
    }

    // console.log(calculator);
}

function inputDigit(digit) {
    //const { displayValue, waitingForSecondOperand } = calculator;
    const displayValue = calculator.displayValue;
    const waitingForSecondOperand = calculator.waitingForSecondOperand;
    // Overwrite `displayValue` if the current value is '0' otherwise append to it
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit; // the question mark(?) is being used to check if the current value displayed on the calculator is zero. if so, calculator.displayValue is overwritten with whatever digit was clicked.
    }

    // console.log(calculator);
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.'
        calculator.waitingForSecondOperand = false;
        return
    }
    // If the `displayValue` property does not contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
        // Append the decimal point
        calculator.displayValue += dot;
    }
    if (!calculator.outputDisplay.includes(dot)) {
        // Append the decimal point
        calculator.outputDisplay += dot;
    }
}


function handleOperator(nextOperator) {
    const firstOperand = calculator.firstOperand;
    const displayValue = calculator.displayValue;
    const operator = calculator.operator;
    // `parseFloat` converts the string contents of `displayValue` to a floating-point number
    const inputValue = parseFloat(displayValue);

    //If user clicked '=' button
    if (nextOperator === '=') {
        // console.log('= was clicked');

        //If currently only has single number, do nothing
        if (!isNaN(Number(calculator.outputDisplay)))
            return;
        //Convert string to array
        const stringToArray = calculator.outputDisplay.split('');
        //Select last index value of string array
        const lastIndexValue = stringToArray[stringToArray.length - 1];
        //If last index value is not a number, do nothing
        if (isNaN(Number(lastIndexValue)))
            return;
    }

    //Remove '=' from calculator.outputDisplay
    calculator.outputDisplay = calculator.outputDisplay.replace('=', '');

    // Get last string in `outputDisplay`.
    const lastString = calculator.outputDisplay.at(-1);

    // Check if last string is operator.
    let lastStringIsOperator;

    if (lastString === '+') {
        lastStringIsOperator = true;
    } else if (lastString === '-') {
        lastStringIsOperator = true;
    } else if (lastString === '/') {
        lastStringIsOperator = true;
    } else if (lastString === '*') {
        lastStringIsOperator = true;
    } else {
        lastStringIsOperator = false;
    }

    // If it's 'true', that means both new input from user and last string of `calculator.outputdDisplay` are both operators.
    if (lastStringIsOperator === true) {
        // Replace last string of `calculator.outputDisplay` with new operator.
        const turnOutputDisplayToArray = calculator.outputDisplay.split('');

        // Replace last string with new user input (operator).
        turnOutputDisplayToArray.splice(calculator.outputDisplay.length - 1, 1, nextOperator);

        // Turn result back into string from array.
        const finalResultInString = turnOutputDisplayToArray.join('');

        // Assign calculator object with updated value.
        calculator.outputDisplay = finalResultInString;

    } else {
        //Add clicked operator in calculator.outputDisplay
        calculator.outputDisplay = calculator.outputDisplay + nextOperator;
    }


    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        // console.log(calculator);
        return;
    }
    //verify that `firstOperand` is null and that the `inputValue` is not a `NaN` value
    if (firstOperand === null && !isNaN(inputValue)) {
        // Update the firstOperand property
        calculator.firstOperand = inputValue;

    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator
        // console.log(calculator);
}


function handleFn(fn) {
    const displayValue = calculator.displayValue;
    const waitingForSecondOperand = calculator.waitingForSecondOperand;
    const currentInput = parseFloat(displayValue);
    let result;

    switch (fn) {
        case '%':
            result = currentInput / 100;
            break;
        case '+/-':
            result = currentInput * -1;
            break;
        default:
            result = 0;

    }

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.outputDisplay = `${parseFloat(result.toFixed(7))}`;

    if (waitingForSecondOperand) {
        calculator.waitingForSecondOperand = false;
    }
}


function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}


function resetCalculator() {
    calculator.outputDisplay = '0';
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    // console.log(calculator);
}

function updateOutput() {
    const outDisplay = document.querySelector('.output');
    outDisplay.value = calculator.outputDisplay;
}

updateOutput();

function updateDisplay() {
    const display = document.querySelector('.display_result'); //select the "display_result" element

    const displayValue = parseFloat(calculator.displayValue);
    if (!Number.isFinite(displayValue)) {
        alert('Calculation is out of the accepted range');
        resetCalculator();
        return;
    }
    display.value = calculator.displayValue; // update the value of the element with the content of "displayValue"
}

updateDisplay();

//KEYBOARD INPUT
document.addEventListener('keydown', event => {
    const value = event.key;

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case 'Enter':
            handleOperator('=');
            break;
        case 'Control':
            handleFn('+/-');
            break;
        case '%':
            handleFn(value);
            break;
        case '%':
            handleFn(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'Backspace':
            resetCalculator();
            break;
        default:
            // check if the key is an integer
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
                outputDigit(value);
            }
    }
    updateDisplay();
    updateOutput();

});


const keys = document.querySelector('.calc_keys'); //to determine what type of key was clicked - whether digits (0-9), operators (+, −, ⨉, ÷, =), decimal point (.) and the reset key (AC) -

keys.addEventListener('click', event => { //addEventListener method make the document clickable
    const target = event.target;
    const value = target.value;
    if (!target.matches('button')) { //check if the clicked element is a button
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '+/-':
        case '%':
            handleFn(value);
            break;
        case '%':
            handleFn(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // check if the key is an integer
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
                outputDigit(value);
            }

    }
    updateDisplay();
    updateOutput();

});
