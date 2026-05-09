import { useState, useEffect } from 'react'
import { ChevronRight, Search, X, FileSpreadsheet, CheckCircle2, Eye, Image as ImageIcon } from 'lucide-react'
import { useToast } from '../components/Toast'

const Input = ({ placeholder, value, onChange, type = 'text', className = "" }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    className={`px-3 py-[6px] text-[12px] border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`} />
)
const Select = ({ options, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select value={value} onChange={onChange}
      className="w-full px-3 py-[6px] pr-7 text-[12px] border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer font-semibold">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
)

const STAGES = ['All', 'In Process', 'Waiting for Process', 'Close', 'Cancel']
const VEHICLE_TYPES = ['V10', 'V2I', 'COMMON', 'GEARBOX', 'RC', 'V4', 'V7', 'V9', 'VEDC', 'POWERPACK', 'GRIPPER', 'HDE', 'COMPRESSOR', 'HD 300', 'MICROBLAST']
const PRIORITIES = ['', 'P0', 'P1', 'P2', 'P3', 'P4', 'PE']
const APPROVERS = ['ERP1', 'ERP2', 'ERP3', 'ADMIN']
const STAGE_LABELS = ['Waiting', 'In Process', 'Completed', 'Cancelled']

const generateJobs = () => {
  const jobs = []
  const partPrefixes = ['VGH-', 'VC-', 'VCS-', 'VG-', 'VM-', 'VE-', 'VL-']
  const productNames = [
    'LW TILT MAST HOSE SLIDING 20MM PIN 75MM', 'LW TILT MAST HOSE SLIDING PIPE 32',
    'LW TILT MAST HOSE SLIDING PIPE 4', 'V1D IMFT TILTING MASTERING ROPE LAYING ASSM',
    'LW MASTER ROPE & CHAIN MOUNT ROPE BED PLATE', 'V3 TRACK OPERATED JOYSTIC MOUNT PLATE 4',
    'CABIN ELECTRICAL BOX PLATE 9', 'M1 Y-TYPE 110 BOTTOM OIL SEAL FLANGE',
    '6MM SQUARE ROD-83MM', 'V1D COMPRESSOR SMALL TOOLS BOX FRAME CH...',
    'D50 HITACHI 210 HAND RAIL FRAME 4 COVER PLA...', 'V10 7.7 MTR MASTER ARM PLATE TILTING SUPPO...',
    'D50 HITACHI 210 HAND RAIL FRAME 3 COVER PLA...', 'D50 HITACHI 210 HAND RAIL FRAME 1 COVER PLA...',
    'V10 SOLAR MAST TILTING MOUNT BASE FRAME B...',
    'HANDRAIL PIPE CLAMP-1', 'V1D ROD CHANGER CATCH PLATE 1',
    'GRC CYCLONE SAMPLE INLET PIPE PLATE RH',
    'V2-I 10.5" CHASSIS BED SUPPORT PLATE 4', 'V2-I 10.5 INCH CHASSIS BED SUPPORT PLATE 3',
    'V2-I 10.5 INCH CHASSIS BED SUPPORT PLATE 2', 'V2-I 10.5 CHASSIS BED SUPPORT PLATE 1',
    'V7 CENTER DRILLER STAND BAR L-610MM',
    'RC RIG TOP WINCH ROLLER ROPE GUIDE ROLLER 2', 'RC RIG TOP WINCH ROLLER ROPE GUIDE ROLLER 1',
    'RC RIG TOP WINCH ROLLER ROPE GUIDE PLATE 2', 'RC RIG TOP WINCH ROLLER ROPE GUIDE PLATE 1',
    'EMERGENCY SWITCH BOX CLAMP',
    'V10 JCB CONTROL BOX LEG PLATE 5', '60 DEG STOPPER',
    'V10 DM CENTER SLIDER 2" CHAIN ROLLER PLATE',
    'V10 2.6 FEET BOTTOM BED BASE ZIG-ZAG PLATE',
    'DELIVERY FLANGE (1/2")',
  ]
  let jobNo = 41448
  for (let i = 0; i < 35; i++) {
    const vt = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)]
    const prefix = partPrefixes[Math.floor(Math.random() * partPrefixes.length)]
    const partNum = prefix + (1000000 + Math.floor(Math.random() * 99999))
    const pct = (Math.random() * 100).toFixed(2)
    const qty = Math.floor(Math.random() * 30) + 1
    const pri = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)]
    const approver = APPROVERS[Math.floor(Math.random() * APPROVERS.length)]
    const stLabel = parseFloat(pct) >= 100 ? 'Completed' : STAGE_LABELS[Math.floor(Math.random() * 3)]
    const planDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    const reqDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')

    jobs.push({
      id: i, jobNo: jobNo + i, vehicleType: vt, partNo: partNum,
      productName: productNames[i % productNames.length],
      completedPct: parseFloat(pct), qty,
      planDate: `${planDay}/04/2026`, requiredDate: `${reqDay}/04/2026`,
      issueMonthName: 'April', priority: pri,
      technicalApprovalDate: '15/04/2026', approvalPerson: approver,
      stage: stLabel,
    })
  }
  return jobs
}

export default function ViewJobStatus() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [processStage, setProcessStage] = useState('All')
  const [fromDate, setFromDate] = useState('2026-04-15')
  const [toDate, setToDate] = useState('2026-04-15')
  const [jobs, setJobs] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => { setJobs(generateJobs()) }, [])

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.productName.toLowerCase().includes(search.toLowerCase()) || j.partNo.toLowerCase().includes(search.toLowerCase()) || String(j.jobNo).includes(search)
    const matchStage = processStage === 'All' || (processStage === 'In Process' && j.stage === 'In Process') || (processStage === 'Waiting for Process' && j.stage === 'Waiting') || (processStage === 'Close' && j.stage === 'Completed') || (processStage === 'Cancel' && j.stage === 'Cancelled')
    const matchCompleted = !showCompleted || j.completedPct >= 100
    return matchSearch && matchStage && matchCompleted
  })

  const handleSearch = () => toast.info(`Showing ${filtered.length} results.`)
  const handleExcel = () => toast.info(`Exporting ${filtered.length} records to Excel...`)

  const stageColor = (s) => {
    if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
    if (s === 'In Process') return 'bg-sky-100 text-sky-700'
    if (s === 'Waiting') return 'bg-amber-100 text-amber-700'
    if (s === 'Cancelled') return 'bg-red-100 text-red-600'
    return 'bg-slate-100 text-slate-500'
  }

  const priColor = (p) => {
    if (p === 'P0') return 'text-red-600 font-black'
    if (p === 'P1') return 'text-orange-600 font-bold'
    if (p === 'P2') return 'text-amber-600 font-bold'
    return 'text-slate-500'
  }

  const pctColor = (v) => {
    if (v >= 100) return 'text-emerald-600 font-black'
    if (v >= 50) return 'text-sky-600 font-bold'
    if (v > 0) return 'text-amber-600 font-bold'
    return 'text-slate-400'
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span><ChevronRight size={12} /><span>Technical</span><ChevronRight size={12} /><span className="text-[#0097A7]">View Job Status</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Job List</h2>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 ml-1">{filtered.length} records</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#0097A7]/5 text-[#0097A7] text-[11px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm">
                <Eye size={13} /> Job Process Details
              </button>
              <button onClick={handleExcel} className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm">
                <FileSpreadsheet size={13} /> Excel
              </button>
              <button className="text-slate-400 hover:text-red-600 transition-colors ml-1"><X size={20} strokeWidth={2.5} /></button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* ── Toolbar Row 1: Search + Process Stage ── */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Search :</span>
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job No / Part No / Product Name..." className="w-56" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Process Stage :</span>
                <Select options={STAGES} value={processStage} onChange={e => setProcessStage(e.target.value)} className="w-44" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                {/* Part Image mini */}
                <div className="w-24 h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-200">
                  <ImageIcon size={22} strokeWidth={1.2} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Part Image</span>
              </div>
            </div>

            {/* ── Toolbar Row 2: Date range + Actions ── */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">From Date :</span>
                <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-36" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">To Date :</span>
                <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-36" />
              </div>
              <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-[6px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95">
                <Search size={13} /> Search
              </button>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`flex items-center gap-1.5 px-4 py-[6px] text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95 border ${showCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <CheckCircle2 size={13} /> Completed Job
              </button>
            </div>

            {/* ── Data Table ── */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[1500px]">
                  <thead className="bg-[#d32f2f] text-[10px] uppercase text-white font-bold sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2.5 border-r border-red-400 w-8 text-center"></th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-16">Job No</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28">Vehicle Type</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28">Part No</th>
                      <th className="px-3 py-2.5 border-r border-red-400">Product Name</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24 text-center">Completed %</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-12 text-center">Qty</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24 text-center">Plan Date</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24 text-center">Required Date</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28">Issue Month</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-16 text-center">Priority</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28 text-center">Tech. Approval Date</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24">Approval Person</th>
                      <th className="px-3 py-2.5 w-24 text-center">Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="py-20 text-center text-slate-300">
                          <Search size={40} strokeWidth={1} className="mx-auto mb-2 opacity-30" />
                          <p className="text-[12px] font-bold uppercase tracking-widest">No jobs found</p>
                          <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((j, i) => (
                        <tr
                          key={j.id}
                          onClick={() => setSelectedRow(j.id)}
                          className={`h-8 transition-colors cursor-pointer text-[12px] ${selectedRow === j.id ? 'bg-[#1565C0] text-white' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}`}
                        >
                          <td className="px-2 py-1 border-r border-slate-100 text-center">
                            {selectedRow === j.id && <span className="text-white font-bold">▸</span>}
                          </td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-bold ${selectedRow === j.id ? '' : 'text-slate-700'}`}>{j.jobNo}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-semibold ${selectedRow === j.id ? '' : 'text-slate-600'}`}>{j.vehicleType}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-mono text-[11px] ${selectedRow === j.id ? '' : 'text-[#0097A7]'}`}>{j.partNo}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 truncate max-w-[250px] ${selectedRow === j.id ? '' : 'text-slate-700'}`}>{j.productName}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : pctColor(j.completedPct)}`}>{j.completedPct.toFixed(2)}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center font-bold ${selectedRow === j.id ? '' : 'text-slate-600'}`}>{j.qty}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : 'text-slate-500'}`}>{j.planDate}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : 'text-slate-500'}`}>{j.requiredDate}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 ${selectedRow === j.id ? '' : 'text-slate-500'}`}>{j.issueMonthName}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? 'font-bold' : priColor(j.priority)}`}>{j.priority || '-'}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : 'text-slate-400 text-[11px]'}`}>{j.technicalApprovalDate}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 ${selectedRow === j.id ? '' : 'text-slate-600 font-semibold'}`}>{j.approvalPerson}</td>
                          <td className="px-3 py-1 text-center">
                            {selectedRow === j.id ? (
                              <span className="text-[10px] font-bold uppercase">{j.stage}</span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${stageColor(j.stage)}`}>{j.stage}</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {filtered.length} records · Stage: {processStage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
