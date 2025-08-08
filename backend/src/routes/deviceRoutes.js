const express = require('express');
const { getDevices, getDeviceMonthlyData, getDeviceSavings, getDeviceSummary } = require('../controllers/deviceController');
const { validateDeviceId, validateDateRange, validatePagination } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   GET /api/devices
 * @desc    Get all unique device IDs
 * @access  Public
 */
router.get('/', getDevices);

/**
 * @route   GET /api/devices/:deviceId/savings
 * @desc    Get device savings data with optional date range filtering
 * @access  Public
 * @query   startDate - Start date for filtering (ISO string)
 * @query   endDate - End date for filtering (ISO string)
 * @query   limit - Number of records to return (default: 100, max: 1000)
 * @query   offset - Number of records to skip (default: 0)
 */
router.get('/:deviceId/savings', validateDeviceId, validateDateRange, validatePagination, getDeviceSavings);

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

module.exports = router; 