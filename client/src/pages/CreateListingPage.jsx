import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../components/common/Button';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tools');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [sharingType, setSharingType] = useState('free'); // 'free' | 'rent'
  const [pricePerDay, setPricePerDay] = useState(0);
  const [depositAmount, setDepositAmount] = useState(500);
  const [neighborhood, setNeighborhood] = useState(user?.location?.neighborhood || 'Mission District');
  const [city, setCity] = useState(user?.location?.city || 'San Francisco');
  const [rulesAndConditions, setRulesAndConditions] = useState(
    'Please treat this item with respect and return it clean and on schedule.'
  );

  // Images state (files + previews)
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Tools',
    'Electronics',
    'Sports Equipment',
    'Kitchen Appliances',
    'Furniture',
    'Books',
    'Clothing',
    'Other',
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const newFiles = [...imageFiles, ...files].slice(0, 6);
    setImageFiles(newFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const validateStep = (currentStep) => {
    setError('');
    if (currentStep === 1) {
      if (!title.trim()) {
        setError('Please enter a descriptive item title.');
        return false;
      }
      if (!description.trim() || description.length < 20) {
        setError('Please provide at least 20 characters in the description.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (sharingType === 'rent' && (!pricePerDay || Number(pricePerDay) <= 0)) {
        setError('Please set a valid price per day for rental items.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('sharingType', sharingType);
      formData.append('pricePerDay', String(sharingType === 'rent' ? pricePerDay : 0));
      formData.append('depositAmount', String(depositAmount || 0));
      formData.append('neighborhood', neighborhood);
      formData.append('city', city);
      formData.append('rulesAndConditions', rulesAndConditions);
      formData.append('tags', tagsInput);

      // Attach image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
      } else {
        // Fallback default image based on category
        const defaultCategoryImages = {
          Tools: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
          Electronics: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
          'Sports Equipment': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
          'Kitchen Appliances': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80',
        };
        formData.append(
          'imageUrls',
          defaultCategoryImages[category] ||
            'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80'
        );
      }

      const res = await itemService.createItem(formData);
      if (res.success) {
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}

        setTimeout(() => {
          navigate(`/items/${res.item._id}`);
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish listing. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title & Progress Header */}
      <div className="space-y-4 text-center sm:text-left">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Share an Asset
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 font-display mt-0.5">
            List an Item for Your Community
          </h1>
        </div>

        {/* Multi-step progress bar */}
        <div className="flex items-center justify-between relative pt-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-warmgray-200 -translate-y-1/2 -z-10" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-forest-800 -translate-y-1/2 -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Pricing' },
            { num: 3, label: 'Media & Rules' },
            { num: 4, label: 'Review' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-forest-800 text-white shadow-sm ring-4 ring-forest-100'
                    : 'bg-white text-charcoal-400 border border-warmgray-300'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.num}
              </div>
              <span className="text-[11px] font-semibold text-charcoal-600 mt-1.5 hidden sm:inline">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200/90 shadow-premium space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bosch Professional Rotary Laser Level Kit"
                  maxLength={100}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800 font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail what is included, state of repair, accessories, instructions..."
                  className="w-full text-xs p-3 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. laser, level, bosch, construction"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Pricing & Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-charcoal-700">
                  Sharing Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSharingType('free')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      sharingType === 'free'
                        ? 'border-forest-800 bg-forest-50/50 shadow-sm'
                        : 'border-warmgray-200 hover:border-warmgray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-forest-900">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Free Community Share
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Lend freely to build karma and mutual aid in your area.
                    </p>
                  </div>

                  <div
                    onClick={() => setSharingType('rent')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      sharingType === 'rent'
                        ? 'border-forest-800 bg-forest-50/50 shadow-sm'
                        : 'border-warmgray-200 hover:border-warmgray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-forest-900">
                      <DollarSign className="w-4 h-4 text-forest-700" />
                      Daily Rental Rate
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Charge an affordable daily fee for high-value equipment.
                    </p>
                  </div>
                </div>
              </div>

              {sharingType === 'rent' && (
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Daily Rate (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Refundable Security Deposit (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                />
                <span className="text-[11px] text-charcoal-400 mt-1 block">
                  Refunded automatically once you confirm the item is returned in good order.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Photos & Rules */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                  Item Photos (up to 6)
                </label>

                <div className="border-2 border-dashed border-warmgray-300 rounded-2xl p-6 text-center hover:border-forest-400 transition-colors bg-warmgray-50/50">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-forest-700 mb-2" />
                    <span className="text-xs font-bold text-forest-800 hover:underline">
                      Click to upload photos
                    </span>
                    <span className="text-[11px] text-charcoal-400 mt-1">
                      PNG, JPG, WEBP up to 5MB each
                    </span>
                  </label>
                </div>

                {/* Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-3">
                    {imagePreviews.map((prev, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-warmgray-200">
                        <img src={prev} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rules & Guidelines */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Borrowing Guidelines & Safety Rules
                </label>
                <textarea
                  rows={3}
                  value={rulesAndConditions}
                  onChange={(e) => setRulesAndConditions(e.target.value)}
                  placeholder="e.g. Return batteries fully charged. Indoor use only. Please bring photo ID."
                  className="w-full text-xs p-3 rounded-xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800 resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: Summary & Confirmation */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4"
            >
              <div className="p-4 bg-forest-50/60 rounded-2xl border border-forest-100 space-y-3">
                <h3 className="font-bold text-sm text-forest-950 font-display">
                  Review Listing Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-charcoal-500 block">Title</span>
                    <span className="font-semibold text-charcoal-800">{title}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block">Category</span>
                    <span className="font-semibold text-charcoal-800">{category}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block">Model</span>
                    <span className="font-semibold text-charcoal-800">
                      {sharingType === 'free' ? 'Free Community Share' : `₹${pricePerDay} / day`}
                    </span>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block">Security Deposit</span>
                    <span className="font-semibold text-charcoal-800">₹{depositAmount}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-charcoal-500 block">Location</span>
                    <span className="font-semibold text-charcoal-800">
                      {neighborhood}, {city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-warmgray-50 rounded-xl text-xs text-charcoal-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
                <span>
                  Your listing will immediately appear in local neighbor search results!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-warmgray-100">
          {step > 1 ? (
            <Button variant="outline" size="sm" icon={ChevronLeft} onClick={handleBack}>
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button variant="primary" size="sm" onClick={handleNext}>
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleSubmitListing}
            >
              Publish Listing Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
