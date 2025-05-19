<script setup>
defineProps({
  Player_Name: {
    type: String,
  },
  Chinese_Name: {
    type: String,
  },
  Social_Link: {
    type: String,
  },
  Nickname: {
    type: String,
  },
  Number: {
    type: String,
  },
  Position: {
    type: String,
  },
  Image_URL: {
    type: String,
  },
  Birthday: {
    type: String,
  },
  Nationality: {
    type: String,
  },
  MLB_Debut: {
    type: String,
  },
  Dodgers_Debut: {
    type: String,
  },
  Achievements: {
    type: Array,
  },
})
</script>
<template>
  	<div class="player-card">
        <div class="card-background" />
        <header class="player-header">
    		<b class="player-name" v-if="Player_Name">{{Player_Name}}</b>
    		<div class="player-english-name" v-if="Chinese_Name">{{ Chinese_Name }}</div>
            <a :href="Social_Link" class="social-link" v-if="Social_Link">
                <img class="instagram-icon" alt="Instagram" src="@/assets/images/instagram-icon.svg" />
            </a>
        </header>

        <section class="player-portrait" v-if="Image_URL">
            <div class="image-background" />
            <img class="player-image" alt="Player_Name" :src="Image_URL" />
        </section>

        <section class="player-info">
            <dl>
                <div class="info-item" v-if="Nickname">
                    <dt>綽號:</dt>
                    <dd>{{ Nickname }}</dd>
                </div>
                <div class="info-item" v-if="Number">
                    <dt>背號:</dt>
                    <dd>{{ Number }}</dd>
                </div>
                <div class="info-item" v-if="Position">
                    <dt>守備位置:</dt>
                    <dd>{{ Position }}</dd>
                </div>
            </dl>
        </section>
        
        <section class="player-background">
            <div class="groupInner" />
            <img class="baseball-bat" alt="" src="@/assets/images/baseball-bat.svg" />
            <b>個人背景</b>
            <dl class="background-info">
                <div class="info-item" v-if="Birthday">
                    <dt>生日:</dt>
                    <dd>{{ Birthday }}</dd>
                </div>
                <div class="info-item" v-if="Nationality">
                    <dt>國籍:</dt>
                    <dd>{{ Nationality }}</dd>
                </div>
                <div class="info-item" v-if="MLB_Debut">
                    <dt>首次亮相:</dt>
                    <dd>{{ MLB_Debut }}</dd>
                </div>
                <div class="info-item" v-if="Dodgers_Debut">
                    <dt>道奇隊初登板:</dt>
                    <dd>{{ Dodgers_Debut }}</dd>
                </div>
            </dl>
        </section>
    	<section class="player-achievements">
        <div class="rectangleDiv" />
        <img class="baseball" alt="" src="@/assets/images/baseball.svg" />
        <b>數據與戰績</b>
        <ul class="achievements-list" v-if="Achievements">
            <li v-for="(achievement, index) in Achievements" :key="index">
            - {{ achievement }}
            </li>
        </ul>      
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
    display: flex;
    align-items: center;
    margin-bottom: 5px;
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
    list-style-type: none;
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