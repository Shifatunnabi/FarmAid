"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { landownerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function LandStatus() {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchLands = async () => {
      setLoading(true)
      try {
        console.log(`Fetching lands for owner ID: ${user.id}`)
        const landsData = await landownerApi.getLands(user.id)
        console.log("Lands data received:", landsData)
        setLands(landsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching lands:", err)
        setError("Failed to load your lands. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchLands()
    }
  }, [user])

  const handleViewDetails = (id) => {
    alert(`Viewing details for land #${id}. In a real app, this would open a detailed view.`)
  }

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Available" ? "Not Available" : "Available"
      console.log(`Changing land #${id} status to ${newStatus}`)

      // In a real implementation, you would have an API endpoint for this
      // For now, just update the UI
      setLands(
        lands.map((land) => (land.id === id && land.status !== "Rented" ? { ...land, status: newStatus } : land)),
      )

      alert(`Land #${id} status changed to ${newStatus}.`)
    } catch (error) {
      console.error("Error toggling land availability:", error)
      alert(`Failed to update land status: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <PageLayout title="Your Land Status" backPath="/dashboard/landowner">
      {loading ? (
        <p>Loading land status...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : lands.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted any lands yet</h3>
          <p>Add a new land for rent using the "Rent a Land" option.</p>
        </div>
      ) : (
        <div className="lands-container">
          {lands.map((land) => (
            <div key={land.id} className="land-card">
              <Card
                title={land.title || "Untitled Land"}
                interest={land.interest_rate || 0}
                description={`Location: ${land.location || "Not specified"} | Size: ${land.size || "Not specified"}`}
                buttonText="View Details"
                onButtonClick={() => handleViewDetails(land.id)}
              />
              <div className="land-footer">
                <div className="land-stats">
                  <span className={`land-status ${(land.status || "available").toLowerCase().replace(/\s+/g, "-")}`}>
                    {land.status || "Available"}
                  </span>
                  {land.tenant && <span className="land-tenant">Tenant: {land.tenant}</span>}
                  {land.endDate && <span className="land-end-date">Ends: {land.endDate}</span>}
                </div>
                {land.status !== "Rented" && (
                  <button
                    className={`toggle-status-btn ${
                      land.status === "Available" ? "make-unavailable" : "make-available"
                    }`}
                    onClick={() => handleToggleAvailability(land.id, land.status || "Available")}
                  >
                    {land.status === "Available" ? "Mark as Unavailable" : "Mark as Available"}
                  </button>
                )}
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
          display: flex;
          flex-direction: column;
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
        
        .land-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .land-status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .land-status.rented {
          background-color: #4a7c59;
          color: white;
        }
        
        .land-status.available {
          background-color: #e9b44c;
          color: #333;
        }
        
        .land-status.not-available {
          background-color: #e74c3c;
          color: white;
        }
        
        .land-tenant, .land-end-date {
          font-size: 0.875rem;
          color: #666;
        }
        
        .toggle-status-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.75rem;
        }
        
        .toggle-status-btn.make-unavailable {
          background-color: #e74c3c;
          color: white;
        }
        
        .toggle-status-btn.make-available {
          background-color: #4a7c59;
          color: white;
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
        
        @media (max-width: 768px) {
          .lands-container {
            grid-template-columns: 1fr;
          }
          
          .land-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default LandStatus
