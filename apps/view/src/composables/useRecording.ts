import { ref } from 'vue'
import { useSpeechRecognition } from '@vueuse/core'

export interface IWordAnalysis {
  correct: boolean
  originalChar: string
  spokenChar: string
  type: 'correct' | 'wrong' | 'missing' | 'extra'
}

export interface IPhonemeAnalysis {
  phoneme: string
  isCorrect: boolean
  confidence: number
  suggestion?: string
}

export interface IStressPattern {
  expected: string
  actual: string
  isCorrect: boolean
}

export interface IIntonation {
  pattern: string
  issues: string[]
}

export interface IAnalysisResult {
  wordAnalysis: Array<{
    char: string
    isCorrect: boolean
    confidence: number
    suggestion?: string
  }>
  accuracy: number
  vowelIssues: string[]
  consonantIssues: string[]
  rhythmIssues: string[]
  suggestions: string[]
  phonemeAnalysis: IPhonemeAnalysis[]
  stressPattern: {
    expected: string
    actual: string
    isCorrect: boolean
  }
  intonation: {
    pattern: string
    issues: string[]
  }
  realTimeData: {
    pitch: number[]
    intensity: number[]
    duration: number
    speed: number
  }
}

export function useRecording() {
  const isRecording = ref(false)
  const isAnalyzing = ref(false)
  const result = ref('')
  const realTimeAnalysis = ref<{
    currentChar: string
    confidence: number
    matchRate: number
  }>({
    currentChar: '',
    confidence: 0,
    matchRate: 0
  })

  const {
    isSupported,
    isListening,
    result: recognitionResult,
    start: startRecognition,
    stop: stopRecognition,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true
  })

  // 实时分析每个音素
  function analyzePhoneme(spoken: string, target: string): IPhonemeAnalysis[] {
    return spoken.split('').map((char, index) => {
      const targetChar = target[index] || ''
      const isCorrect = char.toLowerCase() === targetChar.toLowerCase()
      const confidence = isCorrect ? Math.random() * 30 + 70 : Math.random() * 50 + 20

      return {
        phoneme: char,
        isCorrect,
        confidence,
        suggestion: !isCorrect ? `尝试发音更接近 "${targetChar}"` : undefined
      }
    })
  }

  // 模拟实时音高和音强数据
  function generateAudioMetrics(): { pitch: number[], intensity: number[] } {
    return {
      pitch: Array.from({ length: 10 }, () => Math.random() * 100),
      intensity: Array.from({ length: 10 }, () => Math.random() * 100),
    }
  }

  async function startRecording() {
    isRecording.value = true
    result.value = ''
    await startRecognition()
  }

  async function stopRecording(): Promise<Blob[]> {
    isRecording.value = false
    await stopRecognition()
    return []
  }

  async function analyzePronunciation(spoken: string, target: string): Promise<IAnalysisResult> {
    isAnalyzing.value = true

    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    const phonemeResults = analyzePhoneme(spoken, target)
    const { pitch, intensity } = generateAudioMetrics()

    const accuracy = phonemeResults.reduce((acc, curr) => acc + curr.confidence, 0) / phonemeResults.length

    isAnalyzing.value = false

    return {
      wordAnalysis: phonemeResults.map(p => ({
        char: p.phoneme,
        isCorrect: p.isCorrect,
        confidence: p.confidence,
        suggestion: p.suggestion
      })),
      accuracy,
      vowelIssues: phonemeResults.filter(p => !p.isCorrect && /[aeiou]/i.test(p.phoneme))
        .map(p => `元音 "${p.phoneme}" 发音不准确`),
      consonantIssues: phonemeResults.filter(p => !p.isCorrect && !/[aeiou]/i.test(p.phoneme))
        .map(p => `辅音 "${p.phoneme}" 发音不准确`),
      rhythmIssues: accuracy < 70 ? ['整体语速偏慢，需要更流畅'] : [],
      suggestions: [
        '注意口型开合度',
        '保持发音清晰度',
        '语速可以适当加快'
      ],
      phonemeAnalysis: phonemeResults,
      stressPattern: {
        expected: '●○●',
        actual: '●●○',
        isCorrect: false
      },
      intonation: {
        pattern: '↗↘',
        issues: ['语调起伏不够明显']
      },
      realTimeData: {
        pitch,
        intensity,
        duration: Math.random() * 2 + 1,
        speed: Math.random() * 50 + 100
      }
    }
  }

  return {
    isRecording,
    isAnalyzing,
    isSupported,
    isListening,
    result: recognitionResult,
    realTimeAnalysis,
    startRecording,
    stopRecording,
    analyzePronunciation,
  }
}
