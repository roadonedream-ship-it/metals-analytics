import { useState } from 'react';
import AiAnalystPage from '@/pages/AiAnalystPage';
import MarketPage from '@/pages/MarketPage';
import MetalsPage from '@/pages/MetalsPage';
import Sidebar, { type Section } from '@/components/layout/Sidebar';
import { useFavorites } from '@/hooks/useFavorites';

export default function App() {
  const [section, setSection] = useState<Section>('market');
  const [updatedAt] = useState(() => new Date());
  const favorites = useFavorites();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar active={section} onChange={setSection} />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-10">
        <div key={section} className="mx-auto max-w-7xl animate-fade-up">
          {section === 'market' && <MarketPage updatedAt={updatedAt} favorites={favorites} />}
          {section === 'metals' && <MetalsPage updatedAt={updatedAt} favorites={favorites} />}
          {section === 'ai' && <AiAnalystPage updatedAt={updatedAt} />}
        </div>
      </main>
    </div>
  );
}
