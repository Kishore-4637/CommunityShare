import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Leaf,
  HeartHandshake,
  Sparkles,
  HelpCircle,
  Users,
  Repeat,
  Compass,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const HowItWorksPage = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      q: 'How does the refundable security deposit work?',
      a: 'When an owner sets a security deposit on a high-value tool or camera, the deposit is held in escrow when the request is approved. Once you hand the item back and the owner confirms its clean condition, the deposit is released immediately back to you.',
    },
    {
      q: 'Is borrowing free or paid?',
      a: 'Lenders choose their own sharing model! Hundreds of items on CommunityShare are 100% free community shares to foster neighborhood connection and sustainability. Other specialized commercial-grade equipment carries an affordable daily rate well below equipment rental shops.',
    },
    {
      q: 'How do you verify neighbors?',
      a: 'All members complete profile verification including verified email, phone confirmation, and neighborhood geolocation verification before sending borrowing requests.',
    },
    {
      q: 'What if an item is returned damaged?',
      a: 'CommunityShare provides mutual damage resolution. The security deposit covers minor repairs, and our Community Guarantee steps in for verified members in the rare event of accidental damage.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
          The Community Guide
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 font-display">
          Borrow, Lend, and Build Trust in Your Neighborhood
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
          Learn how CommunityShare protects lenders and borrowers, eliminates wasteful consumption, and empowers neighbors to share everyday resources.
        </p>
      </div>

      {/* 3 Pillars of Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-forest-700" />
          </div>
          <h3 className="font-bold text-base text-charcoal-900 font-display">
            Neighbor Verification
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Every lender and borrower builds a persistent community trust score backed by reviews, punctuality records, and ID verification.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="font-bold text-base text-charcoal-900 font-display">
            Escrow Deposit Protection
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Security deposits safeguard valuable equipment. Funds are safely held until both parties confirm happy handover and timely return.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-warmgray-200/90 shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Leaf className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="font-bold text-base text-charcoal-900 font-display">
            Zero Waste Impact
          </h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            The average power tool is used for just 13 minutes in its entire lifespan. Sharing unlocks 99% unused utility and saves landfill waste.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-warmgray-200/90 shadow-subtle space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-charcoal-900 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-charcoal-500">
            Everything you need to know about borrowing and lending safely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="p-5 bg-warmgray-50 rounded-2xl border border-warmgray-200/60 space-y-2">
              <h4 className="font-bold text-xs sm:text-sm text-charcoal-800 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-charcoal-900 font-display">
          Ready to experience the joy of sharing?
        </h3>
        <div className="flex justify-center gap-3">
          <Button variant="primary" size="lg" icon={Compass} onClick={() => navigate('/explore')}>
            Explore Resources
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/create-listing')}>
            List an Item
          </Button>
        </div>
      </div>
    </div>
  );
};
