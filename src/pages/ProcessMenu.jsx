import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Save, Trash2, X, RotateCcw, Search, FileText, CheckSquare, Square, Image as ImageIcon, Plus, Upload } from 'lucide-react'
import { useToast } from '../components/Toast'

const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider">
    {required && <span className="text-red-500 mr-0.5">*</span>}{children}
  </label>
)
const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = "" }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} readOnly={readOnly}
    className={`w-full px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} ${className}`} />
)
const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select value={value} onChange={onChange}
      className="w-full px-3 py-[7px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer">
      <option value="">{placeholder}</option>
      {options.map(o => <option key={typeof o === 'object' ? o.value : o} value={typeof o === 'object' ? o.value : o}>{typeof o === 'object' ? o.label : o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
)

const STORAGE_KEY = 'velson_process_menu'
const ITEMS = [
  'VE-70071 — CENTER SLIDER SENSING PLATE',
  'VE-70073 — CENTER SLIDER SENSING PLATE 2',
  'VE-70074 — CENTER SLIDER SENSING SHAFT 35MM',
  'VE-70075 — CENTER SLIDER SENSING SHAFT 48MM',
  'VE-70076 — CENTER SLIDER SENSING SHAFT 85MM',
  'VE-70077 — CENTER SLIDER SENSING BAR 50MM',
  'VE-70078 — ELECTRICAL CONTROL BOX BOTTOM BUSH',
  'VE-70079 — CENTER SLIDER SENSING BAR 150MM',
  'VE-70080 — COMMON WIRE SUPPORT PIECE 16MM',
]
const PROCESSES = ['CNC Turning', 'CNC Milling', 'Grinding', 'Drilling', 'Welding', 'Heat Treatment', 'Surface Finishing', 'Assembly', 'Inspection', 'Outsource']
const TEAMS = ['Team Alpha', 'Team Beta', 'Night Shift', 'Day Shift', 'QC Unit']

export default function ProcessMenu() {
  const toast = useToast()
  const [form, setForm] = useState({
    jobNo: '', barcode: '', itemName: '',
    planeDate: new Date().toISOString().split('T')[0],
  })
  const [processes, setProcesses] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [savedRecords, setSavedRecords] = useState([])
  const [activeTab, setActiveTab] = useState('check')
  const [drawingList, setDrawingList] = useState([])

  // Bottom bar state
  const [processName, setProcessName] = useState('')
  const [team, setTeam] = useState('')
  const [isOutsource, setIsOutsource] = useState(false)
  const [partImage, setPartImage] = useState(null)
  const imgInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPartImage(ev.target.result)
      reader.readAsDataURL(file)
    }
  }
  const clearImage = () => { setPartImage(null); if (imgInputRef.current) imgInputRef.current.value = '' }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setSavedRecords(saved)
  }, [])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // When job number is entered, simulate loading processes
  const handleLoadJob = () => {
    if (!form.jobNo) { toast.warning('Please enter a Job No.'); return }
    const demoProcesses = PROCESSES.slice(0, Math.floor(Math.random() * 5) + 3).map((p, i) => ({
      id: Date.now() + i, name: p, sequence: i + 1,
      machine: 'MCH-' + String(100 + i).padStart(3, '0'),
      cycleTime: Math.floor(Math.random() * 60) + 5,
      status: Math.random() > 0.5 ? 'Completed' : 'Pending',
      checked: false,
    }))
    setProcesses(demoProcesses)
    setDrawingList(['DWG-' + form.jobNo + '-01.pdf', 'DWG-' + form.jobNo + '-02.pdf'])
    setSelectedIds(new Set())
    setSelectAll(false)
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(processes.map(p => p.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleSave = () => {
    if (!form.jobNo || !form.itemName) { toast.warning('Please fill Job No and Item Name.'); return }
    const record = {
      ...form, processes, processName, team, isOutsource,
      id: Date.now(), savedAt: new Date().toISOString(),
    }
    const updated = [record, ...savedRecords]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedRecords(updated)
    toast.success('Process Menu saved successfully!')
    handleClear()
  }

  const handleDeleteAll = () => {
    if (selectedIds.size === 0) { toast.warning('Please select processes to delete.'); return }
    setProcesses(prev => prev.filter(p => !selectedIds.has(p.id)))
    setSelectedIds(new Set())
    setSelectAll(false)
    toast.success(selectedIds.size + ' process(es) removed.')
  }

  const handleOutsourceAdd = () => {
    if (!processName) { toast.warning('Please select a Process Name.'); return }
    const newProc = {
      id: Date.now(), name: processName, sequence: processes.length + 1,
      machine: 'OUTSRC', cycleTime: 0,
      status: 'Pending', checked: false, outsource: true, team,
    }
    setProcesses(prev => [...prev, newProc])
    toast.success('Outsource process added.')
  }

  const handleClear = () => {
    setForm({ jobNo: '', barcode: '', itemName: '', planeDate: new Date().toISOString().split('T')[0] })
    setProcesses([])
    setSelectedIds(new Set())
    setSelectAll(false)
    setDrawingList([])
    setProcessName('')
    setTeam('')
    setIsOutsource(false)
    clearImage()
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span><ChevronRight size={12} /><span>Technical</span><ChevronRight size={12} /><span className="text-[#0097A7]">Process Menu</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Process Menu</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm"><RotateCcw size={14} /> Clear</button>
              <button className="text-slate-400 hover:text-red-600 transition-colors ml-1"><X size={20} strokeWidth={2.5} /></button>
            </div>
          </div>

          <div className="p-5">
            {/* ── Top Form Row ── */}
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-2">
                <Label required>Job No</Label>
                <div className="flex gap-1">
                  <Input value={form.jobNo} onChange={u('jobNo')} placeholder="Enter Job No..." />
                  <button onClick={handleLoadJob} className="px-2 py-[7px] bg-[#0097A7] hover:bg-[#007a87] text-white rounded-lg transition-all active:scale-95" title="Load Job">
                    <Search size={14} />
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <Label>Barcode</Label>
                <Input value={form.barcode} onChange={u('barcode')} placeholder="Scan barcode..." />
              </div>
              <div className="col-span-3">
                <Label required>Item Name</Label>
                <Select options={ITEMS} value={form.itemName} onChange={u('itemName')} placeholder="Select Item..." />
              </div>
              <div className="col-span-2">
                <Label>Plane Date</Label>
                <Input type="date" value={form.planeDate} onChange={u('planeDate')} />
              </div>
              <div className="col-span-3 flex items-end gap-2 justify-end">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-[7px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded-lg transition-all shadow-md active:scale-95"><Save size={14} /> Save</button>
                <button onClick={handleSelectAll} className="flex items-center gap-1.5 px-3 py-[7px] bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm">
                  {selectAll ? <CheckSquare size={14} className="text-[#0097A7]" /> : <Square size={14} />} Select All
                </button>
                <button onClick={handleDeleteAll} className="flex items-center gap-1.5 px-3 py-[7px] bg-white hover:bg-red-50 text-red-600 text-[12px] font-bold rounded-lg border border-red-200 transition-all shadow-sm"><Trash2 size={14} /> Delete All</button>
              </div>
            </div>

            {/* ── Main Content Area ── */}
            <div className="grid grid-cols-12 gap-4 mt-5">
              {/* Left: Process Table */}
              <div className="col-span-9">
                {/* Tab */}
                <div className="flex gap-1 mb-0">
                  <button
                    onClick={() => setActiveTab('check')}
                    className={`px-4 py-2 text-[12px] font-bold rounded-t-lg border border-b-0 transition-all ${activeTab === 'check' ? 'bg-white text-[#0097A7] border-slate-200' : 'bg-slate-100 text-slate-400 border-transparent hover:text-slate-600'}`}
                  >Check</button>
                </div>

                <div className="border border-slate-200 rounded-b-xl rounded-tr-xl overflow-hidden shadow-sm min-h-[350px] bg-white">
                  {processes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-slate-300">
                      <FileText size={48} strokeWidth={1} className="mb-3 opacity-30" />
                      <p className="text-[12px] font-bold uppercase tracking-widest">No processes loaded</p>
                      <p className="text-[11px] text-slate-400 mt-1">Enter a Job No and click search to load processes</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#e3f2fd] text-[11px] uppercase text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-3 border-r border-slate-200 w-10 text-center">
                            <button onClick={handleSelectAll}>
                              {selectAll ? <CheckSquare size={14} className="text-[#0097A7]" /> : <Square size={14} className="text-slate-400" />}
                            </button>
                          </th>
                          <th className="px-3 py-3 border-r border-slate-200 w-12 text-center">Seq</th>
                          <th className="px-3 py-3 border-r border-slate-200">Process Name</th>
                          <th className="px-3 py-3 border-r border-slate-200">Machine</th>
                          <th className="px-3 py-3 border-r border-slate-200 w-24 text-center">Cycle Time</th>
                          <th className="px-3 py-3 w-24 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {processes.map(p => (
                          <tr key={p.id} className={`hover:bg-slate-50 transition-colors h-10 ${selectedIds.has(p.id) ? 'bg-[#0097A7]/5' : ''}`}>
                            <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                              <button onClick={() => toggleSelect(p.id)}>
                                {selectedIds.has(p.id) ? <CheckSquare size={14} className="text-[#0097A7]" /> : <Square size={14} className="text-slate-300" />}
                              </button>
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400 font-bold text-[12px]">{p.sequence}</td>
                            <td className="px-3 py-1.5 border-r border-slate-200 text-[12px] font-semibold text-slate-700">
                              {p.name}
                              {p.outsource && <span className="ml-2 text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase">Outsource</span>}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 text-[12px] text-slate-500 font-mono">{p.machine}</td>
                            <td className="px-3 py-1.5 border-r border-slate-200 text-center text-[12px] text-slate-600">{p.cycleTime}s</td>
                            <td className="px-3 py-1.5 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Right: Part Image + Drawing List */}
              <div className="col-span-3 space-y-4">
                <div>
                  <Label>Part Image</Label>
                  <input ref={imgInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {partImage ? (
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <img src={partImage} alt="Part" className="w-full h-[140px] object-contain p-2" />
                      <button onClick={clearImage} className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-red-50 rounded-full p-0.5 text-slate-400 hover:text-red-600 transition-all shadow-sm"><X size={14} /></button>
                      <button onClick={() => imgInputRef.current?.click()} className="absolute bottom-1.5 right-1.5 bg-white/90 hover:bg-[#0097A7]/10 rounded-full p-1 text-slate-400 hover:text-[#0097A7] transition-all shadow-sm"><Upload size={12} /></button>
                    </div>
                  ) : (
                    <div onClick={() => imgInputRef.current?.click()} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center py-10 text-slate-300 hover:border-[#0097A7] hover:bg-[#0097A7]/5 transition-all cursor-pointer group">
                      <ImageIcon size={32} strokeWidth={1.2} className="group-hover:text-[#0097A7] transition-colors" />
                      <p className="text-[10px] font-black mt-2 uppercase tracking-widest text-slate-400 group-hover:text-[#0097A7]">Click to upload</p>
                    </div>
                  )}
                </div>

                {/* Drawing List */}
                <div>
                  <Label>Drawing List</Label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white min-h-[180px]">
                    {drawingList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                        <FileText size={24} strokeWidth={1.2} className="opacity-30" />
                        <p className="text-[10px] font-bold mt-1 uppercase tracking-widest text-slate-400">No drawings</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {drawingList.map((d, i) => (
                          <div key={i} className="px-3 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <FileText size={14} className="text-[#0097A7] flex-shrink-0" />
                            <span className="text-[11px] font-semibold text-slate-600 group-hover:text-[#0097A7] truncate">{d}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom Bar: Process / Team / Outsource ── */}
            <div className="mt-5 flex items-center gap-4 bg-[#e3f2fd] p-3 rounded-lg border border-sky-200">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase whitespace-nowrap">Process Name :</span>
                <Select options={PROCESSES} value={processName} onChange={e => setProcessName(e.target.value)} placeholder="Select..." className="w-44" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase whitespace-nowrap">Team :</span>
                <Select options={TEAMS} value={team} onChange={e => setTeam(e.target.value)} placeholder="Select..." className="w-40" />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={isOutsource} onChange={e => setIsOutsource(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-[#0097A7] focus:ring-[#0097A7]" />
                <span className="text-[11px] font-bold text-slate-700 uppercase">Outsources</span>
              </label>
              <button onClick={handleOutsourceAdd} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95 ml-auto">
                <Plus size={13} /> Outsource Add
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ready</p>
              <p className="text-[10px] text-red-500 font-bold">* Are Mandatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
