import { useState } from 'react'
import {
  ChevronRight, X, Search, CheckCircle2, XCircle, ShieldAlert, Calendar, Play
} from 'lucide-react'

// ── Shared UI primitives (Consistent with design system) ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-4 py-2 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 shadow-sm ${className}`}
  />
)

const MOCK_DATA = [
  {
    selected: true, sno: 1, date: '15-04-2026 12:08:00', grn: '26-27/GRN00115', partNo: 'VC-100042',
    partName: 'HOUSING 2', qty: '58.00', rejQty: '2.00', okQty: '56.00', uom: 'No',
    barcode: '2026040773', createdBy: 'QUALITY', qcStatus: 'Rejected', remarks: "2-NO'S NOT REIVED (SATHISH)"
  },
]

export default function NCApproval() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">NC</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold">NC Approval</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[700px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">NC Approval</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-bold rounded-lg transition-all shadow-sm">
              <X size={18} strokeWidth={2.5} /> Close
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Filter & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <Label>From Date :</Label>
                  <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40" />
                </div>
                <div className="flex items-center gap-3">
                  <Label>To Date :</Label>
                  <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40" />
                </div>
                <button className="flex items-center justify-center gap-2 px-8 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-black rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95 group">
                  <Search size={16} className="text-[#0097A7] group-hover:scale-110 transition-transform" />
                  Search
                </button>
              </div>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[12px] font-black uppercase rounded-xl transition-all group">
                  <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                  Approve
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[12px] font-black uppercase rounded-xl transition-all group">
                  <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                  Reject
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm bg-slate-400/50">
              <table className="w-full text-left border-collapse min-w-[1800px] bg-white">
                <thead className="bg-[#fcfdfe] text-[10.5px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-2 py-2.5 border-r border-slate-200 w-8"></th>
                    <th className="px-2 py-2.5 border-r border-slate-200 w-12 text-center uppercase">Select</th>
                    {[
                      'S.No', 'NC_Date', 'GRN_NO', 'Part_No', 'Part_Name', 'QC_Qty', 'Rejection_Qty', 'OK Qty', 'UOM', 'Barcode', 'Created_by', 'QC Status', 'QC Remarks', 'Remarks'
                    ].map(h => (
                      <th key={h} className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12px]">
                  {MOCK_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f0f9fa]/30 transition-colors">
                      <td className="px-2 py-2 border-r border-slate-200 bg-slate-50 flex items-center justify-center">
                        <Play size={10} className="text-[#0097A7] fill-[#0097A7]" />
                      </td>
                      <td className="px-2 py-2 border-r border-slate-200 text-center">
                        <input type="checkbox" checked={row.selected} readOnly className="w-4 h-4 accent-[#0097A7] rounded" />
                      </td>
                      <td className="px-3 py-2 border-r border-slate-200 text-center font-bold text-blue-700">{row.sno}</td>
                      <td className="px-3 py-2 border-r border-slate-200 text-slate-500">{row.date}</td>
                      <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-700">{row.grn}</td>
                      <td className="px-3 py-2 border-r border-slate-200 font-bold text-[#0097A7]">{row.partNo}</td>
                      <td className="px-3 py-2 border-r border-slate-200 font-semibold text-slate-600">{row.partName}</td>
                      <td className="px-3 py-2 border-r border-slate-200 text-right font-black text-slate-700">{row.qty}</td>
                      <td className="px-3 py-2 border-r border-slate-200 text-right font-black text-rose-600">{row.rejQty}</td>
                      <td className="px-3 py-2 border-r border-slate-200 text-right font-black text-emerald-600">{row.okQty}</td>
                      <td className="px-3 py-2 border-r border-slate-200 text-center">{row.uom}</td>
                      <td className="px-3 py-2 border-r border-slate-200 font-medium text-slate-500">{row.barcode}</td>
                      <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-600 uppercase">{row.createdBy}</td>
                      <td className="px-3 py-2 border-r border-slate-200 font-black text-rose-600 uppercase">{row.qcStatus}</td>
                      <td className="px-3 py-2 border-r border-slate-200 text-slate-500 italic">{row.remarks}</td>
                      <td className="px-3 py-2"></td>
                    </tr>
                  ))}
                  {/* New Row Indicator */}
                  <tr className="h-9">
                    <td className="px-2 py-2 border-r border-slate-200 bg-slate-50 text-[10px] font-black">*</td>
                    <td className="px-2 py-2 border-r border-slate-200 text-center">
                      <input type="checkbox" className="w-4 h-4 accent-[#0097A7] rounded" />
                    </td>
                    {[...Array(14)].map((_, i) => <td key={i} className="border-r border-slate-100 last:border-r-0"></td>)}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-1 opacity-20">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 italic">Quality Assurance Approval Console</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
