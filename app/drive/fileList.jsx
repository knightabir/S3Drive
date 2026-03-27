'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, FolderIcon, FolderOpen, Share2, Download, Trash2 } from 'lucide-react';
import { getS3Client, retryOperation } from '@/lib/s3-client';
import { GetObjectCommand, ListPartsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ShareDialog from './ShareDialog';

export default function FileList(props) {
  const { contents, folders, onFolderClick, onDelete, onShare } = props;
  const [shareUrl, setShareUrl] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const credentials = JSON.parse(localStorage.getItem('s3Credentials') || '{}');

  const handleShare = async (key) => {
    const url = await onShare(key);
    if (url) {
      setShareUrl(url);
      setShareDialogOpen(true);
    }
  };

  const handleDownload = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const listParts = await retryOperation(() =>
        s3Client.send(
          new ListPartsCommand({
            Bucket: credentials.bucketName,
            Key: key,
          })
        )
      );

      if (listParts.Parts && listParts.Parts.length > 0) {
        const chunks = [];
        for (const part of listParts.Parts) {
          const partNumber = part.PartNumber;
          const partUrl = await retryOperation(() =>
            getSignedUrl(
              s3Client,
              new GetObjectCommand({
                Bucket: credentials.bucketName,
                Key: key,
                PartNumber: partNumber,
              }),
              { expiresIn: 3600 }
            )
          );
          const response = await retryOperation(() => fetch(partUrl));
          if (!response.ok) throw new Error(`Failed to fetch part ${partNumber}`);
          const chunk = await response.blob();
          chunks.push(chunk);
        }
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = key.split('/').pop() || 'download';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const url = await retryOperation(() =>
          getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: credentials.bucketName,
              Key: key,
            }),
            { expiresIn: 3600 }
          )
        );
        const response = await retryOperation(() => fetch(url));
        if (!response.ok) throw new Error('Failed to fetch file');
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = key.split('/').pop() || 'download';
        a.click();
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (err) {
      alert('Download failed: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-[var(--border)]/80 bg-black/15 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[var(--card-foreground)]">
          <FolderOpen className="h-5 w-5 text-[var(--secondary)]" />
          Folders
        </h2>
        <div className="space-y-2">
          {folders.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
              No folders yet.
            </p>
          ) : (
            folders.map((folder) => (
              <div key={folder} className="flex items-center justify-between rounded-lg border border-[var(--border)]/70 bg-[var(--card)]/40 px-3 py-2">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-[var(--foreground)] transition hover:text-[var(--secondary)]"
                  onClick={() => onFolderClick(folder)}
                >
                  <FolderIcon className="h-4 w-4" />
                  <span>{folder}</span>
                </button>
                <Button variant="outline" size="sm" className="border-[var(--border)] bg-transparent text-[var(--foreground)]" onClick={() => onDelete(folder)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)]/80 bg-black/15 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[var(--card-foreground)]">
          <FileIcon className="h-5 w-5 text-[var(--secondary)]" />
          Files
        </h2>
        <div className="space-y-2">
          {contents.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
              No files in this location.
            </p>
          ) : (
            contents.map((item) => (
              <div key={item.Key} className="flex flex-col gap-3 rounded-lg border border-[var(--border)]/70 bg-[var(--card)]/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex items-center gap-2 text-sm text-[var(--foreground)]">
                  <FileIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.Key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-[var(--border)] bg-transparent text-[var(--foreground)]" onClick={() => handleShare(item.Key)}>
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-[var(--border)] bg-transparent text-[var(--foreground)]" onClick={() => handleDownload(item.Key)}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-[var(--border)] bg-transparent text-[var(--foreground)]" onClick={() => onDelete(item.Key)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ShareDialog url={shareUrl} opened={shareDialogOpen} onClose={() => setShareDialogOpen(false)} />
    </div>
  );
}
