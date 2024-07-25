import { React, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useGetOneEmergencyRequestQuery } from '../../services/emergencySlice';
import { useParams } from 'react-router-dom';

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

const EmergencyMntView = () => {
  const { id } = useParams();
  const { data: EmergencyData, isLoading } = useGetOneEmergencyRequestQuery(id);

  const [modalContent, setModalContent] = useState(null);

  if (isLoading) return <div>Loading...</div>;

  const handleImageClick = (content) => {
    setModalContent(content);
  };

  const vendorInfo =
    EmergencyData?.data?.vendorType === 'Indoor'
      ? EmergencyData?.data?.indoorVendorName
      : EmergencyData?.data?.vendorType === 'Outdoor'
        ? `${EmergencyData?.data?.outdoorVendorName} - ${EmergencyData?.data?.outdoorVendorReason}`
        : '';

  console.log('Emergency Data', EmergencyData);

  return (
    <DefaultLayout>
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
                  {EmergencyData?.data?.id}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Registration No.:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.registrationNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Make:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.make}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Driver Name:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.driverName}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">ID:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.gbmsNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Station:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.station}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Current Odometer:</p>
                <p className="text-md font-semibold">ID:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.gbmsNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Station:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.station}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Current Odometer:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.meterReading}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">CE:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.ce}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">RM / OM / Name:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.rm_omorName}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Supervisor:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.emergencySupervisor}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Emergency Job:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.emergencyJob}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Description:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.description}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Vendor Type:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.vendorType}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Vendor Name:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.indoorVendorName}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">aplCardNo:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.aplCardNo}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Emergency Repair Cost:</p>
                <p className="text-md mb-5 font-normal">
                  {EmergencyData?.data?.repairCost}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Created At:</p>
                <p className="text-md mb-5 font-normal">
                  {formatDateTime(EmergencyData?.data?.created_at)}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Updated At:</p>
                <p className="text-md mb-5 font-normal">
                  {formatDateTime(EmergencyData?.data?.updated_at)}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Receipt Image:</p>
                <img
                  className="w-48 h-48 object-contain"
                  src={EmergencyData?.data?.emergencyReceiptImg}
                  alt="Receipt"
                />
              </div>
              <div>
                <p className="text-md font-semibold">Repair Request Image:</p>
                <img
                  className="w-48 h-48 object-contain"
                  src={EmergencyData?.data?.emergencyRepairRequestImg}
                  alt="Repair Request"
                />
              </div>
              <div>
                <p className="text-md font-semibold">
                  Repair Completion Image:
                </p>
                <img
                  className="w-48 h-48 object-contain"
                  src={EmergencyData?.data?.emergencyRepairCompletionImg}
                  alt="Repair Completion"
                />
              </div>
              <div>
                <p className="text-md font-semibold">Repair Video:</p>
                <video className="w-full h-auto" controls>
                  <source
                    src={EmergencyData?.data?.emergencyRepairVideo}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
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

export default EmergencyMntView;
