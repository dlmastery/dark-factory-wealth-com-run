/// <reference types="vite/client" />

/**
 * Augments Vite's ImportMetaEnv with our typed env vars.
 * Per HD-008 v0: token-storage uses sessionStorage; production posture
 * would use httpOnly cookies + a different env var set.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
