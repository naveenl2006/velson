import { useState } from 'react'
import { 
  ChevronRight, X, Printer, LayoutGrid, Camera, FileText, Image as ImageIcon, ChevronUp 
} from 'lucide-react'

// ── Shared UI primitives (Consistent with design system) ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
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

const BoxLabel = ({ children }) => (
  <div className="bg-[#B0BEC5]/30 border border-slate-300 px-3 py-1.5 text-[11px] font-black text-slate-700 uppercase flex items-center justify-center min-w-[120px] rounded-l-lg">
    {children}
  </div>
)

export default function ProcessCard() {
  const [form, setForm] = useState({
    jobNumber: '',
    planQty: '',
    barcode: '',
    vehicleType: '',
    planDate: '',
    requiredDate: '',
    partNo: ''
  })

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Production</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold uppercase tracking-widest">Process Card</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-black text-teal-700 uppercase tracking-widest">Process Card</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm group">
                <Printer size={16} className="text-[#0097A7] group-hover:scale-110 transition-transform" /> PrintData
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Top Layout */}
            <div className="grid grid-cols-12 gap-8 mb-8">
               {/* Form Grid */}
               <div className="col-span-9 space-y-4">
                  <div className="grid grid-cols-3 gap-6">
                     <div className="flex items-center">
                        <BoxLabel>JOB Number :</BoxLabel>
                        <Input className="flex-1 rounded-l-none" value={form.jobNumber} onChange={u('jobNumber')} />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Plan Qty :</BoxLabel>
                        <Input className="flex-1 rounded-l-none" value={form.planQty} onChange={u('planQty')} />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Barcode :</BoxLabel>
                        <Input className="flex-1 rounded-l-none" value={form.barcode} onChange={u('barcode')} />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                     <div className="flex items-center">
                        <BoxLabel>Vehicle Type :</BoxLabel>
                        <Input className="flex-1 rounded-l-none" value={form.vehicleType} onChange={u('vehicleType')} />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Plan Date :</BoxLabel>
                        <Input className="flex-1 rounded-l-none" value={form.planDate} onChange={u('planDate')} />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Required Date :</BoxLabel>
                        <Input className="flex-1 rounded-l-none" value={form.requiredDate} onChange={u('requiredDate')} />
                     </div>
                  </div>

                  <div className="grid grid-cols-1">
                     <div className="flex items-center">
                        <BoxLabel>Part No :</BoxLabel>
                        <Select options={['PART-001', 'PART-002']} className="flex-1 rounded-l-none" value={form.partNo} onChange={u('partNo')} />
                     </div>
                  </div>
               </div>

               {/* Part Image Preview */}
               <div className="col-span-3 flex flex-col border-l border-slate-100 pl-8">
                  <Label>Part Image</Label>
                  <div className="mt-2 h-32 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-300 relative overflow-hidden group">
                     <Camera size={32} strokeWidth={1} className="group-hover:scale-110 transition-transform opacity-30" />
                     <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-30">No Image</p>
                  </div>
               </div>
            </div>

            {/* Content Area (Split Table and Drawing Lists) */}
            <div className="flex-1 flex gap-8">
               {/* Process Table */}
               <div className="flex-[3] border border-slate-200 rounded-xl overflow-hidden overflow-x-auto shadow-sm bg-slate-400/20">
                  <table className="w-full text-left border-collapse bg-white min-w-[1800px]">
                     <thead className="bg-[#fcfdfe] text-[10.5px] uppercase text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                           <th className="px-2 py-2.5 border-r border-slate-200 w-8"></th>
                           {[
                             'ID','S No','Process Name','Team','Work Center No','Machine Name','IN Date','In Remark','OUT Date','OUT Remark','Setting Time','Cycle Time','Handling Time'
                           ].map(h => (
                             <th key={h} className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">{h}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-[12px]">
                        <tr className="h-10 hover:bg-slate-50/50 transition-colors">
                           <td className="px-2 py-2 border-r border-slate-100 text-center font-bold text-slate-400 italic">*</td>
                           {[...Array(13)].map((_, i) => <td key={i} className="border-r border-slate-50 last:border-r-0"></td>)}
                        </tr>
                        {[...Array(20)].map((_, i) => (
                           <tr key={i} className="h-10 border-b border-slate-50">
                              <td className="border-r border-slate-50 bg-slate-50/30"></td>
                              {[...Array(13)].map((_, j) => <td key={j} className="border-r border-slate-50 last:border-r-0"></td>)}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Right Side Drawing Lists */}
               <div className="flex-1 flex flex-col gap-6 max-w-[300px]">
                  <div className="flex flex-col flex-1">
                     <div className="flex items-center justify-between mb-2">
                        <Label>Job Drawing List</Label>
                        <FileText size={14} className="text-slate-400" />
                     </div>
                     <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-inner p-4 flex flex-col items-center justify-center text-slate-300 italic text-[11px] min-h-[300px]">
                        <LayoutGrid size={32} strokeWidth={1} className="opacity-10 mb-2" />
                        <p className="opacity-40">No drawings available</p>
                     </div>
                  </div>

                  <div className="flex flex-col h-48">
                     <div className="flex items-center justify-between mb-2">
                        <Label>Part Drawing List</Label>
                        <ImageIcon size={14} className="text-slate-400" />
                     </div>
                     <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-inner p-4 flex flex-col items-center justify-center text-slate-300 italic text-[11px]">
                        <p className="opacity-40">No part drawings</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer Console Branding */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
               <div className="flex items-center gap-2 opacity-20">
                  <LayoutGrid size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 italic">Production Process Intelligence Console</span>
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Pr fetch Process Card Entry1
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
