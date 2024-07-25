import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const LocationForm = () => {
  const [addType, setAddType] = useState('');
  const [formData, setFormData] = useState({
    region: '',
    subregion: '',
    station: '',
  });

  const regions = [
    { id: 1, name: 'Region 1' },
    { id: 2, name: 'Region 2' },
    { id: 3, name: 'Region 3' },
  ];

  const subregions = {
    1: [
      { id: 1, name: 'Subregion 1.1' },
      { id: 2, name: 'Subregion 1.2' },
      { id: 3, name: 'Subregion 1.3' },
    ],
    2: [
      { id: 4, name: 'Subregion 2.1' },
      { id: 5, name: 'Subregion 2.2' },
      { id: 6, name: 'Subregion 2.3' },
    ],
    3: [
      { id: 7, name: 'Subregion 3.1' },
      { id: 8, name: 'Subregion 3.2' },
      { id: 9, name: 'Subregion 3.3' },
    ],
  };

  const stations = {
    1: {
      1: [
        { id: 1, name: 'Station 1.1.1' },
        { id: 2, name: 'Station 1.1.2' },
        { id: 3, name: 'Station 1.1.3' },
      ],
      2: [
        { id: 4, name: 'Station 1.2.1' },
        { id: 5, name: 'Station 1.2.2' },
        { id: 6, name: 'Station 1.2.3' },
      ],
      3: [
        { id: 7, name: 'Station 1.3.1' },
        { id: 8, name: 'Station 1.3.2' },
        { id: 9, name: 'Station 1.3.3' },
      ],
    },
    2: {
      4: [
        { id: 10, name: 'Station 2.1.1' },
        { id: 11, name: 'Station 2.1.2' },
        { id: 12, name: 'Station 2.1.3' },
      ],
      5: [
        { id: 13, name: 'Station 2.2.1' },
        { id: 14, name: 'Station 2.2.2' },
        { id: 15, name: 'Station 2.2.3' },
      ],
      6: [
        { id: 16, name: 'Station 2.3.1' },
        { id: 17, name: 'Station 2.3.2' },
        { id: 18, name: 'Station 2.3.3' },
      ],
    },
    3: {
      7: [
        { id: 19, name: 'Station 3.1.1' },
        { id: 20, name: 'Station 3.1.2' },
        { id: 21, name: 'Station 3.1.3' },
      ],
      8: [
        { id: 22, name: 'Station 3.2.1' },
        { id: 23, name: 'Station 3.2.2' },
        { id: 24, name: 'Station 3.2.3' },
      ],
      9: [
        { id: 25, name: 'Station 3.3.1' },
        { id: 26, name: 'Station 3.3.2' },
        { id: 27, name: 'Station 3.3.3' },
      ],
    },
  };

  const handleChangeAddType = (e) => {
    setAddType(e.target.value);
    setFormData({
      region: '',
      subregion: '',
      station: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming submission logic here
    // You can replace this with your actual submission logic

    // Show success toast message
    toast.success('Data stored successfully!', {
      position: toast.POSITION.TOP_RIGHT,
    });

    setFormData({
      region: '',
      subregion: '',
      station: '',
    });
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <Breadcrumb pageName="Add Location" />
        <div className="p-4">
          <ToastContainer />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">What would you like to add?</label>
              <select
                value={addType}
                onChange={handleChangeAddType}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="region">Region</option>
                <option value="subregion">Subregion</option>
                <option value="station">Station</option>
              </select>
            </div>
            {addType === 'region' && (
              <div>
                <label htmlFor="region" className="block">
                  Region Name:
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  placeholder="Enter Region Name"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            )}
            {addType === 'subregion' && (
              <div>
                <label htmlFor="region" className="block">
                  Region:
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {formData.region && (
                  <div>
                    <label htmlFor="subregion" className="block">
                      Subregion:
                    </label>
                    <input
                      type="text"
                      id="subregion"
                      name="subregion"
                      value={formData.subregion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            )}
            {addType === 'station' && (
              <div>
                <label htmlFor="region" className="block">
                  Region:
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {formData.region && (
                  <div>
                    <label htmlFor="subregion" className="block">
                      Subregion:
                    </label>
                    <select
                      id="subregion"
                      name="subregion"
                      value={formData.subregion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="">Select Subregion</option>
                      {subregions[formData.region].map((subregion) => (
                        <option key={subregion.id} value={subregion.id}>
                          {subregion.name}
                        </option>
                      ))}
                    </select>
                    {formData.subregion && (
                      <div>
                        <label htmlFor="station" className="block">
                          Station:
                        </label>
                        <input
                          type="text"
                          id="station"
                          name="station"
                          value={formData.station}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LocationForm;
