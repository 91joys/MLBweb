// 建立新檔案 src/composables/useRatingSystem.js
import { ref, computed } from "vue";

export function useRatingSystem(initialSum = 25, initialCount = 5) {
  const showRatingSelector = ref(false);
  const currentPersonalRating = ref(0);
  const hoverRating = ref(0);
  const allRatingsSum = ref(initialSum);
  const totalRatingCount = ref(initialCount);

  const averageRating = computed(() => {
    if (totalRatingCount.value === 0) return 0;
    return parseFloat(
      (allRatingsSum.value / totalRatingCount.value).toFixed(1)
    );
  });

  function toggleRatingSelector() {
    showRatingSelector.value = !showRatingSelector.value;
    if (!showRatingSelector.value) {
      hoverRating.value = 0;
    }
  }

  function handleRate(rating) {
    if (currentPersonalRating.value > 0) {
      allRatingsSum.value =
        allRatingsSum.value - currentPersonalRating.value + rating;
    } else {
      allRatingsSum.value += rating;
      totalRatingCount.value++;
    }
    currentPersonalRating.value = rating;
    showRatingSelector.value = false;
    hoverRating.value = 0;
    // TODO: 發送到後端的邏輯
  }

  function getStarSelectorIcon(starValue) {
    const ratingToShow =
      hoverRating.value > 0 ? hoverRating.value : currentPersonalRating.value;

    return starValue <= ratingToShow
      ? new URL("@/assets/images/star-filled.svg", import.meta.url).href
      : new URL("@/assets/images/star.svg", import.meta.url).href;
  }

  return {
    showRatingSelector,
    currentPersonalRating,
    hoverRating,
    averageRating,
    toggleRatingSelector,
    handleRate,
    getStarSelectorIcon,
  };
}
