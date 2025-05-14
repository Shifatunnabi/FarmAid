"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import ProfileButton from "../../components/ProfileButton"
import { storeApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function InstallmentStatus() {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        console.log(`Fetching sold pesticides for store ID: ${user.id}`)
        const soldPesticides = await storeApi.getSoldPesticides(user.id)
        console.log("Sold pesticides data received:", soldPesticides)
        setInstallments(soldPesticides)
        setError(null)
      } catch (err) {
        console.error("Error fetching sold pesticides:", err)
        setError("Failed to load sold pesticides. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchInstallments()
    }
  }, [user])

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active"
    alert(`Installment plan #${id} status changed to ${newStatus}. In a real app, this would update the database.`)

    // Update the local state to reflect the change
    setInstallments(
      installments.map((installment) => (installment.id === id ? { ...installment, status: newStatus } : installment)),
    )
  }

  return (
    <PageLayout title="Installment Plans Status" backPath="/dashboard/pesticide_store">
      {loading ? (
        <p>Loading installment plans...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : installments.length === 0 ? (
        <div className="empty-state">
          <h3>No sold pesticide installment plans found</h3>
          <p>When farmers purchase your pesticide installment plans, they will appear here.</p>
        </div>
      ) : (
        <div className="installments-container">
          {installments.map((installment) => (
            <div key={installment.id} className="installment-card">
              <Card
                title={installment.title || installment.name || "Untitled Pesticide"}
                interest={installment.interest_rate || 0}
                description={`Price: ${installment.price || 0} taka | Installments: ${installment.number_of_installments || 0} | Duration: ${installment.duration || "Not specified"}`}
              />
              <div className="installment-footer">
                <div className="installment-stats">
                  <span className={`installment-status sold`}>Sold</span>
                  <div className="buyer-info">
                    <span className="buyer-label">Buyer:</span>
                    <ProfileButton userId={installment.requested_by} name={installment.buyer_name || "View Buyer"} />
                  </div>
                </div>
                <button
                  className={`toggle-status-btn ${installment.active_status === "Active" ? "pause" : "activate"}`}
                  onClick={() => handleToggleStatus(installment.id, installment.active_status || "Active")}
                >
                  {installment.active_status === "Active" ? "Pause Plan" : "Activate Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .installments-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .installment-card {
          display: flex;
          flex-direction: column;
        }
        
        .installment-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .installment-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .installment-status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .installment-status.active {
          background-color: #4a7c59;
          color: white;
        }
        
        .installment-status.paused {
          background-color: #e9b44c;
          color: #333;
        }
        
        .installment-status.sold {
          background-color: #3498db;
          color: white;
        }
        
        .buyer-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .buyer-label {
          font-size: 0.875rem;
          color: #666;
        }
        
        .toggle-status-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }
        
        .toggle-status-btn.pause {
          background-color: #e9b44c;
          color: #333;
        }
        
        .toggle-status-btn.activate {
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
          .installments-container {
            grid-template-columns: 1fr;
          }
          
          .installment-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default InstallmentStatus
