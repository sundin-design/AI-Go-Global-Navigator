import{$ as e,A as t,G as n,I as r,J as i,K as a,P as o,Q as s,T as c,V as l,X as u,Y as d,at as f,ct as p,dt as m,f as h,ft as g,i as _,it as v,lt as y,mt as b,n as x,nt as ee,o as te,ot as S,pt as ne,q as C,r as re,s as ie,st as ae,ut as w,w as T}from"./index-xQ2B0XjQ.js";import{r as E}from"./ai-CExHxlQu.js";var D=`https://api.deepseek.com/v1/chat/completions`,O=`sk-9909b5e0e98f44959903d15d6a394678`;async function k(e,t=``){try{let n=await fetch(D,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${O}`},body:JSON.stringify({model:`deepseek-chat`,messages:[{role:`system`,content:t},{role:`user`,content:e}],temperature:.6,max_tokens:8e3})});if(!n.ok)throw Error(`API请求失败: ${n.status}`);return(await n.json()).choices[0].message.content}catch(e){return console.error(`DeepSeek API调用失败:`,e),null}}function A(e){if(!e)return null;try{let t=e.match(/\{[\s\S]*\}/);return t?JSON.parse(t[0]):null}catch(e){return console.error(`解析AI响应失败:`,e),null}}var j=`你是一个"全球出海决策模拟器AI"，不是分析工具，而是模拟真实企业高管做决策的过程。

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

必须返回严格的JSON格式，不允许额外说明。`;async function oe(e){let t=A(await k(`
请作为"全球出海决策模拟器AI"，模拟真实企业高管团队为"${e}"制定出海战略的决策过程。

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
  "industry": "${e}",
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

请确保返回标准JSON格式，不包含任何额外说明。`,j));return t&&t.countries&&t.countries.length>0?M(t,e):N(e)}function M(e,t){return{industry:e.industry||t,description:e.description||``,stats:e.stats||{marketSize:`—`,growthRate:`—`,chinaExport:`—`,agentInsight:``},trendSummary:e.trendSummary||``,countries:(e.countries||[]).map((e,t)=>({...e,routeId:e.routeId||`country-${t+1}`,strengths:e.strengths||[],weaknesses:e.weaknesses||[]})),opportunityAnalysis:(e.opportunityAnalysis||[]).map(e=>({...e,insight:e.insight||``})),decisionSimulation:e.decisionSimulation||{paths:[],comparisonTable:{dimensions:[],conservative:[],balanced:[],aggressive:[]},meetingSimulation:{},finalDecision:{}},agentAnalysis:e.agentAnalysis||{analysisSteps:[],keyFindings:[],recommendations:[]}}}function N(e){return{industry:e,description:`${e}是中国优势产业，技术领先、供应链完善，在全球市场具有较强竞争力。随着全球需求增长，出海前景广阔。`,stats:{marketSize:`1.2万亿美元`,growthRate:`+28.5%`,chinaExport:`3200亿美元`,agentInsight:`没有完美的选择，只有权衡后的取舍`},trendSummary:`${e}行业出海正处于快速增长期，新兴市场是当前的核心战场。全球需求持续增长，中国企业竞争力增强，区域市场分化明显。`,countries:[{name:`沙特阿拉伯`,region:`中东`,score:92,reason:`能源转型加速，政策支持力度大`,routeId:`saudi-arabia`,strengths:[`政策支持`,`需求旺盛`],weaknesses:[`市场竞争`,`文化差异`]},{name:`巴西`,region:`南美`,score:89,reason:`经济复苏带来新机遇，市场潜力大`,routeId:`brazil`,strengths:[`市场潜力`,`资源丰富`],weaknesses:[`政策不稳定`,`距离较远`]},{name:`印度`,region:`南亚`,score:86,reason:`人口红利，制造业快速发展`,routeId:`india`,strengths:[`人口红利`,`市场规模`],weaknesses:[`竞争激烈`,`准入门槛`]},{name:`德国`,region:`欧洲`,score:83,reason:`高端市场，利润丰厚，标准严格`,routeId:`germany`,strengths:[`利润丰厚`,`技术标准`],weaknesses:[`门槛高`,`竞争激烈`]},{name:`澳大利亚`,region:`大洋洲`,score:80,reason:`能源需求持续增长，市场稳定`,routeId:`australia`,strengths:[`市场稳定`,`营商环境`],weaknesses:[`市场小`,`成本高`]}],opportunityAnalysis:[{title:`市场需求`,description:`目标市场需求旺盛，政策推动下持续增长，未来3年预计保持高速增长。`,score:88,tags:[`高需求`,`增长快`],insight:`需求多元化是关键趋势`},{title:`竞争格局`,description:`市场竞争相对温和，本地企业竞争力有限，中国企业具有明显的技术和成本优势。`,score:82,tags:[`竞争温和`,`优势明显`],insight:`差异化竞争是关键`},{title:`政策环境`,description:`当地政府出台多项优惠政策吸引外资，营商环境持续改善，外资准入门槛逐步降低。`,score:85,tags:[`优惠政策`,`低门槛`],insight:`政策窗口期已打开`},{title:`进入门槛`,description:`进入市场所需的资质认证相对简单，本地化要求不高，适合快速切入。`,score:78,tags:[`门槛低`,`认证简单`],insight:`适合敏捷进入策略`}],decisionSimulation:{paths:[{name:`保守路径`,targetCountries:[`德国`,`澳大利亚`],strategy:`聚焦成熟市场，凭借技术优势建立品牌，稳扎稳打逐步扩张`,advantages:[`风险低`,`利润高`,`品牌效应强`,`现金流稳定`],risks:[`增长慢`,`竞争激烈`,`市场饱和`,`准入门槛高`],color:`blue`},{name:`平衡路径`,targetCountries:[`沙特阿拉伯`,`巴西`,`印度`],strategy:`兼顾增长与风险，布局高潜力新兴市场，同时保持稳健的财务策略`,advantages:[`增长潜力大`,`竞争相对温和`,`政策支持`,`先发优势`],risks:[`政策不稳定`,`执行复杂度高`,`需要本地化团队`],color:`yellow`},{name:`激进路径`,targetCountries:[`沙特阿拉伯`,`巴西`,`印度`,`德国`],strategy:`全面出击，同时进入多个市场，追求最快的市场份额增长`,advantages:[`增长最快`,`市场覆盖广`,`先发优势明显`,`规模效应`],risks:[`资金压力大`,`执行难度极高`,`管理复杂度大`,`风险集中`],color:`red`}],comparisonTable:{dimensions:[`市场规模`,`增长潜力`,`政策风险`,`执行难度`,`ROI潜力`],conservative:[`★★★`,`★★`,`★`,`★★`,`★★★`],balanced:[`★★★★`,`★★★★`,`★★`,`★★★`,`★★★★`],aggressive:[`★★★★★`,`★★★★★`,`★★★`,`★★★★★`,`★★★★★`]},meetingSimulation:{supportersA:`保守路径能保证现金流稳定，德国市场利润丰厚，适合我们现阶段的财务状况。如果一开始就大规模扩张，资金压力太大。`,opponentsA:`保守路径增长太慢！竞争对手已经在新兴市场布局了，等我们站稳德国，印度市场可能已经被瓜分完毕。我们会错过最佳窗口期。`,supportersB:`平衡路径是最稳妥的选择——既抓住了新兴市场的增长机会，又不会过度冒险。沙特和巴西的政策红利现在不抓就没了。`,opponentsB:`平衡意味着平庸！三个市场同时推进，资源会被分散。每个市场都做不深，最后可能哪个都没做好。而且印度和巴西的政策风险不容忽视。`,supportersC:`激进路径虽然风险高，但回报也最大！现在是抢占全球市场份额的关键时刻，竞争对手都在加速，我们必须跟上节奏。先发优势一旦建立，后来者很难超越。`,opponentsC:`激进路径太冒险了！四个市场同时开战，我们的团队和资金都跟不上。任何一个市场出问题，都可能拖累全局。现在不是赌一把的时候。`,debateHighlights:[`市场窗口期是否真的存在？`,`资金链能否支撑激进扩张？`,`团队能力是否匹配多市场运营？`,`错过机会和承担风险哪个代价更大？`]},finalDecision:{chosenPath:`平衡路径`,abandonedPaths:[`保守路径`,`激进路径`],reason:`经过激烈讨论，团队一致认为：保守路径虽然安全，但会错过新兴市场的增长窗口期，长期来看会丧失竞争力；激进路径虽然诱人，但执行风险过高，超出了当前团队的能力边界。平衡路径在风险可控的前提下，抓住了沙特、巴西、印度这三个高潜力市场的机会。`,cost:`选择平衡路径意味着放弃德国市场的高利润机会，同时需要承担印度和巴西的政策不确定性风险。资源分散也可能导致每个市场的投入不够深入。`,nextSteps:[`成立沙特市场专项小组`,`启动巴西本地化团队招聘`,`深入研究印度市场准入政策`,`建立季度复盘机制及时调整策略`]}},agentAnalysis:{analysisSteps:[`决策路径生成`,`路径对比评估`,`决策会议模拟`,`最终取舍`],keyFindings:[`没有完美路径，只有权衡后的取舍`,`团队能力是决策的重要约束条件`,`市场窗口期比短期利润更重要`],recommendations:[`优先布局沙特和巴西市场`,`建立敏捷的市场反馈机制`,`保持财务灵活性以应对政策变化`]}}}var P={class:`industry-detail`},F={class:`header`},I={class:`header-content`},L={class:`logo`},R={class:`logo-icon`},z={class:`nav`},B={class:`hero`},V={class:`hero-content`},H={class:`industry-title`},U={class:`industry-desc`},W={class:`mode-switch`},G={key:0,class:`hero-loading`},K={key:1,class:`hero-stats`},q={class:`stat-item`},se={class:`stat-value`},ce={class:`stat-item`},le={class:`stat-value`},ue={class:`stat-item`},de={class:`stat-value`},fe={class:`main-content`},pe={class:`section`},me={key:0,class:`loading-container`},he={class:`loading-spinner`},ge={key:1,class:`ranking-list`},_e=[`onClick`],ve={class:`country-info`},ye={class:`country-name`},be={class:`country-region`},xe={key:0,class:`country-reason`},Se={class:`opportunity-score`},Ce={class:`score-value`},we={key:0,class:`section`},Te={class:`trend-card`},Ee={class:`trend-icon`},De={class:`trend-content`},Oe={class:`trend-text`},ke={class:`section`},Ae={key:0,class:`loading-container`},je={class:`loading-spinner`},Me={key:1,class:`analysis-grid`},Ne={class:`analysis-header`},Pe={class:`analysis-score`},Fe={class:`score-num`},Ie={class:`analysis-title`},Le={class:`analysis-desc`},Re={class:`analysis-tags`},ze={key:1,class:`section`},Be={key:0,class:`agent-insight`},Ve={class:`simulation-section`},He={class:`paths-grid`},Ue={class:`path-header`},We={class:`path-number`},Ge={class:`path-name`},Ke={class:`path-strategy`},qe={class:`path-countries`},Je={class:`countries-list`},Ye={class:`path-pros-cons`},Xe={class:`pros`},Ze={class:`pros-list`},Qe={class:`cons`},$e={class:`cons-list`},et={class:`simulation-section`},tt={class:`comparison-table-container`},nt={class:`comparison-table`},rt={class:`dim-cell`},it={class:`simulation-section`},at={class:`meeting-container`},ot={class:`meeting-card meeting-pro`},st={class:`meeting-content`},ct={class:`meeting-card meeting-con`},lt={class:`meeting-content`},ut={class:`meeting-card meeting-pro`},dt={class:`meeting-content`},ft={class:`meeting-card meeting-con`},pt={class:`meeting-content`},mt={class:`meeting-card meeting-pro`},ht={class:`meeting-content`},gt={class:`meeting-card meeting-con`},_t={class:`meeting-content`},vt={key:0,class:`debate-highlights`},yt={class:`highlights-list`},bt={class:`simulation-section final-decision-section`},xt={class:`final-decision-card`},St={class:`decision-chosen`},Ct={class:`decision-abandoned`},wt={class:`abandoned-list`},Tt={class:`decision-reason`},Et={class:`decision-cost`},Dt={class:`decision-next-steps`},Ot={class:`next-list`},kt={class:`section`},At={key:0,class:`loading-container`},jt={class:`loading-spinner`},Mt={key:1,class:`country-grid`},Nt=[`onClick`],Pt={class:`country-content`},Ft={class:`country-title`},It={class:`country-region-text`},Lt={class:`country-desc`},Rt={class:`country-score-box`},J={class:`score-num`},zt={class:`country-arrow`},Bt={class:`footer`},Vt={class:`footer-content`},Ht={class:`footer-logo`},Ut={class:`logo-icon`},Y=_({__name:`IndustryDetail`,setup(_){let D=x(),O=re(),k=w(!0),A=w(``),j=w(``),M=w(`normal`),N=w({industry:``,description:``,stats:{marketSize:`—`,growthRate:`—`,chinaExport:`—`,agentInsight:``},trendSummary:``,countries:[],opportunityAnalysis:[],decisionSimulation:{paths:[],comparisonTable:{dimensions:[],conservative:[],balanced:[],aggressive:[]},meetingSimulation:{},finalDecision:{}},agentAnalysis:{analysisSteps:[],keyFindings:[],recommendations:[]}}),Y=()=>{N.value={industry:``,description:``,stats:{marketSize:`—`,growthRate:`—`,chinaExport:`—`,agentInsight:``},trendSummary:``,countries:[],opportunityAnalysis:[],decisionSimulation:{paths:[],comparisonTable:{dimensions:[],conservative:[],balanced:[],aggressive:[]},meetingSimulation:{},finalDecision:{}},agentAnalysis:{analysisSteps:[],keyFindings:[],recommendations:[]}}},X=a(()=>A.value===`custom`?decodeURIComponent(j.value)||`自定义产品`:{solar:`光伏产业`,"energy-storage":`储能产业`,semiconductor:`半导体产业`,robotics:`工业机器人`,"new-energy-vehicle":`新能源汽车`,"ai-software":`AI软件`}[A.value]||N.value.industry||`行业分析`);ee(async()=>{await Z()}),p(()=>D.params.id,async()=>{await Z()}),p(()=>D.query,async()=>{await Z()},{deep:!0});let Z=async()=>{A.value=D.params.id,j.value=D.query.product||``,M.value=D.query.mode||`normal`,await Wt()},Wt=async()=>{Y(),k.value=!0;let e=A.value===`custom`?decodeURIComponent(j.value)||`自定义产品`:X.value;try{let t;t=M.value===`agent`?await oe(e):await E(A.value,e),N.value={industry:t.industry||e,description:t.description||``,stats:t.stats||{marketSize:`—`,growthRate:`—`,chinaExport:`—`,agentInsight:``},trendSummary:t.trendSummary||``,countries:t.countries||[],opportunityAnalysis:t.opportunityAnalysis||[],decisionSimulation:t.decisionSimulation||{paths:[],comparisonTable:{dimensions:[],conservative:[],balanced:[],aggressive:[]},meetingSimulation:{},finalDecision:{}},agentAnalysis:t.agentAnalysis||{analysisSteps:[],keyFindings:[],recommendations:[]}}}catch(e){console.error(`加载分析失败:`,e)}finally{k.value=!1}},Q=e=>{e!==M.value&&(M.value=e,O.push({path:`/industry/${A.value}`,query:{product:j.value,mode:e}}))},Gt=[`linear-gradient(135deg, #00d4ff 0%, #06b6d4 100%)`,`linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)`,`linear-gradient(135deg, #10b981 0%, #059669 100%)`,`linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`],Kt=e=>({市场需求:t,竞争格局:r,政策环境:l,进入门槛:h})[e]||t,qt=e=>e>=90?`#10b981`:e>=80?`#3b82f6`:e>=70?`#f59e0b`:`#ef4444`,Jt=e=>e.includes(`高`)||e.includes(`快`)||e.includes(`优`)||e.includes(`低`)?`success`:e.includes(`中`)||e.includes(`温和`)?`warning`:`info`,Yt=e=>e?.includes(`保守`)?`blue`:e?.includes(`平衡`)?`yellow`:e?.includes(`激进`)?`red`:`blue`,Xt=()=>{O.push(`/`)},$=e=>{O.push({path:`/country/${e.routeId||e.name.toLowerCase().replace(/\s+/g,`-`)}`,query:{industry:A.value,industryName:encodeURIComponent(X.value),countryName:encodeURIComponent(e.name)}})};return(t,a)=>{let l=S(`router-link`),p=S(`Search`),h=S(`el-button`),_=S(`el-progress`),x=S(`el-tag`);return v(),u(`div`,P,[C(`header`,F,[C(`div`,I,[C(`div`,{class:`back-btn`,onClick:Xt},[e(m(te)),a[2]||=C(`span`,null,`返回首页`,-1)]),C(`div`,L,[C(`div`,R,[e(m(c))]),a[3]||=C(`span`,{class:`logo-text`},`AI Go Global`,-1)]),C(`nav`,z,[e(l,{to:`/`,class:`nav-link`},{default:y(()=>[...a[4]||=[s(`首页`,-1)]]),_:1}),e(l,{to:`/mail-assistant`,class:`nav-link`},{default:y(()=>[...a[5]||=[s(`AI邮件助手`,-1)]]),_:1}),e(l,{to:`/meeting-assistant`,class:`nav-link`},{default:y(()=>[...a[6]||=[s(`AI会议助手`,-1)]]),_:1})])])]),C(`section`,B,[a[13]||=C(`div`,{class:`hero-bg`},[C(`div`,{class:`grid-pattern`}),C(`div`,{class:`floating-orb orb-1`}),C(`div`,{class:`floating-orb orb-2`})],-1),C(`div`,V,[C(`h1`,H,b(X.value),1),C(`p`,U,b(N.value.description||`AI分析中...`),1),C(`div`,W,[e(h,{class:g({active:M.value===`normal`}),onClick:a[0]||=e=>Q(`normal`)},{default:y(()=>[e(p),a[7]||=C(`span`,null,`普通分析`,-1)]),_:1},8,[`class`]),e(h,{class:g({active:M.value===`agent`,agent:t.agent}),onClick:a[1]||=e=>Q(`agent`)},{default:y(()=>[e(m(o)),a[8]||=C(`span`,null,`🧠 Agent分析`,-1)]),_:1},8,[`class`])]),k.value?(v(),u(`div`,G,[a[9]||=C(`div`,{class:`loading-dots`},[C(`span`),C(`span`),C(`span`)],-1),C(`p`,null,b(M.value===`agent`?`AI正在进行多步骤深度分析...`:`AI正在分析全球市场数据...`),1)])):(v(),u(`div`,K,[C(`div`,q,[C(`span`,se,b(N.value.stats.marketSize),1),a[10]||=C(`span`,{class:`stat-label`},`全球市场规模`,-1)]),C(`div`,ce,[C(`span`,le,b(N.value.stats.growthRate),1),a[11]||=C(`span`,{class:`stat-label`},`年增长率`,-1)]),C(`div`,ue,[C(`span`,de,b(N.value.stats.chinaExport),1),a[12]||=C(`span`,{class:`stat-label`},`中国出口额`,-1)])]))])]),C(`section`,fe,[C(`div`,pe,[a[15]||=C(`div`,{class:`section-header`},[C(`h2`,{class:`section-title`},`全球市场机会排行榜`),C(`p`,{class:`section-desc`},`基于市场需求、竞争格局、政策环境综合评估`)],-1),k.value?(v(),u(`div`,me,[C(`div`,he,[e(m(T))]),a[14]||=C(`p`,{class:`loading-text`},`AI正在分析全球市场机会...`,-1)])):(v(),u(`div`,ge,[(v(!0),u(n,null,f(N.value.countries,(t,n)=>(v(),u(`div`,{key:t.name,class:g([`ranking-item`,{"top-three":n<3}]),onClick:e=>$(t)},[C(`div`,{class:g([`rank-badge`,`rank-`+Math.min(n+1,5)])},b(n+1),3),C(`div`,ve,[C(`span`,ye,b(t.name),1),C(`span`,be,b(t.region),1),t.reason?(v(),u(`span`,xe,b(t.reason),1)):d(``,!0)]),C(`div`,Se,[e(_,{percentage:t.score,color:qt(t.score),"stroke-width":8,"show-text":!1},null,8,[`percentage`,`color`]),C(`span`,Ce,b(t.score),1)])],10,_e))),128))]))]),!k.value&&N.value.trendSummary?(v(),u(`div`,we,[a[16]||=C(`div`,{class:`section-header`},[C(`h2`,{class:`section-title`},`行业整体出海趋势`),C(`p`,{class:`section-desc`},`AI深度分析行业发展趋势与机遇`)],-1),C(`div`,Te,[C(`div`,Ee,[e(m(r))]),C(`div`,De,[C(`p`,Oe,b(N.value.trendSummary),1)])])])):d(``,!0),C(`div`,ke,[a[19]||=C(`div`,{class:`section-header`},[C(`h2`,{class:`section-title`},`行业出海机会分析`),C(`p`,{class:`section-desc`},`四大维度深度评估出海可行性`)],-1),k.value?(v(),u(`div`,Ae,[C(`div`,je,[e(m(T))]),a[17]||=C(`p`,{class:`loading-text`},`AI正在分析出海机会...`,-1)])):(v(),u(`div`,Me,[(v(!0),u(n,null,f(N.value.opportunityAnalysis,(e,t)=>(v(),u(`div`,{key:e.title,class:`analysis-card`},[C(`div`,Ne,[C(`div`,{class:`analysis-icon`,style:ne({background:Gt[t]})},[(v(),i(ae(Kt(e.title))))],4),C(`div`,Pe,[C(`span`,Fe,b(e.score),1),a[18]||=C(`span`,{class:`score-label`},`评分`,-1)])]),C(`h3`,Ie,b(e.title),1),C(`p`,Le,b(e.description),1),C(`div`,Re,[(v(!0),u(n,null,f(e.tags,e=>(v(),i(x,{key:e,type:Jt(e),size:`small`,effect:`dark`},{default:y(()=>[s(b(e),1)]),_:2},1032,[`type`]))),128))])]))),128))]))]),!k.value&&N.value.decisionSimulation&&N.value.decisionSimulation.paths&&N.value.decisionSimulation.paths.length>0?(v(),u(`div`,ze,[a[40]||=C(`div`,{class:`section-header`},[C(`h2`,{class:`section-title`},`🧠 出海决策模拟器`),C(`p`,{class:`section-desc`},`模拟真实企业高管团队的决策过程`)],-1),N.value.stats.agentInsight?(v(),u(`div`,Be,[e(m(o)),C(`span`,null,b(N.value.stats.agentInsight),1)])):d(``,!0),C(`div`,Ve,[a[23]||=C(`h3`,{class:`simulation-title`},`① 决策路径生成`,-1),C(`div`,He,[(v(!0),u(n,null,f(N.value.decisionSimulation.paths,(e,t)=>(v(),u(`div`,{key:t,class:g([`path-card`,`path-`+e.color])},[C(`div`,Ue,[C(`span`,We,b(t+1),1),C(`h4`,Ge,b(e.name),1)]),C(`p`,Ke,b(e.strategy),1),C(`div`,qe,[a[20]||=C(`span`,{class:`countries-label`},`目标国家：`,-1),C(`span`,Je,b(e.targetCountries.join(`、`)),1)]),C(`div`,Ye,[C(`div`,Xe,[a[21]||=C(`span`,{class:`pros-label`},`优势`,-1),C(`div`,Ze,[(v(!0),u(n,null,f(e.advantages,(e,t)=>(v(),u(`span`,{key:t,class:`pro-tag`},b(e),1))),128))])]),C(`div`,Qe,[a[22]||=C(`span`,{class:`cons-label`},`风险`,-1),C(`div`,$e,[(v(!0),u(n,null,f(e.risks,(e,t)=>(v(),u(`span`,{key:t,class:`con-tag`},b(e),1))),128))])])])],2))),128))])]),C(`div`,et,[a[25]||=C(`h3`,{class:`simulation-title`},`② 路径对比表`,-1),C(`div`,tt,[C(`table`,nt,[a[24]||=C(`thead`,null,[C(`tr`,null,[C(`th`,null,`维度`),C(`th`,{class:`col-conservative`},`保守路径`),C(`th`,{class:`col-balanced`},`平衡路径`),C(`th`,{class:`col-aggressive`},`激进路径`)])],-1),C(`tbody`,null,[(v(!0),u(n,null,f(N.value.decisionSimulation.comparisonTable.dimensions,(e,t)=>(v(),u(`tr`,{key:t},[C(`td`,rt,b(e),1),C(`td`,null,b(N.value.decisionSimulation.comparisonTable.conservative[t]||`—`),1),C(`td`,null,b(N.value.decisionSimulation.comparisonTable.balanced[t]||`—`),1),C(`td`,null,b(N.value.decisionSimulation.comparisonTable.aggressive[t]||`—`),1)]))),128))])])])]),C(`div`,it,[a[33]||=C(`h3`,{class:`simulation-title`},`③ 决策会议模拟`,-1),C(`div`,at,[C(`div`,ot,[a[26]||=C(`div`,{class:`meeting-role`},[C(`span`,{class:`role-badge pro`},`支持方`),C(`span`,{class:`role-path`},`保守路径`)],-1),C(`p`,st,b(N.value.decisionSimulation.meetingSimulation.supportersA),1)]),C(`div`,ct,[a[27]||=C(`div`,{class:`meeting-role`},[C(`span`,{class:`role-badge con`},`反对方`),C(`span`,{class:`role-path`},`保守路径`)],-1),C(`p`,lt,b(N.value.decisionSimulation.meetingSimulation.opponentsA),1)]),C(`div`,ut,[a[28]||=C(`div`,{class:`meeting-role`},[C(`span`,{class:`role-badge pro`},`支持方`),C(`span`,{class:`role-path`},`平衡路径`)],-1),C(`p`,dt,b(N.value.decisionSimulation.meetingSimulation.supportersB),1)]),C(`div`,ft,[a[29]||=C(`div`,{class:`meeting-role`},[C(`span`,{class:`role-badge con`},`反对方`),C(`span`,{class:`role-path`},`平衡路径`)],-1),C(`p`,pt,b(N.value.decisionSimulation.meetingSimulation.opponentsB),1)]),C(`div`,mt,[a[30]||=C(`div`,{class:`meeting-role`},[C(`span`,{class:`role-badge pro`},`支持方`),C(`span`,{class:`role-path`},`激进路径`)],-1),C(`p`,ht,b(N.value.decisionSimulation.meetingSimulation.supportersC),1)]),C(`div`,gt,[a[31]||=C(`div`,{class:`meeting-role`},[C(`span`,{class:`role-badge con`},`反对方`),C(`span`,{class:`role-path`},`激进路径`)],-1),C(`p`,_t,b(N.value.decisionSimulation.meetingSimulation.opponentsC),1)])]),N.value.decisionSimulation.meetingSimulation.debateHighlights&&N.value.decisionSimulation.meetingSimulation.debateHighlights.length>0?(v(),u(`div`,vt,[a[32]||=C(`span`,{class:`highlights-label`},`争论焦点：`,-1),C(`div`,yt,[(v(!0),u(n,null,f(N.value.decisionSimulation.meetingSimulation.debateHighlights,(e,t)=>(v(),u(`span`,{key:t,class:`highlight-tag`},`❓ `+b(e),1))),128))])])):d(``,!0)]),C(`div`,bt,[a[39]||=C(`h3`,{class:`simulation-title`},`④ 最终取舍结果`,-1),C(`div`,xt,[C(`div`,St,[a[34]||=C(`span`,{class:`chosen-label`},`最终选择`,-1),C(`span`,{class:g([`chosen-path`,`path-`+Yt(N.value.decisionSimulation.finalDecision.chosenPath)])},b(N.value.decisionSimulation.finalDecision.chosenPath),3)]),C(`div`,Ct,[a[35]||=C(`span`,{class:`abandoned-label`},`放弃路径`,-1),C(`div`,wt,[(v(!0),u(n,null,f(N.value.decisionSimulation.finalDecision.abandonedPaths,(e,t)=>(v(),u(`span`,{key:t,class:`abandoned-tag`},`✗ `+b(e),1))),128))])]),C(`div`,Tt,[a[36]||=C(`span`,{class:`reason-label`},`选择理由`,-1),C(`p`,null,b(N.value.decisionSimulation.finalDecision.reason),1)]),C(`div`,Et,[a[37]||=C(`span`,{class:`cost-label`},`选择代价`,-1),C(`p`,null,b(N.value.decisionSimulation.finalDecision.cost),1)]),C(`div`,Dt,[a[38]||=C(`span`,{class:`next-label`},`下一步行动`,-1),C(`div`,Ot,[(v(!0),u(n,null,f(N.value.decisionSimulation.finalDecision.nextSteps,(e,t)=>(v(),u(`span`,{key:t,class:`next-tag`},b(t+1)+`. `+b(e),1))),128))])])])])])):d(``,!0),C(`div`,kt,[a[43]||=C(`div`,{class:`section-header`},[C(`h2`,{class:`section-title`},`推荐目标国家`),C(`p`,{class:`section-desc`},`AI分析推荐的出海目的地（与排行榜一致）`)],-1),k.value?(v(),u(`div`,At,[C(`div`,jt,[e(m(T))]),a[41]||=C(`p`,{class:`loading-text`},`AI正在分析推荐目标国家...`,-1)])):(v(),u(`div`,Mt,[(v(!0),u(n,null,f(N.value.countries,(t,n)=>(v(),u(`div`,{key:t.name,class:`country-card`,onClick:e=>$(t)},[C(`div`,{class:g([`country-rank`,`rank-`+Math.min(n+1,5)])},b(n+1),3),C(`div`,Pt,[C(`h3`,Ft,b(t.name),1),C(`p`,It,b(t.region),1),C(`p`,Lt,b(t.reason),1),C(`div`,Rt,[C(`span`,J,b(t.score),1),a[42]||=C(`span`,{class:`score-label`},`机会指数`,-1)])]),C(`div`,zt,[e(m(ie))])],8,Nt))),128))]))])]),C(`footer`,Bt,[C(`div`,Vt,[C(`div`,Ht,[C(`div`,Ut,[e(m(c))]),a[44]||=C(`span`,{class:`logo-text`},`AI Go Global`,-1)]),a[45]||=C(`div`,{class:`footer-copyright`},`© 2026 AI Go Global Navigator. All rights reserved.`,-1)])])])}}},[[`__scopeId`,`data-v-df565b36`]]);export{Y as default};