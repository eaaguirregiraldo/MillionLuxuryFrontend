import React from 'react'
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'

const sample = {
  _id: '1',
  idOwner: 'owner1',
  name: 'Casa Bonita',
  addressProperty: 'Calle 123',
  priceProperty: 250000,
  imageUrl: ''
}

test('renders property card', () => {
  render(
    <MemoryRouter>
      <PropertyCard property={sample} onDelete={() => {}} />
    </MemoryRouter>
  )
  // Basic presence assertions compatible with Vitest environment
  expect(screen.getByText('Casa Bonita')).toBeTruthy()
  expect(screen.getByText(/Calle 123/)).toBeTruthy()
  expect(screen.getByText(/250,000/)).toBeTruthy()
})
