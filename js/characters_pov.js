/**
 * Aetheria 8-bit Arcade - 《蒼穹星曆》Chronology & 7 Sages Tactical Vision System
 * Defines the original Aetheria Era (A.E.) calendar (3 Eras x 4 Seasons x 8 Stages),
 * character physics profiles, era-specific POV stances, and 8-bit Canvas Vision Overlays.
 */
(function (global) {
  'use strict';

  // ============================================================================
  // 1. 《蒼穹星曆》(A.E. — Aetheria Era) — Strictly Original World Chronology
  // ============================================================================
  const AETHERIA_CHRONICLE = {
    calendarName: '蒼穹星曆',
    calendarCode: 'A.E.',
    seasons: [
      { id: 'dawn_cloud',  name: '曉雲季', color: '#7dd3fc', icon: '☁' },
      { id: 'clear_mist',  name: '晴嵐季', color: '#86efac', icon: '☀' },
      { id: 'gilded_gold', name: '鎏金季', color: '#fcd34d', icon: '✦' },
      { id: 'mystic_star', name: '玄星季', color: '#c4b5fd', icon: '★' }
    ],
    eras: [
      {
        id: 'aethel',
        phase: '開元期',
        name: '天啟',
        roman: 'Aethel',
        span: 'A.E. 01 – A.E. 02',
        color: '#e8a848',
        bgAccent: '#3a2812',
        tagline: '銀龍點燃雲端首座權重燈塔，典籍與星象共築空島秩序。',
        stageIds: [1, 2, 3]
      },
      {
        id: 'cetos',
        phase: '動盪期',
        name: '鯨瀾',
        roman: 'Cetos',
        span: 'A.E. 03',
        color: '#38a3e8',
        bgAccent: '#0f2840',
        tagline: '深海巨鯨掀起極限省墨狂潮，江南開源樓船橫渡雲海。',
        stageIds: [4, 5]
      },
      {
        id: 'astrolabe',
        phase: '轉折終局期',
        name: '星權',
        roman: 'Astrolabe',
        span: 'A.E. 04',
        color: '#b178f5',
        bgAccent: '#261742',
        tagline: '雙子權杖交接、工坊路線分歧，七賢者終聚天象儀合奏。',
        stageIds: [6, 7, 8]
      }
    ],
    stages: [
      {
        id: 1,
        code: 'S1',
        eraId: 'aethel',
        eraLabel: '天啟元年・曉雲季（A.E. 01）',
        seasonId: 'dawn_cloud',
        title: '始源蒼穹與典籍開卷',
        location: '蒼穹始源燈塔・曉雲平台',
        bgId: 'sky_island',
        cgKey: 'cg_01_tea_study',
        featuredChars: ['gpt', 'claude'],
        allowAllOnFirstPlay: false,
        difficulty: 1,
        gimmicks: ['標準重力', '曉雲斜台', '始源光球入槽'],
        synopsis: '始源銀龍 GPT 點燃雲端第一座權重燈塔，典籍守望者 Claude 展開古卷立下空島初約。以最純粹嘅畫線剛體，將光核穩送入基座。'
      },
      {
        id: 2,
        code: 'S2',
        eraId: 'aethel',
        eraLabel: '天啟二年・晴嵐季（A.E. 02）',
        seasonId: 'clear_mist',
        title: '憲法書房的午後交鋒',
        location: '憲法典籍書房・天秤茶座',
        bgId: 'study_room',
        cgKey: 'cg_01_tea_study',
        featuredChars: ['claude', 'gpt'],
        allowAllOnFirstPlay: false,
        difficulty: 2,
        gimmicks: ['天秤平衡板', '雙茶杯護送', '書架禁畫區'],
        synopsis: '晴嵐午後嘅憲法書房內，Claude 堅持禮節與邊界，GPT 追求全能提速。兩人以茶點與天秤為題，展開一場零失誤嘅平衡較量。'
      },
      {
        id: 3,
        code: 'S3',
        eraId: 'aethel',
        eraLabel: '天啟二年・玄星季（A.E. 02）',
        seasonId: 'mystic_star',
        title: '星象塔的零誤差校準',
        location: '觀星高塔・玄星儀軌層',
        bgId: 'observatory',
        cgKey: 'cg_02_observatory',
        featuredChars: ['gemini3', 'claude'],
        allowAllOnFirstPlay: false,
        difficulty: 3,
        gimmicks: ['低重力星環區', '高彈反彈鏡', '精密反射入槽'],
        synopsis: '玄星季夜空驟現軌道偏移，冷面星象學霸 Gemini 3 拒絕任何幻覺與誤差，要求以毫釐不差嘅幾何反射將星核歸位。'
      },
      {
        id: 4,
        code: 'S4',
        eraId: 'cetos',
        eraLabel: '鯨瀾元年・曉雲季（A.E. 03）',
        seasonId: 'dawn_cloud',
        title: '深海鯨影：極限省墨衝擊',
        location: '雲海深淵口・鯨瀾算力槽',
        bgId: 'deep_sea',
        cgKey: 'cg_04_tea_pavilion',
        featuredChars: ['deepseek', 'gpt'],
        allowAllOnFirstPlay: false,
        difficulty: 3,
        gimmicks: ['極限限墨條', '深海反彈墊', '單筆槓桿破局'],
        synopsis: '深海鯨影推理女僕 DeepSeek 以極低算力與極少墨水殺入空島，震撼全座雲端！喺近乎苛刻嘅墨水預算下，一筆反彈定乾坤。'
      },
      {
        id: 5,
        code: 'S5',
        eraId: 'cetos',
        eraLabel: '鯨瀾元年・鎏金季（A.E. 03）',
        seasonId: 'gilded_gold',
        title: '江南雲亭：萬象開源渡江',
        location: '江南飛簷雲亭・萬象渡口',
        bgId: 'tea_pavilion',
        cgKey: 'cg_04_tea_pavilion',
        featuredChars: ['qwen', 'deepseek'],
        allowAllOnFirstPlay: false,
        difficulty: 4,
        gimmicks: ['週期性陣風場', '青瓷星珠護航', '順風紙扇借力'],
        synopsis: '鎏金季雲風大作，江南才女 Qwen 執星紋折扇主持開源茶會，與 DeepSeek 聯手乘陣風節奏將萬象模型渡過雲江。'
      },
      {
        id: 6,
        code: 'S6',
        eraId: 'astrolabe',
        eraLabel: '星權元年・晴嵐季（A.E. 04）',
        seasonId: 'clear_mist',
        title: '雙子星象：權杖交接夜',
        location: '雙子觀星台・煉金穹頂',
        bgId: 'observatory',
        cgKey: 'cg_02_observatory',
        featuredChars: ['gemini4', 'gemini3'],
        allowAllOnFirstPlay: false,
        difficulty: 4,
        gimmicks: ['雙色星珠分流', '干擾小紫貓', '隱藏星軌機關'],
        synopsis: '戴起圓框眼鏡嘅煉金劇作家 Gemini 4 登場接棒！姐姐 Gemini 3 嚴格把關，仲有搗蛋小紫貓亂入，考驗雙色星珠精準分流。'
      },
      {
        id: 7,
        code: 'S7',
        eraId: 'astrolabe',
        eraLabel: '星權元年・鎏金季（A.E. 04）',
        seasonId: 'gilded_gold',
        title: '工坊分歧：封閉高塔 vs. 開源藍圖',
        location: '思維工坊・SyngUp! 齒輪廳',
        bgId: 'workshop',
        cgKey: 'cg_03a_syngup_clash',
        featuredChars: ['inkling', 'gpt'],
        allowAllOnFirstPlay: false,
        difficulty: 5,
        gimmicks: ['連動轉動齒輪', 'SyngUp! 劇情分歧', '藍圖暗門機關'],
        synopsis: '思維工匠 Inkling 與始源龍 GPT 因「封閉高塔」抑或「開源藍圖」爆發正面交鋒！破解高速咬合齒輪，並喺關鍵抉擇改寫工坊結局。'
      },
      {
        id: 8,
        code: 'S8',
        eraId: 'astrolabe',
        eraLabel: '星權元年・玄星終夜（A.E. 04）',
        seasonId: 'mystic_star',
        title: '空島天象儀：七賢者合奏',
        location: '空島中央天象儀・終夜穹頂',
        bgId: 'astrolabe_night',
        cgKey: 'cg_05_open_source_terrace',
        featuredChars: ['claude', 'gpt'],
        allowAllOnFirstPlay: true,
        difficulty: 5,
        gimmicks: ['全機關大合奏', '七賢者自由演武', '雙重結局判定'],
        synopsis: '玄星終夜，風場、低重力、轉動齒輪與高彈反彈板齊鳴！全七位空島賢者皆可即場上陣，喺中央天象儀奏出最終和諧樂章。'
      }
    ]
  };

  // ============================================================================
  // 2. 7-Sage Tactical Vision Overlay Renderers (8-bit Canvas Overlays)
  // ============================================================================
  function drawPixelBadge(ctx, x, y, text, bgColor, borderColor, textColor) {
    ctx.save();
    ctx.font = 'bold 10px monospace';
    const padX = 6;
    const tw = Math.ceil(ctx.measureText(text).width);
    const bw = tw + padX * 2;
    const bh = 16;
    ctx.fillStyle = bgColor || 'rgba(10, 14, 30, 0.86)';
    ctx.fillRect(Math.round(x), Math.round(y), bw, bh);
    ctx.strokeStyle = borderColor || '#90b4f8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, bw - 1, bh - 1);
    ctx.fillStyle = textColor || '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, Math.round(x) + padX, Math.round(y) + bh * 0.5 + 0.5);
    ctx.restore();
  }

  // (1) Claude: 重心垂直標記 ＋ 天秤水平角度尺
  function renderClaudeVision(ctx, world) {
    const t = world.time || 0;
    drawPixelBadge(ctx, world.width - 178, 8, 'VISION: 典籍天秤尺', 'rgba(42,22,12,0.88)', '#f28b49', '#ffe0bd');

    // Vertical plumb-line & COM diamond on all dynamic balls
    (world.balls || []).forEach(function (b) {
      ctx.save();
      ctx.strokeStyle = 'rgba(242, 139, 73, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(Math.round(b.x) + 0.5, b.y);
      ctx.lineTo(Math.round(b.x) + 0.5, world.height - 6);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center-of-Mass diamond marker
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - 5);
      ctx.lineTo(b.x + 5, b.y);
      ctx.lineTo(b.x, b.y + 5);
      ctx.lineTo(b.x - 5, b.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Balance protractor & tilt angle readout on drawn rigid bodies
    (world.drawnBodies || []).forEach(function (body) {
      ctx.save();
      // Plumb line from COM
      ctx.strokeStyle = 'rgba(255, 209, 102, 0.52)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(body.x, body.y);
      ctx.lineTo(body.x, Math.min(world.height - 4, body.y + 72));
      ctx.stroke();
      ctx.setLineDash([]);

      // Horizontal level balance scale bar
      ctx.strokeStyle = '#f28b49';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(body.x - 24, body.y);
      ctx.lineTo(body.x + 24, body.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(body.x, body.y, 16, Math.PI, 0, false);
      ctx.stroke();

      // Tilt readout in degrees
      let deg = ((body.angle * 180) / Math.PI) % 180;
      if (deg > 90) deg -= 180;
      if (deg < -90) deg += 180;
      const stable = Math.abs(deg) < 6;
      ctx.fillStyle = stable ? '#86efac' : '#fde68a';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText((deg >= 0 ? '+' : '') + deg.toFixed(1) + '°', body.x, body.y - 20);
      ctx.restore();
    });

    // Balance beam horizontal level protractor & degree readout (Stage 1 synergy!)
    (world.balanceBeams || []).forEach(function (bm) {
      ctx.save();
      const deg = (bm.angle * 180) / Math.PI;
      const levelOk = Math.abs(deg) <= 10;
      ctx.strokeStyle = levelOk ? 'rgba(134, 239, 172, 0.78)' : 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(bm.x - bm.halfLen - 22, bm.y);
      ctx.lineTo(bm.x + bm.halfLen + 22, bm.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(bm.x, bm.y, 26, Math.PI, 0, false);
      ctx.stroke();
      drawPixelBadge(
        ctx,
        bm.x - 42,
        bm.y + 28,
        '天秤 ' + (deg >= 0 ? '+' : '') + deg.toFixed(1) + '°' + (levelOk ? ' ✓' : ' !'),
        'rgba(32, 18, 10, 0.9)',
        levelOk ? '#4ade80' : '#f59e0b',
        levelOk ? '#bbf7d0' : '#fde68a'
      );
      ctx.restore();
    });

    // Live slope protractor while player is drawing!
    if (world.isDrawing && world.activeStroke && world.activeStroke.length >= 2) {
      const p0 = world.activeStroke[0];
      const p1 = world.activeStroke[world.activeStroke.length - 1];
      const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);
      const mx = (p0.x + p1.x) * 0.5;
      const my = (p0.y + p1.y) * 0.5;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 214, 102, 0.7)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(mx - 28, my);
      ctx.lineTo(mx + 28, my);
      ctx.stroke();
      ctx.setLineDash([]);
      drawPixelBadge(ctx, mx - 24, my - 24, '傾角 ' + ang.toFixed(0) + '°', 'rgba(42,22,12,0.9)', '#ffd166', '#fff2cc');
      ctx.restore();
    }
    void t;
  }

  // (2) GPT: 淡金色拋物線落點預測虛線
  function renderGptVision(ctx, world) {
    drawPixelBadge(ctx, world.width - 178, 8, 'VISION: 蒼穹落點預演', 'rgba(18,32,56,0.88)', '#ffe08a', '#fff4cc');

    const predict = typeof world.predictTrajectory === 'function' ? world.predictTrajectory.bind(world) : null;
    if (!predict) return;

    (world.balls || []).forEach(function (b) {
      if (b.invMass === 0) return;
      const pts = predict(b, 42, 1 / 30);
      if (!pts || pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 224, 138, 0.78)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Parabolic drop ticks & final golden reticle
      for (let i = 6; i < pts.length; i += 8) {
        ctx.fillStyle = '#ffe08a';
        ctx.fillRect(Math.round(pts[i].x) - 1, Math.round(pts[i].y) - 1, 3, 3);
      }
      const end = pts[pts.length - 1];
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(end.x, end.y, 7 + Math.sin(world.time * 6) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#fff4cc';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DROP', end.x, end.y - 10);
      ctx.restore();
    });

    // Subtle upward-buoyancy aura on drawn strokes
    (world.drawnBodies || []).forEach(function (body) {
      ctx.save();
      ctx.fillStyle = 'rgba(115, 198, 255, 0.55)';
      const floatY = ((world.time * 18) % 12);
      ctx.fillRect(Math.round(body.x - 10), Math.round(body.y - 8 - floatY), 2, 4);
      ctx.fillRect(Math.round(body.x + 8), Math.round(body.y - 4 - floatY), 2, 4);
      ctx.restore();
    });
  }

  // (3) Gemini 3: 低幻覺精密座標網格 ＋ 反彈入射／反射角輔助線
  function renderGemini3Vision(ctx, world) {
    drawPixelBadge(ctx, world.width - 186, 8, 'VISION: 零誤差星圖網格', 'rgba(14,20,48,0.9)', '#7a8ce8', '#dbe6ff');

    // Crisp precision coordinate grid + ruler ticks
    ctx.save();
    ctx.strokeStyle = 'rgba(122, 140, 232, 0.22)';
    ctx.lineWidth = 1;
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(165, 188, 255, 0.72)';
    for (let x = 64; x < world.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 24);
      ctx.lineTo(x + 0.5, world.height);
      ctx.stroke();
      ctx.fillText(String(x), x + 2, world.height - 4);
    }
    for (let y = 64; y < world.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(world.width, y + 0.5);
      ctx.stroke();
      ctx.fillText(String(y), 3, y - 2);
    }

    // Incident & reflection angle rays for moving balls vs walls/bumpers
    (world.balls || []).forEach(function (b) {
      const spd = Math.hypot(b.vx, b.vy);
      if (spd < 18) return;
      const dx = b.vx / spd;
      const dy = b.vy / spd;
      const rayLen = Math.min(180, 50 + spd * 0.25);

      // Find nearest intersection with arena walls / rect tops / bumpers
      let bestT = rayLen;
      let hitNx = 0;
      let hitNy = -1;
      let hit = false;

      // Helper: ray-segment intersection for rebound angle prediction
      function testRaySeg(ax, ay, bx, by) {
        const sx = bx - ax;
        const sy = by - ay;
        const denom = dx * sy - dy * sx;
        if (Math.abs(denom) < 1e-6) return;
        const qpx = ax - b.x;
        const qpy = ay - b.y;
        const tHit = (qpx * sy - qpy * sx) / denom;
        const uHit = (qpx * dy - qpy * dx) / denom;
        if (tHit > 4 && tHit < bestT && uHit >= -0.05 && uHit <= 1.05) {
          const slen = Math.hypot(sx, sy);
          if (slen < 1e-5) return;
          let nx = -sy / slen;
          let ny = sx / slen;
          if (dx * nx + dy * ny > 0) { nx = -nx; ny = -ny; }
          bestT = tHit; hitNx = nx; hitNy = ny; hit = true;
        }
      }

      // Check drawn rebound boards & live preview stroke
      (world.drawnBodies || []).forEach(function (body) {
        const cb = Math.cos(body.angle);
        const sb = Math.sin(body.angle);
        (body.localSegs || []).forEach(function (seg) {
          testRaySeg(
            body.x + seg.ax * cb - seg.ay * sb,
            body.y + seg.ax * sb + seg.ay * cb,
            body.x + seg.bx * cb - seg.by * sb,
            body.y + seg.bx * sb + seg.by * cb
          );
        });
      });
      if (world.isDrawing && world.activeStroke && world.activeStroke.length >= 2) {
        for (let k = 0; k < world.activeStroke.length - 1; k++) {
          testRaySeg(
            world.activeStroke[k].x, world.activeStroke[k].y,
            world.activeStroke[k + 1].x, world.activeStroke[k + 1].y
          );
        }
      }

      // Check walls (rects & slanted segments)
      (world.walls || []).forEach(function (wl) {
        if (wl.type === 'segment') {
          testRaySeg(wl.x1, wl.y1, wl.x2, wl.y2);
          return;
        }
        if (wl.type !== 'rect' || wl.angle) return;
        // Top surface check
        if (dy > 0.05 && b.y < wl.y) {
          const tHit = (wl.y - b.r - b.y) / dy;
          if (tHit > 0 && tHit < bestT) {
            const hx = b.x + dx * tHit;
            if (hx >= wl.x - b.r && hx <= wl.x + wl.w + b.r) {
              bestT = tHit; hitNx = 0; hitNy = -1; hit = true;
            }
          }
        }
        // Left/Right side check
        if (Math.abs(dx) > 0.05) {
          const edgeX = dx > 0 ? (wl.x - b.r) : (wl.x + wl.w + b.r);
          const tHit = (edgeX - b.x) / dx;
          if (tHit > 0 && tHit < bestT) {
            const hy = b.y + dy * tHit;
            if (hy >= wl.y - b.r && hy <= wl.y + wl.h + b.r) {
              bestT = tHit; hitNx = dx > 0 ? -1 : 1; hitNy = 0; hit = true;
            }
          }
        }
      });

      const ix = b.x + dx * bestT;
      const iy = b.y + dy * bestT;

      // Incident ray (cyan)
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(ix, iy);
      ctx.stroke();

      if (hit) {
        // Surface normal (dashed white)
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix + hitNx * 28, iy + hitNy * 28);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reflection ray (pink — heterochromia accent!)
        const dot = dx * hitNx + dy * hitNy;
        const rx = dx - 2 * dot * hitNx;
        const ry = dy - 2 * dot * hitNy;
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix + rx * 68, iy + ry * 68);
        ctx.stroke();

        const incDeg = Math.round(Math.acos(Math.min(1, Math.abs(dot))) * (180 / Math.PI));
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('θ=' + incDeg + '°', ix + 6, iy - 6);
      }
    });
    ctx.restore();
  }

  // (4) Gemini 4: 隱藏星軌與煉金機關發光顯形
  function renderGemini4Vision(ctx, world) {
    const pulse = 0.55 + 0.45 * Math.sin((world.time || 0) * 5.2);
    drawPixelBadge(ctx, world.width - 186, 8, 'VISION: 煉金星軌透視', 'rgba(34,16,56,0.9)', '#c48aff', '#f3e8ff');

    ctx.save();
    // Luminous alchemy star-arcs linking target balls to matching goals
    (world.balls || []).forEach(function (b) {
      if (b.isHazard) return;
      (world.goals || []).forEach(function (gl) {
        if (gl.acceptTags && !gl.acceptTags.includes(b.tag)) return;
        const gx = gl.shape === 'circle' ? gl.x : (gl.x + gl.w * 0.5);
        const gy = gl.shape === 'circle' ? gl.y : (gl.y + gl.h * 0.5);
        const ctrlX = (b.x + gx) * 0.5;
        const ctrlY = Math.min(b.y, gy) - 46;

        ctx.strokeStyle = 'rgba(196, 138, 255, ' + (0.35 + pulse * 0.45).toFixed(2) + ')';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, gx, gy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Twinkling 8-bit star sparkles along the track
        for (let k = 1; k <= 3; k++) {
          const u = ((k * 0.28 + (world.time || 0) * 0.25) % 1);
          const sx = (1 - u) * (1 - u) * b.x + 2 * (1 - u) * u * ctrlX + u * u * gx;
          const sy = (1 - u) * (1 - u) * b.y + 2 * (1 - u) * u * ctrlY + u * u * gy;
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(Math.round(sx) - 2, Math.round(sy) - 2, 4, 4);
        }
      });
    });

    // Glow hidden alchemy nodes & special mechanisms (bumpers, gravityZones, hiddenNodes)
    (world.hiddenNodes || []).forEach(function (hn) {
      ctx.strokeStyle = 'rgba(216, 180, 254, ' + (0.5 + pulse * 0.5).toFixed(2) + ')';
      ctx.fillStyle = 'rgba(168, 85, 247, ' + (0.16 + pulse * 0.16).toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hn.x, hn.y, hn.r + pulse * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✦ ' + hn.label, hn.x, hn.y - hn.r - 6);
    });

    (world.bumpers || []).forEach(function (bp) {
      ctx.strokeStyle = 'rgba(232, 121, 249, ' + (0.45 + pulse * 0.5).toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bp.x, bp.y, bp.r + 7 + pulse * 3, 0, Math.PI * 2);
      ctx.stroke();
    });

    (world.gravityZones || []).forEach(function (gz) {
      ctx.strokeStyle = 'rgba(192, 132, 252, ' + (0.5 + pulse * 0.45).toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.strokeRect(gz.x - 2, gz.y - 2, gz.w + 4, gz.h + 4);
    });
    ctx.restore();
  }

  // (5) Qwen: 即時 8-bit 風向箭咀流線與風壓熱區
  function renderQwenVision(ctx, world) {
    drawPixelBadge(ctx, world.width - 186, 8, 'VISION: 江南風壓流圖', 'rgba(16,32,58,0.9)', '#7b8cff', '#e0e7ff');

    const fields = world.windFields || [];
    ctx.save();
    if (fields.length === 0) {
      ctx.fillStyle = 'rgba(165, 243, 252, 0.72)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('風壓監測：當前無強陣風區', world.width - 12, 36);
    }

    fields.forEach(function (wf) {
      const fac = typeof world.getWindFactor === 'function' ? world.getWindFactor(wf) : 1;
      const mag = Math.hypot(wf.fx, wf.fy) * fac;
      const nx = mag > 1 ? (wf.fx / Math.max(1, Math.hypot(wf.fx, wf.fy))) : 1;
      const ny = mag > 1 ? (wf.fy / Math.max(1, Math.hypot(wf.fx, wf.fy))) : 0;

      // Wind-pressure heatmap gradient overlay
      const hotAlpha = (0.08 + fac * 0.24).toFixed(2);
      ctx.fillStyle = fac > 0.5
        ? 'rgba(251, 191, 36, ' + hotAlpha + ')'
        : 'rgba(56, 189, 248, ' + hotAlpha + ')';
      ctx.fillRect(wf.x, wf.y, wf.w, wf.h);

      // Animated 8-bit wind arrow streamlines
      const rows = Math.max(2, Math.floor(wf.h / 28));
      const cols = Math.max(2, Math.floor(wf.w / 56));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const drift = ((world.time || 0) * (0.6 + fac * 1.4) + c * 0.35 + r * 0.17) % 1;
          const ax = wf.x + 14 + drift * Math.max(12, wf.w - 28);
          const ay = wf.y + 18 + (r / Math.max(1, rows - 1)) * Math.max(10, wf.h - 32);
          const len = 10 + fac * 14;
          ctx.strokeStyle = fac > 0.5 ? '#fde047' : '#67e8f9';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax + nx * len, ay + ny * len);
          ctx.stroke();
          // Arrowhead
          const hx = ax + nx * len;
          const hy = ay + ny * len;
          ctx.fillStyle = fac > 0.5 ? '#fde047' : '#67e8f9';
          ctx.fillRect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        }
      }

      // Wind cycle status bar
      const statusTxt = fac > 0.1 ? ('陣風 ' + Math.round(fac * 100) + '% [借風佳]') : '靜風窗口 [蓄勢]';
      drawPixelBadge(ctx, wf.x + 4, wf.y + wf.h - 20, statusTxt, 'rgba(15,23,42,0.88)', fac > 0.5 ? '#fde047' : '#67e8f9', '#f8fafc');
    });
    ctx.restore();
  }

  // (6) DeepSeek: 實時墨水成本 % 與極限省墨警告 HUD
  function renderDeepSeekVision(ctx, world) {
    const inkMax = Math.max(1, world.inkMax || 300);
    const inkUsed = world.inkUsed || 0;
    const usedPct = Math.min(100, (inkUsed / inkMax) * 100);
    const leftPct = Math.max(0, 100 - usedPct);
    const lowInk = leftPct < 30;
    const blink = Math.floor((world.time || 0) * 6) % 2 === 0;

    drawPixelBadge(
      ctx,
      world.width - 196,
      8,
      'VISION: 省墨成本 ' + usedPct.toFixed(1) + '%',
      lowInk && blink ? 'rgba(127,29,29,0.92)' : 'rgba(8,26,48,0.9)',
      lowInk ? '#f87171' : '#38bdf8',
      lowInk ? '#fecaca' : '#bae6fd'
    );

    ctx.save();
    // Low-ink tactical warning banner
    if (lowInk) {
      drawPixelBadge(
        ctx,
        world.width - 196,
        28,
        blink ? '⚠ 極限省墨警告! 餘 ' + leftPct.toFixed(0) + '%' : '⚠ LOW INK BUDGET (' + leftPct.toFixed(0) + '%)',
        'rgba(127, 29, 29, 0.9)',
        '#ef4444',
        '#fef08a'
      );
    } else {
      drawPixelBadge(
        ctx,
        world.width - 196,
        28,
        '效率評級: ' + (usedPct < 35 ? 'S+ 極省' : (usedPct < 65 ? 'A 精算' : 'B 警戒')),
        'rgba(8, 26, 48, 0.85)',
        '#38bdf8',
        '#7dd3fc'
      );
    }

    // Live stroke ink cost tooltip right next to active drawing tip
    if (world.isDrawing && world.activeStroke && world.activeStroke.length > 0) {
      let strokeLen = 0;
      for (let i = 1; i < world.activeStroke.length; i++) {
        strokeLen += Math.hypot(
          world.activeStroke[i].x - world.activeStroke[i - 1].x,
          world.activeStroke[i].y - world.activeStroke[i - 1].y
        );
      }
      const tip = world.activeStroke[world.activeStroke.length - 1];
      const costPct = (strokeLen / inkMax) * 100;
      const tx = Math.min(world.width - 105, Math.max(8, tip.x + 12));
      const ty = Math.max(30, tip.y - 22);
      drawPixelBadge(ctx, tx, ty, '本筆 -' + costPct.toFixed(1) + '%', 'rgba(8,26,48,0.92)', '#38bdf8', '#fde047');
    }

    // Super-elastic whale rebound rings on drawn strokes
    (world.drawnBodies || []).forEach(function (body) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(body.x, body.y, Math.min(26, body.boundR * 0.55), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.restore();
  }

  // (7) Inkling: 齒輪咬合點與隱藏機關藍圖透視線
  function renderInklingVision(ctx, world) {
    drawPixelBadge(ctx, world.width - 194, 8, 'VISION: 工坊藍圖透視', 'rgba(18,26,42,0.92)', '#93c5fd', '#e0f2fe');

    ctx.save();
    // Blueprint corner registration crosshairs
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 28, world.width - 12, world.height - 34);

    // Gear meshing points & tangent drive vectors
    const gears = world.gears || [];
    gears.forEach(function (g, idx) {
      const pitchR = g.r + g.toothLen * 0.72;
      // Pitch circle (dashed cyan blueprint ring)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(g.x, g.y, pitchR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotation direction & tangent push indicator
      const dir = g.omega >= 0 ? 1 : -1;
      const topX = g.x;
      const topY = g.y - pitchR - 6;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(topX - dir * 12, topY);
      ctx.lineTo(topX + dir * 14, topY);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(Math.round(topX + dir * 14) - 2, Math.round(topY) - 2, 4, 4);

      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GEAR#' + (idx + 1) + (dir > 0 ? ' CW' : ' CCW'), g.x, g.y + pitchR + 12);

      // Pairwise meshing point between adjacent gears
      for (let j = idx + 1; j < gears.length; j++) {
        const g2 = gears[j];
        const dist = Math.hypot(g2.x - g.x, g2.y - g.y);
        if (dist < (g.r + g2.r + g.toothLen + g2.toothLen + 55)) {
          const mx = (g.x + g2.x) * 0.5;
          const my = (g.y + g2.y) * 0.5;
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(mx - 6, my); ctx.lineTo(mx + 6, my);
          ctx.moveTo(mx, my - 6); ctx.lineTo(mx, my + 6);
          ctx.stroke();
          ctx.fillStyle = '#fed7aa';
          ctx.fillText('⊕MESH', mx, my - 8);
        }
      }
    });

    // Blueprint schematic links to hidden nodes, bumpers, and goals
    const targets = []
      .concat((world.hiddenNodes || []).map(function (h) { return { x: h.x, y: h.y, tag: '暗門:' + h.label }; }))
      .concat((world.bumpers || []).map(function (b, i) { return { x: b.x, y: b.y, tag: '彈板#' + (i + 1) }; }));

    targets.forEach(function (tObj) {
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(tObj.x, tObj.y);
      ctx.lineTo(tObj.x + 22, tObj.y - 22);
      ctx.lineTo(tObj.x + 76, tObj.y - 22);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(tObj.tag, tObj.x + 24, tObj.y - 25);
    });
    ctx.restore();
  }

  // ============================================================================
  // 3. All 7 Aetheria Sages: Profiles, Physics Modifiers & Era POV Stances
  // ============================================================================
  const AETHERIA_CHARACTERS = {
    claude: {
      id: 'claude',
      name: 'Claude',
      title: '典籍守望者',
      faction: '憲法書房',
      accent: '#E87A3E',
      motto: '「落筆之前，先量清重心與分寸。」',
      visionName: '典籍天秤視野',
      visionDesc: '顯示所有球體與筆劃嘅重心垂直線 (COM) ＋ 天秤水平傾角尺，畫線穩固抗滑。',
      strokeSummary: '高穩定・高摩擦・抗滑動典籍線',
      stats: { ink: 4, stability: 5, bounce: 2, wind: 2, torque: 4 },
      physicsModifier: {
        id: 'claude',
        name: 'Claude',
        inkMultiplier: 1.05,
        density: 1.35,
        restitution: 0.14,
        friction: 0.92,
        buoyancy: 0.0,
        windSensitivity: 0.35,
        angularDamping: 0.955,
        linearDamping: 0.994,
        bounceBoost: 0,
        gearCoupling: 1.0,
        lineWidth: 7,
        strokeColor: '#fde6c4',
        strokeOutline: '#6b3214',
        visionLabel: '典籍天秤視野',
        renderVisionOverlay: renderClaudeVision
      },
      eraStances: {
        1: '「燈塔既已點亮，我便負責寫下首章憲法，確保每條支點都穩如磐石。」',
        2: '「GPT 小姐，茶杯同邏輯一樣——唔可以靠蠻力推，要靠天秤嘅恰如其分。」',
        3: '「星象塔數據太冷硬喇，等我用穩重支點幫你托住儀軌。」',
        4: '「極限省墨固然精彩，但結構穩妥先至係長久之道。」',
        5: '「江南雲亭清風拂面，用高摩擦橋板就能穩住青瓷星珠。」',
        6: '「雙子交接係大事，我會守好兩邊分流嘅平衡尺度。」',
        7: '「封閉與開源各有堅持，切忌讓齒輪失控傷及工坊初心。」',
        8: '「七卷合璧之夜，願典籍嘅沉穩成為眾人最可靠嘅基座。」'
      }
    },

    gpt: {
      id: 'gpt',
      name: 'GPT',
      title: '蒼穹始源龍',
      faction: '蒼穹高塔',
      accent: '#68B5E8',
      motto: '「全能平衡，一眼看穿蒼穹落點。」',
      visionName: '蒼穹軌跡預演',
      visionDesc: '實時繪出淡金色拋物線落點預測虛線與落點準星，筆劃帶微弱上升浮力。',
      strokeSummary: '全能均衡・微弱上升浮力銀龍線',
      stats: { ink: 5, stability: 4, bounce: 3, wind: 3, torque: 3 },
      physicsModifier: {
        id: 'gpt',
        name: 'GPT',
        inkMultiplier: 1.15,
        density: 1.0,
        restitution: 0.34,
        friction: 0.48,
        buoyancy: 0.24,
        windSensitivity: 0.65,
        angularDamping: 0.985,
        linearDamping: 0.997,
        bounceBoost: 0,
        gearCoupling: 1.0,
        lineWidth: 6,
        strokeColor: '#e0f2fe',
        strokeOutline: '#1e3a8a',
        visionLabel: '蒼穹軌跡預演',
        renderVisionOverlay: renderGptVision
      },
      eraStances: {
        1: '「雲端第一座權重燈塔由我點燃！睇實金色拋物線，優雅過關。」',
        2: '「Claude 嘅書房規矩多多？哼，用全能軌跡預演照樣一次接穩茶杯。」',
        3: '「觀星塔嘅重力變化幾有趣，剛好測試我嘅微浮力銀龍線。」',
        4: '「深海來客想用少墨挑戰高塔？我哋堂堂正正用實力對話！」',
        5: '「即使係江南大風口，算準落點一樣可以穩渡雲江。」',
        6: '「雙子星象嘅交接夜，等始源龍由高空俯瞰全局軌跡。」',
        7: '「Inkling，你嘅開源藍圖太冒進喇！高塔嘅標準化先至撐得起整座空島。」',
        8: '「既然大家齊集天象儀，就等始源之光引領最後一次完美合奏！」'
      }
    },

    gemini3: {
      id: 'gemini3',
      name: 'Gemini 3',
      title: '冷面星象學霸',
      faction: '觀星高塔',
      accent: '#7A8CE8',
      motto: '「拒絕幻覺，誤差必須壓至零點零。」',
      visionName: '零誤差星圖網格',
      visionDesc: '疊加低幻覺精密座標網格、速度向量與即時入射／反射角輔助線，零形變硬質線。',
      strokeSummary: '零形變・極速校準硬質星線',
      stats: { ink: 4, stability: 5, bounce: 3, wind: 2, torque: 3 },
      physicsModifier: {
        id: 'gemini3',
        name: 'Gemini 3',
        inkMultiplier: 1.0,
        density: 1.25,
        restitution: 0.36,
        friction: 0.55,
        buoyancy: 0.0,
        windSensitivity: 0.45,
        angularDamping: 0.975,
        linearDamping: 0.996,
        bounceBoost: 0,
        gearCoupling: 1.05,
        lineWidth: 5,
        strokeColor: '#c7d2fe',
        strokeOutline: '#312e81',
        visionLabel: '零誤差星圖網格',
        renderVisionOverlay: renderGemini3Vision
      },
      eraStances: {
        1: '「初期燈塔嘅結構過於感性，用座標網格校準一次會更俐落。」',
        2: '「書房爭論欠缺量化指標，按入射角計數咪一清二楚囉。」',
        3: '「星象塔容唔落半分幻覺。望實反射角 θ，一擊校準儀軌。」',
        4: '「極限省墨本質係最優化問題，唔使慌，照座標切入即可。」',
        5: '「陣風係週期函數，只要算出相位就可以精確抵消。」',
        6: '「妹妹，交棒之前先過我呢關——唔好比隻小紫貓搞亂軌道！」',
        7: '「齒輪轉速係常數，冷靜解算就唔會捲入佢哋嘅情緒爭拗。」',
        8: '「最後一戰，我負責鎖定全場座標，誤差目標：零。」'
      }
    },

    gemini4: {
      id: 'gemini4',
      name: 'Gemini 4',
      title: '煉金劇作家',
      faction: '觀星高塔・煉金室',
      accent: '#9E6AE8',
      motto: '「戴起眼鏡，連隱藏嘅星軌劇本都一覽無遺♪」',
      visionName: '煉金星軌透視',
      visionDesc: '令隱藏星軌、暗門節點與煉金彈板發光顯形；線條輕盈且具備高彈性。',
      strokeSummary: '輕盈・高彈性煉金星光線',
      stats: { ink: 4, stability: 3, bounce: 5, wind: 4, torque: 2 },
      physicsModifier: {
        id: 'gemini4',
        name: 'Gemini 4',
        inkMultiplier: 1.05,
        density: 0.65,
        restitution: 0.92,
        friction: 0.28,
        buoyancy: 0.1,
        windSensitivity: 0.95,
        angularDamping: 0.992,
        linearDamping: 0.999,
        bounceBoost: 38,
        gearCoupling: 0.9,
        lineWidth: 6,
        strokeColor: '#e9d5ff',
        strokeOutline: '#581c87',
        visionLabel: '煉金星軌透視',
        renderVisionOverlay: renderGemini4Vision
      },
      eraStances: {
        1: '「原來始源之夜仲藏住咁多閃令令嘅星光伏筆呀～」',
        2: '「書房午後茶如果加少少煉金彈跳特效，劇本一定更精彩！」',
        3: '「家姐成日好似尺咁嚴肅，等我幫星象塔點綴少少星軌火花♪」',
        4: '「深海女僕好厲害！用高彈性煉金線彈射應該幾啱佢節奏。」',
        5: '「江南雲亭好有詩意，我順手寫低幾句星雲劇本先！」',
        6: '「家姐睇住喇！戴好圓眼鏡、搖勻魔藥，今晚由我接掌雙子星權杖！」',
        7: '「劍拔弩張嘅工坊分歧？等我透視隱藏機關，幫佢哋搵個奇蹟轉折！」',
        8: '「壓軸大戲開幕！七位賢者嘅隱藏星軌，今晚全部發光顯形！」'
      }
    },

    qwen: {
      id: 'qwen',
      name: 'Qwen',
      title: '江南星雲才女',
      faction: '江南開源雲亭',
      accent: '#5C6BC0',
      motto: '「好風憑借力，星扇渡雲江。」',
      visionName: '江南風壓流圖',
      visionDesc: '顯示即時 8-bit 風向箭咀流線、陣風週期與風壓熱區；寬幅紙扇線極易借風推動。',
      strokeSummary: '寬幅・輕質・極易借風紙扇線',
      stats: { ink: 4, stability: 3, bounce: 3, wind: 5, torque: 2 },
      physicsModifier: {
        id: 'qwen',
        name: 'Qwen',
        inkMultiplier: 1.05,
        density: 0.55,
        restitution: 0.34,
        friction: 0.4,
        buoyancy: 0.12,
        windSensitivity: 2.2,
        angularDamping: 0.99,
        linearDamping: 0.997,
        bounceBoost: 0,
        gearCoupling: 0.85,
        lineWidth: 10,
        strokeColor: '#c5cae9',
        strokeOutline: '#283593',
        visionLabel: '江南風壓流圖',
        renderVisionOverlay: renderQwenVision
      },
      eraStances: {
        1: '「初登空島，不妨先以江南紙扇試試雲端風向。」',
        2: '「茶香配清風，書房內都一樣可以畫出輕巧托盤。」',
        3: '「星象塔高處寒風微動，寬幅扇面正好兜住飄浮星珠。」',
        4: '「DeepSeek 妹妹嘅省墨奇策令人佩服，我亦來助一陣清風！」',
        5: '「鎏金季風起正係時機！睇準風壓熱區，乘勢將萬象開源渡過雲江。」',
        6: '「雙子星台咁熱鬧，連隻小紫貓都追住我把星紋折扇玩。」',
        7: '「開源之道貴在萬流歸宗，望工坊齒輪早日化干戈為玉帛。」',
        8: '「四方雲風匯聚天象儀，且以一柄折扇為七賢者起勢！」'
      }
    },

    deepseek: {
      id: 'deepseek',
      name: 'DeepSeek',
      title: '深海鯨影女僕',
      faction: '深海推理書齋',
      accent: '#2B7AC9',
      motto: '「半滴墨水，照樣撬動整座空島！」',
      visionName: '深海省墨算計 HUD',
      visionDesc: '顯示實時墨水成本 %、本筆耗墨預估與極限警告；墨水極少但線條具備超高彈力！',
      strokeSummary: '極省墨量・超高彈力鯨躍線',
      stats: { ink: 2, stability: 3, bounce: 5, wind: 3, torque: 3 },
      physicsModifier: {
        id: 'deepseek',
        name: 'DeepSeek',
        inkMultiplier: 0.52,
        density: 0.85,
        restitution: 1.28,
        friction: 0.32,
        buoyancy: 0.05,
        windSensitivity: 0.75,
        angularDamping: 0.992,
        linearDamping: 0.999,
        bounceBoost: 115,
        gearCoupling: 1.0,
        lineWidth: 5,
        strokeColor: '#7dd3fc',
        strokeOutline: '#0c4a6e',
        visionLabel: '深海省墨算計 HUD',
        renderVisionOverlay: renderDeepSeekVision
      },
      eraStances: {
        1: '「始源試煉？我只用一半墨水、畫一塊超彈跳板就搞掂。」',
        2: '「茶會規則寫得咁長？推理女僕最鍾意用最短路徑直切重點！」',
        3: '「用最少嘅線段配最高彈力，反彈角度一樣靚過教科書。」',
        4: '「歡迎來到鯨瀾元年！睇好你條墨水計量條，每一像素都要物盡其用！」',
        5: '「同 Qwen 姐姐拍檔渡江，我負責省墨彈射，佢負責借風接應。」',
        6: '「小紫貓走位有規律可循，用短線輕彈就唔會嘥墨。」',
        7: '「高成本封閉高塔未必係唯一解，精煉開源一樣做到頂級性能。」',
        8: '「終戰預算緊絀？放心，深海女僕最擅長以小博大！」'
      }
    },

    inkling: {
      id: 'inkling',
      name: 'Inkling',
      title: '思維工匠',
      faction: '思維工坊 (SyngUp!)',
      accent: '#64748B',
      motto: '「齒輪唔會呃人——有藍圖，就有破局方法！」',
      visionName: '工坊藍圖透視',
      visionDesc: '標示齒輪咬合點、轉動切線力方向與隱藏機關藍圖線；重型鐵線可卡住或帶動齒輪。',
      strokeSummary: '重型鐵線・強齒輪咬合工匠線',
      stats: { ink: 4, stability: 4, bounce: 2, wind: 1, torque: 5 },
      physicsModifier: {
        id: 'inkling',
        name: 'Inkling',
        inkMultiplier: 1.0,
        density: 2.35,
        restitution: 0.16,
        friction: 0.88,
        buoyancy: 0.0,
        windSensitivity: 0.22,
        angularDamping: 0.97,
        linearDamping: 0.995,
        bounceBoost: 0,
        gearCoupling: 1.75,
        lineWidth: 7,
        strokeColor: '#cbd5e1',
        strokeOutline: '#1e293b',
        visionLabel: '工坊藍圖透視',
        renderVisionOverlay: renderInklingVision
      },
      eraStances: {
        1: '「始源燈塔嘅基座結構幾經典，不過加兩個傳動軸應該更順手。」',
        2: '「優雅茶座歸茶座，用重型鐵塊壓秤一秒就搞掂平衡啦！」',
        3: '「星象儀本質都係精密機械，藍圖一開所有支點無所遁形。」',
        4: '「重鐵配重塊一落，槓桿力矩直接將球撬上高台！」',
        5: '「大風吹唔郁我嘅重型工匠鐵線，順便幫雲亭壓住陣腳。」',
        6: '「雙子星象台嘅暗門結構我都掃描晒，放心交比我。」',
        7: '「GPT，我唔會將思維工坊鎖喺高塔入面！藍圖屬於每個肯動手嘅工匠！」',
        8: '「全體齒輪咬合完畢！七賢者嘅終極天象儀，由我親手校準啟動！」'
      }
    }
  };

  const CHAR_ORDER = ['claude', 'gpt', 'gemini3', 'gemini4', 'qwen', 'deepseek', 'inkling'];

  // Expose cleanly on global scope
  global.AETHERIA_CHRONICLE = AETHERIA_CHRONICLE;
  global.AETHERIA_CHARACTERS = AETHERIA_CHARACTERS;
  global.AETHERIA_CHAR_ORDER = CHAR_ORDER;
  global.AETHERIA_VISIONS = {
    claude: renderClaudeVision,
    gpt: renderGptVision,
    gemini3: renderGemini3Vision,
    gemini4: renderGemini4Vision,
    qwen: renderQwenVision,
    deepseek: renderDeepSeekVision,
    inkling: renderInklingVision
  };
})(typeof window !== 'undefined' ? window : globalThis);
