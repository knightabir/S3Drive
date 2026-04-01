'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle2, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareDialog({ url, opened, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="max-w-[440px] border-border bg-glass backdrop-blur-3xl p-6 shadow-2xl">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 mb-6">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Share2 className="w-5 h-5" />
           </div>
           <div>
              <DialogTitle className="text-base font-bold tracking-tight">Share File</DialogTitle>
              <p className="text-[11px] text-muted font-medium uppercase tracking-wider">Public Link (Expires in 7 days)</p>
           </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative group">
            <Input 
              value={url} 
              readOnly 
              className="w-full h-10 pl-3 pr-10 border-border bg-black/5 dark:bg-white/5 text-[13px] font-mono focus-visible:ring-primary/30" 
            />
            <Button 
               variant="ghost" 
               size="icon" 
               className="absolute right-1 top-1 h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
               onClick={handleCopy}
            >
               {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between items-center pt-2">
            <p className="text-[10px] text-muted text-left max-w-[200px]">
              Anyone with this link can view and download the file.
            </p>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="h-9 px-6 text-xs font-bold uppercase tracking-wider border-border hover:bg-black/5"
            >
              Done
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
