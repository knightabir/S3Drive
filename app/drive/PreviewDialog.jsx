'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, X, FileText, ImageIcon, Video, Music, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];
const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
const textExtensions = ['txt', 'json', 'csv', 'md', 'log', 'xml', 'yaml', 'yml'];

function getExtension(fileName) {
  if (!fileName || typeof fileName !== 'string') return '';
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export default function PreviewDialog({ opened, onClose, fileKey, previewUrl }) {
  const extension = getExtension(fileKey || '');
  const fileName = (typeof fileKey === 'string' ? fileKey : '').split('/').pop() || 'File';

  let content = (
    <div className="rounded-xl border border-border bg-black/5 dark:bg-white/5 p-12 text-center">
      <p className="text-sm text-muted font-medium">Quick Look is not available for this file type.</p>
      <Button variant="link" className="mt-2 text-primary" onClick={() => window.open(previewUrl, '_blank')}>
         Try opening in new tab
      </Button>
    </div>
  );

  if (imageExtensions.includes(extension)) {
    content = (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center min-h-[400px] shadow-inner border border-border/50"
      >
        <img 
          src={previewUrl} 
          alt={fileName} 
          className="max-h-[70vh] w-auto object-contain shadow-2xl transition-transform duration-700 select-none hover:scale-[1.01]" 
        />
      </motion.div>
    );
  } else if (videoExtensions.includes(extension)) {
    content = (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
      >
        <video controls autoPlay className="w-full rounded-2xl border border-border bg-black shadow-2xl ring-1 ring-white/10">
          <source src={previewUrl} />
          Your browser does not support video preview.
        </video>
      </motion.div>
    );
  } else if (audioExtensions.includes(extension)) {
    content = (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-surface p-12 shadow-xl flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-sm">
          <Music className="w-8 h-8" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg">{fileName}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Audio Recording</p>
        </div>
        <audio controls className="w-full h-10 mt-4">
          <source src={previewUrl} />
          Your browser does not support audio preview.
        </audio>
      </motion.div>
    );
  } else if (extension === 'pdf' || textExtensions.includes(extension)) {
    content = (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden h-[75vh]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 invisible group-hover:visible" />
        <iframe src={previewUrl} title={fileName} className="w-full h-full border-none" />
      </motion.div>
    );
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl border-border bg-glass backdrop-blur-3xl p-0 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
        {/* macOS Style Integrated Header */}
        <div className="flex items-center justify-between px-5 h-12 border-b border-border bg-white/50 dark:bg-black/20 z-10">
          <div className="flex items-center gap-2">
            <Button 
               variant="outline" 
               size="sm" 
               className="h-7 text-[10px] font-bold px-3 rounded-md bg-white hover:bg-zinc-50 border-border/50 shadow-sm"
               onClick={onClose}
            >
               DONE
            </Button>
          </div>
          
          <div className="flex items-center gap-2 max-w-[50%] min-w-0">
             <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="w-3 h-3" />
             </div>
             <DialogTitle className="text-[12px] font-bold tracking-tight text-black truncate">{fileName}</DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button 
               variant="ghost" 
               size="icon" 
               className="w-7 h-7 rounded-md hover:bg-black/5"
               onClick={() => window.open(previewUrl, '_blank')}
               title="Open in new window"
            >
               <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            {content}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
