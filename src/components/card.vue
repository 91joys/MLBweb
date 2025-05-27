<script setup>
import { ref, computed } from "vue"; // 新增匯入

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
  // 您可以考慮將初始的 like 數量和狀態作為 props 傳入
  // initialLikeCount: {
  //   type: Number,
  //   default: 0
  // },
  // initialIsLiked: {
  //   type: Boolean,
  //   default: false
  // }
});

// 喜歡功能相關的響應式狀態
const isLiked = ref(false); // 假設初始未按讚
const likeCount = ref(17); // 根據您模板的初始值

// 計算屬性，用於動態更改愛心圖示
const likeIconSrc = computed(() => {
  return isLiked.value
    ? new URL("@/assets/images/like-filled.svg", import.meta.url).href
    : new URL("@/assets/images/like.svg", import.meta.url).href;
});

// 切換喜歡狀態的函數
function toggleLike() {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    likeCount.value++;
  } else {
    likeCount.value--;
  }
  // 在這裡，您可以添加將喜歡狀態發送到後端的邏輯
}

// --- 星級評分系統狀態 ---
const showRatingSelector = ref(false); // 控制星星選擇器的顯示/隱藏
const currentPersonalRating = ref(0); // 當前使用者在此卡片實例上給出的評分，0 表示尚未評分
const hoverRating = ref(0); // 用於滑鼠懸停在星星上時的視覺回饋

// 模擬的總體評分狀態 (在真實應用中，這些數據應來自 props、Vuex store 或後端)
const allRatingsSum = ref(25); // 範例：假設初始有5個評分，總和為25 (例如 5人*5星)
const totalRatingCount = ref(5); // 範例：總共有5個評分

// 計算平均評分
const averageRating = computed(() => {
  if (totalRatingCount.value === 0) {
    return 0;
  }
  const avg = allRatingsSum.value / totalRatingCount.value;
  // 返回一位小數的平均分，如果沒有評分則為0
  return parseFloat(avg.toFixed(1));
});

// 切換星星選擇器的顯示狀態
function toggleRatingSelectorFunc() {
  // 重新命名以避免與 props 中的 toggleRatingSelector 衝突 (如果有的話)
  showRatingSelector.value = !showRatingSelector.value;
  if (!showRatingSelector.value) {
    hoverRating.value = 0; // 關閉時重置懸停狀態
  }
}

// 處理評分選擇
function handleRate(rating) {
  if (currentPersonalRating.value > 0) {
    // 使用者正在更改他們之前的評分
    allRatingsSum.value =
      allRatingsSum.value - currentPersonalRating.value + rating;
    // totalRatingCount 不變，因為是同一個使用者修改評分
  } else {
    // 使用者首次為此卡片評分
    allRatingsSum.value += rating;
    totalRatingCount.value++;
  }
  currentPersonalRating.value = rating;
  showRatingSelector.value = false; // 評分後關閉選擇器
  hoverRating.value = 0; // 重置懸停狀態
  // 在真實應用中，這裡您會呼叫 API 將評分發送到後端
}

// 獲取星星選擇器中每個星星的圖示 (實心或空心)
function getStarSelectorIcon(starValue) {
  let ratingToShow = currentPersonalRating.value; // 預設顯示當前已選評分
  if (hoverRating.value > 0) {
    // 如果滑鼠正在懸停，則優先顯示懸停的評分
    ratingToShow = hoverRating.value;
  }

  if (starValue <= ratingToShow) {
    return new URL("@/assets/images/star-filled.svg", import.meta.url).href; // 實心星星
  }
  return new URL("@/assets/images/star.svg", import.meta.url).href; // 空心星星
}
// --- 結束星級評分系統狀態 ---
</script>
<template>
  <div class="player-card">
    <div class="card-background" />
    <!-- 球員照片 -->
    <section class="player-portrait" v-if="Image_URL">
      <div class="image-background" />
      <img class="player-image" alt="Player_Name" :src="Image_URL" />
    </section>

    <!-- 球員姓名、資訊 -->
    <header class="player-header">
      <b class="player-name" v-if="Player_Name">{{ Player_Name }}</b>
      <div class="player-chinese-name" v-if="Chinese_Name">
        {{ "(" + Chinese_Name + ")" }}
      </div>
      <div class="number">
        <div class="player-number" v-if="Number">
          <img
            class="number-icon"
            alt="Number"
            src="@/assets/images/number.svg"
          />
          <b>{{ Number }}</b>
        </div>
      </div>
      <a :href="Social_Link" class="social-link">
        <img
          class="instagram-icon"
          alt="Instagram"
          src="@/assets/images/instagram-icon.svg"
        />
      </a>
    </header>
    <section class="player-info">
      <dl>
        <div class="info-item" v-if="Nickname">
          <dt>綽號:</dt>
          <dd>{{ Nickname }}</dd>
        </div>
        <div class="info-item" v-if="Position">
          <dt>守備位置:</dt>
          <dd>{{ Position }}</dd>
        </div>
      </dl>
    </section>

    <!-- 球員背景 -->
    <section class="player-background">
      <div class="background-frame" />
      <div class="bat-background" />
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

    <!-- 球員成就 -->
    <section class="player-achievements">
      <div class="achievements-frame" />
      <div class="ball-background" />
      <img class="baseball" alt="" src="@/assets/images/baseball.svg" />
      <b>數據與戰績</b>
      <ul class="achievements-list" v-if="Achievements">
        <li v-for="(achievement, index) in Achievements" :key="index">
          - {{ achievement }}
        </li>
      </ul>
    </section>

    <!-- 評分、喜歡、評論 -->
    <footer>
      <img
        class="star"
        alt="Rate"
        src="@/assets/images/star.svg"
        @click="toggleRatingSelectorFunc"
      />
      <b class="count-star">{{ averageRating }}/5</b>
      <img class="like" alt="Like" :src="likeIconSrc" @click="toggleLike" />
      <b class="count-like">{{ likeCount }}</b>
      <img class="comment" alt="" src="@/assets/images/comment.svg" />
      <b class="count-comment">17</b>

      <!-- 星星評分選擇器 -->
      <div v-if="showRatingSelector" class="rating-selector-popup">
        <img
          v-for="starValue in 5"
          :key="'rate-star-' + starValue"
          :src="getStarSelectorIcon(starValue)"
          @mouseover="hoverRating = starValue"
          @mouseleave="hoverRating = 0"
          @click="handleRate(starValue)"
          class="rating-star-option"
          :alt="'Rate ' + starValue + ' star(s)'"
        />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.player-card {
  width: 100%;
  position: relative;
  height: 806px;
  text-align: center;
  font-size: 20px;
  color: #005596;
  font-family: "Noto Sans TC";
}
.card-background {
  position: absolute;
  top: 181px;
  left: 0px;
  box-shadow: 5px 5px 13.6px rgba(0, 0, 0, 0.25);
  border-radius: 33px;
  background-color: #ebebeb;
  width: 546px;
  height: 625px;
}

/* 球員照片 */
.player-image {
  position: absolute;
  top: 0px;
  left: 49px;
  width: 421px;
  height: 314px;
  object-fit: cover;
}
.image-background {
  position: absolute;
  top: 208px;
  left: 30px;
  box-shadow: 0px -6px 3.8px rgba(0, 0, 0, 0.25) inset;
  border-radius: 53px;
  background-color: #005596;
  width: 486px;
  height: 106px;
}

/* 球員姓名、資訊 */
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

/* 球員背景 */
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

/* 球員成就 */
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

/* 評分、喜歡、評論 */
.star {
  position: absolute;
  top: 741px;
  left: 31px;
  width: 38px;
  height: 38px;
  overflow: hidden;
  cursor: pointer; /* 讓星星圖示看起來可點擊 */
}
.count-star {
  position: absolute;
  top: 780px;
  left: 36px; /* 稍微調整以適應可能的平均分數寬度 */
  font-size: 12px;
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
}
.like {
  position: absolute;
  top: 741px;
  left: 254px;
  width: 38px;
  height: 38px;
  overflow: hidden;
  cursor: pointer; /* 新增鼠標樣式 */
}
.count-like {
  position: absolute;
  top: 780px;
  left: 266px;
  font-size: 12px;
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
}
.comment {
  position: absolute;
  top: 741px;
  left: 477px;
  width: 38px;
  height: 38px;
  overflow: hidden;
}
.count-comment {
  position: absolute;
  top: 780px;
  left: 489px;
  font-size: 12px;
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
}

/* 星星評分選擇器樣式 */
.rating-selector-popup {
  position: absolute;
  bottom: 70px; /* 大約在 footer 圖示上方 */
  left: 20px; /* 與主星星圖示左側對齊或稍作調整 */
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex; /* 讓星星水平排列 */
  gap: 4px; /* 星星之間的間距 */
  z-index: 100; /* 確保在其他元素之上 */
}

.rating-star-option {
  width: 28px; /* 選擇器中星星的大小 */
  height: 28px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out; /* 簡單的懸停效果 */
}

.rating-star-option:hover {
  transform: scale(1.1); /* 懸停時放大一點 */
}
</style>
