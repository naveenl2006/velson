import { useState, useEffect } from 'react'
import {
  ChevronRight, X, Download, FileSpreadsheet, FileText, Filter, Settings, Search, CheckCircle2, RotateCcw, Printer
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-0 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

export default function BreakDownClearence() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    setData(saved)
    setFilteredData(saved)
  }, [])

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <div className="p-4">
        <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden flex flex-col min-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-300 bg-[#f8fafc] px-3 py-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">BreakDown Clearance</h2>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button onClick={() => window.history.back()} className="flex items-center gap-1 px-3 py-1 border border-slate-200 bg-white text-slate-600 text-[11px] font-bold rounded shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95">
                <X size={16} strokeWidth={3} /> Close
              </button>
            </div>
          </div>

          {/* Analytical Toolbar */}
          <div className="flex items-center justify-end gap-6 bg-white border-b border-slate-200 px-4 py-2 text-slate-500">
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-6">
              <span className="text-[11px] font-bold">LS</span>
              <input type="text" value="1" readOnly className="w-8 px-1 py-0.5 border border-slate-300 rounded text-center text-[#0097A7] font-black text-[12px]" />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="hover:text-slate-800 flex items-center gap-1 text-[11px] font-bold transition-colors">
                <Printer size={14} className="text-slate-400" /> Dos
              </button>
              <button className="hover:text-emerald-600 flex items-center gap-1 text-[11px] font-bold transition-colors">
                <FileSpreadsheet size={14} className="text-emerald-500" /> Excel
              </button>
              <button className="hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold transition-colors">
                <FileText size={14} className="text-rose-500" /> Pdf
              </button>
              <button className="hover:text-[#0097A7] flex items-center gap-1 text-[11px] font-bold transition-colors">
                <Filter size={14} /> Filter
              </button>
              <button className="hover:text-[#0097A7] flex items-center gap-1 text-[11px] font-bold transition-colors">
                <Settings size={14} /> Setting
              </button>
            </div>
          </div>

          {/* High-Density Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[1800px]">
              <thead className="bg-[#f8fafc] text-[10px] uppercase text-slate-500 font-bold border-b border-slate-300 sticky top-0 z-10">
                <tr className="divide-x divide-slate-300">
                  <th className="px-2 py-1.5 w-12 text-center">S.No</th>
                  <th className="px-3 py-1.5">Machine Name</th>
                  <th className="px-3 py-1.5">Item Name</th>
                  <th className="px-3 py-1.5">Description</th>
                  <th className="px-3 py-1.5 text-center w-40">Date</th>
                  <th className="px-3 py-1.5">Problem</th>
                  <th className="px-3 py-1.5">Action Taken</th>
                  <th className="px-3 py-1.5">Remark</th>
                  <th className="px-3 py-1.5">Reported By</th>
                  <th className="px-3 py-1.5">Cleared By</th>
                  <th className="px-3 py-1.5 text-center w-40">Cleared Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[12px]">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-24 text-center text-slate-300 italic uppercase font-black text-[10px] tracking-widest opacity-40">
                      No tickets awaiting clearance
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={row.id} className="h-9 hover:bg-[#f0f9fa]/40 transition-colors divide-x divide-slate-100 group">
                      <td className="px-2 py-1 text-center text-slate-300 font-bold">{idx + 1}</td>
                      <td className="px-3 py-1 font-bold text-[#0097A7] uppercase">{row.machineName}</td>
                      <td className="px-3 py-1 font-semibold text-slate-700">{row.partNo}</td>
                      <td className="px-3 py-1 text-slate-500">{row.processStage}</td>
                      <td className="px-3 py-1 text-center text-slate-400 font-medium">{row.date}</td>
                      <td className="px-3 py-1 text-slate-600 italic">{row.problemDescription}</td>
                      <td className="px-3 py-1 text-slate-500">-</td>
                      <td className="px-3 py-1 text-slate-500">-</td>
                      <td className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px]">{row.reportedBy}</td>
                      <td className="px-3 py-1 text-slate-400">-</td>
                      <td className="px-3 py-1 text-center text-slate-300">N/A</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
