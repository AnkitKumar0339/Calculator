class Calculator {
  constructor(previousTextElement, currentTextElement) {
    this.previousTextElement = previousTextElement;
    this.currentTextElement = currentTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = null;
    this.updateDisplay();
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    this.updateDisplay();
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (number === '0' && this.currentOperand === '0') return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '' && this.previousOperand === '') return;
    if (this.currentOperand === '' && this.previousOperand !== '') {
      this.operation = operation;
      this.updateDisplay();
      return;
    }
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.updateDisplay();
  }

  compute() {
    let result;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          result = 'Error';
          break;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = result.toString();
    this.operation = null;
    this.previousOperand = '';
    this.updateDisplay();
  }

  updateDisplay() {
    this.currentTextElement.textContent = this.currentOperand;
    this.previousTextElement.textContent = this.operation
      ? `${this.previousOperand} ${this.operation}`
      : '';
  }

  handleKeyPress(e) {
    if (!isNaN(e.key)) this.appendNumber(e.key);
    if (e.key === '.') this.appendNumber('.');
    if (['+', '-', '*', '/'].includes(e.key)) this.chooseOperation(e.key);
    if (e.key === 'Enter' || e.key === '=') this.compute();
    if (e.key === 'Backspace') this.delete();
    if (e.key === 'Escape') this.clear();
  }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const nextOperandTextElement = document.getElementById('next-operand');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

document.querySelectorAll('.number').forEach(button =>
  button.addEventListener('click', () => calculator.appendNumber(button.textContent))
);

document.querySelector('.dot').addEventListener('click', () =>
  calculator.appendNumber('.')
);

document.querySelectorAll('.operation').forEach(button =>
  button.addEventListener('click', () => calculator.chooseOperation(button.textContent))
);

document.getElementById('equals').addEventListener('click', () => calculator.compute());
document.getElementById('clear').addEventListener('click', () => calculator.clear());
document.getElementById('delete').addEventListener('click', () => calculator.delete());

document.addEventListener('keydown', (e) => calculator.handleKeyPress(e));
