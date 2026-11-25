/**
 * Aetheria 8-bit Arcade - Pure Web Audio API 8-bit Chiptune Synthesizer
 * Synthesizes retro SFX, 7 unique character voice blips, and multi-channel looping BGM
 * using Square Waves, Triangle Waves, and White Noise with zero external audio files.
 */
(function (global) {
  'use strict';

  const NOTE_FREQ = {
    C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
    C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25, Cs5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
    C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
  };

  // Distinct voice blip synthesis profiles for all 7 Aetheria Sages
  const VOICE_PROFILES = {
    claude:   { wave: 'triangle', freq: 440, endFreq: 455, dur: 0.055, vol: 0.14, jitter: 16 },
    gpt:      { wave: 'square',   freq: 587, endFreq: 659, dur: 0.048, vol: 0.09, jitter: 20 },
    gemini3:  { wave: 'square',   freq: 523, endFreq: 523, dur: 0.036, vol: 0.08, jitter: 8  },
    gemini4:  { wave: 'square',   freq: 494, endFreq: 568, dur: 0.052, vol: 0.09, jitter: 28 },
    qwen:     { wave: 'triangle', freq: 466, endFreq: 523, dur: 0.060, vol: 0.15, jitter: 18 },
    deepseek: { wave: 'triangle', freq: 349, endFreq: 415, dur: 0.058, vol: 0.16, jitter: 14 },
    inkling:  { wave: 'square',   freq: 622, endFreq: 587, dur: 0.038, vol: 0.08, jitter: 22 },
    narrator: { wave: 'triangle', freq: 311, endFreq: 311, dur: 0.040, vol: 0.10, jitter: 10 }
  };

  // Looping 8-bit chiptune BGM tracks (step-sequenced)
  const BGM_TRACKS = {
    hub: {
      tempo: 132,
      lead: [
        'E5', null, 'G5', 'A5', 'B5', null, 'A5', 'G5',
        'F5', null, 'A5', 'G5', 'E5', null, 'D5', null,
        'C5', null, 'E5', 'G5', 'A5', null, 'G5', 'E5',
        'D5', 'E5', 'F5', 'G5', 'E5', null, null, null
      ],
      bass: [
        'C3', null, 'G3', null, 'E3', null, 'G3', null,
        'F3', null, 'C4', null, 'C3', null, 'G3', null,
        'A3', null, 'E3', null, 'F3', null, 'C4', null,
        'G3', null, 'D3', null, 'G3', null, 'B3', null
      ],
      perc: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 2]
    },
    puzzle: {
      tempo: 124,
      lead: [
        'C5', 'E5', 'G5', null, 'A5', 'G5', 'E5', null,
        'D5', 'F5', 'A5', null, 'G5', 'F5', 'D5', null,
        'E5', 'G5', 'C6', null, 'B5', 'A5', 'G5', null,
        'F5', 'E5', 'D5', 'E5', 'C5', null, null, null
      ],
      bass: [
        'C3', null, 'C4', null, 'A3', null, 'E3', null,
        'D3', null, 'A3', null, 'G3', null, 'B3', null,
        'C3', null, 'G3', null, 'A3', null, 'E3', null,
        'F3', null, 'G3', null, 'C3', null, 'G3', null
      ],
      perc: [1, 0, 0, 2, 1, 0, 2, 0, 1, 0, 0, 2, 1, 2, 0, 2]
    },
    vn: {
      tempo: 96,
      lead: [
        'G4', null, 'B4', 'D5', 'E5', null, 'D5', null,
        'C5', null, 'B4', 'A4', 'B4', null, null, null,
        'A4', null, 'C5', 'E5', 'D5', null, 'B4', null,
        'A4', 'G4', 'A4', 'B4', 'G4', null, null, null
      ],
      bass: [
        'G3', null, null, null, 'E3', null, null, null,
        'C3', null, null, null, 'G3', null, null, null,
        'A3', null, null, null, 'D3', null, null, null,
        'C3', null, 'D3', null, 'G3', null, null, null
      ],
      perc: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0]
    },
    boss: {
      tempo: 152,
      lead: [
        'A4', 'A4', 'C5', 'E5', 'D5', 'C5', 'B4', 'G4',
        'A4', 'C5', 'E5', 'G5', 'Fs5', 'E5', 'D5', null,
        'E5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5',
        'B4', 'C5', 'D5', 'E5', 'A4', null, 'E5', null
      ],
      bass: [
        'A3', 'A3', 'E3', 'A3', 'G3', 'G3', 'D3', 'G3',
        'F3', 'F3', 'C3', 'F3', 'E3', 'E3', 'B3', 'E3',
        'A3', 'A3', 'E3', 'A3', 'C4', 'C4', 'G3', 'C4',
        'D3', 'D3', 'E3', 'E3', 'A3', null, 'E3', null
      ],
      perc: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 2]
    }
  };

  class Audio8Bit {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.sfxGain = null;
      this.bgmGain = null;
      this.noiseBuffer = null;
      this.muted = false;
      this.bgmMuted = false;
      this.volume = 0.7;
      this.bgmVolume = 0.24;
      this.sfxVolume = 0.65;
      this.currentBgm = null;
      this._bgmTimer = null;
      this._bgmStep = 0;
      this._lastDrawSfx = 0;
      this._lastBounceSfx = 0;
      this._lastVoiceSfx = 0;

      try {
        const savedMute = localStorage.getItem('aetheria_8bit_muted');
        if (savedMute === '1') this.muted = true;
      } catch (e) { /* ignore storage restrictions */ }
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (!AudioCtx) return false;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.bgmGain = this.ctx.createGain();

        this.sfxGain.connect(this.masterGain);
        this.bgmGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this._applyGains();
        this._buildNoiseBuffer();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(function () {});
      }
      return !!this.ctx;
    }

    _buildNoiseBuffer() {
      if (!this.ctx) return;
      const sampleRate = this.ctx.sampleRate;
      const len = sampleRate * 1.0;
      const buf = this.ctx.createBuffer(1, len, sampleRate);
      const data = buf.getChannelData(0);
      // 8-bit LFSR-like stepped white noise
      let last = 0;
      for (let i = 0; i < len; i++) {
        if (i % 3 === 0) last = Math.random() * 2 - 1;
        data[i] = last;
      }
      this.noiseBuffer = buf;
    }

    _applyGains() {
      if (!this.masterGain || !this.ctx) return;
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, now);
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, now);
      this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : this.bgmVolume, now);
    }

    setMuted(flag) {
      this.muted = !!flag;
      this._applyGains();
      try {
        localStorage.setItem('aetheria_8bit_muted', this.muted ? '1' : '0');
      } catch (e) { /* ignore */ }
      return this.muted;
    }

    toggleMute() {
      return this.setMuted(!this.muted);
    }

    setBgmMuted(flag) {
      this.bgmMuted = !!flag;
      this._applyGains();
      return this.bgmMuted;
    }

    _playTone(opts) {
      if (this.muted || !this.init()) return;
      const ctx = this.ctx;
      const now = ctx.currentTime + (opts.delay || 0);
      const dur = opts.dur || 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = opts.wave || 'square';
      osc.frequency.setValueAtTime(opts.freq || 440, now);
      if (opts.endFreq && opts.endFreq !== opts.freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.endFreq), now + dur);
      }
      const vol = opts.vol != null ? opts.vol : 0.15;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + Math.min(0.006, dur * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(opts.bus === 'bgm' ? this.bgmGain : this.sfxGain);
      osc.start(now);
      osc.stop(now + dur + 0.015);
    }

    _playNoise(opts) {
      if (this.muted || !this.init() || !this.noiseBuffer) return;
      const ctx = this.ctx;
      const now = ctx.currentTime + (opts.delay || 0);
      const dur = opts.dur || 0.06;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = opts.filterType || 'bandpass';
      filter.frequency.setValueAtTime(opts.freq || 1800, now);
      filter.Q.setValueAtTime(opts.q || 1.2, now);

      const gain = ctx.createGain();
      const vol = opts.vol != null ? opts.vol : 0.12;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(opts.bus === 'bgm' ? this.bgmGain : this.sfxGain);
      src.start(now, Math.random() * 0.5, dur + 0.02);
    }

    // ---- Menu & UI SFX ----
    playMenuMove() {
      this._playTone({ wave: 'square', freq: 520, endFreq: 660, dur: 0.045, vol: 0.10 });
    }

    playMenuSelect() {
      this._playTone({ wave: 'square', freq: 587, dur: 0.055, vol: 0.12 });
      this._playTone({ wave: 'square', freq: 880, dur: 0.09, delay: 0.05, vol: 0.13 });
    }

    playMenuBack() {
      this._playTone({ wave: 'square', freq: 440, endFreq: 260, dur: 0.08, vol: 0.11 });
    }

    playEraSwitch() {
      const notes = [392, 494, 587, 784];
      notes.forEach((f, i) => {
        this._playTone({ wave: 'triangle', freq: f, dur: 0.09, delay: i * 0.045, vol: 0.18 });
      });
    }

    playChoiceAppear() {
      this._playTone({ wave: 'square', freq: 659, dur: 0.05, vol: 0.09 });
      this._playTone({ wave: 'square', freq: 784, dur: 0.07, delay: 0.05, vol: 0.10 });
    }

    // ---- Drawing & Physics SFX ----
    playDrawScratch(speedRatio) {
      const now = performance.now();
      if (now - this._lastDrawSfx < 42) return;
      this._lastDrawSfx = now;
      const spd = Math.max(0.2, Math.min(2.0, speedRatio || 1));
      this._playNoise({
        filterType: 'bandpass',
        freq: 2200 + spd * 1100 + Math.random() * 400,
        q: 2.0,
        dur: 0.032,
        vol: 0.065
      });
    }

    playDrawDrop() {
      this._playTone({ wave: 'triangle', freq: 240, endFreq: 130, dur: 0.08, vol: 0.18 });
    }

    playBounce(intensity) {
      const now = performance.now();
      if (now - this._lastBounceSfx < 38) return;
      this._lastBounceSfx = now;
      const p = Math.max(0.15, Math.min(1.0, intensity || 0.5));
      this._playTone({
        wave: 'triangle',
        freq: 180 + p * 220,
        endFreq: 95 + p * 60,
        dur: 0.05 + p * 0.04,
        vol: 0.08 + p * 0.14
      });
    }

    playBumperHit() {
      this._playTone({ wave: 'square', freq: 330, endFreq: 990, dur: 0.09, vol: 0.15 });
      this._playTone({ wave: 'triangle', freq: 660, endFreq: 1320, dur: 0.08, delay: 0.03, vol: 0.14 });
    }

    playGearClick() {
      this._playNoise({ filterType: 'highpass', freq: 1400, dur: 0.025, vol: 0.06 });
    }

    playGoalTick(progress) {
      const f = 520 + Math.min(1, progress || 0) * 440;
      this._playTone({ wave: 'square', freq: f, dur: 0.045, vol: 0.09 });
    }

    playRestart() {
      this._playTone({ wave: 'square', freq: 680, endFreq: 240, dur: 0.11, vol: 0.12 });
      this._playTone({ wave: 'triangle', freq: 300, endFreq: 560, dur: 0.09, delay: 0.09, vol: 0.14 });
    }

    playStageClear() {
      const fanfare = [
        { f: 523.25, d: 0.10, t: 0.00 },
        { f: 659.25, d: 0.10, t: 0.10 },
        { f: 783.99, d: 0.10, t: 0.20 },
        { f: 1046.50, d: 0.28, t: 0.30 },
        { f: 783.99, d: 0.10, t: 0.58 },
        { f: 1046.50, d: 0.42, t: 0.68 }
      ];
      fanfare.forEach((n) => {
        this._playTone({ wave: 'square', freq: n.f, dur: n.d, delay: n.t, vol: 0.14 });
        this._playTone({ wave: 'triangle', freq: n.f * 0.5, dur: n.d, delay: n.t, vol: 0.16 });
      });
    }

    playStageFail() {
      const notes = [392, 370, 349, 294];
      notes.forEach((f, i) => {
        this._playTone({ wave: 'square', freq: f, endFreq: f * 0.92, dur: 0.14, delay: i * 0.13, vol: 0.12 });
      });
    }

    // ---- 7 Character Typewriter Voice Blips ----
    playVoiceBlip(charId) {
      const now = performance.now();
      if (now - this._lastVoiceSfx < 36) return;
      this._lastVoiceSfx = now;
      const key = (charId || 'narrator').toLowerCase();
      const prof = VOICE_PROFILES[key] || VOICE_PROFILES.narrator;
      const offset = (Math.random() * 2 - 1) * prof.jitter;
      this._playTone({
        wave: prof.wave,
        freq: Math.max(120, prof.freq + offset),
        endFreq: Math.max(120, prof.endFreq + offset),
        dur: prof.dur,
        vol: prof.vol
      });
    }

    // ---- 8-bit Looping BGM Sequencer ----
    playBgm(trackName) {
      const name = BGM_TRACKS[trackName] ? trackName : 'hub';
      if (this.currentBgm === name && this._bgmTimer) return;
      this.stopBgm();
      this.currentBgm = name;
      this._bgmStep = 0;
      const track = BGM_TRACKS[name];
      const stepMs = (60 / track.tempo / 2) * 1000; // 8th-note steps

      this._bgmTimer = setInterval(() => {
        if (this.muted || this.bgmMuted || !this.ctx || this.ctx.state !== 'running') return;
        const idx = this._bgmStep % track.lead.length;
        const leadNote = track.lead[idx];
        const bassNote = track.bass[idx % track.bass.length];
        const percHit = track.perc[idx % track.perc.length];
        const stepSec = stepMs / 1000;

        if (leadNote && NOTE_FREQ[leadNote]) {
          this._playTone({
            wave: name === 'vn' ? 'triangle' : 'square',
            freq: NOTE_FREQ[leadNote],
            dur: stepSec * 0.82,
            vol: name === 'vn' ? 0.18 : 0.10,
            bus: 'bgm'
          });
        }
        if (bassNote && NOTE_FREQ[bassNote]) {
          this._playTone({
            wave: 'triangle',
            freq: NOTE_FREQ[bassNote],
            dur: stepSec * 0.9,
            vol: 0.22,
            bus: 'bgm'
          });
        }
        if (percHit === 1) {
          this._playTone({ wave: 'triangle', freq: 130, endFreq: 48, dur: 0.055, vol: 0.16, bus: 'bgm' });
        } else if (percHit === 2) {
          this._playNoise({ filterType: 'highpass', freq: 4200, dur: 0.03, vol: 0.07, bus: 'bgm' });
        }
        this._bgmStep++;
      }, stepMs);
    }

    stopBgm() {
      if (this._bgmTimer) {
        clearInterval(this._bgmTimer);
        this._bgmTimer = null;
      }
      this.currentBgm = null;
    }

    playSfx(name, arg) {
      const map = {
        menuMove: () => this.playMenuMove(),
        menuSelect: () => this.playMenuSelect(),
        menuBack: () => this.playMenuBack(),
        eraSwitch: () => this.playEraSwitch(),
        choice: () => this.playChoiceAppear(),
        draw: () => this.playDrawScratch(arg),
        drop: () => this.playDrawDrop(),
        bounce: () => this.playBounce(arg),
        bumper: () => this.playBumperHit(),
        gear: () => this.playGearClick(),
        goalTick: () => this.playGoalTick(arg),
        restart: () => this.playRestart(),
        clear: () => this.playStageClear(),
        fail: () => this.playStageFail()
      };
      if (map[name]) map[name]();
    }
  }

  Audio8Bit.VOICE_PROFILES = VOICE_PROFILES;
  Audio8Bit.BGM_TRACKS = Object.keys(BGM_TRACKS);

  global.Audio8Bit = Audio8Bit;
  global.AETHERIA_AUDIO = new Audio8Bit();
})(typeof window !== 'undefined' ? window : globalThis);
