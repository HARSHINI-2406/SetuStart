import axios from 'axios';
import { 
  User, Challenge, Template, DemandSignal, Startup, StartupSolution, 
  Application, EligibilityWaiver, MatchScore, Evaluation, Pilot, SandboxConstraint,
  PilotMilestone, PilotKPI, PilotRisk, Evidence, IndependentValidation, Contract,
  PaymentMilestone, ProcurementRecord, ReuseRecommendation, AISuggestionLog,
  AuditLog, Notification, PublicStats
} from '../types';

const API_BASE_URL = 'https://setustart-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('setustart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth API
export const authApi = {
  login: async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/users/me');
    return res.data;
  }
};

// Public Portal API
export const publicApi = {
  getStats: async (): Promise<PublicStats> => {
    const res = await api.get('/public/stats');
    return res.data;
  }
};

// Challenges API
export const challengesApi = {
  getAll: async (category?: string, status?: string): Promise<Challenge[]> => {
    const res = await api.get('/challenges/', { params: { category, status } });
    return res.data;
  },
  getById: async (id: number): Promise<Challenge> => {
    const res = await api.get(`/challenges/${id}`);
    return res.data;
  },
  create: async (data: any): Promise<Challenge> => {
    const res = await api.post('/challenges/', data);
    return res.data;
  },
  updateStatus: async (id: number, statusStr: string) => {
    const res = await api.put(`/challenges/${id}/status?status_str=${encodeURIComponent(statusStr)}`);
    return res.data;
  }
};

// Templates & Demand Radar API
export const templatesApi = {
  getAll: async (): Promise<Template[]> => {
    const res = await api.get('/templates');
    return res.data;
  }
};

export const startupsApi = {
  getAll: async (): Promise<Startup[]> => {
    const res = await api.get('/startups');
    return res.data;
  },
  getMyProfile: async (): Promise<Startup> => {
    const res = await api.get('/startups/my-profile');
    return res.data;
  },
  saveMyProfile: async (data: any): Promise<Startup> => {
    const res = await api.post('/startups/my-profile', data);
    return res.data;
  },
  getSolutions: async (): Promise<StartupSolution[]> => {
    const res = await api.get('/startups/solutions');
    return res.data;
  },
  createSolution: async (data: any): Promise<StartupSolution> => {
    const res = await api.post('/startups/solutions', data);
    return res.data;
  },
  getDemandRadar: async (): Promise<DemandSignal[]> => {
    const res = await api.get('/startups/demand-radar');
    return res.data;
  },
  getTrackRecord: async (startupId: number) => {
    const res = await api.get(`/startups/${startupId}/track-record`);
    return res.data;
  }
};

// Applications & Waivers API
export const applicationsApi = {
  getAll: async (challengeId?: number): Promise<Application[]> => {
    const res = await api.get('/applications/', { params: { challenge_id: challengeId } });
    return res.data;
  },
  submit: async (data: any): Promise<Application> => {
    const res = await api.post('/applications/', data);
    return res.data;
  }
};

export const waiversApi = {
  getAll: async (): Promise<EligibilityWaiver[]> => {
    const res = await api.get('/waivers');
    return res.data;
  },
  request: async (data: any): Promise<EligibilityWaiver> => {
    const res = await api.post('/waivers', data);
    return res.data;
  },
  review: async (id: number, status: string, review_comment: string) => {
    const res = await api.put(`/waivers/${id}/review`, { status, review_comment });
    return res.data;
  }
};

// Matching & Evaluations API
export const matchingApi = {
  getRecommendedOpportunities: async () => {
    const res = await api.get('/matching/startup-recommendations');
    return res.data;
  },
  getMatchedStartups: async (challengeId: number) => {
    const res = await api.get(`/matching/matched-startups/${challengeId}`);
    return res.data;
  }
};

export const evaluationsApi = {
  getAll: async (applicationId?: number): Promise<Evaluation[]> => {
    const res = await api.get('/evaluations', { params: { application_id: applicationId } });
    return res.data;
  },
  submit: async (data: any): Promise<Evaluation> => {
    const res = await api.post('/evaluations', data);
    return res.data;
  }
};

// Pilot Sandbox & Risk Heatmap API
export const pilotsApi = {
  getAll: async (): Promise<Pilot[]> => {
    const res = await api.get('/pilots');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get(`/pilots/${id}`);
    return res.data;
  },
  create: async (data: any): Promise<Pilot> => {
    const res = await api.post('/pilots', data);
    return res.data;
  },
  addMilestone: async (pilotId: number, data: any) => {
    const res = await api.post(`/pilots/${pilotId}/milestones`, data);
    return res.data;
  },
  updateMilestoneStatus: async (milestoneId: number, statusStr: string, completionPct: number) => {
    const res = await api.put(`/pilots/milestones/${milestoneId}/status?status_str=${encodeURIComponent(statusStr)}&completion_pct=${completionPct}`);
    return res.data;
  },
  addKpi: async (pilotId: number, data: any) => {
    const res = await api.post(`/pilots/${pilotId}/kpis`, data);
    return res.data;
  },
  addRisk: async (pilotId: number, data: any) => {
    const res = await api.post(`/pilots/${pilotId}/risks`, data);
    return res.data;
  },
  getRiskHeatmap: async () => {
    const res = await api.get('/pilots/risk-heatmap/aggregate');
    return res.data;
  }
};

// Evidence & Independent Validation API
export const evidenceApi = {
  getAll: async (pilotId?: number): Promise<Evidence[]> => {
    const res = await api.get('/evidence', { params: { pilot_id: pilotId } });
    return res.data;
  },
  submit: async (data: any): Promise<Evidence> => {
    const res = await api.post('/evidence', data);
    return res.data;
  }
};

export const validationApi = {
  getAll: async (pilotId?: number): Promise<IndependentValidation[]> => {
    const res = await api.get('/validations', { params: { pilot_id: pilotId } });
    return res.data;
  },
  submit: async (data: any): Promise<IndependentValidation> => {
    const res = await api.post('/validations', data);
    return res.data;
  }
};

// Contracts & Payments API
export const paymentsApi = {
  getAll: async (contractId?: number): Promise<PaymentMilestone[]> => {
    const res = await api.get('/payments', { params: { contract_id: contractId } });
    return res.data;
  },
  raiseInvoice: async (paymentId: number) => {
    const res = await api.put(`/payments/${paymentId}/raise-invoice`);
    return res.data;
  },
  approveAndPay: async (paymentId: number) => {
    const res = await api.put(`/payments/${paymentId}/approve-and-pay`);
    return res.data;
  }
};

export const contractsApi = {
  getAll: async (): Promise<Contract[]> => {
    const res = await api.get('/contracts');
    return res.data;
  },
  create: async (data: any): Promise<Contract> => {
    const res = await api.post('/contracts', data);
    return res.data;
  }
};

// Procurement, Approval Gates & Reuse API
export const procurementApi = {
  getAll: async (): Promise<ProcurementRecord[]> => {
    const res = await api.get('/procurement');
    return res.data;
  },
  createRecommendation: async (data: any): Promise<ProcurementRecord> => {
    const res = await api.post('/procurement', data);
    return res.data;
  },
  getApprovalGates: async () => {
    const res = await api.get('/procurement/approval-gates');
    return res.data;
  },
  actionApprovalGate: async (gateId: number, status: string, comment: string) => {
    const res = await api.put(`/procurement/approval-gates/${gateId}`, { gate_id: gateId, status, comment });
    return res.data;
  }
};

export const reuseApi = {
  getAll: async (): Promise<ReuseRecommendation[]> => {
    const res = await api.get('/reuse-recommendations');
    return res.data;
  },
  action: async (id: number, actionStatus: string) => {
    const res = await api.put(`/reuse-recommendations/${id}/action?action_status=${encodeURIComponent(actionStatus)}`);
    return res.data;
  }
};

// Audit, Notifications & AI API
export const auditApi = {
  getLogs: async (): Promise<AuditLog[]> => {
    const res = await api.get('/audit-logs/');
    return res.data;
  }
};

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markRead: async (id: number) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  }
};

export const aiApi = {
  analyzeChallenge: async (data: any) => {
    const res = await api.post('/ai/analyze-challenge', data);
    return res.data;
  },
  getLogs: async (): Promise<AISuggestionLog[]> => {
    const res = await api.get('/ai/logs');
    return res.data;
  }
};