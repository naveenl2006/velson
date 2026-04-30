// Reusable CRUD table page factory
import { useState } from 'react'
import { Archive, ChevronRight, Package, Hash, FolderOpen, Factory } from 'lucide-react'

function ComingSoon({ title }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-3">
          <h2 className="text-white text-center font-semibold text-[14px]">{title}</h2>
        </div>
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <Archive size={48} className="text-slate-200" />
          <p className="text-[15px] font-semibold text-slate-400">Module Coming Soon</p>
          <p className="text-[13px]">This page is under development.</p>
        </div>
      </div>
    </div>
  )
}

export function DropDownNameMaster() { return <ComingSoon title="Drop Down Name Master" /> }
export function TaxLedgerMaster()    { return <ComingSoon title="Tax Ledger A/C Master" /> }

export function DashboardPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-5 mb-6">
        {[
          { label: 'Total Items',   value: '1,248', color: 'from-[#0097A7] to-[#00BCD4]', icon: <Package className="w-8 h-8" /> },
          { label: 'Part Numbers',  value: '34',    color: 'from-[#27ae60] to-[#2ecc71]', icon: <Hash className="w-8 h-8" /> },
          { label: 'Item Groups',   value: '12',    color: 'from-[#8e44ad] to-[#9b59b6]', icon: <FolderOpen className="w-8 h-8" /> },
          { label: 'Active Stores', value: '6',     color: 'from-[#e67e22] to-[#f39c12]', icon: <Factory className="w-8 h-8" /> },
        ].map(c => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-5 text-white shadow-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/70 text-[12px] font-semibold uppercase tracking-wider">{c.label}</p>
                <p className="text-3xl font-bold mt-1">{c.value}</p>
              </div>
              <span className="opacity-80">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded border border-slate-200 shadow-sm p-6">
        <h3 className="text-[14px] font-bold text-slate-600 mb-4 uppercase tracking-wider">Quick Access</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            'Part Number Base Master','Item Group Master','Item Master',
            'Drop Down Name Master','Tax Master','Tax Ledger A/C Master',
            'Drop Down List Master',
          ].map(lbl => (
            <div key={lbl} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-[#0097A7] hover:bg-[#f0f9fa] cursor-pointer transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-[#D4F1F4] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0097A7]/20 transition-colors">
                <ChevronRight size={15} className="text-[#0097A7]" />
              </div>
              <span className="text-[12.5px] font-medium text-slate-600 group-hover:text-[#0097A7] transition-colors">{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
