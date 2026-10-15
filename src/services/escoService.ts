/**
 * SkillLens AI - ESCO Skills Dataset & Synonym Normalization Service
 * Mapped to ESCO v1.1.1 Taxonomy across IT, Data, Healthcare, Logistics, and Trades
 */
import { ESCOSkill } from '@/packages/shared/src/types';

export const ESCO_SKILLS_DATABASE: ESCOSkill[] = [
  // Data & Machine Learning
  {
    id: 'esco-ml-001',
    uri: 'http://data.europa.eu/esco/skill/002',
    preferredLabel: 'Machine Learning',
    altLabels: ['ML', 'machine-learning', 'statistical learning', 'ml models', 'predictive modeling'],
    category: 'Data & AI',
    description: 'Build predictive models and algorithms that learn patterns from training datasets.',
  },
  {
    id: 'esco-dl-002',
    uri: 'http://data.europa.eu/esco/skill/003',
    preferredLabel: 'Deep Learning',
    altLabels: ['deep neural networks', 'neural networks', 'DL', 'pytorch', 'tensorflow', 'keras'],
    category: 'Data & AI',
    description: 'Design and train multi-layer artificial neural networks for complex classification and regression.',
  },
  {
    id: 'esco-nlp-003',
    uri: 'http://data.europa.eu/esco/skill/004',
    preferredLabel: 'Natural Language Processing',
    altLabels: ['NLP', 'text mining', 'computational linguistics', 'transformers', 'bert', 'llm', 'tokenization'],
    category: 'Data & AI',
    description: 'Extract insights, parse syntax, and execute semantic analysis on unstructured human language.',
  },
  {
    id: 'esco-cv-004',
    uri: 'http://data.europa.eu/esco/skill/005',
    preferredLabel: 'Computer Vision',
    altLabels: ['CV', 'image processing', 'visual recognition', 'opencv', 'object detection', 'segmentation'],
    category: 'Data & AI',
    description: 'Apply computational algorithms and convolutional models to parse and recognize patterns in imagery.',
  },
  {
    id: 'esco-py-005',
    uri: 'http://data.europa.eu/esco/skill/001',
    preferredLabel: 'Python Programming',
    altLabels: ['python', 'python3', 'py', 'python scripting', 'pandas', 'numpy'],
    category: 'Software Engineering',
    description: 'Construct, test, and optimize production applications and automation scripts using Python.',
  },
  {
    id: 'esco-da-006',
    uri: 'http://data.europa.eu/esco/skill/019',
    preferredLabel: 'Data Analysis',
    altLabels: ['data analytics', 'EDA', 'exploratory data analysis', 'data visualization', 'tableau', 'powerbi'],
    category: 'Data & AI',
    description: 'Synthesize quantitative metrics, explore variance, and deliver actionable visual dashboards.',
  },
  {
    id: 'esco-sql-007',
    uri: 'http://data.europa.eu/esco/skill/008',
    preferredLabel: 'SQL & Database Management',
    altLabels: ['sql', 'relational database', 'postgresql', 'mysql', 'database queries', 'sqlite'],
    category: 'Data & AI',
    description: 'Query, design schemas, and index high-volume relational database systems.',
  },

  // Software & Cloud Infrastructure
  {
    id: 'esco-k8s-008',
    uri: 'http://data.europa.eu/esco/skill/006',
    preferredLabel: 'Kubernetes Orchestration',
    altLabels: ['k8s', 'kubernetes', 'container orchestration', 'helm', 'cluster management'],
    category: 'Cloud & DevOps',
    description: 'Automate deployment, auto-scaling, and lifecycle operations of containerized cloud workloads.',
  },
  {
    id: 'esco-docker-009',
    uri: 'http://data.europa.eu/esco/skill/007',
    preferredLabel: 'Docker Containerization',
    altLabels: ['docker', 'containers', 'docker compose', 'dockerfile', 'container image'],
    category: 'Cloud & DevOps',
    description: 'Package microservices, runtime binaries, and environment dependencies inside isolated containers.',
  },
  {
    id: 'esco-react-010',
    uri: 'http://data.europa.eu/esco/skill/009',
    preferredLabel: 'React Frontend Development',
    altLabels: ['react', 'reactjs', 'react.js', 'react native', 'front-end', 'ui engineering'],
    category: 'Software Engineering',
    description: 'Develop responsive, accessible single-page web applications utilizing component hierarchies.',
  },
  {
    id: 'esco-ts-011',
    uri: 'http://data.europa.eu/esco/skill/010',
    preferredLabel: 'TypeScript Programming',
    altLabels: ['typescript', 'ts', 'typed javascript', 'strict typing'],
    category: 'Software Engineering',
    description: 'Engineer maintainable full-stack software with strict static typing and interface verification.',
  },
  {
    id: 'esco-api-012',
    uri: 'http://data.europa.eu/esco/skill/011',
    preferredLabel: 'FastAPI Backend Engineering',
    altLabels: ['fastapi', 'rest api', 'backend api', 'async python', 'uvicorn', 'pydantic'],
    category: 'Software Engineering',
    description: 'Build asynchronous, high-throughput RESTful endpoints using modern ASGI Python architectures.',
  },
  {
    id: 'esco-git-013',
    uri: 'http://data.europa.eu/esco/skill/012',
    preferredLabel: 'Git Version Control',
    altLabels: ['git', 'version control', 'github', 'gitlab', 'git branch', 'pull request'],
    category: 'Software Engineering',
    description: 'Manage collaborative code repositories, branching hierarchies, and audit change histories.',
  },

  // Healthcare Support (SDG 8 & 3 Alignment)
  {
    id: 'esco-hc-014',
    uri: 'http://data.europa.eu/esco/skill/013',
    preferredLabel: 'Patient Care Assistance',
    altLabels: ['nursing assistance', 'vital signs', 'patient support', 'bedside care', 'cna', 'patient triage'],
    category: 'Healthcare Support',
    description: 'Measure vital physiological indicators and deliver compassionate bedside support under nurse supervision.',
  },
  {
    id: 'esco-hc-015',
    uri: 'http://data.europa.eu/esco/skill/014',
    preferredLabel: 'Medical Record Documentation',
    altLabels: ['electronic health records', 'EHR', 'medical charting', 'patient privacy', 'HIPAA compliance'],
    category: 'Healthcare Support',
    description: 'Maintain confidential, legally compliant electronic clinical logs and patient histories.',
  },

  // Logistics & Supply Chain (SDG 8 & 9)
  {
    id: 'esco-log-016',
    uri: 'http://data.europa.eu/esco/skill/015',
    preferredLabel: 'Warehouse Inventory Management',
    altLabels: ['inventory control', 'stock management', 'cycle counting', 'warehouse audit', 'wms'],
    category: 'Logistics & Supply Chain',
    description: 'Supervise storage facilities, track stock discrepancies, and schedule timely replenishment.',
  },
  {
    id: 'esco-log-017',
    uri: 'http://data.europa.eu/esco/skill/016',
    preferredLabel: 'Supply Chain Logistics Coordination',
    altLabels: ['freight dispatch', 'shipping logistics', 'carrier scheduling', 'procurement routing'],
    category: 'Logistics & Supply Chain',
    description: 'Coordinate multi-stage freight conveyance, driver route optimization, and timely distribution.',
  },

  // Vocational & Skilled Trades (SDG 8)
  {
    id: 'esco-trd-018',
    uri: 'http://data.europa.eu/esco/skill/017',
    preferredLabel: 'Electrical Wiring & Circuit Safety',
    altLabels: ['electrical maintenance', 'circuit diagnostics', 'conduit bending', 'NEC compliance', 'low voltage'],
    category: 'Skilled Trades',
    description: 'Install, troubleshoot, and maintain building wiring and distribution circuits adhering to national codes.',
  },
  {
    id: 'esco-trd-019',
    uri: 'http://data.europa.eu/esco/skill/018',
    preferredLabel: 'HVAC Diagnostics & Climate Systems',
    altLabels: ['hvac', 'refrigeration', 'heating ventilation', 'furnace repair', 'epa 608 certified'],
    category: 'Skilled Trades',
    description: 'Diagnose compressors, refrigerant pressure balances, and air filtration systems for facilities.',
  },
  {
    id: 'esco-trd-020',
    uri: 'http://data.europa.eu/esco/skill/021',
    preferredLabel: 'Industrial Equipment Maintenance',
    altLabels: ['preventive maintenance', 'machinery servicing', 'hydraulic systems', 'pneumatics repair'],
    category: 'Skilled Trades',
    description: 'Perform routine mechanical overhaul and diagnostic calibration on manufacturing plant machinery.',
  },
];

/**
 * Normalized Alias Lookup Index
 * Maps lowercase stripped terms, acronyms, and aliases to canonical ESCO skills
 */
const aliasMap = new Map<string, ESCOSkill>();

ESCO_SKILLS_DATABASE.forEach((skill) => {
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  aliasMap.set(normalize(skill.preferredLabel), skill);
  skill.altLabels.forEach((alias: string) => {
    aliasMap.set(normalize(alias), skill);
  });
});

export function normalizeSkillText(query: string): {
  matchedSkill?: ESCOSkill;
  matchType: 'exact' | 'semantic' | 'none';
  similarity: number;
} {
  const clean = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (aliasMap.has(clean)) {
    return {
      matchedSkill: aliasMap.get(clean),
      matchType: 'exact',
      similarity: 1.0,
    };
  }

  // Substring check for compound terms
  for (const [key, skill] of aliasMap.entries()) {
    if (key.length > 2 && (clean.includes(key) || key.includes(clean))) {
      return {
        matchedSkill: skill,
        matchType: 'semantic',
        similarity: 0.88,
      };
    }
  }

  return {
    matchedSkill: undefined,
    matchType: 'none',
    similarity: 0.0,
  };
}

/**
 * Related / Transferable Skills Graph (via ESCO Relations)
 */
export const ESCO_TRANSFERABLE_RELATIONS: Record<string, string[]> = {
  'esco-ml-001': ['esco-py-005', 'esco-da-006', 'esco-sql-007'],
  'esco-dl-002': ['esco-ml-001', 'esco-cv-004', 'esco-nlp-003'],
  'esco-nlp-003': ['esco-py-005', 'esco-ml-001'],
  'esco-cv-004': ['esco-py-005', 'esco-dl-002'],
  'esco-k8s-008': ['esco-docker-009', 'esco-git-013'],
  'esco-docker-009': ['esco-git-013'],
  'esco-react-010': ['esco-ts-011', 'esco-git-013'],
  'esco-ts-011': ['esco-react-010', 'esco-api-012'],
  'esco-log-016': ['esco-log-017', 'esco-da-006'],
  'esco-trd-018': ['esco-trd-019', 'esco-trd-020'],
};
