
import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { instrumentApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"
import ProfileButton from "../../components/ProfileButton"

function InstrumentRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        console.log(`Fetching instrument requests for owner ID: ${user.id}`)
        const requestsData = await instrumentApi.getInstrumentRequests(user.id)
        console.log("Instrument requests data received:", requestsData)
        setRequests(requestsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching instrument requests:", err)
        setError("Failed to load instrument requests. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchRequests()
    }
  }, [user])

  const handleApprove = async (id) => {
    try {
      console.log(`Approving instrument request #${id}`)
      await instrumentApi.acceptInstrumentRequest(id)

      // Remove the approved request from the list
      setRequests(requests.filter((request) => request.id !== id))
      alert("Instrument rental request approved successfully!")
    } catch (error) {
      console.error("Error approving instrument request:", error)
      alert(`Failed to approve request: ${error.message || "Unknown error"}`)
    }
  }

  const handleReject = async (id) => {
    try {
      console.log(`Rejecting instrument request #${id}`)
      await instrumentApi.rejectInstrumentRequest(id)

      // Remove the rejected request from the list
      setRequests(requests.filter((request) => request.id !== id))
      alert("Instrument rental request rejected successfully.")
    } catch (error) {
      console.error("Error rejecting instrument request:", error)
      alert(`Failed to reject request: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <PageLayout title="Instrument Rental Requests" backPath="/dashboard/instrument_owner">
      {loading ? (
        <p>Loading instrument requests...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No pending instrument requests</h3>
          <p>When farmers request to rent your instruments, they will appear here.</p>
        </div>
      ) : (
        <div className="requests-container">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <Card
                title={request.title || request.name || "Untitled Request"}
                interest={request.rent_price || 0}
                description={`Duration: ${request.duration || "Not specified"} | Name: ${request.name || "Not specified"}`}
              />
              <div className="request-actions">
                <div className="request-info">
                  <div className="farmer-profile">
                    <span className="farmer-label">Requested by:</span>
                    <ProfileButton userId={request.requested_by} name={request.farmer_name || "View Farmer"} />
                  </div>
                </div>
                <div className="request-buttons">
                  <button className="approve-btn" onClick={() => handleApprove(request.id)}>
                    Approve
                  </button>
                  <button className="reject-btn" onClick={() => handleReject(request.id)}>
                    Reject
                  </button>
                </div>
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
        
        .request-card {
          margin-bottom: 1.5rem;
        }
        
        .request-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .request-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .request-from {
          font-weight: bold;
          margin: 0;
        }
        
        .request-details, .request-address {
          margin: 0;
          font-size: 0.875rem;
          color: #555;
        }
        
        .request-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .approve-btn, .reject-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }
        
        .approve-btn {
          background-color: #4a7c59;
          color: white;
        }
        
        .reject-btn {
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
          .request-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .request-buttons {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default InstrumentRequests
