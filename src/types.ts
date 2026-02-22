export type GameMode = 'classic' | 'time';

export interface BlockData {
  id: string;
  value: number;
  row: number;
  col: number;
  isSelected: boolean;
}

export interface GameState {
  grid: BlockData[][];
  target: number;
  score: number;
  mode: GameMode;
  isGameOver: boolean;
  timeLeft: number;
  selectedIds: string[];
}
