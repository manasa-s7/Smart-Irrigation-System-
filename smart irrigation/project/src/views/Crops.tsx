import React, { useState, useEffect } from 'react'
import { aiRecommendationService } from '../services/aiRecommendationService'
import { Sprout, Heart, AlertTriangle, TrendingUp, Droplets, Thermometer, Sun, Eye } from 'lucide-react'

const Crops: React.FC = () => {
  const [selectedCropId, setSelectedCropId] = useState<string>('1')
  const [showAddCropModal, setShowAddCropModal] = useState(false)
  const [newCrop, setNewCrop] = useState({
    name: '',
    type: '',
    field_id: '',
    planted_date: ''
  })

  // Mock crop data - in real app, this would come from your database
  const [crops, setCrops] = useState([
    {
      id: '1',
      name: 'North Field Tomatoes',
      type: 'tomatoes',
      planted_date: '2024-01-15',
      expected_harvest: '2024-04-15',
      field_id: '1',
      soil_moisture: 45,
      temperature: 22,
      humidity: 65,
      light_intensity: 25000,
      growth_stage: 'flowering',
      days_since_planted: 45
    },
    {
      id: '2',
      name: 'South Field Wheat',
      type: 'wheat',
      planted_date: '2024-01-20',
      expected_harvest: '2024-06-20',
      field_id: '2',
      soil_moisture: 38,
      temperature: 20,
      humidity: 60,
      light_intensity: 28000,
      growth_stage: 'vegetative',
      days_since_planted: 40
    },
    {
      id: '3',
      name: 'East Field Corn',
      type: 'corn',
      planted_date: '2024-02-01',
      expected_harvest: '2024-07-01',
      field_id: '3',
      soil_moisture: 72,
      temperature: 24,
      humidity: 70,
      light_intensity: 30000,
      growth_stage: 'emergence',
      days_since_planted: 28
    }
  ])

  // Load crops from localStorage
  useEffect(() => {
    const savedCrops = localStorage.getItem('irrigation_crops')
    if (savedCrops) {
      try {
        const parsedCrops = JSON.parse(savedCrops)
        if (Array.isArray(parsedCrops) && parsedCrops.length > 0) {
          setCrops(parsedCrops)
        }
      } catch (error) {
        console.error('Error loading crops from localStorage:', error)
      }
    }
  }, [])

  // Save crops to localStorage
  useEffect(() => {
    localStorage.setItem('irrigation_crops', JSON.stringify(crops))
  }, [crops])

  // Listen for add crop events from quick actions
  useEffect(() => {
    const handleAddCrop = () => {
      setShowAddCropModal(true)
    }

    window.addEventListener('add-crop', handleAddCrop)
    return () => {
      window.removeEventListener('add-crop', handleAddCrop)
    }
  }, [])

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.type && newCrop.field_id && newCrop.planted_date) {
      const plantedDate = new Date(newCrop.planted_date)
      const expectedHarvestDate = new Date(plantedDate)
      
      // Add different harvest periods based on crop type
      const harvestDays = {
        tomatoes: 90,
        wheat: 150,
        corn: 120,
        lettuce: 60,
        potatoes: 100,
        beans: 80
      }
      
      expectedHarvestDate.setDate(plantedDate.getDate() + (harvestDays[newCrop.type as keyof typeof harvestDays] || 90))
      
      const daysSincePlanted = Math.floor((new Date().getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const crop = {
        id: Date.now().toString(),
        name: newCrop.name,
        type: newCrop.type,
        planted_date: newCrop.planted_date,
        expected_harvest: expectedHarvestDate.toISOString().split('T')[0],
        field_id: newCrop.field_id,
        soil_moisture: 50 + Math.random() * 30,
        temperature: 18 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        light_intensity: 20000 + Math.random() * 15000,
        growth_stage: daysSincePlanted < 14 ? 'emergence' : daysSincePlanted < 45 ? 'vegetative' : daysSincePlanted < 75 ? 'flowering' : 'fruiting',
        days_since_planted: daysSincePlanted
      }
      
      setCrops([...crops, crop])
      setNewCrop({ name: '', type: '', field_id: '', planted_date: '' })
      setShowAddCropModal(false)
      setSelectedCropId(crop.id)
      
      alert('Crop added successfully!')
    }
  }

  // Get available fields
  const fields = JSON.parse(localStorage.getItem('irrigation_fields') || '[]')
  const cropTypes = ['tomatoes', 'wheat', 'corn', 'lettuce', 'potatoes', 'beans']

  const selectedCrop = crops.find(crop => crop.id === selectedCropId) || crops[0]

  // Get health assessment for selected crop
  const healthAssessment = aiRecommendationService.assessCropHealth(
    selectedCrop.soil_moisture,
    selectedCrop.temperature,
    selectedCrop.humidity,
    selectedCrop.light_intensity,
    selectedCrop.type
  )

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-green-600 bg-green-100',
      fair: 'text-yellow-600 bg-yellow-100',
      poor: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    }
    return colors[status as keyof typeof colors] || colors.fair
  }

  const getGrowthStageColor = (stage: string) => {
    const colors = {
      emergence: 'bg-green-500',
      vegetative: 'bg-blue-500',
      flowering: 'bg-purple-500',
      fruiting: 'bg-orange-500',
      maturity: 'bg-yellow-500'
    }
    return colors[stage as keyof typeof colors] || colors.vegetative
  }

  const getGrowthProgress = (daysPlanted: number, totalDays: number = 90) => {
    return Math.min((daysPlanted / totalDays) * 100, 100)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crop Management</h1>
            <p className="text-gray-600">Monitor crop health and growth stages</p>
          </div>
          <button
            onClick={() => setShowAddCropModal(true)}
            data-action="add-crop"
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <Sprout className="w-5 h-5" />
            <span>Add Crop</span>
          </button>
        </div>
      </div>

      {/* Crop Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {crops.map(crop => (
          <div
            key={crop.id}
            className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedCropId === crop.id ? 'border-blue-500' : 'border-gray-100'
            }`}
            onClick={() => setSelectedCropId(crop.id)}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 ${getGrowthStageColor(crop.growth_stage)} rounded-lg`}>
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{crop.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{crop.type}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Growth Stage</span>
                  <span className="text-sm font-medium capitalize">{crop.growth_stage}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Growth Progress</span>
                    <span>{crop.days_since_planted} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 ${getGrowthStageColor(crop.growth_stage)} rounded-full transition-all duration-500`}
                      style={{ width: `${getGrowthProgress(crop.days_since_planted)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Health Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(aiRecommendationService.assessCropHealth(
                      crop.soil_moisture, crop.temperature, crop.humidity, crop.light_intensity, crop.type
                    ).status)
                  }`}>
                    {aiRecommendationService.assessCropHealth(
                      crop.soil_moisture, crop.temperature, crop.humidity, crop.light_intensity, crop.type
                    ).status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Assessment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-800">Health Assessment</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Health Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className={`w-24 h-24 rounded-full border-8 ${
                  healthAssessment.healthScore >= 80 ? 'border-green-500' :
                  healthAssessment.healthScore >= 60 ? 'border-yellow-500' :
                  healthAssessment.healthScore >= 40 ? 'border-orange-500' : 'border-red-500'
                } border-t-transparent animate-pulse`}>
                  <span className="text-2xl font-bold text-gray-800">
                    {healthAssessment.healthScore}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-600">Overall Health Score</p>
              <p className={`text-sm font-medium capitalize ${getStatusColor(healthAssessment.status)}`}>
                {healthAssessment.status}
              </p>
            </div>

            {/* Issues */}
            {healthAssessment.issues.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                  Identified Issues
                </h3>
                <div className="space-y-2">
                  {healthAssessment.issues.map((issue, index) => (
                    <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {healthAssessment.recommendations.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Recommendations
                </h3>
                <div className="space-y-2">
                  {healthAssessment.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Environmental Conditions</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-800">Soil Moisture</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-bold text-blue-600">{selectedCrop.soil_moisture}%</span>
                  <span className={`text-sm ${selectedCrop.soil_moisture > 60 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedCrop.soil_moisture > 60 ? 'Good' : 'Low'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-800">Temperature</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-bold text-red-600">{selectedCrop.temperature}°C</span>
                  <span className="text-sm text-green-600">Optimal</span>
                </div>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Eye className="w-5 h-5 text-cyan-500" />
                  <span className="font-medium text-gray-800">Humidity</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-bold text-cyan-600">{selectedCrop.humidity}%</span>
                  <span className="text-sm text-green-600">Good</span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-800">Light</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-bold text-yellow-600">{(selectedCrop.light_intensity / 1000).toFixed(0)}k</span>
                  <span className="text-sm text-green-600">Excellent</span>
                </div>
              </div>
            </div>

            {/* Growth Timeline */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-3">Growth Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Planted</span>
                  <span className="font-medium">{new Date(selectedCrop.planted_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expected Harvest</span>
                  <span className="font-medium">{new Date(selectedCrop.expected_harvest).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days Until Harvest</span>
                  <span className="font-medium text-green-600">
                    {Math.max(0, Math.ceil((new Date(selectedCrop.expected_harvest).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Crop</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Name
                </label>
                <input
                  type="text"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., North Field Tomatoes"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  value={newCrop.type}
                  onChange={(e) => setNewCrop({...newCrop, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field
                </label>
                <select
                  value={newCrop.field_id}
                  onChange={(e) => setNewCrop({...newCrop, field_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select field</option>
                  {fields.map((field: any) => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planted Date
                </label>
                <input
                  type="date"
                  value={newCrop.planted_date}
                  onChange={(e) => setNewCrop({...newCrop, planted_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowAddCropModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCrop}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Add Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Crops