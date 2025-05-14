"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { instrumentApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function InstrumentStatus() {
  const [instruments, setInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchInstruments = async () => {
      setLoading(true)
      try {
        console.log(`Fetching instruments for owner ID: ${user.id}`)
        const instrumentsData = await instrumentApi.getInstruments(user.id)
        console.log("Instruments data received:", instrumentsData)
        setInstruments(instrumentsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching instruments:", err)
        setError("Failed to load your instruments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchInstruments()
    }
  }, [user])

  const handleViewDetails = (id) => {
    alert(`Viewing details for instrument #${id}. In a real app, this would open a detailed view.`)
  }

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Available" ? "Not Available" : "Available"
      console.log(`Changing instrument #${id} status to ${newStatus}`)

      // In a real implementation, you would have an API endpoint for this
      // For now, just update the UI
      setInstruments(
        instruments.map((instrument) =>
          instrument.id === id && instrument.status !== "rented"
            ? { ...instrument, status: newStatus.toLowerCase() }
            : instrument,
        ),
      )

      alert(`Instrument #${id} status changed to ${newStatus}.`)
    } catch (error) {
      console.error("Error toggling instrument availability:", error)
      alert(`Failed to update instrument status: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <PageLayout title="Your Instrument Status" backPath="/dashboard/instrument_owner">
      {loading ? (
        <p>Loading instruments status...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : instruments.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted any instruments yet</h3>
          <p>Add a new instrument for rent using the "Post Agricultural Instrument" option.</p>
        </div>
      ) : (
        <div className="instruments-container">
          {instruments.map((instrument) => (
            <div key={instrument.id} className="instrument-card">
              <Card
                title={instrument.title || instrument.name || "Untitled Instrument"}
                interest={instrument.rent_price || 0}
                description={`Name: ${instrument.name || "Not specified"} | Duration: ${instrument.duration || "Not specified"}`}
                buttonText="View Details"
                onButtonClick={() => handleViewDetails(instrument.id)}
              />
              <div className="instrument-footer">
                <div className="instrument-stats">
                  <span
                    className={`instrument-status ${(instrument.status || "available").toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {instrument.status || "Available"}
                  </span>
                  {instrument.requested_by && (
                    <span className="instrument-renter">Requested by: ID {instrument.requested_by}</span>
                  )}
                </div>
                {instrument.status !== "rented" && (
                  <button
                    className={`toggle-status-btn ${
                      instrument.status === "available" ? "make-unavailable" : "make-available"
                    }`}
                    onClick={() =>
                      handleToggleAvailability(
                        instrument.id,
                        instrument.status === "available" ? "Available" : "Not Available",
                      )
                    }
                  >
                    {instrument.status === "available" ? "Mark as Unavailable" : "Mark as Available"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .instruments-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .instrument-card {
          display: flex;
          flex-direction: column;
        }
        
        .instrument-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .instrument-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .instrument-status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .instrument-status.available {
          background-color: #4a7c59;
          color: white;
        }
        
        .instrument-status.rented {
          background-color: #e9b44c;
          color: #333;
        }
        
        .instrument-status.not-available {
          background-color: #e74c3c;
          color: white;
        }
        
        .instrument-status.pending {
          background-color: #3498db;
          color: white;
        }
        
        .instrument-renter, .instrument-end-date {
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
          .instruments-container {
            grid-template-columns: 1fr;
          }
          
          .instrument-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default InstrumentStatus
