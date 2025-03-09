/**
 * 本拓展用于用户每日占卜
 */
import fortuneJson from './daily_fortune'
// import path from 'node:path'

// import ExcelJS from 'exceljs'

// 定义JSON结构
export interface Fortune {
  provider: string
  topic: string
  desc: string
  sign: string
  fortune: string
  probability: number
  score: number
  tip: string
}

export const fortuneList: Fortune[] = fortuneJson

// // 读取Excel文件并转换为JSON
// async function convertExcelToJSON(excelFilePath: string, jsonFilePath: string): Promise<void> {
//   const workbook = new ExcelJS.Workbook()

//   try {
//     // 读取Excel文件
//     await workbook.xlsx.readFile(excelFilePath)

//     // 获取第一个工作表
//     const worksheet = workbook.getWorksheet(1)

//     // 转换工作表中的数据
//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber <= 2)
//         return // 跳过标题行
//       const data: Fortune = {
//         provider: row.values[2],
//         topic: row.values[3],
//         desc: row.values[4],
//         sign: row.values[5],
//         fortune: row.values[6],
//         probability: Number.parseFloat(row.values[7] as string),
//         score: Number.parseInt(row.values[8] as string),
//         tip: row.values[9],
//       }
//       fortuneList.push(data)
//     })

//     // 将JSON数据保存到文件
//     const jsonString = JSON.stringify(fortuneList, null, 2)

//     console.log('a', jsonString)

//     require('node:fs').writeFileSync(jsonFilePath, jsonString, 'utf8')

//     console.log('JSON data has been written to:', jsonFilePath)
//   }
//   catch (error) {
//     console.error('Error converting Excel to JSON:', error)
//   }
// }

// // 调用函数
// const basePath = path.join(process.cwd(), 'addon')
// const excelFilePath = path.join(basePath, 'fortune.xlsx') // Excel文件路径
// const jsonFilePath = path.join(basePath, 'daily_fortune.json') // JSON文件保存路径
// convertExcelToJSON(excelFilePath, jsonFilePath)

export interface MainFortune {
  name: string
  color: string
  possible: number
  isBad?: boolean
  isGood?: boolean
}

// 大吉 中吉 小吉 凶 大凶 极恶
const mainFortune: MainFortune[] = [
  { name: '大吉', color: '#00FF00', possible: 0.1, isGood: true },
  { name: '中吉', color: '#FFFF00', possible: 0.2 },
  { name: '小吉', color: '#FFA500', possible: 0.3 },
  { name: '凶', color: '#FF0000', possible: 0.25 },
  { name: '大凶', color: '#800080', possible: 0.1, isBad: true },
  { name: '极恶', color: '#0000FF', possible: 0.05, isBad: true },
]

const goods = fortuneList.filter(f => f.score >= 5)
const bads = fortuneList.filter(f => f.score <= 5)

// 根据当前日期获取主要运势
function getMainFortune(): MainFortune {
  // 如果在每年的春节
  const rand = Math.random()

  let start = 0
  // 判断随机数所在区间
  for (const f of mainFortune) {
    if (rand < f.possible + start) {
      return f
    }

    start += f.possible
  }

  // 啥也不是
  return mainFortune[mainFortune.length - 1]
}

// 从数组中随机抽取amo个元素
function pickFromArray(arr: any[], amo: number) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, amo)
}

const minScore = 12
const maxScore = 29

function genDailyFortune(): {
  main: MainFortune
  list: Fortune[]
  level: number
  score: number
} {
  // 先根据主要运势筛选出可以拿到的
  // 比如如果是 Good 那么评分就必须在 5-10 fortune必须是吉
  // 如果是 Bad 那么评分必须大于 0-5 差
  // const filteredFortune: Fortune[] = []

  // 随机每个品类抽两个
  const goodList = pickFromArray(goods, 2)
  const badList = pickFromArray(bads, 2)

  const res = [...goodList, ...badList]

  const score = res.reduce((acc, cur) => acc + cur.score, 0)

  // 从 12-29 分6个等级
  const level = Math.floor((score - 12) / 6)
  const main = mainFortune?.[level]

  return {
    main,
    score,
    level,
    list: res,
  }
}

export {
  getMainFortune,
  genDailyFortune,
}
