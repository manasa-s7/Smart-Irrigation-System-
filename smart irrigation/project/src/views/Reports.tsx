import React, { useState } from 'react'
import { Download, FileText, Calendar, Filter, BarChart3 } from 'lucide-react'
import { dataExportService } from '../services/dataExportService'
import LineChart from '../components/Charts/LineChart'

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'irrigation' | 'crop' | 'weather'>('irrigation')
  const [dateRange, setDateRange] = useState({ start: '2024-02-01', end: '2024-02-28' })
  const [exporting, setExporting] = useState(false)

  // Mock data for reports
  const reportData = {
    irrigation: {
      totalWaterUsed: 15420,
      averageDuration: 32,
      mostActiveField: 'North Field',
      irrigationEvents: 45,
      efficiency: 87
    },
    crop: {
      healthyFields: 3,
      totalYield: 2840,
      averageHealthScore: 78,
      criticalAlerts: 2,
      growthRate: 12
    },
    weather: {
      averageTemp: 21,
      totalRainfall: 45,
      sunnyDays: 18,
      optimalDays: 24,
      extremeWeatherEvents: 1
    }
  }

  const chartData = {
    irrigation: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Water Usage (L)',
          data: [3200, 4100, 3800, 4320],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3
        },
        {
          label: 'Irrigation Events',
          data: [12, 15, 10, 8],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3
        }
      ]
    },
    crop: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Average Health Score',
          data: [72, 75, 78, 82],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.3
        },
        {
          label: 'Growth Rate (%)',
          data: [8, 10, 12, 15],
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.3
        }
      ]
    },
    weather: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [18, 21, 23, 19],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.3
        },
        {
          label: 'Rainfall (mm)',
          data: [5, 12, 8, 20],
          borderColor: 'rgb(6, 182, 212)',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          tension: 0.3
        }
      ]
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await dataExportService.exportToPDF('report-content', `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = () => {
    const data = [
      { date: '2024-02-01', value: 100, metric: 'Sample Data' },
      { date: '2024-02-02', value: 120, metric: 'Sample Data' },
      { date: '2024-02-03', value: 95, metric: 'Sample Data' }
    ]
    dataExportService.exportToCSV(data, `${reportType}-data-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const currentData = reportData[reportType]
  const currentChart = chartData[reportType]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate detailed reports and export data</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>
          
          <div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="irrigation">Irrigation Report</option>
              <option value="crop">Crop Health Report</option>
              <option value="weather">Weather Report</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {reportType === 'irrigation' && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{currentData.totalWaterUsed}L</p>
                  <p className="text-sm text-gray-600">Total Water Used</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{currentData.irrigationEvents}</p>
                  <p className="text-sm text-gray-600">Irrigation Events</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{currentData.averageDuration}min</p>
                  <p className="text-sm text-gray-600">Avg Duration</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{currentData.efficiency}%</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{currentData.mostActiveField}</p>
                  <p className="text-sm text-gray-600">Most Active</p>
                </div>
              </div>
            </>
          )}

          {reportType === 'crop' && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{currentData.healthyFields}</p>
                  <p className="text-sm text-gray-600">Healthy Fields</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{currentData.totalYield}kg</p>
                  <p className="text-sm text-gray-600">Expected Yield</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{currentData.averageHealthScore}%</p>
                  <p className="text-sm text-gray-600">Avg Health Score</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{currentData.criticalAlerts}</p>
                  <p className="text-sm text-gray-600">Critical Alerts</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{currentData.growthRate}%</p>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                </div>
              </div>
            </>
          )}

          {reportType === 'weather' && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{currentData.averageTemp}°C</p>
                  <p className="text-sm text-gray-600">Avg Temperature</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{currentData.totalRainfall}mm</p>
                  <p className="text-sm text-gray-600">Total Rainfall</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{currentData.sunnyDays}</p>
                  <p className="text-sm text-gray-600">Sunny Days</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{currentData.optimalDays}</p>
                  <p className="text-sm text-gray-600">Optimal Days</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{currentData.extremeWeatherEvents}</p>
                  <p className="text-sm text-gray-600">Extreme Events</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <LineChart
          data={currentChart}
          title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Trends`}
          height={400}
        />

        {/* Report Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Report Summary</h2>
          </div>
          
          <div className="prose max-w-none text-gray-700">
            {reportType === 'irrigation' && (
              <div>
                <p className="mb-4">
                  During the reporting period from {new Date(dateRange.start).toLocaleDateString()} to {new Date(dateRange.end).toLocaleDateString()}, 
                  the irrigation system recorded {currentData.irrigationEvents} irrigation events across all fields.
                </p>
                <p className="mb-4">
                  Total water consumption was {currentData.totalWaterUsed}L with an average irrigation duration of {currentData.averageDuration} minutes. 
                  The system achieved an efficiency rating of {currentData.efficiency}%, indicating optimal water usage.
                </p>
                <p>
                  The {currentData.mostActiveField} showed the highest irrigation activity, which aligns with its crop requirements and current growth stage.
                </p>
              </div>
            )}

            {reportType === 'crop' && (
              <div>
                <p className="mb-4">
                  Crop health assessment shows {currentData.healthyFields} out of {currentData.healthyFields + 1} fields maintaining healthy status, 
                  with an overall average health score of {currentData.averageHealthScore}%.
                </p>
                <p className="mb-4">
                  Expected total yield for this period is {currentData.totalYield}kg across all monitored crops. 
                  The growth rate has been consistently positive at {currentData.growthRate}%.
                </p>
                <p>
                  There are currently {currentData.criticalAlerts} critical alerts that require immediate attention to maintain optimal crop health.
                </p>
              </div>
            )}

            {reportType === 'weather' && (
              <div>
                <p className="mb-4">
                  Weather conditions during the reporting period were favorable with an average temperature of {currentData.averageTemp}°C 
                  and total rainfall of {currentData.totalRainfall}mm.
                </p>
                <p className="mb-4">
                  The period included {currentData.sunnyDays} sunny days and {currentData.optimalDays} days with optimal growing conditions. 
                  This represents excellent conditions for crop development.
                </p>
                <p>
                  Only {currentData.extremeWeatherEvents} extreme weather event was recorded, indicating stable and predictable conditions 
                  that support consistent irrigation scheduling.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports