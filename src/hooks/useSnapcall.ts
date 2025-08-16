import { useEffect, useState } from 'react';

declare global {
  interface Window { Snapcall?: any }
}

export function useSnapcall(apiKey?: string, buttonId?: string) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const onLoad = () => {
      if (window.Snapcall && apiKey && buttonId) {
        window.Snapcall.init({ apiKey, buttonId });
        setReady(true);
      }
    };
    if (window.Snapcall) onLoad();
    else {
      const script = document.createElement('script');
      script.src = '/snapcall-loader.js';
      script.async = true;
      script.onload = onLoad;
      document.head.appendChild(script);
    }
  }, [apiKey, buttonId]);
  return ready;
}