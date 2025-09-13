
import http from './http'
import type { 
  TMDBResponse, 
  Movie, 
  MovieDetail, 
  Genre 
} from '../types/tmdb'

// Opciones de discover/búsqueda
export interface DiscoverOptions {
  page?: number
  sort_by?: string
  'vote_average.gte'?: number
  'primary_release_year'?: number
  with_genres?: string | number
  with_original_language?: string
}

/**
 * Obtiene las películas en tendencia
 * @param page Número de página
 * @param timeWindow 'day' o 'week'
 */
export const getTrending = async (page = 1, timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await http.get(`/trending/movie/${timeWindow}`, { params: { page } })
    return response.data
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    throw error
  }
}

/**
 * Obtiene todos los géneros de películas
 */
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await http.get('/genre/movie/list')
    return response.data.genres || []
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}

/**
 * Descubre películas por género y otros filtros
 */
export const discoverByGenre = async (genreId: number, options: DiscoverOptions = {}): Promise<TMDBResponse<Movie>> => {
  try {
    const response = await http.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: options.sort_by || 'popularity.desc',
        page: options.page || 1,
        ...options
      }
    })
    return response.data
  } catch (error) {
    console.error('Error discovering movies by genre:', error)
    throw error
  }
}

/**
 * Busca películas por query
 */
export const searchMovies = (query: string, page = 1): Promise<TMDBResponse<Movie>> =>
  http.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false
    }
  }).then(r => r.data)

/**
 * Obtiene detalles de una película
 */
export const getMovie = (id: string | number): Promise<MovieDetail> =>
  http.get(`/movie/${id}`, {
    params: {
      append_to_response: 'videos,images,credits,similar,recommendations'
    }
  }).then(r => r.data)

/**
 * Obtiene películas populares
 */
export const getPopular = (page = 1): Promise<TMDBResponse<Movie>> =>
  http.get('/movie/popular', { params: { page } }).then(r => r.data)

/**
 * Obtiene películas mejor valoradas
 */
export const getTopRated = (page = 1): Promise<TMDBResponse<Movie>> =>
  http.get('/movie/top_rated', { params: { page } }).then(r => r.data)

/**
 * Obtiene próximos estrenos
 */
export const getUpcoming = (page = 1): Promise<TMDBResponse<Movie>> =>
  http.get('/movie/upcoming', { params: { page } }).then(r => r.data)

/**
 * Obtiene películas recomendadas basadas en una película
 */
export const getRecommendations = (movieId: number, page = 1): Promise<TMDBResponse<Movie>> =>
  http.get(`/movie/${movieId}/recommendations`, { params: { page } }).then(r => r.data)

/**
 * Descubre películas con filtros avanzados
 */
export const discover = (options: DiscoverOptions = {}): Promise<TMDBResponse<Movie>> =>
  http.get('/discover/movie', {
    params: {
      sort_by: 'popularity.desc',
      page: 1,
      ...options
    }
  }).then(r => r.data)

// ==================== TV/SERIES ====================

/**
 * Obtiene series populares
 */
export const getPopularTV = async (page = 1): Promise<TMDBResponse<any>> => {
  try {
    const response = await http.get('/tv/popular', { params: { page } })
    return response.data
  } catch (error) {
    console.error('Error fetching popular TV shows:', error)
    throw error
  }
}

/**
 * Obtiene series mejor valoradas
 */
export const getTopRatedTV = async (page = 1): Promise<TMDBResponse<any>> => {
  try {
    const response = await http.get('/tv/top_rated', { params: { page } })
    return response.data
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error)
    throw error
  }
}

/**
 * Obtiene series en tendencia
 */
export const getTrendingTV = async (page = 1, timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<any>> => {
  try {
    const response = await http.get(`/trending/tv/${timeWindow}`, { params: { page } })
    return response.data
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    throw error
  }
}

/**
 * Busca series por query
 */
export const searchTV = async (query: string, page = 1): Promise<TMDBResponse<any>> => {
  try {
    const response = await http.get('/search/tv', {
      params: {
        query,
        page,
        include_adult: false
      }
    })
    return response.data
  } catch (error) {
    console.error('Error searching TV shows:', error)
    throw error
  }
}

/**
 * Obtiene géneros de TV
 */
export const getTVGenres = async (): Promise<Genre[]> => {
  try {
    const response = await http.get('/genre/tv/list')
    return response.data.genres || []
  } catch (error) {
    console.error('Error fetching TV genres:', error)
    return []
  }
}
