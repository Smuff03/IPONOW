import { env } from "@/config/env";
import { createApp } from "@/app";
import { startScheduledJobs } from "@/jobs/scheduler";
import { logger } from "@/utils/logger";

const app = createApp();

app.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port}`, { env: env.nodeEnv });
  startScheduledJobs();
});
