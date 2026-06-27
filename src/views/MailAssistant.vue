<template>
  <div class="mail-assistant-container">
    <header class="header">
      <div class="header-content">
        <div class="logo" @click="goHome">
          <div class="logo-icon">
            <MapLocation />
          </div>
          <span class="logo-text">AI Go Global</span>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/mail-assistant" class="nav-link active">AI邮件助手</router-link>
          <router-link to="/meeting-assistant" class="nav-link">AI会议助手</router-link>
        </nav>
      </div>
    </header>

    <section class="main-section">
      <div class="page-title">
        <h1><ChatDotRound class="title-icon" /> TradeMail AI 外贸邮件工作台</h1>
        <p>智能解析海外客户邮件，30秒获得翻译、画像、意图与回复方案</p>
      </div>

      <div class="mail-container">
        <div class="left-panel">
          <el-card class="upload-card">
            <div class="card-header">
              <h2><UploadFilled class="header-icon" /> 邮件导入</h2>
              <span class="card-subtitle">支持 TXT / Word / PDF 格式</span>
            </div>
            <div
              class="upload-area"
              :class="{ 'drag-over': isDragOver }"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".txt,.docx,.pdf"
                style="display: none"
                @change="handleFileSelect"
              />
              <div class="upload-icon">
                <UploadFilled />
              </div>
              <p class="upload-text">点击或拖拽文件到此处上传</p>
              <div class="upload-formats">
                <span class="format-tag">📄 TXT</span>
                <span class="format-tag">📝 Word</span>
                <span class="format-tag">📕 PDF</span>
              </div>
            </div>
            <div v-if="uploadedFileName" class="uploaded-file">
              <Document class="file-icon" />
              <span class="file-name">{{ uploadedFileName }}</span>
              <el-button type="link" class="remove-btn" @click.stop="removeFile">
                <Close />
              </el-button>
            </div>
          </el-card>

          <el-card class="input-card">
            <div class="card-header">
              <h2><Message class="header-icon" /> 客户邮件内容</h2>
            </div>
            <el-input
              type="textarea"
              v-model="emailContent"
              :rows="10"
              placeholder="请粘贴客户邮件内容..."
              class="email-input"
            />
            <div class="action-buttons">
              <el-button
                type="primary"
                :loading="isAnalyzing"
                :disabled="!emailContent.trim()"
                @click="analyzeEmail"
                class="analyze-btn"
              >
                <Star class="btn-icon" />
                <span>{{ isAnalyzing ? '分析中...' : '开始分析' }}</span>
              </el-button>
              <el-button
                type="default"
                @click="clearEmail"
                :disabled="isAnalyzing"
                class="clear-btn"
              >
                <Delete class="btn-icon" />
                <span>清空</span>
              </el-button>
            </div>
          </el-card>
        </div>

        <div class="right-panel">
          <div v-if="isAnalyzing" class="loading-container">
            <div class="loading-steps">
              <div
                v-for="(step, index) in analysisSteps"
                :key="index"
                class="step-item"
                :class="{ active: currentStepIndex >= index, done: currentStepIndex > index }"
              >
                <div class="step-icon">
                  <Check v-if="currentStepIndex > index" />
                  <Loading v-else-if="currentStepIndex === index" class="spin" />
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="step-text">{{ step }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="analysisResult" class="result-container">
            <el-card class="result-card translation-card">
              <div class="card-header">
                <h3><MapLocation class="header-icon" /> 邮件翻译</h3>
                <el-tag :type="detectedLang === 'en' ? 'primary' : 'success'" size="small">
                  {{ detectedLang === 'en' ? '英文原文' : '其他语言' }}
                </el-tag>
              </div>
              <p class="translation-text">{{ analysisResult.translation }}</p>
            </el-card>

            <el-card class="result-card profile-card">
              <div class="card-header">
                <h3><User class="header-icon" /> 客户画像</h3>
              </div>
              <div class="profile-grid">
                <div class="profile-item">
                  <span class="profile-label">客户类型</span>
                  <span class="profile-value">{{ analysisResult.customerProfile.type }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">国家地区</span>
                  <span class="profile-value">{{ analysisResult.customerProfile.region }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">所属行业</span>
                  <span class="profile-value">{{ analysisResult.customerProfile.industry }}</span>
                </div>
                <div class="profile-item">
                  <span class="profile-label">采购角色</span>
                  <span class="profile-value">{{ analysisResult.customerProfile.role }}</span>
                </div>
                <div class="profile-item full-width">
                  <span class="profile-label">公司规模（推测）</span>
                  <span class="profile-value">{{ analysisResult.customerProfile.companySize }}</span>
                </div>
              </div>
            </el-card>

            <el-card class="result-card intent-card">
              <div class="card-header">
                <h3><PieChart class="header-icon" /> 邮件意图分析</h3>
              </div>
              <div class="intent-grid">
                <div class="intent-item">
                  <span class="intent-label">咨询产品</span>
                  <span class="intent-value">{{ analysisResult.intent.product }}</span>
                </div>
                <div class="intent-item">
                  <span class="intent-label">采购目的</span>
                  <span class="intent-value">{{ analysisResult.intent.purpose }}</span>
                </div>
                <div class="intent-item">
                  <span class="intent-label">采购阶段</span>
                  <span class="intent-value">{{ analysisResult.intent.stage }}</span>
                </div>
                <div class="intent-item">
                  <span class="intent-label">意向等级</span>
                  <span class="intent-value" :class="'level-' + analysisResult.intent.level.toLowerCase()">
                    {{ analysisResult.intent.level }}
                  </span>
                </div>
              </div>
            </el-card>

            <el-card class="result-card risk-card">
              <div class="card-header">
                <h3><WarningFilled class="header-icon" /> 风险识别</h3>
              </div>
              <div class="risk-tags">
                <span
                  v-for="(risk, index) in analysisResult.risks"
                  :key="index"
                  class="risk-tag"
                >
                  {{ risk }}
                </span>
              </div>
            </el-card>

            <el-card class="result-card reply-card">
              <div class="card-header">
                <h3><Message class="header-icon" /> AI推荐回复</h3>
              </div>

              <div v-for="(reply, index) in analysisResult.replies" :key="index" class="reply-section">
                <div class="reply-header">
                  <span class="reply-title">{{ reply.title }}</span>
                  <div class="reply-actions">
                    <el-button
                      size="small"
                      type="default"
                      @click="copyToClipboard(reply.en)"
                      class="copy-btn"
                    >
                      <CopyDocument class="btn-icon" />
                      <span>复制英文</span>
                    </el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click="copyToClipboard(reply.zh)"
                      class="copy-btn"
                    >
                      <CopyDocument class="btn-icon" />
                      <span>复制中文</span>
                    </el-button>
                  </div>
                </div>
                <div class="reply-content-tabs">
                  <div
                    class="tab"
                    :class="{ active: activeTab[index] === 'en' }"
                    @click="activeTab[index] = 'en'"
                  >
                    英文
                  </div>
                  <div
                    class="tab"
                    :class="{ active: activeTab[index] === 'zh' }"
                    @click="activeTab[index] = 'zh'"
                  >
                    中文
                  </div>
                </div>
                <div class="reply-text">
                  {{ activeTab[index] === 'en' ? reply.en : reply.zh }}
                </div>
              </div>
            </el-card>

            <el-card class="result-card action-card">
              <div class="card-header">
                <h3><TrendCharts class="header-icon" /> 客户开发建议</h3>
              </div>
              <div class="channel-list">
                <div
                  v-for="(channel, index) in analysisResult.channels"
                  :key="index"
                  class="channel-item"
                >
                  <div class="channel-dot" :style="{ background: channel.color }"></div>
                  <div class="channel-info">
                    <span class="channel-name">{{ channel.name }}</span>
                    <span class="channel-desc">{{ channel.description }}</span>
                  </div>
                </div>
              </div>
            </el-card>

            <el-card class="result-card roadmap-card">
              <div class="card-header">
                <h3><Clock class="header-icon" /> 下一步行动建议</h3>
              </div>
              <div class="action-timeline">
                <div
                  v-for="(action, index) in analysisResult.nextActions"
                  :key="index"
                  class="action-item"
                >
                  <div class="action-index">{{ index + 1 }}</div>
                  <div class="action-content">
                    <span class="action-title">{{ action.title }}</span>
                    <span class="action-desc">{{ action.description }}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">
              <Message />
            </div>
            <h3>开始分析客户邮件</h3>
            <p>在左侧上传或粘贴客户邮件内容，AI将为您完成翻译、画像分析和回复生成</p>
            <div class="empty-features">
              <div class="feature-item">
                <span class="feature-icon">🌐</span>
                <span>多语言翻译</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">👤</span>
                <span>客户画像</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>意图识别</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✉️</span>
                <span>智能回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="logo-icon">
            <MapLocation />
          </div>
          <span class="logo-text">AI Go Global</span>
        </div>
        <div class="footer-copyright">© 2026 AI Go Global Navigator. All rights reserved.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  MapLocation,
  ChatDotRound,
  Message,
  Star,
  Delete,
  PieChart,
  WarningFilled,
  CopyDocument,
  UploadFilled,
  Document,
  Close,
  User,
  Check,
  Loading,
  TrendCharts,
  Clock
} from '@element-plus/icons-vue'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import { analyzeEmail as analyzeEmailAPI } from '../services/ai'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

const router = useRouter()
const fileInput = ref(null)

const emailContent = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref(null)
const activeTab = ref({})
const isDragOver = ref(false)
const uploadedFileName = ref('')
const currentStepIndex = ref(0)
const detectedLang = ref('en')

const analysisSteps = [
  'AI正在解析邮件语言...',
  'AI正在翻译邮件内容...',
  'AI正在识别客户画像...',
  'AI正在分析采购意图...',
  'AI正在识别风险点...',
  'AI正在生成回复方案...'
]

const goHome = () => {
  router.push('/')
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = async (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  uploadedFileName.value = file.name

  try {
    let content = ''

    if (ext === 'txt') {
      content = await readTxtFile(file)
    } else if (ext === 'docx') {
      content = await readDocxFile(file)
    } else if (ext === 'pdf') {
      content = await readPdfFile(file)
    } else {
      ElMessage.error('不支持的文件格式')
      return
    }

    emailContent.value = content
    ElMessage.success('文件读取成功')
  } catch (error) {
    console.error('文件读取失败:', error)
    ElMessage.error('文件读取失败，请手动粘贴内容')
  }
}

const readTxtFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

const readDocxFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

const readPdfFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => item.str).join(' ')
    text += pageText + '\n'
  }
  return text
}

const removeFile = () => {
  uploadedFileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const clearEmail = () => {
  emailContent.value = ''
  analysisResult.value = null
  uploadedFileName.value = ''
  currentStepIndex.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const detectLanguage = (text) => {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)
  if (chineseChars && chineseChars.length > text.length * 0.3) {
    return 'zh'
  }
  return 'en'
}

const analyzeEmail = async () => {
  if (!emailContent.value.trim()) {
    ElMessage.warning('请输入或上传客户邮件内容')
    return
  }

  isAnalyzing.value = true
  analysisResult.value = null
  currentStepIndex.value = 0

  detectedLang.value = detectLanguage(emailContent.value)

  const stepTimer = setInterval(() => {
    if (currentStepIndex.value < analysisSteps.length - 1) {
      currentStepIndex.value++
    }
  }, 1500)

  try {
    const result = await analyzeEmailAPI(emailContent.value)
    analysisResult.value = result
    currentStepIndex.value = analysisSteps.length
    activeTab.value = {
      0: 'en',
      1: 'en',
      2: 'en'
    }
    ElMessage.success('邮件分析完成')
  } catch (error) {
    console.error('邮件分析失败:', error)
    ElMessage.error('邮件分析失败，请稍后重试')
  } finally {
    clearInterval(stepTimer)
    setTimeout(() => {
      isAnalyzing.value = false
    }, 500)
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.mail-assistant-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
}

.header {
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  font-weight: var(--font-weight-medium);
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-primary);
  background: rgba(0, 212, 255, 0.1);
}

.main-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.page-title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.page-title .title-icon {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
  vertical-align: middle;
}

.page-title p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.mail-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--spacing-xl);
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.right-panel::-webkit-scrollbar {
  width: 6px;
}

.right-panel::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

.right-panel::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-full);
}

.upload-card,
.input-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.card-header h2,
.card-header h3 {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-header .header-icon {
  color: var(--color-primary);
}

.card-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-2xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: var(--color-bg-surface);
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--color-primary);
  background: rgba(0, 212, 255, 0.05);
}

.upload-icon {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.upload-text {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-md);
}

.upload-formats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
}

.format-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
}

.file-icon {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.file-name {
  flex: 1;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  color: var(--color-text-muted);
  padding: 4px;
}

.email-input {
  width: 100%;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
}

.email-input::placeholder {
  color: var(--color-text-muted);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.analyze-btn {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-normal);
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.clear-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--color-danger);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-normal);
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-icon {
  font-size: var(--font-size-base);
}

.loading-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
}

.loading-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.step-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  opacity: 0.4;
  transition: all var(--transition-normal);
}

.step-item.active {
  opacity: 1;
}

.step-item.done {
  opacity: 0.7;
}

.step-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.step-item.active .step-icon {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 0 12px var(--color-glow-primary);
}

.step-item.done .step-icon {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.step-icon .spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.step-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.step-item.active .step-text {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.result-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.result-card:hover {
  border-color: var(--color-border-hover);
}

.translation-card .translation-text {
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.profile-item {
  background: var(--color-bg-surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.profile-item.full-width {
  grid-column: span 2;
}

.profile-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.profile-value {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.intent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.intent-item {
  background: var(--color-bg-surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.intent-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.intent-value {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.intent-value.level-high {
  color: var(--color-success);
}

.intent-value.level-medium {
  color: var(--color-accent);
}

.intent-value.level-low {
  color: var(--color-danger);
}

.risk-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.risk-tag {
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--color-danger);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.reply-section {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.reply-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.reply-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.reply-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.reply-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
}

.reply-content-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.tab {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.tab.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-color: transparent;
  color: white;
}

.reply-text {
  background: var(--color-bg-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
  white-space: pre-wrap;
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.channel-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
}

.channel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.channel-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.channel-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.action-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.action-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  position: relative;
}

.action-item::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 36px;
  bottom: -16px;
  width: 2px;
  background: var(--color-border);
}

.action-item:last-child::before {
  display: none;
}

.action-index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
  z-index: 1;
}

.action-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-top: 4px;
}

.action-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.action-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px var(--spacing-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.empty-icon :deep(.el-icon) {
  font-size: 40px;
  color: var(--color-primary);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.empty-features {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  min-width: 90px;
}

.feature-icon {
  font-size: 24px;
}

.feature-item span:last-child {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.footer {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(17, 24, 39, 0.8);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.footer-copyright {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .mail-container {
    grid-template-columns: 1fr;
  }

  .right-panel {
    max-height: none;
  }

  .profile-grid,
  .intent-grid {
    grid-template-columns: 1fr;
  }

  .profile-item.full-width {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .page-title h1 {
    font-size: var(--font-size-2xl);
  }

  .main-section {
    padding: var(--spacing-md);
  }

  .reply-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .empty-features {
    gap: var(--spacing-sm);
  }
}
</style>