import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Send, CheckCircle2, Linkedin, Twitter, Youtube, Github } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-white border-t border-[#DCE6F2] text-slate-700 text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Overview */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-[#0F2A56] flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5 text-blue-300" />
              </div>
              <span className="font-extrabold text-lg text-[#0F2A56] tracking-tight">SetuStart</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              {t('footer.tagline')}
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {t('footer.aboutText')}
            </p>
            <p className="text-[11px] font-medium text-slate-400 pt-1">
              {t('footer.copyright')}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#0F2A56] uppercase text-[11px] tracking-wider border-b border-[#DCE6F2] pb-1">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><Link to="/" className="hover:text-[#146EF5] transition-colors">{t('header.home')}</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#146EF5] transition-colors">{t('header.forGovernment')}</Link></li>
              <li><Link to="/challenges" className="hover:text-[#146EF5] transition-colors">{t('header.forStartups')}</Link></li>
              <li><Link to="/challenges" className="hover:text-[#146EF5] transition-colors">{t('header.opportunities')}</Link></li>
              <li><Link to="/public-transparency" className="hover:text-[#146EF5] transition-colors">{t('header.resources')}</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#146EF5] transition-colors">{t('header.about')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#0F2A56] uppercase text-[11px] tracking-wider border-b border-[#DCE6F2] pb-1">
              {t('footer.support')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><Link to="/help-faqs" className="hover:text-[#146EF5] transition-colors">{t('utility.helpFaqs')}</Link></li>
              <li><Link to="/platform-guidelines" className="hover:text-[#146EF5] transition-colors">{t('footer.userGuides')}</Link></li>
              <li><Link to="/contact-support" className="hover:text-[#146EF5] transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link to="/public-transparency" className="hover:text-[#146EF5] transition-colors">{t('footer.feedback')}</Link></li>
              <li><Link to="/platform-guidelines" className="hover:text-[#146EF5] transition-colors">{t('utility.accessibility')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#0F2A56] uppercase text-[11px] tracking-wider border-b border-[#DCE6F2] pb-1">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li><Link to="/public-transparency" className="hover:text-[#146EF5] transition-colors">{t('footer.termsOfUse')}</Link></li>
              <li><Link to="/public-transparency" className="hover:text-[#146EF5] transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/public-transparency" className="hover:text-[#146EF5] transition-colors">{t('footer.disclaimer')}</Link></li>
              <li><Link to="/public-transparency" className="hover:text-[#146EF5] transition-colors">{t('footer.cookiePolicy')}</Link></li>
            </ul>
          </div>

          {/* Column 5: Stay Updated & Social Icons */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#0F2A56] uppercase text-[11px] tracking-wider border-b border-[#DCE6F2] pb-1">
              {t('footer.stayUpdated')}
            </h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              {t('footer.stayUpdatedDesc')}
            </p>
            {subscribed ? (
              <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] rounded border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('footer.subscribeThanks')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="email"
                    placeholder={t('footer.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-[#DCE6F2] rounded-l-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#146EF5]"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#146EF5] hover:bg-blue-700 text-white px-3 py-1.5 rounded-r-md transition-colors shrink-0"
                    title="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Social Icons Row */}
            <div className="flex items-center space-x-3 pt-2 text-slate-400">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#146EF5] transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#146EF5] transition-colors" title="Twitter/X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#146EF5] transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#146EF5] transition-colors" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Tagline Row */}
        <div className="border-t border-[#DCE6F2] pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-3">
          <p>{t('footer.copyright')}</p>
          <p className="font-semibold text-[#0F2A56]">
            {t('footer.footerTagline')}
          </p>
        </div>

      </div>
    </footer>
  );
};
