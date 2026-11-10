import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Star,
  Layers,
} from 'lucide-react';
import { CategoryBadge, StatusBadge, VerifiedBadge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';
import { Button } from '../components/common/Button';
import { BorrowRequestModal } from '../components/items/BorrowRequestModal';
import { LeaveReviewModal } from '../components/reviews/LeaveReviewModal';
import { ItemCard } from '../components/items/ItemCard';
import { itemService } from '../services/itemService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const wishlisted = isWishlisted(id);
  const isOwner = user && item && user._id === item.owner?._id;

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const [itemRes, similarRes, reviewsRes] = await Promise.all([
          itemService.getItemById(id),
          itemService.getSimilarItems(id),
          reviewService.getItemReviews(id),
        ]);

        if (itemRes.success) {
          setItem(itemRes.item);
        }
        if (similarRes.success) {
          setSimilarItems(similarRes.items || []);
        }
        if (reviewsRes.success) {
          setReviews(reviewsRes.reviews || []);
        }
      } catch (err) {
        setError('Resource not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-charcoal-500">Loading resource details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Resource Unavailable</h2>
        <p className="text-xs text-charcoal-600">{error}</p>
        <Button variant="primary" onClick={() => navigate('/explore')}>
          Browse Marketplace
        </Button>
      </div>
    );
  }

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-forest-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to items
      </button>

      {/* Hero Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-warmgray-100 border border-warmgray-200/90 relative shadow-subtle">
            <img
              src={images[selectedImage]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <CategoryBadge category={item.category} className="bg-white/95 backdrop-blur-md shadow-sm" />
              <StatusBadge status={item.availabilityStatus} />
            </div>

            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) toggleWishlist(item._id);
                else navigate('/auth');
              }}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                wishlisted
                  ? 'bg-rose-50 text-rose-600 shadow-md'
                  : 'bg-white/80 text-charcoal-600 hover:bg-white hover:text-rose-500 shadow-sm'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-forest-800 ring-2 ring-forest-600/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Rules */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200/90 shadow-subtle space-y-6">
            <div>
              <h3 className="text-base font-bold text-charcoal-900 mb-2 font-display">
                About this item
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div>
                <span className="text-xs font-bold text-charcoal-700 block mb-2">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-warmgray-100 text-charcoal-600 px-2.5 py-1 rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rules and Conditions */}
            <div className="bg-forest-50/60 rounded-2xl p-5 border border-forest-100 space-y-2">
              <span className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                Owner's Borrowing Guidelines
              </span>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {item.rulesAndConditions ||
                  'Please return item in clean condition. Pick up in person with photo ID verification.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Reservation & Owner Profile */}
        <div className="lg:col-span-5 space-y-6">
          {/* Reservation / Pricing Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-warmgray-200/90 shadow-premium space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-display leading-snug">
                {item.title}
              </h1>

              <div className="flex items-center justify-between text-xs text-charcoal-500">
                <span className="flex items-center gap-1 text-charcoal-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-forest-600" />
                  {item.location?.neighborhood}, {item.location?.city}
                </span>
                <RatingStars rating={item.rating || 5.0} reviewsCount={reviews.length} size="sm" />
              </div>
            </div>

            <div className="p-4 bg-warmgray-50 rounded-2xl border border-warmgray-200/70 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-charcoal-500 font-medium block">
                  Sharing Model
                </span>
                <span className="text-lg font-extrabold text-charcoal-900 font-display">
                  {item.sharingType === 'free' ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Free Community Share
                    </span>
                  ) : (
                    <>
                      ₹{item.pricePerDay?.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-charcoal-500"> / day</span>
                    </>
                  )}
                </span>
              </div>

              {item.depositAmount > 0 && (
                <div className="text-right">
                  <span className="text-[11px] text-charcoal-500 font-medium block">
                    Security Deposit
                  </span>
                  <span className="text-xs font-bold text-charcoal-800">
                    ₹{item.depositAmount?.toLocaleString('en-IN')} (refundable)
                  </span>
                </div>
              )}
            </div>

            {/* Action CTA */}
            {isOwner ? (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200 text-center font-medium">
                You are the owner of this listing.
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-md"
                disabled={item.availabilityStatus === 'borrowed'}
                onClick={() => {
                  if (isAuthenticated) setIsRequestModalOpen(true);
                  else navigate(`/auth?redirect=/items/${item._id}`);
                }}
              >
                {item.availabilityStatus === 'borrowed'
                  ? 'Currently on Loan'
                  : 'Request to Borrow'}
              </Button>
            )}

            <div className="space-y-2 text-xs text-charcoal-500 pt-2 border-t border-warmgray-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero service fees for community sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
                <span>Security deposit protected by CommunityShare</span>
              </div>
            </div>
          </div>

          {/* Owner Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-4">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider block">
              Item Lender
            </span>

            <div className="flex items-center gap-3.5">
              <img
                src={item.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={item.owner?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-forest-200"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-charcoal-800">{item.owner?.name}</h4>
                  <VerifiedBadge />
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-500 mt-0.5">
                  <RatingStars rating={item.owner?.rating || 4.9} size="sm" showText={true} />
                  <span>• {item.owner?.location?.neighborhood}</span>
                </div>
              </div>
            </div>

            {item.owner?.bio && (
              <p className="text-xs text-charcoal-600 leading-relaxed italic">
                "{item.owner.bio}"
              </p>
            )}

            {!isOwner && (
              <Button
                variant="outline"
                size="sm"
                icon={MessageSquare}
                className="w-full"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(`/chat?target=${item.owner?._id}&itemId=${item._id}`);
                  } else {
                    navigate('/auth');
                  }
                }}
              >
                Message {item.owner?.name?.split(' ')[0]}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews & Trust Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-warmgray-200/90 shadow-subtle space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warmgray-100">
          <div>
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
              Neighbor Experiences
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-display mt-0.5">
              Reviews & Ratings ({reviews.length})
            </h3>
          </div>

          {!isOwner && isAuthenticated && (
            <Button
              variant="secondary"
              size="sm"
              icon={Star}
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write a Review
            </Button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-charcoal-500">
            No reviews yet for this resource. Be the first neighbor to borrow and share feedback!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 bg-warmgray-50/80 rounded-2xl border border-warmgray-200/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.author?.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-charcoal-800">{rev.author?.name}</p>
                      <p className="text-[10px] text-charcoal-400">
                        {rev.author?.location?.neighborhood || 'San Francisco'}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" showText={false} />
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Similar Items Section */}
      {similarItems.length > 0 && (
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
              More in {item.category}
            </span>
            <h3 className="text-xl font-bold text-charcoal-900 font-display mt-0.5">
              Similar Resources You Might Need
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarItems.map((sim) => (
              <ItemCard key={sim._id} item={sim} />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <BorrowRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        item={item}
      />

      <LeaveReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        item={item}
        targetUser={item.owner}
        onReviewSubmitted={(newRev) => setReviews((prev) => [newRev, ...prev])}
      />
    </div>
  );
};
