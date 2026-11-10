import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  X,
  Filter,
} from 'lucide-react';
import { ItemCard } from '../components/items/ItemCard';
import { ItemCardSkeleton } from '../components/items/ItemCardSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { itemService } from '../services/itemService';

export const ExplorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialSharingType = queryParams.get('sharingType') || 'all';

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sharingType, setSharingType] = useState(initialSharingType);
  const [availability, setAvailability] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [locationQuery, setLocationQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Items data state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const categories = [
    'All',
    'Tools',
    'Electronics',
    'Sports Equipment',
    'Kitchen Appliances',
    'Furniture',
    'Books',
    'Clothing',
    'Other',
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        sharingType: sharingType !== 'all' ? sharingType : undefined,
        availability: availability !== 'all' ? availability : undefined,
        maxPrice: maxPrice < 5000 ? maxPrice : undefined,
        location: locationQuery.trim() || undefined,
        sort,
      };

      const res = await itemService.getItems(params);
      if (res.success) {
        setItems(res.items || []);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, sharingType, availability, maxPrice, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSharingType('all');
    setAvailability('all');
    setMaxPrice(5000);
    setLocationQuery('');
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-warmgray-200/90 shadow-subtle space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools, cameras, camping tents, lawnmowers..."
              className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800 placeholder:text-charcoal-400"
            />
          </div>

          {/* Location input */}
          <div className="relative sm:w-64">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-600" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Neighborhood or city..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800 placeholder:text-charcoal-400"
            />
          </div>

          <Button variant="primary" type="submit" size="md">
            Search
          </Button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                category === cat
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-warmgray-100 text-charcoal-700 hover:bg-forest-50 hover:text-forest-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-warmgray-100">
            <span className="text-sm font-bold text-charcoal-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-forest-700" />
              Filter Marketplace
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-forest-700 hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Sharing Type */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Sharing Type
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'free', label: 'Free Community Share' },
                { id: 'rent', label: 'Daily Rental Rate' },
              ].map((t) => (
                <label key={t.id} className="flex items-center gap-2 cursor-pointer text-charcoal-700 hover:text-forest-800">
                  <input
                    type="radio"
                    name="sharingType"
                    checked={sharingType === t.id}
                    onChange={() => setSharingType(t.id)}
                    className="accent-forest-800"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Availability
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All statuses' },
                { id: 'available', label: 'Available now' },
                { id: 'borrowed', label: 'Currently borrowed' },
              ].map((a) => (
                <label key={a.id} className="flex items-center gap-2 cursor-pointer text-charcoal-700 hover:text-forest-800">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === a.id}
                    onChange={() => setAvailability(a.id)}
                    className="accent-forest-800"
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              <span>Max Price / Day</span>
              <span className="text-forest-800">₹{maxPrice >= 5000 ? 'Any' : maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-forest-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400">
              <span>₹0</span>
              <span>₹2,500</span>
              <span>₹5,000+</span>
            </div>
          </div>
        </div>

        {/* Items Listing Section */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Sort & View Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-warmgray-200/90 shadow-subtle">
            <span className="text-xs font-semibold text-charcoal-600">
              Showing <span className="font-bold text-charcoal-900">{totalCount}</span> resources
            </span>

            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-500 font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-warmgray-300 bg-warmgray-50 focus:outline-none focus:ring-2 focus:ring-forest-600 font-semibold text-charcoal-800"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* Grid / List toggle */}
              <div className="flex items-center p-1 bg-warmgray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-forest-900 shadow-sm' : 'text-charcoal-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-forest-900 shadow-sm' : 'text-charcoal-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Display */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No resources matched your filters"
              description="Try widening your search terms, adjusting category filters, or exploring neighboring zip codes."
              actionLabel="Clear all filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
