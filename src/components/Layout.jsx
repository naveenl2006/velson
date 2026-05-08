import { useState } from 'react'
import {
  LayoutDashboard, Users, UserCog, Database, Package,
  UserCircle, Wrench, FileText, ShoppingCart, Warehouse,
  Settings, ChevronRight, ChevronDown, User, Landmark,
  LayoutGrid, ShieldAlert
} from 'lucide-react'
import { ClipboardList } from 'lucide-react'
import { Truck } from 'lucide-react'
const NAV = [
  { id: 'dashboard-top', label: 'Dashboard',     icon: LayoutDashboard, page: 'Dashboard' },
  { id: 'user-masters',  label: 'User Masters',  icon: UserCog,         children: [] },
  { id: 'users',         label: 'Users',          icon: Users,           children: [] },
  {
    id: 'masters', label: 'Masters', icon: Database,
    children: [
      { id: 'company-master',          label: 'Company Master',                page: 'CompanyMaster'       },
      { id: 'employee-master',         label: 'Employee Master',               page: 'EmployeeMaster'      },
      { id: 'ledger-group-master',     label: 'Ledger Group Master',           page: 'LedgerGroupMaster'   },
      { id: 'machine-master',          label: 'Machine Master',                page: 'MachineMaster'       },
      { id: 'vehicle-service-master',  label: 'Vehicle Service Master',        page: 'VehicleServiceMaster'},
      { id: 'contractor-master',       label: 'Contractor Master',             page: 'ContractorMaster'    },
      { id: 'process-master',          label: 'Process Master',                page: 'ProcessMaster'       },
      { id: 'part-usage-list',         label: 'Part Usage List Display',       page: 'PartUsageList'       },
      { id: 'qc-check-method',         label: 'QC Check Method Master',        page: 'QCCheckMethod'       },
      { id: 'qc-inspection-char',      label: 'QC Inspection Character Master',page: 'QCInspectionChar'    },
      { id: 'qc-standard-master',      label: 'QC Standard Master',            page: 'QCStandardMaster'    },
      { id: 'auto-po',                 label: 'Auto PO',                       page: 'AutoPO'              },
      { id: 'system-info-master',      label: 'System Info Master',            page: 'SystemInfoMaster'    },
      { id: 'db-copy',                 label: 'DB Copy',                       page: 'DBCopy'              },
      { id: 'restore-db',              label: 'Restore DB',                    page: 'RestoreDB'           },
    ],
  },
  {
    id: 'item-masters', label: 'Item Masters', icon: Package,
    children: [
      { id: 'part-number-base', label: 'Part Number Base Master', page: 'PartNumberBase' },
      { id: 'dropdown-name',    label: 'Drop Down Name Master',   page: 'DropDownName'  },
      { id: 'dropdown-list',    label: 'Drop Down List Master',   page: 'DropDownList'  },
      { id: 'tax-ledger',       label: 'Tax Ledger A/C Master',   page: 'TaxLedger'     },
      { id: 'tax-master-menu',  label: 'Tax Master',              page: 'TaxMaster'     },
      { id: 'item-group',       label: 'Item Group Master',       page: 'ItemGroup'     },
      { id: 'item-master',      label: 'Item Master',             page: 'ItemMaster'    },
    ],
  },
  {
    id: 'person-masters', label: 'Person Masters', icon: UserCircle,
    children: [
      { id: 'supplier-master', label: 'Supplier Master', page: 'SupplierMaster' },
      { id: 'customer-master', label: 'Customer Master', page: 'CustomerMaster' },
    ],
  },
  { id: 'service',        label: 'Service',         icon: Wrench,         children: [ { id: 'vehicle-master',  label: 'Vehicle Master',  page: 'VehicleMaster'  }] },
  {
    id: 'quotation', label: 'Quotation', icon: FileText,
    children: [
      { id: 'quotation-entry',   label: 'Quotation Entry',   page: 'QuotationEntry'   },
      { id: 'quotation-details', label: 'Quotation Details', page: 'QuotationDetails' },
    ],
  },
  {
    id: 'purchase', label: 'Purchase', icon: ShoppingCart,
    children: [
      { id: 'purchase-order',         label: 'Purchase Order',         page: 'PurchaseOrderEntry'   },
      { id: 'purchase-order-details', label: 'Purchase Order Details', page: 'PurchaseOrderDetails' },
      { id: 'purchase-request',       label: 'Purchase Request',       page: 'PurchaseOrderDetails' },
      { id: 'print-purchase-request', label: 'Print Purchase Request', page: 'PurchaseOrderDetails' },
    ],
  },
  {
    id: 'stores', label: 'Stores', icon: Warehouse,
    children: [
      { id: 'material-request',       label: 'Material Request',       page: 'MaterialRequestEntry' },
      { id: 'print-material-request', label: 'Print Material Request', page: 'PrintMaterialRequest' },
      { id: 'gate-entry',             label: 'Gate Entry',             page: 'GateEntry'            },
      { id: 'grn-entry',              label: 'GRN Entry',              page: 'GRNEntry'             },
      { id: 'grn-entry-report',       label: 'GRN Entry Report',       page: 'GRNEntryReport'       },
    ],
  },
  {
    id: 'account', label: 'Account', icon: Landmark,
    children: [
      { id: 'receipt-entry', label: 'Receipt Entry', page: 'ReceiptEntry' },
      { id: 'receipt-details', label: 'Receipt Details', page: 'ReceiptDetails' },
      { id: 'voucher-entry', label: 'Voucher Entry', page: 'VoucherEntry' },
      { id: 'day-report', label: 'Day Report', page: 'DayReport' },
      { id: 'day-book', label: 'Day Book', page: 'DayBook' },
      { id: 'ledger-balance', label: 'Ledger Balance', page: 'LedgerBalance' },
      { id: 'monthly-ledger-balance', label: 'Monthly Ledger Balance', page: 'MonthlyLedgerBalance' },
      { id: 'outstanding-receipt-report', label: 'Outstanding Receipt Reports', page: 'OutstandingReceiptReport' },
      { id: 'payment-entry', label: 'Payment Entry', page: 'PaymentEntry' },
      { id: 'payment-details', label: 'Payment Details', page: 'PaymentDetails' },
      { id: 'journal-entry', label: 'Journal Entry', page: 'JournalEntry' },
    ],
  },
  { 
    id: 'bom', 
    label: 'BOM', 
    icon: FileText, 
    children: [
      { id: 'bom-upload', label: 'BOM Upload', page: 'BOMUpload' },
      { id: 'customerwise-bom-report', label: 'Customerwise BOM Report', page: 'CustomerwiseBOMReport' },
      { id: 'index-creation', label: 'Index Creation', page: 'IndexCreation' },
      { id: 'index-creation-report', label: 'Index Creation Report', page: 'IndexCreationReport' },
      { id: 'upload-bom', label: 'Upload BOM', page: 'UploadBOM' },
      { id: 'main-index', label: 'Main Index', page: 'MainIndex' },
      { id: 'main-index-report', label: 'Main Index Report', page: 'MainIndexReport' },
      { id: 'view-model', label: 'View Model', page: 'ViewModel' },
    ] 
  },
  { 
    id: 'ccms', 
    label: 'CCMS', 
    icon: ClipboardList, 
    children: [
      { id: 'customer-complaint-entry', label: 'Customer Complaint Entry', page: 'CustomerComplaintEntry' },
    ] 
  },
  { 
    id: 'dc', 
    label: 'DC', 
    icon: Truck, 
    children: [
      { id: 'dc-entry', label: 'DC Entry', page: 'DCEntry' },
    ] 
  },
  { 
    id: 'maintainance', 
    label: 'Maintainance', 
    icon: Wrench, 
    children: [
      { id: 'machine-breakdown', label: 'BreakDown Entry', page: 'MachineBreakDown' },
      { id: 'breakdown-clearence', label: 'Waiting for Clearence', page: 'BreakDownClearence' },
      { id: 'breakdown-acceptance', label: 'Waiting for Acceptance', page: 'BreakDownAcceptance' },
      { id: 'breakdown-approval-list', label: 'Acceptance Breakdown', page: 'BreakDownApprovalList' },
    ] 
  },
  { 
    id: 'nc', 
    label: 'NC', 
    icon: ShieldAlert, 
    children: [
      { id: 'qc-rejection-details', label: 'NC Details', page: 'QCRejectionDetails' },
      { id: 'nc-approval', label: 'NC Approval', page: 'NCApproval' },
      { id: 'nc-job-created', label: 'NC Job Created', page: 'NCJobCreated' },
      { id: 'nc-dc-entry', label: 'DC NC Entry', page: 'NCDCEntry' },
      { id: 'nc-dc-details', label: 'NC DC Details', page: 'NCDCDetails' },
    ] 
  },
  { 
    id: 'production', 
    label: 'Production', 
    icon: LayoutGrid, 
    children: [
      { id: 'job-list', label: 'Job List', page: 'JobList' },
      { id: 'barcode-details', label: 'Print Barcode', page: 'BarcodeDetails' },
      { id: 'auto-job-entry', label: 'Service Auto Job Entry', page: 'AutoJobEntry' },
      { id: 'service-job-entry-details', label: 'Service Entry Details', page: 'ServiceJobEntryDetails' },
      { id: 'conformation-list', label: 'Conformation Final', page: 'ConformationList' },
      { id: 'conformation-entry-details', label: 'Conformation List Details', page: 'ConformationEntryDetails' },
      { id: 'process-card', label: 'Process Card Entry new', page: 'ProcessCard' },
      { id: 'raw-material-issue', label: 'Rawmaterial Issue Job', page: 'RawMaterialIssue' },
      { id: 'raw-material-issued-details', label: 'Rawmaterial Issue Details', page: 'RawMaterialIssuedDetails' },
      { id: 'prod-machine-breakdown', label: 'BreakDown Entry', page: 'MachineBreakDown' },
    ] 
  },
  { id: 'technical',      label: 'Technical',        icon: Settings,       children: [] },
  {
    id: 'sales',
    label: 'Sales',
    icon: LayoutGrid,
    children: [

      { id: 'credit-sales', label: 'Credit Sales', page: 'CreditSales' },
      { id: 'sales-details', label: 'Sales Details', page: 'SalesDetails' },
      { id: 'quotation-sales', label: 'Quotation Sales', page: 'QuotationSales' },
      { id: 'quotation-details', label: 'Quotation Details', page: 'QuotationDetails' },
      { id: 'dc-sales', label: 'DC Sales', page: 'DCSales' },
      { id: 'dc-details', label: 'DC Details', page: 'DCDetails' },
      { id: 'service-bill-entry', label: 'Service Bill Entry', page: 'ServiceBillEntry' },
      { id: 'service-bill-details', label: 'Service Bill Details', page: 'ServiceBillDetails' },
      { id: 'service-labour-bill-details', label: 'Service Labour Bill Details', page: 'ServiceLabourBillDetails' },
      { id: 'temp-service-bill-details', label: 'Temp Service Bill Details', page: 'TempServiceBillDetails' },
    ]









  },
  {
    id: 'report',

    label: 'Report',
    icon: FileText,
    children: [
      { id: 'mat-req-rej-list', label: 'Raw Material Rejected', page: 'MaterialRequestRejectionList' },
      { id: 'inward-reports', label: 'Inward Details', page: 'InwardReports' },
      { id: 'outward-details', label: 'Outward Details', page: 'OutwardDetails' },
      { id: 'min-stock', label: 'Min Stock Report', page: 'MinStock' },
      { id: 'mat-issued-details', label: 'Return RawMaterial', page: 'MaterialIssuedDetails' },
      { id: 'completed-job-list', label: 'Completed Job List', page: 'CompletedJobList' },
      { id: 'purchase-order-report', label: 'Purchase Order Report', page: 'PurchaseOrderReport' },
      { id: 'purchase-order-overall-report', label: 'Purchase Order Overall', page: 'PurchaseOrderOverallReport' },
      { id: 'current-stock', label: 'Stock Report', page: 'CurrentStock' },
      { id: 'qc-completed-list', label: 'QC Completed List', page: 'QCCompletedList' },
      { id: 'mat-issue-correction', label: 'Stock Issue Delete', page: 'MaterialIssueCorrection' },
      { id: 'stock-details', label: 'Stock Checking', page: 'StockDetails' },
      { id: 'qc-entry-report', label: 'QC Entry Report', page: 'QCEntryReport' },
    ]












  },


]

export default function Layout({ currentPage, onNavigate, children }) {
  // Auto-open the group that owns the active page
  const defaultOpen = NAV.find(n =>
    n.children && n.children.some(c => c.page === currentPage)
  )?.id ?? null

  const [openGroup, setOpenGroup] = useState(defaultOpen)
  const toggle = id => setOpenGroup(p => (p === id ? null : id))

  return (
    <div className="flex h-screen bg-[#f4f6f8] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-[210px] flex-shrink-0 bg-[#2c3e50] flex flex-col overflow-y-auto scrollbar-thin">
        {/* Brand */}
        <div className="px-4 py-3 bg-[#1a252f] border-b border-white/10 flex-shrink-0">
          <p className="text-white font-extrabold text-[13px] tracking-wide leading-tight">VELSON</p>
          <p className="text-white/40 text-[9px] font-medium tracking-widest uppercase">ERP WEB APPLICATION</p>
        </div>

        <nav className="flex-1 py-1">
          {NAV.map(item => {
            const hasChildren = item.children && item.children.length > 0
            const isOpen = openGroup === item.id
            const Icon = item.icon

            if (!hasChildren) {
              return (
                <button
                  key={item.id}
                  onClick={() => item.page && onNavigate(item.page)}
                  className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] transition-colors
                    ${currentPage === item.page ? 'bg-[#0097A7] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {item.label}
                </button>
              )
            }

            return (
              <div key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 text-[12.5px] transition-colors
                    ${isOpen ? 'bg-[#0097A7] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={14} className="flex-shrink-0" />
                    {item.label}
                  </span>
                  {isOpen
                    ? <ChevronDown size={12} />
                    : <ChevronRight size={12} />
                  }
                </button>

                {isOpen && item.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => onNavigate(child.page)}
                    className={`w-full text-left flex items-center gap-2 pl-8 pr-3 py-2 text-[12px] border-l-[3px] transition-colors
                      ${currentPage === child.page
                        ? 'border-[#00BCD4] bg-[#0097A7]/25 text-white font-semibold'
                        : 'border-transparent text-white/55 hover:bg-white/8 hover:text-white/90'}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
                    {child.label}
                  </button>
                ))}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* ── Right panel ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-[46px] bg-[#2c3e50] flex items-center justify-between px-6 flex-shrink-0 shadow-md z-10">
          <span className="text-white font-bold text-[13px] tracking-wider uppercase select-none">
            VELSON - ERP WEB APPLICATION
          </span>
          <div className="flex items-center gap-3">
            <span className="text-white/75 text-[13px]">
              Hi <span className="font-semibold text-white">superadmin</span> !
            </span>
            <div className="w-8 h-8 bg-[#0097A7] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#007a87] transition-colors">
              <User size={15} className="text-white" />
            </div>
            <ChevronDown size={13} className="text-white/50" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f4f6f8]">
          {children}
        </main>
      </div>
    </div>
  )
}
