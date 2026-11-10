import React from 'react';

export const ItemCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-warmgray-200/90 overflow-hidden shadow-subtle animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] w-full bg-warmgray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-warmgray-200 rounded w-4/5" />
        <div className="flex items-center justify-between">
          <div className="h-3 bg-warmgray-200 rounded w-1/3" />
          <div className="h-3 bg-warmgray-200 rounded w-1/4" />
        </div>
        <div className="border-t border-warmgray-100 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-warmgray-200" />
            <div className="h-3 bg-warmgray-200 rounded w-16" />
          </div>
          <div className="h-7 w-16 bg-warmgray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
