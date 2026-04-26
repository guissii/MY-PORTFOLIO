export interface HackathonItem {
  slug: string;
  name: string;
  result: string;
  period: string;
  detail: string;
  coverImagePathname?: string;
}

export const hackathons: HackathonItem[] = [
  {
    slug: 'hackathon-sante-ia',
    name: 'Hackathon Sante IA',
    result: 'Lauréat - MedTriage AI',
    period: '2025',
    detail: 'Conception d un triage medical intelligent avec pipeline TypeScript + Python + FastAPI.',
  },
  {
    slug: 'hackathon-cyber-ia',
    name: 'Hackathon Cyber & IA',
    result: 'Finaliste - DeepTrue',
    period: '2025',
    detail: 'Prototype de detection deepfakes et verification de desinformation en temps reel.',
  },
  {
    slug: 'ai-agents-challenge',
    name: 'AI Agents Challenge',
    result: 'Top Projet - Agents IA autonomes',
    period: '2026',
    detail: 'Orchestration multi-outils LLM avec chaines d actions, observabilite et API externes.',
  },
];
