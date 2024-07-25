import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Modal from '../../components/Modal';
import { useGetFuelRequestQuery } from '../../services/fuelSlice';
import { useParams } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';

const FuelIssue = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetFuelRequestQuery(id);
  const [isActive, setIsActive] = useState(true); // Default value for is_active
  const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };

  const handleRegistrationModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleReceiptClick = () => {
    setShowReceipt(!showReceipt);
  };

  return (
    <>
      <DefaultLayout>
        <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-end p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold">Fuel Issue Form</h2>
          </div>

          <div className="flex p-5 bg-brand-primary">
            <div className="flex flex-col gap-1 w-4/5">
              <div className="grid grid-cols-5 gap-1">
                <div>
                  <p className="text-md font-semibold">Registration No.:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.data?.registrationNo}
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
                  <p className="text-md font-semibold ml-20 w-60 ">
                    Current Odometer Reading:{' '}
                  </p>
                  <p className="text-md mb-5 font-normal ml-20 w-60">
                    {data?.data?.currentOddometerReading}
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
                  <p className="text-md font-semibold ml-20 w-60 ">
                    Card Number:{' '}
                  </p>
                  <p className="text-md mb-5 font-normal ml-20 w-60 ">
                    {data?.data?.cardNo}
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
                  <p className="text-md font-semibold ml-20 w-60">Receipt:</p>
                  <button
                    onClick={handleReceiptClick}
                    className="hover:text-blue-500 ml-21 w-60 text-lg"
                  >
                    <IoEyeOutline />
                  </button>
                  {showReceipt && (
                    <div>
                      <img
                        className="w-48 h-48 object-contain ml-20 border"
                        src={data?.data?.fuelReceipt}
                        alt="Receipt"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" w-203 ml-6 mb-5">
            <p className="text-lg font-semibold w-60 mb-1 text-red-400 ml-2">
              Issue:
            </p>
            <div className="flex">
              <textarea
                className="textarea textarea-bordered h-30 w-full focus:outline-none"
                placeholder="Enter fuel issue..."
              ></textarea>
              <button
                type="submit"
                className="btn transition-all duration-100 bg-red-600 hover:bg-red-700 min-w-7 w-20 text-white ml-2 self-end"
                // onClick={handleDelete}
              >
                Submit
              </button>
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

export default FuelIssue;
