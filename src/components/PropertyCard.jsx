import React, { useState } from 'react'
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
    image,
    images
  } = property

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Obtener todas las imágenes de la propiedad
  const getAllImages = () => {
    const imagesList = []
    
    // Verificar si existe un array de imágenes
    if (images && Array.isArray(images) && images.length > 0) {
      images.forEach(img => {
        if (img?.file) {
          imagesList.push(img.file)
        } else if (typeof img === 'string') {
          imagesList.push(img)
        }
      })
    }
    
    // Si no hay array de imágenes, intentar con la imagen única
    if (imagesList.length === 0) {
      if (image?.file) {
        imagesList.push(image.file)
      } else if (imageUrl) {
        imagesList.push(imageUrl)
      }
    }
    
    // Si no hay ninguna imagen, retornar placeholder
    return imagesList.length > 0 ? imagesList : ['https://via.placeholder.com/800x500/E0E0E0/888888?text=No+Image']
  }

  const allImages = getAllImages()
  const currentImage = allImages[currentImageIndex]

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const goToImage = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(index)
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
        <div className="card-carousel">
          <img src={currentImage} alt={propertyName} className="card-carousel-image" />
          
          {allImages.length > 1 && (
            <>
              <button className="card-carousel-btn card-carousel-btn-prev" onClick={prevImage}>
                ‹
              </button>
              <button className="card-carousel-btn card-carousel-btn-next" onClick={nextImage}>
                ›
              </button>
              
              <div className="card-carousel-indicators">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`card-carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => goToImage(e, index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
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
