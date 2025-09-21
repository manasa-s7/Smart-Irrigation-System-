import React from 'react'
import { Plus, Droplets, Sprout, MapPin, Zap } from 'lucide-react'

interface QuickActionsProps {
  onAction: (action: string) => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'add-field',
      title: 'Add New Field',
      description: 'Create a new irrigation field',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'manual-irrigation',
      title: 'Start Irrigation',
      description: 'Manually control irrigation',
      icon: Droplets,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'add-crop',
      title: 'Add Crop',
      description: 'Register new crop type',
      icon: Sprout,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    {
      id: 'auto-mode',
      title: 'Auto Mode',
      description: 'Enable AI automation',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`
                w-full p-4 rounded-lg bg-gradient-to-r ${action.color} ${action.hoverColor} 
                text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions