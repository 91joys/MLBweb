<script setup>
  	function onGroupContainerClick() {
    		// Add your code here
  	}
</script>

<template>
  	<div class="home">
    	<div class="homeChild">
			<div class="parent">
      			<img class="mlbIcon" alt="" src="@/assets/images/logo.svg" />
      			<div class="midLine" />
				<img class="dodgerLogo" alt="" src="@/assets/images/dodger-logo.svg" />
    		</div>
    		<b class="webName">MLB 道奇資訊網</b>
    		<div class="intro">給台灣人的MLB資訊網，讓球迷可以跟上國際棒球時事</div>
		</div>
			<div class="buttonParent" @click="onGroupContainerClick">
      			<div class="vectorParent">
        				<img class="vectorIcon" alt="" src="@/assets/images/baseballman.svg" />
        				<b class="b">點選進入</b>
      			</div>
    		</div>
    		
			<div class="slogan">跟上道奇 不會過期</div>
    		<div class="homeItem" />
    		<div class="homeInner" />
  	</div>
</template>

<style  scoped>
.home {
	width: 100%;
	height: 100vh;
	position: relative;
	background-color: #fff;
	height: 1080px;
	overflow: hidden;
	text-align: center;
	font-size: 32px;
	color: #fff;
	font-family: 'Noto Sans TC';
}
.homeChild {
  	position: relative;
  	background-color: #005596;
  	width: 100%;
  	height: 75vh;
	display: flex;
	flex-direction: column;
  	justify-content: center;
  	align-items: center;
}

/* 頂部MLB+道奇logo群組 */
.parent {
	position: relative;
	width: 100%;
	height: 111px;
	display: flex;
	flex-direction: row;
  	justify-content: center;
  	align-items: center;
	transform: translateX(50px);
}
.mlbIcon {
	position: relative;
	border-radius: 10px;
	width: 160px;
	height: 85px;
	margin-right: 50px;
	overflow: hidden;
}
.dodgerLogo {
	position: relative;
	width: 300px;
	height: 111px;
	overflow: hidden;
}
.midLine {
	position: relative;
	border-right: 2px solid #fff;
	box-sizing: border-box;
	width: 2px;
	height: 54px;
}

.webName {
	position: relative;
	font-size: 160px;
	display: inline-block;
	width: 1652px;
}
.intro {
	position: relative;
	letter-spacing: 0.08em;
	display: inline-block;
	width: 965px;
}

/* 進入主頁按鈕 */
.buttonParent {
	position: relative;
	width: 600px;
	height: 169px;
	cursor: pointer;
	text-align: left;
	font-size: 56px;
	box-shadow: 6px 6px 7.8px rgba(0, 0, 0, 0.25);
	border-radius: 84.5px;
	background-color: #005596;
	display: flex;
  	justify-content: center;
  	align-items: center;
	margin: 80px auto;
}
.vectorParent {
	display: flex;
	flex-direction: row;
  	justify-content: center;
  	align-items: center;
	gap: 20px;
}
.vectorIcon {
	width: 58px;
	height: 96px;
}
.b {
	letter-spacing: 0.08em;
	display: flex;
  	align-items: center;
}

.slogan {
	position: absolute;
	top: 1009px;
	left: calc(50% - 482px);
	letter-spacing: 0.99em;
	font-weight: 500;
	color: #005596;
	display: inline-block;
	width: 965px;
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
</style>