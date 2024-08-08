import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useLocation } from 'react-router-dom';
import { formatDateAndTime } from '../../utils/helpers';
import Modal from '../../components/EmergencyModal'; // Import Modal
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const PeriodicView = () => {
  const location = useLocation();
  const { data } = location.state;
  const [isActive, setIsActive] = useState(true); // Default value for is_active
  const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt
  const [modalContent, setModalContent] = useState(null); // State for modal content

  console.log(data);
  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };

  const handleImageClick = (content) => {
    setModalContent(content);
  };

  const vendorInfo =
    data?.vendorType === 'Indoor'
      ? data?.indoorVendorName
      : data?.vendorType === 'Outdoor'
        ? `${data?.outdoorVendorName} - ${data?.outdoorVendorReason}`
        : '';

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Periodic Maintenance Completion Form"
          pageNameprev="Periodic Maintenance" //show the name on top heading
          pagePrevPath="periodic" // add the previous path to the navigation
        />
        <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-end p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">
              Periodic Maintenance Information
            </h2>
          </div>

          <div className="flex p-5 bg-brand-primary">
            <div className="flex flex-col gap-1 w-4/5">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <p className="text-md font-semibold">Periodic Id:</p>
                  <p className="text-md mb-5 font-normal">{data?.id}</p>
                </div>
                <div>
                  <p className="text-md font-semibold">Approval Status:</p>
                  <p className="text-md mb-5 font-normal">{data?.status}</p>
                </div>
                <div>
                  <p className="text-md font-semibold">Station:</p>
                  <p className="text-md mb-5 font-normal">{data?.station}</p>
                </div>
                <div>
                  <p className="text-md font-semibold">Registration No.:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.registrationNo}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Make:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.make || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Request Created at:</p>
                  <p className="text-md mb-5 font-normal">
                    {formatDateAndTime(data?.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Periodic Category:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.periodicType?.job || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">
                    Last changed Odometer reading:
                  </p>
                  <p className="text-md mb-5 font-normal">
                    {data?.lastChangedMeterReading || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">
                    Current Odometer Reading:
                  </p>
                  <p className="text-md mb-5 font-normal">
                    {data?.meterReading}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">
                    Odometer Running Difference:
                  </p>
                  <p className="text-md mb-5 font-normal">
                    {data?.runningDifference || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">
                    Days Since Last Change:
                  </p>
                  <p className="text-md mb-5 font-normal">
                    {data?.dayRunningDifference || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Quantity:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.quantity || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Requested Amount:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.amount || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">
                    Completion Meter Reading:
                  </p>
                  <p className="text-md mb-5 font-normal">
                    {data?.completionMeterReading || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Date of Completion:</p>
                  <p className="text-md mb-5 font-normal">
                    {formatDateAndTime(data?.completionDate) || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Supervisor Name:</p>
                  <p className="text-md mb-5 font-normal">
                    {data?.completionSupervisor || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-md font-semibold">Vendor Type:</p>
                  <p className="text-md mb-5 font-normal">{data?.vendorType}</p>
                </div>
                <div>
                  <p className="text-md font-semibold">Vendor Info:</p>
                  <p className="text-md mb-5 font-normal">{vendorInfo}</p>
                </div>
                <div></div>
                {data?.completionMeterImage && (
                  <div>
                    <p className="text-md font-semibold">
                      Image of Odometer when completed:
                    </p>
                    <p className="text-md mb-5 font-normal">
                      <img
                        src={data?.completionMeterImage}
                        alt="Odometer"
                        className="w-48 h-48 object-contain cursor-pointer"
                        onClick={() =>
                          handleImageClick(data?.completionMeterImage)
                        }
                      />
                    </p>
                  </div>
                )}
                {data?.completionItemImage && (
                  <div>
                    <p className="text-md font-semibold">
                      Image of Periodic Item:
                    </p>
                    <p className="text-md mb-5 font-normal">
                      <img
                        src={data?.completionItemImage}
                        alt="Periodic Item"
                        className="w-48 h-48 object-contain cursor-pointer"
                        onClick={() =>
                          handleImageClick(data?.completionItemImage)
                        }
                      />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {modalContent && (
            <Modal
              content={modalContent}
              onClose={() => setModalContent(null)}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PeriodicView;
