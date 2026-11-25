/**
 * Aetheria 8-bit Arcade - 《鯨瀾期＆星權初年（A.E. 03–04）》Stages 4 to 6 Advanced Physics Puzzles
 * Pure 2D rigid-body draw-line stage definitions (Low Ink Budget, Periodic Wind Field,
 * Dual-Color Sorting + Rhythmic Hopping Cat).
 * Dialogue script IDs are pre-wired as hooks for js/scripts_4_to_6.js (Prompt 5b).
 */
(function (global) {
  'use strict';

  function drawHazardLine(ctx, y, width, label, time) {
    ctx.save();
    const blink = 0.65 + 0.35 * Math.sin((time || 0) * 6);
    ctx.strokeStyle = 'rgba(248, 113, 113, ' + blink.toFixed(2) + ')';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(14, y);
    ctx.lineTo(width - 14, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(254, 202, 202, 0.9)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, width * 0.5, y - 5);
    ctx.restore();
  }

  function drawStageHudPill(ctx, x, y, text, bg, border, fg) {
    ctx.save();
    ctx.font = 'bold 10px monospace';
    const tw = Math.ceil(ctx.measureText(text).width);
    const bw = tw + 12;
    ctx.fillStyle = bg || 'rgba(10, 15, 34, 0.88)';
    ctx.fillRect(x, y, bw, 17);
    ctx.strokeStyle = border || '#6482b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 0.5, y + 0.5, bw - 1, 16);
    ctx.fillStyle = fg || '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 6, y + 9);
    ctx.restore();
  }

  // ============================================================================
  // STAGE 4｜鯨瀾元年・曉雲季（A.E. 03）《深海鯨影：極限省墨衝擊》
  // ============================================================================
  const STAGE_4 = {
    id: 4,
    code: 'S4',
    eraLabel: '鯨瀾元年・曉雲季（A.E. 03）',
    title: '深海鯨影：極限省墨衝擊',
    featuredChars: ['deepseek', 'gpt'],
    scriptHooks: {
      intro: { deepseek: 's4_intro_deepseek', gpt: 's4_intro_gpt', free: 's4_intro_free' },
      clear: { deepseek: 's4_clear_deepseek', gpt: 's4_clear_gpt', free: 's4_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '極限限墨試煉！請用極短筆劃畫出重錘、槓桿或高彈跳板，將困於深海氣泡箱底嘅「藍鯨核心」彈射出頂部缺口逃脫！',
    hintText: '貼士：直接喺箱內左側高處（翹翹板左端正上方）畫一粒短重錘或楔形塊砸落，就能以極少墨水將藍鯨核心轟出頂部缺口！',
    inkMax: 300, // Tight low-ink base budget (DeepSeek 0.52x => 156px ultra-efficient run!)
    gravity: { x: 0, y: 540 },
    allowFallOut: true,

    walls: [
      // Outer deep-sea trench frame
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#0c223d', border: '#38bdf8' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#0c223d', border: '#38bdf8' },
      { type: 'rect', x: 0, y: 386, w: 640, h: 14, color: '#0c223d', border: '#38bdf8' },

      // Deep-Sea Bubble Chamber (深海氣泡箱) walls with 128px top escape gap (x=256..384)
      { type: 'rect', x: 170, y: 136, w: 14, h: 250, restitution: 0.65, friction: 0.2, color: '#143861', border: '#7dd3fc' },
      { type: 'rect', x: 456, y: 136, w: 14, h: 250, restitution: 0.65, friction: 0.2, color: '#143861', border: '#7dd3fc' },
      { type: 'rect', x: 170, y: 364, w: 300, h: 16, restitution: 0.3, friction: 0.5, color: '#143861', border: '#7dd3fc' },
      // Top chamber ceiling lips framing the escape gap
      { type: 'rect', x: 170, y: 136, w: 86, h: 14, restitution: 0.55, friction: 0.25, color: '#1c4d82', border: '#bae6fd' },
      { type: 'rect', x: 384, y: 136, w: 86, h: 14, restitution: 0.55, friction: 0.25, color: '#1c4d82', border: '#bae6fd' },
      // Small guide bevel on inner right floor so core rests neatly on right seesaw arm
      { type: 'segment', x1: 424, y1: 318, x2: 452, y2: 298, r: 5, restitution: 0.6, friction: 0.2, color: '#1e5b96', border: '#7dd3fc' }
    ],

    gravityZones: [
      {
        x: 184,
        y: 150,
        w: 272,
        h: 214,
        gx: 0,
        gy: 305,
        label: '深海浮力氣泡箱 (LOW-G)',
        color: 'rgba(14, 165, 233, 0.13)',
        border: '#38bdf8'
      }
    ],

    balanceBeams: [
      {
        id: 'whale_catapult',
        x: 320,
        y: 332,
        halfLen: 88,
        thickness: 10,
        rimH: 0,
        angle: 0.08,
        maxAngle: 0.45,
        maxOmega: 9.2,
        launchMultiplier: 2.15,
        inertia: 13500,
        springK: 1.5,
        damping: 0.982,
        restitution: 0.55,
        friction: 0.45,
        color: '#0284c7',
        border: '#bae6fd',
        label: '深海彈射翹翹板'
      }
    ],

    bumpers: [
      { x: 214, y: 214, r: 17, restitution: 1.38, boost: 220, color: '#38bdf8' },
      { x: 426, y: 214, r: 17, restitution: 1.38, boost: 220, color: '#38bdf8' }
    ],

    hiddenNodes: [
      { x: 256, y: 182, r: 15, type: 'alchemy', label: '最佳落錘點' },
      { x: 320, y: 126, r: 16, type: 'alchemy', label: '缺口逃脫口' }
    ],

    balls: [
      {
        id: 'whale_core',
        tag: 'whale_core',
        label: '藍鯨核心',
        x: 374,
        y: 304,
        vx: 0,
        vy: 0,
        r: 15,
        mass: 1.15,
        restitution: 0.72,
        friction: 0.3,
        color: '#0ea5e9',
        stroke: '#e0f2fe'
      }
    ],

    goals: [
      {
        id: 'top_gap_escape',
        shape: 'rect',
        x: 234,
        y: 18,
        w: 172,
        h: 112,
        acceptTags: ['whale_core'],
        requiredCount: 1,
        holdTime: 0.35,
        label: '頂部缺口逃脫區',
        color: '#4ade80'
      }
    ],

    onInit: function (world) {
      world.customState = {
        escapedGap: false,
        peakHeight: 0,
        failReason: ''
      };
    },

    onStep: function (world) {
      const b = world.balls[0];
      if (!b) return;
      const h = Math.max(0, Math.round(332 - b.y));
      if (h > world.customState.peakHeight) world.customState.peakHeight = h;
      // Clear escape detection once the Blue Whale Core shoots cleanly above the top lid gap
      if (b.y + b.r < 134 && b.x >= 230 && b.x <= 410) {
        world.customState.escapedGap = true;
      }
    },

    checkWin: function (world) {
      const gl = world.goals[0];
      return !!(world.customState.escapedGap || (gl && gl.completed));
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y > world.height + 60) {
        world.customState.failReason = '藍鯨核心沉入深淵！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      const ratio = world.inkUsed / Math.max(1, world.inkMax);
      if (ratio <= 0.45) return 3;
      if (ratio <= 0.78) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const pct = Math.min(100, Math.round((world.inkUsed / Math.max(1, world.inkMax)) * 100));
      const peak = world.customState.peakHeight || 0;
      return '耗墨率：' + pct + '%（≤45% 奪 3★）｜核心最高彈射：' + peak + 'px / 目標 210px';
    },

    renderBehind: function (ctx, world) {
      // Rising 8-bit deep-sea bubbles inside chamber
      ctx.save();
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const bx = 200 + ((i * 33) % 240);
        const by = 356 - (((world.time * (28 + (i % 3) * 14) + i * 47) % 200));
        const br = 3 + (i % 3) * 2;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Escape arrows pointing out the top gap
      ctx.fillStyle = 'rgba(74, 222, 128, 0.55)';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      const bob = Math.sin((world.time || 0) * 5) * 4;
      ctx.fillText('▲ 彈射缺口 ▲', 320, 144 + bob);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      const usedPct = Math.min(100, (world.inkUsed / Math.max(1, world.inkMax)) * 100);
      const tight = usedPct >= 75;
      drawStageHudPill(
        ctx,
        174,
        8,
        '限墨池 ' + Math.round(world.inkUsed) + '/' + world.inkMax + 'px (' + usedPct.toFixed(0) + '%)',
        tight ? 'rgba(127, 29, 29, 0.9)' : 'rgba(8, 26, 48, 0.9)',
        tight ? '#f87171' : '#38bdf8',
        tight ? '#fecaca' : '#bae6fd'
      );
    }
  };

  // ============================================================================
  // STAGE 5｜鯨瀾元年・鎏金季（A.E. 03）《江南雲亭：萬象開源渡江》
  // ============================================================================
  const STAGE_5 = {
    id: 5,
    code: 'S5',
    eraLabel: '鯨瀾元年・鎏金季（A.E. 03）',
    title: '江南雲亭：萬象開源渡江',
    featuredChars: ['qwen', 'deepseek'],
    scriptHooks: {
      intro: { qwen: 's5_intro_qwen', deepseek: 's5_intro_deepseek', free: 's5_intro_free' },
      clear: { qwen: 's5_clear_qwen', deepseek: 's5_clear_deepseek', free: 's5_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '鎏金季週期東風陣陣吹過斷雲橋！請畫出風帆支架、護欄或防翻車底座，借東風之力把「青瓷茶杯」穩送抵右側茶亭停留 2 秒！',
    hintText: '貼士：趁開局靜風期先架起過橋護欄或喺茶杯背後畫一塊「寬幅風帆推板」，陣風一起就會推住茶杯飛渡斷雲橋！',
    inkMax: 520,
    gravity: { x: 0, y: 600 },
    allowFallOut: true,

    walls: [
      // Outer left & right sky borders
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#1e2c54', border: '#7b8cff' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#1e2c54', border: '#7b8cff' },

      // Left Cloud Pier (江南渡口)
      { type: 'rect', x: 12, y: 274, w: 136, h: 16, restitution: 0.18, friction: 0.55, color: '#3b4f82', border: '#c5cae9' },
      // Tiny calm starter speed-bump so teacup won't slide off before player draws
      { type: 'segment', x1: 128, y1: 273, x2: 142, y2: 270, r: 3, restitution: 0.15, friction: 0.7, color: '#64748b', border: '#e2e8f0' },

      // Broken Cloud Bridge (斷雲橋) floating stepping-stone piers
      { type: 'rect', x: 226, y: 280, w: 66, h: 14, restitution: 0.18, friction: 0.5, color: '#45598f', border: '#a5b4fc' },
      { type: 'rect', x: 362, y: 280, w: 66, h: 14, restitution: 0.18, friction: 0.5, color: '#45598f', border: '#a5b4fc' },

      // Right Tea Pavilion (右側江南雲亭)
      { type: 'rect', x: 488, y: 276, w: 140, h: 16, restitution: 0.16, friction: 0.65, color: '#2b5848', border: '#6ee7b7' },
      { type: 'rect', x: 614, y: 174, w: 14, h: 118, restitution: 0.15, friction: 0.65, color: '#2b5848', border: '#6ee7b7' },
      // Upturned Jiangnan pavilion eaves roof
      { type: 'segment', x1: 482, y1: 174, x2: 556, y2: 146, r: 5, restitution: 0.2, friction: 0.4, color: '#9a3412', border: '#fcd34d' },
      { type: 'segment', x1: 556, y1: 146, x2: 626, y2: 174, r: 5, restitution: 0.2, friction: 0.4, color: '#9a3412', border: '#fcd34d' }
    ],

    windFields: [
      {
        x: 16,
        y: 52,
        w: 506,
        h: 226,
        fx: 460,
        fy: -18,
        period: 4.4,
        duty: 0.62,
        phase: 2.95, // Starts in a 1.45s calm preparation window, then surges East!
        label: '江南鎏金東風場',
        color: 'rgba(99, 102, 241, 0.12)'
      }
    ],

    hiddenNodes: [
      { x: 186, y: 274, r: 14, type: 'alchemy', label: '斷橋缺口一' },
      { x: 326, y: 276, r: 14, type: 'alchemy', label: '斷橋缺口二' },
      { x: 458, y: 274, r: 14, type: 'alchemy', label: '渡亭入口' }
    ],

    balls: [
      {
        id: 'celadon_cup',
        tag: 'celadon_cup',
        label: '青瓷茶杯',
        x: 78,
        y: 254,
        vx: 0,
        vy: 0,
        r: 15,
        mass: 1.15,
        restitution: 0.22,
        friction: 0.44,
        windSensitivity: 0.52,
        color: '#6ee7b7',
        stroke: '#ecfdf5'
      }
    ],

    goals: [
      {
        id: 'tea_pavilion_goal',
        shape: 'rect',
        x: 496,
        y: 194,
        w: 116,
        h: 80,
        acceptTags: ['celadon_cup'],
        requiredCount: 1,
        holdTime: 2.0,
        maxSpeed: 58,
        label: '江南茶亭',
        color: '#4ade80'
      }
    ],

    onInit: function (world) {
      world.customState = {
        hazardY: 374,
        windStrength: 0,
        failReason: ''
      };
    },

    onStep: function (world) {
      const wf = world.windFields && world.windFields[0];
      if (wf && typeof world.getWindFactor === 'function') {
        world.customState.windStrength = world.getWindFactor(wf);
      }
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y + b.r > world.customState.hazardY + 4) {
        world.customState.failReason = '青瓷茶杯墜落雲海！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      if (world.inkUsed <= 260) return 3;
      if (world.inkUsed <= 390) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const wPct = Math.round((world.customState.windStrength || 0) * 100);
      const gl = world.goals[0];
      const holdStr = gl ? (gl.timer.toFixed(1) + 's / ' + gl.holdTime.toFixed(1) + 's') : '0.0s';
      return '東風風壓：' + (wPct > 5 ? (wPct + '% [順風推進]') : '0% [靜風築橋窗]') + '｜入亭停留：' + holdStr;
    },

    renderBehind: function (ctx, world) {
      // Decorative gilded clouds & pavilion pillars
      ctx.save();
      ctx.fillStyle = 'rgba(252, 211, 77, 0.09)';
      ctx.fillRect(156, 312, 62, 12);
      ctx.fillRect(300, 326, 56, 12);
      ctx.fillRect(436, 316, 48, 12);
      // Tea Pavilion wooden pillars
      ctx.fillStyle = 'rgba(180, 83, 9, 0.55)';
      ctx.fillRect(496, 174, 8, 102);
      ctx.fillRect(606, 174, 8, 102);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      drawHazardLine(ctx, world.customState.hazardY, world.width, '⚠ 斷雲橋底雲海（墜落即敗）[R]', world.time);
      const wPct = Math.round((world.customState.windStrength || 0) * 100);
      drawStageHudPill(
        ctx,
        174,
        8,
        wPct > 5 ? ('東風陣風 → ' + wPct + '%') : '靜風窗口 ●',
        'rgba(16, 28, 56, 0.9)',
        wPct > 45 ? '#fde047' : '#67e8f9',
        wPct > 45 ? '#fef08a' : '#cffafe'
      );
    }
  };

  // ============================================================================
  // STAGE 6｜星權元年・晴嵐季（A.E. 04）《雙子星象：權杖交接夜》
  // ============================================================================
  const STAGE_6_SCHEDULE = [
    { t: 1.5,  color: 'red'  },
    { t: 3.7,  color: 'blue' },
    { t: 5.9,  color: 'red'  },
    { t: 8.1,  color: 'blue' },
    { t: 10.5, color: 'red'  },
    { t: 12.9, color: 'blue' },
    { t: 15.4, color: 'red'  },
    { t: 17.9, color: 'blue' },
    { t: 20.5, color: 'red'  },
    { t: 23.1, color: 'blue' }
  ];

  const STAGE_6 = {
    id: 6,
    code: 'S6',
    eraLabel: '星權元年・晴嵐季（A.E. 04）',
    title: '雙子星象：權杖交接夜',
    featuredChars: ['gemini4', 'gemini3'],
    scriptHooks: {
      intro: { gemini4: 's6_intro_gemini4', gemini3: 's6_intro_gemini3', free: 's6_intro_free' },
      clear: { gemini4: 's6_clear_gemini4', gemini3: 's6_clear_gemini3', free: 's6_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '頂部依序落下紅、藍兩色「煉金星珠」！請畫出隔板與導流滑槽，避開中層按節奏跳動嘅「小紫貓」，將至少 2 粒紅珠導入左燒瓶、2 粒藍珠導入右燒瓶！',
    hintText: '貼士：紅珠由右上方落下、藍珠由左上方落下！可利用兩側魔力彈板或上下雙層交叉滑槽分流，切忌讓紅藍珠混入錯燒瓶！',
    inkMax: 560,
    gravity: { x: 0, y: 510 },
    allowFallOut: true,

    walls: [
      // Outer observatory borders
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#221842', border: '#a855f7' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#221842', border: '#a855f7' },
      { type: 'rect', x: 0, y: 386, w: 640, h: 14, color: '#221842', border: '#a855f7' },

      // Mid-layer Cat Patrol Platform (小紫貓跳台)
      { type: 'rect', x: 232, y: 242, w: 176, h: 12, restitution: 0.3, friction: 0.4, color: '#4c1d95', border: '#d8b4fe' },

      // Left Alchemy Flask (左紅燒瓶: inner x=34..150, y=288..384)
      { type: 'rect', x: 22, y: 286, w: 12, h: 100, restitution: 0.2, friction: 0.65, color: '#7f1d1d', border: '#f87171' },
      { type: 'rect', x: 150, y: 286, w: 12, h: 100, restitution: 0.2, friction: 0.65, color: '#7f1d1d', border: '#f87171' },
      { type: 'segment', x1: 14, y1: 270, x2: 28, y2: 288, r: 5, restitution: 0.2, friction: 0.4, color: '#991b1b', border: '#fca5a5' },
      { type: 'segment', x1: 170, y1: 270, x2: 156, y2: 288, r: 5, restitution: 0.2, friction: 0.4, color: '#991b1b', border: '#fca5a5' },

      // Right Alchemy Flask (右藍燒瓶: inner x=490..606, y=288..384)
      { type: 'rect', x: 478, y: 286, w: 12, h: 100, restitution: 0.2, friction: 0.65, color: '#1e3a8a', border: '#60a5fa' },
      { type: 'rect', x: 606, y: 286, w: 12, h: 100, restitution: 0.2, friction: 0.65, color: '#1e3a8a', border: '#60a5fa' },
      { type: 'segment', x1: 470, y1: 270, x2: 484, y2: 288, r: 5, restitution: 0.2, friction: 0.4, color: '#1d4ed8', border: '#93c5fd' },
      { type: 'segment', x1: 626, y1: 270, x2: 612, y2: 288, r: 5, restitution: 0.2, friction: 0.4, color: '#1d4ed8', border: '#93c5fd' }
    ],

    // Flanking Magic Bounce Points (light up brightly in Gemini 4's Vision!)
    bumpers: [
      { x: 184, y: 176, r: 16, restitution: 1.15, boost: 145, color: '#f43f5e' },
      { x: 456, y: 176, r: 16, restitution: 1.15, boost: 145, color: '#3b82f6' }
    ],

    hiddenNodes: [
      { x: 244, y: 118, r: 14, type: 'alchemy', label: '藍珠右轉點' },
      { x: 396, y: 118, r: 14, type: 'alchemy', label: '紅珠左轉點' },
      { x: 320, y: 186, r: 15, type: 'alchemy', label: '小紫貓躍起區' }
    ],

    noDrawZones: [
      { x: 212, y: 24, w: 216, h: 42, label: '星珠投落口禁畫' }
    ],

    // Starts with the rhythmic Little Purple Cat patrolling the mid-layer shelf!
    balls: [
      {
        id: 'purple_cat',
        tag: 'cat_hazard',
        label: '小紫貓',
        x: 320,
        y: 224,
        vx: 72,
        vy: 0,
        r: 15,
        mass: 2.8,
        restitution: 0.85,
        friction: 0.2,
        color: '#a855f7',
        stroke: '#f3e8ff',
        isHazard: true,
        aiUpdate: function (b, world, dt) {
          // Pure world.time rhythmic patrol & hop (zero external timers -> clean [R] reset!)
          const minX = 248;
          const maxX = 392;
          const targetVx = Math.cos(world.time * 1.65) >= 0 ? 78 : -78;
          b.vx += (targetVx - b.vx) * Math.min(1, dt * 6);
          if (b.x < minX) { b.x = minX; b.vx = Math.abs(b.vx); }
          if (b.x > maxX) { b.x = maxX; b.vx = -Math.abs(b.vx); }

          // Keep cat seated on its mid-layer patrol shelf
          if (b.y > 227) {
            b.y = 227;
            if (b.vy > 0) b.vy = 0;
          }
          const hopBeat = Math.floor(world.time / 1.75);
          if (hopBeat > (world.customState.lastCatBeat || 0) && b.y >= 220) {
            world.customState.lastCatBeat = hopBeat;
            b.vy = -245;
          }
        }
      }
    ],

    goals: [
      {
        id: 'red_flask',
        shape: 'rect',
        x: 34,
        y: 290,
        w: 116,
        h: 94,
        acceptTags: ['red_bead'],
        requiredCount: 2,
        holdTime: 1.0,
        label: '左紅燒瓶',
        color: '#f87171'
      },
      {
        id: 'blue_flask',
        shape: 'rect',
        x: 490,
        y: 290,
        w: 116,
        h: 94,
        acceptTags: ['blue_bead'],
        requiredCount: 2,
        holdTime: 1.0,
        label: '右藍燒瓶',
        color: '#60a5fa'
      }
    ],

    onInit: function (world) {
      world.customState = {
        spawnIndex: 0,
        redSpawned: 0,
        blueSpawned: 0,
        lastCatBeat: 0,
        wrongSorted: 0,
        wrongIds: {},
        failReason: ''
      };
    },

    onStep: function (world) {
      const cs = world.customState;
      // 1. Deterministic sequential Red & Blue Star Bead dispenser (driven strictly by world.time)
      while (cs.spawnIndex < STAGE_6_SCHEDULE.length && world.time >= STAGE_6_SCHEDULE[cs.spawnIndex].t) {
        const entry = STAGE_6_SCHEDULE[cs.spawnIndex];
        cs.spawnIndex++;
        const isRed = entry.color === 'red';
        if (isRed) cs.redSpawned++;
        else cs.blueSpawned++;

        if (typeof world.spawnBall === 'function') {
          world.spawnBall({
            id: (isRed ? 'red_bead_' : 'blue_bead_') + cs.spawnIndex,
            tag: isRed ? 'red_bead' : 'blue_bead',
            label: isRed ? '紅珠' : '藍珠',
            // Crossed-stream twin spouts: Red drops right-center, Blue drops left-center
            x: isRed ? 396 : 244,
            y: 48,
            vx: isRed ? -24 : 24,
            vy: 18,
            r: 12,
            mass: 0.95,
            restitution: 0.48,
            friction: 0.28,
            color: isRed ? '#fb7185' : '#38bdf8',
            stroke: isRed ? '#ffe4e6' : '#e0f2fe'
          });
        }
      }

      // 2. Track mis-sorted beads entering the opposite color flask
      const redGoal = world.goals[0];
      const blueGoal = world.goals[1];
      for (let i = 0; i < world.balls.length; i++) {
        const b = world.balls[i];
        if (b.tag === 'blue_bead' && redGoal &&
            b.x >= redGoal.x && b.x <= redGoal.x + redGoal.w &&
            b.y >= redGoal.y && b.y <= redGoal.y + redGoal.h) {
          if (!cs.wrongIds[b.id]) {
            cs.wrongIds[b.id] = true;
            cs.wrongSorted++;
          }
        }
        if (b.tag === 'red_bead' && blueGoal &&
            b.x >= blueGoal.x && b.x <= blueGoal.x + blueGoal.w &&
            b.y >= blueGoal.y && b.y <= blueGoal.y + blueGoal.h) {
          if (!cs.wrongIds[b.id]) {
            cs.wrongIds[b.id] = true;
            cs.wrongSorted++;
          }
        }
      }
    },

    checkFail: function (world) {
      const cs = world.customState;
      if ((cs.wrongSorted || 0) >= 2) {
        cs.failReason = '紅藍星珠兩度混入錯燒瓶導致魔藥失效！按 [R] 鍵即時重開。';
        return true;
      }
      // If all scheduled beads have dropped and elapsed > 29s without sorting 2+2, allow clean retry prompt
      if (cs.spawnIndex >= STAGE_6_SCHEDULE.length && world.time > 30.0) {
        const rg = world.goals[0];
        const bg = world.goals[1];
        if ((rg && rg.currentCount < rg.requiredCount) || (bg && bg.currentCount < bg.requiredCount)) {
          cs.failReason = '所有煉金星珠已落完，分流數量未達標！按 [R] 鍵即時重開。';
          return true;
        }
      }
      return false;
    },

    evaluateStars: function (world) {
      const wrong = world.customState.wrongSorted || 0;
      if (wrong === 0 && world.inkUsed <= 320) return 3;
      if (wrong === 0 || world.inkUsed <= 420) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const rg = world.goals[0];
      const bg = world.goals[1];
      const rc = rg ? (rg.currentCount || 0) : 0;
      const bc = bg ? (bg.currentCount || 0) : 0;
      const wrong = world.customState.wrongSorted || 0;
      const dropped = world.customState.spawnIndex || 0;
      return '紅燒瓶 ' + rc + '/2｜藍燒瓶 ' + bc + '/2｜已落珠 ' + dropped + '/' + STAGE_6_SCHEDULE.length + (wrong > 0 ? ('｜⚠ 混色 ' + wrong + '/2') : '');
    },

    renderBehind: function (ctx, world) {
      ctx.save();
      // Twin dispenser spouts at top
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(230, 26, 28, 16);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.strokeRect(230, 26, 28, 16);

      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(382, 26, 28, 16);
      ctx.strokeStyle = '#f87171';
      ctx.strokeRect(382, 26, 28, 16);

      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('藍珠口↘', 244, 21);
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('↙紅珠口', 396, 21);

      // Flask liquid tint
      ctx.fillStyle = 'rgba(248, 113, 113, 0.14)';
      ctx.fillRect(34, 336, 116, 48);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.14)';
      ctx.fillRect(490, 336, 116, 48);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      // Draw cute 8-bit cat ears & glowing eyes right on top of the Little Purple Cat!
      const cat = world.balls.find(function (b) { return b.id === 'purple_cat'; });
      if (cat) {
        ctx.save();
        ctx.translate(cat.x, cat.y);
        // Pointy purple pixel cat ears
        ctx.fillStyle = '#a855f7';
        ctx.strokeStyle = '#f3e8ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, -8); ctx.lineTo(-14, -21); ctx.lineTo(-3, -13); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(12, -8); ctx.lineTo(14, -21); ctx.lineTo(3, -13); ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Glowing mischievous yellow eyes
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-7, -4, 4, 4);
        ctx.fillRect(3, -4, 4, 4);
        ctx.restore();
      }

      const rg = world.goals[0];
      const bg = world.goals[1];
      const wrong = world.customState.wrongSorted || 0;
      drawStageHudPill(
        ctx,
        174,
        8,
        '紅 ' + (rg ? (rg.currentCount || 0) : 0) + '/2 | 藍 ' + (bg ? (bg.currentCount || 0) : 0) + '/2' + (wrong > 0 ? (' ⚠混' + wrong) : ''),
        wrong > 0 ? 'rgba(127, 29, 29, 0.9)' : 'rgba(28, 16, 52, 0.9)',
        wrong > 0 ? '#f87171' : '#c084fc',
        '#f3e8ff'
      );
    }
  };

  // Register Stages 4–6 into global stage registry
  global.AETHERIA_STAGES = global.AETHERIA_STAGES || {};
  global.AETHERIA_STAGES[4] = STAGE_4;
  global.AETHERIA_STAGES[5] = STAGE_5;
  global.AETHERIA_STAGES[6] = STAGE_6;
})(typeof window !== 'undefined' ? window : globalThis);
