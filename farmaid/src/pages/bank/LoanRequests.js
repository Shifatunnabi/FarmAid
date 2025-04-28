"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"

function LoanRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch data from an API
    // For this example, we'll use mock data
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          title: "Seed Purchase Loan",
          interest: 5,
          description: "I need a loan to purchase high-quality seeds for my wheat farm. Planning to cultivate 5 acres.",
          farmer: "James Wilson",
          amount: 2500,
        },
        {
          id: 2,
          title: "Irrigation Equipment Loan",
          interest: 4.5,
          description: "Requesting funds to install a drip irrigation system for my vegetable farm.",
          farmer: "Sarah Thompson",
          amount: 5000,
        },
        {
          id: 3,
          title: "Tractor Repair Loan",
          interest: 6,
          description: "My tractor needs urgent repairs before the harvest season. Need funds to fix it.",
          farmer: "Michael Brown",
          amount: 3500,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleApprove = (id) => {
    alert(`Loan request #${id} has been approved. In a real app, this would update the database.`)
    // In a real app, you would update the database and refresh the list
    setRequests(requests.filter((request) => request.id !== id))
  }

  const handleReject = (id) => {
    alert(`Loan request #${id} has been rejected. In a real app, this would update the database.`)
    // In a real app, you would update the database and refresh the list
    setRequests(requests.filter((request) => request.id !== id))
  }

  return (
    <PageLayout title="Loan Requests from Farmers" backPath="/dashboard/bank">
      {loading ? (
        <p>Loading loan requests...</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No pending loan requests</h3>
          <p>When farmers request loans, they will appear here.</p>
        </div>
      ) : (
        <div className="requests-container">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <Card
                title={request.title}
                interest={request.interest}
                description={`Amount: $${request.amount} - ${request.description}`}
              />
              <div className="request-actions">
                <p className="request-from">From: {request.farmer}</p>
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
        
        .request-from {
          font-weight: bold;
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
      `}</style>
    </PageLayout>
  )
}

export default LoanRequests
