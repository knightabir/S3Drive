"use client";

import { Badge } from '@/components/ui/badge';
import { FaRegCopy, FaCheckCircle, FaShieldAlt, FaNetworkWired } from 'react-icons/fa';
import React, { useState } from 'react';
import { motion } from "framer-motion";

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
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
          <FaShieldAlt className="text-primary w-6 h-6" />
          Setup Checklist
        </h3>
        <p className="text-muted-foreground font-medium">
          Follow these steps to enable secure, browser-based access to your bucket.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="macos-surface rounded-2xl p-6 border-primary/10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">1</div>
             <h4 className="font-bold text-black">Configure CORS Policy</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Attach this JSON to your bucket permissions to allow the S3Drive web client to communicate with AWS.
          </p>

          <div className="relative group">
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg bg-black/10 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black border border-black/5 hover:bg-black/20 transition-all"
              >
                {copied ? <FaCheckCircle className="text-emerald-600" /> : <FaRegCopy />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto bg-black/5 dark:bg-white/5 p-5 rounded-xl text-[13px] font-mono leading-relaxed text-black/80 border border-black/5">
              {corsJson}
            </pre>
          </div>
        </div>

        {/* Step 2 */}
        <div className="macos-surface rounded-2xl p-6 border-primary/10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">2</div>
             <h4 className="font-bold text-black">IAM Permissions</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Ensure your IAM User or Access Key has a policy that includes the following actions for your bucket:
          </p>
          <div className="flex flex-wrap gap-2">
            {['s3:GetObject', 's3:PutObject', 's3:ListBucket', 's3:DeleteObject'].map(perm => (
              <Badge key={perm} variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold px-3 py-1">
                {perm}
              </Badge>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
           <FaNetworkWired className="text-primary w-5 h-5 flex-shrink-0" />
           <p className="text-xs text-primary/80 font-medium leading-relaxed">
             <strong>Privacy Note:</strong> All operations are performed locally. Your credentials and files are streamed directly between your browser and AWS.
           </p>
        </div>
      </div>
    </div>
  );
};

export default HowToConnect;
