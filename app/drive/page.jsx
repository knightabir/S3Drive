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

export default function DrivePage() {
  const [credentials, setCredentials] = useState(null);
  const [prefix, setPrefix] = useState('');
  const [contents, setContents] = useState([]);
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
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
      const s3Client = getS3Client(credentials);
      const command = new ListObjectsV2Command({
        Bucket: credentials.bucketName,
        Prefix: prefix,
        Delimiter: '/',
      });
      const response = await s3Client.send(command);
      setContents(response.Contents || []);
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

  const handleDisconnect = () => {
    localStorage.removeItem('s3Credentials');
    router.push('/config');
  };

  if (!credentials) return null;

  return (
    <main className="pb-10 pt-8 sm:pt-10">
      <section className="section-shell">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">S3 Workspace</p>
              <h1 className="text-3xl font-bold text-[var(--card-foreground)]">My S3 Drive</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Bucket: <span className="font-medium text-[var(--foreground)]">{credentials.bucketName}</span>
              </p>
            </div>
            <Button variant="destructive" onClick={handleDisconnect} className="sm:w-auto">
              Disconnect
            </Button>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[auto_1fr]">
            <Button onClick={() => setFolderModalOpen(true)} className="h-11 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110">
              Create Folder
            </Button>
            <UploadDropzone bucketName={credentials.bucketName} prefix={prefix} onUploadComplete={fetchBucketContents} />
          </div>

          {error && <p className="mb-4 rounded-lg border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 px-3 py-2 text-sm text-red-200">{error}</p>}

          <FileList contents={contents} folders={folders} onFolderClick={setPrefix} onDelete={handleDelete} onShare={handleShare} />

          <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
            <DialogContent className="border-[var(--border)] bg-[var(--card)]">
              <DialogHeader>
                <DialogTitle className="text-[var(--card-foreground)]">Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="folderName" className="text-[var(--muted-foreground)]">
                  Folder name
                </Label>
                <Input
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  placeholder="e.g. invoices-2026"
                  className="border-[var(--border)] bg-[var(--input)] text-[var(--foreground)]"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFolder} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110">
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
