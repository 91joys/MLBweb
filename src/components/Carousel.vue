<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import card from "./card.vue";
import { useCarouselState } from "@/composables/useCarouselState";
import { useCarouselData } from "@/composables/useCarouselData";
import { useCarouselNavigation } from "@/composables/useCarouselNavigation";
import { useAutoplay } from "@/composables/useAutoplay";

const props = defineProps({
  selectedPosition: {
    type: String,
    default: "所有球員",
  },
});

// Refs
const trackRef = ref(null);
const itemWidth = ref(0);
const itemsPerView = ref(3); // 預設每次顯示的項目數量
const gap = 20;
const transitionDurationMs = 700;

// Composables
const { actualPlayers } = useCarouselData(props, itemsPerView);
const state = useCarouselState(actualPlayers, itemsPerView);
const { clonedAndProcessedPlayers } = useCarouselData(
  props,
  itemsPerView,
  state.isLooping
);
const { goToSlide, nextSlide, prevSlide } = useCarouselNavigation(
  state,
  trackRef
);
const { startAutoplay, stopAutoplay } = useAutoplay(nextSlide);

// 計算項目寬度
const calculateItemWidth = () => {
  if (
    trackRef.value &&
    clonedAndProcessedPlayers.value.length > 0 &&
    state.itemsPerView.value > 0
  ) {
    const trackWidth = trackRef.value.offsetWidth;
    if (state.itemsPerView.value === 1 && !state.isLooping.value) {
      itemWidth.value = trackWidth;
    } else {
      itemWidth.value =
        (trackWidth - (state.itemsPerView.value - 1) * gap) /
        state.itemsPerView.value;
    }
  } else {
    itemWidth.value = 0;
  }
};

// 重置輪播狀態
const resetCarouselState = (makeNoTransition = true) => {
  goToSlide(0, !makeNoTransition);
};

// 事件處理
const handleResize = () => {
  state.updateItemsPerView();
};

const handleProgressDrag = (e) => {
  const progressBar = e.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const x =
    (e.type === "mousedown" ? e.clientX : e.touches[0].clientX) - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  const numSlidesForProgress = Math.max(1, state.totalLogicalSlides.value);
  let targetIndex = Math.floor(percentage * numSlidesForProgress);
  if (targetIndex >= numSlidesForProgress && numSlidesForProgress > 0) {
    targetIndex = numSlidesForProgress - 1;
  }
  goToSlide(targetIndex);
};

// 樣式計算
const carouselItemsStyle = computed(() => {
  if (itemWidth.value <= 0 || clonedAndProcessedPlayers.value.length === 0) {
    return { transform: "translateX(0px)", width: "0px", transition: "none" };
  }

  const totalWidth =
    clonedAndProcessedPlayers.value.length * itemWidth.value +
    (clonedAndProcessedPlayers.value.length > 1
      ? (clonedAndProcessedPlayers.value.length - 1) * gap
      : 0);
  const translateAmount = state.displayIndex.value * (itemWidth.value + gap);

  return {
    width: `${totalWidth}px`,
    transform: `translateX(-${translateAmount}px)`,
    transition: state.noTransition.value
      ? "none"
      : `transform ${transitionDurationMs / 1000}s ease`,
  };
});

const dynamicCarouselItemStyle = computed(() => {
  if (itemWidth.value <= 0) return { width: "0px" };
  return {
    width: `${itemWidth.value}px`,
    // 統一的動畫控制
    transition: state.noTransition.value
      ? "none"
      : `transform ${transitionDurationMs / 1000}s ease, opacity ${
          transitionDurationMs / 1000
        }s ease`,
  };
});

// 判斷活動狀態
const isActive = (clonedItemIndex) => {
  if (state.isLooping.value) {
    const isVisible =
      clonedItemIndex >= state.displayIndex.value &&
      clonedItemIndex < state.displayIndex.value + state.itemsPerView.value;
    if (!isVisible) return false;
    const viewRelativeIndex = clonedItemIndex - state.displayIndex.value;
    return viewRelativeIndex === Math.floor(state.itemsPerView.value / 2);
  } else {
    return clonedItemIndex === state.logicalCurrentIndex.value;
  }
};

// 生命週期
onMounted(() => {
  state.updateItemsPerView();
  nextTick(() => {
    calculateItemWidth();
    resetCarouselState();
    startAutoplay();
  });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  stopAutoplay();
});

// 監聽器
watch(
  [() => props.selectedPosition, () => state.itemsPerView.value],
  () => {
    nextTick(() => {
      calculateItemWidth();
      resetCarouselState();
    });
  },
  { deep: true }
);

watch(
  [() => state.itemsPerView.value, actualPlayers, () => trackRef.value],
  () => {
    nextTick(() => {
      calculateItemWidth();
    });
  },
  { immediate: true, deep: true }
);

watch(
  () => state.totalActualItems.value,
  (newLength) => {
    if (state.logicalCurrentIndex.value > state.maxLogicalIndex.value) {
      goToSlide(state.maxLogicalIndex.value, false);
    } else if (newLength === 0 && state.logicalCurrentIndex.value !== 0) {
      goToSlide(0, false);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="custom-carousel">
    <div class="carousel-container">
      <button
        class="nav-btn prev-btn"
        @click="prevSlide"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        aria-label="上一頁"
        :disabled="state.totalActualItems.value === 0"
      >
        <img src="@/assets/images/left.svg" alt="上一頁" />
      </button>

      <div class="carousel-track" ref="trackRef">
        <div class="carousel-items" :style="carouselItemsStyle">
          <div
            v-for="(player, clonedItemIndex) in clonedAndProcessedPlayers"
            :key="player._carouselKey"
            class="carousel-item"
            :style="dynamicCarouselItemStyle"
            :class="{
              active: isActive(clonedItemIndex),
              side: !isActive(clonedItemIndex),
            }"
            @mouseenter="isActive(clonedItemIndex) && stopAutoplay()"
            @mouseleave="isActive(clonedItemIndex) && startAutoplay()"
          >
            <card v-bind="player" />
          </div>
        </div>
      </div>

      <button
        class="nav-btn next-btn"
        @click="nextSlide"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        aria-label="下一頁"
        :disabled="state.totalActualItems.value === 0"
      >
        <img src="@/assets/images/right.svg" alt="下一頁" />
      </button>
    </div>

    <div
      class="line-indicators"
      @mousedown="handleProgressDrag"
      @touchstart="handleProgressDrag"
    >
      <div class="line-segments">
        <button
          v-for="(_, index) in state.totalLogicalSlides.value"
          :key="index"
          class="line-segment"
          :class="{
            active:
              index === state.logicalCurrentIndex.value &&
              state.totalActualItems.value > 0,
            passed:
              index < state.logicalCurrentIndex.value &&
              state.totalActualItems.value > 0,
          }"
          @click="goToSlide(index)"
          :aria-label="`跳到第 ${index + 1} 頁`"
          :style="{
            left: `${
              (index / Math.max(1, state.totalLogicalSlides.value)) * 100
            }%`,
            width: `${100 / Math.max(1, state.totalLogicalSlides.value)}%`,
          }"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持原有的 CSS 樣式 */
.custom-carousel {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
}

.carousel-track {
  flex: 1;
  overflow: hidden;
  padding-top: 60px;
  position: relative;
}

.carousel-items {
  display: flex;
  gap: 20px;
}

.carousel-item {
  flex-shrink: 0;
  min-width: 0;
  transform-origin: center;
  opacity: 0.6;
  transform: scale(0.9);
}

.carousel-item.active {
  transform: scale(1.05) translateY(-20px);
  opacity: 1;
  z-index: 2;
}

.carousel-item.side {
  transform: scale(0.9) translateY(40px);
  opacity: 0.6;
  z-index: 1;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;
}

.nav-btn:hover {
  background: transparent;
  transform: scale(1.1);
}

.line-indicators {
  position: relative;
  margin-top: 5px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  padding: 5px 0;
  cursor: pointer;
}

.line-segments {
  position: relative;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  width: 100%;
  height: 16px;
  display: flex;
}

.line-segment {
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 0;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.line-segment:hover {
  background: rgba(255, 255, 255, 0.3);
}

.line-segment.active {
  background: rgba(255, 255, 255, 0.4);
}

@media (max-width: 767px) {
  .nav-btn {
    width: 40px;
    height: 40px;
  }
  .carousel-container {
    gap: 10px;
  }
  .line-indicators {
    width: 80%;
  }
  .line-segments {
    height: 12px;
  }
}

@media (max-width: 575px) {
  .line-indicators {
    width: 90%;
  }
}
</style>
