<script setup>
import { RouterLink } from "vue-router";
import Logo from "@/components/Logo.vue";
import { ref, onMounted } from "vue";

const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div class="home" :class="{ loaded: isLoaded }">
    <div class="home-header">
      <Logo customClass="header-logo animate-slide-in" />
      <b class="site-title animate-fade-in">MLB 道奇資訊網</b>
      <div class="site-intro animate-fade-in-delay">
        給台灣人的MLB資訊網，讓球迷可以跟上國際棒球時事
      </div>
    </div>
    <RouterLink to="/login" class="enter-button animate-bounce-in">
      <div class="button-content">
        <img
          class="icon"
          alt="Baseballman Icon"
          src="@/assets/images/baseballman.svg"
        />
        <b class="button-text">登入</b>
      </div>
    </RouterLink>
    <div class="footer animate-slide-up">
      <div class="divider-line"></div>
      <div class="slogan">跟上道奇 不會過期</div>
      <div class="divider-line"></div>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #fff;
  overflow-x: hidden;
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
  background: linear-gradient(135deg, #005596 0%, #0066b3 100%);
  width: 100%;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

/* 動畫效果 */
.animate-slide-in {
  opacity: 0;
  transform: translateX(100px);
  transition: all 0.8s ease-out;
}

.animate-fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out 0.3s;
}

.animate-fade-in-delay {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out 0.6s;
}

.animate-bounce-in {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.9s;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out 1.2s;
}

.loaded .animate-slide-in,
.loaded .animate-fade-in,
.loaded .animate-fade-in-delay,
.loaded .animate-bounce-in,
.loaded .animate-slide-up {
  opacity: 1;
  transform: translateX(0) translateY(0) scale(1);
}

/* 頂部MLB+道奇logo群組 */
.header-logo {
  padding-top: 20px;
  justify-content: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.site-title {
  position: relative;
  font-size: clamp(2.5rem, 8vw, 10rem);
  display: inline-block;
  max-width: 100%;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 1rem 0;
}

.site-intro {
  position: relative;
  letter-spacing: 0.08em;
  display: inline-block;
  max-width: 90%;
  font-size: clamp(1rem, 2.5vw, 2rem);
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* 進入主頁按鈕 */
.enter-button {
  position: relative;
  width: min(600px, 85%);
  height: auto;
  min-height: 120px;
  cursor: pointer;
  text-align: left;
  font-size: clamp(2rem, 4vw, 3.5rem);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  border-radius: 60px;
  background: linear-gradient(145deg, #005596, #004a82);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.5rem 2rem;
  box-sizing: border-box;
}

.enter-button:hover {
  background: linear-gradient(145deg, #0066b3, #005596);
  box-shadow: 0 12px 30px rgba(0, 85, 150, 0.4);
  transform: translateY(-5px) scale(1.02);
}

.enter-button:active {
  transform: translateY(-2px) scale(0.98);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.button-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: clamp(10px, 2vw, 20px);
}

.icon {
  width: clamp(40px, 5vw, 58px);
  height: auto;
  aspect-ratio: 58/96;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.enter-button:hover .icon {
  transform: rotate(5deg) scale(1.1);
}

.button-text {
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.footer {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.slogan {
  letter-spacing: 0.99em;
  font-weight: 500;
  color: #005596;
  display: inline-block;
  padding: 0 20px;
  font-size: clamp(1.2rem, 2vw, 2rem);
  white-space: nowrap;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: color 0.3s ease;
}

.slogan:hover {
  color: #0066b3;
}

.divider-line {
  border-top: 2px solid #005596;
  flex-grow: 1;
  height: 2px;
  max-width: min(626px, 30%);
  transition: border-color 0.3s ease;
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .site-title {
    font-size: clamp(2rem, 6vw, 6rem);
  }
}

@media (max-width: 768px) {
  .home {
    font-size: 24px;
  }

  .home-header {
    min-height: 70vh;
    padding: 1rem;
  }

  .header-logo {
    transform: translateX(0);
    padding-top: 10px;
  }

  .enter-button {
    width: 90%;
    min-height: 100px;
    margin: 30px auto;
    padding: 1rem;
  }

  .button-content {
    flex-direction: row;
  }

  .footer {
    padding: 15px;
  }

  .slogan {
    letter-spacing: 0.5em;
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .home {
    font-size: 20px;
  }

  .home-header {
    min-height: 65vh;
    padding: 0.5rem;
  }

  .site-title {
    margin: 0.5rem 0;
  }

  .enter-button {
    width: 95%;
    min-height: 80px;
    border-radius: 40px;
    margin: 20px auto;
  }

  .button-content {
    gap: 10px;
  }

  .slogan {
    letter-spacing: 0.3em;
    padding: 0 10px;
  }

  .divider-line {
    max-width: 25%;
  }
}

/* 載入動畫 */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.enter-button:hover {
  animation: pulse 2s infinite;
}

/* 平滑滾動 */
html {
  scroll-behavior: smooth;
}

/* 高對比模式支援 */
@media (prefers-contrast: high) {
  .home-header {
    background: #003d6b;
  }

  .enter-button {
    background: #003d6b;
    border: 2px solid #fff;
  }

  .slogan,
  .divider-line {
    color: #003d6b;
    border-color: #003d6b;
  }
}

/* 減少動畫偏好支援 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
