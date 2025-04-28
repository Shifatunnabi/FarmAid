"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function BankLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansData = await farmerApi.getAvailableLoans()
        setLoans(loansData)
      } catch (err) {
        setError("Failed to load available loans. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [])

  const handleApply = async (loanId) => {
    try {
      await farmerApi.requestLoan(loanId, user.id)
      // Update the local state to reflect the change
      setLoans(loans.map((loan) => (loan.id === loanId ? { ...loan, status: "pending", requested_by: user.id } : loan)))
      alert("Loan request submitted successfully!")
    } catch (err) {
      alert("Failed to submit loan request. Please try again.")
      console.error(err)
    }
  }

  const showContactInfo = (loan) => {
    alert(`Bank: ${loan.bank_name}\nPhone: ${loan.bank_phone}\nEmail: ${loan.bank_email}`)
  }

  return (
    <PageLayout title="Available Bank Loans" backPath="/dashboard/farmer">
      {loading ? (
        <p>Loading available loans...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : loans.length === 0 ? (
        <p>No loans available at the moment.</p>
      ) : (
        <div className="loans-container">
          {loans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <Card
                title={`${loan.title} - ${loan.bank_name}`}
                interest={loan.interest_rate}
                description={`Amount: $${loan.amount} | Duration: ${loan.duration}`}
                buttonText={
                  loan.status === "available" ? "Apply for Loan" : loan.status === "pending" ? "Pending" : "Approved"
                }
                onButtonClick={() => handleApply(loan.id)}
                disabled={loan.status !== "available"}
              />
              <div className="loan-footer">
                <div className="loan-status">
                  Status:{" "}
                  <span
                    className={`status-badge ${
                      loan.status === "available"
                        ? "status-available"
                        : loan.status === "pending"
                          ? "status-pending"
                          : "status-approved"
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>
                <button className="contact-btn" onClick={() => showContactInfo(loan)}>
                  Contact Info
                </button>
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
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .loan-status {
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
        
        .status-approved {
          background-color: #3498db;
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
        }
        
        @media (max-width: 768px) {
          .loans-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default BankLoans
