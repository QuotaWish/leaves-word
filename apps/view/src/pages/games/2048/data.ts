export function useUserData(userData: any) {
  const totalScores = ref(0)
  const average = ref(0)
  const total = ref("")

  watch(() => userData.personal, (userData) => {
    totalScores.value = !userData?.history?.length ? 0 : userData.history.reduce((sum: any, item: any) => sum + item.score, 0)
    average.value = !userData?.history?.length ? 0 : Math.round(totalScores.value / userData.history.length)
    total.value = totalScores.value.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, '$1,')

    // console.log('u', userData)
  }, { immediate: true, deep: true })

  const level = computed(() => {
    const level = Math.floor(Math.log2(totalScores.value / 400))
    const total = 400 * Math.pow(2, level + 1)
    const percent = Math.floor((totalScores.value / total) * 100)
    return [level, total, percent]
  })

  return {
    totalScores,
    average,
    total,
    level
  }
}

export const tasks = ref<any[]>([])

export function genTasks(options: any) {
  tasks.value = []


  function genTotalScores(scores: number[]) {
    [...scores].forEach(num => {
      tasks.value.push({
        per: () => {
          if (options.totalScores.value >= num) return 100

          else return Math.floor((options.totalScores.value / num) * 100)
        },
        text: `累计得分达到 ${format(num)} 分`
      })
    })
  }

  function genGameAccounts(scores: number[]) {
    [...scores].forEach(num => {
      tasks.value.push({
        per: () => {
          if (options.game_count >= num) return 100

          else return Math.floor((options.game_count / num) * 100)
        },
        text: `游戏次数达到 ${format(num)} 次`
      })
    })
  }

  function genSingleTasks(scores: number[]) {
    [...scores].forEach(num => {
      tasks.value.push({
        per: () => {
          if (options.score >= num) return 100

          else return Math.floor((options.score / num) * 100)
        },
        text: `单局积分达到 ${format(num)} 分`
      })
    })
  }

  function genAverageScoreTasks(scores: number[]) {
    [...scores].forEach(num => {
      tasks.value.push({
        per: () => {
          if (options.average.value >= num) return 100

          else return Math.floor((options.average.value / num) * 100)
        },
        text: `平均得分达到 ${format(num)} 分`
      })
    })
  }

  genTotalScores([10000, 50000, 100000, 300000, 500000, 800000, 1000000])
  genGameAccounts([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
  genAverageScoreTasks([1000, 3000, 5000, 10000, 30000, 50000, 100000])
  genSingleTasks([1000, 3000, 5000, 8000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 80000, 100000])
}


export const computedTasks = computed(() => {
  const _tasks = tasks.value.map((item: any) => {
    return {
      text: item.text,
      per: item.per()
    }
  })

  // 将 per 为 100 的放到最后，其余从大到小
  return _tasks.sort((a: any, b: any) => {
    if (a.per === 100) return 1
    else if (b.per === 100) return -1
    else return b.per - a.per
  })
})


export const purchases = ref(["抽奖箱", "撤销道具", "复活道具", "屏蔽交换道具"])

export function format(val: any) {
  return String(val).replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
}
