interface WeatherData {
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  pressure: number
  description: string
  icon: string
}

interface NASAData {
  solarRadiation: number
  evapotranspiration: number
  soilTemperature: number
}

class WeatherService {
  private readonly OPENWEATHER_API_KEY = 'demo-key' // Replace with actual API key
  private readonly NASA_POWER_BASE_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point'

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    // Simulate API call with realistic data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          temperature: Math.round(18 + Math.random() * 15),
          humidity: Math.round(40 + Math.random() * 40),
          precipitation: Math.round(Math.random() * 10),
          windSpeed: Math.round(Math.random() * 20),
          pressure: Math.round(1000 + Math.random() * 50),
          description: ['Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds', 'Light rain'][Math.floor(Math.random() * 5)],
          icon: '01d'
        })
      }, 1000)
    })
  }

  async getNASAPowerData(lat: number, lng: number): Promise<NASAData> {
    // Simulate NASA POWER API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          solarRadiation: Math.round(15 + Math.random() * 10),
          evapotranspiration: Math.round(3 + Math.random() * 4),
          soilTemperature: Math.round(12 + Math.random() * 8)
        })
      }, 1500)
    })
  }

  async getWeatherForecast(lat: number, lng: number, days: number = 7): Promise<WeatherData[]> {
    const forecast: WeatherData[] = []
    for (let i = 0; i < days; i++) {
      forecast.push({
        temperature: Math.round(15 + Math.random() * 15),
        humidity: Math.round(40 + Math.random() * 40),
        precipitation: Math.round(Math.random() * 15),
        windSpeed: Math.round(Math.random() * 25),
        pressure: Math.round(1000 + Math.random() * 50),
        description: ['Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds', 'Light rain'][Math.floor(Math.random() * 5)],
        icon: '01d'
      })
    }
    return Promise.resolve(forecast)
  }
}

export const weatherService = new WeatherService()
export type { WeatherData, NASAData }