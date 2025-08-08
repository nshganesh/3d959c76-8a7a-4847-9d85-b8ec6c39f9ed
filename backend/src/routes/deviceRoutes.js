const express = require('express');
const { getDevices, getDeviceMonthlyData, getDeviceSummary, getDeviceHourlyData } = require('../controllers/deviceController');
const { validateDeviceId, validateDateRange } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/devices
 * @desc    Get all unique device IDs
 * @access  Public
 */
router.get('/', getDevices);

/**
 * @route   GET /api/devices/:deviceId/monthly
 * @desc    Get aggregated monthly data for charts with optional date range filtering
 * @access  Public
 * @query   startDate - Start date for filtering (ISO string)
 * @query   endDate - End date for filtering (ISO string)
 */
router.get('/:deviceId/monthly', validateDeviceId, validateDateRange, getDeviceMonthlyData);

/**
 * @route   GET /api/devices/:deviceId/summary
 * @desc    Get device summary statistics with optional date range filtering
 * @access  Public
 * @query   startDate - Start date for filtering (ISO string)
 * @query   endDate - End date for filtering (ISO string)
 */
router.get('/:deviceId/summary', validateDeviceId, validateDateRange, getDeviceSummary);

/**
 * @route   GET /api/devices/:deviceId/hourly
 * @desc    Get aggregated hourly data for 1-day zoom level with optional date range filtering
 * @access  Public
 * @query   startDate - Start date for filtering (ISO string)
 * @query   endDate - End date for filtering (ISO string)
 */
router.get('/:deviceId/hourly', validateDeviceId, validateDateRange, getDeviceHourlyData);

module.exports = router; 