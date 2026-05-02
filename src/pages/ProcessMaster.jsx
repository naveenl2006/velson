import { useState } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const PROCESS_TYPES=['Machining','Welding','Assembly','Inspection','Heat Treatment','Surface Finishing','Fabrication']
const TEAMS=['Team A','Team B','Team C','Night Shift','Day Shift','QC Team']
const MACHINES=['MCH001 - CNC LATHE','MCH002 - VERTICAL MILLING','MCH003 - RADIAL DRILL']
const PAGE_SIZES=[4,10,25,50]
const empty={PM_Process_Name:'',PM_Process_Name1:'',PM_Process_Order:'',ProcessTypeId:'',TeamId:'',Machine_id:'',PM_Days:0,PM_Hours:0,Minutes:0,Setting_Time:0,Cycle_Time:0,Handling_Time:0,Idle_Time:0}
const SEED=[
  {id:1,PM_Process_Name:'CNC Turning',PM_Process_Name1:'Turning',PM_Process_Order:1,ProcessTypeId:'Machining',TeamId:'Team A',Machine_id:'MCH001 - CNC LATHE',PM_Days:0,PM_Hours:2,Minutes:30,Setting_Time:15,Cycle_Time:120,Handling_Time:10,Idle_Time:5},
  {id:2,PM_Process_Name:'Vertical Milling',PM_Process_Name1:'Milling',PM_Process_Order:2,ProcessTypeId:'Machining',TeamId:'Team B',Machine_id:'MCH002 - VERTICAL MILLING',PM_Days:0,PM_Hours:3,Minutes:0,Setting_Time:20,Cycle_Time:150,Handling_Time:15,Idle_Time:10},
]

export default function ProcessMaster(){
  const [rows,setRows]=useState(SEED)
  const [form,setForm]=useState({...empty})
  const [errors,setErrors]=useState({})
  const [editId,setEditId]=useState(null)
  const [search,setSearch]=useState('')
  const [pageSize,setPageSize]=useState(4)
  const [page,setPage]=useState(1)
  const [detailRow,setDetailRow]=useState(null)

  const sf=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:''}));}
  const validate=()=>{const e={};if(!form.PM_Process_Name.trim())e.PM_Process_Name='Required';setErrors(e);return!Object.keys(e).length}
  const handleSave=()=>{
    if(!validate())return
    if(editId!==null){setRows(r=>r.map(x=>x.id===editId?{...form,id:editId}:x));setEditId(null);}
    else{const id=Math.max(0,...rows.map(r=>r.id))+1;setRows(r=>[...r,{...form,id}]);}
    setForm({...empty});setErrors({});setPage(1)
  }
  const handleEdit=r=>{setForm({...r});setErrors({});setEditId(r.id);window.scrollTo({top:0,behavior:'smooth'})}
  const handleDelete=id=>{if(window.confirm('Delete?'))setRows(r=>r.filter(x=>x.id!==id))}
  const handleClear=()=>{setForm({...empty});setErrors({});setEditId(null)}
  const filtered=rows.filter(r=>[r.PM_Process_Name,r.ProcessTypeId,r.TeamId,r.Machine_id].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase())))
  const total=Math.max(1,Math.ceil(filtered.length/pageSize))
  const paged=filtered.slice((page-1)*pageSize,page*pageSize)
  const pNums=()=>{if(total<=7)return Array.from({length:total},(_,i)=>i+1);const ps=[1];if(page>3)ps.push('...');for(let i=Math.max(2,page-1);i<=Math.min(total-1,page+1);i++)ps.push(i);if(page<total-2)ps.push('...');ps.push(total);return ps}
  const inp=(e)=>`w-full border rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 transition-colors bg-white ${e?'border-red-400 focus:ring-red-300':'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
  const lbl='text-[12.5px] font-semibold text-slate-600 whitespace-nowrap'
  const NF=({label,fk})=>(
    <div className="flex items-center gap-2">
      <label className={`${lbl} w-28 shrink-0`}>{label} :</label>
      <input type="number" min="0" value={form[fk]} onChange={e=>sf(fk,Number(e.target.value))} className={inp(false)}/>
    </div>
  )

  return(
    <div className="p-4 space-y-4 w-full min-w-0">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span><ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Masters</span><ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Process Master</span>
      </div>
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5"><h2 className="text-white text-center font-semibold text-[14px]">{editId!==null?'Edit':'Create'} — Process Master</h2></div>
        <div className="p-4 space-y-5">
          {/* Main Fields - 3 col */}
          <div>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Process Information</p>
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div className="flex items-center gap-2"><label className={`${lbl} w-28 shrink-0`}><span className="text-red-500">*</span>Process Name :</label><div className="flex-1"><input value={form.PM_Process_Name} onChange={e=>sf('PM_Process_Name',e.target.value)} className={inp(errors.PM_Process_Name)}/>{errors.PM_Process_Name&&<p className="text-[11px] text-red-500 mt-0.5">{errors.PM_Process_Name}</p>}</div></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-28 shrink-0`}>Alt. Name :</label><input value={form.PM_Process_Name1} onChange={e=>sf('PM_Process_Name1',e.target.value)} className={inp(false)}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-28 shrink-0`}>Order :</label><input type="number" min="1" value={form.PM_Process_Order} onChange={e=>sf('PM_Process_Order',e.target.value)} className={inp(false)}/></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-28 shrink-0`}>Process Type :</label><select value={form.ProcessTypeId} onChange={e=>sf('ProcessTypeId',e.target.value)} className={inp(false)}><option value="">--- Select ---</option>{PROCESS_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-28 shrink-0`}>Team :</label><select value={form.TeamId} onChange={e=>sf('TeamId',e.target.value)} className={inp(false)}><option value="">--- Select ---</option>{TEAMS.map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="flex items-center gap-2"><label className={`${lbl} w-28 shrink-0`}>Machine :</label><select value={form.Machine_id} onChange={e=>sf('Machine_id',e.target.value)} className={inp(false)}><option value="">--- Select ---</option>{MACHINES.map(m=><option key={m}>{m}</option>)}</select></div>
            </div>
          </div>
          {/* Time Parameters - 4 col */}
          <div>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">Time Parameters</p>
            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              <NF label="Days" fk="PM_Days"/>
              <NF label="Hours" fk="PM_Hours"/>
              <NF label="Minutes" fk="Minutes"/>
              <NF label="Setting Time" fk="Setting_Time"/>
              <NF label="Cycle Time" fk="Cycle_Time"/>
              <NF label="Handling Time" fk="Handling_Time"/>
              <NF label="Idle Time" fk="Idle_Time"/>
            </div>
          </div>
          <div className="flex gap-2 pt-2 justify-end border-t border-slate-100">
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><Save className="w-4 h-4"/>{editId!==null?'Update':'Create'}</button>
            <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><RotateCcw className="w-4 h-4"/>Clear</button>
            <button onClick={()=>setPage(1)} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><List className="w-4 h-4"/>Display All</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5"><h2 className="text-white text-center font-semibold text-[14px]">Process Master Details</h2></div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Search:<input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-40"/></div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Show<select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className="border border-slate-300 rounded px-2 py-1 text-[13px]">{PAGE_SIZES.map(s=><option key={s}>{s}</option>)}</select>entries</div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead><tr className="bg-slate-50 border-b border-slate-200">{['S.No','Process Name','Alt. Name','Order','Type','Team','Machine','Edit','Delete','Details'].map(h=><th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {paged.length===0?<tr><td colSpan={10} className="text-center py-8 text-slate-400">No records found</td></tr>
              :paged.map((r,idx)=>(
                <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                  <td className="px-3 py-2 text-center">{(page-1)*pageSize+idx+1}</td>
                  <td className="px-3 py-2 text-center font-medium">{r.PM_Process_Name}</td>
                  <td className="px-3 py-2 text-center">{r.PM_Process_Name1}</td>
                  <td className="px-3 py-2 text-center">{r.PM_Process_Order}</td>
                  <td className="px-3 py-2 text-center">{r.ProcessTypeId}</td>
                  <td className="px-3 py-2 text-center">{r.TeamId}</td>
                  <td className="px-3 py-2 text-center">{r.Machine_id}</td>
                  <td className="px-3 py-2 text-center"><button onClick={()=>handleEdit(r)} className="px-3 py-1.5 bg-[--color-main] hover:bg-[#3498db] text-white text-[12px] rounded transition-colors"><Edit className="w-4 h-4"/></button></td>
                  <td className="px-3 py-2 text-center"><button onClick={()=>handleDelete(r.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] rounded transition-colors"><Trash2 className="w-4 h-4"/></button></td>
                  <td className="px-3 py-2 text-center"><button onClick={()=>setDetailRow(r)} className="px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] rounded transition-colors"><Info className="w-4 h-4"/></button></td>
                </tr>
              ))}
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
      {detailRow&&<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between"><h2 className="text-white font-bold text-[15px]">Process Details</h2><button onClick={()=>setDetailRow(null)} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button></div>
          <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1.5 max-h-[70vh] overflow-y-auto">
            {[['Process Name',detailRow.PM_Process_Name],['Alt. Name',detailRow.PM_Process_Name1],['Order',detailRow.PM_Process_Order],['Type',detailRow.ProcessTypeId],['Team',detailRow.TeamId],['Machine',detailRow.Machine_id],['Days',detailRow.PM_Days],['Hours',detailRow.PM_Hours],['Minutes',detailRow.Minutes],['Setting Time',detailRow.Setting_Time],['Cycle Time',detailRow.Cycle_Time],['Handling Time',detailRow.Handling_Time],['Idle Time',detailRow.Idle_Time]].map(([l,v])=>(
              <div key={l} className="flex flex-col py-1 border-b border-slate-100"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span><span className="text-[13px] text-slate-800 font-medium">{String(v??'—')}</span></div>
            ))}
          </div>
          <div className="px-6 pb-5 flex justify-end"><button onClick={()=>setDetailRow(null)} className="px-5 py-2 text-sm font-semibold text-white bg-[#0097A7] hover:bg-[#007a87] rounded-lg transition-colors">Close</button></div>
        </div>
      </div>}
    </div>
  )
}
