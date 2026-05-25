import { useState, useEffect } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight, Search, Settings2 } from 'lucide-react'
import { useToast } from '../components/Toast'

const PAGE_SIZES = [4, 10, 25, 50]

const PROCESS_TYPES = ['Machining', 'Welding', 'Assembly', 'Inspection', 'Heat Treatment', 'Surface Finishing', 'Fabrication']
const TEAMS = ['Team Alpha', 'Team Beta', 'Night Shift', 'Day Shift', 'QC Unit']
const MACHINE_LIST = [
  { code: 'MCH-001', name: 'Precision CNC' },
  { code: 'MCH-002', name: 'VMC Master' },
  { code: 'MCH-003', name: 'Radial Precision' },
]

const empty = {
  PM_Part_Name: '', PM_Process_Name: '', PM_Process_Name1: '',
  PM_Process_Order: '', TeamId: '', Machine_Code: '', Machine_Name: '',
  PM_Days: '', PM_Hours: '', Minutes: '',
  Setting_Time: '', Cycle_Time: '', Handling_Time: '', Idle_Time: '',
}

const today = () => new Date().toISOString().slice(0, 10)

export default function ProcessMaster() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ ...empty })
  const [editId, setEditId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(4)
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_process_master') || '[]')
    setRows(saved)
  }, [])

  const sf = (k, v) => {
    if (k === 'Machine_Code') {
      const m = MACHINE_LIST.find(x => x.code === v)
      setForm(f => ({ ...f, Machine_Code: v, Machine_Name: m ? m.name : '' }))
    } else {
      setForm(f => ({ ...f, [k]: v }))
    }
  }

  const handleSave = () => {
    if (!form.PM_Part_Name.trim()) { toast.warning('Part Name is required.'); return }
    if (!form.PM_Process_Name) { toast.warning('Process Name is required.'); return }
    setIsSaving(true)
    setTimeout(() => {
      let updated
      if (editId !== null) {
        updated = rows.map(r => r.id === editId ? { ...r, ...form, id: editId } : r)
      } else {
        updated = [...rows, { ...form, id: Date.now(), CreatedDate: today(), CreatedBy: 'Admin' }]
      }
      localStorage.setItem('velson_process_master', JSON.stringify(updated))
      setRows(updated)
      setIsSaving(false)
      toast.success(editId ? 'Process Updated.' : 'Process Created.')
      handleClear()
      setPage(1)
    }, 400)
  }

  const handleEdit = r => { setForm({ ...r }); setEditId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = id => {
    if (!window.confirm('Delete this process?')) return
    const next = rows.filter(r => r.id !== id)
    setRows(next)
    localStorage.setItem('velson_process_master', JSON.stringify(next))
  }
  const handleClear = () => { setForm({ ...empty }); setEditId(null) }

  const filtered = rows.filter(r =>
    [r.PM_Part_Name, r.PM_Process_Name, r.PM_Process_Name1, r.TeamId, r.Machine_Name, r.Machine_Code].some(v =>
      String(v || '').toLowerCase().includes(search.toLowerCase())
    )
  )
  const total = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const pNums = () => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const ps = [1]
    if (page > 3) ps.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) ps.push(i)
    if (page < total - 2) ps.push('...')
    ps.push(total)
    return ps
  }

  const inp = (err) =>
    `w-full border rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 transition-all bg-white ${err
      ? 'border-red-400 focus:ring-red-200'
      : 'border-slate-300 focus:ring-[#0097A7]/30 focus:border-[#0097A7]'
    }`
  const lbl = 'block text-[12px] font-semibold text-slate-600 mb-0.5'

  const COLS = ['#', 'Process Name', 'Process Name1', 'Process Order', 'Team', 'Machine Name',
    'Days', 'Hours', 'Minutes', 'Setting Time', 'Cycle Time', 'Handling Time', 'Idle Time',
    'Created By', 'Edit', 'Delete', 'Details']

  return (
    <div className="p-5 space-y-5 w-full min-w-0 bg-slate-50 min-h-screen">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
        {/* <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight className="w-3 h-3" /> */}
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Masters</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0097A7] font-semibold">Process Master</span>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-5 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-white font-semibold text-[14px] tracking-wide">
            {editId !== null ? 'Edit' : 'Create'} — Process Master Details
          </h2>
          {editId !== null && (
            <span className="ml-auto text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium">
              Editing ID #{editId}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-0">

            {/* Column 1 */}
            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <div>
                <label className={lbl}><span className="text-red-500">*</span> Part Name</label>
                <input value={form.PM_Part_Name} onChange={e => sf('PM_Part_Name', e.target.value)} placeholder="Enter part name" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}><span className="text-red-500">*</span> Process Name</label>
                <select value={form.PM_Process_Name} onChange={e => sf('PM_Process_Name', e.target.value)} className={inp(false)}>
                  <option value="">---Select Process Type---</option>
                  {PROCESS_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Process Name 1</label>
                <input value={form.PM_Process_Name1} onChange={e => sf('PM_Process_Name1', e.target.value)} placeholder="Alias / shortname" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Team</label>
                <select value={form.TeamId} onChange={e => sf('TeamId', e.target.value)} className={inp(false)}>
                  <option value="">---Select Team---</option>
                  {TEAMS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Machine Code</label>
                <select value={form.Machine_Code} onChange={e => sf('Machine_Code', e.target.value)} className={inp(false)}>
                  <option value="">---Select Machine---</option>
                  {MACHINE_LIST.map(m => <option key={m.code} value={m.code}>{m.code}</option>)}
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <div>
                <label className={lbl}>Process Order</label>
                <input type="number" value={form.PM_Process_Order} onChange={e => sf('PM_Process_Order', e.target.value)} placeholder="e.g. 1" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Machine Name</label>
                <input value={form.Machine_Name} readOnly placeholder="Auto-filled" className={`${inp(false)} bg-slate-50 cursor-not-allowed text-slate-500`} />
              </div>
              <div>
                <label className={lbl}>Days</label>
                <input type="number" value={form.PM_Days} onChange={e => sf('PM_Days', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Hours</label>
                <input type="number" value={form.PM_Hours} onChange={e => sf('PM_Hours', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Minutes</label>
                <input type="number" value={form.Minutes} onChange={e => sf('Minutes', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
            </div>

            {/* Column 3 */}
            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <div>
                <label className={lbl}>Setting Time</label>
                <input type="number" value={form.Setting_Time} onChange={e => sf('Setting_Time', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Cycle Time</label>
                <input type="number" value={form.Cycle_Time} onChange={e => sf('Cycle_Time', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Handling Time</label>
                <input type="number" value={form.Handling_Time} onChange={e => sf('Handling_Time', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Idle Time</label>
                <input type="number" value={form.Idle_Time} onChange={e => sf('Idle_Time', e.target.value)} placeholder="0" className={inp(false)} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-3 mt-3 border-t border-slate-100 justify-start">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : editId !== null ? 'Update' : 'Create'}
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={() => setPage(1)}
              className="flex items-center gap-2 px-5 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
            >
              <List className="w-4 h-4" />
              Display All
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-5 py-3">
          <h2 className="text-white font-semibold text-[14px] tracking-wide text-center">Process Master Details</h2>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search processes..."
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0097A7]/30 focus:border-[#0097A7] w-52 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-500">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0097A7]/30"
            >
              {PAGE_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                {COLS.map(h => (
                  <th key={h} className="text-center px-3 py-3 font-bold text-slate-600 text-[11px] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0
                ? <tr><td colSpan={COLS.length} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Settings2 className="w-8 h-8 text-slate-200" />
                      <span>No records found</span>
                    </div>
                  </td></tr>
                : paged.map((r, idx) => (
                  <tr key={r.id} className={`border-b border-slate-100 hover:bg-[#0097A7]/5 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <td className="px-3 py-2.5 text-center text-slate-500 font-medium">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-[#0097A7]">{r.PM_Process_Name || '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.PM_Process_Name1 || '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.PM_Process_Order || '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.TeamId || '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.Machine_Name || '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.PM_Days ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.PM_Hours ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.Minutes ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.Setting_Time ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.Cycle_Time ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.Handling_Time ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-600">{r.Idle_Time ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{r.CreatedBy || '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => handleEdit(r)} title="Edit" className="inline-flex items-center justify-center w-8 h-8 bg-[#0097A7] hover:bg-[#007a87] text-white rounded-lg transition-colors shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => handleDelete(r.id)} title="Delete" className="inline-flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => setDetailRow(r)} title="Details" className="inline-flex items-center justify-center w-8 h-8 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors shadow-sm">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <span className="text-[12px] text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-700">{Math.min(page * pageSize, filtered.length)}</span> of{' '}
            <span className="font-semibold text-slate-700">{filtered.length}</span> entries
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-600 transition-colors">
              Previous
            </button>
            {pNums().map((n, i) =>
              n === '...'
                ? <span key={`e${i}`} className="px-1.5 text-slate-400 text-[13px]">…</span>
                : <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 text-[12px] rounded-lg border font-semibold transition-colors ${page === n ? 'bg-[#0097A7] text-white border-[#0097A7] shadow-sm' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}>
                    {n}
                  </button>
            )}
            <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-600 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailRow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-white font-bold text-[15px]">Process Details</h2>
              </div>
              <button onClick={() => setDetailRow(null)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-0">
              {[
                ['Part Name', detailRow.PM_Part_Name],
                ['Process Name', detailRow.PM_Process_Name],
                ['Process Name 1', detailRow.PM_Process_Name1],
                ['Process Order', detailRow.PM_Process_Order],
                ['Team', detailRow.TeamId],
                ['Machine Code', detailRow.Machine_Code],
                ['Machine Name', detailRow.Machine_Name],
                ['Days', detailRow.PM_Days],
                ['Hours', detailRow.PM_Hours],
                ['Minutes', detailRow.Minutes],
                ['Setting Time', detailRow.Setting_Time],
                ['Cycle Time', detailRow.Cycle_Time],
                ['Handling Time', detailRow.Handling_Time],
                ['Idle Time', detailRow.Idle_Time],
                ['Created By', detailRow.CreatedBy],
                ['Created Date', detailRow.CreatedDate],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col py-2 border-b border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                  <span className="text-[13px] text-slate-800 font-medium">{value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 pt-2">
              <button onClick={() => setDetailRow(null)}
                className="w-full py-2.5 text-sm font-semibold text-white bg-[#0097A7] hover:bg-[#007a87] rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
