import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { ExecutiveDashboard } from './pages/Executive'
import { AROverview } from './pages/AR/Overview'
import { ARInvoices } from './pages/AR/Invoices'
import { ARCollections } from './pages/AR/Collections'
import { ARReconciliation } from './pages/AR/Reconciliation'
import { ARRetainage } from './pages/AR/Retainage'
import { ARAging } from './pages/AR/Aging'
import { APOverview } from './pages/AP/Overview'
import { APInvoices } from './pages/AP/Invoices'
import { APPurchaseOrders } from './pages/AP/PurchaseOrders'
import { APPayments } from './pages/AP/Payments'
import { APSubcontractors } from './pages/AP/Subcontractors'
import { APAging } from './pages/AP/Aging'
import { Settings } from './pages/Settings'
import { AuditLog } from './pages/AuditLog'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/ar" element={<AROverview />} />
          <Route path="/ar/invoices" element={<ARInvoices />} />
          <Route path="/ar/collections" element={<ARCollections />} />
          <Route path="/ar/reconciliation" element={<ARReconciliation />} />
          <Route path="/ar/retainage" element={<ARRetainage />} />
          <Route path="/ar/aging" element={<ARAging />} />
          <Route path="/ap" element={<APOverview />} />
          <Route path="/ap/invoices" element={<APInvoices />} />
          <Route path="/ap/purchase-orders" element={<APPurchaseOrders />} />
          <Route path="/ap/payments" element={<APPayments />} />
          <Route path="/ap/subcontractors" element={<APSubcontractors />} />
          <Route path="/ap/aging" element={<APAging />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
