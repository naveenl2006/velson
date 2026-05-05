import { useState, useEffect } from 'react'
import { 
  ChevronRight, Search, Printer, X, Trash2, Download, 
  FileSpreadsheet, FileJson, Filter, Settings, ShieldAlert, RotateCcw 
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

export default function NCDCDetails() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_nc_dc_entries') || '[]')
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

  const handleDelete = (id) => {
    const next = data.filter(r => r.id !== id)
    setData(next)
    setFilteredData(next)
    localStorage.setItem('velson_nc_dc_entries', JSON.stringify(next))
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>NC</span> <ChevronRight size={12} /> <span className="text-rose-500">NC DC Details Report</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[750px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-600" size={18} />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Non-Conformance DC Analytics</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded shadow-sm">
                <Printer size={15} /> Print Summary
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-8 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
               <div className="flex items-center gap-3">
                 <Label>Range Start</Label>
                 <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40" />
               </div>
               <div className="flex items-center gap-3">
                 <Label>Range End</Label>
                 <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40" />
               </div>
               <button 
                 onClick={handleSearch}
                 className="flex items-center gap-2 px-10 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-bold rounded-lg shadow-md transition-all active:scale-95"
               >
                 {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
                 Filter NC Records
               </button>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-rose-600 rounded-full" />
                  NC DC Activity Ledger
               </h3>
               <div className="flex items-center gap-2">
                  {[
                    { icon: <Download size={14} />, l: 'CSV' },
                    { icon: <FileSpreadsheet size={14} />, l: 'XLS' },
                    { icon: <FileJson size={14} />, l: 'PDF' },
                  ].map(tool => (
                    <button key={tool.l} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-rose-600 text-[10px] font-black uppercase transition-all">
                      {tool.icon} {tool.l}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead className="bg-[#fcfdfe] text-[9.5px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 border-r border-slate-100 w-16 text-center">#</th>
                    <th className="px-5 py-4 border-r border-slate-100">NC DC ID</th>
                    <th className="px-5 py-4 border-r border-slate-100">Customer Entity</th>
                    <th className="px-5 py-4 border-r border-slate-100">Category</th>
                    <th className="px-5 py-4 border-r border-slate-100 text-center w-32">Total Items</th>
                    <th className="px-5 py-4 border-r border-slate-100 text-right w-40">Valuation</th>
                    <th className="px-5 py-4 border-r border-slate-100 text-center">Logistics</th>
                    <th className="px-5 py-4 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12.5px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-24 text-center text-slate-300 italic">
                        No non-conformance records found for the active scope.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-rose-50/30 transition-colors h-14 group">
                        <td className="px-5 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-black text-rose-600">{row.dcNo}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                        <td className="px-5 py-2 border-r border-slate-50 uppercase text-[10px] font-black text-slate-400">{row.dcType}</td>
                        <td className="px-5 py-2 border-r border-slate-50 text-center font-black text-slate-800">{row.items.length} Units</td>
                        <td className="px-5 py-2 border-r border-slate-50 text-right font-black text-slate-600">{row.totalAmount}</td>
                        <td className="px-5 py-2 border-r border-slate-50 text-center">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.desThrough || 'Manual'}</span>
                        </td>
                        <td className="px-5 py-2 text-center">
                          <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
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
                   <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Dataset Volume</p>
                   <p className="text-[28px] font-black text-white leading-none">{filteredData.length}</p>
                 </div>
                 <div className="w-[1px] h-10 bg-white/10" />
                 <div>
                   <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Total NC Value</p>
                   <p className="text-[28px] font-black text-rose-500 leading-none">
                     INR {filteredData.reduce((acc, r) => acc + parseFloat(r.totalAmount || 0), 0).toFixed(2)}
                   </p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic leading-none">Internal Audit Enabled</p>
                  </div>
                  <ShieldAlert className="text-rose-600/30" size={32} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
