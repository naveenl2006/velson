import { useState } from 'react'
import { ChevronRight, Plus, Trash2, Send, X } from 'lucide-react'
import { useToast } from '../components/Toast'

const DEPARTMENTS = ['Production','Quality','Stores','Maintenance','HR','Admin']
const TEAMS = ['Team A','Team B','Team C','Team D']
const REQUESTING_FOR = ['Production Use','Testing','Repair','Maintenance','Sample']

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]
const genReqNo = () => {
  const yr = new Date().getFullYear()
  const short = `${(yr-1).toString().slice(-2)}-${yr.toString().slice(-2)}`
  return `${short}/MQ00001`
}

const emptyItem = () => ({
  modelName:'', itemCode:'', itemName:'', requestedQty:'', materialGrade:'', unit:'', remarks:'',
})

const inp = (err='') =>
  `w-full border rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 transition-colors bg-white ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'

export default function MaterialRequestEntry() {
  const toast = useToast()
  const [form, setForm] = useState({
    tempRequestNo: '', departmentTo: '', requestingUser: 'superadmin',
    team: '', requestingFor: '', requestNo: genReqNo(),
    requestDate: today, requiredDate: tomorrow, requiredDays: '',
    storeName: 'STORE : MAINSTORE', bomPartName: '',
  })
  const [items, setItems] = useState([emptyItem()])
  const [remarks, setRemarks] = useState('')

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const setItemField = (idx, k, v) => {
    setItems(rows => rows.map((r, i) => i !== idx ? r : { ...r, [k]: v }))
  }

  const addRow = () => setItems(r => [...r, emptyItem()])
  const removeRow = idx => setItems(r => r.filter((_, i) => i !== idx))

  const handleSubmit = () => toast.success('Material Request submitted!')
  const handleCancel = () => {
    setForm({
      tempRequestNo:'', departmentTo:'', requestingUser:'superadmin',
      team:'', requestingFor:'', requestNo:genReqNo(),
      requestDate:today, requiredDate:tomorrow, requiredDays:'',
      storeName:'STORE : MAINSTORE', bomPartName:'',
    })
    setItems([emptyItem()])
    setRemarks('')
  }

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Stores</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Material Request</span>
      </div>

      {/* Main form card */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Create - Material Request Entry</h2>
          <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors">Close</button>
        </div>

        <div className="p-4 space-y-3">
          {/* 3-column header */}
          <div className="grid grid-cols-3 gap-4">

            {/* Column 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Temp Request No :</label>
                <input value={form.tempRequestNo} onChange={e => setField('tempRequestNo', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Department To :</label>
                <select value={form.departmentTo} onChange={e => setField('departmentTo', e.target.value)} className={inp()}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Requesting User :</label>
                <input value={form.requestingUser} readOnly className={`${inp()} bg-slate-50`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Team :</label>
                <select value={form.team} onChange={e => setField('team', e.target.value)} className={inp()}>
                  <option value="">Select Team</option>
                  {TEAMS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[130px] shrink-0`}>Requesting For :</label>
                <select value={form.requestingFor} onChange={e => setField('requestingFor', e.target.value)} className={inp()}>
                  <option value="">Select Requesting For</option>
                  {REQUESTING_FOR.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Request No :</label>
                <input value={form.requestNo} readOnly className={`${inp()} bg-slate-50`} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Request Date :</label>
                <input type="date" value={form.requestDate} onChange={e => setField('requestDate', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Required Date :</label>
                <input type="date" value={form.requiredDate} onChange={e => setField('requiredDate', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Required Day's :</label>
                <input value={form.requiredDays} onChange={e => setField('requiredDays', e.target.value)} className={inp()} />
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>Store Name :</label>
                <input value={form.storeName} readOnly className={`${inp()} bg-slate-50`} />
              </div>
            </div>

            {/* Column 3 — BOM + Image + buttons */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-[120px] shrink-0`}>BOM Part Name :</label>
                <select value={form.bomPartName} onChange={e => setField('bomPartName', e.target.value)} className={inp()}>
                  <option value="">Select BOM Part Name</option>
                </select>
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-[120px] shrink-0 pt-1`}>Part Image :</label>
                <div className="flex-1 h-[60px] border border-slate-200 rounded bg-slate-50 flex items-center justify-center text-[11px] text-slate-400">
                  Item Image
                </div>
              </div>
              <div className="flex gap-2 pt-1">
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
                    {['Model Name','Item Code','Item Name','Requested Qty','Material Grade','Unit','Remarks','Action'].map(h => (
                      <th key={h} className="px-2 py-1.5 text-center font-bold text-slate-600 text-[11px] uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, idx) => (
                    <tr key={idx} className={`border-b border-slate-100 ${idx%2===1?'bg-slate-50/50':''}`}>
                      <td className="px-2 py-1 text-center"><input type="checkbox" className="accent-[#0097A7]"/></td>
                      <td className="px-2 py-1 text-center text-slate-500">{idx+1}</td>
                      <td className="px-1 py-1"><input value={row.modelName} onChange={e=>setItemField(idx,'modelName',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.itemCode} onChange={e=>setItemField(idx,'itemCode',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.itemName} onChange={e=>setItemField(idx,'itemName',e.target.value)} className={`${inp()} min-w-[150px]`} /></td>
                      <td className="px-1 py-1"><input value={row.requestedQty} onChange={e=>setItemField(idx,'requestedQty',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.materialGrade} onChange={e=>setItemField(idx,'materialGrade',e.target.value)} className={inp()} /></td>
                      <td className="px-1 py-1"><input value={row.unit} onChange={e=>setItemField(idx,'unit',e.target.value)} className={`${inp()} w-16`} /></td>
                      <td className="px-1 py-1"><input value={row.remarks} onChange={e=>setItemField(idx,'remarks',e.target.value)} className={inp()} /></td>
                      <td className="px-2 py-1 text-center">
                        <button onClick={() => removeRow(idx)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] rounded transition-colors">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks + Submit/Cancel */}
          <div className="flex items-start gap-4 pt-2">
            <label className={`${lbl} w-[100px] shrink-0 pt-1`}>Remark's :</label>
            <textarea rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} className="flex-1 border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] resize-none bg-white" />
          </div>
          <div className="flex gap-2 justify-center pt-1">
            <button onClick={handleSubmit} className="flex items-center gap-1 px-5 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
              <Send className="w-3.5 h-3.5"/> Submit
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold rounded transition-colors shadow-sm">
              <X className="w-3.5 h-3.5"/> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
