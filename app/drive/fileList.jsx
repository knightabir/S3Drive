'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FolderIcon,
  Share2,
  Download,
  Trash2,
  Eye,
  FileText,
  FileJson,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FileSpreadsheet,
} from 'lucide-react';
import { getS3Client, retryOperation } from '@/lib/s3-client';
import { GetObjectCommand, ListPartsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import ShareDialog from './ShareDialog';
import PreviewDialog from './PreviewDialog';

function getExtension(key = '') {
  const parts = key.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function getTypeInfo(key = '') {
  const ext = getExtension(key);

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(ext)) {
    return { label: 'Image', Icon: FileImage, color: 'text-blue-600' };
  }
  if (['mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v'].includes(ext)) {
    return { label: 'Video', Icon: FileVideo, color: 'text-purple-600' };
  }
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) {
    return { label: 'Audio', Icon: FileAudio, color: 'text-pink-600' };
  }
  if (['json'].includes(ext)) {
    return { label: 'JSON File', Icon: FileJson, color: 'text-amber-600' };
  }
  if (['md', 'markdown'].includes(ext)) {
    return { label: 'Markdown File', Icon: FileText, color: 'text-sky-700' };
  }
  if (['csv', 'xls', 'xlsx'].includes(ext)) {
    return { label: 'Spreadsheet', Icon: FileSpreadsheet, color: 'text-emerald-600' };
  }
  if (['zip', 'rar', '7z', 'gz', 'tar'].includes(ext)) {
    return { label: 'Archive', Icon: FileArchive, color: 'text-orange-600' };
  }
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'xml', 'yaml', 'yml'].includes(ext)) {
    return { label: 'Code File', Icon: FileCode, color: 'text-indigo-600' };
  }
  if (['txt', 'log', 'pdf'].includes(ext)) {
    return { label: ext === 'pdf' ? 'PDF File' : 'Text File', Icon: FileText, color: 'text-gray-600' };
  }

  return { label: ext ? `${ext.toUpperCase()} File` : 'File', Icon: FileText, color: 'text-gray-600' };
}

function formatBytes(bytes = 0) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const value = Number(bytes);
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(dateLike) {
  if (!dateLike) return '';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export default function FileList(props) {
  const { contents, folders, onFolderClick, onDelete, onShare, onPreview, currentPrefix, onNavigateRoot, onNavigateUp } = props;
  const [shareUrl, setShareUrl] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewKey, setPreviewKey] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const credentials = JSON.parse(localStorage.getItem('s3Credentials') || '{}');

  const rows = useMemo(() => {
    const folderRows = folders.map((folder) => {
      const folderName = folder.replace(currentPrefix, '').replace(/\/$/, '');
      return {
        id: folder,
        key: folder,
        name: folderName || folder,
        type: 'File folder',
        modified: '',
        size: '',
        isFolder: true,
      };
    });

    const fileRows = contents.map((item) => {
      const typeInfo = getTypeInfo(item.Key);
      return {
        id: item.Key,
        key: item.Key,
        name: item.Key.replace(currentPrefix, ''),
        type: typeInfo.label,
        modified: formatDate(item.LastModified),
        size: formatBytes(item.Size),
        isFolder: false,
        typeInfo,
      };
    });

    return [...folderRows, ...fileRows];
  }, [folders, contents, currentPrefix]);

  const handleShare = async (key) => {
    const url = await onShare(key);
    if (url) {
      setShareUrl(url);
      setShareDialogOpen(true);
    }
  };

  const handlePreview = async (key) => {
    const url = await onPreview(key);
    if (url) {
      setPreviewUrl(url);
      setPreviewKey(key);
      setPreviewDialogOpen(true);
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
    <div className="grid h-[calc(100vh-210px)] grid-cols-12 overflow-hidden rounded-md border border-[#dadce0] bg-white text-[#1f1f1f] shadow-sm">
      <aside className="col-span-12 border-r border-[#e8eaed] bg-[#f8f9fa] p-3 sm:col-span-4 lg:col-span-3">
        <h2 className="mb-2 text-sm font-semibold">Quick access</h2>
        <div className="space-y-1 text-sm">
          <button
            type="button"
            onClick={onNavigateRoot}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-[#e8f0fe]"
          >
            <FolderIcon className="h-4 w-4 text-yellow-500" />
            Root
          </button>
          <button
            type="button"
            onClick={onNavigateUp}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-[#e8f0fe]"
          >
            <FolderIcon className="h-4 w-4 text-yellow-500" />
            Up one level
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              type="button"
              onClick={() => onFolderClick(folder)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-[#e8f0fe]"
            >
              <FolderIcon className="h-4 w-4 text-yellow-500" />
              <span className="truncate">{folder.replace(currentPrefix, '').replace(/\/$/, '')}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="col-span-12 flex min-h-0 flex-col sm:col-span-8 lg:col-span-9">
        <div className="flex items-center justify-between border-b border-[#e8eaed] bg-[#f3f3f3] px-3 py-2">
          <p className="text-sm text-[#5f6368]">This PC &gt; S3 Drive &gt; {currentPrefix || 'Root'}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-[#eceff1] text-left text-xs uppercase tracking-wide text-[#5f6368]">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Date modified</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Size</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-sm text-[#5f6368]">
                    This folder is empty.
                  </td>
                </tr>
              )}

              {rows.map((row) => {
                const Icon = row.isFolder ? FolderIcon : row.typeInfo?.Icon || FileText;
                const color = row.isFolder ? 'text-yellow-500' : row.typeInfo?.color || 'text-gray-600';

                return (
                  <tr key={row.id} className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa]">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="flex items-center gap-2"
                        onDoubleClick={() => (row.isFolder ? onFolderClick(row.key) : handlePreview(row.key))}
                        onClick={() => (row.isFolder ? onFolderClick(row.key) : undefined)}
                      >
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className="max-w-[360px] truncate text-left">{row.name}</span>
                      </button>
                    </td>
                    <td className="px-3 py-2 text-[#5f6368]">{row.modified}</td>
                    <td className="px-3 py-2 text-[#5f6368]">{row.type}</td>
                    <td className="px-3 py-2 text-[#5f6368]">{row.size}</td>
                    <td className="px-3 py-2">
                      {row.isFolder ? (
                        <Button size="sm" variant="outline" className="h-7 border-[#dadce0] text-[#1f1f1f]" onClick={() => onDelete(row.key)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 border-[#dadce0] text-[#1f1f1f]" onClick={() => handlePreview(row.key)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 border-[#dadce0] text-[#1f1f1f]" onClick={() => handleShare(row.key)}>
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 border-[#dadce0] text-[#1f1f1f]" onClick={() => handleDownload(row.key)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 border-[#dadce0] text-[#1f1f1f]" onClick={() => onDelete(row.key)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <ShareDialog url={shareUrl} opened={shareDialogOpen} onClose={() => setShareDialogOpen(false)} />
      <PreviewDialog
        fileKey={previewKey}
        previewUrl={previewUrl}
        opened={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
      />
    </div>
  );
}
