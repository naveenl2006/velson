import { useState } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight } from 'lucide-react'

const CUSTOMER_TYPES = ['Regular','Dealer','Distributor','Retailer','OEM','Government','Institutional']
const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry']
const STATE_CODES = {'Andhra Pradesh':'AP','Arunachal Pradesh':'AR','Assam':'AS','Bihar':'BR','Chhattisgarh':'CG','Goa':'GA','Gujarat':'GJ','Haryana':'HR','Himachal Pradesh':'HP','Jharkhand':'JH','Karnataka':'KA','Kerala':'KL','Madhya Pradesh':'MP','Maharashtra':'MH','Manipur':'MN','Meghalaya':'ML','Mizoram':'MZ','Nagaland':'NL','Odisha':'OD','Punjab':'PB','Rajasthan':'RJ','Sikkim':'SK','Tamil Nadu':'TN','Telangana':'TS','Tripura':'TR','Uttar Pradesh':'UP','Uttarakhand':'UK','West Bengal':'WB','Delhi':'DL','Jammu & Kashmir':'JK','Ladakh':'LA','Puducherry':'PY'}
const PAGE_SIZES = [4,10,25,50]

const SEED = [
  {id:1,lCode:'LM97',cCode:'CUS97',customerType:'Regular',customerName:'SM DRILLING COMPANY',address:'',city:'',country:'India',state:'',stateCode:'',pinCode:'',contactPerson:'',mobile:'',phone:'',email:'',website:'',aadharNo:'',gstNo:'',panNo:'',bankName:'',branchName:'',accountName:'',accountNumber:'',ifscCode:'',micrCode:'',remarks:''},
  {id:2,lCode:'',cCode:'CUS98',customerType:'Dealer',customerName:'APC DRILLING AND CONSTRUCTION PVT LTD',address:'',city:'',country:'India',state:'',stateCode:'',pinCode:'',contactPerson:'',mobile:'',phone:'',email:'',website:'',aadharNo:'',gstNo:'',panNo:'',bankName:'',branchName:'',accountName:'',accountNumber:'',ifscCode:'',micrCode:'',remarks:''},
  {id:3,lCode:'',cCode:'CUS102',customerType:'Regular',customerName:'VELSON',address:'',city:'',country:'India',state:'',stateCode:'',pinCode:'',contactPerson:'',mobile:'7402649977',phone:'',email:'',website:'',aadharNo:'',gstNo:'',panNo:'',bankName:'',branchName:'',accountName:'',accountNumber:'',ifscCode:'',micrCode:'',remarks:''},
  {id:4,lCode:'LM103',cCode:'CUS103',customerType:'Regular',customerName:'ABHISHEK SONI',address:'',city:'',country:'India',state:'',stateCode:'',pinCode:'',contactPerson:'',mobile:'',phone:'',email:'',website:'',aadharNo:'',gstNo:'',panNo:'',bankName:'',branchName:'',accountName:'',accountNumber:'',ifscCode:'',micrCode:'',remarks:''},
]

const emptyForm = {customerType:'',cCode:'',customerName:'',address:'',city:'',country:'India',state:'',stateCode:'',pinCode:'',contactPerson:'',mobile:'',phone:'',email:'',website:'',aadharNo:'',gstNo:'',panNo:'',bankName:'',branchName:'',accountName:'',accountNumber:'',ifscCode:'',micrCode:'',remarks:''}

function DetailModal({row,onClose}){
  return(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-[15px]">Customer Master Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1.5 max-h-[70vh] overflow-y-auto">
          {[['Customer Type',row.customerType],['Customer Code',row.cCode],['Customer Name',row.customerName],['GST No',row.gstNo],['Pan No',row.panNo],['City',row.city],['State',row.state],['State Code',row.stateCode],['Pin Code',row.pinCode],['Contact Person',row.contactPerson],['Mobile',row.mobile],['Phone',row.phone],['Email',row.email],['Aadhar No',row.aadharNo],['Bank Name',row.bankName],['Branch Name',row.branchName],['Account Name',row.accountName],['Account Number',row.accountNumber],['IFSC Code',row.ifscCode],['MICR Code',row.micrCode],['Remarks',row.remarks]].map(([l,v])=>(
            <div key={l} className="flex flex-col py-1 border-b border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span>
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

export default function CustomerMaster(){
  const [rows,setRows]=useState(SEED)
  const [form,setForm]=useState(emptyForm)
  const [errors,setErrors]=useState({})
  const [editId,setEditId]=useState(null)
  const [search,setSearch]=useState('')
  const [pageSize,setPageSize]=useState(4)
  const [page,setPage]=useState(1)
  const [detailRow,setDetailRow]=useState(null)

  const setField=(k,v)=>{
    let extra={}
    if(k==='state') extra={stateCode:STATE_CODES[v]??''}
    setForm(f=>({...f,[k]:v,...extra}))
    setErrors(e=>({...e,[k]:''}))
  }

  const validate=()=>{
    const errs={}
    if(!form.customerType) errs.customerType='Required'
    if(!form.customerName.trim()) errs.customerName='Required'
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
      setRows(r=>[...r,{...form,id:newId,cCode:form.cCode||'CUS'+String(newId+100)}])
    }
    setForm(emptyForm);setErrors({});setPage(1)
  }

  const handleEdit=row=>{setForm({...row});setErrors({});setEditId(row.id);window.scrollTo({top:0,behavior:'smooth'})}
  const handleDelete=id=>{if(window.confirm('Delete this customer?')) setRows(r=>r.filter(x=>x.id!==id))}
  const handleClear=()=>{setForm(emptyForm);setErrors({});setEditId(null)}

  const filtered=rows.filter(r=>[r.cCode,r.customerName,r.city,r.state,r.contactPerson,r.mobile,r.email].some(v=>String(v).toLowerCase().includes(search.toLowerCase())))
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
    <div className="p-4 space-y-4 w-full min-w-0">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Person Masters</span>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Customer Master</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">{editId!==null?'Edit - Customer Master Details':'Create - Customer Master Details'}</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            {/* Col 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Customer Type :</label>
                <div className="flex-1">
                  <select value={form.customerType} onChange={e=>setField('customerType',e.target.value)} className={inp(errors.customerType)}>
                    <option value="">---Select Customer Type---</option>
                    {CUSTOMER_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                  {errors.customerType&&<p className="text-[11px] text-red-500 mt-0.5">{errors.customerType}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Customer Code :</label>
                <input value={form.cCode} onChange={e=>setField('cCode',e.target.value)} className={`${inp(false)} bg-slate-50`} placeholder="Auto-generated"/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}><span className="text-red-500">*</span>Customer Name :</label>
                <div className="flex-1">
                  <input value={form.customerName} onChange={e=>setField('customerName',e.target.value)} className={inp(errors.customerName)}/>
                  {errors.customerName&&<p className="text-[11px] text-red-500 mt-0.5">{errors.customerName}</p>}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <label className={`${lbl} w-28 shrink-0 pt-1`}>Address :</label>
                <div className="flex-1 space-y-1">
                  <input value={form.address} onChange={e=>setField('address',e.target.value)} className={inp(false)}/>
                  <input value={form.address2||''} onChange={e=>setField('address2',e.target.value)} className={inp(false)}/>
                  <input value={form.address3||''} onChange={e=>setField('address3',e.target.value)} className={inp(false)}/>
                  <input value={form.address4||''} onChange={e=>setField('address4',e.target.value)} className={inp(false)}/>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>City :</label>
                <input value={form.city} onChange={e=>setField('city',e.target.value)} placeholder="Type to search for City..." className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Country :</label>
                <input value={form.country} onChange={e=>setField('country',e.target.value)} placeholder="Type to search for Country..." className={inp(false)}/>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>State :</label>
                <select value={form.state} onChange={e=>setField('state',e.target.value)} className={inp(false)}>
                  <option value="">Type to search for State...</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>State Code :</label>
                <input value={form.stateCode} readOnly className={`${inp(false)} bg-slate-50`}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>PinCode :</label>
                <input value={form.pinCode} onChange={e=>setField('pinCode',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Contact Person :</label>
                <input value={form.contactPerson} onChange={e=>setField('contactPerson',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Mobile Number :</label>
                <input value={form.mobile} onChange={e=>setField('mobile',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Phone Number :</label>
                <input value={form.phone} onChange={e=>setField('phone',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Email-ID :</label>
                <input value={form.email} onChange={e=>setField('email',e.target.value)} type="email" className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Website :</label>
                <input value={form.website} onChange={e=>setField('website',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Aadhar No. :</label>
                <input value={form.aadharNo} onChange={e=>setField('aadharNo',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>GST No. :</label>
                <input value={form.gstNo} onChange={e=>setField('gstNo',e.target.value)} className={inp(false)}/>
              </div>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Pan No. :</label>
                <input value={form.panNo} onChange={e=>setField('panNo',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Bank Name :</label>
                <input value={form.bankName} onChange={e=>setField('bankName',e.target.value)} placeholder="Type to search for Bank Name..." className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Branch Name :</label>
                <input value={form.branchName} onChange={e=>setField('branchName',e.target.value)} placeholder="Type to search for Bank Branch..." className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Account Name :</label>
                <input value={form.accountName} onChange={e=>setField('accountName',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Account Number :</label>
                <input value={form.accountNumber} onChange={e=>setField('accountNumber',e.target.value)} className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>IFSC Code :</label>
                <input value={form.ifscCode} onChange={e=>setField('ifscCode',e.target.value)} placeholder="Type to search for Bank IFSC Code..." className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>MICR Code :</label>
                <input value={form.micrCode} onChange={e=>setField('micrCode',e.target.value)} placeholder="Type to search for Bank MICR Code..." className={inp(false)}/>
              </div>
              <div className="flex items-center gap-2">
                <label className={`${lbl} w-28 shrink-0`}>Remarks :</label>
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
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5">
          <h2 className="text-white text-center font-semibold text-[14px]">Customer Master Details</h2>
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
                {['S.No','L.Code','C.Code','Name','City','State','Con. Person','Mobile','EMail Id','Edit','Delete','Details'].map(h=>(
                  <th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">
                    {h}
                    {['L.Code','C.Code','Name','City','State','Con. Person','Mobile','EMail Id'].includes(h)&&(
                      <svg className="inline w-3 h-3 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length===0?(<tr><td colSpan={12} className="text-center py-8 text-slate-400 text-[13px]">No records found</td></tr>)
              :paged.map((row,idx)=>(
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                  <td className="px-3 py-2 text-center">{(page-1)*pageSize+idx+1}</td>
                  <td className="px-3 py-2 text-center">{row.lCode}</td>
                  <td className="px-3 py-2 text-center">{row.cCode}</td>
                  <td className="px-3 py-2 text-center font-medium">{row.customerName}</td>
                  <td className="px-3 py-2 text-center">{row.city}</td>
                  <td className="px-3 py-2 text-center">{row.state}</td>
                  <td className="px-3 py-2 text-center">{row.contactPerson}</td>
                  <td className="px-3 py-2 text-center">{row.mobile}</td>
                  <td className="px-3 py-2 text-center">{row.email}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={()=>handleEdit(row)} className="px-3 py-1.5 bg-[--color-main] hover:bg-[#3498db] text-white text-[12px] rounded transition-colors" title="Edit"><Edit className="w-4 h-4"/></button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={()=>handleDelete(row.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4"/></button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={()=>setDetailRow(row)} className="px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] rounded transition-colors" title="Details"><Info className="w-4 h-4"/></button>
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
