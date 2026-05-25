import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'
import {
  ChevronRight, FileSpreadsheet, Search, Save, Edit, Trash2, RotateCcw, Image
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

const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = '' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full px-2.5 py-1 text-[13px] h-[32px] border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] transition-all duration-150 ${readOnly ? 'bg-slate-50 cursor-not-allowed text-slate-500 font-bold' : 'hover:border-slate-400'} ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = '' }) => (
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

// BOM spare parts seed data
const BOM_PARTS = [
  { id: 1,  partNo: 'VC-100081-V2-1', partName: 'CENTER SLIDER 2-1 12D',           fasterQty: 2,  unit: 'Nos', rate: 850   },
  { id: 2,  partNo: 'VC-100086-V2-1', partName: 'ROPE TENSION PULLEY-10"',          fasterQty: 1,  unit: 'Nos', rate: 1200  },
  { id: 3,  partNo: 'VC-100092-V2-1', partName: 'MYRMAX 10" DOUBLE ROPE T',         fasterQty: 1,  unit: 'Set', rate: 3500  },
  { id: 4,  partNo: 'VC-100094-V2-1', partName: 'BOTTOM PULLEY-10" SINGLE',         fasterQty: 2,  unit: 'Nos', rate: 950   },
  { id: 5,  partNo: 'VC-100096-V2-1', partName: 'BOTTOM PULLEY-8" SINGLE',          fasterQty: 2,  unit: 'Nos', rate: 780   },
  { id: 6,  partNo: 'VC-100151-V2-1', partName: '2H SIDE ROLLER ASSEMBLE 100',      fasterQty: 4,  unit: 'Nos', rate: 2100  },
  { id: 7,  partNo: 'VC-100582-V7-1', partName: '800 H-PLATE XL GEAR BOX',          fasterQty: 1,  unit: 'Nos', rate: 18500 },
  { id: 8,  partNo: 'VC-104461-V2-1', partName: 'LUB OIL TANK',                     fasterQty: 1,  unit: 'Nos', rate: 4500  },
  { id: 9,  partNo: 'VC-104535-V2-1', partName: 'VEHICLE PAINT COATING BI',         fasterQty: 3,  unit: 'Ltr', rate: 620   },
  { id: 10, partNo: 'VC-105079-V2-1', partName: '14 INCH BED',                      fasterQty: 1,  unit: 'Nos', rate: 7800  },
  { id: 11, partNo: 'VG-20938-PTO',   partName: 'GEAR BOX ASSM 52-35 TEET',         fasterQty: 1,  unit: 'Nos', rate: 25000 },
  { id: 12, partNo: 'VGH-1000830-V10',partName: 'GMV 400 ROTATION ASSM',            fasterQty: 1,  unit: 'Nos', rate: 32000 },
  { id: 13, partNo: 'VGH-1000956-AIR',partName: 'AIR HOSE REEL ASSEMBLE',           fasterQty: 1,  unit: 'Set', rate: 5600  },
  { id: 14, partNo: 'VHC-33610-AIR',  partName: 'AIR VALVE HYDRAULIC CYLINDE',       fasterQty: 2,  unit: 'Nos', rate: 1450  },
  { id: 15, partNo: 'VHM-50092-XL',   partName: 'INNER SAVARAN MUD GMV GI',          fasterQty: 1,  unit: 'Nos', rate: 8900  },
  { id: 16, partNo: 'VM-1200184-V2-1',partName: 'B56 CENTER GEARBOX MC',             fasterQty: 1,  unit: 'Nos', rate: 14500 },
  { id: 17, partNo: 'VM-1200432-V2',  partName: 'PIPELINE LIST ASSM',               fasterQty: 1,  unit: 'Set', rate: 3200  },
  { id: 18, partNo: 'VM-200045-V2I',  partName: 'CHECK VALVE ADAPTOR LIS',          fasterQty: 4,  unit: 'Nos', rate: 890   },
  { id: 19, partNo: 'VM-200130-V2-1', partName: 'MRC PIN & LOCK ASSM 2-1',          fasterQty: 6,  unit: 'Set', rate: 450   },
  { id: 20, partNo: 'VM-200183-V7',   partName: 'PIPE LINE CLAMP & WELDABL',        fasterQty: 8,  unit: 'Nos', rate: 320   },
]

const LEGACY_JOBS = [
  { serviceJobNo: '26-27/S000027', customerCode: 'LM191',      customerName: 'MANJUNATHA ROCK DRILLS',             bookingId: 1811, bookingDate: '2026-04-15', serialNo: 'V3/042600009',    vehicleNo: 'KA-01-A-1111', vehicleModelNo: 'V3',   modelSubType: 'VELSON TYPE', vehicleName: 'NEW FABRICATION', count: 17 },
  { serviceJobNo: '26-27/S000028', customerCode: 'LM964',      customerName: 'AJANTHA MINING PRIVATE LIMITED',      bookingId: 1812, bookingDate: '2026-04-15', serialNo: 'V10/102400035',   vehicleNo: 'KA-02-B-2222', vehicleModelNo: 'V10',  modelSubType: 'GH600LC',     vehicleName: 'KOBELCO',        count: 1  },
  { serviceJobNo: '25-26/S000448', customerCode: 'CD1150183',  customerName: 'S.R EXPORTS',                         bookingId: 1582, bookingDate: '2026-08-01', serialNo: 'V7/012600029',    vehicleNo: 'V7',           vehicleModelNo: 'V7',   modelSubType: 'Crawler',     vehicleName: 'LEYLAND',        count: 7  },
]

const SEED_SPARES = [
  {
    id: 9901,
    serviceJobNo: '25-26/S000448',
    customerCode: 'CD1150183',
    customerName: 'S.R EXPORTS',
    bookingId: 1582,
    bookingDate: '2026-08-01',
    serialNo: 'V7/012600029',
    vehicleNo: 'V7',
    vehicleModelNo: 'V7',
    modelSubType: 'Crawler',
    vehicleName: 'LEYLAND',
    servicePartNo: 'SP-1001',
    displayOrder: 1,
    status: 'Open',
    selectedParts: [1, 2, 3, 7],
    totalAmount: 24050,
    savedDate: '2026-08-01'
  }
]

export default function ServiceSpareEntry() {
  const toast = useToast()

  // Master job/booking list
  const [jobsList, setJobsList] = useState([])
  const [sparesList, setSparesList] = useState([])
  const [filteredSpares, setFilteredSpares] = useState([])
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  // Form fields
  const [serviceJobNo, setServiceJobNo] = useState('')
  const [bookingCustomerCode, setBookingCustomerCode] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerCode, setCustomerCode] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0])
  const [lastSavedAssName, setLastSavedAssName] = useState('')
  const [servicePartNo, setServicePartNo] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [serialNo, setSerialNo] = useState('')
  const [vehicleModelNo, setVehicleModelNo] = useState('')
  const [modelSubType, setModelSubType] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [status, setStatus] = useState('')
  const [isServiceChecked, setIsServiceChecked] = useState(false)

  // BOM list states
  const [bomRows, setBomRows] = useState(BOM_PARTS.map(p => ({
    ...p,
    selected: false,
    issuedQty: 0,
  })))
  const [selectAllBOM, setSelectAllBOM] = useState(false)
  const [sameFasterQty, setSameFasterQty] = useState(false)

  // Filter
  const [searchQuery, setSearchQuery] = useState('')

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRes = await axios.get('/api/service-booking')
        const bookings = bookingsRes.data?.data || []
        const formatted = bookings.map(b => ({
          serviceJobNo: b.serviceJobNo || '—',
          customerCode: b.customerCode || '—',
          customerName: b.customerName || '—',
          bookingId: b.bookingId,
          bookingDate: b.bookingDate,
          serialNo: b.vehicleSerialNo || b.serialNo || '—',
          vehicleNo: b.vehicleNo || '—',
          vehicleModelNo: b.vehicleModelNo || '—',
          modelSubType: b.modelSubType || '—',
          vehicleName: b.vehicleName || '—',
          count: b.customerVehicleCount || 1
        }))
        const allJobs = [...formatted, ...LEGACY_JOBS.filter(j => !formatted.some(f => f.serviceJobNo === j.serviceJobNo))]
        setJobsList(allJobs)

        const sparesRes = await axios.get('/api/service-spare')
        setSparesList(sparesRes.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch initial data', err)
        toast.error('Failed to load required records.')
      }
    }
    fetchData()
  }, [])

  // Auto-fill when Job No selected
  useEffect(() => {
    if (!serviceJobNo) return
    const job = jobsList.find(j => j.serviceJobNo === serviceJobNo)
    if (job) {
      setBookingCustomerCode(job.customerCode)
      setCustomerName(job.customerName)
      setCustomerCode(job.customerCode)
      setSerialNo(job.serialNo)
      setVehicleNo(job.vehicleNo)
      setVehicleModelNo(job.vehicleModelNo)
      setModelSubType(job.modelSubType)
      setVehicleName(job.vehicleName)
      toast.success(`Loaded details for Job No: ${serviceJobNo}`)
    }
  }, [serviceJobNo, jobsList])

  // Reactive filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSpares(sparesList)
      return
    }
    const q = searchQuery.toLowerCase()
    setFilteredSpares(sparesList.filter(s =>
      (s.serviceJobNo || '').toLowerCase().includes(q) ||
      (s.customerName || '').toLowerCase().includes(q) ||
      (s.vehicleModelNo || '').toLowerCase().includes(q)
    ))
  }, [searchQuery, sparesList])

  // Select All BOM toggle
  const handleSelectAllBOM = (checked) => {
    setSelectAllBOM(checked)
    setBomRows(prev => prev.map(r => ({ ...r, selected: checked })))
  }

  // Same Faster Qty to Issued Qty toggle
  useEffect(() => {
    if (sameFasterQty) {
      setBomRows(prev => prev.map(r => r.selected ? { ...r, issuedQty: r.fasterQty } : r))
    }
  }, [sameFasterQty])

  const handleBOMRowSelect = (id) => {
    setBomRows(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
      setSelectAllBOM(updated.every(r => r.selected))
      return updated
    })
  }

  const handleIssuedQtyChange = (id, val) => {
    setBomRows(prev => prev.map(r => r.id === id ? { ...r, issuedQty: Number(val) } : r))
  }

  const getSelectedParts = () => bomRows.filter(r => r.selected)
  const getTotalAmount = () => getSelectedParts().reduce((sum, r) => sum + (r.issuedQty * r.rate), 0)

  // Save
  const handleSave = async () => {
    if (!serviceJobNo) {
      toast.warning('Please select a Service Job No.')
      return
    }
    const selectedParts = getSelectedParts().map(r => r.id)
    const newEntry = {
      serviceJobNo,
      bookingCustomerCode,
      customerName,
      customerCode,
      displayOrder: Number(displayOrder) || 1,
      displayDate,
      lastSavedAssName,
      servicePartNo,
      vehicleNo,
      serialNo,
      vehicleModelNo,
      modelSubType,
      vehicleName,
      status,
      selectedParts,
      totalAmount: getTotalAmount(),
      savedDate: new Date().toISOString().split('T')[0]
    }

    try {
      let updated
      if (editingId !== null) {
        const res = await axios.put(`/api/service-spare/${editingId}`, newEntry)
        updated = sparesList.map(s => s.id === editingId ? res.data.data : s)
        toast.success(`Spare entry for Job ${serviceJobNo} updated!`)
        setEditingId(null)
      } else {
        const res = await axios.post('/api/service-spare', newEntry)
        updated = [res.data.data, ...sparesList]
        toast.success(`Spare entry for Job ${serviceJobNo} saved!`)
      }

      setSparesList(updated)
      handleClear()
    } catch (err) {
      console.error('Failed to save service spare entry', err)
      toast.error('Failed to save service spare entry. ' + (err.response?.data?.message || err.message))
    }
  }

  const handleEditRow = (row) => {
    setEditingId(row.id)
    setServiceJobNo(row.serviceJobNo)
    setBookingCustomerCode(row.bookingCustomerCode || '')
    setCustomerName(row.customerName)
    setCustomerCode(row.customerCode)
    setDisplayOrder(row.displayOrder || '')
    setDisplayDate(row.displayDate || '')
    setLastSavedAssName(row.lastSavedAssName || '')
    setServicePartNo(row.servicePartNo || '')
    setVehicleNo(row.vehicleNo)
    setSerialNo(row.serialNo)
    setVehicleModelNo(row.vehicleModelNo)
    setModelSubType(row.modelSubType)
    setVehicleName(row.vehicleName)
    setStatus(row.status || '')
    setBomRows(prev => prev.map(r => ({
      ...r,
      selected: (row.selectedParts || []).includes(r.id)
    })))
    toast.warning(`Editing spare entry for Job: ${row.serviceJobNo}`)
  }

  const handleDelete = async () => {
    if (!selectedRowId) {
      toast.warning('Please select a row to delete.')
      return
    }
    if (window.confirm('Delete this spare entry?')) {
      try {
        await axios.delete(`/api/service-spare/${selectedRowId}`)
        const updated = sparesList.filter(s => s.id !== selectedRowId)
        setSparesList(updated)
        toast.error('Spare entry deleted successfully.')
        handleClear()
      } catch (err) {
        console.error('Failed to delete service spare', err)
        toast.error('Failed to delete service spare.')
      }
    }
  }

  const handleClear = () => {
    setServiceJobNo('')
    setBookingCustomerCode('')
    setCustomerName('')
    setCustomerCode('')
    setDisplayOrder('')
    setDisplayDate(new Date().toISOString().split('T')[0])
    setLastSavedAssName('')
    setServicePartNo('')
    setVehicleNo('')
    setSerialNo('')
    setVehicleModelNo('')
    setModelSubType('')
    setVehicleName('')
    setStatus('')
    setBomRows(BOM_PARTS.map(p => ({ ...p, selected: false, issuedQty: 0 })))
    setSelectAllBOM(false)
    setSameFasterQty(false)
    setEditingId(null)
    setSelectedRowId(null)
  }

  const handleExportExcel = () => {
    if (filteredSpares.length === 0) {
      toast.warning('No data to export.')
      return
    }
    const data = filteredSpares.map((s, idx) => ({
      'S.No': idx + 1,
      'Service Job No': s.serviceJobNo,
      'Customer Code': s.customerCode,
      'Customer Name': s.customerName,
      'Vehicle No': s.vehicleNo,
      'Serial No': s.serialNo,
      'Vehicle Model': s.vehicleModelNo,
      'Model Sub Type': s.modelSubType,
      'Vehicle Name': s.vehicleName,
      'Service Part No': s.servicePartNo,
      'Status': s.status,
      'Selected Parts Count': (s.selectedParts || []).length,
      'Total Amount': s.totalAmount,
      'Date': s.savedDate
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ServiceSpares')
    XLSX.writeFile(wb, `service_spare_entry_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Excel downloaded successfully!')
  }

  const selectedPartsCount = getSelectedParts().length
  const totalAmount = getTotalAmount()

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-4 py-4">

        {/* Breadcrumb — Dashboard chevron removed */}
        <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-3.5 uppercase font-bold tracking-wider">
          <span className="hover:text-[#0097A7] cursor-pointer">Service</span>
          <ChevronRight size={11} />
          <span className="text-[#0097A7]">Service Spare Entry</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          {/* ── Teal Header Banner ── */}
          <div className="flex items-center justify-between bg-[#0097A7] text-white px-4 py-2.5 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-sm flex-shrink-0"></span>
              <span className="font-bold text-[13px] uppercase tracking-wider">Service Spare's Entry</span>
            </div>
            {/* Centered Service checkbox */}
            <div className="flex items-center gap-2 mx-auto">
              <input
                type="checkbox"
                id="serviceHeaderCheck"
                checked={isServiceChecked}
                onChange={e => setIsServiceChecked(e.target.checked)}
                className="w-3.5 h-3.5 cursor-pointer"
              />
              <label htmlFor="serviceHeaderCheck" className="text-[12px] font-bold cursor-pointer">Service</label>
            </div>
            {/* Top-right action buttons */}
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

            {/* ── Upper Form — Three-column layout ── */}
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5 mb-4 border border-slate-200 rounded-lg p-3 bg-slate-50/30">

              {/* LEFT COLUMN */}
              <div className="col-span-5 space-y-2.5">

                {/* Service Job No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label required>Service Job No :</Label></div>
                  <div className="col-span-7">
                    <Input 
                      value={serviceJobNo} 
                      onChange={e => setServiceJobNo(e.target.value)} 
                      placeholder="Enter Job No..." 
                    />
                  </div>
                </div>

                {/* Booking Customer Code */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Booking Customer Code :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={Array.from(new Set(jobsList.map(j => j.customerCode))).filter(Boolean)}
                      placeholder="Select Code..."
                      value={bookingCustomerCode}
                      onChange={e => setBookingCustomerCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Customer Name */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Customer Name :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={Array.from(new Set(jobsList.map(j => j.customerName))).filter(Boolean)}
                      placeholder="Select Name..."
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Customer Code */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Customer Code :</Label></div>
                  <div className="col-span-7">
                    <Input value={customerCode} readOnly />
                  </div>
                </div>

                {/* Display Order + Date */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Display Order :</Label></div>
                  <div className="col-span-3">
                    <Input value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} placeholder="Order" />
                  </div>
                  <div className="col-span-4">
                    <Input type="date" value={displayDate} onChange={e => setDisplayDate(e.target.value)} />
                  </div>
                </div>

                {/* Last Saved Ass. Name */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Last Saved Ass. Name :</Label></div>
                  <div className="col-span-7">
                    <Input value={lastSavedAssName} readOnly className="text-slate-400 italic" placeholder="—" />
                  </div>
                </div>

                {/* Service Part No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Service Part No :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={['SP-1001', 'SP-1002', 'SP-1003', 'SP-2001', 'SP-3001']}
                      placeholder="Select Part No..."
                      value={servicePartNo}
                      onChange={e => setServicePartNo(e.target.value)}
                    />
                  </div>
                </div>

              </div>

              {/* MIDDLE COLUMN */}
              <div className="col-span-4 space-y-2.5 border-l border-slate-200 pl-4">

                {/* Vehicle No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Vehicle No :</Label></div>
                  <div className="col-span-7">
                    <Input value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="Auto-filled" />
                  </div>
                </div>

                {/* Serial No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Serial No :</Label></div>
                  <div className="col-span-7">
                    <Input value={serialNo} onChange={e => setSerialNo(e.target.value)} placeholder="Auto-filled" />
                  </div>
                </div>

                {/* Vehicle Model No */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Vehicle Model No :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={['VEDC', 'V2I', 'V3', 'V7', 'V10', 'CORE DRILL']}
                      placeholder="Select Model..."
                      value={vehicleModelNo}
                      onChange={e => setVehicleModelNo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Model Sub Type */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Model Sub Type :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={['Crawler', 'Trailer', 'Truck Mount', 'VELSON TYPE', 'GH600LC']}
                      placeholder="Select Type..."
                      value={modelSubType}
                      onChange={e => setModelSubType(e.target.value)}
                    />
                  </div>
                </div>

                {/* Vehicle Name */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Vehicle Name :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={['LEYLAND', 'KOBELCO', 'NEW FABRICATION', 'Rig A', 'Rig B', 'Rig C']}
                      placeholder="Select Name..."
                      value={vehicleName}
                      onChange={e => setVehicleName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-right pr-1"><Label>Status :</Label></div>
                  <div className="col-span-7">
                    <Select
                      options={['Open', 'In Progress', 'Completed', 'On Hold']}
                      placeholder="Select Status..."
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN — Part Image placeholder */}
              <div className="col-span-3 border-l border-slate-200 pl-4 flex flex-col items-center justify-start pt-1">
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Part Image</div>
                <div className="w-full h-[160px] border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#0097A7] hover:bg-[#0097A7]/5 transition-all group">
                  <Image size={28} className="text-slate-300 group-hover:text-[#0097A7] transition-colors" />
                  <span className="text-[12px] text-slate-300 group-hover:text-[#0097A7] transition-colors font-bold uppercase">No Image</span>
                </div>
              </div>

            </div>

            {/* ── BOM List Section ── */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm">

              {/* BOM Header toggles */}
              <div className="flex items-center gap-6 px-3 py-2 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSelectAllBOM(!selectAllBOM)}>
                  <input
                    type="checkbox"
                    checked={selectAllBOM}
                    onChange={e => handleSelectAllBOM(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#0097A7] border-slate-300 rounded focus:ring-[#0097A7] cursor-pointer"
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-[12.5px] font-bold text-slate-600 uppercase tracking-wider">Select All</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setSameFasterQty(v => !v)}>
                  <input
                    type="checkbox"
                    checked={sameFasterQty}
                    onChange={e => setSameFasterQty(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#0097A7] border-slate-300 rounded focus:ring-[#0097A7] cursor-pointer"
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-[12.5px] font-bold text-slate-600 uppercase tracking-wider">Same Faster Qty to Issued Qty</span>
                </div>
                <span className="ml-auto text-[12px] font-bold text-[#0097A7] uppercase tracking-wider">BOM List</span>
              </div>

              {/* BOM Table */}
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[860px]">
                  <thead className="bg-slate-50 text-[12px] uppercase text-slate-400 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr className="h-8">
                      <th className="px-2.5 py-1 border-r border-slate-100 w-14 text-center">Select</th>
                      <th className="px-2.5 py-1 border-r border-slate-100 w-36">Part No</th>
                      <th className="px-2.5 py-1 border-r border-slate-100">Part Name</th>
                      <th className="px-2.5 py-1 border-r border-slate-100 w-24 text-center">Faster Qty</th>
                      <th className="px-2.5 py-1 border-r border-slate-100 w-24 text-center">Issued Qty</th>
                      <th className="px-2.5 py-1 border-r border-slate-100 w-16 text-center">Unit</th>
                      <th className="px-2.5 py-1 border-r border-slate-100 w-24 text-right">Rate (₹)</th>
                      <th className="px-2.5 py-1 w-28 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[12.5px] text-slate-600">
                    {bomRows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => handleBOMRowSelect(row.id)}
                        className={`hover:bg-[#0097A7]/5 cursor-pointer h-8 transition-colors ${row.selected ? 'bg-[#0097A7]/10 font-semibold' : ''}`}
                      >
                        <td className="px-2.5 py-0.5 border-r border-slate-50 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => handleBOMRowSelect(row.id)}
                            className="w-3.5 h-3.5 text-[#0097A7] border-slate-300 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-2.5 py-0.5 border-r border-slate-50 font-mono text-[10.5px] text-slate-500">{row.partNo}</td>
                        <td className="px-2.5 py-0.5 border-r border-slate-50 text-slate-700">{row.partName}</td>
                        <td className="px-2.5 py-0.5 border-r border-slate-50 text-center font-bold text-slate-500">{row.fasterQty}</td>
                        <td className="px-2.5 py-0.5 border-r border-slate-50 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="number"
                            min={0}
                            value={row.issuedQty}
                            onChange={e => handleIssuedQtyChange(row.id, e.target.value)}
                            className="w-16 text-center px-1 py-0.5 text-[12.5px] h-[22px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0097A7] bg-white"
                          />
                        </td>
                        <td className="px-2.5 py-0.5 border-r border-slate-50 text-center text-slate-500">{row.unit}</td>
                        <td className="px-2.5 py-0.5 border-r border-slate-50 text-right font-medium text-slate-600">
                          {row.rate.toLocaleString('en-IN')}
                        </td>
                        <td className="px-2.5 py-0.5 text-right font-bold text-[#0097A7]">
                          {(row.issuedQty * row.rate).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BOM Footer summary */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                <span>{selectedPartsCount} Part(s) Selected</span>
                <span className="text-[#0097A7]">Total: ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* ── Mid-Form Action Toolbar ── */}
            <div className="flex flex-wrap items-center justify-between border border-slate-200 py-1.5 mb-4 bg-slate-50/50 px-3 rounded-lg shadow-sm gap-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search saved spare entries..."
                    className="pl-8 pr-2 py-1 text-[13px] h-[32px] border border-slate-300 rounded w-64 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7]"
                  />
                  <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={13} />
                  </div>
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-[#0097A7] font-bold uppercase">
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3.5 py-1 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95"
                >
                  <Save size={12} /> {editingId !== null ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    if (selectedRowId) {
                      const row = sparesList.find(s => s.id === selectedRowId)
                      if (row) handleEditRow(row)
                    } else {
                      toast.warning('Please select a row to edit.')
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95"
                >
                  <Edit size={12} className="text-[#0097A7]" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95"
                >
                  <Trash2 size={12} /> Delete
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[12px] font-bold rounded shadow-sm h-[28px] transition-all active:scale-95"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              </div>
            </div>

            {/* ── Bottom Saved Spares Registry Table ── */}
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white mb-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead className="bg-slate-50 text-[12px] uppercase text-slate-400 font-bold border-b border-slate-200">
                    <tr className="h-8">
                      <th className="px-3 py-1 border-r border-slate-100 w-14 text-center">S.No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-36">Service Job No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28">Customer Code</th>
                      <th className="px-3 py-1 border-r border-slate-100">Customer Name</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28">Vehicle No</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-24">Model</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-24 text-center">Parts Qty</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-28 text-right">Total (₹)</th>
                      <th className="px-3 py-1 border-r border-slate-100 w-24">Status</th>
                      <th className="px-3 py-1 w-24 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[12.5px]">
                    {filteredSpares.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-10 text-center text-slate-300 italic">No spare entries saved.</td>
                      </tr>
                    ) : (
                      filteredSpares.map((row, idx) => (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedRowId(row.id)}
                          className={`hover:bg-[#0097A7]/5 cursor-pointer h-9 transition-colors ${selectedRowId === row.id ? 'bg-[#0097A7]/10 font-semibold' : ''}`}
                        >
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-3 py-1 border-r border-slate-50 font-bold text-[#0097A7]">{row.serviceJobNo}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-slate-500">{row.customerCode}</td>
                          <td className="px-3 py-1 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                          <td className="px-3 py-1 border-r border-slate-50 font-mono text-slate-600">{row.vehicleNo}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-slate-500 font-bold">{row.vehicleModelNo}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-center font-bold text-slate-600">{(row.selectedParts || []).length}</td>
                          <td className="px-3 py-1 border-r border-slate-50 text-right font-bold text-[#0097A7]">
                            {(row.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-1 border-r border-slate-50">
                            <span className={`px-2.5 py-0.5 rounded text-[12px] uppercase font-extrabold ${
                              row.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              row.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {row.status || 'Open'}
                            </span>
                          </td>
                          <td className="px-3 py-1 text-center text-slate-500">{row.savedDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Row Counter */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider shadow-sm">
              <span>Row : {filteredSpares.length}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}