'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { Search, Ghost, Heart, LogOut } from 'lucide-react'; 
import { fetchAllGames } from './api/gameService'; 

export default function HomeScreen() {
  const { data: session } = useSession();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'MMORPG', 'Shooter', 'Strategy', 'MOBA', 'Racing', 'Sports', 'Social'];

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const data = await fetchAllGames();
        setGames(data || []);
        setFilteredGames(data || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };
    loadGames();
  }, []);

  const applyFilters = (query, category) => {
    let tempGames = games;
    if (category !== 'All') tempGames = tempGames.filter(g => g.genre === category);
    if (query.trim() !== '') tempGames = tempGames.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));
    setFilteredGames(tempGames);
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchQuery(text);
    applyFilters(text, activeCategory);
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    applyFilters(searchQuery, category);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <div className="pt-12 px-6 max-w-5xl mx-auto mb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Explore the multiverse</p>
            <h1 className="text-4xl font-black">Game<span className="text-violet-500">Vault</span></h1>
          </div>
          
          <div className="flex gap-3">
            {session ? (
              <button 
                onClick={() => signOut({ callbackUrl: "/" })} 
                className="w-11 h-11 bg-[#1e293b] rounded-xl flex items-center justify-center border border-white/10 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="text-red-400" size={22} />
              </button>
            ) : (
              <button 
                onClick={() => signIn("google", { callbackUrl: "/" })} 
                className="w-11 h-11 bg-[#1e293b] rounded-xl flex items-center justify-center border border-white/10 hover:bg-slate-700/50 transition-colors"
              >
               
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
            )}

            <Link href="/favorites" className="w-11 h-11 bg-[#1e293b] rounded-xl flex items-center justify-center border border-white/10 hover:bg-violet-500/10 transition-colors">
              <Heart className="text-violet-500" size={22} fill="rgba(139, 92, 246, 0.2)" />
            </Link>
          </div>
        </div>

        <div className="flex items-center bg-[#1e293b] rounded-2xl px-4 h-12 w-full max-w-md border border-white/5 focus-within:border-violet-500/50 transition-all">
          <Search className="text-gray-400 mr-3" size={18} />
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-400"
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="mb-6 max-w-5xl mx-auto px-6">
        <div className="flex overflow-x-auto gap-3 py-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryPress(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/20' 
                  : 'bg-[#1e293b] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-12 text-gray-400">
            <Ghost size={40} className="mb-3" />
            <p className="text-sm">No games found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredGames.map((item) => (
              <Link 
                key={item.id}
                href={`/details/${item.id}`} 
                className="group relative h-60 rounded-3xl overflow-hidden cursor-pointer block transition-transform duration-300 hover:scale-[1.02]"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold text-white tracking-wide truncate">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-white/15 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white">{item.genre}</span>
                    <span className="text-xs text-white/60">{item.platform}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}