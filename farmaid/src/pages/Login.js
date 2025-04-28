"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Auth.css"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "farmer",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Submitting login with data:", formData)
      const userData = await login(formData)
      console.log("Logged in user role:", userData.role)

      console.log("Login successful, user data:", userData)

      // Map the database role to the route role
      const dashboardRole = userData.role

      console.log(`Navigating to dashboard/${dashboardRole}`)
      navigate(`/dashboard/${dashboardRole}`)
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">🌾 Farm Aid</h1>
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="farmer">Farmer</option>
              <option value="landowner">Landowner</option>
              <option value="bank">Bank</option>
              <option value="pesticide_store">Pesticide Store</option>
              <option value="instrument_owner">Instrument Owner</option>
            </select>
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="auth-link back-link">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
