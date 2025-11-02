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


export const attachLoaderInterceptors = (loader: {
  startLoading: () => void
  stopLoading: (error?: boolean) => void
}) => {
  $axios.interceptors.request.use(
    (config) => {
      loader.startLoading()
      return config
    },
    (error) => {
      loader.stopLoading(true)
      return Promise.reject(error)
    }
  )

  $axios.interceptors.response.use(
    (response) => {
      loader.stopLoading(false)
      return response
    },
    (error) => {
      loader.stopLoading(true)
      return Promise.reject(error)
    }
  )
}