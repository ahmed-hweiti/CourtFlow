import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'

function HomePage() {
  return (
    <>
      <Hero />
      <section className="features">
        <h2 className="features-heading">Why CourtFlow?</h2>
        <div className="features-grid">
          <FeatureCard
            title="Find Courts"
            description="Search for available courts by sport, location, and time slot."
          />
          <FeatureCard
            title="Easy Booking"
            description="Reserve your court in seconds with our simple booking process."
          />
          <FeatureCard
            title="Manage Schedule"
            description="View, reschedule, or cancel your bookings anytime."
          />
        </div>
      </section>
    </>
  )
}

export default HomePage