'use client';

import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  FileCheck,
  Plus,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface OnboardingDoc {
  id: string;
  title: string;
  category: 'admissions' | 'fees' | 'courses' | 'general';
  fileType: 'pdf' | 'docx' | 'txt' | 'csv';
  fileSize: string;
  status: 'ready' | 'processing' | 'uploading' | 'failed';
  file?: File;
}

interface StageTeachAiProps {
  documents: OnboardingDoc[];
  onAddDocument: (doc: OnboardingDoc) => void;
  onRemoveDocument: (docId: string) => void;
}

export function StageTeachAi({
  documents,
  onAddDocument,
  onRemoveDocument,
}: StageTeachAiProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    Array.from(files).forEach((file, index) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileType = (['pdf', 'docx', 'txt', 'csv'].includes(ext) ? ext : 'pdf') as OnboardingDoc['fileType'];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

      const newDoc: OnboardingDoc = {
        id: `doc_${Date.now()}_${index}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'admissions',
        fileType,
        fileSize: `${sizeMb} MB`,
        status: 'uploading',
        file,
      };

      onAddDocument(newDoc);

      // Transition to ready state
      setTimeout(() => {
        newDoc.status = 'ready';
        setIsUploading(false);
      }, 700);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getStatusBadge = (status: OnboardingDoc['status']) => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant="success" size="sm" className="gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Ready</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="warning" size="sm" className="gap-1 font-semibold">
            <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
            <span>Processing</span>
          </Badge>
        );
      case 'uploading':
        return (
          <Badge variant="neutral" size="sm" className="gap-1 font-semibold">
            <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
            <span>Uploading</span>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="danger" size="sm" className="gap-1 font-semibold">
            <span>Failed</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stage Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Stage 02 • Institutional Knowledge Grounding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Teach your AI what students need to know.
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
          Your AI counselor uses trusted institutional documents to answer candidate inquiries with exact eligibility cutoffs, scholarship percentages, and fee disclosures.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-slate-50 to-indigo-50/70 border border-indigo-100/90 shadow-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
          Knowledge Ingestion Pipeline
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-slate-900 block">1. Documents</span>
            <span className="text-[11px] text-slate-500">Official Prospectus & Handbooks</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-indigo-600 block">2. Ingestion</span>
            <span className="text-[11px] text-slate-500">Chunking & Semantic Parsing</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-purple-600 block">3. Knowledge Base</span>
            <span className="text-[11px] text-slate-500">Verified Institutional Facts</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="font-bold text-emerald-600 block">4. AI Counselor</span>
            <span className="text-[11px] text-slate-500">Zero Hallucination Voice Delivery</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-3.5 group ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/60 scale-[1.01]'
            : 'border-slate-300/80 hover:border-indigo-400 bg-white/80 hover:bg-slate-50/80 shadow-md shadow-slate-200/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>

        <div className="space-y-1 max-w-md">
          <p className="text-base font-bold text-slate-900">
            Drop your institution documents here, or{' '}
            <span className="text-indigo-600 underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Supported formats: PDF, DOCX, TXT, CSV (up to 25MB per file)
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            Admissions Handbooks
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            Fee Structures
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            Cutoff Matrices
          </span>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Configured Knowledge Documents</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700">
              {documents.length}
            </span>
          </h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Document</span>
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-center text-xs text-slate-500">
            No documents uploaded yet. Upload a document or continue with the default admissions handbook.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate" title={doc.title}>
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span className="uppercase font-mono">{doc.fileType}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(doc.status)}
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveDocument(doc.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
