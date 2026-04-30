import { useState } from 'react'
import { ChevronRight, Search, FileText, Printer, Edit, Trash2 } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const STATUS_OPTIONS = ['All','Draft','Submitted','Approved','Rejected','Cancelled']
const PDF_FORMATS = ['Formate 1','Formate 2','Formate 3','Formate 4']

const SEED = [
  { id:1, quotationNumber:'25-26/Q00001', quotationDate:'10/04/2026', status:'Submitted', customerName:'VENKATESWARA ASSOCIATES', totalAmount:'1,24,500.00' },
  { id:2, quotationNumber:'25-26/Q00002', quotationDate:'12/04/2026', status:'Approved',  customerName:'APS ENTERPRISES',          totalAmount:'78,200.00'  },
  { id:3, quotationNumber:'25-26/Q00003', quotationDate:'15/04/2026', status:'Draft',     customerName:'AJAY KUMAR',                totalAmount:'45,000.00'  },
  { id:4, quotationNumber:'25-26/Q00004', quotationDate:'18/04/2026', status:'Rejected',  customerName:'SM DRILLING COMPANY',       totalAmount:'2,10,000.00'},
  { id:5, quotationNumber:'25-26/Q00005', quotationDate:'20/04/2026', status:'Cancelled', customerName:'ABHISHEK SONI',             totalAmount:'32,500.00'  },
]

const PAGE_SIZES = [5, 10, 25, 50]

const statusColor = s => ({
  Submitted: 'bg-blue-100 text-blue-700',
  Approved:  'bg-green-100 text-green-700',
  Draft:     'bg-slate-100 text-slate-600',
  Rejected:  'bg-red-100 text-red-700',
  Cancelled: 'bg-orange-100 text-orange-700',
}[s] ?? 'bg-slate-100 text-slate-600')

const inp = 'border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] bg-white'

export default function QuotationDetails() {
  const [fromDate, setFromDate] = useState(thirtyDaysAgo)
  const [toDate, setToDate]     = useState(today)
  const [pdfFormat, setPdfFormat] = useState('Formate 3')
  const [quotationNumber, setQuotationNumber] = useState('')
  const [quotationStatus, setQuotationStatus] = useState('All')
  const [rows, setRows]   = useState(SEED)
  const [filtered, setFiltered] = useState(SEED)
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage]   = useState(1)

  const handleSearch = () => {
    let result = rows
    if (quotationNumber.trim()) {
      result = result.filter(r => r.quotationNumber.toLowerCase().includes(quotationNumber.toLowerCase()))
    }
    if (quotationStatus !== 'All') {
      result = result.filter(r => r.status === quotationStatus)
    }
    setFiltered(result)
    setPage(1)
  }

  const handleDelete = id => {
    if (!window.confirm('Delete this quotation?')) return
    const updated = rows.filter(r => r.id !== id)
    setRows(updated)
    setFiltered(updated)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const pageNums = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const ps = [1]
    if (page > 3) ps.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) ps.push(i)
    if (page < totalPages - 2) ps.push('...')
    ps.push(totalPages)
    return ps
  }

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Quotation</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Quotation Details</span>
      </div>

      {/* Filter card */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white font-semibold text-[14px]">Quotation Entry Details</h2>
        </div>
        <div className="px-4 py-3 flex flex-wrap items-center gap-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">From Date :</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inp} />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">To Date :</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inp} />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">PDF Format :</label>
            <select value={pdfFormat} onChange={e => setPdfFormat(e.target.value)} className={inp}>
              {PDF_FORMATS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">Quotation Number :</label>
            <input value={quotationNumber} onChange={e => setQuotationNumber(e.target.value)} placeholder="Search..." className={`${inp} w-32`} />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">Quotation Status :</label>
            <select value={quotationStatus} onChange={e => setQuotationStatus(e.target.value)} className={inp}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s === 'All' ? 'All' : s}>{s === 'All' ? '---Select Status---' : s}</option>)}
            </select>
          </div>
          <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12.5px] font-semibold rounded transition-colors shadow-sm">
            <Search className="w-3.5 h-3.5"/> Search
          </button>
        </div>

        {/* Entries control */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
            Show
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }} className={`${inp} w-16`}>
              {PAGE_SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
            entries
          </div>
          <span className="text-[12px] text-slate-400">{filtered.length} record(s) found</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[12.5px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Quotation Number','Quotation Date','Status','Customer Name','Total Amount','RPT','PDF','EDIT','DELETE'].map(h => (
                  <th key={h} className="px-3 py-2 text-center font-bold text-slate-600 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 text-[13px]">
                    No quotations found.
                  </td>
                </tr>
              ) : paged.map((row, idx) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-3 py-2 text-center font-medium text-[#0097A7]">{row.quotationNumber}</td>
                  <td className="px-3 py-2 text-center">{row.quotationDate}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColor(row.status)}`}>{row.status}</span>
                  </td>
                  <td className="px-3 py-2 text-center font-medium">{row.customerName}</td>
                  <td className="px-3 py-2 text-center font-semibold text-slate-700">{row.totalAmount}</td>
                  <td className="px-3 py-2 text-center">
                    <button className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[11px] rounded transition-colors" title="Report">
                      <Printer className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button className="px-2 py-1 bg-slate-600 hover:bg-slate-700 text-white text-[11px] rounded transition-colors" title="PDF">
                      <FileText className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button className="px-2 py-1 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] rounded transition-colors" title="Edit">
                      <Edit className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => handleDelete(row.id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] rounded transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <span className="text-[12px] text-slate-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
            {pageNums().map((n, i) => n === '...'
              ? <span key={`e${i}`} className="px-2 text-slate-400 text-[12px]">…</span>
              : <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 text-[12px] rounded border transition-colors ${page === n ? 'bg-[#0097A7] text-white border-[#0097A7]' : 'border-slate-300 hover:bg-slate-100 text-slate-600'}`}>{n}</button>
            )}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
