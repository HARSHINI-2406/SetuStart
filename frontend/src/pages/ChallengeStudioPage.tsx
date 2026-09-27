import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengesApi, templatesApi, aiApi } from '../services/api';
import { Template } from '../types';
import { Compass, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export const ChallengeStudioPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Waste Management');
  const [location, setLocation] = useState<string>('Zone 2 Ward 14 & 15');
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [currentProcess, setCurrentProcess] = useState<string>('');
  const [desiredOutcome, setDesiredOutcome] = useState<string>('');
  const [functionalReqs, setFunctionalReqs] = useState<string>('');
  const [technicalReqs, setTechnicalReqs] = useState<string>('');
  const [eligibilityReqs, setEligibilityReqs] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('₹15,000,000 - ₹30,000,000');
  const [timeline, setTimeline] = useState<string>('6 Months Pilot');
  const [kpiName, setKpiName] = useState<string>('Bin Overflow Reduction');
  const [kpiTarget, setKpiTarget] = useState<number>(40.0);
  const [kpiUnit, setKpiUnit] = useState<string>('%');

  const [publishing, setPublishing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    templatesApi.getAll().then(setTemplates).catch(console.error);
  }, []);

  const applyTemplate = (tpl: Template) => {
    setProblemStatement(prev => prev ? `${prev}\n\n[From Template: ${tpl.title}]\n${tpl.content}` : tpl.content);
  };

  const handleAIAnalyze = async () => {
    if (!problemStatement || !functionalReqs) {
      alert("Please fill in Problem Statement and Functional Requirements first.");
      return;
    }
    setLoadingAI(true);
    try {
      const res = await aiApi.analyzeChallenge({
        problem_statement: problemStatement,
        functional_requirements: functionalReqs,
        technical_requirements: technicalReqs
      });
      setAiSuggestions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const ch = await challengesApi.create({
        title,
        category,
        problem_statement: problemStatement,
        current_process: currentProcess,
        desired_outcome: desiredOutcome,
        functional_requirements: functionalReqs,
        technical_requirements: technicalReqs,
        eligibility_requirements: eligibilityReqs,
        budget_range: budgetRange,
        timeline,
        location,
        status: 'Published',
        kpis: [{ name: kpiName, target_value: kpiTarget, unit: kpiUnit }]
      });
      navigate(`/challenges/${ch.id}`);
    } catch (err) {
      console.error(err);
      setPublishing(false);
    }
  };

  const stepNames = ['1. Problem', '2. Outcomes', '3. Requirements', '4. Eligibility & KPIs', '5. Evaluation', '6. Review & Publish'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 space-y-4 border-l-4 border-l-blue-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Government Challenge Studio</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Author Government Challenge</h1>
            <p className="text-xs text-slate-600 mt-1">
              Structured multi-step problem statement formulation with template library & AI assistance.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
            Step {step} of 6: {stepNames[step - 1]}
          </span>
        </div>

        {/* Multi-Step Wizard Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stepNames.map((sName, idx) => (
            <button 
              key={idx} 
              onClick={() => setStep(idx + 1)}
              className={`p-2.5 text-xs font-bold rounded-md text-center border transition-all ${
                step === idx + 1 
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs' 
                  : step > idx + 1 
                  ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {sName}
            </button>
          ))}
        </div>
      </div>

      {/* Step Form Container */}
      <div className="gov-panel p-6 space-y-6">
        
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Step 1: Challenge Identification & Scope</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Challenge Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="input-field text-xs" 
                placeholder="e.g. Smart Traffic Signal Telemetry & Automated Congestion Optimization"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sector Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="select-field text-xs">
                  <option value="Waste Management">Waste Management</option>
                  <option value="Water Management">Water Management</option>
                  <option value="Public Health">Public Health</option>
                  <option value="Smart Mobility">Smart Mobility</option>
                  <option value="AgTech">AgTech</option>
                  <option value="Urban Development">Urban Development</option>
                  <option value="Rural Development">Rural Development</option>
                  <option value="Digital Governance">Digital Governance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Location / Ward</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="input-field text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Step 2: Problem Definition & Desired Outcomes</h3>
              {templates.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-semibold">Import Standard Template:</span>
                  {templates.map(t => (
                    <button key={t.id} onClick={() => applyTemplate(t)} className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold border border-slate-300">
                      {t.template_type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Problem Statement</label>
              <textarea 
                rows={4} 
                value={problemStatement} 
                onChange={e => setProblemStatement(e.target.value)} 
                className="input-field text-xs"
                placeholder="Describe municipal bottleneck, operational failure, or public service gap..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Process & Baseline</label>
              <textarea rows={2} value={currentProcess} onChange={e => setCurrentProcess(e.target.value)} className="input-field text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Public Value Outcome</label>
              <textarea rows={2} value={desiredOutcome} onChange={e => setDesiredOutcome(e.target.value)} className="input-field text-xs" />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Step 3: Functional & Technical Requirements</h3>
              <button 
                onClick={handleAIAnalyze} 
                disabled={loadingAI}
                className="btn-secondary text-xs flex items-center space-x-1.5 text-blue-700 border-blue-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{loadingAI ? 'Synthesizing...' : 'AI-Assisted Requirement Synthesis'}</span>
              </button>
            </div>

            {aiSuggestions && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2 text-xs">
                <p className="font-bold text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Insight Suggestion (Audited & Human-Reviewed)</span>
                </p>
                <p className="text-slate-700">{aiSuggestions.problem_summary}</p>
                <div className="pt-2 border-t border-blue-200 text-blue-800 italic text-[11px]">
                  {aiSuggestions.disclaimer}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Functional Requirements</label>
              <textarea rows={3} value={functionalReqs} onChange={e => setFunctionalReqs(e.target.value)} className="input-field text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Technical Requirements & Protocols</label>
              <textarea rows={3} value={technicalReqs} onChange={e => setTechnicalReqs(e.target.value)} className="input-field text-xs" />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Step 4: Eligibility Criteria & Pilot KPIs</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Startup Eligibility Requirements</label>
              <textarea rows={3} value={eligibilityReqs} onChange={e => setEligibilityReqs(e.target.value)} className="input-field text-xs" />
            </div>

            <p className="text-xs font-bold text-slate-800 pt-2">Primary Target KPI</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">KPI Metric Name</label>
                <input type="text" value={kpiName} onChange={e => setKpiName(e.target.value)} className="input-field text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Value</label>
                <input type="number" value={kpiTarget} onChange={e => setKpiTarget(Number(e.target.value))} className="input-field text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Unit of Measurement</label>
                <input type="text" value={kpiUnit} onChange={e => setKpiUnit(e.target.value)} className="input-field text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Step 5: Evaluation Criteria & Procurement Allocation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget Range</label>
                <input type="text" value={budgetRange} onChange={e => setBudgetRange(e.target.value)} className="input-field text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilot Timeline Duration</label>
                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} className="input-field text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Step 6: Review & Publish Challenge</h3>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <p><strong className="text-slate-900 font-bold">Title:</strong> {title || 'Untitled Challenge'}</p>
              <p><strong className="text-slate-900 font-bold">Category:</strong> {category}</p>
              <p><strong className="text-slate-900 font-bold">Problem Statement:</strong> {problemStatement}</p>
              <p><strong className="text-slate-900 font-bold">Budget Range:</strong> {budgetRange}</p>
              <p><strong className="text-slate-900 font-bold">Location:</strong> {location}</p>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="btn-secondary text-xs flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          {step < 6 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="btn-primary text-xs flex items-center space-x-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={handlePublish}
              disabled={publishing}
              className="btn-accent text-xs px-6 py-2.5 font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{publishing ? 'Publishing Challenge...' : 'Publish Government Challenge'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
