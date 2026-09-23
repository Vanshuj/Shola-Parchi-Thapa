import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
export default function WinnerBanner({ winnerUsername, isYou, onGoToResults }) {
    return (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 p-space-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="rounded-2xl bg-surface-container-lowest px-space-xl py-space-xl text-center shadow-2xl" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-space-md">
          <Icon name="front_hand" size={32} className="text-on-primary"/>
        </div>
        <p className="font-chalk text-title-lg text-primary">
          {isYou ? 'You won! 🎉' : `${winnerUsername} won the round!`}
        </p>
        <p className="mt-space-xs font-hand text-title-md text-on-surface-variant">
          {isYou ? 'Four of a kind — solah parchi thap!' : 'Better luck next round.'}
        </p>
        <Button className="mt-space-lg" onClick={onGoToResults}>
          See results
        </Button>
      </motion.div>
    </motion.div>);
}
