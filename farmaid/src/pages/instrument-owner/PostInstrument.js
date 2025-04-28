"use client"
import { useState } from "react"
import PageLayout from "../../components/PageLayout"
import Form from "../../components/Form"
import { instrumentApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function PostInstrument() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fields = [
    {
      name: "title",
      label: "Instrument Title",
      type: "text",
      placeholder: "Enter a descriptive title",
      required: true,
    },
    {
      name: "name",
      label: "Instrument Name",
      type: "text",
      placeholder: "Enter instrument name",
      required: true,
    },
    {
      name: "type",
      label: "Instrument Type",
      type: "select",
      required: true,
      options: [
        { value: "tractor", label: "Tractor" },
        { value: "power-tiller", label: "Power Tiller" },
        { value: "seed-drill", label: "Seed Drill" },
        { value: "rotavator", label: "Rotavator" },
        { value: "sprayer", label: "Sprayer Machine" },
        { value: "cultivator", label: "Cultivator" },
        { value: "thresher", label: "Threshing Machine" },
        { value: "pump", label: "Irrigation Pump" },
        { value: "plough", label: "Plough" },
        { value: "harvester", label: "Harvester" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "rentPrice",
      label: "Rent Rate (per day in $)",
      type: "number",
      placeholder: "Enter rent rate",
      required: true,
    },
    {
      name: "duration",
      label: "Availability Duration (in days)",
      type: "number",
      placeholder: "Enter duration",
      required: true,
    },
    {
      name: "description",
      label: "Instrument Description",
      type: "textarea",
      placeholder: "Describe your instrument (model, condition, features, etc.)",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter your location",
      required: true,
    },
  ]

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      // Add owner ID to the form data
      const instrumentData = {
        ...formData,
        ownerId: user.id,
      }

      console.log("Submitting instrument data:", instrumentData)

      const response = await instrumentApi.postInstrument(instrumentData)
      console.log("API Response:", response)

      alert("Your instrument has been listed successfully!")
    } catch (error) {
      console.error("Error posting instrument:", error)
      setError(`Failed to post instrument: ${error.message || "Unknown error"}`)
      alert(`Failed to post instrument: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Post Agricultural Instrument" backPath="/dashboard/instrument-owner">
      {error && <div className="error-message">{error}</div>}
      <Form
        title="Instrument Listing"
        fields={fields}
        submitText={loading ? "Posting..." : "Post Instrument"}
        onSubmit={handleSubmit}
      />
      <style jsx>{`
        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
      `}</style>
    </PageLayout>
  )
}

export default PostInstrument
