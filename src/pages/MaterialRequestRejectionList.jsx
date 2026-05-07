import { useState } from 'react'
import {
  ChevronRight, X, Search, FileBarChart, Calendar, Play
} from 'lucide-react'

// ── Shared UI primitives ──
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
    id: 1, reqNo: 'REQ-2026/001', jobCardNo: 'JC/26/5001', dept: 'PRODUCTION', team: 'TEAM A',
    matNo: 'MAT-10001', matName: 'STEEL ROD 10MM', size: '10MM', qty: '50.00',
    reqDate: '2026-05-01', reqBy: 'SATHISH', remarks: 'DAMAGED PACKAGING',
    rejBy: 'ADMIN', rejDate: '2026-05-02'
  },
  {
    id: 2, reqNo: 'REQ-2026/002', jobCardNo: 'JC/26/5005', dept: 'QUALITY', team: 'TEAM B',
    matNo: 'MAT-10042', matName: 'HOUSING COVER', size: 'STD', qty: '12.00',
    reqDate: '2026-05-03', reqBy: 'MURUGAN', remarks: 'SPECIFICATION MISMATCH',
    rejBy: 'SUPERVISOR', rejDate: '2026-05-04'
  },
  {
    id: 3, reqNo: 'REQ-2026/005', jobCardNo: 'JC/26/5012', dept: 'MAINTENANCE', team: 'TEAM C',
    matNo: 'MAT-20015', matName: 'BEARING 6205', size: '25x52x15', qty: '5.00',
    reqDate: '2026-05-05', reqBy: 'KUMAR', remarks: 'WRONG ITEM RECEIVED',
    rejBy: 'ADMIN', rejDate: '2026-05-06'
  },
]

export default function MaterialRequestRejectionList() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors uppercase">Report</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold uppercase">Material Request Rejection List</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[750px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-red-700 rounded-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Material Request Rejection List</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-bold rounded-md transition-all shadow-sm">
              <div className="w-4 h-4 bg-slate-400 rounded-full flex items-center justify-center">
                <X size={10} className="text-white" strokeWidth={3} />
              </div>
              Close
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-8 mb-6 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Label>From Date :</Label>
                <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-44" />
              </div>
              <div className="flex items-center gap-3">
                <Label>To Date :</Label>
                <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-44" />
              </div>
              <button className="flex items-center justify-center gap-2 px-8 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded-lg transition-all shadow-md active:scale-95">
                <Search size={16} />
                Search
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[1900px] bg-white">
                <thead className="bg-[#cbd5e1]/30 text-[11px] uppercase text-slate-600 font-bold border-b border-slate-300">
                  <tr>
                    <th className="px-2 py-3 border-r border-slate-300 w-10 text-center"></th>
                    {[
                      { label: 'ID', w: 'w-16' },
                      { label: 'Req No', w: 'w-40' },
                      { label: 'Job Card No', w: 'w-40' },
                      { label: 'Department', w: 'w-40' },
                      { label: 'Team', w: 'w-32' },
                      { label: 'Material No', w: 'w-40' },
                      { label: 'Material Name', w: 'w-64' },
                      { label: 'Size', w: 'w-32' },
                      { label: 'Qty', w: 'w-24' },
                      { label: 'Request Date', w: 'w-32' },
                      { label: 'Request By', w: 'w-40' },
                      { label: "Remark's", w: 'w-64' },
                      { label: 'Rejected By', w: 'w-40' },
                      { label: 'Rejected Date', w: 'w-32' }
                    ].map((h, i) => (
                      <th key={i} className={`px-3 py-3 border-r border-slate-300 whitespace-nowrap ${h.w}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12px]">
                  {MOCK_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f0f9fa]/40 transition-colors group">
                      <td className="px-2 py-2.5 border-r border-slate-200 bg-slate-50/50 flex items-center justify-center">
                        <Play size={10} className="text-[#0097A7] fill-[#0097A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-center font-bold text-blue-600">{row.id}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-slate-700">{row.reqNo}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-[#0097A7]">{row.jobCardNo}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-semibold text-slate-500">{row.dept}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-slate-500">{row.team}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-slate-700">{row.matNo}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-semibold text-slate-600">{row.matName}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-center font-medium text-slate-600">{row.size}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-right font-black text-slate-800">{row.qty}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-slate-500">{row.reqDate}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-slate-500">{row.reqBy}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-slate-500 italic text-[11px]">{row.remarks}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 font-black text-rose-600 uppercase">{row.rejBy}</td>
                      <td className="px-3 py-2.5 border-r border-slate-200 text-slate-500 font-medium">{row.rejDate}</td>
                    </tr>
                  ))}
                  {/* Empty Row Indicator */}
                  <tr className="h-10 bg-slate-50/20">
                    <td className="px-2 py-2 border-r border-slate-200 text-center text-[10px] font-black text-slate-300">*</td>
                    {[...Array(14)].map((_, i) => <td key={i} className="border-r border-slate-100 last:border-r-0"></td>)}
                  </tr>
                  {/* Fill empty space */}
                  {[...Array(10)].map((_, i) => (
                    <tr key={i} className="h-10">
                      <td className="border-r border-slate-100"></td>
                      {[...Array(14)].map((_, j) => <td key={j} className="border-r border-slate-100 last:border-r-0"></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 opacity-30 group hover:opacity-100 transition-opacity cursor-default">
                <FileBarChart size={14} className="text-[#0097A7]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Inventory Analytics & Rejection Registry</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Total Records: <span className="text-[#0097A7]">{MOCK_DATA.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
