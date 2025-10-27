import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
})

export async function getProperties(filters = {}, page = 1, pageSize = 10) {
  // build query params: name, address, minPrice, maxPrice, page, pageSize
  const params = {}
  if (filters.name) params.name = filters.name
  if (filters.address) params.address = filters.address
  if (filters.minPrice !== undefined && filters.minPrice !== '') params.minPrice = filters.minPrice
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') params.maxPrice = filters.maxPrice
  
  // Paginación
  params.page = page
  params.pageSize = pageSize

  console.log('🚀 [API] GET /api/properties')
  console.log('📤 Request params:', params)
  console.log('🔗 Full URL:', `${BASE}/api/properties?${new URLSearchParams(params)}`)
  
  const resp = await client.get('/api/properties', { params })
  
  console.log('📥 [API] Response from GET /api/properties')
  console.log('📊 Status:', resp.status, resp.statusText)
  console.log('📄 Data:', resp.data)
  console.log('� Summary - Page:', page, '| Page Size:', pageSize, '| Total items:', resp.data?.total || resp.data?.length || 'unknown')
  console.log('─'.repeat(80))
  
  return resp.data
}

export async function getProperty(id) {
  console.log('🚀 [API] GET /api/properties/' + id)
  console.log('🔗 Full URL:', `${BASE}/api/properties/${id}`)
  
  const resp = await client.get(`/api/properties/${id}`)
  
  console.log('📥 [API] Response from GET /api/properties/' + id)
  console.log('📊 Status:', resp.status, resp.statusText)
  console.log('📄 Data:', resp.data)
  console.log('─'.repeat(80))
  
  return resp.data
}

export async function deleteProperty(id) {
  console.log('🚀 [API] DELETE /api/properties/' + id)
  console.log('🔗 Full URL:', `${BASE}/api/properties/${id}`)
  
  const resp = await client.delete(`/api/properties/${id}`)
  
  console.log('📥 [API] Response from DELETE /api/properties/' + id)
  console.log('📊 Status:', resp.status, resp.statusText)
  console.log('📄 Data:', resp.data)
  console.log('─'.repeat(80))
  
  return resp.data
}

export async function getOwner(id) {
  console.log('🚀 [API] GET /api/owners/' + id)
  console.log('🔗 Full URL:', `${BASE}/api/owners/${id}`)
  
  const resp = await client.get(`/api/owners/${id}`)
  
  console.log('📥 [API] Response from GET /api/owners/' + id)
  console.log('📊 Status:', resp.status, resp.statusText)
  console.log('📄 Owner Data:', resp.data)
  console.log('👤 Owner Details:')
  console.log('   - ID:', resp.data?.id || resp.data?._id || 'N/A')
  console.log('   - Name:', resp.data?.name || resp.data?.fullName || 'N/A')
  console.log('   - Email:', resp.data?.email || 'N/A')
  console.log('   - Phone:', resp.data?.phone || resp.data?.phoneNumber || 'N/A')
  console.log('─'.repeat(80))
  
  return resp.data
}
