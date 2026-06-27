<template>
  <div class="country-detail">
    <header class="header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <ArrowLeft />
          <span>返回行业</span>
        </div>
        <div class="logo">
          <div class="logo-icon">
            <MapLocation />
          </div>
          <span class="logo-text">AI Go Global</span>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/mail-assistant" class="nav-link">AI邮件助手</router-link>
          <router-link to="/meeting-assistant" class="nav-link">AI会议助手</router-link>
        </nav>
      </div>
    </header>

    <section class="country-main">
      <div class="country-hero">
        <div class="hero-bg">
          <div class="grid-pattern"></div>
          <div class="floating-orb orb-1"></div>
          <div class="floating-orb orb-2"></div>
        </div>
        <div class="hero-content">
          <h1 class="country-title">{{ pageTitle }}</h1>
          <p v-if="isLoading" class="country-subtitle">AI正在分析市场数据...</p>
          <p v-else class="country-subtitle">AI智能生成的完整市场进入策略报告</p>
        </div>
      </div>

      <div class="content-wrapper">
        <div v-if="!isLoading && aiData.overview" class="overview-section">
          <div class="overview-card main">
            <div class="overview-icon">
              <TrendCharts />
            </div>
            <div class="overview-content">
              <h3 class="overview-title">机会指数</h3>
              <p class="overview-desc highlight-value">{{ aiData.overview.opportunityScore }}</p>
            </div>
          </div>
          <div class="overview-card">
            <div class="overview-icon">
              <OfficeBuilding />
            </div>
            <div class="overview-content">
              <h3 class="overview-title">市场评级</h3>
              <p class="overview-desc">{{ aiData.overview.marketRating }}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">市场分析</h2>
            <p class="section-desc">深入了解目标市场的核心数据</p>
          </div>
          
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner">
              <Loading />
            </div>
            <p class="loading-text">AI正在分析市场数据...</p>
          </div>
          
          <div v-else class="market-analysis-grid">
            <div v-for="(item, index) in aiData.marketAnalysis" :key="item.title" class="market-card">
              <div class="market-icon" :style="{ background: marketColors[index] }">
                <component :is="getMarketIcon(item.title)" />
              </div>
              <h3 class="market-title">{{ item.title }}</h3>
              <p class="market-desc">{{ item.description }}</p>
              <div class="market-metrics">
                <div v-for="metric in item.metrics" :key="metric.label" class="metric-item">
                  <span class="metric-value">{{ metric.value }}</span>
                  <span class="metric-label">{{ metric.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">客户画像</h2>
            <p class="section-desc">精准定位目标客户群体</p>
          </div>
          
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner">
              <Loading />
            </div>
            <p class="loading-text">AI正在分析客户画像...</p>
          </div>
          
          <div v-else-if="aiData.customerProfile" class="customer-grid">
            <div class="customer-card">
              <div class="customer-header">
                <OfficeBuilding />
                <h3>目标客户类型</h3>
              </div>
              <ul class="customer-list">
                <li v-for="customer in aiData.customerProfile.targetCustomers" :key="customer">
                  <span class="list-icon">✓</span>
                  <span>{{ customer }}</span>
                </li>
              </ul>
            </div>
            <div class="customer-card">
              <div class="customer-header">
                <Wallet />
                <h3>采购决策人</h3>
              </div>
              <ul class="customer-list">
                <li v-for="person in aiData.customerProfile.decisionMakers" :key="person">
                  <span class="list-icon">✓</span>
                  <span>{{ person }}</span>
                </li>
              </ul>
            </div>
            <div class="customer-card">
              <div class="customer-header">
                <WarningFilled />
                <h3>客户痛点</h3>
              </div>
              <ul class="customer-list">
                <li v-for="pain in aiData.customerProfile.painPoints" :key="pain">
                  <span class="list-icon">!</span>
                  <span>{{ pain }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">推荐获客渠道</h2>
            <p class="section-desc">高效触达目标客户的渠道策略</p>
          </div>
          
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner">
              <Loading />
            </div>
            <p class="loading-text">AI正在分析获客渠道...</p>
          </div>
          
          <div v-else class="channel-grid">
            <div v-for="(channel, index) in aiData.customerChannels" :key="channel.name" class="channel-card">
              <div class="channel-header">
                <div class="channel-icon" :style="{ background: channelColors[index] }">
                  <component :is="getChannelIcon(channel.name)" />
                </div>
                <div class="channel-effect">
                  <span class="effect-label">效果</span>
                  <span class="effect-value">{{ channel.effectiveness }}%</span>
                </div>
              </div>
              <h3 class="channel-title">{{ channel.name }}</h3>
              <p class="channel-desc">{{ channel.description }}</p>
              <div class="channel-tags">
                <span v-for="tag in channel.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">市场进入策略</h2>
            <p class="section-desc">AI推荐的市场进入方案与风险提示</p>
          </div>
          
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner">
              <Loading />
            </div>
            <p class="loading-text">AI正在分析市场进入策略...</p>
          </div>
          
          <div v-else-if="aiData.marketStrategy" class="strategy-container">
            <div class="strategy-main">
              <div class="strategy-card recommended">
                <div class="strategy-badge">推荐模式</div>
                <h3>{{ aiData.marketStrategy.recommendedModel.title }}</h3>
                <p>{{ aiData.marketStrategy.recommendedModel.description }}</p>
                <div class="strategy-advantages">
                  <div v-for="adv in aiData.marketStrategy.recommendedModel.advantages" :key="adv" class="advantage-item">
                    <CircleCheck style="color: #10b981;" />
                    <span>{{ adv }}</span>
                  </div>
                </div>
              </div>
              <div class="strategy-card">
                <div class="strategy-badge">合作方式</div>
                <h3>{{ aiData.marketStrategy.cooperation.title }}</h3>
                <p>{{ aiData.marketStrategy.cooperation.description }}</p>
                <ul class="cooperation-list">
                  <li v-for="method in aiData.marketStrategy.cooperation.methods" :key="method">{{ method }}</li>
                </ul>
              </div>
            </div>
            <div class="strategy-warning">
              <div class="warning-icon"><WarningFilled /></div>
              <div class="warning-content">
                <h3>风险提示</h3>
                <ul>
                  <li v-for="risk in aiData.marketStrategy.risks" :key="risk">{{ risk }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">90天出海行动路线图</h2>
            <p class="section-desc">清晰的执行时间表</p>
          </div>
          
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner">
              <Loading />
            </div>
            <p class="loading-text">AI正在制定行动路线图...</p>
          </div>
          
          <div v-else class="roadmap">
            <div class="roadmap-line"></div>
            <div v-for="(phase, index) in aiData.roadmap" :key="phase.title" class="roadmap-item">
              <div class="roadmap-marker" :style="{ background: phaseColors[index] }">
                <span class="phase-number">{{ index + 1 }}</span>
              </div>
              <div class="roadmap-card">
                <div class="roadmap-header">
                  <h3>{{ phase.title }}</h3>
                  <span class="roadmap-duration">{{ phase.duration }}</span>
                </div>
                <p class="roadmap-desc">{{ phase.description }}</p>
                <div class="roadmap-tasks">
                  <div v-for="(task, tIndex) in phase.tasks" :key="tIndex" class="task-item">
                    <span class="task-dot"></span>
                    <span class="task-text">{{ task }}</span>
                  </div>
                </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  MapLocation, 
  ArrowLeft, 
  ArrowRight,
  OfficeBuilding,
  Wallet,
  TrendCharts,
  Box,
  PieChart,
  CreditCard,
  Lightning,
  CircleCheck,
  CircleClose,
  InfoFilled,
  WarningFilled,
  Promotion,
  Connection,
  Loading
} from '@element-plus/icons-vue'
import { analyzeCountry } from '../services/ai'

const route = useRoute()
const router = useRouter()

const countryId = ref('')
const industryId = ref('')
const industryName = ref('')
const countryName = ref('')
const isLoading = ref(true)

const aiData = ref({
  industry: '',
  country: '',
  overview: null,
  marketAnalysis: [],
  customerProfile: null,
  customerChannels: [],
  marketStrategy: null,
  roadmap: []
})

const pageTitle = computed(() => {
  const industry = industryName.value || '行业'
  const country = countryName.value || '国家'
  return `${country} - ${industry}出海市场分析`
})

const resetData = () => {
  aiData.value = {
    industry: '',
    country: '',
    overview: null,
    marketAnalysis: [],
    customerProfile: null,
    customerChannels: [],
    marketStrategy: null,
    roadmap: []
  }
}

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
  countryId.value = route.params.id
  industryId.value = route.query.industry || ''
  industryName.value = route.query.industryName 
    ? decodeURIComponent(route.query.industryName) 
    : ''
  countryName.value = route.query.countryName 
    ? decodeURIComponent(route.query.countryName) 
    : ''
  
  if (!countryName.value) {
    countryName.value = countryId.value
  }
  
  await loadAIData()
}

const loadAIData = async () => {
  resetData()
  isLoading.value = true
  
  const industry = industryName.value || industryId.value
  const country = countryName.value || countryId.value
  
  try {
    const result = await analyzeCountry(industryId.value, industry, countryId.value, country)
    aiData.value = {
      industry: result.industry || industry,
      country: result.country || country,
      overview: result.overview || null,
      marketAnalysis: result.marketAnalysis || [],
      customerProfile: result.customerProfile || null,
      customerChannels: result.customerChannels || [],
      marketStrategy: result.marketStrategy || null,
      roadmap: result.roadmap || []
    }
    
    if (!countryName.value && result.country) {
      countryName.value = result.country
    }
    if (!industryName.value && result.industry) {
      industryName.value = result.industry
    }
  } catch (error) {
    console.error('加载国家分析失败:', error)
  } finally {
    isLoading.value = false
  }
}

const marketColors = [
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
]

const channelColors = [
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
]

const phaseColors = [
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)'
]

const getMarketIcon = (title) => {
  const iconMap = {
    '市场需求': PieChart,
    '增长趋势': TrendCharts,
    '机会点': Lightning,
    '行业机会': Lightning
  }
  return iconMap[title] || PieChart
}

const getChannelIcon = (name) => {
  const iconMap = {
    '行业展会': Promotion,
    'LinkedIn': Connection,
    '代理商': OfficeBuilding,
    'Google SEO': InfoFilled
  }
  return iconMap[name] || Promotion
}

const goBack = () => {
  if (industryId.value) {
    const query = {}
    if (industryName.value) {
      query.product = encodeURIComponent(industryName.value)
    }
    router.push({
      path: `/industry/${industryId.value}`,
      query
    })
  } else {
    router.back()
  }
}
</script>

<style scoped>
.country-detail {
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

.country-main {
  padding-top: 80px;
}

.country-hero {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  width: 300px;
  height: 300px;
  background: rgba(124, 58, 237, 0.5);
  top: -100px;
  left: -50px;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: rgba(0, 212, 255, 0.5);
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 30px) scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.country-title {
  font-size: 44px;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 12px;
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.country-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.overview-section {
  display: flex;
  gap: 20px;
  margin-bottom: 48px;
  margin-top: -40px;
  position: relative;
  z-index: 20;
}

.overview-card {
  flex: 1;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.overview-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.overview-card.main {
  flex: 1.5;
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.overview-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 24px;
}

.overview-content {
  flex: 1;
}

.overview-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  font-weight: var(--font-weight-normal);
}

.overview-desc {
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.highlight-value {
  font-size: 28px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.market-analysis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.market-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.market-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.market-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.market-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.market-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: auto;
}

.market-metrics {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.metric-item {
  flex: 1;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

.customer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.customer-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.customer-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.customer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: var(--color-primary);
}

.customer-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.customer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.customer-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.list-icon {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.channel-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.channel-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.channel-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.channel-effect {
  text-align: right;
}

.effect-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.effect-value {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: var(--color-success);
}

.channel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.channel-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: 12px;
}

.channel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: var(--font-size-xs);
  padding: 4px 10px;
  background: rgba(0, 212, 255, 0.1);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
}

.strategy-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.strategy-main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.strategy-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 28px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.strategy-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.strategy-card.recommended {
  border-color: rgba(0, 212, 255, 0.3);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
}

.strategy-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  border-radius: var(--radius-full);
  margin-bottom: 16px;
}

.strategy-card h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.strategy-card p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: 16px;
}

.strategy-advantages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.cooperation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cooperation-list li {
  position: relative;
  padding-left: 20px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.cooperation-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
}

.strategy-warning {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: rgba(245, 158, 11, 0.08);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.warning-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: rgba(245, 158, 11, 0.15);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-size: 24px;
}

.warning-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin-bottom: 12px;
}

.warning-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.warning-content li {
  position: relative;
  padding-left: 20px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.warning-content li::before {
  content: '⚠';
  position: absolute;
  left: 0;
  font-size: 11px;
}

.roadmap {
  position: relative;
  padding: 20px 0;
}

.roadmap-line {
  position: absolute;
  left: 28px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.5) 0%, rgba(124, 58, 237, 0.5) 100%);
}

.roadmap-item {
  position: relative;
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.roadmap-item:last-child {
  margin-bottom: 0;
}

.roadmap-marker {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: var(--shadow-md);
}

.phase-number {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: white;
}

.roadmap-card {
  flex: 1;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.roadmap-card:hover {
  border-color: var(--color-border-hover);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.roadmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.roadmap-header h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.roadmap-duration {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  background: rgba(0, 212, 255, 0.1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.roadmap-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: 16px;
}

.roadmap-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.task-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
}

.footer {
  background: rgba(10, 14, 23, 0.95);
  border-top: 1px solid var(--color-border);
  padding: 32px;
  margin-top: 80px;
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

@media (max-width: 1024px) {
  .market-analysis-grid,
  .customer-grid {
    grid-template-columns: 1fr;
  }
  
  .channel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .strategy-main {
    grid-template-columns: 1fr;
  }
  
  .warning-content ul {
    grid-template-columns: 1fr;
  }
  
  .country-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .channel-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-section {
    flex-direction: column;
  }
  
  .country-title {
    font-size: 28px;
  }
  
  .content-wrapper {
    padding: 0 16px;
  }
  
  .header-content {
    padding: 12px 16px;
  }
}
</style>