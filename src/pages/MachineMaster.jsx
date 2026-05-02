import { useState } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const CATEGORIES=['CNC Machine','Lathe','Milling Machine','Drilling Machine','Grinding Machine','Press Machine','Welding Machine']
const VENDORS=['ABC Machines Pvt Ltd','XYZ Tools Ltd','PQR Engineering','DEF Equipment Co.','GHI Systems']
const PAGE_SIZES=[4,10,25,50]
const empty={MachineCategoryId:'',VendorId:'',Machine_Code:'',Machine_Name:'',Machine_Description:'',Location:'',Status:'Active'}
const SEED=[
  {id:1,MachineCategoryId:'CNC Machine',VendorId:'ABC Machines Pvt Ltd',Machine_Code:'MCH001',Machine_Name:'CNC LATHE - 01',Machine_Description:'CNC Lathe Machine 500mm',Location:'Shop Floor A',Status:'Active'},
  {id:2,MachineCategoryId:'Milling Machine',VendorId:'XYZ Tools Ltd',Machine_Code:'MCH002',Machine_Name:'VERTICAL MILLING - 01',Machine_Description:'Vertical Milling Machine',Location:'Shop Floor B',Status:'Active'},
  {id:3,MachineCategoryId:'Drilling Machine',VendorId:'PQR Engineering',Machine_Code:'MCH003',Machine_Name:'RADIAL DRILL - 01',Machine_Description:'Radial Arm Drilling Machine',Location:'Shop Floor A',Status:'Inactive'},
]

export default function MachineMaster(){
  const [rows,setRows]=useState(SEED)
  const [form,setForm]=useState({...empty})
  const [errors,setErrors]=useState({})
  const [editId,setEditId]=useState(null)
  const [search,setSearch]=useState('')
  const [pageSize,setPageSize]=useState(4)
  const [page,setPage]=useState(1)
  const [detailRow,setDetailRow]=useState(null)

  const sf=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:''}));}
  const validate=()=>{const e={};if(!form.MachineCategoryId)e.MachineCategoryId='Required';if(!form.VendorId)e.VendorId='Required';if(!form.Machine_Code.trim())e.Machine_Code='Required';if(!form.Machine_Name.trim())e.Machine_Name='Required';setErrors(e);return!Object.keys(e).length}
  const handleSave=()=>{
    if(!validate())return
    if(editId!==null){setRows(r=>r.map(x=>x.id===editId?{...form,id:editId}:x));setEditId(null);}
    else{const id=Math.max(0,...rows.map(r=>r.id))+1;setRows(r=>[...r,{...form,id}]);}
    setForm({...empty});setErrors({});setPage(1)
  }
  const handleEdit=r=>{setForm({...r});setErrors({});setEditId(r.id);window.scrollTo({top:0,behavior:'smooth'})}
  const handleDelete=id=>{if(window.confirm('Delete?'))setRows(r=>r.filter(x=>x.id!==id))}
  const handleClear=()=>{setForm({...empty});setErrors({});setEditId(null)}
  const filtered=rows.filter(r=>[r.Machine_Code,r.Machine_Name,r.MachineCategoryId,r.Location,r.Status].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase())))
  const total=Math.max(1,Math.ceil(filtered.length/pageSize))
  const paged=filtered.slice((page-1)*pageSize,page*pageSize)
  const pNums=()=>{if(total<=7)return Array.from({length:total},(_,i)=>i+1);const ps=[1];if(page>3)ps.push('...');for(let i=Math.max(2,page-1);i<=Math.min(total-1,page+1);i++)ps.push(i);if(page<total-2)ps.push('...');ps.push(total);return ps}
  const inp=(e)=>`w-full border rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 transition-colors bg-white ${e?'border-red-400 focus:ring-red-300':'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
  const lbl='text-[12.5px] font-semibold text-slate-600 whitespace-nowrap'

  return(
    <div className="p-4 space-y-4 w-full min-w-0">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span><ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Masters</span><ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Machine Master</span>
      </div>
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5"><h2 className="text-white text-center font-semibold text-[14px]">{editId!==null?'Edit':'Create'} — Machine Master</h2></div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-3xl">
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Category :</label><div className="flex-1"><select value={form.MachineCategoryId} onChange={e=>sf('MachineCategoryId',e.target.value)} className={inp(errors.MachineCategoryId)}><option value="">--- Select ---</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>{errors.MachineCategoryId&&<p className="text-[11px] text-red-500 mt-0.5">{errors.MachineCategoryId}</p>}</div></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Vendor :</label><div className="flex-1"><select value={form.VendorId} onChange={e=>sf('VendorId',e.target.value)} className={inp(errors.VendorId)}><option value="">--- Select ---</option>{VENDORS.map(v=><option key={v}>{v}</option>)}</select>{errors.VendorId&&<p className="text-[11px] text-red-500 mt-0.5">{errors.VendorId}</p>}</div></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Machine Code :</label><div className="flex-1"><input value={form.Machine_Code} onChange={e=>sf('Machine_Code',e.target.value)} className={inp(errors.Machine_Code)}/>{errors.Machine_Code&&<p className="text-[11px] text-red-500 mt-0.5">{errors.Machine_Code}</p>}</div></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Machine Name :</label><div className="flex-1"><input value={form.Machine_Name} onChange={e=>sf('Machine_Name',e.target.value)} className={inp(errors.Machine_Name)}/>{errors.Machine_Name&&<p className="text-[11px] text-red-500 mt-0.5">{errors.Machine_Name}</p>}</div></div>
            <div className="col-span-2 flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}>Description :</label><input value={form.Machine_Description} onChange={e=>sf('Machine_Description',e.target.value)} className={inp(false)}/></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}>Location :</label><input value={form.Location} onChange={e=>sf('Location',e.target.value)} className={inp(false)}/></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}>Status :</label><select value={form.Status} onChange={e=>sf('Status',e.target.value)} className={inp(false)}><option>Active</option><option>Inactive</option></select></div>
          </div>
          <div className="flex gap-2 pt-4 justify-end border-t border-slate-100 mt-4">
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><Save className="w-4 h-4"/>{editId!==null?'Update':'Create'}</button>
            <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><RotateCcw className="w-4 h-4"/>Clear</button>
            <button onClick={()=>setPage(1)} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><List className="w-4 h-4"/>Display All</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5"><h2 className="text-white text-center font-semibold text-[14px]">Machine Master Details</h2></div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Search:<input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-40"/></div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Show<select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className="border border-slate-300 rounded px-2 py-1 text-[13px]">{PAGE_SIZES.map(s=><option key={s}>{s}</option>)}</select>entries</div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead><tr className="bg-slate-50 border-b border-slate-200">{['S.No','Code','Name','Category','Vendor','Location','Status','Edit','Delete','Details'].map(h=><th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {paged.length===0?<tr><td colSpan={10} className="text-center py-8 text-slate-400">No records found</td></tr>
              :paged.map((r,idx)=>(
                <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                  <td className="px-3 py-2 text-center">{(page-1)*pageSize+idx+1}</td>
                  <td className="px-3 py-2 text-center font-medium text-[#0097A7]">{r.Machine_Code}</td>
                  <td className="px-3 py-2 text-center font-medium">{r.Machine_Name}</td>
                  <td className="px-3 py-2 text-center">{r.MachineCategoryId}</td>
                  <td className="px-3 py-2 text-center">{r.VendorId}</td>
                  <td className="px-3 py-2 text-center">{r.Location}</td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${r.Status==='Active'?'bg-green-100 text-green-700':'bg-slate-100 text-slate-500'}`}>{r.Status}</span></td>
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
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between"><h2 className="text-white font-bold text-[15px]">Machine Details</h2><button onClick={()=>setDetailRow(null)} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button></div>
          <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1.5">
            {[['Code',detailRow.Machine_Code],['Name',detailRow.Machine_Name],['Category',detailRow.MachineCategoryId],['Vendor',detailRow.VendorId],['Description',detailRow.Machine_Description],['Location',detailRow.Location],['Status',detailRow.Status]].map(([l,v])=>(
              <div key={l} className="flex flex-col py-1 border-b border-slate-100"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span><span className="text-[13px] text-slate-800 font-medium">{v||'—'}</span></div>
            ))}
          </div>
          <div className="px-6 pb-5 flex justify-end"><button onClick={()=>setDetailRow(null)} className="px-5 py-2 text-sm font-semibold text-white bg-[#0097A7] hover:bg-[#007a87] rounded-lg transition-colors">Close</button></div>
        </div>
      </div>}
    </div>
  )
}
