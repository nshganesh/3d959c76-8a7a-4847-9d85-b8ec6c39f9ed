const csvLoader = require('../services/csvLoader');

/**
 * Get all unique device IDs with names
 */
const getDevices = (req, res) => {
  try {
    const devices = csvLoader.getDevicesWithNames();
    
    res.json({
      success: true,
      data: {
        devices: devices,
        count: devices.length
      },
      message: `Found ${devices.length} unique devices`
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
 * Get aggregated monthly data for charts
 */
const getDeviceMonthlyData = (req, res) => {
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

    // Get device timezone
    const deviceTimezone = csvLoader.getDeviceTimezone(deviceId);
    
    // Get device data with optional date filtering
    const deviceData = csvLoader.getDeviceDataInRange(deviceId, startDate, endDate);
    
    if (deviceData.length === 0) {
      return res.json({
        success: true,
        data: {
          device_id: deviceId,
          device_timezone: deviceTimezone,
          monthly_data: [],
          summary: {
            total_carbon_saved: 0,
            total_fuel_saved: 0,
            average_carbon_saved: 0,
            average_fuel_saved: 0,
            record_count: 0
          }
        },
        message: 'No data found for the specified criteria'
      });
    }

    const monthlyData = new Map();
    
    deviceData.forEach(record => {
      const deviceDate = new Date(record.device_timestamp);
      const monthKey = deviceDate.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric'
      });

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { carbon: 0, diesel: 0, count: 0 });
      }

      const monthData = monthlyData.get(monthKey);
      monthData.carbon += record.carbon_saved;
      monthData.diesel += record.fuel_saved;
      monthData.count += 1;
    });

    // Convert to array and sort by date
    const monthlyArray = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        carbon: parseFloat(data.carbon.toFixed(2)),
        diesel: parseFloat(data.diesel.toFixed(2)),
        record_count: data.count
      }))
      .sort((a, b) => {
        // Parse the month string properly for sorting
        const dateA = new Date(a.month + ' 1, 2000');
        const dateB = new Date(b.month + ' 1, 2000');
        return dateA.getTime() - dateB.getTime();
      });

    // Calculate summary statistics
    const totalCarbonSaved = deviceData.reduce((sum, record) => sum + record.carbon_saved, 0);
    const totalFuelSaved = deviceData.reduce((sum, record) => sum + record.fuel_saved, 0);
    const averageCarbonSaved = totalCarbonSaved / deviceData.length;
    const averageFuelSaved = totalFuelSaved / deviceData.length;

    res.json({
      success: true,
      data: {
        device_id: deviceId,
        device_timezone: deviceTimezone,
        monthly_data: monthlyArray,
        summary: {
          total_carbon_saved: parseFloat(totalCarbonSaved.toFixed(6)),
          total_fuel_saved: parseFloat(totalFuelSaved.toFixed(6)),
          average_carbon_saved: parseFloat(averageCarbonSaved.toFixed(6)),
          average_fuel_saved: parseFloat(averageFuelSaved.toFixed(6)),
          record_count: deviceData.length
        }
      },
      message: `Aggregated data for ${monthlyArray.length} months from ${deviceData.length} records (Device timezone: ${deviceTimezone || 'UTC'})`
    });
  } catch (error) {
    console.error('Error getting device monthly data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve device monthly data',
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

/**
 * Get aggregated hourly data for 1-day zoom level
 */
const getDeviceHourlyData = (req, res) => {
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

    // Get device timezone
    const deviceTimezone = csvLoader.getDeviceTimezone(deviceId);
    
    // Get device data with optional date filtering
    const deviceData = csvLoader.getDeviceDataInRange(deviceId, startDate, endDate);
    
    if (deviceData.length === 0) {
      return res.json({
        success: true,
        data: {
          device_id: deviceId,
          device_timezone: deviceTimezone,
          hourly_data: [],
          summary: {
            total_carbon_saved: 0,
            total_fuel_saved: 0,
            average_carbon_saved: 0,
            average_fuel_saved: 0,
            record_count: 0
          }
        },
        message: 'No data found for the specified criteria'
      });
    }

    const hourlyData = new Map();
    
    deviceData.forEach(record => {
      const deviceDate = new Date(record.device_timestamp);
      const hourKey = deviceDate.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }) + ' ' + deviceDate.getHours().toString().padStart(2, '0') + ':00';

      if (!hourlyData.has(hourKey)) {
        hourlyData.set(hourKey, { carbon: 0, diesel: 0, count: 0 });
      }

      const hourData = hourlyData.get(hourKey);
      hourData.carbon += record.carbon_saved;
      hourData.diesel += record.fuel_saved;
      hourData.count += 1;
    });

    // Convert to array and sort by date
    const hourlyArray = Array.from(hourlyData.entries())
      .map(([hour, data]) => ({
        hour,
        carbon: parseFloat(data.carbon.toFixed(2)),
        diesel: parseFloat(data.diesel.toFixed(2)),
        record_count: data.count
      }))
      .sort((a, b) => {
        // Parse the hour string for sorting
        const dateA = new Date(a.hour);
        const dateB = new Date(b.hour);
        return dateA.getTime() - dateB.getTime();
      });

    // Calculate summary statistics
    const totalCarbonSaved = deviceData.reduce((sum, record) => sum + record.carbon_saved, 0);
    const totalFuelSaved = deviceData.reduce((sum, record) => sum + record.fuel_saved, 0);
    const averageCarbonSaved = totalCarbonSaved / deviceData.length;
    const averageFuelSaved = totalFuelSaved / deviceData.length;

    res.json({
      success: true,
      data: {
        device_id: deviceId,
        device_timezone: deviceTimezone,
        hourly_data: hourlyArray,
        summary: {
          total_carbon_saved: parseFloat(totalCarbonSaved.toFixed(6)),
          total_fuel_saved: parseFloat(totalFuelSaved.toFixed(6)),
          average_carbon_saved: parseFloat(averageCarbonSaved.toFixed(6)),
          average_fuel_saved: parseFloat(averageFuelSaved.toFixed(6)),
          record_count: deviceData.length
        }
      },
      message: `Aggregated hourly data for ${hourlyArray.length} hours from ${deviceData.length} records (Device timezone: ${deviceTimezone || 'UTC'})`
    });
  } catch (error) {
    console.error('Error getting device hourly data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve device hourly data',
      message: error.message
    });
  }
};

module.exports = {
  getDevices,
  getDeviceMonthlyData,
  getDeviceSummary,
  getDeviceHourlyData
}; 