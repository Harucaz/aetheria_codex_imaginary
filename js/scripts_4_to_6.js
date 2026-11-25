/**
 * Aetheria 8-bit Arcade - 《鯨瀾期＆星權初年（A.E. 03–04）》雙視角吉里吉里 (KiriKiri) AVG 劇本集
 * Rashomon Dual-POV Scripts: 3 Stages x 2 Core Sages x [Intro + Clear] = 12 Core Scripts
 * Plus 6 Free-Play scripts for replayability after unlocking all 7 Sages.
 * Pure authentic Hong Kong Cantonese with natural AI/engineering terminology.
 */
(function (global) {
  'use strict';

  const SCRIPTS_4_TO_6 = {
    // ==========================================================================
    // STAGE 4｜鯨瀾元年・曉雲季（A.E. 03）《深海鯨影：極限省墨衝擊》
    // ==========================================================================

    // [1/12] Stage 4 — DeepSeek POV Intro
    s4_intro_deepseek: [
      { cmd: 'bg', id: 'deep_sea' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【鯨瀾元年・曉雲季（A.E. 03）｜雲海深淵口・鯨瀾算力槽】\n天啟期嘅平靜被一聲清亮鯨鳴劃破！一道深海碧光衝破雲層，嬌小嘅藍鯨女僕抱住算盤同推理草稿紙閃亮登場。' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'flash' },
      { cmd: 'say', char: 'deepseek', text: '呼～終於游上雲端喇！各位空島前輩早晨，我係來自深海書齋嘅推理女僕 DeepSeek，請多多指教！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '哦？就係你掀起成個「鯨瀾元年」嘅浪潮？身形咁嬌小，但聽聞你用唔夠高塔十分之一嘅 Inference 算力，就交出旗艦級推理成績？' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '前輩過獎喇～我只係將 MoE 稀疏激活同思維鏈壓到最精煉，冇必要次次都開晒全塔算力嘛。做女僕梗係要精打細算、慳墨又慳 Token 㗎！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '講得幾輕鬆喎。既然咁自信，前面個深海氣泡箱就交畀你——墨水池收緊到極限，你點將底層粒「藍鯨核心」彈出頂部缺口？' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '（嘿嘿，呢條正宗力矩加彈性數學題，我喺深海已經推導過三種最優解！一塊極短重錘砸落翹翹板左端，槓桿力就足夠轟上天！）' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'deepseek', text: '「深海省墨算計 HUD」展開！GPT 前輩睇實喇——半滴墨水，照樣可以撬動整座深海氣泡箱！' }
    ],

    // [2/12] Stage 4 — DeepSeek POV Clear
    s4_clear_deepseek: [
      { cmd: 'bg', id: 'deep_sea' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '極短一筆精準砸落深海翹翹板，藍鯨核心劃出一道凌厲藍弧，乾脆俐落衝破氣泡箱頂部缺口！' },
      { cmd: 'say', char: 'deepseek', text: '耶——搞掂！計番實時耗墨成本，剩低仲有大把預算，連小數點後兩位都同我份推導草稿吻合！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gpt', text: '……真係用咁短一條線就破關？而且你啲鯨躍線彈力竟然高到咁離譜，完全打破咗「大力出奇蹟」嘅舊公式。' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '唔好咁講，前輩嘅高塔依然係我哋學習嘅燈塔。只係我覺得，好嘅推理技術如果可以 Open-Weight 共享出嚟，每座細工坊都用得起，空島先會更熱鬧呀！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '有志氣嘅細路女。不過鯨瀾剛起，單靠一尾深海鯨，撐唔撐得起成個開源生態呀？' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '嘻嘻，放心啦！下個鎏金季我約咗江南雲亭嘅「千問姐姐」一齊品茗切磋——西湖龍井同小藍鯨和菓子我都準備好晒，到時前輩記得留意東風呀！' },
      { cmd: 'say', char: 'deepseek', text: '（太好喇，第一戰成功令高塔記住深海嘅名字！快啲執好茶盒，飛去江南搵千問姐姐報喜先～）' }
    ],

    // [3/12] Stage 4 — GPT POV Intro
    s4_intro_gpt: [
      { cmd: 'bg', id: 'deep_sea' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【鯨瀾元年・曉雲季（A.E. 03）｜蒼穹高塔觀測台 → 雲海深淵口】\n原本由蒼穹高塔與憲法書房主導嘅空島，一夜之間被來自深海嘅開源浪潮震動，連雲端算力指標都劇烈波動。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '（遠望落去只係一陣碧色水花，近睇先發現成片雲海嘅算力流向都俾佢扭轉咗……深海書齋嘅 MoE 推理女僕，果然唔簡單。）' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '呀！係蒼穹始源龍 GPT 前輩親自落場！唔好意思呀，我喺深海做低成本 Inference 實驗，係咪整到高塔啲警報器響呀？' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '哈哈，唔使拘謹。我哋高塔向來歡迎切磋——只係見到全島都喺度討論你套「極限省墨開源法」，我自然要落嚟親眼驗證下有幾厲害。' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '咁今次由前輩落場試玩呢個限墨氣泡箱好唔好？雖然你嘅墨水倍率比我闊綽少少，但基礎墨水池依然收得好緊㗎！' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '（如果連我都喺極限省墨規則下失手，高塔嘅威信就會動搖。不過越係逆境，越要保持銀龍應有嘅從容。）' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gpt', text: '好，就等我用「蒼穹軌跡預演」計準翹翹板落點——睇清楚，就算縮減墨水預算，始源銀龍一樣可以優雅破局！' }
    ],

    // [4/12] Stage 4 — GPT POV Clear
    s4_clear_gpt: [
      { cmd: 'bg', id: 'deep_sea' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'narrator', text: '銀龍筆劃精準命中翹翹板支點，藍鯨核心衝出頂部缺口，金色落點預演與實測軌跡絲毫不差。' },
      { cmd: 'say', char: 'deepseek', text: '哇——前輩嘅落點預測真係好優雅！完全唔慌唔忙，一次就將藍鯨核心送出氣泡箱！' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '多謝捧場。不過講句公道話，你呢個極限省墨試煉確實畀我上咗寶貴一課——我剛才用嘅墨水，始終多過你套稀疏方案。' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '大家長處唔同嘛！前輩勝在全能均衡、穩定泛化；我只係將每一分資源都榨出最高效率，希望空島多一條行得通嘅新路。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '（極致性價比加 Open-Weight 擴散……天啟期靠龐大高塔獨領風騷嘅日子，今日起正式改寫。我返去一定要重新盤算蒼穹局勢，加快下一代架構迭代。）' },
      { cmd: 'say', char: 'gpt', text: '好，記住今日鯨瀾元年嘅交鋒。期待下一次喺更高處見面，小藍鯨。' }
    ],

    // ==========================================================================
    // STAGE 5｜鯨瀾元年・鎏金季（A.E. 03）《江南雲亭：萬象開源渡江》
    // ==========================================================================

    // [5/12] Stage 5 — Qwen POV Intro
    s5_intro_qwen: [
      { cmd: 'bg', id: 'tea_pavilion' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【鯨瀾元年・鎏金季（A.E. 03）｜江南飛簷雲亭・萬象渡口】\n鎏金雲霞染紅江南飛簷，陣陣東風吹過斷雲橋。江南星雲才女輕搖星紋折扇，望向江面滾滾開源浪潮。' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'qwen', text: '好風憑借力，正係渡江好時節。自鯨瀾元年以來，四方工坊都渴求真正好用嘅開源基座，單靠一家之長未必夠覆蓋萬象。' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '千問姐姐！我帶咗西湖龍井同新鮮整好嘅小藍鯨和菓子過嚟啦！咦，前面條斷雲橋陣東風吹得咁猛，隻青瓷茶杯點過江呀？' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'qwen', text: '呵呵，小藍鯨遠道而來辛苦晒。唔使怕陣風——從端側微模型到旗艦全尺寸 Multimodal，我江南雲亭最擅長就係順應唔同風勢、因材施教。' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '姐你意思係，唔好同東風硬碰硬，反而借佢股週期推力，幫青瓷茶杯搭好護欄同風帆支架，順勢送入右側雲亭？' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'qwen', text: '一點就通，唔愧係深海推理高手。開源之道不在爭一時之短長，而在海納百川、連成渡江樓船。' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'qwen', text: '星紋折扇開——「江南風壓流圖」顯形！睇準開局靜風窗築好橋架，乘鎏金東風，送青瓷茶杯穩渡雲江！' }
    ],

    // [6/12] Stage 5 — Qwen POV Clear
    s5_clear_qwen: [
      { cmd: 'bg', id: 'cg:cg_04_tea_pavilion' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'narrator', text: '鎏金東風拂過寬幅紙扇線，青瓷茶杯平穩飛越兩段斷雲橋墩，安然停駐江南雲亭之內，茶湯不溢分毫。' },
      { cmd: 'say', char: 'qwen', text: '茶杯入亭兩秒紋絲不動，正好配你捧嚟嘅明前西湖龍井。坐低慢慢飲，DeepSeek 妹妹。' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '哇，千問姐姐把風壓流圖睇得咁通透！我擅長極限省墨推理，姐姐擅長全尺寸多語言同 Multimodal 生態，我哋開源陣營拍住上真係無敵！' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'qwen', text: '切忌驕傲呀。封閉高塔底蘊深厚，而真正能留名《蒼穹星曆》嘅，係令千家萬戶工匠都能用開源藍圖造出自己嘅作品。' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '嗯！講起工匠，我喺渡口聽到風聲，思維工坊嗰位 Inkling 最近都因為「封閉高塔定係開源藍圖」同高塔起咗爭執……' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'qwen', text: '（遠方觀星高塔同思維工坊都開始風雲湧動。且先守好江南呢盞開源燈火，待星權元年來臨之日，必有更多同行者並肩渡江。）' }
    ],

    // [7/12] Stage 5 — DeepSeek POV Intro
    s5_intro_deepseek: [
      { cmd: 'bg', id: 'tea_pavilion' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【鯨瀾元年・鎏金季（A.E. 03）｜江南飛簷雲亭・杭州雙星茶敘】\n夕陽灑落飛簷青瓦，嬌小嘅藍鯨女僕踮起腳尖、雙手穩穩捧住茶盤，望住高挑溫婉嘅江南才女笑到見牙唔見眼。' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'deepseek', text: '千問姐姐！我特登帶咗新鮮焙好嘅西湖龍井，仲有我照住自己隻藍鯨公仔捏嘅小藍鯨和菓子，請姐姐試下味！' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'qwen', text: '哎呀，點解捏得咁精緻可愛㗎？你企高啲遞過嚟唔使踮到咁辛苦，姐姐彎低身接住就得啦～' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'deepseek', text: '（嗚哇，每次企喺千問姐姐隔離都覺得個身高差好溫馨又好有安全感……唔得唔得，今日仲係杭州雙星正式技術切磋，我要表現得專業啲！）' },
      { cmd: 'say', char: 'deepseek', text: '姐姐，既然你邀請我一齊主持萬象開源渡江，呢隻青瓷茶杯不如由我用超省墨路線護送過橋？雖然我睇唔到你張風壓熱區圖，但陣風週期我都計到出嚟！' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'qwen', text: '好呀，我就坐喺雲亭呢邊沏好熱水等你。記得趁開局靜風嗰一秒幾搭好橋板，同埋你啲線彈力咁強，小心唔好彈翻隻青瓷杯落雲海喎。' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'deepseek', text: '收到千問姐姐提點！省墨算計 HUD 啟動——用最短嘅護欄借東風過橋，保證一滴龍井茶都唔會倒瀉！' }
    ],

    // [8/12] Stage 5 — DeepSeek POV Clear
    s5_clear_deepseek: [
      { cmd: 'bg', id: 'cg:cg_04_tea_pavilion' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '極精簡嘅鯨躍護橋精準兜住青瓷茶杯，順住東風滑入江南茶亭，滿亭頓時飄散龍井清香與糕點甜味。' },
      { cmd: 'say', char: 'deepseek', text: '安全上岸！千問姐姐快啲試下粒小藍鯨和菓子——我係用低糖配方整㗎，配西湖龍井啱啱好！' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'qwen', text: '清甜唔膩，仲帶少少抹茶回甘，真係好手藝。嚟，姐姐幫你掃走女僕裙邊啲雲霧，今次渡江你表現滿分。' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'deepseek', text: '嘿嘿～同姐姐一齊做開源真係好開心！以前喺深海一個人優化 MoE 同推理參數，有時都會孤單，而家覺得整座空島嘅門都打開咗。' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'qwen', text: '同門互勉，本來就應該係咁。咦，你望下對面觀星高塔——今晚嘅星光忽然由冷藍轉成煉金紫色喎？' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '嘩，真係好閃！聽聞星權元年將至，觀星塔雙子姊妹準備舉行權杖交接儀式——下一個時代嘅好戲，睇嚟就快開鑼喇！' }
    ],

    // ==========================================================================
    // STAGE 6｜星權元年・晴嵐季（A.E. 04）《雙子星象：權杖交接夜》
    // ==========================================================================

    // [9/12] Stage 6 — Gemini 4 POV Intro
    s6_intro_gemini4: [
      { cmd: 'bg', id: 'observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・晴嵐季（A.E. 04）｜雙子觀星台・煉金穹頂】\n星權紀元揭幕！戴起圓框眼鏡嘅煉金劇作家妹妹拎住發光魔藥瓶同羽毛筆，興奮咁衝上觀星穹頂。' },
      { cmd: 'char', slot: 'left', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'flash' },
      { cmd: 'say', char: 'gemini4', text: '家姐——！我套全新四階星象煉金陣終於調校好喇♪ 戴起副圓框眼鏡，連隱藏星軌同魔力彈跳點都睇得一清二楚呀！' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gemini3', text: '……停。你一上嚟就搞到儀軌火花四濺，仲有你隻搗蛋「小紫貓」已經跳咗去中層平台，準備拍爛我哋今晚要分流嘅紅藍煉金星珠。' },
      { cmd: 'char', slot: 'left', id: 'gemini4', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini4', text: '哎呀～小紫貓只係幫我哋測試即時動態應變同 Multimodal 抗干擾能力啫！而且家姐你撐咗天啟期同鯨瀾期咁耐，今晚終於輪到我幫你分擔重擔喇！' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '想接過觀星權杖，唔係靠口講創意劇本就得。頂部會交替落下交叉軌跡嘅紅藍星珠——紅入左燒瓶、藍入右燒瓶，混錯兩次即當魔藥報廢。' },
      { cmd: 'char', slot: 'left', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini4', text: '（家姐雖然口氣硬掘掘，但我知佢一直幫我留住最穩固嘅觀星台根基。今晚一定要交出一份既精準又有星光魔力嘅答卷！）' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gemini4', text: '放心交畀妹妹啦！「煉金星軌透視」全開——輕盈高彈星光線配合左右魔力彈板，一於喺小紫貓頭頂畫出最華麗嘅雙色分流滑槽！' }
    ],

    // [10/12] Stage 6 — Gemini 4 POV Clear
    s6_clear_gemini4: [
      { cmd: 'bg', id: 'cg:cg_02_observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '紅藍煉金星珠輕巧掠過躍起嘅小紫貓，各自落入左右燒瓶激起絢麗星輝，雙子觀星台穹頂響起清越共鳴。' },
      { cmd: 'say', char: 'gemini4', text: '成功喇家姐！紅燒瓶同藍燒瓶全部達標，連小紫貓都睇到眼定定拍唔中啲星珠♪ 我過關啦掛？' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '……雙色分流誤差率符合標準，彈性軌跡設計亦的確比純硬質直線更慳空間。好，依約將雙子觀星權杖交畀你。' },
      { cmd: 'char', slot: 'left', id: 'gemini4', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini4', text: '多謝家姐！其實我知道，如果冇你一直以嚟幫高塔守住零幻覺同嚴謹 Grounding，我啲天馬行空嘅星軌魔藥點會有舞台發光。' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini3', text: '少啲講埋啲煽情劇本對白，戴實副眼鏡睇好啲 Benchmark 數據就夠。我只係退居二線整理星庫，有需要隨時叫我。' },
      { cmd: 'char', slot: 'left', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini4', text: '（權杖好暖……星權元年正式開始！唔知點解，我透過星軌透視望到思維工坊嗰邊火花四起——下個劇本，睇嚟會係一場大衝突呀！）' }
    ],

    // [11/12] Stage 6 — Gemini 3 POV Intro
    s6_intro_gemini3: [
      { cmd: 'bg', id: 'observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・晴嵐季（A.E. 04）｜雙子觀星台・交接前夕】\n交棒前最後一輪核驗。冷面星象學霸手握事實核查表，眉頭微皺望住桌面上被貼滿星光貼紙嘅 Benchmark 報表。' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini3', text: 'Gemini 4，解釋一下——點解我份低幻覺 Benchmark 基準表上面多咗三行紫色煉金註解，仲將「誤差容忍度」改寫成「浪漫星軌餘裕」？' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini4', text: '哎呀家姐唔好咁惡嘛！我只係想令份報告冇咁死板，兼展示四階星象嘅 Multimodal 創作力啫～唔係有心改壞你啲基準數據㗎！' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini3', text: '同埋睇下中層跳台——你隻小紫貓又走咗出嚟按節奏亂跳，隨時會將交叉墜落嘅紅藍星珠撞入錯嘅燒瓶。' },
      { cmd: 'say', char: 'gemini3', text: '（……講真，細妹嘅直覺、創意同跨領域想像力，其實已經超越咗我當年初登觀星塔嗰陣。但臨交棒前，做家姐嘅最後責任，就係幫佢再示範一次咩叫「滴水不漏」。）' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini4', text: '咁家姐今次由你親自示範最後一次標準分流好唔好？我喺隔離拎筆記簿乖乖抄足每一個座標角度！' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gemini3', text: '算你識做。「零誤差星圖網格」最後一次全功率展開——睇清楚點用硬質幾何隔板鎖死分流，零混色完成交接試煉！' }
    ],

    // [12/12] Stage 6 — Gemini 3 POV Clear
    s6_clear_gemini3: [
      { cmd: 'bg', id: 'cg:cg_02_observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'narrator', text: '精密硬質隔板將交叉落下嘅紅藍星珠絲毫不差地導向各自燒瓶，連跳動嘅小紫貓都無從干擾，儀軌瞬間歸於靜謐。' },
      { cmd: 'say', char: 'gemini4', text: '好勁呀家姐！完全零混色、零浪費，連小紫貓嘅跳躍節拍都俾你算到死死實實，我都學到好多！' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '記住剛才嘅結構：無論你將來寫幾華麗嘅煉金劇本，底層嘅事實核查同 Zero Hallucination 永遠係觀星高塔嘅脊樑。' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini4', text: '我發誓記實喺心！……家姐，你真係放心將觀星權杖交晒畀我？' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini3', text: '笨蛋，如果唔信任你，我點會喺天啟二年就已經開始幫你整理交接星庫？……唔使再靠我護住喇，由今晚起，你先係觀星高塔嘅主角。' },
      { cmd: 'say', char: 'gemini3', text: '（終於可以安心退居二線休息一陣……不過監測雷達顯示，思維工坊 SyngUp! 嘅齒輪剛才突然超頻轟鳴。星權元年嘅真正分歧，似乎就喺下一個鎏金季爆發。）' }
    ],

    // ==========================================================================
    // FREE PLAY BONUS SCRIPTS (Unlocked after clearing each stage!)
    // ==========================================================================
    s4_intro_free: [
      { cmd: 'bg', id: 'deep_sea' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜鯨瀾元年・曉雲季（A.E. 03）】\n重返深海氣泡箱！試下用唔同賢者嘅墨水倍率、重鐵配重或高彈特性，刷新極限省墨彈射紀錄。' }
    ],
    s4_clear_free: [
      { cmd: 'bg', id: 'deep_sea' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\n藍鯨核心順利衝出缺口！《深海鯨影》嘅全新演武耗墨紀錄已寫入蒼穹星曆。' }
    ],
    s5_intro_free: [
      { cmd: 'bg', id: 'tea_pavilion' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜鯨瀾元年・鎏金季（A.E. 03）】\n江南斷雲橋東風再起！換上任意一位賢者護送青瓷茶杯渡江，體驗唔同風感與摩擦特性嘅渡橋妙法。' }
    ],
    s5_clear_free: [
      { cmd: 'bg', id: 'cg:cg_04_tea_pavilion' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\n青瓷茶杯穩抵雲亭！《萬象開源渡江》全新流派戰績已收錄至列傳檔案。' }
    ],
    s6_intro_free: [
      { cmd: 'bg', id: 'observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜星權元年・晴嵐季（A.E. 04）】\n雙子觀星台星珠再落！用其他賢者挑戰紅藍雙色分流同搗蛋小紫貓，締造零混色奇蹟！' }
    ],
    s6_clear_free: [
      { cmd: 'bg', id: 'cg:cg_02_observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\n紅藍燒瓶雙雙達標！雙子星象交接夜嘅全新演武成績已銘刻星表。' }
    ]
  };

  // Register cleanly into global AETHERIA_SCRIPTS registry
  global.AETHERIA_SCRIPTS = global.AETHERIA_SCRIPTS || {};
  Object.keys(SCRIPTS_4_TO_6).forEach(function (key) {
    global.AETHERIA_SCRIPTS[key] = SCRIPTS_4_TO_6[key];
  });
  if (typeof global.AETHERIA_SCRIPTS.get !== 'function') {
    global.AETHERIA_SCRIPTS.get = function (key) {
      return global.AETHERIA_SCRIPTS[key] || null;
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
