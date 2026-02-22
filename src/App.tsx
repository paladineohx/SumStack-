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
          ? 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 text-white shadow-[0_0_25px_rgba(251,191,36,0.5)] ring-2 ring-amber-300 ring-offset-2 ring-offset-[#F5F5F0] animate-gold-pulse' 
          : 'bg-white/80 backdrop-blur-sm text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-amber-500/50 shadow-sm'
        }`}
      style={{
        left: 0,
        top: 0,
      }}
    >
      <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">{block.value}</span>
    </motion.button>
  );
};

const GradientIcon = ({ icon: Icon, className = "" }: { icon: any, className?: string }) => (
  <div className={`relative ${className}`}>
    <Icon className="w-full h-full text-transparent" style={{ stroke: 'url(#gold-gradient)' }} />
  </div>
);

const ModeSelector = ({ onSelect }: { onSelect: (mode: GameMode) => void }) => (
  <div className="flex flex-col items-center justify-center h-full gap-8 p-6 relative z-10">
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>

    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-center"
    >
      <h1 className="text-7xl font-black tracking-tighter mb-2 gold-text-shimmer drop-shadow-2xl">
        SUMSTACK
      </h1>
      <p className="text-amber-500/60 font-medium tracking-widest uppercase text-xs">掌握数学 · 极简消除 · 黄金挑战</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
      <motion.button
        whileHover={{ scale: 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('classic')}
        className="relative p-8 bg-white/60 backdrop-blur-xl border border-amber-500/10 rounded-[40px] text-left transition-all group overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all duration-500 group-hover:rotate-12">
          <GradientIcon icon={Trophy} className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black mb-2 text-zinc-900 group-hover:text-amber-600 transition-colors">经典模式</h3>
        <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-600 transition-colors">方块不断涌现，用你的智慧筑起黄金防线。</p>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, y: -8 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('time')}
        className="relative p-8 bg-white/60 backdrop-blur-xl border border-amber-500/10 rounded-[40px] text-left transition-all group overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all duration-500 group-hover:-rotate-12">
          <GradientIcon icon={Clock} className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black mb-2 text-zinc-900 group-hover:text-amber-600 transition-colors">计时模式</h3>
        <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-600 transition-colors">在时间的洪流中，唯有冷静的头脑能点石成金。</p>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </motion.button>
    </div>
  </div>
);

const RainbowRain = () => {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 120 - 10 + "%", 
            y: -100,
            opacity: Math.random() * 0.3 + 0.2,
            rotate: 15
          }}
          animate={{
            y: "120vh",
            x: (prevX: any) => `calc(${prevX} + 50px)`,
            transition: {
              duration: Math.random() * 1.5 + 0.8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }
          }}
          className="absolute w-[1.5px] h-12 rounded-full blur-[0.5px]"
          style={{ 
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 8px ${colors[i % colors.length]}`
          }}
        />
      ))}
    </div>
  );
};

const FloatingDust = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * 100 + "%", 
          y: Math.random() * 100 + "%",
          opacity: Math.random() * 0.5,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{
          y: [null, Math.random() * -100 - 50],
          opacity: [null, 0],
          transition: {
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
      />
    ))}
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

  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    const currentSum = grid.flat()
      .filter(b => selectedIds.includes(b.id))
      .reduce((sum, b) => sum + b.value, 0);
    
    if (currentSum === target && selectedIds.length > 0) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [grid, selectedIds, target]);

  if (!mode) {
    return (
      <div className="h-screen bg-[#F5F5F0] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.05),transparent_70%)]" />
        <RainbowRain />
        <FloatingDust />
        <ModeSelector onSelect={setMode} />
      </div>
    );
  }

  const currentSum = grid.flat()
    .filter(b => selectedIds.includes(b.id))
    .reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#F5F5F0] font-sans relative overflow-hidden border-x border-zinc-200 shadow-2xl">
      <RainbowRain />
      <FloatingDust />
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </svg>
      {/* Header */}
      <div className="p-6 flex flex-col gap-4 z-10 bg-white/60 backdrop-blur-xl border-b border-zinc-200">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setMode(null)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors group"
          >
            <Home className="w-6 h-6 text-zinc-400 group-hover:text-amber-600 transition-colors" />
          </button>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-amber-500/20 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="font-mono font-bold text-amber-600">{score.toString().padStart(6, '0')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-white/80 p-4 rounded-3xl border border-zinc-200 flex flex-col items-center shadow-sm relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">目标数字</span>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <span className="text-4xl font-black text-zinc-900">{target}</span>
            </div>
          </div>

          <div className="flex-1 bg-white/80 p-4 rounded-3xl border border-zinc-200 flex flex-col items-center shadow-sm relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">当前总和</span>
            <motion.div 
              animate={currentSum > target ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`text-4xl font-black transition-colors ${currentSum > target ? 'text-red-500' : 'text-amber-600'}`}
            >
              {currentSum}
            </motion.div>
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ y: 10, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 1.2 }}
                  className="absolute top-1 right-2 pointer-events-none"
                >
                  <span className="text-amber-600 font-black text-xs drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] bg-amber-100/50 px-2 py-0.5 rounded-full border border-amber-200">完美!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {mode === 'time' && (
            <div className="flex-1 bg-white/80 p-4 rounded-3xl border border-zinc-200 flex flex-col items-center shadow-sm relative overflow-hidden">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">剩余时间</span>
              <div className={`text-4xl font-black font-mono transition-colors ${timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-amber-600'}`}>
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
              className="bg-white border-2 border-amber-500/30 p-10 rounded-[40px] text-center max-w-xs w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
              <h2 className="text-4xl font-black text-zinc-900 mb-2 gold-text-shimmer">游戏结束</h2>
              <p className="text-zinc-500 mb-8 font-medium">方块已经堆积到顶部！</p>
              
              <div className="bg-zinc-50 rounded-3xl p-6 mb-8 border border-amber-500/10 shadow-inner">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block mb-1">最终得分</span>
                <span className="text-5xl font-black text-amber-600 font-mono drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]">{score}</span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={initGame}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  再试一次
                </button>
                <button
                  onClick={() => setMode(null)}
                  className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-2xl transition-all border border-zinc-200 active:scale-95"
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
