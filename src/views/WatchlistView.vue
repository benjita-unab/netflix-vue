
<template>
  <section class="container py-6 min-h-screen">
    <!-- Header with stats -->
    <header class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold mb-2">Mi Lista</h1>
        <p class="text-gray-400">
          {{ count }} {{ count === 1 ? 'película' : 'películas' }} en la lista
        </p>
      </div>
      
      <button 
        v-if="!isEmpty"
        @click="showClearConfirm = true"
        class="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
      >
        Limpiar lista
      </button>
    </header>

    <!-- Empty state -->
    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="w-20 h-20 text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h2 class="text-xl font-medium mb-2">Tu lista está vacía</h2>
      <p class="text-gray-400 mb-6">Agrega películas desde la página principal o búsqueda</p>
      <router-link 
        to="/" 
        class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg inline-flex items-center transition-colors"
      >
        Explorar películas
      </router-link>
    </div>

    <!-- Movies grid -->
    <div v-else>
      <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill,minmax(160px,1fr));">
        <div 
          v-for="movie in items" 
          :key="movie.id" 
          class="group relative"
        >
          <MovieCard :movie="movie" />
          
          <!-- Remove button overlay -->
          <button 
            @click.stop="removeMovie(movie.id)"
            class="absolute top-2 right-2 p-2 bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Eliminar de la lista"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Clear confirmation modal -->
    <div 
      v-if="showClearConfirm" 
      class="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-900 rounded-xl p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">¿Limpiar lista?</h3>
        <p class="text-gray-400 mb-6">
          ¿Estás seguro que deseas eliminar {{ count }} {{ count === 1 ? 'película' : 'películas' }} de tu lista? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showClearConfirm = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="clearWatchlist"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sí, limpiar lista
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUser } from '../stores/useUser'
import MovieCard from '../components/MovieCard.vue'

const user = useUser()
const { watchlist: items, count, isEmpty } = storeToRefs(user)
const showClearConfirm = ref(false)

function removeMovie(id: number) {
  user.remove(id)
}

function clearWatchlist() {
  user.clear()
  showClearConfirm.value = false
}
</script>
