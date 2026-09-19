/**
 * Web Audio Procedural Soundtrack Synthesizer
 * Provides instant, zero-network, royalty-free audio tracks for reels and video posts
 * Works 100% offline with zero data consumption (Zero-MB audio!)
 */

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private intervalId: any = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public playTrack(trackId: string) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentTrackId = trackId;

    let step = 0;

    // Track recipes
    if (trackId === 'cyber_pulse') {
      // 128 BPM Cyberpunk pulse
      const notes = [130.81, 155.56, 174.61, 196.0, 233.08, 196.0, 174.61, 155.56];
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const note = notes[step % notes.length];

        // Bass/Lead oscillator
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.22);

        // Punchy kick every 2 steps
        if (step % 2 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.frequency.setValueAtTime(150, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

          kickGain.gain.setValueAtTime(0.35, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          kickOsc.connect(kickGain);
          kickGain.connect(this.masterGain);

          kickOsc.start(now);
          kickOsc.stop(now + 0.13);
        }

        step++;
      }, 234); // ~128 BPM eighth notes
    } else if (trackId === 'lofi_midnight') {
      // 85 BPM Chill Lo-Fi chords
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23], // G7
      ];

      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const chord = chords[step % chords.length];

        chord.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);

          gain.gain.setValueAtTime(0.08, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.005, now + 1.2);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now + idx * 0.03);
          osc.stop(now + 1.3);
        });

        step++;
      }, 1400); // Mellow slow chord progression
    } else if (trackId === 'hyper_trap') {
      // 140 BPM Trap Beat
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;

        // Sub 808 on step 0 and 5
        if (step % 8 === 0 || step % 8 === 5) {
          const sub = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(65, now);
          sub.frequency.exponentialRampToValueAtTime(32, now + 0.35);

          subGain.gain.setValueAtTime(0.4, now);
          subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          sub.connect(subGain);
          subGain.connect(this.masterGain);

          sub.start(now);
          sub.stop(now + 0.36);
        }

        // Trap Hat on every step
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = 'square';
        hatOsc.frequency.setValueAtTime(8000 + Math.random() * 2000, now);

        hatGain.gain.setValueAtTime(0.05, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(this.masterGain);

        hatOsc.start(now);
        hatOsc.stop(now + 0.05);

        step++;
      }, 107); // ~140 BPM sixteenth notes
    } else if (trackId === 'sunset_acoustic') {
      // Mellow acoustic melodic arpeggio
      const notes = [329.63, 392.0, 440.0, 493.88, 587.33, 493.88, 440.0, 392.0];
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const freq = notes[step % notes.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.002, now + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.45);

        step++;
      }, 300);
    } else if (trackId === 'deep_nebula') {
      // Atmospheric ambient drone
      const droneNotes = [110, 164.81, 220, 277.18];
      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const freq = droneNotes[step % droneNotes.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.6);

        step++;
      }, 2000);
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
    this.currentTrackId = null;
  }

  public playSfx(sfxType: 'boom' | 'swoosh' | 'drop' | 'shutter' | 'glitch' | 'scratch') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (sfxType === 'boom') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.95);
    } else if (sfxType === 'swoosh') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (sfxType === 'drop') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.68);
    } else if (sfxType === 'shutter') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (sfxType === 'glitch') {
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 + Math.random() * 1500, now + i * 0.04);
        gain.gain.setValueAtTime(0.18, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.035);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.04);
      }
    } else if (sfxType === 'scratch') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.12);
      osc.frequency.linearRampToValueAtTime(800, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.27);
    }
  }

  public playCustomRecipe(recipe: { notes?: number[]; bpm?: number }) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentTrackId = 'ai_custom';
    const notes = recipe.notes && recipe.notes.length > 0 ? recipe.notes : [130.81, 155.56, 174.61, 196.0, 233.08];
    const bpm = recipe.bpm || 135;
    const intervalMs = Math.round((60 / bpm) * 500); // 8th notes

    let step = 0;
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const note = notes[step % notes.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);

      if (step % 4 === 0) {
        // Kick
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.frequency.setValueAtTime(140, now);
        kOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        kGain.gain.setValueAtTime(0.35, now);
        kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        kOsc.connect(kGain);
        kGain.connect(this.masterGain);
        kOsc.start(now);
        kOsc.stop(now + 0.13);
      }

      step++;
    }, intervalMs);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
      volume: this.volume,
    };
  }
}

export const synthEngine = new AudioSynthEngine();

export interface PresetTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  mood: string;
  zeroMbBadge: string;
}

export const SOUNDTRACK_PRESETS: PresetTrack[] = [
  {
    id: 'cyber_pulse',
    name: '⚡ Cyber-Pulse Synth',
    genre: 'Synthwave / Cyberpunk',
    bpm: 128,
    mood: 'High Energy, Neon Drops',
    zeroMbBadge: '0.00 MB Procedural',
  },
  {
    id: 'lofi_midnight',
    name: '🎧 Lo-Fi Midnight Alley',
    genre: 'Chillhop / Aesthetic',
    bpm: 85,
    mood: 'Relaxed, Aesthetic, Warm',
    zeroMbBadge: '0.00 MB Procedural',
  },
  {
    id: 'hyper_trap',
    name: '🔥 Hyper-Bass Neon Trap',
    genre: 'Trap / Fast Beats',
    bpm: 140,
    mood: 'Viral Reels, 808 Sub-bass',
    zeroMbBadge: '0.00 MB Procedural',
  },
  {
    id: 'sunset_acoustic',
    name: '🌅 Golden Hour Pluck',
    genre: 'Melodic / Indie',
    bpm: 100,
    mood: 'Emotional, Golden Sunset',
    zeroMbBadge: '0.00 MB Procedural',
  },
  {
    id: 'deep_nebula',
    name: '🌌 Deep Nebula Drone',
    genre: 'Ambient / Sci-Fi',
    bpm: 60,
    mood: 'Futuristic, Mysterious',
    zeroMbBadge: '0.00 MB Procedural',
  },
];
