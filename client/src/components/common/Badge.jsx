import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon = null,
}) => {
  const variants = {
    default: 'bg-warmgray-100 text-charcoal-700 border-warmgray-200',
    forest: 'bg-forest-50 text-forest-800 border-forest-200/60',
    sage: 'bg-sage-100 text-forest-900 border-sage-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    sky: 'bg-sky-50 text-sky-800 border-sky-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
    lg: 'text-sm px-3 py-1.5 rounded-xl font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export const CategoryBadge = ({ category, className = '' }) => {
  const categoryStyles = {
    Electronics: 'bg-blue-50 text-blue-800 border-blue-200/70',
    Books: 'bg-amber-50 text-amber-800 border-amber-200/70',
    Furniture: 'bg-orange-50 text-orange-800 border-orange-200/70',
    'Sports Equipment': 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
    'Kitchen Appliances': 'bg-rose-50 text-rose-800 border-rose-200/70',
    Tools: 'bg-stone-100 text-stone-800 border-stone-300/70',
    Clothing: 'bg-purple-50 text-purple-800 border-purple-200/70',
    Other: 'bg-slate-100 text-slate-800 border-slate-300/70',
  };

  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium border ${
        categoryStyles[category] || categoryStyles.Other
      } ${className}`}
    >
      {category}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'available':
      return (
        <Badge variant="success" size="sm" icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}>
          Available
        </Badge>
      );
    case 'borrowed':
      return (
        <Badge variant="warning" size="sm" icon={<span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}>
          On Loan
        </Badge>
      );
    case 'reserved':
      return (
        <Badge variant="sky" size="sm">
          Reserved
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="warning" size="sm">
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}>
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="rose" size="sm">
          Declined
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="forest" size="sm" icon={<Sparkles className="w-3 h-3 text-forest-600" />}>
          Completed
        </Badge>
      );
    default:
      return <Badge size="sm">{status}</Badge>;
  }
};

export const VerifiedBadge = ({ label = 'Verified Neighbor' }) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-200/60">
    <ShieldCheck className="w-3 h-3 text-forest-600" />
    <span>{label}</span>
  </span>
);
