/**
 * Aetheria 8-bit Arcade - 2D Draw-Line Rigid-Body Physics Engine (Q REMASTERED Style)
 * Pure Vanilla JavaScript + HTML5 Canvas.
 * Features:
 *  - Mouse & Touch freehand drawing converted into dynamic 2D rigid-body polylines (COM + Inertia)
 *  - Anti-tunneling sub-stepping solver (6 substeps @ 60Hz = 360Hz)
 *  - Stage mechanisms: Gravity Zones, Periodic Wind Fields, Rotating Gears, High-Elasticity Bumpers,
 *    Static Walls/Slopes, No-Draw Zones, Multi-Tag Goal Zones
 *  - Real-time Ink Budget & <0.5s Instant Restart (R key or API)
 *  - characterModifier & renderVisionOverlay(ctx, world) hook for 7 Sages
 */
(function (global) {
  'use strict';

  const FIXED_DT = 1 / 60;
  const SUBSTEPS = 6;
  const MAX_SPEED = 980;
  const MAX_OMEGA = 14;

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function distSq(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    return dx * dx + dy * dy;
  }

  function closestPointOnSegment(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const lenSq = abx * abx + aby * aby;
    if (lenSq < 1e-8) return { x: ax, y: ay, t: 0 };
    const t = clamp(((px - ax) * abx + (py - ay) * aby) / lenSq, 0, 1);
    return { x: ax + abx * t, y: ay + aby * t, t: t };
  }

  function pointInRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  function rotateVec(x, y, c, s) {
    return { x: x * c - y * s, y: x * s + y * c };
  }

  class PhysicsQEngine {
    constructor(canvasEl, options) {
      this.canvas = typeof canvasEl === 'string'
        ? document.querySelector(canvasEl)
        : canvasEl;
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.opts = Object.assign({
        width: 640,
        height: 400,
        audio: global.AETHERIA_AUDIO || null,
        assets: global.AETHERIA_ASSETS || null,
        onStateChange: null,
        onWin: null,
        onFail: null,
        onRestart: null
      }, options || {});

      if (this.canvas) {
        this.canvas.width = this.opts.width;
        this.canvas.height = this.opts.height;
      }

      this.stageConfig = null;
      this.characterModifier = this._defaultModifier();
      this.world = this._createEmptyWorld();

      this.running = false;
      this.paused = false;
      this._rafId = null;
      this._lastTime = 0;
      this._accum = 0;

      // Drawing interaction state
      this.isDrawing = false;
      this.activeStroke = [];
      this.restartFlash = 0;

      this._boundPointerDown = this._onPointerDown.bind(this);
      this._boundPointerMove = this._onPointerMove.bind(this);
      this._boundPointerUp = this._onPointerUp.bind(this);
      this._boundKeyDown = this._onKeyDown.bind(this);

      if (this.canvas) {
        this._bindEvents();
      }
    }

    _defaultModifier() {
      return {
        id: 'default',
        name: 'Default Sage',
        inkMultiplier: 1.0,
        inkMaxOverride: null,
        density: 1.0,
        restitution: 0.28,
        friction: 0.45,
        buoyancy: 0.0,
        windSensitivity: 0.65,
        angularDamping: 0.992,
        linearDamping: 0.9985,
        bounceBoost: 0,
        gearCoupling: 1.0,
        lineWidth: 6,
        strokeColor: '#eef6ff',
        strokeOutline: '#1d2b53',
        visionLabel: '',
        renderVisionOverlay: null
      };
    }

    _createEmptyWorld() {
      const self = this;
      return {
        width: this.opts.width,
        height: this.opts.height,
        gravity: { x: 0, y: 680 },
        time: 0,
        status: 'playing', // 'playing' | 'won' | 'failed'
        inkMax: 600,
        inkUsed: 0,
        strokeCount: 0,
        walls: [],
        balls: [],
        drawnBodies: [],
        gravityZones: [],
        windFields: [],
        gears: [],
        bumpers: [],
        balanceBeams: [],
        goals: [],
        noDrawZones: [],
        hiddenNodes: [],
        particles: [],
        decorations: [],
        customState: {},
        get isDrawing() { return self.isDrawing; },
        get activeStroke() { return self.activeStroke; },
        get characterModifier() { return self.characterModifier; },
        predictTrajectory: function (ball, steps, dtStep) {
          return self.predictTrajectory(ball, steps, dtStep);
        },
        getWindFactor: function (wf) {
          return self.getWindFactor(wf, this.time);
        },
        spawnBall: function (bCfg) {
          return self._spawnBallInWorld(this, bCfg);
        }
      };
    }

    _makeBallObject(b, idx) {
      const radius = b.r || 16;
      const mass = b.mass != null ? b.mass : Math.max(1, (radius * radius) / 140);
      return {
        id: b.id || ('ball_' + idx),
        tag: b.tag || 'target',
        label: b.label || '',
        x: b.x, y: b.y,
        vx: b.vx || 0, vy: b.vy || 0,
        r: radius,
        angle: b.angle || 0,
        omega: b.omega || 0,
        mass: mass,
        invMass: b.static ? 0 : 1 / mass,
        restitution: b.restitution != null ? b.restitution : 0.45,
        friction: b.friction != null ? b.friction : 0.35,
        color: b.color || '#ff6b6b',
        stroke: b.stroke || '#fff2cc',
        spriteId: b.spriteId || null,
        isHazard: !!b.isHazard,
        noGravity: !!b.noGravity,
        buoyancy: b.buoyancy != null ? b.buoyancy : 0,
        windSensitivity: b.windSensitivity != null ? b.windSensitivity : 1.0,
        driftX: b.driftX || 0,
        driftFreq: b.driftFreq || 1.2,
        maxSpeed: b.maxSpeed || MAX_SPEED,
        bounceCount: 0,
        drawnBounceCount: 0,
        lastBounceTime: -1,
        aiUpdate: typeof b.aiUpdate === 'function' ? b.aiUpdate : null,
        goalProgress: 0,
        inGoal: false
      };
    }

    _spawnBallInWorld(w, bCfg) {
      const obj = this._makeBallObject(bCfg || {}, w.balls.length);
      w.balls.push(obj);
      return obj;
    }

    setCharacterModifier(mod) {
      this.characterModifier = Object.assign(this._defaultModifier(), mod || {});
      if (this.stageConfig) {
        const baseInk = this.stageConfig.inkMax != null ? this.stageConfig.inkMax : 600;
        this.world.inkMax = this.characterModifier.inkMaxOverride != null
          ? this.characterModifier.inkMaxOverride
          : Math.round(baseInk * (this.characterModifier.inkMultiplier || 1.0));
      }
      this._emitState();
    }

    loadStage(stageConfig) {
      // Deep-clone config data (preserving callback functions)
      this.stageConfig = stageConfig;
      this._buildWorldFromStage(stageConfig);
      this.restartFlash = 0.22;
      this._emitState();
      if (!this.running) this.start();
    }

    _buildWorldFromStage(cfg) {
      const w = this._createEmptyWorld();
      w.width = this.opts.width;
      w.height = this.opts.height;
      w.gravity = cfg.gravity ? { x: cfg.gravity.x || 0, y: cfg.gravity.y != null ? cfg.gravity.y : 680 } : { x: 0, y: 680 };

      const baseInk = cfg.inkMax != null ? cfg.inkMax : 600;
      w.inkMax = this.characterModifier.inkMaxOverride != null
        ? this.characterModifier.inkMaxOverride
        : Math.round(baseInk * (this.characterModifier.inkMultiplier || 1.0));
      w.inkUsed = 0;

      // Static walls (rect or segment)
      w.walls = (cfg.walls || []).map((wl) => {
        if (wl.type === 'segment' || (wl.x1 != null && wl.x2 != null)) {
          return {
            type: 'segment',
            x1: wl.x1, y1: wl.y1, x2: wl.x2, y2: wl.y2,
            r: wl.r || wl.thickness || 5,
            restitution: wl.restitution != null ? wl.restitution : 0.35,
            friction: wl.friction != null ? wl.friction : 0.45,
            color: wl.color || '#4a5f8f',
            border: wl.border || '#89a7e0'
          };
        }
        return {
          type: 'rect',
          x: wl.x, y: wl.y, w: wl.w, h: wl.h,
          angle: wl.angle || 0,
          restitution: wl.restitution != null ? wl.restitution : 0.35,
          friction: wl.friction != null ? wl.friction : 0.45,
          color: wl.color || '#33456e',
          border: wl.border || '#7a98d6'
        };
      });

      // Dynamic balls / physics props
      w.balls = (cfg.balls || []).map((b, idx) => this._makeBallObject(b, idx));

      w.gravityZones = (cfg.gravityZones || []).map((gz) => ({
        x: gz.x, y: gz.y, w: gz.w, h: gz.h,
        gx: gz.gx != null ? gz.gx : 0,
        gy: gz.gy != null ? gz.gy : 180,
        label: gz.label || 'LOW-G',
        color: gz.color || 'rgba(130, 110, 255, 0.16)',
        border: gz.border || '#9e8cff'
      }));

      w.windFields = (cfg.windFields || []).map((wf) => ({
        x: wf.x, y: wf.y, w: wf.w, h: wf.h,
        fx: wf.fx != null ? wf.fx : 380,
        fy: wf.fy != null ? wf.fy : 0,
        period: wf.period != null ? wf.period : 3.2,
        duty: wf.duty != null ? wf.duty : 0.55,
        phase: wf.phase || 0,
        label: wf.label || 'WIND',
        color: wf.color || 'rgba(90, 220, 255, 0.14)'
      }));

      w.gears = (cfg.gears || []).map((g) => ({
        x: g.x, y: g.y,
        r: g.r || 32,
        teeth: g.teeth || 8,
        toothLen: g.toothLen || 11,
        toothR: g.toothR || 6,
        angle: g.angle || 0,
        baseOmega: g.omega != null ? g.omega : 1.8,
        omega: g.omega != null ? g.omega : 1.8,
        canJam: g.canJam !== false,
        jamAmount: 0,
        lastClickTime: -1,
        color: g.color || '#d9a441',
        rimColor: g.rimColor || '#ffe08a'
      }));

      w.bumpers = (cfg.bumpers || []).map((bp) => ({
        x: bp.x, y: bp.y,
        r: bp.r || 20,
        restitution: bp.restitution != null ? bp.restitution : 1.35,
        boost: bp.boost != null ? bp.boost : 240,
        color: bp.color || '#ff5e8a',
        flash: 0
      }));

      w.balanceBeams = (cfg.balanceBeams || []).map((bm, idx) => ({
        id: bm.id || ('beam_' + idx),
        x: bm.x, y: bm.y,
        halfLen: bm.halfLen || 70,
        thickness: bm.thickness || 10,
        rimH: bm.rimH || 0,
        angle: bm.angle || 0,
        omega: 0,
        maxAngle: bm.maxAngle != null ? bm.maxAngle : 0.42,
        maxOmega: bm.maxOmega != null ? bm.maxOmega : 3.5,
        launchMultiplier: bm.launchMultiplier != null ? bm.launchMultiplier : 1.0,
        inertia: bm.inertia || 48000,
        springK: bm.springK != null ? bm.springK : 2.6,
        damping: bm.damping != null ? bm.damping : 0.96,
        restitution: bm.restitution != null ? bm.restitution : 0.2,
        friction: bm.friction != null ? bm.friction : 0.65,
        color: bm.color || '#c89236',
        border: bm.border || '#fde68a',
        label: bm.label || ''
      }));

      w.goals = (cfg.goals || []).map((gl, idx) => ({
        id: gl.id || ('goal_' + idx),
        shape: gl.shape || 'rect',
        x: gl.x, y: gl.y,
        w: gl.w || 72, h: gl.h || 56,
        r: gl.r || 34,
        acceptTags: Array.isArray(gl.acceptTags) ? gl.acceptTags : (gl.acceptTag ? [gl.acceptTag] : ['target']),
        requiredCount: gl.requiredCount || 1,
        holdTime: gl.holdTime != null ? gl.holdTime : 0.65,
        maxSpeed: gl.maxSpeed != null ? gl.maxSpeed : null,
        condition: typeof gl.condition === 'function' ? gl.condition : null,
        conditionHint: gl.conditionHint || '',
        conditionMet: true,
        timer: 0,
        completed: false,
        label: gl.label || 'GOAL',
        color: gl.color || '#4ade80'
      }));

      w.noDrawZones = (cfg.noDrawZones || []).map((nd) => ({
        x: nd.x, y: nd.y, w: nd.w, h: nd.h,
        label: nd.label || 'NO DRAW'
      }));

      w.hiddenNodes = (cfg.hiddenNodes || []).map((hn) => ({
        x: hn.x, y: hn.y, r: hn.r || 16,
        type: hn.type || 'alchemy',
        label: hn.label || 'STAR NODE',
        targetX: hn.targetX != null ? hn.targetX : null,
        targetY: hn.targetY != null ? hn.targetY : null
      }));

      w.decorations = (cfg.decorations || []).slice();
      w.bgTheme = cfg.bgTheme || 'default';
      w.title = cfg.title || '';
      w.objectiveText = cfg.objectiveText || '';

      this.world = w;
      this.isDrawing = false;
      this.activeStroke = [];
      this._accum = 0;
      if (typeof cfg.onInit === 'function') {
        cfg.onInit(this.world);
      }
    }

    restart() {
      if (!this.stageConfig) return;
      this._buildWorldFromStage(this.stageConfig);
      this.restartFlash = 0.26; // crisp <0.5s instant restart feedback
      if (this.opts.audio) this.opts.audio.playRestart();
      if (typeof this.opts.onRestart === 'function') this.opts.onRestart(this.world);
      this._emitState();
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.paused = false;
      this._lastTime = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min(0.05, Math.max(0, (now - this._lastTime) / 1000));
        this._lastTime = now;
        if (!this.paused) {
          this._accum += dt;
          while (this._accum >= FIXED_DT) {
            this.step(FIXED_DT);
            this._accum -= FIXED_DT;
          }
          if (this.restartFlash > 0) this.restartFlash = Math.max(0, this.restartFlash - dt);
        }
        this.render();
        this._rafId = requestAnimationFrame(loop);
      };
      this._rafId = requestAnimationFrame(loop);
    }

    stop() {
      this.running = false;
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
    }

    destroy() {
      this.stop();
      if (this.canvas) {
        this.canvas.removeEventListener('pointerdown', this._boundPointerDown);
        global.removeEventListener('pointermove', this._boundPointerMove);
        global.removeEventListener('pointerup', this._boundPointerUp);
        global.removeEventListener('pointercancel', this._boundPointerUp);
        global.removeEventListener('keydown', this._boundKeyDown);
      }
    }

    _bindEvents() {
      this.canvas.style.touchAction = 'none';
      this.canvas.addEventListener('pointerdown', this._boundPointerDown);
      global.addEventListener('pointermove', this._boundPointerMove);
      global.addEventListener('pointerup', this._boundPointerUp);
      global.addEventListener('pointercancel', this._boundPointerUp);
      global.addEventListener('keydown', this._boundKeyDown);
    }

    _getCanvasPoint(e) {
      const rect = this.canvas.getBoundingClientRect();
      const sx = this.canvas.width / Math.max(1, rect.width);
      const sy = this.canvas.height / Math.max(1, rect.height);
      return {
        x: clamp((e.clientX - rect.left) * sx, 2, this.canvas.width - 2),
        y: clamp((e.clientY - rect.top) * sy, 2, this.canvas.height - 2)
      };
    }

    _isPointBlockedForDraw(x, y) {
      const w = this.world;
      // Check noDrawZones
      for (let i = 0; i < w.noDrawZones.length; i++) {
        if (pointInRect(x, y, w.noDrawZones[i])) return true;
      }
      // Avoid drawing right inside static rects or balls
      for (let i = 0; i < w.walls.length; i++) {
        const wl = w.walls[i];
        if (wl.type === 'rect' && !wl.angle && pointInRect(x, y, wl)) return true;
      }
      for (let i = 0; i < w.balls.length; i++) {
        const b = w.balls[i];
        if (distSq(x, y, b.x, b.y) < (b.r + 3) * (b.r + 3)) return true;
      }
      return false;
    }

    _onPointerDown(e) {
      if (this.paused || this.world.status !== 'playing') return;
      if (e.button != null && e.button !== 0) return;
      if (this.world.inkUsed >= this.world.inkMax) return;
      if (this.opts.audio) this.opts.audio.init();
      const pt = this._getCanvasPoint(e);
      if (this._isPointBlockedForDraw(pt.x, pt.y)) return;
      this.isDrawing = true;
      this.activeStroke = [pt];
      if (this.canvas.setPointerCapture && e.pointerId != null) {
        try { this.canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
    }

    _onPointerMove(e) {
      if (!this.isDrawing || this.paused || this.world.status !== 'playing') return;
      const pt = this._getCanvasPoint(e);
      const last = this.activeStroke[this.activeStroke.length - 1];
      const dx = pt.x - last.x;
      const dy = pt.y - last.y;
      const d = Math.hypot(dx, dy);
      if (d < 8) return;

      const remaining = this.world.inkMax - this.world.inkUsed;
      if (remaining <= 1) {
        this._finishStroke();
        return;
      }

      // Subdivide fast pointer jumps so strokes stay smooth and never skip over walls
      const steps = Math.max(1, Math.ceil(d / 12));
      for (let s = 1; s <= steps; s++) {
        const nx = last.x + (dx * s) / steps;
        const ny = last.y + (dy * s) / steps;
        if (this._isPointBlockedForDraw(nx, ny)) break;
        const prev = this.activeStroke[this.activeStroke.length - 1];
        const segLen = Math.hypot(nx - prev.x, ny - prev.y);
        if (this.world.inkUsed + segLen > this.world.inkMax) {
          const ratio = Math.max(0, (this.world.inkMax - this.world.inkUsed) / Math.max(1e-5, segLen));
          if (ratio > 0.15) {
            this.activeStroke.push({ x: prev.x + (nx - prev.x) * ratio, y: prev.y + (ny - prev.y) * ratio });
            this.world.inkUsed = this.world.inkMax;
          }
          this._finishStroke();
          return;
        }
        this.activeStroke.push({ x: nx, y: ny });
        this.world.inkUsed += segLen;
      }

      if (this.opts.audio) this.opts.audio.playDrawScratch(d / 14);
      this._emitState();
    }

    _onPointerUp() {
      if (!this.isDrawing) return;
      this._finishStroke();
    }

    _onKeyDown(e) {
      if (!this.running) return;
      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Ignore if user is typing inside an input
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        this.restart();
      }
    }

    _finishStroke() {
      this.isDrawing = false;
      const pts = this.activeStroke;
      this.activeStroke = [];
      if (!pts || pts.length === 0) return;

      const mod = this.characterModifier;
      const segR = Math.max(3, (mod.lineWidth || 6) * 0.5);

      // Single click / tap -> create a compact 8-bit weighted block pebble (Q REMASTERED staple!)
      let rawSegs = [];
      if (pts.length === 1) {
        const cost = 14;
        if (this.world.inkUsed + cost > this.world.inkMax) return;
        this.world.inkUsed = Math.min(this.world.inkMax, this.world.inkUsed + cost);
        rawSegs.push({ ax: pts[0].x - 5, ay: pts[0].y, bx: pts[0].x + 5, by: pts[0].y });
      } else {
        for (let i = 0; i < pts.length - 1; i++) {
          if (distSq(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) >= 4) {
            rawSegs.push({ ax: pts[i].x, ay: pts[i].y, bx: pts[i + 1].x, by: pts[i + 1].y });
          }
        }
      }
      if (rawSegs.length === 0) return;

      // Compute Center of Mass (weighted by segment length)
      let totalLen = 0;
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < rawSegs.length; i++) {
        const s = rawSegs[i];
        const l = Math.max(2, Math.hypot(s.bx - s.ax, s.by - s.ay));
        totalLen += l;
        cx += ((s.ax + s.bx) * 0.5) * l;
        cy += ((s.ay + s.by) * 0.5) * l;
      }
      cx /= totalLen;
      cy /= totalLen;

      // Convert segments into local body coordinates & compute Moment of Inertia
      const density = mod.density != null ? mod.density : 1.0;
      const mass = Math.max(0.75, totalLen * 0.042 * density);
      const localSegs = [];
      const localPts = [];
      let inertia = 0;
      let maxBoundR = segR;

      for (let i = 0; i < rawSegs.length; i++) {
        const s = rawSegs[i];
        const ax = s.ax - cx;
        const ay = s.ay - cy;
        const bx = s.bx - cx;
        const by = s.by - cy;
        const l = Math.max(2, Math.hypot(bx - ax, by - ay));
        const mx = (ax + bx) * 0.5;
        const my = (ay + by) * 0.5;
        const segMass = mass * (l / totalLen);
        inertia += segMass * ((l * l) / 12 + mx * mx + my * my);
        localSegs.push({ ax: ax, ay: ay, bx: bx, by: by, r: segR });
        maxBoundR = Math.max(maxBoundR, Math.hypot(ax, ay) + segR, Math.hypot(bx, by) + segR);
        if (i === 0) localPts.push({ x: ax, y: ay });
        localPts.push({ x: bx, y: by });
      }
      inertia = Math.max(inertia, mass * 36);

      const body = {
        id: 'stroke_' + (++this.world.strokeCount),
        x: cx, y: cy,
        vx: 0, vy: 0,
        angle: 0, omega: 0,
        mass: mass,
        invMass: 1 / mass,
        inertia: inertia,
        invInertia: 1 / inertia,
        restitution: mod.restitution != null ? mod.restitution : 0.28,
        friction: mod.friction != null ? mod.friction : 0.45,
        buoyancy: mod.buoyancy != null ? mod.buoyancy : 0.0,
        windSensitivity: mod.windSensitivity != null ? mod.windSensitivity : 0.65,
        angularDamping: mod.angularDamping != null ? mod.angularDamping : 0.992,
        linearDamping: mod.linearDamping != null ? mod.linearDamping : 0.9985,
        bounceBoost: mod.bounceBoost != null ? mod.bounceBoost : 0,
        gearCoupling: mod.gearCoupling != null ? mod.gearCoupling : 1.0,
        color: mod.strokeColor || '#eef6ff',
        outline: mod.strokeOutline || '#1d2b53',
        lineWidth: mod.lineWidth || 6,
        segR: segR,
        boundR: maxBoundR,
        localSegs: localSegs,
        localPts: localPts
      };

      this.world.drawnBodies.push(body);
      if (this.opts.audio) this.opts.audio.playDrawDrop();
      this._emitState();
    }

    // ---- Wind & Gravity Helpers ----
    getWindFactor(wf, t) {
      if (!wf.period || wf.period <= 0) return 1.0;
      const cyc = ((t + (wf.phase || 0)) % wf.period) / wf.period;
      if (cyc < wf.duty) {
        // Smooth ramp-in / ramp-out inside gust window
        const u = cyc / Math.max(0.01, wf.duty);
        return Math.sin(u * Math.PI);
      }
      return 0;
    }

    _getGravityAt(x, y) {
      const zones = this.world.gravityZones;
      for (let i = 0; i < zones.length; i++) {
        if (pointInRect(x, y, zones[i])) {
          return { x: zones[i].gx, y: zones[i].gy };
        }
      }
      return this.world.gravity;
    }

    _getWindForceAt(x, y, t) {
      let fx = 0;
      let fy = 0;
      const fields = this.world.windFields;
      for (let i = 0; i < fields.length; i++) {
        const wf = fields[i];
        if (pointInRect(x, y, wf)) {
          const fac = this.getWindFactor(wf, t);
          if (fac > 0.01) {
            fx += wf.fx * fac;
            fy += wf.fy * fac;
          }
        }
      }
      return { x: fx, y: fy };
    }

    // Trajectory predictor for Vision Overlays (Gemini 3 / Gemini 4 / Inkling)
    predictTrajectory(ball, steps, dtStep) {
      const n = steps || 36;
      const dt = dtStep || (1 / 30);
      let x = ball.x;
      let y = ball.y;
      let vx = ball.vx;
      let vy = ball.vy;
      let t = this.world.time;
      const pts = [{ x: x, y: y }];
      for (let i = 0; i < n; i++) {
        const g = ball.noGravity ? { x: 0, y: 0 } : this._getGravityAt(x, y);
        const wf = this._getWindForceAt(x, y, t);
        vx += (g.x + wf.x * ball.invMass) * dt;
        vy += (g.y + wf.y * ball.invMass) * dt;
        x += vx * dt;
        y += vy * dt;
        t += dt;
        pts.push({ x: x, y: y });
        if (x < 0 || x > this.world.width || y > this.world.height + 60) break;
      }
      return pts;
    }

    // ---- Core Sub-Stepped Physics Simulation ----
    step(dt) {
      const w = this.world;
      w.time += dt;

      // Update bumper flashes & particles
      for (let i = 0; i < w.bumpers.length; i++) {
        if (w.bumpers[i].flash > 0) w.bumpers[i].flash = Math.max(0, w.bumpers[i].flash - dt * 4);
      }
      for (let i = w.particles.length - 1; i >= 0; i--) {
        const p = w.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) w.particles.splice(i, 1);
      }

      if (w.status !== 'playing') return;

      // Custom ball AI updates & stage-level step hook
      for (let i = 0; i < w.balls.length; i++) {
        if (w.balls[i].aiUpdate) w.balls[i].aiUpdate(w.balls[i], w, dt);
      }
      if (this.stageConfig && typeof this.stageConfig.onStep === 'function') {
        this.stageConfig.onStep(w, dt);
      }

      const subDt = dt / SUBSTEPS;
      for (let s = 0; s < SUBSTEPS; s++) {
        this._subStep(subDt);
      }

      // Goal zone checks & custom stage predicates
      this._updateGoalsAndWinState(dt);
    }

    _subStep(dt) {
      const w = this.world;

      // 1. Rotate gears (with smooth angular velocity recovery after wedge braking)
      for (let i = 0; i < w.gears.length; i++) {
        const g = w.gears[i];
        const targetOmega = g.baseOmega != null ? g.baseOmega : g.omega;
        g.omega += (targetOmega - g.omega) * Math.min(1, dt * 6.5);
        g.jamAmount = Math.abs(targetOmega) > 0.05
          ? clamp(1 - Math.abs(g.omega) / Math.abs(targetOmega), 0, 1)
          : 0;
        g.angle += g.omega * dt;
      }

      // 1b. Integrate Pivoted Balance Beams
      for (let i = 0; i < w.balanceBeams.length; i++) {
        const bm = w.balanceBeams[i];
        bm.omega += (-bm.springK * bm.angle) * dt;
        bm.omega *= Math.pow(bm.damping, dt * 60);
        bm.omega = clamp(bm.omega, -bm.maxOmega, bm.maxOmega);
        bm.angle += bm.omega * dt;
        if (bm.angle > bm.maxAngle) { bm.angle = bm.maxAngle; if (bm.omega > 0) bm.omega = 0; }
        if (bm.angle < -bm.maxAngle) { bm.angle = -bm.maxAngle; if (bm.omega < 0) bm.omega = 0; }
      }

      // 2. Integrate Balls
      for (let i = 0; i < w.balls.length; i++) {
        const b = w.balls[i];
        if (b.invMass === 0) continue;
        const g = b.noGravity ? { x: 0, y: 0 } : this._getGravityAt(b.x, b.y);
        const wf = this._getWindForceAt(b.x, b.y, w.time);
        const buoy = b.buoyancy || 0;
        const driftForceX = b.driftX ? Math.sin(w.time * (b.driftFreq || 1.2)) * b.driftX : 0;
        const bWind = b.windSensitivity != null ? b.windSensitivity : 1.0;
        b.vx += (g.x + (wf.x * bWind + driftForceX) * b.invMass) * dt;
        b.vy += (g.y * (1 - buoy) + wf.y * bWind * b.invMass) * dt;
        // Mild air drag
        b.vx *= 0.9992;
        b.vy *= 0.9992;
        b.omega *= 0.996;
        // Speed clamp for anti-tunneling
        const spdLimit = Math.min(MAX_SPEED, b.maxSpeed || MAX_SPEED);
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > spdLimit) {
          b.vx = (b.vx / spd) * spdLimit;
          b.vy = (b.vy / spd) * spdLimit;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += b.omega * dt;
      }

      // 3. Integrate Drawn Rigid Bodies
      for (let i = 0; i < w.drawnBodies.length; i++) {
        const body = w.drawnBodies[i];
        const g = this._getGravityAt(body.x, body.y);
        const wf = this._getWindForceAt(body.x, body.y, w.time);
        const buoy = body.buoyancy || 0;
        const windSens = body.windSensitivity != null ? body.windSensitivity : 0.65;
        const linDamp = body.linearDamping != null ? body.linearDamping : 0.9985;
        const angDamp = body.angularDamping != null ? body.angularDamping : 0.992;
        body.vx += (g.x + wf.x * body.invMass * windSens) * dt;
        body.vy += (g.y * (1 - buoy) + wf.y * body.invMass * windSens) * dt;
        body.vx *= linDamp;
        body.vy *= linDamp;
        body.omega = clamp(body.omega * angDamp, -MAX_OMEGA, MAX_OMEGA);

        const spd = Math.hypot(body.vx, body.vy);
        if (spd > MAX_SPEED) {
          body.vx = (body.vx / spd) * MAX_SPEED;
          body.vy = (body.vy / spd) * MAX_SPEED;
        }
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.angle += body.omega * dt;
      }

      // 4. Collisions: Balls vs Walls, BalanceBeams, Bumpers, Gears, Balls
      for (let i = 0; i < w.balls.length; i++) {
        const b = w.balls[i];
        this._collideBallWalls(b);
        this._collideBallBalanceBeams(b);
        this._collideBallBumpers(b);
        this._collideBallGears(b);
        for (let j = i + 1; j < w.balls.length; j++) {
          this._collideBallBall(b, w.balls[j]);
        }
      }

      // 5. Collisions: DrawnBodies vs Walls, BalanceBeams, Bumpers, Gears, Balls, DrawnBodies
      for (let i = 0; i < w.drawnBodies.length; i++) {
        const body = w.drawnBodies[i];
        this._collideBodyWalls(body);
        this._collideBodyBalanceBeams(body);
        this._collideBodyBumpers(body);
        this._collideBodyGears(body);
        for (let j = 0; j < w.balls.length; j++) {
          this._collideBallDrawnBody(w.balls[j], body);
        }
        for (let k = i + 1; k < w.drawnBodies.length; k++) {
          this._collideBodyBody(body, w.drawnBodies[k]);
        }
      }

      // 6. Second anti-tunneling static clamp pass so heavy drawn strokes never push balls through thin walls
      for (let i = 0; i < w.balls.length; i++) {
        this._collideBallWalls(w.balls[i]);
        this._collideBallBalanceBeams(w.balls[i]);
      }
    }

    // ---- Impulse Solvers ----
    _applyPointImpulseToBody(body, rx, ry, jx, jy) {
      body.vx += jx * body.invMass;
      body.vy += jy * body.invMass;
      body.omega = clamp(body.omega + (rx * jy - ry * jx) * body.invInertia, -MAX_OMEGA, MAX_OMEGA);
    }

    _resolveBallStaticContact(b, nx, ny, pen, rest, fric, surfVx, surfVy) {
      if (pen <= 0 || b.invMass === 0) return;
      // Positional correction
      b.x += nx * pen * 0.85;
      b.y += ny * pen * 0.85;

      const rvx = b.vx - (surfVx || 0);
      const rvy = b.vy - (surfVy || 0);
      const vn = rvx * nx + rvy * ny;
      if (vn < 0) {
        const e = Math.abs(vn) < 42 ? 0 : Math.max(b.restitution, rest);
        const jn = -(1 + e) * vn;
        b.vx += nx * jn;
        b.vy += ny * jn;

        // Tangent friction + rolling spin
        const tx = -ny;
        const ty = nx;
        const vt = rvx * tx + rvy * ty - b.omega * b.r;
        const mu = (b.friction + fric) * 0.5;
        const jt = clamp(-vt * 0.45, -mu * Math.abs(jn), mu * Math.abs(jn));
        b.vx += tx * jt;
        b.vy += ty * jt;
        b.omega -= (jt / Math.max(8, b.r)) * 1.1;

        this._registerBallBounce(b, -vn, false);
        if (-vn > 110 && this.opts.audio) {
          this.opts.audio.playBounce(Math.min(1, -vn / 480));
        }
      }
    }

    _registerBallBounce(b, speedImpact, fromDrawn) {
      if (speedImpact < 68) return;
      const now = this.world.time;
      if (now - (b.lastBounceTime || -1) < 0.085) return;
      b.lastBounceTime = now;
      b.bounceCount = (b.bounceCount || 0) + 1;
      if (fromDrawn) {
        b.drawnBounceCount = (b.drawnBounceCount || 0) + 1;
      }
      if (this.stageConfig && typeof this.stageConfig.onBallBounce === 'function') {
        this.stageConfig.onBallBounce(b, this.world, !!fromDrawn, speedImpact);
      }
    }

    _collideBallBalanceBeams(b) {
      const beams = this.world.balanceBeams;
      if (!beams || beams.length === 0) return;
      for (let i = 0; i < beams.length; i++) {
        const bm = beams[i];
        const c = Math.cos(-bm.angle);
        const s = Math.sin(-bm.angle);
        const relX = b.x - bm.x;
        const relY = b.y - bm.y;
        const lx = relX * c - relY * s;
        const ly = relX * s + relY * c;

        // Build local sub-rects: main plank + optional left/right raised rims
        const parts = [{ cx: 0, cy: 0, hw: bm.halfLen, hh: bm.thickness * 0.5 }];
        if (bm.rimH > 0) {
          const rimW = 6;
          parts.push({ cx: -bm.halfLen + rimW * 0.5, cy: -bm.thickness * 0.5 - bm.rimH * 0.5, hw: rimW * 0.5, hh: bm.rimH * 0.5 });
          parts.push({ cx: bm.halfLen - rimW * 0.5, cy: -bm.thickness * 0.5 - bm.rimH * 0.5, hw: rimW * 0.5, hh: bm.rimH * 0.5 });
        }

        const c2 = Math.cos(bm.angle);
        const s2 = Math.sin(bm.angle);
        for (let p = 0; p < parts.length; p++) {
          const pr = parts[p];
          const clx = clamp(lx - pr.cx, -pr.hw, pr.hw) + pr.cx;
          const cly = clamp(ly - pr.cy, -pr.hh, pr.hh) + pr.cy;
          const dx = lx - clx;
          const dy = ly - cly;
          const d = Math.hypot(dx, dy);
          if (d < b.r) {
            let lnx, lny, pen;
            if (d > 1e-6) { lnx = dx / d; lny = dy / d; pen = b.r - d; }
            else { lnx = 0; lny = -1; pen = b.r + pr.hh; }
            const nx = lnx * c2 - lny * s2;
            const ny = lnx * s2 + lny * c2;
            const wx = bm.x + clx * c2 - cly * s2;
            const wy = bm.y + clx * s2 + cly * c2;
            const rx = wx - bm.x;
            const ry = wy - bm.y;
            const lm = bm.launchMultiplier || 1.0;
            const surfVx = -bm.omega * ry * lm;
            const surfVy = bm.omega * rx * lm;
            const preVn = (b.vx - surfVx) * nx + (b.vy - surfVy) * ny;
            this._resolveBallStaticContact(b, nx, ny, pen, bm.restitution, bm.friction, surfVx, surfVy);
            // Apply weight + impact torque to beam
            const impactForce = preVn < 0 ? Math.min(350, -preVn * b.mass * 1.4) : 0;
            const gravityTorque = rx * (b.mass * 18);
            const impactTorque = (rx * (-ny) - ry * (-nx)) * impactForce;
            bm.omega = clamp(bm.omega + (gravityTorque + impactTorque) / bm.inertia, -bm.maxOmega, bm.maxOmega);
          }
        }
      }
    }

    _collideBodyBalanceBeams(body) {
      const beams = this.world.balanceBeams;
      if (!beams || beams.length === 0) return;
      const cb = Math.cos(body.angle);
      const sb = Math.sin(body.angle);
      for (let i = 0; i < beams.length; i++) {
        const bm = beams[i];
        const reach = bm.halfLen + bm.rimH + body.boundR + 12;
        if (distSq(bm.x, bm.y, body.x, body.y) > reach * reach) continue;
        const c = Math.cos(-bm.angle);
        const s = Math.sin(-bm.angle);
        const c2 = Math.cos(bm.angle);
        const s2 = Math.sin(bm.angle);
        const hw = bm.halfLen;
        const hh = bm.thickness * 0.5;
        for (let p = 0; p < body.localPts.length; p++) {
          const lp = body.localPts[p];
          const wx = body.x + lp.x * cb - lp.y * sb;
          const wy = body.y + lp.x * sb + lp.y * cb;
          const relX = wx - bm.x;
          const relY = wy - bm.y;
          const lx = relX * c - relY * s;
          const ly = relX * s + relY * c;
          const clx = clamp(lx, -hw, hw);
          const cly = clamp(ly, -hh, hh);
          const dx = lx - clx;
          const dy = ly - cly;
          const d = Math.hypot(dx, dy);
          if (d < body.segR && d > 1e-6) {
            const lnx = dx / d;
            const lny = dy / d;
            const nx = lnx * c2 - lny * s2;
            const ny = lnx * s2 + lny * c2;
            const rx = wx - bm.x;
            const ry = wy - bm.y;
            const surfVx = -bm.omega * ry;
            const surfVy = bm.omega * rx;
            this._resolveBodyStaticPoint(body, wx, wy, nx, ny, body.segR - d, bm.restitution, bm.friction, surfVx, surfVy);
            // Drawn stroke supports or pushes the beam!
            const pushTorque = (rx * (-ny) - ry * (-nx)) * Math.min(480, body.mass * 68);
            bm.omega = clamp(bm.omega + pushTorque / bm.inertia, -bm.maxOmega, bm.maxOmega);
          }
        }
      }
    }

    _collideBallWalls(b) {
      const walls = this.world.walls;
      for (let i = 0; i < walls.length; i++) {
        const wl = walls[i];
        if (wl.type === 'segment') {
          const cp = closestPointOnSegment(b.x, b.y, wl.x1, wl.y1, wl.x2, wl.y2);
          const dx = b.x - cp.x;
          const dy = b.y - cp.y;
          const d = Math.hypot(dx, dy);
          const minD = b.r + wl.r;
          if (d < minD && d > 1e-6) {
            this._resolveBallStaticContact(b, dx / d, dy / d, minD - d, wl.restitution, wl.friction, 0, 0);
          }
        } else {
          // Rect (supports rotated OBB too!)
          const cx = wl.x + wl.w * 0.5;
          const cy = wl.y + wl.h * 0.5;
          const hw = wl.w * 0.5;
          const hh = wl.h * 0.5;
          const ang = wl.angle || 0;
          const c = Math.cos(-ang);
          const s = Math.sin(-ang);
          const relX = b.x - cx;
          const relY = b.y - cy;
          const lx = relX * c - relY * s;
          const ly = relX * s + relY * c;

          const clx = clamp(lx, -hw, hw);
          const cly = clamp(ly, -hh, hh);
          const dx = lx - clx;
          const dy = ly - cly;
          const d = Math.hypot(dx, dy);

          if (d < b.r) {
            let lnx, lny, pen;
            if (d > 1e-6) {
              lnx = dx / d;
              lny = dy / d;
              pen = b.r - d;
            } else {
              const ox = hw - Math.abs(lx);
              const oy = hh - Math.abs(ly);
              if (ox < oy) { lnx = lx >= 0 ? 1 : -1; lny = 0; pen = ox + b.r; }
              else { lnx = 0; lny = ly >= 0 ? 1 : -1; pen = oy + b.r; }
            }
            const c2 = Math.cos(ang);
            const s2 = Math.sin(ang);
            const nx = lnx * c2 - lny * s2;
            const ny = lnx * s2 + lny * c2;
            this._resolveBallStaticContact(b, nx, ny, pen, wl.restitution, wl.friction, 0, 0);
          }
        }
      }
    }

    _collideBallBumpers(b) {
      const bumpers = this.world.bumpers;
      for (let i = 0; i < bumpers.length; i++) {
        const bp = bumpers[i];
        const dx = b.x - bp.x;
        const dy = b.y - bp.y;
        const d = Math.hypot(dx, dy);
        const minD = b.r + bp.r;
        if (d < minD && d > 1e-6) {
          const nx = dx / d;
          const ny = dy / d;
          b.x += nx * (minD - d + 0.5);
          b.y += ny * (minD - d + 0.5);
          const vn = b.vx * nx + b.vy * ny;
          if (vn < 0) {
            const jn = -(1 + bp.restitution) * vn + bp.boost;
            b.vx += nx * jn;
            b.vy += ny * jn;
          } else {
            b.vx += nx * bp.boost * 0.5;
            b.vy += ny * bp.boost * 0.5;
          }
          bp.flash = 1.0;
          this._registerBallBounce(b, Math.max(150, -vn), true);
          this._spawnSparks(bp.x + nx * bp.r, bp.y + ny * bp.r, bp.color, 6);
          if (this.opts.audio) this.opts.audio.playBumperHit();
        }
      }
    }

    _collideBallGears(b) {
      const gears = this.world.gears;
      for (let i = 0; i < gears.length; i++) {
        const g = gears[i];
        const maxReach = g.r + g.toothLen + g.toothR + b.r;
        if (distSq(b.x, b.y, g.x, g.y) > maxReach * maxReach) continue;

        // Hub collision
        const dx = b.x - g.x;
        const dy = b.y - g.y;
        const d = Math.hypot(dx, dy);
        if (d < b.r + g.r && d > 1e-6) {
          const nx = dx / d;
          const ny = dy / d;
          const surfVx = -g.omega * (ny * g.r);
          const surfVy = g.omega * (nx * g.r);
          this._resolveBallStaticContact(b, nx, ny, b.r + g.r - d, 0.35, 0.65, surfVx, surfVy);
        }

        // Gear teeth collisions
        for (let t = 0; t < g.teeth; t++) {
          const a = g.angle + (t / g.teeth) * Math.PI * 2;
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          const tx = g.x + ca * (g.r + g.toothLen * 0.65);
          const ty = g.y + sa * (g.r + g.toothLen * 0.65);
          const tdx = b.x - tx;
          const tdy = b.y - ty;
          const td = Math.hypot(tdx, tdy);
          const minTD = b.r + g.toothR;
          if (td < minTD && td > 1e-6) {
            const nx = tdx / td;
            const ny = tdy / td;
            const rx = tx - g.x;
            const ry = ty - g.y;
            const surfVx = -g.omega * ry;
            const surfVy = g.omega * rx;
            this._resolveBallStaticContact(b, nx, ny, minTD - td, 0.38, 0.72, surfVx, surfVy);
          }
        }
      }
    }

    _collideBallBall(a, b) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      const minD = a.r + b.r;
      if (d >= minD || d < 1e-6) return;
      const nx = dx / d;
      const ny = dy / d;
      const invSum = a.invMass + b.invMass;
      if (invSum <= 0) return;

      const pen = minD - d;
      a.x -= nx * pen * (a.invMass / invSum);
      a.y -= ny * pen * (a.invMass / invSum);
      b.x += nx * pen * (b.invMass / invSum);
      b.y += ny * pen * (b.invMass / invSum);

      const rvx = b.vx - a.vx;
      const rvy = b.vy - a.vy;
      const vn = rvx * nx + rvy * ny;
      if (vn < 0) {
        const e = Math.min(a.restitution, b.restitution);
        const j = -(1 + e) * vn / invSum;
        a.vx -= nx * j * a.invMass;
        a.vy -= ny * j * a.invMass;
        b.vx += nx * j * b.invMass;
        b.vy += ny * j * b.invMass;
        if (-vn > 90 && this.opts.audio) this.opts.audio.playBounce(Math.min(1, -vn / 420));
      }
    }

    _collideBallDrawnBody(ball, body) {
      const dxB = ball.x - body.x;
      const dyB = ball.y - body.y;
      const reach = ball.r + body.boundR;
      if (dxB * dxB + dyB * dyB > reach * reach) return;

      const c = Math.cos(body.angle);
      const s = Math.sin(body.angle);

      for (let i = 0; i < body.localSegs.length; i++) {
        const seg = body.localSegs[i];
        const ax = body.x + seg.ax * c - seg.ay * s;
        const ay = body.y + seg.ax * s + seg.ay * c;
        const bx = body.x + seg.bx * c - seg.by * s;
        const by = body.y + seg.bx * s + seg.by * c;

        const cp = closestPointOnSegment(ball.x, ball.y, ax, ay, bx, by);
        const dx = ball.x - cp.x;
        const dy = ball.y - cp.y;
        const d = Math.hypot(dx, dy);
        const minD = ball.r + seg.r;

        if (d < minD && d > 1e-6) {
          const nx = dx / d;
          const ny = dy / d;
          const pen = minD - d;
          const rx = cp.x - body.x;
          const ry = cp.y - body.y;
          const rn = rx * ny - ry * nx;

          const denom = ball.invMass + body.invMass + rn * rn * body.invInertia;
          if (denom <= 1e-8) continue;

          // Separate positions proportionally
          const corr = pen * 0.82;
          const totalInv = ball.invMass + body.invMass;
          if (totalInv > 0) {
            ball.x += nx * corr * (ball.invMass / totalInv);
            ball.y += ny * corr * (ball.invMass / totalInv);
            body.x -= nx * corr * (body.invMass / totalInv);
            body.y -= ny * corr * (body.invMass / totalInv);
          }

          // Contact velocity on rigid body at cp
          const bvx = body.vx - body.omega * ry;
          const bvy = body.vy + body.omega * rx;
          const rvx = ball.vx - bvx;
          const rvy = ball.vy - bvy;
          const vn = rvx * nx + rvy * ny;

          if (vn < 0) {
            const e = Math.abs(vn) < 35 ? 0 : Math.max(ball.restitution, body.restitution);
            const jn = -(1 + e) * vn / denom;
            const boost = (body.bounceBoost && -vn > 45) ? body.bounceBoost : 0;
            ball.vx += nx * (jn * ball.invMass + boost);
            ball.vy += ny * (jn * ball.invMass + boost);
            this._applyPointImpulseToBody(body, rx, ry, -nx * jn, -ny * jn);

            // Tangential friction
            const tx = -ny;
            const ty = nx;
            const vt = rvx * tx + rvy * ty - ball.omega * ball.r;
            const rt = rx * ty - ry * tx;
            const tDenom = ball.invMass + body.invMass + rt * rt * body.invInertia;
            const mu = (ball.friction + body.friction) * 0.5;
            const jt = clamp(-vt / Math.max(1e-6, tDenom), -mu * Math.abs(jn), mu * Math.abs(jn));
            ball.vx += tx * jt * ball.invMass;
            ball.vy += ty * jt * ball.invMass;
            ball.omega -= (jt * ball.invMass / Math.max(8, ball.r)) * 0.8;
            this._applyPointImpulseToBody(body, rx, ry, -tx * jt, -ty * jt);

            this._registerBallBounce(ball, -vn, true);
            if (-vn > 120 && this.opts.audio) {
              this.opts.audio.playBounce(Math.min(1, -vn / 520));
            }
          }
        }
      }
    }

    _resolveBodyStaticPoint(body, wx, wy, nx, ny, pen, rest, fric, surfVx, surfVy) {
      if (pen <= 0) return;
      body.x += nx * pen * 0.78;
      body.y += ny * pen * 0.78;

      const rx = wx - body.x;
      const ry = wy - body.y;
      const pvx = body.vx - body.omega * ry;
      const pvy = body.vy + body.omega * rx;
      const rvx = pvx - (surfVx || 0);
      const rvy = pvy - (surfVy || 0);
      const vn = rvx * nx + rvy * ny;

      if (vn < 0) {
        const rn = rx * ny - ry * nx;
        const denom = body.invMass + rn * rn * body.invInertia;
        const e = Math.abs(vn) < 38 ? 0 : Math.min(body.restitution, rest);
        const jn = -(1 + e) * vn / Math.max(1e-6, denom);
        this._applyPointImpulseToBody(body, rx, ry, nx * jn, ny * jn);

        // Friction
        const tx = -ny;
        const ty = nx;
        const vt = rvx * tx + rvy * ty;
        const rt = rx * ty - ry * tx;
        const tDenom = body.invMass + rt * rt * body.invInertia;
        const mu = (body.friction + fric) * 0.5;
        const jt = clamp(-vt / Math.max(1e-6, tDenom), -mu * Math.abs(jn), mu * Math.abs(jn));
        this._applyPointImpulseToBody(body, rx, ry, tx * jt, ty * jt);
      }
    }

    _collideBodyWalls(body) {
      const walls = this.world.walls;
      const c = Math.cos(body.angle);
      const s = Math.sin(body.angle);
      const r = body.segR;

      for (let p = 0; p < body.localPts.length; p++) {
        const lp = body.localPts[p];
        const wx = body.x + lp.x * c - lp.y * s;
        const wy = body.y + lp.x * s + lp.y * c;

        for (let i = 0; i < walls.length; i++) {
          const wl = walls[i];
          if (wl.type === 'segment') {
            const cp = closestPointOnSegment(wx, wy, wl.x1, wl.y1, wl.x2, wl.y2);
            const dx = wx - cp.x;
            const dy = wy - cp.y;
            const d = Math.hypot(dx, dy);
            const minD = r + wl.r;
            if (d < minD && d > 1e-6) {
              this._resolveBodyStaticPoint(body, wx, wy, dx / d, dy / d, minD - d, wl.restitution, wl.friction, 0, 0);
            }
          } else {
            const cx = wl.x + wl.w * 0.5;
            const cy = wl.y + wl.h * 0.5;
            const hw = wl.w * 0.5;
            const hh = wl.h * 0.5;
            const ang = wl.angle || 0;
            const wc = Math.cos(-ang);
            const ws = Math.sin(-ang);
            const relX = wx - cx;
            const relY = wy - cy;
            const lx = relX * wc - relY * ws;
            const ly = relX * ws + relY * wc;
            const clx = clamp(lx, -hw, hw);
            const cly = clamp(ly, -hh, hh);
            const dx = lx - clx;
            const dy = ly - cly;
            const d = Math.hypot(dx, dy);
            if (d < r) {
              let lnx, lny, pen;
              if (d > 1e-6) { lnx = dx / d; lny = dy / d; pen = r - d; }
              else {
                const ox = hw - Math.abs(lx);
                const oy = hh - Math.abs(ly);
                if (ox < oy) { lnx = lx >= 0 ? 1 : -1; lny = 0; pen = ox + r; }
                else { lnx = 0; lny = ly >= 0 ? 1 : -1; pen = oy + r; }
              }
              const wc2 = Math.cos(ang);
              const ws2 = Math.sin(ang);
              const nx = lnx * wc2 - lny * ws2;
              const ny = lnx * ws2 + lny * wc2;
              this._resolveBodyStaticPoint(body, wx, wy, nx, ny, pen, wl.restitution, wl.friction, 0, 0);
            }
          }
        }
      }
    }

    _collideBodyBumpers(body) {
      const bumpers = this.world.bumpers;
      if (bumpers.length === 0) return;
      const c = Math.cos(body.angle);
      const s = Math.sin(body.angle);
      for (let i = 0; i < bumpers.length; i++) {
        const bp = bumpers[i];
        const reach = bp.r + body.boundR;
        if (distSq(bp.x, bp.y, body.x, body.y) > reach * reach) continue;
        for (let p = 0; p < body.localPts.length; p++) {
          const lp = body.localPts[p];
          const wx = body.x + lp.x * c - lp.y * s;
          const wy = body.y + lp.x * s + lp.y * c;
          const dx = wx - bp.x;
          const dy = wy - bp.y;
          const d = Math.hypot(dx, dy);
          const minD = body.segR + bp.r;
          if (d < minD && d > 1e-6) {
            const nx = dx / d;
            const ny = dy / d;
            this._resolveBodyStaticPoint(body, wx, wy, nx, ny, minD - d, bp.restitution, 0.2, nx * bp.boost * 0.4, ny * bp.boost * 0.4);
            bp.flash = 1.0;
          }
        }
      }
    }

    _collideBodyGears(body) {
      const gears = this.world.gears;
      if (gears.length === 0) return;
      const c = Math.cos(body.angle);
      const s = Math.sin(body.angle);
      const coupling = body.gearCoupling != null ? body.gearCoupling : 1.0;
      for (let i = 0; i < gears.length; i++) {
        const g = gears[i];
        const reach = g.r + g.toothLen + g.toothR + body.boundR;
        if (distSq(g.x, g.y, body.x, body.y) > reach * reach) continue;
        let toothContact = false;
        for (let p = 0; p < body.localPts.length; p++) {
          const lp = body.localPts[p];
          const wx = body.x + lp.x * c - lp.y * s;
          const wy = body.y + lp.x * s + lp.y * c;

          // Gear hub collision (prevents drawn strokes clipping inside the brass hub)
          const hdx = wx - g.x;
          const hdy = wy - g.y;
          const hd = Math.hypot(hdx, hdy);
          const minHub = body.segR + g.r;
          if (hd < minHub && hd > 1e-6) {
            const surfVx = -g.omega * hdy * coupling;
            const surfVy = g.omega * hdx * coupling;
            this._resolveBodyStaticPoint(body, wx, wy, hdx / hd, hdy / hd, minHub - hd, 0.22, Math.min(0.95, 0.62 * coupling), surfVx, surfVy);
          }

          // Gear teeth meshing & wedge braking
          for (let t = 0; t < g.teeth; t++) {
            const a = g.angle + (t / g.teeth) * Math.PI * 2;
            const tx = g.x + Math.cos(a) * (g.r + g.toothLen * 0.65);
            const ty = g.y + Math.sin(a) * (g.r + g.toothLen * 0.65);
            const dx = wx - tx;
            const dy = wy - ty;
            const d = Math.hypot(dx, dy);
            const minD = body.segR + g.toothR;
            if (d < minD && d > 1e-6) {
              toothContact = true;
              const surfVx = -g.omega * (ty - g.y) * coupling;
              const surfVy = g.omega * (tx - g.x) * coupling;
              this._resolveBodyStaticPoint(body, wx, wy, dx / d, dy / d, minD - d, 0.25, Math.min(0.95, 0.6 * coupling), surfVx, surfVy);
              if (g.canJam) {
                const brake = clamp(1 - body.mass * coupling * 0.032, 0.72, 0.99);
                g.omega *= brake;
              }
            }
          }
        }
        if (toothContact && this.opts.audio && (this.world.time - (g.lastClickTime || -1) > 0.24)) {
          g.lastClickTime = this.world.time;
          this.opts.audio.playGearClick();
        }
      }
    }

    _collideBodyBody(a, b) {
      const reach = a.boundR + b.boundR;
      if (distSq(a.x, a.y, b.x, b.y) > reach * reach) return;
      this._testBodyPtsAgainstBodySegs(a, b);
      this._testBodyPtsAgainstBodySegs(b, a);
    }

    _testBodyPtsAgainstBodySegs(ptBody, segBody) {
      const ca = Math.cos(ptBody.angle);
      const sa = Math.sin(ptBody.angle);
      const cb = Math.cos(segBody.angle);
      const sb = Math.sin(segBody.angle);
      const minD = ptBody.segR + segBody.segR;
      const minDSq = minD * minD;

      for (let p = 0; p < ptBody.localPts.length; p++) {
        const lp = ptBody.localPts[p];
        const wx = ptBody.x + lp.x * ca - lp.y * sa;
        const wy = ptBody.y + lp.x * sa + lp.y * ca;

        for (let i = 0; i < segBody.localSegs.length; i++) {
          const seg = segBody.localSegs[i];
          const ax = segBody.x + seg.ax * cb - seg.ay * sb;
          const ay = segBody.y + seg.ax * sb + seg.ay * cb;
          const bx = segBody.x + seg.bx * cb - seg.by * sb;
          const by = segBody.y + seg.bx * sb + seg.by * cb;
          const cp = closestPointOnSegment(wx, wy, ax, ay, bx, by);
          const dx = wx - cp.x;
          const dy = wy - cp.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < minDSq && dSq > 1e-8) {
            const d = Math.sqrt(dSq);
            const nx = dx / d;
            const ny = dy / d;
            const pen = minD - d;

            const r1x = wx - ptBody.x;
            const r1y = wy - ptBody.y;
            const r2x = cp.x - segBody.x;
            const r2y = cp.y - segBody.y;
            const rn1 = r1x * ny - r1y * nx;
            const rn2 = r2x * ny - r2y * nx;
            const denom = ptBody.invMass + segBody.invMass + rn1 * rn1 * ptBody.invInertia + rn2 * rn2 * segBody.invInertia;
            if (denom <= 1e-8) continue;

            const invSum = ptBody.invMass + segBody.invMass;
            const corr = pen * 0.65;
            ptBody.x += nx * corr * (ptBody.invMass / invSum);
            ptBody.y += ny * corr * (ptBody.invMass / invSum);
            segBody.x -= nx * corr * (segBody.invMass / invSum);
            segBody.y -= ny * corr * (segBody.invMass / invSum);

            const v1x = ptBody.vx - ptBody.omega * r1y;
            const v1y = ptBody.vy + ptBody.omega * r1x;
            const v2x = segBody.vx - segBody.omega * r2y;
            const v2y = segBody.vy + segBody.omega * r2x;
            const rvx = v1x - v2x;
            const rvy = v1y - v2y;
            const vn = rvx * nx + rvy * ny;
            if (vn < 0) {
              const e = Math.abs(vn) < 35 ? 0 : Math.min(ptBody.restitution, segBody.restitution);
              const jn = -(1 + e) * vn / denom;
              this._applyPointImpulseToBody(ptBody, r1x, r1y, nx * jn, ny * jn);
              this._applyPointImpulseToBody(segBody, r2x, r2y, -nx * jn, -ny * jn);
            }
          }
        }
      }
    }

    // ---- Goal Evaluation & Win/Fail Detection ----
    _updateGoalsAndWinState(dt) {
      const w = this.world;
      const cfg = this.stageConfig || {};

      // Reset per-frame ball inGoal flags
      for (let i = 0; i < w.balls.length; i++) w.balls[i].inGoal = false;

      let allGoalsDone = w.goals.length > 0;
      for (let g = 0; g < w.goals.length; g++) {
        const goal = w.goals[g];
        let count = 0;
        for (let i = 0; i < w.balls.length; i++) {
          const b = w.balls[i];
          if (!goal.acceptTags.includes(b.tag)) continue;
          let inside = false;
          if (goal.shape === 'circle') {
            inside = distSq(b.x, b.y, goal.x, goal.y) <= (goal.r + b.r * 0.35) * (goal.r + b.r * 0.35);
          } else {
            inside = b.x >= goal.x && b.x <= goal.x + goal.w && b.y >= goal.y && b.y <= goal.y + goal.h;
          }
          if (inside) {
            const spdOk = goal.maxSpeed == null || Math.hypot(b.vx, b.vy) <= goal.maxSpeed;
            b.inGoal = true;
            if (spdOk) count++;
          }
        }
        goal.currentCount = count;
        goal.conditionMet = typeof goal.condition === 'function' ? !!goal.condition(w, goal) : true;
        if (count >= goal.requiredCount && goal.conditionMet) {
          const prev = goal.timer;
          goal.timer = Math.min(goal.holdTime, goal.timer + dt);
          if (Math.floor(prev * 5) !== Math.floor(goal.timer * 5) && goal.timer < goal.holdTime && this.opts.audio) {
            this.opts.audio.playGoalTick(goal.timer / Math.max(0.01, goal.holdTime));
          }
          if (goal.timer >= goal.holdTime) goal.completed = true;
        } else {
          goal.timer = Math.max(0, goal.timer - dt * 1.6);
          goal.completed = false;
        }
        if (!goal.completed) allGoalsDone = false;
      }

      // Custom stage win predicate takes precedence if provided
      const won = typeof cfg.checkWin === 'function' ? !!cfg.checkWin(w) : allGoalsDone;
      if (won) {
        w.status = 'won';
        this._spawnSparks(w.width * 0.5, w.height * 0.4, '#ffd166', 24);
        if (this.opts.audio) this.opts.audio.playStageClear();
        this._emitState();
        if (typeof this.opts.onWin === 'function') this.opts.onWin(w);
        return;
      }

      // Check fail condition (custom or target fell deep out of arena)
      let failed = typeof cfg.checkFail === 'function' ? !!cfg.checkFail(w) : false;
      if (!failed && !cfg.allowFallOut) {
        for (let i = 0; i < w.balls.length; i++) {
          const b = w.balls[i];
          if (!b.isHazard && b.y > w.height + 90) {
            failed = true;
            break;
          }
        }
      }
      if (failed) {
        w.status = 'failed';
        if (this.opts.audio) this.opts.audio.playStageFail();
        this._emitState();
        if (typeof this.opts.onFail === 'function') this.opts.onFail(w);
      }
    }

    _spawnSparks(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 140;
        this.world.particles.push({
          x: x, y: y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          color: color || '#ffe066',
          size: 3 + Math.floor(Math.random() * 3),
          life: 0.35 + Math.random() * 0.35
        });
      }
    }

    _emitState() {
      if (typeof this.opts.onStateChange !== 'function') return;
      const w = this.world;
      const goalProg = w.goals.length
        ? w.goals.reduce((acc, g) => acc + (g.holdTime > 0 ? g.timer / g.holdTime : (g.completed ? 1 : 0)), 0) / w.goals.length
        : 0;
      this.opts.onStateChange({
        inkUsed: Math.round(w.inkUsed),
        inkMax: w.inkMax,
        inkRatio: Math.max(0, 1 - w.inkUsed / Math.max(1, w.inkMax)),
        strokes: w.strokeCount,
        elapsed: w.time,
        goalProgress: goalProg,
        status: w.status
      });
    }

    // ---- Crisp 8-bit Canvas Renderer ----
    render() {
      const ctx = this.ctx;
      if (!ctx) return;
      const w = this.world;
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      // 1. 8-bit Arena Background Grid
      ctx.fillStyle = '#0e152b';
      ctx.fillRect(0, 0, w.width, w.height);
      ctx.strokeStyle = 'rgba(110, 148, 214, 0.10)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= w.width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, w.height); ctx.stroke();
      }
      for (let y = 0; y <= w.height; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w.width, y + 0.5); ctx.stroke();
      }

      // 1b. Stage-specific background artwork hook
      if (this.stageConfig && typeof this.stageConfig.renderBehind === 'function') {
        ctx.save();
        this.stageConfig.renderBehind(ctx, w);
        ctx.restore();
      }

      // 2. Gravity Zones
      for (let i = 0; i < w.gravityZones.length; i++) {
        const gz = w.gravityZones[i];
        ctx.fillStyle = gz.color;
        ctx.fillRect(gz.x, gz.y, gz.w, gz.h);
        ctx.strokeStyle = gz.border;
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2;
        ctx.strokeRect(gz.x, gz.y, gz.w, gz.h);
        ctx.setLineDash([]);
        ctx.fillStyle = gz.border;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(gz.label, gz.x + 6, gz.y + 15);
      }

      // 3. Periodic Wind Fields
      for (let i = 0; i < w.windFields.length; i++) {
        const wf = w.windFields[i];
        const fac = this.getWindFactor(wf, w.time);
        ctx.fillStyle = fac > 0.05 ? 'rgba(80, 220, 255, ' + (0.08 + fac * 0.16).toFixed(2) + ')' : 'rgba(80, 160, 200, 0.05)';
        ctx.fillRect(wf.x, wf.y, wf.w, wf.h);
        ctx.strokeStyle = fac > 0.05 ? '#67e8f9' : 'rgba(103,232,249,0.35)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(wf.x, wf.y, wf.w, wf.h);

        // Animated 8-bit wind streaks
        if (fac > 0.05) {
          const dirX = wf.fx >= 0 ? 1 : -1;
          ctx.fillStyle = 'rgba(180, 248, 255, ' + (0.35 + fac * 0.5).toFixed(2) + ')';
          for (let k = 0; k < 6; k++) {
            const prog = ((w.time * 1.8 * dirX + k * 0.23) % 1 + 1) % 1;
            const sx = wf.x + prog * (wf.w - 22);
            const sy = wf.y + 16 + ((k * 37) % Math.max(16, wf.h - 28));
            ctx.fillRect(Math.round(sx), Math.round(sy), 18, 3);
          }
        }
        ctx.fillStyle = '#a5f3fc';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(wf.label + (fac > 0.05 ? ' >>' : ' ...'), wf.x + 6, wf.y + 14);
      }

      // 4. No-Draw Zones
      for (let i = 0; i < w.noDrawZones.length; i++) {
        const nd = w.noDrawZones[i];
        ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
        ctx.fillRect(nd.x, nd.y, nd.w, nd.h);
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.65)';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(nd.x, nd.y, nd.w, nd.h);
        ctx.setLineDash([]);
      }

      // 5. Goal Zones
      for (let i = 0; i < w.goals.length; i++) {
        const gl = w.goals[i];
        const prog = gl.holdTime > 0 ? clamp(gl.timer / gl.holdTime, 0, 1) : (gl.completed ? 1 : 0);
        ctx.save();
        ctx.fillStyle = gl.completed ? 'rgba(74, 222, 128, 0.32)' : 'rgba(74, 222, 128, 0.14)';
        ctx.strokeStyle = gl.color;
        ctx.lineWidth = 3;
        if (gl.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(gl.x, gl.y, gl.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (prog > 0) {
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(gl.x, gl.y, gl.r + 5, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = gl.color;
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          const cLblTxt = gl.timer > 0.05
            ? (gl.label + ' ' + gl.timer.toFixed(1) + '/' + gl.holdTime.toFixed(1) + 's')
            : (!gl.conditionMet && gl.conditionHint ? gl.conditionHint : gl.label);
          ctx.fillText(cLblTxt, gl.x, gl.y - gl.r - 8);
        } else {
          ctx.fillRect(gl.x, gl.y, gl.w, gl.h);
          ctx.strokeRect(gl.x, gl.y, gl.w, gl.h);
          if (prog > 0) {
            ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
            ctx.fillRect(gl.x + 2, gl.y + gl.h - 6, (gl.w - 4) * prog, 4);
          }
          ctx.fillStyle = gl.color;
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          const cntTag = gl.requiredCount > 1 ? (' (' + (gl.currentCount || 0) + '/' + gl.requiredCount + ')') : '';
          const lblTxt = gl.timer > 0.05
            ? (gl.label + cntTag + ' ' + gl.timer.toFixed(1) + '/' + gl.holdTime.toFixed(1) + 's')
            : (!gl.conditionMet && gl.conditionHint ? gl.conditionHint : (gl.label + cntTag));
          ctx.fillText(lblTxt, gl.x + gl.w * 0.5, gl.y + 15);
        }
        ctx.restore();
      }

      // 6. Static Walls
      for (let i = 0; i < w.walls.length; i++) {
        const wl = w.walls[i];
        ctx.save();
        if (wl.type === 'segment') {
          ctx.strokeStyle = wl.border;
          ctx.lineWidth = wl.r * 2 + 2;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(wl.x1, wl.y1); ctx.lineTo(wl.x2, wl.y2); ctx.stroke();
          ctx.strokeStyle = wl.color;
          ctx.lineWidth = wl.r * 2 - 2;
          ctx.beginPath(); ctx.moveTo(wl.x1, wl.y1); ctx.lineTo(wl.x2, wl.y2); ctx.stroke();
        } else {
          const cx = wl.x + wl.w * 0.5;
          const cy = wl.y + wl.h * 0.5;
          ctx.translate(cx, cy);
          if (wl.angle) ctx.rotate(wl.angle);
          ctx.fillStyle = wl.color;
          ctx.fillRect(-wl.w * 0.5, -wl.h * 0.5, wl.w, wl.h);
          ctx.strokeStyle = wl.border;
          ctx.lineWidth = 2;
          ctx.strokeRect(-wl.w * 0.5 + 1, -wl.h * 0.5 + 1, wl.w - 2, wl.h - 2);
        }
        ctx.restore();
      }

      // 6b. Pivoted Balance Beams
      for (let i = 0; i < w.balanceBeams.length; i++) {
        const bm = w.balanceBeams[i];
        ctx.save();
        ctx.translate(bm.x, bm.y);
        // Fulcrum pedestal triangle
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(-14, 24);
        ctx.lineTo(14, 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.rotate(bm.angle);
        ctx.fillStyle = bm.color;
        ctx.strokeStyle = bm.border;
        ctx.lineWidth = 2;
        ctx.fillRect(-bm.halfLen, -bm.thickness * 0.5, bm.halfLen * 2, bm.thickness);
        ctx.strokeRect(-bm.halfLen, -bm.thickness * 0.5, bm.halfLen * 2, bm.thickness);
        if (bm.rimH > 0) {
          ctx.fillRect(-bm.halfLen, -bm.thickness * 0.5 - bm.rimH, 6, bm.rimH);
          ctx.strokeRect(-bm.halfLen, -bm.thickness * 0.5 - bm.rimH, 6, bm.rimH);
          ctx.fillRect(bm.halfLen - 6, -bm.thickness * 0.5 - bm.rimH, 6, bm.rimH);
          ctx.strokeRect(bm.halfLen - 6, -bm.thickness * 0.5 - bm.rimH, 6, bm.rimH);
        }
        // Center pivot pin
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. Rotating Gears
      for (let i = 0; i < w.gears.length; i++) {
        const g = w.gears[i];
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.angle);
        ctx.fillStyle = g.color;
        ctx.strokeStyle = g.rimColor;
        ctx.lineWidth = 2;
        for (let t = 0; t < g.teeth; t++) {
          const a = (t / g.teeth) * Math.PI * 2;
          ctx.save();
          ctx.rotate(a);
          ctx.fillRect(g.r - 3, -g.toothR, g.toothLen + 3, g.toothR * 2);
          ctx.strokeRect(g.r - 3, -g.toothR, g.toothLen + 3, g.toothR * 2);
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, g.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0e152b';
        ctx.beginPath();
        ctx.arc(0, 0, g.r * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 8. Bumpers
      for (let i = 0; i < w.bumpers.length; i++) {
        const bp = w.bumpers[i];
        const boostR = bp.flash > 0 ? bp.flash * 4 : 0;
        ctx.save();
        ctx.fillStyle = bp.flash > 0.2 ? '#fff2b2' : bp.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.r + boostR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#141a33';
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.r * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 9. Drawn Rigid Bodies
      for (let i = 0; i < w.drawnBodies.length; i++) {
        const body = w.drawnBodies[i];
        ctx.save();
        ctx.translate(body.x, body.y);
        ctx.rotate(body.angle);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Crisp dark outline
        ctx.strokeStyle = body.outline;
        ctx.lineWidth = body.lineWidth + 4;
        ctx.beginPath();
        for (let j = 0; j < body.localSegs.length; j++) {
          const seg = body.localSegs[j];
          ctx.moveTo(seg.ax, seg.ay);
          ctx.lineTo(seg.bx, seg.by);
        }
        ctx.stroke();

        // Main chalk/ink body
        ctx.strokeStyle = body.color;
        ctx.lineWidth = body.lineWidth;
        ctx.stroke();
        ctx.restore();
      }

      // 10. Currently Drawing Preview Stroke
      if (this.isDrawing && this.activeStroke.length > 0) {
        ctx.save();
        ctx.strokeStyle = this.characterModifier.strokeColor || '#eef6ff';
        ctx.lineWidth = this.characterModifier.lineWidth || 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(this.activeStroke[0].x, this.activeStroke[0].y);
        for (let i = 1; i < this.activeStroke.length; i++) {
          ctx.lineTo(this.activeStroke[i].x, this.activeStroke[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 11. Dynamic Balls / Targets
      const assets = this.opts.assets || global.AETHERIA_ASSETS;
      for (let i = 0; i < w.balls.length; i++) {
        const b = w.balls[i];
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);

        let drewSprite = false;
        if (b.spriteId && assets && assets.characters && assets.characters[b.spriteId]) {
          const img = assets.getImage(assets.characters[b.spriteId].sprite48);
          if (img && img.complete && img.naturalWidth > 0) {
            const sz = b.r * 2.25;
            ctx.drawImage(img, -sz * 0.5, -sz * 0.5, sz, sz);
            drewSprite = true;
          }
        }
        if (!drewSprite) {
          ctx.fillStyle = b.color;
          ctx.strokeStyle = b.inGoal ? '#fef08a' : b.stroke;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Pixel highlight & orientation dot
          ctx.fillStyle = 'rgba(255,255,255,0.65)';
          ctx.fillRect(-b.r * 0.45, -b.r * 0.45, 5, 5);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(b.r * 0.25, -2, 4, 4);
        }
        ctx.restore();
        if (b.label) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(b.label, b.x, b.y - b.r - 5);
        }
      }

      // 12. Sparks / Particles
      for (let i = 0; i < w.particles.length; i++) {
        const p = w.particles[i];
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }

      // 12b. Stage-specific foreground HUD/artwork hook
      if (this.stageConfig && typeof this.stageConfig.renderFront === 'function') {
        ctx.save();
        this.stageConfig.renderFront(ctx, w);
        ctx.restore();
      }

      // 13. Character-Specific 8-bit Vision Overlay Callback!
      if (this.characterModifier && typeof this.characterModifier.renderVisionOverlay === 'function') {
        ctx.save();
        try {
          this.characterModifier.renderVisionOverlay(ctx, w);
        } catch (err) {
          /* isolate vision overlay errors */
        }
        ctx.restore();
      }

      // 14. In-Canvas Minimal Ink Gauge & Restart Flash
      const inkRatio = Math.max(0, 1 - w.inkUsed / Math.max(1, w.inkMax));
      ctx.fillStyle = 'rgba(10, 15, 32, 0.78)';
      ctx.fillRect(10, 8, 154, 16);
      ctx.strokeStyle = '#6482b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 8, 154, 16);
      ctx.fillStyle = inkRatio > 0.25 ? '#60a5fa' : '#f87171';
      ctx.fillRect(12, 10, Math.round(150 * inkRatio), 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      const lowInkWarn = inkRatio < 0.25;
      ctx.fillStyle = (lowInkWarn && Math.floor(w.time * 6) % 2 === 0) ? '#fef08a' : '#ffffff';
      ctx.fillText((lowInkWarn ? 'LOW INK ' : 'INK ') + Math.round(inkRatio * 100) + '%', 16, 19);

      if (this.restartFlash > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (this.restartFlash * 1.4).toFixed(2) + ')';
        ctx.fillRect(0, 0, w.width, w.height);
      }

      ctx.restore();
    }
  }

  global.PhysicsQEngine = PhysicsQEngine;
})(typeof window !== 'undefined' ? window : globalThis);
