import { useState } from 'react'
import { Plus, Edit, Trash2, Info, X, ChevronRight } from 'lucide-react'

// ── Sample data (34 entries matching screenshot) ──────────────────
const SEED = [
  { id:1,  category:'STORE', subCategory:'TOOLS',            prefix:'VT',   digits:5, startNo:10,    endNo:9999,  total:9990 },
  { id:2,  category:'STORE', subCategory:'ASSEMBLY',         prefix:'VAMW', digits:5, startNo:10010, endNo:13999, total:3990 },
  { id:3,  category:'STORE', subCategory:'ASSEMBLY',         prefix:'VAWP', digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:4,  category:'STORE', subCategory:'ASSEMBLY',         prefix:'VAWS', digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:5,  category:'STORE', subCategory:'ASSEMBLY',         prefix:'VAWSR',digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:6,  category:'STORE', subCategory:'GEAR BOX',         prefix:'VG',   digits:5, startNo:20010, endNo:29999, total:9990 },
  { id:7,  category:'STORE', subCategory:'HYDRAULIC CYLINDER',prefix:'VHC', digits:5, startNo:30010, endNo:39999, total:9990 },
  { id:8,  category:'STORE', subCategory:'HYDRAULIC PUMP',   prefix:'VHP',  digits:5, startNo:40010, endNo:49999, total:9990 },
  { id:9,  category:'STORE', subCategory:'HYDRAULIC MOTOR',  prefix:'VHM',  digits:5, startNo:50010, endNo:59999, total:9990 },
  { id:10, category:'STORE', subCategory:'ELECTRICAL MOTOR', prefix:'VEM',  digits:5, startNo:50010, endNo:59999, total:9990 },
  { id:11, category:'STORE', subCategory:'BEARING',          prefix:'VB',   digits:5, startNo:60010, endNo:69999, total:9990 },
  { id:12, category:'STORE', subCategory:'FASTENER',         prefix:'VF',   digits:5, startNo:70010, endNo:79999, total:9990 },
  { id:13, category:'STORE', subCategory:'SEAL KIT',         prefix:'VSK',  digits:5, startNo:80010, endNo:89999, total:9990 },
  { id:14, category:'STORE', subCategory:'CONSUMABLES',      prefix:'VC',   digits:5, startNo:90010, endNo:99999, total:9990 },
  { id:15, category:'STORE', subCategory:'HAND TOOLS',       prefix:'VHT',  digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:16, category:'STORE', subCategory:'PACKING MATERIAL', prefix:'VPM',  digits:5, startNo:20010, endNo:29999, total:9990 },
  { id:17, category:'STORE', subCategory:'PIPE & FITTINGS',  prefix:'VPF',  digits:5, startNo:30010, endNo:39999, total:9990 },
  { id:18, category:'STORE', subCategory:'ELECTRICAL ITEMS', prefix:'VEI',  digits:5, startNo:40010, endNo:49999, total:9990 },
  { id:19, category:'STORE', subCategory:'WELDING ITEMS',    prefix:'VWI',  digits:5, startNo:50010, endNo:59999, total:9990 },
  { id:20, category:'STORE', subCategory:'SAFETY ITEMS',     prefix:'VSI',  digits:5, startNo:60010, endNo:69999, total:9990 },
  { id:21, category:'PROD',  subCategory:'RAW MATERIAL',     prefix:'PRM',  digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:22, category:'PROD',  subCategory:'FINISHED GOODS',   prefix:'PFG',  digits:5, startNo:20010, endNo:29999, total:9990 },
  { id:23, category:'PROD',  subCategory:'SEMI FINISHED',    prefix:'PSF',  digits:5, startNo:30010, endNo:39999, total:9990 },
  { id:24, category:'PROD',  subCategory:'SUB ASSEMBLY',     prefix:'PSA',  digits:5, startNo:40010, endNo:49999, total:9990 },
  { id:25, category:'PROD',  subCategory:'MAIN ASSEMBLY',    prefix:'PMA',  digits:5, startNo:50010, endNo:59999, total:9990 },
  { id:26, category:'PROD',  subCategory:'BOUGHT OUT',       prefix:'PBO',  digits:5, startNo:60010, endNo:69999, total:9990 },
  { id:27, category:'PROD',  subCategory:'WIP',              prefix:'PWIP', digits:5, startNo:70010, endNo:79999, total:9990 },
  { id:28, category:'PROD',  subCategory:'SCRAP',            prefix:'PSC',  digits:5, startNo:80010, endNo:89999, total:9990 },
  { id:29, category:'SERV',  subCategory:'SERVICE PARTS',    prefix:'SSP',  digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:30, category:'SERV',  subCategory:'SPARE PARTS',      prefix:'SSR',  digits:5, startNo:20010, endNo:29999, total:9990 },
  { id:31, category:'SERV',  subCategory:'MAINTENANCE',      prefix:'SMT',  digits:5, startNo:30010, endNo:39999, total:9990 },
  { id:32, category:'SERV',  subCategory:'AMC ITEMS',        prefix:'SAM',  digits:5, startNo:40010, endNo:49999, total:9990 },
  { id:33, category:'PROJ',  subCategory:'PROJECT ITEMS',    prefix:'PRJ',  digits:5, startNo:10010, endNo:19999, total:9990 },
  { id:34, category:'PROJ',  subCategory:'CAPITAL GOODS',    prefix:'PCG',  digits:5, startNo:20010, endNo:29999, total:9990 },
]

const PAGE_SIZES = [10, 25, 50, 100]

const emptyRow = { category: '', subCategory: '', prefix: '', digits: 5, startNo: '', endNo: '', total: '' }

function Modal({ title, data, onChange, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            ['Category',       'category',    'text'],
            ['Sub Category',   'subCategory', 'text'],
            ['Prefix',         'prefix',      'text'],
            ['Number of Digits','digits',     'number'],
            ['Starting Number','startNo',     'number'],
            ['Ending Number',  'endNo',       'number'],
          ].map(([lbl, key, type]) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">{lbl}</label>
              <input
                type={type}
                value={data[key]}
                onChange={e => onChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0097A7]/30 focus:border-[#0097A7]"
              />
            </div>
          ))}
        </div>
        <div className="px-6 pb-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={onSave}  className="px-4 py-2 text-sm font-semibold text-white bg-[#0097A7] hover:bg-[#007a87] rounded-lg transition-colors shadow-sm">Save</button>
        </div>
      </div>
    </div>
  )
}

function DetailModal({ row, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">Part Number Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-3">
          {[
            ['Category',        row.category],
            ['Sub Category',    row.subCategory],
            ['Prefix',          row.prefix],
            ['Number Of Digits',row.digits],
            ['Starting Number', row.startNo],
            ['Ending Number',   row.endNo],
            ['Total Numbers',   row.total],
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

export default function PartNumberBaseMaster() {
  const [rows, setRows]         = useState(SEED)
  const [search, setSearch]     = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage]         = useState(1)
  const [modal, setModal]       = useState(null)   // { mode:'create'|'edit', data, id? }
  const [detailRow, setDetailRow] = useState(null)

  // Search filter
  const filtered = rows.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const openCreate = () => setModal({ mode: 'create', data: { ...emptyRow } })
  const openEdit   = row => setModal({ mode: 'edit', data: { ...row }, id: row.id })
  const openDetail = row => setDetailRow(row)

  const handleModalChange = (key, val) =>
    setModal(m => ({ ...m, data: { ...m.data, [key]: val } }))

  const handleSave = () => {
    const d = modal.data
    const total = Number(d.endNo) - Number(d.startNo) + 1
    if (modal.mode === 'create') {
      const newId = Math.max(0, ...rows.map(r => r.id)) + 1
      setRows(r => [...r, { ...d, id: newId, total }])
    } else {
      setRows(r => r.map(row => row.id === modal.id ? { ...d, id: modal.id, total } : row))
    }
    setModal(null)
    setPage(1)
  }

  const handleDelete = id => {
    if (window.confirm('Delete this record?')) setRows(r => r.filter(x => x.id !== id))
  }

  // Pagination helpers
  const pageNums = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  return (
    <div className="p-6 w-full min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Item Masters</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0097A7] font-semibold">Part Number Base Master</span>
      </div>

      {/* Create Button */}
      <div className="mb-4">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#27ae60] hover:bg-[#229954] text-white text-sm font-semibold rounded transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
           Create New
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-[--color-main] px-4 py-3">
          <h2 className="text-white text-center font-semibold text-[14px]">Part Number Base Details</h2>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 gap-4">
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
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Search:
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-44"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Category','Sub Category','Prefix','Number Of Digits','Starting Number','Ending Number','Total Numbers','Edit','Delete','Details'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">
                    {h}
                    {['Category','Sub Category','Prefix','Number Of Digits','Starting Number','Ending Number','Total Numbers'].includes(h) && (
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
                <tr><td colSpan={10} className="text-center py-8 text-slate-400 text-[13px]">No records found</td></tr>
              ) : paged.map((row, idx) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-3 py-2.5">{row.category}</td>
                  <td className="px-3 py-2.5">{row.subCategory}</td>
                  <td className="px-3 py-2.5 font-mono text-[12px]">{row.prefix}</td>
                  <td className="px-3 py-2.5 text-center">{row.digits}</td>
                  <td className="px-3 py-2.5">{row.startNo}</td>
                  <td className="px-3 py-2.5">{row.endNo}</td>
                  <td className="px-3 py-2.5">{row.total}</td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => openEdit(row)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-semibold rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => openDetail(row)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-[12px] font-semibold rounded transition-colors"
                    >
                      <Info className="w-3 h-3" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 gap-4">
          <span className="text-[12px] text-slate-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >Previous</button>
            {pageNums().map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-[12px] rounded border transition-colors
                  ${page === n ? 'bg-[#0097A7] text-white border-[#0097A7]' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
              >{n}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >Next</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <Modal
          title={modal.mode === 'create' ? 'Create Part Number Base' : 'Edit Part Number Base'}
          data={modal.data}
          onChange={handleModalChange}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {detailRow && <DetailModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  )
}
