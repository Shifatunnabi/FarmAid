"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function RentInstruments() {
  const [instruments, setInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        console.log("Fetching available instruments...")
        const instrumentsData = await farmerApi.getAvailableInstruments()
        console.log("Instruments data received:", instrumentsData)
        setInstruments(instrumentsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching instruments:", err)
        setError("Failed to load available instruments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchInstruments()
  }, [])

  const handleRent = async (instrumentId) => {
    try {
      console.log(`Requesting to rent instrument ID: ${instrumentId} for user ID: ${user.id}`)
      await farmerApi.requestInstrument(instrumentId, user.id)

      // Update the local state to reflect the change
      setInstruments(
        instruments.map((instrument) =>
          instrument.id === instrumentId ? { ...instrument, status: "pending", requested_by: user.id } : instrument,
        ),
      )

      alert("Instrument rental request submitted successfully!")
    } catch (err) {
      console.error("Error requesting instrument:", err)
      alert(`Failed to submit rental request: ${err.message || "Please try again."}`)
    }
  }

  const showContactInfo = (instrument) => {
    alert(
      `Owner: ${instrument.owner_name || "Not available"}\nPhone: ${instrument.owner_phone || "Not available"}\nEmail: ${instrument.owner_email || "Not available"}`,
    )
  }

  return (
    <PageLayout title="Available Agricultural Instruments" backPath="/dashboard/farmer">
      {loading ? (
        <p>Loading available instruments...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : instruments.length === 0 ? (
        <div className="empty-state">
          <h3>No instruments available for rent</h3>
          <p>Check back later as instrument owners add new rental options.</p>
        </div>
      ) : (
        <div className="instruments-container">
          {instruments.map((instrument) => (
            <div key={instrument.id} className="instrument-card">
              <Card
                title={instrument.title || instrument.name || "Untitled Instrument"}
                interest={instrument.rent_price || 0}
                description={`Name: ${instrument.name || "Not specified"} | Duration: ${instrument.duration || "Not specified"}`}
                buttonText={
                  instrument.status === "available"
                    ? "Request to Rent"
                    : instrument.status === "pending"
                      ? "Pending"
                      : "Rented"
                }
                onButtonClick={() => handleRent(instrument.id)}
                disabled={instrument.status !== "available"}
              />
              <div className="instrument-footer">
                <div className="instrument-status">
                  Status:{" "}
                  <span
                    className={`status-badge ${
                      instrument.status === "available"
                        ? "status-available"
                        : instrument.status === "pending"
                          ? "status-pending"
                          : "status-rented"
                    }`}
                  >
                    {instrument.status || "unknown"}
                  </span>
                </div>
                <button className="contact-btn" onClick={() => showContactInfo(instrument)}>
                  Contact Info
                </button>
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
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .instrument-status {
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

export default RentInstruments
