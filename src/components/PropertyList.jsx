import React, { useEffect, useState } from 'react'
import { getProperties, deleteProperty } from '../services/api'
import Filters from './Filters'
import PropertyCard from './PropertyCard'

export default function PropertyList() {
  const [filters, setFilters] = useState({})
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [filterOpen, setFilterOpen] = useState(false)
  const pageSize = 10

  const load = async (f = filters, page = currentPage) => {
    try {
      setLoading(true)
      setError(null)
      console.log('═'.repeat(80))
      console.log('🔄 [PropertyList] Loading page:', page, 'with filters:', f)
      const data = await getProperties(f, page, pageSize)
      
      // El backend DEBE devolver { items: [...], total: N } para paginación
      if (Array.isArray(data)) {
        console.log('⚠️ [PropertyList] Backend returned plain array (no pagination)')
        setProperties(data)
        setTotal(data.length)
        setTotalPages(1)
      } else {
        console.log('✅ [PropertyList] Backend returned paginated response')
        setProperties(data.items || data.properties || [])
        const totalItems = data.total || 0
        setTotal(totalItems)
        setTotalPages(Math.ceil(totalItems / pageSize))
        console.log('📊 [PropertyList] Set state - Properties:', (data.items || data.properties || []).length, '| Total in DB:', totalItems, '| Total pages:', Math.ceil(totalItems / pageSize))
      }
      
      console.log('✅ [PropertyList] Successfully loaded page', page)
      console.log('═'.repeat(80))
    } catch (err) {
      console.error('❌ [PropertyList] Error loading properties:', err)
      console.error('📛 Error details:', err.response?.data || err.message)
      setError('Error cargando propiedades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(filters, 1) }, [])

  const applyFilters = (f) => {
    setFilters(f)
    setCurrentPage(1)
    load(f, 1)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
    load(filters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generar números de página para mostrar (1 2 3 4 5 ...)
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 7 // máximo de números visibles
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar con puntos suspensivos
      if (currentPage <= 4) {
        // Al inicio: 1 2 3 4 5 ... última
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Al final: 1 ... antepenúltima penúltima última
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
      } else {
        // En medio: 1 ... actual-1 actual actual+1 ... última
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div>
      <div className="filter-bar">
        <button className="btn" onClick={() => setFilterOpen(true)}>
          <span>☰</span> FILTERS
        </button>
      </div>

      <Filters onApply={applyFilters} isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      {loading && <div className="info">Cargando propiedades...</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        {properties.length === 0 && !loading && <div className="info">No se encontraron propiedades</div>}
        {properties.map(p => (
          <PropertyCard key={p._id || p.id} property={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn small btn-page" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          
          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`btn small btn-page ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            className="btn small btn-page" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
          
          <span className="page-info">({total} total)</span>
        </div>
      )}
    </div>
  )
}
