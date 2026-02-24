import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Documents } from './pages/Documents'
import { Expenses } from './pages/Expenses'
import { AddInvoice } from './pages/AddInvoice'
import { AddIncomingInvoice } from './pages/AddIncomingInvoice'
import { ViewInvoice } from './pages/ViewInvoice'
import { AutoInvoices } from './pages/AutoInvoices'
import { AutoInvoiceAdd } from './pages/AutoInvoiceAdd'
import { Offers } from './pages/Offers'
import { AddOffer } from './pages/AddOffer'
import { ClientsPage } from './pages/ClientsPage'
import { AddClients } from './pages/AddClients'
import { StoreHouseParts } from './pages/StoreHouseParts'
import { Orders } from './pages/Orders'
import { AddOrder } from './pages/AddOrder'
import { Repairs } from './pages/Repairs'
import { AddRepairs } from './pages/AddRepairs'
import { Employees } from './pages/Employees'
import { AddEmployees } from './pages/AddEmployees'
import { AddStoreHouseParts } from './pages/AddStoreHouseParts'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="add-invoice" element={<AddInvoice />} />
          <Route path="add-incoming-invoice" element={<AddIncomingInvoice />} />
          <Route path="auto-invoice" element={<AutoInvoices />} />
          <Route path="auto-invoice-add" element={<AutoInvoiceAdd />} />
          <Route path="offers" element={<Offers />} />
          <Route path="add-offer" element={<AddOffer />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="add-clients" element={<AddClients />} />
          <Route path="storeHouseParts" element={<StoreHouseParts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="repairs" element={<Repairs />} />
          <Route path="add-repair" element={<AddRepairs />} />
          <Route path="employees" element={<Employees />} />
          <Route path="add-employee" element={<AddEmployees />} />
          <Route path="add-items" element={<AddStoreHouseParts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="view-invoice" element={<ViewInvoice />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
