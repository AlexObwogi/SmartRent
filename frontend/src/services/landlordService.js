import API from './api';

// Get applications for landlord's properties
export const getLandlordApplications = async () => {
    const response = await API.get('/landlord/landlord-applications');
    return response.data;
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
    const response = await API.put(`/landlord/applications/${applicationId}`, { status });
    return response.data;
};

// Get landlord's properties
export const getLandlordProperties = async () => {
    const response = await API.get('/houses/my-properties');
    return response.data;
};