<script setup>
import { RouterLink } from "vue-router";
import Logo from "@/components/Logo.vue";
</script>

<template>
  <div class="home">
    <div class="home-header">
      <Logo customClass="header-logo" />
      <b class="site-title">MLB 道奇資訊網</b>
      <div class="site-intro">
        給台灣人的MLB資訊網，讓球迷可以跟上國際棒球時事
      </div>
    </div>
    <RouterLink to="/login" class="enter-button">
      <div class="button-content">
        <img
          class="icon"
          alt="Baseballman Icon"
          src="@/assets/images/baseballman.svg"
        />
        <b class="button-text">登入</b>
      </div>
    </RouterLink>
    <div class="footer">
      <div class="divider-line"></div>
      <div class="slogan">跟上道奇 不會過期</div>
      <div class="divider-line"></div>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #fff;
  height: 1080px;
  overflow: hidden;
  text-align: center;
  font-size: 32px;
  color: #fff;
  font-family: "Noto Sans TC";
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.home-header {
  position: relative;
  background-color: #005596;
  width: 100%;
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 頂部MLB+道奇logo群組 */
.header-logo {
  transform: translateX(50px);
  padding-top: 20px;
  justify-content: center;
}

.site-title {
  position: relative;
  font-size: 160px;
  display: inline-block;
  width: 1652px;
}
.site-intro {
  position: relative;
  letter-spacing: 0.08em;
  display: inline-block;
  width: 965px;
}

/* 進入主頁按鈕 */
.enter-button {
  position: relative;
  width: 600px;
  height: 169px;
  cursor: pointer;
  text-align: left;
  font-size: 56px;
  box-shadow: 6px 6px 7.8px rgba(0, 0, 0, 0.25);
  border-radius: 84.5px;
  background-color: #005596;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 70px auto;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    background-color 0.15s ease;
}
.enter-button:hover {
  background-color: #0066b3;
  box-shadow: 8px 8px 10px rgba(0, 0, 0, 0.3);
}
.enter-button:active {
  transform: translateY(3px) scale(0.98);
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  background-color: #004a82;
}
.button-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.icon {
  width: 58px;
  height: 96px;
}
.button-text {
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
}
.footer {
  width: 100%;
  padding-bottom: 20px; /* 底部間距 */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.slogan {
  letter-spacing: 0.99em;
  font-weight: 500;
  color: #005596;
  display: inline-block;
  padding: 0 20px;
}
.divider-line {
  border-top: 2px solid #005596;
  flex-grow: 1;
  height: 2px;
  max-width: 626px;
}
</style>
