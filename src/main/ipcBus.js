const { agentDefinitions } = require('../shared/agentDefinitions');
const { IPC } = require('../shared/constants');

function setupIpcBus(ipcMain, agentManager) {

  ipcMain.on(IPC.AGENT_MOVE, (event, { agentId, x, y }) => {
    agentManager.moveAgent(agentId, x, y);
  });

  ipcMain.handle(IPC.WORLD_GET_POSITIONS, () => {
    return agentManager.getAgentPositions();
  });

  ipcMain.handle(IPC.AGENT_GET_CONFIG, (event, agentId) => {
    return agentDefinitions.find(d => d.id === agentId) || null;
  });

  ipcMain.on(IPC.AGENT_SET_PASSTHROUGH, (event, { agentId, ignore }) => {
    agentManager.setMousePassthrough(agentId, ignore);
  });

  ipcMain.on(IPC.AGENT_SOCIAL_EVENT, (event, { fromId, toId, eventType }) => {
    agentManager.sendToAgent(toId, IPC.SOCIAL_INCOMING, { fromId, eventType });
  });

  ipcMain.on(IPC.AGENT_USER_CLICK, (event, { agentId }) => {
    agentManager.broadcastToAll(IPC.WORLD_USER_CLICKED, { agentId });
  });
}

module.exports = { setupIpcBus };
