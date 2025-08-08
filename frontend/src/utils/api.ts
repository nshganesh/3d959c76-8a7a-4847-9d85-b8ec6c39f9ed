import axios from 'axios'
import type { 
  DeviceSavingsResponse, 
  DeviceSummaryResponse, 
  DevicesResponse,
  DeviceMonthlyDataResponse
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const deviceApi = {
  // Get all devices
  async getDevices(): Promise<DevicesResponse> {
    const response = await api.get('/devices')
    return response.data
  },

  // Get aggregated monthly data for charts
  async getDeviceMonthlyData(
    deviceId: number,
    params?: {
      startDate?: string
      endDate?: string
    }
  ): Promise<DeviceMonthlyDataResponse> {
    const response = await api.get(`/devices/${deviceId}/monthly`, { params })
    return response.data
  },

  // Get device summary with optional date range
  async getDeviceSummary(
    deviceId: number,
    params?: {
      startDate?: string
      endDate?: string
    }
  ): Promise<DeviceSummaryResponse> {
    const response = await api.get(`/devices/${deviceId}/summary`, { params })
    return response.data
  }
}

export default api 