import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// Landing Page
import LandingPage from "./pages/LandingPage"

// Auth Pages
import Login from "./pages/Login"
import Register from "./pages/Register"

// Dashboards
import FarmerDashboard from "./pages/dashboards/FarmerDashboard"
import LandownerDashboard from "./pages/dashboards/LandownerDashboard"
import BankDashboard from "./pages/dashboards/BankDashboard"
import StoreDashboard from "./pages/dashboards/StoreDashboard"
import InstrumentOwnerDashboard from "./pages/dashboards/InstrumentOwnerDashboard"

// Farmer Pages
import RentedLand from "./pages/farmer/RentedLand"
import BankLoans from "./pages/farmer/BankLoans"
import PesticideInstallments from "./pages/farmer/PesticideInstallments"
import SharedProject from "./pages/farmer/SharedProject"
import RentInstruments from "./pages/farmer/RentInstruments"
import InstrumentRentals from "./pages/farmer/InstrumentRentals"

// Landowner Pages
import RentLand from "./pages/landowner/RentLand"
import LandStatus from "./pages/landowner/LandStatus"
import LandRequests from "./pages/landowner/LandRequests"

// Bank Pages
import CreateLoan from "./pages/bank/CreateLoan"
import LoanStatus from "./pages/bank/LoanStatus"
import LoanRequests from "./pages/bank/LoanRequests"

// Store Pages
import CreateInstallment from "./pages/store/CreateInstallment"
import InstallmentStatus from "./pages/store/InstallmentStatus"
import InstallmentRequests from "./pages/store/InstallmentRequests"

// Instrument Owner Pages
import PostInstrument from "./pages/instrument-owner/PostInstrument"
import InstrumentStatus from "./pages/instrument-owner/InstrumentStatus"
import InstrumentRequests from "./pages/instrument-owner/InstrumentRequests"

// Context
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  // Helper function to map database roles to route roles

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Farmer */}
            <Route
              path="/dashboard/farmer"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/rented-land"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <RentedLand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/bank-loans"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <BankLoans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/pesticide-installments"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <PesticideInstallments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/shared-project"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <SharedProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/instruments"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <RentInstruments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/instruments/status"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <InstrumentRentals />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Landowner */}
            <Route
              path="/dashboard/landowner"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <LandownerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landowner/rent-land"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <RentLand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landowner/status"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <LandStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landowner/requests"
              element={
                <ProtectedRoute allowedRole="landowner">
                  <LandRequests />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Bank */}
            <Route
              path="/dashboard/bank"
              element={
                <ProtectedRoute allowedRole="bank">
                  <BankDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/create-loan"
              element={
                <ProtectedRoute allowedRole="bank">
                  <CreateLoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/status"
              element={
                <ProtectedRoute allowedRole="bank">
                  <LoanStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/requests"
              element={
                <ProtectedRoute allowedRole="bank">
                  <LoanRequests />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Store (Pesticide Store) */}
            <Route
              path="/dashboard/pesticide_store"
              element={
                <ProtectedRoute allowedRole="pesticide_store">
                  <StoreDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/create-installment"
              element={
                <ProtectedRoute allowedRole="pesticide_store">
                  <CreateInstallment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/status"
              element={
                <ProtectedRoute allowedRole="pesticide_store">
                  <InstallmentStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/requests"
              element={
                <ProtectedRoute allowedRole="pesticide_store">
                  <InstallmentRequests />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Instrument Owner */}
            <Route
              path="/dashboard/instrument_owner"
              element={
                <ProtectedRoute allowedRole="instrument_owner">
                  <InstrumentOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instrument-owner/post"
              element={
                <ProtectedRoute allowedRole="instrument_owner">
                  <PostInstrument />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instrument-owner/status"
              element={
                <ProtectedRoute allowedRole="instrument_owner">
                  <InstrumentStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instrument-owner/requests"
              element={
                <ProtectedRoute allowedRole="instrument_owner">
                  <InstrumentRequests />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
