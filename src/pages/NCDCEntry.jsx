import { useState, useEffect } from 'react'
import { 
  ChevronRight, Save, X, Search, RefreshCw, Trash2, Eraser, 
  FileSpreadsheet, Camera, Truck, ChevronUp, CheckCircle2, ShieldAlert,
  Plus, RotateCcw, Package, ClipboardList
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} ${className}`}
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

const TextArea = ({ placeholder, value, onChange, className = "", rows = 3 }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 resize-none ${className}`}
  />
)

export default function NCDCEntry() {
  const [form, setForm] = useState({
    dcNo: 'NC-DC-' + Math.floor(Math.random() * 90000 + 10000),
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerDetails: '',
    dcType: 'Non-Conformance',
    vehicleNo: '',
    contPerson: '',
    driverName: '',
    contactNo: '',
    desThrough: '',
    gstNo: '',
    dcPartNo: '',
    partNo: '',
    partName: '',
    spec: '',
    brand: '',
    qty: '',
    uom: '',
    rate: '',
    amount: '',
    mGrade: '',
    hrc: '',
    weight: '',
    barcode: '',
    details: '',
    termsOfDelivery: '',
    totalQty: '0',
    totalAmount: '0.00'
  })

  const [items, setItems] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAddItem = () => {
    if (!form.partName || !form.qty) {
      alert('Required: Part Name and Quantity.')
      return
    }
    const newItem = {
      id: Date.now(),
      partName: form.partName,
      qty: form.qty,
      uom: form.uom,
      amount: (parseFloat(form.qty) * parseFloat(form.rate || 0)).toFixed(2)
    }
    setItems([...items, newItem])
    setForm(f => ({
      ...f,
      partName: '',
      qty: '',
      totalQty: (parseInt(f.totalQty) + parseInt(form.qty)).toString(),
      totalAmount: (parseFloat(f.totalAmount) + parseFloat(newItem.amount)).toFixed(2)
    }))
  }

  const handleSave = () => {
    if (items.length === 0) {
      alert('Staging area is empty.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const entry = { ...form, items, id: Date.now() }
      const saved = JSON.parse(localStorage.getItem('velson_nc_dc_entries') || '[]')
      localStorage.setItem('velson_nc_dc_entries', JSON.stringify([entry, ...saved]))
      setIsSaving(false)
      alert('NC Delivery Challan Authorized.')
      handleReset()
    }, 800)
  }

  const handleReset = () => {
    setForm({
      dcNo: 'NC-DC-' + Math.floor(Math.random() * 90000 + 10000),
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerDetails: '',
      dcType: 'Non-Conformance',
      vehicleNo: '',
      contPerson: '',
      driverName: '',
      contactNo: '',
      desThrough: '',
      gstNo: '',
      dcPartNo: '',
      partNo: '',
      partName: '',
      spec: '',
      brand: '',
      qty: '',
      uom: '',
      rate: '',
      amount: '',
      mGrade: '',
      hrc: '',
      weight: '',
      barcode: '',
      details: '',
      termsOfDelivery: '',
      totalQty: '0',
      totalAmount: '0.00'
    })
    setItems([])
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>NC</span> <ChevronRight size={12} /> <span className="text-rose-500">Non-Conformance DC Entry</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-rose-600 rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest text-rose-600">NC Delivery Management</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Part 1: High Risk Header */}
            <div className="grid grid-cols-12 gap-12 bg-rose-50/20 p-8 rounded-[2.5rem] border border-rose-100/50 shadow-inner">
               <div className="col-span-4 space-y-4">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>NC DC ID</Label></div>
                    <div className="col-span-8"><Input value={form.dcNo} readOnly className="!font-black text-rose-600 !bg-white" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>Customer</Label></div>
                    <div className="col-span-8"><Select options={['Customer A', 'Customer B']} placeholder="Select Client" value={form.customerName} onChange={u('customerName')} /></div>
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4"></div>
                    <div className="col-span-8"><TextArea placeholder="NC Return Address" value={form.customerDetails} onChange={u('customerDetails')} rows={3} className="text-[12px]" /></div>
                  </div>
               </div>

               <div className="col-span-4 space-y-4">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Category</Label></div>
                    <div className="col-span-8"><Input value={form.dcType} readOnly className="font-bold text-slate-500" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Reference</Label></div>
                    <div className="col-span-8"><Input placeholder="Rejection ID" value={form.contPerson} onChange={u('contPerson')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>GST No</Label></div>
                    <div className="col-span-8"><Input placeholder="Tax Registration" value={form.gstNo} onChange={u('gstNo')} /></div>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col items-center justify-center border-l border-rose-100 pl-8">
                  <ShieldAlert size={48} className="text-rose-500 mb-3 opacity-20" />
                  <p className="text-[10px] font-black text-rose-300 uppercase tracking-[0.4em] text-center leading-relaxed">Safety Protocol<br/>Authorized Access Only</p>
               </div>
            </div>

            {/* Part 2: Item Entry */}
            <div className="grid grid-cols-12 gap-10">
               <div className="col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center font-black text-[14px]">02</div>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Rejection Item Staging</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label>NC Part Specification</Label>
                           <Select options={['P-101 (Defect)', 'P-102 (Rework)']} placeholder="Choose Component" value={form.partName} onChange={u('partName')} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label>Qty to Return</Label>
                              <Input type="number" placeholder="0" value={form.qty} onChange={u('qty')} />
                           </div>
                           <div className="space-y-1">
                              <Label>UOM</Label>
                              <Input placeholder="PCS" value={form.uom} onChange={u('uom')} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label>Defect Grade / Details</Label>
                           <Input placeholder="Material Grade / HRC" value={form.mGrade} onChange={u('mGrade')} />
                        </div>
                        <div className="flex flex-col justify-end pt-6">
                           <button 
                             onClick={handleAddItem}
                             className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black rounded-xl shadow-lg transition-all uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
                           >
                              <Plus size={16} /> Stage Component
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Logistic Status</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-5 relative z-10">
                     <div className="space-y-1">
                        <Label><span className="text-white/40">Transport Mode</span></Label>
                        <Select options={['Courier', 'Self Return', 'Factory Pickup']} placeholder="Method" value={form.desThrough} onChange={u('desThrough')} className="!bg-slate-800 !text-white !border-slate-700" />
                     </div>
                     <div className="space-y-1">
                        <Label><span className="text-white/40">Driver / Personnel</span></Label>
                        <Input placeholder="Name" value={form.driverName} onChange={u('driverName')} className="!bg-slate-800 !text-white !border-slate-700" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Part 3: Staging Area */}
            <div className="flex-1 min-h-[350px] border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 border-r border-slate-100 w-20 text-center">#</th>
                    <th className="px-8 py-5 border-r border-slate-100">NC Component Details</th>
                    <th className="px-8 py-5 border-r border-slate-100 text-center w-40">Qty</th>
                    <th className="px-8 py-5 text-center w-40">UOM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center text-slate-200 italic">
                         <Package size={80} className="mx-auto mb-4 opacity-5" />
                         Staging area is clear. No NC items assigned.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-rose-50/50 transition-colors h-16">
                        <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase tracking-tight">{item.partName}</td>
                        <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-rose-600">{item.qty}</td>
                        <td className="px-8 py-2 text-center text-slate-500 font-bold">{item.uom}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Authorization Footer */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 flex items-center justify-between shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-32 bg-rose-600/10 rounded-full blur-3xl" />
               <div className="flex items-center gap-12">
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Aggregate Qty</p>
                    <p className="text-[32px] font-black text-white leading-none">{form.totalQty}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10" />
                  <div className="max-w-xs">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Instructions</p>
                    <TextArea placeholder="NC handling protocols..." value={form.termsOfDelivery} onChange={u('termsOfDelivery')} className="!bg-slate-800 !text-white !border-slate-700 h-20 text-[11px]" />
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleReset} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/50 text-[11px] font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest">
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <RotateCcw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    {isSaving ? 'Authorizing...' : 'Register NC DC'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
