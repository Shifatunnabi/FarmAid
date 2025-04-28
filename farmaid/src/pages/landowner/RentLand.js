"use client"
import { useState } from "react"
import PageLayout from "../../components/PageLayout"
import Form from "../../components/Form"
import { landownerApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function RentLand() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fields = [
    {
      name: "title",
      label: "Land Title",
      type: "text",
      placeholder: "Enter a descriptive title",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
      required: true,
    },
    {
      name: "size",
      label: "Area (in acres)",
      type: "number",
      placeholder: "Enter area",
      required: true,
    },
    {
      name: "interestRate",
      label: "Interest Rate (%)",
      type: "number",
      placeholder: "Enter interest rate",
      required: true,
    },
    {
      name: "description",
      label: "Land Description",
      type: "textarea",
      placeholder: "Describe your land (soil type, irrigation, etc.)",
      required: true,
    },
    {
      name: "duration",
      label: "Minimum Rental Duration (in months)",
      type: "number",
      placeholder: "Enter duration",
      required: true,
    },
  ]

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      // Add owner ID to the form data
      const landData = {
        ...formData,
        ownerId: user.id,
      }

      console.log("Submitting land data:", landData)

      const response = await landownerApi.postLand(landData)
      console.log("API Response:", response)

      alert("Your land has been listed for rent successfully!")
    } catch (error) {
      console.error("Error posting land:", error)
      alert(`Failed to list land: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Rent Your Land" backPath="/dashboard/landowner">
      <Form
        title="Land Rental Listing"
        fields={fields}
        submitText={loading ? "Submitting..." : "List Land for Rent"}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  )
}

export default RentLand
