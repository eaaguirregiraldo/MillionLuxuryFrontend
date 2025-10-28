import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProperty, getOwner } from '../services/api'

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        console.log('═'.repeat(80))
        console.log('🔄 [PropertyDetails] Loading property with ID:', id)
        const data = await getProperty(id)
        console.log('✅ [PropertyDetails] Property loaded successfully')
        setProperty(data)
        
        // Cargar información del owner si existe idOwner o ownerId
        if (data.idOwner || data.ownerId) {
          const ownerId = data.idOwner || data.ownerId
          console.log('🔄 [PropertyDetails] Loading owner with ID:', ownerId)
          try {
            const ownerData = await getOwner(ownerId)
            console.log('✅ [PropertyDetails] Owner loaded successfully:', ownerData)
            setOwner(ownerData)
          } catch (ownerErr) {
            console.warn('⚠️ [PropertyDetails] Could not load owner:', ownerErr)
            console.warn('📛 Owner error details:', ownerErr.response?.data || ownerErr.message)
            // No establecer error general, solo no mostrar owner
          }
        } else {
          console.log('ℹ️ [PropertyDetails] No owner ID found in property data')
        }
        
        console.log('═'.repeat(80))
      } catch (err) {
        console.error('❌ [PropertyDetails] Error loading property:', err)
        console.error('📛 Error details:', err.response?.data || err.message)
        setError('No se pudo cargar la propiedad')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="info">Cargando...</div>
  if (error) return <div className="error">{error}</div>
  if (!property) return null

  const { 
    name, 
    addressProperty, 
    address,
    priceProperty, 
    price,
    imageUrl, 
    image,
    images,
    idOwner 
  } = property

  // Obtener todas las imágenes de la propiedad
  const getAllImages = () => {
    const imagesList = []
    
    console.log('🖼️ [PropertyDetails] Getting all images from property:', property)
    
    // Verificar si existe un array de imágenes
    if (images && Array.isArray(images) && images.length > 0) {
      console.log('📸 [PropertyDetails] Found images array with', images.length, 'images')
      
      // En la vista de detalles, mostrar TODAS las imágenes (enabled o no)
      images.forEach((img, index) => {
        if (img?.file) {
          console.log(`  ✅ Image ${index + 1}:`, img.file, '| enabled:', img.enabled)
          imagesList.push(img.file)
        } else if (typeof img === 'string') {
          console.log(`  ✅ Image ${index + 1}:`, img)
          imagesList.push(img)
        }
      })
    }
    
    // Si no hay array de imágenes, intentar con la imagen única
    if (imagesList.length === 0) {
      console.log('⚠️ [PropertyDetails] No images array found, trying single image fallback')
      if (image?.file) {
        console.log('  ✅ Using image.file:', image.file)
        imagesList.push(image.file)
      } else if (imageUrl) {
        console.log('  ✅ Using imageUrl:', imageUrl)
        imagesList.push(imageUrl)
      }
    }
    
    console.log('🎨 [PropertyDetails] Total images to show:', imagesList.length)
    
    // Si no hay ninguna imagen, retornar placeholder
    return imagesList.length > 0 ? imagesList : ['https://via.placeholder.com/1200x750/E0E0E0/888888?text=No+Image']
  }

  const nextImage = () => {
    const imagesList = getAllImages()
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length)
  }

  const prevImage = () => {
    const imagesList = getAllImages()
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length)
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  const getOwnerImageUrl = () => {
    if (!owner) return 'https://via.placeholder.com/200x200/E0E0E0/888888?text=No+Photo'
    
    console.log('👤 [PropertyDetails] Getting owner photo from:', owner)
    
    // Primero verificar si photo es un string directo
    if (typeof owner.photo === 'string') {
      console.log('  ✅ Using owner.photo (string):', owner.photo)
      return owner.photo
    }
    
    // Luego verificar estructura anidada photo.file
    if (owner.photo?.file) {
      console.log('  ✅ Using owner.photo.file:', owner.photo.file)
      return owner.photo.file
    }
    
    // Verificar image como string directo
    if (typeof owner.image === 'string') {
      console.log('  ✅ Using owner.image (string):', owner.image)
      return owner.image
    }
    
    // Verificar estructura anidada image.file
    if (owner.image?.file) {
      console.log('  ✅ Using owner.image.file:', owner.image.file)
      return owner.image.file
    }
    
    // Otros fallbacks
    if (owner.imageUrl) {
      console.log('  ✅ Using owner.imageUrl:', owner.imageUrl)
      return owner.imageUrl
    }
    
    if (owner.photoUrl) {
      console.log('  ✅ Using owner.photoUrl:', owner.photoUrl)
      return owner.photoUrl
    }
    
    console.log('  ⚠️ No photo found, using placeholder')
    return 'https://via.placeholder.com/200x200/E0E0E0/888888?text=No+Photo'
  }

  const propertyName = name || 'Property'
  const propertyAddress = addressProperty || address || 'No address'
  const propertyPrice = priceProperty || price || 0

  // Redondear el precio
  const formatPrice = (price) => {
    const rounded = Math.round(price)
    return rounded.toLocaleString('en-US')
  }

  // Formatear información del propietario
  const getOwnerInfo = () => {
    if (!owner) return null
    
    // El owner puede tener diferentes estructuras
    const ownerName = owner.name 
      || owner.fullName 
      || (owner.firstName && owner.lastName ? `${owner.firstName} ${owner.lastName}` : null)
      || 'N/A'
    
    const ownerEmail = owner.email || ''
    const ownerPhone = owner.phone || owner.phoneNumber || ''
    const ownerAddress = owner.address || ''
    
    return (
      <div className="owner-info">
        <div className="owner-photo-container">
          <img src={getOwnerImageUrl()} alt={ownerName} className="owner-photo" />
        </div>
        <div className="owner-details">
          <p><strong>NOMBRE:</strong> {ownerName}</p>
          {ownerEmail && <p><strong>EMAIL:</strong> {ownerEmail}</p>}
          {ownerPhone && <p><strong>TELÉFONO:</strong> {ownerPhone}</p>}
          {ownerAddress && <p><strong>DIRECCIÓN:</strong> {ownerAddress}</p>}
        </div>
      </div>
    )
  }

  const allImages = getAllImages()

  return (
    <div className="detail">
      <Link to="/" className="btn-link">← VOLVER AL LISTADO</Link>
      
      <div className="card-status-bar">
        <div className="card-status">
          <span className="status-dot"></span>
          <span className="status-label">FOR SALE</span>
        </div>
      </div>
      
      <div className="detail-grid">
        <div className="detail-images-section">
          {/* Galería de imágenes */}
          <div className="detail-gallery">
            {allImages.map((imageUrl, index) => (
              <div key={index} className="detail-gallery-item">
                <img src={imageUrl} alt={`${propertyName} - Imagen ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="detail-body">
          <div className="card-price">${formatPrice(propertyPrice)}</div>
          <h2>{propertyName}</h2>
          <p><strong>DIRECCIÓN:</strong> {propertyAddress}</p>
          
          {owner && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-main)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>PROPIETARIO</h3>
              {getOwnerInfo()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
