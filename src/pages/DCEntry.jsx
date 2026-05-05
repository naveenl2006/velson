import { useState, useEffect } from 'react'
import { 
  ChevronRight, Save, X, Search, RefreshCw, Edit, Trash2, Eraser, 
  FileSpreadsheet, Camera, Package, Truck, ChevronUp, CheckCircle2,
  ClipboardList, Plus, RotateCcw, FileText
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

export default function DCEntry() {
  const [form, setForm] = useState({
    dcNo: 'DC-' + Math.floor(Math.random() * 90000 + 10000),
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerDetails: '',
    dcType: '',
    vehicleNo: '',
    contPerson: '',
    driverName: '',
    contactNo: '',
    desThrough: '',
    gstNo: '',
    barcode: '',
    partNo: '',
    partName: '',
    spec: '',
    brand: '',
    qty: '',
    uom: '',
    rate: '',
    amount: '',
    heatTreatment: '',
    mGrade: '',
    hrc: '',
    weight: '',
    rework: 'NO',
    details: '',
    termsOfDelivery: '',
    totalQty: '0',
    totalAmount: '0.00'
  })

  const [dcList, setDcList] = useState([])
  const [items, setItems] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_dc_entries') || '[]')
    setDcList(saved)
  }, [])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAddItem = () => {
    if (!form.partName || !form.qty) {
      alert('Required: Part Name and Quantity.')
      return
    }
    const newItem = {
      id: Date.now(),
      partName: form.partName,
      partNo: form.partNo,
      qty: form.qty,
      uom: form.uom,
      rate: form.rate,
      amount: (parseFloat(form.qty) * parseFloat(form.rate || 0)).toFixed(2)
    }
    setItems([...items, newItem])
    setForm(f => ({
      ...f,
      partName: '',
      partNo: '',
      qty: '',
      uom: '',
      rate: '',
      amount: '',
      barcode: '',
      spec: '',
      brand: '',
      totalQty: (parseInt(f.totalQty) + parseInt(form.qty)).toString(),
      totalAmount: (parseFloat(f.totalAmount) + parseFloat(newItem.amount)).toFixed(2)
    }))
  }

  const handleSave = () => {
    if (items.length === 0) {
      alert('Add at least one item.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const entry = { ...form, items, id: Date.now() }
      const updated = [entry, ...dcList]
      localStorage.setItem('velson_dc_entries', JSON.stringify(updated))
      setDcList(updated)
      setIsSaving(false)
      alert('Delivery Challan Created Successfully!')
      handleReset()
    }, 800)
  }

  const handleReset = () => {
    setForm({
      dcNo: 'DC-' + Math.floor(Math.random() * 90000 + 10000),
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerDetails: '',
      dcType: '',
      vehicleNo: '',
      contPerson: '',
      driverName: '',
      contactNo: '',
      desThrough: '',
      gstNo: '',
      barcode: '',
      partNo: '',
      partName: '',
      spec: '',
      brand: '',
      qty: '',
      uom: '',
      rate: '',
      amount: '',
      heatTreatment: '',
      mGrade: '',
      hrc: '',
      weight: '',
      rework: 'NO',
      details: '',
      termsOfDelivery: '',
      totalQty: '0',
      totalAmount: '0.00'
    })
    setItems([])
  }

  const deleteEntry = (id) => {
    const next = dcList.filter(d => d.id !== id)
    setDcList(next)
    localStorage.setItem('velson_dc_entries', JSON.stringify(next))
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Logistics</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Delivery Challan Entry</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#0097A7] rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Outward Delivery Management</h2>
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
            {/* Part 1: Header Info */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-8 rounded-3xl border border-slate-100 shadow-inner">
               <div className="col-span-4 space-y-4">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>DC ID</Label></div>
                    <div className="col-span-8"><Input value={form.dcNo} readOnly className="!font-black text-[#0097A7] !bg-white" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>Customer</Label></div>
                    <div className="col-span-8"><Select options={['Customer A', 'Customer B', 'Customer C']} placeholder="Select Client Account" value={form.customerName} onChange={u('customerName')} /></div>
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4"></div>
                    <div className="col-span-8"><TextArea placeholder="Billing / Delivery Address Details" value={form.customerDetails} onChange={u('customerDetails')} rows={3} className="text-[12px]" /></div>
                  </div>
               </div>

               <div className="col-span-4 space-y-4">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>DC Type</Label></div>
                    <div className="col-span-8"><Select options={['Sale', 'Returnable', 'Non-Returnable', 'Sample']} placeholder="Category" value={form.dcType} onChange={u('dcType')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Attn To</Label></div>
                    <div className="col-span-8"><Input placeholder="Contact Person" value={form.contPerson} onChange={u('contPerson')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>GST Reference</Label></div>
                    <div className="col-span-8"><Input placeholder="Tax Registration No" value={form.gstNo} onChange={u('gstNo')} /></div>
                  </div>
               </div>

               <div className="col-span-4 space-y-4">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Despatch</Label></div>
                    <div className="col-span-8"><Select options={['Company Vehicle', 'Direct Delivery', 'Courier / Transport']} placeholder="Mode" value={form.desThrough} onChange={u('desThrough')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Vehicle</Label></div>
                    <div className="col-span-8"><Input placeholder="V-No (e.g. TN-37-XY-0000)" value={form.vehicleNo} onChange={u('vehicleNo')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Driver</Label></div>
                    <div className="col-span-8"><Input placeholder="Operator Name" value={form.driverName} onChange={u('driverName')} /></div>
                  </div>
               </div>
            </div>

            {/* Part 2: Item Entry Section */}
            <div className="border-t border-slate-100 pt-8">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-[14px]">02</div>
                 <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Inventory Assignment</h3>
               </div>

               <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-8 space-y-5">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2">
                             <Input placeholder="Scan Barcode / Serial" value={form.barcode} onChange={u('barcode')} className="flex-1" />
                             <button className="p-2 bg-[#0097A7] text-white rounded-lg shadow-md hover:bg-[#007a87] transition-all">
                                <Search size={18} />
                             </button>
                           </div>
                           <div className="space-y-1">
                              <Label>Component Name</Label>
                              <Input placeholder="Enter Part Name" value={form.partName} onChange={u('partName')} />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <Label>Quantity</Label>
                                 <Input type="number" placeholder="0" value={form.qty} onChange={u('qty')} />
                              </div>
                              <div className="space-y-1">
                                 <Label>UOM</Label>
                                 <Select options={['PCS', 'NOS', 'SETS', 'KGS']} placeholder="Unit" value={form.uom} onChange={u('uom')} />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-1">
                              <Label>Part Specification</Label>
                              <Input placeholder="Dimensions / Grade" value={form.spec} onChange={u('spec')} />
                           </div>
                           <div className="space-y-1">
                              <Label>Heat Treatment / HRC</Label>
                              <Input placeholder="H.T Status" value={form.heatTreatment} onChange={u('heatTreatment')} />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <Label>Unit Rate</Label>
                                 <Input type="number" placeholder="0.00" value={form.rate} onChange={u('rate')} />
                              </div>
                              <div className="space-y-1 pt-6 flex flex-col justify-end pb-1.5">
                                 <button 
                                   onClick={handleAddItem}
                                   className="w-full py-[7px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-black rounded-lg shadow-md transition-all uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
                                 >
                                    <Plus size={16} /> Add Item
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-4 flex flex-col gap-4">
                     <div className="flex-1 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group border border-slate-800 shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-white">
                           <Package size={80} />
                        </div>
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-[#0097A7] mb-4 group-hover:scale-110 transition-transform">
                           <Camera size={40} strokeWidth={1} />
                        </div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Package Evidence</p>
                        <button className="mt-4 px-6 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 text-[10px] font-bold rounded-lg border border-white/10 transition-all uppercase tracking-widest">
                           Snapshot
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Part 3: Items Grid */}
            <div className="flex-1 min-h-[300px] border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 border-r border-slate-100 w-16 text-center">#</th>
                    <th className="px-6 py-4 border-r border-slate-100">Specification / Component</th>
                    <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Qty</th>
                    <th className="px-6 py-4 border-r border-slate-100 text-center w-32">UOM</th>
                    <th className="px-6 py-4 border-r border-slate-100 text-right w-40">Rate</th>
                    <th className="px-6 py-4 text-right w-40">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px]">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-24 text-center text-slate-200 italic">
                         <ClipboardList size={64} className="mx-auto mb-4 opacity-5" />
                         No items staged for despatch.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#0097A7]/5 transition-colors h-14">
                        <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase">{item.partName} <span className="block text-[10px] font-normal text-slate-400">{item.partNo}</span></td>
                        <td className="px-6 py-2 border-r border-slate-50 text-center font-black text-slate-800">{item.qty}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-500 font-bold">{item.uom}</td>
                        <td className="px-6 py-2 border-r border-slate-50 text-right font-medium text-slate-600">{item.rate}</td>
                        <td className="px-6 py-2 text-right font-black text-[#0097A7]">{item.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                {items.length > 0 && (
                  <tfoot className="bg-[#fcfdfe] border-t-2 border-slate-200 text-[12px] font-black text-slate-800">
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-right uppercase tracking-widest text-slate-400">Total Despatch Summary :</td>
                      <td className="px-6 py-4 text-center bg-slate-50">{form.totalQty}</td>
                      <td className="px-6 py-4 border-r border-slate-100"></td>
                      <td className="px-6 py-4 border-r border-slate-100"></td>
                      <td className="px-6 py-4 text-right bg-slate-50 text-rose-600">INR {form.totalAmount}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-start justify-between bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/10 to-transparent pointer-events-none" />
               <div className="w-[45%] space-y-4">
                  <h4 className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Contractual Clauses</h4>
                  <TextArea placeholder="Terms of Delivery / Special Instructions..." value={form.termsOfDelivery} onChange={u('termsOfDelivery')} className="!bg-slate-800 !text-white !border-slate-700 h-32" />
               </div>
               <div className="flex flex-col gap-5 w-[30%]">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[11px] font-black uppercase tracking-widest">Auth Required</span>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                     </div>
                     <p className="text-white/20 text-[10px] leading-relaxed italic">The following challan will be registered under current system administrator session.</p>
                  </div>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-[#0097A7] hover:bg-[#007a87] text-white text-[14px] font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSaving ? <RotateCcw size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    {isSaving ? 'Processing...' : 'Authorize Despatch'}
                  </button>
               </div>
            </div>

            {/* Historical Registry */}
            <div className="mt-20">
               <div className="flex items-center justify-between mb-6 px-4">
                 <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#0097A7] rounded-sm" />
                    Challan Registry
                 </h3>
                 <span className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase">{dcList.length} Archived Records</span>
               </div>
               <div className="grid grid-cols-3 gap-8">
                  {dcList.length === 0 ? (
                    <div className="col-span-3 py-12 text-center text-slate-300 uppercase font-black text-[10px] tracking-widest opacity-40 italic">
                       Registry Offline - No Records Found
                    </div>
                  ) : (
                    dcList.map(dc => (
                      <div key={dc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                           <FileText size={48} />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-[#0097A7] font-black text-[15px]">{dc.dcNo}</p>
                              <p className="text-slate-400 text-[10px] font-bold uppercase">{dc.date}</p>
                           </div>
                           <button onClick={() => deleteEntry(dc.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                              <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="space-y-1 mb-4">
                           <p className="text-slate-700 font-bold text-[13px] uppercase truncate">{dc.customerName}</p>
                           <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tighter">{dc.dcType} Outward</p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                           <div className="flex gap-1 items-center">
                              <Truck size={12} className="text-slate-300" />
                              <span className="text-[10px] font-black text-slate-400">{dc.vehicleNo || 'NA'}</span>
                           </div>
                           <p className="text-[12px] font-black text-slate-800">INR {dc.totalAmount}</p>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
