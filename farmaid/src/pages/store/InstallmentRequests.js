"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"

function InstallmentRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch data from an API
    // For this example, we'll use mock data
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          title: "Organic Pesticide Package Request",
          interest: 3,
          description:
            "I need eco-friendly pesticides for my organic vegetable farm. Looking for a 6-month installment plan.",
          farmer: "Alice Cooper",
          amount: 1200,
        },
        {
          id: 2,
          title: "Complete Pest Control Kit Request",
          interest: 4.5,
          description: "Requesting the comprehensive pest control solution for my wheat and corn fields.",
          farmer: "John Doe",
          amount: 2500,
        },
        {
          id: 3,
          title: "Fruit Tree Treatment Request",
          interest: 3.5,
          description:
            "I need the specialized fruit tree treatment for my apple orchard. Prefer a 12-month installment plan.",
          farmer: "Emma Wilson",
          amount: 1800,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleApprove = (id) => {
    alert(`Installment request #${id} has been approved. In a real app, this would update the database.`)
    // In a real app, you would update the database and refresh the list
    setRequests(requests.filter((request) => request.id !== id))
  }

  const handleReject = (id) => {
    alert(`Installment request #${id} has been rejected. In a real app, this would update the database.`)
    // In a real app, you would update the database and refresh the list
    setRequests(requests.filter((request) => request.id !== id))
  }

  return (
    <PageLayout title="Pesticide Installment Requests" backPath="/dashboard/store">
      {loading ? (
        <p>Loading installment requests...</p>
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

export default InstallmentRequests
