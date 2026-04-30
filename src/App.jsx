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
import {
  TaxLedgerMaster,
  DashboardPage,
} from './pages/OtherPages'

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
  QuotationDetails:  <QuotationDetails />,
}

export default function App() {
  const [page, setPage] = useState('Dashboard')

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {PAGES[page] ?? <DashboardPage />}
    </Layout>
  )
}
