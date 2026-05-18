import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  ChevronRight, X, FileBarChart, FileSpreadsheet, FileText,
  Filter, Settings, Download, Loader2, Pencil, Trash2, Printer, AlertTriangle
} from 'lucide-react'
import { useToast } from '../components/Toast'

const Label = ({ children }) => (
  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
    {children}
  </label>
)

const Input = ({ type = 'text', value, onChange, placeholder, className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-4 py-2 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all duration-200 hover:border-slate-300 shadow-sm ${className}`}
  />
)

const StatusBadge = ({ status }) => {
  const map = {
    Draft:    'bg-slate-100 text-slate-600',
    Sent:     'bg-blue-100 text-blue-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status ?? '—'}
    </span>
  )
}

const fmt = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fmtAmt = (v) => {
  const n = parseFloat(v)
  if (isNaN(n)) return '—'
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/* ── PDF print window for a single quotation ── */
const openPrintWindow = (row) => {
  const w = window.open('', '_blank', 'width=850,height=700')
  const items = (row.details ?? []).map((d, i) => `
    <tr>
      <td style="text-align:center">${i + 1}</td>
      <td>${d.partNo ?? ''}</td>
      <td>${d.itemName ?? ''}</td>
      <td>${d.description ?? ''}</td>
      <td style="text-align:center">${d.qty ?? ''}</td>
      <td style="text-align:right">${d.unitPrice ?? ''}</td>
      <td style="text-align:right">${d.amount ?? ''}</td>
    </tr>`).join('')

  w.document.write(`<!DOCTYPE html><html><head><title>Quotation ${row.quotationNo}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:30px;font-size:12px;color:#222}
    h2{text-align:center;margin-bottom:4px;font-size:16px}
    .sub{text-align:center;color:#555;margin-bottom:16px;font-size:11px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
    .kv{margin:2px 0}
    table{width:100%;border-collapse:collapse;margin-top:10px}
    th,td{border:1px solid #ccc;padding:5px 8px}
    th{background:#f0f4f8;font-size:11px;text-transform:uppercase}
    .totals{text-align:right;margin-top:10px}
    .totals div{margin:2px 0}
    .grand{font-size:14px;font-weight:bold;color:#0097A7}
    @media print{button{display:none}}
  </style></head><body>
  <h2>QUOTATION</h2>
  <p class="sub">${row.quotationNo} &nbsp;|&nbsp; Rev: ${row.revisionNo ?? 0} &nbsp;|&nbsp; ${fmt(row.quotationDate)}</p>
  <div class="grid">
    <div>
      <div class="kv"><strong>Customer:</strong> ${row.customer?.customerName ?? '—'}</div>
      <div class="kv"><strong>Status:</strong> ${row.status ?? '—'}</div>
      <div class="kv"><strong>Currency:</strong> ${row.currencyCode ?? 'INR'}</div>
    </div>
    <div>
      <div class="kv"><strong>Tax Type:</strong> ${row.taxType ?? '—'}</div>
      <div class="kv"><strong>Valid Until:</strong> ${fmt(row.validUntil)}</div>
      <div class="kv"><strong>Model Ref:</strong> ${row.modelRef ?? '—'}</div>
    </div>
  </div>
  <table>
    <thead><tr>
      <th style="width:30px">#</th><th>Part No</th><th>Item Name</th>
      <th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th>
    </tr></thead>
    <tbody>${items || '<tr><td colspan="7" style="text-align:center;color:#888">No items</td></tr>'}</tbody>
  </table>
  <div class="totals">
    <div>Sub Total: <strong>${fmtAmt(row.subTotal)}</strong></div>
    <div>Special Discount: <strong>${fmtAmt(row.specialDiscount)}</strong></div>
    <div>Freight: <strong>${fmtAmt(row.freightAmount)}</strong></div>
    <div>Tax (${row.taxPercent ?? 0}%): <strong>${fmtAmt(row.taxAmount)}</strong></div>
    <div class="grand">Grand Total: ${fmtAmt(row.totalAmount)}</div>
  </div>
  ${row.paymentTerms ? `<div style="margin-top:16px;font-size:11px;color:#555"><strong>Payment Terms:</strong><br>${row.paymentTerms.replace(/\n/g,'<br>')}</div>` : ''}
  <br><button onclick="window.print()" style="padding:6px 18px;background:#0097A7;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">Print / Save PDF</button>
  </body></html>`)
  w.document.close()
}

/* ── CSV export for the visible row list ── */
const exportCSV = (rows) => {
  const headers = ['Quotation No', 'Date', 'Status', 'Customer', 'Currency', 'Sub Total', 'Tax %', 'Tax Amount', 'Total Amount']
  const lines = [
    headers.join(','),
    ...rows.map(r => [
      r.quotationNo,
      r.quotationDate ? new Date(r.quotationDate).toLocaleDateString('en-IN') : '',
      r.status ?? '',
      r.customer?.customerName ?? '',
      r.currencyCode ?? '',
      r.subTotal ?? '',
      r.taxPercent ?? '',
      r.taxAmount ?? '',
      r.totalAmount ?? '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `quotations_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ─────────────────────────────────────────────────────────────────────────── */
export default function QuotationDetails({ onNavigate }) {
  const toast = useToast()

  const [fromDate, setFromDate]         = useState('')
  const [toDate, setToDate]             = useState('')
  const [quotationNo, setQuotationNo]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pdfFormat, setPdfFormat]       = useState('Standard')

  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  /* delete confirmation state */
  const [deleteTarget, setDeleteTarget] = useState(null)   // { id, quotationNo }
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* ── fetch ── */
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('/api/quotation-master')
      let data = res.data?.data ?? []
      if (fromDate) data = data.filter(r => r.quotationDate && r.quotationDate.slice(0, 10) >= fromDate)
      if (toDate)   data = data.filter(r => r.quotationDate && r.quotationDate.slice(0, 10) <= toDate)
      if (quotationNo.trim()) data = data.filter(r => r.quotationNo?.toLowerCase().includes(quotationNo.trim().toLowerCase()))
      if (statusFilter)       data = data.filter(r => r.status === statusFilter)
      setRows(data)
    } catch (err) {
      console.error('[QuotationDetails] fetch error:', err)
      setError('Failed to load quotations.')
    } finally {
      setLoading(false)
    }
  }, [fromDate, toDate, quotationNo, statusFilter])

  useEffect(() => { fetchData() }, [])

  /* ── delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await axios.delete(`/api/quotation-master/${deleteTarget.id}`)
      setRows(r => r.filter(x => x.id !== deleteTarget.id))
      toast.success(`Quotation ${deleteTarget.quotationNo} deleted.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error('Delete failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleteLoading(false)
    }
  }

  /* ── edit → navigate to entry with revision ── */
  const handleEdit = (row) => {
    if (onNavigate) onNavigate('QuotationEntry', { editData: row })
  }

  const COLS = [
    { label: 'Quotation Number', w: 'w-40' },
    { label: 'Quotation Date',   w: 'w-36' },
    { label: 'Status',           w: 'w-32' },
    { label: 'Customer Name',    w: 'w-64' },
    { label: 'Total Amount',     w: 'w-36' },
    { label: 'RPT',              w: 'w-16' },
    { label: 'PDF',              w: 'w-16' },
    { label: 'Edit',             w: 'w-16' },
    { label: 'Delete',           w: 'w-16' },
  ]

  return (
    <div className="bg-[#f4f6f8] min-h-full">
      <div className="px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-5">
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-[#0097A7] cursor-pointer transition-colors uppercase tracking-widest">Sales</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0097A7] font-semibold uppercase tracking-widest">Quotation Details</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[850px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-red-700 rounded-sm" />
              <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Quotation Details</h2>
            </div>
            <button
              onClick={() => onNavigate?.('Dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-bold rounded-md transition-all shadow-sm"
            >
              <div className="w-4 h-4 bg-slate-400 rounded-full flex items-center justify-center">
                <X size={10} className="text-white" strokeWidth={3} />
              </div>
              Close
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {/* Filter Bar */}
            <div className="flex items-end justify-between gap-4 mb-6 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-end gap-4 w-full flex-wrap">
                <div className="flex-1 min-w-[130px]">
                  <Label>From Date</Label>
                  <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full" />
                </div>
                <div className="flex-1 min-w-[130px]">
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full" />
                </div>
                <div className="flex-1 min-w-[130px]">
                  <Label>PDF Format</Label>
                  <select
                    value={pdfFormat}
                    onChange={e => setPdfFormat(e.target.value)}
                    className="px-4 py-2 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 w-full focus:outline-none focus:border-[#0097A7]"
                  >
                    <option>Standard</option>
                    <option>Detailed</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <Label>Quotation Number</Label>
                  <Input placeholder="Enter Quote No" value={quotationNo} onChange={e => setQuotationNo(e.target.value)} className="w-full" />
                </div>
                <div className="flex-1 min-w-[130px]">
                  <Label>Quotation Status</Label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 text-[13px] border border-slate-200 rounded-lg bg-white text-slate-700 w-full focus:outline-none focus:border-[#0097A7]"
                  >
                    <option value="">-- All --</option>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 py-2 bg-[#0097A7] hover:bg-[#007a87] disabled:opacity-60 text-white text-[12px] font-bold rounded-lg transition-all shadow-md active:scale-95 h-[38px] min-w-[120px]"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Search
                </button>
              </div>
            </div>

            {/* Tool Icons Bar */}
            <div className="flex items-center justify-end gap-5 mb-4 px-2 text-slate-500">
              <div className="flex items-center gap-1.5 border-r border-slate-200 pr-5">
                <span className="text-[11px] font-bold">LS</span>
                <span className="text-[12px] font-black text-[#0097A7]">{rows.length}</span>
              </div>
              <button className="flex items-center gap-1.5 hover:text-[#0097A7] transition-colors group" title="Dos">
                <Download size={16} />
                <span className="text-[11px] font-bold group-hover:text-[#0097A7]">Dos</span>
              </button>
              <button
                onClick={() => exportCSV(rows)}
                disabled={rows.length === 0}
                className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors group disabled:opacity-40"
                title="Export Excel/CSV"
              >
                <FileSpreadsheet size={16} />
                <span className="text-[11px] font-bold group-hover:text-emerald-600">Excel</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-rose-600 transition-colors group" title="Pdf">
                <FileText size={16} />
                <span className="text-[11px] font-bold group-hover:text-rose-600">Pdf</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#0097A7] transition-colors group" title="Filter">
                <Filter size={16} />
                <span className="text-[11px] font-bold group-hover:text-[#0097A7]">Filter</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#0097A7] transition-colors group" title="Setting">
                <Settings size={16} />
                <span className="text-[11px] font-bold group-hover:text-[#0097A7]">Setting</span>
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-full bg-white">
                <thead className="bg-[#cbd5e1]/30 text-[11px] uppercase text-slate-600 font-bold border-b border-slate-300">
                  <tr>
                    {COLS.map((h, i) => (
                      <th key={i} className={`px-3 py-3 border-r border-slate-300 whitespace-nowrap ${h.w}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[12px]">
                  {loading ? (
                    <tr>
                      <td colSpan={COLS.length} className="text-center py-16 text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin text-[#0097A7]" />
                          <span>Loading…</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr><td colSpan={COLS.length} className="text-center py-16 text-red-400 text-[13px]">{error}</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={COLS.length} className="text-center py-16 text-slate-400 text-[13px]">No records found.</td></tr>
                  ) : (
                    rows.map((row, i) => (
                      <tr key={row.id} className={`h-10 hover:bg-[#f0f9fa]/60 transition-colors ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                        <td className="px-3 py-2 border-r border-slate-100 font-medium text-[#0097A7] whitespace-nowrap">{row.quotationNo}</td>
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap">{fmt(row.quotationDate)}</td>
                        <td className="px-3 py-2 border-r border-slate-100"><StatusBadge status={row.status} /></td>
                        <td className="px-3 py-2 border-r border-slate-100">{row.customer?.customerName ?? '—'}</td>
                        <td className="px-3 py-2 border-r border-slate-100 text-right font-medium tabular-nums">{fmtAmt(row.totalAmount)}</td>
                        <td className="px-3 py-2 border-r border-slate-100 text-center">
                          <button
                            onClick={() => openPrintWindow(row)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-[#0097A7] transition-colors"
                            title="Print report"
                          >
                            <Printer size={14} />
                          </button>
                        </td>
                        <td className="px-3 py-2 border-r border-slate-100 text-center">
                          <button
                            onClick={() => openPrintWindow(row)}
                            className="p-1.5 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                            title="PDF"
                          >
                            <FileText size={14} />
                          </button>
                        </td>
                        <td className="px-3 py-2 border-r border-slate-100 text-center">
                          <button
                            onClick={() => handleEdit(row)}
                            className="p-1.5 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                            title="Revise & edit"
                          >
                            <Pencil size={14} />
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => setDeleteTarget({ id: row.id, quotationNo: row.quotationNo })}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5 opacity-30 hover:opacity-100 transition-opacity cursor-default">
                <FileBarChart size={14} className="text-[#0097A7]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Quotation Audit & Estimation Analysis Console</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Records: <span className="text-[#0097A7]">{rows.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-[360px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800">Delete Quotation</p>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Delete <span className="font-semibold text-slate-700">{deleteTarget.quotationNo}</span>? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-[12px] font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 transition-colors"
              >
                {deleteLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
