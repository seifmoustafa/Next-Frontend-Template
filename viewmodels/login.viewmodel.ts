import { useState, useCallback } from 'react'
import { useI18n } from '@/providers/i18n-provider'
import { AuthService, type IAuthService, type LoginRequest } from '@/services/auth.service'

export interface LoginViewModelState {
  username: string
  password: string
  showPassword: boolean
  isLoading: boolean
  error: string
}

export interface LoginViewModelActions {
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  togglePasswordVisibility: () => void
  handleLogin: (onSuccess: () => void) => Promise<void>
  clearError: () => void
}

export type LoginViewModel = LoginViewModelState & LoginViewModelActions

export function useLoginViewModel(authService?: IAuthService): LoginViewModel {
  const service = authService || new AuthService(undefined, t)
  const { t } = useI18n()

  const [state, setState] = useState<LoginViewModelState>({
    username: '',
    password: '',
    showPassword: false,
    isLoading: false,
    error: ''
  })

  const setUsername = useCallback((username: string) => {
    setState(prev => ({ ...prev, username, error: '' }))
  }, [])

  const setPassword = useCallback((password: string) => {
    setState(prev => ({ ...prev, password, error: '' }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setState(prev => ({ ...prev, showPassword: !prev.showPassword }))
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: '' }))
  }, [])

  const handleLogin = useCallback(async (onSuccess: () => void) => {
    if (!state.username.trim() || !state.password.trim()) {
      setState(prev => ({ ...prev, error: t('auth.missingCredentials') }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      console.log('LoginViewModel: Starting login process')

      const credentials: LoginRequest = {
        username: state.username.trim(),
        password: state.password
      }

      // Attempt login
      const loginResponse = await service.login(credentials)

      if (!loginResponse.success || !loginResponse.accessToken) {
        throw new Error(t('auth.invalidResponse'))
      }

      // Store tokens
      localStorage.setItem('accessToken', loginResponse.accessToken)
      localStorage.setItem('refreshToken', loginResponse.refreshToken)

      console.log('LoginViewModel: Tokens stored, fetching user data')

      // Get user data
      const userData = await service.getCurrentUser()

      console.log('LoginViewModel: Login successful for user:', userData.username)

      // Call success callback
      onSuccess()

    } catch (error) {
      console.error('LoginViewModel: Login failed:', error)
      
      let errorMessage = t('auth.loginFailed')
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        password: '' // Clear password on error
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.username, state.password, service])

  return {
    ...state,
    setUsername,
    setPassword,
    togglePasswordVisibility,
    handleLogin,
    clearError
  }
}
