"use client"

import { useState } from "react"
import PageLayout from "../../components/PageLayout"
import Form from "../../components/Form"
import "./SharedProject.css"

function SharedProject() {
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState(null)
  const [nearbyFarmers, setNearbyFarmers] = useState([])
  const [selectedFarmers, setSelectedFarmers] = useState([])

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
      name: "duration",
      label: "Project Duration (in months)",
      type: "number",
      placeholder: "Enter duration",
      required: true,
    },
  ]

  const handleProjectSubmit = (formData) => {
    setProjectData(formData)

    // In a real app, you would fetch nearby farmers based on location
    // For this example, we'll use mock data
    setNearbyFarmers([
      {
        id: 1,
        name: "Alice Johnson",
        distance: 2.5,
        specialty: "Organic Vegetables",
      },
      {
        id: 2,
        name: "Bob Williams",
        distance: 3.8,
        specialty: "Fruit Orchards",
      },
      {
        id: 3,
        name: "Carol Davis",
        distance: 5.2,
        specialty: "Grain Farming",
      },
      {
        id: 4,
        name: "David Miller",
        distance: 6.7,
        specialty: "Dairy Farming",
      },
    ])

    setStep(2)
  }

  const toggleFarmerSelection = (farmerId) => {
    if (selectedFarmers.includes(farmerId)) {
      setSelectedFarmers(selectedFarmers.filter((id) => id !== farmerId))
    } else {
      setSelectedFarmers([...selectedFarmers, farmerId])
    }
  }

  const handleInvite = () => {
    if (selectedFarmers.length === 0) {
      alert("Please select at least one farmer to invite.")
      return
    }

    // In a real app, you would send invitations to selected farmers
    alert(`Invitations sent to ${selectedFarmers.length} farmers!`)
    setStep(3)
  }

  return (
    <PageLayout title="Start a Shared Project" backPath="/dashboard/farmer">
      {step === 1 && (
        <Form
          title="Project Details"
          fields={projectFields}
          submitText="Next: Find Farmers"
          onSubmit={handleProjectSubmit}
        />
      )}

      {step === 2 && (
        <div className="farmers-selection">
          <h2>Select Farmers to Invite</h2>
          <p>
            Project: {projectData.title} at {projectData.location}
          </p>

          <div className="farmers-list">
            {nearbyFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className={`farmer-card ${selectedFarmers.includes(farmer.id) ? "selected" : ""}`}
                onClick={() => toggleFarmerSelection(farmer.id)}
              >
                <h3>{farmer.name}</h3>
                <p>
                  <strong>Distance:</strong> {farmer.distance} km
                </p>
                <p>
                  <strong>Specialty:</strong> {farmer.specialty}
                </p>
                <div className="selection-indicator">{selectedFarmers.includes(farmer.id) ? "✓" : "+"}</div>
              </div>
            ))}
          </div>

          <div className="farmers-actions">
            <button className="back-btn" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="invite-btn" onClick={handleInvite}>
              Invite Selected Farmers ({selectedFarmers.length})
            </button>
          </div>
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
