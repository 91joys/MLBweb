import { ref, computed } from "vue";

export function useCarouselState(actualPlayers, itemsPerView) {
  const logicalCurrentIndex = ref(0);
  const displayIndex = ref(0);
  const noTransition = ref(false);

  const totalActualItems = computed(() => actualPlayers.value.length);

  // 布林值，判斷是否啟用無線循環
  const isLooping = computed(
    () =>
      totalActualItems.value > itemsPerView.value && totalActualItems.value > 0
  );

  const totalLogicalSlides = computed(() => {
    if (totalActualItems.value === 0) return 1;
    return totalActualItems.value;
  });

  const maxLogicalIndex = computed(() =>
    Math.max(0, totalLogicalSlides.value - 1)
  );

  const updateItemsPerView = () => {
    if (window.innerWidth <= 575) itemsPerView.value = 1;
    else if (window.innerWidth <= 767) itemsPerView.value = 2;
    else itemsPerView.value = 3;
  };

  return {
    itemsPerView,
    logicalCurrentIndex,
    displayIndex,
    noTransition,
    totalActualItems,
    isLooping,
    totalLogicalSlides,
    maxLogicalIndex,
    updateItemsPerView,
  };
}
