const { BrowserWindow, screen } = require('electron');
const path = require('path');

class AgentWindow {
  constructor(agentConfig) {
    this.agentId = agentConfig.id;
    this.config = agentConfig;
    this.win = null;
  }

  create() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const startX = Math.floor(Math.random() * (width - 80));
    const startY = Math.floor(Math.random() * (height * 0.4) + height * 0.4);

    this.win = new BrowserWindow({
      width: 80,
      height: 120,
      x: startX,
      y: startY,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      hasShadow: false,
      skipTaskbar: true,
      focusable: false,
      // Do NOT use type:'panel' — panel windows are invisible without a parent on macOS
      show: false, // show after setup to avoid flicker
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'renderer', 'preload.js'),
      },
    });

    this.win.loadFile(
      path.join(__dirname, '..', 'renderer', 'agent.html'),
      { query: { agentId: this.agentId } }
    );

    // Show without stealing focus once page is ready
    this.win.once('ready-to-show', () => {
      this.win.showInactive();
      this.win.setAlwaysOnTop(true, 'screen-saver');
      // Appear on all virtual desktops / Spaces
      this.win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    });

    this.win.setIgnoreMouseEvents(true, { forward: true });

    return this;
  }

  moveTo(x, y) {
    if (this.win && !this.win.isDestroyed()) {
      this.win.setPosition(Math.round(x), Math.round(y), false);
    }
  }

  getPosition() {
    if (this.win && !this.win.isDestroyed()) {
      return this.win.getPosition();
    }
    return [0, 0];
  }

  setMousePassthrough(ignore) {
    if (this.win && !this.win.isDestroyed()) {
      this.win.setIgnoreMouseEvents(ignore, { forward: true });
    }
  }

  get webContents() {
    return this.win ? this.win.webContents : null;
  }

  isAlive() {
    return this.win && !this.win.isDestroyed();
  }
}

module.exports = { AgentWindow };
