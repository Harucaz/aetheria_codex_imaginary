/**
 * Aetheria 8-bit Arcade - 《星權期（A.E. 04）》Stages 7 & 8 Grand Finale Physics Puzzles
 * Stage 7: Thinking Workshop Rotating Gears (SyngUp! Divergence Arena)
 * Stage 8: Central Astrolabe Grand Finale (All 7 Sages Unlocked Immediately)
 * Dialogue script IDs are pre-wired as hooks for js/scripts_7_to_8.js (Prompt 6b).
 */
(function (global) {
  'use strict';

  function drawHazardLine(ctx, y, xStart, xEnd, label, time) {
    ctx.save();
    const blink = 0.65 + 0.35 * Math.sin((time || 0) * 6);
    ctx.strokeStyle = 'rgba(248, 113, 113, ' + blink.toFixed(2) + ')';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(xStart, y);
    ctx.lineTo(xEnd, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(254, 202, 202, 0.92)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, (xStart + xEnd) * 0.5, y - 5);
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
  // STAGE 7｜星權元年・鎏金季（A.E. 04）《工坊分歧：封閉高塔 vs. 開源藍圖》
  // ============================================================================
  const STAGE_7 = {
    id: 7,
    code: 'S7',
    eraLabel: '星權元年・鎏金季（A.E. 04）',
    title: '工坊分歧：封閉高塔 vs. 開源藍圖',
    featuredChars: ['inkling', 'gpt'],
    scriptHooks: {
      intro: { inkling: 's7_intro_inkling', gpt: 's7_intro_gpt', free: 's7_intro_free' },
      clear: { inkling: 's7_clear_inkling', gpt: 's7_clear_gpt', free: 's7_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '思維工坊三組順／逆時針黃銅齒輪高速運轉中！請畫出卡榫楔子、跨橋或高空導流連桿，把發光「MoE 藍圖卷軸」安全跨過齒輪陣送抵右側工坊核心並停留 2 秒！',
    hintText: '貼士：中央逆時針齒輪 (#2) 會將卷軸推返左邊！用 Inkling 重型鐵線可卡慢齒輪或搭橋跨越；用 GPT 可借微浮力線走右上鋼樑高空路線！',
    inkMax: 580,
    gravity: { x: 0, y: 600 },
    allowFallOut: true,

    walls: [
      // Outer workshop steel frame
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#1f2937', border: '#94a3b8' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#1f2937', border: '#94a3b8' },

      // Left Workshop Starting Platform (gentle slope launches scroll toward Gear #1)
      { type: 'segment', x1: 16, y1: 174, x2: 138, y2: 192, r: 6, restitution: 0.22, friction: 0.24, color: '#334155', border: '#cbd5e1' },
      { type: 'rect', x: 12, y: 196, w: 120, h: 16, restitution: 0.2, friction: 0.6, color: '#27303f', border: '#64748b' },

      // Upper High-Tower Steel Girder Bypass (ideal for GPT's high-altitude buoyancy route!)
      { type: 'segment', x1: 368, y1: 128, x2: 478, y2: 166, r: 5, restitution: 0.3, friction: 0.22, color: '#475569', border: '#fde68a' },

      // Right Workshop Core Platform (工坊核心台)
      { type: 'rect', x: 496, y: 256, w: 132, h: 16, restitution: 0.16, friction: 0.72, color: '#1e3a5f', border: '#60a5fa' },
      { type: 'rect', x: 616, y: 164, w: 12, h: 108, restitution: 0.15, friction: 0.7, color: '#1e3a5f', border: '#60a5fa' },
      // Smooth entry bevel from Gear #3 onto Core platform
      { type: 'segment', x1: 484, y1: 266, x2: 500, y2: 256, r: 4, restitution: 0.18, friction: 0.45, color: '#334155', border: '#93c5fd' }
    ],

    // 3 Meshed / Staggered 8-bit Brass Rotating Gears (CW -> CCW -> CW)
    gears: [
      {
        x: 204, y: 252,
        r: 34, teeth: 8, toothLen: 10, toothR: 5,
        omega: 1.75, canJam: true,
        color: '#b47b2b', rimColor: '#fde68a'
      },
      {
        x: 318, y: 236,
        r: 36, teeth: 9, toothLen: 10, toothR: 5,
        omega: -2.05, canJam: true,
        color: '#9a4a24', rimColor: '#fdba74'
      },
      {
        x: 432, y: 252,
        r: 34, teeth: 8, toothLen: 10, toothR: 5,
        omega: 1.95, canJam: true,
        color: '#b47b2b', rimColor: '#fde68a'
      }
    ],

    // Blueprint schematic nodes highlighted by Inkling's Vision!
    hiddenNodes: [
      { x: 262, y: 242, r: 14, type: 'blueprint', label: '咬合卡榫點' },
      { x: 318, y: 172, r: 15, type: 'blueprint', label: '跨橋支撐線' },
      { x: 375, y: 242, r: 14, type: 'blueprint', label: '順行接駁點' }
    ],

    balls: [
      {
        id: 'moe_scroll',
        tag: 'moe_scroll',
        label: 'MoE 藍圖卷軸',
        x: 54,
        y: 154,
        vx: 20,
        vy: 0,
        r: 14,
        mass: 1.35,
        restitution: 0.32,
        friction: 0.48,
        color: '#38bdf8',
        stroke: '#fef08a'
      }
    ],

    goals: [
      {
        id: 'workshop_core',
        shape: 'rect',
        x: 502,
        y: 176,
        w: 112,
        h: 78,
        acceptTags: ['moe_scroll'],
        requiredCount: 1,
        holdTime: 2.0,
        maxSpeed: 56,
        label: '工坊核心',
        color: '#4ade80'
      }
    ],

    onInit: function (world) {
      world.customState = {
        hazardY: 376,
        jammedCount: 0,
        failReason: ''
      };
    },

    onStep: function (world) {
      let jammed = 0;
      for (let i = 0; i < world.gears.length; i++) {
        if ((world.gears[i].jamAmount || 0) >= 0.25) jammed++;
      }
      world.customState.jammedCount = jammed;
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y + b.r > world.customState.hazardY + 4) {
        world.customState.failReason = 'MoE 藍圖卷軸墜入齒輪深淵！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      if (world.inkUsed <= 280) return 3;
      if (world.inkUsed <= 430) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const j = world.customState.jammedCount || 0;
      const gl = world.goals[0];
      const holdStr = gl ? (gl.timer.toFixed(1) + 's / ' + gl.holdTime.toFixed(1) + 's') : '0.0s';
      return '黃銅齒輪陣：' + (j > 0 ? ('已制動 ' + j + '/3') : '高速運轉中') + '｜核心停留：' + holdStr;
    },

    renderBehind: function (ctx, world) {
      // Industrial workshop steel trusses & blueprint grid highlights
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(204, 252); ctx.lineTo(318, 236); ctx.lineTo(432, 252);
      ctx.stroke();
      ctx.fillStyle = 'rgba(253, 224, 71, 0.10)';
      ctx.fillRect(504, 178, 108, 76);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SyngUp! 鋼樑高空道', 422, 122);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      drawHazardLine(ctx, world.customState.hazardY, 14, world.width - 14, '⚠ 工坊齒輪深淵（墜落即敗）[R]', world.time);
      const j = world.customState.jammedCount || 0;
      drawStageHudPill(
        ctx,
        174,
        8,
        j > 0 ? ('⚙ 齒輪制動 ' + j + '/3') : '⚙ 齒輪陣 CW / CCW / CW',
        'rgba(22, 28, 44, 0.9)',
        j > 0 ? '#4ade80' : '#fbbf24',
        j > 0 ? '#bbf7d0' : '#fef08a'
      );
    }
  };

  // ============================================================================
  // STAGE 8｜星權元年・玄星終夜（A.E. 04）《空島天象儀：七賢者合奏》(Grand Finale)
  // ============================================================================
  const SEVEN_SAGE_COLORS = ['#E87A3E', '#68B5E8', '#7A8CE8', '#9E6AE8', '#5C6BC0', '#2B7AC9', '#94A3B8'];

  const STAGE_8 = {
    id: 8,
    code: 'S8',
    eraLabel: '星權元年・玄星終夜（A.E. 04）',
    title: '空島天象儀：七賢者合奏',
    featuredChars: ['claude', 'gpt', 'gemini3', 'gemini4', 'qwen', 'deepseek', 'inkling'],
    allowAllOnFirstPlay: true,
    scriptHooks: {
      intro: {
        claude: 's8_intro_claude',
        gpt: 's8_intro_gpt',
        gemini3: 's8_intro_gemini3',
        gemini4: 's8_intro_gemini4',
        qwen: 's8_intro_qwen',
        deepseek: 's8_intro_deepseek',
        inkling: 's8_intro_inkling',
        free: 's8_intro_all'
      },
      clear: {
        claude: 's8_clear_claude',
        gpt: 's8_clear_gpt',
        gemini3: 's8_clear_gemini3',
        gemini4: 's8_clear_gemini4',
        qwen: 's8_clear_qwen',
        deepseek: 's8_clear_deepseek',
        inkling: 's8_clear_inkling',
        free: 's8_clear_all'
      }
    },
    bgm: 'boss',
    objectiveText: '空島綜合終戰！融合低重力浮升、中層週期星風與黃銅齒輪、以及上層星輝反彈牆——請將「空島星核」引導並穩放於中央頂端天象儀祭壇靜止 3 秒，點亮整座空島！',
    hintText: '貼士：星核滾入下層浮升區後會緩緩上浮！可於上層畫一塊斜向導流／反彈板將星核彈入中央頂端祭壇；全 7 位賢者（含省墨 DeepSeek）皆可以 1–2 筆精準通關！',
    inkMax: 620, // Tuned so DeepSeek (0.52x => 322px) & all 6 other Sages (620-713px) have clear, generous routes!
    gravity: { x: 0, y: 540 },
    allowFallOut: true,

    walls: [
      // Outer astrolabe dome borders
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#1b1440', border: '#c4b5fd' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#1b1440', border: '#c4b5fd' },
      // Safety floor under lower-left & center lift shaft (right bottom open to star void)
      { type: 'rect', x: 0, y: 384, w: 468, h: 16, restitution: 0.25, friction: 0.55, color: '#20174a', border: '#a78bfa' },

      // Lower-Left Starter Cradle (rolls Star Core smoothly into the Low-G Updraft Zone)
      { type: 'segment', x1: 16, y1: 338, x2: 134, y2: 354, r: 5, restitution: 0.22, friction: 0.18, color: '#3b2d7a', border: '#fde68a' },

      // Mid-Right Catch Ramp feeding the Right CCW Gear
      { type: 'segment', x1: 526, y1: 274, x2: 622, y2: 232, r: 5, restitution: 0.65, friction: 0.2, color: '#3b2d7a', border: '#93c5fd' },

      // Upper-Left & Upper-Right High-Elasticity Star-Glow Rebound Walls (上層星輝反彈牆)
      { type: 'segment', x1: 18, y1: 128, x2: 122, y2: 34, r: 6, restitution: 0.92, friction: 0.08, color: '#c084fc', border: '#fef08a' },
      { type: 'segment', x1: 622, y1: 128, x2: 518, y2: 34, r: 6, restitution: 0.92, friction: 0.08, color: '#c084fc', border: '#fef08a' },

      // Central Top Astrolabe Altar (中央頂端天象儀祭壇)
      { type: 'rect', x: 256, y: 118, w: 128, h: 12, restitution: 0.12, friction: 0.88, color: '#b47b2b', border: '#fef08a' },
      { type: 'segment', x1: 240, y1: 82, x2: 258, y2: 118, r: 5, restitution: 0.14, friction: 0.78, color: '#ca8a04', border: '#fef08a' },
      { type: 'segment', x1: 400, y1: 82, x2: 382, y2: 118, r: 5, restitution: 0.14, friction: 0.78, color: '#ca8a04', border: '#fef08a' }
    ],

    // Lower Tier: Low-Gravity Updraft Lift Zone (下層低重力浮升區)
    gravityZones: [
      {
        x: 138,
        y: 224,
        w: 164,
        h: 158,
        gx: 14,
        gy: -155,
        label: '下層低重力浮升區 (UP-G)',
        color: 'rgba(139, 92, 246, 0.16)',
        border: '#c4b5fd'
      }
    ],

    // Middle Tier: Periodic Star Breeze (中層週期微風)
    windFields: [
      {
        x: 110,
        y: 134,
        w: 420,
        h: 92,
        fx: 285,
        fy: -26,
        period: 4.2,
        duty: 0.58,
        phase: 0.85,
        label: '中層週期星風場',
        color: 'rgba(96, 165, 250, 0.12)'
      }
    ],

    // Middle Tier: Rotating Brass Astrolabe Gears (中層轉動齒輪)
    gears: [
      {
        x: 226, y: 248,
        r: 24, teeth: 8, toothLen: 8, toothR: 4,
        omega: 1.65, canJam: true,
        color: '#a16207', rimColor: '#fde68a'
      },
      {
        x: 468, y: 232,
        r: 26, teeth: 8, toothLen: 8, toothR: 4,
        omega: -1.85, canJam: true,
        color: '#9333ea', rimColor: '#e9d5ff'
      }
    ],

    // Upper-Flank Resonance Star Bumpers
    bumpers: [
      { x: 148, y: 146, r: 15, restitution: 1.22, boost: 160, color: '#a855f7' },
      { x: 492, y: 146, r: 15, restitution: 1.22, boost: 160, color: '#38bdf8' }
    ],

    hiddenNodes: [
      { x: 218, y: 120, r: 15, type: 'alchemy', label: '左星軌折射點' },
      { x: 422, y: 120, r: 15, type: 'alchemy', label: '右星軌折射點' },
      { x: 320, y: 80,  r: 18, type: 'alchemy', label: '七賢合奏核心' }
    ],

    balls: [
      {
        id: 'aetheria_core',
        tag: 'star_core',
        label: '空島星核',
        x: 54,
        y: 316,
        vx: 26,
        vy: 0,
        r: 14,
        mass: 1.15,
        restitution: 0.56,
        friction: 0.34,
        windSensitivity: 0.72,
        color: '#fde047',
        stroke: '#ffffff'
      }
    ],

    goals: [
      {
        id: 'astrolabe_altar',
        shape: 'rect',
        x: 254,
        y: 42,
        w: 132,
        h: 76,
        acceptTags: ['star_core'],
        requiredCount: 1,
        holdTime: 3.0,
        maxSpeed: 62,
        label: '天象儀祭壇',
        color: '#fde047'
      }
    ],

    onInit: function (world) {
      world.customState = {
        hazardY: 386,
        litSages: 0,
        failReason: ''
      };
    },

    onStep: function (world) {
      const gl = world.goals[0];
      const prog = gl && gl.holdTime > 0 ? Math.min(1, gl.timer / gl.holdTime) : 0;
      world.customState.litSages = Math.min(7, Math.floor(prog * 7));
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y - b.r > world.height + 16) {
        world.customState.failReason = '空島星核墜出終夜星淵！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      const ratio = world.inkUsed / Math.max(1, world.inkMax);
      if (ratio <= 0.45) return 3;
      if (ratio <= 0.75) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const gl = world.goals[0];
      const holdStr = gl ? (gl.timer.toFixed(1) + 's / ' + gl.holdTime.toFixed(1) + 's') : '0.0s';
      const lit = world.customState.litSages || 0;
      return '七賢星燈點亮：' + lit + '/7｜祭壇靜止倒數：' + holdStr;
    },

    renderBehind: function (ctx, world) {
      // Grand Astrolabe Rotating Constellation Rings & 7 Sage Star Lights!
      const gl = world.goals[0];
      const prog = gl && gl.holdTime > 0 ? Math.min(1, gl.timer / gl.holdTime) : 0;
      const lit = world.customState.litSages || 0;
      ctx.save();
      ctx.translate(320, 196);
      ctx.strokeStyle = 'rgba(196, 181, 253, ' + (0.16 + prog * 0.35).toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 148, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 106, 0, Math.PI * 2);
      ctx.stroke();

      // 7 Sage Nodes orbiting the Grand Astrolabe Ring
      for (let i = 0; i < 7; i++) {
        const a = (world.time || 0) * 0.25 + (i / 7) * Math.PI * 2 - Math.PI / 2;
        const sx = Math.cos(a) * 148;
        const sy = Math.sin(a) * 148;
        const active = i < lit || prog >= 0.99;
        ctx.fillStyle = active ? SEVEN_SAGE_COLORS[i] : 'rgba(148, 163, 184, 0.28)';
        ctx.beginPath();
        ctx.arc(sx, sy, active ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Star Rebound Wall labels
      ctx.save();
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✦星輝反彈牆', 72, 46);
      ctx.fillText('✦星輝反彈牆', 568, 46);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      drawHazardLine(ctx, world.customState.hazardY, 472, world.width - 14, '⚠ 右下星淵 [R]', world.time);
      const gl = world.goals[0];
      const lit = world.customState.litSages || 0;
      drawStageHudPill(
        ctx,
        174,
        8,
        '★ 天象儀合奏 ' + lit + '/7' + (gl && gl.timer > 0.05 ? (' (' + gl.timer.toFixed(1) + 's)') : ''),
        'rgba(24, 14, 48, 0.92)',
        lit > 0 ? '#fde047' : '#c084fc',
        '#fef9c3'
      );
    }
  };

  // Register Stages 7 & 8 into global stage registry
  global.AETHERIA_STAGES = global.AETHERIA_STAGES || {};
  global.AETHERIA_STAGES[7] = STAGE_7;
  global.AETHERIA_STAGES[8] = STAGE_8;
})(typeof window !== 'undefined' ? window : globalThis);
