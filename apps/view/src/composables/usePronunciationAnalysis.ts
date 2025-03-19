import { ref } from 'vue'

export interface IWordAnalysis {
  correct: boolean
  originalChar: string
  spokenChar: string
  type: 'correct' | 'wrong' | 'missing' | 'extra'
}

export interface IAIAnalysisDetails {
  wordAnalysis: IWordAnalysis[]
  accuracy: number
  vowelIssues: string[]
  consonantIssues: string[]
  rhythmIssues: string[]
  suggestions: string[]
}

function isVowel(char: string): boolean {
  return /[aeiou]/i.test(char);
}

export function usePronunciationAnalysis() {
  const aiAnalysisState = ref<'idle' | 'analyzing' | 'complete'>('idle')
  const pronunciationScore = ref(0)
  const showScoreCard = ref(false)
  const mouthAnimation = ref<'closed' | 'slightly-open' | 'wide-open'>('closed')
  const aiAnalysisDetails = ref<IAIAnalysisDetails>({
    wordAnalysis: [],
    accuracy: 0,
    vowelIssues: [],
    consonantIssues: [],
    rhythmIssues: [],
    suggestions: [],
  })

  function analyzeWord(spokenText: string, correctText: string): IWordAnalysis[] {
    const spokenChars = Array.from(spokenText);
    const correctChars = Array.from(correctText);
    const analysis: IWordAnalysis[] = [];

    for (const [index, char] of correctChars.entries()) {
      analysis.push({
        correct: spokenChars[index] === char,
        originalChar: char,
        spokenChar: spokenChars[index] || '',
        type: spokenChars[index] === char ? 'correct' : 'wrong',
      });
    }

    return analysis;
  }

  function analyzePronunciationIssues(wordAnalysis: IWordAnalysis[]) {
    const vowelIssues: string[] = [];
    const consonantIssues: string[] = [];
    const rhythmIssues: string[] = [];

    for (const analysis of wordAnalysis) {
      if (!analysis.correct) {
        // 分析元音问题
        if (isVowel(analysis.originalChar)) {
          vowelIssues.push(`期望发音 "${analysis.originalChar}"，实际发音 "${analysis.spokenChar}"`);
        }
        // 分析辅音问题
        else {
          consonantIssues.push(`期望发音 "${analysis.originalChar}"，实际发音 "${analysis.spokenChar}"`);
        }
      }
    }

    // 分析节奏问题
    if (wordAnalysis.some(a => !a.spokenChar)) {
      rhythmIssues.push('发音不完整或速度过快');
    }

    return {
      vowelIssues,
      consonantIssues,
      rhythmIssues,
    };
  }

  function generateSuggestions(wordAnalysis: IWordAnalysis[]): string[] {
    const suggestions: string[] = [];
    const incorrectCount = wordAnalysis.filter(a => !a.correct).length;

    if (incorrectCount === 0) {
      suggestions.push('发音非常准确，继续保持！');
      return suggestions;
    }

    if (incorrectCount / wordAnalysis.length > 0.5) {
      suggestions.push('建议先听一遍标准发音，然后再尝试。');
    }

    const vowelErrors = wordAnalysis.filter(a => !a.correct && isVowel(a.originalChar));
    const consonantErrors = wordAnalysis.filter(a => !a.correct && !isVowel(a.originalChar));

    if (vowelErrors.length > 0) {
      suggestions.push('注意元音发音的准确性，尤其是长短音的区分。');
    }

    if (consonantErrors.length > 0) {
      suggestions.push('注意辅音发音的清浊度，以及气流的控制。');
    }

    if (wordAnalysis.some(a => !a.spokenChar)) {
      suggestions.push('建议放慢语速，确保每个音都发音清晰。');
    }

    return suggestions;
  }

  async function analyzePronunciation(spokenText: string, correctText: string) {
    try {
      aiAnalysisState.value = 'analyzing'

      if (!spokenText) {
        return { score: 0 }
      }

      const wordAnalysis = analyzeWord(spokenText.toLowerCase(), correctText.toLowerCase())
      const issues = analyzePronunciationIssues(wordAnalysis)
      const suggestions = generateSuggestions(wordAnalysis)
      const accuracy = (wordAnalysis.filter(a => a.correct).length / wordAnalysis.length) * 100

      aiAnalysisDetails.value = {
        wordAnalysis,
        accuracy,
        ...issues,
        suggestions,
      }

      pronunciationScore.value = Math.round(accuracy)
      aiAnalysisState.value = 'complete'
      showScoreCard.value = true

      return { score: accuracy }
    }
    catch {
      aiAnalysisState.value = 'idle'
      return { score: 0 }
    }
  }

  return {
    aiAnalysisState,
    pronunciationScore,
    showScoreCard,
    aiAnalysisDetails,
    analyzePronunciation,
    mouthAnimation,
  }
}
