/**
 * Jest setup file - Mocks for browser APIs
 * Provides Canvas 2D, Web Audio API, and requestAnimationFrame mocks
 */

// ============================================================================
// Canvas 2D Context Mock
// ============================================================================
const createMockCanvasContext = (): CanvasRenderingContext2D => {
  const context = {
    canvas: {} as HTMLCanvasElement,
    fillStyle: '',
    strokeStyle: '',
    shadowBlur: 0,
    shadowColor: '',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    lineWidth: 1,
    lineCap: 'butt' as CanvasLineCap,
    lineJoin: 'miter' as CanvasLineJoin,
    miterLimit: 10,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over' as GlobalCompositeOperation,

    // Drawing methods
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    clearRect: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),

    // Path methods
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    arcTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    rect: jest.fn(),

    // Transform methods
    save: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    translate: jest.fn(),
    transform: jest.fn(),
    setTransform: jest.fn(),
    resetTransform: jest.fn(),

    // Text methods
    fillText: jest.fn(),
    strokeText: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 } as TextMetrics)),

    // Image methods
    drawImage: jest.fn(),
    createImageData: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),

    // Gradient and pattern methods
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    } as CanvasGradient)),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    } as CanvasGradient)),
    createPattern: jest.fn(),

    // Misc
    clip: jest.fn(),
    isPointInPath: jest.fn(() => false),
    isPointInStroke: jest.fn(() => false),
  } as unknown as CanvasRenderingContext2D;

  return context;
};

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = jest.fn((contextType: string) => {
  if (contextType === '2d') {
    return createMockCanvasContext();
  }
  return null;
}) as any;

// Mock canvas width/height
Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  get: function() { return this._width || 800; },
  set: function(value) { this._width = value; }
});

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  get: function() { return this._height || 600; },
  set: function(value) { this._height = value; }
});

// ============================================================================
// Web Audio API Mocks
// ============================================================================

// Mock AudioContext
class MockAudioContext {
  state: AudioContextState = 'running';
  currentTime: number = 0;
  destination: AudioDestinationNode = {} as AudioDestinationNode;
  sampleRate: number = 44100;

  createOscillator = jest.fn(() => new MockOscillatorNode());
  createGain = jest.fn(() => new MockGainNode());
  createBiquadFilter = jest.fn(() => new MockBiquadFilterNode());
  createDynamicsCompressor = jest.fn(() => new MockDynamicsCompressorNode());
  createBuffer = jest.fn(() => ({} as AudioBuffer));
  createBufferSource = jest.fn(() => new MockAudioBufferSourceNode());

  resume = jest.fn(async () => {
    this.state = 'running';
  });

  suspend = jest.fn(async () => {
    this.state = 'suspended';
  });

  close = jest.fn(async () => {
    this.state = 'closed';
  });
}

// Mock OscillatorNode
class MockOscillatorNode {
  type: OscillatorType = 'sine';
  frequency: AudioParam = { value: 440 } as AudioParam;
  detune: AudioParam = { value: 0 } as AudioParam;

  connect = jest.fn(() => this);
  disconnect = jest.fn();
  start = jest.fn();
  stop = jest.fn();
}

// Mock GainNode
class MockGainNode {
  gain: AudioParam = { value: 1 } as AudioParam;

  connect = jest.fn(() => this);
  disconnect = jest.fn();
}

// Mock BiquadFilterNode
class MockBiquadFilterNode {
  type: BiquadFilterType = 'lowpass';
  frequency: AudioParam = { value: 350 } as AudioParam;
  Q: AudioParam = { value: 1 } as AudioParam;
  gain: AudioParam = { value: 0 } as AudioParam;

  connect = jest.fn(() => this);
  disconnect = jest.fn();
}

// Mock DynamicsCompressorNode
class MockDynamicsCompressorNode {
  threshold: AudioParam = { value: -24 } as AudioParam;
  knee: AudioParam = { value: 30 } as AudioParam;
  ratio: AudioParam = { value: 12 } as AudioParam;
  attack: AudioParam = { value: 0.003 } as AudioParam;
  release: AudioParam = { value: 0.25 } as AudioParam;
  reduction: number = 0;

  connect = jest.fn(() => this);
  disconnect = jest.fn();
}

// Mock AudioBufferSourceNode
class MockAudioBufferSourceNode {
  buffer: AudioBuffer | null = null;
  playbackRate: AudioParam = { value: 1 } as AudioParam;
  loop: boolean = false;

  connect = jest.fn(() => this);
  disconnect = jest.fn();
  start = jest.fn();
  stop = jest.fn();
}

// Install AudioContext mock globally
(global as any).AudioContext = MockAudioContext;
(global as any).webkitAudioContext = MockAudioContext;

// ============================================================================
// requestAnimationFrame Mock
// ============================================================================
let rafId = 0;
const rafCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback): number => {
  const id = ++rafId;
  rafCallbacks.set(id, callback);

  // Execute callback asynchronously
  setTimeout(() => {
    const cb = rafCallbacks.get(id);
    if (cb) {
      cb(performance.now());
      rafCallbacks.delete(id);
    }
  }, 16); // ~60fps

  return id;
});

global.cancelAnimationFrame = jest.fn((id: number): void => {
  rafCallbacks.delete(id);
});

// Helper to manually trigger RAF callbacks
(global as any).triggerRAF = (time: number = performance.now()) => {
  const callbacks = Array.from(rafCallbacks.values());
  rafCallbacks.clear();
  callbacks.forEach(cb => cb(time));
};

// ============================================================================
// performance.now Mock
// ============================================================================
let mockTime = 0;

Object.defineProperty(performance, 'now', {
  writable: true,
  value: jest.fn(() => mockTime)
});

// Helper to advance time
(global as any).advanceTime = (ms: number) => {
  mockTime += ms;
};

// Helper to reset time
(global as any).resetTime = () => {
  mockTime = 0;
};

// ============================================================================
// window.addEventListener mocks for Input
// ============================================================================
const eventListeners = new Map<string, Set<EventListener>>();

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = jest.fn((type: string, listener: EventListener) => {
  if (!eventListeners.has(type)) {
    eventListeners.set(type, new Set());
  }
  eventListeners.get(type)!.add(listener);
  originalAddEventListener.call(window, type, listener);
});

window.removeEventListener = jest.fn((type: string, listener: EventListener) => {
  eventListeners.get(type)?.delete(listener);
  originalRemoveEventListener.call(window, type, listener);
});

// Helper to trigger keyboard events
(global as any).triggerKeyEvent = (type: 'keydown' | 'keyup', code: string, key: string = '') => {
  const event = new KeyboardEvent(type, { code, key, bubbles: true });
  const listeners = eventListeners.get(type);
  if (listeners) {
    listeners.forEach(listener => listener(event));
  }
  return event;
};

// ============================================================================
// Math.random Mock (for deterministic tests)
// ============================================================================
let mockRandomValue = 0.5;

const originalRandom = Math.random;

(global as any).mockRandom = (value: number) => {
  mockRandomValue = value;
  Math.random = jest.fn(() => mockRandomValue);
};

(global as any).restoreRandom = () => {
  Math.random = originalRandom;
};

// ============================================================================
// Reset all mocks before each test
// ============================================================================
beforeEach(() => {
  jest.clearAllMocks();
  rafCallbacks.clear();
  eventListeners.clear();
  mockTime = 0;
  mockRandomValue = 0.5;
});

afterEach(() => {
  Math.random = originalRandom;
});

// ============================================================================
// Global test utilities
// ============================================================================
(global as any).createMockCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
};

(global as any).createMockContext2D = createMockCanvasContext;

console.log('[Test Setup] Mocks initialized: Canvas2D, WebAudio, RAF, Performance');
