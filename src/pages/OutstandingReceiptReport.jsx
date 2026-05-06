import { useState, useEffect } from 'react'
import { 
  ChevronRight, Search, Printer, X, Download, FileSpreadsheet, 
  FileJson, Filter, Settings, RotateCcw, AlertCircle, Clock, ShieldCheck, Database
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

const SEED_OUTSTANDING = [
  { ledger: 'JSA HI TECH ROOF INDIA PVT LTD', billType: 'GRN ENTRY', billNo: 'GRN/101', billDate: '2026-01-15', billAmt: '3540.00', adj: '0.00', balance: '3540.00', paidAmt: '0', days: '91' },
  { ledger: 'ABC Enterprises', billType: 'SALES INV', billNo: 'INV/24/01', billDate: '2026-02-10', billAmt: '50000.00', adj: '5000.00', balance: '45000.00', paidAmt: '0', days: '65' },
  { ledger: 'X-Caliber Forge', billType: 'PURCHASE INV', billNo: 'PINV/88', billDate: '2026-03-01', billAmt: '12000.00', adj: '0.00', balance: '12000.00', paidAmt: '0', days: '45' },
  { ledger: 'Tata Steel Ltd', billType: 'GRN ENTRY', billNo: 'GRN/205', billDate: '2026-03-20', billAmt: '85000.00', adj: '0.00', balance: '85000.00', paidAmt: '20000.00', days: '26' },
]

export default function OutstandingReceiptReport() {
  const [asOnDate, setAsOnDate] = useState('2026-04-15')
  const [group, setGroup] = useState('Sundry Debtors')
  const [reportData, setReportData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    setReportData(SEED_OUTSTANDING)
  }, [])

  const handleSearch = () => {
    setSearching(true)
    setTimeout(() => {
      setReportData(SEED_OUTSTANDING)
      setSearching(false)
    }, 600)
  }

  const totalBillAmt = reportData.reduce((acc, r) => acc + parseFloat(r.billAmt), 0)
  const totalBalance = reportData.reduce((acc, r) => acc + parseFloat(r.balance), 0)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Aging & Receivable Matrix</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-rose-600 rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Receivable Aging Analysis Hub</h2>
            </div>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <Printer size={18} className="text-[#0097A7]" /> Export Print
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-black rounded-2xl transition-all shadow-md">
                <X size={20} strokeWidth={2.5} /> Close Tracker
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Control Suite */}
            <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Clock size={180} />
               </div>

               <div className="grid grid-cols-12 gap-8 relative z-10">
                  <div className="col-span-3 space-y-6">
                     <div className="space-y-1.5">
                        <Label>Evaluation Date</Label>
                        <Input type="date" value={asOnDate} onChange={e => setAsOnDate(e.target.value)} />
                     </div>
                     <div className="space-y-1.5">
                        <Label>Ledger Identity</Label>
                        <Input placeholder="Enter ID Reference..." />
                     </div>
                  </div>

                  <div className="col-span-3 space-y-6">
                     <div className="space-y-1.5">
                        <Label>Group Node</Label>
                        <Select options={['Sundry Debtors', 'Sundry Creditors']} value={group} onChange={e => setGroup(e.target.value)} placeholder="Select Architecture Group" />
                     </div>
                     <div className="space-y-1.5">
                        <Label>Geographic Sector</Label>
                        <Select options={['LOCAL HUB', 'OUTSTATION', 'EXPORT DIV']} placeholder="Select Area" />
                     </div>
                  </div>

                  <div className="col-span-3 space-y-6">
                     <div className="space-y-1.5">
                        <Label>Aging Threshold (Days)</Label>
                        <div className="flex items-center gap-4">
                           <Input placeholder="0" className="text-center font-black" />
                           <span className="text-slate-300 font-black">TO</span>
                           <Input placeholder="365" className="text-center font-black" />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <Label>Territory Mapping</Label>
                        <Select options={['Tamil Nadu', 'Karnataka', 'Maharashtra']} placeholder="Select State Hub" />
                     </div>
                  </div>

                  <div className="col-span-3 flex items-end">
                     <button 
                      onClick={handleSearch}
                      disabled={searching}
                      className="w-full h-[110px] bg-slate-900 hover:bg-black text-white text-[14px] font-black rounded-3xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-3"
                     >
                       {searching ? <RotateCcw size={28} className="animate-spin" /> : <Search size={28} />}
                       Process Stream
                     </button>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                        <ShieldCheck size={18} className="text-[#0097A7]" />
                        <span className="text-[12px] font-black text-slate-800 uppercase">{reportData.length} Exposure Points</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                    {[{ icon: <FileSpreadsheet size={16} />, l: 'EXCEL' }, { icon: <FileJson size={16} />, l: 'AGING.PDF' }].map(tool => (
                      <button key={tool.l} className="flex items-center gap-2 text-slate-300 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all italic">
                        {tool.icon} {tool.l}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Matrix Data Hub */}
            <div className="flex-1">
               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1400px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">#</th>
                       <th className="px-8 py-6 border-r border-slate-100">Ledger Classification</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32">Doc Type</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32">Ref No</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32">Doc Date</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-36">Total Value</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-24 text-slate-300">Adj</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-right w-44 bg-slate-50/50 font-black text-rose-600">Exposure Bal</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-32 text-green-600">Recvd</th>
                       <th className="px-8 py-6 text-right w-24 text-orange-500 italic">Age (D)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     {reportData.map((row, idx) => (
                       <tr key={idx} className="hover:bg-rose-50/10 transition-colors h-16 group">
                         <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                         <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-800 uppercase tracking-tighter">{row.ledger}</td>
                         <td className="px-8 py-2 border-r border-slate-50 uppercase text-[10px] font-black text-slate-400 tracking-widest">{row.billType}</td>
                         <td className="px-8 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.billNo}</td>
                         <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-400 text-[11px]">{row.billDate}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-slate-600 tracking-tighter">{row.billAmt}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right text-slate-300 font-bold italic">{row.adj}</td>
                         <td className="px-10 py-2 border-r border-slate-50 text-right font-black text-rose-600 bg-rose-50/10 tracking-tight text-lg">{row.balance}</td>
                         <td className="px-8 py-2 border-r border-slate-50 text-right text-green-600 font-black">{row.paidAmt}</td>
                         <td className="px-8 py-2 text-right font-black text-orange-500 italic text-[16px]">{row.days}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-12 bg-slate-900 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Receivable Summary</p>
                    <div className="flex items-center gap-12">
                       <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Gross Billing</p>
                          <p className="text-[32px] font-black text-white leading-none tracking-tighter">{totalBillAmt.toFixed(2)}</p>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div className="flex flex-col items-center">
                          <AlertCircle size={20} className="text-orange-500 mb-1" />
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">High Age Alert</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-[1px] h-20 bg-white/10" />
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Total Arrears Exposure</p>
                    <p className="text-[52px] font-black text-rose-500 leading-none tracking-tighter italic">
                       {totalBalance.toFixed(2)}
                    </p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <Database size={56} className="text-white" />
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight">Aging Portfolio Analyzer<br/>Risk Assessment Matrix</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
