'use client';

import React from 'react';
import {
  Building2,
  GraduationCap,
  BookOpen,
  School,
  Globe,
  MapPin,
  Phone,
  CheckCircle2,
  Sparkles,
  Check,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface InstitutionFormData {
  name: string;
  slug: string;
  institutionType: string;
  city: string;
  state: string;
  contactPhone: string;
  websiteUrl: string;
}

interface StageInstitutionProps {
  data: InstitutionFormData;
  onChange: (updates: Partial<InstitutionFormData>) => void;
  errors?: Record<string, string>;
}

const INSTITUTION_TYPES = [
  {
    id: 'college',
    label: 'College / Engineering',
    desc: 'Undergraduate & degree programs',
    icon: Building2,
  },
  {
    id: 'university',
    label: 'University / Deemed',
    desc: 'Multi-department & research campus',
    icon: GraduationCap,
  },
  {
    id: 'coaching',
    label: 'Coaching & Academy',
    desc: 'Competitive exams & skill institutes',
    icon: BookOpen,
  },
  {
    id: 'school',
    label: 'K-12 School',
    desc: 'Primary & senior secondary school',
    icon: School,
  },
];

export function StageInstitution({ data, onChange, errors = {} }: StageInstitutionProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    onChange({ name: val, slug: autoSlug });
  };

  const getTypeName = (type: string) => {
    const found = INSTITUTION_TYPES.find((t) => t.id === type);
    return found ? found.label : 'Higher Education Institution';
  };

  const isComplete = Boolean(
    data.name.trim() &&
    data.slug.trim() &&
    data.institutionType &&
    data.city.trim() &&
    data.state.trim() &&
    data.contactPhone.trim()
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stage Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
          <Building2 className="w-3.5 h-3.5" />
          <span>Stage 01 • Institution Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Let&apos;s start with your institution.
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
          Tell us about the institution your AI counselor will represent. This grounds its identity, admission rules, and student greeting.
        </p>
      </div>

      {/* Tactile Institution Type Selection Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Select Institution Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {INSTITUTION_TYPES.map((type) => {
            const isSelected = data.institutionType === type.id;
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange({ institutionType: type.id })}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between space-y-2 group cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-600/10 ring-2 ring-indigo-600/20 scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {type.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    {type.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-slate-200/40 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Institution Profile Details</h3>
              <p className="text-xs text-slate-500">Official name and contact coordinates</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Institution Name */}
            <Input
              label="Institution Name"
              placeholder="e.g. Apex Engineering College"
              value={data.name}
              onChange={handleNameChange}
              error={errors.name}
              required
            />

            {/* Slug */}
            <Input
              label="Workspace URL Slug"
              placeholder="apex-college"
              value={data.slug}
              onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
              error={errors.slug}
              helperText="Dashboard route: /[slug]"
              required
            />

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Campus City"
                placeholder="e.g. Hyderabad"
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
                error={errors.city}
                required
              />
              <Input
                label="State / Province"
                placeholder="e.g. Telangana"
                value={data.state}
                onChange={(e) => onChange({ state: e.target.value })}
                error={errors.state}
                required
              />
            </div>

            {/* Contact Phone & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Contact Phone"
                placeholder="+91 98765 43210"
                value={data.contactPhone}
                onChange={(e) => onChange({ contactPhone: e.target.value })}
                error={errors.contactPhone}
                helperText="Indian mobile or landline"
                required
              />
              <Input
                label="Official Website (Optional)"
                placeholder="https://apex.edu.in"
                value={data.websiteUrl}
                onChange={(e) => onChange({ websiteUrl: e.target.value })}
                helperText="Optional reference"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-indigo-950/5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Live Profile Preview
                </span>
              </div>
              <Badge
                variant={isComplete ? 'success' : 'neutral'}
                size="sm"
                className="gap-1 font-semibold"
              >
                {isComplete ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Profile Ready</span>
                  </>
                ) : (
                  <span>Drafting...</span>
                )}
              </Badge>
            </div>

            {/* Institution Badge Display */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-500/20 shrink-0">
                {data.name.trim() ? data.name.trim().charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight truncate">
                  {data.name.trim() || 'Institution Name'}
                </h3>
                <p className="text-xs text-indigo-600 font-semibold truncate">
                  {getTypeName(data.institutionType)}
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  app.eduvoice.ai/{data.slug || 'slug'}
                </p>
              </div>
            </div>

            {/* Detail Coordinates Preview */}
            <div className="space-y-2.5 pt-2 text-xs text-slate-600 border-t border-slate-200/60">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-100">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="truncate">
                  {data.city && data.state
                    ? `${data.city}, ${data.state}, India`
                    : 'Location: City, State'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-100">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono truncate">
                  {data.contactPhone || 'Contact phone number'}
                </span>
              </div>

              {data.websiteUrl && (
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-100">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{data.websiteUrl}</span>
                </div>
              )}
            </div>

            {/* AI Assistant Context Note */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100/90 text-xs text-indigo-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-indigo-700">
                <span>🤖</span>
                <span>AI Identity Grounding</span>
              </p>
              <p className="text-[11px] text-indigo-800 leading-relaxed font-normal">
                Maya will introduce herself as the official admission counselor for{' '}
                <strong>{data.name.trim() || 'your institution'}</strong> located in{' '}
                <strong>{data.city || 'your city'}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
