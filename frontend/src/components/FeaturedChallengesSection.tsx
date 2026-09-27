import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Landmark, ArrowRight, Calendar, ChevronLeft, ChevronRight, MapPin, Sparkles, AlertCircle
} from 'lucide-react';

interface FeaturedChallengesSectionProps {
  selectedCategory?: string | null;
}

export interface ChallengeItem {
  id: number;
  category: string;
  categoryKey?: string;
  title: string;
  dept: string;
  imageUrl: string;
  date: string;
  location: string;
  budget: string;
  summary: string;
  alt: string;
}

// Authentic SetuStart Challenge Catalog Data
const ALL_CHALLENGES: ChallengeItem[] = [
  // Flagship Featured
  {
    id: 1,
    categoryKey: 'urbanDev',
    category: 'Urban Development',
    title: 'Integrated Traffic Management for Smart Cities',
    dept: 'Ministry of Housing & Urban Affairs',
    imageUrl: '/assets/traffic.jpg',
    date: '30 Apr 2025',
    location: 'Bengaluru, Karnataka',
    budget: '₹30,000,000 - ₹60,000,000',
    summary: 'Dynamic AI-driven adaptive traffic signal management that adjusts green light durations in real time based on vehicle queue sensors.',
    alt: 'Real smart city urban traffic management photograph'
  },
  {
    id: 2,
    categoryKey: 'environment',
    category: 'Environment',
    title: 'Scalable Rooftop Solar Solutions for Government Buildings',
    dept: 'Ministry of New & Renewable Energy',
    imageUrl: '/assets/solar.jpg',
    date: '15 May 2025',
    location: 'NCR & State Secretariats',
    budget: '₹25,000,000 - ₹55,000,000',
    summary: 'Decentralized rooftop solar micro-grid telemetry with smart storage switching to reduce municipal administrative peak grid reliance.',
    alt: 'Real rooftop solar panels on modern building photograph'
  },
  {
    id: 3,
    categoryKey: 'environment',
    category: 'Environment',
    title: 'Real-Time Water Quality Monitoring Systems',
    dept: 'Ministry of Jal Shakti',
    imageUrl: '/assets/water.jpg',
    date: '10 May 2025',
    location: 'Ganga Basin Municipal Wards',
    budget: '₹20,000,000 - ₹45,000,000',
    summary: 'High-frequency telemetry sensor mesh monitoring biochemical oxygen demand, turbidity, and chemical contaminants in urban water supplies.',
    alt: 'Real water treatment and monitoring facility photograph'
  },
  {
    id: 4,
    categoryKey: 'healthcare',
    category: 'Healthcare',
    title: 'AI-enabled Rural Telehealth Infrastructure',
    dept: 'Ministry of Health & Family Welfare',
    imageUrl: '/assets/telehealth.jpg',
    date: '20 May 2025',
    location: 'Primary Health Network, Mysuru, KA',
    budget: '₹20,000,000 - ₹42,000,000',
    summary: 'Portable diagnostic telemetry kits and encrypted WebRTC pipelines connecting ASHA workers with district hospital specialist doctors.',
    alt: 'Real rural telehealth digital doctor consultation photograph'
  },

  // Urban Development
  {
    id: 5,
    categoryKey: 'urbanDev',
    category: 'Urban Development',
    title: 'Smart Parking and Congestion Management System',
    dept: 'Dept of Urban Sanitation & Smart Cities',
    imageUrl: '/assets/traffic.jpg',
    date: '18 May 2025',
    location: 'Pune Municipal Area, MH',
    budget: '₹15,000,000 - ₹35,000,000',
    summary: 'IoT surface vehicle detection sensors paired with mobile citizen spot discovery and automated UPI digital ticketing.',
    alt: 'Smart parking and urban transport photograph'
  },
  {
    id: 6,
    categoryKey: 'urbanDev',
    category: 'Urban Development',
    title: 'Urban Flood Monitoring and Early Warning Network',
    dept: 'Dept of Urban Sanitation & Smart Cities',
    imageUrl: '/assets/water.jpg',
    date: '28 May 2025',
    location: 'Chennai Metropolitan Area, TN',
    budget: '₹20,000,000 - ₹45,000,000',
    summary: 'Ultrasonic stormwater level sensors and predictive meteorological runoff modeling to issue ward-level flash flood warnings.',
    alt: 'Urban water flow and flood management'
  },

  // Rural Development
  {
    id: 7,
    categoryKey: 'ruralDev',
    category: 'Rural Development',
    title: 'Smart Irrigation Advisory for Small Farmers',
    dept: 'Department of Agriculture & Rural Development',
    imageUrl: '/assets/solar.jpg',
    date: '25 May 2025',
    location: 'Vidarbha Region, Maharashtra',
    budget: '₹12,000,000 - ₹28,000,000',
    summary: 'Low-cost soil moisture telemetry probes delivering vernacular SMS and voice watering recommendations to prevent aquifer depletion.',
    alt: 'Smart farming and rural agriculture photograph'
  },
  {
    id: 8,
    categoryKey: 'ruralDev',
    category: 'Rural Development',
    title: 'Rural Cold Storage and Supply Chain Monitoring',
    dept: 'Department of Agriculture & Rural Development',
    imageUrl: '/assets/traffic.jpg',
    date: '05 Jun 2025',
    location: 'Nashik & Ahmednagar Districts, MH',
    budget: '₹18,000,000 - ₹40,000,000',
    summary: 'Wireless temperature/humidity beacons with automated spoilage deviation alerts protecting agricultural cooperative transport.',
    alt: 'Rural supply chain and cold storage'
  },
  {
    id: 9,
    categoryKey: 'ruralDev',
    category: 'Rural Development',
    title: 'Digital Access Platform for Rural Public Services',
    dept: 'Department of IT & e-Governance',
    imageUrl: '/assets/telehealth.jpg',
    date: '12 Jun 2025',
    location: 'Ranchi District Gram Panchayats, JH',
    budget: '₹15,000,000 - ₹30,000,000',
    summary: 'Offline-first progressive micro-kiosks enabling biometric welfare verification and certificate filing at remote Gram Panchayats.',
    alt: 'Rural citizen services kiosk'
  },

  // Healthcare
  {
    id: 10,
    categoryKey: 'healthcare',
    category: 'Healthcare',
    title: 'AI-Assisted Primary Healthcare Screening Kits',
    dept: 'Dept of Rural Public Health',
    imageUrl: '/assets/telehealth.jpg',
    date: '15 Jun 2025',
    location: 'Primary Health Network, Mysuru, KA',
    budget: '₹25,000,000 - ₹50,000,000',
    summary: 'Handheld diagnostic imaging kits with on-device edge ML for frontline triaging of oral oncology and chronic cardiovascular markers.',
    alt: 'Handheld diagnostic medical kit'
  },
  {
    id: 11,
    categoryKey: 'healthcare',
    category: 'Healthcare',
    title: 'Mobile Teleradiology Support for Community Health Centres',
    dept: 'Dept of Rural Public Health',
    imageUrl: '/assets/telehealth.jpg',
    date: '22 Jun 2025',
    location: 'District CHC Network, Bhopal, MP',
    budget: '₹16,000,000 - ₹35,000,000',
    summary: 'Cloud-connected DICOM teleradiology pipeline delivering AI pre-screening to triage urgent abnormal chest scans within 15 minutes.',
    alt: 'Digital teleradiology scan review'
  },

  // Education
  {
    id: 12,
    categoryKey: 'education',
    category: 'Education',
    title: 'Adaptive Digital Learning Platform for Government Schools',
    dept: 'Department of School Education & Literacy',
    imageUrl: '/assets/telehealth.jpg',
    date: '30 May 2025',
    location: 'Jaipur District Government Schools, RJ',
    budget: '₹22,000,000 - ₹48,000,000',
    summary: 'Offline-capable adaptive STEM tablet curriculum personalizing lesson pace and remedial pathways based on student error latency.',
    alt: 'Adaptive classroom tablet learning'
  },
  {
    id: 13,
    categoryKey: 'education',
    category: 'Education',
    title: 'AI-Assisted Career Discovery for Secondary Students',
    dept: 'Department of School Education & Literacy',
    imageUrl: '/assets/solar.jpg',
    date: '10 Jun 2025',
    location: 'Coimbatore & Salem Districts, TN',
    budget: '₹10,000,000 - ₹25,000,000',
    summary: 'Multi-lingual psychometric evaluation engine aligning student academic competencies with regional industrial job demands.',
    alt: 'Student career guidance advisory'
  },

  // Environment
  {
    id: 14,
    categoryKey: 'environment',
    category: 'Environment',
    title: 'Real-Time Air Quality Mesh Monitoring Network',
    dept: 'State Pollution Control Board',
    imageUrl: '/assets/solar.jpg',
    date: '02 Jun 2025',
    location: 'NCR Industrial Corridors, Delhi',
    budget: '₹25,000,000 - ₹55,000,000',
    summary: 'High-density laser optical particle counters and electrochemical sensors generating hyper-local micro-climate heatmaps.',
    alt: 'Air quality particulate sensors'
  },
  {
    id: 15,
    categoryKey: 'environment',
    category: 'Environment',
    title: 'Intelligent Solid Waste Optical Segregation System',
    dept: 'State Pollution Control Board',
    imageUrl: '/assets/traffic.jpg',
    date: '14 Jun 2025',
    location: 'Ghazipur & Okhla Transfer Stations, Delhi',
    budget: '₹35,000,000 - ₹75,000,000',
    summary: 'High-speed hyperspectral vision conveyor systems separating recyclables and hazardous compostables at over 2 tons/hr.',
    alt: 'Automated waste recycling facility'
  },

  // Public Safety
  {
    id: 16,
    categoryKey: 'publicSafety',
    category: 'Public Safety',
    title: 'AI-Assisted Emergency Dispatch & Response Coordination',
    dept: 'State Police & Emergency Response Services',
    imageUrl: '/assets/traffic.jpg',
    date: '08 Jun 2025',
    location: 'State Command & Control Centre, Hyderabad',
    budget: '₹30,000,000 - ₹65,000,000',
    summary: 'Real-time multi-lingual emergency call transcription, instant GIS caller triangulating, and dynamic vehicle dispatch routing.',
    alt: 'Emergency response command center'
  },
  {
    id: 17,
    categoryKey: 'publicSafety',
    category: 'Public Safety',
    title: 'Predictive Traffic Accident Hotspot Telemetry',
    dept: 'State Police & Road Safety Cell',
    imageUrl: '/assets/traffic.jpg',
    date: '19 Jun 2025',
    location: 'Mumbai-Pune Expressway Corridor, MH',
    budget: '₹18,000,000 - ₹38,000,000',
    summary: 'Edge computer vision sensors identifying near-miss collision trajectories and alerting highway patrol units proactively.',
    alt: 'Highway traffic safety telemetry'
  },

  // Digital Governance
  {
    id: 18,
    categoryKey: 'digitalGov',
    category: 'Digital Governance',
    title: 'Cross-Department Verified Credential Exchange',
    dept: 'Ministry of Electronics & Information Technology',
    imageUrl: '/assets/water.jpg',
    date: '25 Jun 2025',
    location: 'National e-Governance Division, New Delhi',
    budget: '₹28,000,000 - ₹60,000,000',
    summary: 'Cryptographically signed verifiable credential gateway allowing citizens to consent-share public certificates across state registries.',
    alt: 'Digital credential exchange security'
  },
  {
    id: 19,
    categoryKey: 'digitalGov',
    category: 'Digital Governance',
    title: 'Citizen Grievance Automated NLP Classification',
    dept: 'Dept of Administrative Reforms & Public Grievances',
    imageUrl: '/assets/telehealth.jpg',
    date: '29 Jun 2025',
    location: 'CPGRAMS Integration Directorate, New Delhi',
    budget: '₹16,000,000 - ₹34,000,000',
    summary: 'Vernacular transformer models automatically routing citizen grievance tickets to competent municipal officers with SLA timers.',
    alt: 'Public grievance digital dispatch'
  }
];

export const FeaturedChallengesSection: React.FC<FeaturedChallengesSectionProps> = ({ 
  selectedCategory 
}) => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);
  const [displayCards, setDisplayCards] = useState<ChallengeItem[]>(ALL_CHALLENGES.slice(0, 4));
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Measure container width for responsive carousel math
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Filter cards with visible exit/enter animation when selectedCategory changes
  useEffect(() => {
    setIsFilterAnimating(true);
    const timeout = setTimeout(() => {
      let filtered: ChallengeItem[];
      if (!selectedCategory) {
        // Default flagship cards
        filtered = ALL_CHALLENGES.slice(0, 4);
      } else {
        const matches = ALL_CHALLENGES.filter(
          c => c.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
        );
        filtered = matches.length > 0 ? matches : ALL_CHALLENGES.slice(0, 4);
      }
      setDisplayCards(filtered);
      setActiveIndex(0);
      setIsFilterAnimating(false);
    }, 180);

    return () => clearTimeout(timeout);
  }, [selectedCategory]);

  const totalCards = displayCards.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  // Card geometry dimensions for desktop carousel
  // Active Card: width ~480px, Inactive Card: width ~340px, Gap: 24px
  const activeCardWidth = Math.min(480, Math.max(320, containerWidth - 80));
  const normalCardWidth = Math.min(340, Math.max(260, containerWidth * 0.35));
  const gap = 24;

  // Compute track transform offset so that displayCards[activeIndex] is precisely centered
  const getTrackTransform = () => {
    // Distance from track start to center of active card:
    // Before activeIndex, there are `activeIndex` normal cards
    let offsetToActiveCenter = 0;
    for (let i = 0; i < activeIndex; i++) {
      offsetToActiveCenter += normalCardWidth + gap;
    }
    offsetToActiveCenter += activeCardWidth / 2;

    const containerCenter = containerWidth / 2;
    const translateX = containerCenter - offsetToActiveCenter;
    return `translateX(${translateX}px)`;
  };

  return (
    <section className="w-full bg-white py-7 px-4 sm:px-6 lg:px-8 border-b border-[#DCE6F2] overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-5">
        
        {/* Top Header Row with Active Category Indicator and Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DCE6F2] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#146EF5] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedCategory ? `Filter: ${selectedCategory}` : 'Featured Opportunities'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Showing {totalCards} {totalCards === 1 ? 'Challenge' : 'Challenges'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2A56] tracking-tight mt-1">
              {t('featured.title')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('featured.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Carousel Navigation Arrows */}
            <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-[#DCE6F2]">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-md bg-white hover:bg-blue-50 text-[#0F2A56] hover:text-[#146EF5] border border-slate-200 flex items-center justify-center transition-all duration-200 hover:shadow-xs active:scale-95 cursor-pointer"
                title="Previous Challenge"
                aria-label="Previous challenge"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>

              <span className="text-[11px] font-bold text-slate-600 px-2 whitespace-nowrap">
                {activeIndex + 1} / {totalCards}
              </span>

              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-md bg-white hover:bg-blue-50 text-[#0F2A56] hover:text-[#146EF5] border border-slate-200 flex items-center justify-center transition-all duration-200 hover:shadow-xs active:scale-95 cursor-pointer"
                title="Next Challenge"
                aria-label="Next challenge"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>

            <Link
              to="/challenges"
              className="text-xs font-bold text-[#146EF5] hover:text-blue-800 flex items-center space-x-1 shrink-0 py-1.5 px-3 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
            >
              <span>{t('featured.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================
            REAL HORIZONTAL CAROUSEL WITH SIDE-PEEK & EXPANSION
           ======================================================== */}
        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden py-4 min-h-[380px]"
        >
          {/* Subtle Left & Right Gradient Shadows for Portal Depth */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Sliding Track with Transform Animation (450–600ms ease-out) */}
          <div
            style={{
              transform: getTrackTransform(),
              transition: isFilterAnimating 
                ? 'opacity 180ms ease, transform 180ms ease' 
                : 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease'
            }}
            className={`flex items-center flex-nowrap ${
              isFilterAnimating ? 'opacity-0 translate-x-4' : 'opacity-100'
            }`}
          >
            {displayCards.map((card, idx) => {
              const isActive = idx === activeIndex;
              const cardWidth = isActive ? activeCardWidth : normalCardWidth;

              return (
                <div
                  key={card.id}
                  style={{
                    width: `${cardWidth}px`,
                    marginRight: `${gap}px`,
                    transition: 'all 520ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onClick={() => {
                    if (!isActive) setActiveIndex(idx);
                  }}
                  className={`shrink-0 select-none group relative rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white border-2 border-[#146EF5] shadow-lg z-10 cursor-default'
                      : 'bg-slate-50/90 border border-[#DCE6F2] shadow-2xs opacity-75 hover:opacity-100 hover:border-blue-300 hover:shadow-md cursor-pointer scale-[0.94] hover:scale-[0.96]'
                  } hover:-translate-y-1.5`}
                >
                  
                  {/* Active Badge Marker */}
                  {isActive && (
                    <div className="absolute -top-2.5 left-4 z-30">
                      <span className="bg-[#146EF5] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Active Challenge</span>
                      </span>
                    </div>
                  )}

                  {/* Card Image Container (Expanded on active, compact on inactive) */}
                  <div 
                    style={{
                      height: isActive ? '160px' : '115px',
                      transition: 'height 520ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="w-full relative bg-slate-800 overflow-hidden rounded-t-[10px] shrink-0"
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10 pointer-events-none" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-bold bg-white/95 text-[#0F2A56] px-2 py-0.5 rounded border border-white/70 shadow-2xs">
                        {card.category}
                      </span>
                    </div>

                    {/* Deadline on image top-right */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="text-[10px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                        Closes: {card.date}
                      </span>
                    </div>

                    {/* Location pinned on bottom edge of image */}
                    <div className="absolute bottom-2 left-2.5 z-10 flex items-center space-x-1 text-[11px] text-white/90 drop-shadow-sm font-medium">
                      <MapPin className="w-3 h-3 text-[#BFDBFE]" />
                      <span className="truncate">{card.location}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className={`p-4 flex flex-col justify-between ${isActive ? 'space-y-3' : 'space-y-2'}`}>
                    <div>
                      {/* Department */}
                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium mb-1 truncate">
                        <Landmark className="w-3.5 h-3.5 text-[#146EF5] shrink-0" />
                        <span className="truncate text-slate-700 font-semibold">{card.dept}</span>
                      </div>

                      {/* Title: Emphasized and larger on active card */}
                      <h3 
                        className={`font-extrabold text-slate-900 group-hover:text-[#146EF5] transition-colors leading-snug line-clamp-2 ${
                          isActive ? 'text-sm sm:text-[15px]' : 'text-xs'
                        }`}
                      >
                        {card.title}
                      </h3>

                      {/* Expanded Information for Active Card: Problem statement summary */}
                      {isActive && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed animate-fadeIn">
                          {card.summary}
                        </p>
                      )}
                    </div>

                    {/* Card Footer: Budget & CTA */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Pilot Budget</span>
                        <span className="text-xs font-bold text-emerald-700">{card.budget}</span>
                      </div>

                      {/* Explicit "VIEW CHALLENGE →" visible on Active Card */}
                      {isActive ? (
                        <Link
                          to={`/challenges/${card.id}`}
                          className="btn-gov-primary text-xs py-1.5 px-3.5 shadow-2xs group/btn inline-flex items-center space-x-1 shrink-0"
                        >
                          <span>VIEW CHALLENGE</span>
                          <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => setActiveIndex(idx)}
                          className="text-xs font-bold text-[#146EF5] hover:text-blue-800 flex items-center space-x-1 shrink-0 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          <span>Expand</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center space-x-2 pt-1">
          {displayCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex 
                  ? 'w-7 h-2 bg-[#146EF5]' 
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to challenge ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
