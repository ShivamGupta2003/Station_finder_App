

import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

export function useWarmUpBrowser() {
  useEffect(() => {
    WebBrowser.warmUpAsync?.();
    return () => {
      WebBrowser.coolDownAsync?.();
    };
  }, []);
}
