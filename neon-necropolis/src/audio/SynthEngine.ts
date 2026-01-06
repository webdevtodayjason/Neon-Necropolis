/**
 * SynthEngine.ts
 * Core procedural audio synthesis engine for NEON NECROPOLIS
 * Provides low-level audio synthesis primitives and effects
 */

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export interface ADSREnvelope {
  attack: number;   // seconds
  decay: number;    // seconds
  sustain: number;  // gain level (0-1)
  release: number;  // seconds
}

export interface FilterConfig {
  type: BiquadFilterType;
  frequency: number;
  Q?: number;
  gain?: number;
}

export class SynthEngine {
  private context: AudioContext;

  constructor(context: AudioContext) {
    this.context = context;
  }

  /**
   * Create an oscillator with specified parameters
   */
  createOscillator(
    type: OscillatorType,
    frequency: number,
    detune: number = 0
  ): OscillatorNode {
    const osc = this.context.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    return osc;
  }

  /**
   * Generate white noise using buffer source
   */
  createNoiseGenerator(duration: number = 1): AudioBufferSourceNode {
    const bufferSize = this.context.sampleRate * duration;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    return noise;
  }

  /**
   * Create a filtered noise generator (useful for wind, explosions)
   */
  createFilteredNoise(
    duration: number,
    filterConfig: FilterConfig
  ): { source: AudioBufferSourceNode; filter: BiquadFilterNode } {
    const noise = this.createNoiseGenerator(duration);
    const filter = this.createFilter(filterConfig);
    noise.connect(filter);
    return { source: noise, filter };
  }

  /**
   * Create a biquad filter
   */
  createFilter(config: FilterConfig): BiquadFilterNode {
    const filter = this.context.createBiquadFilter();
    filter.type = config.type;
    filter.frequency.value = config.frequency;
    if (config.Q !== undefined) filter.Q.value = config.Q;
    if (config.gain !== undefined) filter.gain.value = config.gain;
    return filter;
  }

  /**
   * Apply ADSR envelope to a gain node
   */
  applyEnvelope(
    gainNode: GainNode,
    envelope: ADSREnvelope,
    startTime: number,
    duration?: number
  ): void {
    const { attack, decay, sustain, release } = envelope;
    const now = startTime;

    // Start from 0
    gainNode.gain.setValueAtTime(0, now);

    // Attack phase
    gainNode.gain.linearRampToValueAtTime(1, now + attack);

    // Decay phase
    gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);

    // Sustain phase (hold at sustain level)
    if (duration !== undefined) {
      const releaseStartTime = now + duration;
      gainNode.gain.setValueAtTime(sustain, releaseStartTime);

      // Release phase
      gainNode.gain.linearRampToValueAtTime(0, releaseStartTime + release);
    }
  }

  /**
   * Create exponential pitch sweep (useful for laser sounds)
   */
  createPitchSweep(
    osc: OscillatorNode,
    startFreq: number,
    endFreq: number,
    duration: number,
    startTime: number
  ): void {
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
  }

  /**
   * Create linear pitch sweep
   */
  createLinearPitchSweep(
    osc: OscillatorNode,
    startFreq: number,
    endFreq: number,
    duration: number,
    startTime: number
  ): void {
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
  }

  /**
   * Create a simple delay effect
   */
  createDelay(delayTime: number = 0.3, feedback: number = 0.3): {
    input: GainNode;
    output: GainNode;
  } {
    const input = this.context.createGain();
    const output = this.context.createGain();
    const delay = this.context.createDelay(5);
    const feedbackGain = this.context.createGain();

    delay.delayTime.value = delayTime;
    feedbackGain.gain.value = feedback;

    // Create delay feedback loop
    input.connect(delay);
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    delay.connect(output);

    // Also pass dry signal
    input.connect(output);

    return { input, output };
  }

  /**
   * Create a simple reverb effect using convolution
   */
  createReverb(duration: number = 2, decay: number = 2): ConvolverNode {
    const convolver = this.context.createConvolver();
    const rate = this.context.sampleRate;
    const length = rate * duration;
    const impulse = this.context.createBuffer(2, length, rate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);

    // Generate impulse response with exponential decay
    for (let i = 0; i < length; i++) {
      const n = length - i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
    }

    convolver.buffer = impulse;
    return convolver;
  }

  /**
   * Create a distortion effect using wave shaper
   */
  createDistortion(amount: number = 50): WaveShaperNode {
    const shaper = this.context.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    shaper.curve = curve;
    shaper.oversample = '4x';
    return shaper;
  }

  /**
   * Create LFO (Low Frequency Oscillator) for modulation
   */
  createLFO(frequency: number, depth: number): {
    lfo: OscillatorNode;
    gain: GainNode;
  } {
    const lfo = this.context.createOscillator();
    lfo.frequency.value = frequency;
    const gain = this.context.createGain();
    gain.gain.value = depth;
    lfo.connect(gain);
    return { lfo, gain };
  }

  /**
   * Create ring modulation effect (multiply two signals)
   */
  createRingMod(carrierFreq: number): {
    input: GainNode;
    output: GainNode;
    carrier: OscillatorNode;
  } {
    const input = this.context.createGain();
    const output = this.context.createGain();
    const carrier = this.context.createOscillator();
    const modulator = this.context.createGain();

    carrier.frequency.value = carrierFreq;
    modulator.gain.value = 0; // Acts as multiplier

    // Ring modulation circuit
    input.connect(modulator.gain);
    carrier.connect(modulator);
    modulator.connect(output);

    carrier.start();

    return { input, output, carrier };
  }

  /**
   * Create tremolo effect (amplitude modulation)
   */
  createTremolo(rate: number = 5, depth: number = 0.5): {
    input: GainNode;
    output: GainNode;
    lfo: OscillatorNode;
  } {
    const input = this.context.createGain();
    const output = this.context.createGain();
    const lfo = this.context.createOscillator();
    const lfoGain = this.context.createGain();

    lfo.frequency.value = rate;
    lfoGain.gain.value = depth;
    output.gain.value = 1 - depth;

    // Connect LFO to modulate output gain
    lfo.connect(lfoGain);
    lfoGain.connect(output.gain);
    input.connect(output);

    lfo.start();

    return { input, output, lfo };
  }

  /**
   * Create a simple compressor
   */
  createCompressor(
    threshold: number = -24,
    knee: number = 30,
    ratio: number = 12,
    attack: number = 0.003,
    release: number = 0.25
  ): DynamicsCompressorNode {
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = threshold;
    compressor.knee.value = knee;
    compressor.ratio.value = ratio;
    compressor.attack.value = attack;
    compressor.release.value = release;
    return compressor;
  }

  /**
   * Helper: Schedule parameter change over time
   */
  scheduleParamChange(
    param: AudioParam,
    startValue: number,
    endValue: number,
    startTime: number,
    duration: number,
    curve: 'linear' | 'exponential' = 'linear'
  ): void {
    param.setValueAtTime(startValue, startTime);
    if (curve === 'exponential' && endValue > 0) {
      param.exponentialRampToValueAtTime(endValue, startTime + duration);
    } else {
      param.linearRampToValueAtTime(endValue, startTime + duration);
    }
  }

  /**
   * Get current audio context time
   */
  get currentTime(): number {
    return this.context.currentTime;
  }

  /**
   * Get audio context
   */
  get audioContext(): AudioContext {
    return this.context;
  }
}
