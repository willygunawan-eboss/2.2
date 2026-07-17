# Transition Engine

Handles the logic of moving a Process Instance from one State to another.
- Validates current state.
- Validates transition existence.
- Evaluates role and approval requirements.
- Fires `STATE_CHANGED` events.