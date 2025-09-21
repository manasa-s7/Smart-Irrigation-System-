import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor: string
  trend?: number[]
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
  trend
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
            {change}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>

      {trend && (
        <div className="mt-4">
          <div className="flex items-end space-x-1 h-6">
            {trend.map((height, index) => (
              <div
                key={index}
                className={`${iconColor} rounded-sm flex-1 transition-all duration-500 ease-in-out`}
                style={{ height: `${height}%`, opacity: 0.7 + (height / 100) * 0.3 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatCard