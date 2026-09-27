import React, { useState, useEffect } from 'react';
import { ShieldCheck, Globe, HelpCircle, Eye, Check, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../locales';

interface UtilityBarProps {
  onFontSizeChange?: (size: 'normal' | 'large' | 'xlarge') => void;
}

const LANGUAGES: { code: Language; name: string; label: string }[] = [
  { code: 'en', name: 'English', label: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)', label: 'हिंदी' },
  { code: 'te', name: 'తెలుగు (Telugu)', label: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ் (Tamil)', label: 'தமிழ்' },
  { code: 'mr', name: 'मराठी (Marathi)', label: 'मराठी' }
];

export const UtilityBar: React.FC<UtilityBarProps> = ({ onFontSizeChange }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isAccessOpen, setIsAccessOpen] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const activeLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleFontChange = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    if (onFontSizeChange) onFontSizeChange(size);

    // Apply global root font scaling
    const root = document.documentElement;
    if (size === 'normal') root.style.fontSize = '100%';
    else if (size === 'large') root.style.fontSize = '108%';
    else if (size === 'xlarge') root.style.fontSize = '116%';
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.classList.add('contrast-125');
    } else {
      document.documentElement.classList.remove('contrast-125');
    }
  };

  return (
    <div className="w-full bg-[#0F2A56] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative z-50">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Governed Portal Branding */}
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs">
            {t('utility.portalBranding')}
          </span>
        </div>

        {/* Right Side: Accessibility & Utility Controls */}
        <div className="flex items-center space-x-4 text-[11px] text-slate-200">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsHelpOpen(false);
                setIsAccessOpen(false);
              }}
              className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>{activeLangObj.label} ▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 py-1 z-50 text-xs">
                {LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => {
                      setLanguage(langItem.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>{langItem.name}</span>
                    {language === langItem.code && <Check className="w-3.5 h-3.5 text-[#146EF5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Controls */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-800/80 rounded px-1.5 py-0.5 border border-slate-700">
            <button
              onClick={() => handleFontChange('normal')}
              className={`px-1.5 py-0.2 rounded text-[10px] transition-colors ${
                fontSize === 'normal' ? 'bg-[#146EF5] text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Normal Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontChange('large')}
              className={`px-1.5 py-0.2 rounded text-[10px] transition-colors ${
                fontSize === 'large' ? 'bg-[#146EF5] text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Large Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontChange('xlarge')}
              className={`px-1.5 py-0.2 rounded text-[10px] transition-colors ${
                fontSize === 'xlarge' ? 'bg-[#146EF5] text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Extra Large Font Size"
            >
              A+
            </button>
          </div>

          {/* Helpdesk Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsHelpOpen(!isHelpOpen);
                setIsLangOpen(false);
                setIsAccessOpen(false);
              }}
              className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
              <span>{t('utility.needHelp')}</span>
            </button>

            {isHelpOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    navigate('/help-faqs');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-slate-700 font-medium"
                >
                  {t('utility.helpFaqs')}
                </button>
                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    navigate('/platform-guidelines');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-slate-700 font-medium"
                >
                  {t('utility.platformGuidelines')}
                </button>
                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    navigate('/contact-support');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-slate-700 font-medium"
                >
                  {t('utility.contactSupport')}
                </button>
              </div>
            )}
          </div>

          {/* Accessibility Modal/Panel */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setIsAccessOpen(!isAccessOpen);
                setIsLangOpen(false);
                setIsHelpOpen(false);
              }}
              className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-300" />
              <span>{t('utility.accessibility')}</span>
            </button>

            {isAccessOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 p-3 z-50 text-xs space-y-3">
                <div className="font-bold text-[#0F2A56] border-b border-slate-100 pb-1">
                  {t('utility.accessibilityOptions')}
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">{t('utility.textSize')}</label>
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded">
                    <button
                      onClick={() => handleFontChange('normal')}
                      className={`flex-1 py-1 rounded text-center font-semibold ${fontSize === 'normal' ? 'bg-[#146EF5] text-white' : 'text-slate-700'}`}
                    >
                      {t('utility.default')}
                    </button>
                    <button
                      onClick={() => handleFontChange('large')}
                      className={`flex-1 py-1 rounded text-center font-semibold ${fontSize === 'large' ? 'bg-[#146EF5] text-white' : 'text-slate-700'}`}
                    >
                      {t('utility.large')}
                    </button>
                    <button
                      onClick={() => handleFontChange('xlarge')}
                      className={`flex-1 py-1 rounded text-center font-semibold ${fontSize === 'xlarge' ? 'bg-[#146EF5] text-white' : 'text-slate-700'}`}
                    >
                      {t('utility.xlarge')}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-medium block mb-1">{t('utility.visualDisplay')}</label>
                  <button
                    onClick={toggleHighContrast}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold"
                  >
                    <span>{t('utility.highContrast')}</span>
                    {highContrast ? <Moon className="w-3.5 h-3.5 text-blue-600" /> : <Sun className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

