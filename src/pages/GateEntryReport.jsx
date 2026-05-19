import { useState } from 'react'
import { ChevronRight, Search, FileText, FileSpreadsheet, File as FilePdf, Filter, Settings, X, Trash2 } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]

const MOCK_DATA = [
    { gateEntryNo: '26-27/GE00759', gateNo: '1', date: '09-03-2026', invoiceNo: 'DE/25-26/1492', poNo: '25-26/PO04316', supplier: 'DANISH ENGINEERING', partNo: 'VM-201567', desc: '', size: '', uom: '408', qty: 3.00 },
    { gateEntryNo: '26-27/GE00760', gateNo: '1', date: '09-03-2026', invoiceNo: 'DE/25-26/1493', poNo: '25-26/PO04316', supplier: 'DANISH ENGINEERING', partNo: 'VGH-1006372', desc: '', size: '', uom: '204', qty: 4.00 },
    { gateEntryNo: '26-27/GE00761', gateNo: '1', date: '14-05-2026', invoiceNo: 'GST/88', poNo: '26-27/PO00426', supplier: 'ORIENTAL', partNo: 'VC-106022', desc: '', size: '', uom: '204', qty: 20.00 },
    { gateEntryNo: '26-27/GE00762', gateNo: '1', date: '16-05-2026', invoiceNo: '1005/26-27', poNo: '26-27/PO00472', supplier: 'MAHASAKTHI AIR PRODUCTS', partNo: 'VT-00203', desc: '', size: '', uom: '204', qty: 10.00 },
    { gateEntryNo: '26-27/GE00770', gateNo: '1', date: '16-05-2026', invoiceNo: 'SSST/0441/26-27', poNo: '26-27/PO00600', supplier: 'SSS TRADINGS', partNo: 'VRM-3006526', desc: '', size: '', uom: '206', qty: 1148.00 },
    { gateEntryNo: '26-27/GE00771', gateNo: '1', date: '16-05-2026', invoiceNo: 'SSST/0441/26-27', poNo: '26-27/PO00600', supplier: 'SSS TRADINGS', partNo: 'VRM-3000012', desc: '', size: '', uom: '206', qty: 598.00 },
    { gateEntryNo: '26-27/GE00772', gateNo: '1', date: '16-05-2026', invoiceNo: '236/2026-27', poNo: '26-27/PO00601', supplier: 'KARTHIK TRADERS', partNo: 'VRM-3000504', desc: '', size: '', uom: '206', qty: 224.40 },
    { gateEntryNo: '26-27/GE00776', gateNo: '1', date: '14-05-2026', invoiceNo: '0184', poNo: '26-27/PO00611', supplier: 'SRI HARI BELTINGS', partNo: 'VC-106466', desc: '', size: '', uom: '207', qty: 3000.00 },
]

const inp = 'border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:border-[#0097A7] bg-white'
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'
const iconBtn = 'flex items-center gap-1 text-[12px] text-slate-600 hover:text-[#0097A7] transition-colors cursor-pointer'

export default function GateEntryReport() {
    const [fromDate, setFromDate] = useState(today)
    const [toDate, setToDate] = useState(today)
    const [activeRow, setActiveRow] = useState(0)

    const totalQty = MOCK_DATA.reduce((sum, row) => sum + row.qty, 0).toFixed(2)

    return (
        <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden h-screen flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] text-slate-400 shrink-0">
                <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-[#0097A7] cursor-pointer">Stores</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#0097A7] font-semibold">Gate Entry Report</span>
            </div>

            <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="bg-[#0097A7] px-4 py-2.5 flex items-center justify-between shrink-0">
                    <h2 className="text-white font-semibold text-[14px]">Gate Entry Report</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors flex items-center gap-1">
                            <X className="w-3 h-3" /> Close
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className={lbl}>From Date :</label>
                            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className={inp} />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className={lbl}>To Date :</label>
                            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className={inp} />
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1 border border-[#0097A7] text-[#0097A7] bg-white hover:bg-[#0097A7]/10 rounded text-[12px] font-medium transition-colors shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Search Details
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1 border border-[#0097A7] text-[#0097A7] bg-white hover:bg-[#0097A7]/10 rounded text-[12px] font-medium transition-colors shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span> Search Summary
                        </button>
                    </div>

                    {/* Export Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-medium text-slate-500">LS</span>
                            <input value="1" readOnly className="w-8 text-center border border-slate-300 rounded text-[12px] py-0.5" />
                        </div>
                        <div className="h-4 w-px bg-slate-300"></div>
                        <div className={iconBtn}><FileText className="w-4 h-4 text-[#0097A7]" /> Dos</div>
                        <div className={iconBtn}><FileSpreadsheet className="w-4 h-4 text-[#0097A7]" /> Excel</div>
                        <div className={iconBtn}><FilePdf className="w-4 h-4 text-red-500" /> Pdf</div>
                        <div className={iconBtn}><Filter className="w-4 h-4 text-blue-500" /> Filter</div>
                        <div className={iconBtn}><Settings className="w-4 h-4 text-slate-700" /> Setting</div>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="flex-1 overflow-auto relative">
                    <table className="w-full min-w-max text-[12px] text-left border-collapse">
                        <thead className="bg-slate-800 text-white sticky top-0 z-10">
                            <tr>
                                {['Gate Entry No', 'Gate _No', 'Date', 'Invoice No', 'PO No', 'Supplier Name', 'Part No', 'Description', 'Size', 'UOM', 'Invoice Qty'].map(h => (
                                    <th key={h} className="p-2 font-medium border-x border-slate-700 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {MOCK_DATA.map((row, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setActiveRow(i)}
                                    className={`cursor-pointer transition-colors ${activeRow === i ? 'bg-[#0097A7]/20' : 'hover:bg-slate-50'}`}
                                >
                                    <td className="p-1.5 border-x border-slate-200">{row.gateEntryNo}</td>
                                    <td className="p-1.5 border-x border-slate-200 text-center">{row.gateNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.date}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.invoiceNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.poNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.supplier}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.partNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.desc}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.size}</td>
                                    <td className="p-1.5 border-x border-slate-200 text-center">{row.uom}</td>
                                    <td className="p-1.5 border-x border-slate-200 text-right">{row.qty.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="sticky bottom-0 bg-[#f4f6ce] font-semibold text-slate-800 border-t-2 border-slate-300">
                            <tr>
                                <td colSpan="10" className="p-2 border-x border-slate-300">Row : {MOCK_DATA.length}</td>
                                <td className="p-2 border-x border-slate-300 text-right">{totalQty}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}