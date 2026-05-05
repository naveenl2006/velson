import { useState, useEffect } from 'react'
import {
  ChevronRight, X, Download, FileSpreadsheet, FileJson, Filter, Settings, Search, Wrench, CheckCircle2, RotateCcw, Trash2
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

export default function BreakDownClearence() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    setData(saved)
    setFilteredData(saved)
  }, [])

  const handleRefresh = () => {
    setSearching(true)
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
      setData(saved)
      setFilteredData(saved)
      setSearching(false)
    }, 600)
  }

  const handleDelete = (id) => {
    const next = data.filter(r => r.id !== id)
    setData(next)
    setFilteredData(next)
    localStorage.setItem('velson_breakdowns', JSON.stringify(next))
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Maintenance</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Breakdown Clearance Report</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[750px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#0097A7] rounded" />
              <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Maintenance Clearance Ledger</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleRefresh} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95">
                {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
                Sync Data
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 px-2">
               <div className="flex items-center gap-4">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#0097A7] rounded-full" />
                    Archive Explorer
                 </h3>
                 <span className="bg-slate-100 text-slate-500 px-3 py-0.5 rounded-full text-[10px] font-bold">{filteredData.length} Records</span>
               </div>
               <div className="flex items-center gap-2">
                  {[
                    { icon: <Download size={14} />, l: 'CSV' },
                    { icon: <FileSpreadsheet size={14} />, l: 'XLS' },
                    { icon: <FileJson size={14} />, l: 'PDF' },
                  ].map(tool => (
                    <button key={tool.l} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-[#0097A7] text-[10px] font-black uppercase transition-all">
                      {tool.icon} {tool.l}
                    </button>
                  ))}
               </div>
            </div>

            {/* Table */}
            <div className="flex-1 border border-slate-200 rounded-[2rem] overflow-hidden overflow-x-auto shadow-sm bg-white">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 border-r border-slate-100 w-16 text-center">#</th>
                    <th className="px-6 py-5 border-r border-slate-100">MWR Ticket</th>
                    <th className="px-6 py-5 border-r border-slate-100">Machine Unit</th>
                    <th className="px-6 py-5 border-r border-slate-100">Location</th>
                    <th className="px-6 py-5 border-r border-slate-100">Reported By</th>
                    <th className="px-6 py-5 border-r border-slate-100 text-center">Severity</th>
                    <th className="px-6 py-5 border-r border-slate-100">Timeline</th>
                    <th className="px-6 py-5 border-r border-slate-100">Diagnostics Summary</th>
                    <th className="px-6 py-5 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12.5px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-24 text-center text-slate-200 italic">
                         <Wrench size={64} className="mx-auto mb-4 opacity-10" />
                         No maintenance clearance logs found in the local session.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-[#0097A7]/5 transition-colors h-16 group">
                        <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.mwrNo}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase">{row.machineName}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-slate-500 font-medium">{row.location || 'NA'}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-black text-slate-400 uppercase text-[10px]">{row.reportedBy}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                row.priority.includes('Major') ? 'bg-rose-100 text-rose-600' : 
                                row.priority.includes('Critical') ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {row.priority || 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-300 uppercase text-[10px]">{new Date(row.date).toLocaleString()}</td>
                        <td className="px-6 py-2 border-r border-slate-50 max-w-xs truncate text-slate-600">{row.problemDescription}</td>
                        <td className="px-6 py-2 text-center">
                          <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Premium Aggregate Footer */}
            <div className="mt-8 bg-slate-900 rounded-3xl p-8 flex items-center justify-between shadow-2xl border border-slate-800">
               <div className="flex items-center gap-16">
                 <div>
                   <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Total Logs</p>
                   <p className="text-[28px] font-black text-white leading-none">{filteredData.length}</p>
                 </div>
                 <div className="w-[1px] h-10 bg-white/10" />
                 <div>
                   <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">System Uptime</p>
                   <p className="text-[28px] font-black text-[#0097A7] leading-none">99.8%</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic leading-none">Confidential Audit Stream</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
