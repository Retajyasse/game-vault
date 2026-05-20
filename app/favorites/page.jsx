'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Ghost, ChevronLeft } from 'lucide-react';

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();



  const toggleFavorite = (game) => {
    const updated = favorites.filter((f) => f.id !== game.id);
    setFavorites(updated);
    localStorage.setItem('game_vault_favorites', JSON.stringify(updated));
  };

  useEffect(() => {
  const loadFavorites = () => {
    const saved = JSON.parse(
      localStorage.getItem('game_vault_favorites') || '[]'
    );

    setFavorites(saved);
  };

  loadFavorites();

  window.addEventListener('storage', loadFavorites);

  return () => {
    window.removeEventListener('storage', loadFavorites);
  };
}, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="max-w-5xl mx-auto pt-10 flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 bg-[#1E293B] rounded-xl flex items-center justify-center border border-white/10 hover:bg-violet-500/10 transition-colors mr-4"
        >
          <ChevronLeft color="white" size={24} />
        </button>
        <h1 className="text-3xl font-black">
          My <span className="text-violet-500">Vault</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Ghost className="text-gray-400 mb-4" size={80} strokeWidth={1.5} />
            <h2 className="text-2xl font-bold mb-2">Your vault is empty</h2>
            <p className="text-gray-400 mb-6">Go back and add some epic games!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-violet-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-violet-600 transition-all"
            >
              Explore Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/details/${item.id}`)}
                className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer border border-white/5"
              >
                <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent flex flex-col justify-between p-5">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      className="w-9 h-9 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10"
                    >
                      <Heart color="#ef4444" fill="#ef4444" size={18} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">{item.title}</h3>
                    <span className="inline-block mt-1 text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md uppercase">
                      {item.genre}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}