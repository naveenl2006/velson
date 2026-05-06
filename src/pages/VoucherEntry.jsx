import { useState, useEffect } from 'react'
import { ChevronRight, Save, X, RotateCcw, Trash2, Plus, CreditCard, Banknote, Receipt, Calculator, Layers } from 'lucide-react'

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
    className={`w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 pr-10 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
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

const emptyRow = () => ({ 
  id: Date.now() + Math.random(),
  ledger: '', narration: '', amt: '' 
})

export default function VoucherEntry() {
  const [form, setForm] = useState({
    tempVoucher: 'TV-' + Math.floor(Math.random() * 900 + 100),
    voucherType: '',
    voucherDate: new Date().toISOString().split('T')[0],
    accountType: '',
    autoNo: Math.floor(Math.random() * 1000 + 1),
    voucherNo: '',
    voucherSection: '',
    details: ''
  })

  const [rows, setRows] = useState([emptyRow()])
  const [isSaving, setIsSaving] = useState(false)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  
  const setRowField = (idx, k, v) => {
    const next = rows.map((r, i) => i === idx ? { ...r, [k]: v } : r)
    setRows(next)
  }

  const addRow = () => setRows([...rows, emptyRow()])
  const removeRow = (id) => setRows(rows.filter(r => r.id !== id))

  const handleSave = () => {
    if (!form.voucherType || rows.every(r => !r.amt)) {
      alert('Required: Voucher Type and Line Amount.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const voucher = { ...form, rows, id: Date.now() }
      const existing = JSON.parse(localStorage.getItem('velson_vouchers') || '[]')
      localStorage.setItem('velson_vouchers', JSON.stringify([...existing, voucher]))
      setIsSaving(false)
      alert('Omni-Voucher Saved Successfully.')
      handleCancel()
    }, 800)
  }

  const handleCancel = () => {
    setForm({
      tempVoucher: 'TV-' + Math.floor(Math.random() * 900 + 100),
      voucherType: '',
      voucherDate: new Date().toISOString().split('T')[0],
      accountType: '',
      autoNo: Math.floor(Math.random() * 1000 + 1),
      voucherNo: '',
      voucherSection: '',
      details: ''
    })
    setRows([emptyRow()])
  }

  const totalAmt = rows.reduce((acc, r) => acc + (parseFloat(r.amt) || 0), 0).toFixed(2)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Voucher Control Hub</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-slate-700 rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Multi-Protocol Voucher Entry</h2>
            </div>
            <div className="flex gap-3">
               <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Buffer Ref</span>
                  <span className="text-[13px] font-black text-slate-800">{form.tempVoucher}</span>
               </div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close Console
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Primary Voucher Logic */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Layers size={150} />
               </div>

               <div className="col-span-8 space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">VC</div>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Voucher Configuration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label required>Voucher Category</Label>
                           <Select options={['CONTRA', 'JOURNAL', 'PAYMENT', 'RECEIPT']} value={form.voucherType} onChange={u('voucherType')} placeholder="Select Type" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label>Internal Ref</Label>
                              <Input value={form.voucherNo} onChange={u('voucherNo')} placeholder="V-0000" />
                           </div>
                           <div className="space-y-1">
                              <Label required>Posting Date</Label>
                              <Input type="date" value={form.voucherDate} onChange={u('voucherDate')} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label required>Account Base</Label>
                           <Select options={['LIQUID CASH', 'BANK OPERATIONAL', 'PETTY CASH', 'TRANSIT ACCOUNT']} placeholder="Select Ledger" value={form.accountType} onChange={u('accountType')} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label>Sequence No</Label>
                              <Input value={form.autoNo} readOnly className="font-black text-[#0097A7]" />
                           </div>
                           <div className="space-y-1">
                              <Label>Organizational Unit</Label>
                              <Select options={['MAIN OFFICE', 'BRANCH ALPHA', 'PLANT 1', 'PLANT 2']} placeholder="Select Unit" value={form.voucherSection} onChange={u('voucherSection')} />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <Label>Master Narration</Label>
                     <Input placeholder="Primary objective / context for this voucher sequence..." value={form.details} onChange={u('details')} />
                  </div>
               </div>

               <div className="col-span-4 flex flex-col justify-end gap-4 relative z-10">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-black rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                      {isSaving ? <RotateCcw size={18} className="animate-spin" /> : <Save size={18} />}
                      {isSaving ? 'Commiting...' : 'Commit Voucher'}
                    </button>
                    <button onClick={handleCancel} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[11px] font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest">
                      <RotateCcw size={18} /> Reset Hub
                    </button>
                  </div>
               </div>
            </div>

            {/* Entry Matrix */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-6">
                  <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-6 bg-slate-900 rounded-sm" />
                    Double-Entry Allocation
                  </h3>
                  <button onClick={addRow} className="flex items-center gap-2 px-6 py-2 bg-[#0097A7] text-white text-[10px] font-black rounded-2xl hover:bg-[#007a87] transition-all shadow-lg uppercase tracking-widest">
                    <Plus size={16} /> Add Line Entry
                  </button>
               </div>

               <div className="border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1000px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-5 border-r border-slate-100 w-20 text-center">#</th>
                       <th className="px-8 py-5 border-r border-slate-100">Ledger Account</th>
                       <th className="px-8 py-5 border-r border-slate-100">Particulars / Line Narration</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-right w-48">Debit Value</th>
                       <th className="px-6 py-5 text-center w-24">Del</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[13px]">
                     {rows.map((row, idx) => (
                       <tr key={row.id} className="hover:bg-slate-50 transition-colors h-16 group">
                         <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                         <td className="px-4 py-2 border-r border-slate-50"><Input placeholder="Search Ledger..." className="!border-none !bg-transparent font-black uppercase text-[11px] tracking-tight" value={row.ledger} onChange={e => setRowField(idx, 'ledger', e.target.value)} /></td>
                         <td className="px-4 py-2 border-r border-slate-50"><Input placeholder="Enter details..." className="!border-none !bg-transparent text-slate-500 italic" value={row.narration} onChange={e => setRowField(idx, 'narration', e.target.value)} /></td>
                         <td className="px-4 py-2 border-r border-slate-50 bg-[#0097A7]/5"><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-black text-[#0097A7] text-lg" value={row.amt} onChange={e => setRowField(idx, 'amt', e.target.value)} /></td>
                         <td className="px-4 py-2 text-center">
                            <button onClick={() => removeRow(row.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                               <Trash2 size={16} />
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-8 bg-slate-900 rounded-[3rem] p-10 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/5 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Total Transaction Value</p>
                    <p className="text-[36px] font-black text-white leading-none tracking-tighter">{totalAmt}</p>
                  </div>
                  <div className="w-[1px] h-14 bg-white/10" />
                  <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Line Count</p>
                    <p className="text-[36px] font-black text-[#0097A7] leading-none tracking-tighter">{rows.length}</p>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30">
                  <div className="flex items-center gap-3">
                    <Calculator size={32} className="text-white" />
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.3em] italic text-right leading-tight">Digital Voucher<br/>Authorization Stream</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
