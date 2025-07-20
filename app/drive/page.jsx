'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import UploadDropzone from './UploadDropzone';
import { getS3Client } from '@/lib/s3-client';
import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
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
            await s3Client.send(new PutObjectCommand({
                Bucket: credentials.bucketName,
                Key: `${prefix}${newFolderName}/`,
                Body: '',
            }));
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
            await s3Client.send(new DeleteObjectCommand({
                Bucket: credentials.bucketName,
                Key: key,
            }));
            fetchBucketContents();
        } catch (err) {
            setError('Failed to delete: ' + (err && err.message ? err.message : 'Unknown error'));
        }
    };

    const handleShare = async (key) => {
        try {
            const s3Client = getS3Client(credentials);
            const url = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: credentials.bucketName,
                Key: key,
            }), { expiresIn: 604800 }); // 7 days
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
        <main className="min-h-screen p-6 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[var(--primary)]">My S3 Drive</h1>
                    <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
                </div>
                <div className="flex gap-4 mb-6">
                    <Button onClick={() => setFolderModalOpen(true)} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--brand-orange)]">New Folder</Button>
                    <UploadDropzone bucketName={credentials.bucketName} prefix={prefix} onUploadComplete={fetchBucketContents} />
                </div>
                {error && <p className="text-[var(--destructive)] mb-4">{error}</p>}
                <FileList
                    contents={contents}
                    folders={folders}
                    onFolderClick={setPrefix}
                    onDelete={handleDelete}
                    onShare={handleShare}
                />
                <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-[var(--primary)]">Create Folder</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Label htmlFor="folderName" className="text-[var(--foreground)]">Folder Name</Label>
                            <Input
                                id="folderName"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                                placeholder="Enter folder name"
                                className="text-[var(--foreground)]"
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateFolder} className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--brand-orange)]">Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    );
}