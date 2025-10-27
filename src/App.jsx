import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PropertyList from './components/PropertyList'
import PropertyDetails from './components/PropertyDetails'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="brand">MILLION LUXURY</Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
        </Routes>
      </main>
      <footer className="footer">© 2025 MILLION LUXURY</footer>
    </div>
  )
}
