import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DeleteModal from '../../components/DeleteModal';
import {
  useGetEmergencyrequestQuery,
  useDeleteEmergencyRequestMutation,
} from '../../services/emergencySlice';

// Utility function to format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split('T')[0];
  const formattedTime = date
    .toISOString()
    .split('T')[1]
    .split('.')[0]
    .slice(0, -3);
  return `Date: ${formattedDate}, Time: ${formattedTime}`;
};

const EmergencyTable = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showButton, setShowButton] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { data } = useGetEmergencyrequestQuery({
    page,
    limit,
    // searchTerm,
    // sortBy,
    // sortOrder,
    // station: user?.station,
  });
  console.log(data);

  const onDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Delete the item from the data
      const newData = packageData.filter((item) => item.id !== id);
      setPackageData(newData);
    }
  };

  const [DeleteVehicle] = useDeleteEmergencyRequestMutation();
  const [deleteId, setDeleteId] = useState(null);
  const deleteVehicle = async (id) => {
    try {
      await DeleteVehicle(id).unwrap();
      showSuccessToast('Emergency Maintaince Vehicle Deleted Successfully!');
    } catch (err) {
      console?.log(err);
      showErrorToast(`An error has occurred while deleting vehicle`);
    }
  };

  console.log(data);

  return (
    <div className="rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto scroll-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                S.No.
              </th>
              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Station
              </th>

              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Reg No
              </th>

              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Current Oddometer
              </th>

              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Item Cost
              </th>
              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Completion Status
              </th>
              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Created At
              </th>
              <th className="w-auto items-center flex-1 py-4 px-3 text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((e, key) => (
              <tr className="py-3" key={key}>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e?.id}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e?.station}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e?.registrationNo}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e?.meterReading}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e?.repairCost}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e?.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {formatDateTime(e?.created_at)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <div>
                      {/* Restrict the view for users, only available to Maintenance Admin (PROCESS FOR EMERGENCY) */}
                      {showButton && e?.status === 'pending' && (
                        <>
                          <button
                            onClick={() => navigate(`process/${e.id}`)}
                            className="hover:text-primary"
                            title="Process"
                          >
                            <HiOutlineClipboardDocumentList
                              style={{ fontSize: '20px' }}
                            />
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`view/${e.id}`)}
                      className="hover:text-primary"
                      title="View"
                    >
                      <IoEyeOutline style={{ fontSize: '20px' }} />
                    </button>

                    {/* Open modal on delete button click */}
                    <button
                      onClick={() => {
                        document.getElementById('delete_modal').showModal();
                        setDeleteId(e?.id);
                      }}
                      title="Delete"
                    >
                      <RiDeleteBinLine style={{ fontSize: '20px' }} />
                    </button>
                    <DeleteModal
                      deleteModule="Vehicle"
                      Id={e?.id}
                      handleDelete={() => deleteVehicle(deleteId)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmergencyTable;
