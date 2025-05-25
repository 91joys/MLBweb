<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import card from "./card.vue";
import rawPlayersData from "@/assets/data/players.json";

const props = defineProps({
  selectedPosition: {
    type: String,
    default: "所有球員",
  },
});

const itemsPerView = ref(3);
const trackRef = ref(null);
const itemWidth = ref(0);
const gap = 20; // Must match CSS
const autoplayInterval = ref(null);
const transitionDurationMs = 700; // Must match .carousel-items transition duration

// --- 新增或修改的 Refs ---
const logicalCurrentIndex = ref(0); // User-facing slide index
const displayIndex = ref(0); // Index for translateX, refers to clonedAndProcessedPlayers
const noTransition = ref(false); // To disable transition during silent jumps

// 1. 實際球員列表 (已處理圖片和篩選)
const actualPlayers = computed(() => {
  let playersWithImages = rawPlayersData.map((player) => {
    if (player.Image_URL) {
      const imageUrl = `/src/assets/images/players/${player.Image_URL}`;
      return { ...player, Image_URL: imageUrl };
    }
    return player;
  });

  if (props.selectedPosition && props.selectedPosition !== "所有球員") {
    return playersWithImages.filter(
      (player) => player.Position === props.selectedPosition
    );
  }
  return playersWithImages;
});

const isLooping = computed(
  () => actualPlayers.value.length > itemsPerView.value
);

// 2. 用於渲染的球員列表 (包含複製項和唯一key)
const clonedAndProcessedPlayers = computed(() => {
  const players = actualPlayers.value;
  const numPlayers = players.length;

  const addUniqueKey = (player, prefix, index) => ({
    ...player,
    _carouselKey: `${prefix}_${
      player.id || player.Name
    }_${index}_${Math.random()}`, // Ensure key is very unique
  });

  if (!isLooping.value || numPlayers === 0) {
    return players.map((p, i) => addUniqueKey(p, "orig", i));
  }

  const headClones = players
    .slice(-itemsPerView.value)
    .map((p, i) => addUniqueKey(p, "head", i));
  const tailClones = players
    .slice(0, itemsPerView.value)
    .map((p, i) => addUniqueKey(p, "tail", i));
  const middlePlayers = players.map((p, i) => addUniqueKey(p, "orig", i));

  return [...headClones, ...middlePlayers, ...tailClones];
});

// --- 響應式設定和計算 ---
const updateItemsPerView = () => {
  if (window.innerWidth <= 575) itemsPerView.value = 1;
  else if (window.innerWidth <= 767) itemsPerView.value = 2;
  else itemsPerView.value = 3;
};

const calculateItemWidth = () => {
  if (
    trackRef.value &&
    clonedAndProcessedPlayers.value.length > 0 &&
    itemsPerView.value > 0
  ) {
    const trackWidth = trackRef.value.offsetWidth;
    if (itemsPerView.value === 1 && !isLooping.value) {
      // Full width only if 1 item and not looping (edge case)
      itemWidth.value = trackWidth;
    } else {
      itemWidth.value =
        (trackWidth - (itemsPerView.value - 1) * gap) / itemsPerView.value;
    }
  } else {
    itemWidth.value = 0;
  }
};

const totalOriginalSlides = computed(() => {
  if (actualPlayers.value.length === 0) return 1; // 處理空列表的邊緣情況
  if (isLooping.value) {
    // 在循環模式下，每個實際項目都可以是一個邏輯上的幻燈片起點
    return actualPlayers.value.length;
  } else {
    // 非循環模式下 (項目數 <= itemsPerView)，只有一個 "幻燈片"
    return 1;
  }
});

const maxOriginalStartIndex = computed(() => {
  if (actualPlayers.value.length === 0) return 0;
  if (isLooping.value) {
    // 在循環模式下，最後一個邏輯索引是 actualPlayers.length - 1
    return actualPlayers.value.length - 1;
  } else {
    // 非循環模式下，只有索引 0
    return 0;
  }
});

// --- 輪播狀態重置 ---
const resetCarouselState = (makeNoTransition = true) => {
  // 呼叫 goToSlide 來設定初始狀態，第一個邏輯項目 (index 0) 會被置中
  // makeNoTransition = true 表示 applyTransition = false (無動畫)
  goToSlide(0, !makeNoTransition);
};

// --- 生命週期和監聽 ---
onMounted(() => {
  updateItemsPerView(); // Sets itemsPerView
  // Ensure DOM is ready for offsetWidth calculation and itemsPerView is set
  nextTick(() => {
    calculateItemWidth();
    resetCarouselState(); // Initialize logicalCurrentIndex and displayIndex
    startAutoplay();
  });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  stopAutoplay();
});

const handleResize = () => {
  updateItemsPerView();
  // calculateItemWidth will be called by the watcher
  // resetCarouselState will be called by watchers for actualPlayers/itemsPerView
};

watch(
  [() => props.selectedPosition, itemsPerView],
  () => {
    // Recalculate item width and reset state when filter or itemsPerView changes
    nextTick(() => {
      // Ensure actualPlayers is updated
      calculateItemWidth();
      resetCarouselState();
    });
  },
  { deep: true }
);

watch(
  [itemsPerView, actualPlayers, () => trackRef.value],
  () => {
    nextTick(() => {
      calculateItemWidth();
    });
  },
  { immediate: true, deep: true }
);

// 當球員列表長度變化時，確保 logicalCurrentIndex 不會越界
watch(
  () => actualPlayers.value.length,
  (newLength) => {
    // maxOriginalStartIndex.value 會因為 actualPlayers 的變化而自動更新
    if (logicalCurrentIndex.value > maxOriginalStartIndex.value) {
      // 如果當前邏輯索引超出新的最大允許索引，跳轉到新的最後一個有效幻燈片
      goToSlide(maxOriginalStartIndex.value, false);
    } else if (newLength === 0 && logicalCurrentIndex.value !== 0) {
      // 如果列表變空，重置到索引 0
      goToSlide(0, false);
    }
    // 如果列表從循環變為非循環，並且 displayIndex 不合適，
    // 上面的 goToSlide(maxOriginalStartIndex.value, false) （此時 maxOriginalStartIndex 為 0）
    // 會調用 goToSlide(0, false)，這會將 displayIndex 設為 0，從而修正。
  },
  { immediate: true } // immediate: true 確保在掛載時，如果初始 actualPlayers.length 導致索引問題，會被修正
);

// --- 輪播控制函式 ---
const goToSlide = (targetLogicalIndex, applyTransition = true) => {
  logicalCurrentIndex.value = Math.min(
    Math.max(0, targetLogicalIndex),
    maxOriginalStartIndex.value // 使用更新後的 maxOriginalStartIndex
  );

  if (!applyTransition) noTransition.value = true;

  const offsetToCenter = Math.floor(itemsPerView.value / 2);

  if (isLooping.value) {
    // 循環模式：計算 displayIndex 以便將 logicalCurrentIndex 對應的項目置中
    // actualPlayers[logicalCurrentIndex.value] 在 clonedAndProcessedPlayers 中的索引是 itemsPerView.value + logicalCurrentIndex.value
    displayIndex.value =
      itemsPerView.value + logicalCurrentIndex.value - offsetToCenter;
  } else {
    // 非循環模式 (actualPlayers.length <= itemsPerView.value)
    // logicalCurrentIndex 此時應為 0。
    // 我們希望從 clonedAndProcessedPlayers (即 actualPlayers) 的開頭顯示。
    displayIndex.value = 0;
  }

  if (!applyTransition) {
    nextTick(() => {
      noTransition.value = false;
    });
  }
};

const nextSlide = () => {
  if (actualPlayers.value.length === 0) return;
  if (
    !isLooping.value &&
    logicalCurrentIndex.value >= maxOriginalStartIndex.value
  ) {
    if (totalOriginalSlides.value <= 1) return;
    goToSlide(0);
    return;
  }

  const oldLogicalIndex = logicalCurrentIndex.value;
  const newLogicalIndex = (oldLogicalIndex + 1) % totalOriginalSlides.value;

  logicalCurrentIndex.value = newLogicalIndex;
  displayIndex.value++; // 視覺上滑動一格

  // 如果是循環播放，且從最後一個邏輯項目換到第一個 (newLogicalIndex === 0)
  if (
    isLooping.value &&
    oldLogicalIndex === maxOriginalStartIndex.value &&
    newLogicalIndex === 0 &&
    totalOriginalSlides.value > 1
  ) {
    // 使用 transitionend 事件而不是 setTimeout 來確保動畫完成
    const transitionEndHandler = () => {
      noTransition.value = true;
      const offsetToCenter = Math.floor(itemsPerView.value / 2);
      // 跳轉到 newLogicalIndex (即 0) 對應的正確 displayIndex
      displayIndex.value =
        itemsPerView.value + newLogicalIndex - offsetToCenter;

      // 確保等待下一幀渲染完成後才重新啟用過渡
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noTransition.value = false;
        });
      });

      // 移除事件監聽器
      if (trackRef.value) {
        trackRef.value.removeEventListener(
          "transitionend",
          transitionEndHandler
        );
      }
    };

    // 添加過渡結束事件監聽器
    if (trackRef.value) {
      trackRef.value.addEventListener("transitionend", transitionEndHandler, {
        once: true,
      });
    }
  }
};

const prevSlide = () => {
  if (actualPlayers.value.length === 0) return;
  if (!isLooping.value && logicalCurrentIndex.value <= 0) {
    if (totalOriginalSlides.value <= 1) return;
    goToSlide(maxOriginalStartIndex.value);
    return;
  }

  const oldLogicalIndex = logicalCurrentIndex.value;
  const newLogicalIndex =
    (oldLogicalIndex - 1 + totalOriginalSlides.value) %
    totalOriginalSlides.value;

  logicalCurrentIndex.value = newLogicalIndex;
  displayIndex.value--; // 視覺上滑動一格

  // 如果是循環播放，且從第一個邏輯項目換到最後一個
  if (
    isLooping.value &&
    oldLogicalIndex === 0 &&
    newLogicalIndex === maxOriginalStartIndex.value &&
    totalOriginalSlides.value > 1
  ) {
    // 使用 transitionend 事件而不是 setTimeout 來確保動畫完成
    const transitionEndHandler = () => {
      noTransition.value = true;
      const offsetToCenter = Math.floor(itemsPerView.value / 2);
      // 跳轉到 newLogicalIndex (即最後一個項目) 對應的正確 displayIndex
      displayIndex.value =
        itemsPerView.value + newLogicalIndex - offsetToCenter;

      // 確保等待下一幀渲染完成後才重新啟用過渡
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noTransition.value = false;
        });
      });

      // 移除事件監聽器
      if (trackRef.value) {
        trackRef.value.removeEventListener(
          "transitionend",
          transitionEndHandler
        );
      }
    };

    // 添加過渡結束事件監聽器
    if (trackRef.value) {
      trackRef.value.addEventListener("transitionend", transitionEndHandler, {
        once: true,
      });
    }
  }
};

const startAutoplay = () => {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);
  autoplayInterval.value = setInterval(nextSlide, 3000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

// --- 樣式計算 ---
const carouselItemsStyle = computed(() => {
  if (itemWidth.value <= 0 || clonedAndProcessedPlayers.value.length === 0) {
    return { transform: "translateX(0px)", width: "0px", transition: "none" };
  }
  const totalWidth =
    clonedAndProcessedPlayers.value.length * itemWidth.value +
    (clonedAndProcessedPlayers.value.length > 1
      ? (clonedAndProcessedPlayers.value.length - 1) * gap
      : 0);
  const translateAmount = displayIndex.value * (itemWidth.value + gap);

  return {
    width: `${totalWidth}px`,
    transform: `translateX(-${translateAmount}px)`,
    transition: noTransition.value
      ? "none"
      : `transform ${transitionDurationMs / 1000}s ease`,
  };
});

const dynamicCarouselItemStyle = computed(() => {
  if (itemWidth.value <= 0) return { width: "0px" };
  return { width: `${itemWidth.value}px` };
});

// --- Active/Side 判斷 ---
// `clonedItemIndex` is the index from v-for over `clonedAndProcessedPlayers`
const isActive = (clonedItemIndex) => {
  const isVisible =
    clonedItemIndex >= displayIndex.value &&
    clonedItemIndex < displayIndex.value + itemsPerView.value;
  if (!isVisible) return false;
  const viewRelativeIndex = clonedItemIndex - displayIndex.value;
  return viewRelativeIndex === Math.floor(itemsPerView.value / 2);
};

// 進度條滑動功能
const handleProgressDrag = (e) => {
  const progressBar = e.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const x =
    (e.type === "mousedown" ? e.clientX : e.touches[0].clientX) - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  const numSlidesForProgress = Math.max(1, totalOriginalSlides.value);
  let targetIndex = Math.floor(percentage * numSlidesForProgress);
  if (targetIndex >= numSlidesForProgress && numSlidesForProgress > 0) {
    targetIndex = numSlidesForProgress - 1;
  }
  goToSlide(targetIndex);
};
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
          v-for="(_, index) in totalOriginalSlides"
          :key="index"
          class="line-segment"
          :class="{
            active: index === logicalCurrentIndex,
            passed: index < logicalCurrentIndex,
          }"
          @click="goToSlide(index)"
          :aria-label="`跳到第 ${index + 1} 頁`"
          :style="{
            left: `${(index / Math.max(1, totalOriginalSlides)) * 100}%`,
            width: `${100 / Math.max(1, totalOriginalSlides)}%`,
          }"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... (您的現有 CSS) ... */
/* 確保 .carousel-items 的 transition duration 與 JS 中的 transitionDurationMs 一致 */
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
  gap: 20px; /* This gap is between buttons and track */
}

.carousel-track {
  flex: 1;
  overflow: hidden; /* Important: Hide items outside the track */
  padding-top: 60px; /* Space for active item's translateY */
  position: relative;
}

.carousel-track:active {
  cursor: grabbing;
}

.carousel-items {
  display: flex;
  gap: 20px; /* This is the gap between items, must match JS `gap` const */
  /* transition is now handled by :style="carouselItemsStyle" */
}

.carousel-item {
  flex-shrink: 0;
  min-width: 0;
  transition: transform 0.3s ease, opacity 0.3s ease; /* Individual item animation (scale, opacity) */
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
  /* Note: if gap changes here, JS const `gap` needs to be responsive or calculations will be off. */
  /* .carousel-items { gap: 10px; } */
  .line-indicators {
    width: 90%;
  }
}
</style>
