import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.apiPort, env.apiHost, () => {
  console.info(`ETF intelligent education API listening at http://${env.apiHost}:${env.apiPort}`);
});
