import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to the very top smoothly or instantly on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  return null;
}
