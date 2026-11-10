import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Leaf, Globe, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-forest-950 text-white pt-16 pb-12 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-forest-900/80">
          {/* Brand Story */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-emerald-300">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Community<span className="text-emerald-400">Share</span>
              </span>
            </Link>
            <p className="text-xs text-forest-200/80 leading-relaxed">
              Empowering neighbors to share tools, outdoor gear, kitchen appliances, and electronics.
              Share more, own less, and forge authentic community connections.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-forest-900/80 px-2.5 py-1 rounded-full border border-forest-800">
                <Leaf className="w-3 h-3 text-emerald-400" /> Circular Economy
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-forest-900/80 px-2.5 py-1 rounded-full border border-forest-800">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Trust & Verified
              </span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-forest-200/80">
              <li>
                <Link to="/explore?category=Tools" className="hover:text-white transition-colors">
                  Power & Hand Tools
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Electronics" className="hover:text-white transition-colors">
                  Cameras & Audio
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Sports%20Equipment" className="hover:text-white transition-colors">
                  Camping & Outdoors
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Kitchen%20Appliances" className="hover:text-white transition-colors">
                  Kitchen & Culinary
                </Link>
              </li>
              <li>
                <Link to="/explore?sharingType=free" className="hover:text-white transition-colors">
                  Free Community Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Trust & Community
            </h4>
            <ul className="space-y-2.5 text-xs text-forest-200/80">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How CommunityShare Works
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#trust" className="hover:text-white transition-colors">
                  Neighbor Trust & Verification
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#deposits" className="hover:text-white transition-colors">
                  Security Deposit Protection
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="hover:text-white transition-colors">
                  List Unused Household Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Neighborhood Community Pledge */}
          <div className="bg-forest-900/40 rounded-2xl p-5 border border-forest-800/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">The Community Pledge</span>
            </div>
            <p className="text-[11px] text-forest-200/80 leading-relaxed">
              "We borrow with respect, return with care, and believe in collective abundance over individual over-consumption."
            </p>
            <div className="pt-2">
              <Link
                to="/explore"
                className="inline-block text-xs font-semibold text-emerald-300 hover:text-white hover:underline"
              >
                Start borrowing today &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300/60 gap-4">
          <p>© {new Date().getFullYear()} CommunityShare Inc. Built for vibrant, sustainable neighborhoods.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
