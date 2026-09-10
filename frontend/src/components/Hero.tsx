import { Link } from 'react-router'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-heading">Book Your Perfect Court</h1>
      <p className="hero-description">
        CourtFlow makes it easy to find, book, and manage sports courts near you.
        Spend less time organizing and more time playing.
      </p>
      <div className="hero-buttons">
        <Link to="/courts" className="btn-primary">
          Find a Court
        </Link>
        <Link to="/my-bookings" className="btn-secondary">
          View My Bookings
        </Link>
      </div>
    </section>
  )
}

export default Hero