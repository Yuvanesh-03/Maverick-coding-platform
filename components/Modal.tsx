import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
  showConfetti?: boolean;
}

const Confetti: React.FC = () => {
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            '--color1': '#4299e6', // blue
            '--color2': '#38b2ac', // teal
            '--color3': '#68d391', // green
        };
        const colorClass = ['bg-[#4299e6]', 'bg-[#38b2ac]', 'bg-[#68d391]'][i % 3];
        return <div key={i} className={`confetti ${colorClass}`} style={style as React.CSSProperties}></div>;
    });
    return <div className="absolute inset-0 pointer-events-none overflow-hidden">{confettiPieces}</div>;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', showConfetti = false }) => {
  if (!isOpen) return null;

  const sizeClasses = {
      md: 'max-w-md',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      '2xl': 'max-w-6xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 animate-fade-in"
      style={{ zIndex: 9999 }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl w-full mx-auto transform animate-scale-in ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
        style={{ zIndex: 10000 }}
      >
        {showConfetti && <Confetti />}
        {title && (
          <div className="flex justify-between items-center mb-4 p-6 pb-0">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors z-10"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className={title ? "text-gray-600 dark:text-gray-300 px-6 pb-6" : "text-gray-600 dark:text-gray-300"}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;