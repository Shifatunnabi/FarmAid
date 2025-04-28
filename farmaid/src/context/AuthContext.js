"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { authApi } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      console.log("Login credentials:", credentials)
      const response = await authApi.login(credentials)
      console.log("Login response:", response)
      const userData = response.user

      // Log the user data to see what we're getting from the API
      console.log("User data from login:", userData)

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user) {
        await authApi.logout(user.id)
      }
      setUser(null)
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Logout error:", error)
      // Still remove user from local state even if API call fails
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  const register = async (userData) => {
    try {
      console.log("Register data:", userData)
      const response = await authApi.register(userData)
      console.log("Register response:", response)
      const newUser = response.user

      // Log the user data to see what we're getting from the API
      console.log("New user data from register:", newUser)

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return newUser
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
