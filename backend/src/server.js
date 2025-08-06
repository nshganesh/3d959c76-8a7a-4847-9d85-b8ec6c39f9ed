const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const csvLoader = require('./services/csvLoader');
const deviceRoutes = require('./routes/deviceRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Ampd Energy API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/devices', deviceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Ampd Energy API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      devices: '/api/devices',
      deviceSavings: '/api/devices/:deviceId/savings',
      deviceSummary: '/api/devices/:deviceId/summary'
    }
  });
});

// Global error handling middleware
app.use(errorHandler);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Ampd Energy API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Load CSV data on startup
  try {
    await csvLoader.loadAllData();
    console.log('📈 CSV data loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load CSV data:', error.message);
    process.exit(1);
  }
});

module.exports = app; 