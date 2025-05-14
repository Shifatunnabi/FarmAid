import { Link } from "react-router-dom"
import "./ProfileButton.css"

function ProfileButton({ userId, name, role }) {
  return (
    <Link to={`/profile/${userId}`} className="profile-button">
      <div className="profile-button-icon">
        <span>👤</span>
      </div>
      <span className="profile-button-text">{name || "View Profile"}</span>
    </Link>
  )
}

export default ProfileButton
