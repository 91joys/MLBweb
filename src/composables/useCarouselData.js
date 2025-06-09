import { computed } from "vue";
import rawPlayersData from "@/assets/data/players.json";

export function useCarouselData(props, itemsPerView, isLooping = null) {
  const actualPlayers = computed(() => {
    // 處理圖片路經
    let playersWithImages = rawPlayersData.map((player) => {
      if (player.Image_URL) {
        const imageUrl = `/images/players/${player.Image_URL}`;
        return { ...player, Image_URL: imageUrl };
      }
      return player;
    });

    // 處理顯示的球員有誰
    if (props.selectedPosition && props.selectedPosition !== "所有球員") {
      return playersWithImages.filter(
        (player) => player.Position === props.selectedPosition
      );
    }
    return playersWithImages;
  });

  // 處理循環輪播，複製一組於頭尾
  const clonedAndProcessedPlayers = computed(() => {
    const players = actualPlayers.value;
    const numPlayers = players.length;

    // 添加獨立的索引
    const addUniqueKey = (player, prefix, index) => ({
      ...player,
      _carouselKey: `${prefix}_${
        player.Number || player.Player_Name
      }_${index}_${Math.random()}`,
    });

    if (!isLooping || numPlayers === 0) {
      return players.map((player, index) =>
        addUniqueKey(player, "orig", index)
      );
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

  return {
    actualPlayers,
    clonedAndProcessedPlayers,
  };
}
