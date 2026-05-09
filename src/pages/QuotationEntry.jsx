import { useState } from 'react'
import { ChevronRight, Plus, Trash2, Send, X, RefreshCw } from 'lucide-react'
import { useToast } from '../components/Toast'

const CUSTOMERS = [
  'VENKATESWARA ASSOCIATES','M/S VELSON INHOUSE PRODUCTION','AJAY KUMAR',
  'ABHISHEK SONI','APS ENTERPRISES','SM DRILLING COMPANY',
  'APC DRILLING AND CONSTRUCTION PVT LTD',
]
const MODELS = ['V10','V20','V30','Consumables','VELSON TYPE','HM Series']
const QUOTATION_TYPES = ['Supply','Service','Supply & Service']
const TAX_TYPES = ['GST','IGST','No Tax']
const CURRENCY_TYPES = ['INR','USD','EUR','GBP']
const TAX_PERCENT = ['0','5','12','18','28']

const today = new Date().toISOString().split('T')[0]
const genQuotNum = () => {
  const yr = new Date().getFullYear()
  const short = `${(yr-1).toString().slice(-2)}-${yr.toString().slice(-2)}`
  return `${short}/Q00001`
}

const emptyItem = () => ({ itemCode:'', itemName:'', description:'', hsnCode:'', uom:'', qty:'', unitPrice:'', amount:'' })

const inp = (err='') =>
  `w-full border rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 transition-colors bg-white ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'

export default function QuotationEntry() {
  const toast = useToast()
  const [form, setForm] = useState({
    customerName: '', customerAddress: '', contactPerson: '', contactNumber: '',
    gstNumber: '', customerRef: '', currencyType: 'INR', exRate: '0',
    showTotalsGrid: false, model: '', quotationNumber: genQuotNum(),
    quotationDate: today, validityUntil: '', revisionNumber: '0',
    quotationType: '', taxType: '', discountType: 'Dis_Per',
  })
  const [items, setItems] = useState([emptyItem()])
  const [specialDiscount, setSpecialDiscount] = useState('')
  const [freightAmount, setFreightAmount] = useState('')
  const [taxPercent, setTaxPercent] = useState('18')
  const [packingForwarding, setPackingForwarding] = useState('')
  const [paymentTerms, setPaymentTerms] = useState(
    '1. Add GST 18% Applicable Extra\n2. Product: Raw Materials,Machining & Hardening all are at your scope\n3.Inspection: At Your End\n4.If Any dimension MisMatch Or Rejection Found By Quality Control,debit Will Be Raised Against the Invoice and Material sent Back'
  )
  const [uploadFile, setUploadFile] = useState(null)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCustomerChange = name => {
    const addr = name ? '123, Industrial Area, City' : ''
    setForm(f => ({ ...f, customerName: name, customerAddress: addr }))
  }

  const setItemField = (idx, k, v) => {
    setItems(rows => rows.map((r, i) => {
      if (i !== idx) return r
      const updated = { ...r, [k]: v }
      if (k === 'qty' || k === 'unitPrice') {
        const q = parseFloat(k === 'qty' ? v : updated.qty) || 0
        const p = parseFloat(k === 'unitPrice' ? v : updated.unitPrice) || 0
        updated.amount = (q * p).toFixed(2)
      }
      return updated
    }))
  }

  const addRow = () => setItems(r => [...r, emptyItem()])
  const removeRow = idx => setItems(r => r.filter((_, i) => i !== idx))

  const subTotal = items.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)
  const specDisc = parseFloat(specialDiscount) || 0
  const freight  = parseFloat(freightAmount) || 0
  const pack     = parseFloat(packingForwarding) || 0
  const afterDisc = subTotal - specDisc
  const taxAmt   = afterDisc * (parseFloat(taxPercent) || 0) / 100
  const totalAmt = afterDisc + taxAmt + freight + pack

  const handleSubmit = () => toast.success('Quotation submitted!')
  const handleCancel = () => {
    setForm({ customerName:'', customerAddress:'', contactPerson:'', contactNumber:'', gstNumber:'', customerRef:'', currencyType:'INR', exRate:'0', showTotalsGrid:false, model:'', quotationNumber:genQuotNum(), quotationDate:today, validityUntil:'', revisionNumber:'0', quotationType:'', taxType:'', discountType:'Dis_Per' })
    setItems([emptyItem()])
    setSpecialDiscount('')
    setFreightAmount('')
    setPackingForwarding('')
  }

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Quotation</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Quotation Entry</span>
      </div>

      {/* Main form card */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Quotation Entry</h2>
          <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors">Draft</button>
        </div>

        <div className="p-4 space-y-3">
          {/* Row 1: Customer | Contact | Quotation Number — all labels w-[130px] for uniform input alignment */}
          <div className="grid grid-cols-3 gap-4">

            {/* Column 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Customer Name:</label>
                <select value={form.customerName} onChange={e => handleCustomerChange(e.target.value)} className={inp()}>
                  <option value="">Select Customer</option>
                  {CUSTOMERS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-[130px] shrink-0 pt-1`}>Customer Address:</label>
                <div className="flex-1 space-y-1">
                  <input value={form.customerAddress} onChange={e => setField('customerAddress', e.target.value)} className={inp()} />
                  <input className={inp()} />
                  <input className={inp()} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Customer Ref. Number:</label>
                <input value={form.customerRef} onChange={e => setField('customerRef', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Currency/Exc Rate:</label>
                <select value={form.currencyType} onChange={e => setField('currencyType', e.target.value)} className={inp()}>
                  {CURRENCY_TYPES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Show Totals Grid:</label>
                <input type="checkbox" checked={form.showTotalsGrid} onChange={e => setField('showTotalsGrid', e.target.checked)} className="w-4 h-4 accent-[#0097A7]" />
                <span className="text-[12px] text-slate-500">Show Totals Grid</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Contact Person:</label>
                <input value={form.contactPerson} onChange={e => setField('contactPerson', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Contact Number:</label>
                <input value={form.contactNumber} onChange={e => setField('contactNumber', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Validity Until:</label>
                <input type="date" value={form.validityUntil} onChange={e => setField('validityUntil', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>GST Number:</label>
                <input value={form.gstNumber} onChange={e => setField('gstNumber', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Model:</label>
                <select value={form.model} onChange={e => setField('model', e.target.value)} className={inp()}>
                  <option value="">Select Model</option>
                  {MODELS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Ex.Rate:</label>
                <input value={form.exRate} onChange={e => setField('exRate', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Column Visibility:</label>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[12px] rounded transition-colors whitespace-nowrap">Select Columns (All Visible) ▼</button>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Quotation Number:</label>
                <input value={form.quotationNumber} readOnly className={`${inp()} bg-slate-50`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Quotation Date:</label>
                <input type="date" value={form.quotationDate} onChange={e => setField('quotationDate', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Revision Number:</label>
                <input value={form.revisionNumber} readOnly className={`${inp()} bg-slate-50 w-16 shrink-0`} />
                <button className="px-2 py-1 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] rounded transition-colors whitespace-nowrap">Revision No</button>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Quotation Type:</label>
                <select value={form.quotationType} onChange={e => setField('quotationType', e.target.value)} className={inp()}>
                  <option value="">Select Quotation Type</option>
                  {QUOTATION_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Tax Type:</label>
                <select value={form.taxType} onChange={e => setField('taxType', e.target.value)} className={inp()}>
                  <option value="">Select Tax Type</option>
                  {TAX_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Discount Type:</label>
                <div className="flex items-center gap-3">
                  {['Dis_Per','Dis_Amt'].map(v => (
                    <label key={v} className="flex items-center gap-1 text-[12.5px] cursor-pointer">
                      <input type="radio" name="discountType" value={v} checked={form.discountType===v} onChange={() => setField('discountType', v)} className="accent-[#0097A7]" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button onClick={addRow} className="flex items-center gap-1 px-3 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <Plus className="w-3.5 h-3.5"/> Add Row
                </button>
                <button onClick={() => { if(items.length>1) setItems(r => r.slice(0,-1)) }} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <Trash2 className="w-3.5 h-3.5"/> Delete Selected Item
                </button>
                <button onClick={handleSubmit} className="flex items-center gap-1 px-3 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <Send className="w-3.5 h-3.5"/> Submit
                </button>
                <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <X className="w-3.5 h-3.5"/> Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Items grid */}
          <div className="mt-2">
            <div className="bg-slate-700 px-3 py-1.5 rounded-t">
              <h3 className="text-white text-[13px] font-semibold">Items</h3>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-b">
              <table className="min-w-full text-[12.5px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase w-8"><input type="checkbox" className="accent-[#0097A7]"/></th>
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase w-8">#</th>
                    {['Item Code','Item Name','Description','HSN Code','UOM','Qty','Unit Price','Amount','Action'].map(h => (
                      <th key={h} className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, idx) => (
                    <tr key={idx} className={`border-b border-slate-100 ${idx%2===1?'bg-slate-50/50':''}`}>
                      <td className="px-2 py-1 text-center"><input type="checkbox" className="accent-[#0097A7]"/></td>
                      <td className="px-2 py-1 text-center text-slate-500">{idx+1}</td>
                      <td className="px-1 py-1"><input value={row.itemCode} onChange={e=>setItemField(idx,'itemCode',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.itemName} onChange={e=>setItemField(idx,'itemName',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.description} onChange={e=>setItemField(idx,'description',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.hsnCode} onChange={e=>setItemField(idx,'hsnCode',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.uom} onChange={e=>setItemField(idx,'uom',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.qty} onChange={e=>setItemField(idx,'qty',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.unitPrice} onChange={e=>setItemField(idx,'unitPrice',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.amount} readOnly className={`${inp()} bg-slate-50`} /></td>
                      <td className="px-2 py-1 text-center">
                        <button onClick={() => removeRow(idx)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] rounded transition-colors">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom section */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Left: upload + payment terms */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}>Upload Document Name:</label>
                <input type="file" onChange={e => setUploadFile(e.target.files[0])} className="text-[12px] text-slate-600 border border-slate-300 rounded px-2 py-1 w-full" />
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-36 shrink-0 pt-1`}>Payment Terms:</label>
                <textarea rows={5} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none" />
              </div>
            </div>

            {/* Right: totals */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}>Special Discount:</label>
                <input value={specialDiscount} onChange={e => setSpecialDiscount(e.target.value)} className={`${inp()} !w-[150px] flex-none`} />
                <span className="text-[12px] text-slate-500 ml-auto">Sub Total:</span>
                <span className="text-[13px] font-semibold text-slate-700 w-24 text-right">{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}>Freight Amount:</label>
                <input value={freightAmount} onChange={e => setFreightAmount(e.target.value)} className={`${inp()} !w-[150px] flex-none`} />
                <span className="text-[12px] text-slate-500 ml-auto">Total After Discount:</span>
                <span className="text-[13px] font-semibold text-slate-700 w-24 text-right">{afterDisc.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}>Tax (%):</label>
                <select value={taxPercent} onChange={e => setTaxPercent(e.target.value)} className={`${inp()} !w-[150px] flex-none`}>
                  {TAX_PERCENT.map(t => <option key={t}>{t}</option>)}
                </select>
                <span className="text-[12px] text-slate-500 ml-auto">Packing &amp; Forwarding:</span>
                <input value={packingForwarding} onChange={e => setPackingForwarding(e.target.value)} className={`${inp()} !w-[100px] flex-none`} />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[12px] text-slate-500">Total Amount:</span>
                <span className="text-[14px] font-bold text-[#0097A7] w-24 text-right">{totalAmt.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* GST Summary row */}
          <div className="grid grid-cols-4 gap-4 border-t border-slate-200 pt-3 mt-2">
            {[['GST Amount', (taxAmt/2).toFixed(2)],['IGST Amount', '0.00'],['G.T. Before RoundOff', totalAmt.toFixed(2)],['Grand Total', totalAmt.toFixed(2)]].map(([label, val]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-slate-600">{label}:</span>
                <span className="text-[13px] font-bold text-slate-800">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
