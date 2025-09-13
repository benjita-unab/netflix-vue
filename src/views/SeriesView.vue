<template>
  <div class="container py-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Series</h1>
        <p class="text-gray-400">Descubre las mejores series de televisión</p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-4">
        <!-- Filtro por género -->
        <select 
          v-model="selectedGenre" 
          @change="loadSeries"
          class="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todos los géneros</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>

        <!-- Filtro por categoría -->
        <select 
          v-model="category" 
          @change="loadSeries"
          class="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
        >
          <option value="popular">Populares</option>
          <option value="top_rated">Mejor valoradas</option>
          <option value="trending">En tendencia</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && series.length === 0" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-2xl font-bold text-red-500 mb-4">Error al cargar series</h2>
      <p class="text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="retry" 
        class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md"
      >
        Reintentar
      </button>
    </div>

    <!-- Series Grid -->
    <div v-else-if="series.length" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <SeriesCard 
          v-for="show in series" 
          :key="show.id" 
          :series="show"
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
          <span v-else>Cargar más series</span>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">📺</div>
      <h2 class="text-2xl font-bold mb-2">No se encontraron series</h2>
      <p class="text-gray-400">Intenta cambiando los filtros de búsqueda</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SeriesCard from '../components/SeriesCard.vue'
import { getTVGenres, getPopularTV, getTopRatedTV, getTrendingTV } from '../services/tmdb'
import type { Genre } from '../types/tmdb'

// Estado
const series = ref<any[]>([])
const genres = ref<Genre[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Filtros
const selectedGenre = ref<string>('')
const category = ref<string>('popular')

// Computed
const hasMore = computed(() => currentPage.value < totalPages.value)

// Funciones
async function loadGenres() {
  try {
    genres.value = await getTVGenres()
  } catch (err: any) {
    console.error('Error loading TV genres:', err)
  }
}

async function loadSeries(reset = true) {
  try {
    loading.value = true
    error.value = null

    if (reset) {
      currentPage.value = 1
      series.value = []
    }

    let response

    // Según la categoría seleccionada, usar diferentes endpoints
    switch (category.value) {
      case 'top_rated':
        response = await getTopRatedTV(currentPage.value)
        break
      case 'trending':
        response = await getTrendingTV(currentPage.value)
        break
      default:
        response = await getPopularTV(currentPage.value)
        break
    }

    let results = response.results

    // Filtrar por género si está seleccionado
    if (selectedGenre.value) {
      const genreId = parseInt(selectedGenre.value)
      results = results.filter((show: any) => 
        show.genre_ids && show.genre_ids.includes(genreId)
      )
    }
    
    if (reset) {
      series.value = results
    } else {
      series.value = [...series.value, ...results]
    }
    
    totalPages.value = response.total_pages
    
  } catch (err: any) {
    console.error('Error loading series:', err)
    error.value = err.message || 'Error al cargar series'
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    await loadSeries(false)
  }
}

async function retry() {
  await loadSeries()
}

// Inicialización
onMounted(async () => {
  await loadGenres()
  await loadSeries()
})
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>