'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Code, 
  FileArchive,
  FileJson,
  Share2, 
  Trash2, 
  MoreHorizontal, 
  ExternalLink, 
  Download, 
  Edit3, 
  Eye,
  RotateCcw,
  Info,
  Monitor
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ShareDialog from './ShareDialog';
import PreviewDialog from './PreviewDialog';

function getExtension(key = '') {
  const parts = key.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

function getTypeInfo(key = '') {
  const ext = getExtension(key);

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(ext)) {
    return { label: 'Image', Icon: ImageIcon, color: 'text-blue-500', bgColor: 'bg-blue-500/10' };
  }
  if (['mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v'].includes(ext)) {
    return { label: 'Video', Icon: Video, color: 'text-purple-500', bgColor: 'bg-purple-500/10' };
  }
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) {
    return { label: 'Audio', Icon: Music, color: 'text-pink-500', bgColor: 'bg-pink-500/10' };
  }
  if (['json'].includes(ext)) {
    return { label: 'JSON File', Icon: FileJson, color: 'text-amber-500', bgColor: 'bg-amber-500/10' };
  }
  if (['md', 'markdown'].includes(ext)) {
    return { label: 'Markdown File', Icon: FileText, color: 'text-sky-600', bgColor: 'bg-sky-600/10' };
  }
  if (['csv', 'xls', 'xlsx'].includes(ext)) {
    return { label: 'Spreadsheet', Icon: FileText, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' };
  }
  if (['zip', 'rar', '7z', 'gz', 'tar'].includes(ext)) {
    return { label: 'Archive', Icon: FileArchive, color: 'text-orange-500', bgColor: 'bg-orange-500/10' };
  }
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'xml', 'yaml', 'yml'].includes(ext)) {
    return { label: 'Code File', Icon: FileCode2, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' };
  }
  
  return { label: ext ? `${ext.toUpperCase()} File` : 'File', Icon: FileText, color: 'text-slate-500', bgColor: 'bg-slate-500/10' };
}

function formatBytes(bytes = 0) {
  if (!bytes) return '--';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const value = Number(bytes);
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(dateLike) {
  if (!dateLike) return '--';
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export default function FileList({ 
  contents, 
  folders, 
  onFolderClick, 
  onDelete, 
  onShare, 
  onPreview,
  onDownload,
  onRename,
  onTrash,
  onRestore,
  isTrashMode = false,
  currentPrefix,
  viewMode = 'grid',
  onSelectionChange
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewKey, setPreviewKey] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [infoItem, setInfoItem] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  useEffect(() => {
    const selectedItem = [...folders.map(f => ({ id: f, Key: f })), ...contents.map(c => ({ id: c.Key, Key: c.Key }))].find(i => i.id === selectedId);
    onSelectionChange?.(selectedItem?.Key || null);
  }, [selectedId, folders, contents, onSelectionChange]);

  const items = useMemo(() => {
    const folderItems = folders.map((folder) => {
      const folderName = folder.replace(currentPrefix, '').replace(/\/$/, '');
      return {
        id: folder,
        key: folder,
        name: folderName || folder,
        type: 'Folder',
        modified: null,
        size: null,
        isFolder: true,
      };
    });

    const fileItems = contents.map((item) => {
      const typeInfo = getTypeInfo(item.Key);
      return {
        id: item.Key,
        key: item.Key,
        name: item.Key.split('/').pop(),
        type: typeInfo.label,
        modified: item.LastModified,
        size: item.Size,
        isFolder: false,
        typeInfo,
        thumbnailUrl: item.thumbnailUrl
      };
    });

    return [...folderItems, ...fileItems];
  }, [folders, contents, currentPrefix]);

  const handleItemClick = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    if (renamingId !== id) {
      setRenamingId(null);
    }
  };

  const handleStartRename = (item) => {
    setRenamingId(item.id);
    setNewName(item.name);
  };

  const handleRenameSubmit = (e, item) => {
    if (e.key === 'Enter') {
      if (newName && newName !== item.name) {
        onRename(item.id, newName);
      }
      setRenamingId(null);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  const handleItemDoubleClick = (item) => {
    if (item.isFolder) {
      onFolderClick(item.key);
    } else {
      handlePreview(item.key);
    }
  };

  const handleShare = async (key) => {
    const url = await onShare(key);
    if (url) {
      setShareUrl(url);
      setShareDialogOpen(true);
    }
  };

  const handlePreview = async (key) => {
    const url = await onPreview(key);
    if (url) {
      setPreviewUrl(url);
      setPreviewKey(key);
      setPreviewDialogOpen(true);
    }
  };

  return (
    <div className="h-full w-full" onClick={() => setSelectedId(null)}>
      <div className="p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-40">
            <Folder className="w-16 h-16 mb-4 stroke-[1]" />
            <p className="text-sm font-medium">This folder is empty</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-2 gap-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className={`finder-grid-item group outline-none ${selectedId === item.id ? 'selected' : ''}`}
                          onClick={(e) => handleItemClick(e, item.id)}
                          onDoubleClick={() => handleItemDoubleClick(item)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleStartRename(item);
                            if (e.key === 'Backspace' && (e.metaKey || e.ctrlKey)) onTrash(item.id);
                          }}
                        >
                          <div className="relative w-20 h-20 flex items-center justify-center mb-2 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 border border-border group-hover:border-primary/30 transition-all shadow-sm mx-auto shrink-0">
                            {item.isFolder ? (
                              <Folder className="w-12 h-12 text-primary fill-primary/10 stroke-[1.5]" />
                            ) : item.thumbnailUrl ? (
                              <div className="relative w-full h-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                                {item.typeInfo.label === 'Video' ? (
                                  <motion.video 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={`${item.thumbnailUrl}#t=0.1`}
                                    muted 
                                    playsInline 
                                    preload="metadata"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <motion.img 
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    src={item.thumbnailUrl} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                )}
                                {item.typeInfo.label === 'Video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                                      <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1" />
                                    </div>
                                  </div>
                                )}
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-xl pointer-events-none" />
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ) : (
                              <div className="relative">
                                <item.typeInfo.Icon className={`w-12 h-12 ${item.typeInfo.color} stroke-[1.5]`} />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </div>
                          {renamingId === item.id ? (
                            <Input 
                              autoFocus
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              onKeyDown={(e) => handleRenameSubmit(e, item)}
                              onBlur={() => setRenamingId(null)}
                              className="h-6 text-[11px] text-center bg-white dark:bg-zinc-800 border-primary focus:ring-1 focus:ring-primary py-0"
                            />
                          ) : (
                            <span className="text-[11px] font-medium text-center line-clamp-2 px-1 break-all transition-colors text-black group-[.selected]:bg-primary group-[.selected]:text-white group-[.selected]:rounded-sm">
                              {item.name}
                            </span>
                          )}
                        </motion.div>
                      </ContextMenuTrigger>
                      <FileContextMenu 
                        item={item} 
                        onPreview={handlePreview} 
                        onDownload={onDownload}
                        onShare={handleShare} 
                        onDelete={onDelete} 
                        onRename={() => handleStartRename(item)}
                        onTrash={onTrash}
                        onRestore={onRestore}
                        onGetInfo={(item) => { setInfoItem(item); setInfoDialogOpen(true); }}
                        isTrashMode={isTrashMode}
                      />
                    </ContextMenu>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center px-4 py-1 text-[11px] font-bold text-muted-foreground border-b border-border sticky top-0 bg-background/80 backdrop-blur z-20 uppercase tracking-wider">
                  <div className="flex-1">Name</div>
                  <div className="w-48">Date Modified</div>
                  <div className="w-32">Kind</div>
                  <div className="w-24 text-right">Size</div>
                  <div className="w-10"></div>
                </div>
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <motion.div
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`finder-list-item h-8 group outline-none ${selectedId === item.id ? 'selected' : ''}`}
                          onClick={(e) => handleItemClick(e, item.id)}
                          onDoubleClick={() => handleItemDoubleClick(item)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleStartRename(item);
                            if (e.key === 'Backspace' && (e.metaKey || e.ctrlKey)) onTrash(item.id);
                          }}
                        >
                           <div className="flex-1 flex items-center gap-3 min-w-0">
                            <div className="w-6 h-6 flex items-center justify-center rounded-md overflow-hidden bg-black/5 dark:bg-white/5 border border-border">
                               {item.isFolder ? (
                                 <Folder className="w-4 h-4 text-primary fill-primary/10 shrink-0" />
                               ) : (item.thumbnailUrl && item.typeInfo.label === 'Video') ? (
                                 <video 
                                     src={`${item.thumbnailUrl}#t=0.1`} 
                                     muted 
                                     playsInline 
                                     preload="metadata" 
                                     className="w-full h-full object-cover" 
                                 />
                               ) : (item.thumbnailUrl) ? (
                                 <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
                               ) : (
                                 <item.typeInfo.Icon className={`w-4 h-4 ${item.typeInfo.color} shrink-0`} />
                               )}
                            </div>
                            <div className="flex-1 min-w-0">
                               {renamingId === item.id ? (
                                 <Input 
                                   autoFocus
                                   value={newName}
                                   onChange={(e) => setNewName(e.target.value)}
                                   onKeyDown={(e) => handleRenameSubmit(e, item)}
                                   onBlur={() => setRenamingId(null)}
                                   className="h-6 text-[12px] bg-white dark:bg-zinc-800 border-primary focus:ring-1 focus:ring-primary py-0"
                                 />
                               ) : (
                                 <span className="text-[13px] font-medium truncate block text-black group-[.selected]:text-white">
                                   {item.name}
                                 </span>
                               )}
                            </div>
                         </div>
                           <div suppressHydrationWarning className={`w-48 whitespace-nowrap ${selectedId === item.id ? 'text-white/80' : 'text-muted-foreground'}`}>{formatDate(item.modified)}</div>
                           <div className={`w-32 whitespace-nowrap ${selectedId === item.id ? 'text-white/80' : 'text-muted-foreground'}`}>{item.type}</div>
                           <div className={`w-24 text-right whitespace-nowrap ${selectedId === item.id ? 'text-white/80' : 'text-muted-foreground'}`}>{formatBytes(item.size)}</div>
                           <div className="w-10 flex justify-center">
                              <ItemActions item={item} onShare={handleShare} onPreview={handlePreview} onDelete={onDelete} isSelected={selectedId === item.id} />
                           </div>
                        </motion.div>
                      </ContextMenuTrigger>
                      <FileContextMenu 
                          item={item} 
                          onPreview={handlePreview} 
                          onDownload={onDownload}
                          onShare={handleShare} 
                          onDelete={onDelete} 
                          onRename={() => handleStartRename(item)}
                          onTrash={onTrash}
                          onRestore={onRestore}
                          onGetInfo={(item) => { setInfoItem(item); setInfoDialogOpen(true); }}
                          isTrashMode={isTrashMode}
                      />
                    </ContextMenu>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <ShareDialog url={shareUrl} opened={shareDialogOpen} onClose={() => setShareDialogOpen(false)} />
      <PreviewDialog
        fileKey={previewKey}
        previewUrl={previewUrl}
        opened={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
      />

      <GetInfoDialog 
        item={infoItem} 
        opened={infoDialogOpen} 
        onClose={() => setInfoDialogOpen(false)} 
      />
    </div>
  );
}

function ItemActions({ item, onShare, onPreview, isSelected }) {
  return (
    <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
       <Button 
         variant="ghost" 
         size="icon" 
         className={`h-7 w-7 ${isSelected ? 'text-white hover:bg-white/20' : 'text-muted-foreground hover:bg-black/5'}`}
         onClick={(e) => { e.stopPropagation(); onPreview(item.id); }}
       >
         <Eye className="w-3.5 h-3.5" />
       </Button>
       <Button 
         variant="ghost" 
         size="icon" 
         className={`h-7 w-7 ${isSelected ? 'text-white hover:bg-white/20' : 'text-muted-foreground hover:bg-black/5'}`}
         onClick={(e) => { e.stopPropagation(); onShare(item.id); }}
       >
         <Share2 className="w-3.5 h-3.5" />
       </Button>
    </div>
  );
}

function FileContextMenu({ item, onPreview, onDownload, onShare, onDelete, onRename, onTrash, onRestore, onGetInfo, isTrashMode }) {
  // Removed internal handleDownload - using prop-based onDownload

  return (
    <ContextMenuContent className="w-56">
      {!item.isFolder && (
        <ContextMenuItem onClick={() => onPreview(item.id)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Quick Look</span>
          <ContextMenuShortcut>⌘Y</ContextMenuShortcut>
        </ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => onShare(item.id)}>
        <Share2 className="mr-2 h-4 w-4" />
        <span>Share</span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      {isTrashMode ? (
        <>
          <ContextMenuItem onClick={() => onRestore(item.id)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Restore</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDelete(item.id)} className="text-red-500 focus:bg-red-500 focus:text-white">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Permanently</span>
          </ContextMenuItem>
        </>
      ) : (
        <>
          <ContextMenuItem onClick={onRename}>
            <Edit3 className="mr-2 h-4 w-4" />
            <span>Rename</span>
            <ContextMenuShortcut>Enter</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDownload(item.id)}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => onTrash(item.id)} className="text-red-500 focus:bg-red-500 focus:text-white">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Move to Trash</span>
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onGetInfo(item)}>
        <Info className="mr-2 h-4 w-4" />
        <span>Get Info</span>
        <ContextMenuShortcut>⌘I</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}

function GetInfoDialog({ item, opened, onClose }) {
  if (!item) return null;

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-border bg-glass backdrop-blur-3xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-black/5 dark:bg-white/5 p-8 flex flex-col items-center border-b border-border">
           <div className={`w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center mb-4 overflow-hidden border border-border/50 bg-white dark:bg-black/20 ${item.isFolder ? 'bg-blue-500 shadow-blue-500/20' : item.typeInfo?.bgColor || 'bg-slate-500 shadow-slate-500/20'}`}>
              {item.isFolder ? (
                <Folder className="w-16 h-16 text-white" />
              ) : item.thumbnailUrl ? (
                item.typeInfo?.label === 'Video' ? (
                  <video 
                    src={`${item.thumbnailUrl}#t=0.1`} 
                    muted 
                    playsInline 
                    preload="metadata" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt={item.name} />
                )
              ) : (
                item.typeInfo ? <item.typeInfo.Icon className="w-16 h-16 text-white" /> : <FileText className="w-16 h-16 text-white" />
               )}
            </div>
            <DialogTitle className="text-xl font-bold text-black text-center truncate w-full px-4">{item.name}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">{item.isFolder ? 'Folder' : item.type}</p>
         </div>

        <div className="p-6 space-y-6 text-black">
           <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                 <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Size</span>
                 <span className="text-xs font-bold mt-0.5">{item.size ? formatBytes(item.size) : '--'}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                 <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Kind</span>
                 <span className="text-xs font-bold mt-0.5">{item.isFolder ? 'Folder' : 'File'}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                 <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Items</span>
                 <span className="text-xs font-bold mt-0.5">{item.isFolder ? '-' : '1'}</span>
              </div>
           </div>

           <div className="space-y-4">
              <section className="space-y-1">
                 <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Metadata
                 </h3>
                 <div className="p-3 rounded-lg border border-border space-y-2 text-[12px]">
                    <div className="flex justify-between gap-4">
                       <span className="text-muted-foreground shrink-0">Location</span>
                       <span className="font-medium text-foreground truncate text-right">s3://{item.id}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-muted-foreground">Modified</span>
                       <span className="font-medium text-foreground">{item.modified ? formatDate(item.modified) : '--'}</span>
                    </div>
                 </div>
              </section>

              <section className="space-y-1">
                 <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> System Info
                 </h3>
                 <div className="p-3 rounded-lg border border-border space-y-2 text-[12px]">
                    <div className="flex justify-between items-center">
                       <span className="text-muted-foreground">Sharing</span>
                       <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">Private</span>
                    </div>
                 </div>
              </section>
           </div>
        </div>

        <div className="p-4 border-t border-border bg-black/5 dark:bg-white/5 flex justify-end">
           <Button variant="outline" size="sm" onClick={onClose} className="h-8 font-bold border-border hover:bg-black/5">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


