import api from './axios'
import type { AuthToken, AdminUser } from '@/types'

export const login = async (username: string, password: string): Promise<AuthToken> => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  
  const { data } = await api.post<AuthToken>('/api/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export const getMe = async (): Promise<AdminUser> => {
  const { data } = await api.get<AdminUser>('/api/auth/me')
  return data
}

export const logoutApi = async (): Promise<void> => {
  await api.post('/api/auth/logout')
}