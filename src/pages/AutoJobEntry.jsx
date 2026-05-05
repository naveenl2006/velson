import { useState, useEffect } from 'react'
import { 
  ChevronRight, X, Search, FileText, LayoutGrid, Calendar, Camera, CheckCircle2, Play,
  Plus, RotateCcw, Package, ClipboardList, Database
} from 'lucide-react'

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

const BoxLabel = ({ children }) => (
  <div className="bg-[#B0BEC5]/10 border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-500 uppercase flex items-center justify-center min-w-[120px] rounded-l-xl border-r-0">
    {children}
  </div>
)

export default function AutoJobEntry() {
  const [form, setForm] = useState({
    jobNo: 'JOB-' + Math.floor(Math.random() * 90000 + 10000),
    priority: 'Normal',
    note: '',
    cusName: '',
    cusCode: '',
    assembly: '',
    model: '',
    reqDate: new Date().toISOString().split('T')[0],
    qty: '1',
    mode: 'Production'
  })

  const [jobs, setJobs] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_production_jobs') || '[]')
    setJobs(saved)
  }, [])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    if (!form.cusName || !form.model) {
      alert('Required: Customer Name and Model.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const entry = { ...form, id: Date.now(), status: 'Queued' }
      const updated = [entry, ...jobs]
      localStorage.setItem('velson_production_jobs', JSON.stringify(updated))
      setJobs(updated)
      setIsSaving(false)
      alert('Production Job Registered Automatically.')
      handleReset()
    }, 800)
  }

  const handleReset = () => {
    setForm({
      jobNo: 'JOB-' + Math.floor(Math.random() * 90000 + 10000),
      priority: 'Normal',
      note: '',
      cusName: '',
      cusCode: '',
      assembly: '',
      model: '',
      reqDate: new Date().toISOString().split('T')[0],
      qty: '1',
      mode: 'Production'
    })
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>Production</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Auto Job Launchpad</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[900px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#0097A7] rounded shadow-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Automated Job Generation</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-2xl transition-all shadow-sm active:scale-95">
                <RotateCcw size={16} /> Re-Initialize
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-10 flex-1 flex flex-col space-y-12">
            {/* Primary Logic Area */}
            <div className="grid grid-cols-12 gap-12 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Database size={150} />
               </div>

               <div className="col-span-8 flex flex-col gap-6 relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex items-center">
                        <BoxLabel>Job Reference</BoxLabel>
                        <Input className="!rounded-l-none" value={form.jobNo} readOnly />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Model Identity</BoxLabel>
                        <Select options={['Series-X Precision', 'Series-M HighFlow', 'Model-Alpha Standard']} placeholder="Select Model" value={form.model} onChange={u('model')} className="flex-1 !rounded-l-none" />
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex items-center">
                        <BoxLabel>Priority Tier</BoxLabel>
                        <Select options={['Critical - 24h', 'High - 48h', 'Normal - Standard', 'Low - Buffer']} placeholder="Select Tier" value={form.priority} onChange={u('priority')} className="flex-1 !rounded-l-none" />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Target Delivery</BoxLabel>
                        <Input type="date" className="!rounded-l-none" value={form.reqDate} onChange={u('reqDate')} />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex items-center">
                        <BoxLabel>Operational Note</BoxLabel>
                        <Input placeholder="Internal Instructions" value={form.note} onChange={u('note')} className="!rounded-l-none" />
                     </div>
                     <div className="flex items-center">
                        <BoxLabel>Launch Qty</BoxLabel>
                        <Input type="number" placeholder="0" value={form.qty} onChange={u('qty')} className="!rounded-l-none font-black text-[#0097A7]" />
                     </div>
                  </div>

                  <div className="flex items-center gap-10 pt-4">
                     <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-[2rem] border border-slate-200">
                        <div className="flex items-center">
                           <BoxLabel className="bg-transparent border-0 min-w-[100px]">Client</BoxLabel>
                           <Select options={['Global Industries', 'Quantum Tech', 'Velson Overseas']} placeholder="Select Entity" value={form.cusName} onChange={u('cusName')} className="flex-1" />
                        </div>
                        <div className="flex items-center">
                           <BoxLabel className="bg-transparent border-0 min-w-[100px]">Assm Point</BoxLabel>
                           <Select options={['Assembly Line A', 'Robotic Cell B', 'Manual Station C']} placeholder="Select Cell" value={form.assembly} onChange={u('assembly')} className="flex-1" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-6 pl-10 border-l border-slate-200/50">
                        <div className="flex items-center gap-8 bg-slate-900 px-8 py-3 rounded-full shadow-xl">
                           {['Production', 'Purchase'].map(m => (
                             <label key={m} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                   type="radio" 
                                   checked={form.mode === m}
                                   onChange={() => setForm(f => ({ ...f, mode: m }))}
                                   className="w-4 h-4 accent-[#0097A7]" 
                                />
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${form.mode === m ? 'text-white' : 'text-white/30'}`}>{m} Mode</span>
                             </label>
                           ))}
                        </div>
                        <button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center justify-center gap-3 px-10 py-4 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-black rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em]"
                        >
                           {isSaving ? <RotateCcw size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                           {isSaving ? 'Launching...' : 'Generate Job Matrix'}
                        </button>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col gap-6 pl-12 border-l border-slate-200/50 relative z-10">
                  <div className="space-y-2">
                    <Label>Component Blueprint</Label>
                    <div className="aspect-square bg-white border border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-200 relative overflow-hidden group shadow-sm">
                       <Camera size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform opacity-10" />
                       <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent pointer-events-none" />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 opacity-20">3D Visualization Offline</p>
                    </div>
                  </div>
                  <div className="bg-[#0097A7]/5 border border-[#0097A7]/10 p-5 rounded-2xl">
                     <p className="text-[9px] font-black text-[#0097A7] uppercase tracking-widest mb-1">Current Capacity</p>
                     <p className="text-[18px] font-black text-slate-700 leading-none">84.2%</p>
                  </div>
               </div>
            </div>

            {/* Matrix Result Area */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-6 px-6">
                 <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#0097A7] rounded-sm" />
                    Production Job Matrix
                 </h3>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-4 py-1.5 rounded-full">{jobs.length} Active Jobs Staged</span>
                    <button className="p-2 text-slate-300 hover:text-[#0097A7] transition-colors"><LayoutGrid size={20} /></button>
                 </div>
               </div>

               <div className="border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm bg-white overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1400px]">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-5 border-r border-slate-100 w-24 text-center">Reference</th>
                       <th className="px-8 py-5 border-r border-slate-100">Customer Entity</th>
                       <th className="px-8 py-5 border-r border-slate-100">Model Configuration</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-center w-32">Qty</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-center w-40">Priority</th>
                       <th className="px-8 py-5 border-r border-slate-100 text-center">Mode</th>
                       <th className="px-8 py-5 text-center w-32">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[13px]">
                     {jobs.length === 0 ? (
                       <tr>
                         <td colSpan={7} className="py-24 text-center text-slate-200 italic">
                            <ClipboardList size={80} className="mx-auto mb-4 opacity-5" />
                            Launchpad clear. No jobs in production matrix.
                         </td>
                       </tr>
                     ) : (
                       jobs.map((job) => (
                         <tr key={job.id} className="hover:bg-[#0097A7]/5 transition-colors h-16 group">
                           <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-[#0097A7]">{job.jobNo}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-bold text-slate-700 uppercase">{job.cusName}</td>
                           <td className="px-8 py-2 border-r border-slate-50 font-medium text-slate-500">{job.model}</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center font-black text-slate-800">{job.qty} Units</td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center">
                              <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                                {job.priority}
                              </span>
                           </td>
                           <td className="px-8 py-2 border-r border-slate-50 text-center text-[10px] font-black uppercase tracking-tighter text-slate-400">{job.mode}</td>
                           <td className="px-8 py-2 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">{job.status}</span>
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
