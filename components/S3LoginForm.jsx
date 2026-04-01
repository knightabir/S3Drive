"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaKey, FaLock, FaGlobeAmericas, FaDropbox, FaExclamationCircle } from 'react-icons/fa';
import LoadingConnection from './shared/LoadingConnection';

const fields = [
  {
    key: 'accessKeyId',
    label: 'Access Key ID',
    placeholder: 'AKIA... ',
    icon: FaKey,
    type: 'text',
  },
  {
    key: 'secretAccessKey',
    label: 'Secret Access Key',
    placeholder: '••••••••••••••••',
    icon: FaLock,
    type: 'password',
  },
  {
    key: 'region',
    label: 'Region',
    placeholder: 'us-east-1',
    icon: FaGlobeAmericas,
    type: 'text',
  },
  {
    key: 'bucketName',
    label: 'Bucket Name',
    placeholder: 'my-s3-bucket',
    icon: FaDropbox,
    type: 'text',
  },
];

const S3LoginForm = () => {
  const [credentials, setCredentials] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    bucketName: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const s3Client = new S3Client({
        region: credentials.region,
        credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
        },
      });

      await s3Client.send(new ListObjectsV2Command({ Bucket: credentials.bucketName }));
      localStorage.setItem('s3Credentials', JSON.stringify(credentials));
      
      // Artificial delay to show off the beautiful animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      router.push('/drive');
    } catch (connectError) {
      setError('Failed to connect: ' + (connectError?.message || 'Check your credentials and CORS policy'));
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl"
          >
            <LoadingConnection />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={loading ? "opacity-20 blur-[2px] pointer-events-none transition-all duration-500" : "transition-all duration-500"}>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <FaExclamationCircle className="mt-0.5" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            {fields.map(({ key, label, placeholder, icon: Icon, type }) => (
              <div key={key} className="space-y-2 group">
                <Label htmlFor={key} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  <Icon className="w-3 h-3" />
                  {label}
                </Label>
                <Input
                  id={key}
                  value={credentials[key]}
                  onChange={(e) => setCredentials({ ...credentials, [key]: e.target.value.trimStart() })}
                  className="h-12 border-border/50 bg-black/5 dark:bg-white/5 text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium"
                  required
                  type={type}
                  placeholder={placeholder}
                  disabled={loading}
                  autoComplete={key === 'secretAccessKey' ? 'current-password' : 'off'}
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="macos-button-primary h-12 w-full shadow-lg shadow-primary/20 text-xs font-black uppercase tracking-[0.2em] mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            Connect Workspace
          </Button>
        </form>
      </div>
    </div>
  );
};

export default S3LoginForm;
