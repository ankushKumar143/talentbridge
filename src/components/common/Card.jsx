import React from 'react';

export function CardHeader({ children, right, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {typeof children === 'string' ? (
        <h2 className="text-lg font-semibold text-ink tracking-tight">{children}</h2>
      ) : (
        children
      )}
      {right && <div>{right}</div>}
    </div>
  );
}

export default function Card({
  children,
  className = '',
  as: Component = 'section',
  onClick,
  hoverable = false,
  ...props
}) {
  const hoverClass = hoverable
    ? 'hover:border-p2 hover:shadow-[0_4px_16px_rgba(108,92,231,0.08)] transition-all duration-200 cursor-pointer'
    : '';

  return (
    <Component
      onClick={onClick}
      className={`bg-white border border-line rounded-2xl shadow-[0_1px_2px_rgba(32,32,57,0.04)] ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
