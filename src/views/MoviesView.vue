<template>
  <div class="container py-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Películas</h1>
        <p class="text-gray-400">Descubre las mejores películas del momento</p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-4">
        <!-- Filtro por género -->
        <select 
          v-model="selectedGenre" 
          @change="loadMovies"
          class="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todos los géneros</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>

        <!-- Filtro por ordenamiento -->
        <select 
          v-model="sortBy" 
          @change="loadMovies"
          class="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
        >
          <option value="popularity.desc">Más populares</option>
          <option value="vote_average.desc">Mejor valoradas</option>
          <option value="primary_release_date.desc">Más recientes</option>
          <option value="revenue.desc">Más taquilleras</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && movies.length === 0" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Error al cargar películas</h2>
      <p class="text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="retry" 
        class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md"
      >
        Reintentar
      </button>
    </div>

    <!-- Movies Grid -->
    <div v-else-if="movies.length" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id" 
          :movie="movie"
          class="w-full"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="text-center py-6">
        <button 
          @click="loadMore"
          :disabled="loading"
          class="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-semibold transition-colors"
        >
          <span v-if="loading" class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Cargando...
          </span>
          <span v-else>Cargar más películas</span>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🎬</div>
      <h2 class="text-2xl font-bold mb-2">No se encontraron películas</h2>
      <p class="text-gray-400">Intenta cambiando los filtros de búsqueda</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import { getGenres, discover } from '../services/tmdb'
import type { Movie, Genre } from '../types/tmdb'

// Estado
const movies = ref<Movie[]>([])
const genres = ref<Genre[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Filtros
const selectedGenre = ref<string>('')
const sortBy = ref<string>('popularity.desc')

// Computed
const hasMore = computed(() => currentPage.value < totalPages.value)

// Funciones
async function loadGenres() {
  try {
    genres.value = await getGenres()
  } catch (err: any) {
    console.error('Error loading genres:', err)
  }
}

async function loadMovies(reset = true) {
  try {
    loading.value = true
    error.value = null

    if (reset) {
      currentPage.value = 1
      movies.value = []
    }

    const options: any = {
      page: currentPage.value,
      sort_by: sortBy.value,
      'vote_count.gte': 50 // Solo películas con al menos 50 votos
    }

    if (selectedGenre.value) {
      options.with_genres = selectedGenre.value
    }

    const response = await discover(options)
    
    if (reset) {
      movies.value = response.results
    } else {
      movies.value = [...movies.value, ...response.results]
    }
    
    totalPages.value = response.total_pages
    
  } catch (err: any) {
    console.error('Error loading movies:', err)
    error.value = err.message || 'Error al cargar películas'
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    await loadMovies(false)
  }
}

async function retry() {
  await loadMovies()
}

// Inicialización
onMounted(async () => {
  await loadGenres()
  await loadMovies()
})
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>