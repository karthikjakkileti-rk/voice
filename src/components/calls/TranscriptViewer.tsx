'use client';

import React, { useState } from 'react';
import { CallTranscript } from '@/types/api';
import { Bot, User, Search, Sparkles } from 'lucide-react';
import { formatDuration, cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export interface TranscriptViewerProps {
  transcripts?: CallTranscript[];
  agentName?: string;
  callerNumber?: string;
  className?: string;
}

export function TranscriptViewer({
  transcripts = [],
  agentName = 'Admission AI',
  callerNumber = 'Caller',
  className,
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTurns = searchQuery
    ? transcripts.filter((t) =>
        (t.text || t.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.intent || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcripts;

  if (transcripts.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 text-sm">
        No conversation transcript recorded for this call.
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Transcript Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search within conversation dialogue..."
          className="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 pl-9 pr-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Turns List */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {filteredTurns.map((turn, index) => {
          const isAgent = turn.speaker === 'agent';
          const text = turn.text || turn.message || '';
          const timestamp = turn.timestamp_seconds ?? (turn.audio_timestamp_offset_ms ? turn.audio_timestamp_offset_ms / 1000 : 0);

          return (
            <div
              key={turn.id || index}
              className={cn(
                'flex items-start gap-3 text-sm transition-all',
                isAgent ? 'flex-row' : 'flex-row-reverse'
              )}
            >
              {/* Speaker Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm',
                  isAgent
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                )}
              >
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl p-4 shadow-sm space-y-1.5',
                  isAgent
                    ? 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-between gap-3 text-[11px] font-medium pb-1 border-b',
                    isAgent
                      ? 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      : 'border-indigo-500/60 text-indigo-100'
                  )}
                >
                  <span className="font-semibold">{isAgent ? agentName : callerNumber}</span>
                  <span className="font-mono">{formatDuration(timestamp)}</span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{text}</p>

                {/* Intent & Confidence metadata */}
                {(turn.intent || turn.confidence !== undefined) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    {turn.intent && (
                      <Badge
                        variant={isAgent ? 'primary' : 'outline'}
                        size="sm"
                        className={cn(
                          'text-[10px] gap-1',
                          !isAgent && 'border-indigo-300 text-white bg-indigo-700/50'
                        )}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{turn.intent.replace(/_/g, ' ')}</span>
                      </Badge>
                    )}
                    {turn.confidence !== undefined && (
                      <span
                        className={cn(
                          'text-[10px] font-mono',
                          isAgent ? 'text-slate-400' : 'text-indigo-200'
                        )}
                      >
                        {Math.round(turn.confidence * 100)}% match
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
