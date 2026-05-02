import { useState } from 'react'
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
import { TaxLedgerMaster, DashboardPage } from './pages/OtherPages'
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

const PAGES = {
  Dashboard:      <DashboardPage />,
  PartNumberBase: <PartNumberBaseMaster />,
  DropDownName:   <DropDownNameMaster />,
  DropDownList:   <DropDownListMaster />,
  TaxLedger:      <TaxLedgerMaster />,
  TaxMaster:      <TaxMaster />,
  ItemGroup:      <ItemGroupMaster />,
  ItemMaster:     <ItemMaster />,
  SupplierMaster: <SupplierMaster />,
  CustomerMaster:    <CustomerMaster />,
  VehicleMaster:     <VehicleMaster />,
  QuotationEntry:    <QuotationEntry />,
  QuotationDetails:     <QuotationDetails />,
  PurchaseOrderEntry:   <PurchaseOrderEntry />,
  PurchaseOrderDetails: <PurchaseOrderDetails />,
  MaterialRequestEntry: <MaterialRequestEntry />,
  PrintMaterialRequest:  <PrintMaterialRequest />,
  GateEntry:             <GateEntry />,
  GRNEntry:              <GRNEntry />,
  GRNEntryReport:        <GRNEntryReport />,
  // ── New Master Pages ──
  CompanyMaster:       <CompanyMaster />,
  EmployeeMaster:      <EmployeeMaster />,
  LedgerGroupMaster:   <LedgerGroupMaster />,
  MachineMaster:       <MachineMaster />,
  VehicleServiceMaster:<VehicleServiceMaster />,
  ContractorMaster:    <ContractorMaster />,
  ProcessMaster:       <ProcessMaster />,
  PartUsageList:       <PartUsageList />,
  QCCheckMethod:       <QCCheckMethod />,
  QCInspectionChar:    <QCInspectionChar />,
  QCStandardMaster:    <QCStandardMaster />,
  AutoPO:              <AutoPO />,
  SystemInfoMaster:    <SystemInfoMaster />,
  DBCopy:              <DBCopy />,
  RestoreDB:           <RestoreDB />,
}

export default function App() {
  const [page, setPage] = useState('Dashboard')

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {PAGES[page] ?? <DashboardPage />}
    </Layout>
  )
}
