import { nextTick, ref } from "vue";

export function useCarouselNavigation(state, trackRef) {
  // 添加動畫鎖定狀態
  const isAnimating = ref(false);

  const goToSlide = (targetLogicalIndex, applyTransition = true) => {
    // 如果正在動畫中且需要應用過渡，則忽略
    if (isAnimating.value && applyTransition) return;

    const {
      logicalCurrentIndex,
      displayIndex,
      noTransition,
      totalActualItems,
      maxLogicalIndex,
      itemsPerView,
      isLooping,
    } = state;

    // 防錯機制
    if (totalActualItems.value === 0 && targetLogicalIndex !== 0) {
      logicalCurrentIndex.value = 0;
    } else {
      logicalCurrentIndex.value = Math.min(
        Math.max(0, targetLogicalIndex),
        maxLogicalIndex.value
      );
    }

    // 確保使用下面指示器點選時不自動輪播
    if (!applyTransition) noTransition.value = true;

    // 計算偏移量
    const offsetToCenter = Math.floor(itemsPerView.value / 2);

    if (isLooping.value) {
      displayIndex.value =
        itemsPerView.value + logicalCurrentIndex.value - offsetToCenter;
    } else {
      const targetDisplayIndexIfStartingWithLogical =
        logicalCurrentIndex.value - offsetToCenter;
      const minPossibleDisplayIndex = 0;
      const maxPossibleDisplayIndex = Math.max(
        0,
        totalActualItems.value - itemsPerView.value
      );

      displayIndex.value = Math.max(
        minPossibleDisplayIndex,
        Math.min(
          targetDisplayIndexIfStartingWithLogical,
          maxPossibleDisplayIndex
        )
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
    // 防抖：如果正在動畫中，忽略點擊
    if (isAnimating.value) return;

    const {
      logicalCurrentIndex,
      totalActualItems,
      maxLogicalIndex,
      isLooping,
    } = state;

    if (totalActualItems.value === 0) return;

    const oldLogicalIndex = logicalCurrentIndex.value;
    const newLogicalIndex =
      (logicalCurrentIndex.value + 1) % totalActualItems.value;

    if (
      isLooping.value &&
      oldLogicalIndex === maxLogicalIndex.value &&
      newLogicalIndex === 0 &&
      totalActualItems.value > 1
    ) {
      handleWrapAroundNext(newLogicalIndex);
    } else {
      goToSlide(newLogicalIndex);
    }
  };

  const prevSlide = () => {
    // 防抖：如果正在動畫中，忽略點擊
    if (isAnimating.value) return;

    const {
      logicalCurrentIndex,
      totalActualItems,
      maxLogicalIndex,
      isLooping,
    } = state;

    if (totalActualItems.value === 0) return;

    const oldLogicalIndex = logicalCurrentIndex.value;
    const newLogicalIndex =
      (logicalCurrentIndex.value - 1 + totalActualItems.value) %
      totalActualItems.value;

    if (
      isLooping.value &&
      oldLogicalIndex === 0 &&
      newLogicalIndex === maxLogicalIndex.value &&
      totalActualItems.value > 1
    ) {
      handleWrapAroundPrev(newLogicalIndex);
    } else {
      goToSlide(newLogicalIndex);
    }
  };

  const handleWrapAroundNext = (newLogicalIndex) => {
    // 設定動畫鎖定
    isAnimating.value = true;

    state.logicalCurrentIndex.value = newLogicalIndex;
    const offsetToCenter = Math.floor(state.itemsPerView.value / 2);
    const targetClonedItemIndexForAnimation =
      state.itemsPerView.value + state.totalActualItems.value + newLogicalIndex;
    state.displayIndex.value =
      targetClonedItemIndexForAnimation - offsetToCenter;

    const transitionEndHandler = () => {
      state.noTransition.value = true;
      const targetClonedItemIndexForJump =
        state.itemsPerView.value + newLogicalIndex;
      state.displayIndex.value = targetClonedItemIndexForJump - offsetToCenter;

      setTimeout(() => {
        state.noTransition.value = false;
        isAnimating.value = false; // 解除動畫鎖定
      }, 50);
    };

    if (trackRef.value) {
      trackRef.value.addEventListener("transitionend", transitionEndHandler, {
        once: true,
      });
    }
  };

  const handleWrapAroundPrev = (newLogicalIndex) => {
    // 設定動畫鎖定
    isAnimating.value = true;

    state.logicalCurrentIndex.value = newLogicalIndex;
    const offsetToCenter = Math.floor(state.itemsPerView.value / 2);
    const targetClonedItemIndexForAnimation = state.itemsPerView.value - 1;
    state.displayIndex.value =
      targetClonedItemIndexForAnimation - offsetToCenter;

    const transitionEndHandler = () => {
      state.noTransition.value = true;
      const targetClonedItemIndexForJump =
        state.itemsPerView.value + newLogicalIndex;
      state.displayIndex.value = targetClonedItemIndexForJump - offsetToCenter;

      setTimeout(() => {
        state.noTransition.value = false;
        isAnimating.value = false; // 解除動畫鎖定
      }, 50);
    };

    if (trackRef.value) {
      trackRef.value.addEventListener("transitionend", transitionEndHandler, {
        once: true,
      });
    }
  };

  return {
    goToSlide,
    nextSlide,
    prevSlide,
  };
}
