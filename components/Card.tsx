import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  disable3D?: boolean;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '', headerActions, disable3D = false }) => {
  return (
    <div className={`glass-effect rounded-[20px] border border-slate-200/20 dark:border-slate-700/30 ${disable3D ? 'hover:shadow-lg' : 'card-3d-hover'} transition-all duration-300 overflow-hidden ${className}`}>
        {/* Card Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200/20 dark:border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-2 rounded-full text-purple-300 dark:text-purple-400 neon-pulse">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gradient">{title}</h3>
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
        {/* Card Body */}
        <div className="p-6">
          {children}
        </div>
    </div>
  );
};

export default Card;
