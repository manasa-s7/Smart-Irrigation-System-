import React from 'react'
import { AlertTriangle, CheckCircle, Clock, Droplets } from 'lucide-react'
import { IrrigationRecommendation } from '../../services/aiRecommendationService'
import { format } from 'date-fns'

interface RecommendationCardProps {
  recommendation: IrrigationRecommendation
  fieldName: string
  onApply?: () => void
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  fieldName,
  onApply 
}) => {
  const priorityConfig = {
    low: {
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: CheckCircle,
      textColor: 'text-green-800'
    },
    medium: {
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      icon: Clock,
      textColor: 'text-yellow-800'
    },
    high: {
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      icon: AlertTriangle,
      textColor: 'text-orange-800'
    },
    critical: {
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: AlertTriangle,
      textColor: 'text-red-800'
    }
  }

  const config = priorityConfig[recommendation.priority]
  const Icon = config.icon

  return (
    <div className={`rounded-xl border-2 p-6 transition-all hover:shadow-md ${config.color}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>
              {fieldName}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              Priority: {recommendation.priority}
            </p>
          </div>
        </div>
        
        {recommendation.shouldIrrigate && onApply && (
          <button
            onClick={onApply}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Droplets className="w-4 h-4" />
            <span>Apply</span>
          </button>
        )}
      </div>

      <div className={`mb-4 p-4 rounded-lg bg-white ${config.textColor}`}>
        <p className="text-sm font-medium">{recommendation.reason}</p>
      </div>

      {recommendation.shouldIrrigate && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-gray-600">Water Amount</p>
            <p className="font-semibold text-gray-800">
              {recommendation.waterAmount} L/m²
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-semibold text-gray-800">
              {recommendation.duration} minutes
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-3 rounded-lg">
        <p className="text-sm text-gray-600">Next Check</p>
        <p className="font-semibold text-gray-800">
          {format(recommendation.nextCheck, 'PPpp')}
        </p>
      </div>
    </div>
  )
}

export default RecommendationCard