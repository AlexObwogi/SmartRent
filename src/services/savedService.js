// Get saved properties from localStorage
export const getSavedProperties = () => {
  const saved = localStorage.getItem('savedProperties');
  return saved ? JSON.parse(saved) : [];
};

// Save a property
export const saveProperty = (property) => {
  const saved = getSavedProperties();
  // Check if already saved
  if (saved.find((p) => p._id === property._id)) {
    return false; // Already saved
  }
  saved.push(property);
  localStorage.setItem('savedProperties', JSON.stringify(saved));
  return true;
};

// Remove a saved property
export const removeSavedProperty = (propertyId) => {
  const saved = getSavedProperties();
  const updated = saved.filter((p) => p._id !== propertyId);
  localStorage.setItem('savedProperties', JSON.stringify(updated));
  return updated;
};

// Check if a property is saved
export const isPropertySaved = (propertyId) => {
  const saved = getSavedProperties();
  return saved.some((p) => p._id === propertyId);
};