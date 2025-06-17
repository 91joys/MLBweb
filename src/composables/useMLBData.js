import { ref } from 'vue'

export function useMLBData() {
  const isLoading = ref(false)

  // 獲取今日比賽資訊
  const getTodaysGame = async () => {
    try {
      isLoading.value = true
      
      // 這裡您需要串接實際的 MLB API
      // 示例數據
      const mockData = {
        opponent: '巨人隊',
        score: {
          dodgers: 7,
          opponent: 3
        },
        status: 'live', // live, finished, scheduled
        inning: '第8局上半',
        date: new Date().toISOString().split('T')[0]
      }
      
      return mockData
    } catch (error) {
      console.error('獲取比賽資訊失敗:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 獲取球隊統計
  const getTeamStats = async () => {
    try {
      const mockStats = {
        wins: 65,
        losses: 42,
        winRate: '.607',
        keyPlayers: ['Mookie Betts', 'Freddie Freeman', 'Walker Buehler', 'Julio Urías']
      }
      
      return mockStats
    } catch (error) {
      console.error('獲取球隊統計失敗:', error)
      return null
    }
  }

  return {
    isLoading,
    getTodaysGame,
    getTeamStats
  }
}