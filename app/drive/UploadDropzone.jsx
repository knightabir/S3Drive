'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getS3Client, retryOperation } from '@/lib/s3-client';
import { Upload as S3Upload } from '@aws-sdk/lib-storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from 'lucide-react';

function isChecksumMultipartError(err) {
  const message = String(err?.message || '').toLowerCase();
  return (
    message.includes('checksum') &&
    (message.includes('part') || message.includes('multipart') || message.includes('crc32'))
  );
}

async function uploadWithMultipart(s3Client, bucketName, key, file, onProgress) {
  const upload = new S3Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: file,
    },
    partSize: 8 * 1024 * 1024,
    queueSize: 3,
    leavePartsOnError: false,
  });

  upload.on('httpUploadProgress', (evt) => {
    if (evt.total) {
      onProgress(Math.round((evt.loaded / evt.total) * 100));
    }
  });

  await upload.done();
}

async function uploadWithPutObject(s3Client, bucketName, key, file) {
  await retryOperation(() =>
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
      })
    )
  );
}

export default function UploadDropzone(props) {
  const { bucketName, prefix, onUploadComplete, uploadTarget, onUploadTargetChange, currentPrefix } = props;
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const credentials = JSON.parse(localStorage.getItem('s3Credentials') || '{}');

  const processFiles = async (files) => {
    setUploading(true);
    setProgress(0);

    try {
      const s3Client = getS3Client(credentials);

      for (const file of files) {
        const key = `${prefix}${file.name}`;

        try {
          await uploadWithMultipart(s3Client, bucketName, key, file, setProgress);
        } catch (err) {
          if (!isChecksumMultipartError(err)) {
            throw err;
          }

          setProgress(0);
          await uploadWithPutObject(s3Client, bucketName, key, file);
          setProgress(100);
        }
      }

      onUploadComplete();
    } catch (err) {
      alert('Upload failed: ' + (err && err.message ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1200);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-5 text-center transition ${
        dragActive
          ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
          : 'border-[var(--border)] bg-black/20'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex flex-wrap justify-center gap-2 text-xs">
        <button
          type="button"
          className={`rounded-full px-3 py-1 transition ${
            uploadTarget === 'current'
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-white/5'
          }`}
          onClick={() => onUploadTargetChange('current')}
          disabled={uploading}
        >
          Upload to Current Folder
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1 transition ${
            uploadTarget === 'root'
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-white/5'
          }`}
          onClick={() => onUploadTargetChange('root')}
          disabled={uploading}
        >
          Upload to Root
        </button>
      </div>

      <Upload className="mx-auto mb-2 h-7 w-7 text-[var(--secondary)]" />
      <p className="text-sm text-[var(--muted-foreground)]">Drag files here or choose files.</p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        Target: {uploadTarget === 'root' ? 'Root ( / )' : currentPrefix || 'Root ( / )'}
      </p>

      <input type="file" multiple onChange={handleChange} className="hidden" id="file-upload" disabled={uploading} />
      <label htmlFor="file-upload">
        <Button className="mt-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110" disabled={uploading} asChild>
          <span>{uploading ? 'Uploading…' : 'Select Files'}</span>
        </Button>
      </label>

      {(uploading || progress > 0) && (
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
          <div className="h-full rounded-full bg-[var(--secondary)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
