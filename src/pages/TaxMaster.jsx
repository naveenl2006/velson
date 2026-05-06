import { useState, useEffect } from 'react'
import { X, Save, Edit, Trash2, Info, ChevronRight, Percent, ShieldCheck, Database, Search, RotateCcw, Landmark } from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
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

const TAX_LEDGERS = ['GST 0%', 'GST 5%', 'GST 7%', 'GST 12%', 'GST 18%', 'GST 28%', 'GST 30%']

const emptyForm = {
  taxLedger: '', taxPercent: '', cgst: '', sgst: '', igst: '',
  purCgst: '', purSgst: '', purIgst: '', salCgst: '', salSgst: '', salIgst: '',
}

export default function TaxMaster() {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('velson_tax_master')
    return saved ? JSON.parse(saved) : [
      { id: 1, taxLedger: 'GST 0%', taxPercent: 0, cgst: 0, sgst: 0, igst: 0 },
      { id: 2, taxLedger: 'GST 5%', taxPercent: 5, cgst: 2.5, sgst: 2.5, igst: 5 },
      { id: 3, taxLedger: 'GST 12%', taxPercent: 12, cgst: 6, sgst: 6, igst: 12 },
      { id: 4, taxLedger: 'GST 18%', taxPercent: 18, cgst: 9, sgst: 9, igst: 18 },
    ]
  })

  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    localStorage.setItem('velson_tax_master', JSON.stringify(rows))
  }, [rows])

  const setField = (k, v) => {
    setForm(f => {
      const next = { ...f, [k]: v }
      if (k === 'taxPercent') {
        const val = parseFloat(v) || 0
        const half = (val / 2).toFixed(2)
        next.cgst = half; next.sgst = half; next.igst = val.toFixed(2)
      }
      return next
    })
  }

  const handleSave = () => {
    if (!form.taxLedger) {
      alert('Required: Tax Ledger Classification')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      if (editId !== null) {
        setRows(r => r.map(x => x.id === editId ? { ...form, id: editId } : x))
        setEditId(null)
      } else {
        const id = Date.now()
        setRows(r => [...r, { ...form, id }])
      }
      setForm({ ...emptyForm })
      setIsSaving(false)
    }, 600)
  }

  const handleDelete = (id) => {
    if (confirm('Authorize deletion of this tax architecture?')) {
      setRows(r => r.filter(x => x.id !== id))
    }
  }

  const filtered = rows.filter(r => 
    Object.values(r).some(v => String(v || '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-20">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Taxation Protocol Hub</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-indigo-600 rounded shadow-sm" />
              <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-widest">Global Tax Master Console</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <Percent size={18} className="text-indigo-600" />
                  <span className="text-[12px] font-black text-slate-700 uppercase">{rows.length} Defined Protocols</span>
               </div>
               <button onClick={() => window.history.back()} className="text-slate-400 hover:text-red-600 transition-all p-1">
                 <X size={24} strokeWidth={2.5} />
               </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Protocol Definition */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ShieldCheck size={150} />
               </div>

               <div className="col-span-8 space-y-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl italic">T</div>
                    <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em]">Protocol Specification</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="space-y-1.5">
                           <Label required>Tax Ledger Classification</Label>
                           <Select options={TAX_LEDGERS} placeholder="Select Classification" value={form.taxLedger} onChange={e => setField('taxLedger', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <Label>Aggregate Tax %</Label>
                              <Input type="number" placeholder="0.00" value={form.taxPercent} onChange={e => setField('taxPercent', e.target.value)} className="font-black text-indigo-600" />
                           </div>
                           <div className="space-y-1.5">
                              <Label>IGST (Out of State)</Label>
                              <Input type="number" value={form.igst} readOnly className="!bg-slate-50 opacity-50" />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <Label>CGST (Central)</Label>
                              <Input type="number" value={form.cgst} readOnly className="!bg-slate-50 opacity-50" />
                           </div>
                           <div className="space-y-1.5">
                              <Label>SGST (State)</Label>
                              <Input type="number" value={form.sgst} readOnly className="!bg-slate-50 opacity-50" />
                           </div>
                        </div>
                        <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">Automated Distribution</p>
                           <p className="text-[12px] text-slate-500 leading-relaxed font-bold">
                              Tax distribution is automatically split between Central and State hubs based on the aggregate protocol percentage.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col justify-end gap-6 relative z-10 pl-12 border-l border-slate-200/50">
                  <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 space-y-6">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-black rounded-3xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                      {isSaving ? <RotateCcw size={20} className="animate-spin" /> : <Save size={20} />}
                      {editId !== null ? 'Sync Update' : 'Establish Protocol'}
                    </button>
                    <button onClick={() => { setForm({ ...emptyForm }); setEditId(null); }} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-slate-100 text-slate-400 text-[11px] font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest">
                      <RotateCcw size={18} /> Reset Hub
                    </button>
                  </div>
               </div>
            </div>

            {/* Matrix Architecture */}
            <div className="space-y-8 flex-1 flex flex-col">
               <div className="flex items-center justify-between px-10">
                  <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.5em] flex items-center gap-4">
                    <div className="w-2 h-8 bg-indigo-600 rounded-sm" />
                    Global Taxation Matrix
                  </h3>
                  <div className="flex items-center gap-4">
                     <div className="relative group">
                        <Input 
                           placeholder="Search Protocols..." 
                           value={search} 
                           onChange={e => setSearch(e.target.value)} 
                           className="!w-64 !bg-slate-50 border-none group-hover:!bg-white transition-all shadow-inner" 
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                           <Search size={16} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto flex-1">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-10 py-6 border-r border-slate-100 w-24 text-center">#</th>
                       <th className="px-10 py-6 border-r border-slate-100">Ledger Protocol</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-center">Aggregate %</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-center">CGST %</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-center">SGST %</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-center">IGST %</th>
                       <th className="px-10 py-6 text-center w-40">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     {filtered.length === 0 ? (
                       <tr>
                         <td colSpan={7} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-widest opacity-30">
                            No taxation protocols found in the current architectural index.
                         </td>
                       </tr>
                     ) : (
                       filtered.map((row, idx) => (
                         <tr key={row.id} className="hover:bg-indigo-50/20 transition-colors h-18 group">
                           <td className="px-10 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                           <td className="px-10 py-2 border-r border-slate-50 font-black text-slate-800 uppercase tracking-tighter">{row.taxLedger}</td>
                           <td className="px-10 py-2 border-r border-slate-50 text-center font-black text-indigo-600 text-lg">{row.taxPercent}%</td>
                           <td className="px-10 py-2 border-r border-slate-50 text-center font-bold text-slate-400">{row.cgst}%</td>
                           <td className="px-10 py-2 border-r border-slate-50 text-center font-bold text-slate-400">{row.sgst}%</td>
                           <td className="px-10 py-2 border-r border-slate-50 text-center font-bold text-slate-400">{row.igst}%</td>
                           <td className="px-10 py-2 text-center">
                              <div className="flex items-center justify-center gap-3">
                                 <button onClick={() => { setForm({ ...row }); setEditId(row.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black shadow-lg transition-all active:scale-95">
                                    <Edit size={16} />
                                 </button>
                                 <button onClick={() => handleDelete(row.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 shadow-sm transition-all active:scale-95">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Dark Analytical Footer */}
            <div className="mt-12 bg-slate-900 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-24 relative z-10">
                  <div className="flex flex-col">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Compliance Summary</p>
                    <div className="flex items-center gap-12">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                             <Database size={20} className="text-indigo-400" />
                          </div>
                          <div>
                             <p className="text-white text-[18px] font-black leading-none">{rows.length}</p>
                             <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">Protocols Indexed</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
               <div className="text-right relative z-10 opacity-30 flex flex-col items-end gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.4em] italic text-right leading-tight text-white/50">Digital Compliance Hub<br/>Ver 4.0 Omni-Core</span>
                    <Landmark size={32} className="text-indigo-400" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
