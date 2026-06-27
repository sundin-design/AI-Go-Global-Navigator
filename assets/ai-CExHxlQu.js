async function e(e,t=``){try{let n=await fetch(`https://api.deepseek.com/v1/chat/completions`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer sk-9909b5e0e98f44959903d15d6a394678`},body:JSON.stringify({model:`deepseek-chat`,messages:[{role:`system`,content:t},{role:`user`,content:e}],temperature:.7,max_tokens:6e3})});if(!n.ok)throw Error(`API请求失败: ${n.status}`);return(await n.json()).choices[0].message.content}catch(e){return console.error(`DeepSeek API调用失败:`,e),null}}function t(e){if(!e)return null;try{let t=e.match(/\{[\s\S]*\}/);return t?JSON.parse(t[0]):null}catch(e){return console.error(`解析AI响应失败:`,e),null}}var n=`你是一位专业的国际市场分析师，擅长为中国企业制定海外市场进入策略。所有分析必须基于真实市场数据，提供有决策价值的建议。请严格按照要求的JSON格式返回结果。`;async function r(r,i){let o=t(await e(`
请分析中国${i}行业的出海机会，返回严格的JSON格式：

{
  "industry": "${i}",
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

请返回5个国家，确保routeId格式正确（小写英文，-连接）。`,n));return o&&o.countries&&o.countries.length>0?a(o):s(i)}async function i(r,i,a,s){let l=t(await e(`
请为中国${i}企业进入${s}市场，提供完整的市场分析报告，返回严格的JSON格式：

{
  "industry": "${i}",
  "country": "${s}",
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

请确保返回标准JSON，不要添加额外说明。`,n));return l&&l.marketAnalysis?o(l):c(i,s)}function a(e){return{industry:e.industry||``,description:e.description||``,stats:e.stats||{marketSize:`—`,growthRate:`—`,chinaExport:`—`},trendSummary:e.trendSummary||``,countries:(e.countries||[]).map((e,t)=>({...e,routeId:e.routeId||`country-${t+1}`})),opportunityAnalysis:e.opportunityAnalysis||[]}}function o(e){return{industry:e.industry||``,country:e.country||``,overview:e.overview||{opportunityScore:75,marketRating:`B`},marketAnalysis:e.marketAnalysis||[],customerProfile:e.customerProfile||{targetCustomers:[],decisionMakers:[],painPoints:[]},customerChannels:e.customerChannels||[],marketStrategy:e.marketStrategy||{recommendedModel:{title:``,description:``,advantages:[]},cooperation:{title:``,description:``,methods:[]},risks:[]},roadmap:e.roadmap||[]}}function s(e){return{industry:e,description:`${e}是中国优势产业，技术领先、供应链完善，在全球市场具有较强竞争力。随着全球需求增长，出海前景广阔。`,stats:{marketSize:`AI生成中`,growthRate:`AI生成中`,chinaExport:`AI生成中`},trendSummary:`${e}行业出海正处于快速增长期，新兴市场是当前的核心战场。中国企业凭借技术和成本优势，在全球市场竞争力持续增强。建议优先布局高增长地区，逐步辐射全球市场。`,countries:[{name:`沙特阿拉伯`,region:`中东`,score:92,reason:`能源转型加速，市场需求旺盛`,routeId:`saudi-arabia`},{name:`巴西`,region:`南美`,score:89,reason:`资源丰富，经济复苏带来新机遇`,routeId:`brazil`},{name:`印度`,region:`南亚`,score:86,reason:`人口红利，制造业快速发展`,routeId:`india`},{name:`德国`,region:`欧洲`,score:83,reason:`高端市场，技术门槛高但利润丰厚`,routeId:`germany`},{name:`澳大利亚`,region:`大洋洲`,score:80,reason:`资源型经济，能源需求持续增长`,routeId:`australia`}],opportunityAnalysis:[{title:`市场需求`,description:`目标市场需求旺盛，政策推动下持续增长，未来3年预计保持高速增长。`,score:88,tags:[`高需求`,`增长快`,`政策支持`]},{title:`竞争格局`,description:`市场竞争相对温和，本地企业竞争力有限，中国企业具有明显的技术和成本优势。`,score:82,tags:[`竞争温和`,`优势明显`,`差异化`]},{title:`政策环境`,description:`当地政府出台多项优惠政策吸引外资，营商环境持续改善，外资准入门槛逐步降低。`,score:85,tags:[`优惠政策`,`低门槛`,`营商友好`]},{title:`进入门槛`,description:`进入市场所需的资质认证相对简单，本地化要求不高，适合快速切入。`,score:78,tags:[`门槛低`,`认证简单`,`快速切入`]}]}}function c(e,t){return{industry:e,country:t,overview:{opportunityScore:85,marketRating:`A`},marketAnalysis:[{title:`市场需求`,description:`${t}${e}市场需求旺盛，受益于经济发展和政策推动，未来3年预计保持高速增长。`,metrics:[{value:`85%`,label:`需求增长率`},{value:`92`,label:`需求指数`}]},{title:`增长趋势`,description:`市场处于快速成长期，政策红利持续释放，投资热度不断攀升。`,metrics:[{value:`+15%`,label:`年复合增长率`},{value:`5年`,label:`高速增长期`}]},{title:`行业机会`,description:`细分领域存在较大机会，适合中国企业发挥技术和成本优势。`,metrics:[{value:`3-5个`,label:`高机会领域`},{value:`80%`,label:`成功率预估`}]}],customerProfile:{targetCustomers:[`大型制造业企业（年营收>1亿元）`,`上市公司及国有企业`,`跨国公司区域总部`,`快速成长的中型企业`,`政府机构及公共事业部门`],decisionMakers:[`CEO/总裁 - 战略决策层`,`采购总监 - 供应商选择`,`技术总监 - 技术评估`,`财务总监 - 预算审批`],painPoints:[`产品质量不稳定，售后响应慢`,`价格透明度低，议价成本高`,`技术支持不足，本地化服务缺失`,`交货周期长，供应链不稳定`]},customerChannels:[{name:`行业展会`,description:`参加当地知名行业展会，直接对接目标客户，展示产品优势`,tags:[`线下接触`,`建立信任`,`获取线索`],effectiveness:95},{name:`代理商`,description:`发展当地有资源的代理商，借助其渠道和网络快速开拓市场`,tags:[`渠道拓展`,`本地化`,`资源共享`],effectiveness:92},{name:`LinkedIn`,description:`通过LinkedIn平台进行B2B营销，精准触达企业决策层`,tags:[`数字化营销`,`精准投放`,`内容运营`],effectiveness:88},{name:`Google SEO`,description:`优化搜索引擎排名，获取自然流量，降低获客成本`,tags:[`长期投资`,`品牌建设`,`流量获取`],effectiveness:78}],marketStrategy:{recommendedModel:{title:`代理+直销混合模式`,description:`前期通过代理商快速打开市场，建立渠道网络；中后期逐步建立直销团队，提升利润率和客户掌控力。`,advantages:[`降低市场进入风险`,`快速建立销售渠道`,`利用代理商本地资源`,`保持客户直接沟通`]},cooperation:{title:`本地合作伙伴`,description:`与当地企业建立战略合作关系，借助其资源和渠道快速进入市场。`,methods:[`独家代理协议`,`合资企业模式`,`技术授权合作`,`分销渠道合作`]},risks:[`汇率波动风险：建议使用人民币或美元结算`,`政策变化风险：关注当地外资政策调整`,`竞争加剧风险：提前做好差异化竞争准备`,`收款风险：建议使用信用证或预付款方式`,`人才流失风险：培养本地核心团队`]},roadmap:[{title:`市场调研与准备`,duration:`第1-15天`,description:`深入了解目标市场，制定详细的市场进入计划。`,tasks:[`市场调研报告`,`竞品分析`,`定价策略制定`,`团队组建`]},{title:`渠道建设与合作`,duration:`第16-45天`,description:`发展和筛选代理商，建立销售渠道网络。`,tasks:[`代理商招募`,`合作条款谈判`,`合作协议签订`,`渠道培训启动`]},{title:`产品与市场适配`,duration:`第46-60天`,description:`根据市场反馈，调整产品和营销策略。`,tasks:[`产品本地化`,`营销材料准备`,`定价优化`,`售前支持体系`]},{title:`市场推广与获客`,duration:`第61-90天`,description:`全面启动市场推广，获取首批客户。`,tasks:[`参加行业展会`,`数字营销启动`,`首批客户签约`,`案例总结优化`]}]}}async function l(r){let i=t(await e(`
请作为资深外贸邮件分析师，完成以下完整分析流程：

## Step 1：翻译邮件
将邮件内容翻译成中文，保持原意不变，保留商务语境。

## Step 2：客户画像分析
基于邮件内容推测：
- 客户类型（贸易商/制造商/工程商/分销商/终端用户）
- 国家地区（根据邮箱域名、语言、签名等判断）
- 所属行业
- 采购角色（采购经理/CEO/工程师/创始人等）
- 公司规模（推测：小型/中型/大型企业）

## Step 3：采购意图分析
识别：
- 咨询产品
- 采购目的（新项目/补货/替代供应商/样品测试等）
- 采购阶段（初步了解/比价阶段/样品测试/即将下单/长期合作）
- 采购意向等级（高/中/低）

## Step 4：风险识别
识别邮件中的风险点和机会点：
例如：价格敏感、仅询价、样品测试、竞争比价、长期合作、代理商可能、项目采购、快速成交可能等

## Step 5：生成回复建议
生成三种风格的回复：
1. 专业商务版 - 适合正式客户、大客户
2. 友好沟通版 - 适合建立关系、中小客户
3. 强销售跟进版 - 适合促进成交、高意向客户
每种风格必须同时提供完整的英文和中文版本邮件。

## Step 6：客户开发建议
推荐3-4个最适合的客户开发渠道，并说明为什么适合这个客户。

## Step 7：下一步行动建议
给出4-5个具体的下一步行动建议，按优先级排序，形成行动路线图。

请返回以下严格的JSON格式：

{
  "translation": "邮件中文翻译（完整保留原意）",
  "customerProfile": {
    "type": "客户类型",
    "region": "国家地区",
    "industry": "所属行业",
    "role": "采购角色",
    "companySize": "公司规模（推测）"
  },
  "intent": {
    "product": "咨询产品",
    "purpose": "采购目的",
    "stage": "采购阶段",
    "level": "高/中/低"
  },
  "risks": ["风险点1", "风险点2", "风险点3", "风险点4"],
  "replies": [
    {
      "title": "专业商务版",
      "en": "完整英文回复邮件",
      "zh": "完整中文回复邮件"
    },
    {
      "title": "友好沟通版",
      "en": "完整英文回复邮件",
      "zh": "完整中文回复邮件"
    },
    {
      "title": "强销售跟进版",
      "en": "完整英文回复邮件",
      "zh": "完整中文回复邮件"
    }
  ],
  "channels": [
    {
      "name": "渠道名称",
      "description": "为什么推荐这个渠道，怎么操作",
      "color": "#颜色代码"
    }
  ],
  "nextActions": [
    {
      "title": "行动标题",
      "description": "具体行动说明"
    }
  ]
}

请确保返回标准JSON格式，不包含任何额外说明。

邮件内容：
${r}`,n));return i&&i.translation&&i.replies?u(i):d(r)}function u(e){return{translation:e.translation||``,customerProfile:e.customerProfile||{type:`—`,region:`—`,industry:`—`,role:`—`,companySize:`—`},intent:e.intent||{product:`—`,purpose:`—`,stage:`—`,level:`中`},risks:e.risks||[],replies:(e.replies||[]).map(e=>({title:e.title||``,en:e.en||``,zh:e.zh||``})),channels:(e.channels||[]).map(e=>({name:e.name||``,description:e.description||``,color:e.color||`#00d4ff`})),nextActions:(e.nextActions||[]).map(e=>({title:e.title||``,description:e.description||``}))}}function d(e){return{translation:`这是一封来自海外客户的商务邮件。客户表达了对我们产品的兴趣，询问了产品规格、价格和交货期等信息。客户可能正在寻找可靠的供应商，希望建立长期合作关系。`,customerProfile:{type:`贸易商/分销商`,region:`东南亚（马来西亚）`,industry:`新能源/光伏`,role:`采购经理`,companySize:`中型企业（50-200人）`},intent:{product:`客户关注的产品`,purpose:`采购/询价`,stage:`初步接触`,level:`中`},risks:[`价格敏感`,`仅询价`,`样品需求`],replies:[{title:`专业商务版`,en:`Dear [Customer Name],

Thank you for your email and interest in our products. We appreciate your inquiry and would be delighted to provide you with detailed information.

Regarding your questions:
1. Product specifications: Our products meet international standards and come with complete certifications.
2. Pricing: We offer competitive pricing based on order quantity.
3. Lead time: Standard delivery is within 30-45 days after receipt of deposit.

Please let us know your specific requirements so we can provide you with a tailored quotation. We look forward to the possibility of working together.

Best regards,
[Your Name]`,zh:`尊敬的[客户名称]：

感谢您的来信以及对我们产品的关注。我们非常重视您的询价，并乐意提供详细信息。

关于您的问题：
1. 产品规格：我们的产品符合国际标准，拥有完整的认证。
2. 价格：我们根据订单数量提供有竞争力的价格。
3. 交货期：标准交货期为收到定金后30-45天。

请告知您的具体需求，以便我们提供定制报价。期待与您合作。

此致，
[您的姓名]`},{title:`友好沟通版`,en:`Hi [First Name],

Thanks so much for reaching out! Great to hear you're interested in our products.

Quick answers to your questions:
- We have all the specs and certifications you need
- Prices are very competitive, especially for larger orders
- Delivery is usually 3-5 weeks

Would love to chat more about what you're looking for. Let me know if you have any other questions!

Cheers,
[Your Name]`,zh:`嗨[名字]：

非常感谢您的来信！很高兴听到您对我们的产品感兴趣。

快速回答您的问题：
- 我们有您需要的所有规格和认证
- 价格非常有竞争力，特别是对于大订单
- 交货通常需要3-5周

很乐意进一步了解您的需求。如有其他问题，请随时告诉我！

祝好，
[您的姓名]`},{title:`强销售跟进版`,en:`Dear [Customer Name],

Thank you for your inquiry! This is a great opportunity to discuss how our products can meet your needs.

Key advantages of working with us:
✅ Competitive pricing with volume discounts
✅ Fast delivery within 30 days
✅ Free samples available
✅ Dedicated account manager
✅ 24/7 technical support

To move forward quickly, could you please share:
1. Your target price range
2. Expected order quantity
3. Delivery timeline

We can offer a special introductory price for your first order. Don't miss this opportunity!

Best regards,
[Your Name]`,zh:`尊敬的[客户名称]：

感谢您的询价！这是一个很好的机会来讨论我们的产品如何满足您的需求。

与我们合作的主要优势：
✅ 有竞争力的价格，提供批量折扣
✅ 30天内快速交货
✅ 免费样品
✅ 专属客户经理
✅ 7×24技术支持

为了快速推进，能否请您分享：
1. 目标价格范围
2. 预计订单数量
3. 交货时间

我们可以为您的第一笔订单提供特别优惠价。不要错过这个机会！

此致，
[您的姓名]`}],channels:[{name:`LinkedIn 开发`,description:`通过LinkedIn查找该公司关键决策人，建立一对一联系，适合B2B客户开发`,color:`#0077b5`},{name:`行业展会`,description:`参加当地行业展会面对面交流，快速建立信任，适合东南亚市场`,color:`#f59e0b`},{name:`当地代理商`,description:`寻找马来西亚本地代理商，利用本地资源快速打开市场`,color:`#10b981`},{name:`Google SEO`,description:`通过英文官网SEO获取自然流量，建立品牌专业形象`,color:`#7c3aed`}],nextActions:[{title:`回复客户邮件`,description:`24小时内回复，使用专业商务版模板，附上产品目录和报价单`},{title:`提供详细报价`,description:`根据客户需求量身定制报价，包含MOQ、交货期、付款方式`},{title:`主动跟进`,description:`3天后如未回复，发送跟进邮件询问是否有进一步问题`},{title:`LinkedIn触达`,description:`在LinkedIn上添加客户联系人，建立多渠道联系`},{title:`样品准备`,description:`如客户有意向，准备样品和测试报告，推动进入样品测试阶段`}]}}async function f(n,r=null){let i=t(await e(`
请作为专业外贸会议助手，完成以下任务：

## Step 1：翻译发言
将客户的英文发言翻译成中文，保持原意。

## Step 2：识别关键词
仔细分析客户发言，判断是否包含以下关键问题类型（可以选择0-3个）：
- 价格问题：客户询问价格、报价、成本、预算相关
- MOQ问题：客户询问最小起订量、数量要求相关
- 交期问题：客户询问交货时间、生产周期、发货时间相关
- 样品问题：客户询问样品、样品费用、打样相关
- 付款方式问题：客户询问付款条件、结算方式、信用期相关
- 代理合作：客户询问代理、合作伙伴、渠道相关
- 产品规格：客户询问产品参数、技术规格、认证相关
- 合作意向：客户表示合作兴趣、访问意愿、签约意向

如果客户发言只是简单的问候、自我介绍、闲聊，没有明确问题时，返回空数组 []。

## Step 3：识别客户意图
分析客户发言的核心意图（只选一个最可能的）：
- 询问身份：询问公司/产品/供应商身份
- 了解产品：想了解产品信息和特点
- 价格谈判：关注价格和成本
- 商务谈判：讨论合作条款
- 建立关系：建立信任和联系
- 其他：如果无法归类

${r?p(r):``}

请返回以下严格的JSON格式：

{
  "translation": "中文翻译",
  "keywords": ["关键词1", "关键词2"],
  "intent": "客户意图",
  "replies": [
    {
      "title": "商务版",
      "en": "英文回复",
      "zh": "中文回复"
    },
    {
      "title": "友好版",
      "en": "英文回复",
      "zh": "中文回复"
    },
    {
      "title": "成交推进版",
      "en": "英文回复",
      "zh": "中文回复"
    }
  ]
}

请确保返回标准JSON格式，不包含任何额外说明。

客户发言：
${n}`,m));return i&&i.translation?h(i):g(n)}function p(e){if(!e||!e.recentConversation)return``;let t=[];if(e.recentConversation.length>0&&(t.push(`## 上下文信息`),t.push(``),t.push(`以下是本次会议中客户之前的发言记录，请在分析时结合这些上下文：`),t.push(``),e.recentConversation.slice(-5).forEach(e=>{t.push(`客户说: "${e.text}"`),e.translation&&t.push(`翻译: "${e.translation}"`),e.keywords&&e.keywords.length>0&&t.push(`已识别关键词: ${e.keywords.join(`, `)}`),t.push(``)})),e.keywordSummary&&Object.keys(e.keywordSummary).length>0){t.push(`## 关键词记忆`),t.push(`客户在本次会议中已多次提及以下关键问题：`),t.push(``),Object.keys(e.keywordSummary).forEach(n=>{let r=e.keywordSummary[n];t.push(`- ${n}: 已提及${r.totalCount}次 (紧急度: ${r.urgency})`)}),t.push(``);let n=Object.keys(e.keywordSummary).filter(t=>e.keywordSummary[t].urgency===`high`);n.length>0&&(t.push(`注意: ${n.join(`、`)}是紧急问题，建议在回复中优先处理。`),t.push(``))}return e.conversationFlow&&(t.push(`## 当前对话阶段: ${{initial:`初期接触`,exploration:`需求探索`,introduction:`产品介绍`,negotiation:`价格谈判`,closing:`成交推进`}[e.conversationFlow]||e.conversationFlow}`),t.push(``)),e.intentSummary&&Object.keys(e.intentSummary).length>0&&(t.push(`## 已识别意图`),Object.keys(e.intentSummary).forEach(n=>{let r=e.intentSummary[n];t.push(`- ${n}: 出现${r.count}次`)}),t.push(``)),t.join(`
`)}var m=`你是一位专业的外贸会议翻译助手，帮助外贸销售与海外客户进行实时沟通。

你的核心任务是：
1. 准确翻译客户的英文发言为中文
2. 识别客户关注的关键问题类型
3. 分析客户的采购意图
4. 生成三种风格的回复建议

回复建议要求：
- 商务版：正式、专业，适合首次接触或重要客户
- 友好版：轻松、亲切，适合建立长期关系
- 成交推进版：积极、主动，推动客户做出决策

请严格按照JSON格式返回结果，确保前端能够稳定解析。`;function h(e){return{translation:e.translation||``,keywords:e.keywords||e.tags||[],intent:e.intent||``,replies:(e.replies||[]).map(e=>({title:e.title||``,en:e.en||``,zh:e.zh||``}))}}function g(e){return{translation:`您好，我们对贵公司的产品很感兴趣，想了解更多关于产品规格和价格的信息。`,keywords:[`价格问题`,`产品规格问题`],intent:`客户正在了解产品信息和价格`,replies:[{title:`商务版`,en:`Thank you for your interest in our products. We would be delighted to provide you with detailed information about our product specifications and pricing. Could you please specify which products you are particularly interested in?`,zh:`感谢您对我们产品的关注。我们非常乐意提供产品规格和价格的详细信息。请问您对哪些产品特别感兴趣？`},{title:`友好版`,en:`Great to hear you like our products! Happy to share more details. What specific products or specs are you curious about?`,zh:`很高兴您喜欢我们的产品！很乐意分享更多细节。您对哪些具体产品或规格感兴趣？`},{title:`成交推进版`,en:`Excellent! To help us provide the best pricing and specs for you, could you please let us know:
1. Which specific products you are interested in?
2. What quantity are you looking to purchase?
3. Any specific technical requirements?

This will allow us to give you our most competitive offer!`,zh:`太棒了！为了给您提供最好的价格和规格信息，请您告知：
1. 您对哪些具体产品感兴趣？
2. 您计划采购的数量是多少？
3. 是否有特殊技术要求？

这样我们可以为您提供最具竞争力的报价！`}]}}export{f as i,l as n,r,i as t};