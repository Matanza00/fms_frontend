import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { user3 } from '../../images';

const VehicleView = () => {
  const [isActive, setIsActive] = useState(true); // Default value for is_active
  const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt

  const data = {
    id: '2',
    reg: 'XYZ456',
    make: 'Honda',
    model: 'Civic',
    type: 'Sedan',
    size: 'Compact',
    odometer: '40,000 km',
    regCertificate: 'Yes',
    region: 'SR',
    subregion: 'Balochistan',
    station: 'Quetta',
    created_at: '2024-04-06',
  };

  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };

  // const CompanyView = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <div className="flex justify-between items-end p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Vehicle Details</h2>
        </div>

        <div className="flex p-5 bg-brand-primary">
          <div className="flex flex-col gap-1 w-4/5">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-md font-semibold">ID:</p>
                <p className="text-md mb-5 font-normal">{data.id}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Registration No.:</p>
                <p className="text-md mb-5 font-normal">{data.reg}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Make:</p>
                <p className="text-md mb-5 font-normal">{data.make}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Model:</p>
                <p className="text-md mb-5 font-normal">{data.model}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Type: </p>
                <p className="text-md mb-5 font-normal">{data.type}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Current Odometer: </p>
                <p className="text-md mb-5 font-normal">{data.odometer}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Reg Certificate: </p>
                <p className="text-md mb-5 font-normal">
                  {data.regCertificate}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Region: </p>
                <p className="text-md mb-5 font-normal">{data.region}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Substation: </p>
                <p className="text-md mb-5 font-normal">{data.subregion}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Station: </p>
                <p className="text-md mb-5 font-normal">{data.station}</p>
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

export default VehicleView;
