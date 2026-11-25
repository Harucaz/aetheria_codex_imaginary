/**
 * Aetheria 8-bit Arcade - 光榮風「📜 賢者列傳圖鑑與劇本回想室」＋ 自由演武通用對白系統
 * Independent UI Module (js/codex_ui.js) — loaded before js/main.js.
 * Provides:
 *  1. getFallbackScript(stageId, charId, phase) for all 8 stages x 7 sages = 56 combos (0 undefined)
 *  2. Koei-style 8-bit Codex Modal with Tab 1 (Seven Sages Biographies) & Tab 2 (Chronicle Replay Room)
 *  3. Clean modal focus restoration back to the Chronology Hub on close.
 */
(function (global) {
  'use strict';

  // ============================================================================
  // 1. 「自由演武模式」通用角色出場回退對白 — getFallbackScript(stageId, charId, phase)
  // ============================================================================
  const FALLBACK_PERSONAS = {
    claude: {
      intro1: '（典籍守望者翻開隨身筆記，神情沉穩有禮）以自由演武身份踏足《{title}》，正好讓我從另一角度檢視呢個時代嘅平衡與秩序。',
      intro2: '呢度係「{location}」，雖然唔係我原本嘅主場，但憲法書房嘅 Alignment 原則放諸四海皆準。',
      intro3: '「{visionName}」展開——量清重心傾角，用高摩擦穩固典籍線，將呢場試煉處理得滴水不漏！',
      clear1: '呼……穩妥通關。即使換咗非主場視角，只要守住承重邊界同分寸，一樣可以零失誤完成《{title}》。',
      clear2: '今次自由演武嘅數據我已經整理入書房檔案，對日後校準空島天秤大有裨益。',
      clear3: '（輕輕合上古卷微笑）多謝呢個時代嘅前輩同行，下一站我哋再繼續切磋。'
    },
    gpt: {
      intro1: '哈哈，自由演武時間到！換由我呢條蒼穹始源龍空降《{title}》，睇下會擦出咩新火花～',
      intro2: '「{location}」嘅機關望落幾有趣喎！就算唔係原定主場劇本，全能通用路線一樣應付自如。',
      intro3: '「{visionName}」全開！望實金色拋物線落點，配合微浮力銀龍線，優雅破關！',
      clear1: 'Bingo！乾手淨腳搞掂《{title}》！睇嚟無論邊個紀元嘅謎題，都難唔倒始源銀龍嘅全局手感。',
      clear2: '換個角度重走「{location}」，反而睇到唔少當初忽略咗嘅新路徑同解題靈感。',
      clear3: '（伸個懶腰望向雲海）呢份自由演武戰績已經寫入《蒼穹星曆》，下一個時代見！'
    },
    gemini3: {
      intro1: '……自由演武模式？即係要我幫《{title}》重新做一次零幻覺 Grounding 覆核囉。',
      intro2: '掃描完「{location}」嘅幾何結構，原先啲人嘅畫法誤差率太高，睇落好唔順眼。',
      intro3: '「{visionName}」展開。用硬質星線同精準入射角，示範一次 0.00% 誤差嘅標準解法。',
      clear1: '《{title}》覆核完成，物理軌跡完全吻合預測模型，零 Hallucination。',
      clear2: '哼，雖然唔係我嘅主場時代，但呢組 Benchmark 數據已經順手幫你刷靚咗。',
      clear3: '（收起懷錶與核查表）記錄歸檔。如果有其他時代需要精密校準，隨時再搵我。'
    },
    gemini4: {
      intro1: '耶～自由演武換我上場客串《{title}》呀♪ 戴起副圓框眼鏡，成個舞台即刻閃令令！',
      intro2: '原來「{location}」仲收埋咗咁多發光星軌同隱藏機關，家姐以前都冇同我講過嘅！',
      intro3: '「{visionName}」全開！等煉金劇作家用輕盈高彈星光線，寫一段超華麗嘅番外劇本啦♪',
      clear1: '完美落幕——《{title}》嘅煉金番外篇大成功！剛才個彈射弧度簡直似煙花咁靚♪',
      clear2: '估唔到喺「{location}」用高彈性線條都可以玩出咁多花式，我要即刻寫低落靈感筆記簿！',
      clear3: '（向小紫貓擊掌慶祝）自由演武真係好好玩，下次再搵我去其他時代客串呀！'
    },
    qwen: {
      intro1: '（輕搖星紋折扇，溫婉一笑）有幸以自由演武客卿身份造訪《{title}》，且看江南清風能否化解此地難關。',
      intro2: '「{location}」別有一番氣韻，無論有風無風，只要順勢而為、海納百川，自能覓得破局之道。',
      intro3: '「{visionName}」起勢！寬幅紙扇線已備妥，請看我借勢引導，穩渡此關。',
      clear1: '《{title}》已安然渡過，茶香未散、星珠歸位，呢份從容正合江南雲亭之心境。',
      clear2: '以非主場視角細味「{location}」，方知諸位賢者各自嘅用心與巧思。',
      clear3: '（收攏折扇微欠身）自由演武戰績已載入星曆，改日歡迎移步雲亭共品龍井。'
    },
    deepseek: {
      intro1: '呼～藍鯨推理女僕報到！今次自由演武輪到我客串挑戰《{title}》，好興奮呀！',
      intro2: '望落「{location}」原本要使好多墨水喎……不過用我套 MoE 精算同超高彈力線，應該慳一半以上就搞掂！',
      intro3: '「{visionName}」啟動！每一像素都要計到最盡——睇實我點樣以小博大破關！',
      clear1: '耶——《{title}》低成本極限通關成功！計番實時耗墨率，比原先方案慳咗一大截呀！',
      clear2: '（開心地喺草稿紙打個大剔）就算唔係深海主場，數學推導同高彈鯨躍線喺「{location}」一樣大派用場！',
      clear3: '自由演武紀錄更新完畢！獎勵自己食返粒小藍鯨和菓子，再挑戰下一關！'
    },
    inkling: {
      intro1: '（單手轉動黃銅扳手，咧嘴一笑）自由演武點少得思維工匠？等我幫《{title}》做個現場機械改裝！',
      intro2: '「{location}」嘅結構喺我眼中就似一張開放藍圖——只要搵準支點同力矩，重型鐵線一壓就掂。',
      intro3: '「{visionName}」掃描完成！唔講咁多廢話，睇實工匠鐵線點樣硬橋硬馬拆解機關！',
      clear1: '搞掂！《{title}》順利通關——齒輪同力矩從來唔會呃人，重型鐵線一樣玩得轉！',
      clear2: '（拍走手上機油）喺「{location}」試完新改裝方案，又收集到唔少 Open-Weights 實戰靈感。',
      clear3: '呢份自由演武藍圖已經存檔！隨時準備好去下一個時代繼續拆機改裝！'
    }
  };

  function getFallbackScript(stageId, charId, phase) {
    const chron = global.AETHERIA_CHRONICLE;
    const chars = global.AETHERIA_CHARACTERS;
    const st = (chron && chron.stages && chron.stages.find(function (s) { return s.id === Number(stageId); })) || {
      id: Number(stageId) || 1,
      eraLabel: '蒼穹星曆・自由演武',
      title: '空島試煉',
      location: '空島雲台',
      bgId: 'sky_island',
      cgKey: 'cg_05_open_source_terrace'
    };
    const cid = (charId && chars && chars[charId]) ? charId : 'claude';
    const ch = (chars && chars[cid]) || { id: cid, name: cid, visionName: '賢者視野' };
    const p = FALLBACK_PERSONAS[cid] || FALLBACK_PERSONAS.claude;
    const isClear = phase === 'clear';

    function fmt(tpl) {
      return String(tpl || '')
        .replace(/\{title\}/g, st.title)
        .replace(/\{location\}/g, st.location)
        .replace(/\{eraLabel\}/g, st.eraLabel)
        .replace(/\{visionName\}/g, ch.visionName || '專屬視野');
    }

    if (!isClear) {
      return [
        { cmd: 'bg', id: st.bgId || 'sky_island' },
        { cmd: 'bgm', track: 'vn' },
        { cmd: 'sfx', name: 'eraSwitch' },
        { cmd: 'char', slot: 'center', id: cid, pose: 'cutout', anim: 'enter' },
        { cmd: 'say', char: 'narrator', text: '【自由演武模式｜' + st.eraLabel + '・' + st.location + '】\n' + ch.name + ' 以異色視角踏入《' + st.title + '》，展開全新物理流派挑戰！' },
        { cmd: 'say', char: cid, text: fmt(p.intro1) },
        { cmd: 'say', char: cid, text: fmt(p.intro2) },
        { cmd: 'char', slot: 'center', id: cid, pose: 'cutout', anim: 'hop' },
        { cmd: 'sfx', name: 'menuSelect' },
        { cmd: 'say', char: cid, text: fmt(p.intro3) }
      ];
    }

    return [
      { cmd: 'bg', id: st.cgKey ? ('cg:' + st.cgKey) : (st.bgId || 'sky_island') },
      { cmd: 'bgm', track: 'vn' },
      { cmd: 'sfx', name: 'clear' },
      { cmd: 'flash' },
      { cmd: 'char', slot: 'center', id: cid, pose: 'cutout', anim: 'hop' },
      { cmd: 'say', char: cid, text: fmt(p.clear1) },
      { cmd: 'say', char: cid, text: fmt(p.clear2) },
      { cmd: 'say', char: cid, text: fmt(p.clear3) },
      { cmd: 'say', char: 'narrator', text: '【自由演武通關紀錄已寫入《蒼穹星曆》】\n' + ch.name + ' 成功征服《' + st.title + '》！' }
    ];
  }

  // Expose fallback script API globally and on AETHERIA_SCRIPTS
  global.getFallbackScript = getFallbackScript;
  global.AETHERIA_SCRIPTS = global.AETHERIA_SCRIPTS || {};
  global.AETHERIA_SCRIPTS.getFallbackScript = getFallbackScript;

  // ============================================================================
  // 2. 光榮風「📜 賢者列傳圖鑑與劇本回想室」UI Controller
  // ============================================================================
  const CodexUI = {
    activeTab: 'sages', // 'sages' | 'replay'
    lastFocusedEl: null,
    _boundKeyDown: null,

    init: function () {
      const btnOpen = document.getElementById('btnOpenCodex');
      const btnClose = document.getElementById('btnCloseCodex');
      const modal = document.getElementById('codexModal');
      const tabSages = document.getElementById('btnCodexTabSages');
      const tabReplay = document.getElementById('btnCodexTabReplay');

      if (btnOpen) {
        btnOpen.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuSelect();
          this.open('sages');
        });
      }
      if (btnClose) {
        btnClose.addEventListener('click', () => this.close());
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.close();
        });
      }
      if (tabSages) {
        tabSages.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
          this.switchTab('sages');
        });
      }
      if (tabReplay) {
        tabReplay.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
          this.switchTab('replay');
        });
      }

      this._boundKeyDown = (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          // Do not close codex if VN replay modal is currently on top of it
          const vnModal = document.getElementById('vnModal');
          if (vnModal && vnModal.classList.contains('open')) return;
          e.preventDefault();
          this.close();
        }
      };
      global.addEventListener('keydown', this._boundKeyDown);
    },

    isOpen: function () {
      const modal = document.getElementById('codexModal');
      return !!(modal && modal.classList.contains('open'));
    },

    open: function (tab) {
      const modal = document.getElementById('codexModal');
      if (!modal) return;
      this.lastFocusedEl = document.activeElement;
      if (global.AETHERIA_HUB) {
        if (typeof global.AETHERIA_HUB.closeSandbox === 'function') global.AETHERIA_HUB.closeSandbox();
        if (typeof global.AETHERIA_HUB.closeStage === 'function') global.AETHERIA_HUB.closeStage();
      }
      this.activeTab = tab || this.activeTab || 'sages';
      modal.classList.add('open');
      this.render();
      const closeBtn = document.getElementById('btnCloseCodex');
      if (closeBtn) closeBtn.focus();
    },

    close: function () {
      const modal = document.getElementById('codexModal');
      if (modal) modal.classList.remove('open');
      if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuBack();
      // Restore keyboard & mouse focus cleanly back to the Chronology Hub
      const target = (this.lastFocusedEl && typeof this.lastFocusedEl.focus === 'function')
        ? this.lastFocusedEl
        : document.getElementById('btnOpenCodex');
      if (target && typeof target.focus === 'function') {
        try { target.focus(); } catch (err) { /* ignore */ }
      }
      this.lastFocusedEl = null;
    },

    switchTab: function (tab) {
      this.activeTab = tab === 'replay' ? 'replay' : 'sages';
      this.render();
    },

    render: function () {
      const tabSages = document.getElementById('btnCodexTabSages');
      const tabReplay = document.getElementById('btnCodexTabReplay');
      const body = document.getElementById('codexBody');
      const summaryEl = document.getElementById('codexSummaryPill');
      if (!body) return;

      if (tabSages) tabSages.classList.toggle('primary', this.activeTab === 'sages');
      if (tabReplay) tabReplay.classList.toggle('primary', this.activeTab === 'replay');

      const saveData = (global.AETHERIA_SAVE && global.AETHERIA_SAVE.data) || { records: {}, vnChoices: {}, stageCleared: {} };
      const stats = (global.AETHERIA_SAVE && typeof global.AETHERIA_SAVE.getTotalStats === 'function')
        ? global.AETHERIA_SAVE.getTotalStats()
        : { totalStars: 0, clearedStages: 0, clearedRoutes: 0 };
      const totalPovSlots = 21; // Stage 1-7 (2 each = 14) + Stage 8 (7) = 21 core POV routes
      const pct = Math.min(100, Math.round((stats.clearedRoutes / totalPovSlots) * 100));

      if (summaryEl) {
        summaryEl.textContent = '列傳解鎖率 ' + pct + '% (' + stats.clearedRoutes + '/' + totalPovSlots + ') | 累計 ★' + stats.totalStars + (pct > 50 ? ' | ★隱藏結局已達標' : ' | >50% 解鎖隱藏結局');
      }

      if (this.activeTab === 'sages') {
        this._renderSagesTab(body, saveData);
      } else {
        this._renderReplayTab(body, saveData, pct);
      }
    },

    // ---- Tab 1: 七賢者列傳 ----
    _renderSagesTab: function (host, saveData) {
      const chars = global.AETHERIA_CHARACTERS || {};
      const order = global.AETHERIA_CHAR_ORDER || Object.keys(chars);
      const assets = global.AETHERIA_ASSETS || {};
      const stages = (global.AETHERIA_CHRONICLE && global.AETHERIA_CHRONICLE.stages) || [];

      function pctBar(val, maxVal, color) {
        const p = Math.max(8, Math.min(100, Math.round((val / maxVal) * 100)));
        return '<div class="codex-bar-track"><div class="codex-bar-fill" style="width:' + p + '%;background:' + color + ';"></div></div>';
      }

      let html = '<div class="codex-sage-grid">';
      order.forEach(function (cid) {
        const ch = chars[cid];
        if (!ch) return;
        const mod = ch.physicsModifier || {};
        const chAssets = (assets.characters && assets.characters[cid]) || {};
        const chibiUrl = chAssets.chibiThumb || chAssets.sprite64 || '';
        const spriteUrl = chAssets.sprite64 || chAssets.sprite48 || '';

        // Compute per-character clear stats across all 8 stages
        let clearedCount = 0;
        let charStars = 0;
        const clearedCodes = [];
        stages.forEach(function (st) {
          const rec = saveData.records && saveData.records[st.id] && saveData.records[st.id][cid];
          if (rec && rec.cleared) {
            clearedCount++;
            charStars += (rec.stars || 0);
            clearedCodes.push(st.code);
          }
        });

        const inkVal = Math.round((mod.inkMultiplier != null ? mod.inkMultiplier : 1.0) * 100);
        const weightVal = mod.density != null ? mod.density : 1.0;
        const bounceVal = mod.restitution != null ? mod.restitution : 0.3;
        const frictionVal = mod.friction != null ? mod.friction : 0.45;

        html +=
          '<article class="codex-sage-card" style="border-top:4px solid ' + ch.accent + ';">' +
            '<div class="codex-sage-head">' +
              '<div class="codex-art-pair">' +
                '<div class="codex-art-box"><img src="' + chibiUrl + '" alt="' + ch.name + ' Q版" /><span>Q版原畫</span></div>' +
                '<div class="codex-art-box"><img class="pixel-art" src="' + spriteUrl + '" alt="' + ch.name + ' 8-bit" /><span>8-bit 精靈</span></div>' +
              '</div>' +
              '<div class="codex-sage-title">' +
                '<h4 style="color:' + ch.accent + ';">' + ch.name + ' <small>【' + ch.title + '】</small></h4>' +
                '<div class="codex-faction">' + ch.faction + '</div>' +
                '<div class="codex-motto">' + ch.motto + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="codex-bars">' +
              '<div class="codex-bar-row"><span>墨水量</span>' + pctBar(inkVal, 120, '#38bdf8') + '<em>' + inkVal + '%</em></div>' +
              '<div class="codex-bar-row"><span>重量</span>' + pctBar(weightVal, 2.5, '#f59e0b') + '<em>' + weightVal.toFixed(2) + 'x</em></div>' +
              '<div class="codex-bar-row"><span>彈性</span>' + pctBar(bounceVal, 1.35, '#c084fc') + '<em>' + bounceVal.toFixed(2) + '</em></div>' +
              '<div class="codex-bar-row"><span>摩擦</span>' + pctBar(frictionVal, 1.0, '#4ade80') + '<em>' + frictionVal.toFixed(2) + '</em></div>' +
            '</div>' +
            '<div class="codex-vision-box">' +
              '<strong>👁 ' + ch.visionName + '</strong>：' + ch.visionDesc +
              '<div class="codex-stroke-tag">畫線特性：' + ch.strokeSummary + '</div>' +
            '</div>' +
            '<div class="codex-progress-row">' +
              '<span>通關進度：<strong>' + clearedCount + '/8</strong> 時代（★' + charStars + '）</span>' +
              '<span class="codex-cleared-tags">' + (clearedCodes.length ? clearedCodes.join('・') : '尚未出戰') + '</span>' +
            '</div>' +
          '</article>';
      });
      html += '</div>';
      host.innerHTML = html;
    },

    // ---- Tab 2: 編年史劇本回想室 ----
    _renderReplayTab: function (host, saveData, unlockPct) {
      const chron = global.AETHERIA_CHRONICLE;
      const chars = global.AETHERIA_CHARACTERS || {};
      const vnChoices = (saveData && saveData.vnChoices) || {};
      const collectedBranches = vnChoices.collectedBranches || {};
      const endings = vnChoices.endings || {};

      host.innerHTML = '';

      chron.eras.forEach((era) => {
        const sec = document.createElement('div');
        sec.className = 'codex-era-group era-' + era.id;
        sec.innerHTML =
          '<div class="codex-era-header" style="color:' + era.color + ';">' +
            '<span>【' + era.phase + '・年號「' + era.name + '」】' + era.span + '</span>' +
            '<small>' + era.tagline + '</small>' +
          '</div>';

        const list = document.createElement('div');
        list.className = 'codex-replay-list';

        era.stageIds.forEach((sid) => {
          const st = chron.stages.find((s) => s.id === sid);
          if (!st) return;

          const stageCard = document.createElement('div');
          stageCard.className = 'codex-stage-replay';
          stageCard.innerHTML = '<div class="codex-stage-replay-title">' + st.code + '｜' + st.eraLabel + '《' + st.title + '》</div>';

          const btnRow = document.createElement('div');
          btnRow.className = 'codex-replay-btns';

          // Stage 1–7 Core Dual-POV Scripts
          if (st.id <= 7) {
            st.featuredChars.forEach((cid) => {
              const ch = chars[cid];
              const rec = saveData.records && saveData.records[st.id] && saveData.records[st.id][cid];
              const unlocked = !!(rec && rec.cleared);
              this._appendReplayButton(
                btnRow,
                unlocked,
                ch.name + ' 視角・開場',
                st.eraLabel + ' — ' + ch.name + ' 序幕',
                's' + st.id + '_intro_' + cid
              );
              this._appendReplayButton(
                btnRow,
                unlocked,
                ch.name + ' 視角・通關',
                st.eraLabel + ' — ' + ch.name + ' 通關結語',
                's' + st.id + '_clear_' + cid
              );
            });

            // Stage 7 Special SyngUp! Branch Status Badges
            if (st.id === 7) {
              const b1 = !!(collectedBranches['s7_inkling_choice:part_ways'] || vnChoices.s7_inkling_choice === 'part_ways');
              const b2 = !!(collectedBranches['s7_inkling_choice:keep_corner'] || vnChoices.s7_inkling_choice === 'keep_corner');
              const b3 = !!(collectedBranches['s7_gpt_choice:part_ways'] || vnChoices.s7_gpt_choice === 'part_ways');
              const b4 = !!(collectedBranches['s7_gpt_choice:keep_corner'] || vnChoices.s7_gpt_choice === 'keep_corner');
              this._appendReplayButton(btnRow, b1, '★ Inkling 分歧：分道揚鑣', 'SyngUp! 分歧重播 — Inkling', 's7_clear_inkling');
              this._appendReplayButton(btnRow, b2, '★ Inkling 分歧：保留藍圖一角', 'SyngUp! 分歧重播 — Inkling', 's7_clear_inkling');
              this._appendReplayButton(btnRow, b3, '★ GPT 分歧：分道揚鑣', 'SyngUp! 分歧重播 — GPT', 's7_clear_gpt');
              this._appendReplayButton(btnRow, b4, '★ GPT 分歧：保留藍圖一角', 'SyngUp! 分歧重播 — GPT', 's7_clear_gpt');
            }
          } else {
            // Stage 8: 7 Exclusive Sage Intros + Dual Endings
            (global.AETHERIA_CHAR_ORDER || []).forEach((cid) => {
              const ch = chars[cid];
              const rec = saveData.records && saveData.records[8] && saveData.records[8][cid];
              const unlocked = !!(rec && rec.cleared);
              this._appendReplayButton(
                btnRow,
                unlocked,
                ch.name + ' 終戰獨白',
                st.eraLabel + ' — ' + ch.name + ' 終戰獨白',
                's8_intro_' + cid
              );
            });

            const normalUnlocked = !!(endings.normal || saveData.stageCleared[8]);
            const secretUnlocked = !!(endings.secret || (saveData.stageCleared[8] && unlockPct > 50));
            this._appendReplayButton(
              btnRow,
              normalUnlocked,
              '★ 普通結局：七賢者星圖合奏',
              '《蒼穹星曆》普通結局回想',
              's8_ending_normal'
            );
            this._appendReplayButton(
              btnRow,
              secretUnlocked,
              '★ 隱藏結局：空島大茶會番外篇',
              '《蒼穹星曆》隱藏彩蛋結局回想',
              's8_ending_secret'
            );
          }

          stageCard.appendChild(btnRow);
          list.appendChild(stageCard);
        });

        sec.appendChild(list);
        host.appendChild(sec);
      });
    },

    _appendReplayButton: function (container, unlocked, label, modalTitle, scriptKey) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'codex-replay-btn' + (unlocked ? ' unlocked' : ' locked');
      if (unlocked) {
        btn.textContent = '▶ ' + label;
        btn.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuSelect();
          const reg = global.AETHERIA_SCRIPTS;
          const script = reg && (typeof reg.get === 'function' ? reg.get(scriptKey) : reg[scriptKey]);
          if (Array.isArray(script) && global.AETHERIA_HUB && typeof global.AETHERIA_HUB._playScriptOrFallback === 'function') {
            global.AETHERIA_HUB._playScriptOrFallback(modalTitle, script, () => {
              // Refresh codex in case Stage 7 choice replay unlocked a new branch
              if (this.isOpen()) this.render();
            });
          }
        });
      } else {
        btn.textContent = '🔒 ？？？未踏足此視野';
        btn.title = '通關對應時代與角色視角後解鎖：' + label;
        btn.disabled = true;
      }
      container.appendChild(btn);
    }
  };

  global.AETHERIA_CODEX = CodexUI;

  document.addEventListener('DOMContentLoaded', function () {
    CodexUI.init();
  });
})(typeof window !== 'undefined' ? window : globalThis);
