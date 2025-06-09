import { ref } from 'vue'

export function useAutoplay(nextSlide) {
  const autoplayInterval = ref(null)

  const startAutoplay = () => {
    if (autoplayInterval.value) clearInterval(autoplayInterval.value)
    autoplayInterval.value = setInterval(nextSlide, 3000)
  }

  const stopAutoplay = () => {
    if (autoplayInterval.value) {
      clearInterval(autoplayInterval.value)
      autoplayInterval.value = null
    }
  }

  return {
    startAutoplay,
    stopAutoplay
  }
}