import React, { useRef, useEffect, useState } from 'react';

type AppView = 'general' | 'learning_path' | 'assessment' | 'hackathons' | 'playground' | 'admin' | 'profile' | 'leaderboard' | 'analytics' | 'discussions' | 'reports' | 'story_mode' | 'events';

interface SidebarProps {
    isOpen: boolean;
    currentView: AppView;
    onSetView: (view: AppView) => void;
    userRole: 'user' | 'admin';
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, isCollapsed, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-3 py-2 my-1 rounded-xl transition-all duration-300 group relative transform hover:scale-[1.02] ${
            isActive
                ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/20'
                : 'text-white/80 hover:bg-white/15 hover:text-white hover:shadow-md'
        }`}
    >
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-white to-white/60 rounded-r-full transition-all duration-300 ${isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}></div>
        <div className="w-8 h-8 flex justify-center items-center">{icon}</div>
        <span className={`font-bold text-sm transition-all duration-300 tracking-wide ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 ml-4 w-auto'}`} style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>{label}</span>
        {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-2xl backdrop-blur-sm border border-gray-700" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                {label}
            </div>
        )}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onSetView, userRole, onMouseEnter, onMouseLeave }) => {
    const navLinks = [
        { view: 'general', label: 'Dashboard', icon: <span className="text-xl">📊</span>, role: ['user', 'admin'] },
        { view: 'assessment', label: 'Assessments', icon: <span className="text-xl">🔬</span>, role: ['user', 'admin'] },
        { view: 'learning_path', label: 'Learning Paths', icon: <span className="text-xl">🗺️</span>, role: ['user', 'admin'] },
        { view: 'story_mode', label: 'Story Mode', icon: <span className="text-xl">📚</span>, role: ['user', 'admin'] },
        { view: 'hackathons', label: 'Hackathons', icon: <span className="text-xl">🏆</span>, role: ['user', 'admin'] },
        { view: 'events', label: 'Themed Events', icon: <span className="text-xl">🎉</span>, role: ['user', 'admin'] },
        { view: 'discussions', label: 'Discussions', icon: <span className="text-xl">💬</span>, role: ['user', 'admin'] },
        { view: 'leaderboard', label: 'Leaderboard', icon: <span className="text-xl">🥇</span>, role: ['user', 'admin'] },
        { view: 'analytics', label: 'Analytics', icon: <span className="text-xl">📈</span>, role: ['user', 'admin'] },
    ];
    
    const adminLinks = [
      { view: 'admin', label: 'Admin Panel', icon: <span className="text-xl">⚙️</span>, role: ['admin'] },
    ];

    const visibleNavLinks = navLinks.filter(link => link.role.includes(userRole));
    const visibleAdminLinks = adminLinks.filter(link => link.role.includes(userRole));

    return (
        <aside
            className={`sidebar-fixed bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#7c3aed] text-white transition-all duration-300 ease-in-out shadow-2xl flex flex-col backdrop-blur-sm z-[9999] ${
                isOpen ? 'w-64' : 'w-16'
            }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={`flex items-center px-4 py-4 border-b border-white/10 transition-all duration-300 ${isOpen ? 'h-20' : 'h-20'}`}>
                <div className="text-3xl flex-shrink-0 transform hover:scale-110 transition-transform duration-300">🦅</div>
                <span className={`font-black text-xl ml-3 transition-all duration-300 tracking-wide bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`} style={{ fontFamily: 'Orbitron, Space Grotesk, sans-serif' }}>Mavericks</span>
            </div>
            
            <nav className="sidebar-nav px-2">
                <div className="sidebar-nav-items">
                    {visibleNavLinks.map((item) => (
                        <NavItem
                            key={item.view}
                            icon={item.icon}
                            label={item.label}
                            isActive={currentView === item.view}
                            isCollapsed={!isOpen}
                            onClick={() => onSetView(item.view as AppView)}
                        />
                    ))}
                </div>
            </nav>
            
            {userRole === 'admin' && (
              <div className="px-2 border-t border-white/10 py-2">
                 {visibleAdminLinks.map((item) => (
                    <NavItem
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.view}
                        isCollapsed={!isOpen}
                        onClick={() => onSetView(item.view as AppView)}
                    />
                 ))}
              </div>
            )}
        </aside>
    );
};

export default Sidebar;