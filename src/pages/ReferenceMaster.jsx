import { useState } from 'react'
import { ChevronRight, Search, Save, Edit2, Trash2, X, FileSpreadsheet, ChevronUp } from 'lucide-react'
import { useToast } from '../components/Toast'

const REF_TYPES = [
  'Account Type',
  'App_User',
  'Area',
  'Booking_Status',
  'Booking_Vehicle_Name',
  'Breakdown_Email',
  'Conformation_Part_Description',
  'Conformation_Type',
  'Currency',
  'DC_Type',
  'Department',
  'Designation',
  'Discount Type',
  'Form',
  'Freight',
  'GRN_Inward_Type',
  'Inward_Type',
  'Item Category',
  'Item Expiry',
  'Item Group',
  'Item Lock',
  'Item Type',
  'JOB_Email',
  'Ledger Type',
  'Line',
  'Machine Categroy',
  'Material_Grade',
  'Material_Req_For',
  'Material_Type',
  'OUTSOURCE_STATUS_TYPE',
  'OUTSOURCE_TYPE',
  'PAYMODE',
  'Po Status',
  'PO Type',
  'Print_Copy',
  'Priority',
  'Process_Type',
  'QC_Inspection_Type',
  'QC_STATUS',
  'QC_Type',
  'Quotation Type',
  'Quotation_confirmed_Status',
  'Spare_Issue_Type',
  'State',
  'Status',
  'Store',
  'Sub Group',
  'Tax Type',
  'Team',
  'Terms',
  'UOM',
  'User Role',
  'Vehicle_Sub_Type',
  'Vehicle_Type',
  'Warranty_Type',
]

const SEED = [
  { id:1, refType:'QC_Status',      code:'001', description:'QC REJECT'            },
  { id:2, refType:'QC_Status',      code:'002', description:'QC REWORK'            },
  { id:3, refType:'QC_Status',      code:'003', description:'QC OK'                },
  { id:4, refType:'QC_Status',      code:'004', description:'MSCRAB'               },
  { id:5, refType:'Job Status',     code:'001', description:'Waiting for Process'  },
  { id:6, refType:'Job Status',     code:'002', description:'In Process'           },
  { id:7, refType:'Job Status',     code:'003', description:'Close'                },
  { id:8, refType:'Department',     code:'001', description:'PURCHASE'             },
  { id:9, refType:'Department',     code:'002', description:'ACCOUNTS'             },
  { id:10,refType:'Department',     code:'003', description:'MARKETING'            },
  { id:11,refType:'Department',     code:'004', description:'PARCEL'               },
  { id:12,refType:'Unit of Measure',code:'001', description:'Nos'                  },
  { id:13,refType:'Unit of Measure',code:'002', description:'Kgs'                  },
  { id:14,refType:'Unit of Measure',code:'003', description:'Mtrs'                 },
]

const STORAGE_KEY = 'velson_reference_master'

const nextCode = (rows, refType) => {
  const same = rows.filter(r => r.refType === refType)
  return String(same.length + 1).padStart(3, '0')
}

export default function ReferenceMaster() {
  const toast = useToast()

  const [rows, setRows] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return saved || SEED
  })

  const [refType,     setRefType]     = useState('')
  const [code,        setCode]        = useState('001')
  const [description, setDescription] = useState('')
  const [search,      setSearch]      = useState('')
  const [editId,      setEditId]      = useState(null)
  const [tableOpen,   setTableOpen]   = useState(true)

  const persist = updated => {
    setRows(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const handleRefTypeChange = val => {
    setRefType(val)
    if (!editId) setCode(nextCode(rows, val))
  }

  const handleSave = () => {
    if (!refType)     { toast.warning('Reference Type is required.'); return }
    if (!code)        { toast.warning('Code is required.'); return }
    if (!description) { toast.warning('Description is required.'); return }

    if (editId) {
      persist(rows.map(r => r.id === editId ? { ...r, refType, code, description } : r))
      toast.success('Record updated.')
      setEditId(null)
    } else {
      if (rows.find(r => r.refType === refType && r.code === code)) {
        toast.warning('Code already exists for this Reference Type.')
        return
      }
      const newRow = { id: Date.now(), refType, code, description }
      persist([...rows, newRow])
      toast.success('Record saved.')
    }
    handleClear()
  }

  const handleEdit = () => {
    const filtered = displayed
    if (!filtered.length) { toast.warning('No record selected to edit.'); return }
    const r = filtered[0]
    setRefType(r.refType); setCode(r.code); setDescription(r.description); setEditId(r.id)
  }

  const handleDelete = () => {
    const filtered = displayed
    if (!filtered.length) { toast.warning('No record to delete.'); return }
    if (!window.confirm(`Delete ${filtered.length} record(s)?`)) return
    const ids = new Set(filtered.map(r => r.id))
    persist(rows.filter(r => !ids.has(r.id)))
    toast.success('Record(s) deleted.')
    handleClear()
  }

  const handleClear = () => {
    setRefType(''); setCode('001'); setDescription(''); setSearch(''); setEditId(null)
  }

  const displayed = rows.filter(r =>
    !search ||
    r.refType.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span><ChevronRight size={12} /><span>Master</span><ChevronRight size={12} />
          <span className="text-[#0097A7]">Reference Master</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Reference Master</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info('Exporting Excel...')}
                className="flex items-center gap-1 px-3 py-1 text-emerald-600 hover:text-emerald-700 text-[11px] font-bold border border-emerald-300 rounded transition-all">
                <FileSpreadsheet size={13} /> Excel
              </button>
              <button className="flex items-center gap-1 px-3 py-1 text-slate-500 hover:text-red-600 text-[11px] font-bold border border-slate-200 rounded hover:border-red-300 transition-all">
                <X size={13} /> Close
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Form */}
            <table className="border-collapse text-[12px]">
              <tbody>
                <tr>
                  <td className="pb-2 pr-2">
                    <span className="text-red-600 font-bold mr-1">*</span>
                    <span className="text-[11px] font-bold text-slate-700">Reference Type :</span>
                  </td>
                  <td className="pb-2">
                    <select value={refType} onChange={e => handleRefTypeChange(e.target.value)}
                      className="px-2 py-[4px] text-[12px] border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-56">
                      <option value=""></option>
                      {REF_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="pb-2 pr-2">
                    <span className="text-red-600 font-bold mr-1">*</span>
                    <span className="text-[11px] font-bold text-slate-700">Code :</span>
                  </td>
                  <td className="pb-2">
                    <input type="text" value={code} onChange={e => setCode(e.target.value)}
                      className="px-2 py-[4px] text-[12px] border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-56" />
                  </td>
                </tr>
                <tr>
                  <td className="pr-2">
                    <span className="text-red-600 font-bold mr-1">*</span>
                    <span className="text-[11px] font-bold text-slate-700">Description :</span>
                  </td>
                  <td>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                      className="px-2 py-[4px] text-[12px] border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-56" />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Toolbar */}
            <div className="flex items-center gap-2 bg-[#6b7a8d] px-3 py-1.5 rounded">
              {/* Search */}
              <span className="text-[11px] font-bold text-white whitespace-nowrap flex items-center gap-1">
                <Search size={12} /> Search
              </span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="px-2 py-[3px] text-[12px] border border-slate-400 rounded bg-white text-slate-700 focus:outline-none w-44" />
              <button onClick={() => toast.info(`${displayed.length} record(s).`)}
                className="text-white hover:text-slate-200 transition-all">
                <Search size={14} />
              </button>

              {/* Right-side action buttons */}
              <div className="ml-auto flex items-center gap-1.5">
                <button onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-[4px] bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-300 transition-all active:scale-95">
                  <Save size={12} /> Save
                </button>
                <button onClick={handleEdit}
                  className="flex items-center gap-1 px-3 py-[4px] bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded border border-slate-300 transition-all active:scale-95">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-[4px] bg-white hover:bg-slate-100 text-red-600 text-[11px] font-bold rounded border border-slate-300 transition-all active:scale-95">
                  <Trash2 size={12} /> Delete
                </button>
                <button onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-[4px] bg-white hover:bg-slate-100 text-amber-600 text-[11px] font-bold rounded border border-slate-300 transition-all active:scale-95">
                  <X size={12} /> Clear
                </button>
                <button onClick={() => setTableOpen(v => !v)}
                  className="text-white hover:text-slate-200 ml-1 transition-all">
                  <ChevronUp size={16} className={`transition-transform ${tableOpen ? '' : 'rotate-180'}`} />
                </button>
              </div>
            </div>

            {/* Table */}
            {tableOpen && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="sticky top-0 z-10 bg-[#4472C4] text-white text-[10px] uppercase font-bold">
                      <tr>
                        <th className="px-3 py-2.5 border-r border-blue-400 w-10 text-center">S.No</th>
                        <th className="px-3 py-2.5 border-r border-blue-400 w-36">Reference Type</th>
                        <th className="px-3 py-2.5 border-r border-blue-400 w-20 text-center">Code</th>
                        <th className="px-3 py-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {displayed.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-[12px] text-slate-400">
                            No records found.
                          </td>
                        </tr>
                      ) : displayed.map((r, i) => (
                        <tr key={r.id}
                          onClick={() => { setRefType(r.refType); setCode(r.code); setDescription(r.description); setEditId(r.id) }}
                          className={`h-8 cursor-pointer text-[12px] transition-colors ${editId === r.id ? 'bg-[#1565C0] text-white' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}`}>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center font-bold ${editId === r.id ? '' : 'text-slate-400'}`}>{i + 1}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 font-semibold ${editId === r.id ? '' : 'text-[#0097A7]'}`}>{r.refType}</td>
                          <td className={`px-3 py-1 border-r border-slate-100 text-center font-bold ${editId === r.id ? '' : 'text-slate-600'}`}>{r.code}</td>
                          <td className={`px-3 py-1 ${editId === r.id ? '' : 'text-slate-700'}`}>{r.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500">
                  Row : {displayed.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
