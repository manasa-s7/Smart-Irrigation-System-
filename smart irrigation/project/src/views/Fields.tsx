import React, { useState, useEffect } from 'react'
import FieldMap from '../components/Field/FieldMap'
import { Plus, Edit, Trash2, MapPin, Sprout, Ruler } from 'lucide-react'

interface Field {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  crop_type: string
  size: number
  created_at: string
}

const Fields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([
    {
      id: '1',
      name: 'North Field',
      location: { lat: 40.7128, lng: -74.0060 },
      crop_type: 'tomatoes',
      size: 2.5,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'South Field',
      location: { lat: 40.7589, lng: -73.9851 },
      crop_type: 'wheat',
      size: 3.2,
      created_at: '2024-01-20'
    },
    {
      id: '3',
      name: 'East Field',
      location: { lat: 40.7831, lng: -73.9712 },
      crop_type: 'corn',
      size: 4.1,
      created_at: '2024-02-01'
    }
  ])

  const [selectedField, setSelectedField] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newField, setNewField] = useState({
    name: '',
    crop_type: '',
    size: '',
    lat: '',
    lng: ''
  })

  // Load fields from localStorage on component mount
  useEffect(() => {
    const savedFields = localStorage.getItem('irrigation_fields')
    if (savedFields) {
      try {
        const parsedFields = JSON.parse(savedFields)
        if (Array.isArray(parsedFields) && parsedFields.length > 0) {
          setFields(parsedFields)
        }
      } catch (error) {
        console.error('Error loading fields from localStorage:', error)
      }
    }
  }, [])

  // Save fields to localStorage whenever fields change
  useEffect(() => {
    localStorage.setItem('irrigation_fields', JSON.stringify(fields))
  }, [fields])

  // Listen for add field events from quick actions
  useEffect(() => {
    const handleAddField = () => {
      setShowAddModal(true)
    }

    window.addEventListener('add-field', handleAddField)
    return () => {
      window.removeEventListener('add-field', handleAddField)
    }
  }, [])

  const handleAddField = () => {
    if (newField.name && newField.crop_type && newField.size && newField.lat && newField.lng) {
      const field: Field = {
        id: Date.now().toString(),
        name: newField.name,
        location: {
          lat: parseFloat(newField.lat),
          lng: parseFloat(newField.lng)
        },
        crop_type: newField.crop_type,
        size: parseFloat(newField.size),
        created_at: new Date().toISOString().split('T')[0]
      }
      
      setFields([...fields, field])
      setNewField({ name: '', crop_type: '', size: '', lat: '', lng: '' })
      setShowAddModal(false)
      
      // Show success message
      alert('Field added successfully!')
    }
  }

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      setFields(fields.filter(field => field.id !== fieldId))
      if (selectedField === fieldId) {
        setSelectedField('')
      }
    }
  }

  const cropTypes = ['tomatoes', 'wheat', 'corn', 'lettuce', 'potatoes', 'beans']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Field Management</h1>
          <p className="text-gray-600">Manage your irrigation fields and crop locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          data-action="add-field"
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Field</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{fields.length}</h3>
              <p className="text-sm text-gray-600">Total Fields</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Ruler className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {fields.reduce((sum, field) => sum + field.size, 0).toFixed(1)} ha
              </h3>
              <p className="text-sm text-gray-600">Total Area</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {new Set(fields.map(f => f.crop_type)).size}
              </h3>
              <p className="text-sm text-gray-600">Crop Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="lg:col-span-1">
          <FieldMap
            fields={fields}
            selectedFieldId={selectedField}
            onFieldClick={(field) => setSelectedField(field.id)}
            height="500px"
          />
        </div>

        {/* Fields List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Your Fields</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {fields.map(field => (
                <div 
                  key={field.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedField === field.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedField(field.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{field.name}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Sprout className="w-4 h-4" />
                          <span>{field.crop_type}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Ruler className="w-4 h-4" />
                          <span>{field.size} hectares</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{field.location.lat.toFixed(4)}, {field.location.lng.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteField(field.id)
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Field</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Name
                </label>
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) => setNewField({...newField, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter field name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  value={newField.crop_type}
                  onChange={(e) => setNewField({...newField, crop_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newField.size}
                  onChange={(e) => setNewField({...newField, size: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter field size"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newField.lat}
                    onChange={(e) => setNewField({...newField, lat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newField.lng}
                    onChange={(e) => setNewField({...newField, lng: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fields