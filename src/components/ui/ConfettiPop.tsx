'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPopProps {
  trigger: boolean;
  onDone?: () => void;
}

const COLORS = ['#a855f7', '#3b82f6', '#ec4899', '#f59e0b', '#22c55e'];
const PIECES = 30;

export function ConfettiPop({ trigger, onDone }: ConfettiPopProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        onDone?.();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [trigger, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: PIECES }).map((_, i) => {
            const color = COLORS[i % COLORS.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const size = 4 + Math.random() * 8;
            const rotation = Math.random() * 360;
            return (
              <motion.div
                key={i}
                className="absolute top-0 rounded-sm"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size * (0.4 + Math.random() * 1.2),
                  backgroundColor: color,
                }}
                initial={{ y: -20, opacity: 1, rotate: rotation }}
                animate={{
                  y: '100vh',
                  opacity: 0,
                  rotate: rotation + 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2 + Math.random() * 1.5,
                  delay,
                  ease: 'easeIn',
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
