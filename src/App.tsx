import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Trophy, Clock, RotateCcw, Home } from 'lucide-react';
import { GameMode, BlockData } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import { GRID_ROWS, GRID_COLS, TIME_LIMIT } from './constants';

const Block = ({ block, isSelected, onClick }: { block: BlockData, isSelected: boolean, onClick: () => void, key?: string }) => {
  return (
    <motion.button
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: block.row * 56,
        x: block.col * 56,
      }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05, y: block.row * 56 - 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300
        ${isSelected 
          ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] ring-2 ring-red-400 ring-offset-2 ring-offset-[#080505]' 
          : 'bg-zinc-900/50 backdrop-blur-sm text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-600 shadow-inner'
        }`}
      style={{
        left: 0,
        top: 0,
      }}
    >
      <span className="drop-shadow-sm">{block.value}</span>
    </motion.button>
  );
};

const ModeSelector = ({ onSelect }: { onSelect: (mode: GameMode) => void }) => (
  <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-center"
    >
      <h1 className="text-6xl font-black tracking-tighter text-red-500 mb-2">SUMSTACK</h1>
      <p className="text-zinc-500 font-medium">掌握数学，消除方块</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
      <motion.button
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('classic')}
        className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[32px] text-left hover:border-red-500/50 transition-all group shadow-xl"
      >
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
          <Trophy className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold mb-1 text-zinc-100">经典模式</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">每次成功消除都会新增一行。挑战生存极限。</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('time')}
        className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[32px] text-left hover:border-blue-500/50 transition-all group shadow-xl"
      >
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
          <Clock className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold mb-1 text-zinc-100">计时模式</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">在倒计时结束前完成求和。超时将新增一行。</p>
      </motion.button>
    </div>
  </div>
);

export default function App() {
  const [mode, setMode] = React.useState<GameMode | null>(null);
  const { 
    grid, 
    target, 
    score, 
    isGameOver, 
    timeLeft, 
    selectedIds, 
    toggleBlock, 
    initGame 
  } = useGameLogic(mode);

  if (!mode) {
    return (
      <div className="h-screen bg-[#080505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_70%)]" />
        <ModeSelector onSelect={setMode} />
      </div>
    );
  }

  const currentSum = grid.flat()
    .filter(b => selectedIds.includes(b.id))
    .reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#080505] font-sans relative overflow-hidden border-x border-zinc-900 shadow-2xl">
      {/* Header */}
      <div className="p-6 flex flex-col gap-4 z-10 bg-[#080505]/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setMode(null)}
            className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
          >
            <Home className="w-6 h-6 text-zinc-500" />
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <Trophy className="w-4 h-4 text-red-500" />
            <span className="font-mono font-bold text-red-500">{score.toString().padStart(6, '0')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">目标数字</span>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-4xl font-black text-white">{target}</span>
            </div>
          </div>

          <div className="flex-1 bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">当前总和</span>
            <motion.div 
              animate={currentSum > target ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`text-4xl font-black transition-colors ${currentSum > target ? 'text-red-500' : 'text-blue-500'}`}
            >
              {currentSum}
            </motion.div>
          </div>

          {mode === 'time' && (
            <div className="flex-1 bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">剩余时间</span>
              <div className={`text-4xl font-black font-mono transition-colors ${timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                {timeLeft}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 relative p-4 grid-background overflow-hidden flex justify-center items-center">
        <div className="relative" style={{ width: GRID_COLS * 56, height: GRID_ROWS * 56 }}>
          {/* Danger Line */}
          <div className="absolute top-0 left-0 w-full h-px bg-red-500/30 border-t border-dashed border-red-500/50 z-0" />
          
          <AnimatePresence mode="popLayout">
            {grid.flat().map((block) => (
              <Block
                key={block.id}
                block={block}
                isSelected={selectedIds.includes(block.id)}
                onClick={() => toggleBlock(block.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex flex-center items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] text-center max-w-xs w-full shadow-2xl"
            >
              <h2 className="text-4xl font-black text-white mb-2">游戏结束</h2>
              <p className="text-zinc-500 mb-8 font-medium">方块已经堆积到顶部！</p>
              
              <div className="bg-zinc-950 rounded-3xl p-6 mb-8 border border-zinc-800">
                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block mb-1">最终得分</span>
                <span className="text-5xl font-black text-red-500 font-mono">{score}</span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={initGame}
                  className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                >
                  <RotateCcw className="w-5 h-5" />
                  再试一次
                </button>
                <button
                  onClick={() => setMode(null)}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-2xl transition-all"
                >
                  返回主菜单
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
