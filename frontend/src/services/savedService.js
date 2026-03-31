import API from './api';

// Save property
export const saveProperty = async (property) => {
    const propertyId = property._id || property;
    const response = await API.post('/saved', { propertyId });
    return response.data;
};

// Get saved properties
export const getSavedProperties = async () => {
    try {
        const response = await API.get('/saved');
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // Not logged in - return empty array, don't show error
            return [];
        }
        throw error;
    }
};

// Remove saved property
export const removeSavedProperty = async (propertyId) => {
    const response = await API.delete(/saved/);
    return response.data;
};

// Check if a property is saved
export const isPropertySaved = async (propertyId) => {
    try {
        const savedProperties = await getSavedProperties();
        return savedProperties.some(saved => saved.property?._id === propertyId);
    } catch (error) {
        return false;
    }
};
