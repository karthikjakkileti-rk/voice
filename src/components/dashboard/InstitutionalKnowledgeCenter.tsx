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
  Database,
  Layers,
} from 'lucide-react';
import { KnowledgeDocument } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/utils';

interface InstitutionalKnowledgeCenterProps {
  documents: KnowledgeDocument[];
  orgSlug: string;
}

export function InstitutionalKnowledgeCenter({
  documents,
  orgSlug,
}: InstitutionalKnowledgeCenterProps) {
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
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              INSTITUTIONAL KNOWLEDGE
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Institutional Memory</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Verified institutional policies, program curricula, fee structures, and campus guidelines.
          </p>
        </div>

        <Link href={`/${orgSlug}/knowledge`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>Manage Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Institutional Memory Health Breakdown */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Ready
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
            {readyDocs.length}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Processing
          </span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 block">
            {processingDocs.length}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            failedDocs.length > 0
              ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200/80 text-rose-800 dark:text-rose-300'
              : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800 text-slate-500'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Failed</span>
          <span className={`text-xl font-black font-mono mt-0.5 block ${failedDocs.length > 0 ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300'}`}>
            {failedDocs.length}
          </span>
        </div>
      </div>

      {/* Failure Banner if any doc failed */}
      {failedDocs.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="truncate">
              <strong>{failedDocs.length} Document Ingestion Error:</strong> Review required to ground answers.
            </span>
          </div>
          <Link href={`/${orgSlug}/knowledge`}>
            <Button size="sm" variant="outline" className="h-7 text-xs font-semibold border-rose-300 text-rose-700 hover:bg-rose-100">
              Review
            </Button>
          </Link>
        </div>
      )}

      {/* Active Knowledge Documents List */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
          Active Knowledge Documents ({documents.slice(0, 3).length} of {documents.length})
        </span>

        {documents.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            No institutional documents uploaded yet. Add brochures or fee sheets to empower AI counselors.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {documents.slice(0, 3).map((doc) => {
              const fileSize = formatFileSize(doc.file_size_bytes);

              return (
                <div
                  key={doc.id}
                  className="p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7.5 h-7.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/70 dark:border-slate-700">
                      {getFileIcon(doc.file_type || doc.source_type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {doc.category && <span className="capitalize">{doc.category}</span>}
                        {fileSize && ` • ${fileSize}`}
                        {doc.updated_at && ` • Updated ${formatTimeAgo(doc.updated_at)}`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-semibold uppercase font-mono shrink-0 ${
                      doc.status === 'ready' || doc.status === 'indexed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60'
                        : doc.status === 'failed'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60'
                    }`}
                  >
                    {doc.status === 'ready' || doc.status === 'indexed' ? 'Ready' : doc.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
