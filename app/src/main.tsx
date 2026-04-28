import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import HackathonDetailsPage from '@/pages/HackathonDetailsPage';
import AdminPhotosPage from '@/pages/AdminPhotosPage';

type Route =
  | { type: 'home' }
  | { type: 'project'; slug: string }
  | { type: 'hackathon'; slug: string }
  | { type: 'admin' };

const parseHashRoute = (): Route => {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  if (hash === '/admin') {
    return { type: 'admin' };
  }
  if (hash.startsWith('/projets/')) {
    const slug = hash.replace('/projets/', '').trim();
    if (slug) return { type: 'project', slug };
  }
  if (hash.startsWith('/hackathons/')) {
    const slug = hash.replace('/hackathons/', '').trim();
    if (slug) return { type: 'hackathon', slug };
  }
  return { type: 'home' };
};

function RootRouter() {
  const [route, setRoute] = useState<Route>(() => parseHashRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route.type === 'admin') return;
    const key = 'site_view_tracked_v1';
    try {
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');
    } catch {
      void 0;
    }
    fetch('/api/public/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.hash || '/' }),
    }).catch(() => {
      void 0;
    });
  }, [route.type]);

  if (route.type === 'home') {
    return <App />;
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#05070d' }}>
      <div className="relative z-10">
        {route.type === 'admin' ? <AdminPhotosPage /> : 
         route.type === 'project' ? <ProjectDetailsPage slug={route.slug} /> : 
         route.type === 'hackathon' ? <HackathonDetailsPage slug={route.slug} /> : null
        }
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<RootRouter />);
