"use client";
import { Badge } from '@/components/ui/badge'
import { FaRegCopy } from 'react-icons/fa'
import React, { useRef, useState } from 'react'

const corsJson = `[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "https://my-s3-drive.vercel.app"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]`;

const HowToConnect = () => {
    const preRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(corsJson);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            setCopied(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-10 bg-[var(--card)] rounded-xl shadow-lg p-8 border border-[var(--sidebar-border)]">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-[var(--primary)] mb-2">Setup Your S3 Bucket</h1>
                <p className="text-[var(--foreground)] text-base">Configure your S3 bucket for Chai Storage access:</p>
            </div>
            <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold text-[var(--sidebar)] mb-2 flex items-center gap-2">
                        1. Configure CORS Policy
                    </h3>
                    <ol className="list-decimal list-inside text-[var(--foreground)] space-y-1 mb-4 pl-2">
                        <li>
                            Go to your <span className="font-semibold">AWS S3 Console</span>
                        </li>
                        <li>
                            Select your bucket &rarr; <span className="font-semibold">Permissions tab</span>
                        </li>
                        <li>
                            Find <span className="font-semibold">Cross-origin resource sharing (CORS)</span>
                        </li>
                        <li>
                            Click <span className="font-semibold">Edit</span> and paste the JSON below
                        </li>
                    </ol>
                    <div className="relative mt-4 mb-2">
                        <div className="flex items-center justify-between bg-[var(--sidebar)] px-4 py-2 rounded-t-lg border border-b-0 border-[var(--sidebar-border)]">
                            <span className="font-mono text-sm text-[var(--sidebar-accent)] font-semibold tracking-wide">CORS Configuration</span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`flex items-center gap-2 text-[var(--primary)] text-sm px-2 py-1 rounded hover:bg-[var(--brand-yellow)] transition ${copied ? "text-green-600" : ""}`}
                                aria-label="Copy CORS JSON"
                            >
                                <FaRegCopy className="text-base" />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <pre
                            ref={preRef}
                            className="overflow-x-auto bg-[var(--brand-navy)] text-[var(--brand-yellow)] text-sm rounded-b-lg rounded-tr-lg p-4 border border-t-0 border-[var(--sidebar-border)] font-mono select-all"
                        >
                            {corsJson}
                        </pre>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-[var(--sidebar)] mb-2 flex items-center gap-2">
                        2. Required IAM Permission
                    </h3>
                    <p className="text-[var(--foreground)] mb-3">Your AWS credentials need these S3 permissions:</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge>s3:GetObject</Badge>
                        <Badge>s3:PutObject</Badge>
                        <Badge>s3:ListBucket</Badge>
                        <Badge>s3:DeleteObject</Badge>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HowToConnect