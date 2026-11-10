import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  ShieldCheck,
  Leaf,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Repeat,
  DollarSign,
  HeartHandshake,
  Star,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ItemCard } from '../components/items/ItemCard';
import { itemService } from '../services/itemService';
import { statsService } from '../services/statsService';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    activeMembers: 1248,
    resourcesShared: 3892,
    successfulBorrows: 8520,
    communitySavingsINR: 12500000,
    carbonOffsetKg: 28900,
    communityRating: 4.9,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          itemService.getFeaturedItems(),
          statsService.getPlatformStats(),
        ]);
        if (itemsRes.success) setFeaturedItems(itemsRes.items || []);
        if (statsRes.success) setPlatformStats(statsRes.stats);
      } catch (err) {
        console.warn('Error fetching landing data:', err);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Tools', count: '140+ items', icon: '🔨', color: 'bg-stone-50 text-stone-800' },
    { name: 'Electronics', count: '90+ items', icon: '📷', color: 'bg-blue-50 text-blue-800' },
    { name: 'Sports Equipment', count: '120+ items', icon: '⛺', color: 'bg-emerald-50 text-emerald-800' },
    { name: 'Kitchen Appliances', count: '85+ items', icon: '🍳', color: 'bg-rose-50 text-rose-800' },
    { name: 'Furniture', count: '60+ items', icon: '🪑', color: 'bg-orange-50 text-orange-800' },
    { name: 'Books', count: '210+ items', icon: '📚', color: 'bg-amber-50 text-amber-800' },
  ];

  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Urban Gardener',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: 'Instead of buying an expensive ₹22,000 pressure washer used once a year, I borrowed one from Marcus down the street and lent my dehydrator to someone baking sourdough. CommunityShare transformed our neighborhood.',
      rating: 5,
      neighborhood: 'Indiranagar',
    },
    {
      name: 'David Miller',
      role: 'Audio Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      text: 'The deposit protection and transparent rating system make sharing high-value gear totally stress-free. Met 6 fantastic neighbors I now call good friends.',
      rating: 5,
      neighborhood: 'Whitefield',
    },
    {
      name: 'Sophia Chen',
      role: 'Photographer & Trekker',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      text: 'Borrowed a 4-season tent for a Western Ghats trek. Flawless communication, spotless gear, and saved over ₹15,000 compared to commercial rentals.',
      rating: 5,
      neighborhood: 'HSR Layout',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden bg-subtle-grid">
        {/* Soft glowing ambient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-forest-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-sage-200/35 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-200/80 text-forest-800 text-xs font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-forest-600" />
                <span>The Modern Neighborhood Sharing Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight font-display leading-[1.12]">
                Share More.{' '}
                <span className="text-forest-700 underline decoration-sage-300 decoration-wavy decoration-2">
                  Own Less.
                </span>{' '}
                Build Community.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Why purchase items you only need once a year? Borrow power tools, camping gear,
                cameras, and culinary equipment directly from trusted neighbors near you.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Compass}
                  onClick={() => navigate('/explore')}
                  className="shadow-premium"
                >
                  Explore Items
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={PlusCircle}
                  onClick={() => navigate('/create-listing')}
                >
                  Start Sharing
                </Button>
              </div>

              {/* Trust highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-charcoal-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified neighbor profiles
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-forest-600" /> Secure deposit guarantee
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Leaf className="w-4 h-4 text-forest-600" /> Zero waste footprint
                </span>
              </div>
            </motion.div>

            {/* Right Floating Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Primary Card */}
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden bg-white shadow-2xl border border-warmgray-200/90 p-4 transform hover:scale-[1.01] transition-all">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-warmgray-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=80"
                    alt="DeWalt Cordless Drill"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-forest-900 shadow-sm">
                    Tools • Free Borrow
                  </div>
                  <div className="absolute bottom-3 right-3 bg-forest-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md">
                    ★ 4.9 (12 reviews)
                  </div>
                </div>

                <div className="pt-3.5 space-y-2">
                  <h3 className="font-bold text-charcoal-800 text-sm">
                    DeWalt 20V Cordless Drill & Impact Driver
                  </h3>
                  <div className="flex items-center justify-between text-xs text-charcoal-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Available in Indiranagar
                    </span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ₹0 / day
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 - Top Left */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-warmgray-200 flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800 font-bold">
                  🌱
                </div>
                <div>
                  <p className="text-[11px] text-charcoal-400 font-medium">Eco Impact</p>
                  <p className="text-xs font-bold text-charcoal-800">
                    28,900 kg CO₂ Saved
                  </p>
                </div>
              </motion.div>

              {/* Floating Badge 2 - Bottom Right */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-warmgray-200 flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  🤝
                </div>
                <div>
                  <p className="text-[11px] text-charcoal-400 font-medium">Verified Borrow</p>
                  <p className="text-xs font-bold text-charcoal-800">
                    8,500+ Items Exchanged
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-forest-800">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Community Momentum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display">
              Real Impact Across Our Neighborhoods
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-forest-800">
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-display">
                ₹{((platformStats.communitySavingsINR || 12500000) / 100000).toFixed(0)} Lakhs+
              </p>
              <p className="text-xs text-forest-200/80 mt-1.5 font-medium">
                Community Rupees Saved
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-display">
                {platformStats.successfulBorrows.toLocaleString()}+
              </p>
              <p className="text-xs text-forest-200/80 mt-1.5 font-medium">
                Successful Borrows
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-display">
                {(platformStats.carbonOffsetKg / 1000).toFixed(1)} tons
              </p>
              <p className="text-xs text-forest-200/80 mt-1.5 font-medium">
                CO₂ Emissions Offset
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-display">
                {platformStats.communityRating} ★
              </p>
              <p className="text-xs text-forest-200/80 mt-1.5 font-medium">
                Average Neighbor Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1 font-display">
              What would you like to borrow today?
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1 group"
          >
            Explore all items
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/explore?category=${encodeURIComponent(cat.name)}`}
              className="group p-5 bg-white rounded-2xl border border-warmgray-200/80 hover:border-forest-300 hover:shadow-premium transition-all text-center flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform duration-200">
                {cat.icon}
              </span>
              <h3 className="font-bold text-charcoal-800 text-xs group-hover:text-forest-800 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] text-charcoal-400 font-medium">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
              Popular Nearby
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1 font-display">
              Featured Community Resources
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/explore')}
          >
            View Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.slice(0, 8).map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-forest-50/70 border-y border-forest-100/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Simple & Safe
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
              How CommunityShare Works
            </h2>
            <p className="text-sm text-charcoal-600">
              Four easy steps to share resources and connect with your neighborhood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-warmgray-200/80 shadow-subtle relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-charcoal-800 mb-1">
                Discover Nearby
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Browse hundreds of items listed by neighbors in your zip code. Filter by category, availability, or free sharing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-warmgray-200/80 shadow-subtle relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-charcoal-800 mb-1">
                Request to Borrow
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Choose your pickup and return dates, add a friendly introduction, and submit your borrow request.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-warmgray-200/80 shadow-subtle relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-charcoal-800 mb-1">
                Handshake Pickup
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Coordinate pickup time with real-time in-app messaging. Meet your neighbor and inspect the item.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-warmgray-200/80 shadow-subtle relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-charcoal-800 mb-1">
                Return & Review
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Return the item on time and in good condition. Exchange 5-star ratings to build community trust!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Voices of Trust
          </span>
          <h2 className="text-3xl font-extrabold text-charcoal-900 font-display">
            Loved by Neighborhoods Everywhere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-warmgray-200/80 shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-warmgray-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-warmgray-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-charcoal-800">{t.name}</h4>
                  <p className="text-[11px] text-charcoal-500">
                    {t.role} • {t.neighborhood}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-forest-800 text-white rounded-3xl p-10 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Ready to meet your neighbors and start sharing?
            </h2>
            <p className="text-sm sm:text-base text-forest-100/90 leading-relaxed font-normal">
              Join thousands of neighbors reducing waste, saving money, and building vibrant communities.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/auth?tab=register')}
              >
                Create Free Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/explore')}
                className="text-white border-white/40 hover:bg-white/10"
              >
                Browse All Resources
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
