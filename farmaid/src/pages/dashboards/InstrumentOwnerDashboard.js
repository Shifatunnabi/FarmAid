import DashboardLayout from "../../components/DashboardLayout"

function InstrumentOwnerDashboard() {
  const buttons = [
    {
      text: "Post Agricultural Instrument",
      path: "/instrument-owner/post",
    },
    {
      text: "List & Status of Instruments",
      path: "/instrument-owner/status",
    },
    {
      text: "Requests from Farmers",
      path: "/instrument-owner/requests",
    },
  ]

  return (
    <DashboardLayout
      photoSrc="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      photoAlt="Agricultural instruments"
      buttons={buttons}
    />
  )
}

export default InstrumentOwnerDashboard
