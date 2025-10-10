/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WC_API_URL?: string;
  readonly WC_CONSUMER_KEY?: string;
  readonly WC_CONSUMER_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
