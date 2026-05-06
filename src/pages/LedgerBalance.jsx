import { useState, useEffect } from 'react'
import { ChevronRight, Search, Printer, X, FileBarChart, Download, FileSpreadsheet, FileJson, Filter, Settings, RotateCcw, Landmark, ArrowRightLeft, TrendingUp, Calendar } from 'lucide-react'

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
    className={`px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 pr-10 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
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

const LEDGERS = [
  { name: 'JSA HI TECH ROOF INDIA PVT LTD', group: 'SUNDRY CREDITORS', id: '593', bal: '666544.24' },
  { name: 'ABC Enterprises', group: 'SUNDRY DEBTORS', id: '1001', bal: '38000.00' },
  { name: 'X-Caliber Forge', group: 'SUNDRY CREDITORS', id: '5001', bal: '87000.00' },
  { name: 'Electricity Expenses', group: 'INDIRECT EXPENSES', id: '2001', bal: '1500.00' },
  { name: 'Depreciation A/C', group: 'INDIRECT EXPENSES', id: '3001', bal: '5000.00' },
]

const SAMPLE_TRANS = [
  { id: 1, date: '2026-04-01', vouType: 'VOUCHER', vouNo: 'V-101', particulars: 'Opening Balance', debit: '0.00', credit: '10000.00', balance: '10000.00 CR' },
  { id: 2, date: '2026-04-05', vouType: 'RECEIPT', vouNo: 'R-501', particulars: 'Cash Receipt', debit: '0.00', credit: '5000.00', balance: '15000.00 CR' },
  { id: 3, date: '2026-04-10', vouType: 'PAYMENT', vouNo: 'P-202', particulars: 'Vendor Payment', debit: '8000.00', credit: '0.00', balance: '7000.00 CR' },
  { id: 4, date: '2026-04-15', vouType: 'JOURNAL', vouNo: 'J-808', particulars: 'Adjustment Entry', debit: '2000.00', credit: '0.00', balance: '5000.00 CR' },
]

export default function LedgerBalance() {
  const [fromDate, setFromDate] = useState('2026-04-01')
  const [toDate, setToDate] = useState('2026-04-15')
  const [ledgerAc, setLedgerAc] = useState('')
  const [type, setType] = useState('ALL')
  const [isDateWise, setIsDateWise] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [reportData, setReportData] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = () => {
    if (!ledgerAc) { alert('Select a ledger first'); return }
    setSearching(true)
    setTimeout(() => {
      setReportData(SAMPLE_TRANS)
      setSearching(false)
    }, 600)
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Ledger Analytics Hub</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-[#0097A7] rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Live Ledger Statement Analysis</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <Printer size={18} className="text-[#0097A7]" /> Generate Print
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-black rounded-2xl transition-all shadow-md">
                <X size={20} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Control Suite */}
            <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <FileBarChart size={180} />
               </div>

               <div className="grid grid-cols-12 gap-10 relative z-10">
                  <div className="col-span-4 flex items-center gap-6">
                     <div className="flex-1 space-y-1.5">
                        <Label>Archive Start</Label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                     </div>
                     <div className="flex-1 space-y-1.5">
                        <Label>Archive End</Label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                     </div>
                  </div>

                  <div className="col-span-5 relative">
                     <div className="space-y-1.5">
                        <Label>Ledger Entity Hub</Label>
                        <div className="relative group">
                           <Input 
                             placeholder="Search Global Ledger Index..." 
                             value={ledgerAc} 
                             onChange={e => { setLedgerAc(e.target.value); setShowDropdown(true); }} 
                             onFocus={() => setShowDropdown(true)}
                             className="!font-black text-[#0097A7] !pr-10" 
                           />
                           <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                              <Landmark size={20} />
                           </div>
                        </div>
                     </div>
                     
                     {showDropdown && (
                       <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 max-h-[400px] overflow-y-auto mt-4 p-4 border-2 border-slate-100 animate-in fade-in slide-in-from-top-4 duration-200">
                         <div className="px-4 py-2 border-b border-slate-50 mb-2">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Ledger Suggestions</span>
                         </div>
                         <table className="w-full text-left border-collapse">
                           <tbody className="divide-y divide-slate-50">
                             {LEDGERS.filter(l => l.name.toLowerCase().includes(ledgerAc.toLowerCase())).map((l, idx) => (
                               <tr 
                                 key={idx} 
                                 className="hover:bg-[#0097A7]/5 cursor-pointer transition-colors group"
                                 onClick={() => { setLedgerAc(l.name); setShowDropdown(false); }}
                               >
                                 <td className="px-4 py-3 text-[13px] font-black text-slate-700 group-hover:text-[#0097A7]">{l.name}</td>
                                 <td className="px-4 py-3 text-[11px] font-bold text-slate-300 uppercase">{l.group}</td>
                                 <td className="px-4 py-3 text-[13px] font-black text-slate-800 text-right">{l.bal}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     )}
                     {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
                  </div>

                  <div className="col-span-3 flex items-end gap-6">
                     <div className="flex-1 space-y-1.5">
                        <Label>Entry Vector</Label>
                        <Select options={['ALL TRANSACTIONS', 'CASH ONLY', 'ADJUSTMENT ONLY', 'OPENING ONLY']} value={type} onChange={e => setType(e.target.value)} />
                     </div>
                     <button 
                      onClick={handleSearch}
                      disabled={searching}
                      className="px-10 h-[42px] bg-slate-900 hover:bg-black text-white text-[12px] font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2"
                     >
                       {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                       Query Matrix
                     </button>
                  </div>
               </div>

               <div className="flex items-center gap-10 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-4 cursor-pointer group">
                     <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isDateWise} 
                          onChange={e => setIsDateWise(e.target.checked)} 
                          className="peer sr-only" 
                        />
                        <div className="w-10 h-5 bg-slate-200 rounded-full transition-all peer-checked:bg-[#0097A7]" />
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                     </div>
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#0097A7] transition-colors">Date-Chronological Sort</span>
                  </label>
               </div>
            </div>

            {/* Matrix Hub */}
            <div className="flex-1">
               {reportData.length === 0 ? (
                 <div className="h-[500px] border border-slate-200 border-dashed rounded-[3.5rem] bg-slate-50/30 flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 opacity-20">
                       <Database size={32} className="text-[#0097A7]" />
                    </div>
                    <div className="text-center space-y-2 opacity-30">
                       <p className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em]">Ledger Ledger Stream Offline</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase italic">Initiate Query to Stream Financial Data</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between px-6">
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3 bg-[#0097A7]/5 px-6 py-2 rounded-2xl border border-[#0097A7]/10">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Stream ID:</span>
                            <span className="text-[13px] font-black text-[#0097A7] uppercase">{ledgerAc}</span>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Temporal Range:</span>
                            <span className="text-[13px] font-black text-slate-600 uppercase">{fromDate} / {toDate}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          {[
                            { icon: <FileSpreadsheet size={16} />, l: 'EXCEL' },
                            { icon: <FileJson size={16} />, l: 'JSON' },
                            { icon: <Download size={16} />, l: 'RAW.DATA' }
                          ].map(tool => (
                            <button key={tool.l} className="flex items-center gap-2 px-4 py-1.5 text-slate-300 hover:text-[#0097A7] text-[10px] font-black uppercase tracking-widest transition-all">
                              {tool.icon} {tool.l}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                       <table className="w-full text-left border-collapse min-w-[1400px]">
                          <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                            <tr>
                              <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">#</th>
                              <th className="px-8 py-6 border-r border-slate-100">Value Date</th>
                              <th className="px-8 py-6 border-r border-slate-100">Protocol</th>
                              <th className="px-8 py-6 border-r border-slate-100">Doc Ref</th>
                              <th className="px-8 py-6 border-r border-slate-100">Narration / Particulars</th>
                              <th className="px-8 py-6 border-r border-slate-100 text-right w-40">Debit (DR)</th>
                              <th className="px-8 py-6 border-r border-slate-100 text-right w-40">Credit (CR)</th>
                              <th className="px-10 py-6 text-right w-52 bg-slate-50/50">Cumulative Bal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 text-[14px]">
                            {reportData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors h-16 group">
                                <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                                <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-400 text-[11px] uppercase">{row.date}</td>
                                <td className="px-8 py-2 border-r border-slate-50"><span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{row.vouType}</span></td>
                                <td className="px-8 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.vouNo}</td>
                                <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-700 italic truncate max-w-xs">{row.particulars}</td>
                                <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-rose-600 tracking-tighter">{row.debit}</td>
                                <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-green-600 tracking-tighter">{row.credit}</td>
                                <td className="px-10 py-2 text-right font-black text-slate-800 bg-slate-50/30 tracking-tight">{row.balance}</td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               )}
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-12 bg-slate-900 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/5 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-3 italic">Period Utilization</p>
                    <div className="flex items-center gap-12">
                       <div>
                          <p className="text-rose-500 text-[11px] font-black uppercase mb-1">Debit Sum</p>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">10,000.00</p>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div>
                          <p className="text-green-500 text-[11px] font-black uppercase mb-1">Credit Sum</p>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">15,000.00</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-[1px] h-16 bg-white/10" />
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-3 italic">Net Financial Position</p>
                    <p className="text-[42px] font-black text-[#0097A7] leading-none tracking-tighter italic flex items-center gap-3">
                       5,000.00 <span className="text-[14px] text-white/40 font-black not-italic uppercase tracking-widest">CR</span>
                    </p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <TrendingUp size={40} className="text-white" />
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight">Digital Ledger Analysis Hub<br/>Ver 4.0 Omni-Core</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
