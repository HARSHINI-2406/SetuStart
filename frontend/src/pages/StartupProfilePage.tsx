import React, { useEffect, useState } from 'react';
import { startupsApi } from '../services/api';
import { Startup, StartupSolution } from '../types';
import { Settings, CheckCircle2, Plus, Code } from 'lucide-react';
import { RecommendedOpportunities } from '../components/RecommendedOpportunities';

export const StartupProfilePage: React.FC = () => {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [solutions, setSolutions] = useState<StartupSolution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  // Profile Form
  const [startupName, setStartupName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [industry, setIndustry] = useState<string>('CleanTech');
  const [category, setCategory] = useState<string>('Waste Management');
  const [technology, setTechnology] = useState<string>('IoT, AI, Telemetry');
  const [location, setLocation] = useState<string>('Bengaluru, KA');
  const [teamSize, setTeamSize] = useState<number>(12);
  const [annualTurnover, setAnnualTurnover] = useState<number>(3500000);
  const [yearsOp, setYearsOp] = useState<number>(2);

  // New Solution Form
  const [solName, setSolName] = useState<string>('');
  const [solDesc, setSolDesc] = useState<string>('');
  const [solProblem, setSolProblem] = useState<string>('');
  const [solFeatures, setSolFeatures] = useState<string>('');

  useEffect(() => {
    startupsApi.getMyProfile().then(data => {
      setStartup(data);
      setStartupName(data.startup_name);
      setDescription(data.description);
      setIndustry(data.industry);
      setCategory(data.solution_category);
      setTechnology(data.technology);
      setLocation(data.location);
      setTeamSize(data.team_size);
      setAnnualTurnover(data.annual_turnover);
      setYearsOp(data.years_in_operation);
    }).catch(console.error);

    startupsApi.getSolutions()
      .then(setSolutions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await startupsApi.saveMyProfile({
        startup_name: startupName,
        description,
        industry,
        solution_category: category,
        technology,
        location,
        team_size: teamSize,
        annual_turnover: annualTurnover,
        years_in_operation: yearsOp
      });
      setStartup(res);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSol = await startupsApi.createSolution({
        solution_name: solName,
        description: solDesc,
        problem_solved: solProblem,
        features: solFeatures,
        deployment_readiness: 'Pilot Ready'
      });
      setSolutions([...solutions, newSol]);
      setSolName(''); setSolDesc(''); setSolProblem(''); setSolFeatures('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex items-center space-x-3">
        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700 border border-blue-200">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Startup Credentials & Solutions</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            Startup Profile & Solution Catalog
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage your verified entity credentials and solution technology specs for capability matching.
          </p>
        </div>
      </div>

      {/* Recommended Opportunities Component */}
      <RecommendedOpportunities />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Startup Profile Form */}
        <div className="gov-panel p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">
            Startup Entity Details
          </h3>

          {saved && (
            <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Startup profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Startup Entity Name
              </label>
              <input
                type="text"
                value={startupName}
                onChange={e => setStartupName(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Company Summary & Solution Track Record
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="input-field text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Industry Sector
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Annual Turnover (INR)
                </label>
                <input
                  type="number"
                  value={annualTurnover}
                  onChange={e => setAnnualTurnover(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Years in Operation
                </label>
                <input
                  type="number"
                  value={yearsOp}
                  onChange={e => setYearsOp(Number(e.target.value))}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary text-xs w-full py-2.5 font-bold"
            >
              Save Profile Credentials
            </button>

          </form>
        </div>

        {/* Solutions & Add Solution */}
        <div className="space-y-6">

          {/* Add Solution */}
          <div className="gov-panel p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">
              Add Solution Profile
            </h3>

            <form onSubmit={handleAddSolution} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Solution Name
                </label>
                <input
                  type="text"
                  value={solName}
                  onChange={e => setSolName(e.target.value)}
                  className="input-field text-xs"
                  placeholder="e.g. EcoClean BinSense AI"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Solution Overview
                </label>
                <textarea
                  rows={2}
                  value={solDesc}
                  onChange={e => setSolDesc(e.target.value)}
                  className="input-field text-xs"
                  placeholder="Briefly describe what your solution does"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Problem Solved
                </label>
                <input
                  type="text"
                  value={solProblem}
                  onChange={e => setSolProblem(e.target.value)}
                  className="input-field text-xs"
                  placeholder="e.g. Overflowing municipal bins & route delays"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Core Features & Tech Stack
                </label>
                <textarea
                  rows={2}
                  value={solFeatures}
                  onChange={e => setSolFeatures(e.target.value)}
                  className="input-field text-xs"
                  placeholder="e.g. IoT sensors, telemetry dashboards, route optimization"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-accent text-xs w-full py-2.5 font-bold flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Solution Profile</span>
              </button>
            </form>
          </div>

          {/* Solution Catalog */}
          <div className="gov-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-base">
                Your Solution Catalog
              </h3>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {solutions.length} solution{solutions.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="text-xs text-slate-500 text-center py-6">
                Loading solutions...
              </div>
            ) : solutions.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6 border border-dashed border-slate-300 rounded-lg">
                No solutions added yet. Add your first solution profile above.
              </div>
            ) : (
              <div className="space-y-3">
                {solutions.map(solution => (
                  <div
                    key={solution.id}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {solution.solution_name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {solution.description}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {solution.deployment_readiness || 'Pilot Ready'}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-1 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700">Problem Solved: </span>
                        <span className="text-slate-600">{solution.problem_solved}</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-700">Core Features: </span>
                        <span className="text-slate-600">{solution.features}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};