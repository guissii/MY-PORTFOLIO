import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import NeuralNetworkCanvas from '@/components/NeuralNetworkCanvas';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import AdminPhotosPage from '@/pages/AdminPhotosPage';

type Route =
  | { type: 'home' }
  | { type: 'project'; slug: string }
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
  return { type: 'home' };
};

function RootRouter() {
  const [route, setRoute] = useState<Route>(() => parseHashRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route.type === 'home') {
    return <App />;
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#08091A' }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkCanvas />
      </div>
      <div className="relative z-10">
        {route.type === 'admin' ? <AdminPhotosPage /> : <ProjectDetailsPage slug={route.slug} />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<RootRouter />);
