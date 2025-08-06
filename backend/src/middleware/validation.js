/**
 * Validation middleware for device-related requests
 */

/**
 * Validate device ID parameter
 */
const validateDeviceId = (req, res, next) => {
  const { deviceId } = req.params;
  
  if (!deviceId) {
    return res.status(400).json({
      success: false,
      error: 'Missing device ID',
      message: 'Device ID is required'
    });
  }

  const deviceIdInt = parseInt(deviceId);
  if (isNaN(deviceIdInt) || deviceIdInt <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid device ID',
      message: 'Device ID must be a positive integer'
    });
  }

  req.deviceId = deviceIdInt;
  next();
};

/**
 * Validate date range query parameters
 */
const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Validate startDate if provided
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid start date',
        message: 'Start date must be a valid ISO date string'
      });
    }
    req.startDate = start;
  }

  // Validate endDate if provided
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid end date',
        message: 'End date must be a valid ISO date string'
      });
    }
    req.endDate = end;
  }

  // Validate date range logic
  if (req.startDate && req.endDate && req.startDate > req.endDate) {
    return res.status(400).json({
      success: false,
      error: 'Invalid date range',
      message: 'Start date must be before or equal to end date'
    });
  }

  next();
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { limit, offset } = req.query;

  // Validate limit if provided
  if (limit) {
    const limitInt = parseInt(limit);
    if (isNaN(limitInt) || limitInt <= 0 || limitInt > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit',
        message: 'Limit must be a positive integer between 1 and 1000'
      });
    }
    req.limit = limitInt;
  } else {
    req.limit = 100; // Default limit
  }

  // Validate offset if provided
  if (offset) {
    const offsetInt = parseInt(offset);
    if (isNaN(offsetInt) || offsetInt < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid offset',
        message: 'Offset must be a non-negative integer'
      });
    }
    req.offset = offsetInt;
  } else {
    req.offset = 0; // Default offset
  }

  next();
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid Input',
      message: 'Invalid data format provided'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
};

module.exports = {
  validateDeviceId,
  validateDateRange,
  validatePagination,
  errorHandler,
  notFoundHandler
}; 