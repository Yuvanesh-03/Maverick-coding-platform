// Theme initialization script - runs before React loads
(function() {
  function applyTheme(theme) {
    // Check if DOM elements exist before manipulating them
    if (!document.documentElement || !document.body) {
      // If DOM isn't ready, wait for it
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          applyTheme(theme);
        });
        return;
      }
    }
    
    const root = document.documentElement;
    const body = document.body;
    
    // Safety check
    if (!root || !body) {
      console.warn('DOM elements not available for theme initialization');
      return;
    }
    
    // Remove existing classes
    root.classList.remove('light', 'dark', 'light-theme', 'dark-theme');
    body.classList.remove('light', 'dark', 'light-theme', 'dark-theme');
    
    let actualTheme;
    
    if (theme === 'system' || !theme) {
      actualTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      actualTheme = theme;
    }
    
    // Apply theme
    root.setAttribute('data-theme', actualTheme);
    root.classList.add(actualTheme);
    body.classList.add(actualTheme, actualTheme + '-theme');
    
    // Apply immediate styles to prevent flash
    if (actualTheme === 'dark') {
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f8fafc';
    } else {
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1e293b';
    }
  }
  
  // Get saved theme or default to system (with safety check for localStorage)
  let savedTheme;
  try {
    savedTheme = localStorage.getItem('mavericks-theme') || 'system';
  } catch (e) {
    savedTheme = 'system';
  }
  
  // Apply theme immediately
  applyTheme(savedTheme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function() {
      let currentTheme;
      try {
        currentTheme = localStorage.getItem('mavericks-theme') || 'system';
      } catch (e) {
        currentTheme = 'system';
      }
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    });
  }
})();
