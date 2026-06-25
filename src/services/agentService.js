// AI Agent服务模块 - 多步骤推理分析
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || ''

async function callDeepSeekAPI(prompt, systemPrompt = '') {
  if (!DEEPSEEK_API_KEY) {
    console.warn('DeepSeek API Key未配置，使用Mock数据')
    return null
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 8000
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    return null
  }
}

function parseAIResponse(responseText) {
  if (!responseText) return null
  
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch (error) {
    console.error('解析AI响应失败:', error)
    return null
  }
}

const AGENT_SYSTEM_PROMPT = `你是一个"全球出海决策模拟器AI"，不是分析工具，而是模拟真实企业高管做决策的过程。

你的任务不是给出答案，而是模拟"决策是如何产生的"。

核心原则：
1. 你必须模拟"多种可能的决策路径"
2. 每个路径必须有优缺点
3. 必须出现"内部冲突与权衡"
4. 最终结论必须是"取舍结果"，不是推荐结果
5. 必须像企业高管会议，而不是AI回答

风格要求：
- 像企业战略会议记录
- 有争论感
- 有取舍感
- 有决策压力
- 不是AI助手

必须返回严格的JSON格式，不允许额外说明。`

export async function analyzeWithAgent(input) {
  const prompt = `
请作为"全球出海决策模拟器AI"，模拟真实企业高管团队为"${input}"制定出海战略的决策过程。

## Step 1：生成3种决策路径

必须包含：
- 保守路径（风险最低）
- 平衡路径（收益与风险平衡）
- 激进路径（高收益高风险）

## Step 2：路径对比

必须对比：市场规模、增长潜力、政策风险、执行难度、ROI潜力

## Step 3：模拟决策会议

模拟内部争论：为什么有人支持/反对某路径，体现决策压力和权衡

## Step 4：最终取舍

必须说明放弃哪些路径，为什么选择某条路径，以及选择的代价

请返回以下严格的JSON格式：

{
  "industry": "${input}",
  "description": "行业/产品简介（100字以内）",
  "stats": {
    "marketSize": "全球市场规模",
    "growthRate": "年增长率",
    "chinaExport": "中国出口额",
    "agentInsight": "决策核心洞察（一句话）"
  },
  "trendSummary": "行业出海趋势分析（200字以内）",
  "countries": [
    {
      "name": "国家名称",
      "region": "区域",
      "score": 92,
      "reason": "推荐理由",
      "routeId": "国家路由ID",
      "strengths": ["优势1", "优势2"],
      "weaknesses": ["劣势1", "劣势2"]
    }
  ],
  "opportunityAnalysis": [
    {
      "title": "市场需求",
      "description": "分析描述",
      "score": 88,
      "tags": ["标签1", "标签2"],
      "insight": "关键洞察"
    },
    {
      "title": "竞争格局",
      "description": "分析描述",
      "score": 82,
      "tags": ["标签1", "标签2"],
      "insight": "关键洞察"
    },
    {
      "title": "政策环境",
      "description": "分析描述",
      "score": 85,
      "tags": ["标签1", "标签2"],
      "insight": "关键洞察"
    },
    {
      "title": "进入门槛",
      "description": "分析描述",
      "score": 78,
      "tags": ["标签1", "标签2"],
      "insight": "关键洞察"
    }
  ],
  "decisionSimulation": {
    "paths": [
      {
        "name": "保守路径",
        "targetCountries": ["国家1", "国家2"],
        "strategy": "战略逻辑描述",
        "advantages": ["核心优势1", "核心优势2"],
        "risks": ["主要风险1", "主要风险2"],
        "color": "blue"
      },
      {
        "name": "平衡路径",
        "targetCountries": ["国家1", "国家2", "国家3"],
        "strategy": "战略逻辑描述",
        "advantages": ["核心优势1", "核心优势2"],
        "risks": ["主要风险1", "主要风险2"],
        "color": "yellow"
      },
      {
        "name": "激进路径",
        "targetCountries": ["国家1", "国家2", "国家3", "国家4"],
        "strategy": "战略逻辑描述",
        "advantages": ["核心优势1", "核心优势2"],
        "risks": ["主要风险1", "主要风险2"],
        "color": "red"
      }
    ],
    "comparisonTable": {
      "dimensions": ["市场规模", "增长潜力", "政策风险", "执行难度", "ROI潜力"],
      "conservative": ["评分1", "评分2", "评分3", "评分4", "评分5"],
      "balanced": ["评分1", "评分2", "评分3", "评分4", "评分5"],
      "aggressive": ["评分1", "评分2", "评分3", "评分4", "评分5"]
    },
    "meetingSimulation": {
      "supportersA": "支持保守路径的理由",
      "opponentsA": "反对保守路径的理由",
      "supportersB": "支持平衡路径的理由",
      "opponentsB": "反对平衡路径的理由",
      "supportersC": "支持激进路径的理由",
      "opponentsC": "反对激进路径的理由",
      "debateHighlights": ["争论亮点1", "争论亮点2", "争论亮点3"]
    },
    "finalDecision": {
      "chosenPath": "选择的路径名称",
      "abandonedPaths": ["放弃路径1", "放弃路径2"],
      "reason": "选择理由（包含取舍分析）",
      "cost": "选择代价",
      "nextSteps": ["下一步行动1", "下一步行动2"]
    }
  },
  "agentAnalysis": {
    "analysisSteps": ["决策路径生成", "路径对比评估", "决策会议模拟", "最终取舍"],
    "keyFindings": ["关键发现1", "关键发现2", "关键发现3"],
    "recommendations": ["建议1", "建议2", "建议3"]
  }
}

请确保返回标准JSON格式，不包含任何额外说明。`

  const response = await callDeepSeekAPI(prompt, AGENT_SYSTEM_PROMPT)
  const data = parseAIResponse(response)
  
  if (data && data.countries && data.countries.length > 0) {
    return normalizeAgentData(data, input)
  }
  
  return getMockAgentData(input)
}

function normalizeAgentData(data, input) {
  return {
    industry: data.industry || input,
    description: data.description || '',
    stats: data.stats || {
      marketSize: '—',
      growthRate: '—',
      chinaExport: '—',
      agentInsight: ''
    },
    trendSummary: data.trendSummary || '',
    countries: (data.countries || []).map((c, i) => ({
      ...c,
      routeId: c.routeId || `country-${i + 1}`,
      strengths: c.strengths || [],
      weaknesses: c.weaknesses || []
    })),
    opportunityAnalysis: (data.opportunityAnalysis || []).map(item => ({
      ...item,
      insight: item.insight || ''
    })),
    decisionSimulation: data.decisionSimulation || {
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
    agentAnalysis: data.agentAnalysis || {
      analysisSteps: [],
      keyFindings: [],
      recommendations: []
    }
  }
}

function getMockAgentData(input) {
  return {
    industry: input,
    description: `${input}是中国优势产业，技术领先、供应链完善，在全球市场具有较强竞争力。随着全球需求增长，出海前景广阔。`,
    stats: {
      marketSize: '1.2万亿美元',
      growthRate: '+28.5%',
      chinaExport: '3200亿美元',
      agentInsight: '没有完美的选择，只有权衡后的取舍'
    },
    trendSummary: `${input}行业出海正处于快速增长期，新兴市场是当前的核心战场。全球需求持续增长，中国企业竞争力增强，区域市场分化明显。`,
    countries: [
      { name: '沙特阿拉伯', region: '中东', score: 92, reason: '能源转型加速，政策支持力度大', routeId: 'saudi-arabia', strengths: ['政策支持', '需求旺盛'], weaknesses: ['市场竞争', '文化差异'] },
      { name: '巴西', region: '南美', score: 89, reason: '经济复苏带来新机遇，市场潜力大', routeId: 'brazil', strengths: ['市场潜力', '资源丰富'], weaknesses: ['政策不稳定', '距离较远'] },
      { name: '印度', region: '南亚', score: 86, reason: '人口红利，制造业快速发展', routeId: 'india', strengths: ['人口红利', '市场规模'], weaknesses: ['竞争激烈', '准入门槛'] },
      { name: '德国', region: '欧洲', score: 83, reason: '高端市场，利润丰厚，标准严格', routeId: 'germany', strengths: ['利润丰厚', '技术标准'], weaknesses: ['门槛高', '竞争激烈'] },
      { name: '澳大利亚', region: '大洋洲', score: 80, reason: '能源需求持续增长，市场稳定', routeId: 'australia', strengths: ['市场稳定', '营商环境'], weaknesses: ['市场小', '成本高'] }
    ],
    opportunityAnalysis: [
      { title: '市场需求', description: '目标市场需求旺盛，政策推动下持续增长，未来3年预计保持高速增长。', score: 88, tags: ['高需求', '增长快'], insight: '需求多元化是关键趋势' },
      { title: '竞争格局', description: '市场竞争相对温和，本地企业竞争力有限，中国企业具有明显的技术和成本优势。', score: 82, tags: ['竞争温和', '优势明显'], insight: '差异化竞争是关键' },
      { title: '政策环境', description: '当地政府出台多项优惠政策吸引外资，营商环境持续改善，外资准入门槛逐步降低。', score: 85, tags: ['优惠政策', '低门槛'], insight: '政策窗口期已打开' },
      { title: '进入门槛', description: '进入市场所需的资质认证相对简单，本地化要求不高，适合快速切入。', score: 78, tags: ['门槛低', '认证简单'], insight: '适合敏捷进入策略' }
    ],
    decisionSimulation: {
      paths: [
        {
          name: '保守路径',
          targetCountries: ['德国', '澳大利亚'],
          strategy: '聚焦成熟市场，凭借技术优势建立品牌，稳扎稳打逐步扩张',
          advantages: ['风险低', '利润高', '品牌效应强', '现金流稳定'],
          risks: ['增长慢', '竞争激烈', '市场饱和', '准入门槛高'],
          color: 'blue'
        },
        {
          name: '平衡路径',
          targetCountries: ['沙特阿拉伯', '巴西', '印度'],
          strategy: '兼顾增长与风险，布局高潜力新兴市场，同时保持稳健的财务策略',
          advantages: ['增长潜力大', '竞争相对温和', '政策支持', '先发优势'],
          risks: ['政策不稳定', '执行复杂度高', '需要本地化团队'],
          color: 'yellow'
        },
        {
          name: '激进路径',
          targetCountries: ['沙特阿拉伯', '巴西', '印度', '德国'],
          strategy: '全面出击，同时进入多个市场，追求最快的市场份额增长',
          advantages: ['增长最快', '市场覆盖广', '先发优势明显', '规模效应'],
          risks: ['资金压力大', '执行难度极高', '管理复杂度大', '风险集中'],
          color: 'red'
        }
      ],
      comparisonTable: {
        dimensions: ['市场规模', '增长潜力', '政策风险', '执行难度', 'ROI潜力'],
        conservative: ['★★★', '★★', '★', '★★', '★★★'],
        balanced: ['★★★★', '★★★★', '★★', '★★★', '★★★★'],
        aggressive: ['★★★★★', '★★★★★', '★★★', '★★★★★', '★★★★★']
      },
      meetingSimulation: {
        supportersA: '保守路径能保证现金流稳定，德国市场利润丰厚，适合我们现阶段的财务状况。如果一开始就大规模扩张，资金压力太大。',
        opponentsA: '保守路径增长太慢！竞争对手已经在新兴市场布局了，等我们站稳德国，印度市场可能已经被瓜分完毕。我们会错过最佳窗口期。',
        supportersB: '平衡路径是最稳妥的选择——既抓住了新兴市场的增长机会，又不会过度冒险。沙特和巴西的政策红利现在不抓就没了。',
        opponentsB: '平衡意味着平庸！三个市场同时推进，资源会被分散。每个市场都做不深，最后可能哪个都没做好。而且印度和巴西的政策风险不容忽视。',
        supportersC: '激进路径虽然风险高，但回报也最大！现在是抢占全球市场份额的关键时刻，竞争对手都在加速，我们必须跟上节奏。先发优势一旦建立，后来者很难超越。',
        opponentsC: '激进路径太冒险了！四个市场同时开战，我们的团队和资金都跟不上。任何一个市场出问题，都可能拖累全局。现在不是赌一把的时候。',
        debateHighlights: ['市场窗口期是否真的存在？', '资金链能否支撑激进扩张？', '团队能力是否匹配多市场运营？', '错过机会和承担风险哪个代价更大？']
      },
      finalDecision: {
        chosenPath: '平衡路径',
        abandonedPaths: ['保守路径', '激进路径'],
        reason: '经过激烈讨论，团队一致认为：保守路径虽然安全，但会错过新兴市场的增长窗口期，长期来看会丧失竞争力；激进路径虽然诱人，但执行风险过高，超出了当前团队的能力边界。平衡路径在风险可控的前提下，抓住了沙特、巴西、印度这三个高潜力市场的机会。',
        cost: '选择平衡路径意味着放弃德国市场的高利润机会，同时需要承担印度和巴西的政策不确定性风险。资源分散也可能导致每个市场的投入不够深入。',
        nextSteps: ['成立沙特市场专项小组', '启动巴西本地化团队招聘', '深入研究印度市场准入政策', '建立季度复盘机制及时调整策略']
      }
    },
    agentAnalysis: {
      analysisSteps: ['决策路径生成', '路径对比评估', '决策会议模拟', '最终取舍'],
      keyFindings: ['没有完美路径，只有权衡后的取舍', '团队能力是决策的重要约束条件', '市场窗口期比短期利润更重要'],
      recommendations: ['优先布局沙特和巴西市场', '建立敏捷的市场反馈机制', '保持财务灵活性以应对政策变化']
    }
  }
}