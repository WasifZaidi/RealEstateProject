
const cron = require('node-cron');
const FileCleanupManager = require('../utils/fileCleanup');
const path = require('path');
class ScheduledCleanupService {
  static start() {
    cron.schedule('0 * * * *', async () => {
      console.log('🕐 Running scheduled temp file cleanup...');
      try {
        await FileCleanupManager.cleanupDirectory(
          path.join(__dirname, '../uploads/temp'),
          1 * 60 * 60 * 1000 
        );
        console.log('✅ Scheduled cleanup completed');
      } catch (error) {
        console.error('❌ Scheduled cleanup failed:', error);
      }
    });

    console.log('🚀 Scheduled cleanup service started');
  }
}
module.exports = ScheduledCleanupService;