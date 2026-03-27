"use client";

import { Badge } from '@/components/ui/badge';
import { FaRegCopy, FaCheckCircle } from 'react-icons/fa';
import React, { useState } from 'react';

const corsJson = `[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["https://my-s3-drive.vercel.app"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`;

const HowToConnect = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(corsJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mt-8">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Bucket setup checklist</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Complete the two steps below to ensure browser-based access works smoothly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)]/80 bg-black/15 p-5">
            <h4 className="mb-2 text-base font-semibold text-[var(--card-foreground)]">1) Configure CORS</h4>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--muted-foreground)]">
              <li>Open AWS S3 Console and select your bucket.</li>
              <li>Go to <span className="font-medium text-[var(--foreground)]">Permissions</span>.</li>
              <li>Edit CORS policy and paste the configuration below.</li>
            </ol>

            <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border)]/80">
              <div className="flex items-center justify-between bg-black/30 px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">CORS JSON</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--foreground)] transition hover:bg-white/5"
                >
                  {copied ? <FaCheckCircle className="text-emerald-300" /> : <FaRegCopy />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto bg-[#091225] p-3 text-xs text-[#bfe9ff]">{corsJson}</pre>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)]/80 bg-black/15 p-5">
            <h4 className="mb-2 text-base font-semibold text-[var(--card-foreground)]">2) IAM permissions</h4>
            <p className="text-sm text-[var(--muted-foreground)]">Ensure the IAM user or role has the following actions:</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="bg-[var(--secondary)]/90 text-[var(--secondary-foreground)]">s3:GetObject</Badge>
              <Badge className="bg-[var(--secondary)]/90 text-[var(--secondary-foreground)]">s3:PutObject</Badge>
              <Badge className="bg-[var(--secondary)]/90 text-[var(--secondary-foreground)]">s3:ListBucket</Badge>
              <Badge className="bg-[var(--secondary)]/90 text-[var(--secondary-foreground)]">s3:DeleteObject</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToConnect;
