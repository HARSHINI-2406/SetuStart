import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutGrid, Building2, Trees, Stethoscope, GraduationCap, Leaf, Shield, Landmark 
} from 'lucide-react';

export const SECTORS = [
  { key: 'urbanDev', name: 'Urban Development', icon: Building2 },
  { key: 'ruralDev', name: 'Rural Development', icon: Trees },
  { key: 'healthcare', name: 'Healthcare', icon: Stethoscope },
  { key: 'education', name: 'Education', icon: GraduationCap },
  { key: 'environment', name: 'Environment', icon: Leaf },
  { key: 'publicSafety', name: 'Public Safety', icon: Shield },
  { key: 'digitalGov', name: 'Digital Governance', icon: Landmark },
];

interface PopularAreasProps {
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}

export const PopularAreas: React.FC<PopularAreasProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { t } = useLanguage();

  const handleCategoryClick = (catName: string) => {
    const nextCat = selectedCategory === catName ? null : catName;
    if (onSelectCategory) {
      onSelectCategory(nextCat);
    }
  };

  return (
    <section className="w-full bg-white border-y border-[#DCE6F2] py-2.5 px-4 sm:px-6 lg:px-8 sticky top-[70px] z-30 shadow-2xs backdrop-blur-md bg-white/95">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-0.5 gap-2">
        
        {/* Outlined Selected Pill with Grid Icon (Clicking resets to All) */}
        <button
          onClick={() => onSelectCategory && onSelectCategory(null)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
            !selectedCategory 
              ? 'bg-[#146EF5] text-white border-[#146EF5] shadow-xs' 
              : 'border-[#146EF5] bg-blue-50/60 text-[#146EF5] hover:bg-blue-100'
          }`}
          title="Click to view all categories"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t('popularAreas.title')}</span>
          {!selectedCategory && (
            <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
          )}
        </button>

        <span className="h-4 w-px bg-slate-300 shrink-0 mx-1" />

        {/* 7 Sector Filter Items */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none flex-1">
          {SECTORS.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            const isLast = idx === SECTORS.length - 1;
            const translatedName = t(`popularAreas.${cat.key}`) || cat.name;

            return (
              <React.Fragment key={cat.name}>
                <button
                  data-category={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#146EF5] text-white border border-[#146EF5] font-semibold shadow-xs scale-[1.02]'
                      : 'text-slate-700 hover:text-[#146EF5] hover:bg-blue-50/70 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-200 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{translatedName}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />
                  )}
                </button>
                {!isLast && (
                  <span className="h-3.5 w-px bg-slate-200 shrink-0 hidden md:inline" />
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
};
