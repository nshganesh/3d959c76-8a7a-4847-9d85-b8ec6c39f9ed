<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary">
            Estimated carbon savings and diesel savings
          </h1>
          <button class="btn btn-outline">
            <span>×</span>
          </button>
        </div>
        <div class="mt-2">
          <a href="#" class="text-sm text-primary-green hover:underline">
            Download general guidelines on the estimated carbon & diesel savings calculations.
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="container">
        <!-- Error Alert -->
        <div v-if="error" class="error-alert">
          <div class="flex items-center gap-2">
            <span>⚠️</span>
            <span>{{ error }}</span>
            <button @click="clearError" class="ml-auto">×</button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && !hasDevices" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading devices...</p>
        </div>

        <!-- Dashboard Content -->
        <div v-else-if="hasDevices" class="dashboard-content">
          <!-- Key Metrics Section -->
          <section class="metrics-section">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Carbon Savings -->
              <div class="card">
                <h2 class="text-lg font-semibold mb-4">Estimated carbon savings</h2>
                <div class="text-sm text-muted mb-2">1 Tonne = 1,000 kg</div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="metric">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">Total</span>
                      <span class="text-xs">ⓘ</span>
                    </div>
                    <div class="text-2xl font-bold text-primary-green">
                      {{ formatCarbon(totalCarbon) }} Tonnes
                    </div>
                  </div>
                  <div class="metric">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">Monthly</span>
                      <span class="text-xs">ⓘ</span>
                    </div>
                    <div class="text-2xl font-bold text-primary-green">
                      {{ formatCarbon(monthlyCarbon) }} Tonnes
                    </div>
                  </div>
                </div>
              </div>

              <!-- Diesel Savings -->
              <div class="card">
                <h2 class="text-lg font-semibold mb-4">Estimated diesel savings</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div class="metric">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">Total</span>
                      <span class="text-xs">ⓘ</span>
                    </div>
                    <div class="text-2xl font-bold text-primary-blue">
                      {{ formatDiesel(totalDiesel) }} Litres
                    </div>
                  </div>
                  <div class="metric">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">Monthly</span>
                      <span class="text-xs">ⓘ</span>
                    </div>
                    <div class="text-2xl font-bold text-primary-blue">
                      {{ formatDiesel(monthlyDiesel) }} Litres
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Date Range Selection -->
          <section class="date-section">
            <div class="card">
              <h3 class="text-lg font-semibold mb-4">Date Range</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    v-model="startDateInput"
                    @change="updateDateRange"
                    class="input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    v-model="endDateInput"
                    @change="updateDateRange"
                    class="input"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="setQuickDateRange(30)"
                  class="btn btn-outline"
                >
                  Last 30 days
                </button>
                <button 
                  @click="setQuickDateRange(60)"
                  class="btn btn-outline"
                >
                  Last 60 days
                </button>
                <button 
                  @click="setQuickDateRange(365)"
                  class="btn btn-outline"
                >
                  Last year
                </button>
              </div>
            </div>
          </section>

          <!-- Selected Date Range Summary -->
          <section class="summary-section">
            <div class="card">
              <h3 class="text-lg font-semibold mb-4">Summary of Selected Date Range</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="summary-item">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-sm">Estimated carbon savings</span>
                    <span class="text-xs">ⓘ</span>
                  </div>
                  <div class="text-lg font-semibold text-primary-green">
                    Sum of selected date range: {{ formatCarbon(totalCarbon) }} Tonnes
                  </div>
                </div>
                <div class="summary-item">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-sm">Estimated diesel savings</span>
                    <span class="text-xs">ⓘ</span>
                  </div>
                  <div class="text-lg font-semibold text-primary-blue">
                    Sum of selected date range: {{ formatDiesel(totalDiesel) }} Litres
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Chart Section -->
          <section class="chart-section">
            <div class="card-lg">
              <h3 class="text-lg font-semibold mb-4">Monthly Savings Trend</h3>
              <div v-if="chartData.length > 0" class="chart-container">
                <v-chart 
                  :option="chartOption" 
                  :loading="loading"
                  class="chart"
                />
              </div>
              <div v-else class="text-center text-muted py-8">
                No data available for the selected date range
              </div>
            </div>
          </section>
        </div>

        <!-- No Devices State -->
        <div v-else class="no-devices">
          <div class="text-center py-8">
            <p class="text-muted">No devices found</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useDeviceStore } from '@/stores/deviceStore'
import type { ChartDataPoint } from '@/types'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const deviceStore = useDeviceStore()

// Reactive data
const startDateInput = ref('')
const endDateInput = ref('')

// Computed properties
const {
  hasDevices,
  loading,
  error,
  chartData,
  totalCarbon,
  totalDiesel,
  monthlyCarbon,
  monthlyDiesel
} = deviceStore

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params: any) => {
      const carbonData = params.find((p: any) => p.seriesName === 'Carbon savings')
      const dieselData = params.find((p: any) => p.seriesName === 'Diesel savings')
      
      return `${params[0].axisValue}<br/>
        <span style="color: #10b981">●</span> Carbon: ${carbonData?.value || 0} Tonnes<br/>
        <span style="color: #3b82f6">●</span> Diesel: ${dieselData?.value || 0} Litres`
    }
  },
  legend: {
    data: ['Carbon savings', 'Diesel savings'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: chartData.value.map(item => item.month),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: [
    {
      type: 'value',
      name: 'Carbon (Tonnes)',
      position: 'left',
      axisLabel: {
        color: '#10b981'
      },
      nameTextStyle: {
        color: '#10b981'
      }
    },
    {
      type: 'value',
      name: 'Diesel (Litres)',
      position: 'right',
      axisLabel: {
        color: '#3b82f6'
      },
      nameTextStyle: {
        color: '#3b82f6'
      }
    }
  ],
  series: [
    {
      name: 'Carbon savings',
      type: 'bar',
      data: chartData.value.map(item => item.carbon),
      itemStyle: {
        color: '#10b981'
      },
      yAxisIndex: 0
    },
    {
      name: 'Diesel savings',
      type: 'bar',
      data: chartData.value.map(item => item.diesel),
      itemStyle: {
        color: '#3b82f6'
      },
      yAxisIndex: 1
    }
  ]
}))

// Methods
const formatCarbon = (value: number): string => {
  return value.toFixed(1)
}

const formatDiesel = (value: number): string => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k'
  }
  return value.toFixed(1)
}

const setQuickDateRange = (days: number) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  startDateInput.value = startDate.toISOString().slice(0, 16)
  endDateInput.value = endDate.toISOString().slice(0, 16)
  
  deviceStore.updateDateRange({
    startDate,
    endDate
  })
}

const updateDateRange = () => {
  const startDate = startDateInput.value ? new Date(startDateInput.value) : null
  const endDate = endDateInput.value ? new Date(endDateInput.value) : null
  
  deviceStore.updateDateRange({ startDate, endDate })
}

const clearError = () => {
  deviceStore.clearError()
}

// Lifecycle
onMounted(async () => {
  await deviceStore.fetchDevices()
  
  // Set default date range to last year
  const endDate = new Date()
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)
  
  startDateInput.value = startDate.toISOString().slice(0, 16)
  endDateInput.value = endDate.toISOString().slice(0, 16)
  
  deviceStore.updateDateRange({ startDate, endDate })
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--surface);
}

.header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: var(--shadow-md);
}

.main {
  padding: 2rem 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.metric {
  padding: 1rem;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border-light);
}

.error-alert {
  background: rgb(239 68 68 / 0.1);
  border: 1px solid var(--error);
  color: var(--error);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1rem;
}

.chart-container {
  position: relative;
  height: 400px;
}

.chart {
  height: 100%;
  width: 100%;
}

.summary-item {
  padding: 1rem;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border-light);
}

@media (max-width: 768px) {
  .header {
    padding: 1rem 0;
  }
  
  .main {
    padding: 1rem 0;
  }
  
  .dashboard-content {
    gap: 1rem;
  }
  
  .chart-container {
    height: 300px;
  }
}
</style> 