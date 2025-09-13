<template>
  <div class="min-h-screen bg-netflix-black text-white">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div class="container">
        <div class="h-16 flex items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="text-netflix-red font-bold text-2xl">VUEFLIX</router-link>

          <!-- Navigation -->
          <div class="flex items-center space-x-6">
            <router-link 
              v-for="item in navItems" 
              :key="item.to"
              :to="item.to"
              class="text-sm hover:text-white transition-colors"
              :class="$route.path === item.to ? 'text-white' : 'text-gray-300'"
            >
              {{ item.text }}
            </router-link>
          </div>

          <!-- Search and Watchlist -->
          <div class="flex items-center space-x-4">
            <router-link 
              to="/search"
              class="p-2 hover:text-netflix-red transition-colors"
              :class="$route.path === '/search' ? 'text-netflix-red' : 'text-white'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </router-link>

            <router-link 
              to="/watchlist" 
              class="relative p-2 hover:text-netflix-red transition-colors"
              :class="$route.path === '/watchlist' ? 'text-netflix-red' : 'text-white'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <!-- Watchlist count badge -->
              <span 
                v-if="watchlistCount > 0"
                class="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-netflix-red rounded-full text-2xs font-bold"
              >
                {{ watchlistCount }}
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="pt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-8 mt-12 border-t border-netflix-gray-medium">
      <div class="container text-center text-netflix-gray-light">
        <p>&copy; {{ new Date().getFullYear() }} Vueflix. Construido con Vue 3 + Tailwind CSS</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUser } from '../stores/useUser'

const { count: watchlistCount } = storeToRefs(useUser())

const navItems = [
  { to: '/', text: 'Inicio' },
  { to: '/movies', text: 'Películas' },
  { to: '/series', text: 'Series' }
]
</script>