import { useState } from 'react'
import { ChevronRight, Plus, Trash2, Send, X } from 'lucide-react'

const SUPPLIERS = [
  'VENKATESWARA ASSOCIATES','M/S VELSON INHOUSE PRODUCTION','AJAY KUMAR',
  'ABHISHEK SONI','APS ENTERPRISES','SM DRILLING COMPANY',
  'APC DRILLING AND CONSTRUCTION PVT LTD',
]
const PO_TYPES = ['Purchase Order','Purchase Return','Job Work']

const today = new Date().toISOString().split('T')[0]
const genPONum = () => {
  const yr = new Date().getFullYear()
  const short = `${(yr-1).toString().slice(-2)}-${yr.toString().slice(-2)}`
  return `${short}/PO00001`
}

const emptyItem = () => ({
  itemCode:'', purchaseReqNo:'', supplierPartNo:'', itemName:'', description:'',
  hsnCode:'', uom:'', qty:'', unitPrice:'', discPer:'', discAmt:'',
  amount:'', gstPer:'', gstAmt:'', netAmt:'',
})

const inp = (err='') =>
  `w-full border rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 transition-colors bg-white ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'

export default function PurchaseOrderEntry() {
  const [form, setForm] = useState({
    supplierName: '', supplierAddress: '', contactPerson: '', contactNumber: '',
    createdBy: '', gstNo: '', supplierRefNumber: '', showTotalsGrid: false,
    poNumber: genPONum(), poDate: today, etaDate: today, poType: 'Purchase Order',
    discountType: 'Dis_Per',
  })
  const [items, setItems] = useState([emptyItem()])

  // Bottom fields
  const [freight, setFreight] = useState('')
  const [destination, setDestination] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [testReport, setTestReport] = useState('')
  const [project, setProject] = useState('')
  const [remarks, setRemarks] = useState('')
  const [modeOfDespatch, setModeOfDespatch] = useState('')
  const [deliveryPeriod, setDeliveryPeriod] = useState('')
  const [taxTerms, setTaxTerms] = useState('')
  const [warrantyTerms, setWarrantyTerms] = useState('')
  const [discountTerms, setDiscountTerms] = useState('')

  // Tax fields
  const [othersPer, setOthersPer] = useState('0')
  const [othersAmt, setOthersAmt] = useState('0')
  const [cgstPer, setCgstPer] = useState('0')
  const [cgstAmt, setCgstAmt] = useState('0')
  const [sgstPer, setSgstPer] = useState('0')
  const [sgstAmt, setSgstAmt] = useState('0')
  const [igstPer, setIgstPer] = useState('0')
  const [igstAmt, setIgstAmt] = useState('0')

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSupplierChange = name => {
    const addr = name ? '123, Industrial Area, City\nDistrict, State - 000000' : ''
    setForm(f => ({ ...f, supplierName: name, supplierAddress: addr }))
  }

  const setItemField = (idx, k, v) => {
    setItems(rows => rows.map((r, i) => {
      if (i !== idx) return r
      const updated = { ...r, [k]: v }
      const q = parseFloat(k === 'qty' ? v : updated.qty) || 0
      const p = parseFloat(k === 'unitPrice' ? v : updated.unitPrice) || 0
      const rawAmt = q * p
      const dp = parseFloat(k === 'discPer' ? v : updated.discPer) || 0
      const da = rawAmt * dp / 100
      updated.discAmt = da.toFixed(2)
      updated.amount = (rawAmt - da).toFixed(2)
      const gp = parseFloat(k === 'gstPer' ? v : updated.gstPer) || 0
      const ga = (rawAmt - da) * gp / 100
      updated.gstAmt = ga.toFixed(2)
      updated.netAmt = (rawAmt - da + ga).toFixed(2)
      return updated
    }))
  }

  const addRow = () => setItems(r => [...r, emptyItem()])
  const removeRow = idx => setItems(r => r.filter((_, i) => i !== idx))

  const subTotal = items.reduce((s, r) => s + (parseFloat(r.netAmt) || 0), 0)
  const grandTotal = subTotal +
    (parseFloat(othersAmt) || 0) +
    (parseFloat(cgstAmt) || 0) +
    (parseFloat(sgstAmt) || 0) +
    (parseFloat(igstAmt) || 0)

  const handleSubmit = () => alert('Purchase Order submitted!')
  const handleCancel = () => {
    setForm({
      supplierName:'', supplierAddress:'', contactPerson:'', contactNumber:'',
      createdBy:'', gstNo:'', supplierRefNumber:'', showTotalsGrid:false,
      poNumber:genPONum(), poDate:today, etaDate:today, poType:'Purchase Order',
      discountType:'Dis_Per',
    })
    setItems([emptyItem()])
  }

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Purchase</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Purchase Order Entry</span>
      </div>

      {/* Main form card */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Create - Purchase Order Entry</h2>
          <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors">Draft</button>
        </div>

        <div className="p-4 space-y-3">
          {/* Row 1: 3-column layout */}
          <div className="grid grid-cols-3 gap-4">

            {/* Column 1 — Supplier Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[140px] shrink-0`}>Supplier Name:</label>
                <select value={form.supplierName} onChange={e => handleSupplierChange(e.target.value)} className={inp()}>
                  <option value="">Select Supplier</option>
                  {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-[140px] shrink-0 pt-1`}>Supplier Address:</label>
                <textarea rows={3} value={form.supplierAddress} onChange={e => setField('supplierAddress', e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[140px] shrink-0`}>Supplier Ref. Number:</label>
                <input value={form.supplierRefNumber} onChange={e => setField('supplierRefNumber', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[140px] shrink-0`}>Show Totals Grid:</label>
                <input type="checkbox" checked={form.showTotalsGrid} onChange={e => setField('showTotalsGrid', e.target.checked)} className="w-4 h-4 accent-[#0097A7]" />
                <span className="text-[12px] text-slate-500">Show Totals Grid</span>
              </div>
            </div>

            {/* Column 2 — Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Contact Person:</label>
                <input value={form.contactPerson} onChange={e => setField('contactPerson', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Contact No. :</label>
                <input value={form.contactNumber} onChange={e => setField('contactNumber', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Created By :</label>
                <input value={form.createdBy} onChange={e => setField('createdBy', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>GST NO. :</label>
                <input value={form.gstNo} onChange={e => setField('gstNo', e.target.value)} className={inp()} />
              </div>
              {/* Discount type radio */}
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}></label>
                <div className="flex items-center gap-3">
                  {['Dis_Per','Dis_Amt'].map(v => (
                    <label key={v} className="flex items-center gap-1 text-[12.5px] cursor-pointer">
                      <input type="radio" name="discountType" value={v} checked={form.discountType===v} onChange={() => setField('discountType', v)} className="accent-[#0097A7]" />
                      {v === 'Dis_Per' ? 'Dis. Per' : 'Dis. Amt'}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Column Visibility:</label>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[12px] rounded transition-colors whitespace-nowrap">Select Columns (All Visible) ▼</button>
              </div>
            </div>

            {/* Column 3 — PO Info + Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[100px] shrink-0`}>PO Number:</label>
                <input value={form.poNumber} readOnly className={`${inp()} bg-slate-50`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[100px] shrink-0`}>PO Date:</label>
                <input type="date" value={form.poDate} onChange={e => setField('poDate', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[100px] shrink-0`}>ETA Date :</label>
                <input type="date" value={form.etaDate} onChange={e => setField('etaDate', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[100px] shrink-0`}>PO Type :</label>
                <select value={form.poType} onChange={e => setField('poType', e.target.value)} className={inp()}>
                  {PO_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 pt-1 flex-wrap">
                <button className="px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors shadow-sm whitespace-nowrap">Pick From Request</button>
                <button onClick={addRow} className="flex items-center gap-1 px-3 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <Plus className="w-3.5 h-3.5"/> Add Row
                </button>
                <button onClick={() => { if(items.length>1) setItems(r => r.slice(0,-1)) }} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm whitespace-nowrap">
                  <Trash2 className="w-3.5 h-3.5"/> Delete Selected Item
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
                    {['Item Code','Purchase Req No','Supplier Part No','Item Name','Description','HSN Code','UOM','Qty','Unit Price','Disc %','Disc Amt','Amount','GST %','GST Amt','Net Amt','Action'].map(h => (
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
                      <td className="px-1 py-1"><input value={row.purchaseReqNo} onChange={e=>setItemField(idx,'purchaseReqNo',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.supplierPartNo} onChange={e=>setItemField(idx,'supplierPartNo',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.itemName} onChange={e=>setItemField(idx,'itemName',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.description} onChange={e=>setItemField(idx,'description',e.target.value)} className={`${inp()} min-w-[120px]`} /></td>
                      <td className="px-1 py-1"><input value={row.hsnCode} onChange={e=>setItemField(idx,'hsnCode',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.uom} onChange={e=>setItemField(idx,'uom',e.target.value)} className={`${inp()} w-14`} /></td>
                      <td className="px-1 py-1"><input value={row.qty} onChange={e=>setItemField(idx,'qty',e.target.value)} className={`${inp()} w-14`} /></td>
                      <td className="px-1 py-1"><input value={row.unitPrice} onChange={e=>setItemField(idx,'unitPrice',e.target.value)} className={`${inp()} w-20`} /></td>
                      <td className="px-1 py-1"><input value={row.discPer} onChange={e=>setItemField(idx,'discPer',e.target.value)} className={`${inp()} w-14`} /></td>
                      <td className="px-1 py-1"><input value={row.discAmt} readOnly className={`${inp()} bg-slate-50 w-16`} /></td>
                      <td className="px-1 py-1"><input value={row.amount} readOnly className={`${inp()} bg-slate-50 w-20`} /></td>
                      <td className="px-1 py-1"><input value={row.gstPer} onChange={e=>setItemField(idx,'gstPer',e.target.value)} className={`${inp()} w-14`} /></td>
                      <td className="px-1 py-1"><input value={row.gstAmt} readOnly className={`${inp()} bg-slate-50 w-16`} /></td>
                      <td className="px-1 py-1"><input value={row.netAmt} readOnly className={`${inp()} bg-slate-50 w-20`} /></td>
                      <td className="px-2 py-1 text-center">
                        <button onClick={() => removeRow(idx)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] rounded transition-colors">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom section: 3 columns */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {/* Left column: Freight, Destination, Payment Terms, Test Report, Project, Remarks */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Freight :</label>
                <input value={freight} onChange={e => setFreight(e.target.value)} placeholder="Select or Enter Freight Terms" className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Destination :</label>
                <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Select or Enter Destination" className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Payment Terms :</label>
                <input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} placeholder="Select or Enter Payment Terms" className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Test Report :</label>
                <input value={testReport} onChange={e => setTestReport(e.target.value)} placeholder="Select or Enter Special Instruction" className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Project :</label>
                <input value={project} onChange={e => setProject(e.target.value)} placeholder="Select or Enter Project" className={inp()} />
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-[120px] shrink-0 pt-1`}>Remark's :</label>
                <textarea rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none bg-white" />
              </div>
            </div>

            {/* Middle column: Mode of Despatch, Delivery Period, Tax Terms, Warranty Terms, Discount Terms + Submit/Cancel */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Mode Of Despatch :</label>
                <input value={modeOfDespatch} onChange={e => setModeOfDespatch(e.target.value)} placeholder="Select or Enter Mode Of Despatch" className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Delivery Period:</label>
                <input value={deliveryPeriod} onChange={e => setDeliveryPeriod(e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Tax Terms :</label>
                <input value={taxTerms} onChange={e => setTaxTerms(e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Warranty Terms :</label>
                <input value={warrantyTerms} onChange={e => setWarrantyTerms(e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Discount Terms :</label>
                <input value={discountTerms} onChange={e => setDiscountTerms(e.target.value)} className={inp()} />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} className="flex items-center gap-1 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <Send className="w-3.5 h-3.5"/> Submit
                </button>
                <button onClick={handleCancel} className="flex items-center gap-1 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
                  <X className="w-3.5 h-3.5"/> Cancel
                </button>
              </div>
            </div>

            {/* Right column: Totals / Tax */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[80px] shrink-0`}>Sub Total :</label>
                <span className="text-[13px] font-semibold text-slate-700 ml-auto">{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[80px] shrink-0`}>Others :</label>
                <span className="text-[12px] text-slate-500 ml-auto">%</span>
                <input value={othersPer} onChange={e => setOthersPer(e.target.value)} className={`${inp()} w-14`} />
                <input value={othersAmt} onChange={e => setOthersAmt(e.target.value)} className={`${inp()} w-20`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[80px] shrink-0`}>CGST :</label>
                <span className="text-[12px] text-slate-500 ml-auto">%</span>
                <input value={cgstPer} onChange={e => setCgstPer(e.target.value)} className={`${inp()} w-14`} />
                <input value={cgstAmt} onChange={e => setCgstAmt(e.target.value)} className={`${inp()} w-20`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[80px] shrink-0`}>SGST :</label>
                <span className="text-[12px] text-slate-500 ml-auto">%</span>
                <input value={sgstPer} onChange={e => setSgstPer(e.target.value)} className={`${inp()} w-14`} />
                <input value={sgstAmt} onChange={e => setSgstAmt(e.target.value)} className={`${inp()} w-20`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[80px] shrink-0`}>IGST :</label>
                <span className="text-[12px] text-slate-500 ml-auto">%</span>
                <input value={igstPer} onChange={e => setIgstPer(e.target.value)} className={`${inp()} w-14`} />
                <input value={igstAmt} onChange={e => setIgstAmt(e.target.value)} className={`${inp()} w-20`} />
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200 pt-2 mt-1">
                <label className="text-[13px] font-bold text-slate-700">Grand Total :</label>
                <span className="text-[14px] font-bold text-[#0097A7] ml-auto">{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
