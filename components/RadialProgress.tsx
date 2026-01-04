import React from 'react';

interface RadialProgressProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ score, label, size = 'md', color = 'text-indigo-600' }) => {
  // Calculate circumference
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let sizeClasses = "w-16 h-16 text-xs";
  if (size === 'lg') sizeClasses = "w-24 h-24 text-sm";
  if (size === 'sm') sizeClasses = "w-12 h-12 text-[10px]";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 40 40">
          {/* Background Circle */}
          <circle
            className="text-gray-200"
            strokeWidth="3"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
          {/* Progress Circle */}
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
        </svg>
        <span className={`absolute font-bold text-gray-800`}>{score}</span>
      </div>
      <span className="mt-1 text-gray-500 font-medium text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
};

export default RadialProgress;