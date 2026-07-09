import { useState, useEffect } from 'react';

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/subscriptions/status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.isSubscribed) {
          setIsSubscribed(true);
          setEmail(data.email || '');
          localStorage.setItem('is_subscribed', 'true');
          localStorage.setItem('subscriber_email', data.email || '');
        } else {
          setIsSubscribed(false);
          setEmail('');
          localStorage.removeItem('is_subscribed');
          localStorage.removeItem('subscriber_email');
        }
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Quick check from localStorage to prevent UI flash during hydration/mount
    const cached = localStorage.getItem('is_subscribed') === 'true';
    if (cached) {
      setIsSubscribed(true);
      setEmail(localStorage.getItem('subscriber_email') || '');
    }

    // 2. Fetch fresh status from the server
    checkStatus();
  }, []);

  const setSubscribed = (status: boolean, emailVal?: string) => {
    setIsSubscribed(status);
    if (status) {
      localStorage.setItem('is_subscribed', 'true');
      if (emailVal) {
        localStorage.setItem('subscriber_email', emailVal);
        setEmail(emailVal);
      }
    } else {
      localStorage.removeItem('is_subscribed');
      localStorage.removeItem('subscriber_email');
      setEmail('');
    }
  };

  return { isSubscribed, email, loading, setSubscribed, checkStatus };
}
