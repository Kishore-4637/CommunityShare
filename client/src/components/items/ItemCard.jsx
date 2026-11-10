import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Sparkles } from 'lucide-react';
import { CategoryBadge, StatusBadge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const ItemCard = ({ item, onQuickBorrow = null }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const wishlisted = isWishlisted(item._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleWishlist(item._id);
    } else {
      window.location.href = '/auth?redirect=/explore';
    }
  };

  const imageSrc =
    item.images && item.images.length > 0
      ? item.images[0]
      : 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col bg-white rounded-2xl border border-warmgray-200/90 overflow-hidden shadow-subtle hover:shadow-premium-hover transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/items/${item._id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-warmgray-100 block">
        <img
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <CategoryBadge category={item.category} className="shadow-sm backdrop-blur-md bg-white/95" />
          {item.availabilityStatus !== 'available' && (
            <StatusBadge status={item.availabilityStatus} />
          )}
        </div>

        {/* Heart Favorite Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-charcoal-600 hover:bg-white hover:text-rose-500 hover:scale-110 shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Bottom Price Chip in Image */}
        <div className="absolute bottom-3 left-3 z-10">
          {item.sharingType === 'free' ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-semibold text-xs px-2.5 py-1 rounded-lg shadow-md">
              <Sparkles className="w-3 h-3" />
              Free Borrow
            </span>
          ) : (
            <span className="bg-charcoal-900/90 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-md">
              ₹{item.pricePerDay?.toLocaleString('en-IN')}
              <span className="text-[10px] font-normal text-warmgray-300">/day</span>
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link to={`/items/${item._id}`}>
          <h3 className="text-base font-semibold text-charcoal-800 line-clamp-1 group-hover:text-forest-800 transition-colors">
            {item.title}
          </h3>
        </Link>

        {/* Location & Reviews */}
        <div className="flex items-center justify-between text-xs text-charcoal-500 mt-2">
          <span className="inline-flex items-center gap-1 line-clamp-1 text-charcoal-600">
            <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
            {item.location?.neighborhood || 'Local Community'}, {item.location?.city || 'SF'}
          </span>
          <RatingStars rating={item.rating || 5.0} size="sm" showText={true} />
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-warmgray-100" />

        {/* Owner Info & CTA */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-2">
            <img
              src={item.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={item.owner?.name || 'Owner'}
              className="w-6 h-6 rounded-full object-cover border border-warmgray-200"
            />
            <span className="text-xs font-medium text-charcoal-700 line-clamp-1 max-w-[110px]">
              {item.owner?.name || 'Neighbor'}
            </span>
          </div>

          <Link
            to={`/items/${item._id}`}
            className="text-xs font-semibold text-forest-800 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
