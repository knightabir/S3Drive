'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Laptop2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const statusMessages = ['Connecting…', 'Establishing secure connection…'];

export default function ConnectionLoader() {
  const [statusIndex, setStatusIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setStatusIndex((previous) => (previous + 1) % statusMessages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section
      className="relative flex min-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-6"
      role="status"
      aria-live="polite"
      aria-label="Connecting local system to global internet"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10" />

      <div className="relative z-10 flex w-full max-w-xl items-center justify-between gap-6 md:gap-10">
        <div className="flex flex-col items-center gap-2" aria-label="Local system node">
          <motion.div
            animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-background shadow-lg"
          >
            <span className="absolute inset-0 rounded-2xl bg-primary/10 blur-md" aria-hidden="true" />
            <Laptop2 className="z-10 h-7 w-7 text-primary" aria-hidden="true" />
          </motion.div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Local System</p>
        </div>

        <div className="relative h-20 flex-1" aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 260 80" preserveAspectRatio="none">
            <motion.path
              d="M 5 40 Q 60 8, 130 40 T 255 40"
              fill="transparent"
              stroke="url(#connection-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: 'easeInOut' }}
            />

            {!prefersReducedMotion &&
              [0, 1, 2, 3].map((node) => (
                <motion.circle
                  key={node}
                  r="3.5"
                  fill="#0a84ff"
                  filter="url(#node-glow)"
                  initial={{ offsetDistance: '0%' }}
                  animate={{ offsetDistance: '100%' }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: node * 0.45 }}
                  style={{
                    offsetPath: "path('M 5 40 Q 60 8, 130 40 T 255 40')",
                    offsetRotate: 'auto',
                  }}
                />
              ))}

            <defs>
              <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(10,132,255,0.2)" />
                <stop offset="50%" stopColor="rgba(10,132,255,1)" />
                <stop offset="100%" stopColor="rgba(10,132,255,0.2)" />
              </linearGradient>
              <filter id="node-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2" aria-label="Global internet node">
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-background shadow-lg"
          >
            <span className="absolute inset-0 rounded-2xl bg-primary/10 blur-md" aria-hidden="true" />
            <Globe className="z-10 h-7 w-7 text-primary" aria-hidden="true" />
          </motion.div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Global Internet</p>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -6 }}
            className="text-sm font-semibold text-foreground"
          >
            {statusMessages[statusIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="text-xs text-muted-foreground">Encrypted handshake in progress.</p>
      </div>
    </section>
  );
}
