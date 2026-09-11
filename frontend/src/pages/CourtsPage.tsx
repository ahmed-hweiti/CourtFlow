import { useState, useEffect } from 'react'
import CourtCard from '../components/CourtCard'
import type { Court } from '../types/Court'
import { getCourts } from '../api/courtsApi'
import './CourtsPage.css'

function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('All Sports')

  useEffect(() => {
    getCourts()
      .then((data) => {
        setCourts(data)
      })
      .catch(() => {
        setError('Unable to load courts. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredCourts = courts.filter((court) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      term === '' ||
      court.name.toLowerCase().includes(term) ||
      court.location.toLowerCase().includes(term)

    const matchesSport =
      selectedSport === 'All Sports' || court.sport === selectedSport

    return matchesSearch && matchesSport
  })

  return (
    <section className="courts-page">
      <h1 className="courts-page-heading">Courts</h1>
      <p className="courts-page-description">
        Browse available courts near you and find the perfect spot to play.
      </p>
      <div className="courts-filters">
        <input
          className="courts-search-input"
          type="text"
          placeholder="Search courts by name or location"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          className="courts-sport-select"
          value={selectedSport}
          onChange={(event) => setSelectedSport(event.target.value)}
        >
          <option value="All Sports">All Sports</option>
          <option value="Football">Football</option>
          <option value="Padel">Padel</option>
          <option value="Basketball">Basketball</option>
          <option value="Tennis">Tennis</option>
        </select>
      </div>
      {loading && <p>Loading courts...</p>}
      {error && <p className="courts-no-results">{error}</p>}
      {!loading && !error && filteredCourts.length === 0 && (
        <p className="courts-no-results">No courts found.</p>
      )}
      {!loading && !error && filteredCourts.length > 0 && (
        <div className="courts-grid">
          {filteredCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CourtsPage
