"use client"

import { useState } from "react"
import PageLayout from "../../components/PageLayout"
import Form from "../../components/Form"
import ProfileButton from "../../components/ProfileButton"
import { farmerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"
import "./SharedProject.css"

function SharedProject() {
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState(null)
  const [nearbyFarmers, setNearbyFarmers] = useState([])
  const [selectedFarmers, setSelectedFarmers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const projectFields = [
    {
      name: "title",
      label: "Project Title",
      type: "text",
      placeholder: "Enter project title",
      required: true,
    },
    {
      name: "location",
      label: "Project Location",
      type: "text",
      placeholder: "Enter location",
      required: true,
    },
    {
      name: "description",
      label: "Project Description",
      type: "textarea",
      placeholder: "Describe your project",
      required: true,
    },
    {
      name: "season",
      label: "Farming Season",
      type: "select",
      required: true,
      options: [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "fall", label: "Fall" },
        { value: "winter", label: "Winter" },
        { value: "year_round", label: "Year Round" },
      ],
    },
  ]

  const handleProjectSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      // Add creator ID to the form data
      const projectPayload = {
        ...formData,
        creatorId: user.id,
      }

      console.log("Creating shared project:", projectPayload)
      const response = await farmerApi.createSharedProject(projectPayload)
      console.log("Project created:", response)

      setProjectData({
        ...formData,
        id: response.projectId,
      })

      // Fetch nearby farmers
      console.log("Fetching nearby farmers for location:", formData.location)
      const farmersData = await farmerApi.getNearbyFarmers(formData.location)
      console.log("Nearby farmers:", farmersData)

      // Filter out the current user
      const filteredFarmers = farmersData.filter((farmer) => farmer.id !== user.id)
      setNearbyFarmers(filteredFarmers)

      setStep(2)
    } catch (err) {
      console.error("Error creating project:", err)
      setError("Failed to create project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleFarmerSelection = (farmerId) => {
    if (selectedFarmers.includes(farmerId)) {
      setSelectedFarmers(selectedFarmers.filter((id) => id !== farmerId))
    } else {
      setSelectedFarmers([...selectedFarmers, farmerId])
    }
  }

  const handleInvite = async () => {
    if (selectedFarmers.length === 0) {
      alert("Please select at least one farmer to invite.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const inviteData = {
        projectId: projectData.id,
        invitorId: user.id,
        invitedFarmerIds: selectedFarmers,
      }

      console.log("Sending invitations:", inviteData)
      await farmerApi.inviteToProject(inviteData)
      console.log("Invitations sent successfully")

      setStep(3)
    } catch (err) {
      console.error("Error sending invitations:", err)
      setError("Failed to send invitations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Start a Shared Project" backPath="/dashboard/farmer">
      {error && <div className="error-message">{error}</div>}

      {step === 1 && (
        <Form
          title="Project Details"
          fields={projectFields}
          submitText={loading ? "Creating Project..." : "Next: Find Farmers"}
          onSubmit={handleProjectSubmit}
        />
      )}

      {step === 2 && (
        <div className="farmers-selection">
          <h2>Select Farmers to Invite</h2>
          <p>
            Project: {projectData.title} at {projectData.location}
          </p>

          {loading ? (
            <p className="loading-message">Loading nearby farmers...</p>
          ) : nearbyFarmers.length === 0 ? (
            <p className="empty-message">No other farmers found in this area.</p>
          ) : (
            <>
              <div className="farmers-list">
                {nearbyFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className={`farmer-card ${selectedFarmers.includes(farmer.id) ? "selected" : ""}`}
                    onClick={() => toggleFarmerSelection(farmer.id)}
                  >
                    <h3>{farmer.name}</h3>
                    <p>
                      <strong>Email:</strong> {farmer.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {farmer.phone}
                    </p>
                    <div className="farmer-profile">
                      <ProfileButton userId={farmer.id} name="View Profile" />
                    </div>
                    <div className="selection-indicator">{selectedFarmers.includes(farmer.id) ? "✓" : "+"}</div>
                  </div>
                ))}
              </div>

              <div className="farmers-actions">
                <button className="back-btn" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </button>
                <button className="invite-btn" onClick={handleInvite} disabled={loading}>
                  {loading ? "Sending Invitations..." : `Invite Selected Farmers (${selectedFarmers.length})`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="success-message">
          <h2>Project Created Successfully!</h2>
          <p>
            Your project "{projectData.title}" has been created and invitations have been sent to the selected farmers.
          </p>
          <p>You will be notified when they respond to your invitation.</p>
          <button className="back-to-dashboard" onClick={() => (window.location.href = "/dashboard/farmer")}>
            Back to Dashboard
          </button>
        </div>
      )}
    </PageLayout>
  )
}

export default SharedProject
