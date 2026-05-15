import { useState } from 'react'
import {
  ChevronRight, Package, Store, Settings, Paperclip,
  Pencil, Trash2, Eye, Download, Image as ImageIcon,
  FileImage, FileX, FileMinus, LayoutList,
} from 'lucide-react'
import { useToast } from '../components/Toast'

// ── Shared UI primitives ─────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-3 py-[9px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300"
  />
)

const Select = ({ options, placeholder, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-[9px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
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

// ── Dropdown data ─────────────────────────────────────────────────
const ITEM_GROUPS = [
  'ASSEMBLY-10 TON WINCH-ASSEMBLE', 'ASSEMBLY-10 TON WINCH-CHILD PART', 'ASSEMBLY-10 TON WINCH-SUB ASSEMBLE',
  'ASSEMBLY-GRIPPER-SUB ASSEMBLE', 'ASSEMBLY-P14 WATER PUMP-ASSEMBLE', 'ASSEMBLY-P14 WATER PUMP-CHILDPART',
  'COMMON- COMMON', 'COMMON-BEARING-ARB', 'COMMON-BEARING-BTZ', 'COMMON-BEARING-COMMON',
  'Raw Materials', 'Finished Goods', 'Bought Out Parts', 'Hand Tools', 'Fasteners', 'Consumables',
]
const MODELS = [
  'AUTO JOB', 'COMMON', 'COMPRESSOR', 'Consumables', 'CORE DRILL', 'EQUALIZER BEAM', 'GEARBOX',
  'GRADE CONTROL MACHINE', 'GRC', 'GRIPPER', 'HD 300', 'HDE', 'HMD', 'MDD', 'MICROBLAST', 'MINICORE',
  'MODEL A', 'MODEL B', 'MODEL C', 'MODEL D',
]
const SUB_GROUPS = ['Sub Group 1', 'Sub Group 2', 'Sub Group 3', 'Sub Group 4']
const UOMS = ['NOS', 'KG', 'MTR', 'LTR', 'SET', 'PCS', 'BOX', 'ROLL', 'GM', 'TON']
const ITEM_TYPES = [
  'Assembly FG', 'Asset', 'Child Part', 'Fastner', 'FG', 'Fixing Screw', 'Main Assembly FG',
  'Office Maintainance', 'Printing & Stationary', 'Product', 'Raw Material - Domestic',
  'Raw Material - Import', 'RM Electricals', 'RM Plant & Machinery', 'Staff Welfare', 'Sub Assembly FG',
]
const QC_TYPES = ['QUALITY', 'STORE']
const STORE_NAMES = ['Main Store', 'Raw Material Store', 'FG Store', 'Rejection Store', 'Tools Store', 'Sub Store']
const MATERIAL_GRADES = ['Grade A', 'Grade B', 'IS 2062', 'SS 304', 'SS 316', 'EN8', 'SS 202']
const MATERIAL_TYPES = ['Flat', 'Round Bar', 'Pipe', 'Sheet', 'Channel', 'Angle', 'Hollow Section']
const RAW_MATERIALS = ['MS Flat', 'SS Round Bar', 'Aluminum Sheet', 'MS Pipe', 'HR Sheet', 'CR Sheet', 'GI Sheet']
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED']
const GST_RATES = ['0%', '5%', '12%', '18%', '28%']

// ── Mock index data (matches screenshot) ─────────────────────────
const MOCK_ITEMS = [
  { id: 2203, sno: 1,  partNo: 'VE-70071', osNo: 'VOS4321240', partName: 'Center Slider Sensing plate',          model: '', brand: '', rol: 20, mStock: 10, cStock: 49, rcNo: '',                        imgColor: '#c0392b', drawing: ''            },
  { id: 2205, sno: 2,  partNo: 'VE-70073', osNo: 'VOS4321390', partName: 'Center Slider Sensing plate 2',        model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: '',                        imgColor: '#8e44ad', drawing: ''            },
  { id: 2206, sno: 3,  partNo: 'VE-70074', osNo: 'VOS4321391', partName: 'Center Slider Sensing Shaft 35MM',     model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: '/Content/pdfs/MM383-11.pdf', imgColor: '#27ae60', drawing: 'MM383-11.pdf' },
  { id: 2207, sno: 4,  partNo: 'VE-70075', osNo: '',           partName: 'Center Slider Sensing Shaft 48MM',     model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: 'MM383-10.pdf',           imgColor: '#27ae60', drawing: 'MM383-10.pdf' },
  { id: 2208, sno: 5,  partNo: 'VE-70076', osNo: '',           partName: 'Center Slider Sensing Shaft 85MM',     model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: 'MM383-9.pdf',            imgColor: '#27ae60', drawing: 'MM383-9.pdf'  },
  { id: 2209, sno: 6,  partNo: 'VE-70077', osNo: '',           partName: 'CENTER SLIDER SENSING BAR 50MM',       model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: '',                        imgColor: '#2980b9', drawing: ''            },
  { id: 2210, sno: 7,  partNo: 'VE-70078', osNo: '',           partName: 'ELECTRICAL CONTROL BOX BOTTOM BUSH',   model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: '',                        imgColor: '#2980b9', drawing: ''            },
  { id: 2211, sno: 8,  partNo: 'VE-70079', osNo: '',           partName: 'CENTER SLIDER SENSING BAR 150MM',      model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: '',                        imgColor: '#2980b9', drawing: ''            },
  { id: 2212, sno: 9,  partNo: 'VE-70080', osNo: '',           partName: 'COMMON WIRE SUPPORT PIECE 16MM',       model: '', brand: '', rol: 0,  mStock: 0,  cStock: 0,  rcNo: 'CM05.pdf',               imgColor: '#2980b9', drawing: 'CM05.pdf'    },
  { id: 2231, sno: 10, partNo: 'VE-70041', osNo: '',           partName: 'V2 I 90° sensor clamp',                model: '', brand: '', rol: 10, mStock: 5,  cStock: 52, rcNo: 'MM383-1.pdf',            imgColor: '#16a085', drawing: 'MM383-1.pdf'  },
]

const TOTAL_RECORDS = 23125

// ── Default form state ────────────────────────────────────────────
const emptyForm = {
  GroupId: '', GroupName: '',
  IM_Part_No: '', Outsource_Part_No: '',
  IM_PartName: '', ModelId: '', Brand: '',
  IM_Description: '', IM_Size: '', IM_WEIGHT: '',
  UnitId: '', UnitName: '',
  SubGroupId: '',
  ItemTypeId: '', ItemTypeName: '',
  QcTypeId: '',
  IM_HSN_Code: '',
  IM_Purchase_Rate: '', IM_Margin_per: '', IM_Rate: '',
  CurrencyId: 'INR',
  TaxId: '',
  StoreId: '', StoreName: '',
  MaterialGradeId: '', MaterialTypeId: '', RawMaterialId: '',
  Rack_No: '', Location: '',
  IM_ReorderLevel: '', IM_Min_Stock: '',
  RM_length: '', Raw_material_wt: '', FG_material_wt: '',
  RouteCardNumber: '',
  Status: 'Active',
}

const requiredFields = ['GroupName', 'IM_Part_No', 'IM_PartName', 'UnitName', 'ItemTypeName', 'QcTypeId']

// ── Top action button ─────────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, onClick, variant = 'teal' }) => {
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
      className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-md shadow-sm transition-all duration-150 active:scale-95 ${styles[variant]}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  )
}

// ── Index (table) view ────────────────────────────────────────────
function IndexView({ onCreate, onView }) {
  const [search, setSearch] = useState('')
  const [showEntries, setShowEntries] = useState('10')
  const [page, setPage] = useState(1)

  const filtered = MOCK_ITEMS.filter(item =>
    !search || item.partName.toLowerCase().includes(search.toLowerCase()) ||
    item.partNo.toLowerCase().includes(search.toLowerCase())
  )

  const thCls = 'px-2 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-[#00838f] last:border-r-0 whitespace-nowrap'
  const tdCls = 'px-2 py-2 text-[12px] text-slate-700 text-center border-r border-slate-100 last:border-r-0'

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-4 py-4">

        {/* ── Top action bar ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <ActionBtn icon={Package}    label="Create"                    onClick={onCreate}    variant="green"  />
          <ActionBtn icon={Download}   label="Export All to Excel"        onClick={() => {}}    variant="teal"   />
          <ActionBtn icon={FileImage}  label="View All Uploaded Files"    onClick={() => {}}    variant="blue"   />
          <ActionBtn icon={FileX}      label="View All UnAvailable Images" onClick={() => {}}   variant="indigo" />
          <ActionBtn icon={FileMinus}  label="View All UnAvailable Pdfs"  onClick={() => {}}    variant="orange" />
          <ActionBtn icon={LayoutList} label="Display All"                onClick={() => {}}    variant="slate"  />
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-5 py-2.5">
            <h2 className="text-white text-[13px] font-bold tracking-wider uppercase text-center">
              Item Master Details
            </h2>
          </div>

          {/* Search + Show entries row */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <span>Show</span>
              <select
                value={showEntries}
                onChange={e => setShowEntries(e.target.value)}
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1100px]">
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
                  <th className={thCls} style={{ width: 130 }}>R.C.No.</th>
                  <th className={thCls} style={{ width: 62  }}>Image</th>
                  <th className={thCls} style={{ width: 72  }}>Drawing</th>
                  <th className={thCls} style={{ width: 44  }}>Edit</th>
                  <th className={thCls} style={{ width: 52  }}>Delete</th>
                  <th className={thCls} style={{ width: 56  }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? 'bg-white hover:bg-[#f0fdfe] transition-colors' : 'bg-slate-50 hover:bg-[#f0fdfe] transition-colors'}
                  >
                    <td className={tdCls + ' font-medium text-slate-800'}>{item.id}</td>
                    <td className={tdCls}>{item.sno}</td>
                    <td className={tdCls + ' font-medium text-[#0097A7]'}>{item.partNo}</td>
                    <td className={tdCls + ' text-slate-500'}>{item.osNo}</td>
                    <td className={`${tdCls} text-left font-medium`}>{item.partName}</td>
                    <td className={tdCls}>{item.model}</td>
                    <td className={tdCls}>{item.brand}</td>
                    <td className={tdCls}>{item.rol}</td>
                    <td className={tdCls}>{item.mStock}</td>
                    <td className={`${tdCls} font-semibold ${item.cStock > 0 ? 'text-green-600' : 'text-slate-500'}`}>{item.cStock}</td>
                    <td className={tdCls + ' text-[11px] text-slate-500 text-left'}>{item.rcNo}</td>

                    {/* Image thumbnail */}
                    <td className={tdCls}>
                      <div className="flex items-center justify-center">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: item.imgColor }}
                          title="Product image"
                        >
                          <ImageIcon className="w-4 h-4 text-white/80" />
                        </div>
                      </div>
                    </td>

                    {/* Drawing */}
                    <td className={tdCls}>
                      {item.drawing ? (
                        <button className="flex items-center gap-1 mx-auto text-[11px] text-[#0097A7] hover:text-[#007a87] font-semibold border border-[#0097A7]/30 rounded px-2 py-0.5 hover:bg-[#0097A7]/5 transition-colors">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      ) : null}
                    </td>

                    {/* Edit */}
                    <td className={tdCls}>
                      <button className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#3498db] hover:bg-[#2980b9] text-white transition-colors shadow-sm">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Delete */}
                    <td className={tdCls}>
                      <button className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#e74c3c] hover:bg-[#c0392b] text-white transition-colors shadow-sm">
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer: info + pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[12px] text-slate-500">
              Showing 1 to {filtered.length} of {TOTAL_RECORDS.toLocaleString()} entries
            </p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-[12px] border border-slate-200 rounded-l text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40" disabled>
                Previous
              </button>
              {[1, 2, 3].map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-[12px] border-y border-slate-200 transition-colors ${page === p ? 'bg-[#0097A7] text-white border-[#0097A7]' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
              <button className="px-3 py-1.5 text-[12px] border border-slate-200 rounded-r text-slate-600 hover:bg-slate-100 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Create form view ──────────────────────────────────────────────
function CreateView({ onBack }) {
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const handleGroup    = e => setForm(f => ({ ...f, GroupName: e.target.value, GroupId: '' }))
  const handleUOM      = e => setForm(f => ({ ...f, UnitName: e.target.value, UnitId: '' }))
  const handleItemType = e => setForm(f => ({ ...f, ItemTypeName: e.target.value, ItemTypeId: '' }))
  const handleStore    = e => setForm(f => ({ ...f, StoreName: e.target.value, StoreId: '' }))
  const handleClear    = () => setForm({ ...emptyForm })

  const handleCreate = () => {
    const missing = requiredFields.filter(k => !form[k])
    if (missing.length) { toast.warning('Please fill required fields: ' + missing.join(', ')); return }
    toast.success('Item Created Successfully!')
    onBack()
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
          <span className="text-[#0097A7] font-semibold">New Item Master</span>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* ── COLUMN 1: Item Information ── */}
          <SectionCard title="Item Information" icon={<Package className="w-4 h-4" />}>
            <div>
              <Label required>Item Group</Label>
              <Select options={ITEM_GROUPS} placeholder="---Select Group Name---" value={form.GroupName} onChange={handleGroup} />
            </div>
            <div>
              <Label required>Part Number</Label>
              <Input placeholder="Enter Part Number" value={form.IM_Part_No} onChange={u('IM_Part_No')} />
            </div>
            <div>
              <Label>OutSource Part No</Label>
              <div className="flex gap-2">
                <Input placeholder="OutSource Part No" value={form.Outsource_Part_No} onChange={u('Outsource_Part_No')} />
                <button className="flex-shrink-0 w-9 h-[38px] bg-[#0097A7] hover:bg-[#007a87] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm font-bold text-xl leading-none">+</button>
              </div>
            </div>
            <div>
              <Label required>Part Name</Label>
              <Input placeholder="Type to search for Part Name..." value={form.IM_PartName} onChange={u('IM_PartName')} />
            </div>
            <Row>
              <div>
                <Label required>Model</Label>
                <Select options={MODELS} placeholder="---Select Model---" value={form.ModelId} onChange={u('ModelId')} />
              </div>
              <div>
                <Label>Brand</Label>
                <Input placeholder="Type to search..." value={form.Brand} onChange={u('Brand')} />
              </div>
            </Row>
            <div>
              <Label>Description</Label>
              <Input placeholder="Description" value={form.IM_Description} onChange={u('IM_Description')} />
            </div>
            <Row>
              <div>
                <Label>Size</Label>
                <Input placeholder="Size" value={form.IM_Size} onChange={u('IM_Size')} />
              </div>
              <div>
                <Label required>Weight</Label>
                <Input placeholder="Weight" value={form.IM_WEIGHT} onChange={u('IM_WEIGHT')} type="number" />
              </div>
            </Row>
            <div>
              <Label required>UOM</Label>
              <Select options={UOMS} placeholder="---Select UOM---" value={form.UnitName} onChange={handleUOM} />
            </div>
            <div>
              <Label>HSN Code</Label>
              <Input placeholder="HSN Code" value={form.IM_HSN_Code} onChange={u('IM_HSN_Code')} />
            </div>
            <Row>
              <div>
                <Label>Purchase Rate</Label>
                <Input placeholder="Purchase Rate" value={form.IM_Purchase_Rate} onChange={u('IM_Purchase_Rate')} type="number" />
              </div>
              <div>
                <Label>Margin (%)</Label>
                <Input placeholder="Margin (%)" value={form.IM_Margin_per} onChange={u('IM_Margin_per')} type="number" />
              </div>
            </Row>
            <Row>
              <div>
                <Label>Rate</Label>
                <Input placeholder="Rate" value={form.IM_Rate} onChange={u('IM_Rate')} type="number" />
              </div>
              <div>
                <Label>Currency</Label>
                <Select options={CURRENCIES} placeholder="" value={form.CurrencyId} onChange={u('CurrencyId')} />
              </div>
            </Row>
            <div>
              <Label required>GST %</Label>
              <Select options={GST_RATES} placeholder="---Select GST %---" value={form.TaxId} onChange={u('TaxId')} />
            </div>
          </SectionCard>

          {/* ── COLUMN 2: Store & Raw Material ── */}
          <div className="space-y-5">
            <SectionCard title="Store & Classification" icon={<Store className="w-4 h-4" />}>
              <div>
                <Label required>Sub Group</Label>
                <Select options={SUB_GROUPS} placeholder="---Select Sub Group---" value={form.SubGroupId} onChange={u('SubGroupId')} />
              </div>
              <Row>
                <div>
                  <Label>Reorder Level</Label>
                  <Input placeholder="Reorder Level" value={form.IM_ReorderLevel} onChange={u('IM_ReorderLevel')} type="number" />
                </div>
                <div>
                  <Label>Min Stock</Label>
                  <Input placeholder="Min Stock" value={form.IM_Min_Stock} onChange={u('IM_Min_Stock')} type="number" />
                </div>
              </Row>
              <div>
                <Label required>Store Name</Label>
                <Select options={STORE_NAMES} placeholder="---Select Store Name---" value={form.StoreName} onChange={handleStore} />
              </div>
              <Row>
                <div>
                  <Label>Rack Number</Label>
                  <Input placeholder="Rack Number" value={form.Rack_No} onChange={u('Rack_No')} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input placeholder="Location" value={form.Location} onChange={u('Location')} />
                </div>
              </Row>
              <Row>
                <div>
                  <Label required>Item Type</Label>
                  <Select options={ITEM_TYPES} placeholder="---Select Item Type---" value={form.ItemTypeName} onChange={handleItemType} />
                </div>
                <div>
                  <Label required>QC Type</Label>
                  <Select options={QC_TYPES} placeholder="---Select QC Type---" value={form.QcTypeId} onChange={u('QcTypeId')} />
                </div>
              </Row>
            </SectionCard>

            <SectionCard title="Raw Material Selection" icon={<Settings className="w-4 h-4" />}>
              <Row>
                <div>
                  <Label>Material Grade</Label>
                  <Select options={MATERIAL_GRADES} placeholder="---Select Material Grade---" value={form.MaterialGradeId} onChange={u('MaterialGradeId')} />
                </div>
                <div>
                  <Label>Material Type</Label>
                  <Select options={MATERIAL_TYPES} placeholder="---Select Material Type---" value={form.MaterialTypeId} onChange={u('MaterialTypeId')} />
                </div>
              </Row>
              <div>
                <Label>Raw Material</Label>
                <Select options={RAW_MATERIALS} placeholder="---Select Raw Material---" value={form.RawMaterialId} onChange={u('RawMaterialId')} />
              </div>
              <div>
                <Label>Length</Label>
                <Input placeholder="Length (e.g. 6m)" value={form.RM_length} onChange={u('RM_length')} />
              </div>
              <Row>
                <div>
                  <Label>RM. Weight</Label>
                  <Input placeholder="RM. Weight" value={form.Raw_material_wt} onChange={u('Raw_material_wt')} type="number" />
                </div>
                <div>
                  <Label>FG. Weight</Label>
                  <Input placeholder="FG. Weight" value={form.FG_material_wt} onChange={u('FG_material_wt')} type="number" />
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
                  {[
                    { label: 'Create',     icon: 'M12 4v16m8-8H4',                                     bg: 'bg-green-500 hover:bg-green-600',     action: handleCreate },
                    { label: 'Clear',      icon: 'M6 18L18 6M6 6l12 12',                               bg: 'bg-rose-500 hover:bg-rose-600',       action: handleClear  },
                    { label: 'Display All',icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',                    bg: 'bg-[#0097A7] hover:bg-[#007a87]',    action: onBack       },
                    { label: 'Search',     icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',       bg: 'bg-slate-700 hover:bg-slate-800',     action: () => {}     },
                  ].map(({ label, icon, bg, action }) => (
                    <button key={label} onClick={action}
                      className={`px-3 py-2.5 ${bg} active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} />
                      </svg>
                      {label}
                    </button>
                  ))}
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
function PreviewView({ item, onBack, onCreate, onViewUploads }) {
  if (!item) return null;

  const infoRows = [
    { label: 'Item Group', value: 'ELECTRICAL-SENSING CLAMP' },
    { label: 'Part Number', value: item.partNo },
    { label: 'Out Source Part No.', value: item.osNo || 'VOS4321390' },
    { label: 'Part Name', value: item.partName },
    { label: 'Model', value: item.model || 'AUTO JOB' },
    { label: 'Brand', value: item.brand || '' },
    { label: 'Description', value: '' },
    { label: 'Size', value: '' },
    { label: 'Weight', value: '0.00' },
    { label: 'UOM', value: 'No' },
    { label: 'HSN Code', value: '' },
    { label: 'Purchase Rate', value: '450.00' },
    { label: 'Margin (%)', value: '20.00' },
    { label: 'Rate', value: '540.00' },
    { label: 'Currency', value: 'CNRY' },
    { label: 'GST Per', value: '18.00' },
    { label: 'Sub Group', value: 'Production' },
    { label: 'Store Name', value: 'STORE 1-MAINSTORE' },
    { label: 'Rack Number', value: '' },
    { label: 'Location', value: '' },
    { label: 'Remarks', value: '' },
    { label: 'Item Type', value: 'Child Part' },
    { label: 'QC Type', value: '' },
    { label: 'Material Grade', value: '' },
    { label: 'Material Type', value: '' },
    { label: 'Raw Material', value: '' },
    { label: 'Length', value: '0' },
    { label: 'RM. Weight', value: '0.00' },
    { label: 'FG. Weight', value: '0.00' },
    { label: 'Status', value: 'A' },
    { label: 'Reorder Level', value: item.rol },
    { label: 'Min Stock', value: item.mStock },
    { label: 'Current Stock', value: item.cStock },
    { label: 'Route Card Number', value: item.rcNo },
    { label: 'Created Date', value: '09/11/2020 11:31:48' },
    { label: 'Created By', value: 'ADMIN' },
    { label: 'Updated Date', value: '11/07/2025 14:43:56' },
    { label: 'Updated By', value: 'SATHISH' },
  ];

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-4 py-4 max-w-[1200px] mx-auto">
        <div className="bg-[#0097A7] text-white text-sm font-semibold tracking-wide text-center py-2.5 mb-4 rounded shadow-sm border border-[#2e6da4]">
          Preview Of Selected Item Master Details
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="bg-[#0097A7] rounded border border-[#2e6da4] shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#0097A7] text-white text-[13px] text-center py-2.5 font-bold border-b border-white/20">
              Item Basic Information
            </div>
            <div className="text-white p-4 flex-1 text-[12px]">
              <div className="grid grid-cols-[40%_5%_55%] gap-y-[3px]">
                {infoRows.map((row, idx) => (
                  <div key={idx} className="contents">
                    <div className="text-left pl-3 font-bold tracking-wide">{row.label}</div>
                    <div className="text-center font-bold tracking-wide">:</div>
                    <div className="text-left pl-2 break-words">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded border border-[#0097A7] shadow-sm overflow-hidden">
              <div className="bg-[#0097A7] text-white text-[13px] text-center py-2.5 font-bold border-b border-[#2e6da4]">
                Item Image and Drawing Information
              </div>
              <div className="p-6">
                <div className="flex mb-8">
                   <div className="w-[30%] text-right pr-4 font-bold text-slate-800 text-[13px] mt-2">Image :</div>
                   <div className="w-[70%]">
                     <div 
                       className="w-full max-w-[340px] aspect-[16/10] rounded-lg shadow-inner flex items-center justify-center border-[6px] border-white drop-shadow-md relative overflow-hidden" 
                       style={{ backgroundColor: item.imgColor || '#16a085' }}
                     >
                       <div className="w-[80%] h-[75%] border border-white/10 bg-black/10 rounded-lg flex items-center justify-center shadow-inner">
                         <div className="w-20 h-20 bg-white rounded-full shadow-inner border border-slate-200 flex items-center justify-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full shadow-inner inset-0"></div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
                <div className="flex items-center">
                   <div className="w-[30%] text-right pr-4 font-bold text-slate-800 text-[13px]">Drawing PDF :</div>
                   <div className="w-[70%] text-[13px] text-slate-700">
                     {item.drawing ? item.drawing : 'No PDF Uploaded For Drawing.'}
                   </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 px-1">
              <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5bc0de] hover:bg-[#46b8da] text-white text-[13px] font-semibold rounded shadow-sm transition-colors border border-[#46b8da]">
                <LayoutList className="w-3.5 h-3.5" /> Display All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white text-[13px] font-semibold rounded shadow-sm transition-colors border border-[#2e6da4]">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={onCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-[13px] font-semibold rounded shadow-sm transition-colors border border-[#4cae4c]">
                <span className="text-base leading-none mt-[-2px]">+</span> Create New
              </button>
              <button onClick={onViewUploads} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white text-[13px] font-semibold rounded shadow-sm transition-colors border border-[#2e6da4]">
                <LayoutList className="w-3.5 h-3.5" /> View All Uploaded
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Image PDF Details View ─────────────────────────────────────────
function ImagePdfDetailsView({ item, onBack }) {
  if (!item) return null;

  const mockUploads = [
    { sno: 1, updatedBy: '', updatedDate: '11/07/2025 10:00:29' },
    { sno: 2, updatedBy: '', updatedDate: '11/07/2025 10:05:41' },
    { sno: 3, updatedBy: 'RAVI KUMAR', updatedDate: '11/07/2025 10:10:02' },
    { sno: 4, updatedBy: 'RAVI KUMAR', updatedDate: '11/07/2025 10:10:20' },
    { sno: 5, updatedBy: 'SATHISH', updatedDate: '11/07/2025 12:09:32' },
    { sno: 6, updatedBy: 'SATHISH', updatedDate: '11/07/2025 12:11:02' },
    { sno: 7, updatedBy: 'SATHISH', updatedDate: '11/07/2025 12:12:01' },
    { sno: 8, updatedBy: '', updatedDate: '11/07/2025 14:05:10' },
  ];

  const thCls = 'px-4 py-3 text-[13px] font-bold text-slate-800 text-left border-b border-r border-slate-200 last:border-r-0 bg-white';
  const tdCls = 'px-4 py-3 text-[13px] text-slate-600 border-b border-r border-slate-200 last:border-r-0 align-middle';

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
             <span className="font-normal"></span>
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
              {mockUploads.map((row) => (
                <tr key={row.sno} className="hover:bg-slate-50 transition-colors">
                  <td className={`${tdCls} font-medium`}>{row.sno}</td>
                  <td className={tdCls}>
                    <div 
                      className="w-[84px] h-[52px] rounded border-2 border-white shadow flex items-center justify-center relative overflow-hidden" 
                      style={{ backgroundColor: item.imgColor || '#16a085' }}
                    >
                      <div className="w-[60%] h-[75%] border border-white/10 bg-black/10 rounded flex items-center justify-center shadow-inner">
                        <div className="w-5 h-5 bg-white rounded-full shadow-inner border border-slate-200 flex items-center justify-center">
                           <div className="w-3 h-3 bg-slate-50 rounded-full shadow-inner inset-0"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={tdCls}></td>
                  <td className={tdCls}>{row.updatedBy}</td>
                  <td className={tdCls}>{row.updatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────
export default function ItemMaster() {
  const [view, setView] = useState('index')
  const [selectedItem, setSelectedItem] = useState(null)

  if (view === 'create') return <CreateView onBack={() => setView('index')} />
  if (view === 'preview' && selectedItem) return <PreviewView item={selectedItem} onBack={() => setView('index')} onCreate={() => setView('create')} onViewUploads={() => setView('image-pdf-details')} />
  if (view === 'image-pdf-details' && selectedItem) return <ImagePdfDetailsView item={selectedItem} onBack={() => setView('preview')} />
  
  return <IndexView onCreate={() => setView('create')} onView={(item) => { setSelectedItem(item); setView('preview'); }} />
}
