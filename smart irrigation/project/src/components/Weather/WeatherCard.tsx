import React from 'react'
import { Cloud, Droplets, Thermometer, Wind, Eye, Gauge } from 'lucide-react'
import { WeatherData } from '../../services/weatherService'

interface WeatherCardProps {
  weather: WeatherData
  nasaData?: {
    solarRadiation: number
    evapotranspiration: number
    soilTemperature: number
  }
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, nasaData }) => {
  const weatherItems = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${weather.temperature}°C`,
      color: 'text-red-500 bg-red-50'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.humidity}%`,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      icon: Cloud,
      label: 'Precipitation',
      value: `${weather.precipitation}mm`,
      color: 'text-gray-500 bg-gray-50'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${weather.windSpeed} km/h`,
      color: 'text-green-500 bg-green-50'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      color: 'text-purple-500 bg-purple-50'
    }
  ]

  const nasaItems = nasaData ? [
    {
      icon: Eye,
      label: 'Solar Radiation',
      value: `${nasaData.solarRadiation} MJ/m²`,
      color: 'text-orange-500 bg-orange-50'
    },
    {
      icon: Droplets,
      label: 'Evapotranspiration',
      value: `${nasaData.evapotranspiration} mm`,
      color: 'text-cyan-500 bg-cyan-50'
    },
    {
      icon: Thermometer,
      label: 'Soil Temperature',
      value: `${nasaData.soilTemperature}°C`,
      color: 'text-amber-500 bg-amber-50'
    }
  ] : []

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Current Weather</h3>
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-medium text-gray-700">{weather.description}</span>
          </div>
        </div>
      </div>

      {/* Weather Data */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {weatherItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* NASA Data */}
      {nasaData && (
        <>
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="text-md font-semibold text-gray-800 mb-4">NASA POWER Data</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nasaItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default WeatherCard