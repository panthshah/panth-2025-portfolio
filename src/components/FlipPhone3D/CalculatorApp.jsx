import { useState } from 'react';
import { X } from '@phosphor-icons/react';

const CalculatorApp = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num));
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ label, onClick, variant = 'default' }) => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '20px',
      fontWeight: '600',
      fontFamily: 'Satoshi, -apple-system, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.2s',
      userSelect: 'none',
      height: '100%',
      width: '100%'
    };

    const variants = {
      default: {
        background: '#fff',
        color: '#2a2a2e',
        border: '1px solid #e0e0e0'
      },
      operator: {
        background: '#4CAF50',
        color: '#fff'
      },
      clear: {
        background: '#ff5252',
        color: '#fff'
      }
    };

    return (
      <button
        style={{ ...baseStyle, ...variants[variant] }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <style>{`
        .calculator-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .calculator-scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'transparent',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '80px'
      }}
      className="calculator-scroll-container"
      >
        {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{
          color: '#000',
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: 'Satoshi, -apple-system, sans-serif',
          margin: 0,
        }}>Calculator</h2>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <X size={20} color="#fff" weight="bold" />
        </button>
      </div>

      {/* Display */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'right',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#2a2a2e',
          fontFamily: 'Satoshi, -apple-system, sans-serif',
          wordWrap: 'break-word',
          minHeight: '44px'
        }}>
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        flex: 1
      }}>
        <Button label="C" onClick={handleClear} variant="clear" />
        <Button label="÷" onClick={() => handleOperation('÷')} variant="operator" />
        <Button label="×" onClick={() => handleOperation('×')} variant="operator" />
        <Button label="-" onClick={() => handleOperation('-')} variant="operator" />
        
        <Button label="7" onClick={() => handleNumber(7)} />
        <Button label="8" onClick={() => handleNumber(8)} />
        <Button label="9" onClick={() => handleNumber(9)} />
        <div style={{ gridRow: 'span 2', height: '100%' }}>
          <Button label="+" onClick={() => handleOperation('+')} variant="operator" />
        </div>
        
        <Button label="4" onClick={() => handleNumber(4)} />
        <Button label="5" onClick={() => handleNumber(5)} />
        <Button label="6" onClick={() => handleNumber(6)} />
        
        <Button label="1" onClick={() => handleNumber(1)} />
        <Button label="2" onClick={() => handleNumber(2)} />
        <Button label="3" onClick={() => handleNumber(3)} />
        <div style={{ gridRow: 'span 2', height: '100%' }}>
          <Button label="=" onClick={handleEquals} variant="operator" />
        </div>
        
        <div style={{ gridColumn: 'span 2', height: '100%' }}>
          <Button label="0" onClick={() => handleNumber(0)} />
        </div>
        <Button label="." onClick={handleDecimal} />
      </div>
    </div>
    </>
  );
};

export default CalculatorApp;

