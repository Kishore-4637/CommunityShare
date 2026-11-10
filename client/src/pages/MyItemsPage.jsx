import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Package,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { itemService } from '../services/itemService';
import { requestService } from '../services/requestService';

export const MyItemsPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'borrowed' | 'lent'
  const [myItems, setMyItems] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [lentItems, setLentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, incomingRes, outgoingRes] = await Promise.all([
        itemService.getMyListings(),
        requestService.getIncomingRequests(),
        requestService.getOutgoingRequests(),
      ]);

      if (itemsRes.success) setMyItems(itemsRes.items || []);
      if (incomingRes.success) {
        // Items lent out = approved incoming requests
        setLentItems(incomingRes.requests.filter((r) => r.status === 'approved'));
      }
      if (outgoingRes.success) {
        // Items borrowed = approved outgoing requests
        setBorrowedItems(outgoingRes.requests.filter((r) => r.status === 'approved'));
      }
    } catch (err) {
      console.warn('Failed to load my items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const res = await itemService.deleteItem(itemToDelete._id);
      if (res.success) {
        setMyItems((prev) => prev.filter((i) => i._id !== itemToDelete._id));
        setItemToDelete(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Inventory & Asset Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display mt-0.5">
            My Sharing Activities
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => navigate('/create-listing')}
        >
          Add New Listing
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-warmgray-200/80 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          My Listed Items ({myItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('borrowed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'borrowed'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Items I'm Borrowing ({borrowedItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lent'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          <Repeat className="w-4 h-4" />
          Items I've Lent ({lentItems.length})
        </button>
      </div>

      {/* Tab 1: My Listed Items */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-charcoal-400">Loading listings...</div>
          ) : myItems.length === 0 ? (
            <EmptyState
              title="You haven't listed any items yet"
              description="Share household appliances, DIY tools, or camping equipment with neighbors nearby."
              actionLabel="Create your first listing"
              onAction={() => navigate('/create-listing')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-warmgray-200/90 shadow-subtle overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] bg-warmgray-100 relative overflow-hidden">
                    <img
                      src={
                        item.images?.[0] ||
                        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={item.availabilityStatus} />
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-charcoal-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-warmgray-100">
                      <span className="font-bold text-charcoal-900">
                        {item.sharingType === 'free' ? 'Free' : `₹${item.pricePerDay?.toLocaleString('en-IN')}/day`}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/items/${item._id}`}
                          className="p-2 text-charcoal-500 hover:text-forest-800 hover:bg-forest-50 rounded-xl transition-colors"
                          title="View public page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Items I'm Borrowing */}
      {activeTab === 'borrowed' && (
        <div className="space-y-4">
          {borrowedItems.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No active borrowed items"
              description="Explore items in your community to request tools or gear."
              actionLabel="Browse Marketplace"
              onAction={() => navigate('/explore')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowedItems.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl p-5 border border-warmgray-200/90 shadow-subtle flex items-center gap-4"
                >
                  <img
                    src={req.item?.images?.[0]}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-charcoal-900 truncate">
                      {req.item?.title}
                    </h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Lender: <span className="font-semibold">{req.owner?.name}</span>
                    </p>
                    <p className="text-xs text-emerald-700 font-medium mt-1">
                      Due: {new Date(req.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/chat?target=${req.owner?._id}&itemId=${req.item?._id}`}
                    className="text-xs font-semibold text-forest-800 bg-forest-50 px-3 py-1.5 rounded-xl hover:bg-forest-100"
                  >
                    Contact
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Items Lent to Others */}
      {activeTab === 'lent' && (
        <div className="space-y-4">
          {lentItems.length === 0 ? (
            <EmptyState
              icon={Repeat}
              title="No items currently lent out"
              description="When neighbors borrow your listed items, active loans will show up here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lentItems.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl p-5 border border-warmgray-200/90 shadow-subtle flex items-center gap-4"
                >
                  <img
                    src={req.item?.images?.[0]}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-charcoal-900 truncate">
                      {req.item?.title}
                    </h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Borrower: <span className="font-semibold">{req.requester?.name}</span>
                    </p>
                    <p className="text-xs text-forest-700 font-medium mt-1">
                      Return Date: {new Date(req.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/chat?target=${req.requester?._id}&itemId=${req.item?._id}`}
                    className="text-xs font-semibold text-forest-800 bg-forest-50 px-3 py-1.5 rounded-xl hover:bg-forest-100"
                  >
                    Contact
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Delete Resource Listing"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-xs text-charcoal-600">
            Are you sure you want to delete{' '}
            <span className="font-bold text-charcoal-800">"{itemToDelete?.title}"</span>? All
            active associations and search appearances will be removed.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setItemToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              isLoading={isDeleting}
              onClick={handleDeleteItem}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
