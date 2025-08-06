const csvLoader = require('../services/csvLoader');

/**
 * Get all unique device IDs
 */
const getDevices = (req, res) => {
  try {
    const deviceIds = csvLoader.getUniqueDeviceIds();
    
    res.json({
      success: true,
      data: {
        devices: deviceIds.map(id => ({ id })),
        count: deviceIds.length
      },
      message: `Found ${deviceIds.length} unique devices`
    });
  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve devices',
      message: error.message
    });
  }
};

/**
 * Get device savings data with optional date range filtering
 */
const getDeviceSavings = (req, res) => {
  try {
    const deviceId = req.deviceId; // Already validated by middleware
    const startDate = req.startDate; // Already validated by middleware
    const endDate = req.endDate; // Already validated by middleware
    const limit = req.limit; // Already validated by middleware
    const offset = req.offset; // Already validated by middleware

    // Check if device exists
    const allDeviceIds = csvLoader.getUniqueDeviceIds();
    if (!allDeviceIds.includes(deviceId)) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        message: `Device with ID ${deviceId} does not exist`
      });
    }

    // Get device data with optional date filtering
    let deviceData = csvLoader.getDeviceDataInRange(deviceId, startDate, endDate);
    
    // Sort by timestamp
    deviceData.sort((a, b) => a.timestamp - b.timestamp);

    // Apply pagination
    const totalCount = deviceData.length;
    const paginatedData = deviceData.slice(offset, offset + limit);

    res.json({
      success: true,
      data: {
        device_id: deviceId,
        records: paginatedData,
        count: paginatedData.length,
        total_count: totalCount,
        pagination: {
          limit,
          offset,
          has_more: offset + limit < totalCount
        },
        date_range: {
          start_date: startDate ? startDate.toISOString() : null,
          end_date: endDate ? endDate.toISOString() : null
        }
      },
      message: `Retrieved ${paginatedData.length} records for device ${deviceId} (${totalCount} total)`
    });
  } catch (error) {
    console.error('Error getting device savings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve device savings',
      message: error.message
    });
  }
};

/**
 * Get device summary statistics
 */
const getDeviceSummary = (req, res) => {
  try {
    const deviceId = req.deviceId; // Already validated by middleware
    const startDate = req.startDate; // Already validated by middleware
    const endDate = req.endDate; // Already validated by middleware

    // Check if device exists
    const allDeviceIds = csvLoader.getUniqueDeviceIds();
    if (!allDeviceIds.includes(deviceId)) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        message: `Device with ID ${deviceId} does not exist`
      });
    }

    // Get device data with optional date filtering
    const deviceData = csvLoader.getDeviceDataInRange(deviceId, startDate, endDate);
    
    if (deviceData.length === 0) {
      return res.json({
        success: true,
        data: {
          device_id: deviceId,
          summary: {
            total_carbon_saved: 0,
            total_fuel_saved: 0,
            average_carbon_saved: 0,
            average_fuel_saved: 0,
            record_count: 0,
            date_range: {
              start: null,
              end: null
            }
          }
        },
        message: 'No data found for the specified criteria'
      });
    }

    // Calculate summary statistics
    const totalCarbonSaved = deviceData.reduce((sum, record) => sum + record.carbon_saved, 0);
    const totalFuelSaved = deviceData.reduce((sum, record) => sum + record.fuel_saved, 0);
    const averageCarbonSaved = totalCarbonSaved / deviceData.length;
    const averageFuelSaved = totalFuelSaved / deviceData.length;

    // Get date range
    const timestamps = deviceData.map(record => record.timestamp);
    const dataStartDate = new Date(Math.min(...timestamps));
    const dataEndDate = new Date(Math.max(...timestamps));

    res.json({
      success: true,
      data: {
        device_id: deviceId,
        summary: {
          total_carbon_saved: parseFloat(totalCarbonSaved.toFixed(6)),
          total_fuel_saved: parseFloat(totalFuelSaved.toFixed(6)),
          average_carbon_saved: parseFloat(averageCarbonSaved.toFixed(6)),
          average_fuel_saved: parseFloat(averageFuelSaved.toFixed(6)),
          record_count: deviceData.length,
          date_range: {
            start: dataStartDate.toISOString(),
            end: dataEndDate.toISOString()
          }
        }
      },
      message: `Summary calculated for ${deviceData.length} records`
    });
  } catch (error) {
    console.error('Error getting device summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve device summary',
      message: error.message
    });
  }
};

module.exports = {
  getDevices,
  getDeviceSavings,
  getDeviceSummary
}; 