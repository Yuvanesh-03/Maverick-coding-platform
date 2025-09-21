import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'button' | 'dropdown';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'button'
}) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or default to system
    const savedTheme = (localStorage.getItem('mavericks-theme') as Theme) || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes from both root and body
    root.removeAttribute('data-theme');
    root.classList.remove('light-theme', 'dark-theme', 'light', 'dark');
    body.classList.remove('light-theme', 'dark-theme', 'light', 'dark');
    
    let actualTheme: 'light' | 'dark';
    
    if (newTheme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      actualTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      actualTheme = newTheme;
    }
    
    // Set theme attributes and classes
    root.setAttribute('data-theme', actualTheme);
    root.classList.add(actualTheme);
    body.classList.add(actualTheme);
    body.classList.add(`${actualTheme}-theme`);
    
    // Update CSS custom properties for immediate effect
    if (actualTheme === 'dark') {
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f8fafc';
    } else {
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1e293b';
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('mavericks-theme', newTheme);
    applyTheme(newTheme);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  if (!mounted) {
    // Prevent flash of incorrect theme
    return <div className={`w-10 h-10 ${className}`} />;
  }

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getThemeIcon = () => {
    const iconClass = iconSizeClasses[size];
    
    if (theme === 'light') return <Sun className={iconClass} />;
    if (theme === 'dark') return <Moon className={iconClass} />;
    return <Monitor className={iconClass} />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light mode';
    if (theme === 'dark') return 'Dark mode';
    return 'System theme';
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    handleThemeChange(themes[nextIndex]);
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value as Theme)}
          className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em'
          }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={cycleTheme}
        className={`
          ${sizeClasses[size]}
          ${className}
          relative group
          bg-white/10 backdrop-blur-md 
          border border-white/20 
          rounded-lg
          text-white
          hover:bg-white/20 
          hover:border-white/30
          hover:scale-105
          active:scale-95
          transition-all duration-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-opacity-50
        `}
        title={getThemeLabel()}
        aria-label={getThemeLabel()}
      >
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
          {getThemeIcon()}
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
      </button>

      {showLabel && (
        <span className="text-sm text-white/80 font-medium">
          {getThemeLabel()}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;

// Hook for using theme in other components
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Get initial theme
    const savedTheme = (localStorage.getItem('mavericks-theme') as Theme) || 'system';
    setTheme(savedTheme);
    
    // Resolve actual theme (system -> light/dark)
    const updateResolvedTheme = () => {
      if (savedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(savedTheme === 'dark' ? 'dark' : 'light');
      }
    };

    updateResolvedTheme();

    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail as Theme;
      setTheme(newTheme);
      
      if (newTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(newTheme === 'dark' ? 'dark' : 'light');
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme]);

  return { theme, resolvedTheme, setTheme };
};
