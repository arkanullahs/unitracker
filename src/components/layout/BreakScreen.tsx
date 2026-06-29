'use client';

import { motion } from 'framer-motion';
import { Palmtree } from 'lucide-react';

export function BreakScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Palmtree size={64} className="text-white/20 mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Break Week</h2>
      <p className="text-white/40 text-center max-w-xs">
        No classes this week. You earned it. See you on Monday!
      </p>
    </motion.div>
  );
}
