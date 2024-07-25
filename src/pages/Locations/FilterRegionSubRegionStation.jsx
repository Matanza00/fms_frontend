import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const FilterRegionSubRegionStation = () => {
  // States to store options for each select box
  const [regionOptions, setRegionOptions] = useState([]);
  const [subRegionOptions, setSubRegionOptions] = useState([]);
  const [stationOptions, setStationOptions] = useState([]);

  // Fetch options from backend on component mount
  useEffect(() => {
    // Function to fetch options for region
    const fetchRegionOptions = async () => {
      try {
        // Example API endpoint for region options
        const response = await fetch('YOUR_REGION_API_ENDPOINT_HERE');
        const data = await response.json();
        // Assuming data is an array of objects with 'value' and 'label' properties
        setRegionOptions(data);
      } catch (error) {
        console.log('Error fetching region options:', error);
      }
    };

    // Function to fetch options for sub-region
    const fetchSubRegionOptions = async () => {
      try {
        // Example API endpoint for sub-region options
        const response = await fetch('YOUR_SUB_REGION_API_ENDPOINT_HERE');
        const data = await response.json();
        // Assuming data is an array of objects with 'value' and 'label' properties
        setSubRegionOptions(data);
      } catch (error) {
        console.error('Error fetching sub-region options:', error);
      }
    };

    // Function to fetch options for station
    const fetchStationOptions = async () => {
      try {
        // Example API endpoint for station options
        const response = await fetch('YOUR_STATION_API_ENDPOINT_HERE');
        const data = await response.json();
        // Assuming data is an array of objects with 'value' and 'label' properties
        setStationOptions(data);
      } catch (error) {
        console.error('Error fetching station options:', error);
      }
    };

    fetchRegionOptions();
    fetchSubRegionOptions();
    fetchStationOptions();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="flex space-x-1">
      <Select
        className="w-40 max-w-40"
        options={regionOptions}
        placeholder="Region"
      />
      <Select
        className="w-40 max-w-40"
        options={subRegionOptions}
        placeholder="Sub Region"
      />
      <Select
        className="w-40 max-w-40"
        options={stationOptions}
        placeholder="Station"
      />
    </div>
  );
};

export default FilterRegionSubRegionStation;
