import { useState, useEffect } from 'react'
import { X, Save, ChevronRight, Plus, Trash2, RotateCcw, CreditCard, Landmark, Banknote, Calculator, Receipt } from 'lucide-react'

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
  billType: '', billNo: '', billDate: '', billAmt: '', adjustAmt: '', balance: '', received: '', days: '', intPer: '', interest: '', shiftAmt: '', discAmt: '', ledgerAc: ''
})

export default function PaymentEntry() {
  const [form, setForm] = useState({
    paymentType: 'PAYMENT',
    paymentNo: 'P-' + Math.floor(Math.random() * 9000 + 1000),
    date: new Date().toISOString().split('T')[0],
    cashBank: '',
    partyName: '',
    details: '',
    amount: '',
    selectionMode: 'Auto',
    bankName: '',
    chqDate: '',
    chqNo: '',
    extraField: '',
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

  const handleClear = () => {
    setForm({
      paymentType: 'PAYMENT', paymentNo: 'P-' + Math.floor(Math.random() * 9000 + 1000), date: new Date().toISOString().split('T')[0],
      cashBank: '', partyName: '', details: '', amount: '',
      selectionMode: 'Auto', bankName: '', chqDate: '',
      chqNo: '', extraField: '',
    })
    setRows([emptyRow()])
  }

  const handleSave = () => {
    if (!form.partyName || !form.amount) {
      alert('Required: Party Name and Total Amount.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const payment = { ...form, rows, id: Date.now() }
      const existing = JSON.parse(localStorage.getItem('velson_payments') || '[]')
      localStorage.setItem('velson_payments', JSON.stringify([...existing, payment]))
      setIsSaving(false)
      alert('Transaction Authorized Successfully.')
      handleClear()
    }, 800)
  }

  const totalBalanceAmt = rows.reduce((acc, r) => acc + (parseFloat(r.balance) || 0), 0).toFixed(2)
  const totalReceivedAmt = rows.reduce((acc, r) => acc + (parseFloat(r.received) || 0), 0).toFixed(2)
  const totalIntAmt = rows.reduce((acc, r) => acc + (parseFloat(r.shiftAmt) || 0), 0).toFixed(2)
  const grandTotal = (parseFloat(totalReceivedAmt) + parseFloat(totalIntAmt)).toFixed(2)
  const remainingBalance = (parseFloat(totalBalanceAmt) - parseFloat(grandTotal)).toFixed(2)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-32">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Financial Disbursement Entry</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-rose-500 rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Disbursement Authorization</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-2xl transition-all shadow-sm active:scale-95">
                <RotateCcw size={16} /> Re-Initialize
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Main Header Logic */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <CreditCard size={150} />
               </div>

               <div className="col-span-7 space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">DR</div>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Debit Transaction Details</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label required>Entry Classification</Label>
                           <Select options={['PAYMENT', 'RECEIPT']} value={form.paymentType} onChange={u('paymentType')} placeholder="Select Type" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label>Voucher Ref</Label>
                              <Input value={form.paymentNo} onChange={u('paymentNo')} />
                           </div>
                           <div className="space-y-1">
                              <Label required>Value Date</Label>
                              <Input type="date" value={form.date} onChange={u('date')} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label required>Account Stream</Label>
                           <Select options={['CASH ACCOUNT', 'HDFC OPERATIONAL', 'SBI CURRENT', 'AXIS SALARY']} placeholder="Select Mode" value={form.cashBank} onChange={u('cashBank')} />
                        </div>
                        <div className="space-y-1">
                           <Label required>Payee / Vendor Entity</Label>
                           <Input placeholder="Search Payee Ledger..." value={form.partyName} onChange={u('partyName')} />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8 pt-4">
                     <div className="col-span-8 space-y-1">
                        <Label>Transaction Narrative</Label>
                        <Input placeholder="Internal memo / purpose of disbursement..." value={form.details} onChange={u('details')} />
                     </div>
                     <div className="col-span-4 space-y-1">
                        <Label required>Disbursement Amt</Label>
                        <Input className="text-right font-black text-rose-600 text-lg" placeholder="0.00" value={form.amount} onChange={u('amount')} />
                     </div>
                  </div>
               </div>

               <div className="col-span-5 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Landmark size={16} /> Banking Protocols
                    </h3>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <Label>Processing Institution</Label>
                        <Select options={['SBI - 4042', 'HDFC - 9110', 'ICICI - 1002']} placeholder="Select Bank" value={form.bankName} onChange={u('bankName')} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <Label>Instrument Date</Label>
                           <Input type="date" value={form.chqDate} onChange={u('chqDate')} />
                        </div>
                        <div className="space-y-1">
                           <Label>Protocol Ref</Label>
                           <Input placeholder="Reference" value={form.extraField} onChange={u('extraField')} />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <Label>Instrument / Chq No</Label>
                        <Input placeholder="Enter Digital Ref / Chq No" value={form.chqNo} onChange={u('chqNo')} />
                     </div>
                  </div>
                  <div className="pt-4 flex items-center gap-6">
                    {['Auto-Match', 'Manual-Allocation'].map(mode => (
                      <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={form.selectionMode.includes(mode.split('-')[0])} onChange={() => setForm(f => ({...f, selectionMode: mode.split('-')[0]}))} className="accent-[#0097A7] w-4 h-4" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-[#0097A7] transition-colors">{mode}</span>
                      </label>
                    ))}
                  </div>
               </div>
            </div>

            {/* Adjustment Layer */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-6">
                  <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-6 bg-rose-500 rounded-sm" />
                    Ledger Allocation Matrix
                  </h3>
                  <button onClick={addRow} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest">
                    <Plus size={16} /> Append Allocation
                  </button>
               </div>

               <div className="border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1800px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-5 border-r border-slate-100 w-16 text-center">#</th>
                       <th className="px-6 py-5 border-r border-slate-100">Doc Type</th>
                       <th className="px-6 py-5 border-r border-slate-100">Reference</th>
                       <th className="px-6 py-5 border-r border-slate-100">Doc Date</th>
                       <th className="px-6 py-5 border-r border-slate-100 text-right">Value Amt</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-right">Adj Amt</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-right">Balance</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-right">Allocated</th>
                       <th className="px-6 py-5 border-r border-slate-100 text-right">Interest</th>
                       <th className="px-6 py-5 border-r border-slate-100">Contra Ledger</th>
                       <th className="px-6 py-5 text-center w-20">Del</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[13px]">
                     {rows.map((row, idx) => (
                       <tr key={row.id} className="hover:bg-rose-50/20 transition-colors h-14 group">
                         <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input placeholder="Type" className="!border-none !bg-transparent font-black text-[10px]" value={row.billType} onChange={e => setRowField(idx, 'billType', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input placeholder="Ref" className="!border-none !bg-transparent font-black" value={row.billNo} onChange={e => setRowField(idx, 'billNo', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input type="date" className="!border-none !bg-transparent !px-0" value={row.billDate} onChange={e => setRowField(idx, 'billDate', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-bold text-slate-400" value={row.billAmt} onChange={e => setRowField(idx, 'billAmt', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-bold text-slate-400" value={row.adjustAmt} onChange={e => setRowField(idx, 'adjustAmt', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-black text-slate-900" value={row.balance} onChange={e => setRowField(idx, 'balance', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50 bg-rose-50/30"><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-black text-rose-600" value={row.received} onChange={e => setRowField(idx, 'received', e.target.value)} /></td>
                         <td className="px-2 py-2 border-r border-slate-50"><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-bold text-amber-600" value={row.shiftAmt} onChange={e => setRowField(idx, 'shiftAmt', e.target.value)} /></td>
                         <td className="px-4 py-2 border-r border-slate-50"><Input placeholder="Search Ledger..." className="!border-none !bg-transparent font-black uppercase text-[10px] tracking-tighter" value={row.ledgerAc} onChange={e => setRowField(idx, 'ledgerAc', e.target.value)} /></td>
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

            <div className="flex justify-end pt-10">
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-3 px-16 py-4 bg-slate-900 hover:bg-black text-white text-[14px] font-black rounded-3xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.3em]"
               >
                 {isSaving ? <RotateCcw size={20} className="animate-spin" /> : <Save size={20} />}
                 {isSaving ? 'Authorizing...' : 'Authorize Disbursement'}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Floating Footer */}
      <div className="fixed bottom-10 left-[240px] right-10 bg-slate-900 rounded-[3rem] p-8 flex items-center justify-around shadow-2xl z-20 border border-white/10">
        <div className="flex items-center gap-12">
           <div className="flex flex-col">
             <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Matrix Balance</span>
             <span className="text-[20px] font-black text-white leading-none tracking-tighter">{totalBalanceAmt}</span>
           </div>
           <div className="w-[1px] h-10 bg-white/10" />
           <div className="flex flex-col">
             <span className="text-rose-400/50 text-[9px] font-black uppercase tracking-widest mb-1">Disbursed Amt</span>
             <span className="text-[20px] font-black text-rose-500 leading-none tracking-tighter">{totalReceivedAmt}</span>
           </div>
        </div>

        <div className="flex items-center gap-12">
           <div className="flex flex-col">
             <span className="text-amber-400/50 text-[9px] font-black uppercase tracking-widest mb-1">Interest Sum</span>
             <span className="text-[20px] font-black text-amber-500 leading-none tracking-tighter">{totalIntAmt}</span>
           </div>
           <div className="w-[1px] h-10 bg-white/10" />
           <div className="flex flex-col">
             <span className="text-[#00BCD4]/50 text-[9px] font-black uppercase tracking-widest mb-1">Allocated Sum</span>
             <span className="text-[24px] font-black text-[#00BCD4] leading-none tracking-tighter">{grandTotal}</span>
           </div>
        </div>

        <div className="flex flex-col items-end">
           <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Net Liquidity Delta</span>
           <span className="text-[28px] font-black text-orange-400 leading-none tracking-tighter">{remainingBalance}</span>
        </div>
      </div>
    </div>
  )
}
