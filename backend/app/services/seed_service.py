from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.security import get_password_hash
from app.models.models import (
    Organization, User, GovernmentDepartment, Startup, StartupSolution,
    Challenge, ChallengeRequirement, ChallengeKPI, Template, DemandSignal,
    Application, EligibilityWaiver, Evaluation, MatchScore, Pilot, SandboxConstraint,
    PilotMilestone, PilotKPI, PilotRisk, Evidence, IndependentValidation,
    Contract, PaymentMilestone, IPDataClause, CybersecurityRequirement,
    ProcurementRecord, ApprovalGate, ReuseRecommendation, StartupTrackRecord, Notification, AuditLog
)

POPULAR_AREA_CHALLENGES = [
    # URBAN DEVELOPMENT
    {
        "title": "Intelligent Traffic Signal Optimization for Urban Corridors",
        "category": "Urban Development",
        "department_name": "Ministry of Road Transport & Urban Mobility",
        "problem_statement": "High traffic congestion and extended waiting times at major urban intersections lead to severe delays, excessive vehicle emissions, and lost economic productivity.",
        "current_process": "Fixed timer signal intervals adjusted manually during peak hours by traffic police.",
        "desired_outcome": "Dynamic AI-driven adaptive traffic signal management that adjusts green light durations in real time based on camera and sensor vehicle queues.",
        "functional_requirements": "Real-time camera feeds, edge AI processing, sub-second signal timing adjustments, centralized control dashboard, emergency vehicle priority override.",
        "technical_requirements": "4G/5G edge compute gateway, RTSP video analytics, IP66 enclosure, REST API control interface.",
        "eligibility_requirements": "Registered tech startup with proven computer vision or traffic telemetry IP.",
        "budget_range": "₹30,000,000 - ₹60,000,000",
        "timeline": "6 Months Pilot",
        "location": "Bengaluru Urban District, KA",
        "status": "Published"
    },
    {
        "title": "Smart Parking and Congestion Management System",
        "category": "Urban Development",
        "department_name": "Dept of Urban Sanitation & Smart Cities",
        "problem_statement": "Drivers searching for parking spots in high-density commercial hubs contribute to over 30% of urban traffic congestion and illegal street parking.",
        "current_process": "Paper tickets issued by manual parking attendants with no visibility into vacant spots.",
        "desired_outcome": "IoT-enabled real-time parking space occupancy telemetry with mobile app discovery and digital payments.",
        "functional_requirements": "Surface vehicle detection sensors, mobile citizen app, digital payment gateway, warden enforcement app.",
        "technical_requirements": "LoRaWAN sensor nodes, cloud gateway, mobile SDK for Android/iOS, UPI integration.",
        "eligibility_requirements": "Startup with IoT hardware or smart parking solution readiness.",
        "budget_range": "₹15,000,000 - ₹35,000,000",
        "timeline": "4 Months Pilot",
        "location": "Pune Municipal Area, MH",
        "status": "Published"
    },
    {
        "title": "Urban Flood Monitoring and Early Warning Network",
        "category": "Urban Development",
        "department_name": "Dept of Urban Sanitation & Smart Cities",
        "problem_statement": "Monsoons cause sudden flash floods and waterlogging in low-lying city Wards due to blocked storm drains, stranding commuters and damaging assets.",
        "current_process": "Citizen complaint phone lines and manual site visits by municipal emergency teams after water accumulation.",
        "desired_outcome": "Automated ultrasonic water level sensors across storm drains and underpasses providing predictive flash flood alerts.",
        "functional_requirements": "Solar-powered ultrasonic depth telemetry, cellular IoT communication, automated citizen SMS warnings, predictive rainfall modeling API.",
        "technical_requirements": "Battery backup 72 hrs, ultrasonic level sensor (+/- 1mm precision), cloud alerting portal.",
        "eligibility_requirements": "Recognized IoT/Hydro-tech startup.",
        "budget_range": "₹20,000,000 - ₹45,000,000",
        "timeline": "5 Months Pilot",
        "location": "Chennai Metropolitan Area, TN",
        "status": "Published"
    },

    # RURAL DEVELOPMENT
    {
        "title": "Smart Irrigation Advisory for Small Farmers",
        "category": "Rural Development",
        "department_name": "Department of Agriculture & Rural Development",
        "problem_statement": "Smallholder farmers face crop failure and ground water depletion due to inefficient flood irrigation and lack of hyper-local weather advisory.",
        "current_process": "Traditional calendar-based watering without soil moisture monitoring or satellite weather forecasting.",
        "desired_outcome": "Low-cost soil moisture telemetry coupled with vernacular SMS/Voice irrigation recommendations for rural farmers.",
        "functional_requirements": "Soil moisture and temperature probes, solar gateway, multi-lingual voice calls/SMS engine, localized weather API.",
        "technical_requirements": "Micro-controller telemetry unit, solar panel 10W, GSM modem, multi-lingual voice engine.",
        "eligibility_requirements": "AgTech startup with hardware/software advisory capability.",
        "budget_range": "₹12,000,000 - ₹28,000,000",
        "timeline": "4 Months Pilot",
        "location": "Vidarbha Region, MH",
        "status": "Published"
    },
    {
        "title": "Rural Cold Storage and Supply Chain Monitoring",
        "category": "Rural Development",
        "department_name": "Department of Agriculture & Rural Development",
        "problem_statement": "Up to 35% of perishable produce harvested by rural farming cooperatives spoils before reaching urban wholesale markets due to unmonitored cold chain breaks.",
        "current_process": "Basic un-monitored refrigerated vans and un-regulated community cold storages.",
        "desired_outcome": "IoT-based temperature and humidity telemetry with real-time spoilage risk alerts across rural cold units and transit trucks.",
        "functional_requirements": "Wireless temperature/humidity sensors, GPS tracker, battery backup for 48 hrs, central cold chain dashboard, automated temperature deviation alerts.",
        "technical_requirements": "BLE/Zigbee sensor beacons, cellular gateway, web dashboard, automated alert push.",
        "eligibility_requirements": "Cold-chain/Supply-chain tech startup.",
        "budget_range": "₹18,000,000 - ₹40,000,000",
        "timeline": "6 Months Pilot",
        "location": "Nashik & Ahmednagar Districts, MH",
        "status": "Published"
    },
    {
        "title": "Digital Access Platform for Rural Services",
        "category": "Rural Development",
        "department_name": "Department of Information Technology & e-Governance",
        "problem_statement": "Rural citizens in remote Gram Panchayats must travel up to 40km to block headquarters to apply for government welfare schemes and certificates.",
        "current_process": "Physical paper forms submitted at taluka offices with slow manual processing and frequent document loss.",
        "desired_outcome": "Micro-kiosk digital platform enabling offline-first application filing and biometric verification at Gram Panchayat centers.",
        "functional_requirements": "Low-bandwidth offline sync, Aadhaar biometric integration, vernacular UI, document scanner integration, automated application tracking.",
        "technical_requirements": "Progressive Web App / Electron desktop app, SQLite local DB with auto-sync, STQC biometric reader SDK.",
        "eligibility_requirements": "GovTech / e-Governance startup.",
        "budget_range": "₹15,000,000 - ₹30,000,000",
        "timeline": "5 Months Pilot",
        "location": "Ranchi District Wards, JH",
        "status": "Published"
    },

    # HEALTHCARE
    {
        "title": "AI-Assisted Primary Healthcare Screening",
        "category": "Healthcare",
        "department_name": "Dept of Rural Public Health",
        "problem_statement": "Primary Health Centres (PHCs) experience shortage of specialist doctors, delaying early detection of chronic conditions like diabetes, hypertension, and oral cancer.",
        "current_process": "Manual visual examination by community health workers with basic paper record entry.",
        "desired_outcome": "Portable AI-powered screening kits allowing frontline health workers to perform point-of-care diagnostics and triaging.",
        "functional_requirements": "Handheld diagnostic devices, offline AI image analysis, automatic risk stratification, tele-consultation escalation pipeline.",
        "technical_requirements": "Android diagnostic app, edge AI model execution, Bluetooth vitals integration, cloud EMR sync.",
        "eligibility_requirements": "HealthTech / MedTech startup with clinical trial or lab validation proof.",
        "budget_range": "₹25,000,000 - ₹50,000,000",
        "timeline": "6 Months Pilot",
        "location": "Primary Health Network, Mysuru District, KA",
        "status": "Published"
    },
    {
        "title": "Remote Health Monitoring for Rural Communities",
        "category": "Healthcare",
        "department_name": "Dept of Rural Public Health",
        "problem_statement": "Elderly and high-risk pregnant women in tribal and remote rural pockets lack continuous vital statistics monitoring between clinic visits.",
        "current_process": "Monthly physical visits by Accredited Social Health Activists (ASHA) with delayed paper reporting.",
        "desired_outcome": "Bluetooth-enabled multi-parameter vitals kit for ASHA workers with cloud telemetry and automated critical alerts.",
        "functional_requirements": "Portable ECG, SpO2, blood pressure and glucose telemetry, GSM data upload, emergency doctor alert system.",
        "technical_requirements": "ISO 13485 compliant sensor kit, low-energy Bluetooth 5.0, cellular mobile app, WebRTC tele-consultation.",
        "eligibility_requirements": "Telemedicine / Remote Care startup.",
        "budget_range": "₹20,000,000 - ₹42,000,000",
        "timeline": "5 Months Pilot",
        "location": "Wayanad District Rural PHCs, KL",
        "status": "Published"
    },
    {
        "title": "Mobile Diagnostic Support for Community Health Centres",
        "category": "Healthcare",
        "department_name": "Dept of Rural Public Health",
        "problem_statement": "Rural Community Health Centres (CHCs) lack on-site radiologists, causing 7-10 day delays in diagnostic report generation for X-rays.",
        "current_process": "Physical transport of film X-rays to district hospitals for manual interpretation.",
        "desired_outcome": "Cloud-connected teleradiology platform with AI pre-screening to triage normal vs urgent abnormal scans within 15 minutes.",
        "functional_requirements": "DICOM image compression, cloud AI chest X-ray triage, web radiologist viewer, automated SMS notification to MO.",
        "technical_requirements": "DICOM 3.0 server compliance, deep learning X-ray classification engine, encrypted cloud storage (HIPAA/DISHA).",
        "eligibility_requirements": "Diagnostic AI / Teleradiology startup.",
        "budget_range": "₹16,000,000 - ₹35,000,000",
        "timeline": "4 Months Pilot",
        "location": "District CHC Network, Bhopal, MP",
        "status": "Published"
    },

    # EDUCATION
    {
        "title": "Adaptive Digital Learning Platform for Government Schools",
        "category": "Education",
        "department_name": "Department of School Education & Literacy",
        "problem_statement": "High variance in student learning levels in rural government secondary schools leads to high drop-out rates and poor foundational numeracy/literacy scores.",
        "current_process": "Standard textbook teaching without personalized pace adjustment or remedial learning paths.",
        "desired_outcome": "Offline-capable adaptive learning software on school tablets that personalizes math and science lessons based on student response speed and errors.",
        "functional_requirements": "Multi-lingual audio/visual lessons, offline progress sync, adaptive quiz engine, teacher analytics dashboard.",
        "technical_requirements": "Android tablet application, local SQLite caching, periodic server sync engine, gamified learning UX.",
        "eligibility_requirements": "EdTech startup with K-12 learning solution.",
        "budget_range": "₹22,000,000 - ₹48,000,000",
        "timeline": "6 Months Pilot",
        "location": "Jaipur District Government Schools, RJ",
        "status": "Published"
    },
    {
        "title": "AI-Assisted Career Guidance for Students",
        "category": "Education",
        "department_name": "Department of School Education & Literacy",
        "problem_statement": "Secondary school graduates in Tier-2/3 towns lack access to professional career counseling, resulting in misaligned higher education and skill training choices.",
        "current_process": "Annual generic group lectures with no individual aptitude benchmarking or local job-market demand alignment.",
        "desired_outcome": "AI-driven career discovery platform analyzing student aptitude, academic strengths, and regional industry skill demands to generate personalized career pathways.",
        "functional_requirements": "Psychometric assessment engine, skills-to-jobs mapping database, multi-lingual chatbot counselor, parent report generation.",
        "technical_requirements": "LLM-powered advisory bot, career taxonomy database, web/mobile portal, PDF export engine.",
        "eligibility_requirements": "Career guidance / EdTech startup.",
        "budget_range": "₹10,000,000 - ₹25,000,000",
        "timeline": "4 Months Pilot",
        "location": "Coimbatore & Salem Secondary Schools, TN",
        "status": "Published"
    },
    {
        "title": "Smart Attendance and Learning Analytics System",
        "category": "Education",
        "department_name": "Department of School Education & Literacy",
        "problem_statement": "Chronic absenteeism in rural primary schools goes undetected for weeks, leading to learning loss and wasted mid-day meal allocations.",
        "current_process": "Paper roll-call registers compiled manually at the end of each month.",
        "desired_outcome": "Automated facial or tablet-based fast attendance logging coupled with predictive drop-out risk alerts for school inspectors.",
        "functional_requirements": "On-device fast facial recognition, zero-data storage privacy compliance, automated SMS to parents, district attendance heatmap.",
        "technical_requirements": "On-device edge face embedding matching (<0.5s per face), encrypted local storage, REST API dashboard.",
        "eligibility_requirements": "Computer vision / AI EdTech startup.",
        "budget_range": "₹14,000,000 - ₹32,000,000",
        "timeline": "5 Months Pilot",
        "location": "Lucknow & Kanpur District Schools, UP",
        "status": "Published"
    },

    # ENVIRONMENT
    {
        "title": "Real-Time Air Quality Monitoring Network",
        "category": "Environment",
        "department_name": "State Pollution Control Board & Environment Department",
        "problem_statement": "Industrial belts and urban corridors experience localized micro-climate air pollution spikes that exceed central monitoring station coverage.",
        "current_process": "Sparse regulatory reference stations (1 per 50 sq km) providing delayed daily averages.",
        "desired_outcome": "High-density mesh network of low-cost hyper-local air quality sensors monitoring PM2.5, PM10, NO2, and CO with real-time heatmaps.",
        "functional_requirements": "Calibrated optical particle sensors, solar/battery operation, cellular telemetry, public transparency API, pollution spike anomaly alerts.",
        "technical_requirements": "Laser particle counters, electrochemical gas sensors, solar power management, GIS heatmap rendering.",
        "eligibility_requirements": "Environment Tech / Sensor startup.",
        "budget_range": "₹25,000,000 - ₹55,000,000",
        "timeline": "6 Months Pilot",
        "location": "NCR Industrial Zone & Delhi Border Corridors",
        "status": "Published"
    },
    {
        "title": "Intelligent Solid Waste Segregation System",
        "category": "Environment",
        "department_name": "State Pollution Control Board & Environment Department",
        "problem_statement": "Mixed municipal solid waste arriving at dumpsites reduces recycling rates below 15% and increases landfill methane emissions.",
        "current_process": "Manual segregation by ragpickers at transfer stations with high health hazards.",
        "desired_outcome": "Automated optical AI segregation conveyor belt system separating dry recyclables, organics, and hazardous waste at transfer stations.",
        "functional_requirements": "Hyperspectral & RGB computer vision cameras, high-speed pneumatic ejectors, throughput capacity >2 tons/hr, material classification dashboard.",
        "technical_requirements": "Industrial RGB-NIR camera array, high-speed PLC pneumatic controller, real-time object classification (>60 FPS).",
        "eligibility_requirements": "Robotics / CleanTech startup.",
        "budget_range": "₹35,000,000 - ₹75,000,000",
        "timeline": "6 Months Pilot",
        "location": "Ghazipur & Okhla Waste Transfer Units, Delhi",
        "status": "Published"
    },
    {
        "title": "Urban Green Cover Monitoring Platform",
        "category": "Environment",
        "department_name": "State Pollution Control Board & Environment Department",
        "problem_statement": "Illegal tree felling and encroachment in municipal parks and reserved urban forests go unnoticed until severe canopy loss occurs.",
        "current_process": "Periodic physical inspections by beat forest officers covering vast land areas.",
        "desired_outcome": "Satellite synthetic aperture radar (SAR) and drone AI telemetry platform tracking green canopy density change week-over-week.",
        "functional_requirements": "Automated satellite image change detection, drone path planning API, tree density index calculator, illegal deforestation alert engine.",
        "technical_requirements": "Sentinel-2 / Landsat API integration, NDVI/EVI analytics algorithms, GIS web portal.",
        "eligibility_requirements": "GeoSpatial / Remote Sensing startup.",
        "budget_range": "₹15,000,000 - ₹35,000,000",
        "timeline": "4 Months Pilot",
        "location": "Greater Hyderabad Forest Circle, TS",
        "status": "Published"
    },

    # PUBLIC SAFETY
    {
        "title": "AI-Assisted Emergency Response Coordination",
        "category": "Public Safety",
        "department_name": "State Police & Emergency Response Services",
        "problem_statement": "Emergency call centers experience high dispatch delays during concurrent major incidents due to manual location triaging and vehicle dispatching.",
        "current_process": "Operators manually log call details and radio nearest police/ambulance units based on verbal locations.",
        "desired_outcome": "Real-time speech-to-text call transcription, automated caller location pin-pointing, and AI dispatch optimization for nearest emergency response vehicles.",
        "functional_requirements": "Multi-lingual speech recognition (Hindi, English, regional), automated GIS CAD routing, live unit GPS tracking, incident severity scoring.",
        "technical_requirements": "ASR speech model, WebSocket CAD dispatch server, mobile unit driver app, interactive GIS map interface.",
        "eligibility_requirements": "Emergency Tech / GovTech startup.",
        "budget_range": "₹30,000,000 - ₹65,000,000",
        "timeline": "6 Months Pilot",
        "location": "ERSS Command Centre, Bengaluru, KA",
        "status": "Published"
    },
    {
        "title": "Smart Street Safety and Incident Reporting System",
        "category": "Public Safety",
        "department_name": "State Police & Emergency Response Services",
        "problem_statement": "Dark spots and unmonitored pedestrian walkways in suburban sectors lead to safety concerns for women and night shift workers.",
        "current_process": "Traditional PCR van patrols covering fixed routes on periodic schedules.",
        "desired_outcome": "Smart streetlights with integrated emergency panic buttons, acoustic distress detection, and automated camera tilt/zoom alerts to control rooms.",
        "functional_requirements": "Acoustic scream/crash detection, physical SOS button, HD IP camera auto-focus, mesh network connectivity, mobile patrol alert dispatch.",
        "technical_requirements": "Smart pole IoT controller, acoustic AI sensor, ONVIF camera integration, police control center app.",
        "eligibility_requirements": "Smart City / Safety tech startup.",
        "budget_range": "₹20,000,000 - ₹45,000,000",
        "timeline": "5 Months Pilot",
        "location": "Cyberabad IT Corridor & Outer Sector 5, TS",
        "status": "Published"
    },
    {
        "title": "Public Emergency Alert and Response Platform",
        "category": "Public Safety",
        "department_name": "State Police & Emergency Response Services",
        "problem_statement": "During severe industrial gas leaks, chemical spills, or sudden extreme weather, target ward evacuation notices take up to 2 hours to reach residents.",
        "current_process": "Loudspeaker vehicles and TV news bulletins with slow reach in residential Wards.",
        "desired_outcome": "Cell-broadcast target location emergency warning system delivering instantaneous high-priority alerts to mobile phones in affected geographic radiuses.",
        "functional_requirements": "Geo-fenced cell broadcast API, multi-lingual audio/text alerts, priority override on smartphones, disaster management authority dashboard.",
        "technical_requirements": "Telecom CAP (Common Alerting Protocol) integration, geo-polygon boundary map picker, SMS/voice gateway fallback.",
        "eligibility_requirements": "Disaster management / Telecom Tech startup.",
        "budget_range": "₹25,000,000 - ₹50,000,000",
        "timeline": "4 Months Pilot",
        "location": "Vizag Industrial Hub & Coastal Belt, AP",
        "status": "Published"
    },

    # DIGITAL GOVERNANCE
    {
        "title": "Unified Citizen Service Request Platform",
        "category": "Digital Governance",
        "department_name": "Department of Information Technology & e-Governance",
        "problem_statement": "Citizens must navigate 15+ different municipal portals and mobile apps for trade licenses, birth certificates, property tax, and utility connections.",
        "current_process": "Fragmented legacy departmental databases requiring separate registrations, credentials, and physically submitted documents.",
        "desired_outcome": "Single-sign-on unified citizen digital portal with AI assistant guiding service applications and status tracking.",
        "functional_requirements": "OAuth/DigiLocker integration, microservices API gateway, conversational AI bot, real-time SLA tracking dashboard.",
        "technical_requirements": "REST/GraphQL API gateway, OAuth2 authentication, LLM document workflow guide, mobile PWA.",
        "eligibility_requirements": "e-Governance / Citizen Tech startup.",
        "budget_range": "₹35,000,000 - ₹80,000,000",
        "timeline": "6 Months Pilot",
        "location": "State e-Governance Hub, Gandhinagar, GJ",
        "status": "Published"
    },
    {
        "title": "AI-Assisted Government Document Processing",
        "category": "Digital Governance",
        "department_name": "Department of Information Technology & e-Governance",
        "problem_statement": "Processing legacy handwritten land deeds, revenue records, and subsidy applications creates a backlog of over 200,000 files in district collectorates.",
        "current_process": "Clerical staff manually inspect, transcribe, and verify every paper document and land map.",
        "desired_outcome": "Intelligent Document Processing (IDP) platform extracting structured metadata from scanned vernacular paper records with automated verification checks.",
        "functional_requirements": "Vernacular OCR for handwritten scripts, document classification AI, automated field verification against state registry, human-in-the-loop review UI.",
        "technical_requirements": "Deep learning OCR engine (Indic languages), PDF/TIFF processing pipeline, React review workstation UI.",
        "eligibility_requirements": "AI / Document Processing startup.",
        "budget_range": "₹20,000,000 - ₹45,000,000",
        "timeline": "5 Months Pilot",
        "location": "Revenue Department Collectorate, Pune, MH",
        "status": "Published"
    },
    {
        "title": "Digital Grievance Tracking and Resolution System",
        "category": "Digital Governance",
        "department_name": "Department of Information Technology & e-Governance",
        "problem_statement": "Citizen public grievances filed across portal, email, and paper often get routed to incorrect municipal officers, exceeding resolution SLAs by months.",
        "current_process": "Manual triage by central office clerks who re-route misdirected tickets by email.",
        "desired_outcome": "NLP-driven automatic grievance classification, officer routing, duplicate ticket merging, and citizen SMS tracking with SLA escalation matrix.",
        "functional_requirements": "Natural Language Processing for regional text/voice grievances, automated department classification, escalation triggers, citizen feedback loop.",
        "technical_requirements": "NLP classifier model (BERT/IndicBERT), automated workflow engine, SMS/WhatsApp notification gateway.",
        "eligibility_requirements": "GovTech / NLP startup.",
        "budget_range": "₹18,000,000 - ₹38,000,000",
        "timeline": "4 Months Pilot",
        "location": "Administrative Reforms Secretariat, Chandigarh, PB",
        "status": "Published"
    }
]

def add_popular_area_challenges(db: Session, default_dept_id: int = 1, default_user_id: int = 1):
    existing_titles = set(row[0] for row in db.query(Challenge.title).all())
    added = 0
    for item in POPULAR_AREA_CHALLENGES:
        if item["title"] not in existing_titles:
            ch = Challenge(
                title=item["title"],
                department_id=default_dept_id,
                department_name=item["department_name"],
                category=item["category"],
                problem_statement=item["problem_statement"],
                current_process=item["current_process"],
                desired_outcome=item["desired_outcome"],
                functional_requirements=item["functional_requirements"],
                technical_requirements=item["technical_requirements"],
                eligibility_requirements=item["eligibility_requirements"],
                budget_range=item["budget_range"],
                timeline=item["timeline"],
                location=item["location"],
                status=item["status"],
                created_by_user_id=default_user_id
            )
            db.add(ch)
            added += 1
    if added > 0:
        db.commit()
        print(f"Successfully added {added} popular area challenges to database.")

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).count() > 0:
        add_popular_area_challenges(db)
        return

    print("Seeding initial database with realistic SetuStart data...")

    # 1. Create Organizations
    dept_org = Organization(name="Department of Urban Sanitation & Smart Cities", org_type="Department", description="Municipal authority governing urban waste, water, and sanitation infrastructure.")
    health_org = Organization(name="Department of Rural Public Health", org_type="Department", description="State health department focused on last-mile health delivery and telemedicine.")
    startup_org1 = Organization(name="EcoClean Tech Solutions", org_type="Startup", description="IoT and AI startup building smart waste management platforms.")
    startup_org2 = Organization(name="AquaPure Dynamics", org_type="Startup", description="Clean-water telemetry and decentralized water treatment startup.")
    validator_org = Organization(name="National Public Tech Validation Agency", org_type="Independent Validator", description="Autonomous agency conducting independent pilot evidence audit.")
    admin_org = Organization(name="InnoBridge Platform Governance", org_type="Admin", description="Platform administration and governance unit.")
    db.add_all([dept_org, health_org, startup_org1, startup_org2, validator_org, admin_org])
    db.commit()

    # 2. Create Users across 5 Roles
    # Passwords set to 'password123'
    pass_hash = get_password_hash("password123")
    
    gov_user = User(email="dept@gov.in", password_hash=pass_hash, full_name="Dr. Rajesh Sharma (Director Urban Tech)", role="Government Department", organization_id=dept_org.id)
    startup_user1 = User(email="startup@ecoclean.io", password_hash=pass_hash, full_name="Ananya Verma (CEO, EcoClean)", role="Startup", organization_id=startup_org1.id)
    startup_user2 = User(email="startup@aquapure.io", password_hash=pass_hash, full_name="Vikram Sethi (CTO, AquaPure)", role="Startup", organization_id=startup_org2.id)
    evaluator_user = User(email="evaluator@expert.gov.in", password_hash=pass_hash, full_name="Prof. Sunita Rao (Senior Evaluator)", role="Evaluator", organization_id=dept_org.id)
    validator_user = User(email="validator@independent.org", password_hash=pass_hash, full_name="Col. R.K. Mehta (Independent Audit Lead)", role="Independent Validator", organization_id=validator_org.id)
    admin_user = User(email="admin@setustart.gov.in", password_hash=pass_hash, full_name="System Administrator (InnoBridge)", role="Administrator", organization_id=admin_org.id)
    
    db.add_all([gov_user, startup_user1, startup_user2, evaluator_user, validator_user, admin_user])
    db.commit()

    # 3. Create Department Profiles & Startup Profiles
    dept1 = GovernmentDepartment(organization_id=dept_org.id, department_name="Dept of Urban Sanitation & Smart Cities", ministry_or_state="Ministry of Housing & Urban Affairs", nodal_officer_name="Dr. Rajesh Sharma", contact_email="rajesh.sharma@gov.in")
    dept2 = GovernmentDepartment(organization_id=health_org.id, department_name="Dept of Rural Public Health", ministry_or_state="State Department of Health", nodal_officer_name="Dr. Priya Menon", contact_email="priya.menon@health.gov.in")
    db.add_all([dept1, dept2])
    db.commit()

    st1 = Startup(user_id=startup_user1.id, organization_id=startup_org1.id, startup_name="EcoClean Tech Solutions", description="AI-driven bin telemetry and dynamic route optimization for urban municipal solid waste.", industry="CleanTech", solution_category="Waste Management", technology="IoT, Computer Vision, Route AI", location="Bengaluru, KA", team_size=18, annual_turnover=4500000.0, years_in_operation=3, eligibility_status="Eligible", verification_status="Verified")
    st2 = Startup(user_id=startup_user2.id, organization_id=startup_org2.id, startup_name="AquaPure Dynamics", description="Real-time water quality telemetry sensors and automated chemical dosing for rural distribution tanks.", industry="WaterTech", solution_category="Water Management", technology="Edge Sensors, Cloud Analytics", location="Pune, MH", team_size=8, annual_turnover=800000.0, years_in_operation=1, eligibility_status="Waiver Required", verification_status="Verified")
    db.add_all([st1, st2])
    db.commit()

    # Solutions
    sol1 = StartupSolution(startup_id=st1.id, solution_name="BinSense AI Municipal Waste Platform", description="Solar-powered ultrasonic fill-level sensors coupled with real-time routing algorithms for garbage collection fleets.", problem_solved="Overflowing municipal bins, unoptimized truck routes, excessive fuel burn.", features="Ultrasonic level telemetry, fleet mobile app, driver navigation, central dashboard", deployment_readiness="Market Ready", past_experience="Deployed pilot with 150 bins in Zone 4.")
    sol2 = StartupSolution(startup_id=st2.id, solution_name="AquaShield IoT Chlorination Unit", description="Low-cost automated chlorine dosing and turbidity sensor for overhead water storage reservoirs.", problem_solved="Bacterial contamination in village drinking water supply.", features="Auto dosing, solar battery, cellular telemetry, SMS alerts", deployment_readiness="Pilot Ready", past_experience="Lab tested and validated in 3 village tanks.")
    db.add_all([sol1, sol2])
    db.commit()

    # 4. Create Templates & Demand Signals
    tpl1 = Template(template_type="Problem Statement", title="Municipal Waste Optimization Template", content="The department seeks an innovative IoT or AI solution to eliminate manual bin inspection and optimize collection routes...", version="1.0")
    tpl2 = Template(template_type="Pilot Agreement", title="Standard Innovation Sandbox Agreement", content="This Sandbox Pilot Agreement governs data boundaries, test environments, non-disclosure, and outcome-based payments...", version="1.0")
    tpl3 = Template(template_type="Data/IP Clause", title="Joint IP & Data Privacy Protocol", content="All raw citizen data remains the property of the department. Startup retains pre-existing core algorithms...", version="1.0")
    db.add_all([tpl1, tpl2, tpl3])

    ds1 = DemandSignal(category="Waste Management", sector="Urban Infrastructure", estimated_timeline="Q4 2026", description="Upcoming demand for automated bio-waste segregation technologies in Tier 2 cities.", department_name="Dept of Urban Sanitation", status="Pipeline")
    ds2 = DemandSignal(category="Public Health", sector="Healthcare", estimated_timeline="Q1 2027", description="Demand for portable AI-assisted ECG screening devices for rural primary health centers.", department_name="Dept of Rural Public Health", status="Upcoming")
    db.add_all([ds1, ds2])
    db.commit()

    # 5. Create Challenges
    ch1 = Challenge(
        title="Smart Bin Telemetry & Automated Route Optimization for Municipal Solid Waste",
        department_id=dept1.id,
        department_name="Dept of Urban Sanitation & Smart Cities",
        category="Waste Management",
        problem_statement="Municipal garbage bins frequently overflow in high-density wards before scheduled collection rounds, while trucks run fixed inefficient routes regardless of bin levels, leading to high fuel costs and citizen complaints.",
        current_process="Manual physical inspection by ward supervisors and static daily truck routes.",
        desired_outcome="Real-time fill-level monitoring for 500 commercial bins with dynamic route optimization for collection vehicles.",
        functional_requirements="Sensors must transmit data every 30 minutes; central dashboard must dynamically re-route drivers via mobile app.",
        technical_requirements="Solar-powered ultrasonic sensors, IP67 waterproof enclosure, 4G/NB-IoT communication, REST API integration.",
        eligibility_requirements="Startup must be recognized by government registry. Minimum 1 year in operation.",
        budget_range="₹25,000,000 - ₹50,000,000",
        timeline="6 Months Pilot",
        location="Zone 2 Ward 14 & 15",
        status="Published",
        created_by_user_id=gov_user.id
    )
    ch2 = Challenge(
        title="Automated Water Chlorination & Real-time Contamination Telemetry in Rural Reservoirs",
        department_id=dept2.id,
        department_name="Dept of Rural Public Health",
        category="Water Management",
        problem_statement="Rural overhead tanks experience inconsistent manual bleaching powder dosing, resulting in frequent water-borne pathogen spikes during monsoon months.",
        current_process="Weekly manual dosing by local pump operators without residual chlorine measurement.",
        desired_outcome="Automated solar-powered chlorine dosing triggered by online sensor readings across 25 rural tanks.",
        functional_requirements="Continuous measurement of residual chlorine and turbidity; automated pump trigger; low chemical alerts.",
        technical_requirements="Low power consumption (<10W), battery backup for 72 hrs, SMS telemetry alert for pump failure.",
        eligibility_requirements="Startup registered in WaterTech domain. Prior turnover > ₹2,500,000.",
        budget_range="₹10,000,000 - ₹20,000,000",
        timeline="4 Months Pilot",
        location="District Ward Rural Sector B",
        status="Published",
        created_by_user_id=gov_user.id
    )
    db.add_all([ch1, ch2])
    db.commit()

    # Challenge KPIs
    kpi1 = ChallengeKPI(challenge_id=ch1.id, name="Bin Overflow Reduction", description="Percentage reduction in reported bin overflow instances", target_value=40.0, unit="%")
    kpi2 = ChallengeKPI(challenge_id=ch1.id, name="Fuel Savings", description="Reduction in fuel consumption per ton of waste collected", target_value=25.0, unit="%")
    db.add_all([kpi1, kpi2])
    db.commit()

    # 6. Create Applications
    app1 = Application(
        challenge_id=ch1.id,
        startup_id=st1.id,
        solution_id=sol1.id,
        proposal_summary="EcoClean proposes installing 200 BinSense IoT ultrasonic sensors across Ward 14 & 15 with automated driver routing.",
        implementation_plan="Phase 1: Sensor deployment (W1-W3). Phase 2: Dashboard and routing integration (W4-W6). Phase 3: Pilot operation (W7-W16).",
        expected_impact="Targeting 45% reduction in bin overflow and 28% reduction in truck fuel consumption.",
        status="Shortlisted"
    )
    app2 = Application(
        challenge_id=ch2.id,
        startup_id=st2.id,
        solution_id=sol2.id,
        proposal_summary="AquaPure proposes installing 25 solar-powered automated chlorination dosing units across district reservoirs.",
        implementation_plan="Phase 1: Tank audit & unit installation (W1-W4). Phase 2: Calibration & telemetry setup (W5-W8).",
        expected_impact="100% compliant chlorination levels and zero pathogen outbreaks.",
        status="Applied"
    )
    db.add_all([app1, app2])
    db.commit()

    # Eligibility Waiver for App 2 (AquaPure turnover < requirement)
    waiver = EligibilityWaiver(
        application_id=app2.id,
        criteria_failed="Prior turnover requirement of ₹2.5M (Actual: ₹800k)",
        justification="AquaPure possesses proprietary patented low-cost dosing valve IP and holds a recommendation letter from National Water Institute.",
        status="Approved",
        reviewed_by=gov_user.full_name,
        review_comment="Approved under Innovation Waiver Rule 4.2 due to strong specialized IP.",
        reviewed_at=datetime.utcnow()
    )
    db.add(waiver)
    db.commit()

    # 7. Create Match Scores
    score1 = MatchScore(
        application_id=app1.id,
        eligibility_score=20.0,
        requirement_score=24.0,
        technical_score=19.0,
        impact_score=14.5,
        readiness_score=9.5,
        experience_score=8.0,
        total_score=95.0,
        breakdown_notes="High match across all functional & technical criteria. Market ready deployment status."
    )
    score2 = MatchScore(
        application_id=app2.id,
        eligibility_score=20.0, # Approved waiver restores eligibility score
        requirement_score=22.0,
        technical_score=18.0,
        impact_score=14.0,
        readiness_score=8.5,
        experience_score=6.0,
        total_score=88.5,
        breakdown_notes="Eligibility restored via approved IP waiver. Strong technical capability."
    )
    db.add_all([score1, score2])
    db.commit()

    # 8. Create Evaluations
    eval1 = Evaluation(
        application_id=app1.id,
        evaluator_id=evaluator_user.id,
        technical_score=19.0,
        impact_score=14.5,
        readiness_score=9.5,
        experience_score=8.0,
        comments="Excellent proposal with proven pilot sensor technology and robust route optimization.",
        recommendation="Recommend"
    )
    db.add(eval1)
    db.commit()

    # 9. Create Pilot Sandbox, Sandbox Constraints, Milestones, KPIs, Risks
    pilot1 = Pilot(
        pilot_name="Ward 14 & 15 Smart Waste Pilot Sandbox",
        challenge_id=ch1.id,
        startup_id=st1.id,
        department_id=dept1.id,
        start_date="2026-03-01",
        end_date="2026-08-31",
        status="Active",
        objectives="Validate 200 bin sensors, measure route optimization fuel savings, and ensure 99% telemetry uptime."
    )
    db.add(pilot1)
    db.commit()

    sandbox_con = SandboxConstraint(
        pilot_id=pilot1.id,
        data_boundary="Isolated municipal ward GIS data only. No citizen PII or financial records accessible.",
        compliance_notes="Must comply with Municipal Telemetry Security Guideline 2025.",
        permitted_environment="Sandboxed IoT Telemetry API Cluster",
        reviewed_by=admin_user.full_name
    )
    db.add(sandbox_con)

    ms1 = PilotMilestone(pilot_id=pilot1.id, name="Milestone 1: 200 Sensors Hardware Deployment", description="Complete physical mounting and NB-IoT activation of ultrasonic sensors in Ward 14 & 15.", due_date="2026-04-15", status="Completed", completion_percentage=100.0)
    ms2 = PilotMilestone(pilot_id=pilot1.id, name="Milestone 2: Driver Navigation App & Central Dashboard Integration", description="Integrate dynamic route generation with municipal truck driver tablets.", due_date="2026-06-30", status="In Progress", completion_percentage=65.0)
    ms3 = PilotMilestone(pilot_id=pilot1.id, name="Milestone 3: 90-Day Independent Performance Audit", description="Complete 90 days of continuous operation and submit evidence pack.", due_date="2026-08-15", status="Pending", completion_percentage=0.0)
    db.add_all([ms1, ms2, ms3])

    pkpi1 = PilotKPI(pilot_id=pilot1.id, name="Bin Overflow Rate", description="Reported overflows per week", target_value=5.0, current_value=3.0, unit="overflows/wk", status="Achieved")
    pkpi2 = PilotKPI(pilot_id=pilot1.id, name="Truck Route Distance Reduction", description="Average daily kilometers saved per vehicle", target_value=30.0, current_value=27.5, unit="km/day", status="On Track")
    db.add_all([pkpi1, pkpi2])

    risk1 = PilotRisk(pilot_id=pilot1.id, risk_title="Vandalism or theft of exterior bin sensors", description="Physical tampering with mounted ultrasonic sensors in public areas.", severity="Medium", probability="Medium", owner="Ward Sanitation Officer", mitigation="Mount sensors inside bin top lid with tamper-resistant steel casing.", status="Mitigated")
    risk2 = PilotRisk(pilot_id=pilot1.id, risk_title="Cellular signal dead zones in dense alleys", description="Intermittent 4G signal loss leading to delayed telemetry packets.", severity="Low", probability="High", owner="EcoClean Lead Hardware Engineer", mitigation="Implement local sensor flash memory to store and burst transmit up to 48h of offline data.", status="Mitigated")
    db.add_all([risk1, risk2])
    db.commit()

    # 10. Contracts & Payment Milestones with Payment SLA tracking
    contract1 = Contract(pilot_id=pilot1.id, startup_id=st1.id, department_id=dept1.id, contract_terms="Milestone-based pilot funding total ₹12,000,000 split across 3 tranches linked to verified evidence.", total_value=12000000.0, status="Active")
    db.add(contract1)
    db.commit()

    pm1 = PaymentMilestone(contract_id=contract1.id, milestone_id=ms1.id, title="Tranche 1: Sensor Hardware Deployment", amount=4000000.0, due_condition="Completion of 200 bin sensor installation and telemetry verification.", status="Paid", invoice_raised_at=datetime.utcnow() - timedelta(days=12), paid_at=datetime.utcnow() - timedelta(days=2), sla_days_overdue=0)
    pm2 = PaymentMilestone(contract_id=contract1.id, milestone_id=ms2.id, title="Tranche 2: Software Dashboard & App Rollout", amount=4000000.0, due_condition="Driver app integration and 30-day stable operation.", status="Invoiced", invoice_raised_at=datetime.utcnow() - timedelta(days=9), paid_at=None, sla_days_overdue=2) # Overdue SLA flag for admin!
    pm3 = PaymentMilestone(contract_id=contract1.id, milestone_id=ms3.id, title="Tranche 3: Final Independent Audit & Scale Sign-off", amount=4000000.0, due_condition="Independent validator report confirming KPI achievement.", status="Pending", sla_days_overdue=0)
    db.add_all([pm1, pm2, pm3])
    db.commit()

    # 11. IP & Cybersecurity Governance
    ip_clause = IPDataClause(pilot_id=pilot1.id, ownership_terms="EcoClean retains proprietary software IP. Municipal ward telemetry data remains exclusive property of the department.", data_handling_terms="Strict AES-256 encryption in transit and at rest. No third-party data sharing.", confidentiality_level="High", status="Signed")
    cyber = CybersecurityRequirement(challenge_id=ch1.id, requirement_text="ISO 27001 / CERT-In cloud vulnerability assessment compliance for central telemetry API.", compliance_status="Verified", verified_by="National Cyber Audit Bureau")
    db.add_all([ip_clause, cyber])
    db.commit()

    # 12. Evidence & Independent Validation (Strict Role Segregation)
    ev1 = Evidence(pilot_id=pilot1.id, title="Milestone 1 Hardware Telemetry Verification Log", description="Automated audit log showing 200/200 sensors online with 99.4% packet delivery rate.", evidence_type="Audit Report", submitted_by="EcoClean Engineering Team", validation_status="Validated")
    db.add(ev1)
    db.commit()

    ind_val = IndependentValidation(
        evidence_id=ev1.id,
        validator_id=validator_user.id, # Distinct validator user!
        pilot_id=pilot1.id,
        validation_result="Validated",
        detailed_report="Independent site inspection confirmed physical installation of 200 sensors in Ward 14 & 15. Telemetry data integrity verified against municipal database records."
    )
    db.add(ind_val)
    db.commit()

    # 13. Procurement Record, Approval Gates & Cross-Department Reuse Engine
    proc1 = ProcurementRecord(
        pilot_id=pilot1.id,
        startup_id=st1.id,
        evidence_score=100.0,
        kpi_achievement=75.8,
        evaluator_recommendation="Recommend",
        independent_validation_result="Validated",
        procurement_status="Recommended",
        approval_status="Gate 1 Approved",
        decision_reason="Pilot achieved 42% overflow reduction and 27.5 km/day fuel savings. Independent validation complete."
    )
    db.add(proc1)
    db.commit()

    gate1 = ApprovalGate(entity_type="Procurement", entity_id=proc1.id, gate_name="Gate 1: Department Nodal Sign-off", status="Approved", approved_by=gov_user.full_name, comment="Approved based on strong independent audit results.", acted_at=datetime.utcnow() - timedelta(days=1))
    gate2 = ApprovalGate(entity_type="Procurement", entity_id=proc1.id, gate_name="Gate 2: Finance & Compliance Sign-off", status="Pending")
    db.add_all([gate1, gate2])
    db.commit()

    reuse_rec = ReuseRecommendation(
        procurement_id=proc1.id,
        target_department_id=dept2.id,
        target_challenge_id=ch2.id,
        similarity_score=65.0,
        rationale="Proven IoT telemetry platform with remote sensor monitoring architecture — applicable to rural water tank telemetry.",
        status="Suggested"
    )
    db.add(reuse_rec)

    # 14. Notifications & Audit Logs
    notif1 = Notification(user_id=gov_user.id, title="Independent Validation Complete", message="Independent validator Col. R.K. Mehta has validated evidence for Ward 14 & 15 Smart Waste Pilot.", notification_type="Success")
    notif2 = Notification(user_id=admin_user.id, title="Payment SLA Alert", message="Tranche 2 invoice for EcoClean Tech Solutions is 2 days overdue SLA (7 days limit).", notification_type="Alert")
    db.add_all([notif1, notif2])

    log1 = AuditLog(user_id=gov_user.id, user_role="Government Department", action="CHALLENGE_PUBLISHED", entity_type="Challenge", entity_id=ch1.id, details="Published Smart Bin Telemetry Challenge for Ward 14 & 15")
    log2 = AuditLog(user_id=validator_user.id, user_role="Independent Validator", action="INDEPENDENT_VALIDATION_SUBMITTED", entity_type="IndependentValidation", entity_id=ind_val.id, details="Validated hardware evidence for Pilot 1 without evaluator conflict")
    db.add_all([log1, log2])
    db.commit()

    print("SetuStart demo database successfully seeded!")
