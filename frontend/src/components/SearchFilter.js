import React, { useState } from 'react';

const SearchFilter = ({ filters, onSearch }) => {
  const [localFilters, setLocalFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    ...filters,
  });

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
    };
    setLocalFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <form className="search-filter" onSubmit={handleSubmit}>
      <div className="filter-group filter-group-wide">
        <input
          type="text"
          name="location"
          value={localFilters.location}
          onChange={handleChange}
          placeholder="🔍 Search by location..."
        />
      </div>

      <div className="filter-group">
        <select
          name="propertyType"
          value={localFilters.propertyType}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Condo">Condo</option>
          <option value="Studio">Studio</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          name="bedrooms"
          value={localFilters.bedrooms}
          onChange={handleChange}
        >
          <option value="">Any Beds</option>
          <option value="1">1+ Bed</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
        </select>
      </div>

      <div className="filter-group">
        <input
          type="number"
          name="minPrice"
          value={localFilters.minPrice}
          onChange={handleChange}
          placeholder="Min Price ($)"
        />
      </div>

      <div className="filter-group">
        <input
          type="number"
          name="maxPrice"
          value={localFilters.maxPrice}
          onChange={handleChange}
          placeholder="Max Price ($)"
        />
      </div>

      <button type="submit" className="btn-search">Search</button>
      <button type="button" onClick={handleReset} className="btn-reset">
        Reset
      </button>
    </form>
  );
};

export default SearchFilter;