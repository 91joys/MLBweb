<script setup>
import Logo  from "@/components/Logo.vue";
import card from '../components/card.vue'
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
  <div class="player-card">
    <div class="card-gradient" />
    <Logo customClass="header-logo"/>
    <div class="position-title">投手</div>
    <div class="content">
      <!-- <card
        v-for="(player, index) in players"
        :key="index"
        v-bind="player"
      /> -->
      <div class="navigation">
        <img class="nav-arrow-left" alt="Previous" src="@/assets/images/Left_vector.svg" />
        <img class="nav-arrow-right" alt="Next" src="@/assets/images/Right_vector.svg" />
      </div>
    </div>
    <div class="pagination">
      <div class="pagination-track"></div>
      <div class="pagination-indicator"></div>
    </div>
    <div class="pagination-track" />
    <div class="pagination-indicator" />
  </div>
</template>
<style scoped>
.player-card {
  width: 100%;
  position: relative;
  background-color: #005596;
  height: 1080px;
  overflow: hidden;
  text-align: center;
  font-size: 20px;
  color: #005596;
  font-family: "Noto Sans TC";
}
.card-gradient {
  position: absolute;
  top: 162px;
  left: 0px;
  background: linear-gradient(180deg, #fff, #005596);
  width: 1920px;
  height: 918px;
}
/* 左上Logo樣式 */
.header-logo {
  transform: scale(0.7); /* 縮小至70%大小，可以根據需要調整比例 */
  transform-origin: top left; /* 以左上角為縮放基準點 */
  padding: 20px;
  position: absolute; /* 確保縮放不影響其他元素 */
  top: 30px; /* 調整垂直位置 */
  left: 30px; /* 調整水平位置 */
	justify-content: start;
}
.position-title {
  position: absolute;
  top: 34px;
  left: calc(50% - 159px);
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  display: inline-block;
  width: 317px;
  height: 97px;
}
.nav-arrow-left{
  position: absolute;
  height: 6.11%;
  width: 1.72%;
  top: 49.81%;
  right: 96.15%;
  bottom: 44.07%;
  left: 2.14%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  object-fit: contain;
}
.nav-arrow-right{
  position: absolute;
  height: 6.11%;
  width: 1.72%;
  top: 49.81%;
  right: 2.19%;
  bottom: 44.07%;
  left: 96.09%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  object-fit: contain;
}
.pagination-track {
  position: absolute;
  top: 1017px;
  left: calc(50% - 303px);
  border-radius: 6px;
  background-color: #fff;
  width: 605px;
  height: 12px;
  opacity: 0.4;
}
.pagination-indicator {
  position: absolute;
  top: 1017px;
  left: calc(50% - 303px);
  border-radius: 6px;
  background-color: #fff;
  width: 96px;
  height: 12px;
  opacity: 0.4;
}

  
</style>
