import { useState, useEffect } from 'react'
import {
  ChevronRight, X, Search, FileSpreadsheet, Play, Calendar, CheckCircle2, LayoutGrid, Settings, Filter, Download, FileJson, Camera, RotateCcw
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-4 py-2 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 shadow-sm ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative group ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 pr-10 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer shadow-sm"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center group-hover:text-[#0097A7] transition-colors">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

export default function JobList() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_production_jobs') || '[]')
    setData(saved)
    setFilteredData(saved)
  }, [])

  const handleSearch = () => {
    setSearching(true)
    setTimeout(() => {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      const result = data.filter(r => {
        const d = new Date(r.reqDate)
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
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Production</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Production Job Oversight</span>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-teal-600 rounded shadow-sm" />
              <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-[0.2em]">Live Production Matrix</h2>
            </div>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                <LayoutGrid size={18} className="text-[#0097A7]" /> Process Insight
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-black rounded-2xl transition-all shadow-md">
                <X size={20} strokeWidth={2.5} /> Close Tracker
              </button>
            </div>
          </div>

          <div className="p-10 flex-1 flex flex-col space-y-12">
            {/* Control Suite */}
            <div className="grid grid-cols-12 gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
               <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
                  <div className="grid grid-cols-12 gap-6 items-end">
                     <div className="col-span-7">
                        <Label>Search Vector</Label>
                        <Input placeholder="Query Job ID / Configuration / Part No..." className="w-full" />
                     </div>
                     <div className="col-span-5">
                        <Label>Operational Stage</Label>
                        <Select options={['All Sequences', 'Fabrication Alpha', 'Machining Beta', 'Final Assembly']} value="All Sequences" />
                     </div>
                  </div>
                  <div className="flex flex-wrap items-end gap-6">
                     <div className="flex flex-col gap-1.5">
                        <Label>Interval Start</Label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" />
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <Label>Interval End</Label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" />
                     </div>
                     <button 
                       onClick={handleSearch}
                       className="flex items-center justify-center gap-3 px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest min-w-[200px]"
                     >
                       {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                       Filter Matrix
                     </button>
                  </div>
               </div>

               <div className="col-span-12 lg:col-span-3 flex flex-col pl-8 border-l border-slate-200/50">
                  <Label>Asset Preview</Label>
                  <div className="mt-2 flex-1 bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-200 relative overflow-hidden group shadow-sm min-h-[140px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0097A708,transparent)]" />
                    <Camera size={40} strokeWidth={1} className="group-hover:scale-110 transition-transform opacity-10 relative z-10" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-20 italic relative z-10">No Visual Blueprint</p>
                  </div>
               </div>
            </div>

            {/* Matrix Data Layer */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-6 px-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-4 bg-teal-500 rounded-full" />
                    Global Production Ledger
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="bg-teal-50 text-teal-700 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{filteredData.length} Live Sequences</span>
                    <button className="p-2 text-slate-300 hover:text-teal-600 transition-all"><Settings size={20} /></button>
                  </div>
               </div>

               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden overflow-x-auto shadow-sm bg-white">
                 <table className="w-full text-left border-collapse min-w-[1800px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">#</th>
                       <th className="px-8 py-6 border-r border-slate-100">Job Reference</th>
                       <th className="px-8 py-6 border-r border-slate-100">Client Entity</th>
                       <th className="px-8 py-6 border-r border-slate-100">Configuration</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-center w-32">Efficiency</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-center w-32">Units</th>
                       <th className="px-8 py-6 border-r border-slate-100">Target Date</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-center w-40">Priority</th>
                       <th className="px-8 py-6 text-center w-32">Control</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[13px]">
                     {filteredData.length === 0 ? (
                       <tr>
                         <td colSpan={9} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-widest opacity-30">
                            Matrix Stream Offline - No Active Sequences
                         </td>
                       </tr>
                     ) : (
                       filteredData.map((row, idx) => (
                         <tr key={row.id} className="hover:bg-teal-50/20 transition-colors h-16 group">
                           <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">
                             <Play size={14} className="mx-auto text-teal-400 fill-teal-400 group-hover:scale-110 transition-transform" />
                           </td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-rose-600">{row.jobNo}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase">{row.cusName}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-medium text-slate-500 italic truncate max-w-xs">{row.model}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <span className="text-[12px] font-black text-teal-600">0.0%</span>
                                 <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="w-0 h-full bg-teal-500" />
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-slate-800">{row.qty}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-tighter">{row.reqDate}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center">
                              <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">
                                {row.priority}
                              </span>
                           </td>
                           <td className="px-8 py-2 text-center">
                              <div className="flex items-center justify-center gap-3">
                                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">{row.status}</span>
                              </div>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-8 bg-slate-900 rounded-[3rem] p-12 flex items-center justify-between shadow-2xl border border-slate-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Live Throughput</p>
                    <p className="text-[36px] font-black text-white leading-none">{filteredData.length} Sequences</p>
                  </div>
                  <div className="w-[1px] h-14 bg-white/10" />
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Target Variance</p>
                    <p className="text-[36px] font-black text-teal-500 leading-none">+12.4%</p>
                  </div>
               </div>
               <div className="flex flex-col gap-4 text-right relative z-10">
                  <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic">Global Matrix Synchronization: Active</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
