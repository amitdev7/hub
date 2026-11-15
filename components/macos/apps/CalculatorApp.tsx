'use client';

import React, { useState } from 'react';
import { playSound } from '../useSound';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [scientific, setScientific] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const inputDigit = (digit: string) => {
    playSound.tink();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    playSound.tink();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    playSound.tink();
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    playSound.tink();
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const inputPercent = () => {
    playSound.tink();
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOperation = (nextOperator: string) => {
    playSound.tink();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const current = prevValue || 0;
      let result = current;
      if (operator === '+') result = current + inputValue;
      else if (operator === '−' || operator === '-') result = current - inputValue;
      else if (operator === '×' || operator === '*') result = current * inputValue;
      else if (operator === '÷' || operator === '/') result = current / (inputValue || 1);

      setPrevValue(result);
      setDisplay(String(Number(result.toFixed(8))));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  const applyMathFunc = (fn: (n: number) => number) => {
    playSound.tink();
    const val = parseFloat(display);
    const res = fn(val);
    setDisplay(String(Number(res.toFixed(8))));
    setWaitingForOperand(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white p-3 select-none">
      {/* Mode toggle */}
      <div className="flex items-center justify-between pb-2 px-1">
        <button
          onClick={() => {
            playSound.tink();
            setScientific(!scientific);
          }}
          className="text-[10px] text-white/50 hover:text-white uppercase tracking-wider font-semibold"
        >
          {scientific ? 'Standard' : 'Scientific'}
        </button>
        {memory !== 0 && <span className="text-[10px] font-mono text-amber-400">M = {memory}</span>}
      </div>

      {/* Main Display */}
      <div className="flex-1 flex items-end justify-end px-3 py-2 text-right">
        <span
          className={`font-light font-mono tracking-tight transition-all truncate ${
            display.length > 10 ? 'text-2xl' : display.length > 7 ? 'text-4xl' : 'text-5xl'
          }`}
        >
          {display}
        </span>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        {/* Row 1 */}
        <button
          onClick={clearAll}
          className="h-11 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-medium text-base transition active:scale-95"
        >
          {display !== '0' ? 'C' : 'AC'}
        </button>
        <button
          onClick={toggleSign}
          className="h-11 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-medium text-base transition active:scale-95"
        >
          ±
        </button>
        <button
          onClick={inputPercent}
          className="h-11 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-medium text-base transition active:scale-95"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className={`h-11 rounded-full font-medium text-xl transition active:scale-95 ${
            operator === '÷' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb038] text-white'
          }`}
        >
          ÷
        </button>

        {/* Scientific extra row if active */}
        {scientific && (
          <>
            <button
              onClick={() => applyMathFunc((x) => x * x)}
              className="h-9 rounded-full bg-[#333333] hover:bg-[#444444] text-xs font-mono transition"
            >
              x²
            </button>
            <button
              onClick={() => applyMathFunc((x) => Math.sqrt(x))}
              className="h-9 rounded-full bg-[#333333] hover:bg-[#444444] text-xs font-mono transition"
            >
              √x
            </button>
            <button
              onClick={() => applyMathFunc((x) => Math.sin(x))}
              className="h-9 rounded-full bg-[#333333] hover:bg-[#444444] text-xs font-mono transition"
            >
              sin
            </button>
            <button
              onClick={() => {
                setDisplay(String(Math.PI));
                setWaitingForOperand(true);
              }}
              className="h-9 rounded-full bg-[#333333] hover:bg-[#444444] text-xs font-mono transition"
            >
              π
            </button>
          </>
        )}

        {/* Row 2 */}
        <button
          onClick={() => inputDigit('7')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          9
        </button>
        <button
          onClick={() => performOperation('×')}
          className={`h-11 rounded-full font-medium text-xl transition active:scale-95 ${
            operator === '×' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb038] text-white'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => inputDigit('4')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          6
        </button>
        <button
          onClick={() => performOperation('−')}
          className={`h-11 rounded-full font-medium text-xl transition active:scale-95 ${
            operator === '−' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb038] text-white'
          }`}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => inputDigit('1')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          3
        </button>
        <button
          onClick={() => performOperation('+')}
          className={`h-11 rounded-full font-medium text-xl transition active:scale-95 ${
            operator === '+' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb038] text-white'
          }`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg pl-6 text-left transition active:scale-95"
        >
          0
        </button>
        <button
          onClick={inputDot}
          className="h-11 rounded-full bg-[#333333] hover:bg-[#444444] font-medium text-lg transition active:scale-95"
        >
          .
        </button>
        <button
          onClick={() => performOperation('=')}
          className="h-11 rounded-full bg-[#ff9f0a] hover:bg-[#ffb038] text-white font-medium text-xl transition active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
}
