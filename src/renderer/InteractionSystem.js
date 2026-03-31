export class InteractionSystem {
  constructor(agentId, stateMachine, personality) {
    this.agentId      = agentId;
    this.stateMachine = stateMachine;
    this.personality  = personality;
    this.pollTimer    = Math.random() * 1.5; // stagger agents' polls
    this.POLL_INTERVAL = 1.5;
    this.cooldown     = 0;
    this.INTERACT_DIST = 90;
  }

  update(dt) {
    this.cooldown -= dt;
    this.pollTimer += dt;

    if (this.pollTimer >= this.POLL_INTERVAL) {
      this.pollTimer = 0;
      this._checkProximity();
    }
  }

  async _checkProximity() {
    if (this.cooldown > 0) return;

    let positions;
    try {
      positions = await window.agentAPI.getWorldPositions();
    } catch {
      return;
    }

    const myPos = positions[this.agentId];
    if (!myPos) return;

    for (const [otherId, otherPos] of Object.entries(positions)) {
      if (otherId === this.agentId) continue;

      const dx   = myPos[0] - otherPos[0];
      const dy   = myPos[1] - otherPos[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.INTERACT_DIST) {
        this._triggerInteraction(otherId);
        break;
      }
    }
  }

  _triggerInteraction(otherId) {
    const roll = Math.random();
    let myEvent, theirEvent;

    if (roll < this.personality.aggression * 0.8) {
      myEvent    = 'fight';
      theirEvent = 'fight';
    } else if (roll < this.personality.aggression * 0.8 + this.personality.playfulness * 0.6) {
      myEvent    = 'play';
      theirEvent = 'play';
    } else if (this.personality.sociability > 0.5) {
      myEvent    = 'cuddle';
      theirEvent = 'cuddle';
    } else {
      myEvent    = 'chase';
      theirEvent = 'walk';
    }

    this.stateMachine.forceState(myEvent, 3.0);
    this.cooldown = 5.0;

    window.agentAPI.sendSocialEvent(this.agentId, otherId, theirEvent);
  }

  handleSocialEvent({ fromId, eventType }) {
    if (this.cooldown > 0) return;
    this.stateMachine.forceState(eventType, 3.0);
    this.cooldown = 4.0;
  }

  handleWorldClick({ agentId: clickedId }) {
    if (clickedId === this.agentId) return;
    // Mild jealousy: high-sociability agents chase the clicked agent
    if (Math.random() < this.personality.sociability * 0.25 && this.cooldown <= 0) {
      this.stateMachine.forceState('chase', 3.0);
      this.cooldown = 3.0;
    }
  }
}
