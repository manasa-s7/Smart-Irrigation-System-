import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Papa from 'papaparse'

class DataExportService {
  exportToPDF(elementId: string, filename: string = 'irrigation-report.pdf'): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = document.getElementById(elementId)
      if (!element) {
        reject(new Error('Element not found'))
        return
      }

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        
        let position = 0
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        
        pdf.save(filename)
        resolve()
      }).catch(reject)
    })
  }

  exportToCSV(data: any[], filename: string = 'irrigation-data.csv'): void {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  importFromCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve(results.data)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  generateIrrigationReport(fields: any[], irrigationLogs: any[], sensorData: any[]): any {
    const currentDate = new Date().toLocaleDateString()
    
    return {
      title: 'Smart Irrigation System Report',
      generatedOn: currentDate,
      summary: {
        totalFields: fields.length,
        totalIrrigations: irrigationLogs.length,
        avgSoilMoisture: sensorData.reduce((sum, data) => sum + data.soil_moisture, 0) / sensorData.length,
        waterUsage: irrigationLogs.reduce((sum, log) => sum + log.water_amount, 0)
      },
      fields: fields.map(field => ({
        name: field.name,
        cropType: field.crop_type,
        size: field.size,
        location: field.location,
        recentIrrigation: irrigationLogs
          .filter(log => log.field_id === field.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0],
        latestSensorReading: sensorData
          .filter(data => data.field_id === field.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      }))
    }
  }
}

export const dataExportService = new DataExportService()