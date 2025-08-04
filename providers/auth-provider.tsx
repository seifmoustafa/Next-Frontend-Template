"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  adminTypeName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Construct the API URL properly
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      const loginUrl = `${baseUrl}/Authentication/login/admin`

      console.log("Attempting login to:", loginUrl) // Debug log

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("Response status:", response.status) // Debug log

      if (!response.ok) {
        console.error("Response not ok:", response.status, response.statusText)
        return false
      }

      const data = await response.json()
      console.log("Login response:", data) // Debug log

      if (data.success && data.accessToken) {
        // Store tokens
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)

        // Get user data
        const userUrl = `${baseUrl}/admins/me`
        console.log("Fetching user data from:", userUrl) // Debug log

        const userResponse = await fetch(userUrl, {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
            Accept: "application/json",
          },
        })

        if (!userResponse.ok) {
          console.error("User fetch failed:", userResponse.status, userResponse.statusText)
          return false
        }

        const userData = await userResponse.json()
        console.log("User data:", userData) // Debug log
        setUser(userData)

        return true
      }

      console.error("Login failed - no success or token in response:", data)
      return false
    } catch (error) {
      console.error("Login error details:", error)

      // More specific error handling
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("Network error - check if API server is running and CORS is configured")
      }

      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    router.push("/login")
  }

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      const userUrl = `${baseUrl}/admins/me`

      const response = await fetch(userUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token is invalid
        console.log("Token invalid, clearing storage")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
