'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getS3Client, retryOperation } from '@/lib/s3-client';
import { Upload as S3Upload } from '@aws-sdk/lib-storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload, FileUp, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const credentials = JSON.parse(localStorage.getItem('s3Credentials') || '{}');

  const processFiles = async (files) => {
    setUploading(true);
    setStatus('uploading');
    setProgress(0);

    try {
      const s3Client = getS3Client(credentials);

      for (const file of files) {
        const key = `${prefix}${file.name}`;

        try {
          await uploadWithMultipart(s3Client, bucketName, key, file, setProgress);
        } catch (err) {
          if (!isChecksumMultipartError(err)) throw err;
          setProgress(0);
          await uploadWithPutObject(s3Client, bucketName, key, file);
          setProgress(100);
        }
      }

      setStatus('success');
      setTimeout(() => {
        onUploadComplete();
      }, 1000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err?.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) await processFiles(files);
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) await processFiles(files);
  };

  return (
    <div className="p-8">
      <div
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 overflow-hidden ${
          dragActive
            ? 'border-primary bg-primary/5 scale-[0.99]'
            : 'border-border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/20">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2">Upload to S3</h3>
              <p className="text-sm text-muted max-w-[240px] leading-relaxed mb-6">
                Drag and drop files here, or click to browse your computer.
              </p>
              
              <input type="file" multiple onChange={handleChange} className="hidden" id="file-upload" disabled={uploading} />
              <label htmlFor="file-upload">
                <Button className="macos-button-primary px-8 py-2.5 h-auto text-sm font-bold uppercase tracking-wider" asChild>
                  <span>Select Files</span>
                </Button>
              </label>
            </motion.div>
          )}

          {status === 'uploading' && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full max-w-[280px]"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-4 uppercase text-muted">Uploading Files...</h3>
              
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="mt-2 text-[11px] font-bold text-primary">{progress}%</span>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 shadow-sm border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Upload Complete</h3>
              <p className="text-sm text-muted">Refresh folder to see changes</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 shadow-sm border border-red-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-red-500">Upload Failed</h3>
              <p className="text-xs text-muted max-w-[200px] mt-2 mb-6">{errorMessage}</p>
              <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>Try Again</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between px-2">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Location:</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-border">
               {prefix || 'Root'}
            </span>
         </div>
         <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold text-muted" onClick={() => setStatus('idle')}>
            Clear
         </Button>
      </div>
    </div>
  );
}
