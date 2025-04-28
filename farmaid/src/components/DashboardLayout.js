"use client"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import "./DashboardLayout.css"

function DashboardLayout({ photoSrc, photoAlt, buttons }) {
  const navigate = useNavigate()

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-photo">
          <img src={photoSrc || "/placeholder.svg"} alt={photoAlt} />
        </div>
        <div className="dashboard-buttons">
          {buttons.map((button, index) => (
            <button key={index} className="dashboard-button" onClick={() => navigate(button.path)}>
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
