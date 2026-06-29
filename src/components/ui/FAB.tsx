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
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg group"
      style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(45, 212, 191, 0.9))',
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        boxShadow: [
          '0px 4px 15px rgba(45, 212, 191, 0.1)',
          '0px 4px 20px rgba(45, 212, 191, 0.3)',
          '0px 4px 15px rgba(45, 212, 191, 0.1)'
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      aria-label={label}
    >
      <Plus size={24} className="text-white relative z-10 opacity-90 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
    </motion.button>
  );
}
