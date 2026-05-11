import { useState } from 'react'
import { ChevronRight, Plus, Trash2, Send, X } from 'lucide-react'
import { useToast } from '../components/Toast'

const SUPPLIERS = ['VENKATESWARA ASSOCIATES','APS ENTERPRISES','SM DRILLING COMPANY','ABHISHEK SONI']
const GRN_TYPES = ['GRN Against PO','GRN Without PO','GRN Against Job Work']
const PURCHASE_LEDGERS = ['apple tech','purchase ledger','raw materials']
const PURCHASE_TYPES = ['CASH','CREDIT']
const CURRENCIES = ['INR','USD','EUR']
const CURRENCY_TYPES = ['EXPORT','DOMESTIC']
const TAX_TYPES = ['INTER','INTRA','NO TAX']
const QC_TYPES = ['QUALITY','NO QC','SKIP QC']

const today = new Date().toISOString().split('T')[0]
const genGRNNo = () => { const yr = new Date().getFullYear(); return `${(yr-1).toString().slice(-2)}-${yr.toString().slice(-2)}/GRN00001` }

const emptyItem = () => ({ itemCode:'', itemName:'', supplierPartNo:'', description:'', hsnCode:'', unit:'', stockQty:'', orderQty:'', qty:'', unitPrice:'', total:'', discPer:'', discAmt:'', finalPrice:'', taxPer:'', netAmt:'' })

const inp = (err='') => `w-full border rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 transition-colors bg-white ${err?'border-red-400 focus:ring-red-300':'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'

export default function GRNEntry() {
  const toast = useToast()
  const [form, setForm] = useState({
    grnType:'GRN Against PO', gateEntryNo:'', supplierName:'', purchaseLedger:'apple tech',
    purchaseType:'CASH', currency:'INR', currencyType:'EXPORT',
    contactPerson:'', contactNo:'', poNo:'', poDate:today, taxType:'INTER', exchangeRate:'',
    grnNo:genGRNNo(), grnDate:today, invoiceNo:'0', invoiceDate:today, qcType:'QUALITY',
    discountType:'Dis_Per',
  })
  const [items, setItems] = useState([emptyItem()])
  const [remarks, setRemarks] = useState('')
  const [currencyTotal, setCurrencyTotal] = useState('')
  const [roundOff, setRoundOff] = useState('')
  const [freightLedger, setFreightLedger] = useState('FREIGHT A/C')
  const [tcsLedger, setTcsLedger] = useState('TCS A/C')

  const setField = (k,v) => setForm(f=>({...f,[k]:v}))

  const setItemField = (idx,k,v) => {
    setItems(rows=>rows.map((r,i)=>{
      if(i!==idx) return r
      const u={...r,[k]:v}
      const q=parseFloat(k==='qty'?v:u.qty)||0
      const p=parseFloat(k==='unitPrice'?v:u.unitPrice)||0
      const tot=q*p; u.total=tot.toFixed(2)
      const dp=parseFloat(k==='discPer'?v:u.discPer)||0
      const da=tot*dp/100; u.discAmt=da.toFixed(2)
      u.finalPrice=(tot-da).toFixed(2)
      const tp=parseFloat(k==='taxPer'?v:u.taxPer)||0
      u.netAmt=((tot-da)*(1+tp/100)).toFixed(2)
      return u
    }))
  }

  const addRow = () => setItems(r=>[...r,emptyItem()])
  const removeRow = idx => setItems(r=>r.filter((_,i)=>i!==idx))

  const subTotal = items.reduce((s,r)=>s+(parseFloat(r.netAmt)||0),0)

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Stores</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">GRN Entry</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Create - GRN Entry</h2>
          <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors">Close</button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-4">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>GRN Type :</label>
                <select value={form.grnType} onChange={e=>setField('grnType',e.target.value)} className={inp()}>{GRN_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Gate Entry No :</label>
                <input value={form.gateEntryNo} onChange={e=>setField('gateEntryNo',e.target.value)} className={`${inp()} flex-1`}/>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[12px] rounded transition-colors shrink-0">Search</button>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Supplier Name:</label>
                <select value={form.supplierName} onChange={e=>setField('supplierName',e.target.value)} className={inp()}><option value="">Select Supplier</option>{SUPPLIERS.map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Purchase Ledger :</label>
                <select value={form.purchaseLedger} onChange={e=>setField('purchaseLedger',e.target.value)} className={inp()}>{PURCHASE_LEDGERS.map(l=><option key={l}>{l}</option>)}</select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Purchase Type :</label>
                <select value={form.purchaseType} onChange={e=>setField('purchaseType',e.target.value)} className={inp()}>{PURCHASE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Currency :</label>
                <select value={form.currency} onChange={e=>setField('currency',e.target.value)} className={`${inp()} w-20`}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select>
                <select value={form.currencyType} onChange={e=>setField('currencyType',e.target.value)} className={`${inp()} w-24`}>{CURRENCY_TYPES.map(c=><option key={c}>{c}</option>)}</select>
              </div>
            </div>
            {/* Col 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Contact Person:</label>
                <input value={form.contactPerson} onChange={e=>setField('contactPerson',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Contact No. :</label>
                <input value={form.contactNo} onChange={e=>setField('contactNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>PO No :</label>
                <input value={form.poNo} onChange={e=>setField('poNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>PO Date :</label>
                <input type="date" value={form.poDate} onChange={e=>setField('poDate',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Tax Type :</label>
                <select value={form.taxType} onChange={e=>setField('taxType',e.target.value)} className={inp()}>{TAX_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Exchange Rate (Rs.):</label>
                <input value={form.exchangeRate} onChange={e=>setField('exchangeRate',e.target.value)} className={inp()}/>
              </div>
            </div>
            {/* Col 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[110px] shrink-0`}>GRN No :</label>
                <input value={form.grnNo} readOnly className={`${inp()} bg-slate-50`}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[110px] shrink-0`}>GRN Date :</label>
                <input type="date" value={form.grnDate} onChange={e=>setField('grnDate',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[110px] shrink-0`}>Invoice No :</label>
                <input value={form.invoiceNo} onChange={e=>setField('invoiceNo',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[110px] shrink-0`}>Invoice Date :</label>
                <input type="date" value={form.invoiceDate} onChange={e=>setField('invoiceDate',e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[110px] shrink-0`}>QC Type :</label>
                <select value={form.qcType} onChange={e=>setField('qcType',e.target.value)} className={inp()}>{QC_TYPES.map(q=><option key={q}>{q}</option>)}</select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[110px] shrink-0`}></label>
                <div className="flex items-center gap-3">
                  {['Dis_Per','Dis_Amt'].map(v=>(
                    <label key={v} className="flex items-center gap-1 text-[12.5px] cursor-pointer">
                      <input type="radio" name="discType" value={v} checked={form.discountType===v} onChange={()=>setField('discountType',v)} className="accent-[#0097A7]"/>
                      {v==='Dis_Per'?'Dis Per':'Dis Amt'}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addRow} className="flex items-center gap-1 px-3 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[12px] font-semibold rounded transition-colors shadow-sm"><Plus className="w-3.5 h-3.5"/> Add Row</button>
                <button onClick={()=>{if(items.length>1)setItems(r=>r.slice(0,-1))}} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm whitespace-nowrap"><Trash2 className="w-3.5 h-3.5"/> Delete Selected Item</button>
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
                    {['Item Code','Item Name','Supplier Part No','Description','HSN Code','Unit','Stock Qty','Order Qty','Qty','Unit Price','Total','Disc %','Disc Amt','Final Price','Tax %','Net Amt'].map(h=>(
                      <th key={h} className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row,idx)=>(
                    <tr key={idx} className={`border-b border-slate-100 ${idx%2===1?'bg-slate-50/50':''}`}>
                      <td className="px-2 py-1 text-center"><input type="checkbox" className="accent-[#0097A7]"/></td>
                      <td className="px-2 py-1 text-center text-slate-500">{idx+1}</td>
                      <td className="px-1 py-1"><input value={row.itemCode} onChange={e=>setItemField(idx,'itemCode',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.itemName} onChange={e=>setItemField(idx,'itemName',e.target.value)} className={`${inp()} min-w-[120px]`}/></td>
                      <td className="px-1 py-1"><input value={row.supplierPartNo} onChange={e=>setItemField(idx,'supplierPartNo',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.description} onChange={e=>setItemField(idx,'description',e.target.value)} className={`${inp()} min-w-[100px]`}/></td>
                      <td className="px-1 py-1"><input value={row.hsnCode} onChange={e=>setItemField(idx,'hsnCode',e.target.value)} className={inp()}/></td>
                      <td className="px-1 py-1"><input value={row.unit} onChange={e=>setItemField(idx,'unit',e.target.value)} className={`${inp()} w-14`}/></td>
                      <td className="px-1 py-1"><input value={row.stockQty} onChange={e=>setItemField(idx,'stockQty',e.target.value)} className={`${inp()} w-16`}/></td>
                      <td className="px-1 py-1"><input value={row.orderQty} onChange={e=>setItemField(idx,'orderQty',e.target.value)} className={`${inp()} w-16`}/></td>
                      <td className="px-1 py-1"><input value={row.qty} onChange={e=>setItemField(idx,'qty',e.target.value)} className={`${inp()} w-14`}/></td>
                      <td className="px-1 py-1"><input value={row.unitPrice} onChange={e=>setItemField(idx,'unitPrice',e.target.value)} className={`${inp()} w-18`}/></td>
                      <td className="px-1 py-1"><input value={row.total} readOnly className={`${inp()} bg-slate-50 w-18`}/></td>
                      <td className="px-1 py-1"><input value={row.discPer} onChange={e=>setItemField(idx,'discPer',e.target.value)} className={`${inp()} w-14`}/></td>
                      <td className="px-1 py-1"><input value={row.discAmt} readOnly className={`${inp()} bg-slate-50 w-16`}/></td>
                      <td className="px-1 py-1"><input value={row.finalPrice} readOnly className={`${inp()} bg-slate-50 w-18`}/></td>
                      <td className="px-1 py-1"><input value={row.taxPer} onChange={e=>setItemField(idx,'taxPer',e.target.value)} className={`${inp()} w-14`}/></td>
                      <td className="px-1 py-1"><input value={row.netAmt} readOnly className={`${inp()} bg-slate-50 w-18`}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom: Remarks + Ledgers + Totals */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-[90px] shrink-0 pt-1`}>Remark's :</label>
                <textarea rows={3} value={remarks} onChange={e=>setRemarks(e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none bg-white"/>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Currency Total :</label>
                <input value={currencyTotal} onChange={e=>setCurrencyTotal(e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Round off :</label>
                <input value={roundOff} onChange={e=>setRoundOff(e.target.value)} className={inp()}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Freight Ledger :</label>
                <select value={freightLedger} onChange={e=>setFreightLedger(e.target.value)} className={inp()}><option>FREIGHT A/C</option></select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>TCS Ledger :</label>
                <select value={tcsLedger} onChange={e=>setTcsLedger(e.target.value)} className={inp()}><option>TCS A/C</option></select>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={()=>toast.success('GRN Entry submitted!')} className="flex items-center gap-1 px-5 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors shadow-sm"><Send className="w-3.5 h-3.5"/> Submit</button>
                <button className="flex items-center gap-1 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm"><X className="w-3.5 h-3.5"/> Cancel</button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><label className={`${lbl} w-[90px] shrink-0`}>Sub Total :</label><input value={subTotal.toFixed(2)} readOnly className={`${inp()} bg-slate-50`}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-[90px] shrink-0`}>GST Amt :</label><input readOnly className={`${inp()} bg-slate-50`}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-[90px] shrink-0`}>IGST Amt :</label><input readOnly className={`${inp()} bg-slate-50`}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-[90px] shrink-0`}>Others :</label><input readOnly className={`${inp()} bg-slate-50`}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-[90px] shrink-0`}>OGSTAmt :</label><input readOnly className={`${inp()} bg-slate-50`}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-[90px] shrink-0`}>TCS % :</label><input readOnly className={`${inp()} bg-slate-50`}/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
