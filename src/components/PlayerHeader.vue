<!-- filepath: src/components/PlayerHeader.vue -->
<template>
  <header class="player-header">
    <b class="player-name" v-if="playerName">{{ playerName }}</b>
    <div class="player-chinese-name" v-if="chineseName">
      {{ "(" + chineseName + ")" }}
    </div>
    <div class="number">
      <div class="player-number" v-if="number">
        <img
          class="number-icon"
          alt="Number"
          src="@/assets/images/number.svg"
        />
        <b>{{ number }}</b>
      </div>
    </div>
    <a :href="socialLink" class="social-link" v-if="socialLink">
      <img
        class="instagram-icon"
        alt="Instagram"
        src="@/assets/images/instagram-icon.svg"
      />
    </a>
  </header>
</template>

<script setup>
defineProps({
  playerName: String,
  chineseName: String,
  number: String,
  socialLink: String,
});
</script>

<style scoped>
.player-name {
  position: absolute;
  top: 322px;
  left: 40px;
  font-size: 48px;
  display: inline-block;
  font-family: "Century Gothic";
  text-align: left;
  width: 484px;
  height: 65px;
}
.player-chinese-name {
  position: absolute;
  top: 352px;
  left: 366px;
  font-size: 14px;
  letter-spacing: 0.07em;
  text-align: left;
}
.number {
  position: absolute;
  top: 326px;
  left: 462px;
  width: 52px;
  height: 52px;
  overflow: hidden;
  font-size: 16px;
  color: #fff;
  font-family: "Century Gothic";
}
.player-number {
  position: absolute;
  height: 75%;
  width: 88.27%;
  top: 12.41%;
  right: 5.84%;
  bottom: 12.59%;
  left: 5.89%;
}
.player-number b {
  position: absolute;
  height: 68.97%;
  width: 46.62%;
  top: 6.65%;
  left: 25.34%;
  line-height: 29px;
  display: inline-block;
}
.number-icon {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.instagram-icon {
  position: absolute;
  top: 387px;
  left: 37px;
  width: 39px;
  height: 40px;
  overflow: hidden;
}
</style>
