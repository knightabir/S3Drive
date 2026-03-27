'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareDialog({ url, opened, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="border-[var(--border)] bg-[var(--card)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--card-foreground)]">Share File Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={url} readOnly className="w-full border-[var(--border)] bg-[var(--input)] text-[var(--foreground)]" />
          <DialogFooter>
            <Button onClick={handleCopy} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110">
              {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
