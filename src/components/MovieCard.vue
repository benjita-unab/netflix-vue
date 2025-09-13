
<template>
  <article 
    class="group cursor-pointer relative w-[160px]" 
    @click="$router.push({ name:'detail', params:{ id: movie.id } })"
  >
    <div class="relative overflow-hidden rounded-md">
      <img 
        :src="imgUrl" 
        :alt="movie.title" 
        class="w-full aspect-[2/3] object-cover transform transition-transform duration-300 group-hover:scale-105" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 p-4 w-full">
          <div class="flex items-center space-x-2 mb-2">
            <span v-if="movie.vote_average" class="bg-red-600 px-2 py-1 rounded text-xs font-bold">
              ⭐ {{ movie.vote_average.toFixed(1) }}
            </span>
            <span v-if="movie.release_date" class="text-xs">
              {{ new Date(movie.release_date).getFullYear() }}
            </span>
          </div>
          <p class="text-sm line-clamp-3" v-if="movie.overview">{{ movie.overview }}</p>
        </div>
      </div>
    </div>
    <h3 class="font-medium text-sm mt-2 line-clamp-1">{{ movie.title }}</h3>
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average?: number
  release_date?: string
  overview?: string
}

const props = defineProps<{ movie: Movie }>()
const base = import.meta.env.VITE_TMDB_IMG
const imgUrl = computed(() => props.movie.poster_path ? `${base}${props.movie.poster_path}` : '/placeholder.png')
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
