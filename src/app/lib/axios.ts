import axios from 'axios'

const $axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

$axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

$axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (typeof window !== 'undefined' && (status === 401 || status === 422)) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')

      window.location.href = 'http://localhost:3000/login'
    }

    console.error(
      'Error en la petición:',
      error.response?.data || error.message
    )

    return Promise.reject(error)
  }
)

export default $axios
