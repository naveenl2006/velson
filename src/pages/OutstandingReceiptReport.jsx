import { useState, useEffect } from 'react'
import { 
  ChevronRight, Search, Printer, X, Download, FileSpreadsheet, 
  FileJson, Filter, Settings, RotateCcw
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

  const handleExport = (t) => alert(`Exporting outstanding report as ${t}...`)

  const totalBillAmt = reportData.reduce((acc, r) => acc + parseFloat(r.billAmt), 0)
  const totalBalance = reportData.reduce((acc, r) => acc + parseFloat(r.balance), 0)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Account</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold uppercase tracking-tight">Outstanding Receipt Reports</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[800px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Outstanding Receipt Reports</h2>
            </div>
            <div className="flex items-center gap-4">
               {[
                 'Print Bill Wise Age Report',
                 'Print Ledger Wise Age Report',
                 'Print Data BillWise'
               ].map(lbl => (
                 <button key={lbl} onClick={() => window.print()} className="flex items-center gap-1.5 text-slate-500 hover:text-[#0097A7] text-[11px] font-bold transition-colors">
                   <Printer size={15} /> {lbl}
                 </button>
               ))}
              <button onClick={() => alert('Closing...')} className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-[11px] font-bold transition-colors">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Filter Section */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6">
              <div className="grid grid-cols-12 gap-x-8 gap-y-4">
                 <div className="col-span-3 space-y-4">
                   <div className="flex items-center gap-3">
                     <Label>As on Date</Label>
                     <Input type="date" value={asOnDate} onChange={e => setAsOnDate(e.target.value)} className="flex-1" />
                   </div>
                   <div className="flex items-center gap-3">
                     <Label>Ledger Id</Label>
                     <Input placeholder="Enter Ledger ID" className="flex-1" />
                   </div>
                   <div className="flex items-center gap-3">
                     <Label>Group Name</Label>
                     <Select options={['Sundry Debtors', 'Sundry Creditors']} value={group} onChange={e => setGroup(e.target.value)} placeholder="---Select Group---" className="flex-1" />
                   </div>
                 </div>

                 <div className="col-span-3 space-y-4">
                   <div className="flex items-center gap-3">
                     <Label>Area</Label>
                     <Select options={['Local', 'Outstation']} placeholder="---Select---" className="flex-1" />
                   </div>
                   <div className="flex items-center gap-3">
                     <Label>State</Label>
                     <Select options={['Tamil Nadu', 'Karnataka', 'Maharashtra']} placeholder="---Select---" className="flex-1" />
                   </div>
                   <div className="flex items-center gap-2">
                     <Label>From Days</Label>
                     <Input value="0" className="w-20 text-right" />
                     <Label>To Days</Label>
                     <Input value="365" className="w-20 text-right" />
                   </div>
                 </div>

                 <div className="col-span-2">
                    <button 
                      onClick={handleSearch}
                      className="h-full w-full flex flex-col items-center justify-center gap-2 px-6 py-4 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-bold rounded shadow-sm transition-all active:scale-95"
                    >
                      {searching ? <RotateCcw size={24} className="animate-spin" /> : <Search size={24} />}
                      SEARCH
                    </button>
                 </div>

                 <div className="col-span-4 flex flex-col justify-end items-end">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                         <span className="text-[11px] font-bold text-slate-500 uppercase mr-2">LS</span>
                         <input className="w-8 bg-transparent text-center text-sm font-bold border-b border-slate-300 focus:outline-none" value={reportData.length} readOnly />
                      </div>
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                         {[
                           { icon: <Download size={14} />, label: 'Dos' },
                           { icon: <FileSpreadsheet size={14} />, label: 'Excel' },
                           { icon: <FileJson size={14} />, label: 'Pdf' },
                         ].map(tool => (
                           <button key={tool.label} onClick={() => handleExport(tool.label)} className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-[#0097A7] transition-colors group">
                             {tool.icon}
                             <span className="text-[11px] font-bold uppercase group-hover:text-slate-600">{tool.label}</span>
                           </button>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="bg-[#fcfdfe] text-[10.5px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 border-r border-slate-200 w-12 text-center">S.No</th>
                    <th className="px-4 py-3 border-r border-slate-200">Particulars (Ledger)</th>
                    <th className="px-4 py-3 border-r border-slate-200 w-28">Bill Type</th>
                    <th className="px-4 py-3 border-r border-slate-200 w-28">Bill No</th>
                    <th className="px-4 py-3 border-r border-slate-200 w-28">Bill Date</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-right w-32">Bill Amt</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-right w-24">Adj</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-right w-32 bg-slate-50 font-black">Balance</th>
                    <th className="px-4 py-3 border-r border-slate-200 text-right w-24">Paid</th>
                    <th className="px-4 py-3 text-right w-20 text-slate-400">Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12.5px]">
                  {reportData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f0f9fa]/30 transition-colors h-11">
                      <td className="px-4 py-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-2 border-r border-slate-200 font-black text-slate-700">{row.ledger}</td>
                      <td className="px-4 py-2 border-r border-slate-200 uppercase text-[11px] font-bold text-slate-500">{row.billType}</td>
                      <td className="px-4 py-2 border-r border-slate-200 font-bold text-[#0097A7]">{row.billNo}</td>
                      <td className="px-4 py-2 border-r border-slate-200">{row.billDate}</td>
                      <td className="px-4 py-2 border-r border-slate-200 text-right font-bold text-slate-600">{row.billAmt}</td>
                      <td className="px-4 py-2 border-r border-slate-200 text-right text-slate-400">{row.adj}</td>
                      <td className="px-4 py-2 border-r border-slate-200 text-right font-black text-rose-600 bg-slate-50/30">{row.balance}</td>
                      <td className="px-4 py-2 border-r border-slate-200 text-right text-green-600 font-bold">{row.paidAmt}</td>
                      <td className="px-4 py-2 text-right font-bold text-orange-500">{row.days}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-800 text-white font-bold">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right uppercase tracking-wider text-[10px] text-white/50">Report Totals Summary</td>
                    <td className="px-4 py-3 text-right text-[14px]">{totalBillAmt.toFixed(2)}</td>
                    <td className="px-4 py-2 border-r border-slate-200" />
                    <td className="px-4 py-3 text-right text-rose-400 text-[16px] bg-[#0097A7]/20 border-r border-[#0097A7]/30">{totalBalance.toFixed(2)}</td>
                    <td colSpan={2} className="px-4 py-2" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
