/**
 * SkillLens AI - 20+ Curated Job Roles aligned with SDG 8 (Decent Work & Economic Growth)
 * Covering IT, Data/AI, Healthcare Support, Logistics, and Skilled Trades
 */
import { JobRole } from '@/packages/shared/src/types';

export const CURATED_JOB_ROLES: JobRole[] = [
  // 1. Data & AI
  {
    id: 'job-ml-eng',
    title: 'Junior Machine Learning Engineer',
    category: 'Data & AI',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.5: Decent productive employment for youth & women',
    description: 'Build, evaluate, and deploy production predictive machine learning pipelines and microservices.',
    requiredSkills: [
      { escoSkillId: 'esco-py-005', preferredLabel: 'Python Programming', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-ml-001', preferredLabel: 'Machine Learning', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-sql-007', preferredLabel: 'SQL & Database Management', weight: 2, isNiceToHave: false },
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 2, isNiceToHave: false },
      { escoSkillId: 'esco-docker-009', preferredLabel: 'Docker Containerization', weight: 1, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-dl-002', preferredLabel: 'Deep Learning', weight: 1, isNiceToHave: true },
      { escoSkillId: 'esco-k8s-008', preferredLabel: 'Kubernetes Orchestration', weight: 1, isNiceToHave: true },
    ],
  },
  {
    id: 'job-data-analyst',
    title: 'Associate Data Analyst',
    category: 'Data & AI',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.6: Substantially reduce youth not in employment or training',
    description: 'Extract raw operational logs, compute descriptive metrics, and build business intelligence dashboards.',
    requiredSkills: [
      { escoSkillId: 'esco-sql-007', preferredLabel: 'SQL & Database Management', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-da-006', preferredLabel: 'Data Analysis', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-py-005', preferredLabel: 'Python Programming', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 1, isNiceToHave: true },
      { escoSkillId: 'esco-ml-001', preferredLabel: 'Machine Learning', weight: 1, isNiceToHave: true },
    ],
  },
  {
    id: 'job-nlp-spec',
    title: 'Applied NLP Specialist',
    category: 'Data & AI',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.2: Economic productivity through technological diversification',
    description: 'Construct document summarization, entity extraction, and sentiment classification systems.',
    requiredSkills: [
      { escoSkillId: 'esco-py-005', preferredLabel: 'Python Programming', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-nlp-003', preferredLabel: 'Natural Language Processing', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-ml-001', preferredLabel: 'Machine Learning', weight: 2, isNiceToHave: false },
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-dl-002', preferredLabel: 'Deep Learning', weight: 1, isNiceToHave: true },
    ],
  },
  {
    id: 'job-cv-eng',
    title: 'Computer Vision & OCR Developer',
    category: 'Data & AI',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.2: Upgrade technological capabilities of industrial sectors',
    description: 'Engineer image enhancement, document rectification, and optical character recognition pipelines.',
    requiredSkills: [
      { escoSkillId: 'esco-cv-004', preferredLabel: 'Computer Vision', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-py-005', preferredLabel: 'Python Programming', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-dl-002', preferredLabel: 'Deep Learning', weight: 1, isNiceToHave: true },
      { escoSkillId: 'esco-docker-009', preferredLabel: 'Docker Containerization', weight: 1, isNiceToHave: true },
    ],
  },

  // 2. Software Engineering & Cloud
  {
    id: 'job-frontend-dev',
    title: 'Frontend Web Developer',
    category: 'Software Engineering',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.5: Full and productive employment for first-generation graduates',
    description: 'Create responsive, high-accessibility web frontends with clean state management.',
    requiredSkills: [
      { escoSkillId: 'esco-react-010', preferredLabel: 'React Frontend Development', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-ts-011', preferredLabel: 'TypeScript Programming', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-docker-009', preferredLabel: 'Docker Containerization', weight: 1, isNiceToHave: true },
    ],
  },
  {
    id: 'job-backend-eng',
    title: 'Python Backend Engineer',
    category: 'Software Engineering',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.5: Productive employment in high-value digital industries',
    description: 'Architect scalable async REST APIs, manage database connections, and enforce authentication security.',
    requiredSkills: [
      { escoSkillId: 'esco-py-005', preferredLabel: 'Python Programming', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-api-012', preferredLabel: 'FastAPI Backend Engineering', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-sql-007', preferredLabel: 'SQL & Database Management', weight: 2, isNiceToHave: false },
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-docker-009', preferredLabel: 'Docker Containerization', weight: 1, isNiceToHave: true },
    ],
  },
  {
    id: 'job-devops-eng',
    title: 'Cloud DevOps Associate',
    category: 'Cloud & DevOps',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.2: Technological diversification and infrastructure resilience',
    description: 'Deploy resilient containerized workloads, configure ingress controllers, and automate CI/CD.',
    requiredSkills: [
      { escoSkillId: 'esco-docker-009', preferredLabel: 'Docker Containerization', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-k8s-008', preferredLabel: 'Kubernetes Orchestration', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-git-013', preferredLabel: 'Git Version Control', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-py-005', preferredLabel: 'Python Programming', weight: 1, isNiceToHave: true },
    ],
  },

  // 3. Healthcare Support
  {
    id: 'job-care-asst',
    title: 'Certified Patient Care Assistant',
    category: 'Healthcare Support',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.5: Equal pay for work of equal value and dignified healthcare employment',
    description: 'Deliver vital sign measurements, bedside assistance, and routine patient comfort protocols.',
    requiredSkills: [
      { escoSkillId: 'esco-hc-014', preferredLabel: 'Patient Care Assistance', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-hc-015', preferredLabel: 'Medical Record Documentation', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [],
  },
  {
    id: 'job-health-records',
    title: 'Health Informatics Technician',
    category: 'Healthcare Support',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.6: Technical skills acquisition for non-metropolitan health workers',
    description: 'Audit patient EHR charts, verify diagnostic coding consistency, and uphold confidentiality mandates.',
    requiredSkills: [
      { escoSkillId: 'esco-hc-015', preferredLabel: 'Medical Record Documentation', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-sql-007', preferredLabel: 'SQL & Database Management', weight: 2, isNiceToHave: false },
      { escoSkillId: 'esco-da-006', preferredLabel: 'Data Analysis', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [],
  },

  // 4. Logistics & Supply Chain
  {
    id: 'job-warehouse-sup',
    title: 'Warehouse Logistics Supervisor',
    category: 'Logistics & Supply Chain',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.8: Promote safe and secure working environments for all workers',
    description: 'Direct distribution floor workflows, resolve stock discrepancies, and coordinate dock departures.',
    requiredSkills: [
      { escoSkillId: 'esco-log-016', preferredLabel: 'Warehouse Inventory Management', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-log-017', preferredLabel: 'Supply Chain Logistics Coordination', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-da-006', preferredLabel: 'Data Analysis', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [],
  },
  {
    id: 'job-freight-coord',
    title: 'Intermodal Freight Coordinator',
    category: 'Logistics & Supply Chain',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.2: Upgrade logistics efficiency through digital coordination',
    description: 'Track carrier freight handoffs, schedule cross-dock transfers, and verify manifest records.',
    requiredSkills: [
      { escoSkillId: 'esco-log-017', preferredLabel: 'Supply Chain Logistics Coordination', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-log-016', preferredLabel: 'Warehouse Inventory Management', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [],
  },

  // 5. Skilled Vocational Trades
  {
    id: 'job-elec-tech',
    title: 'Journeyman Electrical Technician',
    category: 'Skilled Trades',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.5: Decent productive vocational jobs for skilled trade workers',
    description: 'Install building power circuits, read schematic diagrams, and inspect commercial grounding systems.',
    requiredSkills: [
      { escoSkillId: 'esco-trd-018', preferredLabel: 'Electrical Wiring & Circuit Safety', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-trd-020', preferredLabel: 'Industrial Equipment Maintenance', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [
      { escoSkillId: 'esco-trd-019', preferredLabel: 'HVAC Diagnostics & Climate Systems', weight: 1, isNiceToHave: true },
    ],
  },
  {
    id: 'job-hvac-tech',
    title: 'Commercial HVAC Field Specialist',
    category: 'Skilled Trades',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.4: Resource efficiency in sustainable facilities maintenance',
    description: 'Service rooftop climate units, diagnose variable refrigerant volume, and calibrate thermostats.',
    requiredSkills: [
      { escoSkillId: 'esco-trd-019', preferredLabel: 'HVAC Diagnostics & Climate Systems', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-trd-018', preferredLabel: 'Electrical Wiring & Circuit Safety', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [],
  },
  {
    id: 'job-plant-maint',
    title: 'Industrial Facilities Overhaul Technician',
    category: 'Skilled Trades',
    sdgGoal: 'SDG 8',
    sdgTarget: 'Target 8.8: Occupational safety and preventive equipment maintenance',
    description: 'Execute preventive maintenance schedules on mechanical pumps, hydraulic lines, and motor bearings.',
    requiredSkills: [
      { escoSkillId: 'esco-trd-020', preferredLabel: 'Industrial Equipment Maintenance', weight: 3, isNiceToHave: false },
      { escoSkillId: 'esco-trd-018', preferredLabel: 'Electrical Wiring & Circuit Safety', weight: 2, isNiceToHave: false },
    ],
    niceToHaveSkills: [],
  },
];

export const JOB_CATEGORIES = [
  'All Sectors',
  'Data & AI',
  'Software Engineering',
  'Cloud & DevOps',
  'Healthcare Support',
  'Logistics & Supply Chain',
  'Skilled Trades',
] as const;
