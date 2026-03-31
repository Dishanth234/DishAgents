const { contextBridge, ipcRenderer } = require('electron');
const { IPC } = require('../shared/constants');

contextBridge.exposeInMainWorld('agentAPI', {
  getAgentId: () => new URLSearchParams(window.location.search).get('agentId'),

  getConfig: (agentId) => ipcRenderer.invoke(IPC.AGENT_GET_CONFIG, agentId),
  getWorldPositions: () => ipcRenderer.invoke(IPC.WORLD_GET_POSITIONS),

  move: (agentId, x, y) => ipcRenderer.send(IPC.AGENT_MOVE, { agentId, x, y }),
  setMousePassthrough: (agentId, ignore) =>
    ipcRenderer.send(IPC.AGENT_SET_PASSTHROUGH, { agentId, ignore }),
  sendSocialEvent: (fromId, toId, eventType) =>
    ipcRenderer.send(IPC.AGENT_SOCIAL_EVENT, { fromId, toId, eventType }),
  notifyUserClick: (agentId) =>
    ipcRenderer.send(IPC.AGENT_USER_CLICK, { agentId }),

  onSocialEvent: (cb) =>
    ipcRenderer.on(IPC.SOCIAL_INCOMING, (_, data) => cb(data)),
  onWorldUserClick: (cb) =>
    ipcRenderer.on(IPC.WORLD_USER_CLICKED, (_, data) => cb(data)),
});
