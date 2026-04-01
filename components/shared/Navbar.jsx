'use client';

import Link from "next/link";
import { motion, useSpring } from "framer-motion";
import { Database } from "lucide-react";
import { useRef, useState } from "react";

const springConfig = { stiffness: 150, damping: 20, mass: 1 };

export const MagneticButton = ({ children, className, href }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const x = useSpring(position.x, springConfig);
  const y = useSpring(position.y, springConfig);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="magnetic-area inline-block"
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
};

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-5 flex items-center justify-between glass-header">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2.5"
      >
        <Link href="/" className="flex items-center gap-2.5 outline-none">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30">
            <Database className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">S3Drive</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-8"
      >
        <Link href="/drive" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          Launch
        </Link>
        <MagneticButton
          href="/drive"
          className="macos-button-primary bg-primary h-10 px-6 shadow-xl shadow-primary/20 text-xs font-bold uppercase tracking-wider"
        >
          Get Started
        </MagneticButton>
      </motion.div>
    </nav>
  );
}
