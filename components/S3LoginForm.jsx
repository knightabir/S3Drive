"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaKey, FaLock, FaGlobeAmericas, FaDropbox, FaCloud, FaExclamationCircle } from 'react-icons/fa';

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
    placeholder: 'Enter secret access key',
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
    placeholder: 'my-company-bucket',
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
      router.push('/drive');
    } catch (connectError) {
      setError('Failed to connect: ' + (connectError?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="s3-login-heading" className="mx-auto w-full max-w-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 inline-flex rounded-2xl bg-[var(--primary)]/15 p-3 text-[var(--secondary)]">
          <FaCloud className="text-xl" />
        </div>
        <h2 id="s3-login-heading" className="text-2xl font-semibold text-[var(--card-foreground)]">
          Authenticate S3 Access
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Credentials are stored in your browser only and never sent to S3Drive servers.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[var(--destructive)]/35 bg-[var(--destructive)]/10 px-4 py-3 text-sm text-red-200">
          <FaExclamationCircle className="mt-0.5 text-[var(--destructive)]" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        {fields.map(({ key, label, placeholder, icon: Icon, type }) => (
          <div key={key} className="rounded-xl border border-[var(--border)]/70 bg-black/15 p-4 transition hover:border-[var(--primary)]/60">
            <Label htmlFor={key} className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
              <Icon className="text-[var(--secondary)]" />
              {label}
            </Label>
            <Input
              id={key}
              value={credentials[key]}
              onChange={(e) => setCredentials({ ...credentials, [key]: e.target.value.trimStart() })}
              className="h-11 border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
              required
              type={type}
              placeholder={placeholder}
              disabled={loading}
              autoComplete={key === 'secretAccessKey' ? 'current-password' : 'off'}
            />
          </div>
        ))}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect to Bucket'}
        </Button>
      </form>
    </section>
  );
};

export default S3LoginForm;
