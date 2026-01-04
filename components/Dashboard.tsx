import React, { useState, useEffect, useRef } from 'react';
import { analyzeMarket } from '../services/geminiService';
import { MicroNiche, SearchParams, UserQuota } from '../types';
import NicheCard from './NicheCard';
import Layout from './Layout';

const SAMPLE_QUOTA: UserQuota = {
  used: 0,
  limit: 5, // Demo limit
  isPro: false
};

const LOADING_STEPS = [
    [
        "Agent Stratège : Définition de l'angle d'attaque...",
        "Agent Éclaireur : Scan des bases de données Amazon...",
        "Agent Analyste : Filtrage des produits saturés...",
        "Agent Financier : Calcul des marges potentielles...",
    ],
    [
        "Initialisation des agents...",
        "Recherche de signaux faibles sur Google Trends...",
        "Analyse sémantique des avis clients négatifs...",
        "Identification des opportunités 'Océan Bleu'...",
    ],
    [
        "Agent 1 : Analyse de la concurrence asiatique...",
        "Agent 2 : Recherche de brevets expirés...",
        "Agent 3 : Simulation de demande saisonnière...",
        "Validation finale des niches...",
    ]
];

const Dashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<'amazon' | 'google' | 'mix'>('mix');
  const [results, setResults] = useState<MicroNiche[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<UserQuota>(SAMPLE_QUOTA);
  
  const loadingIntervalRef = useRef<number | null>(null);

  // Load quota from local storage
  useEffect(() => {
    const saved = localStorage.getItem('mm_quota');
    if (saved) {
        setQuota(JSON.parse(saved));
    }
  }, []);

  // Persist quota
  useEffect(() => {
    localStorage.setItem('mm_quota', JSON.stringify(quota));
  }, [quota]);

  // Multi-Agent Simulation Effect
  useEffect(() => {
    if (loading) {
        // Pick a random set of messages
        const messageSet = LOADING_STEPS[Math.floor(Math.random() * LOADING_STEPS.length)];
        let msgIndex = 0;
        setLoadingMessage(messageSet[0]);
        
        loadingIntervalRef.current = window.setInterval(() => {
            msgIndex = (msgIndex + 1) % messageSet.length;
            setLoadingMessage(messageSet[msgIndex]);
        }, 1200); 
    } else {
        if (loadingIntervalRef.current) {
            clearInterval(loadingIntervalRef.current);
            loadingIntervalRef.current = null;
        }
    }
    return () => {
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [loading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (quota.used >= quota.limit) {
        setError("Limite atteinte. Passez en Pro pour continuer.");
        return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await analyzeMarket({ query, platform });
      setResults(data);
      // Increment quota
      setQuota(prev => ({ ...prev, used: prev.used + 1 }));
    } catch (err) {
      setError("Erreur d'analyse. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["Yoga", "Chat", "Cuisine", "Bureau", "Rando"];

  return (
    <Layout quota={quota}>
        <div className="max-w-6xl mx-auto px-4 py-8 md:p-12">
            
            {/* Header Section */}
            <header className="mb-8 md:mb-12 text-center md:text-left mt-4 md:mt-0">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase">
                    Version Beta 2.0 • Multi-Agents
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                    Détecteur de <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Niches Rentables</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                    Laissez notre équipe d'Agents IA scanner le marché pour vous. Ils trouvent ce que les autres ne voient pas.
                </p>
            </header>

            {/* Search Box - Lux Design */}
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-3 md:p-4 mb-10 border border-white/50 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 relative z-10">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-6 w-6 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ex: 'Yoga', 'Vélo'..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 text-gray-900 placeholder-gray-400 text-lg outline-none transition-all font-medium"
                        />
                    </div>
                    
                    <div className="flex md:w-auto">
                         <div className="relative w-full md:w-auto">
                            <select 
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value as any)}
                                className="w-full md:w-auto h-full px-4 py-4 bg-gray-50 rounded-2xl border-r-8 border-transparent text-gray-700 font-medium text-base outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="mix">Mix (Tout)</option>
                                <option value="amazon">Amazon</option>
                                <option value="google">Google</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                         </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || quota.used >= quota.limit}
                        className={`md:w-52 py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-95
                            ${loading 
                                ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                                : quota.used >= quota.limit
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-300 hover:-translate-y-1'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        ) : quota.used >= quota.limit ? '0 Crédit' : 'Scanner'}
                    </button>
                </form>
            </div>

             {/* Multi-Agent Loading State - Enhanced */}
             {loading && (
                <div className="mb-10 text-center animate-pulse bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                    <div className="flex justify-center mb-3">
                         <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                         </div>
                    </div>
                    <span className="text-indigo-600 font-mono text-xs font-bold uppercase tracking-widest block mb-2">IA en cours de réflexion</span>
                    <p className="text-lg font-medium text-gray-800 transition-all duration-300 min-h-[1.75rem]">
                        {loadingMessage}
                    </p>
                </div>
            )}

            {/* Quick Suggestions */}
            {!results.length && !loading && (
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tendances du jour</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {suggestions.map(s => (
                            <button 
                                key={s} 
                                onClick={() => setQuery(s)}
                                className="px-5 py-2.5 bg-white border border-gray-200 shadow-sm rounded-full text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 p-4 mb-8 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full text-red-500">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
            )}

            {/* Results Grid */}
            {results.length > 0 && (
                <div className="animate-fade-in-up pb-10">
                    <div className="flex items-end justify-between mb-6 px-1">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Résultats</h2>
                            <p className="text-sm text-gray-500">Triés par potentiel de profit</p>
                        </div>
                        <button onClick={() => setResults([])} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                            Nouvelle recherche
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {results.map((niche, idx) => (
                            <NicheCard key={idx} niche={niche} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    </Layout>
  );
};

export default Dashboard;