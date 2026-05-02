import { useState } from 'react'
import { X, Save, RotateCcw, List, Edit, Trash2, Info, ChevronRight, Upload } from 'lucide-react'

const COMPANY_TYPES = ['Private Limited','Public Limited','Partnership','Sole Proprietorship','LLP','OPC']
const TABS = ['Basic Info','Address','Tax & Legal','Contacts','Bank Details','Branding']
const DEPTS = [{label:'Company',p:'C'},{label:'Marketing',p:'M'},{label:'Purchase',p:'P'},{label:'Sales',p:'S'},{label:'Service',p:'SER'}]
const PAGE_SIZES = [4,10,25,50]

const empty = {
  CompanyCode:'',CompanyName:'',CompanyTypeId:'',Status:'Active',
  DoorNumber:'',Street:'',Place:'',Post:'',City:'',Taluk:'',District:'',DistrictCode:'',
  State:'',StateCode:'',Country:'India',PinCode:'',FullAddress:'',
  GSTIN:'',PanNo:'',
  CPhoneNumber:'',CEMailId:'',CWebsiteURL:'',
  MPhoneNumber:'',MEMailId:'',MWebsiteURL:'',
  PPhoneNumber:'',PEMailId:'',PWebsiteURL:'',
  SPhoneNumber:'',SEMailId:'',SWebsiteURL:'',
  SERPhoneNumber:'',SEREMailId:'',SERWebsiteURL:'',
  BankAccountType:'',BankAccountName:'',BankAccountNumber:'',BankName:'',BankIFSCCode:'',
  BankMICRCode:'',BankBranch:'',BankDistrict:'',BankState:'',BankPinCode:'',BankCountry:'India',BankFullAddress:'',
  CompanyLogo:null,
}
const SEED=[
  {id:1,...empty,CompanyCode:'C0001',CompanyName:'VELSON INDUSTRIES PVT LTD',CompanyTypeId:'Private Limited',Status:'Active',City:'Chennai',State:'Tamil Nadu',GSTIN:'33AABCV1234M1Z5',PanNo:'AABCV1234M'},
  {id:2,...empty,CompanyCode:'C0002',CompanyName:'VELSON SERVICES LLP',CompanyTypeId:'LLP',Status:'Active',City:'Coimbatore',State:'Tamil Nadu',GSTIN:'33AABCV5678M1Z1',PanNo:'AABCV5678M'},
]

export default function CompanyMaster(){
  const [rows,setRows]=useState(SEED)
  const [form,setForm]=useState({...empty})
  const [errors,setErrors]=useState({})
  const [editId,setEditId]=useState(null)
  const [search,setSearch]=useState('')
  const [pageSize,setPageSize]=useState(4)
  const [page,setPage]=useState(1)
  const [detailRow,setDetailRow]=useState(null)
  const [tab,setTab]=useState(0)

  const sf=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:''}));}
  const validate=()=>{const e={};if(!form.CompanyName.trim())e.CompanyName='Required';if(!form.CompanyTypeId)e.CompanyTypeId='Required';setErrors(e);return!Object.keys(e).length}
  const handleSave=()=>{
    if(!validate()){setTab(0);return}
    if(editId!==null){setRows(r=>r.map(x=>x.id===editId?{...form,id:editId}:x));setEditId(null);}
    else{const id=Math.max(0,...rows.map(r=>r.id))+1;setRows(r=>[...r,{...form,id,CompanyCode:form.CompanyCode||`C${String(id).padStart(4,'0')}`}]);}
    setForm({...empty});setErrors({});setPage(1);setTab(0)
  }
  const handleEdit=r=>{setForm({...r});setErrors({});setEditId(r.id);setTab(0);window.scrollTo({top:0,behavior:'smooth'})}
  const handleDelete=id=>{if(window.confirm('Delete?'))setRows(r=>r.filter(x=>x.id!==id))}
  const handleClear=()=>{setForm({...empty});setErrors({});setEditId(null)}
  const filtered=rows.filter(r=>[r.CompanyCode,r.CompanyName,r.City,r.State,r.GSTIN,r.Status].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase())))
  const total=Math.max(1,Math.ceil(filtered.length/pageSize))
  const paged=filtered.slice((page-1)*pageSize,page*pageSize)
  const pNums=()=>{if(total<=7)return Array.from({length:total},(_,i)=>i+1);const ps=[1];if(page>3)ps.push('...');for(let i=Math.max(2,page-1);i<=Math.min(total-1,page+1);i++)ps.push(i);if(page<total-2)ps.push('...');ps.push(total);return ps}
  const inp=(e)=>`w-full border rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 transition-colors bg-white ${e?'border-red-400 focus:ring-red-300':'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
  const lbl='text-[12.5px] font-semibold text-slate-600 whitespace-nowrap'
  const FR=({label,fk,type='text',req,ro,ml,ph,ta})=>(
    <div className={`flex items-${ta?'start':'center'} gap-2`}>
      <label className={`${lbl} w-32 shrink-0 ${ta?'pt-1':''}`}>{req&&<span className="text-red-500">*</span>}{label} :</label>
      <div className="flex-1">
        {ta?<textarea value={form[fk]||''} onChange={e=>sf(fk,e.target.value)} rows={3} className={`w-full border rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-1 border-slate-300 focus:ring-[#0097A7]`}/>
          :<input type={type} value={form[fk]||''} onChange={e=>sf(fk,e.target.value)}
            className={ro?`${inp(false)} bg-slate-50`:inp(errors[fk])}
            readOnly={ro} maxLength={ml} placeholder={ph||''}/>
        }
        {errors[fk]&&<p className="text-[11px] text-red-500 mt-0.5">{errors[fk]}</p>}
      </div>
    </div>
  )

  return(
    <div className="p-4 space-y-4 w-full min-w-0">
      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span><ChevronRight className="w-3 h-3"/>
        <span className="hover:text-[#0097A7] cursor-pointer">Masters</span><ChevronRight className="w-3 h-3"/>
        <span className="text-[#0097A7] font-semibold">Company Master</span>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5"><h2 className="text-white text-center font-semibold text-[14px]">{editId!==null?'Edit':'Create'} — Company Master</h2></div>
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {TABS.map((t,i)=><button key={t} onClick={()=>setTab(i)} className={`px-4 py-2.5 text-[12.5px] font-semibold whitespace-nowrap border-b-2 transition-colors ${tab===i?'border-[#0097A7] text-[#0097A7] bg-white':'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>)}
        </div>
        <div className="p-4">
          {tab===0&&<div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-3xl">
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}>Company Code :</label><input value={form.CompanyCode} onChange={e=>sf('CompanyCode',e.target.value)} className={`${inp(false)} bg-slate-50`} placeholder="Auto-generated"/></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Company Name :</label><div className="flex-1"><input value={form.CompanyName} onChange={e=>sf('CompanyName',e.target.value)} className={inp(errors.CompanyName)}/>{errors.CompanyName&&<p className="text-[11px] text-red-500 mt-0.5">{errors.CompanyName}</p>}</div></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>Company Type :</label><div className="flex-1"><select value={form.CompanyTypeId} onChange={e=>sf('CompanyTypeId',e.target.value)} className={inp(errors.CompanyTypeId)}><option value="">--- Select ---</option>{COMPANY_TYPES.map(t=><option key={t}>{t}</option>)}</select>{errors.CompanyTypeId&&<p className="text-[11px] text-red-500 mt-0.5">{errors.CompanyTypeId}</p>}</div></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}>Status :</label><select value={form.Status} onChange={e=>sf('Status',e.target.value)} className={inp(false)}><option>Active</option><option>Inactive</option></select></div>
          </div>}

          {tab===1&&<div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-4xl">
            <FR label="Door Number" fk="DoorNumber" req/><FR label="Street" fk="Street" req/><FR label="Place" fk="Place" req/><FR label="Post" fk="Post" req/><FR label="City" fk="City" req/><FR label="Taluk" fk="Taluk" req/><FR label="District" fk="District" req/><FR label="District Code" fk="DistrictCode" type="number" req/><FR label="State" fk="State" req/><FR label="State Code" fk="StateCode" type="number" req/><FR label="Country" fk="Country" req/><FR label="Pin Code" fk="PinCode" req/>
            <div className="col-span-2 flex items-start gap-2"><label className={`${lbl} w-32 shrink-0 pt-1`}><span className="text-red-500">*</span>Full Address :</label><textarea value={form.FullAddress} onChange={e=>sf('FullAddress',e.target.value)} rows={3} className="flex-1 border rounded px-2 py-1 text-[13px] border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0097A7]"/></div>
          </div>}

          {tab===2&&<div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-3xl">
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>GSTIN :</label><input value={form.GSTIN} onChange={e=>sf('GSTIN',e.target.value.toUpperCase())} maxLength={15} className={inp(false)} placeholder="15-char GST number"/></div>
            <div className="flex items-center gap-2"><label className={`${lbl} w-32 shrink-0`}><span className="text-red-500">*</span>PAN No. :</label><input value={form.PanNo} onChange={e=>sf('PanNo',e.target.value.toUpperCase())} maxLength={10} className={inp(false)} placeholder="10-char PAN"/></div>
          </div>}

          {tab===3&&<div className="space-y-4">
            {DEPTS.map(d=><div key={d.p} className="border border-slate-200 rounded-lg p-4">
              <p className="text-[12.5px] font-bold text-[#0097A7] mb-3 uppercase tracking-wider">{d.label} Contact</p>
              <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                {[['Phone',`${d.p}PhoneNumber`],['Email',`${d.p}EMailId`,'email'],['Website',`${d.p}WebsiteURL`]].map(([lv,fk,ty='text'])=>(
                  <div key={fk} className="flex items-center gap-2"><label className={`${lbl} w-16 shrink-0`}>{lv} :</label><input type={ty} value={form[fk]||''} onChange={e=>sf(fk,e.target.value)} className={inp(false)}/></div>
                ))}
              </div>
            </div>)}
          </div>}

          {tab===4&&<div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-4xl">
            {[['Account Type','BankAccountType'],['Account Name','BankAccountName'],['Account Number','BankAccountNumber'],['Bank Name','BankName'],['IFSC Code','BankIFSCCode'],['MICR Code','BankMICRCode'],['Branch','BankBranch'],['Bank District','BankDistrict'],['Bank State','BankState'],['Bank Pin Code','BankPinCode'],['Bank Country','BankCountry']].map(([l,k])=>(<FR key={k} label={l} fk={k}/>))}
            <div className="col-span-2 flex items-start gap-2"><label className={`${lbl} w-32 shrink-0 pt-1`}>Full Address :</label><textarea value={form.BankFullAddress} onChange={e=>sf('BankFullAddress',e.target.value)} rows={3} className="flex-1 border rounded px-2 py-1 text-[13px] border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0097A7]"/></div>
          </div>}

          {tab===5&&<div className="max-w-sm space-y-3">
            <p className={lbl}>Company Logo :</p>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#0097A7] transition-colors">
              {form.CompanyLogo?<img src={form.CompanyLogo} alt="Logo" className="max-h-32 mx-auto rounded"/>:<div className="flex flex-col items-center gap-2 text-slate-400"><Upload className="w-10 h-10 text-slate-300"/><p className="text-[13px]">Upload company logo</p></div>}
              <input type="file" accept="image/*" className="mt-3 text-[13px] text-slate-500 w-full" onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>sf('CompanyLogo',ev.target.result);r.readAsDataURL(f)}}}/>
            </div>
          </div>}

          <div className="flex gap-2 pt-4 justify-end border-t border-slate-100 mt-4">
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27ae60] hover:bg-[#229954] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><Save className="w-4 h-4"/>{editId!==null?'Update':'Create'}</button>
            <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><RotateCcw className="w-4 h-4"/>Clear</button>
            <button onClick={()=>setPage(1)} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-semibold rounded transition-colors shadow-sm"><List className="w-4 h-4"/>Display All</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[--color-main] px-4 py-2.5"><h2 className="text-white text-center font-semibold text-[14px]">Company Master Details</h2></div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Search:<input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} className="border border-slate-300 rounded px-3 py-1 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0097A7] w-44"/></div>
          <div className="flex items-center gap-2 text-[13px] text-slate-600">Show<select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}} className="border border-slate-300 rounded px-2 py-1 text-[13px]">{PAGE_SIZES.map(s=><option key={s}>{s}</option>)}</select>entries</div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-[13px]">
            <thead><tr className="bg-slate-50 border-b border-slate-200">{['S.No','Code','Company Name','Type','City','State','GSTIN','Status','Edit','Delete','Details'].map(h=><th key={h} className="text-center px-3 py-2.5 font-semibold text-slate-600 text-[12px] uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {paged.length===0?<tr><td colSpan={11} className="text-center py-8 text-slate-400">No records found</td></tr>
              :paged.map((r,idx)=>(
                <tr key={r.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx%2===1?'bg-slate-50/50':''}`}>
                  <td className="px-3 py-2 text-center">{(page-1)*pageSize+idx+1}</td>
                  <td className="px-3 py-2 text-center font-medium text-[#0097A7]">{r.CompanyCode}</td>
                  <td className="px-3 py-2 text-center font-medium">{r.CompanyName}</td>
                  <td className="px-3 py-2 text-center">{r.CompanyTypeId}</td>
                  <td className="px-3 py-2 text-center">{r.City}</td>
                  <td className="px-3 py-2 text-center">{r.State}</td>
                  <td className="px-3 py-2 text-center font-mono text-[12px]">{r.GSTIN}</td>
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
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#0097A7] to-[#00BCD4] px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-[15px]">Company Details</h2>
            <button onClick={()=>setDetailRow(null)} className="text-white/80 hover:text-white"><X className="w-5 h-5"/></button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1.5 max-h-[70vh] overflow-y-auto">
            {[['Code',detailRow.CompanyCode],['Name',detailRow.CompanyName],['Type',detailRow.CompanyTypeId],['Status',detailRow.Status],['City',detailRow.City],['State',detailRow.State],['Country',detailRow.Country],['Pin Code',detailRow.PinCode],['GSTIN',detailRow.GSTIN],['PAN No',detailRow.PanNo],['Bank Name',detailRow.BankName],['IFSC Code',detailRow.BankIFSCCode]].map(([l,v])=>(
              <div key={l} className="flex flex-col py-1 border-b border-slate-100"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{l}</span><span className="text-[13px] text-slate-800 font-medium">{v||'—'}</span></div>
            ))}
          </div>
          <div className="px-6 pb-5 flex justify-end"><button onClick={()=>setDetailRow(null)} className="px-5 py-2 text-sm font-semibold text-white bg-[#0097A7] hover:bg-[#007a87] rounded-lg transition-colors">Close</button></div>
        </div>
      </div>}
    </div>
  )
}
