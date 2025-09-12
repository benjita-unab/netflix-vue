
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TMDB_BASE_URL: string
  readonly VITE_TMDB_TOKEN: string
  readonly VITE_TMDB_IMG: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
