import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Save, Trash2, X, Plus, RotateCcw, Search, FileText, Image as ImageIcon, Upload } from 'lucide-react'
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

const STORAGE_KEY = 'velson_job_card_entries'
const PRODUCTS = [
  { value: 'VE-70071', label: 'VE-70071 — CENTER SLIDER SENSING PLATE' },
  { value: 'VE-70073', label: 'VE-70073 — CENTER SLIDER SENSING PLATE 2' },
  { value: 'VE-70074', label: 'VE-70074 — CENTER SLIDER SENSING SHAFT 35MM' },
  { value: 'VE-70075', label: 'VE-70075 — CENTER SLIDER SENSING SHAFT 48MM' },
  { value: 'VE-70076', label: 'VE-70076 — CENTER SLIDER SENSING SHAFT 85MM' },
  { value: 'VE-70077', label: 'VE-70077 — CENTER SLIDER SENSING BAR 50MM' },
  { value: 'VE-70078', label: 'VE-70078 — ELECTRICAL CONTROL BOX BOTTOM BUSH 25x10x40' },
  { value: 'VE-70079', label: 'VE-70079 — CENTER SLIDER SENSING BAR 150MM' },
  { value: 'VE-70080', label: 'VE-70080 — COMMON WIRE SUPPORT PIECE 16MM' },
]
const MODELS = ['Model A', 'Model B', 'Model C']
const PRIORITIES = ['High', 'Medium', 'Low']
const UNITS = ['Nos', 'Kg', 'Mtr', 'Set', 'Pair', 'Ltr']

let nextJobNo = 31450

export default function JobCardEntry() {
  const toast = useToast()
  const [form, setForm] = useState({
    jobNo: String(nextJobNo),
    model: '', qtyV: '', currentDate: new Date().toISOString().split('T')[0],
    product: '', priority: '', requiredDate: new Date().toISOString().split('T')[0],
    note: '', mrNo: '',
  })
  const [lineItems, setLineItems] = useState([{ id: 1, partNo: '', partName: '', planQty: '', rmIssueQty: '', unit: '', notes: '' }])
  const [savedJobs, setSavedJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [partImage, setPartImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPartImage(ev.target.result)
      reader.readAsDataURL(file)
    }
  }
  const clearImage = () => {
    setPartImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setSavedJobs(saved)
    if (saved.length) { const max = Math.max(...saved.map(j => parseInt(j.jobNo) || 0)); nextJobNo = max + 1 }
    setForm(f => ({ ...f, jobNo: String(nextJobNo) }))
  }, [])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleProductChange = (e) => {
    const val = e.target.value
    const prod = PRODUCTS.find(p => p.value === val)
    setForm(f => ({ ...f, product: val }))
    if (prod && lineItems.length > 0) {
      const updated = [...lineItems]
      const empty = updated.findIndex(li => !li.partNo)
      const idx = empty >= 0 ? empty : updated.length - 1
      updated[idx] = { ...updated[idx], partNo: prod.value, partName: prod.label.split(' — ')[1] || '' }
      setLineItems(updated)
    }
  }

  const addLine = () => setLineItems(prev => [...prev, { id: Date.now(), partNo: '', partName: '', planQty: '', rmIssueQty: '', unit: '', notes: '' }])
  const removeLine = (id) => setLineItems(prev => prev.length > 1 ? prev.filter(l => l.id !== id) : prev)
  const updateLine = (id, key, val) => setLineItems(prev => prev.map(l => l.id === id ? { ...l, [key]: val } : l))

  const handleSave = () => {
    if (!form.product) { toast.warning('Please select a Product.'); return }
    const job = { ...form, partImage, lineItems: lineItems.filter(l => l.partNo), savedAt: new Date().toISOString(), id: Date.now() }
    const updated = [job, ...savedJobs]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedJobs(updated)
    nextJobNo++
    handleClear()
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this job card?')) return
    const updated = savedJobs.filter(j => j.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedJobs(updated)
  }

  const handleClear = () => {
    setForm({ jobNo: String(nextJobNo), model: '', qtyV: '', currentDate: new Date().toISOString().split('T')[0], product: '', priority: '', requiredDate: new Date().toISOString().split('T')[0], note: '', mrNo: '' })
    setLineItems([{ id: Date.now(), partNo: '', partName: '', planQty: '', rmIssueQty: '', unit: '', notes: '' }])
    clearImage()
  }

  const filtered = savedJobs.filter(j => {
    if (!searchTerm) return true
    const q = searchTerm.toLowerCase()
    return j.jobNo?.toLowerCase().includes(q) || j.product?.toLowerCase().includes(q) || j.model?.toLowerCase().includes(q)
  })

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span><ChevronRight size={12} /><span>Technical</span><ChevronRight size={12} /><span className="text-[#0097A7]">Job Card Entry</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Job Entry</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm"><RotateCcw size={14} /> Clear</button>
              <button className="text-slate-400 hover:text-red-600 transition-colors ml-1"><X size={20} strokeWidth={2.5} /></button>
            </div>
          </div>

          <div className="p-6">
            {/* ── Row 1: Job No, Model, Qty, Date ── */}
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-2">
                <Label required>Job No</Label>
                <Input value={form.jobNo} readOnly className="!font-bold text-[#0097A7]" />
              </div>
              <div className="col-span-3">
                <Label>Model</Label>
                <Select options={MODELS} value={form.model} onChange={u('model')} placeholder="Select Model..." />
              </div>
              <div className="col-span-2">
                <Label>Qty / V</Label>
                <Input type="number" value={form.qtyV} onChange={u('qtyV')} placeholder="0" />
              </div>
              <div className="col-span-2">
                <Label>Current Date</Label>
                <Input type="date" value={form.currentDate} onChange={u('currentDate')} />
              </div>
              <div className="col-span-3 flex gap-2 justify-end">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-[7px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded-lg transition-all shadow-md active:scale-95"><Save size={14} /> Save</button>
                <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-[7px] bg-white hover:bg-red-50 text-red-600 text-[12px] font-bold rounded-lg border border-red-200 transition-all shadow-sm active:scale-95"><Trash2 size={14} /> Delete</button>
              </div>
            </div>

            {/* ── Row 2: Product, Priority, Required Date, Part Image ── */}
            <div className="grid grid-cols-12 gap-4 items-end mt-4">
              <div className="col-span-4">
                <Label required>Product</Label>
                <Select options={PRODUCTS} value={form.product} onChange={handleProductChange} placeholder="Select Product..." />
              </div>
              <div className="col-span-2">
                <Label>Priority</Label>
                <Select options={PRIORITIES} value={form.priority} onChange={u('priority')} placeholder="Select..." />
              </div>
              <div className="col-span-2">
                <Label>Required Date</Label>
                <Input type="date" value={form.requiredDate} onChange={u('requiredDate')} />
              </div>
              <div className="col-span-4">
                <Label>Part Image</Label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {partImage ? (
                  <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group">
                    <img src={partImage} alt="Part" className="w-full h-[90px] object-contain p-1" />
                    <button onClick={clearImage} className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 rounded-full p-0.5 text-slate-400 hover:text-red-600 transition-all shadow-sm"><X size={14} /></button>
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-white/90 hover:bg-[#0097A7]/10 rounded-full p-1 text-slate-400 hover:text-[#0097A7] transition-all shadow-sm"><Upload size={12} /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center py-4 gap-2 text-slate-300 hover:border-[#0097A7] hover:bg-[#0097A7]/5 transition-all cursor-pointer group">
                    <ImageIcon size={22} strokeWidth={1.5} className="group-hover:text-[#0097A7] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#0097A7]">Click to upload</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 3: Note, MR No ── */}
            <div className="grid grid-cols-12 gap-4 items-end mt-4 bg-[#e8f5e9] p-3 rounded-lg border border-green-200">
              <div className="col-span-2 text-[11px] font-bold text-green-800 uppercase">Note</div>
              <div className="col-span-6">
                <Input value={form.note} onChange={u('note')} placeholder="Enter notes..." />
              </div>
              <div className="col-span-1 text-[11px] font-bold text-green-800 uppercase text-right">MR No.</div>
              <div className="col-span-3">
                <Input value={form.mrNo} onChange={u('mrNo')} placeholder="Material Request No..." />
              </div>
            </div>

            {/* ── Line Items Table ── */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-[#0097A7] pl-3">Line Items</h3>
                <button onClick={addLine} className="flex items-center gap-1 px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95"><Plus size={13} /> Add Row</button>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#e3f2fd] text-[11px] uppercase text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-3 border-r border-slate-200 w-10 text-center"></th>
                      <th className="px-3 py-3 border-r border-slate-200 w-12 text-center">S.No</th>
                      <th className="px-3 py-3 border-r border-slate-200">Part No</th>
                      <th className="px-3 py-3 border-r border-slate-200">Part Name</th>
                      <th className="px-3 py-3 border-r border-slate-200 w-24">Plan Qty</th>
                      <th className="px-3 py-3 border-r border-slate-200 w-24">RM Issue Qty</th>
                      <th className="px-3 py-3 border-r border-slate-200 w-20">Unit</th>
                      <th className="px-3 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lineItems.map((li, idx) => (
                      <tr key={li.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-2 py-1.5 border-r border-slate-200 text-center">
                          <button onClick={() => removeLine(li.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={13} /></button>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200 text-center text-slate-400 font-bold text-[12px]">{idx + 1}</td>
                        <td className="px-2 py-1.5 border-r border-slate-200">
                          <input value={li.partNo} onChange={e => updateLine(li.id, 'partNo', e.target.value)} placeholder="Part No..."
                            className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded bg-white focus:outline-none focus:border-[#0097A7]" />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200">
                          <input value={li.partName} onChange={e => updateLine(li.id, 'partName', e.target.value)} placeholder="Part Name..."
                            className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded bg-white focus:outline-none focus:border-[#0097A7]" />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200">
                          <input type="number" value={li.planQty} onChange={e => updateLine(li.id, 'planQty', e.target.value)} placeholder="0"
                            className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded bg-white focus:outline-none focus:border-[#0097A7] text-center" />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200">
                          <input type="number" value={li.rmIssueQty} onChange={e => updateLine(li.id, 'rmIssueQty', e.target.value)} placeholder="0"
                            className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded bg-white focus:outline-none focus:border-[#0097A7] text-center" />
                        </td>
                        <td className="px-2 py-1.5 border-r border-slate-200">
                          <select value={li.unit} onChange={e => updateLine(li.id, 'unit', e.target.value)}
                            className="w-full px-1 py-1 text-[12px] border border-slate-200 rounded bg-white focus:outline-none focus:border-[#0097A7]">
                            <option value="">--</option>
                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input value={li.notes} onChange={e => updateLine(li.id, 'notes', e.target.value)} placeholder="Notes..."
                            className="w-full px-2 py-1 text-[12px] border border-slate-200 rounded bg-white focus:outline-none focus:border-[#0097A7]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Saved Job Cards Table ── */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-[#0097A7] pl-3">Saved Job Cards</h3>
                  <span className="bg-[#0097A7]/10 text-[#0097A7] px-2 py-0.5 rounded text-[10px] font-bold">{filtered.length} Records</span>
                </div>
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search jobs..."
                    className="w-full pl-9 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7]" />
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#fcfdfe] text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 border-r border-slate-200 w-14 text-center">S.No</th>
                      <th className="px-4 py-3 border-r border-slate-200">Job No</th>
                      <th className="px-4 py-3 border-r border-slate-200">Product</th>
                      <th className="px-4 py-3 border-r border-slate-200">Model</th>
                      <th className="px-4 py-3 border-r border-slate-200 text-center">Qty</th>
                      <th className="px-4 py-3 border-r border-slate-200">Priority</th>
                      <th className="px-4 py-3 border-r border-slate-200">Date</th>
                      <th className="px-4 py-3 border-r border-slate-200 text-center">Parts</th>
                      <th className="px-4 py-3 text-center w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9} className="py-16 text-center text-slate-300 italic text-sm">
                        <FileText size={36} className="mx-auto mb-2 opacity-20" />No job cards found.
                      </td></tr>
                    ) : filtered.map((job, idx) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors h-11">
                        <td className="px-4 py-2 border-r border-slate-200 text-center text-slate-400 font-bold text-[12px]">{idx + 1}</td>
                        <td className="px-4 py-2 border-r border-slate-200 font-bold text-[#0097A7] text-[12px]">{job.jobNo}</td>
                        <td className="px-4 py-2 border-r border-slate-200 text-slate-700 text-[12px] font-semibold">{PRODUCTS.find(p => p.value === job.product)?.label.split(' — ')[1] || job.product}</td>
                        <td className="px-4 py-2 border-r border-slate-200 text-slate-600 text-[12px]">{job.model || '—'}</td>
                        <td className="px-4 py-2 border-r border-slate-200 text-center text-slate-600 text-[12px]">{job.qtyV || '—'}</td>
                        <td className="px-4 py-2 border-r border-slate-200 text-[12px]">
                          {job.priority ? <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${job.priority === 'High' ? 'bg-red-100 text-red-700' : job.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{job.priority}</span> : '—'}
                        </td>
                        <td className="px-4 py-2 border-r border-slate-200 text-slate-500 text-[12px]">{job.currentDate}</td>
                        <td className="px-4 py-2 border-r border-slate-200 text-center text-[12px]">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{job.lineItems?.length || 0}</span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button onClick={() => handleDelete(job.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

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
