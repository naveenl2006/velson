import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { 
  ChevronRight, X, Trash2, Edit, Search, Printer, List, Download, FileSpreadsheet, Filter, Settings, Save, RotateCcw
} from 'lucide-react'
import { useToast } from '../components/Toast'
import api from '../services/api'


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
      <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

const STANDARD_ASSEMBLIES = [
  { id: 1, name: 'Engine System & Mounts' },
  { id: 2, name: 'Hydraulic Main Pump & Valves' },
  { id: 3, name: 'Mast Structure & Lifting Cylinders' },
  { id: 4, name: 'Crawler Track rollers & Tensioners' },
  { id: 5, name: 'Rotary Head Swivel Assembly' },
  { id: 6, name: 'Control Panel & Joystick Valve block' },
  { id: 7, name: 'Compressor Lubricator Unit' },
  { id: 8, name: 'Winches & Steel Wire ropes' },
  { id: 9, name: 'Electric Harness & Ignition' },
  { id: 10, name: 'Feed Cylinder Assembly' }
]

export default function ServiceDetailsEntry() {
  const toast = useToast()

  // Dynamic lists
  const [jobsList, setJobsList] = useState([])
  const [serviceDetailsList, setServiceDetailsList] = useState([])
  const [filteredServiceList, setFilteredServiceList] = useState([])
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const [modelOptions, setModelOptions] = useState([])
  const [subTypeOptions, setSubTypeOptions] = useState([])
  const [vehicleNameOptions, setVehicleNameOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])

  // Form states
  const [serviceJobNo, setServiceJobNo] = useState('')
  const [customerCode, setCustomerCode] = useState('')
  const [vehicleCount, setVehicleCount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [bookingDate, setBookingDate] = useState('2026-04-15')
  const [serialNo, setSerialNo] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [vehicleModelNo, setVehicleModelNo] = useState('')
  const [modelSubType, setModelSubType] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [status, setStatus] = useState('Open')
  const [remarks, setRemarks] = useState('')
  const [servicePartNo, setServicePartNo] = useState('')

  // Assembly selection checkbox states
  const [checkedAssemblies, setCheckedAssemblies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // On mount: load jobs and service entries
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Gather all unique Booking records for Job selection
        const bookingsRes = await api.get('/api/service-booking')
        const parsed = bookingsRes.data?.data || []
        const parsedFormatted = parsed.map(b => ({
          serviceJobNo: b.serviceJobNo || '—',
          customerCode: b.customerCode || '—',
          customerName: b.customerName,
          bookingId: b.bookingId,
          bookingDate: b.bookingDate,
          serialNo: b.vehicleSerialNo || b.serialNo || '—',
          vehicleNo: b.vehicleNo || '—',
          vehicleModelNo: b.vehicleModelNo,
          modelSubType: b.modelSubType,
          vehicleName: b.vehicleName,
          count: b.customerVehicleCount || 1
        }))
        setJobsList(parsedFormatted)

        // 2. Gather unique options for Model, Sub Type and Vehicle Name
        const vehiclesRes = await api.get('/api/vehicle-master')
        const vehiclesList = vehiclesRes.data?.data || []
        const uniqueModels = [...new Set([
          ...vehiclesList.map(v => v.modelName).filter(Boolean),
          'VEDC', 'CORE DRILL', 'V2I', 'V3', 'V10', 'V2i'
        ])]
        const uniqueSubTypes = [...new Set([
          ...vehiclesList.map(v => v.modelSubType).filter(Boolean),
          'Crawler', 'Trailer', 'Truck Mount', 'Sling Mount', 'VELSON TYPE', 'GH600LC'
        ])]
        const uniqueNames = [...new Set([
          ...vehiclesList.map(v => v.vehicleName).filter(Boolean),
          'Rig A', 'Rig B', 'Rig C', 'Rig D', 'Rig E', 'Rig F', 'Rig G', 'NEW FABRICATION', 'KOBELCO'
        ])]
        setModelOptions(uniqueModels)
        setSubTypeOptions(uniqueSubTypes)
        setVehicleNameOptions(uniqueNames)

        // 3. Gather reference master status options for Service Booking Status
        const statusesRes = await api.get('/api/reference-master/Service_Booking_Status').catch(err => {
          console.error('Failed to fetch status options', err)
          return { data: { data: [] } }
        })
        const loadedStatuses = (statusesRes.data?.data || []).map(r => r.description).filter(Boolean)
        setStatusOptions(loadedStatuses.length > 0 ? loadedStatuses : ['Open', 'Close'])

        // 4. Load service details entries
        const detailsRes = await api.get('/api/service-detail')
        setServiceDetailsList(detailsRes.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch data', err)
        toast.error('Failed to load required data.')
      }
    }
    fetchData()
  }, [])

  // Auto-filling logic when a Service Job No is selected
  useEffect(() => {
    if (!serviceJobNo) return
    const matchingJob = jobsList.find(j => j.serviceJobNo === serviceJobNo)
    if (matchingJob) {
      setCustomerCode(matchingJob.customerCode)
      setVehicleCount(String(matchingJob.count))
      setCustomerName(matchingJob.customerName)
      setBookingId(String(matchingJob.bookingId))
      setBookingDate(matchingJob.bookingDate)
      setSerialNo(matchingJob.serialNo)
      setVehicleNo(matchingJob.vehicleNo)
      setVehicleModelNo(matchingJob.vehicleModelNo)
      setModelSubType(matchingJob.modelSubType)
      setVehicleName(matchingJob.vehicleName)
      toast.success(`Loaded Booking details for Job No: ${serviceJobNo}!`)
    }
  }, [serviceJobNo, jobsList])

  // Reactive bottom table search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredServiceList(serviceDetailsList)
      return
    }
    const q = searchQuery.toLowerCase()
    const result = serviceDetailsList.filter(s => 
      s.serviceJobNo.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.customerCode.toLowerCase().includes(q) ||
      s.vehicleModelNo.toLowerCase().includes(q) ||
      s.vehicleNo.toLowerCase().includes(q)
    )
    setFilteredServiceList(result)
  }, [searchQuery, serviceDetailsList])

  // Checklist handler
  const handleAssemblyCheck = (id) => {
    if (checkedAssemblies.includes(id)) {
      setCheckedAssemblies(checkedAssemblies.filter(i => i !== id))
    } else {
      setCheckedAssemblies([...checkedAssemblies, id])
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setCheckedAssemblies(STANDARD_ASSEMBLIES.map(a => a.id))
    } else {
      setCheckedAssemblies([])
    }
  }

  // ── Operations CRUD Logic ──
  const handleSave = async () => {
    if (!serviceJobNo || !vehicleModelNo || !modelSubType || !vehicleName) {
      toast.warning('Please select a valid Service Job No and required vehicle specs (Model, SubType, Name).')
      return
    }

    const newEntry = {
      serviceJobNo,
      customerCode,
      vehicleCount: Number(vehicleCount) || 1,
      customerName,
      bookingId: Number(bookingId),
      bookingDate,
      serialNo,
      vehicleNo,
      vehicleModelNo,
      modelSubType,
      vehicleName,
      status,
      remarks,
      servicePartNo,
      checkedAssemblies
    }

    try {
      let updatedList
      if (editingId !== null) {
        const res = await api.put(`/api/service-detail/${editingId}`, newEntry, { loadingMessage: 'Updating record...' })
        updatedList = serviceDetailsList.map(s => s.id === editingId ? res.data.data : s)
        toast.success(`Service details log for Job ${serviceJobNo} updated successfully!`)
        setEditingId(null)
      } else {
        const res = await api.post('/api/service-detail', newEntry, { loadingMessage: 'Saving record...' })
        updatedList = [res.data.data, ...serviceDetailsList]
        toast.success(`Service details log for Job ${serviceJobNo} created successfully!`)
      }

      setServiceDetailsList(updatedList)
      handleClear()
    } catch (err) {
      console.error('Failed to save service detail', err)
      toast.error('Failed to save service detail. ' + (err.response?.data?.message || err.message))
    }
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setServiceJobNo(row.serviceJobNo)
    setCustomerCode(row.customerCode)
    setVehicleCount(String(row.vehicleCount))
    setCustomerName(row.customerName)
    setBookingId(String(row.bookingId))
    setBookingDate(row.bookingDate)
    setSerialNo(row.serialNo)
    setVehicleNo(row.vehicleNo)
    setVehicleModelNo(row.vehicleModelNo)
    setModelSubType(row.modelSubType)
    setVehicleName(row.vehicleName)
    setStatus(row.status)
    setRemarks(row.remarks)
    setServicePartNo(row.servicePartNo)
    setCheckedAssemblies(row.checkedAssemblies || [])
    toast.warning(`Editing Service Details log for Job No: ${row.serviceJobNo}`)
  }

  const handleDelete = async () => {
    if (!selectedRowId) {
      toast.warning('Please select a service details log from the table below to delete.')
      return
    }
    if (window.confirm('Are you sure you want to delete this Service Details Entry?')) {
      try {
        await api.delete(`/api/service-detail/${selectedRowId}`, { loadingMessage: 'Deleting record...' })
        const updated = serviceDetailsList.filter(s => s.id !== selectedRowId)
        setServiceDetailsList(updated)
        toast.error('Service entry deleted successfully.')
        handleClear()
      } catch (err) {
        console.error('Failed to delete service detail', err)
        toast.error('Failed to delete service detail.')
      }
    }
  }

  const handleClear = () => {
    setServiceJobNo('')
    setCustomerCode('')
    setVehicleCount('')
    setCustomerName('')
    setBookingId('')
    setBookingDate('2026-04-15')
    setSerialNo('')
    setVehicleNo('')
    setVehicleModelNo('')
    setModelSubType('')
    setVehicleName('')
    setStatus(statusOptions[0] || 'Open')
    setRemarks('')
    setServicePartNo('')
    setCheckedAssemblies([])
    setEditingId(null)
  }

  // ── SheetJS Excel sheets binary downloads (.xlsx) ──
  const handleExportExcel = () => {
    if (filteredServiceList.length === 0) {
      toast.warning('No service entries details available to export.')
      return
    }

    const data = filteredServiceList.map((s, idx) => ({
      'S.No': idx + 1,
      'Service Job No': s.serviceJobNo,
      'Customer Code': s.customerCode,
      'Customer Name': s.customerName,
      'Booking ID': s.bookingId,
      'Booking Date': s.bookingDate,
      'Serial No': s.serialNo,
      'Vehicle No': s.vehicleNo,
      'Vehicle Model': s.vehicleModelNo,
      'Model Sub Type': s.modelSubType,
      'Vehicle Name': s.vehicleName,
      'Service Part No': s.servicePartNo,
      'Status': s.status,
      'Serviced Assemblies Count': (s.checkedAssemblies || []).length,
      'Remarks': s.remarks
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ServiceDetails')
    
    XLSX.writeFile(workbook, `service_details_entries_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Successfully downloaded Service Details Excel spreadsheet!')
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-4 py-4">
        
        {/* Breadcrumb keeps Dashboard chevron arrow REMOVED */}
        <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-3.5 uppercase font-bold tracking-wider">
          <span className="hover:text-[#0097A7] cursor-pointer">Service</span> 
          <ChevronRight size={11} /> 
          <span className="text-[#0097A7]">Service Details Entry</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Card header styled with teal banner, Excel and Close buttons inside header */}
          <div className="flex items-center justify-between bg-[#0097A7] text-white px-4 py-2.5 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-sm"></span>
              <span className="font-bold text-[13px] uppercase tracking-wider">Service Details Entry</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportExcel} 
                className="bg-[#007a87] hover:bg-[#006873] border border-white/20 text-[12px] px-3 py-1 rounded transition-colors font-bold uppercase tracking-wider flex items-center gap-1 h-[28px]"
              >
                <FileSpreadsheet size={12} className="text-green-300" /> Excel
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('velson:navigate', { detail: 'Dashboard' }))} 
                className="bg-[#007a87] hover:bg-[#006873] border border-white/20 text-[12px] px-3 py-1 rounded transition-colors font-bold uppercase tracking-wider h-[28px]"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Dual Column Grid: Left Form, Right Assembly checkboxes */}
            <div className="grid grid-cols-12 gap-x-8 gap-y-4 max-w-7xl mx-auto mb-4">
              
              {/* Left Column (Inputs) */}
              <div className="col-span-6 space-y-1.5 border-r border-slate-100 pr-6 text-[11px]">
                
                {/* Row 1: Service Job No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Service Job No :</Label>
                  </div>
                  <div className="col-span-8">
                    <Select 
                      options={jobsList.map(j => j.serviceJobNo)} 
                      placeholder="Select Service Job No..." 
                      value={serviceJobNo} 
                      onChange={e => setServiceJobNo(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Row 2: Customer Code */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Customer Code :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input value={customerCode} readOnly className="!font-bold bg-slate-50 text-slate-500 h-[26px] text-[11px]" />
                  </div>
                </div>
                
                {/* Row 2.5: Vehicle Count */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Vehicle Count :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input value={vehicleCount} readOnly className="text-center bg-slate-50 text-slate-500 font-bold h-[26px] text-[11px]" />
                  </div>
                </div>

                {/* Row 3: Customer Name */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Customer Name :</Label>
                  </div>
                  <div className="col-span-8">
                    <Select 
                      options={jobsList.map(j => j.customerName)} 
                      placeholder="Select Customer Name..." 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Row 4: Booking ID (Commented out)
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Booking ID :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input value={bookingId} readOnly className="text-center font-bold bg-slate-50 text-slate-500 h-[26px] text-[11px]" />
                  </div>
                </div>
                */}
                
                {/* Row 4.5: Booking Date (Commented out)
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Booking Date :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input type="date" value={bookingDate} readOnly className="bg-slate-50 text-slate-500 font-bold h-[26px] text-[11px]" />
                  </div>
                </div>
                */}

                {/* Row 5: Serial No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Serial No :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input value={serialNo} onChange={e => setSerialNo(e.target.value)} placeholder="Auto Serial No" />
                  </div>
                </div>

                {/* Row 6: Vehicle No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Vehicle No :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="Auto Vehicle No" />
                  </div>
                </div>

                {/* Row 7: Vehicle Model No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label required>Vehicle Model No :</Label>
                  </div>
                  <div className="col-span-8">
                    <Select 
                      options={modelOptions} 
                      placeholder="Select Model..." 
                      value={vehicleModelNo} 
                      onChange={e => setVehicleModelNo(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Row 8: Model Sub Type */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label required>Model Sub Type :</Label>
                  </div>
                  <div className="col-span-8">
                    <Select 
                      options={subTypeOptions} 
                      placeholder="Select Sub Type..." 
                      value={modelSubType} 
                      onChange={e => setModelSubType(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Row 9: Vehicle Name */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label required>Vehicle Name :</Label>
                  </div>
                  <div className="col-span-8">
                    <Select 
                      options={vehicleNameOptions} 
                      placeholder="Select Vehicle Name..." 
                      value={vehicleName} 
                      onChange={e => setVehicleName(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Row 10: Status */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Status :</Label>
                  </div>
                  <div className="col-span-8">
                    <Select 
                      options={statusOptions} 
                      placeholder="Select Status..." 
                      value={status} 
                      onChange={e => setStatus(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Row 11: Remarks */}
                <div className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-4 text-right pr-1 pt-1">
                    <Label>Remark's :</Label>
                  </div>
                  <div className="col-span-8">
                    <textarea 
                      value={remarks} 
                      onChange={e => setRemarks(e.target.value)} 
                      placeholder="Enter remarks..."
                      className="w-full h-[32px] px-2.5 py-1 text-[12px] border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] transition-all hover:border-slate-400 resize-none"
                    />
                  </div>
                </div>

                {/* Row 12: Service Part No (Commented out)
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 text-right pr-1">
                    <Label>Service Part No :</Label>
                  </div>
                  <div className="col-span-8">
                    <Input value={servicePartNo} onChange={e => setServicePartNo(e.target.value)} placeholder="Service Part Number" />
                  </div>
                </div>
                */}

              </div>

              {/* Right Column (Assembly Checklist) */}
              <div className="col-span-6 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-[12px] uppercase text-[#0097A7] tracking-wider">Assembly List</span>
                  
                  <div className="flex items-center gap-1.5 cursor-pointer select-none pr-2">
                    <input 
                      type="checkbox" 
                      id="selectAllAssembly"
                      checked={checkedAssemblies.length === STANDARD_ASSEMBLIES.length}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#0097A7] border-slate-300 rounded focus:ring-[#0097A7] cursor-pointer"
                    />
                    <label htmlFor="selectAllAssembly" className="text-[12.5px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer">
                      Select All
                    </label>
                  </div>
                </div>

                {/* Large check grid table panel exactly mirroring screenshot visual specs */}
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white h-[360px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[12px] uppercase text-slate-400 font-bold border-b border-slate-200 sticky top-0">
                      <tr className="h-8">
                        <th className="px-3 py-1 border-r border-slate-100 w-16 text-center">Select <span className="text-red-500">*</span></th>
                        <th className="px-3 py-1"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[12.5px] text-slate-600 font-medium">
                      {STANDARD_ASSEMBLIES.map((a, idx) => (
                        <tr 
                          key={a.id} 
                          onClick={() => handleAssemblyCheck(a.id)}
                          className={`hover:bg-[#0097A7]/5 cursor-pointer h-9 transition-colors ${checkedAssemblies.includes(a.id) ? 'bg-[#0097A7]/10 font-bold' : ''}`}
                        >
                          <td className="px-3 py-1 border-r border-slate-50 text-center bg-slate-50/20">
                            <input 
                              type="checkbox"
                              checked={checkedAssemblies.includes(a.id)}
                              onChange={() => {}} // Click handled by row click handler
                              className="w-3.5 h-3.5 border-slate-300 rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-1 flex items-center gap-2">
                            {/* <span className="text-[#0097A7] font-bold text-[14px]">*</span> */}
                            <span className="text-slate-600 font-semibold">{a.name}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-[12px] text-slate-400 font-bold uppercase text-right pr-2">
                  Serviced Assemblies Selected: {checkedAssemblies.length} / {STANDARD_ASSEMBLIES.length}
                </div>
              </div>

            </div>

            {/* Mid Form Action Toolbar perfectly styled */}
            <div className="flex flex-wrap items-center justify-between border border-slate-200 py-1.5 mb-2 bg-slate-50/50 px-3 rounded-lg max-w-7xl mx-auto shadow-sm gap-2">
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    placeholder="Search Saved Service Entries..." 
                    className="pl-8 pr-2 py-1 text-[13px] h-[32px] border border-slate-300 rounded w-72 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7]"
                  />
                  <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={13} />
                  </div>
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-[#0097A7] font-bold uppercase"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* <button 
                  onClick={handleSave} 
                  className="flex items-center gap-1 px-3.5 py-1 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
                >
                  Save All  
                </button> */}
                <button 
                  onClick={handleSave} 
                  className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-800 border border-slate-600 text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
                >
                  <Save size={12} /> {editingId !== null ? 'Update' : 'Save'}
                </button>
                <button 
                  onClick={() => {
                    if (selectedRowId) {
                      const row = serviceDetailsList.find(s => s.id === selectedRowId)
                      if (row) handleEdit(row)
                    } else {
                      toast.warning('Please pick a record row from the table below to edit.')
                    }
                  }} 
                  className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95 whitespace-nowrap"
                >
                  <Edit size={12} className="text-[#0097A7]" /> Edit
                </button>
                <button 
                  onClick={handleDelete} 
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

            {/* Bottom Saved Service Details List table */}
            <div className="max-w-7xl mx-auto border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white mb-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1300px]">
                  <thead className="bg-slate-50 text-[12px] uppercase text-slate-400 font-bold border-b border-slate-200">
                    <tr className="h-8">
                      <th className="px-3 py-1 border-r border-slate-100 w-16 text-center">S.No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-36 text-center">Service Job No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28 text-center">Customer Code</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-[280px]">Customer Name</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-32">Serial No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28 text-center">Vehicle No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-24 text-center">Model</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28">Status</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28 text-center">Assemblies Count</th>
                      <th className="px-3 py-1">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[12.5px]">
                    {filteredServiceList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-300 italic">
                          No service details logs saved.
                        </td>
                      </tr>
                    ) : (
                      filteredServiceList.map((row, idx) => (
                        <tr 
                          key={row.id} 
                          onClick={() => setSelectedRowId(row.id)}
                          className={`hover:bg-[#0097A7]/5 cursor-pointer h-9 transition-colors ${selectedRowId === row.id ? 'bg-[#0097A7]/10 font-semibold' : ''}`}
                        >
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-slate-500 bg-slate-50/50">{idx + 1}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-[#0097A7]">{row.serviceJobNo}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-center text-slate-500 font-semibold">{row.customerCode}</td>
                          <td className="px-3 py-1 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-slate-600 font-medium">{row.serialNo}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-mono text-slate-600">{row.vehicleNo}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-slate-500">{row.vehicleModelNo}</td>
                          
                          <td className="px-3 py-1 border-r border-slate-50 font-bold">
                            <span className={`px-2.5 py-0.5 rounded text-[12px] uppercase font-extrabold shadow-sm ${
                              row.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-[#0097A7] bg-slate-50/20">{(row.checkedAssemblies || []).length} / 10</td>
                          <td className="px-3 py-1 text-slate-500 max-w-[240px] truncate">{row.remarks || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>



            {/* Aggregated Total summary bar row matching exact template design guidelines */}
            <div className="max-w-7xl mx-auto bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-end text-[12px] font-bold tracking-wider shadow-sm mb-1">
              <div className="flex items-center pr-4 text-slate-500 uppercase">
                <span>Row : {filteredServiceList.length}</span>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  )
}