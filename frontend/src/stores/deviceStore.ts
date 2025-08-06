import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { deviceApi } from '@/utils/api'
import type { 
  DeviceSavingsRecord, 
  DeviceSummaryResponse,
  DateRange,
  ChartDataPoint 
} from '@/types'

export const useDeviceStore = defineStore('device', () => {
  // State
  const devices = ref<Array<{ id: number }>>([])
  const selectedDeviceId = ref<number | null>(null)
  const deviceSavings = ref<DeviceSavingsRecord[]>([])
  const deviceSummary = ref<DeviceSummaryResponse['data']['summary'] | null>(null)
  const dateRange = ref<DateRange>({
    startDate: null,
    endDate: null
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasDevices = computed(() => devices.value.length > 0)
  const selectedDevice = computed(() => 
    devices.value.find(d => d.id === selectedDeviceId.value)
  )

  const chartData = computed((): ChartDataPoint[] => {
    if (!deviceSavings.value.length) return []

    const monthlyData = new Map<string, { carbon: number; diesel: number }>()

    deviceSavings.value.forEach(record => {
      const date = new Date(record.timestamp)
      const monthKey = date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { carbon: 0, diesel: 0 })
      }

      const monthData = monthlyData.get(monthKey)!
      monthData.carbon += record.carbon_saved
      monthData.diesel += record.fuel_saved
    })

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        carbon: parseFloat(data.carbon.toFixed(2)),
        diesel: parseFloat(data.diesel.toFixed(2))
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  })

  const totalCarbon = computed(() => 
    deviceSavings.value.reduce((sum, record) => sum + record.carbon_saved, 0)
  )

  const totalDiesel = computed(() => 
    deviceSavings.value.reduce((sum, record) => sum + record.fuel_saved, 0)
  )

  const monthlyCarbon = computed(() => {
    if (!deviceSavings.value.length) return 0
    const months = new Set(
      deviceSavings.value.map(r => 
        new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      )
    ).size
    return totalCarbon.value / months
  })

  const monthlyDiesel = computed(() => {
    if (!deviceSavings.value.length) return 0
    const months = new Set(
      deviceSavings.value.map(r => 
        new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      )
    ).size
    return totalDiesel.value / months
  })

  // Actions
  const fetchDevices = async () => {
    try {
      loading.value = true
      error.value = null
      console.log('Fetching devices...')
      const response = await deviceApi.getDevices()
      console.log('API response:', response)
      devices.value = response.data.devices
      console.log('Devices set:', devices.value)
      
      // Auto-select first device if none selected
      if (!selectedDeviceId.value && devices.value.length > 0) {
        selectedDeviceId.value = devices.value[0].id
      }
    } catch (err) {
      error.value = 'Failed to fetch devices'
      console.error('Error fetching devices:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDeviceSavings = async (deviceId: number, params?: {
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }) => {
    try {
      loading.value = true
      error.value = null
      const response = await deviceApi.getDeviceSavings(deviceId, params)
      deviceSavings.value = response.data.records
    } catch (err) {
      error.value = 'Failed to fetch device savings'
      console.error('Error fetching device savings:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDeviceSummary = async (deviceId: number, params?: {
    startDate?: string
    endDate?: string
  }) => {
    try {
      error.value = null
      const response = await deviceApi.getDeviceSummary(deviceId, params)
      deviceSummary.value = response.data.summary
    } catch (err) {
      error.value = 'Failed to fetch device summary'
      console.error('Error fetching device summary:', err)
    }
  }

  const selectDevice = async (deviceId: number) => {
    selectedDeviceId.value = deviceId
    await Promise.all([
      fetchDeviceSavings(deviceId, {
        startDate: dateRange.value.startDate?.toISOString(),
        endDate: dateRange.value.endDate?.toISOString(),
        limit: 1000 // Get more data for chart
      }),
      fetchDeviceSummary(deviceId, {
        startDate: dateRange.value.startDate?.toISOString(),
        endDate: dateRange.value.endDate?.toISOString()
      })
    ])
  }

  const updateDateRange = async (newDateRange: DateRange) => {
    dateRange.value = newDateRange
    
    if (selectedDeviceId.value) {
      await Promise.all([
        fetchDeviceSavings(selectedDeviceId.value, {
          startDate: newDateRange.startDate?.toISOString(),
          endDate: newDateRange.endDate?.toISOString(),
          limit: 1000
        }),
        fetchDeviceSummary(selectedDeviceId.value, {
          startDate: newDateRange.startDate?.toISOString(),
          endDate: newDateRange.endDate?.toISOString()
        })
      ])
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    devices,
    selectedDeviceId,
    deviceSavings,
    deviceSummary,
    dateRange,
    loading,
    error,

    // Getters
    hasDevices,
    selectedDevice,
    chartData,
    totalCarbon,
    totalDiesel,
    monthlyCarbon,
    monthlyDiesel,

    // Actions
    fetchDevices,
    fetchDeviceSavings,
    fetchDeviceSummary,
    selectDevice,
    updateDateRange,
    clearError
  }
}) 