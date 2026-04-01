'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, CloudCog, ArrowRight, MousePointer2, Layout, Sparkles } from "lucide-react";
import { useRef } from "react";
import Navbar, { MagneticButton } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WordReveal from "@/components/shared/WordReveal";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const mockupScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  const mockupRotate = useTransform(scrollYProgress, [0, 0.3], [0, 2]);

  return (
    <main ref={containerRef} className="min-h-screen bg-background mesh-bg selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-40 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto w-full text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-10 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure & Private S3 Workspace</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-balance">
            <WordReveal text="Manage S3 with the" className="block text-black" />
            <WordReveal text="fluidity of macOS." className="block text-primary italic" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-14 font-medium leading-relaxed"
          >
            S3Drive brings desktop-class file management to your cloud.
            Connect buckets and organize files with zero lag.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <MagneticButton
              href="/drive"
              className="macos-button-primary h-14 px-10 text-base font-bold uppercase tracking-widest shadow-2xl shadow-primary/30"
            >
              Open Workspace
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            
            <MagneticButton
              href="/config"
              className="macos-button-secondary h-14 px-10 text-base font-bold uppercase tracking-widest border border-border/50"
            >
              Configure AWS
            </MagneticButton>
          </motion.div>
        </div>

        {/* Hero Mockup */}
        <motion.div
          style={{ scale: mockupScale, rotateX: mockupRotate }}
          className="mt-32 relative w-full max-w-6xl mx-auto perspective-1000 px-4"
        >
          <div className="relative rounded-3xl border border-border shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden bg-surface/40 backdrop-blur-3xl aspect-[16/10] group">
            {/* macOS Style Header */}
            <div className="h-12 border-b border-border/10 flex items-center px-5 bg-background/30 justify-between">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-inner" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-48 h-6 rounded-lg bg-black/5 dark:bg-white/5 border border-border/10" />
              </div>
              <div className="w-12" />
            </div>
            
            {/* Mockup Grid */}
            <div className="flex h-full">
              <div className="w-64 border-r border-border/10 bg-black/5 dark:bg-white/5 p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 w-full rounded bg-primary/10 animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
                ))}
              </div>
              <div className="flex-1 p-10">
                <div className="grid grid-cols-4 md:grid-cols-5 gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 + i * 0.05 }}
                      className="aspect-square rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                    >
                      <Layout className="w-8 h-8 text-primary/30" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 right-12 p-5 rounded-2xl bg-primary/20 border border-primary/30 backdrop-blur-xl shadow-2xl"
            >
              <MousePointer2 className="text-primary w-8 h-8" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          {[
            {
              icon: CloudCog,
              title: "Instant S3 Operations",
              description: "Manage buckets with a native-feel interface designed for professionals.",
            },
            {
              icon: Layout,
              title: "macOS Interface",
              description: "A familiar Finder experience for your cloud storage. No learning curve.",
            },
            {
              icon: ShieldCheck,
              title: "Client-Side Security",
              description: "Your credentials never leave your browser. Direct AWS integration.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 transition-all group-hover:scale-110 group-hover:bg-primary/10 shadow-sm border border-primary/10">
                <feature.icon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
