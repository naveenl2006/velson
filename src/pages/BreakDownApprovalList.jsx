import { useState, useEffect } from 'react'
import {
  ChevronRight, X, Search, Download, FileSpreadsheet, FileJson, Filter, Settings, Wrench, Calendar, RotateCcw, CheckCircle2
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

export default function BreakDownApprovalList() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    setData(saved)
    setFilteredData(saved)
  }, [])

  const handleSearch = () => {
    setSearching(true)
    setTimeout(() => {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      const result = data.filter(r => {
        const d = new Date(r.date)
        return d >= start && d <= end
      })
      setFilteredData(result)
      setSearching(false)
    }, 600)
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Maintenance</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Maintenance Approval Hub</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-600 rounded" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Post-Maintenance Approval Ledger</h2>
            </div>
            <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all shadow-sm">
              <X size={18} strokeWidth={2.5} /> Close
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col space-y-8">
            {/* Filter Hub */}
            <div className="flex items-center gap-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
               <div className="flex items-center gap-4">
                 <Label>Filter From</Label>
                 <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" />
               </div>
               <div className="flex items-center gap-4">
                 <Label>Filter To</Label>
                 <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" />
               </div>
               <button 
                 onClick={handleSearch}
                 className="flex items-center gap-3 px-10 py-2.5 bg-green-600 hover:bg-green-700 text-white text-[13px] font-black rounded-xl shadow-md transition-all active:scale-95 uppercase tracking-widest"
               >
                 {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                 Search Approvals
               </button>
            </div>

            <div className="flex-1 border border-slate-200 rounded-[2.5rem] overflow-hidden overflow-x-auto shadow-sm bg-white">
              <table className="w-full text-left border-collapse min-w-[1800px]">
                <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 border-r border-slate-100 w-16 text-center">#</th>
                    <th className="px-6 py-5 border-r border-slate-100">Ticket ID</th>
                    <th className="px-6 py-5 border-r border-slate-100">Machine Unit</th>
                    <th className="px-6 py-5 border-r border-slate-100">Process Ref</th>
                    <th className="px-6 py-5 border-r border-slate-100">Date Incident</th>
                    <th className="px-6 py-5 border-r border-slate-100">Diagnosis</th>
                    <th className="px-6 py-5 border-r border-slate-100">Reported By</th>
                    <th className="px-6 py-5 border-r border-slate-100">Current Status</th>
                    <th className="px-6 py-5 text-center">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12.5px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-[0.2em] opacity-30">
                         Approval Ledger Clear
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-green-50/20 transition-colors h-16 group">
                        <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-black text-green-600">{row.mwrNo}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase tracking-tight">{row.machineName}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-slate-500 font-medium uppercase text-[10px] tracking-widest">{row.processStage || 'Direct'}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-slate-400 font-black text-[10px]">{row.date}</td>
                        <td className="px-6 py-2 border-r border-slate-50 max-w-xs truncate italic text-slate-400">{row.problemDescription}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-600 uppercase text-[10px]">{row.reportedBy}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-center">
                           <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                             row.status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                           }`}>
                             {row.status}
                           </span>
                        </td>
                        <td className="px-6 py-2 text-center">
                           <div className="flex items-center justify-center gap-2">
                              <CheckCircle2 size={16} className={row.status === 'Accepted' ? 'text-green-500' : 'text-slate-200'} />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CO-Auth</span>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Premium Aggregate Footer */}
            <div className="mt-8 bg-slate-900 rounded-[2.5rem] p-10 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-20 relative z-10">
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Total Approvals</p>
                    <p className="text-[32px] font-black text-white leading-none">{filteredData.length}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10" />
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Pending Clearances</p>
                    <p className="text-[32px] font-black text-green-500 leading-none">{filteredData.filter(d => d.status !== 'Accepted').length}</p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-20">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-white" />
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Compliance History Stream</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
