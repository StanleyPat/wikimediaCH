import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FACTS } from './constants';
import { FactCard } from './components/FactCard';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, Share2, ExternalLink, Play } from 'lucide-react';

type Screen = 'start' | 'game' | 'explanation' | 'finish';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState<{ correct: boolean; explanation: string } | null>(null);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentFact = FACTS[currentIndex];
    const userChoice = direction === 'right'; // Right is True, Left is False
    const isCorrect = userChoice === currentFact.isTrue;

    if (isCorrect) {
      setScore(s => s + 1);
    }

    setLastResult({
      correct: isCorrect,
      explanation: currentFact.explanation
    });
    setScreen('explanation');
  }, [currentIndex]);

  const nextFact = () => {
    if (currentIndex < FACTS.length - 1) {
      setCurrentIndex(i => i + 1);
      setScreen('game');
    } else {
      setScreen('finish');
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setScreen('start');
    setLastResult(null);
  };

  const startGame = () => {
    setScreen('game');
  };

  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-zinc-100"
        >
          <div className="mb-8 inline-flex p-6 bg-zinc-900 rounded-3xl rotate-3">
            <Play className="w-12 h-12 text-white fill-current" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">WikiFacts Tinder</h1>
          <p className="text-zinc-500 mb-10 text-lg leading-relaxed">
            Bist du ein Fakten-Check-Profi? Entscheide, ob die Aussagen wahr oder falsch sind.
          </p>
          <button 
            onClick={startGame}
            className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Spiel starten
          </button>
        </motion.div>
      </div>
    );
  }

  if (screen === 'finish') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-zinc-100"
        >
          <div className="mb-8 inline-flex p-6 bg-amber-50 rounded-full">
            <Trophy className="w-16 h-16 text-amber-500" />
          </div>
          
          <h1 className="text-4xl font-black text-zinc-900 mb-2">Fertig!</h1>
          <p className="text-zinc-500 mb-8">Du hast alle Fakten geprüft.</p>
          
          <div className="bg-zinc-50 rounded-3xl p-8 mb-8">
            <div className="text-6xl font-black text-zinc-900 mb-2">
              {score}<span className="text-2xl text-zinc-400">/{FACTS.length}</span>
            </div>
            <div className="text-sm font-bold uppercase tracking-widest text-zinc-400">Dein Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={restartGame}
              className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Neustart
            </button>
            <button 
              className="flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Teilen
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentFact = FACTS[currentIndex];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Header */}
      <div className="max-w-md w-full mb-6 flex items-center justify-between px-2">
        <div>
          <h1 className="text-xl font-black text-zinc-900 tracking-tight">WIKIFACTS</h1>
          <div className="flex gap-1 mt-1">
            {FACTS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < currentIndex ? 'bg-zinc-900 w-4' : i === currentIndex ? 'bg-zinc-400 w-8' : 'bg-zinc-200 w-2'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Score</span>
          <div className="text-xl font-black text-zinc-900">{score}</div>
        </div>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-md aspect-[3/4] mb-6">
        <AnimatePresence mode="wait">
          {screen === 'game' ? (
            <motion.div 
              key={currentFact.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="relative w-full h-full"
            >
              {/* Next Card (Shadow) */}
              {currentIndex < FACTS.length - 1 && (
                <div className="absolute inset-0 translate-y-4 scale-95 opacity-50">
                  <FactCard 
                    fact={FACTS[currentIndex + 1]} 
                    onSwipe={() => {}} 
                    isFront={false} 
                  />
                </div>
              )}
              
              {/* Current Card */}
              <FactCard 
                fact={currentFact} 
                onSwipe={handleSwipe}
                isFront={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-10 flex flex-col items-center justify-center text-center"
            >
              <div className={`mb-6 p-4 rounded-full ${lastResult?.correct ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                {lastResult?.correct ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-rose-500" />
                )}
              </div>
              
              <h2 className={`text-2xl font-black mb-4 ${lastResult?.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                {lastResult?.correct ? 'Richtig!' : 'Falsch!'}
              </h2>
              
              <p className="text-zinc-600 text-lg mb-8 leading-relaxed">
                {lastResult?.explanation}
              </p>

              <button
                onClick={nextFact}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all group"
              >
                {currentIndex < FACTS.length - 1 ? 'Nächster Fakt' : 'Ergebnis sehen'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sources & Action Buttons */}
      {screen === 'game' && (
        <div className="max-w-md w-full flex flex-col gap-6">
          {/* Sources Section */}
          <div className="bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Recherche-Quellen</h3>
            <div className="flex flex-wrap gap-2">
              {currentFact.sources.map((source, i) => (
                <a 
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-zinc-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.label}
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => handleSwipe('left')}
              className="flex-1 bg-white border-2 border-rose-500 text-rose-500 py-4 rounded-2xl font-black text-lg hover:bg-rose-50 transition-colors shadow-sm active:scale-95"
            >
              FALSCH
            </button>
            <button 
              onClick={() => handleSwipe('right')}
              className="flex-1 bg-white border-2 border-emerald-500 text-emerald-500 py-4 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-colors shadow-sm active:scale-95"
            >
              WAHR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
