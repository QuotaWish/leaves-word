import { ref, computed } from 'vue';
import { useSuccessAudio, useErrorAudio, type IWordItem } from '../../../modules/words/core/word';
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
  const audioPosition = computed(() => {
    // 在播放状态下，圆点应该在中间
    if (wordState.value === WordState.PLAYING) {
      return 'center';
    }
    
    // 在音频未完成加载时，也保持圆点在中间
    if (!audioFinished.value) {
      return 'center';
    }
    
    // 在任何其他状态下，包括错误状态，圆点应该在顶部
    return 'top';
  });
  
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
  function playWord(changeState: boolean = true) {
    if (!currentWord.value) {
      logger.error('没有可播放的单词');
      return;
    }
    
    try {
      const word = currentWord.value.word.mainWord;
      if (!word) {
        logger.error('单词数据不完整');
        if (changeState) setWordState(WordState.WAITING);
        showInputContainer.value = true;
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
        if (changeState) setWordState(WordState.WAITING);
        showInputContainer.value = true;
        return;
      }
      
      logger.info(`正在播放音频: ${audioSource}`);
      
      // 记录当前状态，如果是错误状态且不需要改变状态，则保持错误状态的UI效果
      const currentStateIsError = wordState.value === WordState.ERROR && !changeState;
      
      // 设置状态为正在播放，但只在需要改变状态时
      if (changeState) setWordState(WordState.PLAYING);
      
      // 仅在非错误状态或需要改变状态时隐藏输入框
      if (!currentStateIsError) {
        showInputContainer.value = false;
      }
      
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
          
          // 先设置状态为等待，但只在需要改变状态时
          if (changeState) setWordState(WordState.WAITING);
          
          // 如果是错误状态下重播音频，不需要添加额外动画延迟
          if (currentStateIsError) {
            // 直接显示输入框
            showInputContainer.value = true;
          } else {
            // 延迟显示输入框，等待音频元素动画过渡回顶部位置
            setTimeout(() => {
              // 确保音频元素完成动画过渡后再显示输入框
              logger.info('动画过渡完成，显示输入框');
              showInputContainer.value = true;
            }, 600);
          }
        },
        () => {
          // 音频播放失败时的回调
          logger.error('音频播放失败，设置为等待状态');
          if (changeState) setWordState(WordState.WAITING);
          
          // 如果是错误状态下重播音频，不需要添加额外动画延迟
          if (currentStateIsError) {
            // 直接显示输入框
            showInputContainer.value = true;
            
            // 尝试显示提示作为备选方案
            if (!showHint.value) {
              showHint.value = true;
              logger.info('由于音频播放失败，自动显示提示');
            }
          } else {
            // 同样延迟显示输入框
            setTimeout(() => {
              showInputContainer.value = true;
              
              // 尝试显示提示作为备选方案
              if (!showHint.value) {
                showHint.value = true;
                logger.info('由于音频播放失败，自动显示提示');
              }
            }, 600);
          }
        }
      );
    } catch (error) {
      logger.error('播放单词音频时出错', error);
      if (changeState) setWordState(WordState.WAITING);
      
      // 错误处理也使用延迟显示
      setTimeout(() => {
        showInputContainer.value = true;
        
        // 错误处理时也尝试显示提示
        if (!showHint.value) {
          showHint.value = true;
          logger.info('由于音频播放错误，自动显示提示');
        }
      }, 600);
    }
  }
  
  // 完全重写刷新数据函数
  function refreshData() {
    // 清空当前用户输入
    userInput.value = '';
    
    // 检查当前处理模式
    const currentMode = prepareData.getCurrentWordMode();
    logger.log(`刷新数据开始，当前模式: ${currentMode}`);
    
    // 处理例句队列
    if (hasExamples() && (currentMode === SoundWordType.EXAMPLE || currentMode === null)) {
      // 从例句队列获取例句
      logger.log('从例句队列获取例句');
      currentWord.value = getNextExample();
      
      // 确保例句处理正确设置
      if (currentWord.value) {
        if (!currentWord.value.exampleParts) {
          logger.log('例句未初始化，处理例句');
          prepareData.processExampleSentence();
        }
        
        // 确保从PLUS_ONE阶段开始
        if (currentWord.value.exampleStage !== ExampleStage.PLUS_ONE) {
          logger.log(`修正例句阶段: ${currentWord.value.exampleStage} -> ${ExampleStage.PLUS_ONE}`);
          currentWord.value.exampleStage = ExampleStage.PLUS_ONE;
        }
      }
    } else {
      // 获取prepareData中的当前单词
      logger.log('获取当前单词');
      currentWord.value = prepareData.currentWord;
    }
    
    // 确保showInputContainer始终设置为true
    showInputContainer.value = true;
    
    // 记录单词状态
    if (currentWord.value) {
      const type = currentWord.value.type;
      const stage = currentWord.value.exampleStage;
      logger.log(`当前单词信息: 类型=${type}, 阶段=${stage}`);
      
      // 播放音频
      setTimeout(() => {
        playWord(true);
      }, 300);
    } else {
      logger.error('没有有效的单词数据');
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
          
          // 显式设置当前单词类型为例句模式
          prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
          // 确保处理例句分段
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
      
      // 确保重置输入状态
      userInput.value = '';
      
      setWordState(WordState.FADE_IN);
      
      setTimeout(() => {
        // 确保设置为等待状态，这会触发InputBox显示
        setWordState(WordState.WAITING);
        // 明确设置显示输入容器
        showInputContainer.value = true;
        
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
              // 再次确保显示输入容器
              showInputContainer.value = true;
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
        setTimeout(() => { 
          setWordState(WordState.WAITING); 
          // 确保显示输入容器
          showInputContainer.value = true;
        }, 600);
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
    
    // 在状态转换完成后，确保设置正确的状态
    setTimeout(() => {
      setWordState(WordState.WAITING);
      // 确保显示输入容器
      showInputContainer.value = true;
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
      
      // 重置输入，但保持错误状态一段时间
      setTimeout(() => {
        userInput.value = '';
        setWordState(WordState.WAITING);
      }, 1000);
      
      // 重新播放音频
      if (currentWord.value.type === SoundWordType.DICTATION) {
        setTimeout(() => {
          // 播放音频但不改变状态，避免触发圆点动画
          // 确保传递false参数，这样不会改变当前状态
          playWord(false);
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