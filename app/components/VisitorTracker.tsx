'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid logging admin page views in client traffic (or we can log them separately. To prevent skewing numbers, we exclude admin console paths)
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const logVisit = async () => {
      try {
        await fetch('/api/analytics/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer : ''
          })
        });
      } catch (err) {
        console.error('Failed to log visitor traffic:', err);
      }
    };

    // Small delay to ensure route transitions are fully resolved
    const timer = setTimeout(logVisit, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
