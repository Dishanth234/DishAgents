import { AgentRenderer }        from './AgentRenderer.js';
import { AnimationController }  from './AnimationController.js';
import { StateMachine }         from './StateMachine.js';
import { MovementController }   from './MovementController.js';
import { PersonalitySystem }    from './PersonalitySystem.js';
import { InteractionSystem }    from './InteractionSystem.js';
import { InputHandler }         from './InputHandler.js';

const canvas = document.getElementById('agentCanvas');

async function init() {
  const agentId = window.agentAPI.getAgentId();
  if (!agentId) {
    console.error('No agentId in URL');
    return;
  }

  const config = await window.agentAPI.getConfig(agentId);
  if (!config) {
    console.error('No config for agent:', agentId);
    return;
  }

  const personality  = new PersonalitySystem(config.personality);
  const stateMachine = new StateMachine(config, personality);
  const animation    = new AnimationController();
  const movement     = new MovementController(stateMachine);
  const renderer     = new AgentRenderer(canvas, animation, config);
  const interaction  = new InteractionSystem(agentId, stateMachine, personality);
  const input        = new InputHandler(canvas, agentId, stateMachine, renderer);

  // Wire IPC listeners
  window.agentAPI.onSocialEvent(data => interaction.handleSocialEvent(data));
  window.agentAPI.onWorldUserClick(data => interaction.handleWorldClick(data));

  // Position throttling
  let lastReportX = -9999;
  let lastReportY = -9999;
  let lastMoveTime = 0;

  let lastTime = performance.now();

  function tick(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    stateMachine.update(dt);
    movement.update(dt);
    interaction.update(dt);
    animation.update(dt, stateMachine.currentState);

    // Update facing direction based on movement
    if (movement.targetX !== null) {
      renderer.setFacing(movement.targetX - movement.wx);
    }

    renderer.draw(stateMachine.currentState, config.name);

    // Throttled position reporting (~30fps max, only on meaningful change)
    const { wx, wy } = movement.getWindowPosition();
    const dx = Math.abs(wx - lastReportX);
    const dy = Math.abs(wy - lastReportY);
    if ((dx > 1 || dy > 1) && (timestamp - lastMoveTime) > 33) {
      window.agentAPI.move(agentId, wx, wy);
      lastReportX  = wx;
      lastReportY  = wy;
      lastMoveTime = timestamp;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

init().catch(console.error);
