import http from './http.js'

export function fetchVessels() {
  return http.get('/vessels')
}

export function fetchPorts() {
  return http.get('/ports')
}

export function fetchRoutes() {
  return http.get('/routes')
}

export function fetchIndices() {
  return http.get('/indices')
}
