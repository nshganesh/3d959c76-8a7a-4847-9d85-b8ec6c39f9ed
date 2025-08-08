const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class CSVLoader {
  constructor() {
    this.deviceSavingsData = [];
    this.devicesData = [];
    this.isLoaded = false;
  }

  /**
   * Load device savings data from CSV file
   */
  async loadDeviceSavingsData() {
    return new Promise((resolve, reject) => {
      const csvPath = path.join(__dirname, '../../device-saving.csv');
      
      if (!fs.existsSync(csvPath)) {
        reject(new Error('device-saving.csv file not found'));
        return;
      }

      const results = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          // Parse and validate the data
          const parsedData = {
            device_id: parseInt(data.device_id),
            timestamp: new Date(data.timestamp),
            device_timestamp: new Date(data.device_timestamp),
            carbon_saved: parseFloat(data.carbon_saved),
            fuel_saved: parseFloat(data.fueld_saved)
          };

          // Validate that all required fields are present and valid
          if (this.isValidData(parsedData)) {
            results.push(parsedData);
          }
        })
        .on('end', () => {
          this.deviceSavingsData = results;
          this.isLoaded = true;
          console.log(`✅ Loaded ${results.length} device savings records`);
          resolve(results);
        })
        .on('error', (error) => {
          console.error('❌ Error loading device savings CSV:', error);
          reject(error);
        });
    });
  }

  /**
   * Load devices data from CSV file (if exists)
   */
  async loadDevicesData() {
    return new Promise((resolve, reject) => {
      const csvPath = path.join(__dirname, '../../devices.csv');
      
      if (!fs.existsSync(csvPath)) {
        console.log('⚠️  devices.csv file not found, skipping...');
        resolve([]);
        return;
      }

      const results = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          this.devicesData = results;
          console.log(`✅ Loaded ${results.length} device records`);
          resolve(results);
        })
        .on('error', (error) => {
          console.error('❌ Error loading devices CSV:', error);
          reject(error);
        });
    });
  }

  /**
   * Load all CSV data
   */
  async loadAllData() {
    try {
      await Promise.all([
        this.loadDeviceSavingsData(),
        this.loadDevicesData()
      ]);
      return {
        deviceSavings: this.deviceSavingsData,
        devices: this.devicesData
      };
    } catch (error) {
      console.error('❌ Error loading CSV data:', error);
      throw error;
    }
  }

  /**
   * Validate parsed data
   */
  isValidData(data) {
    return (
      data.device_id &&
      !isNaN(data.device_id) &&
      data.timestamp instanceof Date &&
      !isNaN(data.timestamp.getTime()) &&
      data.device_timestamp instanceof Date &&
      !isNaN(data.device_timestamp.getTime()) &&
      !isNaN(data.carbon_saved) &&
      !isNaN(data.fuel_saved)
    );
  }

  /**
   * Get all devices data
   */
  getDevicesData() {
    return this.devicesData;
  }

  /**
   * Get unique device IDs
   */
  getUniqueDeviceIds() {
    if (!this.isLoaded) {
      throw new Error('Data not loaded yet. Call loadAllData() first.');
    }
    const uniqueIds = [...new Set(this.deviceSavingsData.map(record => record.device_id))];
    return uniqueIds.sort((a, b) => a - b);
  }

  /**
   * Get devices with their names
   */
  getDevicesWithNames() {
    if (!this.isLoaded) {
      throw new Error('Data not loaded yet. Call loadAllData() first.');
    }
    
    const uniqueIds = this.getUniqueDeviceIds();
    const deviceMap = new Map();
    
    // Create a map of device ID to device data from devices.csv
    if (this.devicesData && this.devicesData.length > 0) {
      this.devicesData.forEach(device => {
        deviceMap.set(parseInt(device.id), {
          id: parseInt(device.id),
          name: device.name,
          timezone: device.timezone
        });
      });
    }
    
    // Return devices with names, fallback to just ID if name not found
    return uniqueIds.map(id => {
      const deviceData = deviceMap.get(id);
      return deviceData || { id, name: `Device ${id}`, timezone: null };
    });
  }

  /**
   * Get data for a specific device
   */
  getDeviceData(deviceId) {
    if (!this.isLoaded) {
      throw new Error('Data not loaded yet. Call loadAllData() first.');
    }
    return this.deviceSavingsData.filter(record => record.device_id === parseInt(deviceId));
  }

  /**
   * Get data for a specific device within a date range
   */
  getDeviceDataInRange(deviceId, startDate, endDate) {
    if (!this.isLoaded) {
      throw new Error('Data not loaded yet. Call loadAllData() first.');
    }
    
    const deviceData = this.getDeviceData(deviceId);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return deviceData.filter(record => {
      const recordDate = record.device_timestamp;
      
      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      
      return true;
    });
  }

  /**
   * Get device timezone
   */
  getDeviceTimezone(deviceId) {
    if (!this.isLoaded) {
      throw new Error('Data not loaded yet. Call loadAllData() first.');
    }
    
    const device = this.devicesData.find(d => parseInt(d.id) === parseInt(deviceId));
    return device ? device.timezone : null;
  }
}

module.exports = new CSVLoader(); 