import { useState } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const MODEL_NAMES = ['V10','V20','V30','Consumables','VELSON TYPE','HM Series']
const MODEL_SUB_TYPES = ['GH600LC+','GH600LC','GH600LCAD+','GH600LCAD','Consumables','VELSON TYPE','HM300']
const VEHICLE_NAMES = ['HYUNDAI','TATA HITACHI 210','KOBELCO','JCB','KOMATSU','CAT','CUSTOMER OWN']
const BOM_MODELS = ['BOM-V10-001','BOM-V10-002','BOM-V20-001','BOM-CON-001','BOM-VT-001']
const CUSTOMER_SEED = ['VENKATESWARA ASSOCIATES','M/S VELSON INHOUSE PRODUCTION','AJAY KUMAR','ABHISHEK SONI','APS ENTERPRISES','SM DRILLING COMPANY','APC DRILLING AND CONSTRUCTION PVT LTD']
const PAGE_SIZES = [5,10,25,50]

const SEED = [
  {id:1,date:'10/4/2024 12:51:53 PM',customerName:'VENKATESWARA ASSOCIATES',customerCode:'CUS001',vehicleCount:'1',address:'',vehicleNumber:'',modelName:'V10',modelSubType:'GH600LC+',vehicleName:'HYUNDAI',serialNumber:'',bomType:'New',bomModelNumber:'BOM-V10-001',remarks:''},
  {id:2,date:'10/7/2024 3:42:36 PM',customerName:'M/S VELSON INHOUSE PRODUCTION',customerCode:'CUS002',vehicleCount:'1',address:'',vehicleNumber:'',modelName:'Consumables',modelSubType:'Consumables',vehicleName:'CUSTOMER OWN',serialNumber:'',bomType:'Existing',bomModelNumber:'BOM-CON-001',remarks:''},
  {id:3,date:'10/8/2024 1:54:40 PM',customerName:'AJAY KUMAR',customerCode:'CUS003',vehicleCount:'1',address:'',vehicleNumber:'',modelName:'V10',modelSubType:'GH600LC+',vehicleName:'TATA HITACHI 210',serialNumber:'',bomType:'New',bomModelNumber:'BOM-V10-001',remarks:''},
  {id:4,date:'10/8/2024 1:56:41 PM',customerName:'ABHISHEK SONI',customerCode:'CUS004',vehicleCount:'1',address:'',vehicleNumber:'',modelName:'V10',modelSubType:'GH600LC',vehicleName:'HYUNDAI',serialNumber:'',bomType:'New',bomModelNumber:'BOM-V10-002',remarks:''},
  {id:5,date:'10/8/2024 2:27:54 PM',customerName:'APS ENTERPRISES',customerCode:'CUS005',vehicleCount:'1',  address:'',vehicleNumber:'',modelName:'V10',modelSubType:'GH600LCAD+',vehicleName:'KOBELCO',serialNumber:'',bomType:'New',bomModelNumber:'BOM-V10-001',remarks:''},
]

const today = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-') // YYYY-MM-DD

const emptyForm = {date:today,customerName:'',customerCode:'',vehicleCount:'',address:'',vehicleNumber:'',modelName:'',modelSubType:'',vehicleName:'',serialNumber:'',bomType:'New',bomModelNumber:'',remarks:''}

function DetailModal({row,onClose}){
  return(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">Vehicle Master Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-5 space-y-1.5 max-h-[70vh] overflow-y-auto">
          {[['Date',row.date],['Customer Name',row.customerName],['Customer Code',row.customerCode],['Vehicle Count',row.vehicleCount],['Vehicle Number',row.vehicleNumber],['Model Name',row.modelName],['Sub Model Type',row.modelSubType],['Vehicle Name',row.vehicleName],['Serial Number',row.serialNumber],['B.O.M. Type',row.bomType],['B.O.M. Model Number',row.bomModelNumber],['Remarks',row.remarks]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{l}</span>
              <span className="text-[13px] text-slate-800 font-medium">{v||'—'}</span>
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

export default function VehicleMaster(){
  const [rows,setRows]=useState(SEED)
  const [form,setForm]=useState(emptyForm)
  const [errors,setErrors]=useState({})
  const [editId,setEditId]=useState(null)
  const [search,setSearch]=useState('')
  const [pageSize,setPageSize]=useState(5)
  const [page,setPage]=useState(1)
  const [detailRow,setDetailRow]=useState(null)

  const setField=(k,v)=>{
    setForm(f=>({...f,[k]:v}))
    setErrors(e=>({...e,[k]:''}))
  }

  const handleCustomerChange=(name)=>{
    const code = name ? 'CUS00'+String(CUSTOMER_SEED.indexOf(name)+1) : ''
    setForm(f=>({...f,customerName:name,customerCode:code}))
    setErrors(e=>({...e,customerName:''}))
  }

  const validate=()=>{
    const errs={}
    if(!form.customerName) errs.customerName='Required'
    if(!form.modelName) errs.modelName='Required'
    if(!form.vehicleName) errs.vehicleName='Required'
    setErrors(errs)
    return Object.keys(errs).length===0
  }

  const handleCreate=()=>{
    if(!validate()) return
    if(editId!==null){
      setRows(r=>r.map(x=>x.id===editId?{...form,id:editId}:x))
      setEditId(null)
    } else {
      const newId=Math.max(0,...rows.map(r=>r.id))+1
      setRows(r=>[...r,{...form,id:newId}])
    }
    setForm(emptyForm);setErrors({});setPage(1)
  }

  const handleEdit=row=>{setForm({...row});setErrors({});setEditId(row.id);window.scrollTo({top:0,behavior:'smooth'})}
  const handleDelete=id=>{if(window.confirm('Delete this vehicle record?')) setRows(r=>r.filter(x=>x.id!==id))}
  const handleClear=()=>{setForm(emptyForm);setErrors({});setEditId(null)}

  const filtered=rows.filter(r=>[r.customerName,r.vehicleNumber,r.modelName,r.modelSubType,r.vehicleName,r.date].some(v=>String(v).toLowerCase().includes(search.toLowerCase())))
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize))
  const paged=filtered.slice((page-1)*pageSize,page*pageSize)

  const pageNums=()=>{
    if(totalPages<=7) return Array.from({length:totalPages},(_,i)=>i+1)
    const ps=[1]
    if(page>3) ps.push('...')
    for(let i=Math.max(2,page-1);i<=Math.min(totalPages-1,page+1);i++) ps.push(i)
    if(page<totalPages-2) ps.push('...')
    ps.push(totalPages)
    return ps
  }

  const inp=(err)=>`w-full border rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 transition-colors bg-white ${err?'border-red-400 focus:ring-red-300':'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
  const lbl="text-[12.5px] font-semibold text-slate-600 whitespace-nowrap"

  return(
    <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Person Masters</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Vehicle Master</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">{editId!==null?'Edit - Vehicle Master Details':'Create - Vehicle Master Details'}</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-32 shrink-0`}>Date :</label>
                <input type="date" value={form.date} onChange={e=>setField('date',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Customer Name :</label>
                <div className="flex-1">
                  <select value={form.customerName} onChange={e=>handleCustomerChange(e.target.value)} className={inp(errors.customerName)}>
                    <option value="">---Select Customer Name---</option>
                    {CUSTOMER_SEED.map(c=><option key={c}>{c}</option>)}
                  </select>
                  {errors.customerName&&<p className="text-[11px] text-red-500 mt-0.5">{errors.customerName}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-32 shrink-0`}>Customer Code :</label>
                <input value={form.customerCode} readOnly className={`${inp(false)} bg-slate-50`}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-32 shrink-0`}>Vehicle Count :</label>
                <div className="flex flex-1 gap-2">
                  <input value={form.vehicleCount} onChange={e=>setField('vehicleCount',e.target.value)} className={inp(false)}/>
                  <input className={inp(false)} placeholder=""/>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-32 shrink-0 pt-1`}>Address :</label>
                <div className="flex-1 space-y-1">
                  <input value={form.address||''} onChange={e=>setField('address',e.target.value)} className={inp(false)}/>
                  <input value={form.address2||''} onChange={e=>setField('address2',e.target.value)} className={inp(false)}/>
                  <input value={form.address3||''} onChange={e=>setField('address3',e.target.value)} className={inp(false)}/>
                  <input value={form.address4||''} onChange={e=>setField('address4',e.target.value)} className={inp(false)}/>
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}>Vehicle Number :</label>
                <input value={form.vehicleNumber} onChange={e=>setField('vehicleNumber',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}><span className="text-red-500">*</span>Vehicle Model Name :</label>
                <div className="flex-1">
                  <select value={form.modelName} onChange={e=>setField('modelName',e.target.value)} className={inp(errors.modelName)}>
                    <option value="">---Select Model Name---</option>
                    {MODEL_NAMES.map(m=><option key={m}>{m}</option>)}
                  </select>
                  {errors.modelName&&<p className="text-[11px] text-red-500 mt-0.5">{errors.modelName}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}><span className="text-red-500">*</span>Model Sub Type :</label>
                <select value={form.modelSubType} onChange={e=>setField('modelSubType',e.target.value)} className={inp(false)}>
                  <option value="">---Select Model Sub Type---</option>
                  {MODEL_SUB_TYPES.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}><span className="text-red-500">*</span>Vehicle Name :</label>
                <div className="flex-1">
                  <select value={form.vehicleName} onChange={e=>setField('vehicleName',e.target.value)} className={inp(errors.vehicleName)}>
                    <option value="">---Select Vehicle Name---</option>
                    {VEHICLE_NAMES.map(v=><option key={v}>{v}</option>)}
                  </select>
                  {errors.vehicleName&&<p className="text-[11px] text-red-500 mt-0.5">{errors.vehicleName}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}><span className="text-red-500">*</span>Serial Number :</label>
                <input value={form.serialNumber} onChange={e=>setField('serialNumber',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}><span className="text-red-500">*</span>B.O.M. Type :</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                    <input type="radio" name="bomType" value="New" checked={form.bomType==='New'} onChange={e=>setField('bomType',e.target.value)} className="text-[#0097A7]"/>
                    New
                  </label>
                  <label className="flex items-center gap-1.5 text-[13px] cursor-pointer">
                    <input type="radio" name="bomType" value="Existing" checked={form.bomType==='Existing'} onChange={e=>setField('bomType',e.target.value)} className="text-[#0097A7]"/>
                    Existing
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}><span className="text-red-500">*</span>B.O.M. Model Number :</label>
                <select value={form.bomModelNumber} onChange={e=>setField('bomModelNumber',e.target.value)} className={inp(false)}>
                  <option value="">---Select B.O.M. Model Number---</option>
                  {BOM_MODELS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-36 shrink-0`}>Remarks :</label>
                <input value={form.remarks} onChange={e=>setField('remarks',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex gap-2 pt-2 justify-end">
                <button onClick={handleCreate} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
                  <Save className="w-4 h-4"/> {editId!==null?'Update':'Create'}
                </button>
                <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
                  <RotateCcw className="w-4 h-4"/> Clear
                </button>
                <button onClick={()=>setPage(1)} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-semibold rounded transition-colors shadow-sm">
                  <List className="w-4 h-4"/> Display All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">Vehicle Master Details</h2>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Search:
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-40"/>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">
            Show
            <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className="border border-slate-300 rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7]">
              {PAGE_SIZES.map(s=><option key={s}>{s}</option>)}
            </select>
            entries
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['S.No.','Created Date','Customer Name','Cust. Vehicle Count','Vehicle Number','Model Number','Sub Model Type','Vehicle Name','Edit','Delete','Details'].map(h=>(
                  <th key={h} className="text-center px-2 py-1.5 font-bold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">
                    {h}
                    {['Created Date','Customer Name','Cust. Vehicle Count','Vehicle Number','Model Number','Sub Model Type','Vehicle Name'].includes(h)&&(
                      <svg className="inline w-3 h-3 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length===0?(<tr><td colSpan={11} className="text-center py-8 text-slate-400 text-[12px]">No records found</td></tr>)
              :paged.map((row,idx)=>(
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                  <td className="px-2 py-1.5 text-center">{(page-1)*pageSize+idx+1}</td>
                  <td className="px-2 py-1.5 text-center">{row.date}</td>
                  <td className="px-2 py-1.5 text-center font-medium">{row.customerName}</td>
                  <td className="px-2 py-1.5 text-center">{row.vehicleCount}</td>
                  <td className="px-2 py-1.5 text-center">{row.vehicleNumber}</td>
                  <td className="px-2 py-1.5 text-center">{row.modelName}</td>
                  <td className="px-2 py-1.5 text-center">{row.modelSubType}</td>
                  <td className="px-2 py-1.5 text-center">{row.vehicleName}</td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={()=>handleEdit(row)} className="px-2 py-1 bg-[--color-main] hover:bg-[#3498db] text-white text-[11px] rounded transition-colors" title="Edit"><Edit className="w-3.5 h-3.5"/></button>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={()=>handleDelete(row.id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5"/></button>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={()=>setDetailRow(row)} className="px-2 py-1 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] rounded transition-colors" title="Details"><Info className="w-3.5 h-3.5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <span className="text-[12px] text-slate-500">Showing {filtered.length===0?0:(page-1)*pageSize+1} to {Math.min(page*pageSize,filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
            {pageNums().map((n,i)=>n==='...'?<span key={`e${i}`} className="px-2 text-slate-400 text-[12px]">…</span>:<button key={n} onClick={()=>setPage(n)} className={`w-8 h-8 text-[12px] rounded border transition-colors ${page===n?'bg-[#0097A7] text-white border-[#0097A7]':'border-slate-300 hover:bg-slate-100 text-slate-600'}`}>{n}</button>)}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1.5 text-[12px] border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      </div>

      {detailRow&&<DetailModal row={detailRow} onClose={()=>setDetailRow(null)}/>}
    </div>
  )
}
