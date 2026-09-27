import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { challengesApi } from '../services/api';
import { Challenge } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Building2, MapPin, Calendar, ArrowRight, Landmark } from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const catFromUrl = searchParams.get('category') || '';
  const searchFromUrl = searchParams.get('search') || '';

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(catFromUrl);
  const [searchQuery, setSearchQuery] = useState<string>(searchFromUrl);

  // Sync state whenever URL searchParams change
  useEffect(() => {
    const urlCat = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    setSelectedCategory(urlCat);
    setSearchQuery(urlSearch);
  }, [searchParams]);

  // Fetch challenges whenever selectedCategory changes
  useEffect(() => {
    setLoading(true);
    challengesApi.getAll(selectedCategory || undefined)
      .then(data => {
        setChallenges(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleClearCategory = () => {
    handleCategoryChange('');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const filtered = challenges.filter(c => {
    const matchesCategory = !selectedCategory || c.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    const matchesQuery = !searchQuery || (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problem_statement.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesQuery;
  });

  const categories = ['Waste Management', 'Water Management', 'Public Health', 'Smart Mobility', 'AgTech', 'Education', 'Urban Development', 'Rural Development', 'Healthcare', 'Environment', 'Public Safety', 'Digital Governance'];

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Bar */}
      <div className="gov-panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t('challengesPage.badge')}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">{t('challengesPage.title')}</h1>
            <p className="text-slate-600 text-xs mt-1">{t('challengesPage.subtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder={t('challengesPage.searchPlaceholder')} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-9 text-xs"
              />
            </div>

            <select 
              value={selectedCategory} 
              onChange={e => handleCategoryChange(e.target.value)}
              className="select-field text-xs sm:w-48"
            >
              <option value="">{t('challengesPage.allCategories')}</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Applied Filter Tags */}
        {(selectedCategory || searchQuery) && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">{t('challengesPage.activeFilters')}</span>
            {selectedCategory && (
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                {t('challengesPage.categoryFilter')} {selectedCategory}
                <button onClick={handleClearCategory} className="ml-1 text-blue-600 hover:text-blue-900 font-bold">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                {t('challengesPage.queryFilter')} "{searchQuery}"
                <button onClick={handleClearSearch} className="ml-1 text-slate-600 hover:text-slate-900 font-bold">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs">{t('challengesPage.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="gov-panel p-8 text-center text-slate-500 text-xs">
          {t('challengesPage.noChallenges')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(ch => (
            <div key={ch.id} className="card-gov flex flex-col justify-between hover:border-blue-400 transition-all group">
              <div className="space-y-3">
                
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {ch.category}
                  </span>
                  <StatusBadge status={ch.status} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{ch.department_name}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ch.problem_statement}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{ch.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{ch.timeline}</span>
                  </div>
                </div>

              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">{ch.budget_range}</span>
                <Link 
                  to={`/challenges/${ch.id}`}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1"
                >
                  <span>{t('challengesPage.viewDetails')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
