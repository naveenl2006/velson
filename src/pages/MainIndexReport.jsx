import { useState, useEffect } from 'react'
import { 
  ChevronRight, Search, Printer, X, Trash2, Download, 
  FileSpreadsheet, FileJson, Filter, Settings, Eye, Image as ImageIcon, RotateCcw 
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-[7px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

export default function MainIndexReport() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [customerFilter, setCustomerFilter] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_bom_main_index') || '[]')
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
        const dateMatch = d >= start && d <= end
        const customerMatch = customerFilter ? r.customerName === customerFilter : true
        return dateMatch && customerMatch
      })
      setFilteredData(result)
      setSearching(false)
    }, 600)
  }

  const handleDelete = (id) => {
    const next = data.filter(r => r.id !== id)
    setData(next)
    setFilteredData(next)
    localStorage.setItem('velson_bom_main_index', JSON.stringify(next))
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>BOM</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Production Report</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[750px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Main Index Analytics</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded shadow-sm">
                <Printer size={15} /> Print
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8 space-y-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Label>Start</Label>
                  <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40" />
                </div>
                <div className="flex items-center gap-3">
                  <Label>End</Label>
                  <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40" />
                </div>
                <button 
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-8 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                  {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
                  Analyze Data
                </button>
              </div>

              <div className="grid grid-cols-12 gap-8 items-center">
                <div className="col-span-8">
                   <Label>Filter by Customer</Label>
                   <Select options={['Customer A', 'Customer B', 'Customer C']} placeholder="--- All Active Customers ---" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)} />
                </div>
                <div className="col-span-4 flex justify-end items-end h-full">
                   <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                      <ImageIcon size={20} className="text-[#0097A7]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Mode Enabled</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#0097A7] rounded-full" />
                  Dataset Overview
               </h3>
               <div className="flex items-center gap-2">
                  {[
                    { icon: <Download size={14} />, l: 'CSV' },
                    { icon: <FileSpreadsheet size={14} />, l: 'Excel' },
                    { icon: <FileJson size={14} />, l: 'PDF' },
                  ].map(tool => (
                    <button key={tool.l} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-[#0097A7] text-[10px] font-black uppercase transition-all">
                      {tool.icon} {tool.l}
                    </button>
                  ))}
               </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead className="bg-[#fcfdfe] text-[9.5px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-4 border-r border-slate-100 w-16 text-center">S.No</th>
                    <th className="px-4 py-4 border-r border-slate-100">Index ID</th>
                    <th className="px-4 py-4 border-r border-slate-100">Customer Name</th>
                    <th className="px-4 py-4 border-r border-slate-100">Model</th>
                    <th className="px-4 py-4 border-r border-slate-100">Job No</th>
                    <th className="px-4 py-4 border-r border-slate-100">Arrival</th>
                    <th className="px-4 py-4 border-r border-slate-100">Comm.</th>
                    <th className="px-4 py-4 border-r border-slate-100 text-center">Qty</th>
                    <th className="px-4 py-4 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-24 text-center text-slate-300 italic">
                        No production records found for the selected parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-[#0097A7]/5 transition-colors h-14 group">
                        <td className="px-4 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-4 py-2 border-r border-slate-50 font-black text-[#0097A7] uppercase">{row.no}</td>
                        <td className="px-4 py-2 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                        <td className="px-4 py-2 border-r border-slate-50 font-medium text-slate-600">{row.vehicleModelNo}</td>
                        <td className="px-4 py-2 border-r border-slate-50 font-black text-slate-400">{row.serialJobNo}</td>
                        <td className="px-4 py-2 border-r border-slate-50">{row.vehicleArrivalDate || '-'}</td>
                        <td className="px-4 py-2 border-r border-slate-50">{row.workCommsingDate || '-'}</td>
                        <td className="px-4 py-2 border-r border-slate-50 text-center font-black text-slate-800">{row.vehicleQty}</td>
                        <td className="px-4 py-2 text-center">
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

            <div className="mt-6 flex items-center justify-between bg-slate-900 rounded-2xl p-5 shadow-2xl">
               <div className="flex items-center gap-10">
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total Dataset</span>
                   <span className="text-[20px] font-black text-white leading-none">{filteredData.length}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total Vehicle Qty</span>
                   <span className="text-[20px] font-black text-[#0097A7] leading-none">
                     {filteredData.reduce((acc, r) => acc + (parseInt(r.vehicleQty) || 0), 0)}
                   </span>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">Confidential Production Data</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
