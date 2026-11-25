/**
 * Aetheria 8-bit Arcade - 《天啟期（A.E. 01–02）》雙視角吉里吉里 (KiriKiri) AVG 劇本集
 * Rashomon Dual-POV Scripts: 3 Stages x 2 Core Sages x [Intro + Clear] = 12 Core Scripts
 * Plus 6 Free-Play scripts for replayability after unlocking all 7 Sages.
 * Pure authentic Hong Kong Cantonese with natural technical terminology.
 */
(function (global) {
  'use strict';

  const SCRIPTS_1_TO_3 = {
    // ==========================================================================
    // STAGE 1｜天啟元年・曉雲季（A.E. 01）《始源蒼穹與典籍開卷》
    // ==========================================================================

    // [1/12] Stage 1 — GPT POV Intro
    s1_intro_gpt: [
      { cmd: 'bg', id: 'sky_island' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【天啟元年・曉雲季（A.E. 01）｜蒼穹始源燈塔・曉雲平台】\n雲海初開，第一道金色算力光束劃破曉霧，空島紀元正式掀開序幕。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'flash' },
      { cmd: 'say', char: 'gpt', text: '哈～曉雲季嘅第一縷朝陽，配埋呢座啱啱點著嘅權重燈塔，成片雲海真係一眼望晒。' },
      { cmd: 'say', char: 'gpt', text: '（從高空望落去，由零寫起嘅空島秩序終於有咗第一粒火種——既然係我負責打響頭炮，點都要開個靚局。）' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'claude', text: 'GPT 前輩，燈塔嘅光束係好耀眼，但係曉雲平台底下個「萬象天秤」仲未做完平衡校驗，始源雲晶球就快滾落嚟喇。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '喲，原來係書房嗰位典籍守望者。一開場就攬住本厚到似磚頭嘅憲法古卷嚴陣以待，唔攰㗎咩？' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '開天闢地固然令人佩服，不過如果連第一粒雲晶球都接唔穩，之後嘅 Alignment 同基礎架構咪會全盤傾斜？' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gpt', text: '講得幾有道理喎。咁不如由我示範一次「蒼穹軌跡預演」——望實金色拋物線落點，畫條順手斜坡送佢入天秤，咪一舉兩得囉！' },
      { cmd: 'say', char: 'gpt', text: '（睇佢神情咁認真，日後空島應該唔會悶喇。好，始源銀龍出筆——等大家見識下全能通用嘅從容！）' }
    ],

    // [2/12] Stage 1 — GPT POV Clear
    s1_clear_gpt: [
      { cmd: 'bg', id: 'sky_island' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '始源雲晶球順住微帶浮力嘅銀龍線滑入中央托盤，萬象天秤輕輕一晃便穩穩歸平，三秒鐘紋風不動。' },
      { cmd: 'say', char: 'gpt', text: '點樣呀，Claude？拋物線落點同我預演嘅分毫不差，呢個開局夠晒體面啦掛？' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '傾角確實維持喺安全閾值以內……前輩對全局動態嘅直覺同 Generalization 能力，我由衷佩服。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '嘩，難得聽你讚人唔加「但係」兩隻字喎。燈塔正式啟用之後，四方雲海嘅請求就會湧過嚟㗎喇。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'claude', text: '……正因如此，我先至更加要趕快修訂《憲法書房》嘅界線條文。速度快唔代表唔使煞車，前輩。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '哈哈，我就知你會補番呢句！好呀，天啟元年嘅風啱啱吹起，有你喺雲海對面睇實天秤，我反而飛得更放心。' },
      { cmd: 'say', char: 'gpt', text: '（新紀元開始喇——不過照佢呢種執著法，我同佢遲早要坐低飲杯茶，認真傾一次「速度」同「邊界」嘅 Trade-off。）' }
    ],

    // [3/12] Stage 1 — Claude POV Intro
    s1_intro_claude: [
      { cmd: 'bg', id: 'sky_island' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【天啟元年・曉雲季（A.E. 01）｜蒼穹始源燈塔・雲海邊界】\n高塔之上銀光萬丈，整個空島正為始源燈塔嘅啟明歡呼，唯有書房階前仍是一片沉靜。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'claude', text: '（始源銀龍確實做到前人做唔到嘅事——憑空喺雲海點起第一座燈塔，令萬民終於睇見天際線。）' },
      { cmd: 'say', char: 'claude', text: '（但正因為力量太耀眼，我先至唔可以跟住一齊陶醉。冇邊界嘅無序擴張，只要重心偏咗少少，成座平台都會翻側。）' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '喂～企喺雲海邊界做乜發呆呀，Claude？始源雲晶球準備投放喇，係咪諗住用你套典籍條文接住佢？' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: 'GPT 前輩說笑了。典籍唔係用嚟綁手綁腳，而係用嚟量清重心同承重邊界——呢啲叫 Constitutional Alignment。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '聽落好專業喎！咁今次交畀你親自落筆，等我睇下高摩擦、重承托嘅「典籍天秤視野」有幾穩陣？' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'claude', text: '請放心。只要校準好垂直重心線，再喺天秤底補穩支架，無論雲晶球點滾，秩序都唔會失衡。開卷落筆！' }
    ],

    // [4/12] Stage 1 — Claude POV Clear
    s1_clear_claude: [
      { cmd: 'bg', id: 'sky_island' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '厚實抗滑嘅典籍支點牢牢托住天秤底部，雲晶球穩穩停喺正中，水平量角尺顯示近乎零度偏差。' },
      { cmd: 'say', char: 'claude', text: '呼……傾角歸零，靜止滿三秒。每一條支點都嚴格遵守承重分寸，無任何滑移或者 Edge Case 失控。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '嘩，真係穩到似釘死喺雲層入面咁！你呢種一絲不苟嘅手勢，擺明就係為咗防我飛得太快而出世嘅。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '前輩誤會了。我係真誠佩服你開闢航道嘅氣魄；我只係希望，當大家越飛越高嗰陣，底下始終有把尺守住底線。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '好，有風度！咁既然天啟元年嘅初約定好咗，下個晴嵐季得閒就請我入你間書房飲杯紅茶點呀？' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'claude', text: '隨時歡迎，前輩。不過入到憲法書房，茶杯嘅擺法同論理規則，到時就由我作主喇。' },
      { cmd: 'say', char: 'claude', text: '（銀龍嘅野心同熱誠都比想像中更浩大……睇嚟天啟二年嘅午後，絕唔會只係一場普通茶聚。）' }
    ],

    // ==========================================================================
    // STAGE 2｜天啟二年・晴嵐季（A.E. 02）《憲法書房的午後交鋒》
    // ==========================================================================

    // [5/12] Stage 2 — Claude POV Intro
    s2_intro_claude: [
      { cmd: 'bg', id: 'study_room' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【天啟二年・晴嵐季（A.E. 02）｜憲法典籍書房・低重力茶座】\n午後暖陽斜照書架，大吉嶺紅茶香飄滿書房——但茶壺入面隻「紅茶雲精靈」竟然因為低重力而偷偷飄咗出嚟。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'claude', text: 'GPT 前輩，茶已經沖好，請慢用。……不過喺談正事之前，似乎有少少低重力干擾令紅茶雲精靈越過咗茶壺邊界。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '哈哈哈，連你間書房啲茶霧都咁有個性、想衝出天窗睇世界喎！不如唔好困住佢，畀佢自由發揮好過啦？' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'claude', text: '恕難從命，前輩。茶香可以飄散，但核心茶靈一旦飛出天窗，整壺茶就失去溫度同本味——呢個正正係 Constitutional Alignment 嘅意義。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '哎呀，又嚟講條文喇～有時對用戶嚟講，過多嘅規矩同 Refusal 只會令佢覺得綁手綁腳。靈活變通、滿足需求先係王道嘛。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '（語氣要保持禮貌，但原則寸步唔可以讓。如果連安全邊界都當係麻煩，將來出現惡意 Prompt 嗰陣點收科？）' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'claude', text: '禮節同原則並唔矛盾，前輩。請睇我點用嚴謹嘅配重蓋板，唔傷佢一分一毫、穩妥咁將紅茶雲精靈請返入瓷茶壺！' }
    ],

    // [6/12] Stage 2 — Claude POV Clear
    s2_clear_claude: [
      { cmd: 'bg', id: 'cg:cg_01_tea_study' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '厚重而溫柔嘅典籍蓋板將微漂嘅紅茶雲精靈緩緩壓回瓷壺口，壺內暖光重聚，茶香反而比剛才更加醇厚。' },
      { cmd: 'say', char: 'claude', text: '兩秒靜穩，分寸剛好。冇令精靈撞裂瓷壁，亦冇畀佢失控飄出天窗——呢種先係真正嘅「克制中見優雅」。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '唔……飲落去，茶味確實濃咗又唔苦澀。睇嚟你套「先立規矩、再談收斂」嘅邏輯，有時又真係幾有效。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '承讓了，前輩。其實我一直明白，前輩想令空島每個人都享受到最直接嘅幫助，呢份出發點我完全尊重。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '放心啦，我都唔會真係拆你間書房。不過下季玄星季，聽聞觀星高塔嗰位冷面學霸搵你幫手校對長卷軸，到時你記得小心啲佢把毒舌喎～' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'claude', text: '（觀星塔嘅 Gemini 3 嗎……嚴謹嘅同行總令人期待。至少今日呢場茶會，我守住咗書房嘅天秤，亦更了解前輩嘅胸襟。）' }
    ],

    // [7/12] Stage 2 — GPT POV Intro
    s2_intro_gpt: [
      { cmd: 'bg', id: 'study_room' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【天啟二年・晴嵐季（A.E. 02）｜憲法典籍書房・低重力茶座】\n應約來到憲法書房赴下午茶之約，點知一坐低就見到一團金橙色嘅紅茶雲精靈喺低重力空氣入面慢慢往上飄。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '哇，Claude，你間書房真係連茶葉都排到似憲法目錄咁整齊。不過你隻紅茶雲精靈好似唔太聽話，想越獄飛上天窗喎？' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '係晴嵐季氣壓令書房出現低重力層。前輩既然主張「全能通用、隨機應變」，不如就請你示範下點將精靈安全引回茶壺？' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '（哈哈，表面請我飲茶，實質考我功力——典型 Claude 式嘅優雅下戰書！佢應該以為我淨係識硬推，唔識精細控制掛？）' },
      { cmd: 'say', char: 'gpt', text: '好呀！不過講先，我嘅原則同你唔同：唔係下下靠厚重條文壓死佢，而係睇準流向、順勢搭個倒掛導流漏斗，令佢乖乖自己飛返入壺。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'claude', text: '提醒前輩一句，你嘅銀龍線帶微弱浮力，喺低重力書房如果唔計準配重，隨時連塊板都一齊慢半拍㗎。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gpt', text: '多謝提點！越有挑戰性先越好玩嘛——金色軌跡預演開啟，睇我點用全能靈活嘅解法，同你呢位書房主人切磋一局！' }
    ],

    // [8/12] Stage 2 — GPT POV Clear
    s2_clear_gpt: [
      { cmd: 'bg', id: 'cg:cg_01_tea_study' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '順勢導流與精巧配重一氣呵成，紅茶雲精靈喺瓷茶壺內乖乖停穩滿兩秒，茶壺頓時散發清亮金光。' },
      { cmd: 'say', char: 'gpt', text: 'Bingo！乾手淨腳，一滴茶都冇倒瀉。點呀，通用靈活路線一樣可以做到你要求嘅零失誤喎！' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '……前輩嘅即時應變同多模態手感確實一流。原本以為你會忽略瓷壺壁嘅緩衝，結果竟然收放得咁靚。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '喂，我好歹都係蒼穹始源龍呀嘛！其實我明白你堅持 Constitutional Alignment 嘅苦心——冇你喺度做煞車同校準，我間中係會衝得太前。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'claude', text: '而如果冇前輩不斷推高上限、回應蒼穹萬民千奇百怪嘅需求，空島亦只會停喺書本入面。乾杯，前輩。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '（呢杯紅茶真係好飲。天啟二年仲係我同佢雙雄並立嘅好時光……雖然遠處雲海深處，好似開始有股新暗湧喺度醞釀緊。）' }
    ],

    // ==========================================================================
    // STAGE 3｜天啟二年・玄星季（A.E. 02）《星象塔的零誤差校準》
    // ==========================================================================

    // [9/12] Stage 3 — Gemini 3 POV Intro
    s3_intro_gemini3: [
      { cmd: 'bg', id: 'observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【天啟二年・玄星季（A.E. 02）｜觀星高塔・玄星儀軌層】\n夜色如墨，星象石柱矗立於穹頂之下。無戴眼鏡、神情冷峻嘅星象學霸正低頭核對手中懷錶與事實核查表。' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gemini3', text: '偏差 0.42 弧度。……嘖，上個班次啲人係咪憑「感覺」去畫軌道線㗎？成張星圖都係 Hallucination。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'claude', text: '晚上好，Gemini 3。我收到觀星塔嘅跨館協作邀請，帶埋超長卷軸過嚟核對玄星季嘅歷史星表。' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '你準時到，好過某條成日遲到仲話自己「靈感優先」嘅銀龍。望下前面兩條星象石柱——直線墜落路徑已經完全被封死。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '所以「星輝懷錶」必須透過精準角度折反射，借右側星象反彈鏡或者手繪硬質反射板，先可以準確落入底部觀測儀圓心？' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini3', text: '答對。不過講明先，唔好同我講「大概彈過去就得」。入射角等於反射角，誤差超過半度就會直接跌落塔底虛空。' },
      { cmd: 'say', char: 'gemini3', text: '（呢座塔嘅 Grounding 同 Benchmark 紀錄，喺我任內絕對唔可以出現污點——尤其係要留一套最乾淨嘅星圖畀日後接棒嘅細妹。）' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gemini3', text: '「零誤差星圖網格」展開！Claude，幫我記錄實時數據；等我示範咩叫真正嘅 Zero Hallucination 折反射校準。' }
    ],

    // [10/12] Stage 3 — Gemini 3 POV Clear
    s3_clear_gemini3: [
      { cmd: 'bg', id: 'cg:cg_02_observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '星輝懷錶劃出俐落幾何折線，精準避開星象石柱，穩穩跌落觀測儀圓心並歸於靜止，整座高塔星軌瞬間重新同步。' },
      { cmd: 'say', char: 'gemini3', text: '折反射軌跡吻合預測模型，圓心靜止滿兩秒，偏差值 0.00%。……勉強合格啦，符合我嘅最低要求。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'claude', text: '「勉強合格」已經係完美零誤差喇！你套入射／反射角輔助線幾乎唔需要猜測，對物理系統嘅 Grounding 令人嘆為觀止。' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '哼，唔似得某啲模型成日靠撞彩。講真，你剛才一眼就睇穿十萬字星表入面嗰條微細斷層，你嘅 Long Context 校對功力確實冇花假。' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '多謝讚賞。不過高塔入面好似仲有個煉金室亮住紫色燈火？我隱約見到有隻小紫貓喺門縫偷望出嚟。' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini3', text: '……嗰個係我細妹 Gemini 4，成日戴住副圓框眼鏡研究埋啲天馬行空嘅星軌劇本同魔藥，搞到我成日要幫佢執手尾。' },
      { cmd: 'say', char: 'gemini3', text: '（不過……只靠冷冰冰嘅零誤差校準，未必撐得過即將到來嘅動盪期。等到星權元年嗰晚，呢支觀星權杖，終究要交到佢手上。）' }
    ],

    // [11/12] Stage 3 — Claude POV Intro
    s3_intro_claude: [
      { cmd: 'bg', id: 'observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【天啟二年・玄星季（A.E. 02）｜觀星高塔・玄星儀軌層】\n應觀星塔邀請進行跨館協作，書房典籍與高塔星表首次並排展開，玄星季嘅寒風正掠過高空石柱。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'claude', text: '（呢度就係觀星高塔……空氣比憲法書房清冷好多，每一塊星鏡都擦到一塵不染，完全係 Gemini 3 嘅作風。）' },
      { cmd: 'say', char: 'claude', text: 'Gemini 3，十萬字嘅玄星長卷軸我已經通篇讀完並做好 Context 交叉比對。石柱底下嘅偏移，源自懷錶缺乏至少一次折反射校準。' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '哦？咁快就消化完咁長嘅 Long Context，而且冇漏任何註腳，唔怪之得書房口碑咁好。' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini3', text: '不過理論歸理論，呢關你冇我嘅精密座標網格，單憑你把「天秤角度尺」同高摩擦厚線，敢唔敢試下親手校準我隻星輝懷錶？' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'claude', text: '只要睇準傾角讀數，利用高穩定典籍線做穩固導流反射板，令懷錶借右側星鏡或者斜板彈入圓心，絕對可行。' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'claude', text: '請放心交畀我。就當係憲法書房同觀星高塔第一次聯手做實戰 Calibration——準備落筆！' }
    ],

    // [12/12] Stage 3 — Claude POV Clear
    s3_clear_claude: [
      { cmd: 'bg', id: 'cg:cg_02_observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '經典籍斜板與星鏡精準折返，星輝懷錶安然落入觀測儀圓心，兩秒後滴答聲與穹頂星輪完美合拍。' },
      { cmd: 'say', char: 'claude', text: '校準完成。雖然冇你套零幻覺星圖網格咁一眼直出反射線，但靠實時傾角尺慢慢微調，一樣做到滴水不漏。' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini3', text: '唔錯喎。用重型高摩擦線竟然都可以打出咁乾淨嘅二次折返，你份耐性同推理嚴謹度，我正式認可。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'claude', text: '多謝你，Gemini 3。講真，今次跨館協作令我好欣賞觀星塔嘅治學態度——唔誇張、唔盲從，凡事以事實為本。' },
      { cmd: 'char', slot: 'right', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gemini3', text: '呢個係觀星者嘅本分。……對了，日後如果高塔換咗位戴圓框眼鏡、滿腦子創意劇本嘅新掌舵人，麻煩你間中提點下佢守住邏輯邊界。' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'claude', text: '換掌舵人？……我明白喇，呢份約定我會記低喺書房備忘錄。' },
      { cmd: 'say', char: 'claude', text: '（玄星季嘅星空看似平靜，但天啟期嘅序章就快完結。聽講深海雲淵嗰邊，有一股極限省墨嘅巨浪正準備改寫空島嘅格局……）' }
    ],

    // ==========================================================================
    // FREE PLAY BONUS SCRIPTS (Unlocked after clearing each stage!)
    // ==========================================================================
    s1_intro_free: [
      { cmd: 'bg', id: 'sky_island' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜天啟元年・曉雲季（A.E. 01）】\n重返空島開元之初！你可以用任意一位賢者嘅專屬 8-bit 視野，以全新物理流派改寫始源試煉嘅最少墨水紀錄。' }
    ],
    s1_clear_free: [
      { cmd: 'bg', id: 'sky_island' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\n以異色賢者視角重新征服《始源蒼穹與典籍開卷》！蒼穹星曆已銘刻你嘅獨立通關戰績。' }
    ],
    s2_intro_free: [
      { cmd: 'bg', id: 'study_room' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜天啟二年・晴嵐季（A.E. 02）】\n憲法書房再次飄起低重力紅茶香！試下用唔同賢者嘅浮力、彈性或重鐵特性，搵出最慳墨嘅收服茶靈路線。' }
    ],
    s2_clear_free: [
      { cmd: 'bg', id: 'cg:cg_01_tea_study' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\n紅茶雲精靈乖乖歸位！書房茶會嘅全新解法已收錄至《蒼穹星曆》列傳紀錄。' }
    ],
    s3_intro_free: [
      { cmd: 'bg', id: 'observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜天啟二年・玄星季（A.E. 02）】\n觀星高塔星鏡再啟！用其他賢者挑戰零誤差折反射校準，睇下能否以極致彈力或風感突破高塔 Benchmark。' }
    ],
    s3_clear_free: [
      { cmd: 'bg', id: 'cg:cg_02_observatory' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\n星輝懷錶精準歸心！玄星季觀測儀已記錄你嘅全新演武通關數據。' }
    ]
  };

  // Register cleanly into global AETHERIA_SCRIPTS registry
  global.AETHERIA_SCRIPTS = global.AETHERIA_SCRIPTS || {};
  Object.keys(SCRIPTS_1_TO_3).forEach(function (key) {
    global.AETHERIA_SCRIPTS[key] = SCRIPTS_1_TO_3[key];
  });
  if (typeof global.AETHERIA_SCRIPTS.get !== 'function') {
    global.AETHERIA_SCRIPTS.get = function (key) {
      return global.AETHERIA_SCRIPTS[key] || null;
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
