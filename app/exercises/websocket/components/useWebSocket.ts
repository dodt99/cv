"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type WsStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "reconnecting";

export interface WsMessage {
  id: number;
  data: string;
  timestamp: number;
}

export interface UseWebSocketReturn {
  status: WsStatus;
  messages: WsMessage[];
  send: (data: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [status, setStatus] = useState<WsStatus>("idle");
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);
  const msgIdRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const unmountedRef = useRef(false);

  const clearReconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const connect = useCallback(() => {
    if (wsRef.current) return;
    shouldReconnectRef.current = true;
    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (unmountedRef.current) return;
      attemptRef.current = 0;
      setStatus("open");
    };

    ws.onmessage = (e) => {
      if (unmountedRef.current) return;
      setMessages((prev) => [
        ...prev.slice(-99),
        { id: msgIdRef.current++, data: e.data, timestamp: Date.now() },
      ]);
    };

    ws.onerror = () => { /* onclose always follows */ };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      wsRef.current = null;

      if (!shouldReconnectRef.current) {
        setStatus("closed");
        return;
      }

      const delay = Math.min(1000 * 2 ** attemptRef.current, 16000);
      attemptRef.current += 1;
      setStatus("reconnecting");

      reconnectTimerRef.current = setTimeout(() => {
        if (!unmountedRef.current && shouldReconnectRef.current) connect();
      }, delay);
    };
  }, [url]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnect();
    if (wsRef.current) {
      setStatus("closing");
      wsRef.current.close();
    } else {
      setStatus("idle");
    }
  }, []);

  const send = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      shouldReconnectRef.current = false;
      clearReconnect();
      wsRef.current?.close();
    };
  }, []);

  return { status, messages, send, connect, disconnect };
}
