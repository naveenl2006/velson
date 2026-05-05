import { useState, useEffect } from 'react'
import {
  ChevronRight, X, Search, Printer, Download, FileSpreadsheet, FileJson, Filter, Settings, Barcode, LayoutGrid, RotateCcw
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
    className={`px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

export default function BarcodeDetails() {
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
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Production</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Inventory Serialization Hub</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-slate-900 rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest text-slate-700">Digital Barcode Archive</h2>
            </div>
            <div className="flex gap-3">
               <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-2xl transition-all shadow-sm active:scale-95">
                <Printer size={16} className="text-[#0097A7]" /> Batch Print
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close Console
              </button>
            </div>
          </div>

          <div className="p-10 flex-1 flex flex-col space-y-10">
            {/* Filter Suite */}
            <div className="flex items-center gap-10 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 shadow-inner">
               <div className="flex items-center gap-4">
                 <Label>Activation Start</Label>
                 <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" />
               </div>
               <div className="flex items-center gap-4">
                 <Label>Activation End</Label>
                 <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" />
               </div>
               <button 
                 onClick={handleSearch}
                 className="flex items-center gap-3 px-12 py-3 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest"
               >
                 {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                 Query Serialization
               </button>
            </div>

            <div className="flex items-center justify-between mb-2 px-4">
               <div className="flex items-center gap-4">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-slate-400 rounded-full" />
                    Serialized Component Ledger
                 </h3>
                 <span className="bg-[#0097A7]/5 text-[#0097A7] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">{filteredData.length} Validated Codes</span>
               </div>
               <div className="flex items-center gap-3">
                  {[
                    { icon: <Download size={14} />, l: 'EXPORT.RAW' },
                    { icon: <FileSpreadsheet size={14} />, l: 'EXCEL' },
                    { icon: <FileJson size={14} />, l: 'JSON' },
                  ].map(tool => (
                    <button key={tool.l} className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-slate-600 text-[9px] font-black uppercase transition-all tracking-[0.1em]">
                      {tool.icon} {tool.l}
                    </button>
                  ))}
               </div>
            </div>

            {/* Matrix Result Area */}
            <div className="flex-1 border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1400px]">
                <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 border-r border-slate-100 w-20 text-center">#</th>
                    <th className="px-8 py-5 border-r border-slate-100">Digital Identity</th>
                    <th className="px-8 py-5 border-r border-slate-100">Job Reference</th>
                    <th className="px-8 py-5 border-r border-slate-100">Target Model</th>
                    <th className="px-8 py-5 border-r border-slate-100 text-center">Launch Date</th>
                    <th className="px-8 py-5 border-r border-slate-100 text-right w-40">Unit Batch</th>
                    <th className="px-8 py-5 text-center">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-widest opacity-20">
                         No digital identities found for the current range.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors h-16 group">
                        <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-800 tracking-tighter">
                           CODE-2026-{(row.id % 100000).toString().padStart(6, '0')}
                        </td>
                        <td className="px-8 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.jobNo}</td>
                        <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase tracking-tight">{row.model}</td>
                        <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-slate-300 uppercase text-[10px]">{row.reqDate}</td>
                        <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-slate-600">{row.qty} Units</td>
                        <td className="px-8 py-2 text-center">
                           <div className="flex items-center justify-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">SECURE-VERIFIED</span>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-8 bg-slate-900 rounded-[2.5rem] p-10 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/5 to-transparent pointer-events-none" />
               <div className="flex items-center gap-20 relative z-10">
                  <div>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Matrix Identities</p>
                    <p className="text-[32px] font-black text-white leading-none">{filteredData.length}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10" />
                  <div>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Serialization Auth</p>
                    <p className="text-[32px] font-black text-[#0097A7] leading-none">ACTIVE</p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30">
                  <div className="flex items-center gap-3">
                    <Barcode size={32} className="text-white" />
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.3em] italic">Encrypted Inventory Stream</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
