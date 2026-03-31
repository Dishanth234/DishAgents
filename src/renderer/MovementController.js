export class MovementController {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.wx = Math.random() * (window.screen.width - 80);
    this.wy = window.screen.height * 0.5 + Math.random() * window.screen.height * 0.35;
    this.targetX = null;
    this.targetY = null;
    this.jumpVY  = 0;
    this.jumping = false;

    this.screenW = window.screen.width;
    this.screenH = window.screen.height;
    this.WIN_W   = 80;
    this.WIN_H   = 120;

    this.WALK_SPEED  = 55;
    this.CHASE_SPEED = 105;
    this.PLAY_SPEED  = 75;
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  clearTarget() {
    this.targetX = null;
    this.targetY = null;
  }

  update(dt) {
    const state = this.stateMachine.currentState;

    if (state === 'walk' || state === 'chase' || state === 'play') {
      const speed = state === 'chase' ? this.CHASE_SPEED
                  : state === 'play'  ? this.PLAY_SPEED
                  : this.WALK_SPEED;

      if (this.targetX === null) {
        this._pickRandomTarget();
      }

      const dx   = this.targetX - this.wx;
      const dy   = this.targetY - this.wy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 8) {
        this.clearTarget();
      } else {
        this.wx += (dx / dist) * speed * dt;
        this.wy += (dy / dist) * speed * dt;
      }
    } else if (state === 'jump') {
      if (!this.jumping) {
        this.jumpVY  = -180;
        this.jumping = true;
      }
      this.jumpVY += 420 * dt; // gravity
      this.wy     += this.jumpVY * dt;

      // Land back on baseline
      const baseline = this.screenH * 0.5 + Math.random() * this.screenH * 0.35;
      if (this.wy > baseline && this.jumpVY > 0) {
        this.wy      = baseline;
        this.jumpVY  = 0;
        this.jumping = false;
      }
    } else {
      // idle/sleep/cuddle/fight — no movement
      this.jumping = false;
      this.clearTarget();
    }

    // Clamp to screen
    this.wx = Math.max(0, Math.min(this.screenW - this.WIN_W, this.wx));
    this.wy = Math.max(0, Math.min(this.screenH - this.WIN_H, this.wy));
  }

  getWindowPosition() {
    return { wx: Math.round(this.wx), wy: Math.round(this.wy) };
  }

  _pickRandomTarget() {
    const margin = 60;
    this.targetX = margin + Math.random() * (this.screenW - this.WIN_W - margin * 2);
    this.targetY = this.screenH * 0.35 + Math.random() * (this.screenH * 0.5);
  }
}
