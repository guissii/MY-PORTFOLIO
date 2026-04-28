import https from 'https';

const hackathons = [
  {
    slug: 'spring-school-emcsp-2025',
    name: 'Spring School Hackathon — EMCSP',
    result: 'Lauréat — MedAssist AI',
    period: '2025',
    detail: `Hackathon médical organisé par l'École Militaire du Corps de Santé et de Perfectionnement (EMCSP) de Kénitra dans le cadre de la Spring School 2025. Défi : concevoir un outil d'aide à la décision clinique destiné aux médecins.

Notre solution, MedAssist AI, permet au praticien de saisir les paramètres complets d'un patient (données biographiques, symptômes, constantes vitales) ainsi que ses résultats d'analyses biologiques. Un pipeline de machine learning local traite ensuite l'ensemble de ces données et génère une prédiction diagnostique accompagnée de recommandations thérapeutiques personnalisées, en s'appuyant sur une base de connaissances médicales structurée.

Stack technique : Python, FastAPI, modèle ML local (scikit-learn / PyTorch), interface web React, pipeline de traitement des données d'analyses.`,
    coverImagePathname: '',
  },
  {
    slug: 'hackathon-cyber-ia-deepfake-2025',
    name: 'Hackathon Cyber & IA — TechPost × Gemini',
    result: 'Finaliste — DeepTrue',
    period: '2025',
    detail: `Hackathon organisé par TechPost en partenariat avec Google Gemini, centré sur la cybersécurité et la détection de contenus manipulés par l'IA. Problématique : lutter contre la désinformation numérique à grande échelle.

Notre projet, DeepTrue, est une plateforme complète de vérification multimodale qui exploite l'API Gemini pour analyser trois types de contenus suspects : images générées par IA (détection d'artefacts visuels, cohérence de métadonnées), vidéos deepfake (analyse temporelle lip-sync, incohérences biométriques), et documents financiers ou contrats falsifiés (extraction sémantique, vérification de signatures contextuelles).

Le système retourne un score de fiabilité par contenu, une explication détaillée des indices détectés, et un verdict clair. Stack : Gemini Pro Vision API, Python, FastAPI, React, pipeline d'analyse PDF/vidéo/image.`,
    coverImagePathname: '',
  },
  {
    slug: 'cannes-innovation-2025',
    name: 'Cannes Innovation Hackathon 2025',
    result: 'Top Projet — SecureTicket',
    period: '2025',
    detail: `Hackathon international Cannes Innovation 2025. Problématique soumise : l'inflation du marché parallèle des billets au Maroc (revente abusive de tickets d'événements à des prix exorbitants), un fléau qui pénalise les vrais fans et fragilise la sécurité des événements publics.

Notre solution, SecureTicket, attribue chaque billet à l'identité biométrique de son acheteur légitime : reconnaissance faciale (Face ID) ou empreinte digitale. Lors de l'entrée à l'événement, le système vérifie en temps réel la concordance ticket ↔ identité, rendant toute revente illégale techniquement impossible.

La plateforme développée de A à Z inclut : une interface d'achat sécurisée, un back-office organisateur avec tableau de bord temps réel, des QR codes chiffrés anti-clonage, un module de news événementielles, et une couche sécurité multi-facteur (chiffrement AES-256, audit trail, anti-replay tokens). Stack : React, Node.js, Python, OpenCV / FaceNet, PostgreSQL, infrastructure Cloud.`,
    coverImagePathname: '',
  },
];

const body = JSON.stringify({ hackathons });

const options = {
  hostname: 'mohammedguissi.com',
  port: 443,
  path: '/api/admin/hackathons',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'x-admin-username': 'admin',
    'x-admin-password': 'Admin-Local-2026!ChangeMe',
  },
};

console.log('Sending hackathon data to production API...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(data);
      if (parsed.ok) {
        console.log('SUCCESS — Hackathons saved to Vercel Blob!');
        console.log('URL:', parsed.url || parsed.pathname);
      } else {
        console.error('API Error:', parsed.error || data);
      }
    } catch {
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request failed:', e.message);
});

req.write(body);
req.end();
