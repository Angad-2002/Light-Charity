const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface User {
  _id: string
  email: string
  userType: 'donor' | 'hospital'
  firstName?: string
  lastName?: string
  name?: string
  phone: string
  postalCode: string
  isActive: boolean
  isEmailVerified: boolean
  bloodType?: string
  donationHistory?: Array<{
    date: string
    location: string
    bloodType: string
    quantity: number
  }>
  createdAt: string
  updatedAt: string
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupData {
  userType: 'donor' | 'hospital'
  email: string
  password: string
  phone: string
  postalCode: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  donorNumber?: string
  name?: string
  address?: string
  hospitalType?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    token: string
    refreshToken: string
  }
  errors?: Array<{ msg: string; param: string }>
}

class AuthService {
  private static instance: AuthService
  private token: string | null = null
  private refreshToken: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
      this.refreshToken = localStorage.getItem('refresh_token')
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Request failed')
    }

    return data
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      })

      if (response.success && response.data) {
        this.setTokens(response.data.token, response.data.refreshToken)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
      })

      if (response.success && response.data) {
        this.setTokens(response.data.token, response.data.refreshToken)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.makeRequest('/auth/profile')
      return response.data.user
    } catch (error) {
      throw error
    }
  }

  async updateProfile(profileData: any): Promise<void> {
    try {
      await this.makeRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      })
    } catch (error) {
      throw error
    }
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      await this.makeRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      })
    } catch (error) {
      throw error
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.makeRequest('/auth/deactivate', {
        method: 'PUT',
      })
      // Clear local storage after successful deactivation
      this.clearToken()
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.makeRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
    } catch (error) {
      throw error
    }
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      })

      if (response.success && response.data) {
        this.setTokens(response.data.token, response.data.refreshToken)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      this.clearTokens()
    }
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await this.makeRequest('/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      })

      if (response.success && response.data) {
        this.setTokens(response.data.token, this.refreshToken)
      }
    } catch (error) {
      this.clearTokens()
      throw error
    }
  }

  private setTokens(token: string, refreshToken: string): void {
    this.token = token
    this.refreshToken = refreshToken

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  private clearTokens(): void {
    this.token = null
    this.refreshToken = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const authService = AuthService.getInstance() 