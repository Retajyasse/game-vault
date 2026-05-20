'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Ghost, ChevronLeft } from 'lucide-react';

export const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  primary: '#8B5CF6', 
  secondary: '#22D3EE', 
  text: '#F8FAFC',
  grey: '#94A3B8',
};

const FavoriteContext = createContext();

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  const toggleFavorite = (game) => {
    setFavorites((prev) => 
      prev.find(f => f.id === game.id) 
        ? prev.filter(f => f.id !== game.id) 
        : [...prev, game]
    );
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      <div style={{ flex: 1, backgroundColor: COLORS.bg, minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <button 
            onClick={() => router.back()} 
            style={{ width: 40, height: 40, backgroundColor: COLORS.card, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 15, border: 'none', cursor: 'pointer' }}
          >
            <ChevronLeft color="white" size={24} />
          </button>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: '900', margin: 0 }}>
            My <span style={{ color: COLORS.primary }}>Vault</span>
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 40, paddingRight: 40, height: '60vh' }}>
            <Ghost color={COLORS.grey} size={80} strokeWidth={1.5} />
            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>Your vault is empty</h2>
            <p style={{ color: COLORS.grey, textAlign: 'center', marginTop: 10, lineHeight: '22px' }}>Go back and add some epic games!</p>
            <button 
              style={{ backgroundColor: COLORS.primary, paddingLeft: 30, paddingRight: 30, paddingTop: 15, paddingBottom: 15, borderRadius: 15, marginTop: 30, border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold', fontSize: 16 }}
              onClick={() => router.push('/')}
            >
              Explore Games
            </button>
          </div>
        ) : (
          <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 40 }}>
            {favorites.map((item) => (
              <div 
                key={item.id}
                style={{ height: 180, marginBottom: 20, borderRadius: 20, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                onClick={() => router.push(`/details/${item.id}`)}
              >
                <img src={item.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 12, border: 'none', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                    >
                      <Heart color="#FF4B4B" fill="#FF4B4B" size={18} />
                    </button>
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', margin: 0 }}>{item.title}</h3>
                    <p style={{ color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginTop: 4, margin: 0 }}>{item.genre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FavoriteContext.Provider>
  );
}