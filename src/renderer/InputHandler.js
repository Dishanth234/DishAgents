export class InputHandler {
  constructor(canvas, agentId, stateMachine, agentRenderer) {
    this.canvas       = canvas;
    this.agentId      = agentId;
    this.stateMachine = stateMachine;
    this.renderer     = agentRenderer;
    this.ctx          = canvas.getContext('2d');

    canvas.addEventListener('mousemove', e => this._onMouseMove(e));
    canvas.addEventListener('click',     e => this._onClick(e));
  }

  _isPixelOpaque(x, y) {
    if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return false;
    const pixel = this.ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return pixel[3] > 10;
  }

  _onMouseMove(e) {
    const isOnSprite = this._isPixelOpaque(e.clientX, e.clientY);
    window.agentAPI.setMousePassthrough(this.agentId, !isOnSprite);
  }

  _onClick(e) {
    if (this._isPixelOpaque(e.clientX, e.clientY)) {
      this.stateMachine.forceState('happy', 2.5);
      window.agentAPI.notifyUserClick(this.agentId);
    }
  }
}
