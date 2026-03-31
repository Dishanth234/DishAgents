const { agentDefinitions } = require('../shared/agentDefinitions');
const { AgentWindow } = require('./AgentWindow');

class AgentManager {
  constructor() {
    this.agents = new Map(); // agentId -> AgentWindow
  }

  spawnAll() {
    for (const def of agentDefinitions) {
      const agentWin = new AgentWindow(def).create();
      this.agents.set(def.id, agentWin);
    }
  }

  getAgentPositions() {
    const positions = {};
    for (const [id, agentWin] of this.agents) {
      positions[id] = agentWin.getPosition();
    }
    return positions;
  }

  moveAgent(agentId, x, y) {
    const agentWin = this.agents.get(agentId);
    if (agentWin) agentWin.moveTo(x, y);
  }

  setMousePassthrough(agentId, ignore) {
    const agentWin = this.agents.get(agentId);
    if (agentWin) agentWin.setMousePassthrough(ignore);
  }

  broadcastToAll(channel, data) {
    for (const [, agentWin] of this.agents) {
      if (agentWin.isAlive()) {
        agentWin.webContents.send(channel, data);
      }
    }
  }

  sendToAgent(agentId, channel, data) {
    const agentWin = this.agents.get(agentId);
    if (agentWin && agentWin.isAlive()) {
      agentWin.webContents.send(channel, data);
    }
  }
}

module.exports = { AgentManager };
