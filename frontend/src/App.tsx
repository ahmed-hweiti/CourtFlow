import { Routes, Route } from 'react-router'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CourtsPage from './pages/CourtsPage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/courts/:id/book" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App