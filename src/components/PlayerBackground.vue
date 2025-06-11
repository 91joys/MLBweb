<!-- filepath: src/components/PlayerBackground.vue -->
<template>
  <section class="player-background">
    <div class="background-frame" />
    <div class="bat-background" />
    <img class="baseball-bat" alt="" src="@/assets/images/baseball-bat.svg" />
    <b>個人背景</b>
    <dl class="background-info">
      <div class="info-item" v-for="item in backgroundItems" :key="item.label">
        <dt>{{ item.label }}:</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
defineProps({
  backgroundItems: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.player-background b {
  position: absolute;
  top: 489px;
  left: 111px;
  font-size: 24px;
}
.background-frame {
  position: absolute;
  top: 487px;
  left: 49px;
  border-radius: 29px;
  border: 2px solid #005596;
  box-sizing: border-box;
  width: 190px;
  height: 42px;
}
.bat-background {
  position: absolute;
  top: 480px;
  left: 32px;
  border-radius: 50%;
  background-color: #005596;
  width: 56px;
  height: 56px;
}
.baseball-bat {
  position: absolute;
  top: 489px;
  left: 41px;
  width: 38px;
  height: 38px;
  overflow: hidden;
}
.background-info {
  position: absolute;
  top: 490px;
  left: 263px;
  letter-spacing: 0.03em;
  line-height: 31px;
  font-weight: 500;
  color: #000;
  text-align: left;
}
dt {
  font-weight: 500;
  margin-right: 5px;
  white-space: nowrap;
}
dd {
  margin: 0;
}
.info-item {
  margin: 0;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
</style>
