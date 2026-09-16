'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileCheck,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KnowledgeDocument } from '@/types/api';
import { formatTimeAgo } from '@/lib/utils';

interface KnowledgeHealthProps {
  documents: KnowledgeDocument[];
  orgSlug: string;
  isLoading: boolean;
}

export function KnowledgeHealth({
  documents,
  orgSlug,
  isLoading,
}: KnowledgeHealthProps) {
  const categoryCounts = documents.reduce<Record<string, number>>((acc, doc) => {
    const cat = doc.category || 'general';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const readyDocs = documents.filter((d) => d.status === 'ready' || d.status === 'indexed');
  const processingDocs = documents.filter((d) => d.status === 'processing' || d.status === 'pending');
  const failedDocs = documents.filter((d) => d.status === 'failed');

  const getFileIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'txt':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <FileCheck className="w-4 h-4 text-indigo-600" />;
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return null;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Institutional AI Knowledge Base
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-normal leading-snug">
            Verified institutional documents grounding AI admissions answers in program facts and fee structures.
          </p>
        </div>

        <Badge variant="primary" size="sm" className="font-mono text-[10px] shrink-0">
          {documents.length} Docs
        </Badge>
      </div>

      {/* Operational Alert if Failed Documents exist */}
      {failedDocs.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>{failedDocs.length} Document Alert:</strong> Indexing errors.
            </span>
          </div>
          <Link href={`/${orgSlug}/knowledge`}>
            <Button size="sm" variant="outline" className="h-7 text-xs border-rose-200 text-rose-700">
              Fix Errors
            </Button>
          </Link>
        </div>
      )}

      {/* Document Status Breakdown — 2x2 Grid with generous width */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Indexed Documents
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            {readyDocs.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold truncate block">
            Ready for retrieval
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Processing / Queue
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            {processingDocs.length}
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold truncate block">
            In ingestion queue
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Categories
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            {Object.keys(categoryCounts).length}
          </span>
          <span className="text-[10px] text-slate-500 truncate block">
            Active sections
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Latest Document
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block truncate">
            {documents[0]?.title || 'None uploaded'}
          </span>
          <span className="text-[10px] text-slate-500 truncate block">
            {documents[0]?.created_at ? formatTimeAgo(documents[0].created_at) : 'No uploads'}
          </span>
        </div>
      </div>

      {/* Verified Document List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Active Institutional Reference Documents
        </h4>

        {isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-center text-xs text-slate-500">
            No knowledge documents uploaded yet. Upload admissions handbooks to ground the AI counselor.
          </div>
        ) : (
          <div className="space-y-2">
            {documents.slice(0, 4).map((doc) => {
              const size = formatFileSize(doc.file_size_bytes);

              return (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 text-xs hover:bg-slate-100/70 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {doc.category} {size && `• ${size}`} • Uploaded {formatTimeAgo(doc.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        doc.status === 'ready' || doc.status === 'indexed'
                          ? 'success'
                          : doc.status === 'failed'
                          ? 'danger'
                          : 'neutral'
                      }
                      size="sm"
                      className="text-[10px] font-semibold capitalize"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
