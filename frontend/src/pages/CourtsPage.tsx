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
  return (
    <section className="courts-page">
      <h1 className="courts-page-heading">Courts</h1>
      <p className="courts-page-description">
        Browse available courts near you and find the perfect spot to play.
      </p>
      <div className="courts-grid">
        {courts.map((court) => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </section>
  )
}

export default CourtsPage