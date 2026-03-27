'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import UploadDropzone from './UploadDropzone';
import { getS3Client } from '@/lib/s3-client';
import { ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import FileList from './fileList';
import { ChevronRight, ArrowUpFromLine, FolderPlus, HardDriveUpload } from 'lucide-react';

function toSegments(prefix) {
  return prefix.split('/').filter(Boolean);
}

function parentPrefix(prefix) {
  const segments = toSegments(prefix);
  if (segments.length === 0) return '';
  return `${segments.slice(0, -1).join('/')}${segments.length > 1 ? '/' : ''}`;
}

function getPathParts(prefix) {
  const segments = toSegments(prefix);
  const parts = [{ label: 'Root', value: '' }];

  let build = '';
  segments.forEach((segment) => {
    build += `${segment}/`;
    parts.push({ label: segment, value: build });
  });

  return parts;
}

export default function DrivePage() {
  const [credentials, setCredentials] = useState(null);
  const [prefix, setPrefix] = useState('');
  const [contents, setContents] = useState([]);
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadTarget, setUploadTarget] = useState('current');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('s3Credentials');
    if (!stored) {
      router.push('/config');
      return;
    }
    setCredentials(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    if (credentials) {
      fetchBucketContents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials, prefix]);

  const fetchBucketContents = async () => {
    try {
      setError(null);
      const s3Client = getS3Client(credentials);
      const command = new ListObjectsV2Command({
        Bucket: credentials.bucketName,
        Prefix: prefix,
        Delimiter: '/',
      });
      const response = await s3Client.send(command);
      setContents((response.Contents || []).filter((item) => item.Key !== prefix));
      setFolders((response.CommonPrefixes && response.CommonPrefixes.map((p) => p.Prefix)) || []);
    } catch (err) {
      setError('Failed to list contents: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    try {
      const s3Client = getS3Client(credentials);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: credentials.bucketName,
          Key: `${prefix}${newFolderName}/`,
          Body: '',
        })
      );
      setFolderModalOpen(false);
      setNewFolderName('');
      fetchBucketContents();
    } catch (err) {
      setError('Failed to create folder: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
        })
      );
      fetchBucketContents();
    } catch (err) {
      setError('Failed to delete: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  const handleShare = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
        }),
        { expiresIn: 604800 }
      );
      return url;
    } catch (err) {
      setError('Failed to generate share link: ' + (err && err.message ? err.message : 'Unknown error'));
      return '';
    }
  };

  const handlePreview = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
        }),
        { expiresIn: 3600 }
      );
      return url;
    } catch (err) {
      setError('Failed to generate preview link: ' + (err && err.message ? err.message : 'Unknown error'));
      return '';
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('s3Credentials');
    router.push('/config');
  };

  if (!credentials) return null;

  const pathParts = getPathParts(prefix);
  const effectiveUploadPrefix = uploadTarget === 'root' ? '' : prefix;

  return (
    <main className="w-full px-2 pb-3 pt-2 sm:px-3">
      <section className="w-full">
        <div className="overflow-hidden rounded-md border border-[#d0d7de] bg-white text-[#1f1f1f] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8eaed] bg-[#f3f3f3] px-3 py-2">
            <div>
              <h1 className="text-base font-semibold">File Explorer - S3 Drive</h1>
              <p className="text-xs text-[#5f6368]">Bucket: {credentials.bucketName}</p>
            </div>
            <Button variant="destructive" onClick={handleDisconnect} className="h-8">
              Disconnect
            </Button>
          </div>

          <div className="border-b border-[#e8eaed] bg-[#fafafa] px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="h-8 border-[#d0d7de] bg-white text-[#1f1f1f]" onClick={() => setFolderModalOpen(true)}>
                <FolderPlus className="mr-1.5 h-4 w-4" />
                New folder
              </Button>
              <Button variant="outline" className="h-8 border-[#d0d7de] bg-white text-[#1f1f1f]" onClick={() => setUploadModalOpen(true)}>
                <HardDriveUpload className="mr-1.5 h-4 w-4" />
                Upload
              </Button>
              <Button
                variant="outline"
                className="h-8 border-[#d0d7de] bg-white text-[#1f1f1f]"
                onClick={() => setPrefix(parentPrefix(prefix))}
                disabled={!prefix}
              >
                <ArrowUpFromLine className="mr-1.5 h-4 w-4" />
                Up
              </Button>
            </div>
          </div>

          <div className="border-b border-[#e8eaed] bg-white px-3 py-2">
            <div className="flex flex-wrap items-center gap-1 text-sm text-[#5f6368]">
              {pathParts.map((part, index) => (
                <div key={part.value || 'root'} className="flex items-center gap-1">
                  <button type="button" className="rounded px-1.5 py-0.5 hover:bg-[#e8f0fe]" onClick={() => setPrefix(part.value)}>
                    {part.label}
                  </button>
                  {index < pathParts.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="border-b border-[#f0c2c2] bg-[#fdeaea] px-3 py-2 text-sm text-[#ad1a1a]">{error}</p>}

          <FileList
            contents={contents}
            folders={folders}
            onFolderClick={setPrefix}
            onDelete={handleDelete}
            onShare={handleShare}
            onPreview={handlePreview}
            currentPrefix={prefix}
            onNavigateRoot={() => setPrefix('')}
            onNavigateUp={() => setPrefix(parentPrefix(prefix))}
          />

          <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
            <DialogContent className="border-[#d0d7de] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="folderName" className="text-[#5f6368]">
                  Folder name
                </Label>
                <Input
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  placeholder="e.g. videos-2026"
                  className="border-[#d0d7de] bg-white text-[#1f1f1f]"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
            <DialogContent className="border-[#d0d7de] bg-white">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
              </DialogHeader>
              <UploadDropzone
                bucketName={credentials.bucketName}
                prefix={effectiveUploadPrefix}
                onUploadComplete={() => {
                  fetchBucketContents();
                  setUploadModalOpen(false);
                }}
                uploadTarget={uploadTarget}
                onUploadTargetChange={setUploadTarget}
                currentPrefix={prefix}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
