import { useState, useEffect } from 'react'
import { 
  ChevronRight, Save, X, Search, Edit, Trash2, Eraser, 
  FileSpreadsheet, ChevronUp, Wrench, AlertTriangle, User, Calendar,
  RotateCcw, Plus, Activity, RefreshCw
} from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-0 uppercase tracking-wider whitespace-nowrap">
    {required && <span className="text-red-500 mr-1">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = "", ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full px-2 py-0.5 text-[12px] border border-slate-300 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} shadow-sm ${className}`}
    {...props}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative group ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-2 py-0.5 pr-6 text-[12px] border border-slate-300 rounded bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer shadow-sm font-bold"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center group-hover:text-[#0097A7] transition-colors">
      <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

const TextArea = ({ placeholder, value, onChange, className = "", rows = 2 }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-2 py-1 text-[12px] border border-slate-300 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0097A7] transition-all duration-200 hover:border-slate-300 resize-none shadow-sm ${className}`}
  />
)

const ActionButton = ({ onClick, children, className = "", color = "slate" }) => {
  const styles = {
    amber: "text-[#f57c00]",
    emerald: "text-[#2e7d32]",
    rose: "text-[#c62828]",
    slate: "text-slate-600",
    blue: "text-blue-600"
  }
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1 flex items-center gap-1 text-[11px] font-black uppercase transition-all active:scale-95 hover:bg-slate-50 rounded ${styles[color] || styles.slate} ${className}`}
    >
      {children}
    </button>
  )
}

export default function MachineBreakDown() {
  const [form, setForm] = useState({
    machineName: '',
    jobCardNo: '',
    partNo: '',
    processStage: '',
    location: '',
    date: '15-Apr-2026 02:48 PM',
    mwrNo: '4',
    reportedBy: 'admin',
    priority: '',
    problemDescription: '',
    status: 'Pending'
  })

  const [breakdowns, setBreakdowns] = useState([])
  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    const entry = { ...form, id: Date.now() }
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    const updated = [entry, ...saved]
    localStorage.setItem('velson_breakdowns', JSON.stringify(updated))
    setBreakdowns(updated)
    handleReset()
    alert('Breakdown ticket registered.')
  }

  const handleReset = () => {
    setForm({
      ...form,
      machineName: '',
      jobCardNo: '',
      partNo: '',
      problemDescription: '',
      location: '',
      mwrNo: (parseInt(form.mwrNo) + 1).toString()
    })
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_breakdowns') || '[]')
    setBreakdowns(saved)
  }, [])

  return (
    <div className="bg-[#fcfdfe] min-h-screen">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-red-700 rounded-sm" />
           <h1 className="text-[12px] font-bold text-slate-700 uppercase tracking-tight">Machine BreakDown</h1>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-0.5 rounded transition-colors">
              <FileSpreadsheet size={14} /> Excel
           </button>
           <button onClick={() => window.history.back()} className="bg-rose-500 hover:bg-rose-600 text-white p-1 rounded transition-colors shadow-sm">
              <X size={16} strokeWidth={3} />
           </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Entry Section */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-6 shadow-sm">
           <div className="grid grid-cols-12 gap-x-12 gap-y-4">
              {/* Left Column */}
              <div className="col-span-5 space-y-3">
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-4 text-right"><Label required>Machine Name :</Label></div>
                   <div className="col-span-8"><Select options={['CNC-01', 'VMC-02']} placeholder="" value={form.machineName} onChange={u('machineName')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-4 text-right"><Label>Job Card No :</Label></div>
                   <div className="col-span-8"><Select options={['JC-001', 'JC-002']} placeholder="" value={form.jobCardNo} onChange={u('jobCardNo')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-4 text-right"><Label required>Part No :</Label></div>
                   <div className="col-span-8"><Select options={['P-001', 'P-002']} placeholder="" value={form.partNo} onChange={u('partNo')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-4 text-right"><Label>Process Stage :</Label></div>
                   <div className="col-span-8"><Select options={['Setup', 'Production']} placeholder="" value={form.processStage} onChange={u('processStage')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-4 text-right"><Label>Location :</Label></div>
                   <div className="col-span-8"><Input value={form.location} onChange={u('location')} /></div>
                 </div>
              </div>

              {/* Right Column */}
              <div className="col-span-7 space-y-3">
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-3 text-right"><Label>Date :</Label></div>
                   <div className="col-span-5 flex items-center gap-1">
                      <Select options={['15-Apr-2026 02:48 PM']} value={form.date} onChange={u('date')} className="flex-1" />
                      <div className="w-6 h-6 border border-slate-300 rounded flex items-center justify-center bg-white shadow-sm"><Calendar size={12} className="text-slate-400" /></div>
                   </div>
                   <div className="col-span-2 text-right"><Label>MWR No :</Label></div>
                   <div className="col-span-2"><Input value={form.mwrNo} onChange={u('mwrNo')} className="font-bold text-[#0097A7]" /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-3 text-right"><Label>Reported By :</Label></div>
                   <div className="col-span-9"><Input value={form.reportedBy} onChange={u('reportedBy')} className="font-bold text-slate-500" /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                   <div className="col-span-3 text-right"><Label>Priority :</Label></div>
                   <div className="col-span-9"><Select options={['Minor', 'Critical', 'Production Stop']} placeholder="" value={form.priority} onChange={u('priority')} /></div>
                 </div>
                 <div className="grid grid-cols-12 gap-2">
                   <div className="col-span-3 text-right pt-1"><Label>Problem Description :</Label></div>
                   <div className="col-span-9"><TextArea value={form.problemDescription} onChange={u('problemDescription')} rows={3} /></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="bg-slate-700 p-2 rounded-lg flex items-center justify-between shadow-lg">
           <div className="flex items-center gap-2 bg-white rounded px-2 py-1 w-[400px]">
              <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2">
                 <div className="w-3 h-2 bg-red-700 rounded-sm relative">
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 border-l-[6px] border-l-red-700 border-y-[4px] border-y-transparent" />
                 </div>
                 <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Search</span>
              </div>
              <div className="flex-1 relative">
                <input type="text" className="w-full px-2 py-0.5 text-[12px] border-none focus:ring-0" placeholder="Query MWR / Machine..." />
                <Search size={14} className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
           </div>
           
           <div className="flex items-center gap-4 pr-2 text-white">
              <ActionButton onClick={handleSave} color="slate" className="!text-white hover:!bg-white/10"><Save size={14} /> Save</ActionButton>
              <ActionButton color="slate" className="!text-white hover:!bg-white/10"><Edit size={14} /> Edit</ActionButton>
              <ActionButton color="rose" className="hover:!bg-rose-500/20"><Trash2 size={14} /> Delete</ActionButton>
              <ActionButton onClick={handleReset} color="amber" className="hover:!bg-amber-500/20"><Eraser size={14} /> Clear</ActionButton>
           </div>
        </div>

        {/* Results Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white min-h-[400px]">
           <table className="w-full text-left border-collapse min-w-[1800px]">
              <thead className="bg-[#f8fafc] text-[10px] uppercase text-slate-500 font-bold border-b border-slate-300">
                 <tr className="divide-x divide-slate-300">
                    <th className="px-3 py-2 w-16 text-center">ID</th>
                    <th className="px-3 py-2">MachineName</th>
                    <th className="px-3 py-2">Job Card No</th>
                    <th className="px-3 py-2">Item_Name</th>
                    <th className="px-3 py-2">Process_Stage</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Mode_Of_Report</th>
                    <th className="px-3 py-2">ReportedBy</th>
                    <th className="px-3 py-2 text-center">Priority</th>
                    <th className="px-3 py-2">ProbemDescription</th>
                    <th className="px-3 py-2 text-center">Date</th>
                    <th className="px-3 py-2 text-center">User</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                 {breakdowns.length === 0 ? (
                    [...Array(10)].map((_, i) => (
                      <tr key={i} className="h-9 hover:bg-slate-50 divide-x divide-slate-200 text-transparent select-none">
                        <td className="px-3 py-1 text-center text-slate-200 font-bold select-auto">{i + 1}</td>
                        {[...Array(11)].map((_, j) => <td key={j} className="px-3 py-1">.</td>)}
                      </tr>
                    ))
                 ) : (
                    breakdowns.map((b, idx) => (
                       <tr key={b.id} className="hover:bg-[#f0f9fa]/40 transition-colors h-10 text-[12px] divide-x divide-slate-100 group">
                          <td className="px-3 py-1 text-center text-slate-300 font-bold">{b.mwrNo}</td>
                          <td className="px-3 py-1 font-bold text-[#0097A7] uppercase">{b.machineName}</td>
                          <td className="px-3 py-1">{b.jobCardNo}</td>
                          <td className="px-3 py-1 font-medium">{b.partNo}</td>
                          <td className="px-3 py-1">{b.processStage}</td>
                          <td className="px-3 py-1 text-slate-400">{b.location}</td>
                          <td className="px-3 py-1 text-center">-</td>
                          <td className="px-3 py-1">{b.reportedBy}</td>
                          <td className="px-3 py-1 text-center">
                             <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                {b.priority || 'Standard'}
                             </span>
                          </td>
                          <td className="px-3 py-1 text-slate-400 italic">{b.problemDescription}</td>
                          <td className="px-3 py-1 text-center text-slate-400">{b.date}</td>
                          <td className="px-3 py-1 text-center text-slate-300">admin</td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
