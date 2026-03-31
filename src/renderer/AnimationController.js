const FRAME_RATES = {
  idle:   0.45,
  walk:   0.12,
  sleep:  0.9,
  jump:   0.08,
  play:   0.1,
  happy:  0.09,
  fight:  0.07,
  cuddle: 0.55,
  chase:  0.1,
};

const FRAME_COUNTS = {
  idle:   2,
  walk:   4,
  sleep:  2,
  jump:   3,
  play:   4,
  happy:  4,
  fight:  4,
  cuddle: 2,
  chase:  4,
};

export class AnimationController {
  constructor() {
    this.currentFrame = 0;
    this.frameTimer   = 0;
    this.lastState    = null;
  }

  update(dt, state) {
    if (state !== this.lastState) {
      this.currentFrame = 0;
      this.frameTimer   = 0;
      this.lastState    = state;
    }

    this.frameTimer += dt;
    const rate = FRAME_RATES[state] ?? 0.3;
    if (this.frameTimer >= rate) {
      this.frameTimer -= rate;
      const count = FRAME_COUNTS[state] ?? 2;
      this.currentFrame = (this.currentFrame + 1) % count;
    }
  }
}
