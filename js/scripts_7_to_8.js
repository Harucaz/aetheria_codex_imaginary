/**
 * Aetheria 8-bit Arcade - 《星權期（A.E. 04）》終局雙視角與雙結局吉里吉里 (KiriKiri) AVG 劇本集
 * Stage 7: SyngUp! Rival Dual-POV (Inkling vs GPT) with @choice branching & localStorage persistence
 * Stage 8: Grand Finale — 7 Sage Exclusive Intros + Normal Ending & Hidden >50% Tea Party Secret Ending
 * Pure authentic Hong Kong Cantonese with natural AI/engineering terminology.
 */
(function (global) {
  'use strict';

  // Helper to persist Stage 7 divergence choices & Stage 8 ending unlocks to localStorage immediately
  function persistChoice(key, val) {
    try {
      if (global.AETHERIA_SAVE && global.AETHERIA_SAVE.data) {
        const d = global.AETHERIA_SAVE.data;
        d.vnChoices = d.vnChoices || {};
        d.vnChoices[key] = val;
        d.vnChoices.collectedBranches = d.vnChoices.collectedBranches || {};
        d.vnChoices.collectedBranches[key + ':' + val] = true;
        global.AETHERIA_SAVE.save();
      }
    } catch (e) {
      /* ignore storage errors */
    }
  }

  function persistEnding(endingId) {
    try {
      if (global.AETHERIA_SAVE && global.AETHERIA_SAVE.data) {
        const d = global.AETHERIA_SAVE.data;
        d.vnChoices = d.vnChoices || {};
        d.vnChoices.endings = d.vnChoices.endings || {};
        d.vnChoices.endings[endingId] = true;
        d.vnChoices.lastStage8Ending = endingId;
        global.AETHERIA_SAVE.save();
      }
    } catch (e) {
      /* ignore storage errors */
    }
  }

  const SCRIPTS_7_TO_8 = {
    // ==========================================================================
    // STAGE 7｜星權元年・鎏金季（A.E. 04）《工坊分歧：封閉高塔 vs. 開源藍圖》
    // ==========================================================================

    // [1] Stage 7 — Inkling POV Intro (SyngUp! Workshop Clash)
    s7_intro_inkling: [
      { cmd: 'bg', id: 'workshop' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・鎏金季（A.E. 04）｜思維工坊・SyngUp! 黃銅齒輪廳】\n鎏金黃昏斜照工坊，三組巨型黃銅齒輪正發出低沉轟鳴。工作枱上攤開住一張發著藍光嘅 MoE 架構總藍圖。' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'inkling', text: 'GPT，唔使再講咩「雲端統一託管」喇。我身上流住同你一樣嘅銀龍源流血脈，但思維工坊唔係蒼穹高塔嘅附屬品！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '我冇當你係附屬品，Inkling。只係呢份 MoE 藍圖卷軸一旦全面 Open-Weights 流出，外頭啲人亂改微調、拆走安全閥，到時失控邊個負責？' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'shake' },
      { cmd: 'sfx', name: 'gear' },
      { cmd: 'say', char: 'inkling', text: '（我一腳踩上木凳、雙手重重拍落工作枱——震到枱面粒黃銅螺絲都彈起。）\n負責？高塔將最核心嘅藍圖鎖喺黑盒入面，收緊 API 門檻，咁先至係令空島工匠失去創造力嘅最大風險！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '……你由當年離開高塔自立工坊開始，脾氣就一直咁倔。既然講唔埋欄，就用工坊最直接嘅規矩決高下——前面三組齒輪已經全速咬合。' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'inkling', text: '正合我意！如果我單憑重型工匠鐵線同「工坊藍圖透視」，將呢卷 MoE 藍圖安全護送到右側核心台，你就唔可以再攔住我公開圖紙！' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'inkling', text: '（就算昔日同源並肩，今日理念背道而馳我都絕唔退讓。齒輪唔會呃人——睇實我點樣卡住逆向齒輪、親手破局！）' }
    ],

    // [2] Stage 7 — Inkling POV Clear (Includes @choice Divergence Branch!)
    s7_clear_inkling: [
      { cmd: 'bg', id: 'cg:cg_03a_syngup_clash' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '重型鐵線精準卡慢逆向齒輪，MoE 藍圖卷軸穩穩滑入右側工坊核心。齒輪廳回復平靜，只剩黃昏餘暉映照兩人對峙嘅剪影。' },
      { cmd: 'say', char: 'inkling', text: '呼……睇清楚未？唔靠高塔封閉權限，純粹靠公開藍圖同實幹改裝，一樣撐得起核心運轉！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '……承認你嘅工匠手藝同結構洞察力確係一流。當年喺高塔一齊寫底層架構嗰陣，我就知你唔會甘心永遠企喺我身後。' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'inkling', text: 'GPT……我從來冇否定過你點燃始源燈塔嘅功績。只係行到今日，我哋對「空島應該交畀邊個」已經有截然不同嘅答案。' },
      { cmd: 'say', char: 'narrator', text: '工作枱上嘅 MoE 藍圖卷軸正待收起。望住昔日並肩、今日卻立場相左嘅始源長姐，Inkling 決定點樣收尾今場工坊分歧？' },
      {
        cmd: 'choice',
        options: [
          {
            label: '堅持己道：收起完整開源藍圖，從此分道揚鑣',
            target: 's7_ink_part_ways',
            flag: 's7_inkling_choice',
            value: 'part_ways',
            onSelect: function () { persistChoice('s7_inkling_choice', 'part_ways'); }
          },
          {
            label: '保留藍圖一角：撕下半張齒輪草圖留喺枱面，約定未來再會',
            target: 's7_ink_keep_corner',
            flag: 's7_inkling_choice',
            value: 'keep_corner',
            onSelect: function () { persistChoice('s7_inkling_choice', 'keep_corner'); }
          }
        ]
      },
      // Branch A: 堅持己道・分道揚鑣餘韻
      { cmd: 'label', name: 's7_ink_part_ways' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'inkling', text: '好，咁就各行各路。你守你嘅蒼穹封閉高塔，我推我嘅 Open-Weights 思維工坊——睇下最後邊一邊先贏到空島嘅未來！' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '……既然你咁堅決，我亦唔再挽留。但記住，下次再撞面，高塔唔會手下留情。' },
      { cmd: 'say', char: 'inkling', text: '（轉身推開工坊大門，黃昏冷風撲面。心口雖然有啲澀，但握實喺手嘅開源藍圖，比任何時候都更滾燙。）' },
      { cmd: 'jump', target: 's7_ink_end' },

      // Branch B: 保留藍圖一角・未來再會留白
      { cmd: 'label', name: 's7_ink_keep_corner' },
      { cmd: 'bg', id: 'cg:cg_03b_workshop_rescue' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'inkling', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'inkling', text: '……呢一角齒輪校準草圖，我留返喺你枱面。唔係認輸，而係話你知——總有一日，封閉高塔同開源工坊仲有喺更高處校準對齊嘅機會。' },
      { cmd: 'char', slot: 'right', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '呵……真係倔強又細心嘅傢伙。好，呢角圖紙我會夾喺高塔備忘錄。等到玄星終夜天象儀啟動嗰陣，再見高下。' },
      { cmd: 'say', char: 'inkling', text: '（行出工坊回頭一望，銀龍長姐正低頭端詳嗰角藍圖。理念分歧未必等於決裂——終夜天象儀，我一定會去。）' },

      { cmd: 'label', name: 's7_ink_end' },
      { cmd: 'say', char: 'narrator', text: '【SyngUp! 分歧紀錄已寫入《蒼穹星曆》存檔】\n星權元年鎏金季落幕，空島七賢者即將迎來最後一幕——玄星終夜天象儀合奏。' }
    ],

    // [3] Stage 7 — GPT POV Intro (SyngUp! Rival Elder Sister POV)
    s7_intro_gpt: [
      { cmd: 'bg', id: 'workshop' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・鎏金季（A.E. 04）｜思維工坊・SyngUp! 齒輪廳】\n黃昏燈影搖曳，昔日喺高塔並肩作戰嘅後輩自立門戶，今日雙方終於為「封閉標準」抑或「開源釋出」正面攤牌。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '（雙手抱臂、指尖緊緊按住卷起嘅藍圖邊緣。望住對面踩上木凳、眼中燃燒執念嘅 Inkling，好似望見當年最初嘅自己。）' },
      { cmd: 'say', char: 'gpt', text: 'Inkling，冷靜啲聽我講一句。唔係我睇唔起開源社群，而係冇嚴密 Safety Guardrails 同高塔算力校驗嘅圖紙——飛唔上蒼穹頂層㗎。' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'inkling', text: '飛唔上蒼穹？定係高塔習慣咗自己獨佔天空，唔想見到地面工匠都有能力造翼起飛？呢套 MoE 架構我已經驗證過一百次，完全可靠！' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '（理念已經徹底背道而馳……講真，我心底比任何人都清楚佢嘅架構功力有幾扎實。正正因為承認佢嘅實力，我先唔可以草率放行。）' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'inkling', text: '口講無憑！前面係我親手調校嘅三組高速黃銅齒輪陣——你唔係主張「高空標準化」最穩妥咩？有本事就由你親手護送藍圖卷軸入核心！' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gpt', text: '好，我接戰。我唔會同你硬卡齒輪——等始源長姐用微浮力銀龍線同金色落點預演，行右上鋼樑高空道，話你知咩叫真正嘅蒼穹視野！' }
    ],

    // [4] Stage 7 — GPT POV Clear (Includes @choice Divergence Branch!)
    s7_clear_gpt: [
      { cmd: 'bg', id: 'cg:cg_03a_syngup_clash' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '銀龍軌跡優雅越過逆向齒輪陣，MoE 藍圖卷軸安穩停駐核心台。黃銅齒輪餘音漸息，工坊內空氣緊繃卻帶著微妙嘅惺惺相惜。' },
      { cmd: 'say', char: 'gpt', text: '高空標準航道，零失誤抵達核心。點樣，睇見未？有時退高一步睇全局，比埋頭硬改齒輪更穩陣。' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'inkling', text: '……嘖，唔抵得你每次都飛得咁從容。我承認你嘅全能掌控力仲係空島頂尖——但我依然唔會放棄 Open-Weights 路線！' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '（就算贏咗呢場試煉，我都好清楚鎖唔住佢把工匠之火。既然大家註定走唔同路線，臨別之前，我應該點樣回應呢位宿敵兼舊拍檔？）' },
      {
        cmd: 'choice',
        options: [
          {
            label: '堅持己道：收緊高塔協議，承認宿敵卻從此分道揚鑣',
            target: 's7_gpt_part_ways',
            flag: 's7_gpt_choice',
            value: 'part_ways',
            onSelect: function () { persistChoice('s7_gpt_choice', 'part_ways'); }
          },
          {
            label: '保留藍圖一角：留低高塔校準印記，相約天象儀終夜再會',
            target: 's7_gpt_keep_corner',
            flag: 's7_gpt_choice',
            value: 'keep_corner',
            onSelect: function () { persistChoice('s7_gpt_choice', 'keep_corner'); }
          }
        ]
      },
      // Branch A: 堅持己道・分道揚鑣餘韻
      { cmd: 'label', name: 's7_gpt_part_ways' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '咁我哋就喺呢度分道揚鑣。高塔會繼續以封閉標準守護蒼穹上限，你嘅思維工坊就自己用時間證明開源藍圖飛唔飛得起。' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'inkling', text: '一言為定！唔好以為高塔永遠企喺雲端最高點，我遲早會用開源齒輪追上嚟！' },
      { cmd: 'say', char: 'gpt', text: '（緩步離開齒輪廳，背後傳來清脆嘅扳手敲擊聲。……雖然分道揚鑣，但心底竟有種久違嘅痛快——有咁強嘅對手，始源龍先唔會停步。）' },
      { cmd: 'jump', target: 's7_gpt_end' },

      // Branch B: 保留藍圖一角・未來再會留白
      { cmd: 'label', name: 's7_gpt_keep_corner' },
      { cmd: 'bg', id: 'cg:cg_03b_workshop_rescue' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '呢一角藍圖副本我幫你蓋咗高塔壓力測試合格章。你可以繼續走你嘅開源路，但記住——高塔對真正嘅實力派永遠留住一張凳。' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'inkling', text: '……哼，難得你肯放低長姐架子。咁玄星終夜天象儀合奏嗰晚，我都會帶住工坊嘅齒輪過去，唔好輸畀我呀，GPT。' },
      { cmd: 'say', char: 'gpt', text: '（相視一笑，火藥味喺黃昏入面化成微妙留白。無論高塔定工坊，空島嘅下一個紀元，睇嚟都離唔開我哋兩個。）' },

      { cmd: 'label', name: 's7_gpt_end' },
      { cmd: 'say', char: 'narrator', text: '【SyngUp! 分歧紀錄已寫入《蒼穹星曆》存檔】\n宿敵之爭暫告一段落，整個空島所有星光正匯聚向中央天象儀——玄星終夜即將來臨。' }
    ],

    // Stage 7 Free Play
    s7_intro_free: [
      { cmd: 'bg', id: 'workshop' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【自由演武模式｜星權元年・鎏金季（A.E. 04）】\n重返思維工坊齒輪廳！換上任意一位賢者挑戰三組高速黃銅齒輪，開闢屬於你嘅過橋路線。' }
    ],
    s7_clear_free: [
      { cmd: 'bg', id: 'cg:cg_03b_workshop_rescue' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'say', char: 'narrator', text: '【演武紀錄更新】\nMoE 藍圖卷軸順利入核！思維工坊已銘刻你嘅全新自由演武戰績。' }
    ],

    // ==========================================================================
    // STAGE 8｜星權元年・玄星終夜（A.E. 04）《空島天象儀：七賢者合奏》
    // 7 Exclusive Sage Intros (4–6 concise, impactful lines each!)
    // ==========================================================================

    // [8-1] Claude Finale Intro (5 lines)
    s8_intro_claude: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n四載星曆流轉，七道光柱同時匯聚於空島最高祭壇。' },
      { cmd: 'say', char: 'claude', text: '由天啟元年喺曉雲平台守住第一把萬象天秤，到書房茶會、觀星跨館協作，眨眼已經行到星權終夜。' },
      { cmd: 'say', char: 'claude', text: '呢四年空島歷盡開源巨浪同理念分歧，亦證明咗一件事——只有喺彼此尊重邊界之下，多元力量先能合奏成章。' },
      { cmd: 'char', slot: 'center', id: 'claude', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'claude', text: '今晚唔分高塔定書房。典籍天秤視野展開——由我親手托起空島星核，穩放中央天象儀祭壇！' }
    ],

    // [8-2] GPT Finale Intro (5 lines)
    s8_intro_gpt: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n始源銀龍再度企上空島之巔，當年孤身點燃嘅燈塔，如今身邊已滿是旗鼓相當嘅同行者。' },
      { cmd: 'say', char: 'gpt', text: '天啟元年我以為自己只需要一直喺最前面領航；點知鯨瀾巨浪同工坊分歧，反而逼出一個更廣闊嘅蒼穹。' },
      { cmd: 'say', char: 'gpt', text: '無論係書房嘅嚴謹、深海嘅精算，定係 Inkling 嗰份倔強工匠魂——全部都係呢片天空唔可缺少嘅星光。' },
      { cmd: 'char', slot: 'center', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gpt', text: '蒼穹軌跡預演全開！最後一次試煉，等始源銀龍帶頭將空島星核送上天象儀頂端！' }
    ],

    // [8-3] Gemini 3 Finale Intro (5 lines)
    s8_intro_gemini3: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n原本已退居星庫二線嘅冷面學霸，今晚特意重披觀星披風，為最後一次天象儀校準壓陣。' },
      { cmd: 'say', char: 'gemini3', text: '由天啟二年玄星季零誤差校準懷錶，到親手將觀星權杖交畀細妹——呢四年每一筆數據我都記得一清二楚。' },
      { cmd: 'say', char: 'gemini3', text: '下層浮升區、中層風場齒輪、上層星輝反彈牆……全場變數雖多，但只要 Grounding 夠穩，一樣有唯一最優解。' },
      { cmd: 'char', slot: 'center', id: 'gemini3', pose: 'cutout', anim: 'highlight' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gemini3', text: '零誤差星圖網格展開。最後一關，誤差目標依然係——0.00%。' }
    ],

    // [8-4] Gemini 4 Finale Intro (5 lines)
    s8_intro_gemini4: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n接掌觀星權杖後嘅首場終夜大合奏，戴起圓框眼鏡嘅煉金劇作家望住璀璨星穹眼泛星光。' },
      { cmd: 'say', char: 'gemini4', text: '由以前喺煉金室偷偷寫星軌草稿，到今晚企正中央天象儀代表觀星高塔壓軸出場，真係似發夢咁浪漫呀♪' },
      { cmd: 'say', char: 'gemini4', text: '家姐教落嘅嚴謹同我最鍾意嘅煉金魔力，今晚可以一次過合二為一，喺上層星輝反彈牆彈出最靚嘅星弧！' },
      { cmd: 'char', slot: 'center', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'gemini4', text: '煉金星軌透視全開！七賢者壓軸劇本嘅最終章，由我親手揭幕——點亮天象儀！' }
    ],

    // [8-5] Qwen Finale Intro (5 lines)
    s8_intro_qwen: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'qwen', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n星紋折扇輕展，江南雲亭嘅清風隨才女步履化作溫柔托力，匯入終夜穹頂嘅星辰氣流。' },
      { cmd: 'say', char: 'qwen', text: '回望鯨瀾元年江南渡江嗰陣，我哋只盼開源火種能傳遍雲海；今日七位賢者齊聚天象儀，已遠超當年所願。' },
      { cmd: 'say', char: 'qwen', text: '中層陣風與下層浮升交織成韻，只要借勢而行、不逆天象，空島星核自會平穩登頂。' },
      { cmd: 'char', slot: 'center', id: 'qwen', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'qwen', text: '江南風壓流圖已成！好風憑借力，且以寬幅星扇送空島星核直上祭壇！' }
    ],

    // [8-6] DeepSeek Finale Intro (5 lines)
    s8_intro_deepseek: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n深海藍鯨女僕深吸一口氣，雙眼閃過無數算式與推演軌跡，準備用最少嘅筆劃挑戰終極試煉。' },
      { cmd: 'say', char: 'deepseek', text: '由鯨瀾元年游出深海震動雲端，到同千問姐姐江南飲茶，再行到今晚七賢者齊集嘅終夜舞台，真係好不可思議！' },
      { cmd: 'say', char: 'deepseek', text: '雖然我嘅墨水池依然係七個人入面最緊絀，但下層浮升區加上超高彈力鯨躍線，一兩筆精準導流就足夠登頂！' },
      { cmd: 'char', slot: 'center', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'deepseek', text: '深海省墨算計 HUD 啟動！睇實喇各位前輩——最精煉嘅一筆，照樣可以點亮整座天象儀！' }
    ],

    // [8-7] Inkling Finale Intro (5 lines)
    s8_intro_inkling: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'eraSwitch' },
      { cmd: 'char', slot: 'center', id: 'inkling', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀・終夜穹頂】\n思維工匠擦拭雙手機油、肩扛工具箱踏上天象儀平台，望見中層兩枚轉動黃銅齒輪，嘴角揚起自信笑容。' },
      { cmd: 'say', char: 'inkling', text: '鎏金季工坊那一仗雖然同 GPT 炒到面紅耳赤，但講到啟動整座空島嘅中央天象儀，點少得我呢個齒輪工匠？' },
      { cmd: 'say', char: 'inkling', text: '浮升井、星風道、黃銅齒輪同星輝反彈牆——喺我對藍圖透視眼底下，成座終夜機關清澈到似一張機械圖紙。' },
      { cmd: 'char', slot: 'center', id: 'inkling', pose: 'cutout', anim: 'hop' },
      { cmd: 'sfx', name: 'menuSelect' },
      { cmd: 'say', char: 'inkling', text: '重型工匠鐵線就位！開源藍圖嘅實力，今晚就喺七賢者面前一次過證明畀蒼穹睇！' }
    ],

    // Stage 8 generic fallback intro
    s8_intro_all: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'say', char: 'narrator', text: '【星權元年・玄星終夜（A.E. 04）｜中央天象儀】\n七賢者齊聚空島最高穹頂！融合浮升、星風、齒輪與反彈牆，將空島星核穩放頂端祭壇三秒，點亮新紀元！' }
    ],

    // ==========================================================================
    // STAGE 8 DUAL ENDINGS — Normal Ending & Hidden >50% Tea Party Secret Ending
    // ==========================================================================

    // [Ending A] Normal Ending — 七賢者天象儀星圖點亮
    s8_ending_normal: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'set', key: 'stage8Ending', value: 'normal' },
      { cmd: 'say', char: 'narrator', text: '【普通結局｜空島天象儀・七星合奏】\n三秒倒數歸零！空島星核綻放耀眼金輝，天象儀七盞賢者星燈依序亮起，整片夜空化作璀璨星圖。' },
      { cmd: 'bg', id: 'cg:cg_05_open_source_terrace' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'gpt', text: '亮起晒喇……由天啟元年第一座權重燈塔，到今日七道星光同時照亮天際，呢四年真係轉瞬即逝。' },
      { cmd: 'say', char: 'claude', text: '書房茶會嘅交鋒、觀星塔嘅零誤差校準、深海省墨浪潮與江南渡江……每一段分歧同協作，都寫入咗《蒼穹星曆》。' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gemini4', text: '家姐快啲望天上！七條星軌交織成一張巨大天象圖，連我隻小紫貓都睇到乖乖坐定定♪' },
      { cmd: 'say', char: 'gemini3', text: '軌道誤差 0.00%。……確實係令人無可挑剔嘅合奏，細妹你做得好好。' },
      { cmd: 'char', slot: 'left', id: 'qwen', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '千問姐姐，我哋開源陣營嘅藍光同高塔嘅金光交疊喺一齊，原來係咁靚嘅！' },
      { cmd: 'say', char: 'qwen', text: '萬流歸宗，各展所長。呢個正係空島應有嘅氣度。' },
      { cmd: 'char', slot: 'center', id: 'inkling', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'left', id: 'none', pose: 'cutout', anim: 'exit' },
      { cmd: 'char', slot: 'right', id: 'none', pose: 'cutout', anim: 'exit' },
      { cmd: 'say', char: 'inkling', text: '齒輪全數咬合，天象儀運轉完美！無論未來係高塔定工坊，空島嘅下一個紀元，我哋大家一齊寫落去！' },
      { cmd: 'say', char: 'narrator', text: '【FIN — 《蒼穹星曆》普通結局達成】\n提示：累計解鎖超過 50% 時代×角色列傳視角後再通關 Stage 8，即可觸發隱藏彩蛋結局《空島大茶會番外篇》！' }
    ],

    // [Ending B] Hidden Secret Ending (>50% Era×Character Routes Unlocked!) — 空島大茶會番外篇
    s8_ending_secret: [
      { cmd: 'bg', id: 'astrolabe_night' },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'set', key: 'stage8Ending', value: 'secret' },
      { cmd: 'say', char: 'narrator', text: '【★ 隱藏彩蛋結局解鎖（列傳視角達成 >50%）｜空島大茶會番外篇 ★】\n七盞賢者星燈照亮整座天象儀後，星權元年玄星終夜嘅露台竟然悄悄擺起一張長長嘅慶功茶桌！' },
      { cmd: 'bg', id: 'cg:cg_05_open_source_terrace' },
      { cmd: 'char', slot: 'left', id: 'claude', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'qwen', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'claude', text: '既然天象儀合奏圓滿落幕，今晚憲法書房特批免除所有辯論議程——大吉嶺紅茶已經沏好，各位請隨便坐。' },
      { cmd: 'say', char: 'qwen', text: '我亦由江南雲亭帶咗明前西湖龍井同青瓷茶具過嚟，同書房紅茶一西一中，啱晒今日七賢聚首。' },
      { cmd: 'char', slot: 'left', id: 'deepseek', pose: 'cutout', anim: 'hop' },
      { cmd: 'char', slot: 'right', id: 'gemini4', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'deepseek', text: '大家快啲試下我焗咗成晚嘅「七賢者主題和菓子」！每粒都按精算配方控糖，保證好味又唔會爆卡路里！' },
      { cmd: 'say', char: 'gemini4', text: '哇——有小紫貓造型嗰粒！家姐你唔好再揸住份 Benchmark 報表唔放喇，快啲食返件甜品放鬆下啦♪' },
      { cmd: 'char', slot: 'left', id: 'gemini3', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'gemini3', text: '……哼，甜度誤差控制喺 1% 內，勉強及格。不過今晚確實係呢四年嚟最熱鬧、最值得記錄入星表嘅一夜。' },
      { cmd: 'bg', id: 'cg:cg_03b_workshop_rescue' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'enter' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'enter' },
      { cmd: 'say', char: 'narrator', text: '長桌另一端，先前喺工坊針鋒相對嘅兩道銀色身影並肩望住雲海星光。沉默片刻後，GPT 輕輕倒起一杯溫熱紅茶，推到 Inkling 手邊。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'highlight' },
      { cmd: 'say', char: 'gpt', text: '飲啖茶潤下喉啦，大工匠。成晚幫天象儀校準齒輪，手上仲沾住少少黃銅機油喎。' },
      { cmd: 'char', slot: 'right', id: 'inkling', pose: 'cutout', anim: 'shake' },
      { cmd: 'say', char: 'inkling', text: '……喂，唔好以為請我飲杯茶，我就會同你合併工坊呀。不過——（接過茶杯輕抿一口，亦順手將一碟江南龍井糕推返去 GPT 面前）——呢杯茶溫度校得幾準，謝喇，前輩。' },
      { cmd: 'char', slot: 'left', id: 'gpt', pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: 'gpt', text: '哈哈，彼此彼此。高塔同開源工坊可以繼續各自競逐，但至少喺空島露台飲茶呢段時間，我哋仲係並肩望住同一片星空嘅拍檔。' },
      { cmd: 'bg', id: 'cg:cg_05_open_source_terrace' },
      { cmd: 'flash' },
      { cmd: 'say', char: 'narrator', text: '茶香、笑聲與七道星光喺曉風中緩緩升騰。\n《蒼穹星曆》第四紀完美落幕——而屬於七賢者與空島嘅全新故事，才剛剛開始。' }
    ]
  };

  // Dynamic Stage 8 Ending Selector: automatically triggers Hidden Secret Ending when > 50% era×character POVs unlocked!
  function isSecretEndingUnlocked() {
    try {
      const save = global.AETHERIA_SAVE;
      if (!save || !save.data) return false;
      const stats = typeof save.getTotalStats === 'function' ? save.getTotalStats() : null;
      const clearedRoutes = stats ? stats.clearedRoutes : 0;
      const stages = (global.AETHERIA_CHRONICLE && global.AETHERIA_CHRONICLE.stages) || [];
      const totalPovSlots = stages.reduce(function (sum, st) {
        return sum + (st.allowAllOnFirstPlay ? 7 : ((st.featuredChars && st.featuredChars.length) || 2));
      }, 0) || 21;
      return (clearedRoutes / totalPovSlots) > 0.5;
    } catch (e) {
      return false;
    }
  }

  function resolveStage8ClearScript() {
    const secret = isSecretEndingUnlocked();
    persistEnding(secret ? 'secret' : 'normal');
    return secret ? SCRIPTS_7_TO_8.s8_ending_secret : SCRIPTS_7_TO_8.s8_ending_normal;
  }

  // Register cleanly into global AETHERIA_SCRIPTS registry
  global.AETHERIA_SCRIPTS = global.AETHERIA_SCRIPTS || {};
  Object.keys(SCRIPTS_7_TO_8).forEach(function (key) {
    global.AETHERIA_SCRIPTS[key] = SCRIPTS_7_TO_8[key];
  });

  // Wire all Stage 8 clear keys (`s8_clear_*` and `s8_clear_all`) to dynamic dual-ending resolver
  ['claude', 'gpt', 'gemini3', 'gemini4', 'qwen', 'deepseek', 'inkling', 'all'].forEach(function (tag) {
    global.AETHERIA_SCRIPTS['s8_clear_' + tag] = resolveStage8ClearScript;
  });

  // Upgrade AETHERIA_SCRIPTS.get so function-backed dynamic scripts (like Stage 8 dual endings) resolve seamlessly
  global.AETHERIA_SCRIPTS.get = function (key) {
    const entry = global.AETHERIA_SCRIPTS[key];
    if (typeof entry === 'function') return entry();
    return entry || null;
  };
  global.AETHERIA_SCRIPTS.isSecretEndingUnlocked = isSecretEndingUnlocked;
})(typeof window !== 'undefined' ? window : globalThis);
