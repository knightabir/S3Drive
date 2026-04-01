'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getS3Client } from '@/lib/s3-client';
import {
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import FileList from './fileList';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  FolderPlus,
  Upload,
  Share2,
  Trash2,
  Info,
  Clock,
  Star,
  HardDrive,
  Cloud,
  ChevronDown,
  Monitor
} from 'lucide-react';
import UploadDropzone from './UploadDropzone';
import React from 'react';

function toSegments(prefix) {
  return prefix.split('/').filter(Boolean);
}

function parentPrefix(prefix) {
  const segments = toSegments(prefix);
  if (segments.length === 0) return '';
  return `${segments.slice(0, -1).join('/')}${segments.length > 1 ? '/' : ''}`;
}

export default function DrivePage() {
  const [credentials, setCredentials] = useState(null);
  const [prefix, setPrefix] = useState('');
  const [category, setCategory] = useState('drive'); // 'drive' | 'recents' | 'starred'
  const [history, setHistory] = useState(['']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [contents, setContents] = useState([]);
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadTarget, setUploadTarget] = useState('current');
  const [selectedItemKey, setSelectedItemKey] = useState(null);

  const searchRef = React.useRef(null);
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
      setError(null);
      const s3Client = getS3Client(credentials);
      const command = new ListObjectsV2Command({
        Bucket: credentials.bucketName,
        Prefix: prefix,
        Delimiter: '/',
      });
      const response = await s3Client.send(command);
      const rawContents = (response.Contents || []).filter((item) => item.Key !== prefix);
      
      const thumbExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v'];

      // Generate signed URLs for images/videos in bulk
      const contentsWithThumbs = await Promise.all(
        rawContents.map(async (item) => {
          const ext = item.Key.split('.').pop().toLowerCase();
          if (thumbExtensions.includes(ext)) {
            try {
              const url = await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                  Bucket: credentials.bucketName,
                  Key: item.Key,
                }),
                { expiresIn: 3600 }
              );
              return { ...item, thumbnailUrl: url };
            } catch (err) {
              console.error("Failed to generate thumb URL", err);
              return item;
            }
          }
          return item;
        })
      );

      setContents(contentsWithThumbs);
      const fetchedFolders = (response.CommonPrefixes && response.CommonPrefixes.map((p) => p.Prefix)) || [];
      // Hide __trash__/ folder from main view
      setFolders(fetchedFolders.filter(f => f !== '__trash__/'));
    } catch (err) {
      setError('Failed to list contents: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  const navigateTo = (newPrefix) => {
    if (newPrefix === prefix) return;
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(newPrefix);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setPrefix(newPrefix);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setPrefix(prev);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setPrefix(next);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K: Focus Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }

      // Backspace/Delete: Move to Trash
      if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace' && selectedItemKey) {
        e.preventDefault();
        handleTrash(selectedItemKey);
      }

      // Enter: Rename (macOS style)
      if (e.key === 'Enter' && selectedItemKey && !folderModalOpen && !uploadModalOpen) {
        // This will be handled by FileList state, but we can trigger it here if needed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemKey, folderModalOpen, uploadModalOpen]);

  const filteredContents = useMemo(() => {
    let result = [...contents];

    if (category === 'recents') {
      result.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
    }

    if (searchQuery) {
      result = result.filter(item =>
        item.Key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [contents, searchQuery, category]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter(f =>
      f.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const handleRename = async (oldKey, newName) => {
    try {
      const s3Client = getS3Client(credentials);
      const isFolder = oldKey.endsWith('/');
      const parentPath = oldKey.split('/').slice(0, -1).join('/');
      const newKey = parentPath ? `${parentPath}/${newName}${isFolder ? '/' : ''}` : `${newName}${isFolder ? '/' : ''}`;

      if (oldKey === newKey) return;

      await s3Client.send(new CopyObjectCommand({
        Bucket: credentials.bucketName,
        CopySource: encodeURIComponent(`${credentials.bucketName}/${oldKey}`),
        Key: newKey,
      }));

      await s3Client.send(new DeleteObjectCommand({
        Bucket: credentials.bucketName,
        Key: oldKey,
      }));

      fetchBucketContents();
    } catch (err) {
      setError('Failed to rename: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleTrash = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const trashKey = `__trash__/${key}`;

      await s3Client.send(new CopyObjectCommand({
        Bucket: credentials.bucketName,
        CopySource: encodeURIComponent(`${credentials.bucketName}/${key}`),
        Key: trashKey,
      }));

      await s3Client.send(new DeleteObjectCommand({
        Bucket: credentials.bucketName,
        Key: key,
      }));

      fetchBucketContents();
    } catch (err) {
      setError('Failed to move to trash: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleRestore = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const originalKey = key.replace('__trash__/', '');

      await s3Client.send(new CopyObjectCommand({
        Bucket: credentials.bucketName,
        CopySource: encodeURIComponent(`${credentials.bucketName}/${key}`),
        Key: originalKey,
      }));

      await s3Client.send(new DeleteObjectCommand({
        Bucket: credentials.bucketName,
        Key: key,
      }));

      fetchBucketContents();
    } catch (err) {
      setError('Failed to restore: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
        })
      );
      fetchBucketContents();
    } catch (err) {
      setError('Failed to delete: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  const handleShare = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
        }),
        { expiresIn: 604800 }
      );
      return url;
    } catch (err) {
      setError('Failed to generate share link: ' + (err && err.message ? err.message : 'Unknown error'));
      return '';
    }
  };

  const handlePreview = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
        }),
        { expiresIn: 3600 }
      );
      return url;
    } catch (err) {
      setError('Failed to generate preview link: ' + (err && err.message ? err.message : 'Unknown error'));
      return '';
    }
  };

  const handleDownload = async (key) => {
    try {
      const s3Client = getS3Client(credentials);
      const fileName = key.split('/').pop() || 'file';
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: credentials.bucketName,
          Key: key,
          ResponseContentDisposition: `attachment; filename="${fileName}"`,
        }),
        { expiresIn: 3600 }
      );
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    try {
      const s3Client = getS3Client(credentials);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: credentials.bucketName,
          Key: `${prefix}${newFolderName}/`,
          Body: '',
        })
      );
      setFolderModalOpen(false);
      setNewFolderName('');
      fetchBucketContents();
    } catch (err) {
      setError('Failed to create folder: ' + (err && err.message ? err.message : 'Unknown error'));
    }
  };

  if (!credentials) return null;

  const currentFolder = prefix.split('/').filter(Boolean).pop() || credentials.bucketName;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* macOS Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar-bg backdrop-blur-3xl flex flex-col pt-12">
        <div className="px-6 mb-8 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Favorites</div>
        <nav className="px-3 space-y-0.5">
          <div
            className={`macos-sidebar-item ${category === 'drive' ? 'active' : ''}`}
            onClick={() => { setCategory('drive'); setPrefix(''); }}
          >
            <Cloud className={`w-4 h-4 ${category === 'drive' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={category === 'drive' ? 'text-primary-foreground font-semibold' : 'text-foreground'}>AirDrive</span>
          </div>
          <div
            className={`macos-sidebar-item ${category === 'recents' ? 'active' : ''}`}
            onClick={() => setCategory('recents')}
          >
            <Clock className={`w-4 h-4 ${category === 'recents' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={category === 'recents' ? 'text-primary-foreground font-semibold' : 'text-foreground'}>Recents</span>
          </div>
          <div
            className={`macos-sidebar-item ${category === 'starred' ? 'active' : ''}`}
            onClick={() => setCategory('starred')}
          >
            <Star className={`w-4 h-4 ${category === 'starred' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={category === 'starred' ? 'text-primary-foreground font-semibold' : 'text-foreground'}>Starred</span>
          </div>
          <div
            className={`macos-sidebar-item ${category === 'trash' ? 'active' : ''}`}
            onClick={() => { setCategory('trash'); setPrefix('__trash__/'); }}
          >
            <Trash2 className={`w-4 h-4 ${category === 'trash' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={category === 'trash' ? 'text-primary-foreground font-semibold' : 'text-foreground'}>Trash</span>
          </div>
        </nav>

        <div className="px-6 mt-8 mb-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Locations</div>
        <nav className="px-3 space-y-0.5">
          <div className="macos-sidebar-item">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{credentials.bucketName}</span>
          </div>
          <div className="macos-sidebar-item">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Network</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* macOS Toolbar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-glass backdrop-blur-2xl z-10">
          <div className="flex items-center gap-6">
            {/* History Nav */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-black/5 dark:hover:bg-white/5"
                disabled={historyIdx === 0}
                onClick={goBack}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-black/5 dark:hover:bg-white/5"
                disabled={historyIdx === history.length - 1}
                onClick={goForward}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Folder Title */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px]">{currentFolder}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggles */}
            <div className="flex items-center p-0.5 rounded-lg bg-black/5 dark:bg-white/5 border border-border">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary' : 'text-muted hover:text-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-black" onClick={() => setFolderModalOpen(true)}>
                <FolderPlus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-black" onClick={() => setUploadModalOpen(true)}>
                <Upload className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-black">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-48 pl-8 pr-3 rounded-md bg-black/5 dark:bg-white/5 border-transparent border focus:border-primary/50 focus:bg-white dark:focus:bg-zinc-900 transition-all text-[13px] outline-none text-black"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="m-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
            </div>
          )}

          <FileList
            contents={filteredContents}
            folders={filteredFolders}
            onFolderClick={navigateTo}
            onDelete={handleDelete}
            onShare={handleShare}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onRename={handleRename}
            onTrash={handleTrash}
            onRestore={handleRestore}
            isTrashMode={category === 'trash'}
            currentPrefix={prefix}
            viewMode={viewMode}
            onSelectionChange={setSelectedItemKey}
          />
        </div>

        {/* Status Bar */}
        <footer className="h-7 border-t border-border bg-glass backdrop-blur-2xl flex items-center px-4 justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{contents.length + folders.length} items</span>
            <span>Available space: ∞</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>S3 Endpoint: {credentials.serviceEndpoint || 'AWS Default'}</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
        <DialogContent className="max-w-[400px] border-border bg-surface">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                className="bg-black/5 dark:bg-white/5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFolderModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-[500px] border-border bg-surface p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <UploadDropzone
            bucketName={credentials.bucketName}
            prefix={prefix}
            onUploadComplete={() => {
              fetchBucketContents();
              setUploadModalOpen(false);
            }}
            uploadTarget={uploadTarget}
            onUploadTargetChange={setUploadTarget}
            currentPrefix={prefix}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
