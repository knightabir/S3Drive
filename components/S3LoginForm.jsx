"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaKey, FaLock, FaGlobeAmericas, FaDropbox, FaCloud, FaExclamationCircle } from 'react-icons/fa';

const fieldStyles = "flex items-center gap-3 bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-200 focus-within:border-blue-500 transition-all duration-300";
const labelStyles = "font-medium text-gray-700 flex items-center gap-2 mb-3";
const inputStyles = "flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 transition-all duration-300";

const S3LoginForm = () => {
    const [credentials, setCredentials] = useState({
        accessKeyId: '',
        secretAccessKey: '',
        region: '',
        bucketName: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const router = useRouter();

    const handleFocus = (field) => setFocusedField(field);
    const handleBlur = () => setFocusedField(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const s3Client = new S3Client({
                region: credentials.region,
                credentials: {
                    accessKeyId: credentials.accessKeyId,
                    secretAccessKey: credentials.secretAccessKey
                },
            });

            await s3Client.send(new ListObjectsV2Command({ Bucket: credentials.bucketName }));
            localStorage.setItem('s3Credentials', JSON.stringify(credentials));
            router.push('/drive');
        } catch (error) {
            setError('Failed to connect: ' + (error?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const getFieldClass = (field) =>
        `${fieldStyles} ${focusedField === field ? "ring-2 ring-blue-300 scale-105 shadow-lg" : ""}`;
    const getInputClass = (field) =>
        `${inputStyles} ${focusedField === field ? "bg-blue-50" : ""}`;

    return (
        <section aria-labelledby="s3-login-heading" className="w-full min-w-xl max-w-xl mx-auto mb-10">
            <div className="flex flex-col items-center mb-8">
                <FaCloud className="text-[var(--primary)] text-4xl mb-2" />
                <h2 id="s3-login-heading" className="text-2xl font-bold text-[var(--primary)] mb-1">Connect to S3 Bucket</h2>
                <p className="text-[var(--foreground)] text-sm text-center">Enter your S3 credentials to get started</p>
            </div>
            {error && (
                <div className="flex items-center gap-2 bg-[var(--brand-yellow)] border border-[var(--destructive)] text-[var(--destructive)] rounded-lg px-3 py-2 mb-4">
                    <FaExclamationCircle className="text-[var(--destructive)]" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
                <div className={getFieldClass('accessKeyId')}>
                    <FaKey className="text-[var(--secondary)] text-lg" />
                    <div className="flex flex-col flex-1">
                        <Label htmlFor='accessKeyId' className={labelStyles + ' text-[var(--foreground)]'}>Access Key ID</Label>
                        <Input
                            id='accessKeyId'
                            value={credentials.accessKeyId}
                            onChange={(e) => setCredentials({ ...credentials, accessKeyId: e.target.value })}
                            className={getInputClass('accessKeyId') + ' text-[var(--foreground)]'}
                            required
                            placeholder="AKIA..."
                            onFocus={() => handleFocus('accessKeyId')}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className={getFieldClass('secretAccessKey')}>
                    <FaLock className="text-[var(--secondary)] text-lg" />
                    <div className="flex flex-col flex-1">
                        <Label htmlFor='secretAccessKey' className={labelStyles + ' text-[var(--foreground)]'}>Secret Access Key</Label>
                        <Input
                            id='secretAccessKey'
                            value={credentials.secretAccessKey}
                            onChange={(e) => setCredentials({ ...credentials, secretAccessKey: e.target.value })}
                            className={getInputClass('secretAccessKey') + ' text-[var(--foreground)]'}
                            required
                            type="password"
                            autoComplete="current-password"
                            placeholder="Your secret key"
                            onFocus={() => handleFocus('secretAccessKey')}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className={getFieldClass('region')}>
                    <FaGlobeAmericas className="text-[var(--secondary)] text-lg" />
                    <div className="flex flex-col flex-1">
                        <Label htmlFor='region' className={labelStyles + ' text-[var(--foreground)]'}>Region</Label>
                        <Input
                            id='region'
                            value={credentials.region}
                            onChange={(e) => setCredentials({ ...credentials, region: e.target.value })}
                            className={getInputClass('region') + ' text-[var(--foreground)]'}
                            required
                            placeholder="us-east-1"
                            onFocus={() => handleFocus('region')}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className={getFieldClass('bucketName')}>
                    <FaDropbox className="text-[var(--secondary)] text-lg" />
                    <div className="flex flex-col flex-1">
                        <Label htmlFor='bucketName' className={labelStyles + ' text-[var(--foreground)]'}>Bucket Name</Label>
                        <Input
                            id='bucketName'
                            value={credentials.bucketName}
                            onChange={(e) => setCredentials({ ...credentials, bucketName: e.target.value })}
                            className={getInputClass('bucketName') + ' text-[var(--foreground)]'}
                            required
                            placeholder="my-bucket"
                            onFocus={() => handleFocus('bucketName')}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    className={`w-full bg-[var(--primary)] hover:bg-[var(--brand-orange)] text-[var(--primary-foreground)] font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    <span className={loading ? "animate-spin" : ""}>
                        <FaCloud className="text-[var(--primary-foreground)] text-lg" />
                    </span>
                    {loading ? "Connecting..." : "Connect"}
                </Button>
            </form>
            <style jsx global>{`
                @keyframes inputFocusPulse {
                    0% { box-shadow: 0 0 0 0 var(--ring);}
                    70% { box-shadow: 0 0 0 6px rgba(255,127,62,0);}
                    100% { box-shadow: 0 0 0 0 var(--ring);}
                }
                .ring-2 {
                    animation: inputFocusPulse 0.5s;
                }
            `}</style>
        </section>
    );
};

export default S3LoginForm; 