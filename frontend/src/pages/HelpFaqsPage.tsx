import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, ArrowRight, MessageSquare
} from 'lucide-react';

export const HelpFaqsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ 'gen-1': true });

  const categories = [
    { key: 'All', label: t('helpFaqs.allCategories') },
    { key: 'General Overview', label: t('helpFaqs.catGeneral') },
    { key: 'For Government Departments', label: t('helpFaqs.catGovt') },
    { key: 'For Startups', label: t('helpFaqs.catStartups') },
    { key: 'Evaluation & Validation', label: t('helpFaqs.catEval') },
    { key: 'Procurement & Payments', label: t('helpFaqs.catProcurement') }
  ];

  const faqList = [
    { id: 'gen-1', categoryKey: 'catGeneral', category: 'General Overview', qKey: 'gen1Q', aKey: 'gen1A' },
    { id: 'gen-2', categoryKey: 'catGeneral', category: 'General Overview', qKey: 'gen2Q', aKey: 'gen2A' },
    { id: 'gen-3', categoryKey: 'catGeneral', category: 'General Overview', qKey: 'gen3Q', aKey: 'gen3A' },
    { id: 'gov-1', categoryKey: 'catGovt', category: 'For Government Departments', qKey: 'gov1Q', aKey: 'gov1A' },
    { id: 'gov-2', categoryKey: 'catGovt', category: 'For Government Departments', qKey: 'gov2Q', aKey: 'gov2A' },
    { id: 'gov-3', categoryKey: 'catGovt', category: 'For Government Departments', qKey: 'gov3Q', aKey: 'gov3A' },
    { id: 'stu-1', categoryKey: 'catStartups', category: 'For Startups', qKey: 'stu1Q', aKey: 'stu1A' },
    { id: 'stu-2', categoryKey: 'catStartups', category: 'For Startups', qKey: 'stu2Q', aKey: 'stu2A' },
    { id: 'stu-3', categoryKey: 'catStartups', category: 'For Startups', qKey: 'stu3Q', aKey: 'stu3A' },
    { id: 'val-1', categoryKey: 'catEval', category: 'Evaluation & Validation', qKey: 'val1Q', aKey: 'val1A' },
    { id: 'val-2', categoryKey: 'catEval', category: 'Evaluation & Validation', qKey: 'val2Q', aKey: 'val2A' },
    { id: 'pro-1', categoryKey: 'catProcurement', category: 'Procurement & Payments', qKey: 'pro1Q', aKey: 'pro1A' },
    { id: 'pro-2', categoryKey: 'catProcurement', category: 'Procurement & Payments', qKey: 'pro2Q', aKey: 'pro2A' }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqList.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const questionText = t(`helpFaqs.${faq.qKey}`);
    const answerText = t(`helpFaqs.${faq.aKey}`);
    const matchesSearch = searchQuery.trim() === '' || 
      questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
      answerText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 text-slate-900">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-[#146EF5]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t('helpFaqs.badge')}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F2A56]">{t('helpFaqs.title')}</h1>
        <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('helpFaqs.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('helpFaqs.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#DCE6F2] rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#146EF5] focus:ring-1 focus:ring-[#146EF5] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              selectedCategory === cat.key
                ? 'bg-[#146EF5] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs">
            {t('helpFaqs.noResults')}
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isOpen = !!openItems[faq.id];
            const qText = t(`helpFaqs.${faq.qKey}`);
            const aText = t(`helpFaqs.${faq.aKey}`);
            const catText = t(`helpFaqs.${faq.categoryKey}`);

            return (
              <div
                key={faq.id}
                className="bg-white border border-[#DCE6F2] rounded-lg overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#146EF5] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shrink-0">
                      {catText}
                    </span>
                    <span className="text-sm font-bold text-[#0F2A56]">
                      {qText}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed bg-slate-50/50">
                    {aText}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Support Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#0F2A56] to-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-5 h-5 text-blue-300" />
            <span>{t('helpFaqs.bannerTitle')}</span>
          </h3>
          <p className="text-xs text-slate-300">
            {t('helpFaqs.bannerDesc')}
          </p>
        </div>
        <Link
          to="/contact-support"
          className="bg-[#146EF5] hover:bg-blue-600 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors shrink-0 shadow-xs flex items-center space-x-1.5"
        >
          <span>{t('helpFaqs.contactBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
