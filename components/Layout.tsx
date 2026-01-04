import React, { useState } from 'react';
import { UserQuota } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  quota: UserQuota;
}

const Layout: React.FC<LayoutProps> = ({ children, quota }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const percentage = (quota.used / quota.limit) * 100;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      
      {/* Mobile Header (Visible only on mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-lg">MicroMarket</span>
        </div>
        <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile only) */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
            fixed md:static inset-y-0 left-0 z-50 w-[280px] md:w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-out shadow-2xl md:shadow-none
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 hidden md:flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">MicroMarket</span>
        </div>

        {/* Mobile Close Button */}
        <div className="md:hidden p-4 flex justify-end">
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plateforme</div>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 bg-indigo-50/80 text-indigo-700 rounded-xl font-medium transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Scanner IA
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Niches Sauvegardées
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Tendances Live
          </a>
        </nav>

        <div className="p-6 m-4 bg-gray-900 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-gray-300">Crédits Restants</span>
                <span className="text-sm font-bold text-white">{quota.limit - quota.used}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-indigo-400 to-purple-400`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
            {!quota.isPro && (
                <button className="w-full py-2.5 bg-white text-gray-900 hover:bg-gray-50 text-xs font-bold rounded-lg shadow-lg transition-transform active:scale-95">
                Débloquer Pro (49€)
                </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto pt-16 md:pt-0 scroll-smooth">
        {children}
      </main>
    </div>
  );
};

export default Layout;