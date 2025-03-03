<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { GlobalInputMethodAPI } from '../../modules/globalInputMethod'

const inputMethod = inject<GlobalInputMethodAPI>('globalInputMethod')
const textInput = ref('')
const passwordInput = ref('')
const textareaInput = ref('')

const showKeyboard = () => {
  if (inputMethod) {
    inputMethod.show()
  }
}

// 这个示例展示了如何通过API打开键盘
const showKeyboardForSelector = (selector: string) => {
  if (inputMethod) {
    inputMethod.show(selector)
  }
}

onMounted(() => {
  // 页面加载时可以做一些初始化工作
  console.log('输入法演示组件已加载')
})
</script>

<template>
  <div class="input-method-demo">
    <h2>全局输入法演示</h2>
    
    <div class="input-group">
      <label for="text-input">文本输入</label>
      <input 
        id="text-input"
        v-model="textInput"
        type="text"
        placeholder="点击此处输入文本"
      />
    </div>
    
    <div class="input-group">
      <label for="password-input">密码输入</label>
      <input 
        id="password-input"
        v-model="passwordInput"
        type="password"
        placeholder="点击此处输入密码"
      />
    </div>
    
    <div class="input-group">
      <label for="textarea-input">多行文本</label>
      <textarea 
        id="textarea-input"
        v-model="textareaInput"
        placeholder="点击此处输入多行文本"
        rows="4"
      ></textarea>
    </div>
    
    <div class="buttons">
      <button @click="showKeyboard" class="action-button">
        手动显示键盘
      </button>
      <button @click="showKeyboardForSelector('#text-input')" class="action-button">
        打开文本输入的键盘
      </button>
      <button @click="showKeyboardForSelector('#textarea-input')" class="action-button">
        打开多行文本的键盘
      </button>
      <button @click="inputMethod?.hide()" class="action-button">
        隐藏键盘
      </button>
    </div>
    
    <div class="instructions">
      <h3>使用说明：</h3>
      <ol>
        <li>点击任意输入框会自动调出输入法</li>
        <li>也可以通过按钮手动控制输入法的显示/隐藏</li>
        <li>输入法可以与所有普通输入框和文本区域配合使用</li>
        <li>点击输入法上的关闭按钮或回车键可以隐藏输入法</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.input-method-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  border-color: #409eff;
  outline: none;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.action-button {
  padding: 10px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #66b1ff;
}

.instructions {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.instructions h3 {
  margin-top: 0;
  color: #333;
}

.instructions ol {
  margin: 0;
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
  color: #555;
}

@media (max-width: 600px) {
  .input-method-demo {
    padding: 15px;
  }
  
  .action-button {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style> 