// Tipos de respuesta comunes de TMDB
export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_title: string
  video: boolean
}

export interface MovieDetail extends Movie {
  budget: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: Company[]
  production_countries: Country[]
  revenue: number
  runtime: number
  spoken_languages: Language[]
  status: string
  tagline: string | null
  videos: {
    results: Video[]
  }
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  images: {
    backdrops: Image[]
    posters: Image[]
  }
}

export interface Genre {
  id: number
  name: string
}

export interface Company {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Country {
  iso_3166_1: string
  name: string
}

export interface Language {
  iso_639_1: string
  name: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  size: number
  type: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Image {
  aspect_ratio: number
  height: number
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

// Tipos de error
export interface TMDBError {
  status_message: string
  status_code: number
}