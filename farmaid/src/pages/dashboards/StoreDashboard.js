import DashboardLayout from "../../components/DashboardLayout"


function StoreDashboard() {
  const buttons = [
    {
      text: "Create Installment in Pesticide",
      path: "/store/create-installment",
    },
    {
      text: "Check List and Status of Installments",
      path: "/store/status",
    },
    {
      text: "Requests from Farmers",
      path: "/store/requests",
    },
  ]

  return (
    <DashboardLayout
      photoSrc="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      photoAlt="Pesticide store"
      buttons={buttons}
    />
  )
}

export default StoreDashboard
