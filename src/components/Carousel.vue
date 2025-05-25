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

const totalActualItems = computed(() => actualPlayers.value.length);

const isLooping = computed(
  () =>
    totalActualItems.value > itemsPerView.value && totalActualItems.value > 0 // Ensure looping only if there are items
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

// Renamed from totalOriginalSlides to totalLogicalSlides for clarity
const totalLogicalSlides = computed(() => {
  if (totalActualItems.value === 0) return 1; // For progress bar, should show 1 segment even if empty
  return totalActualItems.value; // Each actual item is a potential logical slide
});

// Renamed from maxOriginalStartIndex to maxLogicalIndex
const maxLogicalIndex = computed(() => {
  return Math.max(0, totalLogicalSlides.value - 1);
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

watch(
  totalActualItems, // Watch totalActualItems directly
  (newLength, oldLength) => {
    // maxLogicalIndex.value will update automatically.
    if (logicalCurrentIndex.value > maxLogicalIndex.value) {
      goToSlide(maxLogicalIndex.value, false); // Go to the new last valid slide
    } else if (newLength === 0 && logicalCurrentIndex.value !== 0) {
      goToSlide(0, false); // Reset if list becomes empty
    }
    // If itemsPerView changes or actualPlayers list changes,
    // resetCarouselState (called from other watchers) or this watcher
    // will ensure goToSlide is called, which recalculates displayIndex.
  },
  { immediate: true }
);

// --- 輪播控制函式 ---
const goToSlide = (targetLogicalIndex, applyTransition = true) => {
  // Ensure logicalCurrentIndex.value is updated within goToSlide if it's not a wrap-around case
  if (totalActualItems.value === 0 && targetLogicalIndex !== 0) {
    logicalCurrentIndex.value = 0; // Force to 0 if empty
  } else {
    // This direct update might be redundant if the wrap-around logic below also updates it.
    // However, for non-wrap-around cases, goToSlide should manage logicalCurrentIndex.
    logicalCurrentIndex.value = Math.min(
      Math.max(0, targetLogicalIndex),
      maxLogicalIndex.value
    );
  }

  if (!applyTransition) noTransition.value = true;

  const offsetToCenter = Math.floor(itemsPerView.value / 2);

  if (isLooping.value) {
    // Default displayIndex calculation for looping mode, might be overridden by wrap-around logic
    displayIndex.value =
      itemsPerView.value + logicalCurrentIndex.value - offsetToCenter;
  } else {
    // Non-looping mode
    const targetDisplayIndexIfStartingWithLogical =
      logicalCurrentIndex.value - offsetToCenter;
    const minPossibleDisplayIndex = 0;
    const maxPossibleDisplayIndex = Math.max(
      0,
      totalActualItems.value - itemsPerView.value
    );

    displayIndex.value = Math.max(
      minPossibleDisplayIndex,
      Math.min(targetDisplayIndexIfStartingWithLogical, maxPossibleDisplayIndex)
    );
    if (totalActualItems.value <= itemsPerView.value) {
      displayIndex.value = 0;
    }
  }

  if (!applyTransition) {
    nextTick(() => {
      noTransition.value = false;
    });
  }
};

const nextSlide = () => {
  if (totalActualItems.value === 0) return;

  const oldLogicalIndex = logicalCurrentIndex.value;
  const newLogicalIndex =
    (logicalCurrentIndex.value + 1) % totalActualItems.value;

  if (
    isLooping.value &&
    oldLogicalIndex === maxLogicalIndex.value && // old was last actual item
    newLogicalIndex === 0 && // new is first actual item
    totalActualItems.value > 1 // Ensure there's something to loop
  ) {
    // Wrap around from last to first
    logicalCurrentIndex.value = newLogicalIndex; // Update logical index immediately

    const offsetToCenter = Math.floor(itemsPerView.value / 2);
    // Animate to the tail clone of the newLogicalIndex (0)
    // Tail clone of actual item `newLogicalIndex` is at `clonedAndProcessedPlayers` index:
    // `itemsPerView.value (head clones) + totalActualItems.value (middle) + newLogicalIndex`
    const targetClonedItemIndexForAnimation =
      itemsPerView.value + totalActualItems.value + newLogicalIndex;
    displayIndex.value = targetClonedItemIndexForAnimation - offsetToCenter;
    // `noTransition.value` should be false here to allow animation

    const transitionEndHandler = () => {
      noTransition.value = true;
      // Jump to the displayIndex corresponding to the *original* newLogicalIndex (0)
      // Original item `newLogicalIndex` is at `clonedAndProcessedPlayers` index:
      // `itemsPerView.value (head clones) + newLogicalIndex`
      const targetClonedItemIndexForJump = itemsPerView.value + newLogicalIndex;
      displayIndex.value = targetClonedItemIndexForJump - offsetToCenter;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noTransition.value = false;
        });
      });
      // removeEventListener is implicitly handled by { once: true }
    };
    if (trackRef.value) {
      trackRef.value.addEventListener("transitionend", transitionEndHandler, {
        once: true,
      });
    }
  } else {
    // Normal slide or non-looping
    goToSlide(newLogicalIndex);
  }
};

const prevSlide = () => {
  if (totalActualItems.value === 0) return;

  const oldLogicalIndex = logicalCurrentIndex.value;
  const newLogicalIndex =
    (logicalCurrentIndex.value - 1 + totalActualItems.value) %
    totalActualItems.value;

  if (
    isLooping.value &&
    oldLogicalIndex === 0 && // old was first actual item
    newLogicalIndex === maxLogicalIndex.value && // new is last actual item
    totalActualItems.value > 1 // Ensure there's something to loop
  ) {
    // Wrap around from first to last
    logicalCurrentIndex.value = newLogicalIndex; // Update logical index immediately

    const offsetToCenter = Math.floor(itemsPerView.value / 2);
    // Animate to the head clone of the newLogicalIndex (maxLogicalIndex)
    // The head clones are copies of the *last* `itemsPerView.value` actual items.
    // `actualPlayers[newLogicalIndex]` is `actualPlayers[totalActualItems.value - 1]`.
    // Its head clone is `headClones[itemsPerView.value - 1]`.
    // This head clone is at `clonedAndProcessedPlayers` index: `itemsPerView.value - 1`.
    const targetClonedItemIndexForAnimation = itemsPerView.value - 1;
    displayIndex.value = targetClonedItemIndexForAnimation - offsetToCenter;
    // `noTransition.value` should be false here to allow animation

    const transitionEndHandler = () => {
      noTransition.value = true;
      // Jump to the displayIndex corresponding to the *original* newLogicalIndex (maxLogicalIndex)
      // Original item `newLogicalIndex` is at `clonedAndProcessedPlayers` index:
      // `itemsPerView.value (head clones) + newLogicalIndex`
      const targetClonedItemIndexForJump = itemsPerView.value + newLogicalIndex;
      displayIndex.value = targetClonedItemIndexForJump - offsetToCenter;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          noTransition.value = false;
        });
      });
      // removeEventListener is implicitly handled by { once: true }
    };
    if (trackRef.value) {
      trackRef.value.addEventListener("transitionend", transitionEndHandler, {
        once: true,
      });
    }
  } else {
    // Normal slide or non-looping
    goToSlide(newLogicalIndex);
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
const isActive = (clonedItemIndex) => {
  if (isLooping.value) {
    // 當循環播放時，強調視圖中間的項目
    const isVisible =
      clonedItemIndex >= displayIndex.value &&
      clonedItemIndex < displayIndex.value + itemsPerView.value;
    if (!isVisible) return false;
    const viewRelativeIndex = clonedItemIndex - displayIndex.value;
    return viewRelativeIndex === Math.floor(itemsPerView.value / 2);
  } else {
    // 不循環播放時 (項目較少)，強調 logicalCurrentIndex 對應的項目
    // 在此模式下，clonedAndProcessedPlayers 中的 clonedItemIndex 直接對應 actualPlayers 的索引
    return clonedItemIndex === logicalCurrentIndex.value;
  }
};

// 進度條滑動功能
const handleProgressDrag = (e) => {
  const progressBar = e.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const x =
    (e.type === "mousedown" ? e.clientX : e.touches[0].clientX) - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  // Use totalLogicalSlides for progress bar calculation
  const numSlidesForProgress = Math.max(1, totalLogicalSlides.value);
  let targetIndex = Math.floor(percentage * numSlidesForProgress);
  if (targetIndex >= numSlidesForProgress && numSlidesForProgress > 0) {
    targetIndex = numSlidesForProgress - 1;
  }
  goToSlide(targetIndex);
};

const handleItemMouseEnter = (clonedItemIndex) => {
  if (isActive(clonedItemIndex)) {
    stopAutoplay();
  }
};

const handleItemMouseLeave = (clonedItemIndex) => {
  // 重新啟動輪播的條件可以更寬鬆，
  // 或者依賴於外層容器的 mouseleave (如果有的話)
  // 為了簡單起見，這裡只要離開 active item 就嘗試重啟
  if (isActive(clonedItemIndex)) {
    startAutoplay();
  }
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
        :disabled="totalActualItems === 0"
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
            @mouseenter="handleItemMouseEnter(clonedItemIndex)"
            @mouseleave="handleItemMouseLeave(clonedItemIndex)"
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
        :disabled="totalActualItems === 0"
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
          v-for="(_, index) in totalLogicalSlides"
          :key="index"
          class="line-segment"
          :class="{
            active: index === logicalCurrentIndex && totalActualItems > 0,
            passed: index < logicalCurrentIndex && totalActualItems > 0,
          }"
          @click="goToSlide(index)"
          :aria-label="`跳到第 ${index + 1} 頁`"
          :style="{
            left: `${(index / Math.max(1, totalLogicalSlides)) * 100}%`,
            width: `${100 / Math.max(1, totalLogicalSlides)}%`,
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
