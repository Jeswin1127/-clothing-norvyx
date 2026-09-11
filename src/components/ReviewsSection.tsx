import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyber-lime font-mono text-xs uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED BUYER CONSENSUS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            CLIENT ATELIER REVIEWS
          </h2>
        </div>

        {/* Global Score Card */}
        <div className="flex items-center space-x-4 p-4 rounded-2xl glass-card border border-white/10">
          <div className="text-right">
            <div className="flex items-center space-x-1 text-cyber-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">Based on 1,480+ Global Reviews</p>
          </div>
          <div className="pl-4 border-l border-white/15">
            <span className="font-display font-black text-3xl text-white">4.9</span>
            <span className="text-slate-500 text-xs font-mono"> / 5.0</span>
          </div>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col justify-between space-y-4 hover:border-cyber-lime/30 transition-colors"
          >
            <div className="space-y-3">
              {/* Star Rating & Date */}
              <div className="flex items-center justify-between">
                <div className="flex text-cyber-amber">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-500">{review.date}</span>
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>

            {/* Author info & Fit tag */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-bold text-xs text-white">{review.author}</span>
                  {review.verified && (
                    <span title="Verified Atelier Buyer">
                      <CheckCircle2 className="w-3 h-3 text-cyber-lime" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-cyber-lime font-bold">
                  {review.fitFeedback}
                </span>
              </div>

              <p className="text-[10px] font-mono text-slate-400 truncate">
                Purchased: {review.itemPurchased}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
