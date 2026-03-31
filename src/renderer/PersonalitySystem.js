export class PersonalitySystem {
  constructor(traits) {
    this.energy      = traits.energy      ?? 0.5;
    this.sociability = traits.sociability ?? 0.5;
    this.aggression  = traits.aggression  ?? 0.1;
    this.sleepiness  = traits.sleepiness  ?? 0.3;
    this.playfulness = traits.playfulness ?? 0.5;
  }

  getStateWeight(state) {
    const w = {
      idle:   1.0,
      walk:   0.5 + this.energy,
      sleep:  0.2 + this.sleepiness,
      jump:   this.energy * 0.8,
      play:   this.playfulness,
      happy:  this.playfulness * 0.5,
      fight:  this.aggression,
      cuddle: this.sociability * (1 - this.aggression),
      chase:  this.sociability * 0.5,
    };
    return Math.max(0.05, w[state] ?? 0.1);
  }
}
