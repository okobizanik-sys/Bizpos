"use client";

import { useEffect, useRef } from "react";

interface Options {
  onScan: (barcode: string) => void;
  minLength?: number;
  maxGap?: number;
  enabled?: boolean;
}

export function useBarcodeScanner({
  onScan,
  minLength = 3,
  maxGap = 50,
  enabled = true,
}: Options) {
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;

    let buffer = "";
    let lastTime = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const flush = () => {
      const code = buffer.trim();
      buffer = "";
      if (code.length >= minLength) {
        onScanRef.current(code);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const now = Date.now();
      const gap = now - lastTime;
      lastTime = now;

      if (gap > maxGap && buffer.length > 0) {
        buffer = "";
      }

      if (e.key === "Enter") {
        if (buffer.length >= minLength) {
          e.preventDefault();
          if (timer) clearTimeout(timer);
          flush();
        }
        return;
      }

      if (e.key.length === 1) {
        buffer += e.key;

        if (buffer.length >= 100) {
          flush();
          return;
        }

        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, maxGap + 30);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      if (timer) clearTimeout(timer);
    };
  }, [enabled, minLength, maxGap]);
}

export function playBeep(success: boolean) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = success ? 1800 : 400;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    osc.onended = () => ctx.close();
  } catch {
  }
}
