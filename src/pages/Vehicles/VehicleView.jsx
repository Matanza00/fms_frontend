import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../../components/Modal';
import { useParams } from 'react-router-dom';
import { useGetVehicleQuery } from '../../services/vehicleSlice';
import { formatDateForInput } from '../../utils/helpers';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const VehicleView = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetVehicleQuery(id);
  const [isActive, setIsActive] = useState(true); // Default value for is_active
  const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };

  const handleRegistrationModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-600">
          <BreadcrumbNav
            pageName="View Vehicle"
            pageNameprev="Vehicles" //show the name on top heading
            pagePrevPath="vehicles" // add the previous path to the navigation
          />
          <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-end p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Vehicle Details</h2>
            </div>

            <div className="flex p-5 bg-brand-primary">
              <div className="flex flex-col gap-1 w-4/5">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-md font-semibold">ID:</p>
                    <p className="text-md mb-5 font-normal">{data?.data?.id}</p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Registration No.:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.registrationNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Make:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.make}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Model:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Type: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Size: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Fuel Type: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.fuelType}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Odometer Reading: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.oddometerReading} Km
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Commission Date: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.commisionDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Door Type: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.doorType}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Region: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.region}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Subregion: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.subRegion}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Station: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.station}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Created At:</p>
                    <p className="text-md mb-5 font-normal">
                      {formatDateForInput(data?.data?.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Registration Certificate:{' '}
                    </p>
                    <div onClick={handleRegistrationModal}>
                      <img
                        src={data?.data?.registrationCertificate}
                        alt="Registration Certificate"
                        className="mb-5 cursor-pointer"
                        style={{ width: '40%', height: '40%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
      <Modal isOpen={modalIsOpen} title={'Registration Certificate'}>
        <img
          src={data?.data?.registrationCertificate}
          alt="Registration Certificate"
          className="mb-5"
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </Modal>
    </>
  );
};

export default VehicleView;
