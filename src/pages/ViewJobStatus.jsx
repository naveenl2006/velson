import { useState, useEffect, Fragment } from 'react'
import { ChevronRight, ChevronDown, Search, X, FileSpreadsheet, CheckCircle2, Eye, Image as ImageIcon, Save, Lock } from 'lucide-react'
import { useToast } from '../components/Toast'
import api from '../services/api'

const Input = ({ placeholder, value, onChange, type = 'text', className = "" }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    className={`px-3 py-[6px] text-[12px] border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`} />
)
const Select = ({ options, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select value={value} onChange={onChange}
      className="w-full px-3 py-[6px] pr-7 text-[12px] border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 cursor-pointer font-semibold">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
)

const STAGES = ['All', 'In Process', 'Waiting for Process', 'Close', 'Cancel']

const formatPDDate = (dtStr) => {
  if (!dtStr) return '—'
  try {
    const d = new Date(dtStr)
    if (isNaN(d.getTime())) return dtStr
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = String(d.getDate()).padStart(2, '0')
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    let hours = d.getHours()
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const strTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
    return `${day}- ${month} -${year} ${strTime}`
  } catch {
    return dtStr
  }
}

const getCompletedPct = (productName, lineItems, procMasters) => {
  const processes = procMasters.filter(pm => pm.PM_Part_Name === productName)
  if (processes.length === 0) return 0
  let completedCount = 0
  processes.forEach(pm => {
    const savedLi = lineItems.find(li => li.processName === pm.PM_Process_Name)
    if (savedLi && (savedLi.state === 'OUT' || savedLi.state === 'QC' || savedLi.notApplicable)) {
      completedCount++
    }
  })
  return (completedCount / processes.length) * 100
}

const getPartStage = (productName, lineItems, procMasters) => {
  const processes = procMasters.filter(pm => pm.PM_Part_Name === productName)
  if (processes.length === 0) return 'Waiting'

  let started = false
  let allDone = true

  processes.forEach(pm => {
    const savedLi = lineItems.find(li => li.processName === pm.PM_Process_Name)
    if (savedLi) {
      if (savedLi.state || savedLi.notApplicable) {
        started = true
      }
      if (!(savedLi.state === 'OUT' || savedLi.state === 'QC' || savedLi.notApplicable)) {
        allDone = false
      }
    } else {
      allDone = false
    }
  })

  if (allDone) return 'Completed'
  if (started) return 'In Process'
  return 'Waiting'
}

export default function ViewJobStatus() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [processStage, setProcessStage] = useState('All')
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    const offsetMs = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offsetMs).toISOString().split('T')[0]
  })
  const [toDate, setToDate] = useState(() => {
    const d = new Date()
    const offsetMs = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offsetMs).toISOString().split('T')[0]
  })
  const [jobs, setJobs] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processMasters, setProcessMasters] = useState([])
  const [expandedRow, setExpandedRow] = useState(null)
  const [itemMasterList, setItemMasterList] = useState([])
  const [zoomImage, setZoomImage] = useState(null)
  const [isUnlockedModal, setIsUnlockedModal] = useState(true)

  const fetchJobs = async (procList = processMasters) => {
    try {
      const res = await api.get('/api/job-card')
      const dbJobs = res.data?.data || []

      const groupedJobs = []
      dbJobs.forEach(jc => {
        const partsList = []
        const partMap = {}
        if (jc.lineItems && jc.lineItems.length > 0) {
          jc.lineItems.forEach(li => {
            const key = li.partName || '';
            if (!partMap[key]) {
              partMap[key] = []
            }
            partMap[key].push(li)
          })

          Object.entries(partMap).forEach(([partName, items]) => {
            const firstItem = items[0]
            const completedPct = getCompletedPct(partName, items, procList)
            const stage = getPartStage(partName, items, procList)

            partsList.push({
              partNo: firstItem.partNo || '',
              productName: partName,
              completedPct,
              qty: firstItem.planQty || 0,
              stage,
              lineItems: items
            })
          })
        }

        let totalCompletedPct = 0
        let jobStage = 'Waiting'
        let totalQty = 0
        let partsCSV = ''
        let productNamesCSV = ''

        if (partsList.length > 0) {
          const totalPctSum = partsList.reduce((sum, p) => sum + p.completedPct, 0)
          totalCompletedPct = totalPctSum / partsList.length
          totalQty = partsList.reduce((sum, p) => sum + p.qty, 0)
          partsCSV = partsList.map(p => p.partNo).filter(Boolean).join(', ')
          productNamesCSV = partsList.map(p => p.productName).filter(Boolean).join(', ')

          const stages = partsList.map(p => p.stage)
          if (stages.every(s => s === 'Completed')) {
            jobStage = 'Completed'
          } else if (stages.some(s => s === 'In Process' || s === 'Completed')) {
            jobStage = 'In Process'
          } else if (stages.some(s => s === 'Cancelled')) {
            jobStage = 'Cancelled'
          } else {
            jobStage = 'Waiting'
          }
        }

        groupedJobs.push({
          id: jc.id,
          jobCardId: jc.id,
          jobNo: jc.jobNo || '',
          vehicleType: jc.model || '',
          partNo: partsCSV,
          productName: productNamesCSV,
          completedPct: totalCompletedPct,
          qty: totalQty,
          planDate: jc.currentDate || '',
          requiredDate: jc.requiredDate || '',
          priority: jc.priority || '',
          technicalApprovalDate: '',
          approvalPerson: '',
          stage: jobStage,
          partImage: jc.partImage || null,
          partsList
        })
      })
      setJobs(groupedJobs)
    } catch (err) {
      console.error('Error fetching job cards:', err)
      toast.error('Failed to fetch jobs from server.')
    }
  }

  const [employees, setEmployees] = useState([])
  const [machines, setMachines] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [empRes, machRes, procRes, itemsRes] = await Promise.all([
          api.get('/api/employee-master').catch(() => ({ data: { data: [] } })),
          api.get('/api/machine-master').catch(() => ({ data: { data: [] } })),
          api.get('/api/process-master').catch(() => ({ data: { data: [] } })),
          api.get('/api/item-master?limit=10000').catch(() => ({ data: { data: [] } }))
        ])
        setEmployees(empRes.data?.data || [])
        setMachines(machRes.data?.data || [])
        const procList = procRes.data?.data || []
        setProcessMasters(procList)
        setItemMasterList(itemsRes.data?.data || [])
        await fetchJobs(procList)
      } catch (err) {
        console.error('Error loading master data in ViewJobStatus:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = jobs.filter(j => {
    const productNameLower = (j.productName || '').toLowerCase()
    const partNoLower = (j.partNo || '').toLowerCase()
    const matchSearch = !search || productNameLower.includes(search.toLowerCase()) || partNoLower.includes(search.toLowerCase()) || String(j.jobNo).includes(search)
    const matchStage = processStage === 'All' || (processStage === 'In Process' && j.stage === 'In Process') || (processStage === 'Waiting for Process' && j.stage === 'Waiting') || (processStage === 'Close' && j.stage === 'Completed') || (processStage === 'Cancel' && j.stage === 'Cancelled')
    const matchCompleted = !showCompleted || j.completedPct >= 100
    const matchDate = (!fromDate || j.planDate >= fromDate) && (!toDate || j.planDate <= toDate)
    return matchSearch && matchStage && matchCompleted && matchDate
  })

  const selectedJob = jobs.find(j => j.id === selectedRow)

  const getPartImage = () => {
    if (!selectedJob) return null
    const firstPart = selectedJob.partsList && selectedJob.partsList[0]
    const pNo = firstPart ? firstPart.partNo : selectedJob.partNo
    const pName = firstPart ? firstPart.productName : selectedJob.productName
    const item = itemMasterList.find(it => it.partNo === pNo || it.partName === pName)
    if (item) {
      const hasImg = item.hasImage || !!item.imageMimeType
      if (hasImg) {
        return `/api/item-master/${item.id}/download-image`
      } else if (item.imagePath) {
        return item.imagePath.startsWith('http') || item.imagePath.startsWith('/') ? item.imagePath : `/uploads/${item.imagePath}`
      }
    }
    return selectedJob.partImage || null
  }

  const partImage = getPartImage()

  const [showPopup, setShowPopup] = useState(false)
  const [popupForm, setPopupForm] = useState({
    lineItemId: null,
    jobCardId: null,
    partNo: '',
    partName: '',
    processName: '',
    processDate: '',
    state: 'IN',
    empName: 'admin',
    machineName: '',
    workCenterNo: '',
    remarks: '',
    notApplicable: false
  })

  const handleOpenPDProcessModal = (jobRow, processMaster, partDetail) => {
    const partName = partDetail ? partDetail.productName : jobRow.productName
    const partNo = partDetail ? partDetail.partNo : jobRow.partNo
    const lineItems = partDetail ? partDetail.lineItems : jobRow.lineItems || []

    const partProcesses = processMasters
      .filter(pm => pm.PM_Part_Name === partName)
      .sort((a, b) => (Number(a.PM_Process_Order) || 0) - (Number(b.PM_Process_Order) || 0))

    const pIdx = partProcesses.findIndex(pm => pm.id === processMaster.id)

    let isUnlocked = true
    for (let k = 0; k < pIdx; k++) {
      const precedingPm = partProcesses[k]
      const precedingSavedLi = lineItems.find(li => li.processName === precedingPm.PM_Process_Name)
      if (!precedingSavedLi || !(precedingSavedLi.state === 'OUT' || precedingSavedLi.state === 'QC' || precedingSavedLi.notApplicable)) {
        isUnlocked = false
        break
      }
    }

    setIsUnlockedModal(isUnlocked)

    const savedLi = lineItems.find(li => li.processName === processMaster.PM_Process_Name)
    setSelectedRow(jobRow.id)
    setPopupForm({
      lineItemId: savedLi ? savedLi.id : null,
      jobCardId: jobRow.jobCardId,
      partNo: partNo,
      partName: partName,
      processName: processMaster.PM_Process_Name,
      processDate: savedLi?.processDate || (() => {
        const now = new Date();
        const offsetMs = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
      })(),
      state: savedLi?.state === 'IN' ? 'OUT' : (savedLi?.state || 'IN'),
      empName: savedLi?.empName || 'admin',
      machineName: savedLi?.machineName || processMaster.Machine_Name || '',
      workCenterNo: savedLi?.workCenterNo || processMaster.Machine_Code || '',
      remarks: savedLi?.remarks || '',
      notApplicable: savedLi?.notApplicable || false
    })
    setShowPopup(true)
  }

  const handleSavePopup = async () => {
    try {
      const res = await api.put(`/api/job-card/line-item/process`, {
        jobCardId: popupForm.jobCardId,
        partNo: popupForm.partNo,
        partName: popupForm.partName,
        processName: popupForm.processName,
        processDate: popupForm.processDate,
        state: popupForm.state,
        empName: popupForm.empName,
        machineName: popupForm.machineName,
        workCenterNo: popupForm.workCenterNo,
        remarks: popupForm.remarks,
        notApplicable: popupForm.notApplicable
      })

      if (res.data?.success) {
        toast.success('Production Details Saved Successfully!')
        setShowPopup(false)
        await fetchJobs()
      } else {
        toast.error(res.data?.message || 'Failed to save production details.')
      }
    } catch (err) {
      console.error('Error saving production details in popup:', err)
      toast.error('Error saving production details: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleSearch = () => toast.info(`Showing ${filtered.length} results.`)
  const handleExcel = () => toast.info(`Exporting ${filtered.length} records to Excel...`)

  const stageColor = (s) => {
    if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
    if (s === 'In Process') return 'bg-sky-100 text-sky-700'
    if (s === 'Waiting') return 'bg-amber-100 text-amber-700'
    if (s === 'Cancelled') return 'bg-red-100 text-red-600'
    return 'bg-slate-100 text-slate-500'
  }

  const priColor = (p) => {
    if (p === 'P0') return 'text-red-600 font-black'
    if (p === 'P1') return 'text-orange-600 font-bold'
    if (p === 'P2') return 'text-amber-600 font-bold'
    return 'text-slate-500'
  }

  const pctColor = (v) => {
    if (v >= 100) return 'text-emerald-600 font-black'
    if (v >= 50) return 'text-sky-600 font-bold'
    if (v > 0) return 'text-amber-600 font-bold'
    return 'text-slate-400'
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-6">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-bold tracking-tight">
          <span>Technical</span><ChevronRight size={12} /><span className="text-[#0097A7]">View Job Status</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Job List</h2>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 ml-1">{filtered.length} records</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#0097A7]/5 text-[#0097A7] text-[11px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm">
                <Eye size={13} /> Job Process Details
              </button>
              <button onClick={handleExcel} className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-slate-200 transition-all shadow-sm">
                <FileSpreadsheet size={13} /> Excel
              </button>
              <button className="text-slate-400 hover:text-red-600 transition-colors ml-1"><X size={20} strokeWidth={2.5} /></button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* ── Toolbar Layout: Inputs stacked on left, large image preview on right ── */}
            <div className="flex justify-between items-start gap-6 flex-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {/* Left Column: Search & Filter Stack */}
              <div className="space-y-4 flex-1 min-w-[300px]">
                {/* Row 1: Search & Process Stage */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Search :</span>
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job No / Part No / Product Name..." className="w-56" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">Process Stage :</span>
                    <Select options={STAGES} value={processStage} onChange={e => setProcessStage(e.target.value)} className="w-44" />
                  </div>
                </div>

                {/* Row 2: Date Range & Buttons */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">From Date :</span>
                    <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-36" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase whitespace-nowrap">To Date :</span>
                    <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-36" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleSearch} className="flex items-center gap-1.5 px-4 py-[6px] bg-[#0097A7] hover:bg-[#007a87] text-white text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95">
                      <Search size={13} /> Search
                    </button>
                    <button
                      onClick={() => setShowCompleted(!showCompleted)}
                      className={`flex items-center gap-1.5 px-4 py-[6px] text-[11px] font-bold rounded-lg transition-all shadow-sm active:scale-95 border ${showCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <CheckCircle2 size={13} /> Completed Job
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Part Image Preview */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-80 h-56 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                  {partImage ? (
                    <img
                      src={partImage}
                      alt="Part"
                      onClick={() => setZoomImage(partImage)}
                      className="w-full h-full object-contain p-1 cursor-zoom-in hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-300">
                      <ImageIcon size={44} strokeWidth={1.2} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">No Image</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Part Image</span>
              </div>
            </div>

            {/* ── Data Table ── */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[1500px]">
                  <thead className="bg-[#d32f2f] text-[10px] uppercase text-white font-bold sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2.5 border-r border-red-400 w-8 text-center bg-[#d32f2f]"></th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-16">Job No</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28">Vehicle Type</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28">Part No</th>
                      <th className="px-3 py-2.5 border-r border-red-400">Product Name</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24 text-center">Completed %</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-16 text-center">Priority</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-12 text-center">Qty</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24 text-center">Plan Date</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24 text-center">Required Date</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-28 text-center">Tech. Approval Date</th>
                      <th className="px-3 py-2.5 border-r border-red-400 w-24">Approval ID</th>
                      <th className="px-3 py-2.5 w-24 text-center">Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={13} className="py-20 text-center text-slate-400">
                          <p className="text-[12px] font-bold uppercase tracking-widest animate-pulse">Loading jobs...</p>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-20 text-center text-slate-300">
                          <Search size={40} strokeWidth={1} className="mx-auto mb-2 opacity-30" />
                          <p className="text-[12px] font-bold uppercase tracking-widest">No jobs found</p>
                          <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((j, i) => {
                        const isExpanded = expandedRow === j.id
                        return (
                          <Fragment key={j.id}>
                            <tr
                              onClick={() => setSelectedRow(j.id)}
                              className={`h-8 transition-colors cursor-pointer text-[12px] ${selectedRow === j.id ? 'bg-[#1565C0] text-white' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}`}
                            >
                              <td
                                className="px-2 py-1 border-r border-slate-100 text-center"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setExpandedRow(isExpanded ? null : j.id)
                                }}
                              >
                                <button className="p-0.5 rounded hover:bg-slate-200/20 text-slate-400 hover:text-white transition-all flex items-center justify-center mx-auto">
                                  {isExpanded ? (
                                    <ChevronDown size={14} className={selectedRow === j.id ? "text-white" : "text-[#0097A7]"} />
                                  ) : (
                                    <ChevronRight size={14} className={selectedRow === j.id ? "text-white" : "text-slate-400"} />
                                  )}
                                </button>
                              </td>
                              <td className={`px-3 py-1 border-r border-slate-100 font-bold ${selectedRow === j.id ? '' : 'text-slate-700'}`}>{j.jobNo}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 font-semibold ${selectedRow === j.id ? '' : 'text-slate-600'}`}>{j.vehicleType}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 font-mono text-[11px] ${selectedRow === j.id ? '' : 'text-[#0097A7]'}`}>{j.partNo}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 font-bold truncate max-w-[250px] ${selectedRow === j.id ? '' : 'text-slate-700'}`}>
                                {j.productName || '—'}
                              </td>
                              <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : pctColor(j.completedPct)}`}>{j.completedPct.toFixed(2)}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? 'font-bold' : priColor(j.priority)}`}>{j.priority || '-'}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 text-center font-bold ${selectedRow === j.id ? '' : 'text-slate-600'}`}>{j.qty}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : 'text-slate-500'}`}>{j.planDate}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : 'text-slate-500'}`}>{j.requiredDate}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 text-center ${selectedRow === j.id ? '' : 'text-slate-400 text-[11px]'}`}>{j.technicalApprovalDate}</td>
                              <td className={`px-3 py-1 border-r border-slate-100 ${selectedRow === j.id ? '' : 'text-slate-600 font-semibold'}`}>{j.approvalPerson}</td>
                              <td className="px-3 py-1 text-center">
                                {selectedRow === j.id ? (
                                  <span className="text-[10px] font-bold uppercase">{j.stage}</span>
                                ) : (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${stageColor(j.stage)}`}>{j.stage}</span>
                                )}
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-slate-50/50">
                                <td colSpan={13} className="px-6 py-4">
                                  <div className="space-y-6">
                                    {(j.partsList || []).map((partDetail, pdIdx) => (
                                      <div key={pdIdx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-x-auto max-w-full">
                                        <h4 className="text-[11px] font-black text-[#0097A7] uppercase tracking-widest mb-3 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                                          <span>Processes for: {partDetail.productName} ({partDetail.partNo})</span>
                                          <span className="bg-[#0097A7]/10 text-[#0097A7] px-2 py-0.5 rounded text-[10px] font-bold">Qty: {partDetail.qty}</span>
                                        </h4>
                                        <table className="min-w-full text-[12px] border-collapse text-left">
                                          <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                              <th className="px-3 py-2 border-r border-slate-200 text-center w-12 bg-slate-50">S.No</th>
                                              <th className="px-3 py-2 border-r border-slate-200 bg-slate-50">Process Name</th>
                                              <th className="px-3 py-2 border-r border-slate-200 text-center w-20 bg-slate-50">State</th>
                                              <th className="px-3 py-2 border-r border-slate-200 bg-slate-50">Employee Name</th>
                                              <th className="px-3 py-2 border-r border-slate-200 bg-slate-50">Machine Name</th>
                                              <th className="px-3 py-2 border-r border-slate-200 text-center bg-slate-50">Process Date</th>
                                              <th className="px-3 py-2 bg-slate-50">Remarks</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                            {(() => {
                                              const partProcesses = processMasters
                                                .filter(pm => pm.PM_Part_Name === partDetail.productName)
                                                .sort((a, b) => (Number(a.PM_Process_Order) || 0) - (Number(b.PM_Process_Order) || 0))

                                              return partProcesses.map((pm, pIdx) => {
                                                const savedLi = partDetail.lineItems.find(li => li.processName === pm.PM_Process_Name)
                                                return (
                                                  <tr key={pm.id} className="hover:bg-[#0097A7]/5 transition-colors">
                                                    <td className="px-3 py-2 text-center border-r border-slate-100 text-slate-400 font-medium">
                                                      {pIdx + 1}
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-slate-100 font-bold">
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          handleOpenPDProcessModal(j, pm, partDetail)
                                                        }}
                                                        className="text-[#0097A7] hover:text-[#007a87] hover:underline font-bold text-left flex items-center gap-1.5"
                                                      >
                                                        {pm.PM_Process_Name}
                                                      </button>
                                                    </td>
                                                    <td className="px-3 py-2 text-center border-r border-slate-100 text-[11px]">
                                                      {savedLi?.notApplicable ? (
                                                        <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">N/A</span>
                                                      ) : savedLi?.state ? (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${savedLi.state === 'IN' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                                            savedLi.state === 'OUT' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                                              savedLi.state === 'QC' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                                                'bg-rose-50 text-rose-600 border border-rose-200'
                                                          }`}>{savedLi.state}</span>
                                                      ) : (
                                                        <span className="text-slate-300">—</span>
                                                      )}
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-slate-100 text-slate-600 font-semibold">
                                                      {savedLi?.empName || '—'}
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-slate-100 text-slate-600">
                                                      {savedLi?.machineName || pm.Machine_Name || '—'}
                                                    </td>
                                                    <td className="px-3 py-2 border-r border-slate-100 text-center text-slate-500 font-medium">
                                                      {savedLi?.processDate ? formatPDDate(savedLi.processDate) : '—'}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-500 truncate max-w-[200px]" title={savedLi?.remarks || ''}>
                                                      {savedLi?.remarks || '—'}
                                                    </td>
                                                  </tr>
                                                )
                                              })
                                            })()}
                                            {processMasters.filter(pm => pm.PM_Part_Name === partDetail.productName).length === 0 && (
                                              <tr>
                                                <td colSpan={7} className="text-center py-6 text-slate-400 italic">
                                                  No processes defined in Process Master for this part.
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    ))}
                                    {(!j.partsList || j.partsList.length === 0) && (
                                      <div className="text-center py-6 text-slate-400 italic">
                                        No line items/parts in this job card.
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {filtered.length} records · Stage: {processStage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0097A7] rounded-sm" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Production Details - {popupForm.processName} ({popupForm.partName})
                </h3>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="flex items-center gap-1.5 px-3 py-1 hover:text-red-500 text-[11px] font-bold rounded-lg transition-all shadow-sm"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4">
              {/* Feature 2 lock warning message */}
              {!isUnlockedModal && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg text-[12px] font-bold flex items-center gap-2 animate-pulse">
                  <Lock size={15} className="text-rose-500 shrink-0" />
                  <span>The previous process is not completed yet.</span>
                </div>
              )}

              {/* Process Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Process Date :</label>
                <input
                  type="datetime-local"
                  value={popupForm.processDate}
                  onChange={e => setPopupForm(prev => ({ ...prev, processDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all"
                />
              </div>

              {/* State Radios */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">State :</label>
                <div className="flex items-center gap-4">
                  {['IN', 'OUT', 'QC', 'Erase'].map(st => (
                    <label key={st} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="state"
                        value={st}
                        checked={popupForm.state === st}
                        onChange={e => setPopupForm(prev => ({ ...prev, state: e.target.value }))}
                        disabled={!isUnlockedModal}
                        className="w-4 h-4 text-[#0097A7] focus:ring-[#0097A7] disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                      <span className={`text-sm font-bold uppercase ${popupForm.state === st ? 'text-[#0097A7]' : 'text-slate-500 group-hover:text-slate-700'} ${!isUnlockedModal ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        {st}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employee Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Employee Name :</label>
                <input
                  type="text"
                  value={popupForm.empName}
                  onChange={e => setPopupForm(prev => ({ ...prev, empName: e.target.value }))}
                  placeholder="Enter employee name..."
                  list="popup-employees-list"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all"
                />
                <datalist id="popup-employees-list">
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.empName}>{emp.empName} ({emp.empCode})</option>
                  ))}
                </datalist>
              </div>

              {/* Machine Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Machine Name :</label>
                <div className="relative">
                  <select
                    value={popupForm.machineName}
                    onChange={e => {
                      const val = e.target.value
                      const m = machines.find(mac => mac.machineName === val)
                      setPopupForm(prev => ({
                        ...prev,
                        machineName: val,
                        workCenterNo: m ? m.machineCode : prev.workCenterNo
                      }))
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all cursor-pointer font-medium"
                  >
                    <option value="">-- Select Machine --</option>
                    {machines.map(m => (
                      <option key={m.id} value={m.machineName}>
                        {m.machineName}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Work Center No */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Work Center.No :</label>
                <input
                  type="text"
                  value={popupForm.workCenterNo}
                  onChange={e => setPopupForm(prev => ({ ...prev, workCenterNo: e.target.value }))}
                  placeholder="Enter work center number..."
                  list="popup-workcenters-list"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all"
                />
                <datalist id="popup-workcenters-list">
                  {machines.map(m => (
                    <option key={m.id} value={m.machineCode}>{m.machineCode} - {m.machineName}</option>
                  ))}
                </datalist>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Remarks :</label>
                <textarea
                  rows={3}
                  value={popupForm.remarks}
                  onChange={e => setPopupForm(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Enter remarks..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all resize-none"
                />
              </div>

              {/* Not Applicable */}
              {/* <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popupForm.notApplicable}
                    onChange={e => setPopupForm(prev => ({ ...prev, notApplicable: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#0097A7] focus:ring-[#0097A7] border-slate-300"
                  />
                  <span className="text-xs font-semibold uppercase text-slate-600 tracking-wider">Not Applicable</span>
                </label>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleSavePopup}
                className="px-5 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-bold rounded-lg transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Save size={14} /> Save
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg border border-slate-200 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Lightbox */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
