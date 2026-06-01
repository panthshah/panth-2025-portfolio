import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowClockwise, Play, Pause } from '@phosphor-icons/react';
import '../styles/TetrisGame.css';

const COLS = 10;
const ROWS = 18;

const TETROMINOES = {
  I: { color: '#56c7ec', cells: [[1, 1, 1, 1]] },
  O: { color: '#f6c945', cells: [[1, 1], [1, 1]] },
  T: { color: '#b388eb', cells: [[0, 1, 0], [1, 1, 1]] },
  S: { color: '#7bd88f', cells: [[0, 1, 1], [1, 1, 0]] },
  Z: { color: '#ef6f6c', cells: [[1, 1, 0], [0, 1, 1]] },
  J: { color: '#5e8bff', cells: [[1, 0, 0], [1, 1, 1]] },
  L: { color: '#f29c52', cells: [[0, 0, 1], [1, 1, 1]] },
};
const TYPES = Object.keys(TETROMINOES);

const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const rotate = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const out = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      out[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return out;
};

const randomPiece = () => {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const cells = TETROMINOES[type].cells;
  return {
    type,
    cells,
    color: TETROMINOES[type].color,
    row: 0,
    col: Math.floor((COLS - cells[0].length) / 2),
  };
};

const collides = (board, piece, offRow, offCol, cells) => {
  const shape = cells || piece.cells;
  for (let r = 0; r < shape.length; r += 1) {
    for (let c = 0; c < shape[r].length; c += 1) {
      if (!shape[r][c]) continue;
      const nr = piece.row + r + offRow;
      const nc = piece.col + c + offCol;
      if (nc < 0 || nc >= COLS || nr >= ROWS) return true;
      if (nr >= 0 && board[nr][nc]) return true;
    }
  }
  return false;
};

const merge = (board, piece) => {
  const next = board.map((row) => row.slice());
  piece.cells.forEach((row, r) => {
    row.forEach((v, c) => {
      if (v) {
        const nr = piece.row + r;
        const nc = piece.col + c;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) next[nr][nc] = piece.color;
      }
    });
  });
  return next;
};

const clearLines = (board) => {
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const cleared = ROWS - remaining.length;
  const top = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { board: [...top, ...remaining], cleared };
};

const TetrisGame = ({ accent = '#4b57e3' }) => {
  const [board, setBoard] = useState(emptyBoard);
  const [piece, setPiece] = useState(null);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const boardRef = useRef(null);

  const spawn = useCallback((currentBoard) => {
    const next = randomPiece();
    if (collides(currentBoard, next, 0, 0)) {
      setRunning(false);
      setGameOver(true);
      return null;
    }
    return next;
  }, []);

  const start = useCallback(() => {
    const fresh = emptyBoard();
    setBoard(fresh);
    setScore(0);
    setLines(0);
    setGameOver(false);
    setPiece(randomPiece());
    setRunning(true);
    if (boardRef.current) boardRef.current.focus();
  }, []);

  const drop = useCallback(() => {
    setPiece((prev) => {
      if (!prev) return prev;
      if (!collides(board, prev, 1, 0)) {
        return { ...prev, row: prev.row + 1 };
      }
      const merged = merge(board, prev);
      const { board: clearedBoard, cleared } = clearLines(merged);
      if (cleared) {
        setLines((l) => l + cleared);
        setScore((s) => s + [0, 40, 100, 300, 1200][cleared]);
      }
      setBoard(clearedBoard);
      return spawn(clearedBoard);
    });
  }, [board, spawn]);

  const move = useCallback((dir) => {
    setPiece((prev) => (prev && !collides(board, prev, 0, dir) ? { ...prev, col: prev.col + dir } : prev));
  }, [board]);

  const rotatePiece = useCallback(() => {
    setPiece((prev) => {
      if (!prev) return prev;
      const rotated = rotate(prev.cells);
      for (const kick of [0, -1, 1, -2, 2]) {
        if (!collides(board, prev, 0, kick, rotated)) {
          return { ...prev, cells: rotated, col: prev.col + kick };
        }
      }
      return prev;
    });
  }, [board]);

  const hardDrop = useCallback(() => {
    setPiece((prev) => {
      if (!prev) return prev;
      let dist = 0;
      while (!collides(board, prev, dist + 1, 0)) dist += 1;
      const landed = { ...prev, row: prev.row + dist };
      const merged = merge(board, landed);
      const { board: clearedBoard, cleared } = clearLines(merged);
      if (cleared) {
        setLines((l) => l + cleared);
        setScore((s) => s + [0, 40, 100, 300, 1200][cleared]);
      }
      setBoard(clearedBoard);
      return spawn(clearedBoard);
    });
  }, [board, spawn]);

  useEffect(() => {
    if (!running) return undefined;
    const speed = Math.max(140, 600 - Math.floor(lines / 2) * 40);
    const id = setInterval(drop, speed);
    return () => clearInterval(id);
  }, [running, drop, lines]);

  const onKeyDown = (e) => {
    if (!running) return;
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '];
    if (keys.includes(e.key)) e.preventDefault();
    if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowDown') drop();
    else if (e.key === 'ArrowUp') rotatePiece();
    else if (e.key === ' ') hardDrop();
  };

  // Compose display board with the active piece overlaid.
  const display = board.map((row) => row.slice());
  if (piece) {
    piece.cells.forEach((row, r) => {
      row.forEach((v, c) => {
        if (v) {
          const nr = piece.row + r;
          const nc = piece.col + c;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) display[nr][nc] = piece.color;
        }
      });
    });
  }

  return (
    <div className="tetris-card" style={{ '--tetris-accent': accent }}>
      <div className="tetris-head">
        <span className="tetris-title">blocks</span>
        <div className="tetris-stats">
          <span>score <strong>{score}</strong></span>
          <span>lines <strong>{lines}</strong></span>
        </div>
      </div>

      <div
        className="tetris-stage"
        ref={boardRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="application"
        aria-label="Tetris game board"
      >
        <div className="tetris-board">
          {display.flat().map((color, i) => (
            <span key={i} className={`tetris-cell ${color ? 'is-filled' : ''}`} style={color ? { background: color } : undefined} />
          ))}
        </div>

        {(!running || gameOver) && (
          <div className="tetris-overlay">
            <p className="tetris-overlay-text">{gameOver ? `game over · ${score}` : 'wanna play?'}</p>
            <button type="button" className="tetris-start" onClick={start}>
              {gameOver ? 'play again' : 'start'}
            </button>
            <span className="tetris-hint">← → move · ↑ rotate · space drop</span>
          </div>
        )}
      </div>

      <div className="tetris-controls">
        <button type="button" aria-label="Move left" onClick={() => move(-1)}><ArrowLeft size={18} weight="bold" /></button>
        <button type="button" aria-label="Rotate" onClick={rotatePiece}><ArrowClockwise size={18} weight="bold" /></button>
        <button type="button" aria-label="Move right" onClick={() => move(1)}><ArrowRight size={18} weight="bold" /></button>
        <button type="button" aria-label="Soft drop" onClick={() => drop()}><ArrowDown size={18} weight="bold" /></button>
        <button
          type="button"
          aria-label={running ? 'Pause' : 'Play'}
          className="tetris-control-play"
          onClick={() => (running ? setRunning(false) : (gameOver ? start() : setRunning(true)))}
        >
          {running ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
      </div>
    </div>
  );
};

export default TetrisGame;
