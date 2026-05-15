import { useState } from 'react'
import { X, Save, Edit, Trash2, Info, ChevronRight, ArrowLeft } from 'lucide-react'
import { useToast } from '../components/Toast'

const SEED = [
  { id: 1, taxLedger: 'GST 0%', taxPercent: 0 },
  { id: 2, taxLedger: 'GST 5%', taxPercent: 5 },
  { id: 3, taxLedger: 'GST 7%', taxPercent: 7 },
  { id: 4, taxLedger: 'GST 12%', taxPercent: 12 },
  { id: 5, taxLedger: 'GST 18%', taxPercent: 18 },
  { id: 6, taxLedger: 'GST 28%', taxPercent: 28 },
  { id: 7, taxLedger: 'GST 30%', taxPercent: 30 },
]

const PAGE_SIZES = [8, 25, 50, 100]

function pct(v) { return Number(v).toFixed(0) + '%' }

function DetailModal({ row, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">Tax Ledger Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-2">
          {[
            ['Tax Ledger Account', row.taxLedger],
            ['Tax Ledger Account Percent', pct(row.taxPercent)],
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

export default function TaxLedgerMaster({ onNavigate }) {
  const toast = useToast()
  const [rows, setRows] = useState(SEED)
  const [taxLedger, setTaxLedger] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(8)
  const [page, setPage] = useState(1)
  const [detailRow, setDetailRow] = useState(null)

  const handleCreate = () => {
    if (!taxLedger.trim()) return toast.warning('Tax Ledger A/C is required')
    
    // Auto extract percentage from name if possible
    const match = taxLedger.match(/\d+(\.\d+)?/);
    const taxPercent = match ? Number(match[0]) : 0;

    if (editId !== null) {
      setRows(r => r.map(x => x.id === editId
        ? { id: editId, taxLedger, taxPercent }
        : x))
      setEditId(null)
      toast.success('Updated successfully')
    } else {
      const newId = Math.max(0, ...rows.map(r => r.id)) + 1
      setRows(r => [...r, { id: newId, taxLedger, taxPercent }])
      toast.success('Created successfully')
    }
    setTaxLedger('')
    setPage(1)
  }

  const handleEdit = row => {
    setTaxLedger(row.taxLedger)
    setEditId(row.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = id => {
    if (window.confirm('Delete this record?')) {
        setRows(r => r.filter(x => x.id !== id))
        toast.success('Deleted successfully')
    }
  }

  const filtered = rows.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-6 space-y-5 w-full min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors" onClick={() => onNavigate && onNavigate('Dashboard')}>Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Item Masters</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0097A7] font-semibold">Tax Ledger A/C Master</span>
      </div>

      {/* ── Create / Edit Form ── */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
        <h2 className="text-[#0097A7] text-center font-bold text-[18px]">
          {editId !== null ? 'Edit - Tax Ledger A/C' : 'Create - Tax Ledger A/C'}
        </h2>

        <div className="flex items-center gap-4 max-w-4xl">
          <label className="text-[13px] font-bold text-slate-800 shrink-0">
            Tax Ledger A/C :
          </label>
          <input 
            type="text" 
            value={taxLedger} 
            onChange={e => setTaxLedger(e.target.value)}
            className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7]" 
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={handleCreate}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {editId !== null ? 'Update' : 'Create'}
          </button>
          {editId !== null ? (
            <button onClick={() => { setTaxLedger(''); setEditId(null) }}
              className="px-4 py-1.5 bg-slate-500 hover:bg-slate-600 text-white text-[13px] font-semibold rounded transition-colors">
              Cancel
            </button>
          ) : (
            <button onClick={() => onNavigate && onNavigate('TaxMaster')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#5bc0de] hover:bg-[#46b8da] text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
          )}
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded shadow-sm overflow-hidden border border-slate-200">
        <div className="bg-[#337ab7] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">Tax Ledger Account Details</h2>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Search:
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-40" />
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Show
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-slate-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7]">
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
                {['Tax Ledger Account', 'Tax Ledger Account Percent', 'Edit', 'Delete', 'Details'].map(h => (
                  <th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">
                    {h}
                    {['Tax Ledger Account', 'Tax Ledger Account Percent'].includes(h) && (
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
                <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-[13px]">No records found</td></tr>
              ) : paged.map((row, idx) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-3 py-2.5 text-center">{row.taxLedger}</td>
                  <td className="px-3 py-2.5 text-center">{pct(row.taxPercent)}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button onClick={() => handleEdit(row)}
                      className="px-3 py-1.5 bg-[#5bc0de] hover:bg-[#46b8da] text-white text-[12px] font-semibold rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button onClick={() => handleDelete(row.id)}
                      className="px-3 py-1.5 bg-[#d9534f] hover:bg-[#c9302c] text-white text-[12px] font-semibold rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button onClick={() => setDetailRow(row)}
                      className="px-3 py-1.5 bg-[#337ab7] hover:bg-[#286090] text-white text-[12px] font-semibold rounded transition-colors">
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
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 text-[12px] rounded border transition-colors ${page === n ? 'bg-[#0097A7] text-white border-[#0097A7]' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {detailRow && <DetailModal row={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  )
}
