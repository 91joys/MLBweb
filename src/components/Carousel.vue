<script setup>
import { ref, computed, watch } from "vue";
import card from "../components/card.vue";
import rawPlayers from "@/assets/data/players.json";
import Carousel from "primevue/carousel";

// 定義 props，接收選中的位置
const props = defineProps({
  selectedPosition: {
    type: String,
    default: "所有球員",
  },
});

// 將 Image_URL 加工成 Vite 可用的真實 URL
const players = rawPlayers.map((player) => {
  if (player.Image_URL) {
    try {
      // 方法一：使用 import.meta.glob 預載入所有圖片
      const imageUrl = `/src/assets/images/players/${player.Image_URL}`;
      return {
        ...player,
        Image_URL: imageUrl,
      };
    } catch (error) {
      console.error(`無法載入圖片: ${player.Image_URL}`, error);
      return player;
    }
  }
  return player;
});

// 根據選中的位置篩選球員
const filteredPlayers = computed(() => {
  if (props.selectedPosition === "所有球員") {
    return allPlayers;
  }

  return allPlayers.filter((player) => {
    if (!player.Position) return false;

    // 根據位置篩選
    switch (props.selectedPosition) {
      case "投手":
        return player.Position.includes("投手");
      case "捕手":
        return player.Position.includes("捕手");
      case "內野手":
        return (
          player.Position.includes("內野手") ||
          player.Position.includes("一壘") ||
          player.Position.includes("二壘") ||
          player.Position.includes("三壘") ||
          player.Position.includes("游擊") ||
          player.Position.includes("Infield") ||
          player.Position.includes("First Base") ||
          player.Position.includes("Second Base") ||
          player.Position.includes("Third Base") ||
          player.Position.includes("Shortstop")
        );
      case "外野手":
        return (
          player.Position.includes("外野手") ||
          player.Position.includes("左外野") ||
          player.Position.includes("中外野") ||
          player.Position.includes("右外野") ||
          player.Position.includes("Outfield") ||
          player.Position.includes("Left Field") ||
          player.Position.includes("Center Field") ||
          player.Position.includes("Right Field")
        );
      default:
        return true;
    }
  });
});

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>

<template>
  <div class="card">
    <Carousel
      :value="players"
      :numVisible="3"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      circular
      :autoplayInterval="3000"
    >
      <template #item="{ data }">
        <card v-bind="data" />
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

.p-carousel .p-carousel-content {
  width: 100% !important;
}

.p-carousel-item {
  display: flex;
  justify-content: center;
}
/* 自定義箭頭樣式 */
:deep(.p-carousel-prev-button),
:deep(.p-carousel-next-button) {
  width: 3rem !important;
  height: 3rem !important;
  font-size: 1.5rem !important;
  background: rgba(0, 0, 0, 0.5) !important;
  border-radius: 50% !important;
  margin: 0 1rem !important;
  transition: all 0.3s ease !important;
}

:deep(.p-carousel-prev-button:hover),
:deep(.p-carousel-next-button:hover) {
  background: rgba(0, 0, 0, 0.7) !important;
  transform: scale(1.1) !important;
}

:deep(.p-carousel-prev-button span),
:deep(.p-carousel-next-button span) {
  font-size: 1.8rem !important;
  font-weight: bold !important;
}
</style>
