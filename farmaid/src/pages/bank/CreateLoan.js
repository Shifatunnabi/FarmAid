
import { useState } from "react"
import PageLayout from "../../components/PageLayout"
import Form from "../../components/Form"
import { bankApi } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

function CreateLoan() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fields = [
    {
      name: "title",
      label: "Loan Title",
      type: "text",
      placeholder: "Enter a descriptive title",
      required: true,
    },
    {
      name: "amount",
      label: "Maximum Loan Amount (in taka)",
      type: "number",
      placeholder: "Enter amount",
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
      name: "duration",
      label: "Maximum Duration (in months)",
      type: "number",
      placeholder: "Enter duration",
      required: true,
    },
    {
      name: "purpose",
      label: "Loan Purpose",
      type: "select",
      required: true,
      options: [
        { value: "seeds", label: "Purchase Seeds" },
        { value: "equipment", label: "Farm Equipment" },
        { value: "irrigation", label: "Irrigation System" },
        { value: "general", label: "General Purpose" },
      ],
    },
    {
      name: "description",
      label: "Loan Description",
      type: "textarea",
      placeholder: "Describe the loan terms and conditions",
      required: true,
    },
    {
      name: "requirements",
      label: "Eligibility Requirements",
      type: "textarea",
      placeholder: "List the requirements for farmers to be eligible",
      required: true,
    },
  ]

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      // Add bank ID to the form data
      const loanData = {
        ...formData,
        bankId: user.id,
      }

      console.log("Submitting loan data:", loanData)

      const response = await bankApi.postLoan(loanData)
      console.log("API Response:", response)

      alert("Your loan offer has been created successfully!")
    } catch (error) {
      console.error("Error creating loan:", error)
      alert(`Failed to create loan: ${error.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Create a Loan Offer" backPath="/dashboard/bank">
      <Form
        title="New Loan Offer"
        fields={fields}
        submitText={loading ? "Creating..." : "Create Loan Offer"}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  )
}

export default CreateLoan
