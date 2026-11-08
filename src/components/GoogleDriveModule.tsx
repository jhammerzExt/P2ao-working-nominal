import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Folder, 
  FileCode, 
  Image as ImageIcon, 
  Film, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Upload,
  Eye,
  LogOut,
  UserCheck
} from 'lucide-react';
import { 
  initDriveAuth, 
  signInWithGoogleDrive, 
  signOutGoogleDrive, 
  listDriveFiles, 
  createDriveFile, 
  deleteDriveFile, 
  readDriveFileContent, 
  getDriveAccessToken,
  type DriveFile 
} from '../utils/googleDrive';
import type { User } from 'firebase/auth';

interface GoogleDriveModuleProps {
  onSaveToVault?: (title: string, content: string, model: string) => void;
}

export const GoogleDriveModule: React.FC<GoogleDriveModuleProps> = ({ onSaveToVault }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getDriveAccessToken());
  const [needsAuth, setNeedsAuth] = useState<boolean>(!getDriveAccessToken());
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');

  // Preview file content modal
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  // New File modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('aurelius_synthesis.txt');
  const [newFileContent, setNewFileContent] = useState<string>(
    '# Aurelius Sovereign Agent Synthesis\n\nExported directly to Google Drive.\nInvariant: "I AM WE ARE WE ARE I AM"'
  );
  const [newFileMimeType, setNewFileMimeType] = useState<string>('text/plain');
  const [creatingFile, setCreatingFile] = useState<boolean>(false);

  // Destructive Action Confirmation Dialog state (MANDATORY per skill guidelines)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<boolean>(false);

  // Initialize auth
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when token is available
  const fetchFiles = async () => {
    const token = accessToken || getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const driveFiles = await listDriveFiles(token);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Drive fetch error:', err);
      if (err.message && (err.message.includes('401') || err.message.includes('token') || err.message.includes('invalid'))) {
        setNeedsAuth(true);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch Google Drive files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles();
    }
  }, [accessToken]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleDrive();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setFiles([]);
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = accessToken || getDriveAccessToken();
    if (!token) return;

    setCreatingFile(true);
    setError(null);
    try {
      await createDriveFile(token, newFileName, newFileContent, newFileMimeType);
      setShowCreateModal(false);
      setNewFileName('aurelius_synthesis.txt');
      setNewFileContent('');
      await fetchFiles();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to create file in Google Drive');
    } finally {
      setCreatingFile(false);
    }
  };

  // Explicit user confirmation handler for deleting Google Drive file
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    const token = accessToken || getDriveAccessToken();
    if (!token) return;

    setDeletingFile(true);
    setError(null);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to delete file from Google Drive');
    } finally {
      setDeletingFile(false);
    }
  };

  const handlePreviewFile = async (file: DriveFile) => {
    setPreviewFile(file);
    setPreviewContent(null);
    const token = accessToken || getDriveAccessToken();
    if (!token) return;

    if (
      file.mimeType.includes('text') ||
      file.mimeType.includes('json') ||
      file.mimeType.includes('markdown') ||
      file.mimeType.includes('javascript') ||
      file.mimeType.includes('typescript')
    ) {
      setLoadingContent(true);
      try {
        const text = await readDriveFileContent(token, file.id);
        setPreviewContent(text);
      } catch (e) {
        setPreviewContent('Unable to load text preview for this file format.');
      } finally {
        setLoadingContent(false);
      }
    }
  };

  // Filter files
  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFileType === 'folder') return f.mimeType.includes('folder');
    if (selectedFileType === 'docs') return f.mimeType.includes('document') || f.mimeType.includes('text');
    if (selectedFileType === 'sheets') return f.mimeType.includes('spreadsheet');
    if (selectedFileType === 'slides') return f.mimeType.includes('presentation');
    if (selectedFileType === 'code') return f.name.endsWith('.ts') || f.name.endsWith('.js') || f.name.endsWith('.json') || f.name.endsWith('.py');
    return true;
  });

  const getFileIcon = (mimeType: string, fileName: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-400" />;
    if (mimeType.includes('spreadsheet')) return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-400" />;
    if (mimeType.includes('video')) return <Film className="w-5 h-5 text-rose-400" />;
    if (fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.json') || fileName.endsWith('.py')) {
      return <FileCode className="w-5 h-5 text-cyan-400" />;
    }
    return <FileText className="w-5 h-5 text-sky-400" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-100 font-mono">Google Drive Integration</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                OAuth 2.0 Connected
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Browse, upload, preview, and manage files in Google Drive with permission from your account.
            </p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3 bg-zinc-950/80 p-2 pl-3.5 rounded-2xl border border-zinc-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-200 font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Official Sign-In With Google Button */
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{isSigningIn ? 'Signing In...' : 'Sign in with Google'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Main Content Area */}
      {needsAuth ? (
        <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 font-mono">Authentication Required</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please sign in with Google to grant the app permission to list, read, and create files in your Google Drive storage.
          </p>
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <HardDrive className="w-4 h-4" />
            <span>{isSigningIn ? 'Authenticating...' : 'Connect Google Drive'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Drive files..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">All File Types</option>
                <option value="docs">Documents / Text</option>
                <option value="sheets">Spreadsheets</option>
                <option value="slides">Presentations</option>
                <option value="code">Code Files (.ts, .py, .json)</option>
                <option value="folder">Folders</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchFiles}
                disabled={loading}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                title="Refresh Files"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Drive File</span>
              </button>
            </div>
          </div>

          {/* Files List Table */}
          {loading ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
              <span>Fetching Google Drive file list...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs bg-zinc-900/30 rounded-3xl border border-zinc-800">
              No files found matching your search criteria in Google Drive.
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Modified</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-zinc-850/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-zinc-100 flex items-center gap-2.5">
                          {getFileIcon(file.mimeType, file.name)}
                          <span className="truncate max-w-xs">{file.name}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {file.mimeType.split('.').pop()?.replace('vnd.google-apps.', '') || file.mimeType}
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {file.size ? `${Math.round(parseInt(file.size, 10) / 1024)} KB` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
                                title="Open in Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handlePreviewFile(file)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-sky-400 transition-colors"
                              title="Preview Content"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setFileToDelete(file)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                              title="Delete File (Requires Confirmation)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MANDATORY Explicit User Confirmation Modal for Destructive Operations */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Confirm File Deletion</h3>
                <p className="text-[11px] text-zinc-400">Permanent Google Drive Action</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 space-y-2">
              <p className="font-semibold text-zinc-100">
                Are you sure you want to delete <span className="text-amber-400">"{fileToDelete.name}"</span> from Google Drive?
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                This action will delete the file directly from your Google Drive account. This action cannot be undone automatically.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={deletingFile}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFile}
                disabled={deletingFile}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                {deletingFile ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono text-xs">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create New Google Drive File</span>
            </h3>

            <form onSubmit={handleCreateFile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">File Name</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. synthesis.txt or notes.md"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">File Content</label>
                <textarea
                  rows={6}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500/50"
                  placeholder="Write content to save to Google Drive..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFile}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center gap-1.5"
                >
                  {creatingFile ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Save to Drive</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Content Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-zinc-100 truncate">{previewFile.name}</span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-zinc-950 font-mono text-xs text-zinc-300">
              {loadingContent ? (
                <div className="p-8 text-center text-zinc-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Loading file content from Google Drive...</span>
                </div>
              ) : previewContent ? (
                <pre className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                  {previewContent}
                </pre>
              ) : (
                <p className="text-zinc-500 italic">No text content available or binary file format.</p>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/60">
              {previewFile.webViewLink && (
                <a
                  href={previewFile.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Drive</span>
                </a>
              )}
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
