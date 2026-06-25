<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <div class="logo" @click="goHome">
          <div class="logo-icon">
            <MapLocation />
          </div>
          <span class="logo-text">AI Go Global</span>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="hero-bg">
        <div class="grid-pattern"></div>
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          AI驱动的<span class="title-highlight">出海市场决策系统</span>
        </h1>
        <p class="hero-subtitle">选择行业，AI智能分析全球市场机会</p>
      </div>
    </section>

    <section class="main-content">
      <div class="cards-grid">
        <div 
          v-for="(card, index) in cards" 
          :key="card.id"
          class="tech-card"
          :class="{ 'hover': hoveredCard === index }"
          @mouseenter="hoveredCard = index"
          @mouseleave="hoveredCard = null"
          @click="handleCardClick(card.routeId)"
        >
          <div class="card-icon" :style="{ background: card.bgColor }">
            <component :is="card.icon" />
          </div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
          <div class="card-stats">
            <div class="mini-stat">
              <span class="mini-value">{{ card.statValue }}</span>
              <span class="mini-label">{{ card.statLabel }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-value growth">{{ card.growth }}</span>
              <span class="mini-label">同比增长</span>
            </div>
          </div>
        </div>
      </div>

      <div class="custom-analysis-section">
        <div class="section-header">
          <h2 class="section-title">AI自定义产品分析</h2>
          <p class="section-desc">输入任意产品，AI智能分析出海机会</p>
        </div>
        <div class="analysis-input-container">
          <el-input 
            v-model="productName"
            placeholder="请输入产品名称，例如光伏逆变器、工业机器人、LED灯、无人机等"
            class="analysis-input"
            @keyup.enter="analyzeProduct"
          />
          <el-button 
            type="primary" 
            class="analysis-button"
            :loading="isAnalyzing"
            @click="analyzeProduct"
          >
            <Search />
            <span>普通分析</span>
          </el-button>
          <el-button 
            type="warning" 
            class="analysis-button agent-button"
            :loading="isAgentAnalyzing"
            @click="analyzeWithAgentMode"
          >
            <span>🧠 Agent分析</span>
          </el-button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MapLocation, 
  Search,
  Sunny,
  Lightning,
  Cpu,
  Box,
  CreditCard,
  Star
} from '@element-plus/icons-vue'

const hoveredCard = ref(null)
const router = useRouter()
const productName = ref('')
const isAnalyzing = ref(false)
const isAgentAnalyzing = ref(false)

const goHome = () => {
  router.push('/')
}

const handleCardClick = (routeId) => {
  router.push(`/industry/${routeId}`)
}

const analyzeProduct = () => {
  if (!productName.value.trim()) {
    return
  }
  isAnalyzing.value = true
  const encodedName = encodeURIComponent(productName.value.trim())
  setTimeout(() => {
    router.push(`/industry/custom?product=${encodedName}&mode=normal`)
  }, 300)
}

const analyzeWithAgentMode = () => {
  if (!productName.value.trim()) {
    return
  }
  isAgentAnalyzing.value = true
  const encodedName = encodeURIComponent(productName.value.trim())
  setTimeout(() => {
    router.push(`/industry/custom?product=${encodedName}&mode=agent`)
  }, 300)
}

const cards = [
  {
    id: 1,
    routeId: 'solar',
    title: '光伏新能源',
    desc: '太阳能发电与光伏产业解决方案',
    icon: Sunny,
    bgColor: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    statValue: '28.5GW',
    statLabel: '装机容量',
    growth: '+35.2%'
  },
  {
    id: 2,
    routeId: 'energy-storage',
    title: '储能',
    desc: '先进储能技术与系统集成',
    icon: Lightning,
    bgColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    statValue: '15.2GWh',
    statLabel: '储能规模',
    growth: '+42.8%'
  },
  {
    id: 3,
    routeId: 'semiconductor',
    title: '半导体',
    desc: '芯片设计与半导体制造技术',
    icon: Cpu,
    bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    statValue: '5nm',
    statLabel: '制程工艺',
    growth: '+28.6%'
  },
  {
    id: 4,
    routeId: 'robotics',
    title: '工业机器人',
    desc: '智能制造与工业自动化解决方案',
    icon: Box,
    bgColor: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    statValue: '12,800',
    statLabel: '机器人数量',
    growth: '+38.4%'
  },
  {
    id: 5,
    routeId: 'new-energy-vehicle',
    title: '新能源汽车',
    desc: '智能电动汽车与新能源出行',
    icon: CreditCard,
    bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    statValue: '580万辆',
    statLabel: '销量规模',
    growth: '+51.2%'
  },
  {
    id: 6,
    routeId: 'ai-software',
    title: 'AI软件',
    desc: '人工智能与智能软件应用',
    icon: Star,
    bgColor: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    statValue: '98.5%',
    statLabel: 'AI渗透率',
    growth: '+62.5%'
  }
]
</script>

<style scoped>
.home-container {
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
  justify-content: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform var(--transition-normal);
}

.logo:hover {
  transform: scale(1.02);
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
  box-shadow: 0 0 20px var(--color-glow-primary);
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
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px;
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
  animation-delay: 0s;
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
}

.hero-title {
  font-size: 44px;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 16px;
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.title-highlight {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.tech-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: 28px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-slow);
  backdrop-filter: blur(10px);
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

.tech-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  padding: 1px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.tech-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.tech-card:hover::before {
  opacity: 1;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: auto;
  line-height: var(--line-height-relaxed);
}

.card-stats {
  display: flex;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  margin-top: 16px;
}

.mini-stat {
  flex: 1;
}

.mini-value {
  display: block;
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.mini-value.growth {
  color: var(--color-success);
}

.mini-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
  display: block;
}

.custom-analysis-section {
  margin-top: 64px;
  padding: 48px;
  background: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  backdrop-filter: blur(20px);
}

.custom-analysis-section .section-header {
  text-align: center;
  margin-bottom: 36px;
}

.custom-analysis-section .section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.custom-analysis-section .section-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.analysis-input-container {
  display: flex;
  gap: 12px;
  max-width: 720px;
  margin: 0 auto;
}

.analysis-input {
  flex: 1;
}

.analysis-input :deep(.el-input__wrapper) {
  background: rgba(10, 14, 23, 0.9);
  border-color: var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
}

.analysis-input :deep(.el-input__wrapper:hover) {
  border-color: var(--color-border-hover);
  box-shadow: 0 0 15px var(--color-glow-primary);
}

.analysis-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 20px var(--color-glow-primary);
}

.analysis-input :deep(.el-input__placeholder) {
  color: var(--color-text-muted);
}

.analysis-input :deep(.el-input__inner) {
  color: var(--color-text-primary);
}

.analysis-button {
  padding: 0 32px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border: none;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition-normal);
  height: 48px;
}

.analysis-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--color-glow-primary);
}

.analysis-button:active {
  transform: translateY(0);
}

.analysis-button.agent-button {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
}

.analysis-button.agent-button:hover {
  box-shadow: 0 8px 25px var(--color-glow-accent);
}

.analysis-button :deep(.el-icon) {
  font-size: 16px;
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
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: var(--font-size-base);
  }
  
  .header-content {
    padding: 12px 16px;
  }
  
  .main-content {
    padding: 24px 16px;
  }
  
  .custom-analysis-section {
    padding: 24px;
  }
  
  .analysis-input-container {
    flex-direction: column;
  }
  
  .analysis-button {
    justify-content: center;
  }
}
</style>
