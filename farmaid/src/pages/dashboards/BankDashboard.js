import DashboardLayout from "../../components/DashboardLayout"

function BankDashboard() {
  const buttons = [
    {
      text: "Create New Loan",
      path: "/bank/create-loan", 
    },
    {
      text: "Check List and Status of Loans",
      path: "/bank/status",
    },
    {
      text: "Requests from Farmers",
      path: "/bank/requests",
    },
  ]

  return (
    <DashboardLayout
      photoSrc="https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      photoAlt="Bank building"
      buttons={buttons}
    />
  )
}

export default BankDashboard
