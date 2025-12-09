class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−': 
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero! 🌌");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }

        
        this.currentOperandTextElement.animate([
            { transform: 'scale(1.05)', opacity: 0.8 },
            { transform: 'scale(1)', opacity: 1 }
        ], {
            duration: 150,
            easing: 'ease-out'
        });
    }
}


const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const themeToggle = document.getElementById('checkbox');
const body = document.body;

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
    } else {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
    }
});


numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        createRipple(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        createRipple(button);
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
    
    createRipple(equalsButton);
    confettiEffect();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    createRipple(allClearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    createRipple(deleteButton);
});

document.addEventListener('keydown', e => {
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
        highlightButton(e.key);
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
        highlightButton('=');
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        highlightButton('delete');
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
        highlightButton('ac');
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let op = e.key;
        if (op === '/') op = '÷'; // Map to UI
        if (op === '*') op = '×';
        if (op === '-') op = '−';

       
        if (e.key === '/') calculator.chooseOperation('÷');
        else if (e.key === '*') calculator.chooseOperation('×');
        else if (e.key === '-') calculator.chooseOperation('−');
        else if (e.key === '+') calculator.chooseOperation('+');

        calculator.updateDisplay();
        highlightButton(op);
    }
});


function createRipple(button) {
   

  
    button.classList.remove('active-ripple');
    void button.offsetWidth; 
    button.classList.add('active-ripple');
}


function highlightButton(key) {
    let btn;
    if (key === 'delete') {
        btn = deleteButton;
    } else if (key === 'ac') {
        btn = allClearButton;
    } else if (key === '=') {
        btn = equalsButton;
    } else {
        
        const allBtns = [...numberButtons, ...operationButtons];
        btn = allBtns.find(b => b.innerText === key);
    }

    if (btn) {
        btn.classList.add('active-ripple');
      
        btn.style.transform = "scale(0.95)";
        setTimeout(() => {
            btn.classList.remove('active-ripple');
            btn.style.transform = "";
        }, 150);
    }
}


function confettiEffect() {
    const screen = document.querySelector('.calculator-screen');
    screen.style.boxShadow = "inset 0 0 30px var(--blob-1)";
    setTimeout(() => {
        screen.style.boxShadow = "";
    }, 300);
}

