
<template>
  <div class="min-h-screen">
    <!-- Loading state -->
    <div v-if="loading" class="container py-6 flex items-center justify-center min-h-screen">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-400">Cargando película...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="container py-6 flex items-center justify-center min-h-screen">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-red-500">Error al cargar la película</h3>
        <p class="mt-2 text-gray-400">{{ error }}</p>
        <button @click="loadMovie" class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md">
          Intentar de nuevo
        </button>
      </div>
    </div>

    <!-- Movie details -->
    <section v-else-if="movie" class="pb-12">
      <!-- Hero section with backdrop -->
      <div class="relative h-[70vh] mb-8">
        <div class="absolute inset-0">
          <img 
            :src="backdrop" 
            :alt="movie.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        
        <!-- Content over backdrop -->
        <div class="container relative h-full flex items-end pb-12">
          <div class="grid gap-8 md:grid-cols-[300px,1fr]">
            <!-- Poster -->
            <img 
              :src="poster" 
              :alt="movie.title" 
              class="rounded-lg shadow-xl aspect-[2/3] object-cover"
            />
            
            <!-- Movie info -->
            <div class="space-y-4">
              <h1 class="text-4xl font-bold">{{ movie.title }}</h1>
              
              <!-- Movie meta -->
              <div class="flex flex-wrap gap-4 text-sm text-gray-300">
                <span v-if="movie.release_date">{{ new Date(movie.release_date).getFullYear() }}</span>
                <span v-if="movie.runtime">{{ Math.floor(movie.runtime / 60) }}h {{ movie.runtime % 60 }}m</span>
                <span v-if="movie.vote_average" class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ movie.vote_average.toFixed(1) }}
                </span>
                <span v-if="movie.genres" class="flex flex-wrap gap-2">
                  <span v-for="genre in movie.genres" :key="genre.id" class="px-2 py-1 bg-gray-800 rounded text-sm">
                    {{ genre.name }}
                  </span>
                </span>
              </div>

              <p class="text-lg text-gray-300">{{ movie.overview }}</p>

              <!-- Actions -->
              <div class="flex gap-4 pt-4">
                <button 
                  @click="toggleWL()"
                  class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <svg v-if="inWatchlist" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {{ inWatchlist ? 'En mi lista' : 'Agregar a mi lista' }}
                </button>
                
                <button 
                  v-if="trailer"
                  @click="showTrailer = true"
                  class="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  Ver trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container space-y-12">
        <!-- Cast section -->
        <section v-if="movie.credits?.cast?.length" class="space-y-4">
          <h2 class="text-2xl font-semibold">Reparto principal</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="actor in movie.credits.cast.slice(0, 6)" :key="actor.id" class="space-y-2">
              <img 
                :src="actor.profile_path ? `${imageBase}${actor.profile_path}` : '/placeholder.png'" 
                :alt="actor.name"
                class="w-full aspect-[2/3] object-cover rounded-lg"
              />
              <div class="px-1">
                <h3 class="font-medium line-clamp-1">{{ actor.name }}</h3>
                <p class="text-sm text-gray-400 line-clamp-1">{{ actor.character }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Similar movies -->
        <section v-if="movie.similar?.results?.length" class="space-y-4">
          <h2 class="text-2xl font-semibold">Películas similares</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <MovieCard 
              v-for="similar in movie.similar.results.slice(0, 6)" 
              :key="similar.id" 
              :movie="similar"
            />
          </div>
        </section>
      </div>
    </section>

    <!-- Trailer modal -->
    <div 
      v-if="showTrailer && trailer" 
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      @click="showTrailer = false"
    >
      <div class="relative w-full max-w-5xl mx-4">
        <button 
          class="absolute -top-12 right-0 p-2 hover:text-red-500 transition-colors"
          @click="showTrailer = false"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="relative pb-[56.25%]">
          <iframe
            :src="trailerUrl"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovie } from '../services/tmdb'
import { useUser } from '../stores/useUser'
import MovieCard from '../components/MovieCard.vue'

interface Credit {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number
  vote_average: number
  genres: Array<{ id: number; name: string }>
  videos?: {
    results: Array<{
      id: string
      key: string
      site: string
      type: string
    }>
  }
  credits?: {
    cast: Credit[]
  }
  similar?: {
    results: any[]
  }
}

const route = useRoute()
const router = useRouter()
const user = useUser()

// Estado
const movie = ref<Movie | null>(null)
const loading = ref(true)
const error = ref('')
const showTrailer = ref(false)

// Constantes
const imageBase = import.meta.env.VITE_TMDB_IMG

// Computed
const poster = computed(() => 
  movie.value?.poster_path ? `${imageBase}${movie.value.poster_path}` : '/placeholder.png'
)

const backdrop = computed(() => 
  movie.value?.backdrop_path ? `${imageBase}${movie.value.backdrop_path}` : '/placeholder.png'
)

const trailer = computed(() => {
  if (!movie.value?.videos?.results) return null
  return movie.value.videos.results.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )
})

const trailerUrl = computed(() => {
  if (!trailer.value) return ''
  return `https://www.youtube.com/embed/${trailer.value.key}?autoplay=1`
})

const inWatchlist = computed(() => 
  !!movie.value && user.watchlist.some(m => m.id === movie.value.id)
)

// Métodos
async function loadMovie() {
  const id = route.params.id as string
  if (!id) return router.push('/not-found')

  try {
    loading.value = true
    error.value = ''
    movie.value = await getMovie(id)
  } catch (e) {
    console.error('Error loading movie:', e)
    error.value = 'No se pudo cargar la película. Por favor, intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

function toggleWL() {
  if (!movie.value) return
  user.toggle({
    id: movie.value.id,
    title: movie.value.title,
    poster_path: movie.value.poster_path
  })
}

// Lifecycle
onMounted(loadMovie)

// Cleanup
onUnmounted(() => {
  showTrailer.value = false
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
