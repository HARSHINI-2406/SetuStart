import React, { useEffect, useState } from 'react';
import { aiApi } from '../services/api';
import { AISuggestionLog } from '../types';
import { Sparkles, CheckCircle2, ShieldCheck, X, FileText } from 'lucide-react';

interface AITransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AITransparencyModal: React.FC<AITransparencyModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AISuggestionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      aiApi.getLogs().then(data => {
        setLogs(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-700/50 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                <span>AI Transparency Ledger</span>
                <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">Auditable</span>
              </h2>
              <p className="text-xs text-slate-400">AI assists. Rules evaluate. Humans decide. Every prompt & output logged.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading AI logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No AI proxy queries logged yet.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                  <span>Log #{log.id} • User #{log.user_id}</span>
                  <span className="text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">Input Prompt Context:</p>
                  <pre className="mt-1 text-xs bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {log.prompt_text}
                  </pre>
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Gemini AI Response:</span>
                  </p>
                  <div className="mt-1 text-xs bg-blue-950/30 p-3 rounded border border-blue-900/40 text-blue-200 space-y-2">
                    <p className="font-semibold">{log.response_json.problem_summary}</p>
                    {log.response_json.suggested_kpis && (
                      <div>
                        <span className="font-semibold text-slate-300">Suggested KPIs: </span>
                        {log.response_json.suggested_kpis.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                  <span className="text-amber-400 italic">{log.response_json.disclaimer}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    Human Action: {log.human_action}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>AI never auto-approves or auto-selects startups.</span>
          </span>
          <button onClick={onClose} className="btn-secondary text-xs">Close</button>
        </div>

      </div>
    </div>
  );
};
