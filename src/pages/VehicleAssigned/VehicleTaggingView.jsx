import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import { useGetTagDriverQuery } from '../../services/tagDriverSlice';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const VehicleTaggingView = () => {
  const { id } = useParams();
  const { data } = useGetTagDriverQuery(id);
  const [isActive, setIsActive] = useState(true); // Default value for is_active
  const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt

  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Assigning Details"
          pageNameprev="Vehicle Assigned" //show the name on top heading
          pagePrevPath="vehicle-tagged" // add the previous path to the navigation
        />
        <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-end p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Assigning Details</h2>
          </div>

          <div className="flex p-5 bg-brand-primary">
            <div className="flex flex-col gap-1 w-4/5">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <p className="text-md font-semibold">Driver Name:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.data?.driver?.name}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Vehicle Number:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.data?.vehicleId}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Station: </p>
                  <p className="text-md mb-5 font-normal">
                    {data?.data?.station}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VehicleTaggingView;
