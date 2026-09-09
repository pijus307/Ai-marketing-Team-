/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Clock, Send, Star, Compass, AlertCircle } from 'lucide-react';
import { EmailReport } from '../types';

interface EmailSequenceViewProps {
  report: EmailReport;
}

export default function EmailSequenceView({ report }: EmailSequenceViewProps) {
  return (
    <div className="space-y-8">
      {/* Workstation Header */}
      <div className="bg-zinc-900 border border-zinc-950 rounded-md p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-xs text-zinc-100 font-mono tracking-wider uppercase font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" />
            Inbox Engagement & Lead Nurture
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Lifecycle Email Nurture Sequence
          </h1>
          <p className="text-zinc-300 text-sm md:text-base mt-2 leading-relaxed">
            Prepared by <strong className="text-white font-semibold">Daniel Kross</strong> &bull; Lifecycle Marketer
          </p>
        </div>
      </div>

      {/* Campaign Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campaign Name & Goal */}
        <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded text-zinc-700">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">CAMPAIGN SEQUENCE GOAL</span>
            <p className="text-base font-bold text-zinc-900 mt-0.5">{report.sequenceGoal}</p>
          </div>
        </div>

        {/* Industry Benchmarks */}
        <div className="bg-white border border-zinc-200 rounded-md p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded text-zinc-700">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">PROJECTED BENCHMARK OPEN RATE</span>
            <p className="text-base font-bold text-zinc-900 mt-0.5">{report.estimatedOpenRate || '42-45%'}</p>
          </div>
        </div>
      </div>

      {/* Sequence List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
          <Send className="w-5 h-5 text-zinc-700" />
          3-Part Welcome & Nurture Sequence
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {report.emails?.map((email, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-md shadow-sm hover:border-zinc-450 transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="p-5 space-y-4">
                {/* Header Timing & Delay */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-800 font-mono font-bold uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    DELAY: {email.delayDays === 0 ? 'INSTANT (DAY 0)' : `DAY +${email.delayDays}`}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                    STEP {idx + 1} OF 3
                  </span>
                </div>

                {/* Email Subject line & preheader mock */}
                <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-md text-xs space-y-2">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block">SUBJECT:</span>
                    <p className="text-zinc-950 mt-0.5 font-bold">{email.subjectLine}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase block">PREVIEW TEXT:</span>
                    <p className="text-zinc-500 mt-0.5 font-medium italic">{email.previewText}</p>
                  </div>
                </div>

                {/* Email Body mock window */}
                <div className="pt-3 border-t border-zinc-150">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block mb-2">EMAIL BODY COPY</span>
                  <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-md text-xs text-zinc-700 font-medium whitespace-pre-wrap leading-relaxed h-72 overflow-y-auto divide-y-0">
                    {email.body}
                  </div>
                </div>
              </div>

              {/* Conversion objective footer */}
              <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center gap-2.5 text-xs text-zinc-500 rounded-b-md font-medium">
                <AlertCircle className="w-4 h-4 text-zinc-700 flex-shrink-0" />
                <span>
                  <strong className="text-zinc-850 font-bold">Objective:</strong> {email.purpose}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
