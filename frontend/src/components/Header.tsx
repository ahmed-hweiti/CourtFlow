import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">CourtFlow</div>
        <nav className="header-nav">
          <span className="header-link">Home</span>
          <span className="header-link">Courts</span>
          <span className="header-link">My Bookings</span>
        </nav>
        <button className="header-signin">Sign In</button>
      </div>
    </header>
  )
}

export default Header
