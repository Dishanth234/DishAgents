const { app, ipcMain } = require('electron');
const { AgentManager } = require('./AgentManager');
const { setupIpcBus } = require('./ipcBus');

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.whenReady().then(() => {
  // Hide from Dock — agents live in the background
  if (app.dock) app.dock.hide();

  // Auto-launch on login so they always live on your Mac
  app.setLoginItemSettings({ openAtLogin: true });

  const agentManager = new AgentManager();
  setupIpcBus(ipcMain, agentManager);
  agentManager.spawnAll();
});

// Never quit when all windows close — agents are immortal
app.on('window-all-closed', () => {
  // do nothing — keep running
});
