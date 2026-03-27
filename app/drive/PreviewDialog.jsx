'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];
const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
const textExtensions = ['txt', 'json', 'csv', 'md', 'log', 'xml', 'yaml', 'yml'];

function getExtension(fileName) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export default function PreviewDialog({ opened, onClose, fileKey, previewUrl }) {
  const extension = getExtension(fileKey || '');
  const fileName = fileKey?.split('/').pop() || 'File';

  let content = (
    <div className="rounded-lg border border-[var(--border)]/80 bg-black/20 p-6 text-center text-sm text-[var(--muted-foreground)]">
      Preview is not available for this file type.
    </div>
  );

  if (imageExtensions.includes(extension)) {
    content = (
      <div className="overflow-hidden rounded-lg border border-[var(--border)]/80 bg-black/25">
        <img src={previewUrl} alt={fileName} className="max-h-[65vh] w-full object-contain" />
      </div>
    );
  } else if (videoExtensions.includes(extension)) {
    content = (
      <video controls className="w-full rounded-lg border border-[var(--border)]/80 bg-black/25">
        <source src={previewUrl} />
        Your browser does not support video preview.
      </video>
    );
  } else if (audioExtensions.includes(extension)) {
    content = (
      <div className="rounded-lg border border-[var(--border)]/80 bg-black/25 p-4">
        <audio controls className="w-full">
          <source src={previewUrl} />
          Your browser does not support audio preview.
        </audio>
      </div>
    );
  } else if (extension === 'pdf') {
    content = <iframe src={previewUrl} title={fileName} className="h-[65vh] w-full rounded-lg border border-[var(--border)]/80 bg-white" />;
  } else if (textExtensions.includes(extension)) {
    content = (
      <iframe
        src={previewUrl}
        title={fileName}
        className="h-[65vh] w-full rounded-lg border border-[var(--border)]/80 bg-white"
      />
    );
  }

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto border-[var(--border)] bg-[var(--card)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--card-foreground)]">Preview: {fileName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {content}
          <div className="flex justify-end">
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-[var(--border)] bg-transparent text-[var(--foreground)]">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
