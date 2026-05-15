import { useState } from 'react'
import { X, Save, ArrowLeft, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const STORE_OPTIONS = [
  'STORE 1-MAINSTORE',
  'STORE 2-GAS CUTTING',
  'STORE 3-SHEET METAL',
  'STORE 4-BANDSAW CUTTING',
]

const PREFIX_OPTIONS = [
  'VT', 'VAMW', 'VAWP', 'VAWS', 'VAWSR', 'VG', 'VHC', 'VHP', 'VHM',
  'VEM', 'VB', 'VF', 'VSK', 'VC', 'VHT', 'VPM', 'VPF', 'VEI', 'VWI', 'VSI',
  'PRM', 'PFG', 'PSF', 'PSA', 'PMA', 'PBO', 'PWIP', 'PSC',
  'SSP', 'SSR', 'SMT', 'SAM', 'PRJ', 'PCG',
]

// 773 seeded item groups (abbreviated representative set)
const RAW_GROUPS = [
  ['HYDRAULIC PUMP', 'STORE 1-MAINSTORE', 'VHP'],
  ['HYDRAULIC MOTOR', 'STORE 1-MAINSTORE', 'VHM'],
  ['HYDRAULIC VALVE', 'STORE 1-MAINSTORE', 'VHC'],
  ['ELECTRICAL-CNC', 'STORE 1-MAINSTORE', 'VEI'],
  ['ELECTRICAL-SENSOR CLAMP', 'STORE 1-MAINSTORE', 'VEI'],
  ['ELECTRICAL-SENSING CLAMP', 'STORE 1-MAINSTORE', 'VEI'],
  ['ELECTRICAL-V10 CNC', 'STORE 1-MAINSTORE', 'VEI'],
  ['ELECTRICAL-RPM METER SET', 'STORE 1-MAINSTORE', 'VEI'],
  ['ELECTRICAL MOTOR', 'STORE 1-MAINSTORE', 'VEM'],
  ['BEARING-BALL', 'STORE 1-MAINSTORE', 'VB'],
  ['BEARING-ROLLER', 'STORE 1-MAINSTORE', 'VB'],
  ['BEARING-NEEDLE', 'STORE 1-MAINSTORE', 'VB'],
  ['FASTENER-BOLT', 'STORE 1-MAINSTORE', 'VF'],
  ['FASTENER-NUT', 'STORE 1-MAINSTORE', 'VF'],
  ['FASTENER-WASHER', 'STORE 1-MAINSTORE', 'VF'],
  ['FASTENER-SCREW', 'STORE 1-MAINSTORE', 'VF'],
  ['SEAL KIT-PUMP', 'STORE 1-MAINSTORE', 'VSK'],
  ['SEAL KIT-MOTOR', 'STORE 1-MAINSTORE', 'VSK'],
  ['SEAL KIT-CYLINDER', 'STORE 1-MAINSTORE', 'VSK'],
  ['SEAL KIT-VALVE', 'STORE 1-MAINSTORE', 'VSK'],
  ['TOOLS-HAND', 'STORE 1-MAINSTORE', 'VT'],
  ['TOOLS-POWER', 'STORE 1-MAINSTORE', 'VT'],
  ['TOOLS-CUTTING', 'STORE 1-MAINSTORE', 'VT'],
  ['TOOLS-MEASURING', 'STORE 1-MAINSTORE', 'VT'],
  ['CONSUMABLES-OIL', 'STORE 1-MAINSTORE', 'VC'],
  ['CONSUMABLES-GREASE', 'STORE 1-MAINSTORE', 'VC'],
  ['CONSUMABLES-COOLANT', 'STORE 1-MAINSTORE', 'VC'],
  ['CONSUMABLES-ABRASIVE', 'STORE 1-MAINSTORE', 'VC'],
  ['PACKING MATERIAL-BOX', 'STORE 1-MAINSTORE', 'VPM'],
  ['PACKING MATERIAL-FOAM', 'STORE 1-MAINSTORE', 'VPM'],
  ['PACKING MATERIAL-WRAP', 'STORE 1-MAINSTORE', 'VPM'],
  ['PIPE-MS', 'STORE 1-MAINSTORE', 'VPF'],
  ['PIPE-SS', 'STORE 1-MAINSTORE', 'VPF'],
  ['PIPE-HOSE', 'STORE 1-MAINSTORE', 'VPF'],
  ['FITTING-ELBOW', 'STORE 1-MAINSTORE', 'VPF'],
  ['FITTING-TEE', 'STORE 1-MAINSTORE', 'VPF'],
  ['FITTING-UNION', 'STORE 1-MAINSTORE', 'VPF'],
  ['SAFETY-GLOVES', 'STORE 1-MAINSTORE', 'VSI'],
  ['SAFETY-HELMET', 'STORE 1-MAINSTORE', 'VSI'],
  ['SAFETY-SHOES', 'STORE 1-MAINSTORE', 'VSI'],
  ['WELDING-ELECTRODE', 'STORE 1-MAINSTORE', 'VWI'],
  ['WELDING-WIRE', 'STORE 1-MAINSTORE', 'VWI'],
  ['WELDING-GAS', 'STORE 1-MAINSTORE', 'VWI'],
  ['ASSEMBLY-WHEEL', 'STORE 1-MAINSTORE', 'VAMW'],
  ['ASSEMBLY-SHAFT', 'STORE 1-MAINSTORE', 'VAMW'],
  ['ASSEMBLY-COUPLING', 'STORE 1-MAINSTORE', 'VAMW'],
  ['GEAR BOX-HELICAL', 'STORE 1-MAINSTORE', 'VG'],
  ['GEAR BOX-WORM', 'STORE 1-MAINSTORE', 'VG'],
  ['GEAR BOX-BEVEL', 'STORE 1-MAINSTORE', 'VG'],
  ['HAND TOOL-SPANNER', 'STORE 1-MAINSTORE', 'VHT'],
  ['HAND TOOL-PLIER', 'STORE 1-MAINSTORE', 'VHT'],
  ['RAW MATERIAL-MS PLATE', 'STORE 3-PRODUCTION', 'PRM'],
  ['RAW MATERIAL-SS PLATE', 'STORE 3-PRODUCTION', 'PRM'],
  ['RAW MATERIAL-ALUMINIUM', 'STORE 3-PRODUCTION', 'PRM'],
  ['RAW MATERIAL-COPPER', 'STORE 3-PRODUCTION', 'PRM'],
  ['FINISHED GOODS-PUMP', 'STORE 3-PRODUCTION', 'PFG'],
  ['FINISHED GOODS-MOTOR', 'STORE 3-PRODUCTION', 'PFG'],
  ['FINISHED GOODS-CYLINDER', 'STORE 3-PRODUCTION', 'PFG'],
  ['SEMI FINISHED-BODY', 'STORE 3-PRODUCTION', 'PSF'],
  ['SEMI FINISHED-SHAFT', 'STORE 3-PRODUCTION', 'PSF'],
  ['SEMI FINISHED-COVER', 'STORE 3-PRODUCTION', 'PSF'],
  ['SUB ASSEMBLY-VALVE', 'STORE 3-PRODUCTION', 'PSA'],
  ['SUB ASSEMBLY-PUMP', 'STORE 3-PRODUCTION', 'PSA'],
  ['MAIN ASSEMBLY-UNIT', 'STORE 3-PRODUCTION', 'PMA'],
  ['BOUGHT OUT-SEALS', 'STORE 3-PRODUCTION', 'PBO'],
  ['BOUGHT OUT-BEARINGS', 'STORE 3-PRODUCTION', 'PBO'],
  ['WIP-MACHINING', 'STORE 3-PRODUCTION', 'PWIP'],
  ['SCRAP-MS', 'STORE 3-PRODUCTION', 'PSC'],
  ['SERVICE PARTS-PUMP', 'STORE 4-SERVICE', 'SSP'],
  ['SERVICE PARTS-MOTOR', 'STORE 4-SERVICE', 'SSP'],
  ['SERVICE PARTS-VALVE', 'STORE 4-SERVICE', 'SSP'],
  ['SPARE PARTS-SEAL', 'STORE 4-SERVICE', 'SSR'],
  ['SPARE PARTS-BEARING', 'STORE 4-SERVICE', 'SSR'],
  ['MAINTENANCE-TOOLS', 'STORE 4-SERVICE', 'SMT'],
  ['AMC-ITEMS', 'STORE 4-SERVICE', 'SAM'],
  ['PROJECT ITEMS-STRUCTURE', 'STORE 5-PROJECT', 'PRJ'],
  ['PROJECT ITEMS-PIPING', 'STORE 5-PROJECT', 'PRJ'],
  ['CAPITAL GOODS-MACHINE', 'STORE 5-PROJECT', 'PCG'],
]

const SEED = RAW_GROUPS.map((r, i) => ({
  id: i + 1,
  groupName: r[0],
  store: r[1],
  prefix: r[2],
}))

const PAGE_SIZES = [8, 25, 50, 100]

const emptyForm = { groupName: '', store: '', prefix: '' }

function DetailModal({ row, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">Item Group Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          {[
            ['Group Name', row.groupName],
            ['Store', row.store],
            ['Prefix', row.prefix],
          ].map(([lbl, val]) => (
            <div key={lbl} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{lbl}</span>
              <span className="text-[13px] text-slate-800 font-medium">{val}</span>
            </div>
          ))}
        </div>
        <div className="px-6 pb-5 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-[#0097A7] hover:bg-[#007a87] rounded-lg transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function ItemGroupMaster() {
  const [rows, setRows] = useState(SEED)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(8)
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState(null)

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.groupName.trim()) errs.groupName = 'Enter Item Group Name'
    if (!form.store) errs.store = 'Select Store Name'
    if (!form.prefix) errs.prefix = 'Select Prefix'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCreate = () => {
    if (!validate()) return
    if (editId !== null) {
      setRows(r => r.map(x => x.id === editId ? { ...form, id: editId } : x))
      setEditId(null)
    } else {
      const newId = Math.max(0, ...rows.map(r => r.id)) + 1
      setRows(r => [...r, { ...form, id: newId }])
    }
    setForm(emptyForm)
    setErrors({})
    setPage(1)
  }

  const handleEdit = row => {
    setForm({ groupName: row.groupName, store: row.store, prefix: row.prefix })
    setErrors({})
    setEditId(row.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = id => {
    if (window.confirm('Delete this record?')) setRows(r => r.filter(x => x.id !== id))
  }

  const handleBack = () => {
    setForm(emptyForm)
    setErrors({})
    setEditId(null)
  }

  const filtered = rows.filter(r =>
    [r.groupName, r.store, r.prefix].some(v =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Compact page numbers with ellipsis
  const pageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const selCls = (err) =>
    `w-full border rounded px-2 py-1.5 text-[13px] focus:outline-none focus:ring-1 bg-white transition-colors ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'
    }`

  const inpCls = (err) =>
    `w-full border rounded px-2 py-1.5 text-[13px] focus:outline-none focus:ring-1 transition-colors ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'
    }`

  return (
    <div className="p-6 space-y-5 w-full min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Item Masters</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0097A7] font-semibold">Item Group Master</span>
      </div>

      {/* ── Create / Edit Form ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">
            {editId !== null ? 'Edit - Item Group Master' : 'Create - Item Group Master'}
          </h2>
        </div>

        <div className="p-5 space-y-3 max-w-2xl">
          {/* Item Group */}
          <div className="flex items-start gap-3">
            <label className="text-[13px] font-semibold text-slate-700 w-28 shrink-0 pt-1.5">Item Group</label>
            <div className="flex-1">
              <input
                type="text"
                value={form.groupName}
                onChange={e => setField('groupName', e.target.value)}
                placeholder="Enter item group name"
                className={inpCls(errors.groupName)}
              />
              {errors.groupName && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.groupName}</p>
              )}
            </div>
          </div>

          {/* Store Name */}
          <div className="flex items-start gap-3">
            <label className="text-[13px] font-semibold text-slate-700 w-28 shrink-0 pt-1.5">Store Name</label>
            <div className="flex-1">
              <select value={form.store} onChange={e => setField('store', e.target.value)} className={selCls(errors.store)}>
                <option value="">---Select Store Name---</option>
                {STORE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.store && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.store}</p>
              )}
            </div>
          </div>

          {/* Prefix */}
          <div className="flex items-start gap-3">
            <label className="text-[13px] font-semibold text-slate-700 w-28 shrink-0 pt-1.5">Prefix :</label>
            <div className="flex-1">
              <select value={form.prefix} onChange={e => setField('prefix', e.target.value)} className={selCls(errors.prefix)}>
                <option value="">---Select Prefix---</option>
                {PREFIX_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.prefix && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.prefix}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> {editId !== null ? 'Update' : 'Create'}
            </button>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[--color-main] hover:bg-[#3498db] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">Item Group Name Details</h2>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Search:
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-40"
            />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Show
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-slate-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7]"
            >
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            entries
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  { label: 'Group Name', sortable: true },
                  { label: 'Store', sortable: true },
                  { label: 'Edit', sortable: false },
                  { label: 'Delete', sortable: false },
                  { label: 'Details', sortable: false },
                ].map(({ label, sortable }) => (
                  <th key={label} className="text-center px-4 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">
                    {label}
                    {sortable && (
                      <svg className="inline w-3 h-3 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 text-[13px]">No records found</td>
                </tr>
              ) : paged.map((row, idx) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-4 py-2.5 text-center">{row.groupName}</td>
                  <td className="px-4 py-2.5 text-center">{row.store}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleEdit(row)}
                      className="px-3 py-1.5 bg-[--color-main] hover:bg-[#3498db] text-white text-[12px] rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => setDetailRow(row)}
                      className="px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] rounded transition-colors"
                      title="Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <span className="text-[12px] text-slate-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {pageNums().map((n, i) =>
              n === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-[12px]">…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 text-[12px] rounded border transition-colors ${page === n
                      ? 'bg-[#0097A7] text-white border-[#0097A7]'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-600'
                    }`}
                >
                  {n}
                </button>
              )
            )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {detailRow && <DetailModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  )
}
