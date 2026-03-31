import API from './api';

// Get all properties
export const getProperties = async (params = {}) => {
    const response = await API.get('/houses', { params });
    return response.data;
};

// Get single property
export const getProperty = async (id) => {
    const response = await API.get(`/houses/${id}`);
    return response.data;
};

// Create property (landlord only)
export const createProperty = async (propertyData) => {
    const response = await API.post('/houses', propertyData);
    return response.data;
};

// Update property
export const updateProperty = async (id, propertyData) => {
    const response = await API.put(`/houses/${id}`, propertyData);
    return response.data;
};

// Delete property
export const deleteProperty = async (id) => {
    const response = await API.delete(`/houses/${id}`);
    return response.data;
};

// Get my properties (landlord)
export const getMyProperties = async () => {
    const response = await API.get('/houses/my-properties');
    return response.data;
};