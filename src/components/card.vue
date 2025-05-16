<script setup></script>
<template>
  	<div class="player-card">
        <div class="card-background" />
        <header class="player-header">
    		<b class="player-name">大谷翔平</b>
    		<div class="player-english-name">(Shohei Ohtani)</div>
            <a href="#" class="social-link">
                <img class="instagram-icon" alt="Instagram" src="@/assets/images/instagram-icon.svg" />
            </a>
        </header>

        <section class="player-portrait">
            <div class="image-background" />
            <img class="player-image" alt="playerName" src="@/assets/images/shohei-ohtani.png" />
        </section>

        <section class="player-info">
            <dl>
                <div class="info-item">
                    <dt>綽號:</dt>
                    <dd>{{ nickname }}</dd>
                </div>
                <div class="info-item">
                    <dt>背號:</dt>
                    <dd>{{ number }}</dd>
                </div>
                <div class="info-item">
                    <dt>守備位置:</dt>
                    <dd>{{ position }}</dd>
                </div>
            </dl>
            <!-- <div class="player-info">
      			<p class="info-item">綽號: Sho-time</p>
      			<p class="info-item">背號: 17</p>
      			<p class="info-item">守備位置: 投手/指定打擊</p>
    		</div> -->
        </section>
        
        <section class="player-background">
            <div class="groupInner" />
            <img class="baseball-bat" alt="" src="@/assets/images/baseball-bat.svg" />
            <b>個人背景</b>
            <dl class="background-info">
                <div class="info-item">
                    <dt>生日:</dt>
                    <dd>{{ birthday }}</dd>
                </div>
                <div class="info-item">
                    <dt>國籍:</dt>
                    <dd>{{ nationality }}</dd>
                </div>
                <div class="info-item">
                    <dt>首次亮相:</dt>
                    <dd>{{ debut }}</dd>
                </div>
                <div class="info-item">
                    <dt>道奇隊初登板:</dt>
                    <dd>{{ dodgersDebut }}</dd>
                </div>
            </dl>
            <!-- <div class="background-info">
      			<p class="shoTime">生日: 07/05/1994</p>
      			<p class="shoTime">國籍: 日本</p>
      			<p class="shoTime">首次亮相: 03/29/2018</p>
      			<p class="shoTime">道奇隊初登板:03/20/2024</p>
    		</div> -->
        </section>
    	<section class="player-achievements">
            <div class="rectangleDiv" />
            <img class="baseball" alt="" src="@/assets/images/baseball.svg" />
            <b>數據與戰績</b>
            <ul class="achievements-list">
                <li v-for="(achievement, index) in achievements" :key="index">
                - {{ achievement }}
                </li>
            </ul>
            <!-- <div class="achievements-list">
      			<p class="shoTime">- 2024世界大賽冠軍</p>
      			<p class="shoTime">- 史上第一位50轟50盜球員</p>
    		</div> -->
         </section>	
  	</div>
</template>

<style  scoped>
.player-card {
    width: 100%;
    position: relative;
    height: 747px;
    text-align: center;
    font-size: 20px;
    color: #005596;
    font-family: 'Noto Sans TC';
}
.card-background {
  	position: absolute;
  	top: 99px;
  	left: 83px;
  	box-shadow: 5px 5px 13.6px rgba(0, 0, 0, 0.25);
  	border-radius: 33px;
  	background-color: #ebebeb;
  	width: 546px;
  	height: 648px;
}
.player-name {
    position: absolute;
    top: 153px;
    left: 399px;
    font-size: 48px;
}
.player-english-name {
    position: absolute;
    top: 218px;
    left: 399px;
    font-weight: 500;
}

.player-image {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 382px;
    height: 435px;
    object-fit: cover;
}
.info-item {
    margin: 0;
}
dl {
  text-align: left;
}
dt {
  font-weight: 500;
  margin-right: 5px;
}

dd {
  margin: 0;
}
.player-info {
    position: absolute;
    top: 341px;
    left: 367px;
    letter-spacing: 0.03em;
    line-height: 120.07%;
    font-weight: 500;
    color: #000;
    text-align: left;
    display: inline-block;
    width: 229px;
}
.instagram-icon {
    position: absolute;
    top: 261px;
    left: 399px;
    width: 48px;
    height: 48px;
    overflow: hidden;
}
.player-background b{
    position: absolute;
    top: 476px;
    left: 202px;
    font-size: 24px;
}
.player-achievements b{
    position: absolute;
    top: 619px;
    left: 190px;
    font-size: 24px;
}
.background-info {
    position: absolute;
    top: 476px;
    left: 351px;
    letter-spacing: 0.02em;
    line-height: 29px;
    font-weight: 500;
    color: #000;
    text-align: left;
}
.achievements-list {
    position: absolute;
    top: 622px;
    left: 351px;
    line-height: 29px;
    font-weight: 500;
    color: #000;
    text-align: left;
}
.image-background {
    position: absolute;
    top: 261px;
    left: 111px;
    border-radius: 13px;
    background-color: #005596;
    width: 213px;
    height: 174px;
}

.groupInner {
    position: absolute;
    top: 473px;
    left: 170px;
    border-radius: 21px;
    border: 1px solid #005596;
    box-sizing: border-box;
    width: 159px;
    height: 42px;
}
.rectangleDiv {
    position: absolute;
    top: 616px;
    left: 170px;
    border-radius: 21px;
    border: 1px solid #005596;
    box-sizing: border-box;
    width: 159px;
    height: 42px;
}
.baseball-bat {
    position: absolute;
    top: 475px;
    left: 122px;
    width: 38px;
    height: 38px;
    overflow: hidden;
}
.baseball {
    position: absolute;
    top: 614px;
    left: 118px;
    width: 46px;
    height: 46px;
    overflow: hidden;
}


</style>