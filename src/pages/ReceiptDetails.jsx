import { useState, useEffect } from 'react'
import { 
  ChevronRight, Search, RotateCcw, Edit2, Trash2, Printer, 
  X, Download, FileSpreadsheet, FileJson, Filter, Settings, Database, ArrowRight, Eye
} from 'lucide-react'
import ConfirmDialog from '../components/ConfirmDialog'

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
    className={`px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

export default function ReceiptDetails() {
  const [fromDate, setFromDate] = useState('2026-04-09')
  const [toDate, setToDate] = useState('2026-04-15')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [searching, setSearching] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_receipts') || '[]')
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

  const handleDelete = () => {
    const next = data.filter(r => r.id !== confirmDelete.id)
    setData(next)
    setFilteredData(next)
    localStorage.setItem('velson_receipts', JSON.stringify(next))
    setConfirmDelete({ open: false, id: null })
    setSelectedId(null)
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <ConfirmDialog 
        open={confirmDelete.open} 
        onConfirm={handleDelete} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
      />

      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Receipt Registry</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-[#0097A7] rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Master Receipt Transaction Archive</h2>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => selectedId ? setConfirmDelete({ open: true, id: selectedId }) : alert('Select a transaction first')}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-black rounded-2xl transition-all shadow-md active:scale-95"
              >
                <Trash2 size={18} /> Purge Entry
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-[12px] font-black rounded-2xl transition-all shadow-md">
                <X size={20} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Control Suite */}
            <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner flex items-center justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Database size={180} />
               </div>

               <div className="flex items-center gap-12 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="space-y-1.5">
                        <Label>Archive Start</Label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                     </div>
                     <div className="space-y-1.5">
                        <Label>Archive End</Label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                     </div>
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={searching}
                    className="px-12 h-[42px] bg-slate-900 hover:bg-black text-white text-[12px] font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                    Sync Archive
                  </button>
               </div>

               <div className="flex items-center gap-8 relative z-10">
                  <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
                    {[{ icon: <FileSpreadsheet size={16} />, l: 'EXCEL' }, { icon: <FileJson size={16} />, l: 'PDF' }].map(tool => (
                      <button key={tool.l} className="flex items-center gap-2 text-slate-300 hover:text-[#0097A7] text-[10px] font-black uppercase tracking-widest transition-all italic">
                        {tool.icon} {tool.l}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Matrix Result Layer */}
            <div className="flex-1">
               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1400px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">#</th>
                       <th className="px-8 py-6 border-r border-slate-100">Doc Ref</th>
                       <th className="px-8 py-6 border-r border-slate-100">Value Date</th>
                       <th className="px-8 py-6 border-r border-slate-100">Category</th>
                       <th className="px-8 py-6 border-r border-slate-100">Ledger Entity</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-40">Revenue Value</th>
                       <th className="px-8 py-6 border-r border-slate-100">Vector</th>
                       <th className="px-8 py-6 border-r border-slate-100">Financial Hub</th>
                       <th className="px-8 py-6 text-center w-24">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     {filteredData.length === 0 ? (
                       <tr>
                         <td colSpan={9} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-widest opacity-30">
                            No intake records discovered in the current temporal frame.
                         </td>
                       </tr>
                     ) : (
                       filteredData.map((row, idx) => (
                         <tr 
                           key={row.id} 
                           onClick={() => setSelectedId(row.id)}
                           className={`cursor-pointer transition-all h-18 group ${selectedId === row.id ? 'bg-[#0097A7]/5' : 'hover:bg-slate-50'}`}
                         >
                           <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-[#0097A7] uppercase">{row.receiptNo}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-400 text-[11px] uppercase">{row.date}</td>
                           <td className="px-8 py-2 border-r border-slate-50"><span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{row.receiptType}</span></td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-800 uppercase tracking-tighter">{row.partyName}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-green-600 text-lg tracking-tighter">{parseFloat(row.amount).toFixed(2)}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-400 text-[11px] uppercase tracking-widest">{row.cashBank}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-700 italic">{row.bankName || 'PRIMARY HUB'}</td>
                           <td className="px-8 py-2 text-center">
                              <button className="p-2.5 text-slate-200 hover:text-[#0097A7] hover:bg-[#0097A7]/10 rounded-xl transition-all">
                                 <Eye size={18} />
                              </button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-12 bg-slate-900 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Total Intake Summary</p>
                    <div className="flex items-center gap-12">
                       <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Transaction Count</p>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">{filteredData.length}</p>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div className="flex flex-col">
                          <p className="text-green-500 text-[10px] font-black uppercase mb-1">Aggregate Revenue</p>
                          <p className="text-[32px] font-black text-white leading-none tracking-tighter">
                             {filteredData.reduce((acc, r) => acc + parseFloat(r.amount), 0).toFixed(2)}
                          </p>
                       </div>
                    </div>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight text-white/50">Receipt Matrix Integrity Hub</span>
                    <ArrowRight size={24} className="text-[#0097A7]" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
