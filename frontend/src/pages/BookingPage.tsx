import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router'
import type { Court } from '../types/Court'
import { getCourt } from '../api/courtsApi'
import { createBooking } from '../api/bookingsApi'
import './BookingPage.css'

const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00']

function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [startTime, setStartTime] = useState(TIME_SLOTS[0])

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const courtId = Number(id)

    getCourt(courtId)
      .then((data) => {
        setCourt(data)
      })
      .catch(() => {
        setLoadError('Unable to load this court. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    try {
      await createBooking({
        courtId: court!.id,
        customerName,
        customerEmail,
        bookingDate,
        startTime,
      })
      navigate('/my-bookings')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setSubmitError(
          'This time slot is already booked. Please choose another time.',
        )
      } else {
        setSubmitError('Unable to create booking. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="booking-page">
        <p>Loading court details...</p>
      </section>
    )
  }

  if (loadError || !court) {
    return (
      <section className="booking-page">
        <p className="booking-error">{loadError}</p>
      </section>
    )
  }

  return (
    <section className="booking-page">
      <h1 className="booking-page-heading">Book {court.name}</h1>
      <p className="booking-page-description">
        Reserve a time slot for your next game.
      </p>

      <div className="booking-summary">
        <p className="booking-summary-sport">{court.sport}</p>
        <p className="booking-summary-location">{court.location}</p>
        <p className="booking-summary-price">JOD {court.pricePerHour} / hour</p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="booking-field">
          <label className="booking-label" htmlFor="customerName">
            Customer Name
          </label>
          <input
            id="customerName"
            className="booking-input"
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />
        </div>

        <div className="booking-field">
          <label className="booking-label" htmlFor="customerEmail">
            Customer Email
          </label>
          <input
            id="customerEmail"
            className="booking-input"
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
          />
        </div>

        <div className="booking-field">
          <label className="booking-label" htmlFor="bookingDate">
            Booking Date
          </label>
          <input
            id="bookingDate"
            className="booking-input"
            type="date"
            value={bookingDate}
            onChange={(event) => setBookingDate(event.target.value)}
            required
          />
        </div>

        <div className="booking-field">
          <label className="booking-label" htmlFor="startTime">
            Start Time
          </label>
          <select
            id="startTime"
            className="booking-input"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            required
          >
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {submitError && <p className="booking-form-error">{submitError}</p>}

        <button
          type="submit"
          className="booking-submit-button"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Confirm Booking'}
        </button>
      </form>
    </section>
  )
}

export default BookingPage