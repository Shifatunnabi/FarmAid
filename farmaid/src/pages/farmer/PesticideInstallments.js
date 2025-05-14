"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"
import ProfileButton from "../../components/ProfileButton"

function PesticideInstallments() {
  const [pesticides, setPesticides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchPesticides = async () => {
      try {
        const pesticidesData = await farmerApi.getAvailablePesticides()
        setPesticides(pesticidesData)
      } catch (err) {
        setError("Failed to load available pesticides. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPesticides()
  }, [])

  const handleApply = async (pesticideId) => {
    try {
      await farmerApi.requestPesticide(pesticideId, user.id)
      // Update the local state to reflect the change
      setPesticides(
        pesticides.map((pesticide) =>
          pesticide.id === pesticideId ? { ...pesticide, status: "pending", requested_by: user.id } : pesticide,
        ),
      )
      alert("Pesticide installment request submitted successfully!")
    } catch (err) {
      alert("Failed to submit pesticide request. Please try again.")
      console.error(err)
    }
  }

  return (
    <PageLayout title="Pesticide Installment Plans" backPath="/dashboard/farmer">
      {loading ? (
        <p>Loading installment plans...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : pesticides.length === 0 ? (
        <p>No pesticide installment plans available at the moment.</p>
      ) : (
        <div className="pesticides-container">
          {pesticides.map((pesticide) => (
            <div key={pesticide.id} className="pesticide-card">
              <Card
                title={pesticide.title || pesticide.name || "Untitled Pesticide"}
                interest={pesticide.interest_rate}
                description={`Price: ${pesticide.price} taka | Installments: ${pesticide.number_of_installments} | Duration: ${pesticide.duration}`}
                buttonText={
                  pesticide.status === "available"
                    ? "Apply for Plan"
                    : pesticide.status === "pending"
                      ? "Pending"
                      : "Sold"
                }
                onButtonClick={() => handleApply(pesticide.id)}
                disabled={pesticide.status !== "available"}
              />
              <div className="pesticide-footer">
                <div className="pesticide-status">
                  Status:{" "}
                  <span
                    className={`status-badge ${
                      pesticide.status === "available"
                        ? "status-available"
                        : pesticide.status === "pending"
                          ? "status-pending"
                          : "status-sold"
                    }`}
                  >
                    {pesticide.status || "available"}
                  </span>
                </div>
                <ProfileButton userId={pesticide.store_id} name={pesticide.store_name || "View Store"} />
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .pesticides-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .pesticide-card {
          display: flex;
          flex-direction: column;
        }
        
        .pesticide-footer {
          display: flex;
          justify-content: space-between;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0 0 8px 8px;
          margin-top: -1rem;
        }
        
        .pesticide-status {
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
        
        .status-sold {
          background-color: #3498db;
          color: white;
        }
        
        .error-message {
          color: #e74c3c;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .pesticides-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export default PesticideInstallments
