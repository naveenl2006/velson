import { useState } from 'react'
import { ChevronRight, Search, Edit, Trash2, Printer } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'P.O Pending' },
  { value: 'Approval', label: 'P.O Approval' },
  { value: 'Rejected', label: 'P.O Rejected' },
]

const SEED = [
  { id:1, sNo:1, poNo:'26-27/PO00001', poDate:'07/04/2026', poType:'Purchase Order', supplierName:'VENKATESWARA ASSOCIATES', contactPerson:'Rajesh Kumar', approvalStatus:'Pending', remarks:'' },
  { id:2, sNo:2, poNo:'26-27/PO00002', poDate:'10/04/2026', poType:'Purchase Order', supplierName:'APS ENTERPRISES',          contactPerson:'Suresh Reddy', approvalStatus:'Approval', remarks:'Approved by Manager' },
  { id:3, sNo:3, poNo:'26-27/PO00003', poDate:'15/04/2026', poType:'Job Work',       supplierName:'SM DRILLING COMPANY',       contactPerson:'Ajay Singh',   approvalStatus:'Rejected', remarks:'Budget exceeded' },
  { id:4, sNo:4, poNo:'26-27/PO00004', poDate:'18/04/2026', poType:'Purchase Order', supplierName:'ABHISHEK SONI',             contactPerson:'Abhishek',     approvalStatus:'Pending', remarks:'' },
  { id:5, sNo:5, poNo:'26-27/PO00005', poDate:'22/04/2026', poType:'Purchase Return',supplierName:'AJAY KUMAR',                contactPerson:'Ajay Kumar',   approvalStatus:'Approval', remarks:'Return processed' },
]

const statusColor = s => ({
  Pending:  'bg-amber-100 text-amber-700',
  Approval: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}[s] ?? 'bg-slate-100 text-slate-600')

const inp = 'border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] bg-white'

export default function PurchaseOrderDetails() {
  const [fromDate, setFromDate] = useState(thirtyDaysAgo)
  const [toDate, setToDate]     = useState(today)
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [rows, setRows]     = useState(SEED)
  const [filtered, setFiltered] = useState([])

  const handleSearch = () => {
    let result = rows
    if (statusFilter) {
      result = result.filter(r => r.approvalStatus === statusFilter)
    }
    setFiltered(result)
  }

  const handleDelete = id => {
    if (!window.confirm('Delete this purchase order?')) return
    const updated = rows.filter(r => r.id !== id)
    setRows(updated)
    setFiltered(f => f.filter(r => r.id !== id))
  }

  const displayRows = filtered

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Purchase</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Purchase Order Details</span>
      </div>

      {/* Main card */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white font-semibold text-[14px]">Pending Purchase Order Details</h2>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-3 flex flex-wrap items-center gap-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">From Date :</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inp} />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600 whitespace-nowrap">To Date :</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inp} />
          </div>
          {/* Radio status filter */}
          <div className="flex items-center gap-3">
            {STATUS_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-1 text-[12.5px] cursor-pointer whitespace-nowrap">
                <input
                  type="radio"
                  name="poStatus"
                  value={opt.value}
                  checked={statusFilter === opt.value}
                  onChange={() => setStatusFilter(opt.value)}
                  className="accent-[#0097A7]"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12.5px] font-semibold rounded transition-colors shadow-sm">
            <Search className="w-3.5 h-3.5"/> Search
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[12.5px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['S.No','ID','P.O No','PO Date','PO Type','Supplier Name','Contact Person','Approval Status','Remarks','Edit','Delete','PrintData'].map(h => (
                  <th key={h} className="px-3 py-2 text-center font-bold text-slate-600 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-12 text-slate-400 text-[13px]">
                    No purchase orders found.
                  </td>
                </tr>
              ) : displayRows.map((row, idx) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                  <td className="px-3 py-2 text-center text-slate-500">{row.sNo}</td>
                  <td className="px-3 py-2 text-center text-slate-500">{row.id}</td>
                  <td className="px-3 py-2 text-center font-medium text-[#0097A7]">{row.poNo}</td>
                  <td className="px-3 py-2 text-center">{row.poDate}</td>
                  <td className="px-3 py-2 text-center">{row.poType}</td>
                  <td className="px-3 py-2 text-center font-medium">{row.supplierName}</td>
                  <td className="px-3 py-2 text-center">{row.contactPerson}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColor(row.approvalStatus)}`}>{row.approvalStatus}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-500">{row.remarks || '—'}</td>
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
                  <td className="px-3 py-2 text-center">
                    <button className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[11px] rounded transition-colors" title="Print">
                      <Printer className="w-3.5 h-3.5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
