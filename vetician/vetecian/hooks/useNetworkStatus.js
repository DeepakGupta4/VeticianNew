import { useState, useEffect, useCallback } from 'react';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch('https://www.google.com', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      setIsConnected(res.ok);
    } catch {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return { isConnected, checkConnection };
}
