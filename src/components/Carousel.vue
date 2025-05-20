<script setup>
import { ref } from "vue";
import card from '../components/card.vue'
import rawPlayers from '@/assets/data/players.json'
import Carousel from 'primevue/carousel';

// 將 Image_URL 加工成 Vite 可用的真實 URL
const players = rawPlayers.map(player => {
  if (player.Image_URL) {
    try {
      // 方法一：使用 import.meta.glob 預載入所有圖片
      const imageUrl = `/src/assets/images/players/${player.Image_URL}`
      return {
        ...player,
        Image_URL: imageUrl
      }
    } catch (error) {
      console.error(`無法載入圖片: ${player.Image_URL}`, error)
      return player
    }
  }
  return player
})

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>

<template>
    <div class="card">
    <Carousel
      :value="players"
      :numVisible="3"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      circular
      :autoplayInterval="3000"
    >
      <template #item="{ data }">
        <card v-bind="data" />
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

.p-carousel .p-carousel-content {
  width: 100% !important;
}

.p-carousel-item {
  display: flex;
  justify-content: center;
}
</style>