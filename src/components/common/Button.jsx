import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-p focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const sizeStyles = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-5 text-base rounded-xl gap-2.5',
    icon: 'w-10 h-10 p-0 rounded-xl',
    'icon-sm': 'w-8 h-8 p-0 rounded-lg',
  };

  const variantStyles = {
    primary: 'bg-p text-white hover:bg-[#5B4BD6] active:bg-[#4E3EC4] shadow-sm',
    secondary: 'bg-lav text-p hover:bg-[#E3DCFD] active:bg-[#D5CAFC]',
    ghost: 'bg-white border border-line text-ink hover:bg-lav hover:text-p active:bg-[#EAE5FC]',
    outline: 'border border-line bg-transparent text-ink hover:bg-slate-100/70',
    danger: 'bg-red-50 text-err border border-red-200 hover:bg-red-100',
    'danger-solid': 'bg-err text-white hover:bg-red-600',
    link: 'p-0 h-auto bg-transparent text-p hover:underline',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
}
