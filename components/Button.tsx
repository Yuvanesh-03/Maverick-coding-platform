import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'primary-gradient' | 'success-gradient';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, size = 'md', className, loading, ...props }) => {
  const baseClasses = "font-semibold inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0d1117] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] focus:ring-blue-500 rounded-lg',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500 rounded-lg',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 rounded-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 rounded-lg',
    'primary-gradient': 'bg-gradient-to-r from-[#4299e6] to-[#38b2ac] text-white hover:shadow-lg hover:shadow-teal-500/40 focus:ring-[#38b2ac] rounded-lg',
    'success-gradient': 'bg-gradient-to-r from-[#48bb78] to-[#38a169] text-white hover:brightness-110 focus:ring-[#48bb78] rounded-[6px]',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs h-auto',
    md: 'px-4 py-2 text-sm h-auto',
    lg: 'px-6 py-3 text-base h-auto',
  };

  // Override height for specific variants
  const heightClass = (variant === 'primary-gradient' || variant === 'success-gradient' || variant === 'secondary') && (size === 'md') ? '!h-[40px]' : '';


  const finalProps = { ...props, disabled: props.disabled || loading };

  const spinnerColorClass = variant === 'primary' ? 'text-white' : 'text-gray-500 dark:text-gray-400';

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${heightClass} ${className}`} {...finalProps}>
      {loading ? (
        <SpinnerIcon className={`h-5 w-5 ${spinnerColorClass}`} />
      ) : (
        <>
          {icon && <span className="mr-2 -ml-1">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;