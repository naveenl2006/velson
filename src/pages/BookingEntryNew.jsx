import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import { 
  ChevronRight, Search, Printer, X, Trash2, Download, 
  FileSpreadsheet, FileJson, Filter, Settings, RotateCcw, 
  Plus, Save, Edit, Check, List, Barcode
} from 'lucide-react'
import { useToast } from '../components/Toast'
import axios from 'axios'

// ── Ultra-compact, premium UI primitives ──
const Label = ({ children, required }) => (
  <label className="inline-flex items-center text-[12.5px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
    {required && <span className="text-red-500 font-bold mr-1">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full px-2.5 py-1 text-[13px] h-[32px] border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] transition-all duration-150 ${readOnly ? 'bg-slate-50 cursor-not-allowed text-slate-500 font-bold' : 'hover:border-slate-400'} ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative w-full ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-2.5 py-1 pr-6 text-[13px] h-[32px] border border-slate-300 rounded bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] transition-all duration-150 hover:border-slate-400 cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

const SEED_BOOKINGS = [
  { id: 1, bookingId: 1813, bookingDate: '2026-04-15', customerName: 'APC DRILLING AND CONSTRUCTION PVT LTD', customerCode: 'CD1150183', customerVehicleCount: 1, vehicleSerialNo: 'CD1150183', serialNo: 'CD1150183', vehicleNo: 'KA-01-A-1234', serviceJobNo: '26-27/S000029', vehicleModelNo: 'VEDC', modelSubType: 'Crawler', vehicleName: 'Rig A', status: 'Pending', remarks: 'Seeded initial record.' },
  { id: 2, bookingId: 1814, bookingDate: '2026-04-13', customerName: 'SM DRILLING COMPANY', customerCode: 'SM Drilling 28', customerVehicleCount: 1, vehicleSerialNo: 'GH21188', serialNo: 'GH21188', vehicleNo: 'KA-02-B-5678', serviceJobNo: '24-25/S000002', vehicleModelNo: 'CORE DRILL', modelSubType: 'Trailer', vehicleName: 'Rig B', status: 'Confirmed', remarks: 'Seeded initial record.' },
  { id: 3, bookingId: 1815, bookingDate: '2026-04-09', customerName: 'SIVASAKTHI', customerCode: 'SIVA SAKTHI V2I', customerVehicleCount: 2, vehicleSerialNo: 'CD1150184', serialNo: 'CD1150184', vehicleNo: 'TN-09-C-9999', serviceJobNo: '24-25/S000003', vehicleModelNo: 'V2I', modelSubType: 'Truck Mount', vehicleName: 'Rig C', status: 'In-Service', remarks: 'Seeded initial record.' },
  { id: 4, bookingId: 1816, bookingDate: '2026-02-19', customerName: 'APC DRILLING AND CONSTRUCTION PVT LTD', customerCode: 'APC EDC 150 TRACK 3', customerVehicleCount: 1, vehicleSerialNo: 'CD1150184', serialNo: 'CD1150184', vehicleNo: 'AP-16-D-4444', serviceJobNo: '24-25/S000004', vehicleModelNo: 'CORE DRILL', modelSubType: 'Crawler', vehicleName: 'Rig D', status: 'Confirmed', remarks: 'Seeded record.' },
  { id: 5, bookingId: 1817, bookingDate: '2026-02-19', customerName: 'APC DRILLING AND CONSTRUCTION PVT LTD', customerCode: 'APC EDC 150 TRACK 4', customerVehicleCount: 1, vehicleSerialNo: 'CD1150185', serialNo: 'CD1150185', vehicleNo: 'TS-08-E-5555', serviceJobNo: '24-25/S000005', vehicleModelNo: 'CORE DRILL', modelSubType: 'Crawler', vehicleName: 'Rig E', status: 'Pending', remarks: 'Seeded record.' },
  { id: 6, bookingId: 1818, bookingDate: '2026-02-19', customerName: 'APC DRILLING AND CONSTRUCTION PVT LTD', customerCode: 'APC EDC 150 TRACK 5', customerVehicleCount: 1, vehicleSerialNo: 'CD1150186', serialNo: 'CD1150186', vehicleNo: 'MH-12-F-6666', serviceJobNo: '24-25/S000006', vehicleModelNo: 'CORE DRILL', modelSubType: 'Crawler', vehicleName: 'Rig F', status: 'In-Service', remarks: 'Seeded record.' },
  { id: 7, bookingId: 1819, bookingDate: '2026-01-29', customerName: 'APC DRILLING CONSTRUCTION', customerCode: 'APC EDC 200 TRACK 6', customerVehicleCount: 1, vehicleSerialNo: 'CD1150187', serialNo: 'CD1150187', vehicleNo: 'KA-51-M-8888', serviceJobNo: '24-25/S000007', vehicleModelNo: 'CORE DRILL', modelSubType: 'Trailer', vehicleName: 'Rig G', status: 'Pending', remarks: 'Seeded record.' }
]

export default function BookingEntryNew() {
  const toast = useToast()
  const [form, setForm] = useState({
    bookingId: 1820,
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerVehicleCount: '',
    vehicleSerialNo: '',
    customerCode: '',
    serialNo: '',
    vehicleNo: '',
    serviceJobNo: '26-27/S000029',
    vehicleModelNo: '',
    modelSubType: '',
    vehicleName: '',
    status: 'Pending',
    remarks: ''
  })

  const [bookings, setBookings] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBookings, setFilteredBookings] = useState([])
  const [pageLimit, setPageLimit] = useState(1)

  // Advanced reactive filters
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterModel, setFilterModel] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/service-booking')
        const parsed = res.data?.data || []
        setBookings(parsed)
        if (parsed.length > 0) {
          const maxId = Math.max(...parsed.map(b => b.bookingId))
          setForm(f => ({ ...f, bookingId: maxId + 1 }))
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err)
      }
    }
    fetchBookings()
  }, [])

  // Dynamic reactive filtering whenever search queries or advanced filters change
  useEffect(() => {
    const q = searchQuery.toLowerCase()
    const results = bookings.filter(b => {
      // 1. Text Search
      if (searchQuery) {
        const matchesQuery = 
          b.customerName.toLowerCase().includes(q) ||
          (b.customerCode || '').toLowerCase().includes(q) ||
          b.serviceJobNo.toLowerCase().includes(q) ||
          b.vehicleModelNo.toLowerCase().includes(q) ||
          (b.vehicleNo || '').toLowerCase().includes(q) ||
          b.vehicleName.toLowerCase().includes(q)
        if (!matchesQuery) return false
      }
      // 2. Status Filter
      if (filterStatus && b.status !== filterStatus) return false
      // 3. Model Filter
      if (filterModel && b.vehicleModelNo !== filterModel) return false
      
      return true
    })
    setFilteredBookings(results)
  }, [bookings, searchQuery, filterStatus, filterModel])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    if (!form.customerName || !form.vehicleModelNo || !form.modelSubType || !form.vehicleName) {
      toast.warning('Please fill in all required fields (Customer, Model No, Model SubType, Vehicle Name).')
      return
    }

    try {
      const payload = {
        ...form,
        customerVehicleCount: form.customerVehicleCount ? Number(form.customerVehicleCount) : 1
      };
      
      let updatedBookings
      if (editingId !== null) {
        const res = await axios.put(`/api/service-booking/${editingId}`, payload)
        updatedBookings = bookings.map(b => b.id === editingId ? res.data.data : b)
        toast.success('Booking updated successfully.')
        setEditingId(null)
      } else {
        const res = await axios.post('/api/service-booking', payload)
        updatedBookings = [res.data.data, ...bookings]
        toast.success('Booking entry saved successfully.')
      }

      setBookings(updatedBookings)
      setFilteredBookings(updatedBookings)
      handleClear()
    } catch (err) {
      console.error('Failed to save booking', err)
      toast.error('Failed to save booking. ' + (err.response?.data?.message || err.message))
    }
  }

  const handleEdit = (row) => {
    setForm(row)
    setEditingId(row.id)
    toast.warning(`Editing Booking #${row.bookingId}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Booking record?')) {
      try {
        await axios.delete(`/api/service-booking/${id}`)
        const updated = bookings.filter(b => b.id !== id)
        setBookings(updated)
        setFilteredBookings(updated)
        toast.error('Booking deleted successfully.')
        handleClear()
      } catch (err) {
        console.error('Failed to delete booking', err)
        toast.error('Failed to delete booking.')
      }
    }
  }

  const handleClear = () => {
    const nextBookingId = bookings.length > 0 ? Math.max(...bookings.map(b => b.bookingId)) + 1 : 1820
    setForm({
      bookingId: nextBookingId,
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      customerVehicleCount: '',
      vehicleSerialNo: '',
      customerCode: '',
      serialNo: '',
      vehicleNo: '',
      serviceJobNo: '26-27/S' + Math.floor(100000 + Math.random() * 900000),
      vehicleModelNo: '',
      modelSubType: '',
      vehicleName: '',
      status: 'Pending',
      remarks: ''
    })
    setEditingId(null)
  }

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredBookings(bookings)
      return
    }
    const q = searchQuery.toLowerCase()
    const results = bookings.filter(b => 
      b.customerName.toLowerCase().includes(q) ||
      b.customerCode.toLowerCase().includes(q) ||
      b.serviceJobNo.toLowerCase().includes(q) ||
      b.vehicleModelNo.toLowerCase().includes(q) ||
      b.vehicleNo.toLowerCase().includes(q)
    )
    setFilteredBookings(results)
  }

  const handlePrintBarcode = () => {
    if (!form.customerName) {
      toast.warning('Please enter details before printing barcode!')
      return
    }
    const printWindow = window.open('', '_blank', 'width=450,height=300')
    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode Booking Card - #${form.bookingId}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; text-align: center; }
            .ticket { border: 2px dashed #000; padding: 15px; border-radius: 8px; max-width: 380px; margin: 0 auto; }
            h2 { margin: 0 0 5px 0; font-size: 16px; font-weight: bold; text-transform: uppercase; }
            .details { text-align: left; font-size: 12px; margin: 10px 0; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 8px 0; }
            .details-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .label { font-weight: bold; text-transform: uppercase; }
            .barcode-lines { display: inline-flex; height: 35px; align-items: stretch; margin: 12px 0 4px 0; }
            .barcode-lines div { background-color: #000; margin-right: 1.5px; }
            .booking-no { font-size: 12px; font-weight: bold; letter-spacing: 3px; }
            .footer { font-size: 9px; color: #444; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h2>VELSON ERP BARCODE</h2>
            <div style="font-size: 12px; font-weight: bold;">BOOKING RECEIPT</div>
            <div class="details">
              <div class="details-row"><span class="label">Booking ID:</span><span>#${form.bookingId}</span></div>
              <div class="details-row"><span class="label">Date:</span><span>${form.bookingDate}</span></div>
              <div class="details-row"><span class="label">Job No:</span><span>${form.serviceJobNo}</span></div>
              <div class="details-row"><span class="label">Customer:</span><span style="max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${form.customerName}</span></div>
              <div class="details-row"><span class="label">Vehicle:</span><span>${form.vehicleName} (${form.vehicleNo || '—'})</span></div>
              <div class="details-row"><span class="label">Model/SN:</span><span>${form.vehicleModelNo} / ${form.vehicleSerialNo || '—'}</span></div>
            </div>
            
            <div class="barcode-lines">
              <div style="width: 3px;"></div><div style="width: 1px;"></div><div style="width: 2px;"></div><div style="width: 1px;"></div>
              <div style="width: 4px;"></div><div style="width: 1px;"></div><div style="width: 2px;"></div><div style="width: 3px;"></div>
              <div style="width: 1px;"></div><div style="width: 2px;"></div><div style="width: 4px;"></div><div style="width: 1px;"></div>
              <div style="width: 3px;"></div><div style="width: 2px;"></div><div style="width: 1px;"></div><div style="width: 4px;"></div>
              <div style="width: 2px;"></div><div style="width: 1px;"></div><div style="width: 3px;"></div><div style="width: 2px;"></div>
              <div style="width: 4px;"></div><div style="width: 1px;"></div><div style="width: 1px;"></div><div style="width: 3px;"></div>
              <div style="width: 2px;"></div><div style="width: 4px;"></div><div style="width: 1px;"></div><div style="width: 2px;"></div>
            </div>
            <div class="booking-no">*BK-${form.bookingId}*</div>
            <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
    toast.success(`Triggered barcode print flow for Booking #${form.bookingId}`)
  }

  const handleExportExcel = () => {
    if (filteredBookings.length === 0) {
      toast.warning('No bookings data available to export.')
      return
    }
    
    // Construct real Excel rows
    const data = filteredBookings.map((b, idx) => ({
      'S.No': idx + 1,
      'Booking ID': b.bookingId,
      'Booking Date': b.bookingDate,
      'Customer Name': b.customerName,
      'Customer Code': b.customerCode || '—',
      'Vehicle Count': b.customerVehicleCount || 1,
      'Serial No': b.vehicleSerialNo || b.serialNo || '—',
      'Vehicle No': b.vehicleNo || '—',
      'Service Job No': b.serviceJobNo,
      'Model No': b.vehicleModelNo,
      'Sub Type': b.modelSubType,
      'Vehicle Name': b.vehicleName,
      'Status': b.status,
      'Remarks': b.remarks || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings')
    
    // Download as a real binary Excel spreadsheet
    XLSX.writeFile(workbook, `bookings_list_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Successfully downloaded Bookings Excel spreadsheet!')
  }

  const handlePrintBookingList = () => {
    if (filteredBookings.length === 0) {
      toast.warning('No bookings in search list to print.')
      return
    }
    const printWindow = window.open('', '_blank', 'width=950,height=750')
    printWindow.document.write(`
      <html>
        <head>
          <title>Bookings List Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0097A7; padding-bottom: 15px; margin-bottom: 20px; }
            h1 { margin: 0; color: #0097A7; font-size: 24px; text-transform: uppercase; font-weight: 800; }
            p { margin: 3px 0; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #0097A7; color: white; font-size: 12px; text-transform: uppercase; font-weight: bold; padding: 8px; border: 1px solid #334155; }
            td { padding: 8px; border: 1px solid #e2e8f0; font-size: 12px; }
            .text-center { text-align: center; }
            .status-badge { font-weight: bold; text-transform: uppercase; font-size: 9px; padding: 2px 6px; border-radius: 4px; display: inline-block; }
            .status-Pending { background: #fef3c7; color: #d97706; }
            .status-Confirmed { background: #ecfdf5; color: #059669; }
            .status-In-Service { background: #eff6ff; color: #2563eb; }
            .status-Completed { background: #f0fdf4; color: #16a34a; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Velson ERP</h1>
              <p>Service Department bookings registry</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin:0; font-size:16px; color:#475569;">Bookings List</h2>
              <p>Total Records: ${filteredBookings.length}</p>
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">S.No</th>
                <th style="width: 8%">Booking ID</th>
                <th style="width: 10%">Date</th>
                <th style="width: 25%">Customer Name</th>
                <th style="width: 10%">Vehicle No</th>
                <th style="width: 12%">Job No</th>
                <th style="width: 10%">Model No</th>
                <th style="width: 10%">Vehicle Name</th>
                <th style="width: 10%">Status</th>
              </tr>
            </thead>
            <tbody>
              \${filteredBookings.map((b, idx) => \`
                <tr>
                  <td class="text-center">\${idx + 1}</td>
                  <td class="text-center font-bold" style="color: #0097A7;">#\${b.bookingId}</td>
                  <td class="text-center">\${b.bookingDate}</td>
                  <td><b>\${b.customerName}</b><br/><small style="color:#777;">\${b.customerCode || 'No code'}</small></td>
                  <td class="text-center font-mono">\${b.vehicleNo || '—'}</td>
                  <td class="text-center">\${b.serviceJobNo}</td>
                  <td class="text-center">\${b.vehicleModelNo}</td>
                  <td>\${b.vehicleName}</td>
                  <td class="text-center"><span class="status-badge status-\${b.status}">\${b.status}</span></td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
          <div class="footer">
            VELSON ERP - System Generated Report - Confidentially Printed
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
    toast.success('Successfully loaded Bookings registry print-out.')
  }

  const handleExportPdf = () => {
    if (filteredBookings.length === 0) {
      toast.warning('No bookings to export.')
      return
    }
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    // Title & Header background banner
    doc.setFillColor(0, 151, 167) // Teal
    doc.rect(0, 0, 297, 25, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('VELSON ERP - BOOKINGS REGISTRY REPORT', 15, 16)
    
    doc.setTextColor(100, 116, 139)
    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Total Bookings: ${filteredBookings.length}`, 240, 32)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 32)
    
    // Table Headers
    let startY = 38
    doc.setFillColor(44, 62, 80) // Dark slate
    doc.rect(15, startY, 267, 8, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.text('S.No', 17, startY + 5.5)
    doc.text('Booking ID', 28, startY + 5.5)
    doc.text('Date', 48, startY + 5.5)
    doc.text('Customer Name', 70, startY + 5.5)
    doc.text('Vehicle No', 145, startY + 5.5)
    doc.text('Job No', 175, startY + 5.5)
    doc.text('Model No', 215, startY + 5.5)
    doc.text('Vehicle Name', 238, startY + 5.5)
    doc.text('Status', 262, startY + 5.5)
    
    let currentY = startY + 8
    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(8)
    
    filteredBookings.forEach((b, idx) => {
      // Alternating row colors
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252)
        doc.rect(15, currentY, 267, 7, 'F')
      }
      
      doc.setTextColor(51, 65, 85)
      doc.text(String(idx + 1), 17, currentY + 4.5)
      
      doc.setTextColor(0, 151, 167)
      doc.setFont('Helvetica', 'bold')
      doc.text(`#${b.bookingId}`, 28, currentY + 4.5)
      
      doc.setTextColor(100, 116, 139)
      doc.setFont('Helvetica', 'normal')
      doc.text(b.bookingDate, 48, currentY + 4.5)
      
      doc.setTextColor(15, 23, 42)
      doc.setFont('Helvetica', 'bold')
      const truncatedCustomer = b.customerName.length > 34 ? b.customerName.substring(0, 34) + '...' : b.customerName
      doc.text(truncatedCustomer, 70, currentY + 4.5)
      
      doc.setTextColor(51, 65, 85)
      doc.setFont('Helvetica', 'normal')
      doc.text(b.vehicleNo || '—', 145, currentY + 4.5)
      doc.text(b.serviceJobNo, 175, currentY + 4.5)
      doc.text(b.vehicleModelNo, 215, currentY + 4.5)
      doc.text(b.vehicleName, 238, currentY + 4.5)
      
      if (b.status === 'Confirmed' || b.status === 'Completed') {
        doc.setTextColor(5, 150, 105)
      } else if (b.status === 'Pending') {
        doc.setTextColor(217, 119, 6)
      } else {
        doc.setTextColor(37, 99, 235)
      }
      doc.setFont('Helvetica', 'bold')
      doc.text(b.status, 262, currentY + 4.5)
      
      doc.setDrawColor(241, 245, 249)
      doc.line(15, currentY + 7, 282, currentY + 7)
      
      currentY += 7
      
      if (currentY > 185) {
        doc.addPage()
        doc.setFillColor(44, 62, 80)
        doc.rect(15, 10, 267, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('Helvetica', 'bold')
        doc.text('S.No', 17, 15.5)
        doc.text('Booking ID', 28, 15.5)
        doc.text('Date', 48, 15.5)
        doc.text('Customer Name', 70, 15.5)
        doc.text('Vehicle No', 145, 15.5)
        doc.text('Job No', 175, 15.5)
        doc.text('Model No', 215, 15.5)
        doc.text('Vehicle Name', 238, 15.5)
        doc.text('Status', 262, 15.5)
        currentY = 18
        doc.setFont('Helvetica', 'normal')
        doc.setFontSize(8)
      }
    })
    
    doc.save(`bookings_list_${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('Successfully downloaded Bookings PDF registry!')
  }

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden bg-[#f4f6f8] min-h-full pb-6">
      {/* Breadcrumb matching Vehicle Master (No Dashboard >) */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Service</span>
        <ChevronRight className="w-3 h-3 text-slate-400"/>
        <span className="text-[#0097A7] font-semibold">Booking Entry new</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        {/* Solid teal banner header matching legacy screenshots */}
        <div className="flex items-center justify-between bg-[#0097A7] text-white px-4 py-2.5 rounded-t-xl">
          <span className="font-bold text-[13px] uppercase tracking-wider">
            {editingId !== null ? 'Edit - Booking Entry Details' : 'Create - Booking Entry Details'}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrintBarcode} 
              className="bg-[#007a87] hover:bg-[#006873] border border-white/20 text-[12px] px-3 py-1 rounded transition-colors font-bold uppercase tracking-wider flex items-center gap-1"
            >
              Print Barcode
            </button>
            <button 
              onClick={handleExportExcel} 
              className="bg-[#007a87] hover:bg-[#006873] border border-white/20 text-[12px] px-3 py-1 rounded transition-colors font-bold uppercase tracking-wider flex items-center gap-1"
            >
              Excel
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="bg-[#007a87] hover:bg-[#006873] border border-white/20 text-[12px] px-3 py-1 rounded transition-colors font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Highly compact form fields */}
          <div className="grid grid-cols-12 gap-x-8 gap-y-2.5 mb-5 max-w-7xl mx-auto">
            
            {/* Left Column Fields */}
            <div className="col-span-6 space-y-2.5">
              {/* Row 1: Booking ID & Booking Date */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Booking ID :</Label>
                </div>
                <div className="col-span-3">
                  <Input value={form.bookingId} readOnly className="!font-bold text-[#0097A7] text-center" />
                </div>
                <div className="col-span-2 text-right pr-0.5">
                  <Label>Date :</Label>
                </div>
                <div className="col-span-3">
                  <Input type="date" value={form.bookingDate} onChange={u('bookingDate')} />
                </div>
              </div>

              {/* Row 2: Customer Name */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label required>Customer Name :</Label>
                </div>
                <div className="col-span-8">
                  <Select 
                    options={['APC DRILLING AND CONSTRUCTION PVT LTD', 'SM DRILLING COMPANY', 'SIVASAKTHI', 'APC DRILLING CONSTRUCTION', 'VKS Mining Services']} 
                    placeholder="Search Customer..." 
                    value={form.customerName} 
                    onChange={u('customerName')} 
                  />
                </div>
              </div>

              {/* Row 3: Customer Vehicle Count */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Customer Vehicle Count :</Label>
                </div>
                <div className="col-span-8">
                  <Input type="number" value={form.customerVehicleCount} onChange={u('customerVehicleCount')} placeholder="Customer Vehicle Count" />
                </div>
              </div>

              {/* Row 4: Vehicle Serial No */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Vehicle Serial No :</Label>
                </div>
                <div className="col-span-8">
                  <Select 
                    options={['CD1150183', 'GH21188', 'CD1150184', 'CD1150185', 'CD1150186', 'CD1150187']} 
                    placeholder="Select Serial No..." 
                    value={form.vehicleSerialNo} 
                    onChange={u('vehicleSerialNo')} 
                  />
                </div>
              </div>

              {/* Row 5: Customer Code */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Customer Code :</Label>
                </div>
                <div className="col-span-8">
                  <Input value={form.customerCode} onChange={u('customerCode')} placeholder="Customer Code" />
                </div>
              </div>

              {/* Row 6: Serial No (Manual field) */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Serial No :</Label>
                </div>
                <div className="col-span-8">
                  <Input value={form.serialNo} onChange={u('serialNo')} placeholder="Serial No" />
                </div>
              </div>

              {/* Row 7: Vehicle No */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Vehicle No :</Label>
                </div>
                <div className="col-span-8">
                  <Input value={form.vehicleNo} onChange={u('vehicleNo')} placeholder="Vehicle No" />
                </div>
              </div>
            </div>

            {/* Right Column Fields */}
            <div className="col-span-6 space-y-2.5 border-l border-slate-100 pl-6">
              {/* Row 1: Service Job No */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Job No :</Label>
                </div>
                <div className="col-span-8">
                  <Input value={form.serviceJobNo} readOnly className="!font-bold text-slate-600 bg-slate-50" />
                </div>
              </div>

              {/* Row 2: Vehicle Model No */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label required>Vehicle Model No :</Label>
                </div>
                <div className="col-span-8">
                  <Select 
                    options={['VEDC', 'CORE DRILL', 'V2I', 'V9', 'V10', 'V2i']} 
                    placeholder="Select Model..." 
                    value={form.vehicleModelNo} 
                    onChange={u('vehicleModelNo')} 
                  />
                </div>
              </div>

              {/* Row 3: Model Sub Type */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label required>Model Subtype :</Label>
                </div>
                <div className="col-span-8">
                  <Select 
                    options={['Crawler', 'Trailer', 'Truck Mount', 'Sling Mount']} 
                    placeholder="Select Sub Type..." 
                    value={form.modelSubType} 
                    onChange={u('modelSubType')} 
                  />
                </div>
              </div>

              {/* Row 4: Vehicle Name */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label required>Vehicle Name :</Label>
                </div>
                <div className="col-span-8">
                  <Select 
                    options={['Rig A', 'Rig B', 'Rig C', 'Rig D', 'Rig E', 'Rig F', 'Rig G']} 
                    placeholder="Select Vehicle Name..." 
                    value={form.vehicleName} 
                    onChange={u('vehicleName')} 
                  />
                </div>
              </div>

              {/* Row 5: Status */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 text-right pr-1">
                  <Label>Status :</Label>
                </div>
                <div className="col-span-8">
                  <Select 
                    options={['Pending', 'Confirmed', 'In-Service', 'Completed']} 
                    placeholder="Select Status..." 
                    value={form.status} 
                    onChange={u('status')} 
                  />
                </div>
              </div>

              {/* Row 6: Remarks */}
              <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-4 text-right pr-1 pt-1">
                  <Label>Remarks :</Label>
                </div>
                <div className="col-span-8">
                  <textarea 
                    value={form.remarks} 
                    onChange={u('remarks')} 
                    placeholder="Enter Remarks here..."
                    className="w-full h-[50px] px-2.5 py-1 text-[12px] border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] transition-all hover:border-slate-400 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compact Action Toolbar containing only form action operations */}
          <div className="flex flex-wrap items-center justify-between border border-slate-200 py-1.5 mb-4 bg-slate-50/50 px-3 rounded-lg max-w-7xl mx-auto shadow-sm gap-2">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search Booking..." 
                className="px-2.5 py-1 text-[13px] h-[32px] border border-slate-300 rounded w-60 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7]"
              />
              <button 
                onClick={handleSearch} 
                className="flex items-center gap-1 px-3 py-1 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95"
              >
                <Search size={12} /> Search
              </button>
              <button 
                onClick={() => { setSearchQuery(''); setFilteredBookings(bookings); }} 
                className="text-slate-400 hover:text-[#0097A7] text-[12px] font-bold uppercase tracking-wider ml-1"
              >
                Display All
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button 
                onClick={handleSave} 
                className="flex items-center gap-1 px-3 py-1 bg-[#27ae60] hover:bg-[#229954] text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
              >
                <Save size={12} /> {editingId !== null ? 'Update' : 'Create'}
              </button>
              <button 
                onClick={() => {
                  if (editingId !== null) {
                    toast.success('Form is already in edit mode.');
                  } else {
                    toast.warning('Please select a record from the table below to edit.');
                  }
                }} 
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
              >
                <Edit size={12} className="text-[#0097A7]" /> Edit
              </button>
              <button 
                onClick={() => {
                  if (editingId !== null) {
                    handleDelete(editingId);
                  } else {
                    toast.warning('Please select/edit a record to delete.');
                  }
                }} 
                className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
              >
                <Trash2 size={12} /> Delete
              </button>
              <button 
                onClick={handleClear} 
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
              >
                <RotateCcw size={12} /> Clear
              </button>
            </div>
          </div>

          {/* Solid sub-banner for Booking list */}
          <div className="max-w-7xl mx-auto bg-[#0097A7] text-white px-4 py-1.5 rounded-t-lg font-bold text-xs uppercase tracking-wider shadow-sm">
            Bookings List
          </div>

          {/* Table Section with compact elements */}
          <div className="max-w-7xl mx-auto border border-slate-200 rounded-b-lg overflow-hidden shadow-sm bg-white mb-3">
            <div className="flex items-center justify-end py-1 bg-slate-50/50 px-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">LS</span>
                <input
                  type="number"
                  value={pageLimit}
                  onChange={e => setPageLimit(e.target.value)}
                  className="w-10 text-center py-[2px] border border-slate-200 rounded text-[13px] font-bold text-slate-700 bg-white h-[26px] focus:outline-none focus:border-[#0097A7] focus:ring-1 focus:ring-[#0097A7]"
                />
              </div>
              <div className="flex items-center gap-1">
                {[
                  { icon: <Printer size={12} />, l: 'Dos' },
                  { icon: <FileSpreadsheet size={12} className="text-green-600" />, l: 'Excel' },
                  { icon: <Download size={12} className="text-red-500" />, l: 'Pdf' },
                  { icon: <Filter size={12} className="text-[#0097A7]" />, l: 'Filter' },
                  { icon: <Settings size={12} className="text-slate-500" />, l: 'Setting' },
                ].map(tool => (
                  <button 
                    key={tool.l} 
                    onClick={() => {
                      if (tool.l === 'Dos') handlePrintBookingList();
                      else if (tool.l === 'Excel') handleExportExcel();
                      else if (tool.l === 'Pdf') handleExportPdf();
                      else toast.success(`${tool.l} tool activated.`);
                    }}
                    className="flex items-center gap-0.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold uppercase rounded shadow-sm transition-all active:scale-95"
                  >
                    {tool.icon} {tool.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead className="bg-slate-50 text-[12px] uppercase text-slate-400 font-bold border-b border-slate-200">
                  <tr className="h-8">
                    <th className="px-3 py-1 border-r border-slate-100 w-16 text-center">S.No</th>
                    <th className="px-3 py-1 border-r border-slate-100 w-24 text-center">Booking Id</th>
                    <th className="px-3 py-1 border-r border-slate-100 w-28">Booking Date</th>
                    <th className="px-3 py-1 border-r border-slate-100 w-[280px]">Customer Name</th>
                    <th className="px-3 py-1 border-r border-slate-100">Customer Code</th>
                    <th className="px-3 py-1 border-r border-slate-100 text-center w-24">Vehicle Count</th>
                    <th className="px-3 py-1 border-r border-slate-100">Serial No</th>
                    <th className="px-3 py-1 border-r border-slate-100">Vehicle No</th>
                    <th className="px-3 py-1 border-r border-slate-100">Service Job.No</th>
                    <th className="px-3 py-1">Model No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12.5px]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-300 italic">
                        No Booking records found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((row, idx) => (
                      <tr 
                        key={row.id} 
                        onClick={() => handleEdit(row)}
                        className={`hover:bg-[#0097A7]/5 cursor-pointer transition-colors h-9 ${editingId === row.id ? 'bg-[#0097A7]/10 font-semibold' : ''}`}
                      >
                        <td className="px-3 py-1 border-r border-slate-50 text-center text-slate-500 font-bold bg-slate-50/50">{idx + 1}</td>
                        <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-[#0097A7]">{row.bookingId}</td>
                        <td className="px-3 py-1 border-r border-slate-50 font-bold text-slate-500">{row.bookingDate}</td>
                        <td className="px-3 py-1 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                        <td className="px-3 py-1 border-r border-slate-50 text-slate-600 font-medium">{row.customerCode || '—'}</td>
                        <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-slate-500">{row.customerVehicleCount || 1}</td>
                        <td className="px-3 py-1 border-r border-slate-50 font-semibold text-slate-600">{row.serialNo || '—'}</td>
                        <td className="px-3 py-1 border-r border-slate-50 font-mono text-slate-700">{row.vehicleNo || '—'}</td>
                        <td className="px-3 py-1 border-r border-slate-50 font-bold text-[#0097A7]">{row.serviceJobNo}</td>
                        <td className="px-3 py-1 font-bold text-slate-500">{row.vehicleModelNo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-2.5 max-w-7xl mx-auto text-[12px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Row : {filteredBookings.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}