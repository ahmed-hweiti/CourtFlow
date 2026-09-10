import type { Court } from '../types/Court'
import './CourtCard.css'

interface CourtCardProps {
  court: Court
}

function CourtCard({ court }: CourtCardProps) {
  return (
    <article className="court-card">
      <div className="court-card-header">
        <h3 className="court-card-name">{court.name}</h3>
        <span
          className={`court-card-status ${court.available ? 'available' : 'unavailable'}`}
        >
          {court.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <p className="court-card-sport">{court.sport}</p>
      <p className="court-card-location">{court.location}</p>
      <p className="court-card-price">
        JOD {court.pricePerHour} / hour
      </p>
      <button className="court-card-button">View Court</button>
    </article>
  )
}

export default CourtCard