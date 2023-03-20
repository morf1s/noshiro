import Event from '@/sturctures/Event';
import Noshiro from '@/sturctures/Noshiro';

class Ready extends Event {
  constructor(client: Noshiro) {
    super({
      client,
      name: 'Ready',
      emiter: 'ready',
    });
  }

  async run(): Promise<void> {
    this.client.logger.info(`${this.client.user?.username} ready to serve.`);
  }
}

export default Ready;
