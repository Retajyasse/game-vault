'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, PlayCircle, Heart } from 'lucide-react';

export default function DetailsScreen() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('game_vault_favorites') || '[]');
  });

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://www.freetogame.com/api/game?id=${id}`);
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
      setLoading(false);
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  useEffect(() => {
    const handleStorage = () => {
      setFavorites(
        JSON.parse(localStorage.getItem('game_vault_favorites') || '[]')
      );
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isFav = game ? favorites.some((f) => f.id === game.id) : false;

  const toggleFavorite = (game) => {
    const savedFavs = [...favorites];

    const isAlreadyFav = savedFavs.find((f) => f.id === game.id);

    let newFavs;

    if (isAlreadyFav) {
      newFavs = savedFavs.filter((f) => f.id !== game.id);
    } else {
      newFavs = [...savedFavs, game];
    }

    setFavorites(newFavs);
    localStorage.setItem(
      'game_vault_favorites',
      JSON.stringify(newFavs)
    );

    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!game || game.status === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Game not found!</h2>
        <button onClick={() => router.back()} className="text-violet-500 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-violet-500 pb-12">
      <div 
        className="w-full h-[450px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${game.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#0f172a] flex flex-col justify-between p-6 md:p-10">
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => router.back()} 
              className="bg-black/50 hover:bg-black/70 p-2.5 rounded-xl backdrop-blur-sm transition-colors"
            >
              <ChevronLeft color="white" size={28} />
            </button>

            <button 
              onClick={() => toggleFavorite(game)} 
              className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl backdrop-blur-sm transition-colors"
            >
              <Heart 
                color={isFav ? '#FF4B4B' : 'white'} 
                fill={isFav ? '#FF4B4B' : 'transparent'} 
                size={24} 
              />
            </button>
          </div>

          <div className="mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
              {game.title}
            </h1>
            <span className="bg-violet-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-lg shadow-violet-500/30 inline-block uppercase tracking-wider">
              {game.genre}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 mt-4">
        <h2 className="text-2xl font-bold text-white mb-4">About Game</h2>
        <p className="text-gray-400 leading-relaxed text-[15px] md:text-base">
          {game.description || game.short_description}
        </p>

        <div className="flex flex-row justify-between items-center mt-8 bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Platform</p>
            <p className="text-white font-bold">{game.platform}</p>
          </div>
          <div className="w-px h-10 bg-white/10 mx-4"></div>
          <div className="flex-1 text-right">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Publisher</p>
            <p className="text-white font-bold">{game.publisher}</p>
          </div>
        </div>

        <a 
          href={game.game_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex justify-center items-center bg-violet-600 hover:bg-violet-500 text-white p-5 rounded-2xl mt-10 gap-3 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1"
        >
          <PlayCircle color="white" size={26} />
          <span className="text-lg font-bold tracking-wide">Play Now</span>
        </a>
      </div>
    </div>
  );
}