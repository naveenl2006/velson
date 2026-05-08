import { useState, useEffect } from 'react'
import { ChevronRight, Save, X, Camera, Send, CheckCircle2, User, Phone, MapPin, ClipboardList, RotateCcw, Search, Trash2, Mail, Map, Plus, ImageIcon } from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider whitespace-nowrap">
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
    className={`w-full px-3 py-1.5 text-[12px] border border-slate-200 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} shadow-sm ${className}`}
    {...props}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative group ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-1.5 pr-8 text-[12px] border border-slate-200 rounded bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer shadow-sm"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center group-hover:text-[#0097A7] transition-colors">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

const TextArea = ({ placeholder, value, onChange, className = "", rows = 4 }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 text-[12px] border border-slate-200 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 resize-none shadow-sm ${className}`}
  />
)

const StepTitle = ({ title, step }) => (
  <div className="flex items-center gap-2 mb-3">
    <h3 className="text-[14px] font-black text-slate-800 tracking-tight">Step {step}</h3>
    <div className="flex-1 h-[1px] bg-slate-100" />
    {title && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>}
  </div>
)

const ActionButton = ({ onClick, children, className = "" }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 bg-[#fff8e1] hover:bg-[#ffecb3] text-[#f57c00] text-[11px] font-bold rounded border border-[#ffe082] transition-all shadow-sm active:scale-95 ${className}`}
  >
    {children}
  </button>
)

export default function CustomerComplaintEntry() {
  const [form, setForm] = useState({
    ccNo: '26-27/CC' + Math.floor(Math.random() * 90000 + 10000),
    date: '15-Apr-2026',
    recDate: '15-Apr-2026',
    customerName: '',
    customerCode: '',
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
    complaintType: 'Fabrication Base',
    serviceType: 'BILL',
    workCompleteDate: '15-Apr-2026',
    complaintClosedDate: '15-Apr-2026',
    natureOfComplaint: '',
    actionThrough: '',
    attenderName: '',
    attenDate: '15-Apr-2026',
    finalDate: '15-Apr-2026',
    actionTaken: '',
    preventiveMeasure: '',
    feedbackSatisfaction: '',
    status: 'Open'
  })

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleStepSave = (step) => {
    alert(`Step ${step} Data Saved Successfully!`)
  }

  return (
    <div className="bg-[#e0f7fa] min-h-screen pb-10">
      <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-red-700 rounded-sm" />
           <h1 className="text-[12px] font-bold text-slate-700">Customer Complaint Entry</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Vehicle Count :</span>
              <span className="text-[11px] font-bold text-slate-700">-</span>
           </div>
           <button onClick={() => window.history.back()} className="bg-rose-500 text-white p-1 rounded hover:bg-rose-600">
             <X size={16} />
           </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Step 1 Section */}
        <div className="bg-[#f0f9ff] border border-sky-100 rounded-lg p-6 shadow-sm">
          <StepTitle step="1" />
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-4 space-y-2">
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>CC No :</Label></div>
                 <div className="col-span-8"><Input value={form.ccNo} readOnly className="!bg-slate-50" /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Customer Name :</Label></div>
                 <div className="col-span-8"><Select options={['Customer A', 'Customer B']} placeholder="" value={form.customerName} onChange={u('customerName')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Customer Code :</Label></div>
                 <div className="col-span-8"><Input value={form.customerCode} onChange={u('customerCode')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Complainant Name :</Label></div>
                 <div className="col-span-8"><Input value={form.complainantName} onChange={u('complainantName')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Model No :</Label></div>
                 <div className="col-span-8"><Select options={['MOD-001', 'MOD-002']} placeholder="" value={form.modelNo} onChange={u('modelNo')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Site Address :</Label></div>
                 <div className="col-span-8"><Input value={form.siteAddress} onChange={u('siteAddress')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Whatapp Location :</Label></div>
                 <div className="col-span-8"><Select options={['Loc A', 'Loc B']} placeholder="" value={form.whatsappLocation} onChange={u('whatsappLocation')} /></div>
               </div>
            </div>

            {/* Middle Column */}
            <div className="col-span-4 space-y-2 border-r border-slate-200 pr-6">
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Date :</Label></div>
                 <div className="col-span-8"><Select options={['15-Apr-2026', '16-Apr-2026']} value={form.date} onChange={u('date')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Complaint Rec.Date :</Label></div>
                 <div className="col-span-8"><Select options={['15-Apr-2026', '16-Apr-2026']} value={form.recDate} onChange={u('recDate')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Opening Complaint :</Label></div>
                 <div className="col-span-8"><Select options={['New', 'Repetitive']} placeholder="" value={form.openingComplaint} onChange={u('openingComplaint')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Serial No :</Label></div>
                 <div className="col-span-8"><Input value={form.serialNo} onChange={u('serialNo')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Designation :</Label></div>
                 <div className="col-span-8"><Input value={form.designation} onChange={u('designation')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Mobile No :</Label></div>
                 <div className="col-span-8"><Input value={form.mobileNo} onChange={u('mobileNo')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Alternate No :</Label></div>
                 <div className="col-span-8"><Input value={form.alternateNo} onChange={u('alternateNo')} /></div>
               </div>
               <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-right"><Label>Email Id :</Label></div>
                 <div className="col-span-8"><Input value={form.emailId} onChange={u('emailId')} /></div>
               </div>
               
               <div className="flex justify-end gap-2 pt-2">
                  <ActionButton onClick={() => handleStepSave(1)}>Step 1 Save</ActionButton>
                  <ActionButton onClick={() => alert('Image Saved')}>Save image 2</ActionButton>
               </div>
            </div>

            {/* Right Status Column */}
            <div className="col-span-4 space-y-4">
               <div className="space-y-1">
                 <h4 className="text-[14px] font-bold text-rose-600">Complaint Status : {form.status}</h4>
                 <div className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-5 text-right"><Label>Service Type :</Label></div>
                    <div className="col-span-7"><Select options={['BILL', 'WARRANTY']} value={form.serviceType} onChange={u('serviceType')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-5 text-right"><Label>Work Complete Date :</Label></div>
                    <div className="col-span-7"><Select options={['15-Apr-2026', '16-Apr-2026']} value={form.workCompleteDate} onChange={u('workCompleteDate')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-5 text-right"><Label>Complaint Closed Date :</Label></div>
                    <div className="col-span-7"><Select options={['15-Apr-2026', '16-Apr-2026']} value={form.complaintClosedDate} onChange={u('complaintClosedDate')} /></div>
                 </div>
               </div>

               <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="w-full h-32 border border-slate-200 bg-white rounded-lg flex flex-col items-center justify-center text-slate-300">
                     <ImageIcon size={40} strokeWidth={1} />
                     <span className="text-[10px] font-bold uppercase mt-2">No Image Uploaded</span>
                  </div>
                  <div className="flex justify-end">
                    <ActionButton className="flex items-center gap-1">
                      <Camera size={14} /> Image
                    </ActionButton>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6">
             <Label>Complaint Type :</Label>
             <div className="flex gap-4">
               {['Fabrication Base', 'Functional Base', 'Minor Leakage', 'Electrical'].map(t => (
                 <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                   <input type="radio" checked={form.complaintType === t} onChange={() => setForm(f => ({...f, complaintType: t}))} className="accent-[#0097A7]" />
                   <span className="text-[11px] font-bold text-slate-700">{t}</span>
                 </label>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
           {/* Step 2 */}
           <div className="col-span-4 bg-[#f0f9ff] border border-sky-100 rounded-lg p-4 shadow-sm">
             <StepTitle step="2" />
             <div className="space-y-4">
               <div className="space-y-1">
                 <Label>Nature of Complaint :</Label>
                 <TextArea value={form.natureOfComplaint} onChange={u('natureOfComplaint')} className="h-24" />
               </div>
               <div className="space-y-1">
                 <Label>Action Through :</Label>
                 <Input value={form.actionThrough} onChange={u('actionThrough')} />
               </div>
               <div className="flex justify-end">
                 <ActionButton onClick={() => handleStepSave(2)}>Step 2 Save</ActionButton>
               </div>
             </div>
           </div>

           {/* Step 3 */}
           <div className="col-span-8 bg-[#f0f9ff] border border-sky-100 rounded-lg p-4 shadow-sm">
             <StepTitle step="3" title="If Site visit" />
             <div className="grid grid-cols-12 gap-4">
               <div className="col-span-8 space-y-4">
                 <div className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-3 text-right"><Label>Attender Name :</Label></div>
                    <div className="col-span-9"><Select options={['Staff A', 'Staff B']} value={form.attenderName} onChange={u('attenderName')} /></div>
                 </div>
                 <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-6 flex items-center gap-2">
                       <Label>Atten Date :</Label>
                       <Select options={['15-Apr-2026']} value={form.attenDate} onChange={u('attenDate')} className="flex-1" />
                    </div>
                    <div className="col-span-6 flex items-center gap-2">
                       <Label>Final Date :</Label>
                       <Select options={['15-Apr-2026']} value={form.finalDate} onChange={u('finalDate')} className="flex-1" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <Label>Action Taken :</Label>
                    <TextArea value={form.actionTaken} onChange={u('actionTaken')} className="h-20" />
                 </div>
               </div>
               <div className="col-span-4 flex flex-col justify-start pt-1">
                  <ActionButton onClick={() => handleStepSave(3)} className="w-fit">Step 3 Save</ActionButton>
               </div>
             </div>
           </div>

           {/* Step 4 */}
           <div className="col-span-4 bg-[#f0f9ff] border border-sky-100 rounded-lg p-4 shadow-sm">
             <StepTitle step="4" />
             <div className="space-y-2">
               <Label>What Measure Built to Avoid Same Complaint</Label>
               <TextArea value={form.preventiveMeasure} onChange={u('preventiveMeasure')} className="h-24" />
               <div className="flex justify-end">
                 <ActionButton onClick={() => handleStepSave(4)}>Step 4 Save</ActionButton>
               </div>
             </div>
           </div>

           {/* Step 5 */}
           <div className="col-span-8 bg-[#f0f9ff] border border-sky-100 rounded-lg p-4 shadow-sm">
             <StepTitle step="5" />
             <div className="space-y-2">
               <div className="flex items-center gap-4">
                  <Label>Customer Feed Back Satification</Label>
                  <ActionButton onClick={() => handleStepSave(5)}>Step 5 Save</ActionButton>
                  <ActionButton className="!bg-[#e8f5e9] !text-[#2e7d32] !border-[#a5d6a7]">Request for Approval</ActionButton>
               </div>
               <TextArea value={form.feedbackSatisfaction} onChange={u('feedbackSatisfaction')} className="h-24" />
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
