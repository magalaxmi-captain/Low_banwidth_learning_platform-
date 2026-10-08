import React from 'react';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'amber' | 'slate' | 'outline' | 'cyan' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-wide rounded-2xl transition-all select-none cursor-pointer focus:outline-none';

  // Tactile 3D bottom bevel with press-down translateY
  const variantStyles = {
    primary:
      'bg-emerald-500 text-white border-b-4 border-emerald-700 hover:bg-emerald-400 active:border-b-0 active:translate-y-1 shadow-sm',
    amber:
      'bg-amber-500 text-slate-900 border-b-4 border-amber-700 hover:bg-amber-400 active:border-b-0 active:translate-y-1 shadow-sm',
    slate:
      'bg-slate-800 text-white border-b-4 border-slate-950 hover:bg-slate-700 active:border-b-0 active:translate-y-1 shadow-sm',
    outline:
      'bg-white text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5 shadow-sm',
    cyan:
      'bg-cyan-500 text-white border-b-4 border-cyan-700 hover:bg-cyan-400 active:border-b-0 active:translate-y-1 shadow-sm',
    danger:
      'bg-rose-500 text-white border-b-4 border-rose-700 hover:bg-rose-400 active:border-b-0 active:translate-y-1 shadow-sm',
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[36px]',
    md: 'px-5 py-3 text-sm rounded-2xl min-h-[48px]',
    lg: 'px-6 py-4 text-base rounded-2xl min-h-[54px] font-extrabold uppercase tracking-wider',
    icon: 'w-12 h-12 p-0 rounded-2xl flex items-center justify-center',
  }[size];

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed active:translate-y-0 active:border-b-4 hover:bg-slate-300 pointer-events-none'
    : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${fullWidth ? 'w-full' : ''} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
