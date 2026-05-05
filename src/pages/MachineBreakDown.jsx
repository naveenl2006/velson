import { useState, useEffect } from 'react'
import { 
  ChevronRight, Save, X, Search, Edit, Trash2, Eraser, 
  FileSpreadsheet, ChevronUp, Wrench, AlertTriangle, User, Calendar,
  RotateCcw, Plus, Activity
} from 'lucide-react'

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
    className={`w-full px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-[7px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
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

const TextArea = ({ placeholder, value, onChange, className = "", rows = 3 }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 resize-none ${className}`}
  />
)

export default function MachineBreakDown() {
  const [form, setForm] = useState({
    machineName: '',
    jobCardNo: '',
    partNo: '',
    processStage: '',
    location: '',
    date: new Date().toISOString().slice(0, 16),
    mwrNo: 'MWR-' + Math.floor(Math.random() * 9000 + 1000),
    reportedBy: 'SuperAdmin',
    priority: '',
    problemDescription: '',
    status: 'Pending'
  })

  const [breakdowns, setBreakdowns] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    setBreakdowns(saved)
  }, [])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    if (!form.machineName || !form.problemDescription) {
      alert('Required: Machine Name and Problem Description.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const entry = { ...form, id: Date.now() }
      const updated = [entry, ...breakdowns]
      localStorage.setItem('velson_breakdowns', JSON.stringify(updated))
      setBreakdowns(updated)
      setIsSaving(false)
      alert('Breakdown Ticket Registered.')
      handleReset()
    }, 800)
  }

  const handleReset = () => {
    setForm({
      machineName: '',
      jobCardNo: '',
      partNo: '',
      processStage: '',
      location: '',
      date: new Date().toISOString().slice(0, 16),
      mwrNo: 'MWR-' + Math.floor(Math.random() * 9000 + 1000),
      reportedBy: 'SuperAdmin',
      priority: '',
      problemDescription: '',
      status: 'Pending'
    })
  }

  const deleteEntry = (id) => {
    const next = breakdowns.filter(b => b.id !== id)
    setBreakdowns(next)
    localStorage.setItem('velson_breakdowns', JSON.stringify(next))
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Maintenance</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Machine Breakdown Entry</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-rose-600 rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Maintenance Ticket Console</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col space-y-10">
            {/* Ticket Information */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <Wrench size={120} />
               </div>
               
               <div className="col-span-5 space-y-5 relative z-10">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>Machine Unit</Label></div>
                    <div className="col-span-8"><Select options={['CNC-Vertical-01', 'VMC-Master-02', 'Lathe-Precision-01']} placeholder="Identify Machine" value={form.machineName} onChange={u('machineName')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Job Card Ref</Label></div>
                    <div className="col-span-8"><Select options={['JC-2026-001', 'JC-2026-002']} placeholder="Select Job Card" value={form.jobCardNo} onChange={u('jobCardNo')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Part Number</Label></div>
                    <div className="col-span-8"><Select options={['P-990-V', 'P-110-B']} placeholder="Current Part" value={form.partNo} onChange={u('partNo')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Stage</Label></div>
                    <div className="col-span-8"><Select options={['In-Process', 'Setup', 'Finishing']} placeholder="Process Stage" value={form.processStage} onChange={u('processStage')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Location</Label></div>
                    <div className="col-span-8"><Input placeholder="Bay / Shop Floor Area" value={form.location} onChange={u('location')} /></div>
                  </div>
               </div>

               <div className="col-span-7 space-y-5 relative z-10 pl-8 border-l border-slate-200/50">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-3 text-right"><Label>Occurence Time</Label></div>
                    <div className="col-span-5"><Input type="datetime-local" value={form.date} onChange={u('date')} /></div>
                    <div className="col-span-2 text-right"><Label>MWR ID</Label></div>
                    <div className="col-span-2"><Input value={form.mwrNo} readOnly className="!font-black text-[#0097A7] !bg-white" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-3 text-right"><Label>Reported By</Label></div>
                    <div className="col-span-9"><Input value={form.reportedBy} readOnly className="font-bold text-slate-500" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-3 text-right"><Label>Severity</Label></div>
                    <div className="col-span-9"><Select options={['Minor - Operational', 'Medium - Critical Path', 'Major - Stop Production', 'Catastrophic']} placeholder="Select Priority" value={form.priority} onChange={u('priority')} /></div>
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3 text-right pt-2"><Label required>Diagnostics</Label></div>
                    <div className="col-span-9">
                      <TextArea placeholder="Provide a detailed breakdown of the issue, observed symptoms, and immediate impact..." value={form.problemDescription} onChange={u('problemDescription')} rows={4} />
                    </div>
                  </div>
               </div>
            </div>

            {/* Action Bar */}
            <div className="bg-slate-900 rounded-3xl p-8 flex items-center justify-between shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/10 to-transparent pointer-events-none" />
               <div className="flex items-center gap-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                     <AlertTriangle size={32} />
                  </div>
                  <div>
                     <h4 className="text-white text-[14px] font-black uppercase tracking-widest">Submit Breakdown Ticket</h4>
                     <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter mt-1">Maintenance team will be notified immediately upon submission.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleReset} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/50 text-[11px] font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest active:scale-95">
                    Clear Data
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-10 py-3 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-black rounded-xl shadow-lg transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <RotateCcw size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Processing...' : 'Register Ticket'}
                  </button>
               </div>
            </div>

            {/* List Table Area */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-6 px-4">
                 <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-2 h-6 bg-rose-600 rounded-sm" />
                    Pending Breakdowns
                 </h3>
                 <div className="flex items-center gap-3">
                    <span className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase">{breakdowns.length} Active Tickets</span>
                    <button className="p-2 text-slate-400 hover:text-[#0097A7] transition-colors"><FileSpreadsheet size={20} /></button>
                 </div>
               </div>
               <div className="border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1500px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-5 border-r border-slate-100 w-20 text-center">Ticket</th>
                       <th className="px-6 py-5 border-r border-slate-100">Machine Unit</th>
                       <th className="px-6 py-5 border-r border-slate-100">Location</th>
                       <th className="px-6 py-5 border-r border-slate-100">Reported By</th>
                       <th className="px-6 py-5 border-r border-slate-100">Severity</th>
                       <th className="px-6 py-5 border-r border-slate-100">Diagnostics</th>
                       <th className="px-6 py-5 border-r border-slate-100">Timeline</th>
                       <th className="px-6 py-5 text-center w-20">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[12.5px]">
                     {breakdowns.length === 0 ? (
                       <tr>
                         <td colSpan={8} className="py-24 text-center text-slate-200 italic">
                            <Activity size={80} className="mx-auto mb-4 opacity-5" />
                            System Stable. No active breakdown reports found.
                         </td>
                       </tr>
                     ) : (
                       breakdowns.map((b, idx) => (
                         <tr key={b.id} className="hover:bg-rose-50/20 transition-colors h-16 group">
                           <td className="px-6 py-2 border-r border-slate-50 text-center font-black text-[#0097A7]">{b.mwrNo}</td>
                           <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase">{b.machineName}</td>
                           <td className="px-6 py-2 border-r border-slate-50 text-slate-500">{b.location || 'NA'}</td>
                           <td className="px-6 py-2 border-r border-slate-50 font-medium">{b.reportedBy}</td>
                           <td className="px-6 py-2 border-r border-slate-50 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                b.priority.includes('Major') ? 'bg-rose-100 text-rose-600' : 
                                b.priority.includes('Critical') ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {b.priority || 'Standard'}
                              </span>
                           </td>
                           <td className="px-6 py-2 border-r border-slate-50 max-w-xs truncate italic text-slate-400">{b.problemDescription}</td>
                           <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-300 uppercase text-[10px]">{new Date(b.date).toLocaleString()}</td>
                           <td className="px-6 py-2 text-center">
                             <button onClick={() => deleteEntry(b.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                               <Trash2 size={16} />
                             </button>
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
