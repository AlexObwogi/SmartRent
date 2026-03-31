import API from "./api";

// Create application (tenant)
export const createApplication = async (applicationData) => {
    const response = await API.post("/bookings", applicationData);
    return response.data;
};

// Get my applications (tenant)
export const getMyApplications = async () => {
    const response = await API.get("/bookings/my-bookings");
    return response.data;
};

// Get applications for my properties (landlord)
export const getPropertyApplications = async (propertyId) => {
    const response = await API.get(`/bookings/property/${propertyId}`);
    return response.data;
};
