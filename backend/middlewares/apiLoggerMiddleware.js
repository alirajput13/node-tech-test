const APILog = require('../models/APILog');

// Middleware function for logging API usage and storing in database
async function apiLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', async () => {
      const responseTime = Date.now() - start;
      // Create a new API log entry
      const apiLog = new APILog({
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: responseTime
      });
      try {
        // Save the API log entry to the database
        await apiLog.save();
      } catch (error) {
        console.error('Error saving API log:', error);
      }
    });
    next();
  }
  
  module.exports = apiLogger;