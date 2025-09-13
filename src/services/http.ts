
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { TMDBError } from '../types/tmdb'

// Crear instancia de axios con configuración base
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: { 
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  validateStatus: status => status >= 200 && status < 300
})

// Cache simple para respuestas
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Interceptor de solicitudes
http.interceptors.request.use(
  (config) => {
    // Verificar caché si es GET
    if (config.method?.toLowerCase() === 'get' && config.url) {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`
      const cached = cache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Retornar respuesta cacheada
        return {
          ...config,
          adapter: () => Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: config.headers,
            config,
          })
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuestas
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Cachear respuestas GET
    if (response.config.method?.toLowerCase() === 'get' && response.config.url) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })
    }
    return response
  },
  (error: AxiosError<TMDBError>) => {
    let message = 'Ha ocurrido un error'
    
    if (error.response) {
      // Error de la API
      message = error.response.data.status_message || message
      
      // Manejar errores específicos
      switch (error.response.status) {
        case 401:
          message = 'Error de autenticación. Por favor, verifica tu API key.'
          break
        case 404:
          message = 'No se encontró el recurso solicitado.'
          break
        case 429:
          message = 'Demasiadas solicitudes. Por favor, intenta más tarde.'
          break
      }
    } else if (error.request) {
      // Error de red
      message = 'Error de conexión. Por favor, verifica tu conexión a internet.'
    }

    // Rechazar con mensaje amigable
    return Promise.reject({
      message,
      originalError: error
    })
  }
)

export default http
