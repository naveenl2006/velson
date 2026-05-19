import { useState } from 'react'
import { ChevronRight, Plus, Trash2, Send, X } from 'lucide-react'
import { useToast } from '../components/Toast'

const DEPARTMENTS = ['PURCHASE', 'SALES', 'IT', 'HR']
const TEAMS = ['Team A', 'Team B', 'Team C']
const REQUESTING_FOR = ['Production', 'Maintenance', 'Office Use']

const today = new Date().toISOString().split('T')[0]

const emptyItem = () => ({ id: '', code: '', itemName: '', specification: '', jobNo: '', machineNo: '', unit: '', qty: '', eta: '', qcDept: '', purpose: '', selected: false })

const inp = (err = '') =>
    `w-full border rounded px-2 py-1 text-[12.5px] focus:outline-none focus:ring-1 transition-colors bg-white ${err ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-[#0097A7] focus:border-[#0097A7]'}`
const lbl = 'text-[12px] font-semibold text-slate-600 whitespace-nowrap'

export default function PurchaseRequestEntry() {
    const toast = useToast()
    const [form, setForm] = useState({
        department: '', requestingUser: 'admin', team: '', requestingFor: '',
        requestNo: '26-27/PQ00047', requestDate: today, requiredDate: today,
        remarks: ''
    })
    const [items, setItems] = useState([emptyItem()])

    const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const setItemField = (idx, k, v) => {
        setItems(rows => rows.map((r, i) => (i === idx ? { ...r, [k]: v } : r)))
    }

    const addRow = () => setItems(r => [...r, emptyItem()])
    const deleteSelected = () => setItems(r => r.filter(row => !row.selected))
    const removeRow = idx => setItems(r => r.filter((_, i) => i !== idx))

    const handleSubmit = () => toast?.success ? toast.success('Purchase request submitted!') : alert('Submitted!')
    const handleCancel = () => {
        setForm({ ...form, department: '', team: '', requestingFor: '', remarks: '' })
        setItems([emptyItem()])
    }

    return (
        <div className="p-4 space-y-4 w-full min-w-0 overflow-x-hidden">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px] text-slate-400">
                <span className="hover:text-[#0097A7] cursor-pointer">Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-[#0097A7] cursor-pointer">Purchase</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#0097A7] font-semibold">Purchase Request Entry</span>
            </div>

            {/* Main form card */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0097A7] px-4 py-2.5 flex items-center justify-between">
                    <h2 className="text-white font-semibold text-[14px]">Create - Purchase Request Entry</h2>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-[12px] rounded transition-colors flex items-center gap-1">
                            <X className="w-3 h-3" /> Close
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className={`${lbl} w-[130px] shrink-0 text-red-500`}>* Department:</label>
                                <select value={form.department} onChange={e => setField('department', e.target.value)} className={inp()}>
                                    <option value="">Select Department</option>
                                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className={`${lbl} w-[130px] shrink-0`}>Requesting User:</label>
                                <input value={form.requestingUser} disabled className={`${inp()} bg-slate-100 text-slate-500`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className={`${lbl} w-[130px] shrink-0`}>Team:</label>
                                <select value={form.team} onChange={e => setField('team', e.target.value)} className={inp()}>
                                    <option value="">Select Team</option>
                                    {TEAMS.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className={`${lbl} w-[130px] shrink-0`}>Requesting For:</label>
                                <select value={form.requestingFor} onChange={e => setField('requestingFor', e.target.value)} className={inp()}>
                                    <option value="">Select Requesting For</option>
                                    {REQUESTING_FOR.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 justify-end">
                                <label className={`${lbl} w-[100px] shrink-0 text-right`}>Request No:</label>
                                <input value={form.requestNo} disabled className={`${inp()} w-[200px] bg-slate-100 text-slate-500`} />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <label className={`${lbl} w-[100px] shrink-0 text-right`}>Request Date:</label>
                                <input type="date" value={form.requestDate} onChange={e => setField('requestDate', e.target.value)} className={`${inp()} w-[200px]`} />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <label className={`${lbl} w-[100px] shrink-0 text-right`}>Required Date:</label>
                                <input type="date" value={form.requiredDate} onChange={e => setField('requiredDate', e.target.value)} className={`${inp()} w-[200px]`} />
                            </div>
                            <div className="flex justify-end pt-1">
                                <a href="#" className="text-blue-600 text-[12.5px] hover:underline font-medium">Pick From Material Request</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 px-4 pb-2">
                    <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0097A7] hover:bg-[#007a87] text-white text-[12px] font-medium rounded shadow-sm transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                    <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-medium rounded shadow-sm transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected Item
                    </button>
                </div>

                {/* Items Grid */}
                <div className="px-4 pb-4">
                    <div className="overflow-x-auto border border-slate-200 rounded-md bg-white shadow-sm">
                        <table className="min-w-full text-[12px]">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="p-2 text-center text-white w-8"><input type="checkbox" className="accent-[#0097A7]" /></th>
                                    <th className="p-2 text-center text-white w-8">#</th>
                                    {['ID', 'Code', 'Item Name', 'Specification', 'Job No', 'Machine No', 'Unit', 'Qty', 'ETA', 'QC Dept', 'Purpose', 'Action'].map(h => (
                                        <th key={h} className="p-2 text-left font-medium text-white whitespace-nowrap border-l border-slate-700">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-1.5 text-center border-r border-slate-100">
                                            <input type="checkbox" checked={row.selected} onChange={e => setItemField(idx, 'selected', e.target.checked)} className="accent-[#0097A7] w-3.5 h-3.5" />
                                        </td>
                                        <td className="p-1.5 text-center text-slate-500 border-r border-slate-100 font-medium bg-slate-50">{idx + 1}</td>
                                        <td className="p-1.5 min-w-[60px] border-r border-slate-100"><input value={row.id} onChange={e => setItemField(idx, 'id', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[80px] border-r border-slate-100"><input value={row.code} onChange={e => setItemField(idx, 'code', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[150px] border-r border-slate-100"><input value={row.itemName} onChange={e => setItemField(idx, 'itemName', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[120px] border-r border-slate-100"><input value={row.specification} onChange={e => setItemField(idx, 'specification', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[80px] border-r border-slate-100"><input value={row.jobNo} onChange={e => setItemField(idx, 'jobNo', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[80px] border-r border-slate-100"><input value={row.machineNo} onChange={e => setItemField(idx, 'machineNo', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[60px] border-r border-slate-100"><input value={row.unit} onChange={e => setItemField(idx, 'unit', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[60px] border-r border-slate-100"><input value={row.qty} onChange={e => setItemField(idx, 'qty', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[100px] border-r border-slate-100"><input type="date" value={row.eta} onChange={e => setItemField(idx, 'eta', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[80px] border-r border-slate-100"><input value={row.qcDept} onChange={e => setItemField(idx, 'qcDept', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 min-w-[100px] border-r border-slate-100"><input value={row.purpose} onChange={e => setItemField(idx, 'purpose', e.target.value)} className={inp()} /></td>
                                        <td className="p-1.5 text-center">
                                            <button onClick={() => removeRow(idx)} className="text-red-500 hover:text-red-700 text-[11px] font-medium underline">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-start justify-between p-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="flex items-start gap-2 w-1/2">
                        <label className={`${lbl} pt-1`}>Remarks:</label>
                        <textarea rows="2" value={form.remarks} onChange={e => setField('remarks', e.target.value)} className={`${inp()} resize-none`} />
                    </div>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-[#0097A7] hover:bg-[#007a87] text-white text-[13px] font-bold rounded shadow-sm transition-colors mt-2">
                        Submit For Approval
                    </button>
                </div>
            </div>
        </div>
    )
}