import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useGetOneEmergencyRequestQuery } from '../../services/emergencySlice';
import { useLocation, useParams } from 'react-router-dom';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import { useGetChecklistDataQuery } from '../../services/dailySlice';

// Utility function to format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'; // Handle null or undefined dates
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = date
    .toISOString()
    .split('T')[1]
    .split('.')[0]
    .slice(0, -3);
  return `Date: ${formattedDate}, Time: ${formattedTime}`;
};

// Utility function to get background color based on service type
const getBackgroundColor = (serviceType) => {
  switch (serviceType) {
    case 'Repair':
      return '#f0f8ff'; // Light blue
    case 'Maintenance':
      return '#f5fffa'; // Mint cream
    case 'Inspection':
      return '#fffacd'; // Lemon chiffon
    default:
      return '#f0f4f7'; // Default light gray
  }
};

const DailyMaintenanceProcessView = () => {
  const { id } = useParams();
  //   const { data: EmergencyData, isLoading } = useGetOneEmergencyRequestQuery(id);
  console.log('first', id);
  const location = useLocation();
  const { registrationNo } = location.state || {};
  const {
    data: dailyData,
    isLoading,
    error,
  } = useGetChecklistDataQuery({
    registrationNo,
  });

  const [modalContent, setModalContent] = useState(null);

  if (isLoading) return <div>Loading...</div>;

  const handleImageClick = (content) => {
    setModalContent(content);
  };
  console.log('DailyData', dailyData);

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Emergency Maintenance View"
        pageNameprev="Emergency Maintenance" //show the name on top heading
        pagePrevPath="Emergency-Maintenance" // add the previous path to the navigation
      />
      <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <div className="flex justify-between items-end p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            Emergency Maintenance Information
          </h2>
        </div>

        <div className="flex p-5 bg-brand-primary">
          <div className="flex flex-col gap-1 w-4/5">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-md font-semibold">ID:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.id}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Registration No.:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.registrationNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Make:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.make}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Driver Name:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.driverName}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">GBMS:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.gbmsNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Station:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.station}
                </p>
              </div>

              <div>
                <p className="text-md font-semibold">Current Odometer:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.meterReading}
                </p>
              </div>

              <div>
                <p className="text-md font-semibold">Supervisor:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.emergencySupervisor}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">APL Card No.:</p>
                <p className="text-md mb-5 font-normal">
                  {dailyData?.data?.aplCardNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Created At:</p>
                <p className="text-md mb-5 font-normal">
                  {formatDateTime(dailyData?.data?.created_at)}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Updated At:</p>
                <p className="text-md mb-5 font-normal">
                  {formatDateTime(dailyData?.data?.updated_at)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-lg font-bold">Services:</h3>
              {dailyData?.data?.dailyServices.length > 0 ? (
                dailyData?.data?.dailyServices.map((service, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 rounded-lg"
                    style={{
                      backgroundColor: getBackgroundColor(service.serviceType),
                    }}
                  >
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div>
                        <p className="text-md font-semibold">Service Type:</p>
                        <p className="text-md font-normal">
                          {service.serviceType}
                        </p>
                      </div>
                      <div>
                        <p className="text-md font-semibold">Repair Amount:</p>
                        <p className="text-md font-normal">
                          {service.repairCost}
                        </p>
                      </div>
                      <div>
                        <p className="text-md font-semibold">Description:</p>
                        <p className="text-md font-normal">
                          {service.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-md font-semibold">Vendor Type:</p>
                        <p className="text-md font-normal">
                          {service.vendorType}
                        </p>
                      </div>
                      {service.vendorType === 'Indoor' && (
                        <div>
                          <p className="text-md font-semibold">
                            Indoor Vendor Name:
                          </p>
                          <p className="text-md font-normal">
                            {service.indoorVendorName}
                          </p>
                        </div>
                      )}
                      {service.vendorType === 'Outdoor' && (
                        <>
                          <div>
                            <p className="text-md font-semibold">
                              Outdoor Vendor Name:
                            </p>
                            <p className="text-md font-normal">
                              {service.outdoorVendorName}
                            </p>
                          </div>
                          <div>
                            <p className="text-md font-semibold">
                              Reason for Selecting Outdoor Vendor:
                            </p>
                            <p className="text-md font-normal">
                              {service.outdoorVendorReason}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-md font-normal">No services found.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-md font-semibold">Repair Request Images:</p>
                {dailyData?.data?.dailyRepairRequestImgs.length > 0 &&
                  dailyData?.data?.dailyRepairRequestImgs.map((item, index) => (
                    <img
                      key={index}
                      className="w-48 h-48 object-contain mb-4"
                      src={item}
                      alt="Repair Request"
                    />
                  ))}
              </div>

              <div>
                <p className="text-md font-semibold">
                  Driver Statement Videos:
                </p>
                {dailyData?.data?.dailyRepairStatementVideos.length > 0 &&
                  dailyData?.data?.dailyRepairStatementVideos.map(
                    (item, index) => (
                      <img
                        key={index}
                        className="w-48 h-48 object-contain mb-4"
                        src={item}
                        alt="Driver Statement Video"
                      />
                    ),
                  )}
              </div>

              <div>
                <p className="text-md font-semibold">Repair Receipt Images:</p>
                {dailyData?.data?.dailyReceiptImgs.length > 0 &&
                  dailyData?.data?.dailyReceiptImgs.map((item, index) => (
                    <img
                      key={index}
                      className="w-48 h-48 object-contain mb-4"
                      src={item}
                      alt="Receipt Images"
                    />
                  ))}
              </div>

              <div>
                <p className="text-md font-semibold">
                  Repair Completion Images:
                </p>
                {dailyData?.data?.dailyRepairCompletionImgs.length > 0 &&
                  dailyData?.data?.dailyRepairCompletionImgs.map(
                    (item, index) => (
                      <img
                        key={index}
                        className="w-48 h-48 object-contain mb-4"
                        src={item}
                        alt="Completion Images"
                      />
                    ),
                  )}
              </div>
            </div>
          </div>
        </div>
        {modalContent && (
          <Modal content={modalContent} onClose={() => setModalContent(null)} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default DailyMaintenanceProcessView;
