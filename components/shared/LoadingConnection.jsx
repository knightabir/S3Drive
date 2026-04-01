'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Globe, Laptop2, Cloud, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const statusMessages = [
  "Initializing secure handshake...",
  "Establishing local-to-global tunnel...",
  "Linking to S3 Global Network...",
  "Verifying identity and credentials...",
  "Synching with AWS bucket infrastructure..."
];

export default function LoadingConnection() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full h-full min-h-[350px] relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none opacity-50" />

      <div className="relative w-full flex items-center justify-between gap-12 mb-16 z-10">

        {/* Left Side: Local */}
        <div className="relative flex flex-col items-center group">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: [0.9, 1.05, 1],
              opacity: 1
            }}
            transition={{ duration: 1 }}
            className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-black/5 flex items-center justify-center relative z-20"
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse blur-lg" />
            <Laptop2 className="w-6 h-6 text-primary" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-black/40"
          >
            Local
          </motion.span>
        </div>

        {/* Bridge: SVG Animation */}
        <div className="flex-1 relative h-20">
          <svg className="w-full h-full" overflow="visible">
            {/* The Connecting Path */}
            <motion.path
              d="M 10 40 Q 50 10, 90 40 T 170 40"
              fill="transparent"
              stroke="url(#gradient-line)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full"
              style={{ width: '100%' }}
              vectorEffect="non-scaling-stroke"
            />

            {/* Moving Data Particles */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                r="4"
                fill="#007aff"
                filter="url(#glow)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "linear"
                }}
                style={{
                  offsetPath: "path('M 10 40 Q 50 10, 90 40 T 170 40')",
                  offsetRotate: "auto"
                }}
              />
            ))}

            <defs>
              <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,122,255,0.1)" />
                <stop offset="50%" stopColor="rgba(0,122,255,0.8)" />
                <stop offset="100%" stopColor="rgba(0,122,255,0.1)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Right Side: Global */}
        <div className="relative flex flex-col items-center group">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: [0.9, 1.05, 1],
              opacity: 1
            }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-black/5 flex items-center justify-center relative z-20"
          >
            <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse blur-lg" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-black/40"
          >
            Global
          </motion.span>
        </div>
      </div>

      {/* Connection Status Text */}
      <div className="relative flex flex-col items-center z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={statusIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-bold uppercase tracking-[0.15em] text-black/60"
            >
              {statusMessages[statusIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          className="h-[2px] bg-black/5 rounded-full overflow-hidden relative"
        >
          <motion.div
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 bg-primary shadow-[0_0_10px_#007aff]"
          />
        </motion.div>
      </div>
    </div>
  );
}
