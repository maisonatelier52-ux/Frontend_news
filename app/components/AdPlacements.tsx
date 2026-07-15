"use client";

import React from "react";

export const parseAdSize = (sizeStr: string, fallbackW = 300, fallbackH = 250) => {
  const parts = (sizeStr || "").split(/[x×]/);
  const w = parseInt(parts[0]) || fallbackW;
  const h = parseInt(parts[1]) || fallbackH;
  return { w, h };
};

interface AdHomepageMiddleProps {
  ad: any;
}

export function AdHomepageMiddle({ ad }: AdHomepageMiddleProps) {
  if (!ad) return null;
  const { w, h } = parseAdSize(ad.size, 728, 90);
  return (
    <div className="w-full my-8 flex flex-col items-center select-none">
      <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">
        Advertisement
      </span>
      <div
        className="relative overflow-hidden border border-zinc-200 shadow-3xs max-w-full"
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

interface AdFooterBannerProps {
  ads: any[];
  onClose: (id: string) => void;
}

export function AdFooterBanner({ ads, onClose }: AdFooterBannerProps) {
  if (!ads || ads.length === 0) return null;

  const adToClose = ads[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 select-none border-t border-zinc-150 pt-6 pb-6">
      <div className="relative bg-zinc-50/50 p-3 rounded border border-zinc-200 flex flex-col items-center justify-center animate-[admin-fade-in_0.3s_ease-out]">
        <button
          onClick={() => onClose(adToClose._id)}
          className="absolute top-2 right-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer transition z-10"
          title="Close Ad"
        >
          ✕
        </button>
        <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1.5">
          Advertisement
        </span>

        {/* Mobile Footer Banner */}
        {(() => {
          const mobileAd = ads.find((a) => a.size.includes("320")) || ads[0];
          if (!mobileAd) return null;
          const { w, h } = parseAdSize(mobileAd.size, 320, 50);
          return (
            <div
              className="md:hidden relative overflow-hidden border border-zinc-200 shadow-3xs bg-white"
              style={{ width: `${w}px`, height: `${h}px` }}
            >
              <img src={mobileAd.imageUrl} alt={mobileAd.name} className="w-full h-full object-cover" />
            </div>
          );
        })()}

        {/* Desktop/Tablet Footer Banner */}
        {(() => {
          const desktopAd =
            ads.find((a) => a.size.includes("728")) ||
            ads.find((a) => a.size.includes("300")) ||
            ads[0];
          if (!desktopAd) return null;
          const { w, h } = parseAdSize(desktopAd.size, 728, 90);
          return (
            <div
              className="hidden md:block relative overflow-hidden border border-zinc-200 shadow-3xs bg-white"
              style={{ width: `${w}px`, height: `${h}px` }}
            >
              <img src={desktopAd.imageUrl} alt={desktopAd.name} className="w-full h-full object-cover" />
            </div>
          );
        })()}
      </div>
    </div>
  );
}

interface AdStickyBottomProps {
  ad: any;
  onClose: (id: string) => void;
}

export function AdStickyBottom({ ad, onClose }: AdStickyBottomProps) {
  if (!ad) return null;
  const { w, h } = parseAdSize(ad.size, 320, 50);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pointer-events-none pb-2 select-none">
      <div className="relative bg-zinc-100/95 border border-zinc-300 p-1.5 shadow-lg rounded-none flex flex-col items-center pointer-events-auto">
        <button
          onClick={() => onClose(ad._id)}
          className="absolute -top-2 -right-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-zinc-200 cursor-pointer shadow-md transition"
          title="Close Ad"
        >
          ✕
        </button>
        <span className="text-[8px] text-zinc-400 font-mono tracking-widest uppercase mb-0.5 leading-none">
          Advertisement
        </span>
        <div
          className="relative overflow-hidden border border-zinc-200 bg-white"
          style={{ width: `${w}px`, height: `${h}px` }}
        >
          <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
