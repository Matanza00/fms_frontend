import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { user3 } from '../../images';

const LocationSubregionTable = () => {
  // const [isActive, setIsActive] = useState(true); // Default value for is_active
  // const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt

  const data1 = {
    id: '123456',
    email: 'example@example.com',
    name: 'Example Company',
    address: '123 Main St, City, Country',
    logo: 'https://via.placeholder.com/150',
    number_of_users: 100,
    subscription_plan: 'Premium',
    is_active: 'isActive',
    created_at: '2023-01-15',
    updated_at: '2023-03-20',
    deleted_at: null, // Assuming it's not deleted
  };
  const data = {
    id: '1',
    name: 'Northern Region',
    number_of_subregion: 4,
    created_at: '2023-01-15',
    updated_at: '2023-03-20',
    deleted_at: null, // Assuming it's not deleted
  };

  // const CompanyView = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <div className="flex justify-between items-end p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Region Details</h2>
        </div>

        <div className="flex p-5 bg-brand-primary">
          <div className="flex flex-col gap-1 w-4/5">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-md font-semibold">Region Name:</p>
                <p className="text-md mb-5 font-normal">{data.name}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Region Id:</p>
                <p className="text-md mb-5 font-normal">{data.id}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Total Subregions:</p>
                <p className="text-md mb-5 font-normal">{data.address}</p>
              </div>

              <div>
                <p className="text-md font-semibold">Created At:</p>
                <p className="text-md mb-5 font-normal">{data.created_at}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LocationSubregionTable;
