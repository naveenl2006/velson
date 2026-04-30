import { useState } from 'react'
import { ChevronRight, Package, Store, Settings, Paperclip } from 'lucide-react'

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

// ── Dropdown data (matches real ERP values from screenshots) ─────
const ITEM_GROUPS = [
  'ASSEMBLY-10 TON WINCH-ASSEMBLE','ASSEMBLY-10 TON WINCH-CHILD PART','ASSEMBLY-10 TON WINCH-SUB ASSEMBLE',
  'ASSEMBLY-GRIPPER-SUB ASSEMBLE','ASSEMBLY-P14 WATER PUMP-ASSEMBLE','ASSEMBLY-P14 WATER PUMP-CHILDPART',
  'ASSEMBLY-P14 WATER PUMP-SUB ASSEMBLE','ASSEMBLY-P56 WATER PUMP-ASSEMBLE','ASSEMBLY-P56 WATER PUMP-CHILDPART',
  'ASSEMBLY-P56 WATER PUMP-SUB ASSEMBLE','ASSEMBLY-P72 WATER PUMP-CHILDPART','ASSEMBLY-V15 WATER PUMP-ASSEMBLE',
  'ASSEMBLY-V15 WATER PUMP-CHILDPART','ASSEMBLY-V15 WATER PUMP-SUB ASSEMBLE','ASSEMBLY-WATER SWIVEL ROTARY HEAD-CHILDPART',
  'COMMON- COMMON','COMMON-BEARING-ARB','COMMON-BEARING-BTZ','COMMON-BEARING-COMMON','COMMON-BEARING-FAG',
  'COMMON-BEARING-KOYO','COMMON-BEARING-NBC','COMMON-BEARING-NSK','COMMON-BEARING-NTN','COMMON-BEARING-OMT',
  'COMMON-BEARING-SB','Raw Materials','Finished Goods','Bought Out Parts','Hand Tools','Fasteners','Consumables',
]

const MODELS = [
  'AUTO JOB','COMMON','COMPRESSOR','Consumables','CORE DRILL','EQUALIZER BEAM','GEARBOX',
  'GRADE CONTROL MACHINE','GRC','GRIPPER','HD 300','HDE','HMD','MDD','MICROBLAST','MINICORE','POWERPACK',
  'MODEL A','MODEL B','MODEL C','MODEL D',
]

const SUB_GROUPS = [
  'Sub Group 1','Sub Group 2','Sub Group 3','Sub Group 4',
]

const UOMS = ['NOS','KG','MTR','LTR','SET','PCS','BOX','ROLL','GM','TON']

const ITEM_TYPES = [
  'Assembly FG','Asset','Child Part','Fastner','FG','Fixing Screw','Main Assembly FG',
  'Office Maintainance','Printing & Stationary','Product','Raw Material - Domestic',
  'Raw Material - Import','RM Electricals','RM Plant & Machinery','Staff Welfare','Sub Assembly FG',
]

const QC_TYPES = ['QUALITY','STORE']

const STORE_NAMES = ['Main Store','Raw Material Store','FG Store','Rejection Store','Tools Store','Sub Store']

const MATERIAL_GRADES = ['Grade A','Grade B','IS 2062','SS 304','SS 316','EN8','SS 202']

const MATERIAL_TYPES = ['Flat','Round Bar','Pipe','Sheet','Channel','Angle','Hollow Section']

const RAW_MATERIALS = ['MS Flat','SS Round Bar','Aluminum Sheet','MS Pipe','HR Sheet','CR Sheet','GI Sheet']

const CURRENCIES = ['INR','USD','EUR','GBP','AED']

const GST_RATES = ['0%','5%','12%','18%','28%']

// ── Default form state (keys match backend items table data object) ──
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

const requiredFields = ['GroupName','IM_Part_No','IM_PartName','UnitName','ItemTypeName','QcTypeId']

export default function ItemMaster() {
  const [form, setForm] = useState(emptyForm)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Special handlers that set both ID and Name together
  const handleGroup = e => setForm(f => ({ ...f, GroupName: e.target.value, GroupId: '' }))
  const handleUOM   = e => setForm(f => ({ ...f, UnitName: e.target.value, UnitId: '' }))
  const handleItemType = e => setForm(f => ({ ...f, ItemTypeName: e.target.value, ItemTypeId: '' }))
  const handleStore = e => setForm(f => ({ ...f, StoreName: e.target.value, StoreId: '' }))

  const handleClear = () => setForm({ ...emptyForm })

  const handleCreate = () => {
    const missing = requiredFields.filter(k => !form[k])
    if (missing.length) { alert('Please fill required fields: ' + missing.join(', ')); return }
    alert('Item Created!\n' + JSON.stringify(form, null, 2))
  }

  const completedCount = requiredFields.filter(k => form[k]).length
  const completionPct  = Math.round((completedCount / requiredFields.length) * 100)

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Item Masters</span>
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
            <div>
              <Label>Route Card Number</Label>
              <Input placeholder="Route Card Number" value={form.RouteCardNumber} onChange={u('RouteCardNumber')} />
            </div>
            <div>
              <Label>Status</Label>
              <Select options={['Active','Inactive']} placeholder="" value={form.Status} onChange={u('Status')} />
            </div>
          </SectionCard>

          {/* ── COLUMN 2: Store & Raw Material ── */}
          <div className="space-y-5">
            <SectionCard title="Store & Classification" icon={<Store className="w-4 h-4" />}>
              <div>
                <Label>Sub Group</Label>
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

          {/* ── COLUMN 3: Uploads, Actions & Progress ── */}
          <div className="space-y-5">
            <SectionCard title="Attachments & Actions" icon={<Paperclip className="w-4 h-4" />}>
              {/* Upload Image */}
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

              {/* Upload Drawing PDF */}
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

              {/* Action Buttons */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Create',      icon: 'M12 4v16m8-8H4',                       bg: 'bg-green-500 hover:bg-green-600',   action: handleCreate },
                    { label: 'Clear',       icon: 'M6 18L18 6M6 6l12 12',                 bg: 'bg-rose-500 hover:bg-rose-600',     action: handleClear },
                    { label: 'Display All', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',      bg: 'bg-[#0097A7] hover:bg-[#007a87]',  action: () => {} },
                    { label: 'Search',      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', bg: 'bg-slate-700 hover:bg-slate-800', action: () => {} },
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
