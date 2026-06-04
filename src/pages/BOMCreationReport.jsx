import { useState, useEffect } from 'react'
import {
  ChevronRight, Search, Printer, X, Trash2, Download,
  FileSpreadsheet, FileJson, Filter, Settings, Image as ImageIcon, RotateCcw, List, FileText
} from 'lucide-react'
import api from '../services/api'
import { jsPDF } from 'jspdf'
import ExcelJS from 'exceljs'

// ── Shared UI primitives ──
const Label = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wider whitespace-nowrap">
    {children}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text', className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-3 py-[7px] text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${className}`}
  />
)

const Select = ({ options, placeholder, value, onChange, className = "", disabled = false }) => (
  <div className={`relative ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-[7px] pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0097A7]/25 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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

export default function BOMCreationReport() {
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [customer, setCustomer] = useState('')
  const [serialNo, setSerialNo] = useState('')
  const [assemblyPartNo, setAssemblyPartNo] = useState('')
  const [isAll, setIsAll] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searching, setSearching] = useState(false)
  const fetchBoms = async () => {
    try {
      const res = await api.get('/api/bom-creation')
      const boms = res.data?.data || []
      setData(boms)
      setFilteredData(boms)
    } catch (err) {
      console.error('Error fetching BOMs', err)
    }
  }

  useEffect(() => {
    fetchBoms()
  }, [])

  // Reactive filtering at runtime
  useEffect(() => {
    const start = new Date(fromDate)
    start.setHours(0,0,0,0)
    const end = new Date(toDate)
    end.setHours(23,59,59,999)

    const result = data.filter(r => {
      const d = new Date(r.date)
      const dateMatch = d >= start && d <= end
      const custMatch = customer ? r.customerName === customer : true
      const serialMatch = serialNo ? (r.serialJobNo === serialNo || r.serviceJobNo === serialNo) : true
      const assemblyMatch = isAll ? true : (assemblyPartNo ? r.assemblyPartNo === assemblyPartNo : true)
      return dateMatch && custMatch && serialMatch && assemblyMatch
    })
    setFilteredData(result)
  }, [data, fromDate, toDate, customer, serialNo, assemblyPartNo, isAll])

  const handleSearch = () => {
    setSearching(true)
    fetchBoms().finally(() => {
      setTimeout(() => {
        setSearching(false)
      }, 400)
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this BOM Creation record?')) {
      try {
        await api.delete(`/api/bom-creation/${id}`)
        const next = data.filter(r => r.id !== id)
        setData(next)
        setFilteredData(filteredData.filter(r => r.id !== id))
      } catch (err) {
        console.error('Error deleting record', err)
        alert('Error deleting record from database.')
      }
    }
  }

  const handleDeleteAllFiltered = async () => {
    if (filteredData.length === 0) {
      alert('No records selected in current filter.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete all ${filteredData.length} records matching the current filters?`)) {
      try {
        await Promise.all(filteredData.map(r => api.delete(`/api/bom-creation/${r.id}`)));
        fetchBoms();
      } catch (err) {
        console.error('Error during bulk deletion', err);
        alert('Error deleting some records. Reloading list.');
        fetchBoms();
      }
    }
  }

  // --- Export Actions ---

  const handleExportExcel = async () => {
    if (filteredData.length === 0) {
      alert('No data available to export.')
      return
    }
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('BOM Creations')

      worksheet.columns = [
        { header: 'S.No', key: 'sno', width: 8 },
        { header: 'BOM No', key: 'bomNo', width: 15 },
        { header: 'Customer Name', key: 'customerName', width: 30 },
        { header: 'Customer Code', key: 'customerCode', width: 15 },
        { header: 'Service Job No', key: 'serviceJobNo', width: 25 },
        { header: 'Assembly Part Name', key: 'assemblyPartNo', width: 25 },
        { header: 'Model Name', key: 'model', width: 20 },
        { header: 'Created Date', key: 'date', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
      ]

      filteredData.forEach((row, idx) => {
        worksheet.addRow({
          sno: idx + 1,
          bomNo: row.bomNo,
          customerName: row.customerName,
          customerCode: row.customerCode || 'N/A',
          serviceJobNo: row.serialJobNo || row.serviceJobNo || 'N/A',
          assemblyPartNo: row.assemblyPartNo || 'N/A',
          model: row.model || 'N/A',
          date: row.date ? row.date.split('T')[0] : 'N/A',
          status: row.status || 'Created',
        })
      })

      worksheet.getRow(1).font = { bold: true }

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `bom_creation_report_${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
    } catch (err) {
      console.error(err)
      alert('Error exporting to Excel')
    }
  }

  const handleExportDoc = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.')
      return
    }

    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>BOM Creation Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #0097A7; color: white; padding: 8px; border: 1px solid #ddd; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
        <h2>Customerwise BOM Creation Report</h2>
        <p>Report Date: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>BOM No</th>
              <th>Customer Name</th>
              <th>Customer Code</th>
              <th>Service Job No</th>
              <th>Assembly Part Name</th>
              <th>Model Name</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
    `

    filteredData.forEach((row, idx) => {
      htmlContent += `
        <tr>
          <td>${idx + 1}</td>
          <td><b>${row.bomNo}</b></td>
          <td>${row.customerName}</td>
          <td>${row.customerCode || 'N/A'}</td>
          <td>${row.serialJobNo || row.serviceJobNo || 'N/A'}</td>
          <td>${row.assemblyPartNo || 'N/A'}</td>
          <td>${row.model || 'N/A'}</td>
          <td>${row.date ? row.date.split('T')[0] : 'N/A'}</td>
        </tr>
      `
    })

    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bom_creation_report_${new Date().toISOString().split('T')[0]}.doc`
    link.click()
  }

  const handleExportPdf = () => {
    if (filteredData.length === 0) {
      alert('No data available to export.')
      return
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    doc.setFillColor(0, 151, 167)
    doc.rect(0, 0, 297, 20, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('VELSON ERP - CUSTOMERWISE BOM CREATION REPORT', 15, 13)

    doc.setTextColor(100, 116, 139)
    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Total Records: ${filteredData.length}`, 240, 28)
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 15, 28)

    let startY = 32
    doc.setFillColor(51, 65, 85)
    doc.rect(15, startY, 267, 8, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.text('S.No', 17, startY + 5.5)
    doc.text('BOM No', 28, startY + 5.5)
    doc.text('Customer Name', 55, startY + 5.5)
    doc.text('Customer Code', 115, startY + 5.5)
    doc.text('Service Job No', 145, startY + 5.5)
    doc.text('Assembly Part Name', 195, startY + 5.5)
    doc.text('Model Name', 240, startY + 5.5)
    doc.text('Date', 265, startY + 5.5)

    let currentY = startY + 8
    doc.setFont('Helvetica', 'normal')
    doc.setFontSize(8)

    filteredData.forEach((row, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252)
        doc.rect(15, currentY, 267, 7, 'F')
      }

      doc.setTextColor(51, 65, 85)
      doc.text(String(idx + 1), 17, currentY + 4.5)

      doc.setTextColor(0, 151, 167)
      doc.setFont('Helvetica', 'bold')
      doc.text(row.bomNo, 28, currentY + 4.5)

      doc.setTextColor(15, 23, 42)
      doc.text(row.customerName.length > 28 ? row.customerName.substring(0, 28) + '...' : row.customerName, 55, currentY + 4.5)

      doc.setTextColor(51, 65, 85)
      doc.setFont('Helvetica', 'normal')
      doc.text(row.customerCode || 'N/A', 115, currentY + 4.5)
      doc.text(row.serialJobNo || row.serviceJobNo || 'N/A', 145, currentY + 4.5)
      doc.text(row.assemblyPartNo || 'N/A', 195, currentY + 4.5)
      doc.text(row.model || 'N/A', 240, currentY + 4.5)
      doc.text(row.date ? row.date.split('T')[0] : 'N/A', 265, currentY + 4.5)

      doc.setDrawColor(241, 245, 249)
      doc.line(15, currentY + 7, 282, currentY + 7)

      currentY += 7

      if (currentY > 185) {
        doc.addPage()
        doc.setFillColor(51, 65, 85)
        doc.rect(15, 10, 267, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('Helvetica', 'bold')
        doc.text('S.No', 17, 15.5)
        doc.text('BOM No', 28, 15.5)
        doc.text('Customer Name', 55, 15.5)
        doc.text('Customer Code', 115, 15.5)
        doc.text('Service Job No', 145, 15.5)
        doc.text('Assembly Part Name', 195, 15.5)
        doc.text('Model Name', 240, 15.5)
        doc.text('Date', 265, 15.5)
        currentY = 18
        doc.setFont('Helvetica', 'normal')
        doc.setFontSize(8)
      }
    })

    doc.save(`bom_creation_report_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handlePrintReport = () => {
    if (filteredData.length === 0) {
      alert('No records available to print.')
      return
    }
    const printWindow = window.open('', '_blank', 'width=950,height=750')
    printWindow.document.write(`
      <html>
        <head>
          <title>Customerwise BOM Creation Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0097A7; padding-bottom: 15px; margin-bottom: 20px; }
            h1 { margin: 0; color: #0097A7; font-size: 24px; text-transform: uppercase; font-weight: 800; }
            p { margin: 3px 0; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #0097A7; color: white; font-size: 11px; text-transform: uppercase; font-weight: bold; padding: 10px 8px; border: 1px solid #0097A7; text-align: left; }
            td { padding: 10px 8px; border: 1px solid #e2e8f0; font-size: 12px; }
            .text-center { text-align: center; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>VELSON ERP</h1>
              <p>Customerwise BOM Creation Report</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin:0; font-size:16px; color:#475569;">BOM Registry</h2>
              <p>Total Records: ${filteredData.length}</p>
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">S.No</th>
                <th style="width: 12%">BOM No</th>
                <th style="width: 25%">Customer Name</th>
                <th style="width: 12%">Customer Code</th>
                <th style="width: 18%">Service Job No</th>
                <th style="width: 15%">Assembly Part</th>
                <th style="width: 13%">Model</th>
                <th style="width: 10%">Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((row, idx) => `
                <tr>
                  <td class="text-center">${idx + 1}</td>
                  <td style="font-weight: bold; color: #0097A7;">${row.bomNo}</td>
                  <td><b>${row.customerName}</b></td>
                  <td>${row.customerCode || 'N/A'}</td>
                  <td>${row.serialJobNo || row.serviceJobNo || 'N/A'}</td>
                  <td>${row.assemblyPartNo || 'N/A'}</td>
                  <td>${row.model || 'N/A'}</td>
                  <td>${row.date ? row.date.split('T')[0] : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            VELSON ERP - System Generated Report - Confidentially Printed
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="bg-[#f4f6f8] min-h-full pb-10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5 uppercase font-black tracking-tight">
          <span>BOM</span> <ChevronRight size={12} /> <span className="text-[#0097A7]">BOM Creation Report</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-700 rounded-sm" />
              <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">Customerwise BOM Creation Report</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrintReport} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded shadow-sm">
                <Printer size={15} /> Print Report
              </button>
              <button onClick={handleDeleteAllFiltered} className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[11px] font-bold rounded shadow-sm transition-all">
                <Trash2 size={15} /> Delete
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black rounded transition-all shadow-sm">
                <X size={18} strokeWidth={2.5} /> Close
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8 grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Label>From Date</Label>
                    <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label>To Date</Label>
                    <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-6 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-bold rounded-lg shadow-md transition-all active:scale-95"
                  >
                    {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} />}
                    Search
                  </button>
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-6 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-[13px] font-bold rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    {searching ? <RotateCcw size={16} className="animate-spin" /> : <Search size={16} className="text-[#0097A7]" />}
                    Search Details
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2"><Label>Customer Name</Label></div>
                    <div className="col-span-10">
                      <Select
                        options={Array.from(new Set(data.map(r => r.customerName).filter(Boolean)))}
                        placeholder="--- All Customers ---"
                        value={customer}
                        onChange={e => setCustomer(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2"><Label>Booking Serial No</Label></div>
                    <div className="col-span-10">
                      <Select
                        options={Array.from(new Set(data.map(r => r.serialJobNo || r.serviceJobNo).filter(Boolean)))}
                        placeholder="--- All Serial Numbers ---"
                        value={serialNo}
                        onChange={e => setSerialNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2"><Label>Assembly Part No</Label></div>
                    <div className="col-span-8">
                      <Select
                        options={Array.from(new Set(data.map(r => r.assemblyPartNo).filter(Boolean)))}
                        placeholder="--- All Assembly Parts ---"
                        value={assemblyPartNo}
                        onChange={e => setAssemblyPartNo(e.target.value)}
                        disabled={isAll}
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="allParts"
                        checked={isAll}
                        onChange={e => setIsAll(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#0097A7] focus:ring-[#0097A7] cursor-pointer"
                      />
                      <label htmlFor="allParts" className="text-[11px] font-bold text-slate-500 uppercase cursor-pointer select-none">ALL</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col items-center justify-center border-l border-slate-100 pl-8">
                <div className="w-24 h-24 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-100">
                  <ImageIcon size={40} />
                </div>
                <p className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-widest">Part Preview</p>
              </div>
            </div>

            <div className="flex items-center justify-end mb-4 px-2">
              <div className="flex items-center gap-2">
                {[
                  { icon: <List size={14} />, l: 'LS' },
                  { icon: <Printer size={14} />, l: 'DOS' },
                  { icon: <FileText size={14} className="text-blue-500" />, l: 'DOC' },
                  { icon: <FileSpreadsheet size={14} className="text-green-600" />, l: 'xls' },
                  { icon: <Download size={14} className="text-red-500" />, l: 'PDF' },
                  { icon: <Filter size={14} className="text-[#0097A7]" />, l: 'Filter' },
                  { icon: <Settings size={14} className="text-slate-500" />, l: 'Setting' },
                ].map(tool => (
                  <button
                    key={tool.l}
                    onClick={() => {
                      if (tool.l === 'DOS') handlePrintReport();
                      else if (tool.l === 'DOC') handleExportDoc();
                      else if (tool.l === 'xls') handleExportExcel();
                      else if (tool.l === 'PDF') handleExportPdf();
                      else alert(`${tool.l} clicked!`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg shadow-sm transition-all active:scale-95"
                  >
                    {tool.icon} {tool.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead className="bg-[#fcfdfe] text-[9px] uppercase text-slate-400 font-black border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 border-r border-slate-100 w-16 text-center">S.No</th>
                    <th className="px-5 py-4 border-r border-slate-100">BOM No</th>
                    <th className="px-5 py-4 border-r border-slate-100">Customer Name</th>
                    <th className="px-5 py-4 border-r border-slate-100">Customer Code</th>
                    <th className="px-5 py-4 border-r border-slate-100">Service Job no</th>
                    <th className="px-5 py-4 border-r border-slate-100">Assembly Part name</th>
                    <th className="px-5 py-4 border-r border-slate-100">Model Name</th>
                    <th className="px-5 py-4 border-r border-slate-100">Created Date</th>
                    <th className="px-5 py-4 text-center">Created By</th>
                    <th className="px-5 py-4 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12px]">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-24 text-center text-slate-200 italic">
                        No BOM creation records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-[#0097A7]/5 transition-colors h-14 group">
                        <td className="px-5 py-2 border-r border-slate-50 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-black text-[#0097A7]">{row.bomNo}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-700">{row.customerName}</td>
                        <td className="px-5 py-2 border-r border-slate-50 text-slate-500 font-medium">{row.customerCode || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-600 uppercase text-[11px] truncate max-w-[300px]">{row.serialJobNo || row.serviceJobNo || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50">{row.assemblyPartNo || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50">{row.model || 'N/A'}</td>
                        <td className="px-5 py-2 border-r border-slate-50 font-bold text-slate-400">{row.date ? row.date.split('T')[0] : 'N/A'}</td>
                        <td className="px-5 py-2 text-center font-black text-slate-700 text-[11px]">{row.createdBy || 'superadmin'}</td>
                        <td className="px-5 py-2 text-center">
                          <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* <div className="mt-8 bg-slate-900 rounded-2xl p-6 shadow-2xl flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-12">
                <div>
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Total Recordset</p>
                  <p className="text-[24px] font-black text-white leading-none">{filteredData.length}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div>
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Active Customers</p>
                  <p className="text-[24px] font-black text-[#0097A7] leading-none">
                    {new Set(filteredData.map(r => r.customerName)).size}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <button className="bg-white/5 hover:bg-white/10 text-white/50 px-6 py-2 rounded-lg border border-white/10 text-[11px] font-bold transition-all uppercase tracking-widest">
                  Request Data Audit
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}