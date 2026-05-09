import { useState } from 'react'
import { ChevronRight, Search, Send, X } from 'lucide-react'
import { useToast } from '../components/Toast'

const SUPPLIERS = ['VENKATESWARA ASSOCIATES','APS ENTERPRISES','SM DRILLING COMPANY','ABHISHEK SONI','AJAY KUMAR']
const today = new Date().toISOString().split('T')[0]
const genGENo = () => { const yr = new Date().getFullYear(); return `${(yr-1).toString().slice(-2)}-${yr.toString().slice(-2)}/GE00001` }

const emptyItem = () => ({ poNo:'', itemCode:'', itemName:'', supplierPartNo:'', description:'', hsnCode:'', unit:'', qty:'', recQty:'' })
const inp = (err='') => `w-full border rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 transition-colors bg-white ${err?'border-red-400 focus:ring-red-300':'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'

export default function GateEntry() {
  const toast = useToast()
  const [form, setForm] = useState({
    poNo:'', prqNo:'', supplierName:'', supplierAddress:'',
    gateNo:'', carrierName:'', vehicleNo:'', user:'superadmin',
    gateEntryNo:genGENo(), gateEntryDate:today, invoiceNo:'', invoiceDate:today,
  })
  const [items, setItems] = useState([emptyItem()])
  const [remarks, setRemarks] = useState('')

  const setField = (k,v) => setForm(f=>({...f,[k]:v}))
  const setItemField = (idx,k,v) => setItems(rows=>rows.map((r,i)=>i!==idx?r:{...r,[k]:v}))
  const removeRow = idx => setItems(r=>r.filter((_,i)=>i!==idx))

  const handleSupplierChange = name => {
    setForm(f=>({...f, supplierName:name, supplierAddress: name ? '123, Industrial Area, City\nDistrict, State - 000000' : ''}))
  }

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Stores</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Gate Entry</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Create - Gate Entry</h2>
          <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors">Close</button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-4">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>PO No :</label>
                <input value={form.poNo} onChange={e=>setField('poNo',e.target.value)} className={`${inp()} flex-1`}/>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[12px] rounded transition-colors shrink-0">Search</button>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>PRQ No :</label>
                <input value={form.prqNo} onChange={e=>setField('prqNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Supplier Name:</label>
                <select value={form.supplierName} onChange={e=>handleSupplierChange(e.target.value)} className={inp()}>
                  <option value="">Select Supplier</option>
                  {SUPPLIERS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-[130px] shrink-0 pt-1`}>Supplier Address :</label>
                <textarea rows={3} value={form.supplierAddress} onChange={e=>setField('supplierAddress',e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none bg-white"/>
              </div>
            </div>
            {/* Col 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Gate No :</label>
                <input value={form.gateNo} onChange={e=>setField('gateNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Carrier Name :</label>
                <input value={form.carrierName} onChange={e=>setField('carrierName',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Vehicle No :</label>
                <input value={form.vehicleNo} onChange={e=>setField('vehicleNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>User :</label>
                <input value={form.user} readOnly className={`${inp()} bg-slate-50`}/>
              </div>
            </div>
            {/* Col 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Gate Entry No :</label>
                <input value={form.gateEntryNo} readOnly className={`${inp()} bg-slate-50`}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Gate Entry Date :</label>
                <input type="date" value={form.gateEntryDate} onChange={e=>setField('gateEntryDate',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Invoice No :</label>
                <input value={form.invoiceNo} onChange={e=>setField('invoiceNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Invoice Date :</label>
                <input type="date" value={form.invoiceDate} onChange={e=>setField('invoiceDate',e.target.value)} className={inp()}/>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-2">
            <div className="bg-slate-700 px-3 py-1.5 rounded-t"><h3 className="text-white text-[13px] font-semibold">Items</h3></div>
            <div className="overflow-x-auto border border-slate-200 rounded-b">
              <table className="min-w-full text-[12.5px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase w-8"><input type="checkbox" className="accent-[#0097A7]"/></th>
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase w-8">#</th>
                    {['PO No','Item Code','Item Name','Supplier Part No','Description','HSN Code','Unit','Qty','Rec Qty','Action'].map(h=>(
                      <th key={h} className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row,idx)=>(
                    <tr key={idx} className={`border-b border-slate-100 ${idx%2===1?'bg-slate-50/50':''}`}>
                      <td className="px-2 py-1 text-center"><input type="checkbox" className="accent-[#0097A7]"/></td>
                      <td className="px-2 py-1 text-center text-slate-500">{idx+1}</td>
                      <td className="px-1 py-1"><input value={row.poNo} onChange={e=>setItemField(idx,'poNo',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.itemCode} onChange={e=>setItemField(idx,'itemCode',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.itemName} onChange={e=>setItemField(idx,'itemName',e.target.value)} className={`${inp()} min-w-[140px]`}/></td>
                      <td className="px-1 py-1"><input value={row.supplierPartNo} onChange={e=>setItemField(idx,'supplierPartNo',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.description} onChange={e=>setItemField(idx,'description',e.target.value)} className={`${inp()} min-w-[120px]`}/></td>
                      <td className="px-1 py-1"><input value={row.hsnCode} onChange={e=>setItemField(idx,'hsnCode',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.unit} onChange={e=>setItemField(idx,'unit',e.target.value)} className={`${inp()} w-14`}/></td>
                      <td className="px-1 py-1"><input value={row.qty} onChange={e=>setItemField(idx,'qty',e.target.value)} className={`${inp()} w-16`}/></td>
                      <td className="px-1 py-1"><input value={row.recQty} onChange={e=>setItemField(idx,'recQty',e.target.value)} className={`${inp()} w-16`}/></td>
                      <td className="px-2 py-1 text-center"><button onClick={()=>removeRow(idx)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] rounded transition-colors">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks + Submit */}
          <div className="flex items-start gap-4 pt-2">
            <label className={`${lbl} w-[100px] shrink-0 pt-1`}>Remark's :</label>
            <textarea rows={2} value={remarks} onChange={e=>setRemarks(e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none bg-white"/>
          </div>
          <div className="flex gap-2 justify-center pt-1">
            <button onClick={()=>toast.success('Gate Entry submitted!')} className="flex items-center gap-1 px-5 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors shadow-sm"><Send className="w-3.5 h-3.5"/> Submit</button>
            <button className="flex items-center gap-1 px-5 py-1.5 bg-slate-500 hover:bg-slate-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm"><X className="w-3.5 h-3.5"/> Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
