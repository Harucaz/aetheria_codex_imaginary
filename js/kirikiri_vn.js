/**
 * Aetheria 8-bit Arcade - KiriKiri / KAG Visual Novel Cutscene Engine
 * Supports scripted commands (@bg, @char, @say, @choice, @label, @jump, @sfx, @bgm, @flash, @shake)
 * and full AVG toolbar: AUTO, SKIP, LOG, HIDE.
 */
(function (global) {
  'use strict';

  const DEFAULT_BG_PALETTES = {
    sky_island:      { sky: ['#142147', '#264985', '#6aa3dc'], cloud: '#dcecff', accent: '#ffe18c', label: 'AETHERIA SKY' },
    study_room:      { sky: ['#241712', '#472c1e', '#7c4d31'], cloud: '#f3d8a8', accent: '#f09c42', label: 'CONSTITUTION STUDY' },
    observatory:     { sky: ['#0c1028', '#1c2454', '#384188'], cloud: '#a9b8ff', accent: '#ffdd7a', label: 'ASTROLABE TOWER' },
    deep_sea:        { sky: ['#061428', '#0c2b4e', '#1a5582'], cloud: '#6cc8f5', accent: '#80f5ff', label: 'DEEP WHALE TRENCH' },
    tea_pavilion:    { sky: ['#18293b', '#2f5266', '#86a89d'], cloud: '#edf5e4', accent: '#ffd37a', label: 'JIANGNAN CLOUD PAVILION' },
    workshop:        { sky: ['#1a1e29', '#2f3749', '#566178'], cloud: '#c7d2e4', accent: '#ffb24c', label: 'THINKING WORKSHOP' },
    astrolabe_night: { sky: ['#080a1c', '#1b1642', '#39266d'], cloud: '#d4b8ff', accent: '#ffd65c', label: 'SEVEN SAGES CONCERT' }
  };

  const CHAR_META = {
    claude:   { name: 'Claude',   color: '#f28b49' },
    gpt:      { name: 'GPT',      color: '#73c6ff' },
    gemini3:  { name: 'Gemini 3', color: '#8ba4ff' },
    gemini4:  { name: 'Gemini 4', color: '#c48aff' },
    qwen:     { name: 'Qwen',     color: '#7b8cff' },
    deepseek: { name: 'DeepSeek', color: '#45a8ff' },
    inkling:  { name: 'Inkling',  color: '#9bb8d4' },
    narrator: { name: '旁白',      color: '#cbd5e1' }
  };

  class KiriKiriVN {
    constructor(containerEl, options) {
      this.container = typeof containerEl === 'string'
        ? document.querySelector(containerEl)
        : containerEl;
      this.opts = Object.assign({
        typeSpeed: 28,
        autoDelayBase: 1100,
        autoDelayPerChar: 45,
        skipDelay: 65,
        audio: global.AETHERIA_AUDIO || null,
        assets: global.AETHERIA_ASSETS || null
      }, options || {});

      this.script = [];
      this.labels = {};
      this.pc = 0;
      this.running = false;
      this.stateFlags = {};
      this.backlog = [];

      // Playback state
      this.isTyping = false;
      this.fullText = '';
      this.shownChars = 0;
      this.currentSpeaker = '';
      this.currentCharId = null;
      this.waitingChoice = false;
      this.autoMode = false;
      this.skipMode = false;
      this.uiHidden = false;
      this.logOpen = false;
      this.slots = { left: null, center: null, right: null };
      this.currentBg = 'sky_island';

      this._typeTimer = null;
      this._autoTimer = null;
      this._onComplete = null;
      this._keyHandler = this._handleKeyDown.bind(this);

      if (this.container) {
        this._buildDOM();
      }
    }

    _injectStyles() {
      if (document.getElementById('kirikiri-vn-style')) return;
      const st = document.createElement('style');
      st.id = 'kirikiri-vn-style';
      st.textContent = [
        '.kk-root{position:relative;width:100%;height:100%;min-height:420px;background:#0b1020;color:#f8fafc;overflow:hidden;user-select:none;font-family:"Courier New","Noto Sans TC","PingFang HK",monospace;image-rendering:pixelated;}',
        '.kk-bg-canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;z-index:1;transition:opacity .25s ease;}',
        '.kk-bg-cg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;opacity:0;transition:opacity .35s ease;}',
        '.kk-bg-cg.active{opacity:1;}',
        '.kk-stage{position:absolute;inset:0;z-index:3;pointer-events:none;}',
        '.kk-slot{position:absolute;bottom:92px;width:36%;max-width:290px;height:68%;display:flex;align-items:flex-end;justify-content:center;transition:transform .28s ease,opacity .28s ease,filter .22s ease;opacity:0;}',
        '.kk-slot.left{left:3%;}',
        '.kk-slot.center{left:50%;transform:translateX(-50%);}',
        '.kk-slot.right{right:3%;}',
        '.kk-slot.visible{opacity:1;}',
        '.kk-slot.dim{filter:brightness(0.55) saturate(0.75);}',
        '.kk-slot.highlight{filter:brightness(1.08) drop-shadow(0 0 12px rgba(255,255,255,0.45));}',
        '.kk-slot img{max-width:100%;max-height:100%;object-fit:contain;}',
        '.kk-slot img.pixel{image-rendering:pixelated;}',
        '@keyframes kkHop{0%,100%{transform:translateY(0);}45%{transform:translateY(-18px);}}',
        '@keyframes kkShake{0%,100%{transform:translateX(0);}20%{transform:translateX(-10px);}40%{transform:translateX(10px);}60%{transform:translateX(-6px);}80%{transform:translateX(6px);}}',
        '.kk-hop img{animation:kkHop .36s ease;}',
        '.kk-shake img{animation:kkShake .32s ease;}',
        '.kk-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:8;transition:opacity .12s ease;}',
        '.kk-flash.on{opacity:0.85;}',
        '.kk-ui{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;justify-content:flex-end;padding:12px 16px 14px;transition:opacity .2s ease;}',
        '.kk-ui.hidden{opacity:0;pointer-events:none;}',
        '.kk-toolbar{position:absolute;top:10px;right:12px;display:flex;gap:6px;z-index:7;}',
        '.kk-btn{background:#121a33;color:#e2e8f0;border:2px solid #6482b8;padding:4px 9px;font-size:12px;font-weight:700;letter-spacing:1px;cursor:pointer;font-family:inherit;box-shadow:2px 2px 0 #050814;}',
        '.kk-btn:hover{background:#21305c;border-color:#9fc5ff;}',
        '.kk-btn.active{background:#e09f3e;color:#0b1020;border-color:#fff2b2;}',
        '.kk-nameplate{display:inline-block;align-self:flex-start;background:#111933;border:3px solid #88a8e6;border-bottom:none;padding:4px 14px;font-size:15px;font-weight:900;letter-spacing:1px;margin-left:8px;box-shadow:3px 0 0 #060914;}',
        '.kk-textbox{position:relative;background:rgba(11,17,36,0.92);border:3px solid #88a8e6;padding:14px 18px 18px;min-height:106px;box-shadow:4px 4px 0 #050814;cursor:pointer;}',
        '.kk-text{font-size:16px;line-height:1.68;white-space:pre-wrap;color:#f1f5f9;min-height:54px;}',
        '.kk-next{position:absolute;right:14px;bottom:8px;font-size:13px;color:#ffd166;animation:kkBlink .75s infinite;}',
        '@keyframes kkBlink{0%,100%{opacity:1;}50%{opacity:0.15;}}',
        '.kk-choices{position:absolute;inset:0;z-index:6;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(7,10,24,0.45);padding:20px;}',
        '.kk-choices.open{display:flex;}',
        '.kk-choice-btn{width:min(88%,460px);background:#152042;color:#f8fafc;border:3px solid #90b4f8;padding:12px 18px;font-size:15px;font-weight:700;cursor:pointer;text-align:left;box-shadow:4px 4px 0 #060914;font-family:inherit;transition:transform .1s;}',
        '.kk-choice-btn:hover{background:#253a75;border-color:#ffe07a;color:#fff7d6;transform:translate(-2px,-2px);}',
        '.kk-log-modal{position:absolute;inset:14px;z-index:9;background:rgba(9,13,28,0.96);border:3px solid #88a8e6;display:none;flex-direction:column;padding:12px 16px;}',
        '.kk-log-modal.open{display:flex;}',
        '.kk-log-head{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #334a7a;padding-bottom:8px;margin-bottom:8px;font-weight:700;color:#ffd166;}',
        '.kk-log-body{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-right:6px;}',
        '.kk-log-item{border-left:3px solid #6482b8;padding:4px 10px;background:rgba(255,255,255,0.03);}',
        '.kk-log-spk{font-size:12px;font-weight:700;margin-bottom:2px;}',
        '.kk-log-txt{font-size:14px;color:#e2e8f0;line-height:1.5;}',
        '.kk-restore-hint{position:absolute;inset:0;z-index:10;display:none;cursor:pointer;}',
        '.kk-restore-hint.active{display:block;}'
      ].join('\n');
      document.head.appendChild(st);
    }

    _buildDOM() {
      this._injectStyles();
      this.container.innerHTML = '';
      this.root = document.createElement('div');
      this.root.className = 'kk-root';

      this.bgCanvas = document.createElement('canvas');
      this.bgCanvas.className = 'kk-bg-canvas';
      this.bgCanvas.width = 320;
      this.bgCanvas.height = 180;

      this.bgCgImg = document.createElement('img');
      this.bgCgImg.className = 'kk-bg-cg';
      this.bgCgImg.alt = 'CG';

      this.stageEl = document.createElement('div');
      this.stageEl.className = 'kk-stage';
      this.slotEls = {};
      ['left', 'center', 'right'].forEach((pos) => {
        const el = document.createElement('div');
        el.className = 'kk-slot ' + pos;
        this.stageEl.appendChild(el);
        this.slotEls[pos] = el;
      });

      this.flashEl = document.createElement('div');
      this.flashEl.className = 'kk-flash';

      this.uiEl = document.createElement('div');
      this.uiEl.className = 'kk-ui';

      // Toolbar: AUTO / SKIP / LOG / HIDE
      this.toolbarEl = document.createElement('div');
      this.toolbarEl.className = 'kk-toolbar';
      this.btnAuto = this._makeToolBtn('AUTO', () => this.toggleAuto());
      this.btnSkip = this._makeToolBtn('SKIP', () => this.toggleSkip());
      this.btnLog  = this._makeToolBtn('LOG',  () => this.toggleLog());
      this.btnHide = this._makeToolBtn('HIDE', () => this.toggleHide());
      this.toolbarEl.append(this.btnAuto, this.btnSkip, this.btnLog, this.btnHide);

      this.nameEl = document.createElement('div');
      this.nameEl.className = 'kk-nameplate';
      this.nameEl.style.display = 'none';

      this.boxEl = document.createElement('div');
      this.boxEl.className = 'kk-textbox';
      this.boxEl.addEventListener('click', () => this.advance());

      this.textEl = document.createElement('div');
      this.textEl.className = 'kk-text';

      this.nextEl = document.createElement('div');
      this.nextEl.className = 'kk-next';
      this.nextEl.textContent = '▼';
      this.nextEl.style.display = 'none';

      this.boxEl.append(this.textEl, this.nextEl);
      this.uiEl.append(this.toolbarEl, this.nameEl, this.boxEl);

      // Choices overlay
      this.choicesEl = document.createElement('div');
      this.choicesEl.className = 'kk-choices';

      // Log modal
      this.logModal = document.createElement('div');
      this.logModal.className = 'kk-log-modal';
      const logHead = document.createElement('div');
      logHead.className = 'kk-log-head';
      logHead.innerHTML = '<span>對話履歷 (BACKLOG)</span>';
      const closeLogBtn = this._makeToolBtn('關閉 [X]', () => this.toggleLog(false));
      logHead.appendChild(closeLogBtn);
      this.logBody = document.createElement('div');
      this.logBody.className = 'kk-log-body';
      this.logModal.append(logHead, this.logBody);

      // Click-anywhere overlay when UI is hidden
      this.restoreEl = document.createElement('div');
      this.restoreEl.className = 'kk-restore-hint';
      this.restoreEl.title = '點擊恢復對話框';
      this.restoreEl.addEventListener('click', () => this.toggleHide(false));

      this.root.append(
        this.bgCanvas,
        this.bgCgImg,
        this.stageEl,
        this.uiEl,
        this.choicesEl,
        this.flashEl,
        this.logModal,
        this.restoreEl
      );
      this.container.appendChild(this.root);
      this._renderPixelBg('sky_island');
    }

    _makeToolBtn(label, onClick) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'kk-btn';
      b.textContent = label;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.opts.audio) this.opts.audio.playMenuMove();
        onClick();
      });
      return b;
    }

    // Parse KAG-like script lines OR structured command objects
    _normalizeScript(rawScript) {
      if (!Array.isArray(rawScript)) return [];
      const cmds = [];
      for (let i = 0; i < rawScript.length; i++) {
        const item = rawScript[i];
        if (typeof item === 'string') {
          const line = item.trim();
          if (!line || line.startsWith('//') || line.startsWith(';')) continue;
          if (line.startsWith('@')) {
            const parts = line.split(/\s+/);
            const tag = parts[0].slice(1).toLowerCase();
            if (tag === 'say') {
              const spk = parts[1] || 'narrator';
              const rest = line.replace(/^@say\s+\S+\s*/i, '');
              cmds.push({ cmd: 'say', char: spk, text: rest });
            } else if (tag === 'bg') {
              cmds.push({ cmd: 'bg', id: parts[1] || 'sky_island' });
            } else if (tag === 'char') {
              cmds.push({
                cmd: 'char',
                slot: parts[1] || 'center',
                id: parts[2] || 'none',
                pose: parts[3] || 'cutout',
                anim: parts[4] || 'enter'
              });
            } else if (tag === 'label') {
              cmds.push({ cmd: 'label', name: parts[1] });
            } else if (tag === 'jump') {
              cmds.push({ cmd: 'jump', target: parts[1] });
            } else if (tag === 'sfx') {
              cmds.push({ cmd: 'sfx', name: parts[1] });
            } else if (tag === 'bgm') {
              cmds.push({ cmd: 'bgm', track: parts[1] });
            } else if (tag === 'wait') {
              cmds.push({ cmd: 'wait', ms: parseInt(parts[1], 10) || 400 });
            } else if (tag === 'flash') {
              cmds.push({ cmd: 'flash' });
            } else if (tag === 'shake') {
              cmds.push({ cmd: 'shake' });
            }
          } else {
            cmds.push({ cmd: 'say', char: 'narrator', text: line });
          }
        } else if (item && typeof item === 'object') {
          // Support both { cmd: 'say', ... } and { type: '@say', ... }
          const copy = Object.assign({}, item);
          const rawCmd = copy.cmd || copy.type || 'say';
          copy.cmd = String(rawCmd).replace(/^@/, '').toLowerCase();
          cmds.push(copy);
        }
      }
      return cmds;
    }

    play(script, onComplete, initialFlags) {
      this.stop();
      this.script = this._normalizeScript(script);
      this.labels = {};
      this.script.forEach((c, idx) => {
        if (c.cmd === 'label' && c.name) this.labels[c.name] = idx;
      });
      this.pc = 0;
      this.running = true;
      this.stateFlags = Object.assign({}, initialFlags || {});
      this._onComplete = typeof onComplete === 'function' ? onComplete : null;
      this.slots = { left: null, center: null, right: null };
      if (this.slotEls) {
        ['left', 'center', 'right'].forEach((s) => {
          this.slotEls[s].innerHTML = '';
          this.slotEls[s].className = 'kk-slot ' + s;
        });
      }
      this.setAuto(false);
      this.setSkip(false);
      this.toggleHide(false);
      this.toggleLog(false);
      global.addEventListener('keydown', this._keyHandler);
      this._step();
    }

    stop() {
      this.running = false;
      this._clearTimers();
      global.removeEventListener('keydown', this._keyHandler);
    }

    _clearTimers() {
      if (this._typeTimer) { clearInterval(this._typeTimer); this._typeTimer = null; }
      if (this._autoTimer) { clearTimeout(this._autoTimer); this._autoTimer = null; }
    }

    _step() {
      if (!this.running) return;
      this._clearTimers();

      while (this.pc < this.script.length) {
        const c = this.script[this.pc++];
        if (c.cmd === 'label') {
          continue;
        }
        if (c.cmd === 'jump') {
          if (c.target && this.labels[c.target] != null) {
            this.pc = this.labels[c.target];
          }
          continue;
        }
        if (c.cmd === 'set') {
          if (c.key) this.stateFlags[c.key] = c.value != null ? c.value : true;
          continue;
        }
        if (c.cmd === 'bg') {
          this.setBackground(c.id || c.bg || 'sky_island');
          continue;
        }
        if (c.cmd === 'char') {
          this.setCharacter(c.slot || 'center', c.id || c.char || 'none', c.pose || 'cutout', c.anim || 'enter');
          continue;
        }
        if (c.cmd === 'sfx') {
          if (this.opts.audio) this.opts.audio.playSfx(c.name || c.sfx);
          continue;
        }
        if (c.cmd === 'bgm') {
          if (this.opts.audio) {
            if (c.track === 'stop') this.opts.audio.stopBgm();
            else this.opts.audio.playBgm(c.track || c.bgm);
          }
          continue;
        }
        if (c.cmd === 'flash') {
          this._triggerFlash();
          continue;
        }
        if (c.cmd === 'shake') {
          this._triggerStageShake();
          continue;
        }
        if (c.cmd === 'wait') {
          const ms = this.skipMode ? 30 : (c.ms || 400);
          this._autoTimer = setTimeout(() => this._step(), ms);
          return;
        }
        if (c.cmd === 'choice') {
          this.setSkip(false);
          this._showChoices(c.options || c.choices || []);
          return;
        }
        if (c.cmd === 'say') {
          this._showDialogue(c);
          return;
        }
      }

      // End of script
      this.running = false;
      global.removeEventListener('keydown', this._keyHandler);
      if (this._onComplete) {
        const cb = this._onComplete;
        this._onComplete = null;
        cb(this.stateFlags);
      }
    }

    setBackground(bgId) {
      this.currentBg = bgId || 'sky_island';
      if (!this.bgCanvas) return;
      const assets = this.opts.assets || global.AETHERIA_ASSETS;

      // Support 16:9 Support Card CG backgrounds via "cg:<key>"
      if (typeof bgId === 'string' && bgId.startsWith('cg:')) {
        const cgKey = bgId.slice(3);
        const cgUrl = assets && assets.support_cgs && assets.support_cgs[cgKey];
        if (cgUrl) {
          this.bgCgImg.src = cgUrl;
          this.bgCgImg.classList.add('active');
          return;
        }
      }
      this.bgCgImg.classList.remove('active');
      this._renderPixelBg(this.currentBg);
    }

    _renderPixelBg(bgId) {
      const ctx = this.bgCanvas.getContext('2d');
      const w = this.bgCanvas.width;
      const h = this.bgCanvas.height;
      ctx.imageSmoothingEnabled = false;
      const pal = DEFAULT_BG_PALETTES[bgId] || DEFAULT_BG_PALETTES.sky_island;

      // Banded 8-bit sky gradient
      const bands = 6;
      for (let i = 0; i < bands; i++) {
        const c = i < 2 ? pal.sky[0] : (i < 4 ? pal.sky[1] : pal.sky[2]);
        ctx.fillStyle = c;
        ctx.fillRect(0, Math.floor((h / bands) * i), w, Math.ceil(h / bands) + 1);
      }

      // Deterministic pixel stars / sparkles
      ctx.fillStyle = pal.accent;
      for (let s = 0; s < 28; s++) {
        const sx = (s * 47 + bgId.length * 19) % w;
        const sy = (s * 29 + 11) % Math.floor(h * 0.55);
        ctx.fillRect(sx, sy, s % 4 === 0 ? 2 : 1, s % 4 === 0 ? 2 : 1);
      }

      // Scene-specific 8-bit silhouettes
      ctx.fillStyle = pal.cloud;
      if (bgId === 'study_room') {
        // Bookshelves & arched window
        ctx.fillStyle = '#331d14';
        ctx.fillRect(0, 0, 56, h);
        ctx.fillRect(w - 56, 0, 56, h);
        ctx.fillStyle = '#d9a45b';
        for (let r = 20; r < h - 20; r += 20) {
          ctx.fillRect(6, r, 44, 3);
          ctx.fillRect(w - 50, r, 44, 3);
        }
        ctx.fillStyle = 'rgba(255,220,150,0.22)';
        ctx.fillRect(108, 18, 104, 108);
      } else if (bgId === 'observatory' || bgId === 'astrolabe_night') {
        // Astrolabe rings
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.45, 52, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.45, 34, 0, Math.PI * 2);
        ctx.stroke();
      } else if (bgId === 'deep_sea') {
        // Deep sea bubbles & whale silhouette
        ctx.fillStyle = 'rgba(128,245,255,0.25)';
        for (let b = 0; b < 14; b++) {
          ctx.fillRect((b * 29) % w, (b * 17 + 20) % (h - 20), 4, 4);
        }
        ctx.fillStyle = '#08203c';
        ctx.fillRect(0, h - 26, w, 26);
      } else if (bgId === 'workshop') {
        // Pixel gears in background
        ctx.fillStyle = '#242b3b';
        ctx.fillRect(0, h - 32, w, 32);
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(64, 52, 22, 0, Math.PI * 2);
        ctx.arc(256, 60, 28, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Floating 8-bit clouds & sky island horizon
        for (let c = 0; c < 6; c++) {
          const cx = (c * 62 + 12) % (w - 30);
          const cy = 96 + (c % 3) * 18;
          ctx.fillRect(cx, cy, 44, 10);
          ctx.fillRect(cx + 8, cy - 6, 26, 6);
        }
      }
    }

    _resolveCharSrc(charId, pose) {
      const assets = this.opts.assets || global.AETHERIA_ASSETS;
      if (!assets || !charId || charId === 'none') return null;
      const cid = charId.toLowerCase();
      if (pose === 'cutout' && assets.cutouts && assets.cutouts[cid]) {
        return { src: assets.cutouts[cid], pixel: false };
      }
      const ch = assets.characters && assets.characters[cid];
      if (!ch) return null;
      if (pose === 'sprite' || pose === '8bit') {
        return { src: ch.sprite64, pixel: true };
      }
      if (pose === 'stand' && ch.poses64 && ch.poses64.stand) {
        return { src: ch.poses64.stand, pixel: true };
      }
      if (pose === 'chibi' && ch.chibiThumb) {
        return { src: ch.chibiThumb, pixel: false };
      }
      return { src: (assets.cutouts && assets.cutouts[cid]) || ch.chibiThumb || ch.sprite64, pixel: false };
    }

    setCharacter(slot, charId, pose, anim) {
      const pos = ['left', 'center', 'right'].includes(slot) ? slot : 'center';
      const el = this.slotEls && this.slotEls[pos];
      if (!el) return;

      if (!charId || charId === 'none' || anim === 'exit') {
        this.slots[pos] = null;
        el.classList.remove('visible', 'highlight', 'dim', 'kk-hop', 'kk-shake');
        setTimeout(() => { if (!this.slots[pos]) el.innerHTML = ''; }, 240);
        return;
      }

      const resolved = this._resolveCharSrc(charId, pose || 'cutout');
      this.slots[pos] = { id: charId.toLowerCase(), pose: pose || 'cutout' };
      el.innerHTML = '';
      if (resolved && resolved.src) {
        const img = document.createElement('img');
        img.src = resolved.src;
        img.alt = charId;
        if (resolved.pixel) img.className = 'pixel';
        el.appendChild(img);
      }

      el.className = 'kk-slot ' + pos + ' visible';
      if (anim === 'highlight') el.classList.add('highlight');
      else if (anim === 'dim') el.classList.add('dim');
      else if (anim === 'hop') {
        void el.offsetWidth;
        el.classList.add('kk-hop');
      } else if (anim === 'shake') {
        void el.offsetWidth;
        el.classList.add('kk-shake');
      }
    }

    _highlightSpeaker(charId) {
      if (!this.slotEls) return;
      const cid = (charId || '').toLowerCase();
      ['left', 'center', 'right'].forEach((pos) => {
        const s = this.slots[pos];
        const el = this.slotEls[pos];
        if (!s || !el) return;
        el.classList.remove('highlight', 'dim');
        if (cid && cid !== 'narrator') {
          if (s.id === cid) el.classList.add('highlight');
          else el.classList.add('dim');
        }
      });
    }

    _showDialogue(cmd) {
      const charId = (cmd.char || cmd.id || 'narrator').toLowerCase();
      const meta = CHAR_META[charId] || { name: cmd.name || charId, color: '#90b4f8' };
      const speakerName = cmd.name || (charId === 'narrator' ? '' : meta.name);
      this.currentCharId = charId;
      this.currentSpeaker = speakerName;
      this.fullText = String(cmd.text || '');
      this.shownChars = 0;
      this.isTyping = true;

      this._highlightSpeaker(charId);

      // Push to backlog
      this.backlog.push({
        speaker: speakerName || '旁白',
        color: meta.color,
        text: this.fullText
      });
      if (this.backlog.length > 120) this.backlog.shift();

      if (speakerName) {
        this.nameEl.style.display = 'inline-block';
        this.nameEl.textContent = speakerName;
        this.nameEl.style.color = meta.color;
        this.nameEl.style.borderColor = meta.color;
      } else {
        this.nameEl.style.display = 'none';
      }

      this.textEl.textContent = '';
      this.nextEl.style.display = 'none';

      if (this.skipMode) {
        this._finishTyping();
        this._autoTimer = setTimeout(() => this._step(), this.opts.skipDelay);
        return;
      }

      this._typeTimer = setInterval(() => {
        this.shownChars++;
        const ch = this.fullText.charAt(this.shownChars - 1);
        this.textEl.textContent = this.fullText.slice(0, this.shownChars);
        if (this.opts.audio && ch && !/\s|[，。！？、…「」]/.test(ch)) {
          this.opts.audio.playVoiceBlip(charId);
        }
        if (this.shownChars >= this.fullText.length) {
          this._finishTyping();
        }
      }, this.opts.typeSpeed);
    }

    _finishTyping() {
      if (this._typeTimer) {
        clearInterval(this._typeTimer);
        this._typeTimer = null;
      }
      this.isTyping = false;
      this.shownChars = this.fullText.length;
      if (this.textEl) this.textEl.textContent = this.fullText;
      if (this.nextEl) this.nextEl.style.display = 'block';

      if (this.autoMode && !this.waitingChoice && !this.logOpen) {
        const waitMs = this.opts.autoDelayBase + this.fullText.length * this.opts.autoDelayPerChar;
        this._autoTimer = setTimeout(() => {
          if (this.running && this.autoMode && !this.isTyping && !this.waitingChoice) {
            this._step();
          }
        }, waitMs);
      }
    }

    _showChoices(options) {
      this.waitingChoice = true;
      this.choicesEl.innerHTML = '';
      this.choicesEl.classList.add('open');
      if (this.opts.audio) this.opts.audio.playChoiceAppear();

      options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kk-choice-btn';
        btn.textContent = '▸ ' + (opt.label || opt.text || ('選項 ' + (idx + 1)));
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.opts.audio) this.opts.audio.playMenuSelect();
          this.waitingChoice = false;
          this.choicesEl.classList.remove('open');
          if (opt.flag) this.stateFlags[opt.flag] = opt.value != null ? opt.value : true;
          if (opt.setState && typeof opt.setState === 'object') {
            Object.assign(this.stateFlags, opt.setState);
          }
          if (typeof opt.onSelect === 'function') opt.onSelect(this.stateFlags);
          if (opt.target && this.labels[opt.target] != null) {
            this.pc = this.labels[opt.target];
          }
          this._step();
        });
        this.choicesEl.appendChild(btn);
      });
    }

    advance() {
      if (!this.running || this.waitingChoice || this.logOpen) return;
      if (this.uiHidden) {
        this.toggleHide(false);
        return;
      }
      if (this.isTyping) {
        this._finishTyping();
      } else {
        if (this.opts.audio) this.opts.audio.playMenuMove();
        this._step();
      }
    }

    setAuto(flag) {
      this.autoMode = !!flag;
      if (this.btnAuto) this.btnAuto.classList.toggle('active', this.autoMode);
      if (this.autoMode && !this.isTyping && !this.waitingChoice && this.running) {
        this._autoTimer = setTimeout(() => this._step(), 650);
      }
    }

    toggleAuto() {
      this.setAuto(!this.autoMode);
    }

    setSkip(flag) {
      this.skipMode = !!flag;
      if (this.btnSkip) this.btnSkip.classList.toggle('active', this.skipMode);
      if (this.skipMode && this.running && !this.waitingChoice) {
        if (this.isTyping) this._finishTyping();
        this._autoTimer = setTimeout(() => this._step(), this.opts.skipDelay);
      }
    }

    toggleSkip() {
      this.setSkip(!this.skipMode);
    }

    toggleHide(force) {
      this.uiHidden = force != null ? !!force : !this.uiHidden;
      if (this.uiEl) this.uiEl.classList.toggle('hidden', this.uiHidden);
      if (this.restoreEl) this.restoreEl.classList.toggle('active', this.uiHidden);
    }

    toggleLog(force) {
      this.logOpen = force != null ? !!force : !this.logOpen;
      if (!this.logModal) return;
      if (this.logOpen) {
        this.logBody.innerHTML = '';
        this.backlog.forEach((entry) => {
          const item = document.createElement('div');
          item.className = 'kk-log-item';
          item.style.borderLeftColor = entry.color;
          item.innerHTML = '<div class="kk-log-spk" style="color:' + entry.color + '"></div><div class="kk-log-txt"></div>';
          item.querySelector('.kk-log-spk').textContent = entry.speaker;
          item.querySelector('.kk-log-txt').textContent = entry.text;
          this.logBody.appendChild(item);
        });
        this.logModal.classList.add('open');
        this.logBody.scrollTop = this.logBody.scrollHeight;
      } else {
        this.logModal.classList.remove('open');
      }
    }

    _triggerFlash() {
      if (!this.flashEl) return;
      this.flashEl.classList.add('on');
      setTimeout(() => this.flashEl.classList.remove('on'), 130);
    }

    _triggerStageShake() {
      if (!this.root) return;
      this.root.style.transform = 'translate(-5px, 3px)';
      setTimeout(() => { this.root.style.transform = 'translate(5px, -3px)'; }, 55);
      setTimeout(() => { this.root.style.transform = 'translate(-3px, -2px)'; }, 110);
      setTimeout(() => { this.root.style.transform = ''; }, 170);
    }

    _handleKeyDown(e) {
      if (!this.running) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.advance();
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleHide();
      } else if (e.key === 'l' || e.key === 'L') {
        this.toggleLog();
      } else if (e.key === 'a' || e.key === 'A') {
        this.toggleAuto();
      } else if (e.key === 'Escape' && this.logOpen) {
        this.toggleLog(false);
      }
    }
  }

  global.KiriKiriVN = KiriKiriVN;
})(typeof window !== 'undefined' ? window : globalThis);
