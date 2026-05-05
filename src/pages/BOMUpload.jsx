import { useState, useEffect } from 'react'
import { ChevronRight, Upload, Download, X, Plus, Image as ImageIcon, FileText, Search, RotateCcw } from 'lucide-react'

// ── Shared UI primitives ──
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider">
    {required && <span className="text-red-500 mr-0.5">*</span>}
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', readOnly = false, className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    className={`w-full px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 ${readOnly ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-300'} ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-[7px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

export default function BOMUpload() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    bomNo: 'BOM-' + Math.floor(Math.random() * 9000 + 1000),
    customerName: '',
    customerCode: '',
    vehicleCount: '',
    serialJobNo: '',
    vehicleSerialNo: '',
    model: '',
    fileLocation: '',
    fileName: '',
    groupName: '',
    assemblyPartNo: ''
  })

  const [uploadedRecords, setUploadedRecords] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const u = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleUpload = () => {
    if (!form.customerName || !form.fileName) {
      alert('Please fill required fields (Customer, File Name).')
      return
    }
    setIsUploading(true)
    setTimeout(() => {
      const newRecord = { ...form, id: Date.now() }
      const existing = JSON.parse(localStorage.getItem('velson_bom_uploads') || '[]')
      const updated = [newRecord, ...existing]
      localStorage.setItem('velson_bom_uploads', JSON.stringify(updated))
      setUploadedRecords(updated)
      setIsUploading(false)
      alert('BOM Uploaded Successfully!')
    }, 1000)
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('velson_bom_uploads') || '[]')
    setUploadedRecords(saved)
  }, [])

  const handleClear = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      bomNo: 'BOM-' + Math.floor(Math.random() * 9000 + 1000),
      customerName: '',
      customerCode: '',
      vehicleCount: '',
      serialJobNo: '',
      vehicleSerialNo: '',
      model: '',
      fileLocation: '',
      fileName: '',
      groupName: '',
      assemblyPartNo: ''
    })
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Dashboard</span> <ChevronRight size={12} /> <span>BOM</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">BOM Upload</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">BOM Upload Interface</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={() => window.history.back()} className="text-slate-400 hover:text-red-600 transition-colors ml-2">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-12 gap-10">
              {/* Left Column: BOM Details */}
              <div className="col-span-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label required>Entry Date</Label>
                    <Input type="date" value={form.date} onChange={u('date')} />
                  </div>
                  <div>
                    <Label>BOM Reference No</Label>
                    <Input value={form.bomNo} readOnly placeholder="Auto-generated" className="!font-bold text-[#0097A7]" />
                  </div>
                </div>

                <div>
                  <Label required>Customer</Label>
                  <Select options={['Customer A', 'Customer B', 'Customer C']} value={form.customerName} onChange={u('customerName')} placeholder="Search Customer..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Code</Label>
                    <Input value={form.customerCode} onChange={u('customerCode')} placeholder="e.g. CUST-001" />
                  </div>
                  <div>
                    <Label>Vehicle Count</Label>
                    <Input value={form.vehicleCount} onChange={u('vehicleCount')} type="number" placeholder="0" />
                  </div>
                </div>

                <div>
                  <Label required>Serial Job No</Label>
                  <Select options={['JOB-001', 'JOB-002', 'JOB-003']} value={form.serialJobNo} onChange={u('serialJobNo')} placeholder="Select Serial Job No" />
                </div>

                <div>
                  <Label>Vehicle Serial No</Label>
                  <Input value={form.vehicleSerialNo} onChange={u('vehicleSerialNo')} placeholder="Enter Serial No..." />
                </div>

                <div>
                  <Label>Model</Label>
                  <Select options={['Model X', 'Model Y', 'Model Z']} value={form.model} onChange={u('model')} placeholder="Select Model..." />
                </div>
              </div>

              {/* Middle Column: File Upload */}
              <div className="col-span-4 space-y-4 border-l border-slate-100 pl-10">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed">
                  <div className="space-y-4">
                    <div>
                      <Label>File System Path</Label>
                      <Input value={form.fileLocation} onChange={u('fileLocation')} placeholder="C:\Documents\BOM..." />
                    </div>
                    <div>
                      <Label required>BOM Excel File</Label>
                      <Select options={['BOM_V1.xlsx', 'BOM_V2.xlsx', 'BOM_Final.xlsx']} value={form.fileName} onChange={u('fileName')} placeholder="Pick Excel File" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Material Group</Label>
                  <Select options={['Group 1', 'Group 2']} value={form.groupName} onChange={u('groupName')} placeholder="Pick Group" />
                </div>
                <div>
                  <Label>Assembly Part No</Label>
                  <Select options={['ASSY-001', 'ASSY-002']} value={form.assemblyPartNo} onChange={u('assemblyPartNo')} placeholder="Pick Assembly Part" />
                </div>

                <div className="flex gap-3 pt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[13px] font-bold rounded-lg transition-all shadow-sm active:scale-95">
                    <Search size={18} className="text-[#0097A7]" /> Browse
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isUploading ? <RotateCcw size={18} className="animate-spin" /> : <Upload size={18} />}
                    {isUploading ? 'Uploading...' : 'Process BOM'}
                  </button>
                </div>
              </div>

              {/* Right Column: Image Preview */}
              <div className="col-span-3 space-y-3">
                <Label>Model Visualization</Label>
                <div className="aspect-square w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 group hover:border-[#0097A7] hover:bg-[#0097A7]/5 transition-all cursor-pointer overflow-hidden">
                  <ImageIcon size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform group-hover:text-[#0097A7]" />
                  <p className="text-[10px] font-black mt-3 uppercase tracking-widest text-slate-400 group-hover:text-[#0097A7]">No Preview Available</p>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="mt-12">
               <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-3">
                   <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-[#0097A7] pl-3">Recent Uploads</h3>
                   <span className="bg-[#0097A7]/10 text-[#0097A7] px-2 py-0.5 rounded text-[10px] font-bold">{uploadedRecords.length} Items</span>
                 </div>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-[#0097A7] text-[11px] font-bold uppercase transition-colors">
                      <Download size={15} /> Sample Template
                    </button>
                 </div>
               </div>
               <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-[#fcfdfe] text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200">
                     <tr>
                       <th className="px-5 py-4 border-r border-slate-200 w-16 text-center">S.No</th>
                       <th className="px-5 py-4 border-r border-slate-200">Customer</th>
                       <th className="px-5 py-4 border-r border-slate-200">BOM No</th>
                       <th className="px-5 py-4 border-r border-slate-200">Model</th>
                       <th className="px-5 py-4 border-r border-slate-200">File Name</th>
                       <th className="px-5 py-4 text-center">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {uploadedRecords.length === 0 ? (
                       <tr>
                         <td colSpan={6} className="py-20 text-center text-slate-300 italic text-sm">
                            <FileText size={40} className="mx-auto mb-2 opacity-20" />
                            No BOM records processed yet.
                         </td>
                       </tr>
                     ) : (
                       uploadedRecords.map((row, idx) => (
                         <tr key={row.id} className="hover:bg-slate-50 transition-colors h-14">
                           <td className="px-5 py-2 border-r border-slate-200 text-center text-slate-400 font-bold">{idx + 1}</td>
                           <td className="px-5 py-2 border-r border-slate-200 font-black text-slate-700">{row.customerName}</td>
                           <td className="px-5 py-2 border-r border-slate-200 font-bold text-[#0097A7]">{row.bomNo}</td>
                           <td className="px-5 py-2 border-r border-slate-200">{row.model}</td>
                           <td className="px-5 py-2 border-r border-slate-200 text-[12px] text-slate-500">{row.fileName}</td>
                           <td className="px-5 py-2 text-center">
                             <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Uploaded</span>
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
