import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { useSound } from '@/hooks/useSound';
import { usePreferenceStore } from '@/store/preferenceStore';

export default function WinnerBanner({ winnerUsername, isYou, onGoToResults, onLeave }) {
  const { playVictory, playThap } = useSound();
  const customShout = usePreferenceStore((s) => s.preferences.customThapShout || 'THAP!');

  useEffect(() => {
    if (isYou) {
      playVictory();
    } else {
      playThap();
    }
  }, [isYou, playVictory, playThap]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 p-space-md backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="rounded-2xl bg-surface-container-lowest px-space-xl py-space-xl text-center shadow-2xl border border-secondary-container/40 max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-space-md shadow-lg glow-kumkum">
          <Icon name="front_hand" size={40} className="text-on-primary" />
        </div>
        <p className="font-chalk text-headline-sm text-primary">
          {isYou ? `You won! ${customShout} 🎉` : `${winnerUsername} won the round!`}
        </p>
        <p className="mt-space-xs font-hand text-title-md text-on-surface-variant">
          {isYou ? 'Four of a kind collected!' : 'Better luck next round in the baithak.'}
        </p>

        <div className="mt-space-lg flex flex-col sm:flex-row items-center gap-space-sm w-full">
          <Button
            className="w-full justify-center shadow-md hover:glow-gold"
            onClick={onGoToResults}
          >
            See Results
          </Button>
          {onLeave && (
            <Button
              variant="ghost"
              className="w-full justify-center flex items-center gap-1 text-error border-error/40 hover:bg-error/10 hover:text-error"
              onClick={onLeave}
            >
              <Icon name="logout" size={16} />
              <span>Leave Room</span>
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
