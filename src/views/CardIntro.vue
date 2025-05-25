<script setup>
import Navbar from "@/components/navbar.vue";
import Carousel from "@/components/Carousel.vue";
</script>

<template>
  <div class="container">
    <div class="card-gradient" />
    <header class="selected-position">
      <Navbar />
    </header>
    <div class="carousel">
      <Carousel />
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  background-color: #005596;
  overflow: hidden;
  text-align: center;
  font-size: 20px;
  color: #005596;
  font-family: "Noto Sans TC";
}
.card-gradient {
  position: absolute;
  top: 150px;
  left: 0px;
  background: linear-gradient(180deg, #fff, #005596);
  width: 100%;
  height: 930px;
}

.carousel {
  position: relative;
  /* width: 100%;
  max-width: 1920px;
  min-width: 1200px;
  height: 500px;
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  box-sizing: border-box; */
}
</style>
