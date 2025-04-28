"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"

function LoanStatus() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch data from an API
    // For this example, we'll use mock data
    setTimeout(() => {
      setLoans([
        {
          id: 1,
          title: "Agricultural Equipment Loan",
          interest: 5.5,
          description: "Loan for purchasing tractors and harvesters. Maximum amount $10,000.",
          status: "Active",
          applications: 12,
        },
        {
          id: 2,
          title: "Seed Investment Loan",
          interest: 4,
          description: "Low-interest loan for purchasing high-quality seeds. Maximum amount $5,000.",
          status: "Active",
          applications: 8,
        },
        {
          id: 3,
          title: "Irrigation System Loan",
          interest: 6,
          description: "Financing for modern irrigation systems. Maximum amount $15,000.",
          status: "Active",
          applications: 5,
        },
        {
          id: 4,
          title: "Farm Expansion Loan",
          interest: 7.5,
          description: "Support for expanding farm operations. Maximum amount $25,000.",
          status: "Paused",
          applications: 3,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleViewDetails = (id) => {
    alert(`Viewing details for loan #${id}. In a real app, this would open a detailed view.`)
  }

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active"
    alert(`Loan #${id} status changed to ${newStatus}. In a real app, this would update the database.`)

    // Update the local state to reflect the change
    setLoans(loans.map((loan) => (loan.id === id ? { ...loan, status: newStatus } : loan)))
  }

  return (
    <PageLayout title="Loan Status and Management" backPath="/dashboard/bank">
      {loading ? (
        <p>Loading loans...</p>
      ) : (
        <div className="loans-container">
          {loans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <Card
                title={loan.title}
                interest={loan.interest}
                description={loan.description}
                buttonText="View Details"
                onButtonClick={() => handleViewDetails(loan.id)}
              />
              <div className="loan-footer">
                <div className="loan-stats">
                  <span className={`loan-status ${loan.status.toLowerCase()}`}>{loan.status}</span>
                  <span className="loan-applications">{loan.applications} Applications</span>
                </div>
                <button
                  className={`toggle-status-btn ${loan.status === "Active" ? "pause" : "activate"}`}
                  onClick={() => handleToggleStatus(loan.id, loan.status)}
                >
                  {loan.status === "Active" ? "Pause Loan" : "Activate Loan"}
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
          align-items: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .loan-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .loan-status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.875rem;
        }
        
        .loan-status.active {
          background-color: #4a7c59;
          color: white;
        }
        
        .loan-status.paused {
          background-color: #e9b44c;
          color: #333;
        }
        
        .loan-applications {
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
        
        @media (max-width: 768px) {
          .loans-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default LoanStatus
