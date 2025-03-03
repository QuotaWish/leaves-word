import SoundWord from "~/components/words/mode/sound/index.vue";
import { PrepareWord, SignMode } from ".";
import {
  calendarManager,
  globalData,
  type IWord,
  type IWordItem,
  useWordSound,
} from "..";

// 定义常量
const PRELOAD_WORD_AMO = 5; // 提前加载的单词数量
// const NEW_WORDS_PER_SESSION = 10 // 每次学习新单词的数量

export enum SoundWordType {
  DICTATION = "dictation", // 听写模式
  EXAMPLE = "example", // 例句模式
}

export enum ExampleStage {
  PLUS_ONE = 0, // 前一个单词 + 单词本身
  PERCENT_WORD = 1, // 单词的 70% 部分 + 单词本身
  FULL_SENTENCE = 2, // 整个例句
}

export enum WordState {
  INIT = "init", // 初始状态
  PLAYING = "playing", // 播放音频中
  WAITING = "waiting", // 等待输入
  CORRECT = "correct", // 答案正确
  ERROR = "error", // 答案错误
  TRANSITIONING = "transitioning", // 过渡到下一个单词
  FADE_OUT = "fade-out", // 淡出状态
  FADE_IN = "fade-in", // 淡入状态
}

export interface IDisplayChar {
  /**
   * 字符
   */
  char: string;
  /**
   * 是否输入
   */
  isInput: boolean;
  /**
   * 是否光标
   */
  isCursor: boolean;
  /**
   * 是否正确
   */
  isCorrect: boolean;
  /**
   * 是否错误
   */
  isError: boolean;
  /**
   * 是否空
   */
  isEmpty: boolean;
  /**
   * 是否标点
   */
  isPunctuation: boolean;
  /**
   * 是否空格
   */
  isSpace: boolean;
}

export interface IDisplayText {
  displayChars: IDisplayChar[];
}

/**
 * 例句分词功能
 *
 * 1. 首先是单词对应的前一个单词/后一个单词（随机 如果没有的话就切换另外一个） + 单词本身
 * 2. 单词的 70% 部分 + 单词本身
 * 3. 整个例句
 *
 * 返回一个数组，按照给定的要求
 */
export function splitExampleSentence(
  sentence: string
): [string[], string[], string[]] {
  // 将句子按空格分词
  const words = sentence.split(/\s+/);
  
  // 如果句子为空或只有一个单词，直接返回
  if (words.length <= 1) {
    return [words, words, words];
  }

  // 第一步：找到重点单词
  // 选择目标单词的索引（首选中间偏后的位置）
  const wordIndex = Math.floor(words.length / 2);
  const targetWord = words[wordIndex < words.length ? wordIndex : words.length - 1];
  
  console.warn(`%c[分段信息] 原始句子: "${sentence}"`, 'color: #673AB7; font-weight: bold;');
  console.warn(`%c[分段信息] 目标单词: "${targetWord}", 索引: ${wordIndex}`, 'color: #FF9800; font-weight: bold;');
  
  // 第一阶段：重点单词前后一个字符
  // 如果没有后面就用前面，以此类推
  const stage1: string[] = [];
  
  // 如果有前面的单词，添加前面一个单词
  if (wordIndex > 0) {
    stage1.push(words[wordIndex - 1]);
  }
  
  // 添加目标单词
  stage1.push(targetWord);
  
  // 如果有后面的单词，添加后面一个单词
  if (wordIndex < words.length - 1) {
    stage1.push(words[wordIndex + 1]);
  } 
  // 如果没有后面的单词，但有更前面的单词，添加更前面的单词
  else if (wordIndex > 1) {
    stage1.unshift(words[wordIndex - 2]);
  }
  
  // 第二阶段：整个句子的70%部分，从前往后到重点单词或从后往前到重点单词
  const stage2: string[] = [];
  const sentenceLength70Percent = Math.ceil(words.length * 0.7);
  
  // 确保目标单词在第二阶段中
  // 计算开始索引，确保目标单词在结果中
  let startIndex = 0;
  
  // 从前向后到目标单词
  if (wordIndex < words.length / 2) {
    // 目标单词在前半部分，从头开始取70%的单词
    startIndex = 0;
  } else {
    // 目标单词在后半部分，确保目标单词包含在内，从后向前计算开始位置
    startIndex = Math.max(0, wordIndex - Math.floor(sentenceLength70Percent / 2));
  }
  
  // 获取70%部分
  stage2.push(...words.slice(startIndex, Math.min(startIndex + sentenceLength70Percent, words.length)));
  
  // 第三阶段：完整句子
  const stage3 = [...words];
  
  console.warn(`%c[分段信息] 阶段1: "${stage1.join(' ')}"`, 'color: #4CAF50; font-weight: bold;');
  console.warn(`%c[分段信息] 阶段2: "${stage2.join(' ')}"`, 'color: #2196F3; font-weight: bold;');
  console.warn(`%c[分段信息] 阶段3: "${stage3.join(' ')}"`, 'color: #9C27B0; font-weight: bold;');

  return [stage1, stage2, stage3];
}

/**
 * 将例句转换格式
 *
 * 1. 转换为分词数组
 * 2. 忽略标点和空格
 * 3. 返回分词数组
 */
export function convertExampleSentenceToWords(sentence: string) {
  const [sentenceOne, sentenceTwo, words] = splitExampleSentence(sentence);

  const filterSentence = (sentence: string[]) => {
    return sentence.filter((word) => word.trim() !== "");
  };

  const [filterSentenceOne, filterSentenceTwo, filterWords] = [
    filterSentence(sentenceOne),
    filterSentence(sentenceTwo),
    filterSentence(words),
  ];

  return {
    origin: [sentenceOne, sentenceTwo, words],
    filter: [filterSentenceOne, filterSentenceTwo, filterWords],
  };
}

export interface ISoundWordItem {
  word: IWordItem;
  type: SoundWordType;

  exampleStage?: ExampleStage;
  exampleParts?: string[][];
  exampleOrigin?: string[][];
}

export class SoundPrepareWord extends PrepareWord<SoundMode, ISoundWordItem> {
  onCreated(): void {
    const globalAmo = globalData.value.amount;
    const storage = this.mode.dictionaryStorage;
    const unlearnedWords = storage.getUnlearnedWords();
    const amo = Math.min(globalAmo, unlearnedWords.length);

    this.taskAmount = amo;
  }

  wordsQueue: ISoundWordItem[] = [];
  wordsDisplayed: string[] = []; // 修正拼写错误
  wordsFinished: IWordItem[] = [];

  amo = 0;

  // 加载单词的图片和音频
  async preloadWordData(word: { mainWord: IWord; options: IWord[] }) {
    const { mainWord } = word;

    // 加载单词的音频
    const res = await useWordSound(mainWord.word);

    return res;
  }

  // 获取当前单词的占位符表示，用于听写模式
  getWordPlaceholder(): string {
    if (
      !this.currentWord ||
      this.currentWord.type !== SoundWordType.DICTATION
    ) {
      return "";
    }

    const wordLength = this.currentWord.word.mainWord.word.length;
    return Array.from({ length: wordLength }, () => "_").join(" ");
  }

  // 获取例句当前阶段显示内容
  getExampleDisplay(): string {
    if (!this.currentWord || this.currentWord.type !== SoundWordType.EXAMPLE) {
      return "";
    }

    // 确保例句分段已初始化
    if (!this.currentWord.exampleParts) {
      this.processExampleSentence();
    }

    // 获取当前阶段
    const stage = this.currentWord.exampleStage || ExampleStage.PLUS_ONE;
    const parts = this.currentWord.exampleParts || [];

    if (parts.length === 0) {
      return "";
    }

    // 确保阶段索引有效
    const validStage = Math.min(stage, parts.length - 1);
    const target = parts[validStage];

    if (!target || target.length === 0) {
      console.warn(`%c[SoundPrepareWord] 当前阶段 ${stage} 的例句部分为空，尝试使用第一阶段`, 'color: #FF5722; font-weight: bold; font-size: 12px;');
      
      // 如果当前阶段没有内容，尝试使用第一阶段
      if (parts[0] && parts[0].length > 0) {
        console.warn(`%c[SoundPrepareWord] 使用第一阶段例句: "${parts[0].join(" ")}"`, 'color: #FF9800; font-weight: bold; font-size: 12px;');
        return parts[0].join(" ");
      }
      
      // 如果仍然没有内容，返回空字符串
      return "";
    }

    // 返回对应阶段的例句部分
    console.warn(`%c[SoundPrepareWord] 返回例句显示内容: "${target.join(" ")}"`, 'color: #2196F3; font-weight: bold; font-size: 12px;');
    return target.join(" ");
  }

  // 处理例句，将其分段存储
  processExampleSentence(): void {
    if (!this.currentWord) {
      console.warn(`%c[SoundPrepareWord] 处理例句失败: 当前单词不存在`, 'color: #F44336; font-weight: bold; font-size: 14px;');
      return;
    }
    
    // 如果当前不是例句模式，先切换到例句模式
    if (this.currentWord.type !== SoundWordType.EXAMPLE) {
      console.warn(`%c[SoundPrepareWord] 当前不是例句模式，强制切换: ${this.currentWord.type} -> ${SoundWordType.EXAMPLE}`, 'color: #F44336; font-weight: bold; font-size: 14px;');
      this.currentWord.type = SoundWordType.EXAMPLE;
    }

    // 获取例句，如果没有则用单词本身作为例句
    // 从单词的examples数组中获取第一个例句，如果没有则使用单词本身
    const examples = this.currentWord.word.mainWord.examples || [];
    const example =
      examples.length > 0
        ? examples[0].sentence
        : this.currentWord.word.mainWord.word;

    console.warn(`%c[SoundPrepareWord] 处理例句: "${example}"`, 'color: #9C27B0; font-weight: bold; font-size: 12px;');

    const { origin, filter } = convertExampleSentenceToWords(example);

    // 保存分段和初始阶段
    this.currentWord.exampleParts = filter;
    this.currentWord.exampleOrigin = origin;

    // 始终将阶段设置为PLUS_ONE，并记录日志
    const oldStage = this.currentWord.exampleStage;
    this.currentWord.exampleStage = ExampleStage.PLUS_ONE;
    console.warn(`%c[SoundPrepareWord] 例句处理完成，设置初始阶段: ${oldStage} -> ${this.currentWord.exampleStage}`, 'color: #FF9800; font-weight: bold; font-size: 12px;');
    console.warn(`%c[SoundPrepareWord] 例句部分: ${JSON.stringify(filter)}`, 'color: #FF9800; font-weight: bold; font-size: 12px;');
  }

  // 推进例句学习阶段
  advanceExampleStage(): boolean {
    if (!this.currentWord || this.currentWord.type !== SoundWordType.EXAMPLE) {
      console.warn(`%c[SoundPrepareWord] 推进阶段失败: 当前单词不存在或类型不是例句模式`, 'color: #F44336; font-weight: bold; font-size: 14px;');
      return false;
    }

    const currentStage = this.currentWord.exampleStage;
    console.warn(`%c[SoundPrepareWord] 当前阶段: ${currentStage}`, 'color: #FF9800; font-weight: bold; font-size: 14px;');

    if (this.currentWord.exampleStage === undefined) {
      console.warn(`%c[SoundPrepareWord] 阶段未定义，设置为初始阶段`, 'color: #2196F3; font-weight: bold; font-size: 14px;');
      this.currentWord.exampleStage = ExampleStage.PLUS_ONE;
      return true;
    }

    // 如果已经是完整例句，返回false表示已完成
    if (this.currentWord.exampleStage >= ExampleStage.FULL_SENTENCE) {
      console.warn(`%c[SoundPrepareWord] 已达到最终阶段，无法再推进`, 'color: #E91E63; font-weight: bold; font-size: 14px;');
      return false;
    }

    // 记录阶段推进
    if (this.currentWord.exampleStage === ExampleStage.PLUS_ONE) {
      console.warn(`%c[SoundPrepareWord] 从第一阶段推进到第二阶段`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    } else if (this.currentWord.exampleStage === ExampleStage.PERCENT_WORD) {
      console.warn(`%c[SoundPrepareWord] 从第二阶段推进到完整例句`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    }

    // 明确推进到下一阶段
    const newStage = this.currentWord.exampleStage + 1;
    this.currentWord.exampleStage = newStage;
    console.warn(`%c[SoundPrepareWord] 阶段已推进: ${currentStage} -> ${newStage}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    return true;
  }

  // 预加载单词数据
  preload(callback: (progress: number) => void): Promise<boolean> {
    const storage = this.mode.dictionaryStorage;

    return new Promise((resolve) => {
      const maxProgress =
        PRELOAD_WORD_AMO * 5 * this.taskAmount + this.taskAmount;
      let progress = 0;
      const words: ISoundWordItem[] = [];

      // 随机选择未学习的单词
      while (words.length < this.taskAmount) {
        const res = storage.randomUnlearnedWordsWithOptiohns();

        if (
          words.some((item: any) => item.word.mainWord.word === res.mainWord.word)
        ) {
          continue;
        }

        // 初始化为听写模式
        words.push({
          word: res,
          type: SoundWordType.DICTATION,
        });
        progress += 1;
        callback(+(progress / maxProgress).toFixed(2));
      }

      this.wordsQueue = words;

      // 预加载前5个单词的数据
      const promises = words
        .filter((_, ind) => ind + 1 <= PRELOAD_WORD_AMO)
        .map(async (item) => {
          const res = await this.preloadWordData(item.word);

          progress += this.taskAmount * 5;

          callback(+(progress / maxProgress).toFixed(2));

          return res;
        });

      Promise.all(promises).then(() => {
        this.wordIndex = 0;

        this.startTime = Date.now();
        resolve(true);
      });
    });
  }

  /**
   * 处理下一个单词
   * @param success - 表示当前单词是否回答正确
   * @returns Promise<boolean> - 返回一个 Promise，指示是否成功处理下一个单词
   */
  async next(success: boolean): Promise<boolean> {
    // 如果没有剩余单词，返回 false
    if (this.getLeftWords() === 0) {
      return false;
    }

    // 如果当前单词不存在，抛出错误
    if (!this.currentWord) {
      throw new Error("当前单词不存在，无法获取下一个单词");
    }

    const currentWord = this.currentWord;

    console.warn(`%c[SoundPrepareWord] next 被调用: success=${success}, 当前类型=${currentWord.type}`, 'color: #FF5722; font-weight: bold; font-size: 14px;');

    // 将当前单词添加到已显示的单词列表中
    if (currentWord.type === SoundWordType.DICTATION) {
      this.wordsDisplayed = [
        ...new Set([...this.wordsDisplayed, currentWord.word.mainWord.word]),
      ];
    }

    // 如果回答正确
    if (success) {
      // 根据当前模式处理流程
      if (currentWord.type === SoundWordType.DICTATION) {
        // 如果是听写模式，回答正确后进入例句模式
        console.warn(`%c[SoundPrepareWord] 单词答对，转换为例句模式: ${currentWord.word.mainWord.word}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');

        // 重要：这里修改了队列中当前单词的类型，但currentWord引用未更新
        this.wordsQueue[this.wordIndex] = {
          word: currentWord.word,
          type: SoundWordType.EXAMPLE,
          exampleStage: ExampleStage.PLUS_ONE,
        };

        console.warn(`%c[SoundPrepareWord] 队列中已修改类型，但需要刷新currentWord引用`, 'color: #2196F3; font-weight: bold; font-size: 14px;');

        // 初始化例句分段
        this.processExampleSentence();

        // 确保返回true以继续学习流程
        return true;
      }

      // 如果是例句模式，检查是否需要推进到下一个阶段
      if (this.advanceExampleStage()) {
        // 还有更多例句阶段，继续学习
        console.warn(`%c[SoundPrepareWord] 例句阶段推进: ${this.currentWord.exampleStage}`, 'color: #9C27B0; font-weight: bold; font-size: 14px;');
        return true;
      }

      // 如果所有例句阶段都完成了，将单词标记为完成
      console.warn(`%c[SoundPrepareWord] 例句学习完成，单词完成: ${currentWord.word.mainWord.word}`, 'color: #607D8B; font-weight: bold; font-size: 14px;');

      this.wordsFinished.push(currentWord.word);

      // 从队列中移除当前单词
      this.wordsQueue.splice(this.wordIndex, 1);

      // 如果没有更多单词，结束学习
      if (this.wordsQueue.length === 0) {
        return false;
      }

      // 预加载下一个单词
      const nextIndex = this.wordIndex + PRELOAD_WORD_AMO;
      if (nextIndex < this.wordsQueue.length) {
        this.preloadWordData(this.wordsQueue[nextIndex].word);
      }

      return true;
    }

    // 回答错误，保持在当前模式，不进行状态转换
    console.warn(`%c[SoundPrepareWord] 答案错误，保持在当前模式: ${currentWord.type}`, 'color: #F44336; font-weight: bold; font-size: 14px;');

    // 记录错误历史
    const obj = currentWord.word;
    const history = obj.wrongHistory || [];
    history.push(Date.now());
    obj.wrongHistory = history;

    return true;
  }

  // 增加调试方法，用于强制切换当前单词的类型（仅用于调试）
  debugForceSetWordType(type: SoundWordType): void {
    if (!this.currentWord) {
      console.warn(`%c[SoundPrepareWord] 没有当前单词，无法设置类型`, 'color: #F44336; font-weight: bold; font-size: 14px;');
      return;
    }

    console.warn(`%c[SoundPrepareWord] 强制设置单词类型: ${this.currentWord.type} -> ${type}`, 'color: #FF9800; font-weight: bold; font-size: 14px;');

    // 创建新的对象并替换队列中的元素
    this.wordsQueue[this.wordIndex] = {
      ...this.currentWord,
      type: type,
    };

    // 刷新后应该会更新currentWord引用
  }

  // 返回上一个单词
  async previous(): Promise<boolean> {
    if (!this.currentWord)
      throw new Error("Current word not exist, cannot get previous word");

    if (this.wordIndex === 0) {
      return false;
    }

    this.wordIndex--;

    return true;
  }

  // 完成学习
  async finish(): Promise<boolean> {
    if (this.wordsQueue.length) {
      return false;
    }

    this.endTime = Date.now();

    const duration = this.endTime - this.startTime;

    const words = this.wordsFinished.map((i) => i.mainWord.word);

    calendarManager.createTodayData(words, duration, true);

    return true;
  }

  // 获取剩余单词数量
  getLeftWords(): number {
    return this.wordsQueue.length - this.wordIndex;
  }

  // 获取新学单词数量
  getNewlyWords(): number {
    return this.taskAmount - this.wordsDisplayed.length;
  }

  // 获取正在学习单词的模式
  getCurrentWordMode(): SoundWordType | null {
    return this.currentWord ? this.currentWord.type : null;
  }

  // 获取目标组件
  getTargetComponent(): Component {
    return SoundWord;
  }

  // 检查用户输入是否匹配当前单词或例句
  checkUserInput(input: string): boolean {
    if (!this.currentWord) {
      return false;
    }

    console.warn(`%c[SoundPrepareWord] 检查用户输入: "${input}"`, 'color: #E91E63; font-weight: bold; font-size: 12px;');

    if (this.currentWord.type === SoundWordType.DICTATION) {
      // 听写模式：检查是否与单词匹配，忽略大小写
      const expected = this.currentWord.word.mainWord.word.trim().toLowerCase();
      const userInput = input.trim().toLowerCase();
      const result = userInput === expected;
      console.warn(`%c[SoundPrepareWord] 听写模式比较: "${userInput}" vs "${expected}", 结果: ${result}`, 'color: #3F51B5; font-weight: bold; font-size: 12px;');
      return result;
    }

    // 例句模式：改进例句匹配算法
    const exampleDisplay = this.getExampleDisplay();
    
    // 用于记录日志
    console.warn(`%c[SoundPrepareWord] 例句模式当前阶段: ${this.currentWord.exampleStage}`, 'color: #009688; font-weight: bold; font-size: 12px;');
    console.warn(`%c[SoundPrepareWord] 例句显示内容: "${exampleDisplay}"`, 'color: #009688; font-weight: bold; font-size: 12px;');
    console.warn(`%c[SoundPrepareWord] 用户输入内容: "${input}"`, 'color: #009688; font-weight: bold; font-size: 12px;');
    
    // 规范化文本处理函数
    const normalizeText = (text: string): string => {
      return text
        .toLowerCase()  // 转为小写
        .replace(/\s+/g, '') // 移除所有空白字符
        .replace(/[.,!?;:'"–—()[\]{}<>""'']/g, '') // 移除所有标点符号
        .trim();
    };
    
    // 计算Levenshtein距离（字符串编辑距离）用于模糊匹配
    const levenshteinDistance = (a: string, b: string): number => {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      
      const matrix = [];
      
      // 初始化矩阵
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      
      // 填充矩阵
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          const cost = a[j - 1] === b[i - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,      // 删除
            matrix[i][j - 1] + 1,      // 插入
            matrix[i - 1][j - 1] + cost // 替换
          );
        }
      }
      
      return matrix[b.length][a.length];
    };
    
    // 计算相似度
    const calculateSimilarity = (a: string, b: string): number => {
      if (a.length === 0 && b.length === 0) return 1;
      const distance = levenshteinDistance(a, b);
      const maxLength = Math.max(a.length, b.length);
      return 1 - (distance / maxLength);
    };
    
    // 清理处理
    const normalizedExpected = normalizeText(exampleDisplay);
    const normalizedInput = normalizeText(input);
    
    // 记录清理后的内容
    console.warn(`%c[SoundPrepareWord] 清理后期望: "${normalizedExpected}"`, 'color: #00BCD4; font-weight: bold; font-size: 12px;');
    console.warn(`%c[SoundPrepareWord] 清理后输入: "${normalizedInput}"`, 'color: #00BCD4; font-weight: bold; font-size: 12px;');
    
    // 相似度判断逻辑
    let result = false;
    
    // 1. 精确匹配
    if (normalizedInput === normalizedExpected) {
      console.warn(`%c[SoundPrepareWord] 精确匹配成功!`, 'color: #4CAF50; font-weight: bold; font-size: 12px;');
      result = true;
    } 
    // 2. 模糊匹配：计算相似度，达到一定阈值则通过
    else {
      const similarity = calculateSimilarity(normalizedInput, normalizedExpected);
      console.warn(`%c[SoundPrepareWord] 相似度计算结果: ${(similarity * 100).toFixed(2)}%`, 'color: #FF9800; font-weight: bold; font-size: 12px;');
      
      // 设置不同的阈值，根据例句长度
      let similarityThreshold = 0.85; // 默认阈值85%
      
      // 对于较短的例句，使用更高的匹配阈值
      if (normalizedExpected.length < 10) {
        similarityThreshold = 0.9; // 90%阈值
      } 
      // 对于中等长度的例句
      else if (normalizedExpected.length < 20) {
        similarityThreshold = 0.85; // 85%阈值
      }
      // 对于较长的例句，使用稍低的阈值
      else {
        similarityThreshold = 0.8; // 80%阈值
      }
      
      // 短例句的特殊处理：额外检查包含关系
      if (normalizedExpected.length < 10 && normalizedInput.length < 15) {
        if (normalizedInput.includes(normalizedExpected) || normalizedExpected.includes(normalizedInput)) {
          const lengthRatio = Math.min(normalizedInput.length, normalizedExpected.length) / 
                              Math.max(normalizedInput.length, normalizedExpected.length);
          
          if (lengthRatio > 0.7) {
            console.warn(`%c[SoundPrepareWord] 短例句包含关系匹配，长度比: ${(lengthRatio * 100).toFixed(2)}%`, 'color: #4CAF50; font-weight: bold; font-size: 12px;');
            result = true;
          }
        }
      }
      
      // 应用相似度阈值
      if (similarity >= similarityThreshold) {
        console.warn(`%c[SoundPrepareWord] 模糊匹配成功，相似度: ${(similarity * 100).toFixed(2)}% (阈值: ${(similarityThreshold * 100)}%)`, 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        result = true;
      }
    }
    
    console.warn(`%c[SoundPrepareWord] 例句模式比较最终结果: ${result}`, 'color: #FF9800; font-weight: bold; font-size: 14px;');
    return result;
  }

  // 新增方法：获取原始大小写的单词或例句
  getOriginalCase(): string {
    if (!this.currentWord) {
      return '';
    }

    if (this.currentWord.type === SoundWordType.DICTATION) {
      return this.currentWord.word.mainWord.word.trim();
    }

    // 例句模式返回当前阶段的例句
    return this.getExampleDisplay();
  }
}

export class SoundMode extends SignMode {
  getMainColor(): string {
    return "#44A994";
  }

  getModeIcon(): string {
    return "😎";
  }

  getModeDesc() {
    return "先听写单词，再分阶段学习例句";
  }

  getModeName() {
    return "音析模式";
  }

  prepareWords() {
    return new SoundPrepareWord(this);
  }

  getEstimateCost(amount: number): number {
    return Math.max(Math.ceil(amount / 7), 1);
  }
}

// 添加日志工具函数
export function useLogger(module: string) {
  return {
    log: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #2196F3; font-size: 12px;', data || '');
    },
    error: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #F44336; font-size: 12px;', data || '');
    },
    success: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #4CAF50; font-size: 12px;', data || '');
    },
    info: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #9C27B0; font-size: 12px;', data || '');
    },
    warn: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #FF9800; font-size: 12px;', data || '');
    }
  };
}

// 音频播放hook
export function useSoundPlayer() {
  const logger = useLogger('SoundPlayer');
  const isPlayingAudio = ref(false);
  const audioFinished = ref(true);
  
  // 添加这些变量
  let lastAudio: HTMLAudioElement | null = null;
  let audioThrottleTimer: number | null = null;
  let pendingAudioSource: string | null = null;
  
  // 音频播放核心函数
  async function playAudioCore(audioSource: string, 
    onStart: () => void,
    onFinish: () => void,
    onError: () => void
  ) {
    // 停止之前的音频
    if (lastAudio) {
      try {
        lastAudio.pause();
        lastAudio.currentTime = 0;
        lastAudio.onended = null;
        lastAudio.onerror = null;
        lastAudio.onabort = null;
        lastAudio.oncanplay = null;
        lastAudio.onplaying = null;
      } catch (e) {
        logger.error('停止之前的音频出错', e);
      }
      lastAudio = null;
    }

    // 重置音频状态
    isPlayingAudio.value = true;
    audioFinished.value = false;
    onStart();

    try {
      // 获取音频
      logger.info(`开始加载音频: ${audioSource}`);
      lastAudio = await useWordSound(audioSource).catch(error => {
        logger.error(`获取音频失败: ${audioSource}`, error);
        throw error; // 重新抛出以便外部捕获
      });
      
      if (!lastAudio) {
        logger.error(`无法获取音频: ${audioSource}`);
        throw new Error('无法获取音频');
      }
      
      logger.info(`音频加载成功，准备播放: ${audioSource}`);
      
      // 播放完成处理
      lastAudio.onended = () => {
        logger.info(`音频播放完成: ${audioSource}`);
        if (lastAudio) {
          isPlayingAudio.value = false;
          
          // 延迟设置状态
          setTimeout(() => {
            audioFinished.value = true;
            onFinish();
          }, 300);
        }
      };
      
      // 错误处理
      lastAudio.onerror = (e) => {
        logger.error(`音频播放错误: ${audioSource}`, e);
        isPlayingAudio.value = false;
        audioFinished.value = true;
        onError();
      };
      
      // 播放
      try {
        logger.info(`尝试播放音频: ${audioSource}`);
        const playPromise = lastAudio.play();
        
        if (playPromise !== undefined) {
          await playPromise.catch((error) => {
            logger.error(`音频播放失败: ${audioSource}`, error);
            isPlayingAudio.value = false;
            audioFinished.value = true;
            onError();
            throw error;
          });
          logger.info(`音频开始播放: ${audioSource}`);
        } else {
          logger.warn(`播放方法未返回Promise: ${audioSource}`);
        }
      } catch (playError) {
        logger.error(`音频播放异常: ${audioSource}`, playError);
        isPlayingAudio.value = false;
        audioFinished.value = true;
        onError();
        throw playError;
      }
      
      return true;
    } catch (error) {
      logger.error(`音频处理异常: ${audioSource}`, error);
      isPlayingAudio.value = false;
      audioFinished.value = true;
      onError();
      return false;
    }
  }

  // 节流播放函数
  function playAudio(
    audioSource: string, 
    onStart: () => void,
    onFinish: () => void,
    onError: () => void
  ) {
    // 更新待执行的音频源
    pendingAudioSource = audioSource;
    
    // 如果已经有计时器在运行，则不再设置新计时器
    if (audioThrottleTimer !== null) {
      return;
    }
    
    // 设置节流计时器
    audioThrottleTimer = window.setTimeout(() => {
      // 计时器到期，执行最后一次待执行的音频播放
      if (pendingAudioSource) {
        playAudioCore(pendingAudioSource, onStart, onFinish, onError);
        pendingAudioSource = null;
      }
      // 清除计时器引用
      audioThrottleTimer = null;
    }, 300);
  }

  return {
    isPlayingAudio,
    audioFinished,
    playAudio
  };
}

// 状态管理hook
export function useWordStateManager() {
  const logger = useLogger('WordStateManager');
  const wordState = ref<WordState>(WordState.INIT);
  
  function setWordState(newState: WordState) {
    if (wordState.value === undefined) {
      logger.error(`尝试从undefined设置状态为${newState}`);
    }
    
    const oldState = wordState.value;
    wordState.value = newState;
    
    logger.log(`状态变化: ${oldState} -> ${newState}`);
  }
  
  return {
    wordState,
    setWordState
  };
}

// 输入检查hook
export function useInputChecker(prepareData: SoundPrepareWord) {
  const logger = useLogger('InputChecker');
  
  function checkExampleInput(userInput: string, exampleDisplay: string): boolean {
    // 如果任一输入为空，直接返回false
    if (!userInput.trim() || !exampleDisplay.trim()) {
      logger.error('输入或期望例句为空');
      return false;
    }
    
    // 增强的清理函数，更好地处理各种标点和空格
    const cleanText = (text: string): string => {
      return text
        .toLowerCase()               // 转小写
        .replace(/\s+/g, '')         // 移除所有空白字符
        .replace(/[.,!?;:'"–—()[\]{}<>""'']/g, '') // 移除所有标点符号
        .trim();                     // 去除首尾空格
    };
    
    // 清理用户输入和期望文本
    const cleanUserInput = cleanText(userInput);
    const cleanExpectedText = cleanText(exampleDisplay);
    
    // 记录日志以便调试
    logger.log(`原始用户输入: "${userInput}"`);
    logger.log(`原始期望文本: "${exampleDisplay}"`);
    logger.log(`清理后用户输入: "${cleanUserInput}"`);
    logger.log(`清理后期望文本: "${cleanExpectedText}"`);
    logger.log(`对比结果: ${cleanUserInput === cleanExpectedText ? '匹配' : '不匹配'}`);
    
    // 添加模糊匹配逻辑：如果用户输入包含期望文本的90%以上的字符
    if (cleanUserInput.length > 0 && cleanExpectedText.length > 0) {
      // 当两个文本接近但不完全相同时，计算相似度
      if (cleanUserInput !== cleanExpectedText && 
          (cleanUserInput.includes(cleanExpectedText) || 
           cleanExpectedText.includes(cleanUserInput))) {
        
        // 计算Levenshtein距离（编辑距离）
        const maxLength = Math.max(cleanUserInput.length, cleanExpectedText.length);
        const similarityThreshold = 0.9; // 90%相似度阈值
        
        // 如果较长文本包含较短文本，且长度差距不超过总长度的10%，认为是匹配的
        const lengthDiff = Math.abs(cleanUserInput.length - cleanExpectedText.length);
        const similarityRatio = 1 - (lengthDiff / maxLength);
        
        if (similarityRatio >= similarityThreshold) {
          logger.log(`模糊匹配成功，相似度: ${similarityRatio}`);
          return true;
        }
      }
    }
    
    // 精确匹配
    return cleanUserInput === cleanExpectedText;
  }
  
  function checkDictationInput(userInput: string): boolean {
    return prepareData.checkUserInput(userInput);
  }
  
  return {
    checkExampleInput,
    checkDictationInput
  };
}

// 例句队列管理hook
export function useExampleQueueManager() {
  const logger = useLogger('ExampleQueueManager');
  const exampleQueue = ref<ISoundWordItem[]>([]);
  
  function addExampleToQueue(wordItem: IWordItem, stage: ExampleStage = ExampleStage.PLUS_ONE) {
    const exampleWord: ISoundWordItem = {
      type: SoundWordType.EXAMPLE,
      word: wordItem,
      exampleStage: stage,
    };
    exampleQueue.value.push(exampleWord);
    logger.log(`添加例句到队列，当前队列长度: ${exampleQueue.value.length}`);
  }
  
  function getNextExample(): ISoundWordItem | null {
    if (exampleQueue.value.length === 0) {
      return null;
    }
    return exampleQueue.value.shift() || null;
  }
  
  function hasExamples(): boolean {
    return exampleQueue.value.length > 0;
  }
  
  function getQueueLength(): number {
    return exampleQueue.value.length;
  }
  
  return {
    exampleQueue,
    addExampleToQueue,
    getNextExample,
    hasExamples,
    getQueueLength
  };
}
