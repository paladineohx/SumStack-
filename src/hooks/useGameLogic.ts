import { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, BlockData } from '../types';
import { 
  GRID_ROWS, 
  GRID_COLS, 
  INITIAL_ROWS, 
  MIN_NUMBER, 
  MAX_NUMBER, 
  TARGET_MIN, 
  TARGET_MAX, 
  TIME_LIMIT 
} from '../constants';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createBlock = (row: number, col: number): BlockData => ({
  id: generateId(),
  value: Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER,
  row,
  col,
  isSelected: false,
});

export const useGameLogic = (mode: GameMode | null) => {
  const [grid, setGrid] = useState<BlockData[][]>([]);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTarget = useCallback(() => {
    setTarget(Math.floor(Math.random() * (TARGET_MAX - TARGET_MIN + 1)) + TARGET_MIN);
  }, []);

  const addNewRow = useCallback(() => {
    setGrid(prev => {
      // Check if top row has any blocks
      if (prev.some(row => row.some(block => block.row === 0))) {
        setIsGameOver(true);
        return prev;
      }

      // Shift existing blocks up
      const shiftedGrid = prev.map(row => 
        row.map(block => ({ ...block, row: block.row - 1 }))
      );

      // Add new row at the bottom
      const newRow: BlockData[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        newRow.push(createBlock(GRID_ROWS - 1, col));
      }

      return [...shiftedGrid, newRow];
    });
  }, []);

  const initGame = useCallback(() => {
    const initialGrid: BlockData[][] = [];
    for (let r = GRID_ROWS - INITIAL_ROWS; r < GRID_ROWS; r++) {
      const row: BlockData[] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        row.push(createBlock(r, c));
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(TIME_LIMIT);
    setSelectedIds([]);
    generateTarget();
  }, [generateTarget]);

  useEffect(() => {
    if (mode) {
      initGame();
    }
  }, [mode, initGame]);

  // Timer logic for Time Mode
  useEffect(() => {
    if (mode === 'time' && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            addNewRow();
            return TIME_LIMIT;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isGameOver, addNewRow]);

  const toggleBlock = (id: string) => {
    if (isGameOver) return;

    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    const currentSum = grid.flat()
      .filter(b => selectedIds.includes(b.id))
      .reduce((sum, b) => sum + b.value, 0);

    if (currentSum === target) {
      // Success!
      setScore(s => s + selectedIds.length * 10);
      
      setGrid(prev => {
        // 1. Remove selected blocks
        const remainingBlocks = prev.flat().filter(b => !selectedIds.includes(b.id));
        
        // 2. Group by column and apply gravity
        const newGrid: BlockData[][] = [];
        const columns: BlockData[][] = Array.from({ length: GRID_COLS }, () => []);
        
        remainingBlocks.forEach(b => {
          columns[b.col].push(b);
        });
        
        // Sort each column by row (bottom to top) and re-assign rows
        columns.forEach((colBlocks, colIndex) => {
          colBlocks.sort((a, b) => b.row - a.row); // Sort descending (bottom-most first)
          colBlocks.forEach((block, index) => {
            block.row = GRID_ROWS - 1 - index;
          });
        });
        
        // Reconstruct grid rows (though we mostly care about the flat list for rendering)
        // For simplicity, we can just return the updated blocks in their new rows
        const updatedBlocks = columns.flat();
        const rows: BlockData[][] = Array.from({ length: GRID_ROWS }, () => []);
        updatedBlocks.forEach(b => {
          rows[b.row].push(b);
        });
        
        return rows.filter(r => r.length > 0);
      });

      setSelectedIds([]);
      generateTarget();
      
      if (mode === 'classic') {
        addNewRow();
      } else if (mode === 'time') {
        setTimeLeft(TIME_LIMIT);
      }
    } else if (currentSum > target) {
      // Exceeded target, clear selection
      setSelectedIds([]);
    }
  }, [selectedIds, target, grid, mode, addNewRow, generateTarget]);

  return {
    grid,
    target,
    score,
    isGameOver,
    timeLeft,
    selectedIds,
    toggleBlock,
    initGame
  };
};
