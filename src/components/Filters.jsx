import React, { useState } from 'react'

export default function Filters({ onApply, isOpen, onClose }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const priceRanges = [
    { label: 'Any', value: '' },
    { label: '$0 - $500K', min: 0, max: 500000 },
    { label: '$500K - $1M', min: 500000, max: 1000000 },
    { label: '$1M - $2M', min: 1000000, max: 2000000 },
    { label: '$2M - $5M', min: 2000000, max: 5000000 },
    { label: '$5M+', min: 5000000, max: '' }
  ]

  const submit = (e) => {
    e.preventDefault()
    onApply({ name: name.trim(), address: address.trim(), minPrice, maxPrice })
    if (onClose) onClose()
  }

  const clear = () => {
    setName('')
    setAddress('')
    setMinPrice('')
    setMaxPrice('')
    setPriceRange('')
    onApply({})
  }

  const handlePriceRangeClick = (range) => {
    setPriceRange(range.label)
    if (range.value === '') {
      setMinPrice('')
      setMaxPrice('')
    } else {
      setMinPrice(range.min || '')
      setMaxPrice(range.max || '')
    }
  }

  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose}></div>}
      <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-sidebar-header">
          <span className="filter-sidebar-title">FILTERS</span>
          <button type="button" className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit}>
          <div className="filter-section">
            <h3 className="filter-section-title">Property Name</h3>
            <input 
              className="filter-input"
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Search by name" 
            />
          </div>

          <div className="filter-section">
            <h3 className="filter-section-title">Address</h3>
            <input 
              className="filter-input"
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Search by address" 
            />
          </div>

          <div className="filter-section">
            <h3 className="filter-section-title">Price Range</h3>
            <div className="chip-grid">
              {priceRanges.map((range, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`filter-chip ${priceRange === range.label ? 'selected' : ''}`}
                  onClick={() => handlePriceRangeClick(range)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section-title">Custom Price</h3>
            <div className="price-inputs">
              <input 
                className="filter-input"
                type="number" 
                value={minPrice} 
                onChange={e => { setMinPrice(e.target.value); setPriceRange('') }} 
                placeholder="Min" 
              />
              <span className="price-separator">—</span>
              <input 
                className="filter-input"
                type="number" 
                value={maxPrice} 
                onChange={e => { setMaxPrice(e.target.value); setPriceRange('') }} 
                placeholder="Max" 
              />
            </div>
          </div>

          <div className="filter-actions">
            <button type="submit" className="btn btn-block">APPLY FILTERS</button>
            <button type="button" className="btn btn-secondary btn-block" onClick={clear}>CLEAR ALL</button>
          </div>
        </form>
      </aside>
    </>
  )
}
