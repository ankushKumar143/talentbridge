import React from 'react';

export default function Skeleton({ className = 'h-24', rounded = 'rounded-2xl' }) {
  return <div className={`sk ${rounded} ${className}`} />;
}
