import { useState } from 'react'
import { ChevronRight, FileText, FileSpreadsheet, File as FilePdf, Filter, Settings, X, Trash2, Printer } from 'lucide-react'

const MOCK_DATA = [
    { reqNo: '26-27/PQ00001', reqDate: '01-Apr-2026', dept: 'V10', jobNo: '', user: 'V10GROUND...', reqdDate: '01-Apr-2026', approval: 'Approved', poNo: '26-27/PO00007', poDate: '01-Apr-2026' },
    { reqNo: '26-27/PQ00002', reqDate: '01-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'CSCOREDRILL', reqdDate: '01-Apr-2026', approval: 'Approved', poNo: '26-27/PO00011', poDate: '01-Apr-2026' },
    { reqNo: '26-27/PQ00003', reqDate: '02-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'velson spares', reqdDate: '02-Apr-2026', approval: 'Approved', poNo: '26-27/PO00031', poDate: '02-Apr-2026' },
    { reqNo: '26-27/PQ00004', reqDate: '03-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'V2IMYRMAX', reqdDate: '03-Apr-2026', approval: 'Approved', poNo: '26-27/PO00034', poDate: '03-Apr-2026' },
    { reqNo: '26-27/PQ00005', reqDate: '06-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'v10groundhog', reqdDate: '06-Apr-2026', approval: 'Approved', poNo: '26-27/PO00058', poDate: '06-Apr-2026' },
    { reqNo: '26-27/PQ00006', reqDate: '06-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'v10groundhog', reqdDate: '06-Apr-2026', approval: 'Approved', poNo: '26-27/PO00059', poDate: '06-Apr-2026' },
    { reqNo: '26-27/PQ00007', reqDate: '07-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'V2IMYRMAX', reqdDate: '07-Apr-2026', approval: 'Approved', poNo: '26-27/PO00085', poDate: '07-Apr-2026' },
    { reqNo: '26-27/PQ00008', reqDate: '07-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'V2IMYRMAX', reqdDate: '07-Apr-2026', approval: 'Approved', poNo: '26-27/PO00099', poDate: '08-Apr-2026' },
    { reqNo: '26-27/PQ00009', reqDate: '08-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'velson spares', reqdDate: '08-Apr-2026', approval: 'Approved', poNo: '26-27/PO00100', poDate: '08-Apr-2026' },
    { reqNo: '26-27/PQ00010', reqDate: '08-Apr-2026', dept: 'PURCHASE', jobNo: '', user: 'V2IMYRMAX', reqdDate: '08-Apr-2026', approval: 'Approved', poNo: '26-27/PO00108', poDate: '08-Apr-2026' },
]

const inp = 'border border-slate-300 rounded px-2 py-1 text-[12.5px] focus:outline-none focus:border-[#0097A7] bg-white'
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'
const iconBtn = 'flex items-center gap-1 text-[12px] text-slate-600 hover:text-[#0097A7] transition-colors cursor-pointer'

export default function PrintPurchaseRequest() {
    const [fromDate, setFromDate] = useState('2026-04-01')
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
    const [activeRow, setActiveRow] = useState(0)

    return (
        <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden h-screen flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] text-slate-400 shrink-0">
                <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-[#0097A7] cursor-pointer">Purchase</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#0097A7] font-semibold">Print Purchase Request</span>
            </div>

            <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="bg-[#0097A7] px-4 py-2.5 flex items-center justify-between shrink-0">
                    <h2 className="text-white font-semibold text-[14px]">Print Purchase Request</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors flex items-center gap-1">
                            <Printer className="w-3 h-3" /> Print Purchase Request
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
                        <button className="flex items-center gap-1.5 px-4 py-1 border border-[#0097A7] text-[#0097A7] bg-white hover:bg-[#0097A7]/10 rounded text-[12px] font-medium transition-colors shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span> Search
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
                                {['Request No', 'Request Date', 'Department Name', 'Job No', 'Request User', 'Required Date', 'Approval', 'PO No', 'PO Date'].map(h => (
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
                                    <td className="p-1.5 border-x border-slate-200">{row.reqNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.reqDate}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.dept}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.jobNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.user}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.reqdDate}</td>
                                    <td className="p-1.5 border-x border-slate-200">
                                        <span className="text-[#0097A7] font-medium">{row.approval}</span>
                                    </td>
                                    <td className="p-1.5 border-x border-slate-200">{row.poNo}</td>
                                    <td className="p-1.5 border-x border-slate-200">{row.poDate}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="sticky bottom-0 bg-[#f4f6ce] font-semibold text-slate-800 border-t-2 border-slate-300">
                            <tr>
                                <td colSpan="9" className="p-2 border-x border-slate-300">Row : {MOCK_DATA.length}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}