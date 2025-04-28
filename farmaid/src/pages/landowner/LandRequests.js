"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { landownerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function LandRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        console.log(`Fetching land requests for owner ID: ${user.id}`)
        const requestsData = await landownerApi.getLandRequests(user.id)
        console.log("Land requests data received:", requestsData)
        setRequests(requestsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching land requests:", err)
        setError("Failed to load land requests. Please try again later.")
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
      console.log(`Approving land request #${id}`)
      await landownerApi.acceptLandRequest(id)

      // Remove the approved request from the list
      setRequests(requests.filter((request) => request.id !== id))
      alert("Land rental request approved successfully!")
    } catch (error) {
      console.error("Error approving land request:", error)
      alert(`Failed to approve request: ${error.message || "Unknown error"}`)
    }
  }

  const handleReject = async (id) => {
    try {
      console.log(`Rejecting land request #${id}`)
      await landownerApi.rejectLandRequest(id)

      // Remove the rejected request from the list
      setRequests(requests.filter((request) => request.id !== id))
      alert("Land rental request rejected successfully.")
    } catch (error) {
      console.error("Error rejecting land request:", error)
      alert(`Failed to reject request: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <PageLayout title="Land Rental Requests" backPath="/dashboard/landowner">
      {loading ? (
        <p>Loading land requests...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No pending land requests</h3>
          <p>When farmers request to rent your land, they will appear here.</p>
        </div>
      ) : (
        <div className="requests-container">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <Card
                title={request.title || "Untitled Request"}
                interest={request.interest_rate || 0}
                description={`Location: ${request.location || "Not specified"} | Size: ${request.size || "Not specified"}`}
              />
              <div className="request-actions">
                <div className="request-info">
                  <p className="request-from">From: {request.farmer_name || "Unknown Farmer"}</p>
                  <p className="request-details">
                    Contact: {request.farmer_phone || "N/A"} | {request.farmer_email || "N/A"}
                  </p>
                  <p className="request-address">Address: {request.farmer_address || "Not provided"}</p>
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

export default LandRequests
