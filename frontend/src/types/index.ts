export interface DeviceSavingsRecord {
  device_id: number
  timestamp: string
  device_timestamp: string
  carbon_saved: number
  fuel_saved: number
}

export interface DeviceSavingsResponse {
  success: boolean
  data: {
    device_id: number
    records: DeviceSavingsRecord[]
    count: number
    total_count: number
    pagination: {
      limit: number
      offset: number
      has_more: boolean
    }
    date_range: {
      start_date: string | null
      end_date: string | null
    }
  }
  message: string
}

export interface DeviceSummaryResponse {
  success: boolean
  data: {
    device_id: number
    summary: {
      total_carbon_saved: number
      total_fuel_saved: number
      average_carbon_saved: number
      average_fuel_saved: number
      record_count: number
      date_range: {
        start: string
        end: string
      }
    }
  }
  message: string
}

export interface Device {
  id: number
  name: string
  timezone: string | null
}

export interface DevicesResponse {
  success: boolean
  data: {
    devices: Device[]
    count: number
  }
  message: string
}

export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

export interface ChartDataPoint {
  month: string
  carbon: number
  diesel: number
}

export interface DeviceMonthlyDataResponse {
  success: boolean
  data: {
    device_id: number
    monthly_data: ChartDataPoint[]
    summary: {
      total_carbon_saved: number
      total_fuel_saved: number
      average_carbon_saved: number
      average_fuel_saved: number
      record_count: number
    }
  }
  message: string
}

export interface SavingsMetrics {
  totalCarbon: number
  totalDiesel: number
  monthlyCarbon: number
  monthlyDiesel: number
} 