import React from 'react';
import { Button } from './Button';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search filters or check back later.',
  actionLabel = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/70 rounded-2xl border border-warmgray-200/80 shadow-subtle ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-charcoal-800 mb-1.5">{title}</h3>
      <p className="text-sm text-charcoal-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
