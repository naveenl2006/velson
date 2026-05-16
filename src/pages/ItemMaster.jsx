import { useState, useEffect, useCallback } from 'react'
import {
  ChevronRight, Package, Store, Settings, Paperclip,
  Pencil, Trash2, Eye, Download, Image as ImageIcon,
  FileImage, FileX, FileMinus, LayoutList, Loader2,
} from 'lucide-react'
import { useToast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

// ── API helper ─────────────────────────────────────────────────────
const api = {
  get: (url) => fetch(url).then(r => r.json()),
  post: (url, data) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  put: (url, data) => fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  del: (url) => fetch(url, { method: 'DELETE' }).then(r => r.json()),
}

// ── Shared UI primitives ─────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', disabled }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full px-3 py-[9px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
  />
)

const Select = ({ options = [], placeholder, value, onChange, loading }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      disabled={loading}
      className="w-full px-3 py-[9px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
    >
      <option value="">{loading ? 'Loading…' : placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={String(o.value)}>{o.label}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      {loading
        ? <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
        : <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
      }
    </div>
  </div>
)

const SectionCard = ({ title, children, icon }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,151,167,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
    <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-5 py-3 flex items-center gap-2">
      {icon && <span className="text-base">{icon}</span>}
      <h3 className="text-white text-[13px] font-bold tracking-wider uppercase">{title}</h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
)

const Row = ({ children }) => <div className="grid grid-cols-2 gap-4">{children}</div>

const ActionBtn = ({ icon: Icon, label, onClick, variant = 'teal', disabled }) => {
  const styles = {
    teal:   'bg-[#0097A7] hover:bg-[#007a87] text-white',
    green:  'bg-[#2ecc71] hover:bg-[#27ae60] text-white',
    blue:   'bg-[#3498db] hover:bg-[#2980b9] text-white',
    indigo: 'bg-[#5c6bc0] hover:bg-[#3949ab] text-white',
    orange: 'bg-[#e67e22] hover:bg-[#d35400] text-white',
    slate:  'bg-slate-600 hover:bg-slate-700 text-white',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-md shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  )
}

// ── useDropdowns hook ─────────────────────────────────────────────
function useDropdowns() {
  const toast = useToast()
  const [dropdowns, setDropdowns] = useState({
    itemGroups: [], models: [], uoms: [], taxes: [],
    subGroups: [], stores: [], itemTypes: [], qcTypes: [],
    materialGrades: [], materialTypes: [], currencies: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const results = await Promise.allSettled([
          api.get('/api/item-group-master'),
          api.get('/api/reference-master/Vehicle_Type'),
          api.get('/api/reference-master/UOM'),
          api.get('/api/tax-master'),
          api.get('/api/reference-master/Sub%20Group'),
          api.get('/api/reference-master/Store'),
          api.get('/api/reference-master/Item%20Type'),
          api.get('/api/reference-master/QC_Type'),
          api.get('/api/reference-master/Material_Grade'),
          api.get('/api/reference-master/Material_Type'),
          api.get('/api/reference-master/Currency'),
        ])
        const [ig, models, uoms, taxes, sg, stores, it, qct, mg, mt, curr] = results.map(r =>
          r.status === 'fulfilled' ? r.value : { data: [] }
        )
        setDropdowns({
          itemGroups:     ig.data    || [],
          models:         models.data || [],
          uoms:           uoms.data   || [],
          taxes:          taxes.data  || [],
          subGroups:      sg.data     || [],
          stores:         stores.data || [],
          itemTypes:      it.data     || [],
          qcTypes:        qct.data    || [],
          materialGrades: mg.data     || [],
          materialTypes:  mt.data     || [],
          currencies:     curr.data   || [],
        })
      } catch {
        toast.error('Failed to load dropdown data')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { dropdowns, dropdownsLoading: loading }
}

// ── Empty form ────────────────────────────────────────────────────
const emptyForm = {
  groupId: '', partNo: '', outsourcePartNo: '', partName: '',
  modelId: '', brand: '', description: '', size: '', weight: '',
  unitId: '', hsnCode: '', purchaseRate: '', marginPercent: '', rate: '',
  currencyId: '', taxId: '', subGroupId: '', storeId: '',
  rackNo: '', location: '', itemTypeId: '', qcTypeId: '',
  materialGradeId: '', materialTypeId: '', rawMaterialId: '',
  rmLength: '', rawMaterialWt: '', fgMaterialWt: '',
  reorderLevel: '', minStock: '',
}

const REQUIRED = [
  { key: 'groupId',    label: 'Item Group' },
  { key: 'partNo',     label: 'Part Number' },
  { key: 'partName',   label: 'Part Name' },
  { key: 'unitId',     label: 'UOM' },
  { key: 'itemTypeId', label: 'Item Type' },
  { key: 'qcTypeId',   label: 'QC Type' },
]

// ── Index (table) view ────────────────────────────────────────────
function IndexView({ onCreate, onEdit, onView, dropdowns }) {
  const toast = useToast()
  const [search, setSearch]           = useState('')
  const [debSearch, setDebSearch]     = useState('')
  const [showEntries, setShowEntries] = useState('10')
  const [page, setPage]               = useState(1)
  const [items, setItems]             = useState([])
  const [total, setTotal]             = useState(0)
  const [loading, setLoading]         = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebSearch(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: showEntries, search: debSearch })
      const json = await api.get(`/api/item-master?${params}`)
      if (!json.success) throw new Error(json.message)
      setItems(json.data)
      setTotal(json.total)
    } catch (err) {
      toast.error(err.message || 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [page, showEntries, debSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleDelete = async () => {
    try {
      const json = await api.del(`/api/item-master/${deleteTarget.id}`)
      if (!json.success) throw new Error(json.message)
      toast.success('Item deleted successfully')
      setDeleteTarget(null)
      fetchItems()
    } catch (err) {
      toast.error(err.message || 'Failed to delete item')
      setDeleteTarget(null)
    }
  }

  const resolveModel = (id) =>
    dropdowns.models.find(m => m.id === Number(id))?.description || ''

  const totalPages = Math.max(1, Math.ceil(total / Number(showEntries)))
  const from = total === 0 ? 0 : (page - 1) * Number(showEntries) + 1
  const to   = Math.min(page * Number(showEntries), total)

  const thCls = 'px-2 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-[#00838f] last:border-r-0 whitespace-nowrap'
  const tdCls = 'px-2 py-2 text-[12px] text-slate-700 text-center border-r border-slate-100 last:border-r-0'

  const pageNums = () => {
    const nums = []
    for (let p = Math.max(1, page - 1); p <= Math.min(totalPages, page + 1); p++) nums.push(p)
    return nums
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-4 py-4">

        {/* ── Top action bar ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <ActionBtn icon={Package}    label="Create"                     onClick={onCreate}    variant="green"  />
          <ActionBtn icon={Download}   label="Export All to Excel"         onClick={() => {}}    variant="teal"   />
          <ActionBtn icon={FileImage}  label="View All Uploaded Files"     onClick={() => {}}    variant="blue"   />
          <ActionBtn icon={FileX}      label="View All UnAvailable Images" onClick={() => {}}    variant="indigo" />
          <ActionBtn icon={FileMinus}  label="View All UnAvailable Pdfs"   onClick={() => {}}    variant="orange" />
          <ActionBtn icon={LayoutList} label="Display All"                 onClick={fetchItems}  variant="slate"  />
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-5 py-2.5">
            <h2 className="text-white text-[13px] font-bold tracking-wider uppercase text-center">
              Item Master Details
            </h2>
          </div>

          {/* Search + Show entries */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <span>Show</span>
              <select
                value={showEntries}
                onChange={e => { setShowEntries(e.target.value); setPage(1) }}
                className="border border-slate-200 rounded px-2 py-1 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] bg-white"
              >
                {['10', '25', '50', '100'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-500">Search:</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-slate-200 rounded px-3 py-1.5 text-[12px] w-48 focus:outline-none focus:ring-1 focus:ring-[#0097A7] bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <Loader2 className="w-6 h-6 text-[#0097A7] animate-spin" />
              </div>
            )}
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#0097A7] to-[#00ACC1]">
                  <th className={thCls} style={{ width: 52  }}>ID</th>
                  <th className={thCls} style={{ width: 44  }}>S.No</th>
                  <th className={thCls} style={{ width: 90  }}>Part No</th>
                  <th className={thCls} style={{ width: 100 }}>O.S.No.</th>
                  <th className={thCls} style={{ minWidth: 200 }}>Part Name</th>
                  <th className={thCls} style={{ width: 80  }}>Model</th>
                  <th className={thCls} style={{ width: 70  }}>Brand</th>
                  <th className={thCls} style={{ width: 52  }}>R.O.L.</th>
                  <th className={thCls} style={{ width: 60  }}>M.Stock</th>
                  <th className={thCls} style={{ width: 60  }}>C.Stock</th>
                  <th className={thCls} style={{ width: 62  }}>Image</th>
                  <th className={thCls} style={{ width: 44  }}>Edit</th>
                  <th className={thCls} style={{ width: 52  }}>Delete</th>
                  <th className={thCls} style={{ width: 56  }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={14} className="py-8 text-center text-slate-400 text-[13px]">
                      No items found
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-[#f0fdfe] transition-colors' : 'bg-slate-50 hover:bg-[#f0fdfe] transition-colors'}
                    >
                      <td className={tdCls + ' font-medium text-slate-800'}>{item.id}</td>
                      <td className={tdCls}>{from + idx}</td>
                      <td className={tdCls + ' font-medium text-[#0097A7]'}>{item.partNo}</td>
                      <td className={tdCls + ' text-slate-500'}>{item.outsourcePartNo || ''}</td>
                      <td className={`${tdCls} text-left font-medium`}>{item.partName}</td>
                      <td className={tdCls}>{resolveModel(item.modelId)}</td>
                      <td className={tdCls}>{item.brand || ''}</td>
                      <td className={tdCls}>{item.reorderLevel ?? 0}</td>
                      <td className={tdCls}>{item.minStock ?? 0}</td>
                      <td className={`${tdCls} font-semibold text-slate-500`}>0</td>

                      {/* Image placeholder */}
                      <td className={tdCls}>
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 rounded bg-[#0097A7]/20 flex items-center justify-center shadow-sm">
                            <ImageIcon className="w-4 h-4 text-[#0097A7]/60" />
                          </div>
                        </div>
                      </td>

                      {/* Edit */}
                      <td className={tdCls}>
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#3498db] hover:bg-[#2980b9] text-white transition-colors shadow-sm"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* Delete */}
                      <td className={tdCls}>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#e74c3c] hover:bg-[#c0392b] text-white transition-colors shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* Details */}
                      <td className={tdCls}>
                        <button
                          onClick={() => onView(item)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#0097A7] hover:bg-[#007a87] text-white transition-colors shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[12px] text-slate-500">
              {total === 0
                ? 'No entries'
                : `Showing ${from} to ${to} of ${total.toLocaleString()} entries`}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-[12px] border border-slate-200 rounded-l text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              {pageNums().map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-[12px] border-y border-slate-200 transition-colors ${page === p ? 'bg-[#0097A7] text-white border-[#0097A7]' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-[12px] border border-slate-200 rounded-r text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Item"
        message={`Delete "${deleteTarget?.partName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

// ── Create / Edit form view ───────────────────────────────────────
function CreateView({ onBack, editItem, dropdowns, dropdownsLoading, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  // Pre-fill on edit
  useEffect(() => {
    if (editItem) {
      const f = {}
      Object.keys(emptyForm).forEach(k => {
        const v = editItem[k]
        f[k] = (v !== null && v !== undefined) ? String(v) : ''
      })
      setForm(f)
    } else {
      setForm({ ...emptyForm })
    }
  }, [editItem])

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    const missing = REQUIRED.filter(r => !form[r.key]).map(r => r.label)
    if (missing.length) {
      toast.warning('Please fill required fields: ' + missing.join(', '))
      return
    }
    setSaving(true)
    try {
      const url    = editItem ? `/api/item-master/${editItem.id}` : '/api/item-master'
      const method = editItem ? 'put' : 'post'
      const json   = await api[method](url, { ...form, updatedBy: 'ADMIN', createdBy: 'ADMIN' })
      if (!json.success) throw new Error(json.message)
      toast.success(editItem ? 'Item updated successfully!' : 'Item created successfully!')
      onSaved()
    } catch (err) {
      toast.error(err.message || 'Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  const opts = {
    itemGroups:     dropdowns.itemGroups.map(g => ({ value: g.id, label: g.groupName })),
    models:         dropdowns.models.map(m => ({ value: m.id, label: m.description })),
    uoms:           dropdowns.uoms.map(u => ({ value: u.id, label: u.description })),
    taxes:          dropdowns.taxes.map(t => ({ value: t.id, label: `${t.taxPercent}%` })),
    subGroups:      dropdowns.subGroups.map(s => ({ value: s.id, label: s.description })),
    stores:         dropdowns.stores.map(s => ({ value: s.id, label: s.description })),
    itemTypes:      dropdowns.itemTypes.map(i => ({ value: i.id, label: i.description })),
    qcTypes:        dropdowns.qcTypes.map(q => ({ value: q.id, label: q.description })),
    materialGrades: dropdowns.materialGrades.map(m => ({ value: m.id, label: m.description })),
    materialTypes:  dropdowns.materialTypes.map(m => ({ value: m.id, label: m.description })),
    currencies:     dropdowns.currencies.map(c => ({ value: c.id, label: c.description })),
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors" onClick={onBack}>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors" onClick={onBack}>Item Masters</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold">{editItem ? 'Edit Item Master' : 'New Item Master'}</span>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* ── COLUMN 1: Item Information ── */}
          <SectionCard title="Item Information" icon={<Package className="w-4 h-4" />}>
            <div>
              <Label required>Item Group</Label>
              <Select options={opts.itemGroups} placeholder="---Select Group---" value={form.groupId} onChange={u('groupId')} loading={dropdownsLoading} />
            </div>
            <div>
              <Label required>Part Number</Label>
              <Input placeholder="Enter Part Number" value={form.partNo} onChange={u('partNo')} />
            </div>
            <div>
              <Label>OutSource Part No</Label>
              <div className="flex gap-2">
                <Input placeholder="OutSource Part No" value={form.outsourcePartNo} onChange={u('outsourcePartNo')} />
                <button className="flex-shrink-0 w-9 h-[38px] bg-[#0097A7] hover:bg-[#007a87] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm font-bold text-xl leading-none">+</button>
              </div>
            </div>
            <div>
              <Label required>Part Name</Label>
              <Input placeholder="Part Name" value={form.partName} onChange={u('partName')} />
            </div>
            <Row>
              <div>
                <Label>Model</Label>
                <Select options={opts.models} placeholder="---Select Model---" value={form.modelId} onChange={u('modelId')} loading={dropdownsLoading} />
              </div>
              <div>
                <Label>Brand</Label>
                <Input placeholder="Brand" value={form.brand} onChange={u('brand')} />
              </div>
            </Row>
            <div>
              <Label>Description</Label>
              <Input placeholder="Description" value={form.description} onChange={u('description')} />
            </div>
            <Row>
              <div>
                <Label>Size</Label>
                <Input placeholder="Size" value={form.size} onChange={u('size')} />
              </div>
              <div>
                <Label>Weight</Label>
                <Input placeholder="Weight" value={form.weight} onChange={u('weight')} type="number" />
              </div>
            </Row>
            <div>
              <Label required>UOM</Label>
              <Select options={opts.uoms} placeholder="---Select UOM---" value={form.unitId} onChange={u('unitId')} loading={dropdownsLoading} />
            </div>
            <div>
              <Label>HSN Code</Label>
              <Input placeholder="HSN Code" value={form.hsnCode} onChange={u('hsnCode')} />
            </div>
            <Row>
              <div>
                <Label>Purchase Rate</Label>
                <Input placeholder="Purchase Rate" value={form.purchaseRate} onChange={u('purchaseRate')} type="number" />
              </div>
              <div>
                <Label>Margin (%)</Label>
                <Input placeholder="Margin (%)" value={form.marginPercent} onChange={u('marginPercent')} type="number" />
              </div>
            </Row>
            <Row>
              <div>
                <Label>Rate</Label>
                <Input placeholder="Rate" value={form.rate} onChange={u('rate')} type="number" />
              </div>
              <div>
                <Label>Currency</Label>
                <Select options={opts.currencies} placeholder="---Select---" value={form.currencyId} onChange={u('currencyId')} loading={dropdownsLoading} />
              </div>
            </Row>
            <div>
              <Label>GST %</Label>
              <Select options={opts.taxes} placeholder="---Select GST %---" value={form.taxId} onChange={u('taxId')} loading={dropdownsLoading} />
            </div>
          </SectionCard>

          {/* ── COLUMN 2: Store & Raw Material ── */}
          <div className="space-y-5">
            <SectionCard title="Store & Classification" icon={<Store className="w-4 h-4" />}>
              <div>
                <Label>Sub Group</Label>
                <Select options={opts.subGroups} placeholder="---Select Sub Group---" value={form.subGroupId} onChange={u('subGroupId')} loading={dropdownsLoading} />
              </div>
              <Row>
                <div>
                  <Label>Reorder Level</Label>
                  <Input placeholder="Reorder Level" value={form.reorderLevel} onChange={u('reorderLevel')} type="number" />
                </div>
                <div>
                  <Label>Min Stock</Label>
                  <Input placeholder="Min Stock" value={form.minStock} onChange={u('minStock')} type="number" />
                </div>
              </Row>
              <div>
                <Label>Store Name</Label>
                <Select options={opts.stores} placeholder="---Select Store---" value={form.storeId} onChange={u('storeId')} loading={dropdownsLoading} />
              </div>
              <Row>
                <div>
                  <Label>Rack Number</Label>
                  <Input placeholder="Rack Number" value={form.rackNo} onChange={u('rackNo')} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input placeholder="Location" value={form.location} onChange={u('location')} />
                </div>
              </Row>
              <Row>
                <div>
                  <Label required>Item Type</Label>
                  <Select options={opts.itemTypes} placeholder="---Select Item Type---" value={form.itemTypeId} onChange={u('itemTypeId')} loading={dropdownsLoading} />
                </div>
                <div>
                  <Label required>QC Type</Label>
                  <Select options={opts.qcTypes} placeholder="---Select QC Type---" value={form.qcTypeId} onChange={u('qcTypeId')} loading={dropdownsLoading} />
                </div>
              </Row>
            </SectionCard>

            <SectionCard title="Raw Material Selection" icon={<Settings className="w-4 h-4" />}>
              <Row>
                <div>
                  <Label>Material Grade</Label>
                  <Select options={opts.materialGrades} placeholder="---Select---" value={form.materialGradeId} onChange={u('materialGradeId')} loading={dropdownsLoading} />
                </div>
                <div>
                  <Label>Material Type</Label>
                  <Select options={opts.materialTypes} placeholder="---Select---" value={form.materialTypeId} onChange={u('materialTypeId')} loading={dropdownsLoading} />
                </div>
              </Row>
              <div>
                <Label>Length</Label>
                <Input placeholder="Length (e.g. 6m)" value={form.rmLength} onChange={u('rmLength')} />
              </div>
              <Row>
                <div>
                  <Label>RM. Weight</Label>
                  <Input placeholder="RM. Weight" value={form.rawMaterialWt} onChange={u('rawMaterialWt')} type="number" />
                </div>
                <div>
                  <Label>FG. Weight</Label>
                  <Input placeholder="FG. Weight" value={form.fgMaterialWt} onChange={u('fgMaterialWt')} type="number" />
                </div>
              </Row>
            </SectionCard>
          </div>

          {/* ── COLUMN 3: Uploads & Actions ── */}
          <div className="space-y-5">
            <SectionCard title="Attachments & Actions" icon={<Paperclip className="w-4 h-4" />}>
              <div>
                <Label>Upload Image</Label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-[#0097A7] hover:bg-[#D4F1F4]/30 transition-all group">
                  <div className="w-9 h-9 bg-[#D4F1F4] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#0097A7]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#0097A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Upload Image</p>
                    <p className="text-[11px] text-slate-400">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <div>
                <Label>Upload Drawing PDF</Label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-[#0097A7] hover:bg-[#D4F1F4]/30 transition-all group">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Upload Drawing PDF</p>
                    <p className="text-[11px] text-slate-400">PDF up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" />
                </label>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-3 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    {saving
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                    {editItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    onClick={() => setForm(editItem ? (() => {
                      const f = {}
                      Object.keys(emptyForm).forEach(k => { const v = editItem[k]; f[k] = (v !== null && v !== undefined) ? String(v) : '' })
                      return f
                    })() : { ...emptyForm })}
                    className="px-3 py-2.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                  <button
                    onClick={onBack}
                    className="px-3 py-2.5 bg-[#0097A7] hover:bg-[#007a87] active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Display All
                  </button>
                  <button
                    className="px-3 py-2.5 bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Preview view ──────────────────────────────────────────────────
function PreviewView({ item, dropdowns, onBack, onCreate, onViewUploads }) {
  if (!item) return null

  const resolve = (list, id, key = 'description') =>
    list.find(r => r.id === Number(id))?.[key] || '—'

  const infoRows = [
    { label: 'Item Group',       value: resolve(dropdowns.itemGroups, item.groupId, 'groupName') },
    { label: 'Part Number',      value: item.partNo },
    { label: 'Out Source Part No.', value: item.outsourcePartNo || '—' },
    { label: 'Part Name',        value: item.partName },
    { label: 'Model',            value: resolve(dropdowns.models, item.modelId) },
    { label: 'Brand',            value: item.brand || '—' },
    { label: 'Description',      value: item.description || '—' },
    { label: 'Size',             value: item.size || '—' },
    { label: 'Weight',           value: item.weight != null ? item.weight : '—' },
    { label: 'UOM',              value: resolve(dropdowns.uoms, item.unitId) },
    { label: 'HSN Code',         value: item.hsnCode || '—' },
    { label: 'Purchase Rate',    value: item.purchaseRate != null ? item.purchaseRate : '—' },
    { label: 'Margin (%)',       value: item.marginPercent != null ? item.marginPercent : '—' },
    { label: 'Rate',             value: item.rate != null ? item.rate : '—' },
    { label: 'Currency',         value: resolve(dropdowns.currencies, item.currencyId) },
    { label: 'GST %',            value: resolve(dropdowns.taxes, item.taxId, 'taxPercent') !== '—' ? `${resolve(dropdowns.taxes, item.taxId, 'taxPercent')}%` : '—' },
    { label: 'Sub Group',        value: resolve(dropdowns.subGroups, item.subGroupId) },
    { label: 'Store Name',       value: resolve(dropdowns.stores, item.storeId) },
    { label: 'Rack Number',      value: item.rackNo || '—' },
    { label: 'Location',         value: item.location || '—' },
    { label: 'Item Type',        value: resolve(dropdowns.itemTypes, item.itemTypeId) },
    { label: 'QC Type',          value: resolve(dropdowns.qcTypes, item.qcTypeId) },
    { label: 'Material Grade',   value: resolve(dropdowns.materialGrades, item.materialGradeId) },
    { label: 'Material Type',    value: resolve(dropdowns.materialTypes, item.materialTypeId) },
    { label: 'Length',           value: item.rmLength || '—' },
    { label: 'RM. Weight',       value: item.rawMaterialWt != null ? item.rawMaterialWt : '—' },
    { label: 'FG. Weight',       value: item.fgMaterialWt != null ? item.fgMaterialWt : '—' },
    { label: 'Reorder Level',    value: item.reorderLevel != null ? item.reorderLevel : '—' },
    { label: 'Min Stock',        value: item.minStock != null ? item.minStock : '—' },
    { label: 'Current Stock',    value: 0 },
    { label: 'Created Date',     value: item.createdAt ? new Date(item.createdAt).toLocaleString() : '—' },
    { label: 'Created By',       value: item.createdBy || '—' },
    { label: 'Updated Date',     value: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—' },
    { label: 'Updated By',       value: item.updatedBy || '—' },
  ]

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-4 py-4 max-w-[1200px] mx-auto">
        <div className="bg-[#0097A7] text-white text-sm font-semibold tracking-wide text-center py-2.5 mb-4 rounded shadow-sm">
          Preview Of Selected Item Master Details
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: info table */}
          <div className="bg-[#0097A7] rounded border border-[#2e6da4] shadow-sm overflow-hidden flex flex-col">
            <div className="text-white text-[13px] text-center py-2.5 font-bold border-b border-white/20">
              Item Basic Information
            </div>
            <div className="text-white p-4 flex-1 text-[12px]">
              <div className="grid grid-cols-[40%_5%_55%] gap-y-[3px]">
                {infoRows.map((row, idx) => (
                  <div key={idx} className="contents">
                    <div className="text-left pl-3 font-bold tracking-wide">{row.label}</div>
                    <div className="text-center font-bold">:</div>
                    <div className="text-left pl-2 break-words">{String(row.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: image + actions */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded border border-[#0097A7] shadow-sm overflow-hidden">
              <div className="bg-[#0097A7] text-white text-[13px] text-center py-2.5 font-bold border-b border-[#2e6da4]">
                Item Image and Drawing Information
              </div>
              <div className="p-6">
                <div className="flex mb-8">
                  <div className="w-[30%] text-right pr-4 font-bold text-slate-800 text-[13px] mt-2">Image :</div>
                  <div className="w-[70%]">
                    <div className="w-full max-w-[340px] aspect-[16/10] rounded-lg shadow-inner flex items-center justify-center border-[6px] border-white drop-shadow-md relative overflow-hidden bg-[#0097A7]/20">
                      <ImageIcon className="w-16 h-16 text-[#0097A7]/40" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-[30%] text-right pr-4 font-bold text-slate-800 text-[13px]">Drawing PDF :</div>
                  <div className="w-[70%] text-[13px] text-slate-500">No PDF Uploaded For Drawing.</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 px-1">
              <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5bc0de] hover:bg-[#46b8da] text-white text-[13px] font-semibold rounded shadow-sm transition-colors">
                <LayoutList className="w-3.5 h-3.5" /> Display All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white text-[13px] font-semibold rounded shadow-sm transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={onCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-[13px] font-semibold rounded shadow-sm transition-colors">
                <span className="text-base leading-none mt-[-2px]">+</span> Create New
              </button>
              <button onClick={onViewUploads} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white text-[13px] font-semibold rounded shadow-sm transition-colors">
                <LayoutList className="w-3.5 h-3.5" /> View All Uploaded
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Image PDF Details View ────────────────────────────────────────
function ImagePdfDetailsView({ item, onBack }) {
  if (!item) return null

  const thCls = 'px-4 py-3 text-[13px] font-bold text-slate-800 text-left border-b border-r border-slate-200 last:border-r-0 bg-white'
  const tdCls = 'px-4 py-3 text-[13px] text-slate-600 border-b border-r border-slate-200 last:border-r-0 align-middle'

  return (
    <div className="bg-white min-h-full">
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-4 text-[#0097A7] hover:underline text-sm flex items-center gap-1">
          &larr; Back to Preview
        </button>
        <h1 className="text-[26px] font-normal text-slate-700 mb-6">Item Details</h1>
        <h2 className="text-[17px] font-normal text-slate-800 mb-6">{item.partName}</h2>
        <div className="flex flex-col gap-1 mb-10 ml-8 text-[13px] font-bold text-slate-800">
          <div className="flex items-center">
            <span className="w-28 text-right pr-3">Part Number :</span>
            <span className="font-normal">{item.partNo}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 text-right pr-3">Description :</span>
            <span className="font-normal">{item.description || ''}</span>
          </div>
        </div>
        <h3 className="text-[20px] font-normal text-slate-700 mb-4">Images and PDF Documents</h3>
        <div className="border border-slate-200 rounded-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thCls} style={{ width: '80px' }}>S.No</th>
                <th className={thCls} style={{ width: '200px' }}>Image</th>
                <th className={thCls}>PDF Document</th>
                <th className={thCls}>Updated By</th>
                <th className={thCls}>Updated Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-[13px]">
                  No uploads found for this item.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────
export default function ItemMaster() {
  const [view, setView]               = useState('index')
  const [selectedItem, setSelectedItem] = useState(null)
  const [editItem, setEditItem]       = useState(null)

  const { dropdowns, dropdownsLoading } = useDropdowns()

  const goIndex  = () => { setView('index');  setEditItem(null) }
  const goCreate = () => { setView('create'); setEditItem(null) }
  const goEdit   = (item) => { setEditItem(item); setView('create') }
  const goView   = (item) => { setSelectedItem(item); setView('preview') }

  if (view === 'create') {
    return (
      <CreateView
        onBack={goIndex}
        editItem={editItem}
        dropdowns={dropdowns}
        dropdownsLoading={dropdownsLoading}
        onSaved={goIndex}
      />
    )
  }

  if (view === 'preview' && selectedItem) {
    return (
      <PreviewView
        item={selectedItem}
        dropdowns={dropdowns}
        onBack={goIndex}
        onCreate={goCreate}
        onViewUploads={() => setView('image-pdf-details')}
      />
    )
  }

  if (view === 'image-pdf-details' && selectedItem) {
    return <ImagePdfDetailsView item={selectedItem} onBack={() => setView('preview')} />
  }

  return (
    <IndexView
      onCreate={goCreate}
      onEdit={goEdit}
      onView={goView}
      dropdowns={dropdowns}
    />
  )
}
