import config from './config/env.js';
import db from './config/database.js';
import logger from './utils/logger.js';
import { createApp } from './app.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`LucidMind API listening on port ${config.port} (${config.nodeEnv})`);
  db.ping()
    .then(() => logger.info('MySQL connection OK'))
    .catch((err) => logger.error('MySQL connection failed:', err.code || err.message));
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received, shutting down gracefully`);
  const force = setTimeout(() => process.exit(1), 10_000);
  force.unref();
  server.close(async () => {
    try {
      await db.close();
    } finally {
      process.exit(0);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => logger.error('Unhandled rejection:', reason));
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  shutdown('uncaughtException');
});
