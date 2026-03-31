const STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  SLEEP: 'sleep',
  JUMP: 'jump',
  PLAY: 'play',
  HAPPY: 'happy',
  FIGHT: 'fight',
  CUDDLE: 'cuddle',
  CHASE: 'chase',
};

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

module.exports = { STATES, TRANSITION_TABLE };
