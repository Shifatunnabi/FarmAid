
import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import ProfileButton from "../../components/ProfileButton"
import { bankApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function LoanStatus() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        console.log(`Fetching loans for bank ID: ${user.id}`)
        const loansData = await bankApi.getLoans(user.id)
        console.log("Loans data received:", loansData)
        setLoans(loansData)
        setError(null)
      } catch (err) {
        console.error("Error fetching loans:", err)
        setError("Failed to load loans. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchLoans()
    }
  }, [user])

  const handleViewDetails = (id) => {
    alert(`Viewing details for loan #${id}. In a real app, this would open a detailed view.`)
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "available" ? "paused" : "available"
      console.log(`Changing loan #${id} status to ${newStatus}`)

      // In a real implementation, you would have an API endpoint for this
      // For now, just update the UI
      setLoans(
        loans.map((loan) => (loan.id === id && loan.status !== "booked" ? { ...loan, status: newStatus } : loan)),
      )

      alert(`Loan #${id} status changed to ${newStatus}.`)
    } catch (error) {
      console.error("Error toggling loan status:", error)
      alert(`Failed to update loan status: ${error.message || "Unknown error"}`)
    }
  }

  return (
    <PageLayout title="Loan Status and Management" backPath="/dashboard/bank">
      {loading ? (
        <p>Loading loans...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      ) : loans.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't created any loans yet</h3>
          <p>Create a new loan using the "Create New Loan" option.</p>
        </div>
      ) : (
        <div className="loans-container">
          {loans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <Card
                title={loan.title || `Loan #${loan.id}`}
                interest={loan.interest_rate || 0}
                description={`Amount: ${loan.amount || "N/A"} taka | Duration: ${loan.duration || "N/A"}`}
                buttonText=""
                onButtonClick={() => handleViewDetails(loan.id)}
              />
              <div className="loan-footer">
                <div className="loan-stats">
                  <span className={`loan-status ${loan.status || "available"}`}>
                    {loan.status ? loan.status.charAt(0).toUpperCase() + loan.status.slice(1) : "Available"}
                  </span>
                  {loan.requested_by && (
                    <div className="borrower-info">
                      <span className="borrower-label">Requested by:</span>
                      <ProfileButton userId={loan.requested_by} name="View Farmer" />
                    </div>
                  )}
                </div>
                {loan.status !== "booked" && (
                  <button
                    className={`toggle-status-btn ${loan.status === "available" ? "pause" : "activate"}`}
                    onClick={() => handleToggleStatus(loan.id, loan.status || "available")}
                  >
                    {loan.status === "available" ? "Pause Loan" : "Activate Loan"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .loans-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .loan-card {
          display: flex;
          flex-direction: column;
        }
        
        .loan-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .loan-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .loan-status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .loan-status.available {
          background-color: #4a7c59;
          color: white;
        }
        
        .loan-status.paused {
          background-color: #e9b44c;
          color: #333;
        }
        
        .loan-status.booked {
          background-color: #3498db;
          color: white;
        }
        
        .loan-status.pending {
          background-color: #f39c12;
          color: white;
        }
        
        .borrower-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .borrower-label {
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
          .loans-container {
            grid-template-columns: 1fr;
          }
          
          .loan-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default LoanStatus
