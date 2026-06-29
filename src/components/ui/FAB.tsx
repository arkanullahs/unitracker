'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  label?: string;
}

export function FAB({ onClick, label = 'Add' }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(45, 212, 191, 0.9))',
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        boxShadow: [
          '0px 4px 15px rgba(45, 212, 191, 0.2)',
          '0px 4px 25px rgba(45, 212, 191, 0.6)',
          '0px 4px 15px rgba(45, 212, 191, 0.2)'
        ]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      aria-label={label}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <Plus size={24} className="text-white relative z-10" strokeWidth={2.5} />
    </motion.button>
  );
}
