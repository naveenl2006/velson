import { useState } from 'react'
import { ChevronRight, X, Search, FileSpreadsheet, FileText } from 'lucide-react'
import { useToast } from '../components/Toast'

const FilterInput = ({ value, onChange, type = 'text', placeholder = '', className = '' }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    className={`px-2 py-[5px] text-[12px] border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0097A7] transition-all ${className}`} />
)

const SEED = [
  { jobNo: 41399, partNo: 'VC-100015',   partName: '10" SINGLE ROPE PULLEY 54',              qty: 5,  cancelDate: '14/04/2026', cancelledBy: 'ERP1', cancelReason: 'Design change', status: 'Cancelled' },
  { jobNo: 41387, partNo: 'VGH-1002100', partName: 'V10 7.7 MTR MASTER ARM PLATE TILTING',   qty: 2,  cancelDate: '13/04/2026', cancelledBy: 'ERP2', cancelReason: 'Duplicate job created', status: 'Cancelled' },
  { jobNo: 41372, partNo: 'VC-103207',   partName: 'FOOT CLAMP 180 TILTING JACKEY PIN',       qty: 4,  cancelDate: '12/04/2026', cancelledBy: 'ADMIN', cancelReason: 'Customer order cancelled', status: 'Cancelled' },
  { jobNo: 41358, partNo: 'VM-200253',   partName: 'V2-I 10.5 INCH CHASSIS BED SUPPORT',      qty: 8,  cancelDate: '11/04/2026', cancelledBy: 'ERP1', cancelReason: 'Incorrect part number entered', status: 'Cancelled' },
  { jobNo: 41341, partNo: 'VRC-601987',  partName: 'GRC CYCLONE SAMPLE INLET PIPE PLATE RH',  qty: 1,  cancelDate: '10/04/2026', cancelledBy: 'ERP3', cancelReason: 'Material not available', status: 'Cancelled' },
  { jobNo: 41325, partNo: 'VCS-300471',  partName: 'V3 TRACK OPERATED JOYSTIC MOUNT PLATE',   qty: 3,  cancelDate: '09/04/2026', cancelledBy: 'ERP2', cancelReason: 'Revision pending from engineering', status: 'Cancelled' },
  { jobNo: 41312, partNo: 'VE-70895',    partName: 'CABIN ELECTRICAL BOX PLATE 9',              qty: 10, cancelDate: '08/04/2026', cancelledBy: 'ADMIN', cancelReason: 'Wrong model selected', status: 'Cancelled' },
]

export default function JobCardCancel() {
  const toast = useToast()
  const today = new Date().toISOString().split('T')[0]
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)

  const filtered = SEED.filter(r =>
    !search || String(r.jobNo).includes(search) ||
    r.partNo.toLowerCase().includes(search.toLowerCase()) ||
    r.partName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span><ChevronRight size={12} /><span>Technical</span><ChevronRight size={12} />
          <span className="text-[#0097A7]">Job Card Cancel</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Job Card Cancel List</h2>
              <span className="ml-1 text-[10px] font-bold bg-white text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">{filtered.length} records</span>
            </div>
            <button className="text-slate-400 hover:text-red-600 transition-colors"><X size={20} strokeWidth={2.5} /></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Search :</span>
                <FilterInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Job No / Part No..." className="w-52" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">From :</span>
                <FilterInput type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-36" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">To :</span>
                <FilterInput type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-36" />
              </div>
              <button onClick={() => toast.info(`${filtered.length} cancelled jobs.`)}
                className="flex items-center gap-1.5 px-4 py-[5px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95">
                <Search size={13} /> Search
              </button>
              <div className="ml-auto flex items-center gap-3">
                <button onClick={() => toast.info('Exporting...')} className="flex items-center gap-1 text-[11px] font-bold text-emerald-600"><FileSpreadsheet size={13} /> Excel</button>
                <button onClick={() => toast.info('PDF...')} className="flex items-center gap-1 text-[11px] font-bold text-red-500"><FileText size={13} /> Pdf</button>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="sticky top-0 z-10 bg-[#4472C4] text-white text-[10px] uppercase font-bold">
                    <tr>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-12 text-center">S.No</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-16">Job No</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-28">Part No</th>
                      <th className="px-3 py-2.5 border-r border-blue-400">Part Name</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-14 text-center">Qty</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-24 text-center">Cancel Date</th>
                      <th className="px-3 py-2.5 border-r border-blue-400 w-24">Cancelled By</th>
                      <th className="px-3 py-2.5 border-r border-blue-400">Cancel Reason</th>
                      <th className="px-3 py-2.5 w-24 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filtered.map((r, i) => {
                      const isSel = selectedRow === i
                      return (
                        <tr key={i} onClick={() => setSelectedRow(i)}
                          className={`h-9 cursor-pointer text-[12px] transition-colors ${isSel ? 'bg-[#1565C0] text-white' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}`}>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center font-bold ${isSel ? '' : 'text-slate-400'}`}>{i + 1}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-bold ${isSel ? '' : 'text-slate-700'}`}>{r.jobNo}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-mono text-[11px] ${isSel ? '' : 'text-[#0097A7]'}`}>{r.partNo}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 truncate max-w-[200px] ${isSel ? '' : 'text-slate-700'}`}>{r.partName}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center font-bold ${isSel ? '' : 'text-slate-600'}`}>{r.qty}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center ${isSel ? '' : 'text-red-500 font-bold'}`}>{r.cancelDate}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-semibold ${isSel ? '' : 'text-slate-600'}`}>{r.cancelledBy}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 italic ${isSel ? '' : 'text-slate-500'}`}>{r.cancelReason}</td>
                          <td className="px-3 py-1 text-center">
                            {isSel ? r.status : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">{r.status}</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500">Row : {filtered.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
