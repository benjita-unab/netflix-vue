<template>
  <article 
    class="group cursor-pointer relative w-[160px]" 
    @click="goToDetail"
  >
    <div class="relative overflow-hidden rounded-md">
      <img 
        :src="imgUrl" 
        :alt="series.name" 
        class="w-full aspect-[2/3] object-cover transform transition-transform duration-300 group-hover:scale-105" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 p-4 w-full">
          <div class="flex items-center space-x-2 mb-2">
            <span v-if="series.vote_average" class="bg-red-600 px-2 py-1 rounded text-xs font-bold">
              ⭐ {{ series.vote_average.toFixed(1) }}
            </span>
            <span v-if="series.first_air_date" class="text-xs">
              {{ new Date(series.first_air_date).getFullYear() }}
            </span>
          </div>
          <p class="text-sm line-clamp-3" v-if="series.overview">{{ series.overview }}</p>
        </div>
      </div>
    </div>
    <h3 class="font-medium text-sm mt-2 line-clamp-1">{{ series.name }}</h3>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Series {
  id: number
  name: string
  poster_path: string | null
  vote_average?: number
  first_air_date?: string
  overview?: string
}

const props = defineProps<{ series: Series }>()
const router = useRouter()

const base = import.meta.env.VITE_TMDB_IMG
const imgUrl = computed(() => props.series.poster_path ? `${base}${props.series.poster_path}` : '/placeholder.png')

function goToDetail() {
  // Por ahora redirigimos a la misma vista de detail, pero podrías crear una específica para series
  router.push({ name: 'detail', params: { id: props.series.id } })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>