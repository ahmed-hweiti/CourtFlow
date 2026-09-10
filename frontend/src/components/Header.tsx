import { NavLink } from 'react-router'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">CourtFlow</div>
        <nav className="header-nav">
          <NavLink to="/" className="header-link">
            Home
          </NavLink>
          <NavLink to="/courts" className="header-link">
            Courts
          </NavLink>
          <NavLink to="/my-bookings" className="header-link">
            My Bookings
          </NavLink>
        </nav>
        <button className="header-signin">Sign In</button>
      </div>
    </header>
  )
}

export default Header