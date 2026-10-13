import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'motion/react';
import { Fact } from '../types';

interface FactCardProps {
  fact: Fact;
  onSwipe: (direction: 'left' | 'right') => void;
  isFront: boolean;
}

export const FactCard: React.FC<FactCardProps> = ({ fact, onSwipe, isFront }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const trueOpacity = useTransform(x, [50, 150], [0, 1]);
  const falseOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
    // Reset position if not swiped far enough
    x.set(0);
  };

  return (
    <motion.div
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity, zIndex: isFront ? 10 : 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 bg-white rounded-[2rem] shadow-xl border border-zinc-200 flex flex-col items-center justify-center p-8 text-center select-none ${isFront ? 'cursor-grab active:cursor-grabbing' : 'scale-95 opacity-50'}`}
    >
      {isFront && (
        <>
          <motion.div 
            style={{ opacity: trueOpacity }}
            className="absolute top-6 right-6 border-4 border-emerald-500 text-emerald-500 font-black px-4 py-1 rounded-lg rotate-12 z-20 pointer-events-none"
          >
            WAHR
          </motion.div>
          <motion.div 
            style={{ opacity: falseOpacity }}
            className="absolute top-6 left-6 border-4 border-rose-500 text-rose-500 font-black px-4 py-1 rounded-lg -rotate-12 z-20 pointer-events-none"
          >
            FALSCH
          </motion.div>
        </>
      )}

      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 leading-tight">
          {fact.text}
        </h2>
      </div>
    </motion.div>
  );
};
