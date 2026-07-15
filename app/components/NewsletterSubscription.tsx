"use client";

import React, { useState } from "react";
import { useSubscription } from "../hooks/useSubscription";

interface NewsletterSubscriptionProps {
  previewMode?: boolean;
}

export default function NewsletterSubscription({
  previewMode = false,
}: NewsletterSubscriptionProps) {
  const { isSubscribed, setSubscribed } = useSubscription();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || newsletterLoading) return;
    setNewsletterLoading(true);
    setNewsletterError("");
    setNewsletterMessage("");
    // Minimum 2-second response feel
    const [res] = await Promise.all([
      fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      }),
      new Promise((r) => setTimeout(r, 2000)),
    ]);
    const data = await (res as Response).json();
    setNewsletterLoading(false);
    if ((res as Response).ok || data.success) {
      const emailVal = newsletterEmail.trim();
      setNewsletterMessage(data.message || "Subscribed successfully! Welcome.");
      setNewsletterEmail("");
      setNewsletterSubmitted(true);
      setTimeout(() => { 
        setIsFadingOut(true);
      }, 2500);
      setTimeout(() => { 
        setNewsletterSubmitted(false); 
        setNewsletterMessage(""); 
        setSubscribed(true, emailVal);
        setIsFadingOut(false);
      }, 3700);
    } else {
      setNewsletterError(data.error || "Failed to subscribe. Please try again.");
      setTimeout(() => setNewsletterError(""), 5000);
    }
  };

  if (!((!isSubscribed || isFadingOut) || previewMode)) {
    return null;
  }

  return (
    <section
      style={{
        transition: "all 1200ms cubic-bezier(0.25, 1, 0.5, 1)",
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? "translateY(-35px) scale(0.97)" : "translateY(0) scale(1)",
        maxHeight: isFadingOut ? "0px" : "350px",
        paddingTop: isFadingOut ? "0px" : undefined,
        paddingBottom: isFadingOut ? "0px" : undefined,
        marginTop: isFadingOut ? "0px" : undefined,
        marginBottom: isFadingOut ? "0px" : undefined,
        overflow: "hidden",
        filter: isFadingOut ? "blur(4px)" : "none",
      }}
      className="bg-zinc-50 py-10 px-4 select-none"
    >
      <div className="max-w-7xl mx-auto border-t border-zinc-200 pt-10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="font-editorial-title text-xl sm:text-2xl font-bold text-zinc-900">
            Subscribe to Magazine Gazette
          </h3>
          <p className="text-xs text-zinc-505 text-zinc-500 max-w-md mx-auto leading-relaxed">
            Join 240,000+ readers. Get curated briefs, breaking news alerts, and deep-dive investigations sent directly to your inbox every morning.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={newsletterLoading}
              className="bg-white border border-zinc-250 px-4 py-2 text-xs rounded-sm w-full focus:border-zinc-500 disabled:opacity-60"
              required
            />
            <button
              type="submit"
              disabled={newsletterLoading}
              className="bg-zinc-950 text-white text-xs font-bold py-2.5 px-6 rounded-sm hover:bg-zinc-800 transition cursor-pointer flex-shrink-0 disabled:opacity-60 flex items-center justify-center gap-2 min-w-[90px]"
            >
              {newsletterLoading ? (
                <>
                  <span>Saving...</span>
                </>
              ) : "Sign Up"}
            </button>
          </form>

          {newsletterSubmitted && newsletterMessage && (
            <p className="text-xs font-semibold text-emerald-600">
              ✓ {newsletterMessage}
            </p>
          )}
          {newsletterError && (
            <p className="text-xs font-semibold text-red-500">
              ✕ {newsletterError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
