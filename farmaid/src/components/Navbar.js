
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user ? `/dashboard/${user.role}` : "/"}>
          <h1>🌾 Farm Aid</h1>
        </Link>
      </div>
      {user && (
        <div className="navbar-menu">
          <Link to={`/profile/${user.id}`} className="profile-link" title={`${user.name} (${user.role})`}>
            <div className="profile-icon">
              <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            </div>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
