// MeetingContext.js - 会议上下文管理服务
// 实现会话记忆、关键词追踪、意图分析等功能

// ==================== 关键词记忆系统 ====================
class KeywordMemory {
  constructor() {
    this.keywordRecords = {} // { '价格问题': [{timestamp, context}] }
  }

  addKeywords(keywords, timestamp, context = '') {
    keywords.forEach(keyword => {
      if (!this.keywordRecords[keyword]) {
        this.keywordRecords[keyword] = []
      }

      this.keywordRecords[keyword].push({
        timestamp: timestamp,
        context: context,
        frequency: 1
      })
    })
  }

  getSummary() {
    const summary = {}

    Object.keys(this.keywordRecords).forEach(keyword => {
      const records = this.keywordRecords[keyword]
      summary[keyword] = {
        totalCount: records.length,
        firstMentioned: records[0].timestamp,
        lastMentioned: records[records.length - 1].timestamp,
        urgency: this.calculateUrgency(keyword, records.length)
      }
    })

    return summary
  }

  calculateUrgency(keyword, frequency) {
    // 根据关键词类型和频率计算紧急程度
    const urgentKeywords = ['价格问题', '交期问题', '付款方式问题']
    const mediumKeywords = ['MOQ问题', '样品问题', '代理合作', '产品规格']

    if (urgentKeywords.includes(keyword) && frequency >= 2) {
      return 'high'
    } else if (mediumKeywords.includes(keyword) && frequency >= 3) {
      return 'medium'
    } else if (frequency >= 5) {
      return 'medium'
    } else {
      return 'low'
    }
  }

  getKeywordsByUrgency(level) {
    const summary = this.getSummary()
    return Object.keys(summary).filter(k => summary[k].urgency === level)
  }

  clear() {
    this.keywordRecords = {}
  }
}

// ==================== 意图记忆系统 ====================
class IntentMemory {
  constructor() {
    this.intentRecords = []
  }

  addIntent(intent, timestamp, confidence = 0.9) {
    this.intentRecords.push({
      intent: intent,
      timestamp: timestamp,
      confidence: confidence
    })
  }

  getSummary() {
    const intents = {}
    
    this.intentRecords.forEach(record => {
      if (!intents[record.intent]) {
        intents[record.intent] = {
          count: 0,
          firstMentioned: record.timestamp,
          lastMentioned: record.timestamp,
          avgConfidence: 0
        }
      }

      intents[record.intent].count++
      intents[record.intent].lastMentioned = record.timestamp
      intents[record.intent].avgConfidence += record.confidence
    })

    // 计算平均置信度
    Object.keys(intents).forEach(intent => {
      intents[intent].avgConfidence /= intents[intent].count
    })

    return intents
  }

  getCurrentIntent() {
    if (this.intentRecords.length === 0) return null
    return this.intentRecords[this.intentRecords.length - 1].intent
  }

  clear() {
    this.intentRecords = []
  }
}

// ==================== MeetingContext主类 ====================
export class MeetingContext {
  constructor(contextWindow = 10) {
    this.conversationHistory = [] // 完整对话历史
    this.currentSession = {
      startTime: null,
      endTime: null,
      status: 'idle', // idle, active, paused, ended
      topic: ''
    }
    this.contextWindow = contextWindow // 保留最近N轮对话作为上下文
    this.keywordMemory = new KeywordMemory()
    this.intentMemory = new IntentMemory()
  }

  // ==================== 会话管理 ====================
  
  startSession(topic = '') {
    this.currentSession.startTime = new Date().toISOString()
    this.currentSession.status = 'active'
    this.currentSession.topic = topic
    this.clearHistory()
    return {
      sessionId: this.generateSessionId(),
      startTime: this.currentSession.startTime,
      status: 'active'
    }
  }

  pauseSession() {
    this.currentSession.status = 'paused'
    return { status: 'paused' }
  }

  resumeSession() {
    this.currentSession.status = 'active'
    return { status: 'active' }
  }

  endSession() {
    this.currentSession.endTime = new Date().toISOString()
    this.currentSession.status = 'ended'
    
    return {
      status: 'ended',
      summary: this.getSessionSummary()
    }
  }

  // ==================== 对话历史管理 ====================
  
  addConversationTurn(speaker, text, translation, metadata = {}) {
    const turn = {
      id: this.generateTurnId(),
      timestamp: new Date().toISOString(),
      speaker: speaker, // 'customer' | 'user'
      originalText: text,
      translation: translation,
      keywords: metadata.keywords || [],
      intent: metadata.intent || null,
      confidence: metadata.confidence || 0.9,
      replySuggestions: metadata.replySuggestions || [],
      isManual: metadata.isManual || false
    }

    this.conversationHistory.push(turn)

    // 更新关键词记忆
    if (turn.keywords.length > 0) {
      this.keywordMemory.addKeywords(turn.keywords, turn.timestamp, turn.originalText)
    }

    // 更新意图记忆
    if (turn.intent) {
      this.intentMemory.addIntent(turn.intent, turn.timestamp, turn.confidence)
    }

    return turn
  }

  // 获取最近N轮对话
  getRecentTurns(count = this.contextWindow) {
    return this.conversationHistory.slice(-count)
  }

  // 获取所有对话
  getAllTurns() {
    return this.conversationHistory
  }

  // 获取客户发言历史
  getCustomerTurns() {
    return this.conversationHistory.filter(t => t.speaker === 'customer')
  }

  // 获取用户回复历史
  getUserTurns() {
    return this.conversationHistory.filter(t => t.speaker === 'user')
  }

  // ==================== AI分析上下文 ====================
  
  getAnalysisContext() {
    const recentTurns = this.getRecentTurns()
    const customerTurns = recentTurns.filter(t => t.speaker === 'customer')

    return {
      // 最近对话内容
      recentConversation: customerTurns.map(t => ({
        speaker: t.speaker,
        text: t.originalText,
        translation: t.translation,
        keywords: t.keywords
      })),
      
      // 关键词总结
      keywordSummary: this.keywordMemory.getSummary(),
      
      // 意图总结
      intentSummary: this.intentMemory.getSummary(),
      currentIntent: this.intentMemory.getCurrentIntent(),
      
      // 对话流程阶段
      conversationFlow: this.analyzeConversationFlow(),
      
      // 会议元信息
      sessionInfo: {
        startTime: this.currentSession.startTime,
        duration: this.getSessionDuration(),
        turnCount: this.conversationHistory.length
      }
    }
  }

  // 分析对话流程阶段
  analyzeConversationFlow() {
    const intents = this.intentMemory.getSummary()
    const intentTypes = Object.keys(intents)

    // 根据意图判断对话阶段
    if (intentTypes.includes('成交推进') || intentTypes.includes('价格谈判')) {
      return 'closing' // 成交阶段
    } else if (intentTypes.includes('价格询问') || intentTypes.includes('MOQ询问') || intentTypes.includes('交期询问')) {
      return 'negotiation' // 谈判阶段
    } else if (intentTypes.includes('产品介绍') || intentTypes.includes('公司介绍')) {
      return 'introduction' // 介绍阶段
    } else if (intentTypes.includes('样品测试') || intentTypes.includes('需求了解')) {
      return 'exploration' // 探索阶段
    } else {
      return 'initial' // 初期阶段
    }
  }

  // ==================== 会话总结 ====================
  
  getSessionSummary() {
    return {
      duration: this.getSessionDuration(),
      turnCount: this.conversationHistory.length,
      customerTurnCount: this.getCustomerTurns().length,
      keywordSummary: this.keywordMemory.getSummary(),
      intentSummary: this.intentMemory.getSummary(),
      conversationFlow: this.analyzeConversationFlow(),
      keyMoments: this.identifyKeyMoments()
    }
  }

  // 识别关键时刻
  identifyKeyMoments() {
    const moments = []

    // 检查是否有价格谈判
    const priceKeywords = this.keywordMemory.getKeywordsByUrgency('high')
    if (priceKeywords.includes('价格问题')) {
      const priceTurns = this.conversationHistory.filter(t => 
        t.keywords.includes('价格问题')
      )
      moments.push({
        type: 'price_discussion',
        turns: priceTurns.length,
        urgency: 'high'
      })
    }

    // 检查是否有成交推进意图
    const intentSummary = this.intentMemory.getSummary()
    if (intentSummary['成交推进'] || intentSummary['价格谈判']) {
      moments.push({
        type: 'closing_attempt',
        urgency: 'high'
      })
    }

    return moments
  }

  // ==================== 工具方法 ====================
  
  getSessionDuration() {
    if (!this.currentSession.startTime) return 0

    const endTime = this.currentSession.endTime || new Date().toISOString()
    const start = new Date(this.currentSession.startTime)
    const end = new Date(endTime)

    return Math.floor((end - start) / 1000) // 返回秒数
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  generateTurnId() {
    return `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  clearHistory() {
    this.conversationHistory = []
    this.keywordMemory.clear()
    this.intentMemory.clear()
  }

  // ==================== 导出功能 ====================
  
  exportSession() {
    return {
      session: this.currentSession,
      conversationHistory: this.conversationHistory,
      summary: this.getSessionSummary()
    }
  }

  // 导出为文本格式（便于记录）
  exportAsText() {
    const lines = []
    lines.push(`会议记录 - ${this.currentSession.startTime}`)
    lines.push(`会议时长: ${this.getSessionDuration()}秒`)
    lines.push(`对话轮数: ${this.conversationHistory.length}`)
    lines.push('')
    lines.push('=== 对话内容 ===')
    lines.push('')

    this.conversationHistory.forEach(turn => {
      const time = new Date(turn.timestamp).toLocaleTimeString()
      const speaker = turn.speaker === 'customer' ? '客户' : '我方'
      
      lines.push(`[${time}] ${speaker}:`)
      lines.push(`原文: ${turn.originalText}`)
      if (turn.translation) {
        lines.push(`翻译: ${turn.translation}`)
      }
      if (turn.keywords.length > 0) {
        lines.push(`关键词: ${turn.keywords.join(', ')}`)
      }
      lines.push('')
    })

    lines.push('=== 关键词统计 ===')
    const keywordSummary = this.keywordMemory.getSummary()
    Object.keys(keywordSummary).forEach(keyword => {
      const info = keywordSummary[keyword]
      lines.push(`${keyword}: ${info.totalCount}次 (紧急度: ${info.urgency})`)
    })

    return lines.join('\n')
  }
}

export default MeetingContext