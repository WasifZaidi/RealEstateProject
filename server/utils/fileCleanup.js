// utils/fileCleanup.js - Dedicated file cleanup utility
const fs = require('fs').promises;
const path = require('path');

class FileCleanupManager {
  static async cleanupFiles(files) {
    if (!files || !Array.isArray(files)) return;
    
    const cleanupPromises = files.map(async (file) => {
      try {
        if (file.path && await this.fileExists(file.path)) {
          await fs.unlink(file.path);
          console.log(`✅ Cleaned up temp file: ${file.originalname}`);
          return { success: true, file: file.originalname };
        }
      } catch (error) {
        console.warn(`⚠️ Failed to cleanup ${file.originalname}:`, error.message);
        return { success: false, file: file.originalname, error: error.message };
      }
    });

    const results = await Promise.allSettled(cleanupPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length;
    
    console.log(`📁 File cleanup: ${successful} successful, ${failed} failed`);
    
    return results;
  }

  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async cleanupDirectory(directoryPath, maxAgeMs = 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(directoryPath);
      const now = Date.now();
      
      const cleanupPromises = files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        try {
          const stats = await fs.stat(filePath);
          if (now - stats.mtimeMs > maxAgeMs) {
            await fs.unlink(filePath);
            console.log(`🧹 Cleaned up old temp file: ${file}`);
            return { success: true, file };
          }
        } catch (error) {
          console.warn(`⚠️ Failed to cleanup old file ${file}:`, error.message);
          return { success: false, file, error: error.message };
        }
      });

      await Promise.allSettled(cleanupPromises);
    } catch (error) {
      console.warn('⚠️ Could not read temp directory:', error.message);
    }
  }
}

module.exports = FileCleanupManager;