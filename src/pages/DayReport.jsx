import { useState, useEffect } from 'react'
import { 
  ChevronRight, Search, Download, FileSpreadsheet, FileJson, 
  Filter, Settings, X, RotateCcw, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, PieChart
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

const Input = ({ value, onChange, type = 'text', className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

const SEED_DAY_REPORT = [
  { ord1: '1', sno: '1', date: '2026-04-01', credit: '15000.00', debit: '2000.00', cashBal: '13000.00', adjCredit: '0.00', adjDebit: '0.00', adjBal: '13000.00' },
  { ord1: '1', sno: '2', date: '2026-04-02', credit: '8000.00', debit: '5000.00', cashBal: '16000.00', adjCredit: '1200.00', adjDebit: '0.00', adjBal: '17200.00' },
  { ord1: '1', sno: '3', date: '2026-04-03', credit: '22000.00', debit: '12000.00', cashBal: '26000.00', adjCredit: '0.00', adjDebit: '500.00', adjBal: '25500.00' },
  { ord1: '1', sno: '4', date: '2026-04-04', credit: '10000.00', debit: '4000.00', cashBal: '32000.00', adjCredit: '0.00', adjDebit: '0.00', adjBal: '32000.00' },
  { ord1: '1', sno: '5', date: '2026-04-06', credit: '45000.00', debit: '30000.00', cashBal: '47000.00', adjCredit: '5000.00', adjDebit: '0.00', adjBal: '52000.00' },
]

export default function DayReport() {
  const [fromDate, setFromDate] = useState('2026-04-01')
  const [toDate, setToDate] = useState('2026-04-15')
  const [reportData, setReportData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    setReportData(SEED_DAY_REPORT)
  }, [])

  const handleSearch = () => {
    setSearching(true)
    setTimeout(() => {
      setReportData(SEED_DAY_REPORT)
      setSearching(false)
    }, 600)
  }

  const totalCredit = reportData.reduce((acc, r) => acc + parseFloat(r.credit), 0)
  const totalDebit = reportData.reduce((acc, r) => acc + parseFloat(r.debit), 0)
  const totalAdjBal = reportData.reduce((acc, r) => acc + parseFloat(r.adjBal), 0)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Daily Liquidity Report</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-teal-600 rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Live Temporal Liquidity Matrix</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-black rounded-2xl transition-all shadow-md">
                <X size={20} strokeWidth={2.5} /> Close Tracker
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Control Suite */}
            <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner flex items-center justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <PieChart size={180} />
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
                    Refresh Report
                  </button>
               </div>

               <div className="flex items-center gap-6 relative z-10">
                  <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Index Depth</span>
                    <span className="text-[14px] font-black text-slate-800">{reportData.length} Temporal Points</span>
                  </div>
                  <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
                    {[{ icon: <Download size={16} />, l: 'EXCEL' }, { icon: <FileJson size={16} />, l: 'JSON' }].map(tool => (
                      <button key={tool.l} className="flex items-center gap-2 text-slate-300 hover:text-teal-600 text-[10px] font-black uppercase tracking-widest transition-all italic">
                        {tool.icon} {tool.l}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Matrix Data Layer */}
            <div className="flex-1">
               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1400px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">Ord</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">SNo</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32 text-center">Value Date</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-36 bg-green-50/30">Credit Intake</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-36 bg-rose-50/30">Debit Outflow</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-right w-44 font-black text-slate-800">Cash Balance</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-36 text-slate-300">Adj. Credit</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-36 text-slate-300">Adj. Debit</th>
                       <th className="px-10 py-6 text-right w-52 bg-slate-50/50 font-black text-[#0097A7]">Adjusted Ledger Bal</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     {reportData.map((row, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 transition-colors h-16 group">
                         <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-black">{row.ord1}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{row.sno}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-slate-400 text-[11px] uppercase">{row.date}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-green-600 bg-green-50/10 tracking-tighter">{row.credit}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-rose-600 bg-rose-50/10 tracking-tighter">{row.debit}</td>
                         <td className="px-10 py-2 border-r border-slate-50 text-right font-black text-slate-800 tracking-tight">{row.cashBal}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right text-slate-300 font-bold">{row.adjCredit}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right text-slate-300 font-bold">{row.adjDebit}</td>
                         <td className="px-10 py-2 text-right font-black text-[#0097A7] bg-slate-50/30 tracking-tight text-lg italic">{row.adjBal}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-12 bg-slate-900 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Aggregate Performance</p>
                    <div className="flex items-center gap-12">
                       <div>
                          <div className="flex items-center gap-2 text-green-500 mb-1">
                             <ArrowDownRight size={14} />
                             <p className="text-[10px] font-black uppercase">Total Intake</p>
                          </div>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">{totalCredit.toFixed(2)}</p>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div>
                          <div className="flex items-center gap-2 text-rose-500 mb-1">
                             <ArrowUpRight size={14} />
                             <p className="text-[10px] font-black uppercase">Total Outflow</p>
                          </div>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">{totalDebit.toFixed(2)}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-[1px] h-20 bg-white/10" />
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Net Equilibrium Bal</p>
                    <p className="text-[48px] font-black text-teal-400 leading-none tracking-tighter italic">
                       {(totalCredit - totalDebit).toFixed(2)}
                    </p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <TrendingUp size={48} className="text-white" />
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight">Liquidity Matrix Analysis<br/>Ver 4.0 Omni-Core</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
