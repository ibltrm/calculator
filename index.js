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
    content.classList.toggle("open");
});

//CALCULATOR
const calculator = {
    outputDisplay: '0',
    displayValue: '0', //represents the input number or the result of an operation
    firstOperand: null, //store the first operand of the math expressions
    operator: null, // store the operator for an expression
    waitingForSecondOperand: false, //check if both the first operand and the operator have been set. if true, the next numbers entered will create the second operand
    plusMinusJustClicked: false,
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

    console.log(calculator);
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
    const currentInput = parseFloat(displayValue); // Number.
    let result;

    switch (fn) {
        case '%': // If case is '%'
            result = currentInput / 100;
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.outputDisplay = `${parseFloat(result.toFixed(7))}`;
            break;
        case '+/-':
            //result = currentInput * -1;
            //## Below commented code will fix '+/-' result error ##//
            //@@ Test the error and understand before adding below code @@//
            /* calculator.operator = null;
             if (Math.sign(result) < 0) {
                 console.log('negative', result);
                 calculator.displayValue = Math.abs(result) * -1;
                 calculator.firstOperand = Math.abs(result) * -1;
             } else {
                 console.log('positive', result);
                 calculator.displayValue = Math.abs(result);
                 calculator.firstOperand = Math.abs(result);
             }*/

            //!! Think about what should be done here !!//
            const newInput = currentInput * -1;
            calculator.displayValue = newInput;


            if (calculator.plusMinusJustClicked === false) { // If '+/-' conversion was not done for current value.
                const outputDisplay = calculator.outputDisplay; //selecting outputDisplay values 
                console.log('outputDisplay', outputDisplay)
                const outputDisplayToArray = outputDisplay.split(''); //turn the values of outputDisplay into array
                console.log('outputDisplayToArray', outputDisplayToArray);
                const latestInputLength = currentInput.toString().length; //checking the length of the values from outputDisplay
                console.log('latestInputLength', latestInputLength);
                outputDisplayToArray.length = outputDisplayToArray.length - latestInputLength;
                console.log('outputDisplayToArray', outputDisplayToArray) //subtract the lenght of the objects so only the - in added to the display (i think the problem is here)
                outputDisplayToArray.push('-'); //push to add the negative sign to the array
                console.log('outputDisplayToArray', outputDisplayToArray)
                const backToString = outputDisplayToArray.join(''); //turn the array back to string
                console.log('backToString', backToString)
                calculator.outputDisplay = backToString + currentInput.toString();
                console.log('calculator.outputDisplay', calculator.outputDisplay);
            } else { // If '+/-' conversion was just done (user clicking again).
               
            }

            break;
        default:
            result = 0;

    }

    // After switch function is done, whatever here will trigger next.

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
            /*case '%':
                handleFn(value);
                break;*/
        case '.':
            inputDecimal(value);
            break;
        case 'Backspace':
            resetCalculator();
            break;
        default:
            // check if the value is an integer
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
            /*case '%':
                handleFn(value);
                break;*/
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

    if (value === '+/-') {
        calculator.plusMinusJustClicked = true;
    } else {
        calculator.plusMinusJustClicked = false;
    }

    updateDisplay();
    updateOutput();

});
