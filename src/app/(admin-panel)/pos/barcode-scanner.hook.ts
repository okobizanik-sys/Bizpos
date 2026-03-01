"use client";

import { useEffect, useRef } from "react";

interface Options {
  onScan: (barcode: string) => void;
  /** Ignore codes shorter than this. Default 3 */
  minLength?: number;
  /** Max ms between consecutive keystrokes from the scanner. Default 50 */
  maxGap?: number;
  enabled?: boolean;
}

/**
 * Detects hardware barcode scanner input.
 *
 * Scanners fire keydown events extremely fast (< 50 ms between chars)
 * then send Enter. Humans type slower, so we use timing to tell them apart.
 *
 * All logic goes through window keydown in capture phase so it works
 * regardless of which element currently has focus.
 */
export function useBarcodeScanner({
  onScan,
  minLength = 3,
  maxGap = 50,
  enabled = true,
}: Options) {
  // Keep a ref to onScan so the effect never needs to re-run when it changes
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
      // Skip focused inputs/textareas/selects — those handle their own Enter logic
      // (e.g. the barcode ComboboxInput already calls barcodeSelected via downshift)
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const now = Date.now();
      const gap = now - lastTime;
      lastTime = now;

      // Gap too large → human typing → reset buffer
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

      // Only collect printable single characters
      if (e.key.length === 1) {
        buffer += e.key;

        // Safety: flush if buffer gets very long
        if (buffer.length >= 100) {
          flush();
          return;
        }

        // Auto-flush after silence (handles scanners that don't send Enter)
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, maxGap + 30);
      }
    };

    // Use capture phase so we intercept before any input's own handler
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      if (timer) clearTimeout(timer);
    };
  }, [enabled, minLength, maxGap]);
}

/**
 * Play a short beep via Web Audio API — no library required.
 * @param success true = high-pitch success tone, false = low-pitch error tone
 */
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
    // AudioContext not available (headless test env, etc.) — silently skip
  }
}
