import axios from 'axios'

import { useAuthStore } from '@/store/useAuthStore'

export const http = axios.create({
  baseURL: '/api',
})

http.interceptors.request.use((config) => {
  const access = useAuthStore.getState().access
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})
