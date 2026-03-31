const TRANSITION_TABLE = {
  idle:   ['walk', 'sleep', 'jump', 'idle', 'idle'],
  walk:   ['idle', 'walk', 'jump', 'idle'],
  sleep:  ['idle', 'sleep', 'sleep'],
  jump:   ['idle', 'walk'],
  happy:  ['idle', 'walk'],
  play:   ['idle', 'walk', 'jump'],
  fight:  ['idle', 'walk'],
  cuddle: ['idle'],
  chase:  ['idle', 'walk'],
};

const STATE_DURATIONS = {
  idle:   [3, 6],
  walk:   [3, 7],
  sleep:  [6, 14],
  jump:   [0.5, 1.2],
  happy:  [2, 3],
  play:   [2, 4],
  fight:  [2, 4],
  cuddle: [3, 5],
  chase:  [3, 6],
};

export class StateMachine {
  constructor(config, personality) {
    this.config       = config;
    this.personality  = personality;
    this.currentState = 'idle';
    this.stateTimer   = 0;
    this.stateDuration = this._rollDuration('idle');
    this.forcedState  = null;
    this.forcedTimer  = 0;
  }

  forceState(state, durationSec) {
    this.forcedState  = state;
    this.forcedTimer  = durationSec;
    this.currentState = state;
    this.stateTimer   = 0;
  }

  update(dt) {
    if (this.forcedState) {
      this.forcedTimer -= dt;
      if (this.forcedTimer <= 0) {
        this.forcedState  = null;
        this.currentState = 'idle';
        this.stateTimer   = 0;
        this.stateDuration = this._rollDuration('idle');
      }
      return;
    }

    this.stateTimer += dt;
    if (this.stateTimer >= this.stateDuration) {
      this._transition();
    }
  }

  _transition() {
    const candidates = TRANSITION_TABLE[this.currentState] ?? ['idle'];
    const weights    = candidates.map(s => this.personality.getStateWeight(s));
    this.currentState  = this._weightedRandom(candidates, weights);
    this.stateTimer    = 0;
    this.stateDuration = this._rollDuration(this.currentState);
  }

  _rollDuration(state) {
    const [min, max] = STATE_DURATIONS[state] ?? [2, 5];
    return min + Math.random() * (max - min);
  }

  _weightedRandom(items, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}
