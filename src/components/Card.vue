<script setup>
import { computed, ref } from "vue";
import { useRatingSystem } from "@/composables/useRatingSystem";
import PlayerPortrait from "./PlayerPortrait.vue";
import PlayerHeader from "./PlayerHeader.vue";
import PlayerInfo from "./PlayerInfo.vue";
import PlayerBackground from "./PlayerBackground.vue";
import PlayerAchievements from "./PlayerAchievements.vue";
import PlayerActions from "./PlayerActions.vue";

// Props 定義
const props = defineProps({
  Player_Name: { type: String },
  Chinese_Name: { type: String },
  Social_Link: { type: String },
  Nickname: { type: String },
  Number: { type: String },
  Position: { type: String },
  Image_URL: { type: String },
  Birthday: { type: String },
  Nationality: { type: String },
  MLB_Debut: { type: String },
  Dodgers_Debut: { type: String },
  Achievements: { type: Array },
  // 移除 playerId prop，直接使用 Number
  userEmail: { type: String, default: "" },
  isLoggedIn: { type: Boolean, default: false },
});

// 移除 useLikeSystem，因為現在在 PlayerActions 內部處理
const {
  showRatingSelector,
  currentPersonalRating,
  hoverRating,
  averageRating,
  toggleRatingSelector,
  handleRate,
  getStarSelectorIcon,
} = useRatingSystem();

// 計算屬性
const playerInfo = computed(() =>
  [
    { label: "綽號", value: props.Nickname },
    { label: "守備位置", value: props.Position },
  ].filter((item) => item.value)
);

const backgroundInfo = computed(() =>
  [
    { label: "生日", value: props.Birthday },
    { label: "國籍", value: props.Nationality },
    { label: "首次亮相", value: props.MLB_Debut },
    { label: "道奇隊初登板", value: props.Dodgers_Debut },
  ].filter((item) => item.value)
);

// Emit 事件定義
const emit = defineEmits([
  "user-login",
  "comment-modal-open",
  "comment-modal-close",
]);

const handleUserLogin = () => {
  emit("user-login");
};

const handleCommentModalOpen = (playerId) => {
  emit("comment-modal-open", playerId);
};

const handleCommentModalClose = (playerId) => {
  emit("comment-modal-close", playerId);
};
</script>

<template>
  <div class="player-card">
    <div class="card-background" />

    <PlayerPortrait :imageUrl="Image_URL" :playerName="Player_Name" />

    <PlayerHeader
      :playerName="Player_Name"
      :chineseName="Chinese_Name"
      :number="Number"
      :socialLink="Social_Link"
    />

    <PlayerInfo :infoItems="playerInfo" />

    <PlayerBackground :backgroundItems="backgroundInfo" />

    <PlayerAchievements :achievements="Achievements" />

    <PlayerActions
      :player-id="Number"
      :user-email="userEmail"
      :is-logged-in="isLoggedIn"
      @login="handleUserLogin"
      :averageRating="averageRating"
      :showRatingSelector="showRatingSelector"
      :getStarIcon="getStarSelectorIcon"
      @toggle-rating="toggleRatingSelector"
      @rate="handleRate"
      @hover-rating="(rating) => (hoverRating = rating)"
      @comment-modal-open="handleCommentModalOpen"
      @comment-modal-close="handleCommentModalClose"
    />
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
</style>
