export type UserRole = 'Government Department' | 'Startup' | 'Evaluator' | 'Independent Validator' | 'Administrator';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id?: number;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  department_id: number;
  department_name: string;
  category: string;
  problem_statement: string;
  current_process: string;
  desired_outcome: string;
  functional_requirements: string;
  technical_requirements: string;
  eligibility_requirements: string;
  budget_range: string;
  timeline: string;
  location: string;
  status: 'Draft' | 'Published' | 'Under Evaluation' | 'Pilot' | 'Completed' | 'Closed';
  created_by_user_id: number;
  created_at: string;
}

export interface Template {
  id: number;
  template_type: string;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
}

export interface DemandSignal {
  id: number;
  category: string;
  sector: string;
  estimated_timeline: string;
  description: string;
  department_name: string;
  status: string;
  created_at: string;
}

export interface Startup {
  id: number;
  user_id: number;
  startup_name: string;
  description: string;
  industry: string;
  solution_category: string;
  technology: string;
  location: string;
  team_size: number;
  annual_turnover: number;
  years_in_operation: number;
  eligibility_status: string;
  verification_status: string;
}

export interface StartupSolution {
  id: number;
  startup_id: number;
  solution_name: string;
  description: string;
  problem_solved: string;
  features: string;
  implementation_requirements?: string;
  deployment_readiness: string;
  past_experience?: string;
}

export interface Application {
  id: number;
  challenge_id: number;
  startup_id: number;
  solution_id: number;
  proposal_summary: string;
  implementation_plan: string;
  expected_impact: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Selected';
  applied_at: string;
}

export interface EligibilityWaiver {
  id: number;
  application_id: number;
  criteria_failed: string;
  justification: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  reviewed_by?: string;
  review_comment?: string;
  requested_at: string;
  reviewed_at?: string;
}

export interface MatchScore {
  application_id: number;
  eligibility_score: number;
  requirement_score: number;
  technical_score: number;
  impact_score: number;
  readiness_score: number;
  experience_score: number;
  total_score: number;
  breakdown_notes?: string;
}

export interface Evaluation {
  id: number;
  application_id: number;
  evaluator_id: number;
  technical_score: number;
  impact_score: number;
  readiness_score: number;
  experience_score: number;
  comments: string;
  recommendation: 'Recommend' | 'Needs Review' | 'Do Not Recommend';
  submitted_at: string;
}

export interface SandboxConstraint {
  id: number;
  pilot_id: number;
  data_boundary: string;
  compliance_notes: string;
  permitted_environment: string;
  reviewed_by: string;
}

export interface PilotMilestone {
  id: number;
  pilot_id: number;
  name: string;
  description: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  completion_percentage: number;
}

export interface PilotKPI {
  id: number;
  pilot_id: number;
  name: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: 'On Track' | 'At Risk' | 'Achieved' | 'Exceeded';
}

export interface PilotRisk {
  id: number;
  pilot_id: number;
  risk_title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: 'Low' | 'Medium' | 'High';
  owner: string;
  mitigation: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface Pilot {
  id: number;
  pilot_name: string;
  challenge_id: number;
  challenge_title: string;
  startup_id: number;
  startup_name: string;
  department_id: number;
  start_date: string;
  end_date: string;
  status: 'Not Started' | 'Active' | 'Paused' | 'Completed' | 'Cancelled';
  objectives: string;
  sandbox_constraint?: SandboxConstraint;
  milestones_count?: number;
  kpis_count?: number;
  risks_count?: number;
}

export interface Evidence {
  id: number;
  pilot_id: number;
  title: string;
  description: string;
  evidence_type: string;
  submitted_by: string;
  submitted_at: string;
  validation_status: 'Validated' | 'Partially Validated' | 'Not Validated';
}

export interface IndependentValidation {
  id: number;
  evidence_id: number;
  validator_id: number;
  pilot_id: number;
  validation_result: 'Validated' | 'Partially Validated' | 'Rejected';
  detailed_report: string;
  validated_at: string;
}

export interface Contract {
  id: number;
  pilot_id: number;
  startup_id: number;
  department_id: number;
  contract_terms: string;
  total_value: number;
  status: string;
  created_at: string;
}

export interface PaymentMilestone {
  id: number;
  contract_id: number;
  milestone_id?: number;
  title: string;
  amount: number;
  due_condition: string;
  status: 'Pending' | 'Invoiced' | 'Approved' | 'Paid' | 'Disputed';
  invoice_raised_at?: string;
  paid_at?: string;
  sla_days_overdue: number;
}

export interface ProcurementRecord {
  id: number;
  pilot_id: number;
  pilot_name: string;
  startup_id: number;
  startup_name: string;
  evidence_score: number;
  kpi_achievement: number;
  evaluator_recommendation: string;
  independent_validation_result: string;
  procurement_status: string;
  approval_status: string;
  decision_reason?: string;
  created_at: string;
}

export interface ReuseRecommendation {
  id: number;
  procurement_id: number;
  target_department_id: number;
  target_department_name: string;
  target_challenge_id?: number;
  target_challenge_title?: string;
  similarity_score: number;
  rationale: string;
  status: string;
}

export interface AISuggestionLog {
  id: number;
  user_id: number;
  challenge_id?: number;
  prompt_text: string;
  response_json: any;
  human_action: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_role?: string;
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: 'Info' | 'Warning' | 'Alert' | 'Success';
  is_read: boolean;
  created_at: string;
}

export interface PublicStats {
  platform_name: string;
  governed_by: string;
  metrics: {
    total_challenges_published: number;
    active_innovation_pilots: number;
    completed_pilots: number;
    procured_and_scaled_solutions: number;
    registered_eligible_startups: number;
    total_milestone_funds_disbursed_inr: number;
    average_time_to_pilot_days: number;
  };
  sector_breakdown: Array<{ name: string; challenges: number; pilots: number }>;
  governance_guarantees: string[];
}
