"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth()

  console.log("ProtectedRoute - Current user:", user)
  console.log("ProtectedRoute - Allowed role:", allowedRole)

  if (!user) {
    // Not logged in, redirect to login
    console.log("ProtectedRoute - No user, redirecting to login")
    return <Navigate to="/login" replace />
  }

  // Check if the role from the database matches the expected role in the route
  console.log(`ProtectedRoute - Comparing user role "${user.role}" with allowed role "${allowedRole}"`)

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    console.log(`ProtectedRoute - Role mismatch, redirecting to /dashboard/${user.role}`)
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }

  return children
}

export default ProtectedRoute
