import axios from 'axios'

// Module-level bridge to React context — populated by LoadingProvider on mount.
// Using a plain object ref avoids any circular dependency with React.
const _loader = { show: null, hide: null }
let _count = 0  // in-flight requests that are NOT skipGlobalLoader

export function registerLoader(show, hide) {
  _loader.show = show
  _loader.hide = hide
}

// Centralized axios instance for all global ERP operations.
// Pages that use the local fetch-based `api` helper remain untouched.
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Pass `skipGlobalLoader: true` in config to bypass the overlay entirely.
    // Useful for autocomplete, polling, or silent background refreshes.
    // Pass `loadingMessage: 'Saving...'` to display a custom message in the overlay.
    if (!config.skipGlobalLoader) {
      _count++
      if (_count === 1 && _loader.show) {
        _loader.show(config.loadingMessage || '')
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor (success) ──────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (!response.config.skipGlobalLoader) {
      _count = Math.max(0, _count - 1)
      if (_count === 0 && _loader.hide) _loader.hide()
    }
    return response
  },
  (error) => {
    // Always decrement on error too — prevents the overlay from getting stuck
    if (!error.config?.skipGlobalLoader) {
      _count = Math.max(0, _count - 1)
      if (_count === 0 && _loader.hide) _loader.hide()
    }
    return Promise.reject(error)
  }
)

export default api
