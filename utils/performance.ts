/**
 * Performance optimization utilities for the Mavericks Coding Platform
 */
import React from 'react';

export interface PerformanceConfig {
  enableGPUAcceleration: boolean;
  enableWillChange: boolean;
  enableContentVisibility: boolean;
  enableContainment: boolean;
}

const defaultConfig: PerformanceConfig = {
  enableGPUAcceleration: true,
  enableWillChange: true,
  enableContentVisibility: true,
  enableContainment: true,
};

/**
 * Apply performance optimizations to elements
 */
export const optimizeElement = (element: HTMLElement, config: Partial<PerformanceConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  if (finalConfig.enableGPUAcceleration) {
    element.style.transform = element.style.transform || 'translateZ(0)';
  }
  
  if (finalConfig.enableWillChange) {
    element.style.willChange = 'transform, opacity';
  }
  
  if (finalConfig.enableContentVisibility) {
    element.style.contentVisibility = 'auto';
  }
  
  if (finalConfig.enableContainment) {
    element.style.contain = 'layout style paint';
  }
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>): void => {
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    
    if (callNow) func(...args);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request animation frame utility
 */
export const raf = (callback: FrameRequestCallback): number => {
  return requestAnimationFrame(callback);
};

/**
 * Cancel animation frame utility
 */
export const caf = (id: number): void => {
  cancelAnimationFrame(id);
};

/**
 * Lazy loading intersection observer
 */
export const createLazyLoader = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

/**
 * Virtual scrolling utility
 */
export class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private visibleCount: number;
  private scrollTop: number = 0;
  private totalItems: number = 0;
  
  constructor(container: HTMLElement, itemHeight: number) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2; // Buffer items
    
    this.container.addEventListener('scroll', throttle(() => {
      this.scrollTop = this.container.scrollTop;
      this.render();
    }, 16)); // 60fps
  }
  
  setTotalItems(count: number) {
    this.totalItems = count;
    this.container.style.height = `${count * this.itemHeight}px`;
    this.render();
  }
  
  private render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + this.visibleCount, this.totalItems);
    
    // Emit render event with visible range
    this.container.dispatchEvent(new CustomEvent('virtualRender', {
      detail: { startIndex, endIndex, scrollTop: this.scrollTop }
    }));
  }
}

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fonts = [
    'Inter',
    'JetBrains Mono',
    'Poppins',
    'Space Grotesk',
    'Orbitron'
  ];
  
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = `https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600;700&display=swap`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Memory management utilities
 */
export const cleanupResources = () => {
  // Force garbage collection in development
  if (typeof window !== 'undefined' && (window as any).gc) {
    (window as any).gc();
  }
};

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  marks: new Map<string, number>(),
  
  mark(name: string) {
    this.marks.set(name, performance.now());
  },
  
  measure(startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark) || 0;
    const end = endMark ? this.marks.get(endMark) || performance.now() : performance.now();
    return end - start;
  },
  
  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.table(Array.from(this.marks.entries()));
    }
  }
};

/**
 * Component performance wrapper
 */
export const withPerformance = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) => {
  return React.memo((props: T) => {
    React.useEffect(() => {
      performanceMonitor.mark(`${componentName}-mount-start`);
      return () => {
        performanceMonitor.mark(`${componentName}-mount-end`);
        const mountTime = performanceMonitor.measure(
          `${componentName}-mount-start`,
          `${componentName}-mount-end`
        );
        
        if (process.env.NODE_ENV === 'development' && mountTime > 16) {
          console.warn(`${componentName} took ${mountTime.toFixed(2)}ms to mount`);
        }
      };
    }, []);
    
    return React.createElement(Component, props);
  });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Enable CSS containment for main containers (less aggressive)
  const containers = document.querySelectorAll('[data-container="true"]');
  containers.forEach(container => {
    const element = container as HTMLElement;
    // Only apply GPU acceleration, avoid heavy containment rules
    if (element.style.transform === '') {
      element.style.transform = 'translateZ(0)';
    }
    element.style.willChange = 'auto'; // Let browser decide
  });
  
  // Optimize scroll performance
  if ('CSS' in window && CSS.supports('overscroll-behavior', 'contain')) {
    document.body.style.overscrollBehavior = 'contain';
  }
  
  // Reduce animation frequency when tab is not visible
  let isTabVisible = true;
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (!isTabVisible) {
      // Pause heavy animations when tab is hidden
      document.body.classList.add('tab-hidden');
    } else {
      document.body.classList.remove('tab-hidden');
    }
  });
  
  // Optimize images loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Skip preloading fonts to reduce initial load time
  // preloadCriticalResources();
  
  // Disable performance observer in production for better performance
  if (process.env.NODE_ENV === 'development' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 200) { // Higher threshold
          console.warn(`Slow operation detected: ${entry.name} - ${entry.duration}ms`);
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // Ignore if not supported
    }
  }
};
