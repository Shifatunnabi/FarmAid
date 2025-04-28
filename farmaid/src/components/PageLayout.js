"use client"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import "./PageLayout.css"

function PageLayout({ title, children, backPath }) {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate(backPath)}>
            ← Back
          </button>
          <h1 className="page-title">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}

export default PageLayout
