import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ property }) {
  const {
    _id,
    id,
    idOwner,
    name,
    addressProperty,
    address,
    priceProperty,
    price,
    imageUrl,
    image
  } = property

  // Obtener la URL de la imagen desde diferentes posibles estructuras del backend
  const getImageUrl = () => {
    if (image?.file) return image.file
    if (imageUrl) return imageUrl
    return 'https://via.placeholder.com/800x500/E0E0E0/888888?text=No+Image'
  }

  const propertyId = _id || id
  const propertyName = name || 'Property'
  const propertyAddress = addressProperty || address || 'No address'
  const propertyPrice = priceProperty || price || 0

  // Redondear el precio
  const formatPrice = (price) => {
    const rounded = Math.round(price)
    return rounded.toLocaleString('en-US')
  }

  return (
    <div className="card">
      <div className="card-image">
        <img src={getImageUrl()} alt={propertyName} />
      </div>
      <div className="card-body">
        <div className="card-status-bar">
          <div className="card-status">
            <span className="status-dot"></span>
            <span className="status-label">FOR SALE</span>
          </div>
        </div>
        
        <div className="card-price">${formatPrice(propertyPrice)}</div>
        <h3 className="card-title">{propertyName}</h3>
        <div className="card-sub">{propertyAddress}</div>
        
        <div className="card-actions">
          <Link to={`/properties/${propertyId}`} className="btn small">VER DETALLES</Link>
        </div>
      </div>
    </div>
  )
}
