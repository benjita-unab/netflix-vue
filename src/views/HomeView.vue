
<template>
  <div class="container py-4 space-y-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Error al cargar contenido</h2>
      <p class="text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="retry" 
        class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md"
      >
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Hero Section con película destacada -->
      <section v-if="trending.length" class="relative h-[70vh] -mx-4">
        <div class="absolute inset-0">
          <img 
            :src="getImageUrl(trending[0].backdrop_path)"
            :alt="trending[0].title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        <div class="absolute bottom-0 left-0 p-8 max-w-2xl">
          <h1 class="text-4xl font-bold mb-4">{{ trending[0].title }}</h1>
          <p class="text-lg mb-6 line-clamp-3">{{ trending[0].overview }}</p>
          <div class="flex space-x-4">
            <router-link 
              :to="`/movie/${trending[0].id}`"
              class="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md inline-flex items-center font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              Reproducir
            </router-link>
            <router-link 
              :to="`/movie/${trending[0].id}`"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-md inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Más información
            </router-link>
          </div>
        </div>
      </section>

      <!-- Sección de Tendencias -->
      <section v-if="trending.length">
        <h2 class="text-2xl font-semibold mb-4">Tendencias de la semana</h2>
        <div class="relative">
          <div class="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
            <MovieCard 
              v-for="movie in trending.slice(1, 11)" 
              :key="movie.id" 
              :movie="movie"
              class="flex-shrink-0" 
            />
          </div>
        </div>
      </section>

      <!-- Películas Populares -->
      <section v-if="popular.length">
        <h2 class="text-2xl font-semibold mb-4">Populares ahora</h2>
        <div class="relative">
          <div class="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
            <MovieCard 
              v-for="movie in popular" 
              :key="movie.id" 
              :movie="movie"
              class="flex-shrink-0" 
            />
          </div>
        </div>
      </section>

      <!-- Mejor Valoradas -->
      <section v-if="topRated.length">
        <h2 class="text-2xl font-semibold mb-4">Mejor valoradas</h2>
        <div class="relative">
          <div class="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
            <MovieCard 
              v-for="movie in topRated" 
              :key="movie.id" 
              :movie="movie"
              class="flex-shrink-0" 
            />
          </div>
        </div>
      </section>

      <!-- Secciones por Género -->
      <section v-for="genre in selectedGenres" :key="genre.id" class="space-y-4">
        <h2 class="text-2xl font-semibold">{{ genre.name }}</h2>
        <div v-if="genreMovies[genre.id] && genreMovies[genre.id].length" class="relative">
          <div class="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
            <MovieCard 
              v-for="movie in genreMovies[genre.id]" 
              :key="movie.id" 
              :movie="movie"
              class="flex-shrink-0"
            />
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          Cargando películas de {{ genre.name }}...
        </div>
      </section>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import { getTrending, discoverByGenre, getGenres, getPopular, getTopRated } from '../services/tmdb'

// Estado
const trending = ref<any[]>([])
const popular = ref<any[]>([])
const topRated = ref<any[]>([])
const genres = ref<{id:number;name:string}[]>([])
const genreMovies = ref<{[key: number]: any[]}>({})
const loading = ref(true)
const error = ref<string | null>(null)

// Géneros seleccionados para mostrar en la página principal
const selectedGenres = ref<{id:number;name:string}[]>([])

// URL base para imágenes
const imageBaseUrl = import.meta.env.VITE_TMDB_IMG

// Función para construir URLs de imágenes
function getImageUrl(path: string | null) {
  return path ? `${imageBaseUrl}${path}` : '/placeholder.png'
}

// Cargar películas por género
async function loadGenreMovies(genreId: number) {
  try {
    const data = await discoverByGenre(genreId, { page: 1 })
    genreMovies.value[genreId] = data.results.slice(0, 10)
  } catch (error) {
    console.error(`Error loading movies for genre ${genreId}:`, error)
  }
}

// Función para reintentar carga
async function retry() {
  error.value = null
  loading.value = true
  await initializeHome()
}

// Inicialización
async function initializeHome() {
  try {
    loading.value = true
    error.value = null
    
    console.log('Iniciando carga de datos...')
    
    // Cargar géneros primero
    const genresData = await getGenres()
    genres.value = genresData
    console.log('Géneros cargados:', genres.value.length)
    
    // Seleccionar algunos géneros principales (Acción, Drama, Comedia, Ciencia ficción)
    const genreIds = [28, 18, 35, 878] // IDs específicos para géneros populares
    selectedGenres.value = genres.value.filter(g => genreIds.includes(g.id)).slice(0, 4)
    
    // Si no se encontraron los géneros específicos, usar los primeros 4
    if (selectedGenres.value.length === 0) {
      selectedGenres.value = genres.value.slice(0, 4)
    }
    
    console.log('Géneros seleccionados:', selectedGenres.value)
    
    // Cargar datos principales en paralelo
    const [trendingData, popularData, topRatedData] = await Promise.all([
      getTrending(1),
      getPopular(1),
      getTopRated(1)
    ])
    
    trending.value = trendingData.results
    popular.value = popularData.results.slice(0, 10)
    topRated.value = topRatedData.results.slice(0, 10)
    
    console.log('Datos principales cargados:', {
      trending: trending.value.length,
      popular: popular.value.length,
      topRated: topRated.value.length
    })
    
    // Cargar películas para cada género seleccionado
    await Promise.all(selectedGenres.value.map(genre => loadGenreMovies(genre.id)))
    
    console.log('Géneros con películas:', Object.keys(genreMovies.value))
    
  } catch (err: any) {
    console.error('Error initializing home view:', err)
    error.value = err.message || 'Error al cargar el contenido'
  } finally {
    loading.value = false
  }
}

// Inicialización
onMounted(initializeHome)
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
