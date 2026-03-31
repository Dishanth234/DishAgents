const WINDOW = {
  WIDTH: 80,
  HEIGHT: 120,
};

const SPRITE = {
  PIXEL_SIZE: 16,
  SCALE: 3,
  OFFSET_X: 8,
  OFFSET_Y: 12,
};

const IPC = {
  AGENT_MOVE: 'agent:move',
  AGENT_GET_CONFIG: 'agent:getConfig',
  AGENT_SET_PASSTHROUGH: 'agent:setMousePassthrough',
  AGENT_SOCIAL_EVENT: 'agent:socialEvent',
  AGENT_USER_CLICK: 'agent:userClick',
  WORLD_GET_POSITIONS: 'world:getPositions',
  SOCIAL_INCOMING: 'social:incoming',
  WORLD_USER_CLICKED: 'world:userClickedAgent',
};

const PROXIMITY = {
  INTERACT_DIST: 90,
  POLL_INTERVAL: 1.5,
  INTERACTION_COOLDOWN: 5.0,
};

module.exports = { WINDOW, SPRITE, IPC, PROXIMITY };
