import { useState, useEffect } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight, Layers, LayoutGrid, Search, Filter } from 'lucide-react'

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

const empty = { GroupCode: '', GroupName: '', ParentGroup: '', Status: 'Active' }

export default function LedgerGroupMaster() {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('velson_ledger_groups')
    return saved ? JSON.parse(saved) : [
      { id: 1, GroupCode: 'LG001', GroupName: 'ASSETS', ParentGroup: '', Status: 'Active' },
      { id: 2, GroupCode: 'LG002', GroupName: 'FIXED ASSETS', ParentGroup: 'ASSETS', Status: 'Active' },
      { id: 3, GroupCode: 'LG003', GroupName: 'LIABILITIES', ParentGroup: '', Status: 'Active' },
      { id: 4, GroupCode: 'LG004', GroupName: 'CURRENT LIABILITIES', ParentGroup: 'LIABILITIES', Status: 'Active' },
    ]
  })

  const [form, setForm] = useState({ ...empty })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    localStorage.setItem('velson_ledger_groups', JSON.stringify(rows))
  }, [rows])

  const handleSave = () => {
    if (!form.GroupCode || !form.GroupName) {
      alert('Required: Group Code and Group Name')
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
      setForm({ ...empty })
      setIsSaving(false)
    }, 600)
  }

  const handleDelete = (id) => {
    if (confirm('Authorize deletion of this ledger architecture?')) {
      setRows(r => r.filter(x => x.id !== id))
    }
  }

  const filtered = rows.filter(r => 
    [r.GroupCode, r.GroupName, r.ParentGroup].some(v => 
      String(v || '').toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-20">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Account</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Ledger Architecture Console</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-[#0097A7] rounded shadow-sm" />
              <h2 className="text-[15px] font-black text-slate-800 uppercase tracking-widest">Global Ledger Group Master</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <LayoutGrid size={18} className="text-[#0097A7]" />
                  <span className="text-[12px] font-black text-slate-700 uppercase">{rows.length} Active Structures</span>
               </div>
               <button onClick={() => window.history.back()} className="text-slate-400 hover:text-red-600 transition-all p-1">
                 <X size={24} strokeWidth={2.5} />
               </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Architectural Hub */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Layers size={150} />
               </div>

               <div className="col-span-8 space-y-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl italic">L</div>
                    <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em]">Identity Specification</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="space-y-1.5">
                           <Label required>Group Identification Code</Label>
                           <Input placeholder="E.g. LG-001" value={form.GroupCode} onChange={e => setForm({...form, GroupCode: e.target.value.toUpperCase()})} />
                        </div>
                        <div className="space-y-1.5">
                           <Label required>Structural Label</Label>
                           <Input placeholder="Enter Group Name" value={form.GroupName} onChange={e => setForm({...form, GroupName: e.target.value.toUpperCase()})} />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-1.5">
                           <Label>Hierarchical Parent</Label>
                           <Select 
                              options={rows.filter(r => r.id !== editId).map(r => r.GroupName)} 
                              placeholder="Top-Level Node" 
                              value={form.ParentGroup} 
                              onChange={e => setForm({...form, ParentGroup: e.target.value})} 
                           />
                        </div>
                        <div className="space-y-1.5">
                           <Label>Operational Status</Label>
                           <Select options={['Active', 'Inactive']} value={form.Status} onChange={e => setForm({...form, Status: e.target.value})} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col justify-end gap-6 relative z-10 pl-12 border-l border-slate-200/50">
                  <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 space-y-6">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#0097A7] hover:bg-[#007a87] text-white text-[14px] font-black rounded-3xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                      {isSaving ? <RotateCcw size={20} className="animate-spin" /> : <Save size={20} />}
                      {editId !== null ? 'Sync Update' : 'Establish Node'}
                    </button>
                    <button onClick={() => { setForm({...empty}); setEditId(null); }} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-slate-100 text-slate-400 text-[11px] font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest">
                      <RotateCcw size={18} /> Clear Hub
                    </button>
                  </div>
               </div>
            </div>

            {/* Structure Ledger */}
            <div className="space-y-8 flex-1 flex flex-col">
               <div className="flex items-center justify-between px-10">
                  <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.5em] flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#0097A7] rounded-sm" />
                    Organizational Ledger Matrix
                  </h3>
                  <div className="flex items-center gap-4">
                     <div className="relative group">
                        <Input 
                           placeholder="Filter Matrix..." 
                           value={search} 
                           onChange={e => setSearch(e.target.value)} 
                           className="!w-64 !bg-slate-50 border-none group-hover:!bg-white transition-all shadow-inner" 
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                           <Search size={16} />
                        </div>
                     </div>
                     <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#0097A7] shadow-sm transition-all"><Filter size={18}/></button>
                  </div>
               </div>

               <div className="border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto flex-1">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-10 py-6 border-r border-slate-100 w-24 text-center">#</th>
                       <th className="px-10 py-6 border-r border-slate-100">Identity Code</th>
                       <th className="px-10 py-6 border-r border-slate-100">Structural Label</th>
                       <th className="px-10 py-6 border-r border-slate-100">Parent Integration</th>
                       <th className="px-10 py-6 border-r border-slate-100 text-center">Status</th>
                       <th className="px-10 py-6 text-center w-40">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[14px]">
                     {filtered.length === 0 ? (
                       <tr>
                         <td colSpan={6} className="py-24 text-center text-slate-200 italic font-black uppercase tracking-widest opacity-30">
                            No architectural nodes found in the current index.
                         </td>
                       </tr>
                     ) : (
                       filtered.map((row, idx) => (
                         <tr key={row.id} className="hover:bg-[#0097A7]/5 transition-colors h-18 group">
                           <td className="px-10 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                           <td className="px-10 py-2 border-r border-slate-50 font-black text-[#0097A7] uppercase tracking-tighter">{row.GroupCode}</td>
                           <td className="px-10 py-2 border-r border-slate-50 font-black text-slate-800 uppercase">{row.GroupName}</td>
                           <td className="px-10 py-2 border-r border-slate-50 font-bold text-slate-400 italic">{row.ParentGroup || 'PRIMARY HUB'}</td>
                           <td className="px-10 py-2 border-r border-slate-50 text-center">
                              <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${row.Status === 'Active' ? 'bg-green-100 text-green-700 shadow-sm shadow-green-200/50' : 'bg-slate-100 text-slate-400 opacity-50'}`}>
                                 {row.Status}
                              </span>
                           </td>
                           <td className="px-10 py-2 text-center">
                              <div className="flex items-center justify-center gap-3">
                                 <button onClick={() => { setForm({...row}); setEditId(row.id); window.scrollTo({top:0, behavior:'smooth'}); }} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black shadow-lg transition-all active:scale-95">
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
          </div>
        </div>
      </div>
    </div>
  )
}
