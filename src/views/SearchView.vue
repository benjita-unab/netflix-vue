
<template>
  <section class="container py-4 min-h-screen">
    <!-- Barra de búsqueda -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
      <input 
        v-model="searchQuery" 
        type="search" 
        placeholder="Buscar películas..." 
        class="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        :class="{ 'border-red-500': error }"
      />
      <div v-if="isSearching" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-500">{{ error }}</p>
      </div>
      <button 
        @click="retrySearch" 
        class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
      >
        Reintentar
      </button>
    </div>

    <!-- Estado inicial -->
    <div v-if="!searchQuery && !results.length" class="flex flex-col items-center justify-center space-y-4 mt-20">
      <svg class="w-16 h-16 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-gray-500 text-lg">Busca tus películas favoritas</p>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="searchQuery && !isSearching && !results.length" class="flex flex-col items-center justify-center space-y-4 mt-20">
      <svg class="w-16 h-16 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 text-lg">No se encontraron resultados para "{{ searchQuery }}"</p>
    </div>

    <!-- Resultados -->
    <template v-else>
      <!-- Info de resultados -->
      <div v-if="totalResults && !error" class="mt-6 mb-4">
        <p class="text-sm text-gray-400">
          {{ totalResults }} resultados encontrados
        </p>
      </div>

      <!-- Grid de películas -->
      <div v-if="results.length" class="grid gap-6" style="grid-template-columns: repeat(auto-fill,minmax(160px,1fr));">
        <MovieCard v-for="movie in results" :key="movie.id" :movie="movie" />
      </div>

      <!-- Botón cargar más -->
      <div v-if="hasMorePages" class="flex justify-center my-8">
        <button 
          @click="loadMore" 
          class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          <span>{{ isLoading ? 'Cargando...' : 'Cargar más' }}</span>
          <svg v-if="isLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </template>
  </section>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDebounce } from '../composables/useDebounce'
import MovieCard from '../components/MovieCard.vue'
import { searchMovies } from '../services/tmdb'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average?: number
  overview?: string
  release_date?: string
}

// Estado
const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 500)
const results = ref<Movie[]>([])
const page = ref(1)
const totalResults = ref(0)
const isSearching = ref(false)
const isLoading = ref(false)
const error = ref('')

// Computed
const hasMorePages = computed(() => {
  const totalPages = Math.ceil((totalResults.value || 0) / 20) // TMDB devuelve 20 resultados por página
  return page.value < totalPages
})

// Métodos
async function performSearch(query: string, pageNum: number = 1, append: boolean = false) {
  if (!query.trim()) {
    results.value = []
    totalResults.value = 0
    return
  }

  try {
    isSearching.value = !append
    isLoading.value = append
    error.value = ''

    const data = await searchMovies(query, pageNum)
    
    if (append) {
      results.value.push(...data.results)
    } else {
      results.value = data.results
    }
    
    totalResults.value = data.total_results
    page.value = pageNum
    
  } catch (e) {
    error.value = 'Ha ocurrido un error al buscar las películas. Por favor, inténtalo de nuevo.'
    console.error('Search error:', e)
  } finally {
    isSearching.value = false
    isLoading.value = false
  }
}

async function loadMore() {
  if (isLoading.value || !hasMorePages.value) return
  await performSearch(debouncedQuery.value, page.value + 1, true)
}

async function retrySearch() {
  error.value = ''
  if (searchQuery.value.trim()) {
    await performSearch(searchQuery.value, 1, false)
  }
}

// Watchers
watch(debouncedQuery, async (newQuery) => {
  results.value = []
  page.value = 1
  error.value = ''
  
  if (newQuery) {
    await performSearch(newQuery)
  }
})
</script>

<style scoped>
/* Estilos para el input de búsqueda */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}
</style>
