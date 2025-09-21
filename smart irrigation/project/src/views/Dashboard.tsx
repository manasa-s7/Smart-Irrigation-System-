import React, { useState, useEffect } from 'react'
import StatCard from '../components/Dashboard/StatCard'
import QuickActions from '../components/Dashboard/QuickActions'
import LineChart from '../components/Charts/LineChart'
import FieldMap from '../components/Field/FieldMap'
import WeatherCard from '../components/Weather/WeatherCard'
import RecommendationCard from '../components/Recommendations/RecommendationCard'
import { Droplets, Sprout, MapPin, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { weatherService, WeatherData, NASAData } from '../services/weatherService'
import { aiRecommendationService } from '../services/aiRecommendationService'

const Dashboard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [nasaData, setNasaData] = useState<NASAData | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, this would come from your database
  const [fields] = useState([
    {
      id: '1',
      name: 'North Field',
      location: { lat: 40.7128, lng: -74.0060 },
      crop_type: 'tomatoes',
      size: 2.5,
      soil_moisture: 45,
      temperature: 22,
      humidity: 65,
      light_intensity: 25000
    },
    {
      id: '2',
      name: 'South Field',
      location: { lat: 40.7589, lng: -73.9851 },
      crop_type: 'wheat',
      size: 3.2,
      soil_moisture: 38,
      temperature: 20,
      humidity: 60,
      light_intensity: 28000
    },
    {
      id: '3',
      name: 'East Field',
      location: { lat: 40.7831, lng: -73.9712 },
      crop_type: 'corn',
      size: 4.1,
      soil_moisture: 72,
      temperature: 24,
      humidity: 70,
      light_intensity: 30000
    }
  ])

  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const [weatherData, nasaPowerData] = await Promise.all([
          weatherService.getCurrentWeather(40.7128, -74.0060),
          weatherService.getNASAPowerData(40.7128, -74.0060)
        ])
        
        setWeather(weatherData)
        setNasaData(nasaPowerData)
      } catch (error) {
        console.error('Error loading weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWeatherData()
  }, [])

  useEffect(() => {
    if (weather && nasaData) {
      const newRecommendations = fields.map(field => ({
        field,
        recommendation: aiRecommendationService.generateIrrigationRecommendation(
          field.soil_moisture,
          weather,
          nasaData,
          field.crop_type,
          field.size
        )
      }))
      setRecommendations(newRecommendations)
    }
  }, [weather, nasaData, fields])

  const handleQuickAction = (action: string) => {
    console.log('Quick action triggered:', action)
    switch (action) {
      case 'add-field':
        // Set active view to fields in parent component
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'fields' }))
        // Trigger add field modal after navigation
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('add-field'))
        }, 200)
        break
      case 'add-crop':
        // Set active view to crops in parent component
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'crops' }))
        // Trigger add crop modal after navigation
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('add-crop'))
        }, 200)
        break
      case 'manual-irrigation':
        // Start manual irrigation for the first field that needs it
        const needsIrrigation = recommendations.find(r => r.recommendation.shouldIrrigate)
        if (needsIrrigation) {
          handleStartIrrigation(needsIrrigation.field.id, needsIrrigation.recommendation.waterAmount, needsIrrigation.recommendation.duration)
        } else {
          alert('No fields currently need irrigation based on AI recommendations.')
        }
        break
      case 'auto-mode':
        // Toggle auto mode
        const autoMode = localStorage.getItem('irrigation_auto_mode') === 'true'
        localStorage.setItem('irrigation_auto_mode', (!autoMode).toString())
        alert(`Auto mode ${!autoMode ? 'enabled' : 'disabled'}`)
        break
      default:
        console.log('Quick action:', action)
    }
  }

  const handleStartIrrigation = (fieldId: string, waterAmount: number, duration: number) => {
    const field = fields.find(f => f.id === fieldId)
    if (!field) return

    // Create irrigation log
    const irrigationLog = {
      id: Date.now().toString(),
      field_id: fieldId,
      field_name: field.name,
      water_amount: waterAmount,
      duration: duration,
      timestamp: new Date().toISOString(),
      method: 'manual' as const,
      status: 'completed' as const
    }

    // Save to localStorage
    const existingLogs = JSON.parse(localStorage.getItem('irrigation_logs') || '[]')
    existingLogs.push(irrigationLog)
    localStorage.setItem('irrigation_logs', JSON.stringify(existingLogs))

    // Update field soil moisture (simulate irrigation effect)
    const updatedFields = fields.map(f => {
      if (f.id === fieldId) {
        return { ...f, soil_moisture: Math.min(100, f.soil_moisture + 25) }
      }
      return f
    })
    
    // Update localStorage with new soil moisture
    localStorage.setItem('irrigation_fields', JSON.stringify(updatedFields))
    
    alert(`Irrigation started for ${field.name}!\nWater: ${waterAmount}L/m²\nDuration: ${duration} minutes`)
    
    // Refresh the page to show updated data
    window.location.reload()
  }

  // Chart data for soil moisture trends
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'North Field',
        data: [65, 59, 48, 45, 56, 62, 45],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      },
      {
        label: 'South Field',
        data: [55, 42, 38, 45, 52, 48, 38],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3
      },
      {
        label: 'East Field',
        data: [75, 78, 72, 80, 85, 82, 72],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3
      }
    ]
  }

  const totalFields = fields.length
  const avgSoilMoisture = Math.round(fields.reduce((sum, field) => sum + field.soil_moisture, 0) / fields.length)
  const totalSize = fields.reduce((sum, field) => sum + field.size, 0)
  const activeIrrigations = recommendations.filter(r => r.recommendation.shouldIrrigate).length

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fields"
          value={totalFields}
          change="+2 this month"
          changeType="positive"
          icon={MapPin}
          iconColor="bg-blue-500"
          trend={[40, 60, 80, 70, 65, 85, 90]}
        />
        <StatCard
          title="Avg Soil Moisture"
          value={`${avgSoilMoisture}%`}
          change={avgSoilMoisture > 60 ? "Good levels" : "Needs attention"}
          changeType={avgSoilMoisture > 60 ? "positive" : "negative"}
          icon={Droplets}
          iconColor="bg-green-500"
          trend={[50, 45, 52, avgSoilMoisture-5, avgSoilMoisture, avgSoilMoisture+2, avgSoilMoisture]}
        />
        <StatCard
          title="Total Area"
          value={`${totalSize} ha`}
          change="Fully monitored"
          changeType="positive"
          icon={Sprout}
          iconColor="bg-emerald-500"
          trend={[30, 45, 60, 75, 85, 90, 100]}
        />
        <StatCard
          title="Active Alerts"
          value={activeIrrigations}
          change={activeIrrigations > 0 ? "Needs irrigation" : "All good"}
          changeType={activeIrrigations > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconColor="bg-orange-500"
          trend={[10, 15, 8, 12, activeIrrigations*10, 20, 15]}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <FieldMap 
            fields={fields} 
            height="400px"
            onFieldClick={(field) => console.log('Selected field:', field)}
          />
          
          {/* Soil Moisture Chart */}
          <LineChart
            data={chartData}
            title="Soil Moisture Trends (7 days)"
            height={300}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />
          
          {/* Weather Card */}
          {weather && (
            <WeatherCard 
              weather={weather} 
              nasaData={nasaData || undefined}
            />
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            AI Irrigation Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(({ field, recommendation }) => (
              <RecommendationCard
                key={field.id}
                recommendation={recommendation}
                fieldName={field.name}
                onApply={() => handleStartIrrigation(field.id, recommendation.waterAmount, recommendation.duration)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard