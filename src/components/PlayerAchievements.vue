<!-- filepath: src/components/PlayerAchievements.vue -->
<template>
  <section class="player-achievements">
    <div class="achievements-frame" />
    <div class="ball-background" />
    <img class="baseball" alt="" src="@/assets/images/baseball.svg" />
    <b>數據與戰績</b>
    <ul class="achievements-list" v-if="achievements && achievements.length">
      <li v-for="(achievement, index) in achievements" :key="index">
        - {{ achievement }}
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  achievements: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.player-achievements b {
  position: absolute;
  top: 638px;
  left: 99px;
  font-size: 24px;
}
.achievements-frame {
  position: absolute;
  top: 635px;
  left: 49px;
  border-radius: 29px;
  border: 2px solid #005596;
  box-sizing: border-box;
  width: 190px;
  height: 42px;
}
.baseball {
  position: absolute;
  top: 633px;
  left: 37px;
  width: 46px;
  height: 46px;
  overflow: hidden;
}
.ball-background {
  position: absolute;
  top: 628px;
  left: 32px;
  border-radius: 50%;
  background-color: #005596;
  width: 56px;
  height: 56px;
}
.achievements-list {
  position: absolute;
  top: 639px;
  left: 260px;
  letter-spacing: 0.03em;
  line-height: 31px;
  font-weight: 500;
  color: #000;
  text-align: left;
  list-style-type: none;
}
</style>
