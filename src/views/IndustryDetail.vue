<template>
  <div class="industry-detail">
    <header class="header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <ArrowLeft />
          <span>返回首页</span>
        </div>
        <div class="logo">
          <div class="logo-icon">
            <MapLocation />
          </div>
          <span class="logo-text">AI Go Global</span>
        </div>
        <div style="width: 100px;"></div>
      </div>
    </header>

    <section class="hero">
      <div class="hero-bg">
        <div class="grid-pattern"></div>
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
      </div>
      <div class="hero-content">
        <h1 class="industry-title">{{ industryName }}</h1>
        <p class="industry-desc">{{ aiData.description || 'AI分析中...' }}</p>
        
        <div class="mode-switch">
          <el-button 
            :class="{ active: analysisMode === 'normal' }"
            @click="switchMode('normal')"
          >
            <Search />
            <span>普通分析</span>
          </el-button>
          <el-button 
            :class="{ active: analysisMode === 'agent', agent }"
            @click="switchMode('agent')"
          >
            <Star />
            <span>🧠 Agent分析</span>
          </el-button>
        </div>
        
        <div v-if="isLoading" class="hero-loading">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p>{{ analysisMode === 'agent' ? 'AI正在进行多步骤深度分析...' : 'AI正在分析全球市场数据...' }}</p>
        </div>
        
        <div v-else class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ aiData.stats.marketSize }}</span>
            <span class="stat-label">全球市场规模</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ aiData.stats.growthRate }}</span>
            <span class="stat-label">年增长率</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ aiData.stats.chinaExport }}</span>
            <span class="stat-label">中国出口额</span>
          </div>
        </div>
      </div>
    </section>

    <section class="main-content">
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">全球市场机会排行榜</h2>
          <p class="section-desc">基于市场需求、竞争格局、政策环境综合评估</p>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">
            <Loading />
          </div>
          <p class="loading-text">AI正在分析全球市场机会...</p>
        </div>
        
        <div v-else class="ranking-list">
          <div 
            v-for="(item, index) in aiData.countries" 
            :key="item.name"
            class="ranking-item"
            :class="{ 'top-three': index < 3 }"
            @click="goToCountry(item)"
          >
            <div class="rank-badge" :class="'rank-' + Math.min(index + 1, 5)">
              {{ index + 1 }}
            </div>
            <div class="country-info">
              <span class="country-name">{{ item.name }}</span>
              <span class="country-region">{{ item.region }}</span>
              <span v-if="item.reason" class="country-reason">{{ item.reason }}</span>
            </div>
            <div class="opportunity-score">
              <el-progress 
                :percentage="item.score" 
                :color="getProgressColor(item.score)"
                :stroke-width="8"
                :show-text="false"
              />
              <span class="score-value">{{ item.score }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && aiData.trendSummary" class="section">
        <div class="section-header">
          <h2 class="section-title">行业整体出海趋势</h2>
          <p class="section-desc">AI深度分析行业发展趋势与机遇</p>
        </div>
        <div class="trend-card">
          <div class="trend-icon">
            <TrendCharts />
          </div>
          <div class="trend-content">
            <p class="trend-text">{{ aiData.trendSummary }}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">行业出海机会分析</h2>
          <p class="section-desc">四大维度深度评估出海可行性</p>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">
            <Loading />
          </div>
          <p class="loading-text">AI正在分析出海机会...</p>
        </div>
        
        <div v-else class="analysis-grid">
          <div 
            v-for="(item, index) in aiData.opportunityAnalysis" 
            :key="item.title"
            class="analysis-card"
          >
            <div class="analysis-header">
              <div class="analysis-icon" :style="{ background: analysisColors[index] }">
                <component :is="getAnalysisIcon(item.title)" />
              </div>
              <div class="analysis-score">
                <span class="score-num">{{ item.score }}</span>
                <span class="score-label">评分</span>
              </div>
            </div>
            <h3 class="analysis-title">{{ item.title }}</h3>
            <p class="analysis-desc">{{ item.description }}</p>
            <div class="analysis-tags">
              <el-tag 
                v-for="tag in item.tags" 
                :key="tag" 
                :type="getTagType(tag)"
                size="small"
                effect="dark"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && aiData.decisionSimulation && aiData.decisionSimulation.paths && aiData.decisionSimulation.paths.length > 0" class="section">
        <div class="section-header">
          <h2 class="section-title">🧠 出海决策模拟器</h2>
          <p class="section-desc">模拟真实企业高管团队的决策过程</p>
        </div>
        
        <div v-if="aiData.stats.agentInsight" class="agent-insight">
          <Star />
          <span>{{ aiData.stats.agentInsight }}</span>
        </div>

        <div class="simulation-section">
          <h3 class="simulation-title">① 决策路径生成</h3>
          <div class="paths-grid">
            <div 
              v-for="(path, index) in aiData.decisionSimulation.paths" 
              :key="index"
              class="path-card"
              :class="'path-' + path.color"
            >
              <div class="path-header">
                <span class="path-number">{{ index + 1 }}</span>
                <h4 class="path-name">{{ path.name }}</h4>
              </div>
              <p class="path-strategy">{{ path.strategy }}</p>
              <div class="path-countries">
                <span class="countries-label">目标国家：</span>
                <span class="countries-list">{{ path.targetCountries.join('、') }}</span>
              </div>
              <div class="path-pros-cons">
                <div class="pros">
                  <span class="pros-label">优势</span>
                  <div class="pros-list">
                    <span v-for="(adv, i) in path.advantages" :key="i" class="pro-tag">{{ adv }}</span>
                  </div>
                </div>
                <div class="cons">
                  <span class="cons-label">风险</span>
                  <div class="cons-list">
                    <span v-for="(risk, i) in path.risks" :key="i" class="con-tag">{{ risk }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="simulation-section">
          <h3 class="simulation-title">② 路径对比表</h3>
          <div class="comparison-table-container">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>维度</th>
                  <th class="col-conservative">保守路径</th>
                  <th class="col-balanced">平衡路径</th>
                  <th class="col-aggressive">激进路径</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(dim, index) in aiData.decisionSimulation.comparisonTable.dimensions" :key="index">
                  <td class="dim-cell">{{ dim }}</td>
                  <td>{{ aiData.decisionSimulation.comparisonTable.conservative[index] || '—' }}</td>
                  <td>{{ aiData.decisionSimulation.comparisonTable.balanced[index] || '—' }}</td>
                  <td>{{ aiData.decisionSimulation.comparisonTable.aggressive[index] || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="simulation-section">
          <h3 class="simulation-title">③ 决策会议模拟</h3>
          <div class="meeting-container">
            <div class="meeting-card meeting-pro">
              <div class="meeting-role">
                <span class="role-badge pro">支持方</span>
                <span class="role-path">保守路径</span>
              </div>
              <p class="meeting-content">{{ aiData.decisionSimulation.meetingSimulation.supportersA }}</p>
            </div>
            <div class="meeting-card meeting-con">
              <div class="meeting-role">
                <span class="role-badge con">反对方</span>
                <span class="role-path">保守路径</span>
              </div>
              <p class="meeting-content">{{ aiData.decisionSimulation.meetingSimulation.opponentsA }}</p>
            </div>
            <div class="meeting-card meeting-pro">
              <div class="meeting-role">
                <span class="role-badge pro">支持方</span>
                <span class="role-path">平衡路径</span>
              </div>
              <p class="meeting-content">{{ aiData.decisionSimulation.meetingSimulation.supportersB }}</p>
            </div>
            <div class="meeting-card meeting-con">
              <div class="meeting-role">
                <span class="role-badge con">反对方</span>
                <span class="role-path">平衡路径</span>
              </div>
              <p class="meeting-content">{{ aiData.decisionSimulation.meetingSimulation.opponentsB }}</p>
            </div>
            <div class="meeting-card meeting-pro">
              <div class="meeting-role">
                <span class="role-badge pro">支持方</span>
                <span class="role-path">激进路径</span>
              </div>
              <p class="meeting-content">{{ aiData.decisionSimulation.meetingSimulation.supportersC }}</p>
            </div>
            <div class="meeting-card meeting-con">
              <div class="meeting-role">
                <span class="role-badge con">反对方</span>
                <span class="role-path">激进路径</span>
              </div>
              <p class="meeting-content">{{ aiData.decisionSimulation.meetingSimulation.opponentsC }}</p>
            </div>
          </div>
          <div v-if="aiData.decisionSimulation.meetingSimulation.debateHighlights && aiData.decisionSimulation.meetingSimulation.debateHighlights.length > 0" class="debate-highlights">
            <span class="highlights-label">争论焦点：</span>
            <div class="highlights-list">
              <span v-for="(highlight, i) in aiData.decisionSimulation.meetingSimulation.debateHighlights" :key="i" class="highlight-tag">❓ {{ highlight }}</span>
            </div>
          </div>
        </div>

        <div class="simulation-section final-decision-section">
          <h3 class="simulation-title">④ 最终取舍结果</h3>
          <div class="final-decision-card">
            <div class="decision-chosen">
              <span class="chosen-label">最终选择</span>
              <span class="chosen-path" :class="'path-' + getChosenPathColor(aiData.decisionSimulation.finalDecision.chosenPath)">{{ aiData.decisionSimulation.finalDecision.chosenPath }}</span>
            </div>
            <div class="decision-abandoned">
              <span class="abandoned-label">放弃路径</span>
              <div class="abandoned-list">
                <span v-for="(path, i) in aiData.decisionSimulation.finalDecision.abandonedPaths" :key="i" class="abandoned-tag">✗ {{ path }}</span>
              </div>
            </div>
            <div class="decision-reason">
              <span class="reason-label">选择理由</span>
              <p>{{ aiData.decisionSimulation.finalDecision.reason }}</p>
            </div>
            <div class="decision-cost">
              <span class="cost-label">选择代价</span>
              <p>{{ aiData.decisionSimulation.finalDecision.cost }}</p>
            </div>
            <div class="decision-next-steps">
              <span class="next-label">下一步行动</span>
              <div class="next-list">
                <span v-for="(step, i) in aiData.decisionSimulation.finalDecision.nextSteps" :key="i" class="next-tag">{{ i + 1 }}. {{ step }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2 class="section-title">推荐目标国家</h2>
          <p class="section-desc">AI分析推荐的出海目的地（与排行榜一致）</p>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">
            <Loading />
          </div>
          <p class="loading-text">AI正在分析推荐目标国家...</p>
        </div>
        
        <div v-else class="country-grid">
          <div 
            v-for="(country, index) in aiData.countries" 
            :key="country.name"
            class="country-card"
            @click="goToCountry(country)"
          >
            <div class="country-rank" :class="'rank-' + Math.min(index + 1, 5)">{{ index + 1 }}</div>
            <div class="country-content">
              <h3 class="country-title">{{ country.name }}</h3>
              <p class="country-region-text">{{ country.region }}</p>
              <p class="country-desc">{{ country.reason }}</p>
              <div class="country-score-box">
                <span class="score-num">{{ country.score }}</span>
                <span class="score-label">机会指数</span>
              </div>
            </div>
            <div class="country-arrow">
              <ArrowRight />
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  MapLocation, 
  ArrowLeft, 
  ArrowRight,
  TrendCharts,
  PieChart,
  Wallet,
  CircleClose,
  Loading,
  Star
} from '@element-plus/icons-vue'
import { analyzeIndustry } from '../services/ai'
import { analyzeWithAgent } from '../services/agentService'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const industryId = ref('')
const productName = ref('')
const analysisMode = ref('normal')

const aiData = ref({
  industry: '',
  description: '',
  stats: {
    marketSize: '—',
    growthRate: '—',
    chinaExport: '—',
    agentInsight: ''
  },
  trendSummary: '',
  countries: [],
  opportunityAnalysis: [],
  decisionSimulation: {
    paths: [],
    comparisonTable: {
      dimensions: [],
      conservative: [],
      balanced: [],
      aggressive: []
    },
    meetingSimulation: {},
    finalDecision: {}
  },
  agentAnalysis: {
    analysisSteps: [],
    keyFindings: [],
    recommendations: []
  }
})

const resetData = () => {
  aiData.value = {
    industry: '',
    description: '',
    stats: {
      marketSize: '—',
      growthRate: '—',
      chinaExport: '—',
      agentInsight: ''
    },
    trendSummary: '',
    countries: [],
    opportunityAnalysis: [],
    decisionSimulation: {
      paths: [],
      comparisonTable: {
        dimensions: [],
        conservative: [],
        balanced: [],
        aggressive: []
      },
      meetingSimulation: {},
      finalDecision: {}
    },
    agentAnalysis: {
      analysisSteps: [],
      keyFindings: [],
      recommendations: []
    }
  }
}

const industryName = computed(() => {
  if (industryId.value === 'custom') {
    return decodeURIComponent(productName.value) || '自定义产品'
  }
  const industryMap = {
    solar: '光伏产业',
    'energy-storage': '储能产业',
    semiconductor: '半导体产业',
    robotics: '工业机器人',
    'new-energy-vehicle': '新能源汽车',
    'ai-software': 'AI软件'
  }
  return industryMap[industryId.value] || aiData.value.industry || '行业分析'
})

onMounted(async () => {
  await loadFromRoute()
})

watch(() => route.params.id, async () => {
  await loadFromRoute()
})

watch(() => route.query, async () => {
  await loadFromRoute()
}, { deep: true })

const loadFromRoute = async () => {
  industryId.value = route.params.id
  productName.value = route.query.product || ''
  analysisMode.value = route.query.mode || 'normal'
  await loadAIData()
}

const loadAIData = async () => {
  resetData()
  isLoading.value = true
  
  const name = industryId.value === 'custom' 
    ? decodeURIComponent(productName.value) || '自定义产品'
    : industryName.value
  
  try {
    let result
    if (analysisMode.value === 'agent') {
      result = await analyzeWithAgent(name)
    } else {
      result = await analyzeIndustry(industryId.value, name)
    }
    
    aiData.value = {
      industry: result.industry || name,
      description: result.description || '',
      stats: result.stats || {
        marketSize: '—',
        growthRate: '—',
        chinaExport: '—',
        agentInsight: ''
      },
      trendSummary: result.trendSummary || '',
      countries: result.countries || [],
      opportunityAnalysis: result.opportunityAnalysis || [],
      decisionSimulation: result.decisionSimulation || {
        paths: [],
        comparisonTable: {
          dimensions: [],
          conservative: [],
          balanced: [],
          aggressive: []
        },
        meetingSimulation: {},
        finalDecision: {}
      },
      agentAnalysis: result.agentAnalysis || {
        analysisSteps: [],
        keyFindings: [],
        recommendations: []
      }
    }
  } catch (error) {
    console.error('加载分析失败:', error)
  } finally {
    isLoading.value = false
  }
}

const switchMode = (mode) => {
  if (mode === analysisMode.value) return
  analysisMode.value = mode
  
  router.push({
    path: `/industry/${industryId.value}`,
    query: {
      product: productName.value,
      mode
    }
  })
}

const analysisColors = [
  'linear-gradient(135deg, #00d4ff 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
]

const getAnalysisIcon = (title) => {
  const iconMap = {
    '市场需求': PieChart,
    '竞争格局': TrendCharts,
    '政策环境': Wallet,
    '进入门槛': CircleClose
  }
  return iconMap[title] || PieChart
}

const getProgressColor = (score) => {
  if (score >= 90) return '#10b981'
  if (score >= 80) return '#3b82f6'
  if (score >= 70) return '#f59e0b'
  return '#ef4444'
}

const getTagType = (tag) => {
  if (tag.includes('高') || tag.includes('快') || tag.includes('优') || tag.includes('低')) return 'success'
  if (tag.includes('中') || tag.includes('温和')) return 'warning'
  return 'info'
}

const getChosenPathColor = (pathName) => {
  if (pathName?.includes('保守')) return 'blue'
  if (pathName?.includes('平衡')) return 'yellow'
  if (pathName?.includes('激进')) return 'red'
  return 'blue'
}

const goBack = () => {
  router.push('/')
}

const goToCountry = (country) => {
  router.push({
    path: `/country/${country.routeId || country.name.toLowerCase().replace(/\s+/g, '-')}`,
    query: { 
      industry: industryId.value,
      industryName: encodeURIComponent(industryName.value),
      countryName: encodeURIComponent(country.name)
    }
  })
}
</script>

<style scoped>
.industry-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 50%, var(--color-bg-primary) 100%);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 14, 23, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  padding: 8px 16px;
  border-radius: var(--radius-md);
}

.back-btn:hover {
  background: rgba(0, 212, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
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
  font-size: 20px;
}

.logo-text {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 100px 32px 60px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 15s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(124, 58, 237, 0.5);
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(0, 212, 255, 0.5);
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 50px) scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 900px;
}

.industry-title {
  font-size: 48px;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 16px;
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.industry-desc {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 80px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 48px;
}

.section {
  margin-bottom: 64px;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.section-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  margin-bottom: 16px;
}

.loading-spinner :deep(.el-icon) {
  font-size: 48px;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.ranking-item:hover {
  border-color: var(--color-border-hover);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.ranking-item.top-three {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
  border-color: rgba(0, 212, 255, 0.2);
}

.rank-badge {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: 18px;
  background: rgba(30, 58, 95, 0.5);
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.rank-1 { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #ffffff; }
.rank-2 { background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%); color: #ffffff; }
.rank-3 { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; }
.rank-4, .rank-5 { background: rgba(30, 58, 95, 0.8); color: var(--color-text-muted); }

.country-info {
  flex: 1;
}

.country-name {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.country-region {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.country-reason {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.opportunity-score {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  width: 180px;
}

.opportunity-score :deep(.el-progress) {
  flex: 1;
}

.score-value {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  min-width: 40px;
  text-align: right;
}

.trend-card {
  display: flex;
  gap: 24px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border-radius: var(--radius-xl);
  padding: 32px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.trend-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.trend-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  z-index: 1;
}

.trend-content {
  flex: 1;
  z-index: 1;
}

.trend-text {
  font-size: var(--font-size-lg);
  color: #e5e7eb;
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.analysis-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
  min-height: 220px;
}

.analysis-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.analysis-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.analysis-score {
  text-align: right;
}

.analysis-score .score-num {
  display: block;
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.analysis-score .score-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.analysis-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.analysis-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-bottom: 16px;
  min-height: 60px;
}

.analysis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.country-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.country-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.country-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.country-rank {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: 13px;
  background: rgba(30, 58, 95, 0.5);
  color: var(--color-text-muted);
}

.country-content {
  flex: 1;
}

.country-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 6px;
}

.country-region-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin: 0 0 8px;
}

.country-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.country-score-box {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.country-score-box .score-num {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.country-score-box .score-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.country-arrow {
  display: flex;
  justify-content: flex-end;
  color: var(--color-primary);
  font-size: 16px;
}

.footer {
  background: rgba(10, 14, 23, 0.95);
  border-top: 1px solid var(--color-border);
  padding: 32px;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-copyright {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

@media (max-width: 1200px) {
  .analysis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .country-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .hero-stats {
    gap: 48px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .industry-title {
    font-size: 36px;
  }
}

.mode-switch {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
}

.mode-switch :deep(.el-button) {
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  background: rgba(30, 58, 95, 0.5);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.mode-switch :deep(.el-button:hover) {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-border-hover);
  color: var(--color-primary);
}

.mode-switch :deep(.el-button.active) {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-color: transparent;
  color: white;
}

.mode-switch :deep(.el-button.agent.active) {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
}

.agent-analysis-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%);
  border-radius: var(--radius-xl);
  padding: 32px;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.agent-insight {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(245, 158, 11, 0.15);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  color: var(--color-accent);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.agent-insight :deep(.el-icon) {
  font-size: 20px;
}

.simulation-section {
  margin-bottom: 32px;
}

.simulation-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.paths-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.path-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 2px solid transparent;
  transition: all var(--transition-normal);
}

.path-card.path-blue {
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, var(--color-bg-card) 100%);
}

.path-card.path-yellow {
  border-color: rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--color-bg-card) 100%);
}

.path-card.path-red {
  border-color: rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, var(--color-bg-card) 100%);
}

.path-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.path-number {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
}

.path-card.path-blue .path-number {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.path-card.path-yellow .path-number {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
}

.path-card.path-red .path-number {
  background: linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-hover) 100%);
}

.path-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.path-strategy {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 12px;
}

.path-countries {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.countries-label {
  font-weight: var(--font-weight-medium);
}

.countries-list {
  color: var(--color-primary);
}

.path-pros-cons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pros, .cons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pros-label, .cons-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.pros-label {
  color: var(--color-success);
}

.cons-label {
  color: var(--color-danger);
}

.pros-list, .cons-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pro-tag {
  padding: 4px 10px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-success);
}

.con-tag {
  padding: 4px 10px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}

.comparison-table-container {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(17, 24, 39, 0.9);
  border-radius: 16px;
  overflow: hidden;
}

.comparison-table th,
.comparison-table td {
  padding: 14px 18px;
  text-align: center;
  border-bottom: 1px solid rgba(30, 58, 95, 0.5);
  font-size: 13px;
}

.comparison-table th {
  background: rgba(30, 58, 95, 0.5);
  color: #ffffff;
  font-weight: 600;
}

.comparison-table td {
  color: #d1d5db;
}

.comparison-table .dim-cell {
  text-align: left;
  font-weight: 500;
  color: #9ca3af;
}

.comparison-table .col-conservative {
  color: #3b82f6;
}

.comparison-table .col-balanced {
  color: #f59e0b;
}

.comparison-table .col-aggressive {
  color: #ef4444;
}

.meeting-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.meeting-card {
  background: rgba(17, 24, 39, 0.9);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid transparent;
}

.meeting-pro {
  border-left-color: #10b981;
}

.meeting-con {
  border-left-color: #ef4444;
}

.meeting-role {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.role-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.pro {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.role-badge.con {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.role-path {
  font-size: 12px;
  color: #6b7280;
}

.meeting-content {
  font-size: 13px;
  color: #d1d5db;
  line-height: 1.6;
  margin: 0;
}

.debate-highlights {
  margin-top: 20px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.08);
  border-radius: 12px;
}

.highlights-label {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
  margin-bottom: 10px;
  display: block;
}

.highlights-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.highlight-tag {
  padding: 6px 14px;
  background: rgba(245, 158, 11, 0.15);
  border-radius: 20px;
  font-size: 12px;
  color: #d1d5db;
}

.final-decision-section {
  margin-top: 40px;
}

.final-decision-card {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.decision-chosen {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.chosen-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.chosen-path {
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.chosen-path.path-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.chosen-path.path-yellow {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.chosen-path.path-red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.decision-abandoned {
  margin-bottom: 20px;
}

.abandoned-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 10px;
  display: block;
}

.abandoned-list {
  display: flex;
  gap: 10px;
}

.abandoned-tag {
  padding: 6px 16px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  font-size: 13px;
  color: #ef4444;
}

.decision-reason,
.decision-cost,
.decision-next-steps {
  margin-bottom: 20px;
}

.reason-label,
.cost-label,
.next-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  display: block;
}

.decision-reason p,
.decision-cost p {
  font-size: 14px;
  color: #d1d5db;
  line-height: 1.7;
  margin: 0;
}

.decision-cost p {
  color: #f59e0b;
}

.next-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.next-tag {
  padding: 10px 16px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  font-size: 13px;
  color: #d1d5db;
}

@media (max-width: 1024px) {
  .paths-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .meeting-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .paths-grid {
    grid-template-columns: 1fr;
  }
  
  .meeting-container {
    grid-template-columns: 1fr;
  }
}
</style>
