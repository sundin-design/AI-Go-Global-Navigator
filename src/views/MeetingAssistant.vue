<template>
  <div class="meeting-assistant-v2">
    <!-- 顶部导航栏 -->
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
          <router-link to="/mail-assistant" class="nav-link">AI邮件助手</router-link>
          <router-link to="/meeting-assistant" class="nav-link active">AI会议助手</router-link>
        </nav>
      </div>
    </header>

    <!-- 页面标题 -->
    <section class="page-header">
      <h1><Mic class="title-icon" /> AI会议翻译助手</h1>
      <p>实时语音识别、翻译与AI辅助回复，让外贸会议更高效</p>
    </section>

    <!-- 会议控制栏 -->
    <section class="control-bar">
      <div class="control-buttons">
        <el-button
          type="primary"
          size="large"
          :disabled="meetingStatus === 'active' || meetingStatus === 'paused'"
          :loading="isStarting"
          @click="startMeeting"
          class="control-btn start-btn"
        >
          <VideoPlay class="btn-icon" />
          <span>开始会议</span>
        </el-button>
        
        <el-button
          v-if="meetingStatus === 'active'"
          type="warning"
          size="large"
          @click="pauseRecording"
          class="control-btn pause-btn"
        >
          <VideoPause class="btn-icon" />
          <span>暂停录音</span>
        </el-button>
        
        <el-button
          v-if="meetingStatus === 'active' && isPaused"
          type="success"
          size="large"
          @click="resumeRecording"
          class="control-btn resume-btn"
        >
          <VideoPlay class="btn-icon" />
          <span>继续录音</span>
        </el-button>
        
        <el-button
          type="info"
          size="large"
          :disabled="meetingStatus === 'idle'"
          @click="restartMeeting"
          class="control-btn restart-btn"
        >
          <RefreshRight class="btn-icon" />
          <span>重新开始</span>
        </el-button>
        
        <el-button
          type="danger"
          size="large"
          :disabled="meetingStatus === 'idle'"
          @click="endMeeting"
          class="control-btn end-btn"
        >
          <CircleClose class="btn-icon" />
          <span>结束会议</span>
        </el-button>
      </div>
      
      <div class="status-display">
        <div class="status-item">
          <span class="status-label">会议状态</span>
          <span class="status-value" :class="meetingStatus">
            {{ statusTextMap[meetingStatus] }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">会议时长</span>
          <span class="status-value">{{ formatDuration(sessionDuration) }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">对话轮数</span>
          <span class="status-value">{{ conversationHistory.length }}</span>
        </div>
      </div>

      <div class="provider-select">
        <span class="provider-label">语音服务</span>
        <el-select v-model="currentProvider" size="small" :disabled="meetingStatus !== 'idle'">
          <el-option label="手动输入" value="manual" />
          <el-option label="百度智能云" value="baidu" />
        </el-select>
      </div>
    </section>

    <!-- 主内容区（三栏布局） -->
    <section class="main-content">
      <!-- 左栏：实时语音识别 -->
      <div class="left-column">
        <!-- 手动输入区 -->
        <el-card class="input-card" v-if="currentProvider === 'manual' || meetingStatus === 'idle'">
          <div class="card-header">
            <h3><ChatDotRound class="header-icon" /> 手动输入客户发言</h3>
          </div>
          <div class="input-area">
            <el-input
              type="textarea"
              v-model="manualInput"
              placeholder="请输入客户英文发言内容..."
              :rows="4"
              class="manual-textarea"
            />
            <el-button
              type="primary"
              :loading="isAnalyzing"
              @click="submitManualInput"
              class="submit-btn"
              :disabled="!manualInput.trim()"
            >
              <Promotion class="btn-icon" />
              <span>提交分析</span>
            </el-button>
          </div>
        </el-card>

        <!-- 实时语音显示区 -->
        <el-card class="speech-card">
          <div class="card-header">
            <h3><Mic class="header-icon" /> 客户原始发言</h3>
            <span class="speech-status" v-if="isListening">
              <span class="pulse-dot"></span>
              正在监听...
            </span>
          </div>
          
          <div class="speech-list" ref="speechListRef">
            <div v-if="conversationHistory.length === 0" class="empty-state">
              <p>暂无会议记录</p>
              <p class="hint">点击"开始会议"或手动输入客户发言</p>
            </div>
            
            <div v-for="turn in conversationHistory" :key="turn.id" class="speech-item">
              <div class="speech-header">
                <span class="speech-time">{{ formatTime(turn.timestamp) }}</span>
                <span class="speech-speaker">客户</span>
              </div>
              <div class="speech-content">
                {{ turn.originalText }}
              </div>
            </div>
          </div>
        </el-card>

        <!-- 实时翻译区 -->
        <el-card class="translation-card">
          <div class="card-header">
            <h3><TranslateIcon class="header-icon" /> 实时中文翻译</h3>
          </div>
          
          <div class="translation-content">
            <div v-if="currentTranslation" class="translation-text">
              {{ currentTranslation }}
            </div>
            <div v-else class="empty-state">
              <p>等待客户发言...</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 中栏：关键词与对话分析 -->
      <div class="middle-column">
        <!-- 关键词识别 -->
        <el-card class="keywords-card">
          <div class="card-header">
            <h3><CollectionTag class="header-icon" /> 关键词识别</h3>
          </div>
          
          <div class="keywords-content">
            <div v-if="currentKeywords.length > 0" class="keywords-tags">
              <el-tag
                v-for="keyword in currentKeywords"
                :key="keyword"
                :type="getKeywordType(keyword)"
                effect="plain"
                class="keyword-tag"
              >
                {{ keyword }}
              </el-tag>
            </div>
            <div v-else class="empty-state">
              <p>等待识别关键词...</p>
            </div>
          </div>

          <!-- 关键词记忆 -->
          <div class="keyword-memory" v-if="keywordMemorySummary && Object.keys(keywordMemorySummary).length > 0">
            <h4>本次会议关键词统计</h4>
            <div class="memory-list">
              <div v-for="(info, keyword) in keywordMemorySummary" :key="keyword" class="memory-item">
                <span class="memory-keyword">{{ keyword }}</span>
                <span class="memory-count">{{ info.totalCount }}次</span>
                <span class="memory-urgency" :class="info.urgency">
                  {{ info.urgency === 'high' ? '紧急' : info.urgency === 'medium' ? '重要' : '一般' }}
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 会议笔记 -->
        <el-card class="notes-card">
          <div class="card-header">
            <h3><Notebook class="header-icon" /> 会议笔记</h3>
          </div>
          
          <div class="notes-content">
            <el-input
              type="textarea"
              v-model="meetingNotes"
              placeholder="记录会议要点..."
              :rows="3"
            />
          </div>
        </el-card>
      </div>

      <!-- 右栏：AI回复建议 -->
      <div class="right-column">
        <el-card class="reply-card">
          <div class="card-header">
            <h3><Star class="header-icon" /> AI建议回复</h3>
            <span class="generating-status" v-if="isGenerating">
              <span class="pulse-dot"></span>
              AI生成中...
            </span>
          </div>
          
          <div class="reply-content">
            <div v-if="replySuggestions.length > 0" class="reply-list">
              <div v-for="(reply, index) in replySuggestions" :key="index" class="reply-item">
                <div class="reply-header">
                  <span class="reply-title">{{ reply.title }}</span>
                  <el-radio-group v-model="replyLangs[index]" size="small">
                    <el-radio-button label="en">英文</el-radio-button>
                    <el-radio-button label="zh">中文</el-radio-button>
                  </el-radio-group>
                </div>
                
                <div class="reply-text">
                  {{ replyLangs[index] === 'en' ? reply.en : reply.zh }}
                </div>
                
                <div class="reply-actions">
                  <el-button
                    type="primary"
                    size="small"
                    @click="copyReply(reply, replyLangs[index])"
                    class="copy-btn"
                  >
                    <CopyDocument class="btn-icon" />
                    复制
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>AI将根据客户发言实时生成回复建议</p>
            </div>
          </div>
        </el-card>

        <!-- 回复历史 -->
        <el-card class="history-card" v-if="replyHistory.length > 0">
          <div class="card-header">
            <h3><Clock class="header-icon" /> 回复历史</h3>
          </div>
          
          <div class="history-list">
            <div v-for="(item, index) in replyHistory.slice(-5)" :key="index" class="history-item">
              <div class="history-time">{{ formatTime(item.timestamp) }}</div>
              <div class="history-preview">{{ item.text.substring(0, 50) }}...</div>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 错误提示区（页面内显示） -->
    <section class="error-section" v-if="errorList.length > 0">
      <div class="error-header">
        <h3><WarningFilled class="header-icon" /> 错误提示</h3>
        <el-button type="link" size="small" @click="clearErrors">清除全部</el-button>
      </div>
      
      <div class="error-list">
        <div v-for="error in errorList" :key="error.id" class="error-item" :class="error.type">
          <div class="error-content">
            <span class="error-operation">{{ error.operation }}</span>
            <span class="error-message">{{ error.message }}</span>
          </div>
          <el-button type="link" size="small" @click="dismissError(error.id)">关闭</el-button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
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
import { ref, computed, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  MapLocation,
  Mic,
  VideoPlay,
  VideoPause,
  CircleClose,
  ChatDotRound,
  TrendCharts,
  Notebook,
  Star,
  CopyDocument,
  Clock,
  WarningFilled,
  Promotion,
  Check,
  InfoFilled,
  CollectionTag,
  RefreshRight
} from '@element-plus/icons-vue'
import { TranslateIcon } from '../utils/icons'

// 服务导入
import { SpeechService } from '../services/SpeechService'
import { MeetingContext } from '../services/MeetingContext'
import { analyzeMeetingWithContext } from '../services/ai'

// ==================== 状态变量 ====================
const router = useRouter()
const speechListRef = ref(null)

// 会议状态
const meetingStatus = ref('idle') // idle, active, paused, ended
const isPaused = ref(false)
const statusTextMap = {
  idle: '未开始',
  active: '进行中',
  paused: '已暂停',
  ended: '已结束'
}

// 服务实例
let speechService = null
let meetingContext = null

// 数据状态
const currentProvider = ref('manual')
const conversationHistory = ref([])
const currentTranslation = ref('')
const currentKeywords = ref([])
const currentIntent = ref('')
const replySuggestions = ref([])
const replyLangs = ref({ 0: 'en', 1: 'en', 2: 'en' })
const replyHistory = ref([])
const keywordMemorySummary = ref(null)
const conversationFlow = ref('initial')
const meetingNotes = ref('')
const manualInput = ref('')
const sessionDuration = ref(0)

// Loading状态
const isStarting = ref(false)
const isAnalyzing = ref(false)
const isGenerating = ref(false)
const isListening = ref(false)

// 错误列表
const errorList = ref([])

// 定时器
let durationTimer = null

// ==================== 对话流程名称 ====================
const flowNames = {
  initial: '初期接触',
  exploration: '需求探索',
  introduction: '产品介绍',
  negotiation: '价格谈判',
  closing: '成交推进'
}

// ==================== 会议控制函数 ====================

async function startMeeting() {
  isStarting.value = true
  clearErrors()

  try {
    // 初始化MeetingContext
    meetingContext = new MeetingContext()
    meetingContext.startSession()
    
    // 初始化SpeechService（如果不是手动模式）
    if (currentProvider.value !== 'manual') {
      speechService = new SpeechService()
      await speechService.initialize(currentProvider.value)
      
      // 设置回调
      speechService.onRecognitionResult(handleRecognitionResult)
      speechService.onError(handleSpeechError)
      
      // 开始监听
      await speechService.startListening()
      isListening.value = true
    }

    meetingStatus.value = 'active'
    
    // 启动计时器
    durationTimer = setInterval(() => {
      if (meetingContext) {
        sessionDuration.value = meetingContext.getSessionDuration()
      }
    }, 1000)

    ElMessage.success('会议已开始')
  } catch (error) {
    addError('startMeeting', error.message, classifyError(error))
    
    // 降级到手动输入模式
    currentProvider.value = 'manual'
    meetingStatus.value = 'active'
    ElMessage.warning('语音服务不可用，已切换到手动输入模式')
  } finally {
    isStarting.value = false
  }
}

function pauseMeeting() {
  if (speechService) {
    speechService.pauseListening()
    isListening.value = false
  }
  
  if (meetingContext) {
    meetingContext.pauseSession()
  }
  
  meetingStatus.value = 'paused'
  ElMessage.info('会议已暂停')
}

async function resumeMeeting() {
  if (speechService) {
    try {
      await speechService.resumeListening()
      isListening.value = true
      isPaused.value = false
    } catch (error) {
      addError('resumeMeeting', error.message, 'network')
      ElMessage.error('恢复会议失败：' + error.message)
      return
    }
  }
  
  if (meetingContext) {
    meetingContext.resumeSession()
  }
  
  meetingStatus.value = 'active'
  ElMessage.success('会议已继续')
}

// 暂停录音（仅暂停语音采集，不停止会议）
function pauseRecording() {
  if (speechService) {
    speechService.pauseListening()
    isListening.value = false
    isPaused.value = true
  }
  
  if (meetingContext) {
    meetingContext.pauseSession()
  }
  
  ElMessage.info('录音已暂停')
}

// 继续录音（仅继续语音采集）
async function resumeRecording() {
  if (speechService) {
    try {
      await speechService.resumeListening()
      isListening.value = true
      isPaused.value = false
    } catch (error) {
      addError('resumeRecording', error.message, 'network')
      ElMessage.error('恢复录音失败：' + error.message)
      return
    }
  }
  
  if (meetingContext) {
    meetingContext.resumeSession()
  }
  
  ElMessage.success('录音已继续')
}

// 重新开始会议（清除所有记录，效果等同于刷新页面）
function restartMeeting() {
  // 确认操作
  ElMessageBox.confirm(
    '确定要重新开始会议吗？这将清除所有当前的会议记录。',
    '重新开始会议',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 停止当前语音服务
    if (speechService) {
      speechService.stopListening()
      speechService.destroy()
      speechService = null
    }
    
    isListening.value = false
    isPaused.value = false
    isStarting.value = false
    isAnalyzing.value = false
    isGenerating.value = false
    
    // 清除会议上下文
    if (meetingContext) {
      meetingContext.clearHistory()
      meetingContext = null
    }
    
    // 清除所有数据状态（恢复到初始状态）
    conversationHistory.value = []
    currentTranslation.value = ''
    currentKeywords.value = []
    currentIntent.value = ''
    replySuggestions.value = []
    replyLangs.value = { 0: 'en', 1: 'en', 2: 'en' }
    replyHistory.value = []
    keywordMemorySummary.value = null
    conversationFlow.value = 'initial'
    meetingNotes.value = ''
    manualInput.value = ''
    errorList.value = []
    
    // 停止计时器
    if (durationTimer) {
      clearInterval(durationTimer)
      durationTimer = null
    }
    
    sessionDuration.value = 0
    meetingStatus.value = 'idle'
    
    // 重新初始化会议上下文
    meetingContext = new MeetingContext()
    
    ElMessage.success('会议已重新开始')
  }).catch(() => {
    // 用户取消操作
  })
}

function endMeeting() {
  // 停止语音服务
  if (speechService) {
    speechService.stopListening()
    speechService.destroy()
    speechService = null
  }
  
  isListening.value = false

  // 结束会议上下文
  if (meetingContext) {
    const summary = meetingContext.endSession()
    console.log('会议总结:', summary)
    
    // 可选：导出会议记录
    const exportedText = meetingContext.exportAsText()
    console.log('会议记录:', exportedText)
  }

  // 停止计时器
  if (durationTimer) {
    clearInterval(durationTimer)
    durationTimer = null
  }

  meetingStatus.value = 'ended'
  ElMessage.success('会议已结束')
}

// ==================== 手动输入处理 ====================

async function submitManualInput() {
  const text = manualInput.value.trim()
  if (!text) {
    ElMessage.warning('请输入客户发言内容')
    return
  }

  isAnalyzing.value = true
  clearErrors()

  try {
    // 如果会议未开始，自动开始
    if (meetingStatus.value === 'idle') {
      meetingContext = new MeetingContext()
      meetingContext.startSession()
      meetingStatus.value = 'active'
      
      // 启动计时器
      durationTimer = setInterval(() => {
        if (meetingContext) {
          sessionDuration.value = meetingContext.getSessionDuration()
        }
      }, 1000)
    }

    // 处理手动输入
    await processSpeechText(text, true)
    
    manualInput.value = ''
  } catch (error) {
    addError('submitManualInput', error.message, 'analysis')
  } finally {
    isAnalyzing.value = false
  }
}

// ==================== 语音识别结果处理 ====================

async function handleRecognitionResult(result) {
  if (result.text && result.isFinal) {
    await processSpeechText(result.text, result.isManual || false)
  }
}

async function processSpeechText(text, isManual = false) {
  isGenerating.value = true
  
  try {
    // 获取上下文信息
    const context = meetingContext ? meetingContext.getAnalysisContext() : null
    
    // 调用AI分析
    const analysisResult = await analyzeMeetingWithContext(text, context)
    
    // 更新当前显示
    currentTranslation.value = analysisResult.translation || ''
    currentKeywords.value = analysisResult.keywords || []
    currentIntent.value = analysisResult.intent || ''
    replySuggestions.value = analysisResult.replies || []
    
    // 初始化语言选择
    replyLangs.value = { 0: 'en', 1: 'en', 2: 'en' }
    
    // 添加到对话历史
    if (meetingContext) {
      const turn = meetingContext.addConversationTurn(
        'customer',
        text,
        analysisResult.translation,
        {
          keywords: analysisResult.keywords,
          intent: analysisResult.intent,
          replySuggestions: analysisResult.replies,
          isManual: isManual
        }
      )
      
      // 更新显示数据
      conversationHistory.value = meetingContext.getAllTurns()
      keywordMemorySummary.value = meetingContext.keywordMemory.getSummary()
      conversationFlow.value = meetingContext.analyzeConversationFlow()
    }
    
    // 滚动到底部
    scrollToBottom()
    
  } catch (error) {
    addError('processSpeechText', error.message, 'analysis')
  } finally {
    isGenerating.value = false
  }
}

function handleSpeechError(errorInfo) {
  // 过滤掉"没有听到说话"的错误，这些是正常的等待状态
  if (errorInfo.code === -3005 || errorInfo.code === -3101) {
    console.log('等待英文发言内容...')
    return
  }
  
  addError(errorInfo.operation, errorInfo.message, errorInfo.type)
}

// ==================== 回复操作 ====================

function copyReply(reply, lang) {
  const text = lang === 'en' ? reply.en : reply.zh
  
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
    
    // 添加到回复历史
    replyHistory.value.push({
      timestamp: new Date().toISOString(),
      text: text,
      type: reply.title
    })
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

// ==================== 工具函数 ====================

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour12: false })
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function scrollToBottom() {
  nextTick(() => {
    if (speechListRef.value) {
      speechListRef.value.scrollTop = speechListRef.value.scrollHeight
    }
  })
}

function getKeywordType(keyword) {
  const urgentKeywords = ['价格问题', '交期问题', '付款方式问题']
  const mediumKeywords = ['MOQ问题', '样品问题', '代理合作', '产品规格']
  
  if (urgentKeywords.includes(keyword)) {
    return 'danger'
  } else if (mediumKeywords.includes(keyword)) {
    return 'warning'
  } else {
    return 'info'
  }
}

function getFlowProgress() {
  const progressMap = {
    initial: '0%',
    exploration: '25%',
    introduction: '50%',
    negotiation: '75%',
    closing: '100%'
  }
  return progressMap[conversationFlow.value] || '0%'
}

function classifyError(error) {
  const message = (error.message || error).toLowerCase()
  
  if (message.includes('permission') || message.includes('denied') || message.includes('拒绝')) {
    return 'permission'
  } else if (message.includes('network') || message.includes('fetch') || message.includes('api')) {
    return 'network'
  } else if (message.includes('device') || message.includes('not found') || message.includes('未找到')) {
    return 'device'
  } else {
    return 'analysis'
  }
}

// ==================== 错误处理 ====================

function addError(operation, message, type) {
  const errorItem = {
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    operation: operation,
    message: message,
    type: type,
    timestamp: new Date().toISOString()
  }
  
  errorList.value.push(errorItem)
  
  // 最多保留5个错误
  if (errorList.value.length > 5) {
    errorList.value = errorList.value.slice(-5)
  }
}

function dismissError(errorId) {
  errorList.value = errorList.value.filter(e => e.id !== errorId)
}

function clearErrors() {
  errorList.value = []
}

// ==================== 导航 ====================

function goHome() {
  router.push('/')
}

// ==================== 生命周期 ====================

onUnmounted(() => {
  // 清理资源
  if (speechService) {
    speechService.destroy()
  }
  
  if (durationTimer) {
    clearInterval(durationTimer)
  }
})
</script>

<style scoped>
/* ==================== 基础样式 ==================== */
.meeting-assistant-v2 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e17 0%, #1a1f2e 50%, #0d1117 100%);
  color: var(--color-text-primary);
}

/* ==================== 导航栏 ==================== */
.header {
  background: rgba(13, 17, 23, 0.95);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-xl);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: var(--font-size-lg);
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

/* ==================== 页面标题 ==================== */
.page-header {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-xl);
  max-width: 1600px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.title-icon {
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
  vertical-align: middle;
}

.page-header p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* ==================== 会议控制栏 ==================== */
.control-bar {
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(26, 31, 46, 0.5);
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.control-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.control-btn {
  min-width: 120px;
}

.control-btn .btn-icon {
  margin-right: var(--spacing-xs);
}

.start-btn {
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  border: none;
}

.start-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #00e5ff, #00b8d4);
}

.pause-btn {
  background: #f59e0b;
  border: none;
}

.pause-btn:hover:not(:disabled) {
  background: #fbbf24;
}

.resume-btn {
  background: #10b981;
  border: none;
}

.resume-btn:hover:not(:disabled) {
  background: #34d399;
}

.end-btn {
  background: #ef4444;
  border: none;
}

.end-btn:hover:not(:disabled) {
  background: #f87171;
}

.status-display {
  display: flex;
  gap: var(--spacing-xl);
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.status-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.status-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.status-value.idle {
  color: var(--color-text-secondary);
}

.status-value.active {
  color: #10b981;
}

.status-value.paused {
  color: #f59e0b;
}

.status-value.ended {
  color: #ef4444;
}

.provider-select {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.provider-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* ==================== 主内容区 ==================== */
.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-lg);
}

.left-column,
.middle-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ==================== 卡片通用样式 ==================== */
.input-card,
.speech-card,
.translation-card,
.keywords-card,
.flow-card,
.notes-card,
.reply-card,
.history-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.card-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header-icon {
  color: var(--color-primary);
}

/* ==================== 输入区 ==================== */
.input-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.submit-btn {
  align-self: flex-end;
}

/* ==================== 语音列表 ==================== */
.speech-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.speech-list::-webkit-scrollbar {
  width: 6px;
}

.speech-list::-webkit-scrollbar-track {
  background: transparent;
}

.speech-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.speech-item {
  padding: var(--spacing-md);
  background: rgba(0, 212, 255, 0.05);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
}

.speech-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.speech-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.speech-speaker {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.speech-content {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  line-height: 1.5;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.empty-state .hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.speech-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: #10b981;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.generating-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
}

/* ==================== 翻译区 ==================== */
.translation-content {
  min-height: 80px;
}

.translation-text {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  line-height: 1.6;
  padding: var(--spacing-md);
  background: rgba(16, 185, 129, 0.05);
  border-radius: var(--radius-md);
}

/* ==================== 关键词区 ==================== */
.keywords-content {
  min-height: 60px;
}

.keywords-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.keyword-tag {
  font-size: var(--font-size-sm);
}

.keyword-memory {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.keyword-memory h4 {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.memory-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.memory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-sm);
}

.memory-keyword {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.memory-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.memory-urgency {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.memory-urgency.high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.memory-urgency.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.memory-urgency.low {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

/* ==================== 对话流程区 ==================== */
.flow-content {
  padding: var(--spacing-md);
}

.flow-stage {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.stage-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stage-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.flow-stage.initial .stage-name { color: var(--color-text-secondary); }
.flow-stage.exploration .stage-name { color: #3b82f6; }
.flow-stage.introduction .stage-name { color: #8b5cf6; }
.flow-stage.negotiation .stage-name { color: #f59e0b; }
.flow-stage.closing .stage-name { color: #10b981; }

.flow-progress {
  margin-top: var(--spacing-md);
}

.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: width 0.5s ease;
}

.progress-stages {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* ==================== 回复区 ==================== */
.reply-content {
  min-height: 200px;
}

.reply-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.reply-item {
  padding: var(--spacing-md);
  background: rgba(0, 212, 255, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.reply-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.reply-text {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  white-space: pre-wrap;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
}

.copy-btn {
  min-width: 80px;
}

/* ==================== 回复历史 ==================== */
.history-list {
  max-height: 150px;
  overflow-y: auto;
}

.history-item {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.history-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.history-preview {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

/* ==================== 错误提示区 ==================== */
.error-section {
  max-width: 1600px;
  margin: var(--spacing-xl) auto;
  padding: var(--spacing-lg);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-lg);
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.error-header h3 {
  font-size: var(--font-size-lg);
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.error-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: rgba(239, 68, 68, 0.05);
  border-radius: var(--radius-md);
}

.error-item.permission {
  background: rgba(245, 158, 11, 0.1);
}

.error-item.network {
  background: rgba(59, 130, 246, 0.1);
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.error-operation {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.error-message {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

/* ==================== 页脚 ==================== */
.footer {
  margin-top: var(--spacing-3xl);
  padding: var(--spacing-xl);
  background: rgba(13, 17, 23, 0.95);
  border-top: 1px solid var(--color-border);
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* ==================== 响应式适配 ==================== */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .right-column {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .control-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .status-display {
    justify-content: center;
  }
}
</style>