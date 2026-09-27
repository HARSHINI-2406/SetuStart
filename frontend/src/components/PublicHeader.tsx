import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, LogOut, User as UserIcon, Menu, X, ChevronDown, 
  Landmark, Rocket, FileText, Compass, Cpu, CreditCard, ShieldCheck, 
  HelpCircle, BookOpen, ExternalLink, Sparkles, Award, History, CheckCircle2
} from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for search expansion & live results
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // State for Mega Menu
  const [activeMegaMenu, setActiveMegaMenu] = useState<'government' | 'startups' | 'resources' | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // State for mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Real searchable items
  const searchableChallenges = [
    { id: 1, title: 'Integrated Traffic Management for Smart Cities', category: 'Urban Development', type: 'Challenge' },
    { id: 2, title: 'Scalable Rooftop Solar Solutions for Government Buildings', category: 'Environment', type: 'Challenge' },
    { id: 3, title: 'Real-Time Water Quality Monitoring Systems', category: 'Environment', type: 'Challenge' },
    { id: 4, title: 'AI-enabled Rural Telehealth Infrastructure', category: 'Healthcare', type: 'Challenge' },
    { id: 5, title: 'Smart Parking and Congestion Management System', category: 'Urban Development', type: 'Challenge' },
    { id: 6, title: 'Urban Flood Monitoring and Early Warning Network', category: 'Urban Development', type: 'Challenge' },
    { id: 7, title: 'Smart Irrigation Advisory for Small Farmers', category: 'Rural Development', type: 'Challenge' },
    { id: 8, title: 'Adaptive Digital Learning Platform for Government Schools', category: 'Education', type: 'Challenge' },
    { id: 16, title: 'AI-Assisted Emergency Dispatch & Response Coordination', category: 'Public Safety', type: 'Challenge' },
    { id: 18, title: 'Cross-Department Verified Credential Exchange', category: 'Digital Governance', type: 'Challenge' },
  ];

  const searchablePages = [
    { title: 'Platform Guidelines & Security Standards', path: '/platform-guidelines', type: 'Resource' },
    { title: 'Public Transparency Portal & Scoring Rules', path: '/public-transparency', type: 'Resource' },
    { title: 'Help & Frequently Asked Questions', path: '/help-faqs', type: 'Resource' },
    { title: 'How SetuStart Works (7-Stage Lifecycle)', path: '/how-it-works', type: 'Resource' },
    { title: 'Contact Desk Support & Operational SLAs', path: '/contact-support', type: 'Resource' },
    { title: 'Browse All Government Challenges', path: '/challenges', type: 'Catalog' },
  ];

  const filteredChallengeResults = searchQuery.trim()
    ? searchableChallenges.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredPageResults = searchQuery.trim()
    ? searchablePages.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setIsSearchExpanded(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/challenges?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    } else {
      navigate('/challenges');
    }
  };

  return (
    <header 
      ref={megaMenuRef} 
      className="w-full bg-white border-b border-[#DCE6F2] sticky top-0 z-40 shadow-xs relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Branding */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative flex items-center justify-center shrink-0 w-13 h-13 sm:w-[68px] sm:h-[68px]">
            <img 
              src="/assets/setustart-logo.png" 
              alt="SetuStart Logo" 
              className="w-full h-full object-contain scale-[1.18] origin-center shrink-0" 
            />
          </div>
          <div>
            <span className="font-extrabold text-2xl text-[#0F2A56] tracking-tight block leading-none">
              Setu<span className="text-[#146EF5]">Start</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide block mt-1">
              {t('header.tagline')}
            </span>
          </div>
        </Link>

        {/* CENTER: Main Public Navigation with Mega Menu Triggers */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-700 h-full">
          <Link
            to="/"
            className={`h-full flex items-center px-3 border-b-2 transition-colors ${
              isActive('/')
                ? 'border-[#146EF5] text-[#146EF5] font-bold'
                : 'border-transparent hover:text-[#146EF5]'
            }`}
          >
            {t('header.home')}
          </Link>

          {/* FOR GOVERNMENT TRIGGER */}
          <button
            onClick={() => setActiveMegaMenu(activeMegaMenu === 'government' ? null : 'government')}
            onMouseEnter={() => setActiveMegaMenu('government')}
            className={`h-full flex items-center space-x-1 px-3 border-b-2 transition-colors cursor-pointer ${
              activeMegaMenu === 'government'
                ? 'border-[#146EF5] text-[#146EF5] font-bold bg-blue-50/40'
                : 'border-transparent hover:text-[#146EF5]'
            }`}
          >
            <span>{t('header.forGovernment')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMegaMenu === 'government' ? 'rotate-180 text-[#146EF5]' : 'text-slate-400'
            }`} />
          </button>

          {/* FOR STARTUPS TRIGGER */}
          <button
            onClick={() => setActiveMegaMenu(activeMegaMenu === 'startups' ? null : 'startups')}
            onMouseEnter={() => setActiveMegaMenu('startups')}
            className={`h-full flex items-center space-x-1 px-3 border-b-2 transition-colors cursor-pointer ${
              activeMegaMenu === 'startups'
                ? 'border-[#146EF5] text-[#146EF5] font-bold bg-blue-50/40'
                : 'border-transparent hover:text-[#146EF5]'
            }`}
          >
            <span>{t('header.forStartups')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMegaMenu === 'startups' ? 'rotate-180 text-[#146EF5]' : 'text-slate-400'
            }`} />
          </button>

          {/* RESOURCES TRIGGER */}
          <button
            onClick={() => setActiveMegaMenu(activeMegaMenu === 'resources' ? null : 'resources')}
            onMouseEnter={() => setActiveMegaMenu('resources')}
            className={`h-full flex items-center space-x-1 px-3 border-b-2 transition-colors cursor-pointer ${
              activeMegaMenu === 'resources'
                ? 'border-[#146EF5] text-[#146EF5] font-bold bg-blue-50/40'
                : 'border-transparent hover:text-[#146EF5]'
            }`}
          >
            <span>{t('header.resources')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMegaMenu === 'resources' ? 'rotate-180 text-[#146EF5]' : 'text-slate-400'
            }`} />
          </button>

          {/* ABOUT */}
          <Link
            to="/how-it-works"
            className="h-full flex items-center px-3 border-b-2 border-transparent hover:text-[#146EF5] transition-colors"
          >
            {t('header.about')}
          </Link>
        </nav>

        {/* RIGHT: Expandable Search & Auth Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* SEARCH FIELD WITH EXPANSION & LIVE RESULTS DROPDOWN */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div 
                style={{
                  transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className={`relative ${
                  isSearchExpanded ? 'w-[360px] lg:w-[420px]' : 'w-[240px] xl:w-[280px]'
                }`}
              >
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchQuery}
                  onFocus={() => setIsSearchExpanded(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-[#DCE6F2] rounded-md pl-3 pr-8 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#146EF5] focus:ring-1 focus:ring-[#146EF5] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-slate-400 hover:text-[#146EF5] transition-colors cursor-pointer"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* LIVE RESULTS PANEL (Appears underneath when search is active) */}
            {isSearchExpanded && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#DCE6F2] rounded-xl shadow-xl p-3 z-50 animate-fadeIn space-y-3">
                {searchQuery.trim() ? (
                  <div className="space-y-3">
                    {/* Challenge Matches */}
                    {filteredChallengeResults.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-[#0F2A56] uppercase tracking-wider block px-1">
                          Matching Challenges
                        </span>
                        {filteredChallengeResults.map(item => (
                          <Link
                            key={item.id}
                            to={`/challenges/${item.id}`}
                            onClick={() => setIsSearchExpanded(false)}
                            className="block p-2 rounded-lg hover:bg-blue-50 text-left transition-colors group"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-900 group-hover:text-[#146EF5] line-clamp-1">
                                {item.title}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium shrink-0 ml-2">
                                {item.category}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Page Matches */}
                    {filteredPageResults.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block px-1">
                          Portal Resources
                        </span>
                        {filteredPageResults.map((page, idx) => (
                          <Link
                            key={idx}
                            to={page.path}
                            onClick={() => setIsSearchExpanded(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-[#146EF5] transition-colors"
                          >
                            <span>{page.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{page.type}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {filteredChallengeResults.length === 0 && filteredPageResults.length === 0 && (
                      <div className="text-center py-4 text-xs text-slate-500">
                        No immediate match found for "{searchQuery}". Press Enter to search all challenges.
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Press Enter for complete results</span>
                      <button
                        onClick={handleSearchSubmit}
                        className="text-[#146EF5] font-bold hover:underline"
                      >
                        View all search results →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block px-1">
                      Quick Discovery Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Traffic Management', 'Rooftop Solar', 'Water Monitoring', 'Telehealth', 'Education', 'Air Quality'].map(topic => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setSearchQuery(topic);
                            navigate(`/challenges?search=${encodeURIComponent(topic)}`);
                            setIsSearchExpanded(false);
                          }}
                          className="text-[11px] bg-slate-50 hover:bg-blue-50 hover:text-[#146EF5] border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/dashboard"
                className="bg-[#EFF6FF] text-[#146EF5] hover:bg-blue-100 border border-blue-200 text-xs font-semibold px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('header.workspace')}</span>
              </Link>
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-600 p-1.5 rounded-md transition-colors"
                title={t('header.signOut')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="bg-[#EFF6FF] hover:bg-blue-100 text-[#146EF5] text-xs font-semibold px-4 py-2 rounded-md border border-blue-200 transition-colors"
              >
                {t('header.login')}
              </Link>
              <Link
                to="/register"
                className="btn-gov-primary text-xs py-2 px-4 shadow-xs"
              >
                {t('header.signUp')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* =========================================================
          REAL VISIBLE MEGA MENUS (Slide Down + Fade In Under Header)
         ========================================================= */}
      {activeMegaMenu && (
        <div 
          onMouseLeave={() => setActiveMegaMenu(null)}
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-[#DCE6F2] shadow-xl z-50 animate-fadeIn"
        >
          <div className="max-w-[1440px] mx-auto px-8 py-7">
            
            {/* 1. FOR GOVERNMENT MEGA MENU */}
            {activeMegaMenu === 'government' && (
              <div className="grid grid-cols-3 gap-8">
                
                {/* Col 1: Problem Formulation */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Compass className="w-4 h-4 text-[#146EF5]" />
                    <span>Challenge Formulation</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/challenge-studio" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Challenge Studio</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Author outcome problem statements with standard KPI templates</div>
                    </Link>
                    <Link to="/how-it-works" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Lifecycle Architecture</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Explore the 7-stage governed procurement pipeline</div>
                    </Link>
                  </div>
                </div>

                {/* Col 2: Evaluation & Sandbox */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Cpu className="w-4 h-4 text-[#146EF5]" />
                    <span>Evaluation & Sandboxing</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/evaluation-workspace" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Evaluation Workspace</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Review 100-point explainable applicant matches</div>
                    </Link>
                    <Link to="/pilot-sandbox" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Controlled Pilot Sandbox</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Track live milestone progress, data boundaries & risk heatmaps</div>
                    </Link>
                  </div>
                </div>

                {/* Col 3: Scale & Procurement */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <CreditCard className="w-4 h-4 text-[#146EF5]" />
                    <span>Procurement & Invoicing</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/procurement-scale" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Procurement & Scale Gates</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Execute compliant multi-stage approval gates and cross-department reuse</div>
                    </Link>
                    <Link to="/contracts-payments" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Milestone SLAs & Payments</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Statutory 21-day payment SLA monitoring and escrow releases</div>
                    </Link>
                  </div>
                </div>

              </div>
            )}

            {/* 2. FOR STARTUPS MEGA MENU */}
            {activeMegaMenu === 'startups' && (
              <div className="grid grid-cols-3 gap-8">
                
                {/* Col 1: Opportunities */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Rocket className="w-4 h-4 text-[#146EF5]" />
                    <span>Opportunities Catalog</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/challenges" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Browse Published Challenges</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Filter outcome statements across 7 high-impact sectors</div>
                    </Link>
                    <Link to="/demand-radar" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Demand Radar Matcher</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Discover emerging civic demand matching your technology profile</div>
                    </Link>
                  </div>
                </div>

                {/* Col 2: Regulatory Sandbox */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Cpu className="w-4 h-4 text-[#146EF5]" />
                    <span>Sandbox & Evidence</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/pilot-sandbox" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Bound Regulatory Sandbox</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Test in real government environments with protected synthetic data</div>
                    </Link>
                    <Link to="/evidence-validation" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Evidence Submission</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Upload empirical telemetry packs for independent validation review</div>
                    </Link>
                  </div>
                </div>

                {/* Col 3: Registration & Growth */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <Award className="w-4 h-4 text-[#146EF5]" />
                    <span>Startup Growth</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/register" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Register Your Startup</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Create account with verified DPIIT recognition credentials</div>
                    </Link>
                    <Link to="/contracts-payments" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">21-Day Payment SLA Guarantee</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Guaranteed prompt milestone payments backed by escrow</div>
                    </Link>
                  </div>
                </div>

              </div>
            )}

            {/* 3. RESOURCES MEGA MENU */}
            {activeMegaMenu === 'resources' && (
              <div className="grid grid-cols-3 gap-8">
                
                {/* Col 1: Transparency */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-[#146EF5]" />
                    <span>Public Transparency</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/public-transparency" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Public Audit Portal</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Inspect read-only platform performance metrics and scoring rules</div>
                    </Link>
                    <Link to="/platform-guidelines" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Platform Guidelines</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Comprehensive standards for testing, data isolation, and SLAs</div>
                    </Link>
                  </div>
                </div>

                {/* Col 2: Knowledge & Support */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <HelpCircle className="w-4 h-4 text-[#146EF5]" />
                    <span>Support & FAQs</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <Link to="/help-faqs" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Help & Frequently Asked Questions</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Answers on challenges, sandboxes, scoring, and waivers</div>
                    </Link>
                    <Link to="/contact-support" className="block p-2 rounded-lg hover:bg-blue-50 text-slate-800 font-semibold hover:text-[#146EF5] transition-colors">
                      <div className="font-bold">Contact Support Desk</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">24-hour response SLA assistance for government & startups</div>
                    </Link>
                  </div>
                </div>

                {/* Col 3: Architecture & Security */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#0F2A56] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                    <History className="w-4 h-4 text-[#146EF5]" />
                    <span>Security & Governance</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-800">
                      <div className="font-bold">Immutable Audit Logs</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">SHA-256 encrypted verification of evaluation decisions</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-800">
                      <div className="font-bold">STQC Security Compliance</div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">Government-grade data sovereignty & role authorization</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Mega menu footer bar with close shortcut tip */}
          <div className="bg-slate-50 border-t border-[#DCE6F2] px-8 py-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium">SetuStart Institutional Procurement Portal</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> to close menu</span>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#DCE6F2] px-4 py-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-[#DCE6F2] rounded-l-md px-3 py-2 text-xs text-slate-900"
            />
            <button type="submit" className="bg-[#146EF5] text-white px-3 py-2 rounded-r-md text-xs font-semibold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-1 text-xs font-medium text-slate-800">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100">{t('header.home')}</Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100">{t('header.forGovernment')}</Link>
            <Link to="/challenges" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100">{t('header.forStartups')}</Link>
            <Link to="/public-transparency" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100">{t('header.resources')}</Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-100">{t('header.about')}</Link>
          </div>
        </div>
      )}
    </header>
  );
};
