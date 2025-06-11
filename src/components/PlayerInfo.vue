<!-- filepath: src/components/PlayerInfo.vue -->
<template>
  <section class="player-info">
    <dl>
      <div class="info-item" v-for="item in infoItems" :key="item.label">
        <dt>{{ item.label }}:</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
defineProps({
  infoItems: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.player-info {
  position: absolute;
  top: 387px;
  left: 89px;
  letter-spacing: 0.03em;
  line-height: 29px;
  font-weight: 500;
  text-align: left;
  display: inline-block;
  width: 229px;
}
dl {
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
