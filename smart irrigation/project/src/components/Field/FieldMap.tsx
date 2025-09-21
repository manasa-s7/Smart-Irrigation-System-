import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Field {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  crop_type: string
  size: number
}

interface FieldMapProps {
  fields: Field[]
  onFieldClick?: (field: Field) => void
  selectedFieldId?: string
  height?: string
}

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const FieldMap: React.FC<FieldMapProps> = ({ 
  fields, 
  onFieldClick, 
  selectedFieldId, 
  height = '400px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10) // Default to NYC

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !fields.length) return

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker))
    markersRef.current = []

    // Add field markers
    const bounds = L.latLngBounds([])
    
    fields.forEach(field => {
      const isSelected = selectedFieldId === field.id
      
      // Create custom icon based on crop type
      const cropIcons: { [key: string]: string } = {
        'tomatoes': '🍅',
        'wheat': '🌾',
        'corn': '🌽',
        'lettuce': '🥬',
        'potatoes': '🥔',
        'beans': '🫘'
      }

      const cropIcon = cropIcons[field.crop_type.toLowerCase()] || '🌱'
      
      const customIcon = L.divIcon({
        html: `
          <div class="field-marker ${isSelected ? 'selected' : ''}" style="
            background: ${isSelected ? '#3B82F6' : '#10B981'};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            ${cropIcon}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })

      const marker = L.marker([field.location.lat, field.location.lng], {
        icon: customIcon
      }).addTo(map)

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-gray-800">${field.name}</h3>
          <p class="text-sm text-gray-600">Crop: ${field.crop_type}</p>
          <p class="text-sm text-gray-600">Size: ${field.size} hectares</p>
        </div>
      `)

      if (onFieldClick) {
        marker.on('click', () => onFieldClick(field))
      }

      markersRef.current.push(marker)
      bounds.extend([field.location.lat, field.location.lng])
    })

    // Fit map to show all fields
    if (fields.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [fields, selectedFieldId, onFieldClick])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Field Locations</h3>
        <p className="text-sm text-gray-600">Click on markers to view field details</p>
      </div>
      <div 
        ref={mapRef} 
        style={{ height }} 
        className="w-full"
      />
      <style jsx>{`
        .field-marker:hover {
          transform: scale(1.1) !important;
        }
        .field-marker.selected {
          z-index: 1000 !important;
        }
      `}</style>
    </div>
  )
}

export default FieldMap