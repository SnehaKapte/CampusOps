import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (onMessage) => {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimer = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep ref in sync with latest callback without triggering reconnects
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host     = window.location.hostname;
    // In dev, CRA proxy doesn't handle WS, so connect directly to backend
    const port     = process.env.NODE_ENV === 'development' ? '5000' : window.location.port;
    const url      = `${protocol}//${host}:${port}/ws`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (onMessageRef.current) onMessageRef.current(data);
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (err) {
      console.warn('[WS] Could not connect:', err.message);
    }
  }, []); // no deps — connect is stable, onMessage accessed via ref

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { connected };
};

export default useWebSocket;
