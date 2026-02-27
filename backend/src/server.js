const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDB } = require('./config/db');
require('./models'); // Initialize models and associations

async function startServer() {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
