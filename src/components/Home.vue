<template>
  	<div :class="$style.home">
    		<div :class="$style.homeChild" />
    		<b :class="$style.mlb">MLB 道奇資訊網</b>
    		<div :class="$style.div">跟上道奇 不會過期</div>
    		<div :class="$style.mlb1">給台灣人的MLB資訊網，讓球迷可以跟上國際棒球時事</div>
    		<div :class="$style.rectangleParent" @click="onGroupContainerClick">
      			<div :class="$style.groupChild" />
      			<div :class="$style.vectorParent">
        				<img :class="$style.vectorIcon" alt="" src="Vector.svg" />
        				<b :class="$style.b">點選進入</b>
      			</div>
    		</div>
    		<div :class="$style.parent">
      			<img :class="$style.icon" alt="" src="1 1.svg" />
      			<img :class="$style.t119HeaderPrimary1Icon" alt="" src="t119_header_primary 1.svg" />
      			<div :class="$style.groupItem" />
    		</div>
    		<div :class="$style.homeItem" />
    		<div :class="$style.homeInner" />
  	</div>
</template>
<script setup lang="ts">
  	
  	
  	function onGroupContainerClick() {
    		// Add your code here
  	}</script>
<style  module>.homeChild {
  	position: absolute;
  	top: 0px;
  	left: 0px;
  	background-color: #005596;
  	width: 1920px;
  	height: 746px;
}
  	.mlb {
    		position: absolute;
    		top: 322px;
    		left: calc(50% - 826px);
    		font-size: 160px;
    		display: inline-block;
    		width: 1652px;
  	}
  	.div {
    		position: absolute;
    		top: 1009px;
    		left: calc(50% - 482px);
    		letter-spacing: 0.99em;
    		font-weight: 500;
    		color: #005596;
    		display: inline-block;
    		width: 965px;
  	}
  	.mlb1 {
    		position: absolute;
    		top: 540px;
    		left: calc(50% - 482px);
    		letter-spacing: 0.08em;
    		display: inline-block;
    		width: 965px;
  	}
  	.groupChild {
    		position: absolute;
    		top: 0px;
    		left: calc(50% - 300px);
    		box-shadow: 6px 6px 7.8px rgba(0, 0, 0, 0.25);
    		border-radius: 84.5px;
    		background-color: #005596;
    		width: 600px;
    		height: 169px;
  	}
  	.vectorIcon {
    		position: absolute;
    		top: 0px;
    		left: 0px;
    		width: 58px;
    		height: 96px;
  	}
  	.b {
    		position: absolute;
    		top: 7px;
    		left: 94px;
    		letter-spacing: 0.08em;
  	}
  	.vectorParent {
    		position: absolute;
    		top: 33px;
    		left: 134px;
    		width: 332px;
    		height: 96px;
  	}
  	.rectangleParent {
    		position: absolute;
    		top: 793px;
    		left: calc(50% - 300px);
    		width: 600px;
    		height: 169px;
    		cursor: pointer;
    		text-align: left;
    		font-size: 56px;
  	}
  	.icon {
    		position: absolute;
    		top: 19px;
    		left: 0px;
    		border-radius: 10px;
    		width: 160px;
    		height: 85px;
    		overflow: hidden;
  	}
  	.t119HeaderPrimary1Icon {
    		position: absolute;
    		top: 0px;
    		left: 287px;
    		width: 204px;
    		height: 111px;
    		overflow: hidden;
  	}
  	.groupItem {
    		position: absolute;
    		top: 34px;
    		left: 222px;
    		border-right: 2px solid #fff;
    		box-sizing: border-box;
    		width: 2px;
    		height: 54px;
  	}
  	.parent {
    		position: absolute;
    		top: 148px;
    		left: 715px;
    		width: 491px;
    		height: 111px;
  	}
  	.homeItem {
    		position: absolute;
    		top: 1031px;
    		left: 1259px;
    		border-top: 2px solid #005596;
    		box-sizing: border-box;
    		width: 626px;
    		height: 2px;
  	}
  	.homeInner {
    		position: absolute;
    		top: 1031px;
    		left: 35px;
    		border-top: 2px solid #005596;
    		box-sizing: border-box;
    		width: 626px;
    		height: 2px;
  	}
  	.home {
    		width: 100%;
    		position: relative;
    		background-color: #fff;
    		height: 1080px;
    		overflow: hidden;
    		text-align: center;
    		font-size: 32px;
    		color: #fff;
    		font-family: 'Noto Sans TC';
  	}

</style>