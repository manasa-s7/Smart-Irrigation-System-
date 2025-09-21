import { WeatherData, NASAData } from './weatherService'

interface IrrigationRecommendation {
  shouldIrrigate: boolean
  waterAmount: number // liters per square meter
  duration: number // minutes
  priority: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  nextCheck: Date
}

interface CropHealthAssessment {
  healthScore: number // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  issues: string[]
  recommendations: string[]
}

class AIRecommendationService {
  generateIrrigationRecommendation(
    soilMoisture: number,
    weather: WeatherData,
    nasaData: NASAData,
    cropType: string,
    fieldSize: number
  ): IrrigationRecommendation {
    let shouldIrrigate = false
    let waterAmount = 0
    let duration = 0
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low'
    let reason = ''

    // Crop-specific moisture thresholds
    const cropThresholds: { [key: string]: number } = {
      'tomatoes': 70,
      'wheat': 60,
      'corn': 65,
      'lettuce': 75,
      'potatoes': 55,
      'beans': 60
    }

    const threshold = cropThresholds[cropType.toLowerCase()] || 65

    // Analyze soil moisture
    if (soilMoisture < threshold) {
      shouldIrrigate = true
      
      if (soilMoisture < threshold * 0.4) {
        priority = 'critical'
        waterAmount = 25
        duration = 45
        reason = `Critical: Soil moisture at ${soilMoisture}% is dangerously low`
      } else if (soilMoisture < threshold * 0.6) {
        priority = 'high'
        waterAmount = 20
        duration = 35
        reason = `High: Soil moisture at ${soilMoisture}% requires immediate attention`
      } else if (soilMoisture < threshold * 0.8) {
        priority = 'medium'
        waterAmount = 15
        duration = 25
        reason = `Medium: Soil moisture at ${soilMoisture}% is below optimal level`
      }
    }

    // Consider weather conditions
    if (weather.precipitation > 5) {
      shouldIrrigate = false
      reason = `No irrigation needed: Recent precipitation of ${weather.precipitation}mm`
      priority = 'low'
    }

    // Factor in evapotranspiration
    if (nasaData.evapotranspiration > 6) {
      waterAmount *= 1.2
      duration *= 1.1
      reason += ` (Adjusted for high evapotranspiration: ${nasaData.evapotranspiration}mm)`
    }

    // Calculate next check time
    const nextCheck = new Date()
    nextCheck.setHours(nextCheck.getHours() + (priority === 'critical' ? 4 : priority === 'high' ? 8 : 12))

    return {
      shouldIrrigate,
      waterAmount: Math.round(waterAmount),
      duration: Math.round(duration),
      priority,
      reason,
      nextCheck
    }
  }

  assessCropHealth(
    soilMoisture: number,
    temperature: number,
    humidity: number,
    lightIntensity: number,
    cropType: string
  ): CropHealthAssessment {
    let healthScore = 100
    const issues: string[] = []
    const recommendations: string[] = []

    // Optimal ranges for different crops
    const optimalRanges: { [key: string]: any } = {
      'tomatoes': { moisture: [65, 85], temp: [18, 26], humidity: [60, 70] },
      'wheat': { moisture: [50, 70], temp: [15, 25], humidity: [50, 65] },
      'corn': { moisture: [60, 80], temp: [20, 30], humidity: [55, 75] },
      'lettuce': { moisture: [70, 90], temp: [12, 20], humidity: [65, 80] },
      'potatoes': { moisture: [45, 65], temp: [15, 22], humidity: [60, 75] },
      'beans': { moisture: [55, 75], temp: [18, 25], humidity: [60, 70] }
    }

    const ranges = optimalRanges[cropType.toLowerCase()] || optimalRanges['tomatoes']

    // Check soil moisture
    if (soilMoisture < ranges.moisture[0]) {
      healthScore -= 20
      issues.push('Low soil moisture detected')
      recommendations.push('Increase irrigation frequency')
    } else if (soilMoisture > ranges.moisture[1]) {
      healthScore -= 15
      issues.push('Excessive soil moisture')
      recommendations.push('Reduce irrigation or improve drainage')
    }

    // Check temperature
    if (temperature < ranges.temp[0] || temperature > ranges.temp[1]) {
      healthScore -= 15
      issues.push('Temperature stress detected')
      recommendations.push('Consider protective measures for temperature control')
    }

    // Check humidity
    if (humidity < ranges.humidity[0]) {
      healthScore -= 10
      issues.push('Low humidity levels')
      recommendations.push('Consider misting or humidity control')
    } else if (humidity > ranges.humidity[1]) {
      healthScore -= 10
      issues.push('High humidity may promote fungal growth')
      recommendations.push('Improve ventilation and air circulation')
    }

    // Check light intensity
    if (lightIntensity < 20000) {
      healthScore -= 12
      issues.push('Insufficient light exposure')
      recommendations.push('Ensure adequate sunlight or supplemental lighting')
    }

    // Determine status
    let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    if (healthScore >= 90) status = 'excellent'
    else if (healthScore >= 75) status = 'good'
    else if (healthScore >= 60) status = 'fair'
    else if (healthScore >= 40) status = 'poor'
    else status = 'critical'

    return {
      healthScore: Math.max(0, healthScore),
      status,
      issues,
      recommendations
    }
  }
}

export const aiRecommendationService = new AIRecommendationService()
export type { IrrigationRecommendation, CropHealthAssessment }