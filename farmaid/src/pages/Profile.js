"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageLayout from "../components/PageLayout"
import { fetchApi } from "../utils/api"
import { useAuth } from "../context/AuthContext"
import "./Profile.css"

function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchApi(`/users/${id}`)
        setProfile(data)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  const getRoleName = (role) => {
    switch (role) {
      case "farmer":
        return "Farmer"
      case "landowner":
        return "Land Owner"
      case "bank":
        return "Bank"
      case "pesticide_store":
        return "Pesticide Store"
      case "instrument_owner":
        return "Instrument Owner"
      default:
        return role
    }
  }

  const getBackPath = () => {
    if (user && user.id.toString() === id) {
      return `/dashboard/${user.role}`
    }
    return -1 // Go back to previous page
  }

  return (
    <PageLayout title="User Profile" backPath={getBackPath()}>
      {loading ? (
        <div className="profile-loading">Loading profile...</div>
      ) : error ? (
        <div className="profile-error">
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      ) : profile ? (
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {/* Default avatar icon */}
                <div className="avatar-placeholder">
                  <span>{profile.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
                </div>
              </div>
              <div className="profile-title">
                <h2>{profile.name}</h2>
                <span className="profile-role">{getRoleName(profile.role)}</span>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{profile.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{profile.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{profile.address}</span>
              </div>
              {profile.role === "bank" && (
                <div className="detail-item">
                  <span className="detail-label">Bank Details:</span>
                  <span className="detail-value">{profile.bank_details || "Not provided"}</span>
                </div>
              )}
              {profile.role === "pesticide_store" && (
                <div className="detail-item">
                  <span className="detail-label">Store Details:</span>
                  <span className="detail-value">{profile.store_details || "Not provided"}</span>
                </div>
              )}
              {profile.role === "instrument_owner" && (
                <div className="detail-item">
                  <span className="detail-label">Instrument Details:</span>
                  <span className="detail-value">{profile.instrument_details || "Not provided"}</span>
                </div>
              )}
            </div>
            {user && user.id.toString() === id && (
              <div className="profile-actions">
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="profile-not-found">Profile not found</div>
      )}
    </PageLayout>
  )
}

export default Profile
