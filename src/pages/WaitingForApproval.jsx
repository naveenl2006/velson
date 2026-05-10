import { useState, useEffect } from 'react'
import { ChevronRight, Search, X, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { useToast } from '../components/Toast'

const Input = ({ placeholder, value, onChange, className = "" }) => (
  <input type="text" placeholder={placeholder} value={value} onChange={onChange}
    className={`px-3 py-[6px] text-[12px] border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all ${className}`} />
)

// Sample waiting-for-approval jobs seeded with realistic data
const SEED_JOBS = [
  { jobNo: 41448, vehicleType: 'V10',    partNo: 'VGH-1004441', partName: 'LW TILT MAST HOSE SLIDING 20MM PIN 75MM',          qtyV: 1,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41447, vehicleType: 'V10',    partNo: 'VGH-1004438', partName: 'LW TILT MAST HOSE SLIDING PIPE 32',                 qtyV: 1,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41446, vehicleType: 'V10',    partNo: 'VGH-1004438', partName: 'LW TILT MAST HOSE SLIDING PIPE 4',                  qtyV: 1,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41445, vehicleType: 'V10',    partNo: 'VGH-1004944', partName: 'V1D IMFT TILTING MASTERING ROPE LAYING ASSM',       qtyV: 1,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41444, vehicleType: 'COMMON', partNo: 'VC-100023',   partName: 'LW MASTER ROPE & CHAIN MOUNT ROPE BED PLATE',      qtyV: 1,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41443, vehicleType: 'V3I',    partNo: 'VCS-300471',  partName: 'V3 TRACK OPERATED JOYSTIC MOUNT PLATE 4',           qtyV: 5,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41442, vehicleType: 'V10',    partNo: 'VE-70895',    partName: 'CABIN ELECTRICAL BOX PLATE 9',                      qtyV: 30, planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41441, vehicleType: 'GEARBOX',partNo: 'VG-21905',    partName: 'M1 Y-TYPE 110 BOTTOM OIL SEAL FLANGE',             qtyV: 5,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41440, vehicleType: 'V10',    partNo: 'VC-101128',   partName: '6MM SQUARE ROD-83MM',                               qtyV: 100,planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41439, vehicleType: 'V10',    partNo: 'VGH-1001289', partName: 'V1D COMPRESSOR SMALL TOOLS BOX FRAME CH...',        qtyV: 25, planDate: '14/04/2026', requiredDate: '14/04/2026', note: '' },
  { jobNo: 41438, vehicleType: 'V10',    partNo: 'VGH-1003452', partName: 'D50 HITACHI 210 HAND RAIL FRAME 4 COVER PLA...',    qtyV: 1,  planDate: '15/04/2026', requiredDate: '14/04/2026', note: '' },
  { jobNo: 41437, vehicleType: 'V10',    partNo: 'VGH-1002100', partName: 'V10 7.7 MTR MASTER ARM PLATE TILTING SUPPO...',     qtyV: 8,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41436, vehicleType: 'V10',    partNo: 'VGH-1003452', partName: 'D50 HITACHI 210 HAND RAIL FRAME 3 COVER PLA...',    qtyV: 1,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41435, vehicleType: 'V10',    partNo: 'VGH-1003451', partName: 'D50 HITACHI 210 HAND RAIL FRAME 1 COVER PLA...',    qtyV: 2,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41434, vehicleType: 'V10',    partNo: 'VGH-1002452', partName: 'V10 SOLAR MAST TILTING MOUNT BASE FRAME B...',      qtyV: 8,  planDate: '15/04/2026', requiredDate: '15/04/2026', note: '' },
  { jobNo: 41433, vehicleType: 'V10',    partNo: 'VC-106304',   partName: 'HANDRAIL PIPE CLAMP-1',                             qtyV: 20, planDate: '14/04/2026', requiredDate: '14/04/2026', note: '' },
  { jobNo: 41430, vehicleType: 'V10',    partNo: 'VC-1000029',  partName: 'V1D ROD CHANGER CATCH PLATE 1',                     qtyV: 1,  planDate: '14/04/2026', requiredDate: '14/04/2026', note: '' },
  { jobNo: 41429, vehicleType: 'RC',     partNo: 'VRC-601987',  partName: 'GRC CYCLONE SAMPLE INLET PIPE PLATE RH',            qtyV: 1,  planDate: '14/04/2026', requiredDate: '14/04/2026', note: '' },
  { jobNo: 41428, vehicleType: 'V220',   partNo: 'VM-230223',   partName: 'V2-I 10.5" CHASSIS BED SUPPORT PLATE 4',            qtyV: 2,  planDate: '14/04/2026', requiredDate: '14/04/2026', note: '' },
  { jobNo: 41427, vehicleType: 'V7',     partNo: 'VM-200253',   partName: 'V2-I 10.5 INCH CHASSIS BED SUPPORT PLATE 3',        qtyV: 2,  planDate: '14/04/2026', requiredDate: '14/04/2026', note: '' },
]

export default function WaitingForApproval() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [jobs, setJobs] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    // Merge with any locally approved/rejected overrides
    const overrides = JSON.parse(localStorage.getItem('velson_wfa_overrides') || '{}')
    const merged = SEED_JOBS.map(j => ({ ...j, ...overrides[j.jobNo] }))
    setJobs(merged)
  }, [])

  const handleApprove = (jobNo) => {
    const updated = jobs.map(j => j.jobNo === jobNo ? { ...j, approved: true, rejected: false } : j)
    setJobs(updated)
    const overrides = JSON.parse(localStorage.getItem('velson_wfa_overrides') || '{}')
    overrides[jobNo] = { approved: true, rejected: false }
    localStorage.setItem('velson_wfa_overrides', JSON.stringify(overrides))
    toast.success(`Job #${jobNo} approved successfully.`)
  }

  const handleReject = (jobNo) => {
    const updated = jobs.map(j => j.jobNo === jobNo ? { ...j, approved: false, rejected: true } : j)
    setJobs(updated)
    const overrides = JSON.parse(localStorage.getItem('velson_wfa_overrides') || '{}')
    overrides[jobNo] = { approved: false, rejected: true }
    localStorage.setItem('velson_wfa_overrides', JSON.stringify(overrides))
    toast.warning(`Job #${jobNo} rejected.`)
  }

  const filtered = jobs.filter(j => {
    if (!search) return true
    const q = search.toLowerCase()
    return String(j.jobNo).includes(q) ||
      j.vehicleType.toLowerCase().includes(q) ||
      j.partNo.toLowerCase().includes(q) ||
      j.partName.toLowerCase().includes(q)
  })

  const pendingCount = jobs.filter(j => !j.approved && !j.rejected).length
  const approvedCount = jobs.filter(j => j.approved).length
  const rejectedCount = jobs.filter(j => j.rejected).length

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span><ChevronRight size={12} /><span>Technical</span><ChevronRight size={12} />
          <span className="text-[#0097A7]">Waiting For Approval</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">
                Waiting For Approval Job List
              </h2>
            </div>
            <button className="text-slate-400 hover:text-red-600 transition-colors"><X size={20} strokeWidth={2.5} /></button>
          </div>

          <div className="p-4 space-y-4">
            {/* ── Stats row ── */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Clock size={14} className="text-amber-500" />
                <span className="text-[11px] font-bold text-amber-700 uppercase">{pendingCount} Pending</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700 uppercase">{approvedCount} Approved</span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle size={14} className="text-red-400" />
                <span className="text-[11px] font-bold text-red-600 uppercase">{rejectedCount} Rejected</span>
              </div>
            </div>

            {/* ── Search bar ── */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Search :</span>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Job No / Vehicle Type / Part No / Part Name..."
                  className="pl-8 w-72"
                />
              </div>
              {search && (
                <button onClick={() => setSearch('')} className="text-[11px] text-slate-400 hover:text-red-500 font-bold transition-colors">Clear</button>
              )}
            </div>

            {/* ── Table ── */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#1565C0] text-white text-[11px] uppercase font-bold">
                      <th className="px-3 py-2.5 border-r border-blue-400 w-16">Job No</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-28">Vehicle Type</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-28">Part No</th>
                      <th className="px-3 py-2.5 border-r border-blue-400">Part Name</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-16 text-center">Qty/V</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-24 text-center">Plan Date</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-24 text-center">Required Date</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-32">Note</th>
                      <th className="px-3 py-2.5 w-36 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-20 text-center text-slate-300">
                          <Clock size={40} strokeWidth={1} className="mx-auto mb-2 opacity-30" />
                          <p className="text-[12px] font-bold uppercase tracking-widest">No jobs found</p>
                          <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((j, i) => {
                        const isSelected = selectedRow === j.jobNo
                        const rowBg = j.approved
                          ? 'bg-emerald-50/60'
                          : j.rejected
                          ? 'bg-red-50/60'
                          : isSelected
                          ? 'bg-[#1565C0]/8'
                          : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'

                        return (
                          <tr
                            key={j.jobNo}
                            onClick={() => setSelectedRow(j.jobNo)}
                            className={`h-9 transition-colors cursor-pointer hover:bg-blue-50/40 ${rowBg}`}
                          >
                            <td className="px-3 py-1 border-r border-slate-100 text-[12px] font-bold text-slate-700">{j.jobNo}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-[12px] font-semibold text-slate-600">{j.vehicleType}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-[11px] font-mono text-[#0097A7]">{j.partNo}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-[12px] text-slate-700 truncate max-w-[280px]">{j.partName}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-center text-[12px] font-bold text-slate-600">{j.qtyV}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-center text-[11px] text-slate-500">{j.planDate}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-center text-[11px] text-slate-500">{j.requiredDate}</td>
                            <td className="px-3 py-1 border-r border-slate-100 text-[11px] text-slate-400 italic">{j.note || '—'}</td>
                            <td className="px-3 py-1 text-center">
                              {j.approved ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                                  <CheckCircle2 size={11} /> Approved
                                </span>
                              ) : j.rejected ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                                  <XCircle size={11} /> Rejected
                                </span>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={e => { e.stopPropagation(); handleApprove(j.jobNo) }}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                                  >
                                    <CheckCircle2 size={11} /> Approve
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); handleReject(j.jobNo) }}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                                  >
                                    <XCircle size={11} /> Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {filtered.length} of {jobs.length} jobs displayed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
