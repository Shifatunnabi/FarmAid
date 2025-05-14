"use client"

import { useState, useEffect } from "react"
import PageLayout from "../../components/PageLayout"
import Card from "../../components/Card"
import ProfileButton from "../../components/ProfileButton"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"
import "./RentalsAndPlans.css"

function RentalsAndPlans() {
  const [landRentals, setLandRentals] = useState([])
  const [bankLoans, setBankLoans] = useState([])
  const [pesticidePlans, setPesticidePlans] = useState([])
  const [instrumentRentals, setInstrumentRentals] = useState([])
  const [sharedProjects, setSharedProjects] = useState([])
  const [projectInvitations, setProjectInvitations] = useState([])
  const [loading, setLoading] = useState({
    lands: true,
    loans: true,
    pesticides: true,
    instruments: true,
    projects: true,
  })
  const [error, setError] = useState({
    lands: null,
    loans: null,
    pesticides: null,
    instruments: null,
    projects: null,
  })
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !user.id) return

    const fetchAllData = async () => {
      // Fetch land rentals
      try {
        const landsData = await farmerApi.getFarmerLands(user.id)
        setLandRentals(landsData)
      } catch (err) {
        console.error("Error fetching land rentals:", err)
        setError((prev) => ({ ...prev, lands: "Failed to load land rentals" }))
      } finally {
        setLoading((prev) => ({ ...prev, lands: false }))
      }

      // Fetch bank loans
      try {
        const loansData = await farmerApi.getFarmerLoans(user.id)
        setBankLoans(loansData)
      } catch (err) {
        console.error("Error fetching bank loans:", err)
        setError((prev) => ({ ...prev, loans: "Failed to load bank loans" }))
      } finally {
        setLoading((prev) => ({ ...prev, loans: false }))
      }

      // Fetch pesticide plans
      try {
        const pesticidesData = await farmerApi.getFarmerPesticides(user.id)
        setPesticidePlans(pesticidesData)
      } catch (err) {
        console.error("Error fetching pesticide plans:", err)
        setError((prev) => ({ ...prev, pesticides: "Failed to load pesticide plans" }))
      } finally {
        setLoading((prev) => ({ ...prev, pesticides: false }))
      }

      // Fetch instrument rentals
      try {
        const instrumentsData = await farmerApi.getInstrumentRentals(user.id)
        setInstrumentRentals(instrumentsData)
      } catch (err) {
        console.error("Error fetching instrument rentals:", err)
        setError((prev) => ({ ...prev, instruments: "Failed to load instrument rentals" }))
      } finally {
        setLoading((prev) => ({ ...prev, instruments: false }))
      }

      // Fetch shared projects and invitations
      try {
        const projectsData = await farmerApi.getFarmerProjects(user.id)
        const invitationsData = await farmerApi.getProjectInvitations(user.id)
        setSharedProjects(projectsData)
        setProjectInvitations(invitationsData)
      } catch (err) {
        console.error("Error fetching shared projects:", err)
        setError((prev) => ({ ...prev, projects: "Failed to load shared projects" }))
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }))
      }
    }

    fetchAllData()
  }, [user])

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await farmerApi.respondToProjectInvitation(invitationId, "accepted")
      // Refresh invitations and projects
      const invitationsData = await farmerApi.getProjectInvitations(user.id)
      const projectsData = await farmerApi.getFarmerProjects(user.id)
      setProjectInvitations(invitationsData)
      setSharedProjects(projectsData)
    } catch (err) {
      console.error("Error accepting invitation:", err)
      alert("Failed to accept invitation. Please try again.")
    }
  }

  const handleRejectInvitation = async (invitationId) => {
    try {
      await farmerApi.respondToProjectInvitation(invitationId, "rejected")
      // Remove the invitation from the list
      setProjectInvitations(projectInvitations.filter((inv) => inv.id !== invitationId))
    } catch (err) {
      console.error("Error rejecting invitation:", err)
      alert("Failed to reject invitation. Please try again.")
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "rented":
      case "booked":
      case "sold":
        return "status-approved"
      case "pending":
        return "status-pending"
      case "rejected":
        return "status-rejected"
      case "completed":
        return "status-completed"
      default:
        return "status-unknown"
    }
  }

  const renderSection = (title, items, type, isLoading, errorMsg) => {
    return (
      <div className="rentals-section">
        <h2 className="section-title">{title}</h2>
        {isLoading ? (
          <p className="loading-message">Loading {title.toLowerCase()}...</p>
        ) : errorMsg ? (
          <p className="error-message">{errorMsg}</p>
        ) : items.length === 0 ? (
          <p className="empty-message">No {title.toLowerCase()} found.</p>
        ) : (
          <div className="rentals-grid">
            {items.map((item) => (
              <div key={item.id} className="rental-card">
                <Card
                  title={item.title || item.name || `${type} #${item.id}`}
                  interest={
                    type === "Land"
                      ? item.interest_rate
                      : type === "Loan"
                        ? item.interest_rate
                        : type === "Pesticide"
                          ? item.interest_rate
                          : item.rent_price
                  }
                  description={
                    type === "Land"
                      ? `Location: ${item.location || "N/A"} | Size: ${item.size || "N/A"}`
                      : type === "Loan"
                        ? `Amount: ${item.amount || "N/A"} taka | Duration: ${item.duration || "N/A"}`
                        : type === "Pesticide"
                          ? `Price: ${item.price || "N/A"} taka | Installments: ${item.number_of_installments || "N/A"}`
                          : type === "Instrument"
                            ? `Duration: ${item.duration || "N/A"}`
                            : `Location: ${item.location || "N/A"} | Season: ${item.season || "N/A"}`
                  }
                />
                <div className="rental-footer">
                  <div className="rental-details">
                    <span className={`rental-status ${getStatusClass(item.status)}`}>{item.status || "Unknown"}</span>
                    {item.owner_id && (
                      <div className="owner-info">
                        <span className="owner-label">Owner:</span>
                        <ProfileButton userId={item.owner_id} name={item.owner_name || "View Owner"} />
                      </div>
                    )}
                    {item.bank_id && (
                      <div className="owner-info">
                        <span className="owner-label">Bank:</span>
                        <ProfileButton userId={item.bank_id} name={item.bank_name || "View Bank"} />
                      </div>
                    )}
                    {item.store_id && (
                      <div className="owner-info">
                        <span className="owner-label">Store:</span>
                        <ProfileButton userId={item.store_id} name={item.store_name || "View Store"} />
                      </div>
                    )}
                    {item.creator_id && (
                      <div className="owner-info">
                        <span className="owner-label">Creator:</span>
                        <ProfileButton userId={item.creator_id} name={item.creator_name || "View Creator"} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderInvitations = () => {
    if (projectInvitations.length === 0) return null

    return (
      <div className="invitations-section">
        <h3 className="section-subtitle">Project Invitations</h3>
        <div className="rentals-grid">
          {projectInvitations.map((invitation) => (
            <div key={invitation.id} className="invitation-card">
              <Card
                title={invitation.project_title || `Project #${invitation.project_id}`}
                description={`From: ${invitation.invitor_name || "Unknown"} | Project: ${invitation.project_description || "No description"}`}
              />
              <div className="invitation-footer">
                <div className="invitation-details">
                  <span className="invitation-label">Invitation</span>
                  <div className="owner-info">
                    <span className="owner-label">Inviter:</span>
                    <ProfileButton userId={invitation.invitor_id} name={invitation.invitor_name || "View Inviter"} />
                  </div>
                </div>
                <div className="invitation-actions">
                  <button className="accept-btn" onClick={() => handleAcceptInvitation(invitation.id)}>
                    Accept
                  </button>
                  <button className="reject-btn" onClick={() => handleRejectInvitation(invitation.id)}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageLayout title="Your Rentals and Plans" backPath="/dashboard/farmer">
      <div className="rentals-container">
        {renderSection("Your Land Rentals", landRentals, "Land", loading.lands, error.lands)}
        {renderSection("Your Bank Loans", bankLoans, "Loan", loading.loans, error.loans)}
        {renderSection("Your Pesticide Plans", pesticidePlans, "Pesticide", loading.pesticides, error.pesticides)}
        {renderSection(
          "Your Instrument Rentals",
          instrumentRentals,
          "Instrument",
          loading.instruments,
          error.instruments,
        )}

        <div className="rentals-section">
          <h2 className="section-title">Shared Projects</h2>
          {loading.projects ? (
            <p className="loading-message">Loading shared projects...</p>
          ) : error.projects ? (
            <p className="error-message">{error.projects}</p>
          ) : (
            <>
              {renderInvitations()}

              {sharedProjects.length === 0 && projectInvitations.length === 0 ? (
                <p className="empty-message">No shared projects found.</p>
              ) : (
                <div className="rentals-grid">
                  {sharedProjects.map((project) => (
                    <div key={project.id} className="rental-card">
                      <Card
                        title={project.title || `Project #${project.id}`}
                        description={`Location: ${project.location || "N/A"} | Season: ${project.season || "N/A"} | Status: ${project.status || "N/A"}`}
                      />
                      <div className="rental-footer">
                        <div className="rental-details">
                          <span className={`rental-status ${getStatusClass(project.status)}`}>
                            {project.status || "Unknown"}
                          </span>
                          <div className="owner-info">
                            <span className="owner-label">Creator:</span>
                            <ProfileButton userId={project.creator_id} name={project.creator_name || "View Creator"} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default RentalsAndPlans
