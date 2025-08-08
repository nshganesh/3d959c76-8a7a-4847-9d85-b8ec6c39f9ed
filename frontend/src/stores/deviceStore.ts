import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { deviceApi } from '@/utils/api'
import type { 
  DeviceSummaryResponse,
  DeviceMonthlyDataResponse,
  Device,
  DateRange,
  ChartDataPoint 
} from '@/types'

export const useDeviceStore = defineStore('device', () => {
  // State
  const devices = ref<Device[]>([])
  const selectedDeviceId = ref<number | null>(null)
  const deviceSummary = ref<DeviceSummaryResponse['data']['summary'] | null>(null)
  const monthlyData = ref<ChartDataPoint[]>([])
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
    return monthlyData.value
  })

  const totalCarbon = computed(() => 
    deviceSummary.value?.total_carbon_saved || 0
  )

  const totalDiesel = computed(() => 
    deviceSummary.value?.total_fuel_saved || 0
  )

  const monthlyCarbon = computed(() => 
    deviceSummary.value?.average_carbon_saved || 0
  )

  const monthlyDiesel = computed(() => 
    deviceSummary.value?.average_fuel_saved || 0
  )

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

  const fetchDeviceMonthlyData = async (deviceId: number, params?: {
    startDate?: string
    endDate?: string
  }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await deviceApi.getDeviceMonthlyData(deviceId, params)
      monthlyData.value = response.data.monthly_data
      // Convert the monthly summary to match the device summary format
      deviceSummary.value = {
        ...response.data.summary,
        date_range: {
          start: '',
          end: ''
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch device monthly data'
      console.error('Error fetching device monthly data:', err)
    } finally {
      loading.value = false
    }
  }





  const selectDevice = async (deviceId: number) => {
    selectedDeviceId.value = deviceId
    await fetchDeviceMonthlyData(deviceId, {
      startDate: dateRange.value.startDate?.toISOString(),
      endDate: dateRange.value.endDate?.toISOString()
    })
  }

  const updateDateRange = async (newDateRange: DateRange) => {
    dateRange.value = newDateRange
    
    if (selectedDeviceId.value) {
      await fetchDeviceMonthlyData(selectedDeviceId.value, {
        startDate: newDateRange.startDate?.toISOString(),
        endDate: newDateRange.endDate?.toISOString()
      })
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    devices,
    selectedDeviceId,
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
    fetchDeviceMonthlyData,
    selectDevice,
    updateDateRange,
    clearError
  }
}) 