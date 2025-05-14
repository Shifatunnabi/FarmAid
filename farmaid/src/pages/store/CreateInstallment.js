"use client"
import { useState } from "react"
import PageLayout from "../../components/PageLayout"
import Form from "../../components/Form"
import { storeApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function CreateInstallment() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fields = [
    {
      name: "title",
      label: "Installment Plan Title",
      type: "text",
      placeholder: "Enter a descriptive title",
      required: true,
    },
    {
      name: "name",
      label: "Pesticide Product",
      type: "text",
      placeholder: "Enter product name",
      required: true,
    },
    {
      name: "price",
      label: "Total Price (in taka)",
      type: "number",
      placeholder: "Enter price",
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
      name: "numberOfInstallments",
      label: "Number of Installments",
      type: "number",
      placeholder: "Enter number of installments",
      required: true,
    },
    {
      name: "duration",
      label: "Maximum Duration (in months)",
      type: "number",
      placeholder: "Enter duration",
      required: true,
    },
    {
      name: "description",
      label: "Product Description",
      type: "textarea",
      placeholder: "Describe the pesticide product",
      required: true,
    },
    {
      name: "terms",
      label: "Installment Terms",
      type: "textarea",
      placeholder: "Describe the installment terms and conditions",
      required: true,
    },
  ]

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      // Add store ID to the form data
      const pesticideData = {
        ...formData,
        storeId: user.id,
      }

      console.log("Submitting pesticide data:", pesticideData)

      const response = await storeApi.postPesticide(pesticideData)
      console.log("API Response:", response)

      alert("Your installment plan has been created successfully!")
    } catch (error) {
      console.error("Error creating installment plan:", error)
      alert(`Failed to create installment plan: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Create an Installment Plan" backPath="/dashboard/pesticide_store">
      <Form
        title="New Installment Plan"
        fields={fields}
        submitText={loading ? "Creating..." : "Create Installment Plan"}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  )
}

export default CreateInstallment
