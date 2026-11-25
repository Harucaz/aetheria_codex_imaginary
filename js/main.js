/**
 * Aetheria 8-bit Arcade - Koei-Style 《蒼穹星曆》Chronology Hub, Save System & Vision Sandbox
 */
(function (global) {
  'use strict';

  const SAVE_KEY = 'aetheria_8bit_arcade_save_v1';

  // ============================================================================
  // 1. Offline localStorage Auto-Save Manager
  // ============================================================================
  function createDefaultSave() {
    return {
      version: 1,
      selectedStageId: 1,
      selectedCharId: 'gpt',
      stageCleared: {},       // { [stageId]: true }
      records: {},            // { [stageId]: { [charId]: { cleared, stars, bestInk, bestTime } } }
      vnChoices: {},
      codexUnlocked: {}
    };
  }

  const SaveManager = {
    data: createDefaultSave(),

    load: function () {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.data = Object.assign(createDefaultSave(), parsed || {});
          this.data.stageCleared = this.data.stageCleared || {};
          this.data.records = this.data.records || {};
          this.data.vnChoices = this.data.vnChoices || {};
          this.data.codexUnlocked = this.data.codexUnlocked || {};
        }
      } catch (e) {
        this.data = createDefaultSave();
      }
      return this.data;
    },

    save: function () {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
      } catch (e) {
        /* ignore restricted storage */
      }
    },

    reset: function () {
      this.data = createDefaultSave();
      this.save();
    },

    getRecord: function (stageId, charId) {
      const s = this.data.records[stageId];
      return (s && s[charId]) ? s[charId] : null;
    },

    saveStageClear: function (stageId, charId, stars, inkUsed, elapsed) {
      this.data.stageCleared[stageId] = true;
      if (!this.data.records[stageId]) this.data.records[stageId] = {};
      const prev = this.data.records[stageId][charId];
      const next = {
        cleared: true,
        stars: Math.max(prev ? (prev.stars || 0) : 0, stars || 1),
        bestInk: prev && prev.bestInk != null ? Math.min(prev.bestInk, Math.round(inkUsed)) : Math.round(inkUsed),
        bestTime: prev && prev.bestTime != null ? Math.min(prev.bestTime, Number(elapsed.toFixed(1))) : Number(elapsed.toFixed(1))
      };
      this.data.records[stageId][charId] = next;
      this.save();
      return next;
    },

    getStageBestStars: function (stageId) {
      const s = this.data.records[stageId];
      if (!s) return 0;
      return Object.values(s).reduce(function (mx, rec) {
        return Math.max(mx, rec && rec.stars ? rec.stars : 0);
      }, 0);
    },

    getTotalStats: function () {
      let totalStars = 0;
      let clearedStages = 0;
      let clearedRoutes = 0;
      const stages = (global.AETHERIA_CHRONICLE && global.AETHERIA_CHRONICLE.stages) || [];
      stages.forEach((st) => {
        if (this.data.stageCleared[st.id]) clearedStages++;
        const sRec = this.data.records[st.id] || {};
        Object.values(sRec).forEach((r) => {
          if (r && r.cleared) {
            clearedRoutes++;
            totalStars += (r.stars || 0);
          }
        });
      });
      return { totalStars: totalStars, clearedStages: clearedStages, clearedRoutes: clearedRoutes };
    }
  };

  // ============================================================================
  // 2. Sandbox Multi-Mechanism Test Arena (Tests ALL 7 Visions & Physics Traits)
  // ============================================================================
  function buildSandboxStageConfig() {
    return {
      id: 'sandbox',
      title: '視野與物理 Sandbox 測試房',
      objectiveText: '自由畫線測試重力、陣風、齒輪、高彈板與 7 位賢者專屬 8-bit 視野！把雙星珠送入右側 GOAL 槽即可通關體驗。',
      inkMax: 680,
      gravity: { x: 0, y: 660 },
      walls: [
        // Left & right arena frame + floor
        { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#273659', border: '#6482b8' },
        { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#273659', border: '#6482b8' },
        { type: 'rect', x: 0, y: 386, w: 640, h: 14, color: '#273659', border: '#6482b8' },
        // Starting ledge (top-left)
        { type: 'rect', x: 12, y: 126, w: 118, h: 14, color: '#334878', border: '#90b4f8' },
        // Center divider ramp
        { type: 'segment', x1: 215, y1: 270, x2: 345, y2: 245, r: 6, color: '#455e96', border: '#9ec0ff' },
        // Goal cup walls (right side)
        { type: 'rect', x: 515, y: 298, w: 10, h: 88, color: '#2d6a4f', border: '#4ade80' },
        { type: 'rect', x: 618, y: 298, w: 10, h: 88, color: '#2d6a4f', border: '#4ade80' }
      ],
      balls: [
        { id: 'orb_a', tag: 'target', label: '星核 A', x: 66, y: 96, r: 15, color: '#fbbf24', stroke: '#fff7d6', restitution: 0.5 },
        { id: 'orb_b', tag: 'target', label: '星核 B', x: 102, y: 96, r: 13, color: '#38bdf8', stroke: '#e0f2fe', restitution: 0.55 }
      ],
      gravityZones: [
        { x: 140, y: 36, w: 165, h: 110, gx: 0, gy: 185, label: '低重力星域 (LOW-G)' }
      ],
      windFields: [
        { x: 325, y: 40, w: 280, h: 130, fx: 390, fy: -40, period: 4.0, duty: 0.6, phase: 0.2, label: '江南陣風場' }
      ],
      gears: [
        { x: 250, y: 332, r: 28, teeth: 8, toothLen: 10, toothR: 5, omega: 1.65, color: '#b47b2b', rimColor: '#fde68a' },
        { x: 326, y: 332, r: 24, teeth: 7, toothLen: 9, toothR: 5, omega: -2.0, color: '#8f5d1e', rimColor: '#fcd34d' }
      ],
      bumpers: [
        { x: 438, y: 222, r: 21, restitution: 1.35, boost: 230, color: '#ec4899' }
      ],
      hiddenNodes: [
        { x: 222, y: 174, r: 15, type: 'alchemy', label: '煉金借力點' },
        { x: 486, y: 156, r: 15, type: 'alchemy', label: '星軌折返點' }
      ],
      goals: [
        { id: 'sandbox_goal', shape: 'rect', x: 525, y: 306, w: 93, h: 80, acceptTags: ['target'], requiredCount: 1, holdTime: 0.7, label: 'GOAL 槽' }
      ]
    };
  }

  // ============================================================================
  // 3. Hub UI Controller
  // ============================================================================
  const HubApp = {
    selectedStageId: 1,
    selectedCharId: 'gpt',
    poseAnimTimer: null,
    poseMode: 'sit', // 'sit' | 'walk'
    walkFrame: 0,
    sandboxEngine: null,
    sandboxCharId: 'claude',
    stageEngine: null,
    activeStageId: null,
    activeStageCharId: null,
    _stageHudTimer: null,
    _resetArmTimer: null,
    _resetArmed: false,
    vnInstance: null,

    init: function () {
      SaveManager.load();
      this.selectedStageId = SaveManager.data.selectedStageId || 1;
      this.selectedCharId = SaveManager.data.selectedCharId || 'gpt';

      if (global.AETHERIA_ASSETS && typeof global.AETHERIA_ASSETS.preloadAll === 'function') {
        global.AETHERIA_ASSETS.preloadAll();
      }

      this._bindGlobalButtons();
      this.renderAll();
      this._startPoseTicker();
    },

    _bindGlobalButtons: function () {
      const btnMute = document.getElementById('btnToggleMute');
      if (btnMute) {
        this._syncMuteBtn();
        btnMute.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) {
            global.AETHERIA_AUDIO.init();
            global.AETHERIA_AUDIO.toggleMute();
            if (!global.AETHERIA_AUDIO.muted) {
              global.AETHERIA_AUDIO.playMenuSelect();
              global.AETHERIA_AUDIO.playBgm('hub');
            }
          }
          this._syncMuteBtn();
        });
      }

      const btnBgm = document.getElementById('btnPlayHubBgm');
      if (btnBgm) {
        btnBgm.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) {
            global.AETHERIA_AUDIO.init();
            if (global.AETHERIA_AUDIO.currentBgm) {
              global.AETHERIA_AUDIO.stopBgm();
              btnBgm.textContent = '♪ 開啟 8-bit BGM';
            } else {
              global.AETHERIA_AUDIO.setMuted(false);
              global.AETHERIA_AUDIO.playBgm('hub');
              btnBgm.textContent = '♪ 停止 8-bit BGM';
              this._syncMuteBtn();
            }
          }
        });
      }

      const btnReturnHub = document.getElementById('btnReturnHub');
      if (btnReturnHub) {
        btnReturnHub.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
          this.closeStage();
          this.closeVnModal();
          if (global.AETHERIA_CODEX && typeof global.AETHERIA_CODEX.close === 'function' && global.AETHERIA_CODEX.isOpen()) {
            global.AETHERIA_CODEX.close();
          }
          const sec = document.getElementById('chronicleSection');
          if (sec && typeof sec.scrollIntoView === 'function') {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      const btnResetSave = document.getElementById('btnResetSave');
      if (btnResetSave) {
        btnResetSave.addEventListener('click', () => {
          if (!this._resetArmed) {
            this._resetArmed = true;
            btnResetSave.textContent = '⚠ 再按確認清除存檔';
            btnResetSave.classList.add('armed');
            if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuBack();
            if (this._resetArmTimer) clearTimeout(this._resetArmTimer);
            this._resetArmTimer = setTimeout(() => {
              this._resetArmed = false;
              btnResetSave.textContent = '↺ 重置存檔';
              btnResetSave.classList.remove('armed');
            }, 4000);
          } else {
            this._resetArmed = false;
            if (this._resetArmTimer) clearTimeout(this._resetArmTimer);
            btnResetSave.textContent = '↺ 重置存檔';
            btnResetSave.classList.remove('armed');
            SaveManager.reset();
            this.selectedStageId = 1;
            this.selectedCharId = 'gpt';
            if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playRestart();
            this.renderAll();
          }
        });
      }

      const btnCloseSandbox = document.getElementById('btnCloseSandbox');
      if (btnCloseSandbox) {
        btnCloseSandbox.addEventListener('click', () => this.closeSandbox());
      }

      const btnSandboxRestart = document.getElementById('btnSandboxRestart');
      if (btnSandboxRestart) {
        btnSandboxRestart.addEventListener('click', () => {
          if (this.sandboxEngine) this.sandboxEngine.restart();
        });
      }

      const btnCloseVn = document.getElementById('btnCloseVn');
      if (btnCloseVn) {
        btnCloseVn.addEventListener('click', () => this.closeVnModal());
      }

      const btnCloseStage = document.getElementById('btnCloseStage');
      if (btnCloseStage) {
        btnCloseStage.addEventListener('click', () => this.closeStage());
      }

      const btnStageRestart = document.getElementById('btnStageRestart');
      if (btnStageRestart) {
        btnStageRestart.addEventListener('click', () => {
          this._hideStageOverlay();
          if (this.stageEngine) this.stageEngine.restart();
        });
      }

      const btnOverlayReplay = document.getElementById('btnOverlayReplay');
      if (btnOverlayReplay) {
        btnOverlayReplay.addEventListener('click', () => {
          this._hideStageOverlay();
          if (this.stageEngine) this.stageEngine.restart();
        });
      }

      const btnOverlayNext = document.getElementById('btnOverlayNext');
      if (btnOverlayNext) {
        btnOverlayNext.addEventListener('click', () => {
          const nextId = (this.activeStageId || 1) + 1;
          const nextStage = global.AETHERIA_CHRONICLE.stages.find((s) => s.id === nextId);
          this.closeStage();
          if (nextStage) {
            this.selectStage(nextStage.id);
            if (global.AETHERIA_STAGES && global.AETHERIA_STAGES[nextStage.id]) {
              this.launchStage(nextStage.id, nextStage.featuredChars[0]);
            }
          }
        });
      }

      const btnOverlayHub = document.getElementById('btnOverlayHub');
      if (btnOverlayHub) {
        btnOverlayHub.addEventListener('click', () => this.closeStage());
      }
    },

    _syncMuteBtn: function () {
      const btnMute = document.getElementById('btnToggleMute');
      if (!btnMute || !global.AETHERIA_AUDIO) return;
      btnMute.textContent = global.AETHERIA_AUDIO.muted ? '🔇 音效：靜音' : '🔊 音效：開啟';
    },

    _getStage: function (id) {
      return global.AETHERIA_CHRONICLE.stages.find((s) => s.id === id) || global.AETHERIA_CHRONICLE.stages[0];
    },

    isCharUnlockedForStage: function (stage, charId) {
      if (stage.allowAllOnFirstPlay) return true;
      if (stage.featuredChars.includes(charId)) return true;
      return !!SaveManager.data.stageCleared[stage.id];
    },

    selectStage: function (stageId) {
      const stage = this._getStage(stageId);
      this.selectedStageId = stage.id;
      if (!this.isCharUnlockedForStage(stage, this.selectedCharId)) {
        this.selectedCharId = stage.featuredChars[0];
      }
      SaveManager.data.selectedStageId = this.selectedStageId;
      SaveManager.data.selectedCharId = this.selectedCharId;
      SaveManager.save();
      if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playEraSwitch();
      this.renderAll();
    },

    selectChar: function (charId) {
      const stage = this._getStage(this.selectedStageId);
      if (!this.isCharUnlockedForStage(stage, charId)) {
        if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuBack();
        return;
      }
      this.selectedCharId = charId;
      SaveManager.data.selectedCharId = charId;
      SaveManager.save();
      if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
      this.renderPovRoster();
      this.renderPovInspector();
    },

    renderAll: function () {
      this.renderGlobalStats();
      this.renderChronicleTimeline();
      this.renderStageBrief();
      this.renderPovRoster();
      this.renderPovInspector();
    },

    renderGlobalStats: function () {
      const stats = SaveManager.getTotalStats();
      const el = document.getElementById('globalProgressPill');
      if (el) {
        el.textContent = '★ 星數 ' + stats.totalStars + ' | 時代通關 ' + stats.clearedStages + '/8 | 自由演武路線 ' + stats.clearedRoutes;
      }
    },

    renderChronicleTimeline: function () {
      const ribHost = document.getElementById('eraRibbons');
      const nodeHost = document.getElementById('timelineNodes');
      if (!ribHost || !nodeHost) return;

      const chron = global.AETHERIA_CHRONICLE;
      const assets = global.AETHERIA_ASSETS;

      // 3 Era Color Ribbons
      ribHost.innerHTML = '';
      chron.eras.forEach(function (era) {
        const div = document.createElement('div');
        div.className = 'era-ribbon ' + era.id;
        div.innerHTML =
          '<div class="era-ribbon-top"><span>【' + era.phase + '・年號「' + era.name + '」】</span><span>' + era.span + '</span></div>' +
          '<div class="era-ribbon-desc">' + era.tagline + '</div>';
        ribHost.appendChild(div);
      });

      // 8 Stage Nodes
      nodeHost.innerHTML = '';
      chron.stages.forEach((st) => {
        const cleared = !!SaveManager.data.stageCleared[st.id];
        const bestStars = SaveManager.getStageBestStars(st.id);
        const starStr = bestStars > 0 ? ('★'.repeat(bestStars) + '☆'.repeat(3 - bestStars)) : '☆☆☆';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'stage-node era-' + st.eraId +
          (st.id === this.selectedStageId ? ' active' : '') +
          (cleared ? ' cleared' : '');

        const sprHtml = st.featuredChars.map(function (cid) {
          const url = assets && assets.characters && assets.characters[cid] ? assets.characters[cid].sprite48 : '';
          return '<img class="pixel-art" src="' + url + '" alt="' + cid + '" />';
        }).join('');

        btn.innerHTML =
          '<div class="node-code">' + st.code + '</div>' +
          '<div class="node-era">' + st.eraLabel + '</div>' +
          '<div class="node-title">《' + st.title + '》</div>' +
          '<div class="node-sprites">' +
            '<div class="node-sprite-pair">' + sprHtml + '</div>' +
            '<div class="node-stars">' + starStr + '</div>' +
          '</div>';

        btn.addEventListener('click', () => this.selectStage(st.id));
        nodeHost.appendChild(btn);
      });
    },

    renderStageBrief: function () {
      const host = document.getElementById('stageBrief');
      if (!host) return;
      const st = this._getStage(this.selectedStageId);
      const era = global.AETHERIA_CHRONICLE.eras.find((e) => e.id === st.eraId);
      const freeUnlocked = st.allowAllOnFirstPlay || !!SaveManager.data.stageCleared[st.id];
      const assets = global.AETHERIA_ASSETS;
      const cgUrl = assets && assets.support_cgs && assets.support_cgs[st.cgKey] ? assets.support_cgs[st.cgKey] : '';

      const gimmickHtml = st.gimmicks.map(function (g) {
        return '<span class="tag-badge">⚙ ' + g + '</span>';
      }).join('');

      host.innerHTML =
        '<div>' +
          '<div class="brief-meta">' +
            '<span class="tag-badge gold">' + st.eraLabel + '</span>' +
            '<span class="tag-badge">' + era.phase + '・' + era.name + '</span>' +
            '<span class="tag-badge">' + st.location + '</span>' +
            '<span class="tag-badge ' + (freeUnlocked ? 'green' : '') + '">' +
              (freeUnlocked ? '✓ 自由演武模式：全 7 位賢者已解鎖' : '🔒 主線雙視角（通關後解鎖全 7 人自由演武）') +
            '</span>' +
          '</div>' +
          '<h3 class="brief-title">' + st.code + '《' + st.title + '》</h3>' +
          '<p class="brief-synopsis">' + st.synopsis + '</p>' +
          '<div class="gimmick-list">' + gimmickHtml + '</div>' +
        '</div>' +
        '<div class="brief-cg-box">' +
          (cgUrl ? '<img src="' + cgUrl + '" alt="' + st.title + '" />' : '') +
          '<div class="brief-cg-cap">難度：' + '★'.repeat(st.difficulty) + '☆'.repeat(5 - st.difficulty) + '　|　時代節點預覽</div>' +
        '</div>';
    },

    renderPovRoster: function () {
      const host = document.getElementById('povRoster');
      if (!host) return;
      const st = this._getStage(this.selectedStageId);
      const chars = global.AETHERIA_CHARACTERS;
      const assets = global.AETHERIA_ASSETS;
      const freeUnlocked = st.allowAllOnFirstPlay || !!SaveManager.data.stageCleared[st.id];

      // Put featured POV characters first (like Koei main warlords), then remaining sages
      const ordered = st.featuredChars.concat(
        global.AETHERIA_CHAR_ORDER.filter((cid) => !st.featuredChars.includes(cid))
      );

      host.innerHTML = '';
      ordered.forEach((cid) => {
        const ch = chars[cid];
        const isMain = st.featuredChars.includes(cid);
        const unlocked = this.isCharUnlockedForStage(st, cid);
        const rec = SaveManager.getRecord(st.id, cid);
        const spUrl = assets && assets.characters && assets.characters[cid] ? assets.characters[cid].sprite64 : '';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'char-card' +
          (cid === this.selectedCharId ? ' selected' : '') +
          (!unlocked ? ' locked' : '');

        const badgeCls = isMain ? 'main' : (freeUnlocked ? 'free' : 'lock');
        const badgeTxt = isMain ? '主線' : (freeUnlocked ? '演武' : '未解鎖');
        const recTxt = rec && rec.cleared
          ? ('★'.repeat(rec.stars) + ' 墨' + rec.bestInk)
          : (unlocked ? '未通關' : '通關時代解鎖');

        btn.innerHTML =
          '<span class="char-badge ' + badgeCls + '">' + badgeTxt + '</span>' +
          '<img class="pixel-art" src="' + spUrl + '" alt="' + ch.name + '" />' +
          '<div class="char-card-name" style="color:' + ch.accent + '">' + ch.name + '</div>' +
          '<div class="char-card-role">' + ch.title + '</div>' +
          '<div class="char-card-rec">' + recTxt + '</div>';

        btn.addEventListener('click', () => this.selectChar(cid));
        host.appendChild(btn);
      });
    },

    renderPovInspector: function () {
      const host = document.getElementById('povInspector');
      if (!host) return;
      const st = this._getStage(this.selectedStageId);
      const ch = global.AETHERIA_CHARACTERS[this.selectedCharId];
      const rec = SaveManager.getRecord(st.id, ch.id);
      const stance = (ch.eraStances && ch.eraStances[st.id]) || ch.motto;

      function bar(v) {
        return '■'.repeat(v) + '□'.repeat(5 - v);
      }

      const stageRegistered = !!(global.AETHERIA_STAGES && global.AETHERIA_STAGES[st.id]);

      host.innerHTML =
        '<div class="inspector-top">' +
          '<div class="sprite-stage">' +
            '<img id="inspectorSpriteImg" class="pixel-art" src="' + this._getInspectorSpriteUrl(ch.id) + '" alt="' + ch.name + '" />' +
            '<button type="button" id="btnTogglePose" class="pose-toggle">' + (this.poseMode === 'sit' ? '坐姿 ↻' : '行走 ↻') + '</button>' +
          '</div>' +
          '<div class="inspector-head">' +
            '<h3>' + ch.name + ' <span style="font-size:13px;color:' + ch.accent + '">【' + ch.title + '・' + ch.faction + '】</span></h3>' +
            '<p class="inspector-motto">' + ch.motto + '</p>' +
            '<div class="tag-badge">線條特性：' + ch.strokeSummary + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="stance-quote"><strong>【' + st.eraLabel + ' 視角立場】</strong><br/>' + stance + '</div>' +
        '<div class="vision-card">' +
          '<div class="vision-card-title">👁 專屬 8-bit 戰術視野：' + ch.visionName + '</div>' +
          '<div class="vision-card-desc">' + ch.visionDesc + '</div>' +
          '<div class="stat-grid">' +
            '<div class="stat-cell">墨水<div class="stat-blocks">' + bar(ch.stats.ink) + '</div></div>' +
            '<div class="stat-cell">穩固<div class="stat-blocks">' + bar(ch.stats.stability) + '</div></div>' +
            '<div class="stat-cell">彈性<div class="stat-blocks">' + bar(ch.stats.bounce) + '</div></div>' +
            '<div class="stat-cell">風感<div class="stat-blocks">' + bar(ch.stats.wind) + '</div></div>' +
            '<div class="stat-cell">咬合<div class="stat-blocks">' + bar(ch.stats.torque) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="record-strip">' +
          '<span><strong>本時代獨立戰績：</strong>' + (rec && rec.cleared ? ('已通關 ' + '★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars)) : '尚未出戰') + '</span>' +
          '<span><strong>最少墨水：</strong>' + (rec && rec.bestInk != null ? (rec.bestInk + ' px') : '—') + '</span>' +
        '</div>' +
        '<div class="launch-row">' +
          '<button type="button" id="btnDeployStage" class="px-btn primary">▶ 以 ' + ch.name + ' 視角出擊《' + st.title + '》</button>' +
          '<button type="button" id="btnPreviewPovVn" class="px-btn">📜 預覽本時代序幕演出</button>' +
        '</div>';

      const btnPose = document.getElementById('btnTogglePose');
      if (btnPose) {
        btnPose.addEventListener('click', () => {
          this.poseMode = this.poseMode === 'sit' ? 'walk' : 'sit';
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
          this.renderPovInspector();
        });
      }

      const btnDeploy = document.getElementById('btnDeployStage');
      if (btnDeploy) {
        btnDeploy.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuSelect();
          if (stageRegistered && typeof global.AETHERIA_LAUNCH_STAGE === 'function') {
            global.AETHERIA_LAUNCH_STAGE(st.id, ch.id);
          } else {
            // Prompt 3 fallback before Stages 1-8 arrive in Prompts 4-6: launch POV intro -> Sandbox
            this.openPovPreviewVn(st, ch, () => this.openSandbox(ch.id));
          }
        });
      }

      const btnVn = document.getElementById('btnPreviewPovVn');
      if (btnVn) {
        btnVn.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuSelect();
          this.openPovPreviewVn(st, ch, null);
        });
      }


    },

    _getInspectorSpriteUrl: function (charId) {
      const assets = global.AETHERIA_ASSETS;
      const chAssets = assets && assets.characters && assets.characters[charId];
      if (!chAssets) return '';
      if (this.poseMode === 'walk' && chAssets.poses64) {
        const seq = ['stand', 'walk1', 'stand', 'walk2'];
        const key = seq[this.walkFrame % seq.length];
        return chAssets.poses64[key] || chAssets.sprite64;
      }
      return chAssets.sprite64;
    },

    _startPoseTicker: function () {
      if (this.poseAnimTimer) clearInterval(this.poseAnimTimer);
      this.poseAnimTimer = setInterval(() => {
        if (this.poseMode !== 'walk') return;
        this.walkFrame = (this.walkFrame + 1) % 4;
        const img = document.getElementById('inspectorSpriteImg');
        if (img) {
          img.src = this._getInspectorSpriteUrl(this.selectedCharId);
        }
      }, 260);
    },

    // ---- KiriKiri VN Era POV Preview ----
    openPovPreviewVn: function (stage, charObj, onDone) {
      const stageCfg = global.AETHERIA_STAGES && global.AETHERIA_STAGES[stage.id];
      const registeredIntro = stageCfg ? this._resolveScript(stageCfg, 'intro', charObj.id) : null;
      if (registeredIntro) {
        this._playScriptOrFallback(
          stage.eraLabel + ' — ' + charObj.name + ' 視角序幕',
          registeredIntro,
          () => { if (typeof onDone === 'function') onDone(); }
        );
        return;
      }

      const modal = document.getElementById('vnModal');
      const host = document.getElementById('vnPreviewHost');
      const titleEl = document.getElementById('vnModalTitle');
      if (!modal || !host || !global.KiriKiriVN) return;

      titleEl.textContent = stage.eraLabel + ' — ' + charObj.name + ' 視角序幕';
      modal.classList.add('open');

      if (!this.vnInstance) {
        this.vnInstance = new global.KiriKiriVN(host, {
          audio: global.AETHERIA_AUDIO,
          assets: global.AETHERIA_ASSETS
        });
      }

      const partnerId = stage.featuredChars.find((id) => id !== charObj.id) || stage.featuredChars[0];
      const partner = global.AETHERIA_CHARACTERS[partnerId];
      const stance = (charObj.eraStances && charObj.eraStances[stage.id]) || charObj.motto;

      const script = [
        { cmd: 'bg', id: stage.bgId },
        { cmd: 'bgm', track: 'vn' },
        { cmd: 'say', char: 'narrator', text: '【' + stage.eraLabel + '・' + stage.location + '】\n' + stage.synopsis },
        { cmd: 'char', slot: 'left', id: charObj.id, pose: 'cutout', anim: 'enter' },
        { cmd: 'char', slot: 'right', id: partner.id, pose: 'cutout', anim: 'dim' },
        { cmd: 'say', char: charObj.id, text: stance },
        { cmd: 'char', slot: 'right', id: partner.id, pose: 'cutout', anim: 'hop' },
        { cmd: 'say', char: partner.id, text: '（' + partner.name + ' 視角回應）好，既然你揀咗「' + charObj.visionName + '」出陣，就睇下你點用畫線剛體拆解呢關！' },
        {
          cmd: 'choice',
          options: [
            { label: '立刻進入「視野與物理 Sandbox」試畫線', target: 'go_sandbox', flag: 'launchSandbox', value: true },
            { label: '返回《蒼穹星曆》時間軸大廳', target: 'go_hub', flag: 'launchSandbox', value: false }
          ]
        },
        { cmd: 'label', name: 'go_sandbox' },
        { cmd: 'say', char: charObj.id, text: '明白！「' + charObj.visionName + '」展開，準備進入測試場！' },
        { cmd: 'jump', target: 'end_scene' },
        { cmd: 'label', name: 'go_hub' },
        { cmd: 'say', char: charObj.id, text: '好，先返去時間軸整理好戰術再出發。' },
        { cmd: 'label', name: 'end_scene' }
      ];

      this.vnInstance.play(script, (flags) => {
        this.closeVnModal();
        if (flags && flags.launchSandbox) {
          this.openSandbox(charObj.id);
        } else if (typeof onDone === 'function') {
          onDone();
        }
      });
    },

    closeVnModal: function () {
      const modal = document.getElementById('vnModal');
      if (modal) modal.classList.remove('open');
      if (this.vnInstance) this.vnInstance.stop();
      if (global.AETHERIA_AUDIO && global.AETHERIA_AUDIO.currentBgm === 'vn') {
        global.AETHERIA_AUDIO.playBgm('hub');
      }
    },

    // ---- 🔧 視野與物理 Sandbox 測試房 ----
    openSandbox: function (initialCharId) {
      this.closeStage();
      const modal = document.getElementById('sandboxModal');
      const canvas = document.getElementById('sandboxCanvas');
      if (!modal || !canvas || !global.PhysicsQEngine) return;

      this.sandboxCharId = initialCharId || this.selectedCharId || 'claude';
      modal.classList.add('open');

      if (!this.sandboxEngine) {
        this.sandboxEngine = new global.PhysicsQEngine(canvas, {
          width: 640,
          height: 400,
          audio: global.AETHERIA_AUDIO,
          assets: global.AETHERIA_ASSETS,
          onStateChange: (st) => this._updateSandboxTelemetry(st),
          onWin: (w) => {
            const note = document.getElementById('sandboxStatusMsg');
            if (note) {
              note.textContent = '★ 測試目標達成！用墨 ' + Math.round(w.inkUsed) + 'px（按 R 可即時重開再試其他賢者視野）';
              note.style.color = '#86efac';
            }
          }
        });
      }

      this._renderSandboxCharBar();
      this.switchSandboxChar(this.sandboxCharId, true);
    },

    closeSandbox: function () {
      const modal = document.getElementById('sandboxModal');
      if (modal) modal.classList.remove('open');
      if (this.sandboxEngine) this.sandboxEngine.stop();
      if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuBack();
    },

    _renderSandboxCharBar: function () {
      const bar = document.getElementById('sandboxCharBar');
      if (!bar) return;
      const assets = global.AETHERIA_ASSETS;
      bar.innerHTML = '';
      global.AETHERIA_CHAR_ORDER.forEach((cid) => {
        const ch = global.AETHERIA_CHARACTERS[cid];
        const url = assets && assets.characters && assets.characters[cid] ? assets.characters[cid].sprite48 : '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sandbox-char-btn' + (cid === this.sandboxCharId ? ' active' : '');
        btn.innerHTML = '<img class="pixel-art" src="' + url + '" alt="' + ch.name + '" /><span>' + ch.name + '</span>';
        btn.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
          this.switchSandboxChar(cid, false);
        });
        bar.appendChild(btn);
      });
    },

    switchSandboxChar: function (charId, reloadStage) {
      this.sandboxCharId = charId;
      const ch = global.AETHERIA_CHARACTERS[charId];
      if (!ch || !this.sandboxEngine) return;

      this.sandboxEngine.setCharacterModifier(ch.physicsModifier);
      if (reloadStage || !this.sandboxEngine.stageConfig) {
        this.sandboxEngine.loadStage(buildSandboxStageConfig());
      } else if (!this.sandboxEngine.running) {
        this.sandboxEngine.start();
      }

      this._renderSandboxCharBar();
      const info = document.getElementById('sandboxCharInfo');
      if (info) {
        info.innerHTML =
          '<div style="font-weight:900;color:' + ch.accent + ';font-size:14px;margin-bottom:4px;">' + ch.name + ' — ' + ch.visionName + '</div>' +
          '<div style="color:#cbd5e1;line-height:1.5;margin-bottom:6px;">' + ch.visionDesc + '</div>' +
          '<div style="color:#fde68a;font-size:11px;">線條屬性：' + ch.strokeSummary + '</div>' +
          '<div style="color:#93c5fd;font-size:11px;margin-top:4px;">密度 ' + ch.physicsModifier.density +
          ' | 彈性 ' + ch.physicsModifier.restitution +
          ' | 摩擦 ' + ch.physicsModifier.friction +
          ' | 墨水倍率 ' + Math.round(ch.physicsModifier.inkMultiplier * 100) + '%</div>';
      }
      const note = document.getElementById('sandboxStatusMsg');
      if (note) {
        note.textContent = '喺左側畫布拖曳滑鼠／手指畫線，實時體驗該賢者嘅剛體手感同 8-bit 視野！（按 R 一鍵重開）';
        note.style.color = '#cbd5e1';
      }
    },

    // ---- Graceful Script Resolver (Fallback before scripts_1_to_3.js is loaded) ----
    _resolveScript: function (stageCfg, phase, charId) {
      const reg = global.AETHERIA_SCRIPTS;
      if (!stageCfg) return null;
      const hooks = stageCfg.scriptHooks && stageCfg.scriptHooks[phase];
      const directKey = hooks && hooks[charId] ? hooks[charId] : null;
      if (directKey && reg) {
        const directScript = typeof reg.get === 'function' ? reg.get(directKey) : reg[directKey];
        if (Array.isArray(directScript) && directScript.length > 0) return directScript;
      }
      if (typeof global.getFallbackScript === 'function') {
        return global.getFallbackScript(stageCfg.id, charId, phase);
      }
      const freeKey = hooks && hooks.free ? hooks.free : null;
      const freeScript = (freeKey && reg) ? (typeof reg.get === 'function' ? reg.get(freeKey) : reg[freeKey]) : null;
      return Array.isArray(freeScript) && freeScript.length > 0 ? freeScript : null;
    },

    _playScriptOrFallback: function (title, script, onComplete) {
      if (!script || !global.KiriKiriVN) {
        if (typeof onComplete === 'function') onComplete({});
        return;
      }
      const modal = document.getElementById('vnModal');
      const host = document.getElementById('vnPreviewHost');
      const titleEl = document.getElementById('vnModalTitle');
      if (!modal || !host) {
        if (typeof onComplete === 'function') onComplete({});
        return;
      }
      titleEl.textContent = title;
      modal.classList.add('open');
      if (!this.vnInstance) {
        this.vnInstance = new global.KiriKiriVN(host, {
          audio: global.AETHERIA_AUDIO,
          assets: global.AETHERIA_ASSETS
        });
      }
      this.vnInstance.play(script, (flags) => {
        if (flags && typeof flags === 'object' && Object.keys(flags).length > 0) {
          SaveManager.data.vnChoices = Object.assign(SaveManager.data.vnChoices || {}, flags);
          SaveManager.save();
        }
        this.closeVnModal();
        if (typeof onComplete === 'function') onComplete(flags || {});
      });
    },

    // ---- 🎮 Playable Stage Arena Controller ----
    launchStage: function (stageId, charId) {
      const stageCfg = global.AETHERIA_STAGES && global.AETHERIA_STAGES[stageId];
      if (!stageCfg) return;

      // Ensure Sandbox engine is stopped so only ONE PhysicsQEngine runs & binds [R]
      this.closeSandbox();

      const ch = global.AETHERIA_CHARACTERS[charId] || global.AETHERIA_CHARACTERS[stageCfg.featuredChars[0]];
      const introScript = this._resolveScript(stageCfg, 'intro', ch.id);

      this._playScriptOrFallback(
        stageCfg.eraLabel + ' — ' + ch.name + ' 序幕',
        introScript,
        () => this._openStageArena(stageCfg, ch.id)
      );
    },

    _openStageArena: function (stageCfg, charId) {
      const modal = document.getElementById('stageModal');
      const canvas = document.getElementById('stageCanvas');
      if (!modal || !canvas || !global.PhysicsQEngine) return;

      this.activeStageId = stageCfg.id;
      this.activeStageCharId = charId;
      modal.classList.add('open');
      this._hideStageOverlay();

      const titleEl = document.getElementById('stageModalTitle');
      const eraEl = document.getElementById('stageModalEra');
      if (titleEl) titleEl.textContent = stageCfg.code + '《' + stageCfg.title + '》';
      if (eraEl) eraEl.textContent = stageCfg.eraLabel;

      if (!this.stageEngine) {
        this.stageEngine = new global.PhysicsQEngine(canvas, {
          width: 640,
          height: 400,
          audio: global.AETHERIA_AUDIO,
          assets: global.AETHERIA_ASSETS,
          onStateChange: (st) => this._updateStageTelemetry(st),
          onRestart: () => {
            this._hideStageOverlay();
            this._updateStageLiveStatus();
          },
          onWin: (w) => this._handleStageWin(w),
          onFail: (w) => this._handleStageFail(w)
        });
      }

      if (global.AETHERIA_AUDIO && !global.AETHERIA_AUDIO.muted) {
        global.AETHERIA_AUDIO.playBgm(stageCfg.bgm || 'puzzle');
      }

      this._renderStagePovBar();
      this._applyStageChar(charId, true);
      this._startStageHudTicker();
    },

    _renderStagePovBar: function () {
      const bar = document.getElementById('stagePovBar');
      if (!bar) return;
      const meta = this._getStage(this.activeStageId);
      const assets = global.AETHERIA_ASSETS;
      bar.innerHTML = '';

      global.AETHERIA_CHAR_ORDER.forEach((cid) => {
        if (!this.isCharUnlockedForStage(meta, cid)) return;
        const ch = global.AETHERIA_CHARACTERS[cid];
        const url = assets && assets.characters && assets.characters[cid] ? assets.characters[cid].sprite48 : '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sandbox-char-btn' + (cid === this.activeStageCharId ? ' active' : '');
        btn.innerHTML = '<img class="pixel-art" src="' + url + '" alt="' + ch.name + '" /><span>' + ch.name + '</span>';
        btn.addEventListener('click', () => {
          if (global.AETHERIA_AUDIO) global.AETHERIA_AUDIO.playMenuMove();
          this._applyStageChar(cid, true);
        });
        bar.appendChild(btn);
      });
    },

    _applyStageChar: function (charId, reloadStage) {
      const stageCfg = global.AETHERIA_STAGES && global.AETHERIA_STAGES[this.activeStageId];
      const ch = global.AETHERIA_CHARACTERS[charId];
      if (!stageCfg || !ch || !this.stageEngine) return;

      this.activeStageCharId = charId;
      this.selectedCharId = charId;
      SaveManager.data.selectedCharId = charId;
      SaveManager.save();

      this._hideStageOverlay();
      this.stageEngine.setCharacterModifier(ch.physicsModifier);
      if (reloadStage) {
        this.stageEngine.loadStage(stageCfg);
      } else if (!this.stageEngine.running) {
        this.stageEngine.start();
      }

      this._renderStagePovBar();

      const info = document.getElementById('stageCharInfo');
      if (info) {
        info.innerHTML =
          '<div style="font-weight:900;color:' + ch.accent + ';font-size:14px;margin-bottom:3px;">' + ch.name + ' — ' + ch.visionName + '</div>' +
          '<div style="color:#cbd5e1;line-height:1.45;font-size:11px;">' + ch.visionDesc + '</div>' +
          '<div style="color:#fde68a;font-size:11px;margin-top:4px;">線條：' + ch.strokeSummary + '</div>';
      }

      const objBox = document.getElementById('stageObjectiveBox');
      if (objBox) {
        objBox.innerHTML = '<strong>🎯 過關目標：</strong><br/>' + stageCfg.objectiveText;
      }

      const hintBox = document.getElementById('stageHintBox');
      if (hintBox) {
        hintBox.textContent = stageCfg.hintText || '按滑鼠左鍵／手指拖曳畫線，按 [R] 鍵可 0.5 秒極速重開。';
      }

      this._updateStageLiveStatus();
    },

    _startStageHudTicker: function () {
      this._stopStageHudTicker();
      this._stageHudTimer = setInterval(() => {
        if (!this.stageEngine || !this.stageEngine.running) return;
        this._updateStageLiveStatus();
      }, 120);
    },

    _stopStageHudTicker: function () {
      if (this._stageHudTimer) {
        clearInterval(this._stageHudTimer);
        this._stageHudTimer = null;
      }
    },

    _updateStageLiveStatus: function () {
      const el = document.getElementById('stageLiveStatus');
      const stageCfg = global.AETHERIA_STAGES && global.AETHERIA_STAGES[this.activeStageId];
      if (!el || !stageCfg || !this.stageEngine) return;
      if (typeof stageCfg.getStatusSummary === 'function') {
        el.textContent = stageCfg.getStatusSummary(this.stageEngine.world);
      } else {
        el.textContent = '物理模擬進行中… 按 [R] 即時重開';
      }
    },

    _updateStageTelemetry: function (st) {
      const box = document.getElementById('stageTelemetry');
      if (!box) return;
      box.innerHTML =
        '<div><strong>剩餘墨水：</strong>' + Math.round(st.inkRatio * 100) + '% (' + (st.inkMax - st.inkUsed) + '/' + st.inkMax + ' px)</div>' +
        '<div><strong>筆劃數：</strong>' + st.strokes + ' 筆　|　<strong>耗時：</strong>' + st.elapsed.toFixed(1) + 's</div>';
    },

    _handleStageWin: function (world) {
      const stageCfg = global.AETHERIA_STAGES && global.AETHERIA_STAGES[this.activeStageId];
      if (!stageCfg) return;
      const wasClearedBefore = !!SaveManager.data.stageCleared[stageCfg.id];
      const stars = typeof stageCfg.evaluateStars === 'function' ? stageCfg.evaluateStars(world) : 3;
      const rec = SaveManager.saveStageClear(stageCfg.id, this.activeStageCharId, stars, world.inkUsed, world.time);
      this.renderAll();
      this._renderStagePovBar();

      const ch = global.AETHERIA_CHARACTERS[this.activeStageCharId];
      const clearScript = this._resolveScript(stageCfg, 'clear', ch.id);

      const showBanner = () => {
        const ov = document.getElementById('stageResultOverlay');
        const tEl = document.getElementById('stageResultTitle');
        const sEl = document.getElementById('stageResultStars');
        const mEl = document.getElementById('stageResultMeta');
        const nextBtn = document.getElementById('btnOverlayNext');
        if (!ov) return;

        tEl.textContent = '★ STAGE CLEAR! 試煉通過 ★';
        tEl.className = 'stage-overlay-title';
        sEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);

        const nextExists = !!(global.AETHERIA_STAGES && global.AETHERIA_STAGES[stageCfg.id + 1]);
        if (nextBtn) {
          nextBtn.style.display = nextExists ? 'inline-flex' : 'none';
        }

        const unlockMsg = !wasClearedBefore
          ? '<br/><span style="color:#86efac;font-weight:700;">✓ 本時代「自由演武模式」已解鎖（全 7 位賢者皆可挑戰）！</span>'
          : '';
        const summary = typeof stageCfg.getStatusSummary === 'function'
          ? ('<br/>' + stageCfg.getStatusSummary(world))
          : '';

        mEl.innerHTML =
          '出戰賢者：<strong>' + ch.name + '</strong>（' + ch.visionName + '）<br/>' +
          '本次用墨：' + Math.round(world.inkUsed) + ' px（最佳 ' + rec.bestInk + ' px）｜耗時：' + world.time.toFixed(1) + 's' +
          summary + unlockMsg;

        ov.classList.add('open');
      };

      if (clearScript) {
        this._playScriptOrFallback(stageCfg.eraLabel + ' — ' + ch.name + ' 通關結語', clearScript, showBanner);
      } else {
        showBanner();
      }
    },

    _handleStageFail: function (world) {
      const ov = document.getElementById('stageResultOverlay');
      const tEl = document.getElementById('stageResultTitle');
      const sEl = document.getElementById('stageResultStars');
      const mEl = document.getElementById('stageResultMeta');
      const nextBtn = document.getElementById('btnOverlayNext');
      if (!ov) return;

      tEl.textContent = '✕ TRIAL FAILED 試煉中斷';
      tEl.className = 'stage-overlay-title fail';
      sEl.textContent = '☆☆☆';
      if (nextBtn) nextBtn.style.display = 'none';
      mEl.innerHTML = (world.customState && world.customState.failReason)
        ? world.customState.failReason
        : '目標物件超出警戒範圍！按鍵盤 <strong>[R]</strong> 或點擊下方按鈕即時重開。';
      ov.classList.add('open');
    },

    _hideStageOverlay: function () {
      const ov = document.getElementById('stageResultOverlay');
      if (ov) ov.classList.remove('open');
    },

    closeStage: function () {
      const modal = document.getElementById('stageModal');
      if (modal) modal.classList.remove('open');
      this._hideStageOverlay();
      this._stopStageHudTicker();
      if (this.stageEngine) this.stageEngine.stop();
      if (global.AETHERIA_AUDIO && (global.AETHERIA_AUDIO.currentBgm === 'puzzle' || global.AETHERIA_AUDIO.currentBgm === 'boss')) {
        global.AETHERIA_AUDIO.playBgm('hub');
      }
    },

    _updateSandboxTelemetry: function (st) {
      const box = document.getElementById('sandboxTelemetry');
      if (!box) return;
      box.innerHTML =
        '<div><strong>剩餘墨水：</strong>' + Math.round(st.inkRatio * 100) + '% (' + (st.inkMax - st.inkUsed) + '/' + st.inkMax + ' px)</div>' +
        '<div><strong>已畫筆數：</strong>' + st.strokes + ' 筆</div>' +
        '<div><strong>目標進度：</strong>' + Math.round(st.goalProgress * 100) + '% | 狀態：' + st.status.toUpperCase() + '</div>';
    }
  };

  global.AETHERIA_SAVE = SaveManager;
  global.AETHERIA_HUB = HubApp;
  global.AETHERIA_LAUNCH_STAGE = function (stageId, charId) {
    HubApp.launchStage(stageId, charId);
  };

  document.addEventListener('DOMContentLoaded', function () {
    HubApp.init();
  });
})(typeof window !== 'undefined' ? window : globalThis);
