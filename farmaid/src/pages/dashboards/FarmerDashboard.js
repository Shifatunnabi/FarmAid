import DashboardLayout from "../../components/DashboardLayout"

function FarmerDashboard() {
  const buttons = [
    {
      text: "Get Rented Land",
      path: "/farmer/rented-land",
    },
    {
      text: "Get Loan from Bank",
      path: "/farmer/bank-loans",
    },
    {
      text: "Get Installment from Pesticide Store",
      path: "/farmer/pesticide-installments",
    },
    {
      text: "Rent Agricultural Instruments",
      path: "/farmer/instruments",
    },
    {
      text: "Your Rentals and Plans",
      path: "/farmer/rentals-and-plans",
    },
    {
      text: "Start Shared Project",
      path: "/farmer/shared-project",
    },
  ]

  return (
    <DashboardLayout
      photoSrc="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      photoAlt="Farmer in field"
      buttons={buttons}
    />
  )
}

export default FarmerDashboard
