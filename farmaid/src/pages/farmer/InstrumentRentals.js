"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function InstrumentRentals() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        console.log(`Fetching instrument rentals for farmer ID: ${user.id}`)
        const rentalsData = await farmerApi.getInstrumentRentals(user.id)
        console.log("Instrument rentals data received:", rentalsData)
        setRentals(rentalsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching instrument rentals:", err)
        setError("Failed to load your instrument rentals. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchRentals()
    }
  }, [user])

  const handleCancel = async (id) => {
    try {
      // In a real app, you would have an API endpoint for cancellation
      console.log(`Cancelling rental request #${id}`)

      // For now, just update the UI
      setRentals(rentals.filter((rental) => rental.id !== id))

      alert("Rental request cancelled successfully.")
    } catch (error) {
      console.error("Error cancelling rental:", error)
      alert(`Failed to cancel rental: ${error.message || "Unknown error"}`)
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "approved"
      case "pending":
        return "pending"
      case "rejected":
        return "rejected"
      case "completed":
        return "completed"
      default:
        return status?.toLowerCase() || "unknown"
    }
  }

  return (
    <PageLayout title="Your Instrument Rentals" backPath="/dashboard/farmer">
      {loading ? (
        <p>Loading your rentals...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : rentals.length === 0 ? (
        <div className="empty-state">
          <h3>No instrument rentals found</h3>
          <p>When you rent agricultural instruments, they will appear here.</p>
        </div>
      ) : (
        <div className="rentals-container">
          {rentals.map((rental) => (
            <div key={rental.id} className="rental-card">
              <Card
                title={rental.title || rental.name || "Untitled Instrument"}
                interest={rental.rent_price || 0}
                description={`Name: ${rental.name || "Not specified"} | Duration: ${rental.duration || "Not specified"}`}
              />
              <div className="rental-footer">
                <div className="rental-details">
                  <span className={`rental-status ${getStatusClass(rental.status)}`}>{rental.status || "Unknown"}</span>
                  <span className="rental-owner">Owner: {rental.owner_name || "Unknown"}</span>
                  {rental.start_date && rental.end_date && (
                    <span className="rental-dates">
                      {rental.start_date} to {rental.end_date}
                    </span>
                  )}
                </div>
                {rental.status === "pending" && (
                  <button className="cancel-btn" onClick={() => handleCancel(rental.id)}>
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .empty-state {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .rentals-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .rental-card {
          display: flex;
          flex-direction: column;
        }
        
        .rental-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .rental-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .rental-status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .rental-status.approved {
          background-color: #4a7c59;
          color: white;
        }
        
        .rental-status.pending {
          background-color: #e9b44c;
          color: #333;
        }
        
        .rental-status.rejected {
          background-color: #e74c3c;
          color: white;
        }
        
        .rental-status.completed {
          background-color: #3498db;
          color: white;
        }
        
        .rental-owner, .rental-dates {
          font-size: 0.875rem;
          color: #666;
        }
        
        .cancel-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          background-color: #e74c3c;
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
        
        @media (max-width: 768px) {
          .rentals-container {
            grid-template-columns: 1fr;
          }
          
          .rental-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default InstrumentRentals
