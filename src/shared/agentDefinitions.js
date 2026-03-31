const agentDefinitions = [
  {
    id: 'mama',
    name: 'Mama',
    role: 'parent',
    personality: {
      energy:      0.4,
      sociability: 0.9,
      aggression:  0.1,
      sleepiness:  0.4,
      playfulness: 0.6,
    },
    spriteConfig: { colorVariant: 'salmon', scale: 3.5 },
  },
  {
    id: 'papa',
    name: 'Papa',
    role: 'parent',
    personality: {
      energy:      0.5,
      sociability: 0.7,
      aggression:  0.2,
      sleepiness:  0.7,
      playfulness: 0.4,
    },
    spriteConfig: { colorVariant: 'dusty_rose', scale: 3.5 },
  },
  {
    id: 'bubbly',
    name: 'Bubbly',
    role: 'child',
    personality: {
      energy:      0.95,
      sociability: 0.8,
      aggression:  0.05,
      sleepiness:  0.05,
      playfulness: 0.95,
    },
    spriteConfig: { colorVariant: 'light_peach', scale: 2.5 },
  },
  {
    id: 'grumpy',
    name: 'Grumpy',
    role: 'teen',
    personality: {
      energy:      0.6,
      sociability: 0.3,
      aggression:  0.75,
      sleepiness:  0.3,
      playfulness: 0.2,
    },
    spriteConfig: { colorVariant: 'deep_salmon', scale: 3.0 },
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    role: 'child',
    personality: {
      energy:      0.25,
      sociability: 0.5,
      aggression:  0.05,
      sleepiness:  0.85,
      playfulness: 0.5,
    },
    spriteConfig: { colorVariant: 'lavender_pink', scale: 2.8 },
  },
];

module.exports = { agentDefinitions };
