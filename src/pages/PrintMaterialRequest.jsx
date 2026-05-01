import { useState } from 'react'
import { ChevronRight, Search, Edit, Trash2, Printer, X, FileText } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]
const ago30 = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]

const SEED = [
  { id:1, requestNo:'26-27/MQ00001', requestDate:'07/04/2026', departmentName:'Production', requestUser:'superadmin', requiredDate:'08/04/2026', approvalStatus:'Pending',  requestFor:'Production Use', createdBy:'superadmin', createdDate:'07/04/2026' },
  { id:2, requestNo:'26-27/MQ00002', requestDate:'10/04/2026', departmentName:'Quality',    requestUser:'admin',      requiredDate:'12/04/2026', approvalStatus:'Approved', requestFor:'Testing',        createdBy:'admin',      createdDate:'10/04/2026' },
]

const PAGE_SIZES = [5, 10, 25, 50]
const statusColor = s => ({ Pending:'bg-amber-100 text-amber-700', Approved:'bg-green-100 text-green-700', Rejected:'bg-red-100 text-red-700' }[s] ?? 'bg-slate-100 text-slate-600')
const inp = 'border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] focus:border-[#0097A7] bg-white'

export default function PrintMaterialRequest() {
  const [fromDate, setFromDate] = useState(ago30)
  const [toDate, setToDate] = useState(today)
  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState(SEED)
  const [filtered, setFiltered] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const handleSearch = () => {
    let r = rows
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      r = r.filter(x => x.requestNo.toLowerCase().includes(q) || x.departmentName.toLowerCase().includes(q))
    }
    setFiltered(r); setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page-1)*pageSize, page*pageSize)
  const cols = ['Request No','Request Date','Department Name','Request User','Required Date','Approval Status','Request For','Created By','Created Date']

  return (
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Stores</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Print Material Request</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Print Material Request</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors"><Edit className="w-3 h-3"/> Edit</button>
            <button className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors"><Trash2 className="w-3 h-3"/> Delete</button>
            <button className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors"><Printer className="w-3 h-3"/> Print Material Request</button>
            <button className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors"><X className="w-3 h-3"/> Close</button>
          </div>
        </div>

        <div className="px-4 py-3 flex flex-wrap items-center gap-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600">From Date:</label>
            <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className={inp}/>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-semibold text-slate-600">To Date:</label>
            <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className={inp}/>
          </div>
          <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12.5px] font-semibold rounded transition-colors shadow-sm"><Search className="w-3.5 h-3.5"/> Search</button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-[12.5px] font-semibold rounded transition-colors shadow-sm"><Search className="w-3.5 h-3.5"/> Search Details</button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-[12.5px] font-semibold rounded transition-colors shadow-sm"><FileText className="w-3.5 h-3.5"/> Created Route Card</button>
        </div>

        <div className="px-4 py-2 border-b border-slate-100"><h3 className="text-[13px] font-bold text-slate-700">Material Request Master</h3></div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[12.5px] text-slate-600">Show <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className={`${inp} w-16`}>{PAGE_SIZES.map(s=><option key={s}>{s}</option>)}</select> entries</div>
          <div className="flex items-center gap-2"><label className="text-[12px] text-slate-600">Search:</label><input value={searchText} onChange={e=>setSearchText(e.target.value)} className={`${inp} w-40`}/></div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[12.5px]">
            <thead><tr className="bg-slate-50 border-b border-slate-200">{cols.map(h=><th key={h} className="px-3 py-2 text-center font-bold text-slate-600 text-[11px] uppercase tracking-wide whitespace-nowrap">{h} <span className="text-slate-300">↕</span></th>)}</tr></thead>
            <tbody>
              {paged.length===0 ? <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-[13px]">No data available in table</td></tr>
              : paged.map((row,idx)=>(
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                  <td className="px-3 py-2 text-center font-medium text-[#0097A7]">{row.requestNo}</td>
                  <td className="px-3 py-2 text-center">{row.requestDate}</td>
                  <td className="px-3 py-2 text-center">{row.departmentName}</td>
                  <td className="px-3 py-2 text-center">{row.requestUser}</td>
                  <td className="px-3 py-2 text-center">{row.requiredDate}</td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColor(row.approvalStatus)}`}>{row.approvalStatus}</span></td>
                  <td className="px-3 py-2 text-center">{row.requestFor}</td>
                  <td className="px-3 py-2 text-center">{row.createdBy}</td>
                  <td className="px-3 py-2 text-center">{row.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <span className="text-[12px] text-slate-500">Showing {filtered.length===0?0:(page-1)*pageSize+1} to {Math.min(page*pageSize,filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
