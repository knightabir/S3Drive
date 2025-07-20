'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';

export default function ShareDialog({ url, opened, onClose }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[var(--primary)]">Share File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={url} readOnly className="w-full text-[var(--foreground)]" />
          <DialogFooter>
            <Button onClick={handleCopy} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--brand-orange)]">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}