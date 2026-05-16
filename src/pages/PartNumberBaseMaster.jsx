import { useState } from 'react'
import { Plus, Edit, Trash2, Info, X, ChevronRight, Check } from 'lucide-react'

const SEED = [
  // STORE
  { id:1,  category:'STORE',              subCategory:'TOOLS',                        prefix:'VT',      digits:5, startNo:10,      endNo:9999,    total:9990,    nextEndNo:10000   },
  { id:2,  category:'STORE',              subCategory:'ASSEMBLY',                     prefix:'VA%',     digits:5, startNo:10010,   endNo:19999,   total:9990,    nextEndNo:20000   },
  { id:3,  category:'STORE',              subCategory:'GEAR BOX',                     prefix:'VG',      digits:5, startNo:20010,   endNo:29999,   total:9990,    nextEndNo:30000   },
  { id:4,  category:'STORE',              subCategory:'HYDRAULIC CYLINDER',           prefix:'VHC',     digits:5, startNo:30010,   endNo:39999,   total:9990,    nextEndNo:40000   },
  { id:5,  category:'STORE',              subCategory:'HYDRAULIC PUMP',               prefix:'VHP',     digits:5, startNo:40010,   endNo:49999,   total:9990,    nextEndNo:50000   },
  { id:6,  category:'STORE',              subCategory:'HYDRAULIC MOTOR',              prefix:'VHM',     digits:5, startNo:50010,   endNo:59999,   total:9990,    nextEndNo:60000   },
  { id:7,  category:'STORE',              subCategory:'HYDRAULIC VALVE',              prefix:'VHV',     digits:5, startNo:60010,   endNo:69999,   total:9990,    nextEndNo:70000   },
  { id:8,  category:'STORE',              subCategory:'ELECTRICAL',                   prefix:'VE',      digits:5, startNo:70010,   endNo:79999,   total:9990,    nextEndNo:80000   },
  { id:9,  category:'STORE',              subCategory:'HYDRAULIC',                    prefix:'VH',      digits:5, startNo:80010,   endNo:89999,   total:9990,    nextEndNo:90000   },
  { id:10, category:'STORE',              subCategory:'FASTNER',                      prefix:'VF',      digits:5, startNo:90010,   endNo:99999,   total:9990,    nextEndNo:100000  },
  // VEHICLE MODELS
  { id:11, category:'VEHICLE MODELS',     subCategory:'COMMON',                       prefix:'VC',      digits:6, startNo:100010,  endNo:199999,  total:99990,   nextEndNo:200000  },
  { id:12, category:'VEHICLE MODELS',     subCategory:'V2-I MYRMAX',                 prefix:'VM',      digits:6, startNo:200010,  endNo:299999,  total:99990,   nextEndNo:300000  },
  { id:13, category:'VEHICLE MODELS',     subCategory:'V2-MYRMAX -GEARBOX MODEL',    prefix:'VM',      digits:7, startNo:1200010, endNo:1299999, total:99990,   nextEndNo:1300000 },
  { id:14, category:'VEHICLE MODELS',     subCategory:'V3 - CISADA',                 prefix:'VCS',     digits:6, startNo:300010,  endNo:399999,  total:99990,   nextEndNo:400000  },
  { id:15, category:'VEHICLE MODELS',     subCategory:'V4 - MINI MYRMAX',            prefix:'VMM',     digits:6, startNo:400010,  endNo:499999,  total:99990,   nextEndNo:500000  },
  { id:16, category:'VEHICLE MODELS',     subCategory:'CORE DRILL',                  prefix:'VCD',     digits:6, startNo:500010,  endNo:519999,  total:19990,   nextEndNo:520000  },
  { id:17, category:'VEHICLE MODELS',     subCategory:'CORE DRILL-MINICORE -CR30',   prefix:'VCD',     digits:6, startNo:520010,  endNo:529999,  total:9990,    nextEndNo:530000  },
  { id:18, category:'VEHICLE MODELS',     subCategory:'RC-REVERSE CIRCULATION',      prefix:'VRC',     digits:6, startNo:600010,  endNo:699999,  total:99990,   nextEndNo:700000  },
  { id:19, category:'VEHICLE MODELS',     subCategory:'V7',                          prefix:'V% (VE)', digits:6, startNo:700010,  endNo:799999,  total:99990,   nextEndNo:800000  },
  { id:20, category:'VEHICLE MODELS',     subCategory:'V1 - MYRMAX',                prefix:'VOM',     digits:6, startNo:800010,  endNo:899999,  total:99990,   nextEndNo:900000  },
  { id:21, category:'VEHICLE MODELS',     subCategory:'V9 -CISADA V+',              prefix:'VCV',     digits:6, startNo:900010,  endNo:999999,  total:99990,   nextEndNo:1000000 },
  { id:22, category:'VEHICLE MODELS',     subCategory:'V10 - GROUND HOG',           prefix:'VGH',     digits:7, startNo:1000010, endNo:1099999, total:99990,   nextEndNo:1100000 },
  // PRODUCTION PROCESS
  { id:23, category:'PRODUCTION PROCESS', subCategory:'LASER CUTTING OS',            prefix:'VLC',     digits:7, startNo:7000000, endNo:7999999, total:1000000, nextEndNo:8000000 },
  { id:24, category:'PRODUCTION PROCESS', subCategory:'VELSON CUSTOMER REQUIREMENT', prefix:'VCR',     digits:7, startNo:2000010, endNo:2999999, total:999990,  nextEndNo:3000000 },
  { id:25, category:'PRODUCTION PROCESS', subCategory:'RAW MATERIAL',                prefix:'VRM',     digits:7, startNo:3000010, endNo:3999999, total:999990,  nextEndNo:4000000 },
  { id:26, category:'PRODUCTION PROCESS', subCategory:'VELSON OUTSOURCE',            prefix:'VOS',     digits:7, startNo:4000010, endNo:4999999, total:999990,  nextEndNo:5000000 },
  { id:27, category:'PRODUCTION PROCESS', subCategory:'VELSON ACCESSORIES',          prefix:'VAC',     digits:7, startNo:5000010, endNo:5999999, total:999990,  nextEndNo:6000000 },
]

const PAGE_SIZES = [10, 25, 50, 100]

const emptyRow = { category: '', subCategory: '', prefix: '', digits: 5, startNo: '', endNo: '', total: ''  }

let optionIdSeq = 100

function initOptions(arr) {
  return [...new Set(arr)].map(label => ({ id: optionIdSeq++, label }))
}

function DropdownWithManager({ label, value, options, onSelect, onAdd, onEdit, onDelete }) {
  const [open, setOpen]     = useState(false)
  const [newVal, setNewVal] = useState('')
  const [editId, setEditId] = useState(null)
  const [editVal, setEditVal] = useState('')

  const handleAdd = () => {
    const v = newVal.trim()
    if (!v) return
    onAdd(v)
    setNewVal('')
  }

  const handleEditSave = id => {
    const v = editVal.trim()
    if (!v) return
    onEdit(id, v)
    setEditId(null)
    setEditVal('')
  }

  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={e => onSelect(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0097A7]/30 focus:border-[#0097A7] bg-white"
        >
          <option value="">-- Select --</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.label}>{opt.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="px-2.5 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white rounded-lg transition-colors flex items-center"
          title="Manage options"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="mt-2 border border-slate-200 rounded-lg bg-slate-50 p-3 space-y-2">
          {/* Add new option */}
          <div className="flex gap-2">
            <input
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Type new option..."
              className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] bg-white"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-3 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[12px] font-semibold rounded transition-colors"
            >
              Add
            </button>
          </div>

          {/* Options list */}
          {options.length > 0 && (
            <div className="max-h-44 overflow-y-auto space-y-1">
              {options.map(opt => (
                <div key={opt.id} className="flex items-center gap-2 bg-white border border-slate-100 rounded px-2 py-1.5">
                  {editId === opt.id ? (
                    <>
                      <input
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleEditSave(opt.id)}
                        autoFocus
                        className="flex-1 px-2 py-1 border border-[#0097A7] rounded text-[12px] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleEditSave(opt.id)}
                        className="p-1 text-[#27ae60] hover:text-[#1e8449]"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditId(null); setEditVal('') }}
                        className="p-1 text-slate-400 hover:text-slate-600"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-[12px] text-slate-700 truncate">{opt.label}</span>
                      <button
                        type="button"
                        onClick={() => { setEditId(opt.id); setEditVal(opt.label) }}
                        className="flex items-center gap-0.5 px-2 py-0.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-semibold rounded transition-colors whitespace-nowrap"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(opt.id)}
                        className="flex items-center gap-0.5 px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold rounded transition-colors whitespace-nowrap"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Modal({
  title, data, onChange, onSave, onClose,
  categoryOptions, subCategoryOptions,
  onAddCategory, onEditCategory, onDeleteCategory,
  onAddSubCategory, onEditSubCategory, onDeleteSubCategory,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <DropdownWithManager
            label="Category"
            value={data.category}
            options={categoryOptions}
            onSelect={val => onChange('category', val)}
            onAdd={onAddCategory}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
          />
          <DropdownWithManager
            label="Sub Category"
            value={data.subCategory}
            options={subCategoryOptions}
            onSelect={val => onChange('subCategory', val)}
            onAdd={onAddSubCategory}
            onEdit={onEditSubCategory}
            onDelete={onDeleteSubCategory}
          />
          {[
            ['Prefix',          'prefix',  'text'],
            ['Number of Digits','digits',  'number'],
            ['Starting Number', 'startNo', 'number'],
            ['Ending Number',   'endNo',   'number'],
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
            ['Category',                    row.category],
            ['Sub Category',                row.subCategory],
            ['Prefix',                      row.prefix],
            ['Number Of Digits',            row.digits],
            ['Starting Number',             row.startNo],
            ['Ending Number',               row.endNo],
            ['Total Numbers',               row.total],
            // ['Next Number of Ending Number',row.nextEndNo],
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
  const [modal, setModal]       = useState(null)
  const [detailRow, setDetailRow] = useState(null)

  const [categoryOptions, setCategoryOptions]       = useState(() => initOptions(SEED.map(r => r.category)))
  const [subCategoryOptions, setSubCategoryOptions] = useState(() => initOptions(SEED.map(r => r.subCategory)))

  // Category option handlers
  const handleAddCategory = label => {
    setCategoryOptions(o => [...o, { id: optionIdSeq++, label }])
  }
  const handleEditCategory = (id, label) => {
    setCategoryOptions(o => o.map(x => x.id === id ? { ...x, label } : x))
  }
  const handleDeleteCategory = id => {
    setCategoryOptions(o => o.filter(x => x.id !== id))
  }

  // Sub Category option handlers
  const handleAddSubCategory = label => {
    setSubCategoryOptions(o => [...o, { id: optionIdSeq++, label }])
  }
  const handleEditSubCategory = (id, label) => {
    setSubCategoryOptions(o => o.map(x => x.id === id ? { ...x, label } : x))
  }
  const handleDeleteSubCategory = id => {
    setSubCategoryOptions(o => o.filter(x => x.id !== id))
  }

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
    const total    = Number(d.endNo) - Number(d.startNo) + 1
  //   const nextEndNo = Number(d.endNo) + 1
  //   if (modal.mode === 'create') {
  //     const newId = Math.max(0, ...rows.map(r => r.id)) + 1
  //     setRows(r => [...r, { ...d, id: newId, total, nextEndNo }])
  //   } else {
  //     setRows(r => r.map(row => row.id === modal.id ? { ...d, id: modal.id, total, nextEndNo } : row))
  //   }
  //   setModal(null)
  //   setPage(1)
  }

  const handleDelete = id => {
    if (window.confirm('Delete this record?')) setRows(r => r.filter(x => x.id !== id))
  }

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
                    {['Category','Sub Category','Prefix','Number Of Digits','Starting Number','Ending Number','Total Numbers' ].includes(h) && (
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
                <tr><td colSpan={11} className="text-center py-8 text-slate-400 text-[13px]">No records found</td></tr>
              ) : paged.map((row, idx) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-3 py-2.5">{row.category}</td>
                  <td className="px-3 py-2.5">{row.subCategory}</td>
                  <td className="px-3 py-2.5 font-mono text-[12px]">{row.prefix}</td>
                  <td className="px-3 py-2.5 text-center">{row.digits}</td>
                  <td className="px-3 py-2.5">{row.startNo}</td>
                  <td className="px-3 py-2.5">{row.endNo}</td>
                  <td className="px-3 py-2.5">{row.total}</td>
                  {/* <td className="px-3 py-2.5">{row.nextEndNo}</td> */}
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => openEdit(row)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-semibold rounded transition-colors"
                    >
                      <Edit className="w-3 h-3" /> 
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-semibold rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> 
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => openDetail(row)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-[12px] font-semibold rounded transition-colors"
                    >
                      <Info className="w-3 h-3" /> 
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
          categoryOptions={categoryOptions}
          subCategoryOptions={subCategoryOptions}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddSubCategory={handleAddSubCategory}
          onEditSubCategory={handleEditSubCategory}
          onDeleteSubCategory={handleDeleteSubCategory}
        />
      )}
      {detailRow && <DetailModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  )
}