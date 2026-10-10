import { useEffect } from 'react';

// Shows the back-to-top button after scrolling down (sets --tx-totop and --tx-totop-pe on <html>).
export function useBackToTop() {
  useEffect(() => {
    const doc = document.documentElement;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const show = scrollY > 600;
        doc.style.setProperty('--tx-totop', show ? '1' : '0');
        doc.style.setProperty('--tx-totop-pe', show ? 'auto' : 'none');
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}
