import { useState } from 'react'
import CourtCard from '../components/CourtCard'
import type { Court } from '../types/Court'
import './CourtsPage.css'

const courts: Court[] = [
  {
    id: 1,
    name: 'Abdoun Football Ground',
    sport: 'Football',
    location: 'Abdoun, Amman',
    pricePerHour: 25,
    available: true,
  },
  {
    id: 2,
    name: 'Tlaa Al Ali Padel Arena',
    sport: 'Padel',
    location: 'Tlaa Al Ali, Amman',
    pricePerHour: 20,
    available: true,
  },
  {
    id: 3,
    name: 'Sports City Basketball Court',
    sport: 'Basketball',
    location: 'Al Hussein Sports City, Amman',
    pricePerHour: 15,
    available: false,
  },
  {
    id: 4,
    name: 'Al Shmesani Tennis Club',
    sport: 'Tennis',
    location: 'Al Shmesani, Amman',
    pricePerHour: 30,
    available: true,
  },
  {
    id: 5,
    name: 'Sweifieh Indoor Football Hall',
    sport: 'Football',
    location: 'Sweifieh, Amman',
    pricePerHour: 28,
    available: false,
  },
  {
    id: 6,
    name: 'Al Weibdeh Community Padel Court',
    sport: 'Padel',
    location: 'Al Weibdeh, Amman',
    pricePerHour: 18,
    available: true,
  },
]

function CourtsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('All Sports')

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
      {filteredCourts.length === 0 ? (
        <p className="courts-no-results">No courts found.</p>
      ) : (
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