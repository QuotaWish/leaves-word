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
  const words = sentence.split(/\s+/);

  // 首先获得单词本身 index
  const wordIndex = Math.floor(Math.random() * words.length);
  const targetContent = words[wordIndex];
  const sentenceOne: string[] = [];
  const sentenceTwo: string[] = [];
  const percentLen = Math.floor(targetContent.length * 0.7);

  sentenceOne.push(targetContent);

  // 判断 index 越界 + 获取单词本身
  if (wordIndex === 0) {
    sentenceOne.push(words[wordIndex + 1]);

    // 将 0 - percentLen 的单词加入到 sentenceTwo
    sentenceTwo.push(...words.slice(0, percentLen));
  } else if (wordIndex >= words.length) {
    sentenceOne.unshift(words[wordIndex - 1]);

    // 将 percentLen - words.length 的单词加入到 sentenceTwo
    sentenceTwo.push(...words.slice(percentLen));
  } else {
    Math.random() > 0.5
      ? sentenceOne.unshift(words[wordIndex - 1])
      : sentenceOne.push(words[wordIndex + 1]);

    if (Math.random() > 0.5) {
      // 将 percentLen - words.length 的单词加入到 sentenceTwo
      sentenceTwo.push(...words.slice(percentLen));
    } else {
      // 将 0 - percentLen 的单词加入到 sentenceTwo
      sentenceTwo.push(...words.slice(0, percentLen));
    }
  }

  return [sentenceOne, sentenceTwo, words];
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

    const stage = this.currentWord.exampleStage || ExampleStage.PLUS_ONE;
    const parts = this.currentWord.exampleParts || [];

    if (parts.length === 0) {
      return "";
    }

    const target = parts[stage];

    // 返回对应阶段的例句部分
    console.warn(`%c[SoundPrepareWord] 返回例句显示内容: "${target.join(" ")}"`, 'color: #2196F3; font-weight: bold; font-size: 12px;');
    return target.join(" ");
  }

  // 处理例句，将其分段存储
  processExampleSentence(): void {
    if (!this.currentWord || this.currentWord.type !== SoundWordType.EXAMPLE) {
      console.warn(`%c[SoundPrepareWord] 处理例句失败: 当前单词不存在或类型不是例句模式`, 'color: #F44336; font-weight: bold; font-size: 14px;');
      return;
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

    // 例句模式：检查是否与当前阶段例句匹配
    // 进行清理比较，忽略大小写、标点符号和多余空格
    const expected = this.getExampleDisplay().toLowerCase().replace(/[.,!?;:'"–—()[\]{}\s]/g, '');
    const cleaned = input.trim().toLowerCase().replace(/[.,!?;:'"–—()[\]{}\s]/g, '');

    const result = cleaned === expected;
    console.warn(`%c[SoundPrepareWord] 例句模式比较: "${cleaned}" vs "${expected}", 结果: ${result}`, 'color: #00BCD4; font-weight: bold; font-size: 12px;');
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
    // 例句模式：只比较字母和数字部分，忽略所有标点和空格
    const cleanUserInput = userInput
      .replace(/[.,!?;:'"–—()[\]{} ]/g, "")
      .toLowerCase()
      .trim();
    const cleanExpectedText = exampleDisplay
      .replace(/[.,!?;:'"–—()[\]{} ]/g, "")
      .toLowerCase()
      .trim();
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
