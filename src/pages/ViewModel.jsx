import { useState, useEffect } from 'react'
import { ChevronRight, Search, FileText, X, Layers, Printer, FileDown, RotateCcw, Box } from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
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

export default function ViewModel() {
  const [form, setForm] = useState({
    customerName: '',
    customerCode: '',
    modelNo: '',
    partNo: '',
    stockNill: false
  })

  const [structure, setStructure] = useState([])
  const [loading, setLoading] = useState(false)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFetchHierarchy = () => {
    if (!form.modelNo) {
      alert('Select a Model No to view hierarchy.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setStructure([
        { id: 1, level: 'L1', component: 'Chassis Base', status: 'In Stock', qty: 1 },
        { id: 2, level: 'L2', component: 'Front Axle Assembly', status: 'Ordered', qty: 1 },
        { id: 3, level: 'L3', component: 'Hydraulic Cylinder X1', status: 'In Stock', qty: 4 },
        { id: 4, level: 'L2', component: 'Electrical Wiring Harness', status: 'Shortage', qty: 1 },
      ])
      setLoading(false)
    }, 700)
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>BOM</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">View Model</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[750px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Model Configuration Explorer</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95">
                <Printer size={15} /> Print PDF
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-lg transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-12 gap-10 items-start">
              {/* Left Column: Intelligence Filters */}
              <div className="col-span-8 space-y-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 text-right"><Label>Customer Entity :</Label></div>
                  <div className="col-span-6"><Select options={['Customer A', 'Customer B', 'Customer C']} placeholder="Select Customer Account" value={form.customerName} onChange={u('customerName')} /></div>
                  <div className="col-span-3">
                    <button className="flex items-center justify-center gap-2 w-full px-4 py-[9px] bg-white hover:bg-slate-50 text-[#0097A7] text-[10px] font-black rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95 uppercase tracking-widest">
                      <FileDown size={14} /> Full PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 text-right"><Label>Reference Code :</Label></div>
                  <div className="col-span-6"><Input placeholder="C-0000" value={form.customerCode} onChange={u('customerCode')} /></div>
                  <div className="col-span-3">
                    <button 
                      onClick={handleFetchHierarchy}
                      className="flex items-center justify-center gap-2 w-full px-4 py-[9px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[10px] font-black rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-widest"
                    >
                      {loading ? <RotateCcw size={14} className="animate-spin" /> : <Search size={14} />}
                      Fetch Model
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 text-right"><Label>Active Model :</Label></div>
                  <div className="col-span-6"><Select options={['MOD-V10-2026', 'MOD-V7-2026', 'MOD-X500']} placeholder="Choose Manufacturing Model" value={form.modelNo} onChange={u('modelNo')} /></div>
                  <div className="col-span-3 pl-3 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="stockNill" 
                      checked={form.stockNill} 
                      onChange={e => setForm(f => ({...f, stockNill: e.target.checked}))}
                      className="w-4.5 h-4.5 accent-[#0097A7] rounded-lg cursor-pointer" 
                    />
                    <label htmlFor="stockNill" className="text-[10px] font-black text-slate-500 uppercase cursor-pointer hover:text-[#0097A7] tracking-tighter">Exclude Nill Stock</label>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 text-right"><Label>Specific Assembly :</Label></div>
                  <div className="col-span-6"><Select options={['ASSY-HYD-001', 'ASSY-ELE-002']} placeholder="Filter by Sub-Assembly" value={form.partNo} onChange={u('partNo')} /></div>
                  <div className="col-span-3 flex items-center gap-3 pl-3">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Dataset<br/>Depth</span>
                    <span className="text-[20px] font-black text-[#0097A7] leading-none">{structure.length}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visualization Panel */}
              <div className="col-span-4 h-full">
                 <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-[280px] flex flex-col items-center justify-center border border-slate-800 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/20 to-transparent pointer-events-none" />
                    <Box size={64} strokeWidth={1} className="text-[#0097A7] mb-6 group-hover:scale-110 transition-transform opacity-50" />
                    <div className="text-center z-10">
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Structure Integrity</p>
                      <p className="text-white text-[15px] font-bold tracking-tight">
                        {form.modelNo || 'STANDBY - WAITING INPUT'}
                      </p>
                    </div>
                    {structure.length > 0 && (
                      <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-between items-center z-10">
                         <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden mr-4">
                           <div className="h-full bg-[#0097A7] w-3/4" />
                         </div>
                         <span className="text-[10px] font-black text-[#0097A7]">75% ANALYZED</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Content Area - Hierarchical View */}
            <div className="mt-12 flex-1 flex flex-col">
               <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                    <div className="w-2 h-5 bg-[#0097A7] rounded-sm" />
                    BOM Hierarchy Ledger
                  </h3>
                  {structure.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Operational View</span>
                    </div>
                  )}
               </div>

               <div className={`flex-1 border-2 border-dashed rounded-3xl overflow-hidden transition-all duration-500 min-h-[350px] ${structure.length > 0 ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50'}`}>
                  {structure.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-24">
                       <Layers size={80} strokeWidth={0.5} className="opacity-10 mb-6" />
                       <p className="text-[13px] font-black uppercase tracking-[0.4em] opacity-40">Visualization Offline</p>
                       <p className="text-[11px] italic mt-2 opacity-50">Compile model parameters to initialize explorer</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fcfdfe] text-[9.5px] uppercase text-slate-400 font-black border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-5 border-r border-slate-100 w-20 text-center">Layer</th>
                            <th className="px-6 py-5 border-r border-slate-100">Component Specification</th>
                            <th className="px-6 py-5 border-r border-slate-100 text-center w-32">Req. Qty</th>
                            <th className="px-6 py-5 text-center w-40">Inventory Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {structure.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors h-16 group">
                              <td className="px-6 py-2 border-r border-slate-50 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${item.level === 'L1' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  {item.level}
                                </span>
                              </td>
                              <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase text-[11.5px] tracking-tight">{item.component}</td>
                              <td className="px-6 py-2 border-r border-slate-50 text-center font-black text-[16px] text-slate-400">{item.qty}</td>
                              <td className="px-6 py-2 text-center">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                  item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                                  item.status === 'Shortage' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
