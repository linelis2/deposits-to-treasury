import { Buffer } from 'buffer';

export function initPolyfills() {
  window.Buffer = Buffer;
  window.global = window;
  window.process = { env: {} } as any;
}