'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, FolderIcon } from 'lucide-react';
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
      // Check if the object is multipart by listing parts
      const listParts = await retryOperation(() =>
        s3Client.send(new ListPartsCommand({
          Bucket: credentials.bucketName,
          Key: key,
        }))
      );

      if (listParts.Parts && listParts.Parts.length > 0) {
        // Multipart download
        const chunks = [];
        for (const part of listParts.Parts) {
          const partNumber = part.PartNumber;
          const url = await retryOperation(() =>
            getSignedUrl(s3Client, new GetObjectCommand({
              Bucket: credentials.bucketName,
              Key: key,
              PartNumber: partNumber,
            }), { expiresIn: 3600 })
          );
          const response = await retryOperation(() => fetch(url));
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
        // Single-part download
        const url = await retryOperation(() =>
          getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: credentials.bucketName,
            Key: key,
          }), { expiresIn: 3600 })
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--primary)]">Folders</h2>
      <div className="grid gap-2">
        {folders.map((folder) => (
          <div key={folder} className="flex items-center justify-between p-2 bg-[var(--card)] rounded-md shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer text-[var(--secondary)] hover:text-[var(--primary)]" onClick={() => onFolderClick(folder)}>
              <FolderIcon className="w-5 h-5" />
              <span>{folder}</span>
            </div>
            <Button variant="outline" size="sm" className="hover:bg-[var(--brand-yellow)]" onClick={() => onDelete(folder)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-6 text-[var(--primary)]">Files</h2>
      <div className="grid gap-2">
        {contents.map((item) => (
          <div key={item.Key} className="flex items-center justify-between p-2 bg-[var(--card)] rounded-md shadow-sm">
            <div className="flex items-center gap-2 text-[var(--foreground)]">
              <FileIcon className="w-5 h-5" />
              <span>{item.Key}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hover:bg-[var(--brand-yellow)]" onClick={() => handleShare(item.Key)}>
                Share
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-[var(--brand-yellow)]" onClick={() => handleDownload(item.Key)}>
                Download
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-[var(--brand-yellow)]" onClick={() => onDelete(item.Key)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <ShareDialog url={shareUrl} opened={shareDialogOpen} onClose={() => setShareDialogOpen(false)} />
    </div>
  );
}