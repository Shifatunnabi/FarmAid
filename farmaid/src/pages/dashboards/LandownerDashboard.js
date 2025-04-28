import DashboardLayout from "../../components/DashboardLayout"

function LandownerDashboard() {
  const buttons = [
    {
      text: "Rent a Land",
      path: "/landowner/rent-land",
    },
    {
      text: "Check List and Status of Rented Land",
      path: "/landowner/status",
    },
    {
      text: "Requests from Farmers",
      path: "/landowner/requests",
    },
  ]

  return (
    <DashboardLayout
      photoSrc="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      photoAlt="Landowner with property"
      buttons={buttons}
    />
  )
}

export default LandownerDashboard
