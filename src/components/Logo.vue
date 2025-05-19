<script setup>
defineProps({
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div :class="['logo-container', customClass]">
    <img class="mlb-icon" alt="MLB Logo" src="@/assets/images/logo.svg" />
    <div class="divider" />
    <img class="dodger-logo" alt="Dodger Logo" src="@/assets/images/dodger-logo.svg" />
  </div>
</template>

<style scoped>
.logo-container {
	width: 100%;
	height: 111px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.mlb-icon {
	border-radius: 10px;
	width: 160px;
	height: 85px;
	margin-right: 50px;
}
.dodger-logo {
	width: 300px;
	height: 111px;
}
.divider {
	border-right: 2px solid #fff;
	box-sizing: border-box;
	width: 2px;
	height: 54px;
}
</style>
