import { useState, useEffect } from 'react'
import {
  ChevronRight, X, Download, FileSpreadsheet, FileJson, Filter, Settings, Wrench, CheckCircle2, RotateCcw, Trash2, Search
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

export default function BreakDownAcceptance() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    setData(saved)
    setFilteredData(saved)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
      setData(saved)
      setFilteredData(saved)
      setLoading(false)
    }, 600)
  }

  const handleAccept = (id) => {
    const updated = data.map(r => r.id === id ? { ...r, status: 'Accepted' } : r)
    setData(updated)
    setFilteredData(updated)
    localStorage.setItem('velson_breakdowns', JSON.stringify(updated))
    alert('Ticket Accepted and Initialized.')
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Maintenance</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Maintenance Acceptance Console</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[800px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Active Acceptance Queue</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleRefresh} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95">
                {loading ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
                Refresh Queue
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6 px-2">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                  Staged Breakdown Tickets
               </h3>
               <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">{filteredData.length} Staged</span>
            </div>

            <div className="flex-1 border border-slate-200 rounded-[2.5rem] overflow-hidden overflow-x-auto shadow-sm bg-white">
              <table className="w-full text-left border-collapse min-w-[1600px]">
                <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 border-r border-slate-100 w-16 text-center">#</th>
                    <th className="px-6 py-5 border-r border-slate-100">MWR Ticket</th>
                    <th className="px-6 py-5 border-r border-slate-100">Machine Unit</th>
                    <th className="px-6 py-5 border-r border-slate-100">Problem Description</th>
                    <th className="px-6 py-5 border-r border-slate-100">Reported By</th>
                    <th className="px-6 py-5 border-r border-slate-100 text-center">Severity</th>
                    <th className="px-6 py-5 border-r border-slate-100 text-center">Current Status</th>
                    <th className="px-6 py-5 text-center w-32">Acceptance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-24 text-center text-slate-300 italic">
                         <CheckCircle2 size={80} className="mx-auto mb-4 opacity-10" />
                         No tickets awaiting acceptance.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-amber-50/30 transition-colors h-16 group">
                        <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.mwrNo}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase tracking-tight">{row.machineName}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-slate-500 max-w-xs truncate">{row.problemDescription}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-black text-slate-400 uppercase text-[10px]">{row.reportedBy}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-center">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                row.priority.includes('Major') ? 'bg-rose-100 text-rose-600' : 
                                row.priority.includes('Critical') ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {row.priority || 'Standard'}
                           </span>
                        </td>
                        <td className="px-6 py-2 border-r border-slate-50 text-center">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             row.status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                           }`}>
                             {row.status}
                           </span>
                        </td>
                        <td className="px-6 py-2 text-center">
                          {row.status !== 'Accepted' ? (
                            <button onClick={() => handleAccept(row.id)} className="px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[10px] font-black rounded-lg shadow-md transition-all uppercase tracking-widest active:scale-95">
                               Accept
                            </button>
                          ) : (
                            <CheckCircle2 size={20} className="text-green-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Dark Summary Footer */}
            <div className="mt-8 bg-slate-900 rounded-[2rem] p-10 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-20 relative z-10">
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Total Queue Depth</p>
                    <p className="text-[32px] font-black text-white leading-none">{filteredData.length}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10" />
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-2">SLA Compliance</p>
                    <p className="text-[32px] font-black text-amber-500 leading-none">94.2%</p>
                  </div>
               </div>
               <div className="text-right relative z-10">
                  <p className="text-white/20 text-[11px] font-black uppercase tracking-widest italic">Authorization Required for Escalation</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
