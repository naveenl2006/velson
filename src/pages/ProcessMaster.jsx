import { useState, useEffect } from 'react'
import {
  X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight,
  Settings, Database, Timer, Workflow
} from 'lucide-react'
import { useToast } from '../components/Toast'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, placeholder, className = "", readOnly = false }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : ''} ${className}`}
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

const PROCESS_TYPES = ['Machining', 'Welding', 'Assembly', 'Inspection', 'Heat Treatment', 'Surface Finishing', 'Fabrication']
const TEAMS = ['Team Alpha', 'Team Beta', 'Night Shift', 'Day Shift', 'QC Unit']
const MACHINES = ['MCH-001 Precision CNC', 'MCH-002 VMC Master', 'MCH-003 Radial Precision']

const empty = { 
  PM_Process_Name: '', PM_Process_Name1: '', PM_Process_Order: '', 
  ProcessTypeId: '', TeamId: '', Machine_id: '', 
  PM_Days: 0, PM_Hours: 0, Minutes: 0, Setting_Time: 0, 
  Cycle_Time: 0, Handling_Time: 0, Idle_Time: 0 
}

export default function ProcessMaster() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ ...empty })
  const [editId, setEditId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_process_master') || '[]')
    setRows(saved)
  }, [])

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.PM_Process_Name) {
      toast.warning('Process Name is required.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      let updated
      if (editId !== null) {
        updated = rows.map(r => r.id === editId ? { ...form, id: editId } : r)
      } else {
        updated = [{ ...form, id: Date.now() }, ...rows]
      }
      localStorage.setItem('velson_process_master', JSON.stringify(updated))
      setRows(updated)
      setIsSaving(false)
      toast.success(editId ? 'Process Updated.' : 'New Process Defined.')
      handleClear()
    }, 600)
  }

  const handleEdit = r => {
    setForm({ ...r })
    setEditId(r.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = id => {
    const next = rows.filter(r => r.id !== id)
    setRows(next)
    localStorage.setItem('velson_process_master', JSON.stringify(next))
  }

  const handleClear = () => {
    setForm({ ...empty })
    setEditId(null)
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Production</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Process Architecture Master</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#0097A7] rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Workflow Definition Console</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-2xl transition-all shadow-sm active:scale-95">
                <RotateCcw size={16} /> Reset Form
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* Architectural Definition */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Workflow size={150} />
               </div>

               <div className="col-span-8 space-y-8 relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-[#0097A7] text-white rounded-2xl flex items-center justify-center font-black">01</div>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Core Process Parameters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label required>Canonical Name</Label>
                           <Input placeholder="e.g. Precision CNC Turning" value={form.PM_Process_Name} onChange={e => sf('PM_Process_Name', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label>Alias Reference</Label>
                              <Input placeholder="Internal Shortname" value={form.PM_Process_Name1} onChange={e => sf('PM_Process_Name1', e.target.value)} />
                           </div>
                           <div className="space-y-1">
                              <Label>Sequence Order</Label>
                              <Input type="number" placeholder="1" value={form.PM_Process_Order} onChange={e => sf('PM_Process_Order', e.target.value)} />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1">
                           <Label>Process Classification</Label>
                           <Select options={PROCESS_TYPES} placeholder="Identify Type" value={form.ProcessTypeId} onChange={e => sf('ProcessTypeId', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label>Operational Team</Label>
                              <Select options={TEAMS} placeholder="Assigned Unit" value={form.TeamId} onChange={e => sf('TeamId', e.target.value)} />
                           </div>
                           <div className="space-y-1">
                              <Label>Host Machine</Label>
                              <Select options={MACHINES} placeholder="Hardware Hub" value={form.Machine_id} onChange={e => sf('Machine_id', e.target.value)} />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Runtime Estimations</h3>
                    <Timer size={18} className="text-[#0097A7]" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                     {[
                       { l: 'Base Days', k: 'PM_Days' },
                       { l: 'Base Hours', k: 'PM_Hours' },
                       { l: 'Mins', k: 'Minutes' },
                       { l: 'Setting', k: 'Setting_Time' },
                       { l: 'Cycle', k: 'Cycle_Time' },
                       { l: 'Handling', k: 'Handling_Time' },
                     ].map(t => (
                        <div key={t.k} className="space-y-1">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{t.l}</p>
                           <input 
                             type="number" 
                             value={form[t.k]} 
                             onChange={e => sf(t.k, e.target.value)}
                             className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0097A7] transition-all"
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Action Matrix */}
            <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200">
               <div className="flex items-center gap-6">
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[12px] font-black text-slate-800">Operational</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleClear} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 text-[11px] font-black rounded-2xl transition-all shadow-sm active:scale-95 uppercase tracking-widest">
                    Clear Inputs
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-12 py-3 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <RotateCcw size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Processing...' : editId ? 'Commit Changes' : 'Initialize Process'}
                  </button>
               </div>
            </div>

            {/* Registry Explorer */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-6 px-6">
                 <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#0097A7] rounded-sm" />
                    Process Registry Ledger
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">{rows.length} Defined Architectures</span>
               </div>

               <div className="border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1500px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-5 border-r border-slate-100 w-20 text-center">#</th>
                       <th className="px-8 py-5 border-r border-slate-100">Canonical Name</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-center w-24">Order</th>
                       <th className="px-8 py-5 border-r border-slate-100">Classification</th>
                       <th className="px-8 py-5 border-r border-slate-100">Assigned Unit</th>
                       <th className="px-8 py-5 border-r border-slate-100">Hardware Hub</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-center w-32">Cycle Time</th>
                       <th className="px-8 py-5 text-center w-32">Control</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[13px]">
                     {rows.length === 0 ? (
                       <tr>
                         <td colSpan={8} className="py-24 text-center text-slate-200 italic">
                            <Settings size={80} className="mx-auto mb-4 opacity-5" />
                            Registry empty. Define a process to initialize matrix.
                         </td>
                       </tr>
                     ) : (
                       rows.map((row, idx) => (
                         <tr key={row.id} className="hover:bg-[#0097A7]/5 transition-colors h-16 group">
                           <td className="px-8 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-slate-800 uppercase">{row.PM_Process_Name}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-[#0097A7]">{row.PM_Process_Order}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-500 uppercase text-[11px] tracking-tight">{row.ProcessTypeId}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-medium text-slate-400">{row.TeamId}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-black text-[10px] text-slate-300 uppercase">{row.Machine_id}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-slate-700">{row.Cycle_Time}s</td>
                           <td className="px-8 py-2 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleEdit(row)} className="p-2 text-slate-300 hover:text-[#0097A7] hover:bg-[#0097A7]/5 rounded-xl transition-all">
                                   <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
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
