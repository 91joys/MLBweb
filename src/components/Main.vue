<script setup>
  	function onGroupContainerClick() {
    		// Add your code here
  	}
</script>
<template>
  	<div :class="$style.position">
    		<!-- <img :class="$style.positionChild" alt="" src="Group 6.svg" />
    		<img :class="$style.positionItem" alt="" src="Group 7.svg" />
    		<img :class="$style.positionInner" alt="" src="Group 5.svg" /> -->
    		<div :class="$style.ellipseDiv" />
    		<div :class="$style.parent">
      			<img :class="$style.icon" alt="" src="@/assets/images/logo.svg" />
      			<img :class="$style.t119HeaderPrimary1Icon" alt="" src="@/assets/images/dodger-logo.svg" />
      			<div :class="$style.groupChild" />
    		</div>
    		<div :class="$style.hoverWrapper" @click="onGroupContainerClick">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">1</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballWrapper">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">2</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballContainer">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">3</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballFrame">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">7</div>
      			</div>
    		</div>
    		<div :class="$style.groupDiv">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">9</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballWrapper1">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">8</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballWrapper2">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">6</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballWrapper3">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">4</div>
      			</div>
    		</div>
    		<div :class="$style.twemojibaseballWrapper4">
      			<div :class="$style.hover">
        				<img :class="$style.vectorIcon" alt="" src="@/assets/images/ball1.svg" />
        				<img :class="$style.vectorIcon1" alt="" src="@/assets/images/ball2.svg" />
        				<img :class="$style.vectorIcon2" alt="" src="@/assets/images/ball3.svg" />
        				<div :class="$style.div">5</div>
      			</div>
    		</div>
  	</div>
</template>

<style  module>.positionChild {
  	position: absolute;
  	top: 124px;
  	left: 87px;
  	width: 1746px;
  	height: 775px;
}
  	.positionItem {
    		position: absolute;
    		top: 335px;
    		left: 324.68px;
    		width: 1270.6px;
    		height: 564px;
  	}
  	.positionInner {
    		position: absolute;
    		top: 423.26px;
    		left: 476px;
    		width: 969px;
    		height: 478.2px;
  	}
  	.ellipseDiv {
    		position: absolute;
    		top: 765px;
    		left: calc(50% - 200px);
    		border-radius: 50%;
    		background-color: #b5e3b6;
    		width: 400px;
    		height: 229px;
  	}
  	.icon {
    		position: absolute;
    		top: 12.27px;
    		left: 0px;
    		border-radius: 10px;
    		width: 103.3px;
    		height: 54.9px;
    		overflow: hidden;
  	}
  	.t119HeaderPrimary1Icon {
    		position: absolute;
    		top: 0px;
    		left: 185.29px;
    		width: 131.7px;
    		height: 71.7px;
    		overflow: hidden;
  	}
  	.groupChild {
    		position: absolute;
    		top: 21.6px;
    		left: 142.97px;
    		border-right: 2px solid #fff;
    		box-sizing: border-box;
    		width: 2px;
    		height: 35.6px;
  	}
  	.parent {
    		position: absolute;
    		top: 41px;
    		left: 50px;
    		width: 317px;
    		height: 71.7px;
  	}
  	.vectorIcon {
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
  	.vectorIcon1 {
    		position: absolute;
    		height: 72.48%;
    		width: 76.7%;
    		top: 13.75%;
    		right: 11.38%;
    		bottom: 13.77%;
    		left: 11.93%;
    		max-width: 100%;
    		overflow: hidden;
    		max-height: 100%;
  	}
  	.vectorIcon2 {
    		position: absolute;
    		height: 70%;
    		width: 80.18%;
    		top: 13.89%;
    		right: 9.72%;
    		bottom: 16.11%;
    		left: 10.09%;
    		max-width: 100%;
    		overflow: hidden;
    		max-height: 100%;
    		opacity: 0.36;
  	}
  	.div {
    		position: absolute;
    		height: 137.61%;
    		width: 63.3%;
    		top: 23.85%;
    		left: 18.35%;
    		display: inline-block;
  	}
  	.hover {
    		position: absolute;
    		top: 0px;
    		left: 0px;
    		width: 109px;
    		height: 109px;
    		overflow: hidden;
  	}
  	.hoverWrapper {
    		position: absolute;
    		top: 589px;
    		left: 905px;
    		width: 109px;
    		height: 109px;
    		cursor: pointer;
  	}
  	.twemojibaseballWrapper {
    		position: absolute;
    		top: 825px;
    		left: 905px;
    		width: 109px;
    		height: 109px;
  	}
  	.twemojibaseballContainer {
    		position: absolute;
    		top: 589px;
    		left: 1381px;
    		width: 109px;
    		height: 109px;
  	}
  	.twemojibaseballFrame {
    		position: absolute;
    		top: 260px;
    		left: 1351px;
    		width: 109px;
    		height: 109px;
  	}
  	.groupDiv {
    		position: absolute;
    		top: 260px;
    		left: 459px;
    		width: 109px;
    		height: 109px;
  	}
  	.twemojibaseballWrapper1 {
    		position: absolute;
    		top: 180px;
    		left: 905px;
    		width: 109px;
    		height: 109px;
  	}
  	.twemojibaseballWrapper2 {
    		position: absolute;
    		top: 589px;
    		left: 429px;
    		width: 109px;
    		height: 109px;
  	}
  	.twemojibaseballWrapper3 {
    		position: absolute;
    		top: 431px;
    		left: 1147px;
    		width: 109px;
    		height: 109px;
  	}
  	.twemojibaseballWrapper4 {
    		position: absolute;
    		top: 431px;
    		left: 666px;
    		width: 109px;
    		height: 109px;
  	}
  	.position {
    		width: 100%;
    		position: relative;
    		background-color: #005596;
    		border: 1px solid #000;
    		box-sizing: border-box;
    		height: 1080px;
    		overflow: hidden;
    		text-align: center;
    		font-size: 64px;
    		color: #dd2e44;
    		font-family: Heavitas;
  	}

</style>