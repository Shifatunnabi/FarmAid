"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function RentedLand() {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true)
      try {
        console.log("Fetching available lands...")
        const landsData = await farmerApi.getAvailableLands()
        console.log("Lands data received:", landsData)
        setLands(landsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching lands:", err)
        setError("Failed to load available lands. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchLands()
  }, [])

  const handleRent = async (landId) => {
    try {
      console.log(`Requesting to rent land ID: ${landId} for user ID: ${user.id}`)
      await farmerApi.requestLand(landId, user.id)

      // Update the local state to reflect the change
      setLands(lands.map((land) => (land.id === landId ? { ...land, status: "pending", requested_by: user.id } : land)))

      alert("Land rental request submitted successfully!")
    } catch (err) {
      console.error("Error requesting land:", err)
      alert(`Failed to submit rental request: ${err.message || "Please try again."}`)
    }
  }

  const showContactInfo = (land) => {
    alert(
      `Owner: ${land.owner_name || "Not available"}\nPhone: ${land.owner_phone || "Not available"}\nEmail: ${land.owner_email || "Not available"}`,
    )
  }

  return (
    <PageLayout title="Available Lands for Rent" backPath="/dashboard/farmer">
      {loading ? (
        <p>Loading available lands...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : lands.length === 0 ? (
        <div className="empty-state">
          <h3>No lands available for rent</h3>
          <p>Check back later as landowners add new rental properties.</p>
        </div>
      ) : (
        <div className="lands-container">
          {lands.map((land) => (
            <div key={land.id} className="land-card">
              <Card
                title={land.title || "Untitled Land"}
                interest={land.interest_rate || 0}
                description={`Location: ${land.location || "Not specified"} | Size: ${land.size || "Not specified"}`}
                buttonText={
                  land.status === "available" ? "Request to Rent" : land.status === "pending" ? "Pending" : "Rented"
                }
                onButtonClick={() => handleRent(land.id)}
                disabled={land.status !== "available"}
              />
              <div className="land-footer">
                <div className="land-status">
                  Status:{" "}
                  <span
                    className={`status-badge ${
                      land.status === "available"
                        ? "status-available"
                        : land.status === "pending"
                          ? "status-pending"
                          : "status-rented"
                    }`}
                  >
                    {land.status || "unknown"}
                  </span>
                </div>
                <button className="contact-btn" onClick={() => showContactInfo(land)}>
                  Contact Info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .lands-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .land-card {
          margin-bottom: 1.5rem;
        }
        
        .land-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .land-status {
          font-weight: bold;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: bold;
        }
        
        .status-available {
          background-color: #4a7c59;
          color: white;
        }
        
        .status-pending {
          background-color: #e9b44c;
          color: #333;
        }
        
        .status-rented {
          background-color: #e74c3c;
          color: white;
        }
        
        .contact-btn {
          background-color: #4a7c59;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .contact-btn:hover {
          background-color: #3d6649;
        }
        
        .error-message {
          color: #e74c3c;
          font-weight: bold;
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .retry-button {
          background-color: #4a7c59;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </PageLayout>
  )
}

export default RentedLand
