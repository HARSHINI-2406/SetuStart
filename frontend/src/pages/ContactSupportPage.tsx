import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  HelpCircle, Send, CheckCircle2, MessageSquare, Clock, 
  FileText, ShieldCheck, ArrowRight
} from 'lucide-react';

export const ContactSupportPage: React.FC = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Government Department',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.subject && formData.message) {
      const ticketId = `SETU-SUP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(ticketId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-[#146EF5]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('contactSupport.badge')}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F2A56]">{t('contactSupport.title')}</h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t('contactSupport.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Col (7): Support Form */}
        <div className="md:col-span-7 bg-white p-6 rounded-xl border border-[#DCE6F2] shadow-2xs space-y-5">
          {submittedTicket ? (
            <div className="py-8 px-6 text-center space-y-4 bg-emerald-50/60 border border-emerald-200 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{t('contactSupport.successTitle')}</h3>
                <p className="text-xs text-slate-600">
                  {t('contactSupport.successDesc')}
                </p>
              </div>
              <div className="inline-block bg-white border border-emerald-300 px-4 py-2 rounded-md font-mono text-xs text-slate-900 font-bold">
                {t('contactSupport.ticketRef')} <span className="text-[#146EF5]">{submittedTicket}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                {t('contactSupport.successNotice', { email: formData.email })}
              </p>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setFormData({
                    fullName: '',
                    email: '',
                    role: 'Government Department',
                    category: 'General Inquiry',
                    subject: '',
                    message: ''
                  });
                }}
                className="btn-secondary text-xs px-4 py-2 mt-2"
              >
                {t('contactSupport.submitAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-base text-[#0F2A56] border-b border-slate-100 pb-2">
                {t('contactSupport.formTitle')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">{t('contactSupport.fullName')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('contactSupport.fullNamePlaceholder')}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#146EF5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">{t('contactSupport.email')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('contactSupport.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#146EF5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">{t('contactSupport.userRole')}</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#146EF5]"
                  >
                    <option value="Government Department">{t('contactSupport.roleGovt')}</option>
                    <option value="Startup">{t('contactSupport.roleStartup')}</option>
                    <option value="Evaluator">{t('contactSupport.roleEval')}</option>
                    <option value="Independent Validator">{t('contactSupport.roleValidator')}</option>
                    <option value="Public Citizen">{t('contactSupport.rolePublic')}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">{t('contactSupport.issueCategory')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#146EF5]"
                  >
                    <option value="General Inquiry">{t('contactSupport.catGeneral')}</option>
                    <option value="Account & Access">{t('contactSupport.catAccount')}</option>
                    <option value="Challenge Studio">{t('contactSupport.catStudio')}</option>
                    <option value="Startup Application">{t('contactSupport.catApplication')}</option>
                    <option value="Pilot Sandbox">{t('contactSupport.catSandbox')}</option>
                    <option value="Evidence & Validation">{t('contactSupport.catValidation')}</option>
                    <option value="Technical Issue">{t('contactSupport.catTechnical')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">{t('contactSupport.subject')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('contactSupport.subjectPlaceholder')}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#146EF5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">{t('contactSupport.message')}</label>
                <textarea
                  rows={4}
                  required
                  placeholder={t('contactSupport.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#146EF5]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#146EF5] hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-md transition-colors shadow-xs flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('contactSupport.submitBtn')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Col (5): Support Info Cards */}
        <div className="md:col-span-5 space-y-4">
          
          <div className="bg-white p-5 rounded-xl border border-[#DCE6F2] shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#0F2A56] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#146EF5]" />
              <span>{t('contactSupport.responseTimes')}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('contactSupport.deskDesc')}
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">{t('contactSupport.workingDays')}</span>
                <span className="font-semibold">{t('contactSupport.workingDaysVal')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">{t('contactSupport.responseSla')}</span>
                <span className="font-semibold text-emerald-700">{t('contactSupport.responseSlaVal')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">{t('contactSupport.urgentTickets')}</span>
                <span className="font-semibold text-blue-700">{t('contactSupport.urgentTicketsVal')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#DCE6F2] shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#0F2A56] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#146EF5]" />
              <span>{t('contactSupport.selfService')}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Before submitting a request, explore our self-service guides:
            </p>
            <div className="space-y-2 pt-1">
              <Link
                to="/help-faqs"
                className="flex items-center justify-between p-2.5 bg-blue-50/70 hover:bg-blue-100/70 rounded-lg text-xs font-semibold text-[#146EF5] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('utility.helpFaqs')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/platform-guidelines"
                className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('utility.platformGuidelines')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
