
import { defineStore } from 'pinia'
export interface WLItem { id:number; title:string; poster_path:string|null }
const KEY = 'vueflix_watchlist'

function load(): WLItem[] {
  try { return JSON.parse(localStorage.getItem(KEY)||'[]') } catch { return [] }
}

export const useUser = defineStore('user', {
  state: () => ({ 
    watchlist: load() as WLItem[],
    lastAdded: null as WLItem | null 
  }),
  
  getters: {
    count: (state) => state.watchlist.length,
    isEmpty: (state) => state.watchlist.length === 0,
    isInWatchlist: (state) => (movieId: number) => state.watchlist.some(m => m.id === movieId)
  },
  
  actions: {
    toggle(movie: WLItem) {
      const exists = this.watchlist.find(m => m.id === movie.id)
      if (exists) {
        this.watchlist = this.watchlist.filter(m => m.id !== movie.id)
      } else {
        this.watchlist = [movie, ...this.watchlist] // Añadir al principio
        this.lastAdded = movie
      }
      this.saveToStorage()
    },
    
    remove(movieId: number) {
      this.watchlist = this.watchlist.filter(m => m.id !== movieId)
      this.saveToStorage()
    },
    
    clear() {
      this.watchlist = []
      this.lastAdded = null
      this.saveToStorage()
    },
    
    saveToStorage() {
      localStorage.setItem(KEY, JSON.stringify(this.watchlist))
    }
  }
})
