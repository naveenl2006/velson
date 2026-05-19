import { useState } from 'react'
import { X, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const COMPANY_TYPES = ['Private Limited', 'Public Limited', 'Partnership', 'Sole Proprietorship', 'LLP', 'OPC']
const PAGE_SIZES = [4, 10, 25, 50]
const TEAL = '#0097A7'

const empty = {
  CompanyCode: '', CompanyName: '', CompanyTypeId: '', Status: 'Active',
  DoorNumber: '', Street: '', Place: '', Post: '', City: '', Taluk: '',
  District: '', DistrictCode: '', State: '', StateCode: '', Country: 'India', PinCode: '', Address: '',
  GSTIN: '', PanNo: '',
  CPhoneNumber: '', CEMailId: '', CWebsiteURL: '',
  MPhoneNumber: '', MEMailId: '', MWebsiteURL: '',
  PPhoneNumber: '', PEMailId: '', PWebsiteURL: '',
  SPhoneNumber: '', SEMailId: '', SWebsiteURL: '',
  SERPhoneNumber: '', SEREMailId: '', SERWebsiteURL: '',
  BankName: '', BankBranch: '', BankAccountType: '', BankAccountName: '', BankAccountNumber: '',
  BankIFSCCode: '', BankMICRCode: '', BankDistrict: '', BankState: '',
  BankPinCode: '', BankCountry: 'India', BankAddress: '',
  CompanyLogo: null,
}

const SEED = [
  { id: 1, ...empty, CompanyCode: 'C0001', CompanyName: 'VELSON INDUSTRIES PVT LTD', CompanyTypeId: 'Private Limited', Status: 'Active', City: 'Chennai', State: 'Tamil Nadu', GSTIN: '33AABCV1234M1Z5', PanNo: 'AABCV1234M' },
  { id: 2, ...empty, CompanyCode: 'C0002', CompanyName: 'VELSON SERVICES LLP', CompanyTypeId: 'LLP', Status: 'Active', City: 'Coimbatore', State: 'Tamil Nadu', GSTIN: '33AABCV5678M1Z1', PanNo: 'AABCV5678M' },
]

const inp = 'w-full border border-slate-300 rounded px-2 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] bg-white placeholder-slate-400'

/* Label + input row used inside each panel */
const F = ({ label, req, children }) => (
  <div>
    <label className="block text-[12px] font-bold text-slate-700 mb-0.5">
      {req && <span className="text-red-500">*</span>}{label}
    </label>
    {children}
  </div>
)

export default function CompanyMaster() {
  const [rows, setRows] = useState(SEED)
  const [form, setForm] = useState({ ...empty })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(4)
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState(null)

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = () => {
    if (!form.CompanyName.trim()) return
    if (editId !== null) {
      setRows(r => r.map(x => x.id === editId ? { ...form, id: editId } : x))
      setEditId(null)
    } else {
      const id = Math.max(0, ...rows.map(r => r.id)) + 1
      setRows(r => [...r, { ...form, id, CompanyCode: form.CompanyCode || `C${String(id).padStart(4, '0')}` }])
    }
    setForm({ ...empty }); setPage(1)
  }

  const handleClear = () => { setForm({ ...empty }); setEditId(null) }
  const handleEdit = r => { setForm({ ...r }); setEditId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleDelete = id => { if (window.confirm('Delete?')) setRows(r => r.filter(x => x.id !== id)) }

  const filtered = rows.filter(r =>
    [r.CompanyCode, r.CompanyName, r.City, r.State, r.GSTIN, r.Status]
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

  return (
    <div className="p-4 space-y-4 w-full min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span><ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#0097A7] cursor-pointer">Masters</span><ChevronRight className="w-3 h-3" />
        <span className="text-[#0097A7] font-semibold">Company Master</span>
      </div>

      {/* ── Form ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5" style={{ backgroundColor: TEAL }}>
          <h2 className="text-white text-center font-semibold text-[14px]">
            {editId !== null ? 'Edit' : 'New'} Company Master Details Entry
          </h2>
        </div>

        {/* 3-column layout */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Left Column ── */}
          <div className="border border-slate-300 rounded border-t-[3px] border-t-[#0097A7] p-4 space-y-2">
            <F label="Company Code" req>
              <input value={form.CompanyCode} onChange={e => sf('CompanyCode', e.target.value)}
                className={`${inp} bg-slate-50`} placeholder="Company Code"
                readOnly={editId !== null} />
            </F>
            <F label="Company Name" req>
              <input value={form.CompanyName} onChange={e => sf('CompanyName', e.target.value)}
                className={inp} placeholder="Company Name" />
            </F>
            <F label="CompanyType" req>
              <select value={form.CompanyTypeId} onChange={e => sf('CompanyTypeId', e.target.value)} className={inp}>
                <option value=""></option>
                {COMPANY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </F>
            <div className="grid grid-cols-2 gap-2">
              <F label="Door Number" req>
                <input value={form.DoorNumber} onChange={e => sf('DoorNumber', e.target.value)} className={inp} placeholder="Door Number" />
              </F>
              <F label="Street" req>
                <input value={form.Street} onChange={e => sf('Street', e.target.value)} className={inp} placeholder="Street" />
              </F>
            </div>
            <F label="Place" req>
              <input value={form.Place} onChange={e => sf('Place', e.target.value)} className={inp} placeholder="Place" />
            </F>
            <F label="Post" req>
              <input value={form.Post} onChange={e => sf('Post', e.target.value)} className={inp} placeholder="Post" />
            </F>
            <F label="City" req>
              <input value={form.City} onChange={e => sf('City', e.target.value)} className={inp} placeholder="City" />
            </F>
            <F label="Taluk" req>
              <input value={form.Taluk} onChange={e => sf('Taluk', e.target.value)} className={inp} placeholder="Taluk" />
            </F>
            <div className="grid grid-cols-2 gap-2">
              <F label="District" req>
                <input value={form.District} onChange={e => sf('District', e.target.value)} className={inp} placeholder="District" />
              </F>
              <F label="District Code" req>
                <input value={form.DistrictCode} onChange={e => sf('DistrictCode', e.target.value)} className={inp} placeholder="District Code" />
              </F>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <F label="State" req>
                <input value={form.State} onChange={e => sf('State', e.target.value)} className={inp} placeholder="State" />
              </F>
              <F label="State Code" req>
                <input value={form.StateCode} onChange={e => sf('StateCode', e.target.value)} className={inp} placeholder="State Code" />
              </F>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <F label="Country" req>
                <input value={form.Country} onChange={e => sf('Country', e.target.value)} className={inp} placeholder="Country" />
              </F>
              <F label="PinCode" req>
                <input value={form.PinCode} onChange={e => sf('PinCode', e.target.value)} className={inp} placeholder="PinCode" />
              </F>
            </div>
            <F label="Address" req>
              <input value={form.Address} onChange={e => sf('Address', e.target.value)} className={inp} placeholder="Address" />
            </F>
          </div>

          {/* ── Middle Column ── */}
          <div className="border border-slate-300 rounded border-t-[3px] border-t-[#0097A7] p-4 space-y-2">
            <F label="GSTIN" req>
              <input value={form.GSTIN} onChange={e => sf('GSTIN', e.target.value.toUpperCase())}
                className={inp} placeholder="GSTIN" maxLength={15} />
            </F>
            <F label="PanNo" req>
              <input value={form.PanNo} onChange={e => sf('PanNo', e.target.value.toUpperCase())}
                className={inp} placeholder="PanNo" maxLength={10} />
            </F>

            {[
              { label: 'Company', ph: 'Company', pk: 'CPhoneNumber', ek: 'CEMailId', wk: 'CWebsiteURL' },
              { label: 'Marketing', ph: 'Marketing', pk: 'MPhoneNumber', ek: 'MEMailId', wk: 'MWebsiteURL' },
              { label: 'Purchase', ph: 'Purchase', pk: 'PPhoneNumber', ek: 'PEMailId', wk: 'PWebsiteURL' },
              { label: 'Sales', ph: 'Sales', pk: 'SPhoneNumber', ek: 'SEMailId', wk: 'SWebsiteURL' },
              { label: 'Service', ph: 'Service', pk: 'SERPhoneNumber', ek: 'SEREMailId', wk: 'SERWebsiteURL' },
            ].map(d => (
              <div key={d.label} className="space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <F label={`${d.label} Phone Number`} req>
                    <input value={form[d.pk]} onChange={e => sf(d.pk, e.target.value)}
                      className={inp} placeholder={`${d.ph} Phone Number`} />
                  </F>
                  <F label={`${d.label} EMail Id`} req>
                    <input value={form[d.ek]} onChange={e => sf(d.ek, e.target.value)}
                      className={inp} placeholder={`${d.ph} EMail Id`} />
                  </F>
                </div>
                <F label={`${d.label} Website URL`} req>
                  <input value={form[d.wk]} onChange={e => sf(d.wk, e.target.value)}
                    className={inp} placeholder={`${d.ph} Website URL`} />
                </F>
              </div>
            ))}
          </div>

          {/* ── Right Column ── */}
          <div className="border border-slate-300 rounded border-t-[3px] border-t-[#0097A7] p-4 space-y-2">
            <F label="Bank Name" req>
              <input value={form.BankName} onChange={e => sf('BankName', e.target.value)} className={inp} placeholder="Bank Name" />
            </F>
            <div className="grid grid-cols-2 gap-2">
              <F label="Bank Branch" req>
                <input value={form.BankBranch} onChange={e => sf('BankBranch', e.target.value)} className={inp} placeholder="Bank Branch" />
              </F>
              <F label="Bank Account Type" req>
                <input value={form.BankAccountType} onChange={e => sf('BankAccountType', e.target.value)} className={inp} placeholder="Bank Account Type" />
              </F>
            </div>
            <F label="Bank Account Name" req>
              <input value={form.BankAccountName} onChange={e => sf('BankAccountName', e.target.value)} className={inp} placeholder="Bank Account Name" />
            </F>
            <F label="Bank Account Number" req>
              <input value={form.BankAccountNumber} onChange={e => sf('BankAccountNumber', e.target.value)} className={inp} placeholder="Bank Account Number" />
            </F>
            <div className="grid grid-cols-2 gap-2">
              <F label="Bank IFSCCode" req>
                <input value={form.BankIFSCCode} onChange={e => sf('BankIFSCCode', e.target.value.toUpperCase())} className={inp} placeholder="Bank IFSCCode" />
              </F>
              <F label="Bank MICRCode" req>
                <input value={form.BankMICRCode} onChange={e => sf('BankMICRCode', e.target.value)} className={inp} placeholder="Bank MICRCode" />
              </F>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <F label="Bank District" req>
                <input value={form.BankDistrict} onChange={e => sf('BankDistrict', e.target.value)} className={inp} placeholder="Bank District" />
              </F>
              <F label="Bank State" req>
                <input value={form.BankState} onChange={e => sf('BankState', e.target.value)} className={inp} placeholder="Bank State" />
              </F>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <F label="Bank PinCode" req>
                <input value={form.BankPinCode} onChange={e => sf('BankPinCode', e.target.value)} className={inp} placeholder="Bank PinCode" />
              </F>
              <F label="Bank Country" req>
                <input value={form.BankCountry} onChange={e => sf('BankCountry', e.target.value)} className={inp} placeholder="Bank Country" />
              </F>
            </div>
            <F label="Bank Address" req>
              <input value={form.BankAddress} onChange={e => sf('BankAddress', e.target.value)} className={inp} placeholder="Bank Address" />
            </F>

            {/* Logo */}
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-0.5">Upload Company Logo</label>
              <div className="flex items-center gap-2">
                {form.CompanyLogo && (
                  <img src={form.CompanyLogo} alt="Logo" className="h-8 w-8 object-contain rounded border border-slate-200" />
                )}
                <input type="file" accept="image/*"
                  className="text-[13px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:border file:border-slate-300 file:rounded file:text-[12px] file:bg-white file:text-slate-700 hover:file:bg-slate-50 file:cursor-pointer"
                  onChange={e => {
                    const f = e.target.files[0]
                    if (f) { const r = new FileReader(); r.onload = ev => sf('CompanyLogo', ev.target.result); r.readAsDataURL(f) }
                  }} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button onClick={handleCreate}
                className="px-5 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors">
                {editId !== null ? 'Update' : 'Create'}
              </button>
              <button onClick={handleClear}
                className="px-5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded transition-colors">
                Clear
              </button>
            </div>
            <button onClick={() => setPage(1)}
              className="text-[13px] font-semibold hover:underline" style={{ color: TEAL }}>
              Display All
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5" style={{ backgroundColor: TEAL }}>
          <h2 className="text-white text-center font-semibold text-[14px]">Company Master Details</h2>
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
                {['S.No', 'Code', 'Company Name', 'Type', 'City', 'State', 'GSTIN', 'Status', 'Edit', 'Delete', 'Details'].map(h => (
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
                    <td className="px-3 py-2 text-center font-medium" style={{ color: TEAL }}>{r.CompanyCode}</td>
                    <td className="px-3 py-2 text-center font-semibold">{r.CompanyName}</td>
                    <td className="px-3 py-2 text-center">{r.CompanyTypeId}</td>
                    <td className="px-3 py-2 text-center">{r.City}</td>
                    <td className="px-3 py-2 text-center">{r.State}</td>
                    <td className="px-3 py-2 text-center font-mono text-[12px]">{r.GSTIN}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${r.Status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{r.Status}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleEdit(r)} className="p-1.5 rounded text-white" style={{ backgroundColor: TEAL }} title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded bg-red-500 hover:bg-red-600 text-white" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => setDetailRow(r)} className="p-1.5 rounded text-white" style={{ backgroundColor: TEAL }} title="Details">
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
                className={`w-8 h-8 text-[12px] rounded border transition-colors ${page === n ? 'text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}
                style={page === n ? { backgroundColor: TEAL, borderColor: TEAL } : {}}>
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
              <h2 className="text-white font-bold text-[15px]">Company Details</h2>
              <button onClick={() => setDetailRow(null)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1.5 max-h-[70vh] overflow-y-auto">
              {[
                ['Code', detailRow.CompanyCode], ['Name', detailRow.CompanyName],
                ['Type', detailRow.CompanyTypeId], ['Status', detailRow.Status],
                ['City', detailRow.City], ['State', detailRow.State],
                ['Country', detailRow.Country], ['Pin Code', detailRow.PinCode],
                ['GSTIN', detailRow.GSTIN], ['PAN No', detailRow.PanNo],
                ['Bank Name', detailRow.BankName], ['IFSC Code', detailRow.BankIFSCCode],
              ].map(([l, v]) => (
                <div key={l} className="flex flex-col py-1 border-b border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span>
                  <span className="text-[13px] text-slate-800 font-medium">{v || '—'}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 flex justify-end">
              <button onClick={() => setDetailRow(null)} className="px-5 py-2 text-sm font-semibold text-white rounded-lg" style={{ backgroundColor: TEAL }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
