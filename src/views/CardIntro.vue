<script setup>
import Logo from "@/components/Logo.vue";
import Carousel from "@/components/Carousel.vue";
import { ref } from "vue";

// 定義當前選中的位置
const selectedPosition = ref("所有球員");

// 可選的位置列表
const positions = ["所有球員", "投手", "捕手", "內野手", "外野手"];

// 當選單選項變更時的處理函數
const handlePositionChange = (position) => {
  selectedPosition.value = position;
};
</script>

<template>
  <div class="player-card-inner">
    <div class="card-gradient" />
    <Logo customClass="header-logo" />
    <div class="position-title">{{ selectedPosition }}</div>
    <!-- 添加位置選單 -->
    <div class="position-menu">
      <div
        v-for="position in positions"
        :key="position"
        :class="['position-item', { active: selectedPosition === position }]"
        @click="handlePositionChange(position)"
      >
        {{ position }}
      </div>
    </div>
    <div class="carousel">
      <Carousel />
    </div>
  </div>
</template>
<style scoped>
.player-card-inner {
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
  width: 100%;
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
/* 位置選單樣式 */
.position-menu {
  position: absolute;
  top: 130px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  z-index: 20;
}

.position-item {
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  color: #005596;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.position-item:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.position-item.active {
  background-color: #fff;
  color: #d31145;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.carousel {
  position: relative;
  width: 100%; /* 保持 100% */
  max-width: 1920px; /* 添加最大寬度 */
  min-width: 1200px; /* 添加最小寬度 */
  height: 800px;
  margin-top: 200px;
  margin-left: auto; /* 水平居中 */
  margin-right: auto; /* 水平居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* 確保輪播在漸層背景上方 */
  box-sizing: border-box; /* 確保padding不會增加元素尺寸 */
}
</style>
