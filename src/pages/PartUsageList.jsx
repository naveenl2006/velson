import { useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'

const PAGE_SIZES=[4,10,25,50]
const SEED=[
  {id:1,IM_Part_No:'PRT-001',IM_PartName:'Shaft Bearing 6205',UsedInAssembly:'Main Drive Assembly',UsedInVehicle:'Truck Model A',Quantity:2},
  {id:2,IM_Part_No:'PRT-002',IM_PartName:'Oil Seal 50x70',UsedInAssembly:'Gearbox Assembly',UsedInVehicle:'Mini Truck B',Quantity:4},
  {id:3,IM_Part_No:'PRT-003',IM_PartName:'V-Belt 1250mm',UsedInAssembly:'Belt Drive Assembly',UsedInVehicle:'Truck Model A',Quantity:3},
  {id:4,IM_Part_No:'PRT-004',IM_PartName:'Coupling Flange',UsedInAssembly:'Pump Assembly',UsedInVehicle:'Industrial Unit',Quantity:1},
  {id:5,IM_Part_No:'PRT-005',IM_PartName:'Roller Bearing NJ205',UsedInAssembly:'Spindle Assembly',UsedInVehicle:'CNC Machine',Quantity:2},
  {id:6,IM_Part_No:'PRT-006',IM_PartName:'Hex Bolt M12x60',UsedInAssembly:'Frame Assembly',UsedInVehicle:'All Models',Quantity:12},
]

export default function PartUsageList(){
  const [search,setSearch]=useState('')
  const [pageSize,setPageSize]=useState(4)
  const [page,setPage]=useState(1)

  const filtered=SEED.filter(r=>[r.IM_Part_No,r.IM_PartName,r.UsedInAssembly,r.UsedInVehicle].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase())))
  const total=Math.max(1,Math.ceil(filtered.length/pageSize))
  const paged=filtered.slice((page-1)*pageSize,page*pageSize)
  const pNums=()=>{if(total<=7)return Array.from({length:total},(_,i)=>i+1);const ps=[1];if(page>3)ps.push('...');for(let i=Math.max(2,page-1);i<=Math.min(total-1,page+1);i++)ps.push(i);if(page<total-2)ps.push('...');ps.push(total);return ps}

  return(
    <div className="p-4 space-y-4 w-full min-w-0">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span><ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Masters</span><ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Part Usage List Display</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-[14px]">Part Usage List Display</h2>
          <span className="text-white/70 text-[12px] italic">Read-only — cross-reference view</span>
        </div>

        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
          <span className="text-amber-700 text-[12px] font-semibold">ℹ This is a read-only display. No create / edit / delete operations are available.</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            <Search className="w-4 h-4 text-slate-400"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search parts..." className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-52"/>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Show<select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className="border border-slate-300 rounded px-2 py-1 text-[13px]">{PAGE_SIZES.map(s=><option key={s}>{s}</option>)}</select>entries</div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['S.No','Part No.','Part Name','Used In Assembly','Used In Vehicle','Qty / Unit'].map(h=>(
                  <th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length===0
                ?<tr><td colSpan={6} className="text-center py-8 text-slate-400">No records found</td></tr>
                :paged.map((r,idx)=>(
                  <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                    <td className="px-3 py-2 text-center text-slate-500">{(page-1)*pageSize+idx+1}</td>
                    <td className="px-3 py-2 text-center font-mono font-semibold text-[#0097A7]">{r.IM_Part_No}</td>
                    <td className="px-3 py-2 text-left font-medium">{r.IM_PartName}</td>
                    <td className="px-3 py-2 text-center">{r.UsedInAssembly}</td>
                    <td className="px-3 py-2 text-center">{r.UsedInVehicle}</td>
                    <td className="px-3 py-2 text-center font-semibold">{r.Quantity}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <span className="text-[12px] text-slate-500">Showing {filtered.length===0?0:(page-1)*pageSize+1} to {Math.min(page*pageSize,filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            {pNums().map((n,i)=>n==='...'?<span key={`e${i}`} className="px-2 text-slate-400 text-[12px]">…</span>:<button key={n} onClick={()=>setPage(n)} className={`w-8 h-8 text-[12px] rounded border transition-colors ${page===n?'bg-[#0097A7] text-white border-[#0097A7]':'border-slate-300 hover:bg-slate-100 text-slate-600'}`}>{n}</button>)}
            <button onClick={()=>setPage(p=>Math.min(total,p+1))} disabled={page===total} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
