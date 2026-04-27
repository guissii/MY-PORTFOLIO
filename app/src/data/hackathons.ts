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
    slug: 'spring-school-um6p-2025',
    name: 'Spring School Hackathon — UM6P Benguérir',
    result: 'Lauréat — MedAssist AI',
    period: '2025',
    detail: `Hackathon médical organisé par l'Université Mohammed VI Polytechnique (UM6P) de Benguérir dans le cadre de la Spring School 2025. Défi : concevoir un système d'aide à la décision clinique pour les médecins en milieu hospitalier. Notre solution MedAssist AI permet de saisir les données complètes d'un patient (paramètres biographiques, symptômes, constantes vitales, résultats d'analyses biologiques). Un modèle de machine learning local analyse l'ensemble et génère une prédiction diagnostique avec recommandations thérapeutiques personnalisées, basées sur une base de connaissances médicales structurée. Stack : Python, FastAPI, ML local (scikit-learn / PyTorch), React.`,
  },
  {
    slug: 'hackathon-cyber-ia-2025',
    name: 'Hackathon Cyber & IA — TechPost × Gemini',
    result: 'Finaliste — DeepTrue',
    period: '2025',
    detail: `Hackathon organisé par TechPost en partenariat avec Google Gemini, axé sur la cybersécurité et la lutte contre la désinformation numérique. Notre projet DeepTrue est une plateforme de vérification multimodale exploitant l'API Gemini pour analyser trois types de contenus : images générées par IA (artefacts visuels, cohérence de métadonnées), vidéos deepfake (analyse temporelle, incohérences biométriques), et documents financiers ou contrats falsifiés (extraction sémantique, vérification contextuelle). Le système retourne un score de fiabilité, une explication détaillée des indices détectés et un verdict clair. Stack : Gemini Pro Vision API, Python, FastAPI, React.`,
  },
  {
    slug: 'cannes-innovation-2025',
    name: 'Cannes Innovation Hackathon 2025',
    result: 'Top Projet — SecureTicket',
    period: '2025',
    detail: `Hackathon international Cannes Innovation 2025. Problématique : le marché parallèle des billets d'événements au Maroc (revente abusive à des prix exorbitants). Notre solution SecureTicket attribue chaque billet à l'identité biométrique de son acheteur via Face ID ou empreinte digitale. Lors de l'entrée à l'événement, le système vérifie en temps réel la concordance ticket ↔ identité, rendant toute revente illégale impossible. La plateforme développée de A à Z inclut : interface d'achat sécurisée, back-office organisateur avec dashboard temps réel, QR codes chiffrés anti-clonage, module de news événementielles, et couche sécurité multi-facteur (AES-256, audit trail, anti-replay tokens). Stack : React, Node.js, Python, OpenCV / FaceNet, PostgreSQL, Cloud.`,
  },
];

