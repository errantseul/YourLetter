import serverless from 'serverless-http';
import { app, init } from '../../server/app.js';

let ready;
function ensureReady() {
  if (!ready) ready = init();
  return ready;
}

const rawHandler = serverless(app);

export const handler = async (event, context) => {
  await ensureReady();
  return rawHandler(event, context);
};
