import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      const ids = Array.isArray(user.wishlist)
        ? user.wishlist.map((item) => (typeof item === 'object' ? item._id : item))
        : [];
      setWishlistIds(ids);
    } else {
      setWishlistIds([]);
    }
  }, [isAuthenticated, user]);

  const toggleWishlist = async (itemId) => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      const res = await authService.toggleWishlist(itemId);
      if (res.success) {
        setWishlistIds((prev) => {
          if (prev.includes(itemId)) {
            return prev.filter((id) => id !== itemId);
          } else {
            return [...prev, itemId];
          }
        });
        return res.isWishlisted;
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const isWishlisted = (itemId) => {
    if (!itemId) return false;
    return wishlistIds.includes(itemId.toString());
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
