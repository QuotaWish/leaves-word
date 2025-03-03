import { ref, computed } from 'vue';
import { useSuccessAudio, useErrorAudio, type IWordItem } from '..';
import { 
  useLogger, 
  useSoundPlayer, 
  useWordStateManager, 
  useInputChecker, 
  useExampleQueueManager,
  SoundPrepareWord, 
  WordState,
  SoundWordType,
  ExampleStage,
  ISoundWordItem
} from './sound';

export function useSoundWordManager(
  prepareData: SoundPrepareWord, 
  emits: { (e: 'quit'): void; (e: 'done'): void }
) {
  const logger = useLogger('SoundWordManager');
  const { wordState, setWordState } = useWordStateManager();
  const { 
    audioFinished, 
    isPlayingAudio, 
    playAudio: playAudioBase 
  } = useSoundPlayer();
  
  const { 
    exampleQueue, 
    addExampleToQueue, 
    getNextExample, 
    hasExamples 
  } = useExampleQueueManager();
  
  const inputChecker = useInputChecker(prepareData);
  
  const userInput = ref('');
  const errorCount = ref(0);
  const showHint = ref(false);
  const showInputContainer = ref(false);
  const currentWord = ref<ISoundWordItem | null>(null);
  
  // 音频位置计算
  const audioPosition = computed(() => 
    wordState.value === WordState.PLAYING || !audioFinished.value 
      ? 'center' 
      : 'top'
  );
  
  // 当前提示文本计算
  const currentHintText = computed(() => {
    if (!currentWord.value) return '';
    
    if (currentWord.value.type === SoundWordType.DICTATION) {
      return '请输入您听到的单词';
    }
    
    const stage = currentWord.value.exampleStage || 0;
    return stage === ExampleStage.FULL_SENTENCE
      ? '请输入完整的例句'
      : '请输入您看到的例句部分';
  });
  
  // 任务总数计算
  const taskAmount = computed(() => {
    const baseAmount =
      prepareData.taskAmount || 
      prepareData.getNewlyWords() + prepareData.getLeftWords();
    return baseAmount + exampleQueue.value.length;
  });
  
  // 播放单词音频
  function playWord() {
    if (!currentWord.value) {
      logger.error('没有可播放的单词');
      return;
    }
    
    try {
      const word = currentWord.value.word.mainWord;
      if (!word) {
        logger.error('单词数据不完整');
        setWordState(WordState.WAITING);
        return;
      }
      
      let audioSource = '';
      
      // 根据不同模式选择音频源
      if (currentWord.value.type === SoundWordType.EXAMPLE) {
        // 例句模式
        const exampleDisplay = prepareData.getExampleDisplay();
        if (exampleDisplay && exampleDisplay.trim()) {
          audioSource = exampleDisplay;
        } else {
          const examples = word.examples || [];
          if (examples.length > 0 && examples[0].sentence) {
            audioSource = examples[0].sentence;
          } else {
            audioSource = word.word;
            logger.warn('没有可用的例句，使用单词本身');
          }
        }
      } else {
        // 听写模式
        audioSource = word.word;
      }
      
      // 清理一下音频源，移除多余空白字符
      audioSource = audioSource.trim();
      
      if (!audioSource) {
        logger.error('音频源为空');
        setWordState(WordState.WAITING);
        showInputContainer.value = true;
        return;
      }
      
      logger.info(`正在播放音频: ${audioSource}`);
      
      // 设置状态为正在播放
      setWordState(WordState.PLAYING);
      showInputContainer.value = false;
      
      // 使用基础播放函数
      playAudioBase(
        audioSource,
        () => {
          // 音频开始播放时的回调
          logger.info('音频开始播放');
        },
        () => {
          // 音频播放完成时的回调
          logger.info('音频播放完成');
          setWordState(WordState.WAITING);
          showInputContainer.value = true;
        },
        () => {
          // 音频播放失败时的回调
          logger.error('音频播放失败，设置为等待状态');
          setWordState(WordState.WAITING);
          showInputContainer.value = true;
          
          // 尝试显示提示作为备选方案
          if (!showHint.value) {
            showHint.value = true;
            logger.info('由于音频播放失败，自动显示提示');
          }
        }
      );
    } catch (error) {
      logger.error('播放单词音频时出错', error);
      setWordState(WordState.WAITING);
      showInputContainer.value = true;
      
      // 错误处理时也尝试显示提示
      if (!showHint.value) {
        showHint.value = true;
        logger.info('由于音频播放错误，自动显示提示');
      }
    }
  }
  
  // 初始化
  async function refreshData() {
    try {
      // 优先从例句队列中获取
      if (hasExamples()) {
        currentWord.value = getNextExample();
      } else {
        currentWord.value = prepareData.currentWord;
        // 检查是否需要添加例句到队列
        if (currentWord.value?.type === SoundWordType.DICTATION) {
          const examples = currentWord.value.word.mainWord?.examples || [];
          if (examples.length > 0) {
            try {
              addExampleToQueue(currentWord.value.word);
              logger.info('已添加例句到队列');
            } catch (exampleError) {
              logger.error('添加例句到队列失败', exampleError);
              // 继续处理，不影响主流程
            }
          }
        }
      }
      
      // 如果单词加载成功，重置状态
      if (currentWord.value) {
        // 重置状态
        userInput.value = '';
        errorCount.value = 0;
        showHint.value = false;
        setWordState(WordState.INIT);
        
        // 自动播放音频
        setTimeout(() => {
          playWord();
        }, 300);
      } else {
        logger.error('无法加载单词数据');
      }
    } catch (error) {
      logger.error('刷新数据时出错', error);
      // 设置基本状态，防止界面崩溃
      setWordState(WordState.WAITING);
    }
  }
  
  // 处理下一个词
  async function nextData(success: boolean) {
    if (wordState.value === WordState.TRANSITIONING) {
      return;
    }
    
    // 保存当前状态
    const prevWordType = currentWord.value?.type;
    const prevStage = currentWord.value?.exampleStage;
    let targetWordType = prevWordType;
    let targetStage = prevStage;
    
    logger.log(`状态转换开始 - 类型:${prevWordType}, 阶段:${prevStage}, 成功:${success}`);
    
    // 过渡动画
    setWordState(WordState.FADE_OUT);
    audioFinished.value = true;
    await sleep(600);
    
    // 根据当前模式和状态决定下一步
    if (prevWordType === SoundWordType.DICTATION && success) {
      logger.log('单词回答正确，准备切换到例句模式');
      
      // 确保队列中有例句
      if (!hasExamples() && currentWord.value) {
        const examples = currentWord.value.word.mainWord?.examples || [];
        if (examples.length > 0) {
          addExampleToQueue(currentWord.value.word);
          
          targetWordType = SoundWordType.EXAMPLE;
          targetStage = ExampleStage.PLUS_ONE;
          
          prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
          prepareData.processExampleSentence();
        } else {
          logger.log('该单词没有例句，继续下一个单词');
        }
      } else if (hasExamples()) {
        logger.log(`例句队列已有内容: ${exampleQueue.value.length}个`);
        targetWordType = SoundWordType.EXAMPLE;
        targetStage = ExampleStage.PLUS_ONE;
      }
    } else if (prevWordType === SoundWordType.EXAMPLE && success) {
      logger.log('例句回答正确，尝试进阶到下一个阶段');
      targetWordType = SoundWordType.EXAMPLE;
    } else if (!success) {
      logger.log('回答错误，状态不变');
    }
    
    logger.log(`预期状态 - 类型:${targetWordType}, 阶段:${targetStage}`);
    
    // 处理特殊情况：预期是例句模式且当前例句队列有内容
    if (targetWordType === SoundWordType.EXAMPLE && hasExamples()) {
      logger.log('从例句队列获取例句');
      refreshData();
      setWordState(WordState.FADE_IN);
      
      setTimeout(() => {
        setWordState(WordState.WAITING);
        
        // 检查实际状态是否符合预期
        setTimeout(() => {
          const actualType = currentWord.value?.type;
          const actualStage = currentWord.value?.exampleStage;
          
          logger.log(`实际状态 - 类型:${actualType}, 阶段:${actualStage}`);
          
          // 修复状态不匹配问题
          if (actualType !== targetWordType || 
             (targetStage !== undefined && actualStage !== targetStage)) {
            logger.error('状态不符合预期，尝试修复');
            
            if (targetWordType === SoundWordType.EXAMPLE) {
              prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
              prepareData.processExampleSentence();
              refreshData();
            }
          }
        }, 100);
      }, 600);
      
      return;
    }
    
    // 调用 prepareData.next 进行常规处理
    logger.log(`调用 prepareData.next: ${success}`);
    const result = await prepareData.next(success);
    
    if (!result) {
      logger.log('没有更多内容，结束学习');
      
      if (hasExamples()) {
        logger.log('但例句队列中还有内容，继续处理');
        refreshData();
        setWordState(WordState.FADE_IN);
        setTimeout(() => { setWordState(WordState.WAITING); }, 600);
        return;
      }
      
      // 结束
      await prepareData.finish();
      emits('done');
      return;
    }
    
    // 刷新数据
    refreshData();
    setWordState(WordState.FADE_IN);
    
    setTimeout(() => {
      setWordState(WordState.WAITING);
      
      // 检查刷新后状态
      setTimeout(() => {
        const actualType = currentWord.value?.type;
        const actualStage = currentWord.value?.exampleStage;
        
        logger.log(`刷新后状态 - 类型:${actualType}, 阶段:${actualStage}`);
        
        // 修复类型不匹配
        if (targetWordType === SoundWordType.EXAMPLE && actualType !== SoundWordType.EXAMPLE) {
          logger.error('类型不符合预期，尝试修复为例句模式');
          prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
          prepareData.processExampleSentence();
          refreshData();
        }
        // 修复阶段不匹配
        else if (targetWordType === SoundWordType.EXAMPLE && 
                actualType === SoundWordType.EXAMPLE && 
                targetStage !== undefined && 
                actualStage !== targetStage) {
          logger.error('例句阶段不符合预期，尝试修复');
          prepareData.processExampleSentence();
          refreshData();
        }
      }, 100);
    }, 600);
  }
  
  // 检查用户输入
  function checkInput() {
    if (!currentWord.value || wordState.value !== WordState.WAITING) {
      return;
    }
    
    let isCorrect;
    
    if (currentWord.value.type === SoundWordType.EXAMPLE) {
      // 例句模式
      isCorrect = inputChecker.checkExampleInput(
        userInput.value, 
        prepareData.getExampleDisplay()
      );
    } else {
      // 听写模式
      isCorrect = inputChecker.checkDictationInput(userInput.value);
    }
    
    if (isCorrect) {
      // 正确
      setWordState(WordState.CORRECT);
      errorCount.value = 0;
      showHint.value = false;
      
      // 播放成功音效
      useSuccessAudio().play();
      
      // 如果是听写模式，提前准备例句队列
      if (currentWord.value.type === SoundWordType.DICTATION && currentWord.value) {
        logger.log('单词回答正确，提前准备例句队列');
        
        const examples = currentWord.value.word.mainWord?.examples || [];
        if (examples.length > 0 && !hasExamples()) {
          addExampleToQueue(currentWord.value.word);
          logger.log('提前添加例句到队列完成');
        }
      }
      
      // 延迟进入下一个
      setTimeout(() => {
        nextData(true);
      }, 800);
    } else {
      // 错误
      setWordState(WordState.ERROR);
      errorCount.value++;
      
      useErrorAudio().play();
      
      // 连续错误2次显示提示
      if (errorCount.value >= 2) {
        showHint.value = true;
      }
      
      // 重置输入
      setTimeout(() => {
        userInput.value = '';
        setWordState(WordState.WAITING);
      }, 1000);
      
      // 重新播放音频
      if (currentWord.value.type === SoundWordType.DICTATION) {
        setTimeout(() => {
          playWord();
        }, 1200);
      }
    }
  }
  
  return {
    wordState,
    userInput,
    errorCount,
    showHint,
    showInputContainer,
    audioFinished,
    audioPosition,
    currentWord,
    currentHintText,
    taskAmount,
    exampleQueue: exampleQueue.value,
    playWord,
    refreshData,
    nextData,
    checkInput
  };
}

// 工具函数：sleep
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 