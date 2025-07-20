'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getS3Client } from '@/lib/s3-client';
import { Upload as S3Upload } from '@aws-sdk/lib-storage';
import { Upload } from 'lucide-react';

export default function UploadDropzone(props) {
  const { bucketName, prefix, onUploadComplete } = props;
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const credentials = JSON.parse(localStorage.getItem('s3Credentials') || '{}');

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    setUploading(true);
    setProgress(0);
    try {
      const s3Client = getS3Client(credentials);
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        const upload = new S3Upload({
          client: s3Client,
          params: {
            Bucket: bucketName,
            Key: `${prefix}${file.name}`,
            Body: file,
          },
          partSize: 5 * 1024 * 1024,
          queueSize: 4,
          leavePartsOnError: false,
        });
        upload.on('httpUploadProgress', (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        });
        await upload.done();
        setProgress(100);
      }
      onUploadComplete();
    } catch (err) {
      alert('Upload failed: ' + (err && err.message ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setUploading(true);
    setProgress(0);
    try {
      const s3Client = getS3Client(credentials);
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        const upload = new S3Upload({
          client: s3Client,
          params: {
            Bucket: bucketName,
            Key: `${prefix}${file.name}`,
            Body: file,
          },
          partSize: 5 * 1024 * 1024,
          queueSize: 4,
          leavePartsOnError: false,
        });
        upload.on('httpUploadProgress', (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        });
        await upload.done();
        setProgress(100);
      }
      onUploadComplete();
    } catch (err) {
      alert('Upload failed: ' + (err && err.message ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center ${dragActive ? 'border-[var(--primary)] bg-[var(--brand-yellow)]' : 'border-[var(--sidebar-border)] bg-[var(--card)]'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-8 h-8 mx-auto mb-4 text-[var(--secondary)]" />
      <p className="text-sm text-[var(--foreground)]">
        Drag and drop files here or click to upload
      </p>
      <input
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      <label htmlFor="file-upload">
        <Button
          className="mt-4 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--brand-orange)]"
          disabled={uploading}
          asChild
        >
          <span>{uploading ? 'Uploading...' : 'Select Files'}</span>
        </Button>
      </label>
      {uploading || progress > 0 ? (
        <div className="w-full mt-4 h-3 bg-[var(--card)] rounded-full overflow-hidden border border-[var(--sidebar-border)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'var(--primary)',
            }}
          />
        </div>
      ) : null}
    </div>
  );
}