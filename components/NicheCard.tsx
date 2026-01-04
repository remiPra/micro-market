import React from 'react';
import { MicroNiche } from '../types';
import RadialProgress from './RadialProgress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface NicheCardProps {
  niche: MicroNiche;
}

const NicheCard: React.FC<NicheCardProps> = ({ niche }) => {
  // Mock trend data based on growth projection for visualization
  const trendData = [
    { month: 'M1', val: 30 },
    { month: 'M2', val: 45 },
    { month: 'M3', val: 40 },
    { month: 'M4', val: 55 },
    { month: 'M5', val: niche.projectedGrowth > 20 ? 75 : 60 },
    { month: 'M6', val: niche.projectedGrowth > 50 ? 95 : 70 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-indigo-500";
    return "text-amber-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md hover:border-indigo-100">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${niche.suggestedChannel === 'Amazon' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {niche.suggestedChannel}
             </span>
             <span className="text-gray-400 text-xs">Micro-Niche</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{niche.keyword}</h3>
          <p className="text-sm text-gray-500 mt-1">Cible : {niche.targetAudience}</p>
        </div>
        
        <div className="flex items-center gap-4">
            <RadialProgress 
                score={niche.opportunityScore} 
                label="Score Opp." 
                size="md" 
                color={getScoreColor(niche.opportunityScore)}
            />
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-6 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
        "{niche.reasoning}"
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-medium text-gray-500">Force Demande</span>
                <span className="text-xs font-bold text-gray-900">{niche.demandScore}/10</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${niche.demandScore * 10}%` }}></div>
            </div>
        </div>
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-medium text-gray-500">Concurrence</span>
                <span className="text-xs font-bold text-gray-900">{niche.competitionScore}/10</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                {/* For competition, high score is bad, so we color it red if high */}
                <div 
                    className={`h-1.5 rounded-full ${niche.competitionScore > 6 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${niche.competitionScore * 10}%` }}>
                </div>
            </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">Signal Croissance</span>
            <span className="text-xs font-bold text-green-600">+{niche.projectedGrowth}% Proj.</span>
        </div>
        <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                    <Bar dataKey="val" fill="#E0E7FF" radius={[2, 2, 0, 0]} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ fontSize: '12px', padding: '4px' }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default NicheCard;