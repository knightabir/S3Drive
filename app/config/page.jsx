'use client';

import React from 'react';
import S3LoginForm from '@/components/S3LoginForm';
import HowToConnect from './howToConnect';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import WordReveal from '@/components/shared/WordReveal';

const Page = () => {
  return (
    <main className="min-h-screen bg-background mesh-bg selection:bg-primary/20">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connection Setup</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-balance">
            <WordReveal text="Connect your AWS S3" className="block text-black" />
            <WordReveal text="workspace securely." className="block text-primary italic" />
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Add your credentials locally in-browser, validate access, and start managing files with a cleaner professional interface.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="macos-surface rounded-3xl p-8 shadow-2xl shadow-black/5"
          >
            <S3LoginForm />
          </motion.div>

          {/* Right Side: Configuration Guide */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <HowToConnect />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
