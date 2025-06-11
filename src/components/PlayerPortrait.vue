<!-- filepath: src/components/PlayerPortrait.vue -->
<template>
  <section class="player-portrait" v-if="imageUrl">
    <div class="image-background" />
    <img class="player-image" :alt="playerName" :src="imageUrl" />
  </section>
</template>

<script setup>
defineProps({
  imageUrl: String,
  playerName: String,
});
</script>

<style scoped>
.player-image {
  position: absolute;
  top: 0px;
  left: 49px;
  width: 421px;
  height: 314px;
  object-fit: cover;
}
.image-background {
  position: absolute;
  top: 208px;
  left: 30px;
  box-shadow: 0px -6px 3.8px rgba(0, 0, 0, 0.25) inset;
  border-radius: 53px;
  background-color: #005596;
  width: 486px;
  height: 106px;
}
</style>
