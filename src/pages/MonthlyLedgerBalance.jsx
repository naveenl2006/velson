import { useState, useEffect } from 'react'
import { ChevronRight, Search, Printer, X, Calendar, Download, FileSpreadsheet, FileJson, RotateCcw, TrendingUp, BarChart3, Database } from 'lucide-react'

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

const SAMPLE_MONTHLY = [
  { sno: 1, month: 'APRIL 2026', credit: '150000.00', debit: '120000.00', balance: '30000.00 CR' },
  { sno: 2, month: 'MAY 2026', credit: '180000.00', debit: '145000.00', balance: '65000.00 CR' },
  { sno: 3, month: 'JUNE 2026', credit: '165000.00', debit: '170000.00', balance: '60000.00 CR' },
  { sno: 4, month: 'JULY 2026', credit: '210000.00', debit: '190000.00', balance: '80000.00 CR' },
]

export default function MonthlyLedgerBalance() {
  const [fromDate, setFromDate] = useState('2026-04-01')
  const [toDate, setToDate] = useState('2027-03-30')
  const [acName, setAcName] = useState('SALES ACCOUNT')
  const [reportData, setReportData] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = () => {
    if (!acName) { alert('Specify Ledger Entity'); return }
    setSearching(true)
    setTimeout(() => {
      setReportData(SAMPLE_MONTHLY)
      setSearching(false)
    }, 600)
  }

  const totalCredit = reportData.reduce((acc, r) => acc + parseFloat(r.credit), 0)
  const totalDebit = reportData.reduce((acc, r) => acc + parseFloat(r.debit), 0)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Monthly Performance Matrix</span>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-indigo-600 rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Monthly Fiscal Breakdown</h2>
            </div>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <Printer size={18} className="text-indigo-600" /> Export Matrix
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
                 <Calendar size={180} />
               </div>

               <div className="grid grid-cols-12 gap-10 relative z-10">
                  <div className="col-span-5 space-y-1.5">
                     <Label>Target Ledger Entity</Label>
                     <Input placeholder="Enter Account Label..." value={acName} onChange={e => setAcName(e.target.value.toUpperCase())} className="!font-black text-indigo-600" />
                  </div>

                  <div className="col-span-4 flex items-center gap-6">
                     <div className="flex-1 space-y-1.5">
                        <Label>Fiscal Start</Label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                     </div>
                     <div className="flex-1 space-y-1.5">
                        <Label>Fiscal End</Label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                     </div>
                  </div>

                  <div className="col-span-3 flex items-end">
                     <button 
                      onClick={handleSearch}
                      disabled={searching}
                      className="w-full h-[42px] bg-slate-900 hover:bg-black text-white text-[12px] font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-3"
                     >
                       {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                       Generate Breakdown
                     </button>
                  </div>
               </div>
            </div>

            {/* Matrix Hub */}
            <div className="flex-1">
               {reportData.length === 0 ? (
                 <div className="h-[500px] border border-slate-200 border-dashed rounded-[3.5rem] bg-slate-50/30 flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 opacity-20">
                       <BarChart3 size={32} className="text-indigo-600" />
                    </div>
                    <div className="text-center space-y-2 opacity-30">
                       <p className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em]">Monthly Stream Offline</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase italic">Define Ledger Entity to Process Data</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between px-6">
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 bg-indigo-50 px-6 py-2 rounded-2xl border border-indigo-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Entity:</span>
                            <span className="text-[14px] font-black text-indigo-600 uppercase">{acName}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          {[{ icon: <Download size={16} />, l: 'EXCEL' }, { icon: <FileJson size={16} />, l: 'PDF' }].map(tool => (
                            <button key={tool.l} className="flex items-center gap-2 text-slate-300 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-all italic">
                              {tool.icon} {tool.l}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                       <table className="w-full text-left border-collapse min-w-[1200px]">
                          <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                            <tr>
                              <th className="px-10 py-6 border-r border-slate-100 w-24 text-center">#</th>
                              <th className="px-10 py-6 border-r border-slate-100">Temporal Month</th>
                              <th className="px-10 py-6 border-r border-slate-100 text-right bg-green-50/30">Credit Value (In)</th>
                              <th className="px-10 py-6 border-r border-slate-100 text-right bg-rose-50/30">Debit Value (Out)</th>
                              <th className="px-12 py-6 text-right w-64 bg-slate-50/50 font-black text-slate-800">Monthly Closing Bal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 text-[15px]">
                            {reportData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors h-20 group">
                                <td className="px-10 py-2 border-r border-slate-50 text-center text-slate-300 font-black">{row.sno}</td>
                                <td className="px-10 py-2 border-r border-slate-50 font-black text-slate-800 tracking-tight">{row.month}</td>
                                <td className="px-10 py-2 border-r border-slate-50 text-right font-black text-green-600 bg-green-50/10 tracking-tighter text-lg">{row.credit}</td>
                                <td className="px-10 py-2 border-r border-slate-50 text-right font-black text-rose-600 bg-rose-50/10 tracking-tighter text-lg">{row.debit}</td>
                                <td className="px-12 py-2 text-right font-black text-indigo-600 bg-slate-50/30 tracking-tight text-xl italic">{row.balance}</td>
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
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Fiscal Year Cumulative</p>
                    <div className="flex items-center gap-12">
                       <div>
                          <p className="text-green-500 text-[11px] font-black uppercase mb-1">Total Credit</p>
                          <p className="text-[32px] font-black text-white leading-none tracking-tighter">{totalCredit.toFixed(2)}</p>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div>
                          <p className="text-rose-500 text-[11px] font-black uppercase mb-1">Total Debit</p>
                          <p className="text-[32px] font-black text-white leading-none tracking-tighter">{totalDebit.toFixed(2)}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-[1px] h-20 bg-white/10" />
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Net Annual Equilibrium</p>
                    <p className="text-[52px] font-black text-indigo-400 leading-none tracking-tighter italic">
                       {(totalCredit - totalDebit).toFixed(2)} <span className="text-[16px] text-white/40 not-italic uppercase ml-2 tracking-widest font-black">CR</span>
                    </p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <Database size={56} className="text-white" />
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight">Monthly Temporal Ledger Hub<br/>Ver 4.0 Omni-Core</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
