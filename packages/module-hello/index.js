import { JaroWinklerDistance } from 'natural';
import { WebSocketModule } from '@assistant-os/utils';

import config from './config';

export default class extends WebSocketModule {
  constructor(props) {
    super({ label: 'hello', ...props });
  }

  evaluateProbability({ format, content /* , user */ }) {
    return new Promise((resolve, reject) => {
      if (format === 'text') {
        const distance = JaroWinklerDistance(content, 'hello');
        if (distance > config.minimal_distance) {
          resolve(1);
          return;
        }
      }

      resolve(0);
    });
  }

  answer(/* data */) {
    return new Promise(resolve => {
      resolve({
        format: 'text',
        content: 'Hello !'
      });
    });
  }
}
