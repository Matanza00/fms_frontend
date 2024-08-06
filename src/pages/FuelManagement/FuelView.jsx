import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../../components/Modal';
import { useGetFuelRequestQuery } from '../../services/fuelSlice';
import { useParams } from 'react-router-dom';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import { formatDateAndTime } from '../../utils/helpers';

const FuelView = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetFuelRequestQuery(id);
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

  console.log(data?.data);

  return (
    <>
      <DefaultLayout>
        <div className="mx-auto max-w-600">
          <BreadcrumbNav
            pageName="Fuel Request Details"
            pageNameprev="Fuel Management" //show the name on top heading
            pagePrevPath="fuel-management" // add the previous path to the navigation
          />
          <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-end p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Fuel Request Details</h2>
            </div>

            <div className="flex p-5 bg-brand-primary">
              <div className="flex flex-col gap-1 w-4/5  ">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-md font-semibold">Registration No.:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.registrationNo}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Vehicle Make.:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.make}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Driver:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.driverName}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Driver ID:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.gbmsNo}
                    </p>
                  </div>

                  {/* <div>
                  <p className="text-md font-semibold">Supervisor:</p>
                  <p className="text-md mb-5 font-normal">{data.supervisor}</p>
                </div> */}
                  <div>
                    <p className="text-md font-semibold">
                      Previous Odometer Reading:{' '}
                    </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.previousOddometerReading}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Current Odometer Reading (Auto):{' '}
                    </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.currentOddometerReadingAuto}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Current Odometer Reading (Manually):{' '}
                    </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.currentOddometerReading}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Fuel Average: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.fuelAverage}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Rate of Fuel: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.rateOfFuel}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Quantity of Fuel: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.quantityOfFuel}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Last Fueling Date: </p>
                    <p className="text-md mb-5 font-normal">
                      {formatDateAndTime(data?.data?.lastCreatedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Previous Quantity of Fuel:{' '}
                    </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.previousFuelQuantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Amount: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Mode of Fueling: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.modeOfFueling}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Card Number: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.cardNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Fueling Date: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.currentFuelingDate?.slice(0, 10)}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Request Generated at:{' '}
                    </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.created_at?.slice(0, 10)}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Fuel Type:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.fuelType}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Request Type:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.requestType}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Station: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.station}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Status: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Fueling Reciept: </p>
                    <img
                      className="w-48 h-48 object-contain"
                      src={data?.data?.fuelReceipt}
                      alt="Reciept"
                    />
                  </div>

                  <div>
                    <p className="text-md font-semibold">Odometer Image: </p>
                    <img
                      className="w-48 h-48 object-contain"
                      src={data?.data?.odometerImg}
                      alt="Odometer Image"
                    />
                  </div>
                </div>
              </div>
              <div className="border-2 flex flex-col  flex-auto max-h">
                <div className="h-10 font-semibold  border-b-2 border-black">
                  Fuel Logs
                </div>
                <div className="h-[70vh] overflow-y-scroll">
                  {data?.data?.FuelRequestLog.length > 0 ? (
                    data?.data?.FuelRequestLog.map((e, i) => {
                      const createdAt = new Date(e.created_at);
                      const date = createdAt.toISOString().slice(0, 10);
                      const time = createdAt.toTimeString().slice(0, 5);
                      const formattedDateTime = `Date: ${date}, Time: ${time}`;

                      return (
                        <div
                          key={i}
                          className="h-auto border border-dashed text-sm"
                        >
                          <div>{e?.log}</div>
                          <div>{formattedDateTime}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div>No Logs Found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
      <Modal isOpen={modalIsOpen} title={'Fuel Receipt'}>
        <img
          src={data?.data?.fuelReceipt}
          alt="Fuel Receipt"
          className="mb-5"
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </Modal>
    </>
  );
};

export default FuelView;
