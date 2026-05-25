import axios from 'axios'

const http = axios.create({
  baseURL: '/api/v1/shipping',
  timeout: 10000
})

http.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data
    if (code !== 200) {
      console.error(`API error: ${msg}`)
      return Promise.reject(new Error(msg))
    }
    return data
  },
  (error) => Promise.reject(error)
)

export default http
