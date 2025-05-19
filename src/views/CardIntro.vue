<script setup>
import card from '../components/card.vue'
import Card_background from '@/components/CardBackground.vue'
import rawPlayers from '@/assets/data/players1.json'

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
</script>

<template>
  <main>
    <Card_background />
    <!-- <card
      v-for="(player, index) in players"
      :key="index"
      v-bind="player"
    /> -->
  </main>
</template>

<style scoped></style>

