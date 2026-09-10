import { Routes, Route } from 'react-router'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CourtsPage from './pages/CourtsPage'
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
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App