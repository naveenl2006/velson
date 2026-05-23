import { useState, useEffect } from 'react'
import {
  ChevronRight, Search, Printer, X, Trash2, Download,
  FileSpreadsheet, FileJson, Filter, Settings, Image as ImageIcon, RotateCcw, List
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
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

const Select = ({ options, placeholder, value, onChange, className = "", disabled = false }) => (
  <div className={`relative ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-[7px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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

export default function BOMCreationReport() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [customer, setCustomer] = useState('')
  const [serialNo, setSerialNo] = useState('')
  const [assemblyPartNo, setAssemblyPartNo] = useState('')
  const [isAll, setIsAll] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_bom_creations') || localStorage.getItem('velson_bom_uploads') || '[]')
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
        const custMatch = customer ? r.customerName === customer : true
        const serialMatch = serialNo ? r.serialJobNo === serialNo : true
        const assemblyMatch = isAll ? true : (assemblyPartNo ? r.assemblyPartNo === assemblyPartNo : true)
        return dateMatch && custMatch && serialMatch && assemblyMatch
      })
      setFilteredData(result)
      setSearching(false)
    }, 600)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete BOM Creation record?')) {
      localStorage.removeItem('velson_bom_creations')
      localStorage.removeItem('velson_bom_uploads')
      setData([])
      setFilteredData([])
    }
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>BOM</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">BOM Creation Report</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Customerwise BOM Creation Report</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded shadow-sm">
                <Printer size={15} /> Print Report
              </button>
              <button onClick={handleDelete} className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[11px] font-bold rounded shadow-sm transition-all">
                <Trash2 size={15} /> Delete
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8 grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Label>From Date</Label>
                    <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label>To Date</Label>
                    <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-6 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-bold rounded-lg shadow-md transition-all active:scale-95"
                  >
                    {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
                    Search
                  </button>
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-6 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[13px] font-bold rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} className="text-[#0097A7]" />}
                    Search Details
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2"><Label>Customer Name</Label></div>
                    <div className="col-span-10">
                      <Select
                        options={Array.from(new Set(data.map(r => r.customerName).filter(Boolean)))}
                        placeholder="--- All Customers ---"
                        value={customer}
                        onChange={e => setCustomer(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2"><Label>Booking Serial No</Label></div>
                    <div className="col-span-10">
                      <Select
                        options={Array.from(new Set(data.map(r => r.serialJobNo).filter(Boolean)))}
                        placeholder="--- All Serial Numbers ---"
                        value={serialNo}
                        onChange={e => setSerialNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2"><Label>Assembly Part No</Label></div>
                    <div className="col-span-8">
                      <Select
                        options={Array.from(new Set(data.map(r => r.assemblyPartNo).filter(Boolean)))}
                        placeholder="--- All Assembly Parts ---"
                        value={assemblyPartNo}
                        onChange={e => setAssemblyPartNo(e.target.value)}
                        disabled={isAll}
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allParts"
                        checked={isAll}
                        onChange={e => setIsAll(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#0097A7] focus:ring-[#0097A7] cursor-pointer"
                      />
                      <label htmlFor="allParts" className="text-[11px] font-bold text-slate-500 uppercase cursor-pointer select-none">ALL</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col items-center justify-center border-l border-slate-100 pl-8">
                <div className="w-24 h-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-100">
                  <ImageIcon size={40} />
                </div>
                <p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">Part Preview</p>
              </div>
            </div>

            <div className="flex items-center justify-end mb-4 px-2">
              <div className="flex items-center gap-2">
                {[
                  { icon: <List size={14} />, l: 'LS' },
                  { icon: <Printer size={14} />, l: 'DOS' },
                  { icon: <FileSpreadsheet size={14} className="text-green-600" />, l: 'xls' },
                  { icon: <Download size={14} className="text-red-500" />, l: 'PDF' },
                  { icon: <Filter size={14} className="text-[#0097A7]" />, l: 'Filter' },
                  { icon: <Settings size={14} className="text-slate-500" />, l: 'Setting' },
                ].map(tool => (
                  <button
                    key={tool.l}
                    onClick={() => {
                      if (tool.l === 'DOS') window.print();
                      else alert(`${tool.l} clicked!`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg shadow-sm transition-all active:scale-95"
                  >
                    {tool.icon} {tool.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead className="bg-[#fcfdfe] text-[9px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 border-r border-slate-100 w-16 text-center">S.No</th>
                    <th className="px-5 py-4 border-r border-slate-100">BOM No</th>
                    <th className="px-5 py-4 border-r border-slate-100">Customer Name</th>
                    <th className="px-5 py-4 border-r border-slate-100">Customer Code</th>
                    <th className="px-5 py-4 border-r border-slate-100">Service Job no</th>
                    <th className="px-5 py-4 border-r border-slate-100">Assembly Part name</th>
                    <th className="px-5 py-4 border-r border-slate-100">Model Name</th>
                    <th className="px-5 py-4 border-r border-slate-100">Created Date</th>
                    <th className="px-5 py-4 text-center">Created By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-24 text-center text-slate-200 italic">
                        No BOM creation records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-[#0097A7]/5 transition-colors h-14 group">
                        <td className="px-5 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.bomNo}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                        <td className="px-5 py-2 border-r border-slate-50 text-slate-500 font-medium">{row.customerCode || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-600 uppercase text-[11px] truncate max-w-[300px]">{row.serialJobNo || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50">{row.assemblyPartNo || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50">{row.model || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-400">{row.date}</td>
                        <td className="px-5 py-2 text-center font-black text-slate-700 text-[11px]">superadmin</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-slate-900 rounded-2xl p-6 shadow-2xl flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-12">
                <div>
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Total Recordset</p>
                  <p className="text-[24px] font-black text-white leading-none">{filteredData.length}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div>
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Active Customers</p>
                  <p className="text-[24px] font-black text-[#0097A7] leading-none">
                    {new Set(filteredData.map(r => r.customerName)).size}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <button className="bg-white/5 hover:bg-white/10 text-white/50 px-6 py-2 rounded-lg border border-white/10 text-[11px] font-bold transition-all uppercase tracking-widest">
                  Request Data Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}