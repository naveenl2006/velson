import { useState, useEffect } from 'react'
import { ChevronRight, Search, Printer, X, FileText, Download, FileSpreadsheet, FileJson, Filter, Settings, RotateCcw, Database, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'

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

const SEED_DATA = [
  { id: 1, date: '2026-04-15', voucherType: 'RECEIPT', voucherNo: 'R-1001', ledger: 'ABC Enterprises', debit: '0.00', credit: '38000.00', narration: 'Payment for April Invoices' },
  { id: 2, date: '2026-04-15', voucherType: 'PAYMENT', voucherNo: 'P-5001', ledger: 'X-Caliber Forge', debit: '87000.00', credit: '0.00', narration: 'Vendor Payment' },
  { id: 3, date: '2026-04-15', voucherType: 'JOURNAL', voucherNo: 'J-5003', ledger: 'Depreciation A/C', debit: '5000.00', credit: '0.00', narration: 'Monthly Depreciation' },
  { id: 4, date: '2026-04-15', voucherType: 'VOUCHER', voucherNo: 'V-2001', ledger: 'Electricity Expenses', debit: '1500.00', credit: '0.00', narration: 'March Bill' },
]

export default function DayBook() {
  const [fromDate, setFromDate] = useState('2026-04-15')
  const [toDate, setToDate] = useState('2026-04-15')
  const [company, setCompany] = useState('VELSON')
  const [openingBalance, setOpeningBalance] = useState('50000.00')
  const [isDetailReport, setIsDetailReport] = useState(true)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('velson_receipts') || '[]')
    const p = JSON.parse(localStorage.getItem('velson_payments') || '[]')
    const v = JSON.parse(localStorage.getItem('velson_vouchers') || '[]')
    const j = JSON.parse(localStorage.getItem('velson_journals') || '[]')
    
    const combined = [
      ...r.map(i => ({ id: i.id, date: i.date, voucherType: 'RECEIPT', voucherNo: i.receiptNo, ledger: i.partyName, debit: '0.00', credit: i.amount, narration: i.details })),
      ...p.map(i => ({ id: i.id, date: i.date, voucherType: 'PAYMENT', voucherNo: i.receiptNo || i.paymentNo, ledger: i.partyName, debit: i.amount, credit: '0.00', narration: i.details })),
      ...v.map(i => ({ id: i.id, date: i.voucherDate, voucherType: 'VOUCHER', voucherNo: i.voucherNo, ledger: 'Multiple Ledgers', debit: i.rows.reduce((a, b) => a + parseFloat(b.amt || 0), 0).toString(), credit: '0.00', narration: i.details })),
      ...j.map(i => ({ id: i.id, date: i.voucherDate, voucherType: 'JOURNAL', voucherNo: i.voucherNo, ledger: 'Multiple Ledgers', debit: i.rows.filter(r => r.type === 'DR').reduce((a, b) => a + parseFloat(b.payment || 0), 0).toString(), credit: i.rows.filter(r => r.type === 'CR').reduce((a, b) => a + parseFloat(b.receipt || 0), 0).toString(), narration: 'Journal Entry' }))
    ]

    const finalData = combined.length === 0 ? SEED_DATA : combined
    setData(finalData)
    setFilteredData(finalData)
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

  const totalDebit = filteredData.reduce((acc, r) => acc + parseFloat(r.debit || 0), 0)
  const totalCredit = filteredData.reduce((acc, r) => acc + parseFloat(r.credit || 0), 0)
  const closingBalance = parseFloat(openingBalance) + totalCredit - totalDebit

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Daily Transaction Ledger</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-slate-900 rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Live Master Daybook</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <Printer size={18} className="text-[#0097A7]" /> Export Print
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
                 <FileText size={180} />
               </div>

               <div className="grid grid-cols-12 gap-10 relative z-10">
                  <div className="col-span-4 flex items-center gap-6">
                     <div className="flex-1 space-y-1.5">
                        <Label>Cycle Start</Label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                     </div>
                     <div className="flex-1 space-y-1.5">
                        <Label>Cycle End</Label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                     </div>
                  </div>

                  <div className="col-span-3 space-y-1.5">
                     <Label>Operational Unit</Label>
                     <Select options={['VELSON HQ', 'BRANCH ALPHA', 'MANUFACTURING DIV']} value={company} onChange={e => setCompany(e.target.value)} />
                  </div>

                  <div className="col-span-2 space-y-1.5">
                     <Label>Buffer Balance</Label>
                     <Input value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className="text-right font-black text-[#0097A7]" />
                  </div>

                  <div className="col-span-3 flex items-end">
                     <button 
                      onClick={handleSearch}
                      disabled={searching}
                      className="w-full h-[42px] bg-slate-900 hover:bg-black text-white text-[12px] font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-3"
                     >
                       {searching ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
                       Filter Daybook
                     </button>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-slate-100 relative z-10">
                  <label className="flex items-center gap-4 cursor-pointer group">
                     <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isDetailReport} 
                          onChange={e => setIsDetailReport(e.target.checked)} 
                          className="peer sr-only" 
                        />
                        <div className="w-10 h-5 bg-slate-200 rounded-full transition-all peer-checked:bg-[#0097A7]" />
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                     </div>
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#0097A7] transition-colors">Granular Narration Stream</span>
                  </label>

                  <div className="flex items-center gap-6">
                    {[{ icon: <FileSpreadsheet size={16} />, l: 'EXCEL' }, { icon: <FileJson size={16} />, l: 'PDF.REPORT' }].map(tool => (
                      <button key={tool.l} className="flex items-center gap-2 text-slate-300 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all italic">
                        {tool.icon} {tool.l}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Matrix Result Area */}
            <div className="flex-1">
               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1400px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-6 border-r border-slate-100 w-16 text-center">#</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32">Value Date</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32">Protocol</th>
                       <th className="px-8 py-6 border-r border-slate-100 w-32">Doc Ref</th>
                       <th className="px-8 py-6 border-r border-slate-100">Ledger Entity Hub</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-40">Debit (DR)</th>
                       <th className="px-8 py-6 border-r border-slate-100 text-right w-40">Credit (CR)</th>
                       <th className="px-8 py-6 text-slate-400 italic">Audit Narrative</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     <tr className="bg-slate-50/30">
                        <td colSpan={6} className="px-8 py-4 border-r border-slate-50 text-right font-black uppercase text-[10px] text-slate-400 tracking-widest italic">Temporal Opening Balance</td>
                        <td className="px-8 py-4 border-r border-slate-50 text-right font-black text-[#0097A7]">{parseFloat(openingBalance).toFixed(2)}</td>
                        <td className="px-8 py-4" />
                     </tr>
                     {filteredData.length === 0 ? (
                       <tr>
                         <td colSpan={8} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-widest opacity-30">
                            Daybook Stream Empty for Selected Interval
                         </td>
                       </tr>
                     ) : (
                       filteredData.map((row, idx) => (
                         <tr key={idx} className="hover:bg-slate-50 transition-colors h-16 group">
                           <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-400 text-[11px]">{row.date}</td>
                           <td className="px-8 py-2 border-r border-slate-50">
                              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{row.voucherType}</span>
                           </td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.voucherNo}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-800 uppercase tracking-tighter">{row.ledger}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-rose-600 tracking-tighter">{parseFloat(row.debit || 0).toFixed(2)}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-right font-black text-green-600 tracking-tighter">{parseFloat(row.credit || 0).toFixed(2)}</td>
                           <td className="px-8 py-2 text-slate-400 italic text-[12px] truncate max-w-xs">{row.narration}</td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-12 bg-slate-900 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/5 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Period Utilization</p>
                    <div className="flex items-center gap-12">
                       <div>
                          <div className="flex items-center gap-2 text-rose-500 mb-1">
                             <ArrowUpRight size={14} />
                             <p className="text-[10px] font-black uppercase">Debit Sum</p>
                          </div>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">{totalDebit.toFixed(2)}</p>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10" />
                       <div>
                          <div className="flex items-center gap-2 text-green-500 mb-1">
                             <ArrowDownRight size={14} />
                             <p className="text-[10px] font-black uppercase">Credit Sum</p>
                          </div>
                          <p className="text-[28px] font-black text-white leading-none tracking-tighter">{totalCredit.toFixed(2)}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-[1px] h-20 bg-white/10" />
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Net Liquidity Closing</p>
                    <p className="text-[48px] font-black text-[#0097A7] leading-none tracking-tighter italic">
                       {closingBalance.toFixed(2)}
                    </p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <TrendingUp size={48} className="text-white" />
                  <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight">Digital Daybook Stream<br/>Matrix Integrity Verified</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
