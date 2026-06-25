// AI服务模块 - DeepSeek API集成
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
        temperature: 0.7,
        max_tokens: 6000
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

const SYSTEM_PROMPT = `你是一位专业的国际市场分析师，擅长为中国企业制定海外市场进入策略。所有分析必须基于真实市场数据，提供有决策价值的建议。请严格按照要求的JSON格式返回结果。`

export async function analyzeIndustry(industryId, industryName) {
  const prompt = `
请分析中国${industryName}行业的出海机会，返回严格的JSON格式：

{
  "industry": "${industryName}",
  "description": "行业简介（100字以内）",
  "stats": {
    "marketSize": "全球市场规模（如：1.2万亿美元）",
    "growthRate": "年增长率（如：+28.5%）",
    "chinaExport": "中国出口额（如：3200亿美元）"
  },
  "trendSummary": "行业整体出海趋势总结（200字以内）",
  "countries": [
    {
      "name": "国家名称",
      "region": "区域",
      "score": 92,
      "reason": "推荐理由（30字以内）",
      "routeId": "国家路由ID（英文小写，用-连接，如：saudi-arabia）"
    }
  ],
  "opportunityAnalysis": [
    {
      "title": "市场需求",
      "description": "分析描述（80字以内）",
      "score": 88,
      "tags": ["标签1", "标签2", "标签3"]
    },
    {
      "title": "竞争格局",
      "description": "分析描述（80字以内）",
      "score": 82,
      "tags": ["标签1", "标签2", "标签3"]
    },
    {
      "title": "政策环境",
      "description": "分析描述（80字以内）",
      "score": 85,
      "tags": ["标签1", "标签2", "标签3"]
    },
    {
      "title": "进入门槛",
      "description": "分析描述（80字以内）",
      "score": 78,
      "tags": ["标签1", "标签2", "标签3"]
    }
  ]
}

请返回5个国家，确保routeId格式正确（小写英文，-连接）。`

  const response = await callDeepSeekAPI(prompt, SYSTEM_PROMPT)
  const data = parseAIResponse(response)
  
  if (data && data.countries && data.countries.length > 0) {
    return normalizeIndustryData(data)
  }
  
  return getMockIndustryData(industryName)
}

export async function analyzeCountry(industryId, industryName, countryId, countryName) {
  const prompt = `
请为中国${industryName}企业进入${countryName}市场，提供完整的市场分析报告，返回严格的JSON格式：

{
  "industry": "${industryName}",
  "country": "${countryName}",
  "overview": {
    "opportunityScore": 85,
    "marketRating": "A"
  },
  "marketAnalysis": [
    {
      "title": "市场需求",
      "description": "分析描述（100字以内）",
      "metrics": [
        {"value": "数值", "label": "指标名称"},
        {"value": "数值", "label": "指标名称"}
      ]
    },
    {
      "title": "增长趋势",
      "description": "分析描述（100字以内）",
      "metrics": [
        {"value": "数值", "label": "指标名称"},
        {"value": "数值", "label": "指标名称"}
      ]
    },
    {
      "title": "行业机会",
      "description": "分析描述（100字以内）",
      "metrics": [
        {"value": "数值", "label": "指标名称"},
        {"value": "数值", "label": "指标名称"}
      ]
    }
  ],
  "customerProfile": {
    "targetCustomers": ["客户类型1", "客户类型2", "客户类型3", "客户类型4", "客户类型5"],
    "decisionMakers": ["决策人1", "决策人2", "决策人3", "决策人4"],
    "painPoints": ["痛点1", "痛点2", "痛点3", "痛点4"]
  },
  "customerChannels": [
    {
      "name": "行业展会",
      "description": "渠道描述（50字以内）",
      "tags": ["标签1", "标签2", "标签3"],
      "effectiveness": 95
    },
    {
      "name": "LinkedIn",
      "description": "渠道描述（50字以内）",
      "tags": ["标签1", "标签2", "标签3"],
      "effectiveness": 88
    },
    {
      "name": "代理商",
      "description": "渠道描述（50字以内）",
      "tags": ["标签1", "标签2", "标签3"],
      "effectiveness": 92
    },
    {
      "name": "Google SEO",
      "description": "渠道描述（50字以内）",
      "tags": ["标签1", "标签2", "标签3"],
      "effectiveness": 78
    }
  ],
  "marketStrategy": {
    "recommendedModel": {
      "title": "模式名称",
      "description": "模式描述（100字以内）",
      "advantages": ["优势1", "优势2", "优势3", "优势4"]
    },
    "cooperation": {
      "title": "合作方式名称",
      "description": "合作方式描述（80字以内）",
      "methods": ["方法1", "方法2", "方法3", "方法4"]
    },
    "risks": ["风险1", "风险2", "风险3", "风险4", "风险5"]
  },
  "roadmap": [
    {
      "title": "阶段名称",
      "duration": "第1-15天",
      "description": "阶段描述（80字以内）",
      "tasks": ["任务1", "任务2", "任务3", "任务4"]
    },
    {
      "title": "阶段名称",
      "duration": "第16-45天",
      "description": "阶段描述（80字以内）",
      "tasks": ["任务1", "任务2", "任务3", "任务4"]
    },
    {
      "title": "阶段名称",
      "duration": "第46-60天",
      "description": "阶段描述（80字以内）",
      "tasks": ["任务1", "任务2", "任务3", "任务4"]
    },
    {
      "title": "阶段名称",
      "duration": "第61-90天",
      "description": "阶段描述（80字以内）",
      "tasks": ["任务1", "任务2", "任务3", "任务4"]
    }
  ]
}

请确保返回标准JSON，不要添加额外说明。`

  const response = await callDeepSeekAPI(prompt, SYSTEM_PROMPT)
  const data = parseAIResponse(response)
  
  if (data && data.marketAnalysis) {
    return normalizeCountryData(data)
  }
  
  return getMockCountryData(industryName, countryName)
}

function normalizeIndustryData(data) {
  return {
    industry: data.industry || '',
    description: data.description || '',
    stats: data.stats || {
      marketSize: '—',
      growthRate: '—',
      chinaExport: '—'
    },
    trendSummary: data.trendSummary || '',
    countries: (data.countries || []).map((c, i) => ({
      ...c,
      routeId: c.routeId || `country-${i + 1}`
    })),
    opportunityAnalysis: data.opportunityAnalysis || []
  }
}

function normalizeCountryData(data) {
  return {
    industry: data.industry || '',
    country: data.country || '',
    overview: data.overview || {
      opportunityScore: 75,
      marketRating: 'B'
    },
    marketAnalysis: data.marketAnalysis || [],
    customerProfile: data.customerProfile || {
      targetCustomers: [],
      decisionMakers: [],
      painPoints: []
    },
    customerChannels: data.customerChannels || [],
    marketStrategy: data.marketStrategy || {
      recommendedModel: { title: '', description: '', advantages: [] },
      cooperation: { title: '', description: '', methods: [] },
      risks: []
    },
    roadmap: data.roadmap || []
  }
}

function getMockIndustryData(industryName) {
  return {
    industry: industryName,
    description: `${industryName}是中国优势产业，技术领先、供应链完善，在全球市场具有较强竞争力。随着全球需求增长，出海前景广阔。`,
    stats: {
      marketSize: 'AI生成中',
      growthRate: 'AI生成中',
      chinaExport: 'AI生成中'
    },
    trendSummary: `${industryName}行业出海正处于快速增长期，新兴市场是当前的核心战场。中国企业凭借技术和成本优势，在全球市场竞争力持续增强。建议优先布局高增长地区，逐步辐射全球市场。`,
    countries: [
      { name: '沙特阿拉伯', region: '中东', score: 92, reason: '能源转型加速，市场需求旺盛', routeId: 'saudi-arabia' },
      { name: '巴西', region: '南美', score: 89, reason: '资源丰富，经济复苏带来新机遇', routeId: 'brazil' },
      { name: '印度', region: '南亚', score: 86, reason: '人口红利，制造业快速发展', routeId: 'india' },
      { name: '德国', region: '欧洲', score: 83, reason: '高端市场，技术门槛高但利润丰厚', routeId: 'germany' },
      { name: '澳大利亚', region: '大洋洲', score: 80, reason: '资源型经济，能源需求持续增长', routeId: 'australia' }
    ],
    opportunityAnalysis: [
      { title: '市场需求', description: '目标市场需求旺盛，政策推动下持续增长，未来3年预计保持高速增长。', score: 88, tags: ['高需求', '增长快', '政策支持'] },
      { title: '竞争格局', description: '市场竞争相对温和，本地企业竞争力有限，中国企业具有明显的技术和成本优势。', score: 82, tags: ['竞争温和', '优势明显', '差异化'] },
      { title: '政策环境', description: '当地政府出台多项优惠政策吸引外资，营商环境持续改善，外资准入门槛逐步降低。', score: 85, tags: ['优惠政策', '低门槛', '营商友好'] },
      { title: '进入门槛', description: '进入市场所需的资质认证相对简单，本地化要求不高，适合快速切入。', score: 78, tags: ['门槛低', '认证简单', '快速切入'] }
    ]
  }
}

function getMockCountryData(industryName, countryName) {
  return {
    industry: industryName,
    country: countryName,
    overview: {
      opportunityScore: 85,
      marketRating: 'A'
    },
    marketAnalysis: [
      {
        title: '市场需求',
        description: `${countryName}${industryName}市场需求旺盛，受益于经济发展和政策推动，未来3年预计保持高速增长。`,
        metrics: [
          { value: '85%', label: '需求增长率' },
          { value: '92', label: '需求指数' }
        ]
      },
      {
        title: '增长趋势',
        description: '市场处于快速成长期，政策红利持续释放，投资热度不断攀升。',
        metrics: [
          { value: '+15%', label: '年复合增长率' },
          { value: '5年', label: '高速增长期' }
        ]
      },
      {
        title: '行业机会',
        description: '细分领域存在较大机会，适合中国企业发挥技术和成本优势。',
        metrics: [
          { value: '3-5个', label: '高机会领域' },
          { value: '80%', label: '成功率预估' }
        ]
      }
    ],
    customerProfile: {
      targetCustomers: [
        '大型制造业企业（年营收>1亿元）',
        '上市公司及国有企业',
        '跨国公司区域总部',
        '快速成长的中型企业',
        '政府机构及公共事业部门'
      ],
      decisionMakers: [
        'CEO/总裁 - 战略决策层',
        '采购总监 - 供应商选择',
        '技术总监 - 技术评估',
        '财务总监 - 预算审批'
      ],
      painPoints: [
        '产品质量不稳定，售后响应慢',
        '价格透明度低，议价成本高',
        '技术支持不足，本地化服务缺失',
        '交货周期长，供应链不稳定'
      ]
    },
    customerChannels: [
      { name: '行业展会', description: '参加当地知名行业展会，直接对接目标客户，展示产品优势', tags: ['线下接触', '建立信任', '获取线索'], effectiveness: 95 },
      { name: '代理商', description: '发展当地有资源的代理商，借助其渠道和网络快速开拓市场', tags: ['渠道拓展', '本地化', '资源共享'], effectiveness: 92 },
      { name: 'LinkedIn', description: '通过LinkedIn平台进行B2B营销，精准触达企业决策层', tags: ['数字化营销', '精准投放', '内容运营'], effectiveness: 88 },
      { name: 'Google SEO', description: '优化搜索引擎排名，获取自然流量，降低获客成本', tags: ['长期投资', '品牌建设', '流量获取'], effectiveness: 78 }
    ],
    marketStrategy: {
      recommendedModel: {
        title: '代理+直销混合模式',
        description: '前期通过代理商快速打开市场，建立渠道网络；中后期逐步建立直销团队，提升利润率和客户掌控力。',
        advantages: ['降低市场进入风险', '快速建立销售渠道', '利用代理商本地资源', '保持客户直接沟通']
      },
      cooperation: {
        title: '本地合作伙伴',
        description: '与当地企业建立战略合作关系，借助其资源和渠道快速进入市场。',
        methods: ['独家代理协议', '合资企业模式', '技术授权合作', '分销渠道合作']
      },
      risks: [
        '汇率波动风险：建议使用人民币或美元结算',
        '政策变化风险：关注当地外资政策调整',
        '竞争加剧风险：提前做好差异化竞争准备',
        '收款风险：建议使用信用证或预付款方式',
        '人才流失风险：培养本地核心团队'
      ]
    },
    roadmap: [
      { title: '市场调研与准备', duration: '第1-15天', description: '深入了解目标市场，制定详细的市场进入计划。', tasks: ['市场调研报告', '竞品分析', '定价策略制定', '团队组建'] },
      { title: '渠道建设与合作', duration: '第16-45天', description: '发展和筛选代理商，建立销售渠道网络。', tasks: ['代理商招募', '合作条款谈判', '合作协议签订', '渠道培训启动'] },
      { title: '产品与市场适配', duration: '第46-60天', description: '根据市场反馈，调整产品和营销策略。', tasks: ['产品本地化', '营销材料准备', '定价优化', '售前支持体系'] },
      { title: '市场推广与获客', duration: '第61-90天', description: '全面启动市场推广，获取首批客户。', tasks: ['参加行业展会', '数字营销启动', '首批客户签约', '案例总结优化'] }
    ]
  }
}
