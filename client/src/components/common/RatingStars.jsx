import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 5,
  reviewsCount = null,
  interactive = false,
  onRatingChange = () => {},
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="inline-flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const filled = starValue <= Math.round(rating);
          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange(starValue)}
              className={`${
                interactive
                  ? 'cursor-pointer hover:scale-125 transition-transform'
                  : 'cursor-default'
              } p-0.5 text-amber-400`}
            >
              <Star
                className={`${starSize} ${
                  filled ? 'fill-amber-400 text-amber-400' : 'text-warmgray-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-xs font-semibold text-charcoal-700">
          {Number(rating).toFixed(1)}
          {reviewsCount !== null && (
            <span className="text-charcoal-400 font-normal ml-1">
              ({reviewsCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
