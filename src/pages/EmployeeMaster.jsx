import { useState } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const DEPARTMENTS  = ['Production','Quality','Stores','Purchase','Sales','HR','Finance','Admin','IT','Maintenance']
const DESIGNATIONS = ['Manager','Engineer','Technician','Supervisor','Operator','Inspector','Executive','Officer','Assistant','Director']
const CONTRACTORS  = ['Contractor A','Contractor B','Contractor C']
const COMPANIES    = ['VELSON INDUSTRIES PVT LTD','VELSON SERVICES LLP']
const TABS         = ['Basic Info', 'Additional Info', 'Job & Company']
const PAGE_SIZES   = [4, 10, 25, 50]
const TEAL         = '#0097A7'

const empty = {
  EM_Code: '', EM_Employee_Name: '', Address: '', Contact_No: '', EM_Status: 'Active',
  Adhar_No: '', Join_Date: '', EM_DOB: '', Releving_Date: '', EM_Email_ID: '',
  DepartmentId: '', DesignationId: '', ContractId: '', CompanyId: '', EM_Team: '', EM_Rep_Person: '',
}

const SEED = [
  { id: 1, ...empty, EM_Code: 'EMP001', EM_Employee_Name: 'RAJESH KUMAR',  Contact_No: '9876543210', Join_Date: '2022-01-15', DepartmentId: 'Production', DesignationId: 'Engineer',   CompanyId: 'VELSON INDUSTRIES PVT LTD', EM_Status: 'Active' },
  { id: 2, ...empty, EM_Code: 'EMP002', EM_Employee_Name: 'PRIYA SHARMA',  Contact_No: '9876543211', Join_Date: '2021-06-01', DepartmentId: 'Quality',    DesignationId: 'Inspector',  CompanyId: 'VELSON INDUSTRIES PVT LTD', EM_Status: 'Active' },
  { id: 3, ...empty, EM_Code: 'EMP003', EM_Employee_Name: 'SURESH BABU',   Contact_No: '9876543212', Join_Date: '2020-03-10', DepartmentId: 'Stores',     DesignationId: 'Supervisor', CompanyId: 'VELSON SERVICES LLP',       EM_Status: 'Active' },
]

export default function EmployeeMaster() {
  const [rows, setRows]         = useState(SEED)
  const [form, setForm]         = useState({ ...empty })
  const [errors, setErrors]     = useState({})
  const [editId, setEditId]     = useState(null)
  const [search, setSearch]     = useState('')
  const [pageSize, setPageSize] = useState(4)
  const [page, setPage]         = useState(1)
  const [detailRow, setDetailRow] = useState(null)
  const [tab, setTab]           = useState(0)

  const sf = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }
  const validate = () => {
    const e = {}
    if (!form.EM_Code.trim())           e.EM_Code = 'Required'
    if (!form.EM_Employee_Name.trim())  e.EM_Employee_Name = 'Required'
    if (!form.DepartmentId)             e.DepartmentId = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }
  const handleSave = () => {
    if (!validate()) { setTab(0); return }
    if (editId !== null) {
      setRows(r => r.map(x => x.id === editId ? { ...form, id: editId } : x))
      setEditId(null)
    } else {
      const id = Math.max(0, ...rows.map(r => r.id)) + 1
      setRows(r => [...r, { ...form, id }])
    }
    setForm({ ...empty }); setErrors({}); setPage(1); setTab(0)
  }
  const handleEdit   = r  => { setForm({ ...r }); setErrors({}); setEditId(r.id); setTab(0); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = id => { if (window.confirm('Delete?')) setRows(r => r.filter(x => x.id !== id)) }
  const handleClear  = ()  => { setForm({ ...empty }); setErrors({}); setEditId(null) }

  const filtered = rows.filter(r =>
    [r.EM_Code, r.EM_Employee_Name, r.DepartmentId, r.DesignationId, r.Contact_No, r.EM_Status]
      .some(v => String(v || '').toLowerCase().includes(search.toLowerCase()))
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

  const inp = (err) => `w-full border rounded px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 transition-colors bg-white ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
  const lbl = 'text-[13px] font-semibold text-slate-600 whitespace-nowrap'

  const FI = ({ label, fk, type = 'text', req, ml }) => (
    <div className="flex items-center gap-3">
      <label className={`${lbl} w-36 shrink-0`}>{req && <span className="text-red-500">*</span>}{label} :</label>
      <div className="flex-1">
        <input type={type} value={form[fk] || ''} onChange={e => sf(fk, e.target.value)}
          className={inp(errors[fk])} maxLength={ml} />
        {errors[fk] && <p className="text-[11px] text-red-500 mt-0.5">{errors[fk]}</p>}
      </div>
    </div>
  )

  const FS = ({ label, fk, opts, req }) => (
    <div className="flex items-center gap-3">
      <label className={`${lbl} w-36 shrink-0`}>{req && <span className="text-red-500">*</span>}{label} :</label>
      <div className="flex-1">
        <select value={form[fk]} onChange={e => sf(fk, e.target.value)} className={inp(errors[fk])}>
          <option value="">--- Select ---</option>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
        {errors[fk] && <p className="text-[11px] text-red-500 mt-0.5">{errors[fk]}</p>}
      </div>
    </div>
  )

  return (
    <div className="p-4 space-y-4 w-full min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span><ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#0097A7] cursor-pointer">Masters</span><ChevronRight className="w-3 h-3" />
        <span className="text-[#0097A7] font-semibold">Employee Master</span>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5" style={{ backgroundColor: TEAL }}>
          <h2 className="text-white text-center font-semibold text-[14px]">
            {editId !== null ? 'Edit' : 'Create'} — Employee Master
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-5 py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === i ? 'border-[#0097A7] text-[#0097A7] bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Tab 0 – Basic Info */}
          {tab === 0 && (
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
              <FI label="Employee Code" fk="EM_Code" req />
              <FI label="Employee Name" fk="EM_Employee_Name" req />
              <FI label="Contact No"   fk="Contact_No" />
              <div className="flex items-center gap-3">
                <label className={`${lbl} w-36 shrink-0`}>Status :</label>
                <select value={form.EM_Status} onChange={e => sf('EM_Status', e.target.value)} className={inp(false)}>
                  <option>Active</option><option>Relieved</option>
                </select>
              </div>
              <div className="col-span-2 flex items-start gap-3">
                <label className={`${lbl} w-36 shrink-0 pt-1`}>Address :</label>
                <textarea value={form.Address} onChange={e => sf('Address', e.target.value)} rows={3}
                  className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7]" />
              </div>
            </div>
          )}

          {/* Tab 1 – Additional Info */}
          {tab === 1 && (
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
              <FI label="Aadhaar No"    fk="Adhar_No"     ml={12} />
              <FI label="Join Date"     fk="Join_Date"    type="date" />
              <FI label="Date of Birth" fk="EM_DOB"       type="date" />
              <FI label="Relieving Date" fk="Releving_Date" type="date" />
              <FI label="Email ID"      fk="EM_Email_ID"  type="email" />
            </div>
          )}

          {/* Tab 2 – Job & Company */}
          {tab === 2 && (
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
              <FS label="Department"       fk="DepartmentId"  opts={DEPARTMENTS}  req />
              <FS label="Designation"      fk="DesignationId" opts={DESIGNATIONS} />
              <FS label="Contractor"       fk="ContractId"    opts={CONTRACTORS}  />
              <FS label="Company"          fk="CompanyId"     opts={COMPANIES}    />
              <FI label="Team"             fk="EM_Team" />
              <FI label="Reporting Person" fk="EM_Rep_Person" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-5 justify-end border-t border-slate-100 mt-5">
            <button onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
              <Save className="w-4 h-4" />{editId !== null ? 'Update' : 'Create'}
            </button>
            <button onClick={handleClear}
              className="flex items-center gap-1.5 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
              <RotateCcw className="w-4 h-4" />Clear
            </button>
            <button onClick={() => setPage(1)}
              className="flex items-center gap-1.5 px-5 py-2 text-white text-[13px] font-semibold rounded transition-colors shadow-sm"
              style={{ backgroundColor: TEAL }}>
              <List className="w-4 h-4" />Display All
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5" style={{ backgroundColor: TEAL }}>
          <h2 className="text-white text-center font-semibold text-[14px]">Employee Master Details</h2>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Search:
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-44" />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Show
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-slate-300 rounded px-2 py-1 text-[13px]">
              {PAGE_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            entries
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['S.No', 'Code', 'Name', 'Department', 'Designation', 'Contact', 'Join Date', 'Status', 'Edit', 'Delete', 'Details'].map(h => (
                  <th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0
                ? <tr><td colSpan={11} className="text-center py-8 text-slate-400">No records found</td></tr>
                : paged.map((r, idx) => (
                  <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                    <td className="px-3 py-2 text-center">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-2 text-center font-medium text-[#0097A7]">{r.EM_Code}</td>
                    <td className="px-3 py-2 text-center font-semibold">{r.EM_Employee_Name}</td>
                    <td className="px-3 py-2 text-center">{r.DepartmentId}</td>
                    <td className="px-3 py-2 text-center">{r.DesignationId}</td>
                    <td className="px-3 py-2 text-center">{r.Contact_No}</td>
                    <td className="px-3 py-2 text-center">{r.Join_Date}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${r.EM_Status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{r.EM_Status}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleEdit(r)} className="p-1.5 rounded text-white transition-colors" style={{ backgroundColor: TEAL }} title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded bg-red-500 hover:bg-red-600 text-white transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => setDetailRow(r)} className="p-1.5 rounded text-white transition-colors" style={{ backgroundColor: TEAL }} title="Details">
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <span className="text-[12px] text-slate-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            {pNums().map((n, i) => n === '...'
              ? <span key={`e${i}`} className="px-2 text-slate-400 text-[12px]">…</span>
              : <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 text-[12px] rounded border transition-colors ${page === n ? 'text-white border-[#0097A7]' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
                  style={page === n ? { backgroundColor: TEAL } : {}}>
                  {n}
                </button>
            )}
            <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>

      {/* ── Detail modal ── */}
      {detailRow && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: TEAL }}>
              <h2 className="text-white font-bold text-[15px]">Employee Details</h2>
              <button onClick={() => setDetailRow(null)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1.5 max-h-[70vh] overflow-y-auto">
              {[
                ['Code', detailRow.EM_Code], ['Name', detailRow.EM_Employee_Name],
                ['Department', detailRow.DepartmentId], ['Designation', detailRow.DesignationId],
                ['Contractor', detailRow.ContractId], ['Company', detailRow.CompanyId],
                ['Contact', detailRow.Contact_No], ['Aadhaar', detailRow.Adhar_No],
                ['Join Date', detailRow.Join_Date], ['DOB', detailRow.EM_DOB],
                ['Relieving', detailRow.Releving_Date], ['Email', detailRow.EM_Email_ID],
                ['Team', detailRow.EM_Team], ['Reporting', detailRow.EM_Rep_Person],
                ['Status', detailRow.EM_Status],
              ].map(([l, v]) => (
                <div key={l} className="flex flex-col py-1 border-b border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span>
                  <span className="text-[13px] text-slate-800 font-medium">{v || '—'}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 flex justify-end">
              <button onClick={() => setDetailRow(null)} className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors" style={{ backgroundColor: TEAL }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
