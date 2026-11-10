import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';
import { ItemCard } from '../components/items/ItemCard';
import { EmptyState } from '../components/common/EmptyState';
import { authService } from '../services/authService';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await authService.getWishlist();
        if (res.success) {
          setItems(res.items || []);
        }
      } catch (err) {
        console.warn('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
          Saved Resources
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display mt-0.5">
          My Wishlist & Favorites
        </h1>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-charcoal-400">Loading saved items...</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Click the heart icon on any resource card to save it for future DIY projects, weekend trips, or garden work."
          actionLabel="Explore Items"
          onAction={() => navigate('/explore')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
