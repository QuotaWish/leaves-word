<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

import type { ComponentSize, FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus'

import type { IWord } from '~/composables/words'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<IWord>({
  word: 'Hello',
  img: [],
  content: '',
  translation: '',
  examples: [],
  synonyms: [],
  antonyms: [],
  definition: '',
  type: [],
  story: '',
  phonetic: {
    aloud: '',
    sound: '',
  },
})

const rules = reactive<FormRules<IWord>>({
  word: [
    { required: true, message: '请输入单词', trigger: 'blur' },
  ],

})

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    }
    else {
      console.log('error submit!', fields)
    }
  })
}

function resetForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return

  formEl.resetFields()
}

const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
])

watch(fileList, () => {
  ruleForm.img = fileList.value.map(file => file.url!)
})

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`,
  )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`,
  ).then(
    () => true,
    () => false,
  )
}
</script>

<template>
  <div class="Editor">
    <h1 my-6 text-2xl font-bold>
      添加单词
    </h1>
    <el-form
      ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto"
      class="demo-ruleForm" status-icon
    >
      <el-form-item label="单词" prop="name">
        <el-input v-model="ruleForm.word" />
      </el-form-item>
      <!-- <el-form-item label="图片" prop="name"> -->
      <!-- 1 -->
      <!-- <el-upload
          v-model:file-list="fileList" class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple :before-remove="beforeRemove"
          :limit="3" :on-exceed="handleExceed"
        >
          <el-button type="primary">
            点击上传
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png 格式，不大于500kb的文件。
            </div>
          </template>
        </el-upload> -->
      <!-- </el-form-item>
      <el-form-item label="背景故事" prop="content">
        <el-input v-model="ruleForm.content" type="textarea" />
      </el-form-item>
      <el-form-item label="翻译" prop="translation">
        <el-input v-model="ruleForm.translation" />
      </el-form-item> -->
      <!-- <el-form-item label="例句" prop="examples"> -->
      <!-- 1 -->
      <!-- </el-form-item>
      <el-form-item label="背景故事" prop="content">
        <el-input v-model="ruleForm.content" type="textarea" />
      </el-form-item> -->

      <!-- <el-form-item label="同义词" prop="synonyms"> -->
      <!-- <el-input v-model="ruleForm.synonyms" /> -->
      <!-- 2 -->
      <!-- </el-form-item> -->
      <!-- <el-form-item label="反义词" prop="antonyms"> -->
      <!-- <el-input v-model="ruleForm.antonyms" /> -->
      <!-- 3
      </el-form-item> -->
      <!-- <el-form-item label="定义" prop="definition">
        <el-input v-model="ruleForm.definition" type="textarea" />
      </el-form-item> -->
      <!-- <el-form-item label="词性" prop="type"> -->
      <!-- <el-input v-model="ruleForm.type" /> -->
      <!-- </el-form-item> -->

      <!-- <el-form-item label="音标" prop="phonetic">
        <el-input v-model="ruleForm.phonetic" />
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          新增
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss">
.Editor {
  padding: 1rem;
  margin: 0 auto;

  max-width: 1080px;
}
</style>
