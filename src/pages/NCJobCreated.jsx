import { useState } from 'react'
import {
  ChevronRight, X, Search, FileText, ShieldAlert, Calendar, Play
} from 'lucide-react'

// ── Shared UI primitives (Consistent with design system) ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`px-3 py-[6px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-[6px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
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

export default function NCJobCreated() {
  const [fromDate, setFromDate] = useState('2026-04-15')
  const [toDate, setToDate] = useState('2026-04-15')

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">NC</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold">NC Job Created</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[700px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">NC Job Created</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-bold rounded-lg transition-all shadow-sm">
              <X size={18} strokeWidth={2.5} /> Close
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Filter Section */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6">
              <div className="flex items-center gap-x-12 gap-y-4 mb-4">
                <div className="flex items-center gap-3">
                  <Label>From Date :</Label>
                  <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40" />
                </div>
                <div className="flex items-center gap-3">
                  <Label>To Date :</Label>
                  <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-6 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-bold rounded-lg border border-slate-300 transition-all shadow-sm active:scale-95 group">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                    <Search size={16} className="text-[#0097A7] group-hover:scale-110 transition-transform" />
                    Search
                  </button>
                  <button className="flex items-center gap-2 px-6 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-bold rounded-lg border border-slate-300 transition-all shadow-sm active:scale-95 group ml-2">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                    <FileText size={16} className="text-[#0097A7] group-hover:scale-110 transition-transform" />
                    Created Route Card
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="flex items-center gap-4 w-[280px]">
                  <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 text-[11px] font-black text-slate-600 uppercase rounded">Priority</div>
                  <Input className="flex-1" />
                </div>
                <div className="flex items-center gap-4 w-[400px]">
                  <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 text-[11px] font-black text-slate-600 uppercase rounded">Model</div>
                  <Select options={['Model 1', 'Model 2']} placeholder="---Select Model---" className="flex-1" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm bg-slate-400/50">
              <table className="w-full text-left border-collapse min-w-[1600px] bg-white">
                <thead className="bg-[#fcfdfe] text-[10.5px] uppercase text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-2 py-2.5 border-r border-slate-200 w-8"></th>
                    <th className="px-2 py-2.5 border-r border-slate-200 w-12 text-center uppercase">Select</th>
                    {[
                      'S.No', 'NC_Date', 'GRN_NO', 'Part_No', 'Part_Name', 'QC_Qty', 'Rejection_Qty', 'OK Qty', 'UOM', 'Barcode', 'Created_by'
                    ].map(h => (
                      <th key={h} className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12px]">
                  {/* Empty Fill */}
                  <tr className="h-9 hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 py-2 border-r border-slate-200 bg-slate-50 text-[10px] font-black text-center">*</td>
                    <td className="px-2 py-2 border-r border-slate-200 text-center">
                      <input type="checkbox" className="w-4 h-4 accent-[#0097A7] rounded" />
                    </td>
                    {[...Array(11)].map((_, i) => <td key={i} className="border-r border-slate-100 last:border-r-0"></td>)}
                  </tr>
                  {[...Array(15)].map((_, i) => (
                    <tr key={`empty-${i}`} className="h-9">
                      <td className="border-r border-slate-50 bg-slate-50/30"></td>
                      <td className="border-r border-slate-50"></td>
                      {[...Array(11)].map((_, j) => (
                        <td key={j} className="border-r border-slate-50 last:border-r-0"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-1 opacity-20">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 italic">Production Control Job Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
