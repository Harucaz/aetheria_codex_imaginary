/**
 * Aetheria 8-bit Arcade - 《天啟期（A.E. 01–02）》Stages 1 to 3 Physics Puzzles
 * Pure 2D rigid-body draw-line stage definitions (Q REMASTERED style).
 * Dialogue script IDs are pre-wired as hooks for js/scripts_1_to_3.js (Prompt 4b).
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
  // STAGE 1｜天啟元年・曉雲季（A.E. 01）《始源蒼穹與典籍開卷》
  // ============================================================================
  const STAGE_1 = {
    id: 1,
    code: 'S1',
    eraLabel: '天啟元年・曉雲季（A.E. 01）',
    title: '始源蒼穹與典籍開卷',
    featuredChars: ['gpt', 'claude'],
    scriptHooks: {
      intro: { gpt: 's1_intro_gpt', claude: 's1_intro_claude', free: 's1_intro_free' },
      clear: { gpt: 's1_clear_gpt', claude: 's1_clear_claude', free: 's1_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '畫出導流斜坡與承托支架，將高處下墜嘅「始源雲晶球」導入中央天秤托盤，並保持水平靜止 3 秒即過關。',
    hintText: '貼士：先喺左側畫斜坡引導雲晶球落入托盤，再用短支架撐住天秤底部保持水平（±11°內）！',
    inkMax: 560,
    gravity: { x: 0, y: 620 },
    allowFallOut: true, // Custom checkFail handles exact red warning line cleanly

    walls: [
      // Left & right arena borders
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#24355c', border: '#6482b8' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#24355c', border: '#6482b8' },
      // Starter dawn-cloud ledge (gently rolls the crystal orb rightwards after ~0.8s)
      { type: 'segment', x1: 22, y1: 92, x2: 128, y2: 112, r: 6, restitution: 0.25, friction: 0.35, color: '#5882b8', border: '#dbeafe' },
      // Slanted cloud obstacle #1 (deflects unguided fall leftwards unless bridged)
      { type: 'segment', x1: 186, y1: 184, x2: 274, y2: 158, r: 6, restitution: 0.35, friction: 0.45, color: '#46689c', border: '#bfdbfe' },
      // Slanted cloud obstacle #2 (right-side cloud shelf for alternate bank shots)
      { type: 'segment', x1: 472, y1: 196, x2: 594, y2: 164, r: 6, restitution: 0.42, friction: 0.4, color: '#46689c', border: '#bfdbfe' },
      // Central pedestal base underneath the balance beam (players can prop wedges here!)
      { type: 'rect', x: 242, y: 334, w: 166, h: 16, restitution: 0.2, friction: 0.8, color: '#3b4e7a', border: '#93c5fd' }
    ],

    balanceBeams: [
      {
        id: 'aethel_scale',
        x: 325,
        y: 300,
        halfLen: 82,
        thickness: 10,
        rimH: 18,
        angle: 0,
        maxAngle: 0.36,
        inertia: 54000,
        springK: 3.4,
        damping: 0.94,
        restitution: 0.16,
        friction: 0.82,
        color: '#c89236',
        border: '#fde68a',
        label: '中央天秤托盤'
      }
    ],

    balls: [
      {
        id: 'origin_crystal',
        tag: 'crystal',
        label: '始源雲晶球',
        x: 56,
        y: 66,
        vx: 14,
        vy: 0,
        r: 15,
        mass: 1.45,
        restitution: 0.34,
        friction: 0.55,
        color: '#7dd3fc',
        stroke: '#fef08a'
      }
    ],

    goals: [
      {
        id: 'scale_goal',
        shape: 'rect',
        x: 243,
        y: 236,
        w: 164,
        h: 64,
        acceptTags: ['crystal'],
        requiredCount: 1,
        holdTime: 3.0,
        maxSpeed: 54,
        label: '天秤托盤',
        color: '#4ade80',
        conditionHint: '天秤未水平!',
        condition: function (world) {
          const bm = world.balanceBeams && world.balanceBeams[0];
          if (!bm) return true;
          const deg = Math.abs((bm.angle * 180) / Math.PI);
          return deg <= 11.0;
        }
      }
    ],

    onInit: function (world) {
      world.customState = {
        hazardY: 374,
        maxTiltSeen: 0,
        currentTiltDeg: 0,
        failReason: ''
      };
    },

    onStep: function (world) {
      const bm = world.balanceBeams && world.balanceBeams[0];
      if (bm) {
        const deg = (bm.angle * 180) / Math.PI;
        world.customState.currentTiltDeg = deg;
        world.customState.maxTiltSeen = Math.max(world.customState.maxTiltSeen, Math.abs(deg));
      }
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y + b.r > world.customState.hazardY + 4) {
        world.customState.failReason = '始源雲晶球跌過雲海警戒線！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      const tilt = Math.abs(world.customState.currentTiltDeg || 0);
      if (world.inkUsed <= 250 && tilt <= 6.5) return 3;
      if (world.inkUsed <= 390) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const deg = world.customState.currentTiltDeg || 0;
      const gl = world.goals[0];
      const holdStr = gl ? (gl.timer.toFixed(1) + 's / ' + gl.holdTime.toFixed(1) + 's') : '0.0s';
      return '天秤傾角：' + (deg >= 0 ? '+' : '') + deg.toFixed(1) + '°（須 ≤ ±11°）｜靜止倒數：' + holdStr;
    },

    renderBehind: function (ctx, world) {
      // Soft 8-bit Dawn Cloud sky decorations
      ctx.fillStyle = 'rgba(125, 211, 252, 0.08)';
      ctx.fillRect(36, 48, 86, 16);
      ctx.fillRect(460, 56, 108, 18);
      ctx.fillRect(265, 86, 74, 14);
      // Pillar emblem below central scale
      ctx.fillStyle = 'rgba(253, 230, 138, 0.14)';
      ctx.fillRect(318, 350, 14, 24);
    },

    renderFront: function (ctx, world) {
      drawHazardLine(ctx, world.customState.hazardY, world.width, '⚠ 底部掉落重開警戒線 [R]', world.time);
      const deg = world.customState.currentTiltDeg || 0;
      const ok = Math.abs(deg) <= 11.0;
      drawStageHudPill(
        ctx,
        174,
        8,
        '天秤傾角 ' + (deg >= 0 ? '+' : '') + deg.toFixed(1) + '°',
        'rgba(14, 20, 42, 0.85)',
        ok ? '#4ade80' : '#f59e0b',
        ok ? '#bbf7d0' : '#fde68a'
      );
    }
  };

  // ============================================================================
  // STAGE 2｜天啟二年・晴嵐季（A.E. 02）《憲法書房的午後交鋒》
  // ============================================================================
  const STAGE_2 = {
    id: 2,
    code: 'S2',
    eraLabel: '天啟二年・晴嵐季（A.E. 02）',
    title: '憲法書房的午後交鋒',
    featuredChars: ['claude', 'gpt'],
    scriptHooks: {
      intro: { claude: 's2_intro_claude', gpt: 's2_intro_gpt', free: 's2_intro_free' },
      clear: { claude: 's2_clear_claude', gpt: 's2_clear_gpt', free: 's2_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '低重力書房內，「紅茶雲精靈」會緩緩上飄與微漂。請畫出配重蓋板、倒掛導流漏斗或壓艙塊，將精靈安全押入右下方瓷茶壺內停留 2 秒！',
    hintText: '貼士：可畫一塊寬大配重蓋板由上方壓落，或畫斜向倒掛導流板將上飄精靈導入茶壺口再加蓋！',
    inkMax: 580,
    gravity: { x: 0, y: 310 }, // Low-gravity study room
    allowFallOut: true,

    walls: [
      // Outer wooden study room walls + tea table floor
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#472c1e', border: '#c08457' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#472c1e', border: '#c08457' },
      { type: 'rect', x: 0, y: 384, w: 640, h: 16, color: '#593725', border: '#d99b52' },
      // Slanted upper-left bookshelf canopy (keeps spirit from escaping immediately, nudges it rightwards)
      { type: 'segment', x1: 14, y1: 68, x2: 268, y2: 46, r: 7, restitution: 0.25, friction: 0.35, color: '#5c3824', border: '#e0a96d' },
      // Decorative study tea-shelf in middle-left
      { type: 'rect', x: 14, y: 274, w: 102, h: 12, restitution: 0.25, friction: 0.6, color: '#5c3824', border: '#d99b52' },

      // Thick anti-tunneling Porcelain Teapot (右下方瓷茶壺)
      { type: 'rect', x: 438, y: 264, w: 14, h: 120, restitution: 0.18, friction: 0.65, color: '#e2e8f0', border: '#94a3b8' },
      { type: 'rect', x: 584, y: 264, w: 14, h: 120, restitution: 0.18, friction: 0.65, color: '#e2e8f0', border: '#94a3b8' },
      { type: 'rect', x: 438, y: 370, w: 160, h: 14, restitution: 0.15, friction: 0.7, color: '#cbd5e1', border: '#94a3b8' },
      // Teapot mouth funnel lips
      { type: 'segment', x1: 422, y1: 248, x2: 445, y2: 268, r: 6, restitution: 0.2, friction: 0.45, color: '#f1f5f9', border: '#94a3b8' },
      { type: 'segment', x1: 614, y1: 248, x2: 591, y2: 268, r: 6, restitution: 0.2, friction: 0.45, color: '#f1f5f9', border: '#94a3b8' }
    ],

    gravityZones: [
      {
        x: 12,
        y: 24,
        w: 616,
        h: 360,
        gx: 0,
        gy: 300,
        label: '低重力書房茶桌 (LOW-G)',
        color: 'rgba(180, 120, 60, 0.08)',
        border: '#c08457'
      }
    ],

    noDrawZones: [
      { x: 14, y: 288, w: 100, h: 94, label: '典籍書架禁畫' }
    ],

    balls: [
      {
        id: 'tea_spirit',
        tag: 'tea_spirit',
        label: '紅茶雲精靈',
        x: 205,
        y: 236,
        vx: 18,
        vy: -14,
        r: 16,
        mass: 1.0,
        restitution: 0.26,
        friction: 0.35,
        buoyancy: 1.18, // Net gentle upward acceleration: 300 * (1 - 1.18) = -54 px/s^2
        driftX: 44,     // Gentle horizontal sinusoidal sway
        driftFreq: 1.15,
        maxSpeed: 215,
        color: '#f59e0b',
        stroke: '#fef3c7',
        aiUpdate: function (b, world, dt) {
          // Cap free upward floating speed so spirit drifts smoothly instead of rocketing
          if (b.vy < -56) {
            b.vy += (-56 - b.vy) * Math.min(1, dt * 4.5);
          }
          if (Math.abs(b.vx) > 68 && !b.inGoal) {
            b.vx *= Math.pow(0.95, dt * 60);
          }
          // Gentle calming inside porcelain teapot so weighted lid holds it cleanly
          if (b.inGoal) {
            b.vx *= Math.pow(0.92, dt * 60);
            if (b.vy < -28) b.vy *= Math.pow(0.9, dt * 60);
          }
        }
      }
    ],

    goals: [
      {
        id: 'teapot_goal',
        shape: 'rect',
        x: 454,
        y: 274,
        w: 128,
        h: 94,
        acceptTags: ['tea_spirit'],
        requiredCount: 1,
        holdTime: 2.0,
        label: '瓷茶壺',
        color: '#4ade80'
      }
    ],

    onInit: function (world) {
      world.customState = {
        skylightX0: 274,
        skylightX1: 626,
        escapeY: 10,
        failReason: ''
      };
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y < -12) {
        world.customState.failReason = '紅茶雲精靈飄出書房天窗！按 [R] 鍵即時重開。';
        return true;
      }
      if (b && b.y > world.height + 60) {
        world.customState.failReason = '紅茶雲精靈離開茶桌範圍！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      if (world.inkUsed <= 240) return 3;
      if (world.inkUsed <= 390) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const b = world.balls[0];
      const gl = world.goals[0];
      const alt = b ? Math.max(0, Math.round(world.height - b.y)) : 0;
      const holdStr = gl ? (gl.timer.toFixed(1) + 's / ' + gl.holdTime.toFixed(1) + 's') : '0.0s';
      return '精靈高度：' + alt + 'px（防飄出天窗）｜入壺停留：' + holdStr;
    },

    renderBehind: function (ctx, world) {
      // Bookshelf spines inside no-draw zone
      const spineColors = ['#9a3412', '#b45309', '#7c2d12', '#1e3a5f', '#78350f'];
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = spineColors[i % spineColors.length];
        ctx.fillRect(20 + i * 15, 294, 11, 40);
        ctx.fillRect(20 + i * 15, 340, 11, 38);
      }
      // Teapot decorative handle & spout silhouette
      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(602, 322, 20, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.fillStyle = 'rgba(241, 245, 249, 0.14)';
      ctx.fillRect(452, 272, 132, 98);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      // Upper-right skylight escape warning
      ctx.save();
      const blink = 0.55 + 0.45 * Math.sin((world.time || 0) * 5);
      ctx.strokeStyle = 'rgba(251, 146, 60, ' + blink.toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(276, 12);
      ctx.lineTo(624, 12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fed7aa';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▲ 晴嵐天窗（精靈飄出即失敗）▲', 450, 22);
      ctx.restore();

      const b = world.balls[0];
      const vy = b ? b.vy : 0;
      drawStageHudPill(
        ctx,
        174,
        8,
        vy < -5 ? '浮力上飄 ↑' : (vy > 12 ? '受壓下降 ↓' : '懸浮平衡 ●'),
        'rgba(40, 24, 14, 0.88)',
        '#f59e0b',
        '#fef3c7'
      );
    }
  };

  // ============================================================================
  // STAGE 3｜天啟二年・玄星季（A.E. 02）《星象塔的零誤差校準》
  // ============================================================================
  const STAGE_3 = {
    id: 3,
    code: 'S3',
    eraLabel: '天啟二年・玄星季（A.E. 02）',
    title: '星象塔的零誤差校準',
    featuredChars: ['gemini3', 'claude'],
    scriptHooks: {
      intro: { gemini3: 's3_intro_gemini3', claude: 's3_intro_claude', free: 's3_intro_free' },
      clear: { gemini3: 's3_clear_gemini3', claude: 's3_clear_claude', free: 's3_clear_free' }
    },
    bgm: 'puzzle',
    objectiveText: '星象石柱阻擋咗直線落點！請畫出精準角度反彈板，令「星輝懷錶」經至少 1–2 次折反射後，精準落入底部觀測儀圓心並靜止 2 秒。',
    hintText: '貼士：畫斜角反彈板將懷錶彈向右側星鏡或越過中央石柱！折反射 ≥2 次更可奪得滿星評級。',
    inkMax: 520,
    gravity: { x: 0, y: 580 },
    allowFallOut: true,

    walls: [
      // Observatory tower borders
      { type: 'rect', x: 0, y: 0, w: 12, h: 400, color: '#1b224d', border: '#7a8ce8' },
      { type: 'rect', x: 628, y: 0, w: 12, h: 400, color: '#1b224d', border: '#7a8ce8' },
      // Upper-left gentle launch ledge (gives ~1.2s aiming window before drop)
      { type: 'segment', x1: 24, y1: 72, x2: 128, y2: 86, r: 5, restitution: 0.25, friction: 0.15, color: '#39468c', border: '#a5b4fc' },
      // Central Star Pillar Obstacle #1 (blocks straight line to observatory bullseye)
      { type: 'rect', x: 248, y: 126, w: 32, h: 174, restitution: 0.72, friction: 0.25, color: '#262e63', border: '#8ba4ff' },
      // Upper Star Pillar Cap Obstacle #2 (prevents trivial high-wall skimming without angle)
      { type: 'rect', x: 356, y: 184, w: 26, h: 98, restitution: 0.72, friction: 0.25, color: '#262e63', border: '#8ba4ff' },
      // Fixed Angled Star Mirror on right side (crisp high-elasticity optical reflector!)
      { type: 'segment', x1: 576, y1: 118, x2: 524, y2: 230, r: 6, restitution: 0.9, friction: 0.08, color: '#38bdf8', border: '#e0f2fe' },
      // Bottom Observatory Dish Cradle (catches & calms the watch at bullseye center 456, 340)
      { type: 'segment', x1: 406, y1: 322, x2: 422, y2: 374, r: 5, restitution: 0.14, friction: 0.75, color: '#312e81', border: '#c4b5fd' },
      { type: 'segment', x1: 422, y1: 374, x2: 490, y2: 374, r: 5, restitution: 0.12, friction: 0.85, color: '#312e81', border: '#c4b5fd' },
      { type: 'segment', x1: 490, y1: 374, x2: 506, y2: 322, r: 5, restitution: 0.14, friction: 0.75, color: '#312e81', border: '#c4b5fd' }
    ],

    gravityZones: [
      {
        x: 210,
        y: 26,
        w: 280,
        h: 92,
        gx: 0,
        gy: 235,
        label: '玄星低重力弧道 (LOW-G)',
        color: 'rgba(122, 140, 232, 0.13)',
        border: '#8ba4ff'
      }
    ],

    bumpers: [
      { x: 168, y: 298, r: 19, restitution: 1.25, boost: 175, color: '#818cf8' }
    ],

    balls: [
      {
        id: 'star_watch',
        tag: 'pocket_watch',
        label: '星輝懷錶',
        x: 54,
        y: 52,
        vx: 26,
        vy: 0,
        r: 14,
        mass: 1.3,
        restitution: 0.76,
        friction: 0.18,
        color: '#fcd34d',
        stroke: '#fffbeb'
      }
    ],

    goals: [
      {
        id: 'observatory_center',
        shape: 'circle',
        x: 456,
        y: 342,
        r: 34,
        acceptTags: ['pocket_watch'],
        requiredCount: 1,
        holdTime: 2.0,
        maxSpeed: 42,
        label: '觀測儀圓心',
        color: '#4ade80',
        conditionHint: '需至少 1 次折反射!',
        condition: function (world) {
          return (world.customState.validBounces || 0) >= 1;
        }
      }
    ],

    onInit: function (world) {
      world.customState = {
        validBounces: 0,
        drawnBounces: 0,
        hazardY: 386,
        failReason: ''
      };
    },

    onBallBounce: function (ball, world, fromDrawn) {
      if (ball.id !== 'star_watch') return;
      // Ignore tiny settling hits already inside the observatory cradle
      if (ball.inGoal) return;
      // Ignore the initial gentle roll on the upper-left launch ledge
      if (ball.x < 134 && ball.y < 105) return;
      world.customState.validBounces = (world.customState.validBounces || 0) + 1;
      if (fromDrawn) {
        world.customState.drawnBounces = (world.customState.drawnBounces || 0) + 1;
      }
    },

    checkFail: function (world) {
      const b = world.balls[0];
      if (b && b.y - b.r > world.customState.hazardY) {
        world.customState.failReason = '星輝懷錶墜出星象塔！按 [R] 鍵即時重開。';
        return true;
      }
      return false;
    },

    evaluateStars: function (world) {
      const bounces = world.customState.validBounces || 0;
      if (bounces >= 2 && world.inkUsed <= 320) return 3;
      if (bounces >= 2 || world.inkUsed <= 260) return 2;
      return 1;
    },

    getStatusSummary: function (world) {
      const bounces = world.customState.validBounces || 0;
      const gl = world.goals[0];
      const holdStr = gl ? (gl.timer.toFixed(1) + 's / ' + gl.holdTime.toFixed(1) + 's') : '0.0s';
      return '折反射次數：' + bounces + ' 次（過關 ≥1｜滿星 ≥2）｜圓心靜止：' + holdStr;
    },

    renderBehind: function (ctx, world) {
      // Observatory astrolabe concentric rings around the bullseye
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 164, 255, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(456, 342, 54, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(456, 342, 16, 0, Math.PI * 2);
      ctx.stroke();
      // Label the right Star Mirror
      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✦星象反彈鏡', 562, 110);
      ctx.fillText('石柱', 264, 120);
      ctx.restore();
    },

    renderFront: function (ctx, world) {
      drawHazardLine(ctx, world.customState.hazardY, world.width, '⚠ 塔底虛空警戒線 [R]', world.time);
      const bCnt = world.customState.validBounces || 0;
      drawStageHudPill(
        ctx,
        174,
        8,
        '折反射: ' + bCnt + ' 次' + (bCnt >= 2 ? ' ★滿星達標' : (bCnt >= 1 ? ' ✓可過關' : ' (需≥1)')),
        'rgba(14, 18, 44, 0.9)',
        bCnt >= 2 ? '#fcd34d' : (bCnt >= 1 ? '#4ade80' : '#f472b6'),
        bCnt >= 2 ? '#fef08a' : (bCnt >= 1 ? '#bbf7d0' : '#fbcfe8')
      );
    }
  };

  // Register Stages 1–3 into global stage registry
  global.AETHERIA_STAGES = global.AETHERIA_STAGES || {};
  global.AETHERIA_STAGES[1] = STAGE_1;
  global.AETHERIA_STAGES[2] = STAGE_2;
  global.AETHERIA_STAGES[3] = STAGE_3;
})(typeof window !== 'undefined' ? window : globalThis);
