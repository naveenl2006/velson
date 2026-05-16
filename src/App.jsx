import React, { useState } from 'react'
import Layout from './components/Layout'
import ItemMaster from './pages/ItemMaster'
import PartNumberBaseMaster from './pages/PartNumberBaseMaster'
import DropDownNameMaster from './pages/DropDownNameMaster'
import DropDownListMaster from './pages/DropDownListMaster'
import TaxMaster from './pages/TaxMaster'
import ItemGroupMaster from './pages/ItemGroupMaster'
import SupplierMaster from './pages/SupplierMaster'
import CustomerMaster from './pages/CustomerMaster'
import VehicleMaster from './pages/VehicleMaster'
import QuotationEntry from './pages/QuotationEntry'
import QuotationDetails from './pages/QuotationDetails'
import PurchaseOrderEntry from './pages/PurchaseOrderEntry'
import PurchaseOrderDetails from './pages/PurchaseOrderDetails'
import MaterialRequestEntry from './pages/MaterialRequestEntry'
import PrintMaterialRequest from './pages/PrintMaterialRequest'
import GateEntry from './pages/GateEntry'
import GRNEntry from './pages/GRNEntry'
import GRNEntryReport from './pages/GRNEntryReport'
import { DashboardPage } from './pages/OtherPages'
import TaxLedgerMaster from './pages/TaxLedgerMaster'
// ── New Master Pages ──
import CompanyMaster from './pages/CompanyMaster'
import EmployeeMaster from './pages/EmployeeMaster'
import LedgerGroupMaster from './pages/LedgerGroupMaster'
import MachineMaster from './pages/MachineMaster'
import VehicleServiceMaster from './pages/VehicleServiceMaster'
import ContractorMaster from './pages/ContractorMaster'
import ProcessMaster from './pages/ProcessMaster'
import PartUsageList from './pages/PartUsageList'
import QCCheckMethod from './pages/QCCheckMethod'
import QCInspectionChar from './pages/QCInspectionChar'
import QCStandardMaster from './pages/QCStandardMaster'
import AutoPO from './pages/AutoPO'
import SystemInfoMaster from './pages/SystemInfoMaster'
import DBCopy from './pages/DBCopy'
import RestoreDB from './pages/RestoreDB'
import ReceiptEntry from './pages/ReceiptEntry'
import ReceiptDetails from './pages/ReceiptDetails'
import VoucherEntry from './pages/VoucherEntry'
import DayReport from './pages/DayReport'
import DayBook from './pages/DayBook'
import LedgerBalance from './pages/LedgerBalance'
import MonthlyLedgerBalance from './pages/MonthlyLedgerBalance'
import OutstandingReceiptReport from './pages/OutstandingReceiptReport'
import PaymentEntry from './pages/PaymentEntry'
import PaymentDetails from './pages/PaymentDetails'
import JournalEntry from './pages/JournalEntry'
import BOMUpload from './pages/BOMUpload'
import CustomerwiseBOMReport from './pages/CustomerwiseBOMReport'
import IndexCreation from './pages/IndexCreation'
import IndexCreationReport from './pages/IndexCreationReport'
import UploadBOM from './pages/UploadBOM'
import MainIndex from './pages/MainIndex'
import MainIndexReport from './pages/MainIndexReport'
import ViewModel from './pages/ViewModel'
import CustomerComplaintEntry from './pages/CustomerComplaintEntry'
import DCEntry from './pages/DCEntry'
import MachineBreakDown from './pages/MachineBreakDown'
import BreakDownClearence from './pages/BreakDownClearence'
import BreakDownAcceptance from './pages/BreakDownAcceptance'
import BreakDownApprovalList from './pages/BreakDownApprovalList'
import QCRejectionDetails from './pages/QCRejectionDetails'
import NCApproval from './pages/NCApproval'
import NCJobCreated from './pages/NCJobCreated'
import NCDCEntry from './pages/NCDCEntry'
import NCDCDetails from './pages/NCDCDetails'
import JobList from './pages/JobList'
import BarcodeDetails from './pages/BarcodeDetails'
import AutoJobEntry from './pages/AutoJobEntry'
import ServiceJobEntryDetails from './pages/ServiceJobEntryDetails'
import ConformationList from './pages/ConformationList'
import ConformationEntryDetails from './pages/ConformationEntryDetails'
import ProcessCard from './pages/ProcessCard'
import RawMaterialIssue from './pages/RawMaterialIssue'
import RawMaterialIssuedDetails from './pages/RawMaterialIssuedDetails'
import MaterialRequestRejectionList from './pages/MaterialRequestRejectionList'
import InwardReports from './pages/InwardReports'
import OutwardDetails from './pages/OutwardDetails'
import MinStock from './pages/MinStock'
import MaterialIssuedDetails from './pages/MaterialIssuedDetails'
import CompletedJobList from './pages/CompletedJobList'
import PurchaseOrderReport from './pages/PurchaseOrderReport'
import PurchaseOrderOverallReport from './pages/PurchaseOrderOverallReport'
import CurrentStock from './pages/CurrentStock'
import QCCompletedList from './pages/QCCompletedList'
import MaterialIssueCorrection from './pages/MaterialIssueCorrection'
import StockDetails from './pages/StockDetails'
import QCEntryReport from './pages/QCEntryReport'
import CreditSales from './pages/CreditSales'
import SalesDetails from './pages/SalesDetails'
import QuotationSales from './pages/QuotationSales'
import DCSales from './pages/DCSales'

import DrawingUpload from './pages/DrawingUpload'
import JobCardEntry from './pages/JobCardEntry'
import ProcessMenu from './pages/ProcessMenu'
import TechAutoJobEntry from './pages/TechAutoJobEntry'
import ViewJobStatus from './pages/ViewJobStatus'
import WaitingForApproval from './pages/WaitingForApproval'
import UpdateRouteDetails from './pages/UpdateRouteDetails'
import RejectedJobList from './pages/RejectedJobList'
import ProcessCompleted from './pages/ProcessCompleted'
import FileUploads from './pages/FileUploads'
import MRApproval from './pages/MRApproval'
import JobEntryClosed from './pages/JobEntryClosed'
import JobCardCancel from './pages/JobCardCancel'
import IPRApproval from './pages/IPRApproval'
import ReferenceMaster from './pages/ReferenceMaster'
import LoginPage from './pages/LoginPage'
import JobQtyMismatch from './pages/JobQtyMismatch'
import ProcessCardClose from './pages/ProcessCardClose'
import JobQCEntry from './pages/JobQCEntry'
import DCDetails from './pages/DCDetails'
import DCDetailsReport from './pages/DCDetailsReport'

import ServiceBillEntry from './pages/ServiceBillEntry'
import ServiceBillDetails from './pages/ServiceBillDetails'
import ServiceLabourBillDetails from './pages/ServiceLabourBillDetails'
import TempServiceBillDetails from './pages/TempServiceBillDetails'

const PAGES = {
  Dashboard: <DashboardPage />,
  PartNumberBase: <PartNumberBaseMaster />,
  DropDownName: <DropDownNameMaster />,
  DropDownList: <DropDownListMaster />,
  TaxLedger: <TaxLedgerMaster />,
  TaxMaster: <TaxMaster />,
  ItemGroup: <ItemGroupMaster />,
  ItemMaster: <ItemMaster />,
  SupplierMaster: <SupplierMaster />,
  CustomerMaster: <CustomerMaster />,
  VehicleMaster: <VehicleMaster />,
  QuotationEntry: <QuotationEntry />,
  QuotationDetails: <QuotationDetails />,
  PurchaseOrderEntry: <PurchaseOrderEntry />,
  PurchaseOrderDetails: <PurchaseOrderDetails />,
  MaterialRequestEntry: <MaterialRequestEntry />,
  PrintMaterialRequest: <PrintMaterialRequest />,
  GateEntry: <GateEntry />,
  GRNEntry: <GRNEntry />,
  GRNEntryReport: <GRNEntryReport />,
  // ── New Master Pages ──
  CompanyMaster: <CompanyMaster />,
  EmployeeMaster: <EmployeeMaster />,
  LedgerGroupMaster: <LedgerGroupMaster />,
  MachineMaster: <MachineMaster />,
  VehicleServiceMaster: <VehicleServiceMaster />,
  ContractorMaster: <ContractorMaster />,
  ProcessMaster: <ProcessMaster />,
  ReferenceMaster: <ReferenceMaster />,
  PartUsageList: <PartUsageList />,
  QCCheckMethod: <QCCheckMethod />,
  QCInspectionChar: <QCInspectionChar />,
  QCStandardMaster: <QCStandardMaster />,
  AutoPO: <AutoPO />,
  SystemInfoMaster: <SystemInfoMaster />,
  DBCopy: <DBCopy />,
  RestoreDB: <RestoreDB />,
  ReceiptEntry: <ReceiptEntry />,
  ReceiptDetails: <ReceiptDetails />,
  VoucherEntry: <VoucherEntry />,
  DayReport: <DayReport />,
  DayBook: <DayBook />,
  LedgerBalance: <LedgerBalance />,
  MonthlyLedgerBalance: <MonthlyLedgerBalance />,
  OutstandingReceiptReport: <OutstandingReceiptReport />,
  PaymentEntry: <PaymentEntry />,
  PaymentDetails: <PaymentDetails />,
  JournalEntry: <JournalEntry />,
  BOMUpload: <BOMUpload />,
  CustomerwiseBOMReport: <CustomerwiseBOMReport />,
  IndexCreation: <IndexCreation />,
  IndexCreationReport: <IndexCreationReport />,
  UploadBOM: <UploadBOM />,
  MainIndex: <MainIndex />,
  MainIndexReport: <MainIndexReport />,
  ViewModel: <ViewModel />,
  CustomerComplaintEntry: <CustomerComplaintEntry />,
  DCEntry: <DCEntry />,
  MachineBreakDown: <MachineBreakDown />,
  BreakDownClearence: <BreakDownClearence />,
  BreakDownAcceptance: <BreakDownAcceptance />,
  BreakDownApprovalList: <BreakDownApprovalList />,
  QCRejectionDetails: <QCRejectionDetails />,
  NCApproval: <NCApproval />,
  NCJobCreated: <NCJobCreated />,
  NCDCEntry: <NCDCEntry />,
  NCDCDetails: <NCDCDetails />,
  JobList: <JobList />,
  BarcodeDetails: <BarcodeDetails />,
  AutoJobEntry: <AutoJobEntry />,
  ServiceJobEntryDetails: <ServiceJobEntryDetails />,
  ConformationList: <ConformationList />,
  ConformationEntryDetails: <ConformationEntryDetails />,
  ProcessCard: <ProcessCard />,
  RawMaterialIssue: <RawMaterialIssue />,
  RawMaterialIssuedDetails: <RawMaterialIssuedDetails />,
  MaterialRequestRejectionList: <MaterialRequestRejectionList />,
  InwardReports: <InwardReports />,
  OutwardDetails: <OutwardDetails />,
  MinStock: <MinStock />,
  MaterialIssuedDetails: <MaterialIssuedDetails />,
  CompletedJobList: <CompletedJobList />,
  PurchaseOrderReport: <PurchaseOrderReport />,
  PurchaseOrderOverallReport: <PurchaseOrderOverallReport />,
  CurrentStock: <CurrentStock />,
  QCCompletedList: <QCCompletedList />,
  MaterialIssueCorrection: <MaterialIssueCorrection />,
  StockDetails: <StockDetails />,
  QCEntryReport: <QCEntryReport />,
  CreditSales: <CreditSales />,
  SalesDetails: <SalesDetails />,
  QuotationSales: <QuotationSales />,
  DCSales: <DCSales />,

  DCDetails: <DCDetails />,
  DCDetailsReport: <DCDetailsReport />,

  ServiceBillEntry: <ServiceBillEntry />,
  ServiceBillDetails: <ServiceBillDetails />,
  ServiceLabourBillDetails: <ServiceLabourBillDetails />,
  TempServiceBillDetails: <TempServiceBillDetails />,
  DrawingUpload: <DrawingUpload />,
  JobCardEntry: <JobCardEntry />,
  ProcessMenu: <ProcessMenu />,
  TechAutoJobEntry: <TechAutoJobEntry />,
  ViewJobStatus: <ViewJobStatus />,
  WaitingForApproval: <WaitingForApproval />,
  UpdateRouteDetails: <UpdateRouteDetails />,
  RejectedJobList: <RejectedJobList />,
  ProcessCompleted: <ProcessCompleted />,
  FileUploads: <FileUploads />,
  MRApproval: <MRApproval />,
  NCJobCreated: <NCJobCreated />,
  NCApproval: <NCApproval />,
  JobEntryClosed: <JobEntryClosed />,
  JobCardCancel: <JobCardCancel />,
  IPRApproval: <IPRApproval />,
  JobQtyMismatch: <JobQtyMismatch />,
  ProcessCardClose: <ProcessCardClose />,
  JobQCEntry: <JobQCEntry />,
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState('Dashboard')

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {React.cloneElement(PAGES[page] ?? <DashboardPage />, { onNavigate: setPage })}
    </Layout>
  )
}
