import { useState } from 'react';
import { CaretLeft } from '@phosphor-icons/react';

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
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return current !== 0 ? prev / current : 0;
      default: return current;
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

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const Button = ({ label, onClick, variant = 'number' }) => {
    const getStyle = () => {
      const base = {
        border: 'none',
        fontSize: '24px',
        fontWeight: '700',
        fontFamily: '"Samsung Sharp Sans", -apple-system, sans-serif',
        cursor: 'pointer',
        borderRadius: '24px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
        width: '100%',
        height: '100%',
        color: '#fff',
        padding: 0
      };

      switch (variant) {
        case 'operator':
          return {
            ...base,
            background: 'rgba(255, 255, 255, 0.12)',
            fontSize: '28px',
            fontWeight: '700'
          };
        case 'top':
          return {
            ...base,
            background: 'rgba(255, 255, 255, 0.12)',
            fontSize: '18px'
          };
        case 'equals':
          return {
            ...base,
            background: 'rgba(255, 255, 255, 0.12)',
            color: '#00D4AA',
            fontSize: '28px',
            fontWeight: '700'
          };
        default:
          return {
            ...base,
            background: 'transparent',
            fontSize: '24px',
            fontWeight: '500'
          };
      }
    };

    return (
      <button
        style={getStyle()}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          if (variant === 'number') e.currentTarget.style.background = 'transparent';
          else e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: '120px', // Much more clearance for camera area
      borderRadius: '6px 6px 0 0',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      background: 'transparent', 
    }}>
      {/* Header / Back Button */}
      <div style={{ height: '40px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CaretLeft size={24} weight="bold" />
        </button>
      </div>

      {/* Display Area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: '12px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        marginBottom: '8px',
        flex: 1 // Take remaining space
      }}>
        {previousValue !== null && (
          <div style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
            marginBottom: '4px',
            fontFamily: '"Samsung Sharp Sans", sans-serif',
            fontWeight: '700'
          }}>
            {previousValue} {operation}
          </div>
        )}
        <div style={{
          color: '#fff',
          fontSize: '32px',
          fontWeight: '700',
          fontFamily: '"Samsung Sharp Sans", sans-serif',
          lineHeight: 1
        }}>
          {display}
        </div>
      </div>

      {/* Keypad - Fixed Height to prevent overlap */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '5px',
        height: '200px', // Even more compact to ensure clearance
        width: '100%'
      }}>
        {/* Row 1 */}
        <Button label="C" onClick={handleClear} variant="top" />
        <Button label="( )" onClick={() => {}} variant="top" />
        <Button label="%" onClick={handlePercent} variant="top" />
        <Button label="÷" onClick={() => handleOperation('÷')} variant="operator" />

        {/* Row 2 */}
        <Button label="7" onClick={() => handleNumber(7)} />
        <Button label="8" onClick={() => handleNumber(8)} />
        <Button label="9" onClick={() => handleNumber(9)} />
        <Button label="×" onClick={() => handleOperation('×')} variant="operator" />

        {/* Row 3 */}
        <Button label="4" onClick={() => handleNumber(4)} />
        <Button label="5" onClick={() => handleNumber(5)} />
        <Button label="6" onClick={() => handleNumber(6)} />
        <Button label="-" onClick={() => handleOperation('-')} variant="operator" />

        {/* Row 4 */}
        <Button label="1" onClick={() => handleNumber(1)} />
        <Button label="2" onClick={() => handleNumber(2)} />
        <Button label="3" onClick={() => handleNumber(3)} />
        <Button label="+" onClick={() => handleOperation('+')} variant="operator" />

        {/* Row 5 */}
        <Button label="+/-" onClick={handleToggleSign} />
        <Button label="0" onClick={() => handleNumber(0)} />
        <Button label="." onClick={handleDecimal} />
        <Button label="=" onClick={handleEquals} variant="equals" />
      </div>
    </div>
  );
};

export default CalculatorApp;