"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import ProfileButton from "../../components/ProfileButton"
import { storeApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function InstallmentRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log(`Fetching pesticide requests for store ID: ${user.id}`)
        const requestsData = await storeApi.getPesticideRequests(user.id)
        console.log("Pesticide requests data received:", requestsData)
        setRequests(requestsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching pesticide requests:", err)
        setError("Failed to load pesticide requests. Please try again later.")
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
      console.log(`Approving pesticide request #${id}`)
      await storeApi.acceptPesticideRequest(id)

      // Remove the approved request from the list
      setRequests(requests.filter((request) => request.id !== id))
      alert("Pesticide installment request approved successfully!")
    } catch (error) {
      console.error("Error approving pesticide request:", error)
      alert(`Failed to approve request: ${error.message || "Unknown error"}`)
    }
  }

  const handleReject = async (id) => {
    try {
      console.log(`Rejecting pesticide request #${id}`)
      await storeApi.rejectPesticideRequest(id)

      // Remove the rejected request from the list
      setRequests(requests.filter((request) => request.id !== id))
      alert("Pesticide installment request rejected successfully.")
    } catch (error) {
      console.error("Error rejecting pesticide request:", error)
      alert(`Failed to reject request: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <PageLayout title="Pesticide Installment Requests" backPath="/dashboard/pesticide_store">
      {loading ? (
        <p>Loading installment requests...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No pending installment requests</h3>
          <p>When farmers request pesticide installment plans, they will appear here.</p>
        </div>
      ) : (
        <div className="requests-container">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <Card
                title={request.title || request.name || "Untitled Pesticide"}
                interest={request.interest_rate || 0}
                description={`Price: ${request.price || 0} taka | Installments: ${request.number_of_installments || 0} | Duration: ${request.duration || "Not specified"}`}
              />
              <div className="request-actions">
                <div className="request-info">
                  <div className="farmer-profile">
                    <span className="farmer-label">Requested by:</span>
                    <ProfileButton userId={request.requested_by} name={request.farmer_name || "View Farmer"} />
                  </div>
                  {/* <div className="farmer-details">
                    <p>
                      <strong>Phone:</strong> {request.farmer_phone || "Not provided"}
                    </p>
                    <p>
                      <strong>Email:</strong> {request.farmer_email || "Not provided"}
                    </p>
                    <p>
                      <strong>Address:</strong> {request.farmer_address || "Not provided"}
                    </p>
                  </div> */}
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
          align-items: flex-start;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .request-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .farmer-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .farmer-label {
          font-weight: bold;
        }
        
        .farmer-details {
          font-size: 0.875rem;
        }
        
        .farmer-details p {
          margin: 0.25rem 0;
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

export default InstallmentRequests
