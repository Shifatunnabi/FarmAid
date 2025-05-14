// Base URL for API calls
const API_BASE_URL = "http://localhost:5000/api"

// Helper function for making API calls
export const fetchApi = async (endpoint, options = {}) => {
  try {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, options)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const data = await response.json()
    console.log(`API response from ${endpoint}:`, data)

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error)
    throw error
  }
}

// Auth API calls
export const authApi = {
  register: (userData) =>
    fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: (userId) =>
    fetchApi("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
}

// User API calls
export const userApi = {
  getUserById: (userId) => fetchApi(`/users/${userId}`),
}

// Farmer API calls
export const farmerApi = {
  getAvailableLands: () => fetchApi("/farmer/lands"),

  requestLand: (landId, farmerId) =>
    fetchApi(`/farmer/request-land/${landId}`, {
      method: "POST",
      body: JSON.stringify({ farmerId }),
    }),

  getAvailableLoans: () => fetchApi("/farmer/loans"),

  requestLoan: (loanId, farmerId) =>
    fetchApi(`/farmer/request-loan/${loanId}`, {
      method: "POST",
      body: JSON.stringify({ farmerId }),
    }),

  getAvailablePesticides: () => fetchApi("/farmer/pesticides"),

  requestPesticide: (pesticideId, farmerId) =>
    fetchApi(`/farmer/request-pesticide/${pesticideId}`, {
      method: "POST",
      body: JSON.stringify({ farmerId }),
    }),

  getAvailableInstruments: () => fetchApi("/farmer/instruments"),

  requestInstrument: (instrumentId, farmerId) =>
    fetchApi(`/farmer/request-instrument/${instrumentId}`, {
      method: "POST",
      body: JSON.stringify({ farmerId }),
    }),

  getInstrumentRentals: (farmerId) => fetchApi(`/farmer/instrument-rentals/${farmerId}`),

  // New endpoints for the comprehensive rentals page
  getFarmerLands: (farmerId) => fetchApi(`/farmer/land-rentals/${farmerId}`),

  getFarmerLoans: (farmerId) => fetchApi(`/farmer/loan-rentals/${farmerId}`),

  getFarmerPesticides: (farmerId) => fetchApi(`/farmer/pesticide-rentals/${farmerId}`),

  // Shared project endpoints
  createSharedProject: (projectData) =>
    fetchApi("/farmer/shared-project", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  getNearbyFarmers: (location) => fetchApi(`/farmer/nearby-farmers/${encodeURIComponent(location)}`),

  inviteToProject: (inviteData) =>
    fetchApi("/farmer/invite-to-project", {
      method: "POST",
      body: JSON.stringify(inviteData),
    }),

  getFarmerProjects: (farmerId) => fetchApi(`/farmer/projects/${farmerId}`),

  getProjectInvitations: (farmerId) => fetchApi(`/farmer/project-invitations/${farmerId}`),

  respondToProjectInvitation: (invitationId, response) =>
    fetchApi(`/farmer/respond-to-invitation/${invitationId}`, {
      method: "POST",
      body: JSON.stringify({ response }),
    }),
}

// Landowner API calls
export const landownerApi = {
  postLand: (landData) =>
    fetchApi("/landowner/post-land", {
      method: "POST",
      body: JSON.stringify(landData),
    }),

  getLands: (ownerId) => fetchApi(`/landowner/lands/${ownerId}`),

  getRentedLands: (ownerId) => fetchApi(`/landowner/rented-lands/${ownerId}`),

  getLandRequests: (ownerId) => fetchApi(`/landowner/land-requests/${ownerId}`),

  acceptLandRequest: (landId) =>
    fetchApi(`/landowner/accept-land-request/${landId}`, {
      method: "POST",
    }),

  rejectLandRequest: (landId) =>
    fetchApi(`/landowner/reject-land-request/${landId}`, {
      method: "POST",
    }),
}

// Bank API calls
export const bankApi = {
  postLoan: (loanData) =>
    fetchApi("/bank/post-loan", {
      method: "POST",
      body: JSON.stringify(loanData),
    }),

  getLoans: (bankId) => fetchApi(`/bank/loans/${bankId}`),

  getApprovedLoans: (bankId) => fetchApi(`/bank/approved-loans/${bankId}`),

  getLoanRequests: (bankId) => fetchApi(`/bank/loan-requests/${bankId}`),

  acceptLoanRequest: (loanId) =>
    fetchApi(`/bank/accept-loan-request/${loanId}`, {
      method: "POST",
    }),

  rejectLoanRequest: (loanId) =>
    fetchApi(`/bank/reject-loan-request/${loanId}`, {
      method: "POST",
    }),
}


// Store API calls
export const storeApi = {
  postPesticide: (pesticideData) =>
    fetchApi("/store/post-pesticide", {
      method: "POST",
      body: JSON.stringify(pesticideData),
    }),

  getPesticides: (storeId) => fetchApi(`/store/pesticides/${storeId}`),

  getSoldPesticides: (storeId) => fetchApi(`/store/sold-pesticides/${storeId}`),

  getPesticideRequests: (storeId) => fetchApi(`/store/pesticide-requests/${storeId}`),

  acceptPesticideRequest: (pesticideId) =>
    fetchApi(`/store/accept-pesticide-request/${pesticideId}`, {
      method: "POST",
    }),

  rejectPesticideRequest: (pesticideId) =>
    fetchApi(`/store/reject-pesticide-request/${pesticideId}`, {
      method: "POST",
    }),
}

// Instrument Owner API calls
export const instrumentApi = {
  postInstrument: (instrumentData) =>
    fetchApi("/instrument/post-instrument", {
      method: "POST",
      body: JSON.stringify(instrumentData),
    }),

  getInstruments: (ownerId) => fetchApi(`/instrument/instruments/${ownerId}`),

  getRentedInstruments: (ownerId) => fetchApi(`/instrument/rented-instruments/${ownerId}`),

  getInstrumentRequests: (ownerId) => fetchApi(`/instrument/instrument-requests/${ownerId}`),

  acceptInstrumentRequest: (instrumentId) =>
    fetchApi(`/instrument/accept-instrument-request/${instrumentId}`, {
      method: "POST",
    }),

  rejectInstrumentRequest: (instrumentId) =>
    fetchApi(`/instrument/reject-instrument-request/${instrumentId}`, {
      method: "POST",
    }),
}
