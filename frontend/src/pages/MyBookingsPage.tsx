import { useState, useEffect } from 'react'
import type { Booking } from '../types/Booking'
import { getBookings, cancelBooking } from '../api/bookingsApi'
import './MyBookingsPage.css'

function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  useEffect(() => {
    getBookings()
      .then((data) => {
        setBookings(data)
      })
      .catch(() => {
        setLoadError('Unable to load your bookings. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  async function handleCancel(id: number) {
    setCancelError('')
    setCancellingId(id)

    try {
      await cancelBooking(id)
      setBookings((current) => current.filter((booking) => booking.id !== id))
    } catch {
      setCancelError('Unable to cancel this booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <section className="bookings-page">
      <h1 className="bookings-page-heading">My Bookings</h1>
      <p className="bookings-page-description">
        View and manage all of your court reservations in one place.
      </p>

      {loading && <p className="bookings-status">Loading bookings...</p>}
      {loadError && <p className="bookings-error">{loadError}</p>}

      {!loading && !loadError && bookings.length === 0 && (
        <p className="bookings-status">You have no bookings yet.</p>
      )}

      {!loading && !loadError && bookings.length > 0 && (
        <div className="bookings-list">
          {cancelError && <p className="bookings-error">{cancelError}</p>}
          {bookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <div className="booking-card-header">
                <h3 className="booking-card-court">{booking.court.name}</h3>
                <span className="booking-card-sport">
                  {booking.court.sport}
                </span>
              </div>
              <p className="booking-card-location">{booking.court.location}</p>
              <p className="booking-card-detail">
                {booking.bookingDate.slice(0, 10)} at {booking.startTime}
              </p>
              <p className="booking-card-customer">
                {booking.customerName} &middot; {booking.customerEmail}
              </p>
              <button
                className="booking-cancel-button"
                onClick={() => handleCancel(booking.id)}
                disabled={cancellingId === booking.id}
              >
                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyBookingsPage