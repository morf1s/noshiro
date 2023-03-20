import Noshiro from '@/sturctures/Noshiro';

class InteractionState {
  client: Noshiro;
  states: Record<string, UserInteractionState>;
  constructor() {
    this.states = {};
  }

  set(key: string, data: unknown, expire?: number) {
    if (!expire) expire = 60000;
    if (this.states[key]) clearTimeout(this.states[key].timeout);

    this.states[key] = {
      data: data,
      expire: expire,
      timeout: setTimeout(() => delete this.states[key], expire),
    };
  }

  get(key: string): unknown | undefined {
    return this.states[key] ? this.states[key].data : undefined;
  }
}

export default InteractionState;