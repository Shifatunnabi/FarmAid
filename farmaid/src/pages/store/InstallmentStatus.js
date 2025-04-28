"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"

function InstallmentStatus() {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch data from an API
    // For this example, we'll use mock data
    setTimeout(() => {
      setInstallments([
        {
          id: 1,
          title: "Organic Pesticide Package",
          interest: 3,
          description: "Eco-friendly pesticides suitable for organic farming. Includes application equipment.",
          status: "Active",
          applications: 8,
        },
        {
          id: 2,
          title: "Complete Pest Control Kit",
          interest: 4.5,
          description: "Comprehensive pest control solution for multiple crops. Includes herbicides and fungicides.",
          status: "Active",
          applications: 12,
        },
        {
          id: 3,
          title: "Season-Long Protection Plan",
          interest: 5,
          description: "Full season protection with scheduled applications and consultations.",
          status: "Paused",
          applications: 3,
        },
        {
          id: 4,
          title: "Specialized Fruit Tree Treatment",
          interest: 3.5,
          description: "Targeted pesticides for fruit orchards with minimal environmental impact.",
          status: "Active",
          applications: 10,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleViewDetails = (id) => {
    alert(`Viewing details for installment plan #${id}. In a real app, this would open a detailed view.`)
  }

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active"
    alert(`Installment plan #${id} status changed to ${newStatus}. In a real app, this would update the database.`)

    // Update the local state to reflect the change
    setInstallments(
      installments.map((installment) => (installment.id === id ? { ...installment, status: newStatus } : installment)),
    )
  }

  return (
    <PageLayout title="Installment Plans Status" backPath="/dashboard/store">
      {loading ? (
        <p>Loading installment plans...</p>
      ) : (
        <div className="installments-container">
          {installments.map((installment) => (
            <div key={installment.id} className="installment-card">
              <Card
                title={installment.title}
                interest={installment.interest}
                description={installment.description}
                buttonText="View Details"
                onButtonClick={() => handleViewDetails(installment.id)}
              />
              <div className="installment-footer">
                <div className="installment-stats">
                  <span className={`installment-status ${installment.status.toLowerCase()}`}>{installment.status}</span>
                  <span className="installment-applications">{installment.applications} Applications</span>
                </div>
                <button
                  className={`toggle-status-btn ${installment.status === "Active" ? "pause" : "activate"}`}
                  onClick={() => handleToggleStatus(installment.id, installment.status)}
                >
                  {installment.status === "Active" ? "Pause Plan" : "Activate Plan"}
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
          align-items: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .installment-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
        
        .installment-applications {
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
