"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { authService, User, LoginData, SignupData } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const isAuthenticated = !!user && authService.isAuthenticated()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile()
          setUser(profile)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Clear invalid tokens
        await authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true)
      const response = await authService.login(data)

      if (response.success && response.data) {
        setUser(response.data.user)
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        })
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true)
      const response = await authService.signup(data)

      if (response.success && response.data) {
        setUser(response.data.user)
        toast({
          title: 'Account created',
          description: `Welcome to Light Charity, ${
            data.userType === 'donor' 
              ? `${data.firstName} ${data.lastName}` 
              : data.name
          }!`,
        })
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      let errorMessage = 'Registration failed. Please try again.'
      
      // Handle specific error messages
      if (error.message.includes('already exists')) {
        errorMessage = 'An account with this email already exists.'
      }
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    try {
      if (authService.isAuthenticated()) {
        const profile = await authService.getProfile()
        setUser(profile)
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
      // If profile refresh fails, user might need to re-authenticate
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 