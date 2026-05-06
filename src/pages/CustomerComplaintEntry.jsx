import { useState, useEffect } from 'react'
import { ChevronRight, Save, X, Camera, Send, CheckCircle2, User, Phone, MapPin, ClipboardList, RotateCcw, Search, Trash2, Mail, Map, Plus } from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
    {required && <span className="text-red-500 mr-1">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = "", ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full px-4 py-2 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed border-dashed' : 'hover:border-slate-300'} shadow-sm ${className}`}
    {...props}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative group ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 pr-10 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer shadow-sm"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center group-hover:text-[#0097A7] transition-colors">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

const TextArea = ({ placeholder, value, onChange, className = "" }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={4}
    className={`w-full px-4 py-3 text-[13px] border border-slate-200 rounded-xl bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 resize-none shadow-sm ${className}`}
  />
)

const SectionTitle = ({ title, step }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 bg-[#0097A7] text-white rounded-lg flex items-center justify-center font-black text-sm shadow-md">
      {step}
    </div>
    <h3 className="text-[13px] font-black text-slate-700 uppercase tracking-widest">{title}</h3>
  </div>
)

export default function CustomerComplaintEntry() {
  const [form, setForm] = useState({
    ccNo: 'CC-' + Math.floor(Math.random() * 90000 + 10000),
    date: new Date().toISOString().split('T')[0],
    recDate: '',
    customerName: '',
    customerCode: '',
    vehicleCount: '',
    complainantName: '',
    modelNo: '',
    siteAddress: '',
    whatsappLocation: '',
    openingComplaint: '',
    serialNo: '',
    designation: '',
    mobileNo: '',
    alternateNo: '',
    emailId: '',
    complaintType: '',
    serviceType: '',
    workCompleteDate: '',
    complaintClosedDate: '',
    natureOfComplaint: '',
    actionThrough: '',
    attenderName: '',
    attenDate: '',
    finalDate: '',
    actionTaken: '',
    preventiveMeasure: '',
    feedbackSatisfaction: '',
    status: 'Open'
  })

  const [complaints, setComplaints] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_ccms_complaints') || '[]')
    setComplaints(saved)
  }, [])

  const handleSave = () => {
    if (!form.customerName || !form.complainantName) {
      alert('Required: Customer and Complainant.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      const entry = { ...form, id: Date.now() }
      const updated = [entry, ...complaints]
      localStorage.setItem('velson_ccms_complaints', JSON.stringify(updated))
      setComplaints(updated)
      setIsSaving(false)
      alert('Complaint Registered Successfully!')
      handleReset()
    }, 800)
  }

  const handleReset = () => {
    setForm({
      ccNo: 'CC-' + Math.floor(Math.random() * 90000 + 10000),
      date: new Date().toISOString().split('T')[0],
      recDate: '',
      customerName: '',
      customerCode: '',
      vehicleCount: '',
      complainantName: '',
      modelNo: '',
      siteAddress: '',
      whatsappLocation: '',
      openingComplaint: '',
      serialNo: '',
      designation: '',
      mobileNo: '',
      alternateNo: '',
      emailId: '',
      complaintType: '',
      serviceType: '',
      workCompleteDate: '',
      complaintClosedDate: '',
      natureOfComplaint: '',
      actionThrough: '',
      attenderName: '',
      attenDate: '',
      finalDate: '',
      actionTaken: '',
      preventiveMeasure: '',
      feedbackSatisfaction: '',
      status: 'Open'
    })
  }

  const deleteEntry = (id) => {
    const next = complaints.filter(c => c.id !== id)
    setComplaints(next)
    localStorage.setItem('velson_ccms_complaints', JSON.stringify(next))
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>CCMS</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">Complaint Entry</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#0097A7] rounded" />
                <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Customer Complaint Registry</h2>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Status :</span>
                <span className="text-[11px] font-black text-rose-500 uppercase italic">Live Form</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-8 space-y-12">
            {/* Step 1: Core Details */}
            <section className="bg-[#fcfdfe] p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <ClipboardList size={120} />
              </div>
              <SectionTitle title="Identity & Source" step="01" />

              <div className="grid grid-cols-12 gap-x-12 gap-y-6 relative z-10">
                <div className="col-span-4 space-y-5">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>CC Number</Label></div>
                    <div className="col-span-8"><Input value={form.ccNo} readOnly className="!font-black text-[#0097A7] !bg-white" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>Customer</Label></div>
                    <div className="col-span-8"><Select options={['Customer A', 'Customer B', 'Customer C']} placeholder="Select Client..." value={form.customerName} onChange={u('customerName')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Reference</Label></div>
                    <div className="col-span-4"><Input placeholder="Code" value={form.customerCode} onChange={u('customerCode')} /></div>
                    <div className="col-span-4"><Input placeholder="Qty" value={form.vehicleCount} onChange={u('vehicleCount')} type="number" /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label required>Reporter</Label></div>
                    <div className="col-span-8"><Input placeholder="Person Name" value={form.complainantName} onChange={u('complainantName')} /></div>
                  </div>
                </div>

                <div className="col-span-4 space-y-5">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>System Date</Label></div>
                    <div className="col-span-8"><Input type="date" value={form.date} onChange={u('date')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Receive Date</Label></div>
                    <div className="col-span-8"><Input type="date" value={form.recDate} onChange={u('recDate')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Model Ref</Label></div>
                    <div className="col-span-8"><Select options={['MOD-X-2026', 'MOD-V7-PRO']} placeholder="Select Model" value={form.modelNo} onChange={u('modelNo')} /></div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-4 text-right"><Label>Serial No</Label></div>
                    <div className="col-span-8"><Input placeholder="SN-00000" value={form.serialNo} onChange={u('serialNo')} /></div>
                  </div>
                </div>

                <div className="col-span-4 space-y-5 pl-8 border-l border-slate-100">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-[#0097A7]/10 rounded-full flex items-center justify-center text-[#0097A7]">
                          <Camera size={20} />
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Evidence<br/>Visualization</p>
                    </div>
                    <div className="aspect-video w-full bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-200 group hover:border-[#0097A7] transition-all cursor-pointer">
                       <Plus size={32} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Classification Radio */}
                <div className="col-span-12 mt-4 pt-6 border-t border-slate-100">
                   <div className="flex items-center gap-10">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Complaint Classification :</span>
                     <div className="flex gap-6">
                        {['Fabrication', 'Functional', 'Leakage', 'Electrical'].map(type => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="radio" 
                              name="complaintType" 
                              checked={form.complaintType === type}
                              onChange={() => setForm(f => ({...f, complaintType: type}))}
                              className="w-4.5 h-4.5 accent-[#0097A7]" 
                            />
                            <span className="text-[11px] font-black text-slate-600 uppercase group-hover:text-[#0097A7] transition-colors">{type}</span>
                          </label>
                        ))}
                     </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Step 2 & 3: Contact & Location */}
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#0097A7]" />
                <SectionTitle title="Location & Access" step="02" />
                <div className="space-y-5">
                   <div className="grid grid-cols-12 items-center gap-4">
                     <div className="col-span-3 text-right"><Label>Site Address</Label></div>
                     <div className="col-span-9"><Input placeholder="Street, City, ZIP..." value={form.siteAddress} onChange={u('siteAddress')} /></div>
                   </div>
                   <div className="grid grid-cols-12 items-center gap-4">
                     <div className="col-span-3 text-right"><Label>Geo Tag</Label></div>
                     <div className="col-span-9"><Select options={['Loc A (12.34, 56.78)', 'Loc B (89.01, 23.45)']} placeholder="Select Map Location" value={form.whatsappLocation} onChange={u('whatsappLocation')} /></div>
                   </div>
                   <div className="grid grid-cols-12 items-center gap-4">
                     <div className="col-span-3 text-right"><Label>Opening Case</Label></div>
                     <div className="col-span-9"><Select options={['First Time', 'Repetitive', 'Warranty Claim']} placeholder="Case Type" value={form.openingComplaint} onChange={u('openingComplaint')} /></div>
                   </div>
                </div>
              </div>

              <div className="col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#0097A7]" />
                <SectionTitle title="Communication" step="03" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                   <div className="space-y-1">
                      <Label>Designation</Label>
                      <Input placeholder="Job Title" value={form.designation} onChange={u('designation')} />
                   </div>
                   <div className="space-y-1">
                      <Label>Primary Phone</Label>
                      <Input placeholder="+91 00000 00000" value={form.mobileNo} onChange={u('mobileNo')} />
                   </div>
                   <div className="space-y-1">
                      <Label>Alternate Contact</Label>
                      <Input placeholder="Backup No." value={form.alternateNo} onChange={u('alternateNo')} />
                   </div>
                   <div className="space-y-1">
                      <Label>Email ID</Label>
                      <Input placeholder="user@company.com" value={form.emailId} onChange={u('emailId')} />
                   </div>
                </div>
              </div>
            </div>

            {/* Step 4 & 5: Narrative & Action */}
            <div className="grid grid-cols-12 gap-10">
               <div className="col-span-7 space-y-8">
                  <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm border-l-[6px] border-l-[#0097A7]">
                    <SectionTitle title="Nature & Origin" step="04" />
                    <TextArea placeholder="Describe the complaint in detail. Mention symptoms, duration, and frequency..." value={form.natureOfComplaint} onChange={u('natureOfComplaint')} className="h-40" />
                    <div className="flex items-center gap-4 mt-6">
                       <Label>Resolved Through :</Label>
                       <Input placeholder="Technician / Remote Support / Field Engineer" value={form.actionThrough} onChange={u('actionThrough')} className="flex-1" />
                    </div>
                  </section>

                  <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm border-l-[6px] border-l-[#0097A7]">
                    <SectionTitle title="Preventive Strategy" step="06" />
                    <TextArea placeholder="Outline the steps taken to ensure this issue does not recur..." value={form.preventiveMeasure} onChange={u('preventiveMeasure')} className="h-40" />
                  </section>
               </div>

               <div className="col-span-5 space-y-8">
                  <section className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#0097A7]/10 rounded-full blur-3xl group-hover:bg-[#0097A7]/20 transition-all" />
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="text-white text-[12px] font-black uppercase tracking-[0.3em]">Intervention Details</h3>
                        <div className="px-3 py-1 bg-[#0097A7] text-white text-[9px] font-black rounded-full uppercase tracking-widest">Step 05</div>
                     </div>
                     <div className="space-y-5 relative z-10">
                        <div className="space-y-1">
                           <Label><span className="text-white/50">Assigned Attender</span></Label>
                           <Select options={['Engineer X', 'Staff Y', 'Technician Z']} placeholder="Select Personnel" value={form.attenderName} onChange={u('attenderName')} className="!bg-slate-800 !text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <Label><span className="text-white/50">Visit Date</span></Label>
                              <Input type="date" value={form.attenDate} onChange={u('attenDate')} className="!bg-slate-800 !text-white !border-slate-700" />
                           </div>
                           <div className="space-y-1">
                              <Label><span className="text-white/50">Closing Date</span></Label>
                              <Input type="date" value={form.finalDate} onChange={u('finalDate')} className="!bg-slate-800 !text-white !border-slate-700" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <Label><span className="text-white/50">Action Executed</span></Label>
                           <TextArea placeholder="Log of work performed..." value={form.actionTaken} onChange={u('actionTaken')} className="h-24 !bg-slate-800 !text-white !border-slate-700" />
                        </div>
                     </div>
                  </section>

                  <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                     <SectionTitle title="Final Verdict" step="07" />
                     <Label>Client Feedback & Satisfaction Score</Label>
                     <TextArea placeholder="Customer comments post-resolution..." value={form.feedbackSatisfaction} onChange={u('feedbackSatisfaction')} className="h-32 mt-2" />
                     <div className="grid grid-cols-2 gap-4 mt-6">
                        <button onClick={handleReset} className="py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 text-[11px] font-black rounded-xl border border-slate-200 transition-all uppercase tracking-widest active:scale-95">
                           Discard
                        </button>
                        <button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="py-3 bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-black rounded-xl shadow-lg transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                           {isSaving ? <RotateCcw size={14} className="animate-spin" /> : <Save size={14} />}
                           {isSaving ? 'Processing...' : 'Register Complaint'}
                        </button>
                     </div>
                  </section>
               </div>
            </div>

            {/* List View */}
            <div className="mt-12">
               <div className="flex items-center justify-between mb-4 px-2">
                 <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-700 rounded-full" />
                    Open Complaints Registry
                 </h3>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full">
                      {complaints.length} Active Records
                    </span>
                 </div>
               </div>
               <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-white">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-[#fcfdfe] text-[10px] uppercase text-slate-400 font-black border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-5 border-r border-slate-100 w-16 text-center">#</th>
                       <th className="px-6 py-5 border-r border-slate-100">CC No</th>
                       <th className="px-6 py-5 border-r border-slate-100">Customer</th>
                       <th className="px-6 py-5 border-r border-slate-100">Complainant</th>
                       <th className="px-6 py-5 border-r border-slate-100">Type</th>
                       <th className="px-6 py-5 border-r border-slate-100 text-center">Status</th>
                       <th className="px-6 py-5 text-center w-20">Del</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[12.5px]">
                     {complaints.length === 0 ? (
                       <tr>
                         <td colSpan={7} className="py-24 text-center text-slate-300 italic">
                            <ClipboardList size={64} className="mx-auto mb-4 opacity-10" />
                            No complaints registered in the local session.
                         </td>
                       </tr>
                     ) : (
                       complaints.map((c, idx) => (
                         <tr key={c.id} className="hover:bg-[#0097A7]/5 transition-colors h-16 group">
                           <td className="px-6 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                           <td className="px-6 py-2 border-r border-slate-50 font-black text-[#0097A7]">{c.ccNo}</td>
                           <td className="px-6 py-2 border-r border-slate-50 font-bold text-slate-700">{c.customerName}</td>
                           <td className="px-6 py-2 border-r border-slate-50 font-medium text-slate-600">{c.complainantName}</td>
                           <td className="px-6 py-2 border-r border-slate-50">
                              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                                {c.complaintType || 'N/A'}
                              </span>
                           </td>
                           <td className="px-6 py-2 border-r border-slate-50 text-center">
                              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {c.status}
                              </span>
                           </td>
                           <td className="px-6 py-2 text-center">
                             <button onClick={() => deleteEntry(c.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                               <Trash2 size={16} />
                             </button>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
