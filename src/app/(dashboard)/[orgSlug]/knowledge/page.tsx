'use client';

import React, { useState } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useKnowledge } from '@/hooks/useKnowledge';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { dataProvider } from '@/services/data-provider';
import { KnowledgeDocument, KnowledgeSearchResult } from '@/types/api';
import { DemoKnowledgeChunk } from '@/types/demo';
import {
  BookOpen,
  Upload,
  Search,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { formatBytes, formatTimeAgo } from '@/lib/utils';

export default function KnowledgePage() {
  const { organizationId, userRole } = useCurrentOrg();
  const { demoMode } = useAuth();
  const { documents, isLoading, isError, error, refetch, uploadDocument, isUploading, deleteDocument } =
    useKnowledge(organizationId);
  const { success, error: toastError } = useToast();

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('fees');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<KnowledgeDocument | null>(null);

  // Chunk Inspector Drawer State (Section 5)
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectDoc, setInspectDoc] = useState<KnowledgeDocument | null>(null);
  const [inspectChunks, setInspectChunks] = useState<DemoKnowledgeChunk[]>([]);
  const [chunksSupported, setChunksSupported] = useState(true);

  // RAG Search Tester State
  const [searchQuery, setSearchQuery] = useState('What is the scholarship for students with >90% marks?');
  const [searchResults, setSearchResults] = useState<KnowledgeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'admin' || userRole === 'staff';

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    if (selectedFile) {
      const allowedExts = ['pdf', 'docx', 'txt'];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExts.includes(fileExt)) {
        toastError('Invalid file type. Only PDF, DOCX, and TXT files are accepted.');
        return;
      }
      if (selectedFile.size > 25 * 1024 * 1024) {
        toastError('File size exceeds the 25MB limit.');
        return;
      }
    }

    try {
      await uploadDocument({
        title: docTitle,
        category: docCategory,
        file_type: selectedFile?.name.split('.').pop() || 'pdf',
        file_size_bytes: selectedFile?.size || 1500000,
        file: selectedFile || undefined,
      });
      success(`Document '${docTitle}' uploaded and indexed into RAG vector store.`);
      setUploadModalOpen(false);
      setDocTitle('');
      setSelectedFile(null);
    } catch (err: any) {
      toastError(err.message || 'Upload failed');
    }
  };

  const confirmDelete = (doc: KnowledgeDocument) => {
    if (!isAdmin) {
      toastError('Permission denied: Only administrators can delete knowledge documents.');
      return;
    }
    setDocToDelete(doc);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      await deleteDocument(docToDelete.id);
      success(`Document '${docToDelete.title}' deleted.`);
      setDeleteConfirmOpen(false);
      setDocToDelete(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to delete document');
    }
  };

  const handleInspectChunks = async (doc: KnowledgeDocument) => {
    setInspectDoc(doc);
    setInspectModalOpen(true);
    if (!organizationId) return;

    const res = await dataProvider.getKnowledgeChunks(organizationId, doc.id);
    setChunksSupported(res.supported);
    setInspectChunks(res.data);
  };

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || !organizationId) return;

    setIsSearching(true);
    try {
      const results = await dataProvider.searchKnowledge(organizationId, searchQuery, 3);
      setSearchResults(results);
    } catch (err: any) {
      toastError(err.message || 'Search test failed');
    } finally {
      setIsSearching(false);
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load knowledge base"
        message={error instanceof Error ? error.message : 'Error communicating with knowledge service'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">RAG Knowledge Base</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ground your AI admission counselors in verified fee tables, eligibility rules, and institutional brochures.
          </p>
        </div>

        {isStaff && (
          <Button onClick={() => setUploadModalOpen(true)} className="gap-2 shrink-0">
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </Button>
        )}
      </div>

      {/* Main Grid: Document List & Interactive Semantic RAG Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Documents Library */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Institutional Documents</CardTitle>
                <CardDescription>Vector-embedded documents indexed for real-time speech retrieval.</CardDescription>
              </div>
              <Badge variant="primary" size="sm">
                {documents.length} Indexed
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
              ) : documents.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No Documents Uploaded"
                  description="Upload your institution's 2026 admission brochure or fee structure PDF to ground the AI."
                  actionLabel={isStaff ? 'Upload Document' : undefined}
                  onAction={isStaff ? () => setUploadModalOpen(true) : undefined}
                />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{doc.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs mt-1">
                            <Badge variant="neutral" size="sm" className="capitalize">
                              {doc.category}
                            </Badge>
                            <span>•</span>
                            <span className="uppercase">{doc.file_type || doc.source_type || 'PDF'}</span>
                            <span>•</span>
                            <span>{formatBytes(doc.file_size_bytes || 1200000)}</span>
                            <span>•</span>
                            <span>{doc.chunks_count || doc.total_chunks || 18} Chunks</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInspectChunks(doc)}
                          className="h-8 text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          <Layers className="w-3.5 h-3.5 mr-1" />
                          <span>Chunks</span>
                        </Button>

                        {isAdmin && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(doc)}
                            className="h-8 w-8 text-slate-400 hover:text-rose-600"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive RAG Search Tester */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <CardTitle className="text-base">RAG Semantic Search Test</CardTitle>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test semantic vector retrieval on student questions before live calls.
            </p>

            <form onSubmit={handleTestSearch} className="space-y-3">
              <Input
                placeholder="Ask a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="sm" className="w-full text-xs" isLoading={isSearching}>
                <Search className="w-3.5 h-3.5 mr-1.5" />
                <span>Test Vector Retrieval</span>
              </Button>
            </form>

            {/* Search Results */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Retrieved Context Chunks (Top-3):
              </span>

              {searchResults.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center italic">
                  Run a query to inspect vector matching scores.
                </div>
              ) : (
                searchResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                        {res.document_title}
                      </span>
                      <Badge variant="success" size="sm" className="text-[10px] font-mono">
                        {Math.round(res.similarity_score * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      &ldquo;{res.content}&rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen} title="Upload Knowledge Document">
        <form onSubmit={handleUpload} className="space-y-4 my-2">
          <Input
            label="Document Title"
            placeholder="e.g. 2026-2027 B.Tech Fee Structure & Scholarships"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={docCategory}
            onChange={(e) => setDocCategory(e.target.value)}
            options={[
              { value: 'fees', label: 'Fees & Payment Structure' },
              { value: 'eligibility', label: 'Eligibility & Admission Criteria' },
              { value: 'hostel', label: 'Hostel & Residential Facilities' },
              { value: 'syllabus', label: 'Course Curriculum & Specializations' },
              { value: 'general', label: 'General Institution FAQs' },
            ]}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Document File (PDF, DOCX, TXT)
            </label>
            <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    if (!docTitle) setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                  }
                }}
                className="w-full text-xs text-slate-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-2">Maximum file size: 25MB.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUploading}>
              Upload & Vectorize
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Chunk Inspector Modal (Section 5) */}
      <Dialog
        open={inspectModalOpen}
        onOpenChange={setInspectModalOpen}
        title={`Text Chunks: ${inspectDoc?.title}`}
        description="Review parsed vector chunks extracted for RAG semantic search."
        maxWidth="lg"
      >
        <div className="space-y-3 my-2 max-h-[60vh] overflow-y-auto pr-1">
          {!chunksSupported ? (
            <div className="p-6 text-center text-xs text-slate-500 space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Chunk inspection API is pending backend implementation.
              </p>
              <p>Documents are vectorized in PostgreSQL pgvector directly on the server.</p>
            </div>
          ) : inspectChunks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No chunks generated yet.</div>
          ) : (
            inspectChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Chunk #{chunk.chunk_index + 1}</span>
                  {chunk.metadata?.section && <span>Section: {chunk.metadata.section}</span>}
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{chunk.content}</p>
              </div>
            ))
          )}
        </div>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Knowledge Document"
        description={`Are you sure you want to delete '${docToDelete?.title}'? This will remove its embeddings from vector memory.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
