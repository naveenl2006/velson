import { useState, useEffect } from 'react'
import { ChevronRight, Save, X, RotateCcw, Trash2, Plus, Scale, BookOpen, Calculator, Database } from 'lucide-react'

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
  type: 'DR', ledger: '', narration: '', receipt: '', payment: '' 
})

export default function JournalEntry() {
  const [form, setForm] = useState({
    tempVouNo: 'TVJ-' + Math.floor(Math.random() * 900 + 100),
    voucherType: 'JOURNAL',
    voucherDate: new Date().toISOString().split('T')[0],
    autoNo: Math.floor(Math.random() * 1000 + 1),
    voucherNo: '',
    voucherSection: '',
    isBranchVoucher: false
  })

  const [rows, setRows] = useState([emptyRow(), emptyRow()])
  const [isSaving, setIsSaving] = useState(false)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  
  const setRowField = (idx, k, v) => {
    const next = rows.map((r, i) => i === idx ? { ...r, [k]: v } : r)
    setRows(next)
  }

  const addRow = () => setRows([...rows, emptyRow()])
  const removeRow = (id) => setRows(rows.filter(r => r.id !== id))

  const handleSave = () => {
    if (Math.abs(totalReceipt - totalPayment) > 0.01) {
      alert('Imbalanced Journal: Debit and Credit sums must match.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const journal = { ...form, rows, id: Date.now() }
      const existing = JSON.parse(localStorage.getItem('velson_journals') || '[]')
      localStorage.setItem('velson_journals', JSON.stringify([...existing, journal]))
      setIsSaving(false)
      alert('Financial Equilibrium Established. Journal Posted.')
      handleCancel()
    }, 800)
  }

  const handleCancel = () => {
    setForm({
      tempVouNo: 'TVJ-' + Math.floor(Math.random() * 900 + 100),
      voucherType: 'JOURNAL',
      voucherDate: new Date().toISOString().split('T')[0],
      autoNo: Math.floor(Math.random() * 1000 + 1),
      voucherNo: '',
      voucherSection: '',
      isBranchVoucher: false
    })
    setRows([emptyRow(), emptyRow()])
  }

  const totalReceipt = rows.reduce((acc, r) => acc + (parseFloat(r.receipt) || 0), 0).toFixed(2)
  const totalPayment = rows.reduce((acc, r) => acc + (parseFloat(r.payment) || 0), 0).toFixed(2)
  const difference = (parseFloat(totalReceipt) - parseFloat(totalPayment)).toFixed(2)

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-40">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Journal Equilibrium Hub</span>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-indigo-600 rounded shadow-sm" />
              <h2 className="text-[16px] font-black text-slate-800 uppercase tracking-[0.2em]">Double-Entry Journal Management</h2>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equilibrium Ref</span>
                  <span className="text-[14px] font-black text-indigo-600">{form.tempVouNo}</span>
               </div>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-black rounded-2xl transition-all shadow-md">
                <X size={20} strokeWidth={2.5} /> Terminate Console
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Architectural Definition */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Scale size={180} />
               </div>

               <div className="col-span-8 space-y-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl italic">J</div>
                    <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em]">Protocol Specification</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-5">
                        <div className="space-y-1.5">
                           <Label required>Journal Protocol</Label>
                           <Select options={['JOURNAL', 'CONTRA', 'ADJUSTMENT', 'OPENING']} value={form.voucherType} onChange={u('voucherType')} placeholder="Select Protocol" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-1.5">
                              <Label>Doc Identification</Label>
                              <Input value={form.voucherNo} onChange={u('voucherNo')} placeholder="J-0000" />
                           </div>
                           <div className="space-y-1.5">
                              <Label required>Posting Cycle</Label>
                              <Input type="date" value={form.voucherDate} onChange={u('voucherDate')} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-5">
                        <div className="space-y-1.5">
                           <Label required>Business Division</Label>
                           <Select options={['HEADQUARTERS', 'SOUTHERN BRANCH', 'EXPORT UNIT']} placeholder="Select Division" value={form.voucherSection} onChange={u('voucherSection')} />
                        </div>
                        <div className="flex items-center gap-6 h-[42px] pt-4">
                           <label className="flex items-center gap-4 cursor-pointer group">
                              <div className="relative">
                                 <input 
                                   type="checkbox" 
                                   checked={form.isBranchVoucher} 
                                   onChange={e => setForm(f => ({...f, isBranchVoucher: e.target.checked}))} 
                                   className="peer sr-only" 
                                 />
                                 <div className="w-12 h-6 bg-slate-200 rounded-full transition-all peer-checked:bg-indigo-500" />
                                 <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6" />
                              </div>
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Cross-Branch Sync</span>
                           </label>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col justify-end gap-6 relative z-10 pl-12 border-l border-slate-200/50">
                  <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 space-y-6">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-black rounded-3xl transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em]"
                    >
                      {isSaving ? <RotateCcw size={20} className="animate-spin" /> : <BookOpen size={20} />}
                      {isSaving ? 'Balancing...' : 'Commit Journal'}
                    </button>
                    <button onClick={handleCancel} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-slate-100 text-slate-400 text-[11px] font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest">
                      <RotateCcw size={18} /> Reset Hub
                    </button>
                  </div>
               </div>
            </div>

            {/* Matrix Architecture */}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-10">
                  <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.5em] flex items-center gap-4">
                    <div className="w-2 h-8 bg-indigo-600 rounded-sm" />
                    Ledger Equivalence Matrix
                  </h3>
                  <button onClick={addRow} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-[11px] font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-widest">
                    <Plus size={18} /> Append Transaction
                  </button>
               </div>

               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1200px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-10 py-6 border-r border-slate-100 w-24 text-center">#</th>
                       <th className="px-10 py-6 border-r border-slate-100 w-32">Vector</th>
                       <th className="px-10 py-6 border-r border-slate-100">Ledger Classification</th>
                       <th className="px-10 py-6 border-r border-slate-100">Line Narration</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-right w-44">Debit (DR)</th>
                       <th className="px-10 py-6 text-right w-44">Credit (CR)</th>
                       <th className="px-6 py-6 text-center w-20">Del</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     {rows.map((row, idx) => (
                       <tr key={row.id} className="hover:bg-indigo-50/20 transition-colors h-18 group">
                         <td className="px-10 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                         <td className="px-4 py-2 border-r border-slate-50">
                           <select 
                             className={`w-full bg-slate-100/50 rounded-xl py-2 px-3 focus:outline-none text-[12px] font-black tracking-widest transition-all cursor-pointer ${row.type === 'DR' ? 'text-rose-600' : 'text-green-600'}`}
                             value={row.type}
                             onChange={e => setRowField(idx, 'type', e.target.value)}
                           >
                             <option value="DR">DR (Debit)</option>
                             <option value="CR">CR (Credit)</option>
                           </select>
                         </td>
                         <td className="px-4 py-2 border-r border-slate-50"><Input placeholder="Search Ledger Hub..." className="!border-none !bg-transparent font-black uppercase text-[12px] tracking-tight" value={row.ledger} onChange={e => setRowField(idx, 'ledger', e.target.value)} /></td>
                         <td className="px-4 py-2 border-r border-slate-50"><Input placeholder="Operational context..." className="!border-none !bg-transparent text-slate-400 italic text-[13px]" value={row.narration} onChange={e => setRowField(idx, 'narration', e.target.value)} /></td>
                         <td className={`px-4 py-2 border-r border-slate-50 ${row.type === 'DR' ? 'bg-rose-50/30' : ''}`}><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-black text-rose-600 text-lg" value={row.receipt} onChange={e => setRowField(idx, 'receipt', e.target.value)} /></td>
                         <td className={`px-4 py-2 ${row.type === 'CR' ? 'bg-green-50/30' : ''}`}><Input placeholder="0.00" className="!border-none !bg-transparent text-right font-black text-green-600 text-lg" value={row.payment} onChange={e => setRowField(idx, 'payment', e.target.value)} /></td>
                         <td className="px-4 py-2 text-center">
                            <button onClick={() => removeRow(row.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                               <Trash2 size={18} />
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equilibrium Floating Status */}
      <div className="fixed bottom-10 left-[260px] right-10 bg-slate-900 rounded-[3.5rem] p-10 flex items-center justify-between shadow-2xl z-20 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-32 relative z-10">
           <div className="flex flex-col">
             <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Debit Sum (DR)</span>
             <span className="text-[32px] font-black text-rose-500 leading-none tracking-tighter">{totalReceipt}</span>
           </div>
           <div className="w-[1px] h-16 bg-white/10" />
           <div className="flex flex-col">
             <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Credit Sum (CR)</span>
             <span className="text-[32px] font-black text-green-500 leading-none tracking-tighter">{totalPayment}</span>
           </div>
        </div>

        <div className="flex items-center gap-16 relative z-10">
           <div className="flex flex-col items-end">
             <span className="text-white/30 text-[11px] font-black uppercase tracking-[0.4em] mb-3 italic">Equilibrium Delta</span>
             <div className="flex items-center gap-4">
                <span className={`text-[42px] font-black leading-none tracking-tighter ${Math.abs(difference) < 0.01 ? 'text-indigo-400' : 'text-orange-500'}`}>
                   {difference}
                </span>
                {Math.abs(difference) < 0.01 && <div className="w-4 h-4 bg-indigo-400 rounded-full animate-pulse" />}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
