import { useEffect, useReducer } from 'react';
import './styles.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state
      if(payload.digit === "." && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return {
        ...state,
        currentOperand: null,
        overwrite: false
      }
      if (!state.currentOperand) return state
      if (state.currentOperand.length === 1) return {
        ...state,
        currentOperand: null
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) return state
      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true
      }
    default:
      return state
  }
}

function evaluate ({previousOperand, currentOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if(isNaN(prev) || isNaN(current)) return "";

  let result = "";

  switch(operation) {
    case "+":
      result = prev + current;
      break; 
    case "-":
      result = prev - current;
      break; 
    case "*":
      result = prev * current;
      break; 
    case "/":
      result = prev / current;
      break;
    default:
      result = ""
  }

  return result.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true)
  },[])

  const detectKeyDown = (e) => {
    if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
      dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operation: e.key}});
    }
    
    if (e.key === "0" || e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4" || e.key === "5" || e.key === "6" || e.key === "7" || e.key === "8" || e.key === "9" || e.key === ".") {
      dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit: e.key}});
    }

    if (e.key === "=" || e.key === "Enter") {
      dispatch({type: ACTIONS.EVALUATE});
    }

    if (e.key === "Backspace") {
      dispatch({type: ACTIONS.DELETE_DIGIT})
    }

    console.log(e.key)
  }
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two light-button' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button className='light-button border-r-50' onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation='/' dispatch={dispatch}/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton operation='*' dispatch={dispatch}/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton operation='+' dispatch={dispatch}/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton operation='-' dispatch={dispatch}/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className='span-two orange-button' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
